'use client'

import {useState, useSyncExternalStore, type ComponentProps, type ReactNode} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {FormTabTitle, type FormTabStatus} from '@/components/composite/form-tab-title'
import {FormFieldSection, useSectionStatuses} from '@/components/composite/form-values'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
    formTabsContentClassName,
    formTabsListClassName,
    formTabsMobileBarClassName,
    formTabsMobileStickyClassName,
    formTabsMobileStickyHeaderClassName,
    formTabsPickerCurrentRowClassName,
    formTabsPickerPanelClassName,
    formTabsStackClassName,
    formTabsTabletBarClassName,
} from '@/components/theme/form-tabs.variants'
import {cn} from '@/lib/utils'

// 폼 탭(FormTabs) — 긴 입력 폼을 섹션 단위로 나눠 보여주는 카드형 탭(L2 composite). Figma "탭 타이틀" 반영.
// 탭 한 칸의 생김새는 FormTabTitle 이 담당하고, 선택된 탭 아래에 그 섹션의 폼(FormCard 등)이 온다.
// 탭 동작·접근성(roving tabindex · aria-controls · 좌우 화살표 이동)은 shadcn Tabs(Radix)를 그대로 쓴다[SC-03].
//
// 화면 폭에 따라 시안이 두 가지다. 보이는 위젯이 다르면 기반 primitive 도 바꾼다 — 같은 마크업에 CSS 만
// 씌우면 생김새와 역할(role·키보드)이 어긋난다[8.2.1]. 사용처 API(items)는 둘 다 같아 화면 코드는 그대로다.
//   · xl 이상   : 가로 탭(Tabs)
//   · xl 미만   : 현재 섹션 한 줄만 두고, 그 줄을 누르면 섹션 목록이 그 아래로 열린다(Popover)
//                 태블릿은 콘텐츠 열 안의 카드, 모바일은 화면 폭을 채우는 헤더 아래 고정 줄이다.

// 섹션 목록이 열리는 위치 — 시안은 현재 섹션의 제목 묶음에서 4px 아래다. Radix 는 눌린 버튼(제목 묶음)을
// 기준으로 잡는데, 모바일은 그 버튼을 감싼 흰 고정 줄(py-4 = 16) 아래로 나와야 하므로 그만큼 더 내린다.
// 태블릿은 시안대로 제목 바로 아래에서 열려 줄의 아래 여백(40) 위에 겹친다.
const FORM_TABS_PICKER_OFFSET_PX = 20
const FORM_TABS_TABLET_PICKER_OFFSET_PX = 4

export const FORM_TABS_QUERY = '(min-width: 1280px)'
export const FORM_TABS_MOBILE_QUERY = '(max-width: 767px)'

const subscribeToQueries = (onStoreChange: () => void) => {
    const queries = [window.matchMedia(FORM_TABS_QUERY), window.matchMedia(FORM_TABS_MOBILE_QUERY)]
    queries.forEach((query) => query.addEventListener('change', onStoreChange))

    return () => queries.forEach((query) => query.removeEventListener('change', onStoreChange))
}

const getLayout = () => {
    if (window.matchMedia(FORM_TABS_QUERY).matches) return 'tabs'

    return window.matchMedia(FORM_TABS_MOBILE_QUERY).matches ? 'mobile' : 'tablet'
}

// 서버 렌더는 모바일 퍼스트다[PB-14]. 하이드레이션 직후 실제 화면 폭으로 한 번 더 렌더된다.
const useFormTabsLayout = () => useSyncExternalStore(subscribeToQueries, getLayout, () => 'mobile' as const)

type FormTabItem = {
    // 탭 식별 값(TabsTrigger ↔ TabsContent 연결).
    value: string
    // 섹션 제목.
    title: ReactNode
    // 작성 상태 — 문구와 아이콘이 함께 정해진다. 넘기지 않으면 그 탭에 입력한 값에서 계산한다
    // (미작성 → 작성중 → 작성완료). 가이드의 고정 예시처럼 상태를 직접 보여줘야 할 때만 넘긴다.
    status?: FormTabStatus
    // 탭 본문. 시안에서는 FormCard 가 들어간다.
    content: ReactNode
}

type FormTabsProps = {
    items: readonly FormTabItem[]
    // 모바일 고정 줄 위에 함께 붙는 내용(시안은 단계·제목). 같은 상자 안에 들어가 통째로 고정된다.
    // 모바일에서만 그려진다 — 태블릿·PC 는 화면이 자기 제목을 따로 갖는다.
    stickyHeader?: ReactNode
    className?: string
} & Omit<ComponentProps<typeof Tabs>, 'children' | 'className'>

const FormTabs = ({items, stickyHeader, className, defaultValue, value, onValueChange, ...props}: FormTabsProps) => {
    const layout = useFormTabsLayout()
    // 값에서 계산한 섹션별 작성 상태 — items 가 status 를 직접 주면 그쪽이 우선한다.
    const sectionStatuses = useSectionStatuses()
    const getStatus = (item: FormTabItem) => item.status ?? sectionStatuses[item.value] ?? 'todo'
    // 두 형태가 같은 선택 값을 쓰도록 여기서 들고 있는다 — 화면 폭이 바뀌어도 보던 섹션이 그대로 열려 있다.
    const [selectedValue, setSelectedValue] = useState(defaultValue ?? items[0]?.value ?? '')
    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const currentValue = value ?? selectedValue

    const handleValueChange = (nextValue: string) => {
        setSelectedValue(nextValue)
        onValueChange?.(nextValue)
    }

    if (layout !== 'tabs') {
        // 모바일과 태블릿은 같은 트리를 쓴다 — [현재 섹션 줄] + [그 섹션의 폼 카드]이고, 줄을 감싸는
        // 상자만 다르다(태블릿은 콘텐츠 열 안의 카드, 모바일은 화면 폭을 채우는 고정 줄).
        // 트리가 같아야 md(768)를 넘나들어도(휴대폰 회전) 입력한 값이 그대로 남는다 — 다시 그려지면
        // 값이 초기화되기 때문이다.
        const isMobile = layout === 'mobile'
        const currentItem = items.find((item) => item.value === currentValue) ?? items[0]

        return (
            <div className={cn(formTabsStackClassName, className)}>
                {/* 현재 섹션 한 줄만 보여주고, 다른 섹션은 그 줄 아래로 열리는 목록에서 고른다 —
                    좁은 화면에 탭 여러 칸이 들어가지 않는다. 화면을 덮는 모달이 아니라 눌린 줄에 붙는
                    드롭다운이라, 지금 어디를 눌러 열었는지가 화면에 그대로 남는다.
                    열고 닫기·Esc·바깥 클릭·포커스 복귀는 Popover(Radix)가 맡는다[8.2.1]. */}
                <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                    {/* 모바일만 헤더 아래에 고정된다 — 자동저장 토스트가 이 표식으로 그 아래 자리를 잡는다.
                        태블릿은 콘텐츠 열 안의 카드라 본문과 함께 흐른다(시안 동일). */}
                    <div
                        data-slot={isMobile ? 'form-tabs-sticky-bar' : undefined}
                        className={isMobile ? formTabsMobileStickyClassName : undefined}
                    >
                        {isMobile && stickyHeader ? (
                            <div className={formTabsMobileStickyHeaderClassName}>{stickyHeader}</div>
                        ) : null}
                        <div className={isMobile ? formTabsMobileBarClassName : formTabsTabletBarClassName}>
                            <PopoverTrigger asChild>
                                <FormTabTitle
                                    active
                                    chevron
                                    variant="bar"
                                    title={currentItem?.title}
                                    status={currentItem ? getStatus(currentItem) : undefined}
                                />
                            </PopoverTrigger>
                        </div>
                    </div>
                    <PopoverContent
                        align="start"
                        sideOffset={isMobile ? FORM_TABS_PICKER_OFFSET_PX : FORM_TABS_TABLET_PICKER_OFFSET_PX}
                        aria-label="입력 항목"
                        className={formTabsPickerPanelClassName}
                    >
                        {items.map((item) => (
                            <FormTabTitle
                                key={item.value}
                                variant="row"
                                title={item.title}
                                status={getStatus(item)}
                                className={item.value === currentValue ? formTabsPickerCurrentRowClassName : undefined}
                                aria-current={item.value === currentValue ? 'true' : undefined}
                                onClick={() => {
                                    handleValueChange(item.value)
                                    setIsPickerOpen(false)
                                }}
                            />
                        ))}
                    </PopoverContent>
                </Popover>
                {items.map((item) => (
                    // 고르지 않은 섹션도 마운트한 채로 감춘다 — 다시 골랐을 때 입력한 값이 남아야 한다.
                    // -mt-5(20)는 시안의 겹침이다 — 태블릿은 폼 카드가 위 줄의 아래쪽을 덮어 한 덩어리로
                    // 읽힌다. 모바일 줄은 고정된 띠라 겹칠 자리가 없다(대신 줄이 아래 여백을 갖는다).
                    <div
                        key={item.value}
                        hidden={item.value !== currentValue}
                        className={isMobile ? undefined : '-mt-5'}
                    >
                        {/* 이 안의 입력이 어느 섹션 소속인지 알려 준다 — 탭 상태 계산의 근거다. */}
                        <FormFieldSection name={item.value}>{item.content}</FormFieldSection>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <Tabs value={currentValue} onValueChange={handleValueChange} className={cn('gap-0', className)} {...props}>
            <TabsList variant="plain" className={formTabsListClassName}>
                {items.map((item) => (
                    // 생김새는 FormTabTitle, 탭 동작은 TabsTrigger(버튼)가 맡는다. asChild 로 둘을 한 요소에
                    // 합치면 선택 상태(data-state)도 그 요소에 함께 붙어 액센트 바·굵기가 그대로 따라온다.
                    <FormTabTitle key={item.value} asChild title={item.title} status={getStatus(item)}>
                        <TabsTrigger value={item.value} />
                    </FormTabTitle>
                ))}
            </TabsList>
            {items.map((item) => (
                // forceMount — 선택하지 않은 탭도 마운트한 채로 두어야 탭을 옮겼다 돌아와도 입력한 값이 남는다.
                // Radix 는 forceMount 면 hidden 을 붙이지 않으므로 선택 상태를 보고 직접 감춘다.
                <TabsContent
                    key={item.value}
                    forceMount
                    value={item.value}
                    className={cn(formTabsContentClassName, 'data-[state=inactive]:hidden')}
                >
                    <FormFieldSection name={item.value}>{item.content}</FormFieldSection>
                </TabsContent>
            ))}
        </Tabs>
    )
}

export {FormTabs}
export type {FormTabsProps, FormTabItem, FormTabStatus}
