'use client'

import {useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'
import {FormTabTitle, type FormTabStatus} from '@/components/composite/form-tab-title'
import {FormSectionCollapseProvider} from '@/components/composite/form-section-collapse'
import {FormFieldSection, useSectionStatuses} from '@/components/composite/form-values'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
    formTabsAccordionClassName,
    formTabsContentClassName,
    formTabsListClassName,
    formTabsMobileBarClassName,
    formTabsPickerPanelClassName,
    formTabsPickerRowClassName,
} from '@/components/theme/form-tabs.variants'
import {cn} from '@/lib/utils'

// 폼 탭(FormTabs) — 긴 입력 폼을 섹션 단위로 나눠 보여주는 카드형 탭(L2 composite). Figma "탭 타이틀" 반영.
// 탭 한 칸의 생김새는 FormTabTitle 이 담당하고, 선택된 탭 아래에 그 섹션의 폼(FormCard 등)이 온다.
// 탭 동작·접근성(roving tabindex · aria-controls · 좌우 화살표 이동)은 shadcn Tabs(Radix)를 그대로 쓴다[SC-03].
//
// 화면 폭에 따라 시안이 세 가지다. 보이는 위젯이 다르면 기반 primitive 도 바꾼다 — 같은 마크업에 CSS 만
// 씌우면 생김새와 역할(role·키보드)이 어긋난다[8.2.1]. 사용처 API(items)는 셋 모두 같아 화면 코드는 그대로다.
//   · xl 이상   : 가로 탭(Tabs)
//   · md~xl     : 세로 펼침 목록(Collapsible) — 펼친 섹션은 탭 행이 사라지고 폼 카드만 남는다
//   · md 미만   : 현재 섹션 한 줄만 헤더 아래 고정(sticky)하고, 그 줄을 누르면 섹션 목록이 그 아래로 열린다(Popover)

// 레이아웃이 갈리는 지점 — tokens.json 의 breakpoint 와 한 세트다(어긋나면 yarn tokens 가 빌드를 세운다).
// 섹션 목록이 열리는 위치 — Radix 는 눌린 버튼을 기준으로 잡는데, 시안은 버튼이 아니라 그 버튼을 감싼
// 흰 고정 줄 아래로 4px 떨어져 열린다. 줄의 아래 여백(py-4 = 16)만큼을 더 지나야 그 자리가 된다.
const FORM_TABS_PICKER_OFFSET_PX = 20

export const FORM_TABS_QUERY = '(min-width: 1280px)'
export const FORM_TABS_MOBILE_QUERY = '(max-width: 767px)'

const subscribeToQueries = (onStoreChange: () => void) => {
    const queries = [window.matchMedia(FORM_TABS_QUERY), window.matchMedia(FORM_TABS_MOBILE_QUERY)]
    queries.forEach((query) => query.addEventListener('change', onStoreChange))

    return () => queries.forEach((query) => query.removeEventListener('change', onStoreChange))
}

const getLayout = () => {
    if (window.matchMedia(FORM_TABS_QUERY).matches) return 'tabs'

    return window.matchMedia(FORM_TABS_MOBILE_QUERY).matches ? 'mobile' : 'accordion'
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
    className?: string
} & Omit<ComponentProps<typeof Tabs>, 'children' | 'className'>

const FormTabs = ({items, className, defaultValue, value, onValueChange, ...props}: FormTabsProps) => {
    const layout = useFormTabsLayout()
    // 값에서 계산한 섹션별 작성 상태 — items 가 status 를 직접 주면 그쪽이 우선한다.
    const sectionStatuses = useSectionStatuses()
    const getStatus = (item: FormTabItem) => item.status ?? sectionStatuses[item.value] ?? 'todo'
    // 세 형태가 같은 선택 값을 쓰도록 여기서 들고 있는다 — 화면 폭이 바뀌어도 보던 섹션이 그대로 열려 있다.
    const [selectedValue, setSelectedValue] = useState(defaultValue ?? items[0]?.value ?? '')
    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const currentValue = value ?? selectedValue

    const handleValueChange = (nextValue: string) => {
        setSelectedValue(nextValue)
        onValueChange?.(nextValue)
    }

    // 펼침 목록은 누른 컨트롤이 곧바로 사라진다(행 ↔ 카드 접기 버튼) — 그 자리를 대신하는 쪽으로
    // 포커스를 넘겨주지 않으면 키보드 사용자는 포커스를 잃는다[6.1.2].
    const rowRefs = useRef(new Map<string, HTMLButtonElement | null>())
    // 포커스를 넘겨받을 섹션 — 펼치면 카드 헤더의 접기 버튼(사용처가 그리므로 값으로 알린다),
    // 접으면 다시 나타난 탭 행이다. 어느 쪽이든 화면에 그려진 다음(커밋 후)에 포커스를 옮긴다.
    const pendingCardFocus = useRef<string | null>(null)
    const pendingRowFocus = useRef<string | null>(null)

    useEffect(() => {
        const value = pendingRowFocus.current
        if (!value) return

        pendingRowFocus.current = null
        rowRefs.current.get(value)?.focus()
    })

    const handleOpenChange = (item: FormTabItem, isOpen: boolean) => {
        handleValueChange(isOpen ? item.value : '')

        if (isOpen) pendingCardFocus.current = item.value
        else pendingRowFocus.current = item.value
    }

    // 한 번만 참을 돌려주는 일회성 확인 — 펼친 섹션이 처음부터 열려 있던 경우에는 포커스를 빼앗지 않는다.
    const consumeCardFocus = (value: string) => {
        if (pendingCardFocus.current !== value) return false
        pendingCardFocus.current = null

        return true
    }

    if (layout !== 'tabs') {
        // 모바일과 태블릿은 같은 트리를 쓴다 — 세로로 쌓인 [행 + 섹션] 목록이고, 모바일은 현재 행만 고정
        // 헤더로 올리고 나머지 행을 감춘다. 트리가 같아야 md(768)를 넘나들어도(휴대폰 회전) 입력한 값이
        // 그대로 남는다. 다시 그려지면 값이 초기화되기 때문이다.
        const isMobile = layout === 'mobile'
        const currentItem = items.find((item) => item.value === currentValue) ?? items[0]

        return (
            <div className={cn(formTabsAccordionClassName, isMobile && 'gap-0', className)}>
                {isMobile ? (
                    // 현재 섹션 한 줄만 보여주고, 다른 섹션은 그 줄 아래로 열리는 목록에서 고른다 —
                    // 좁은 화면에 탭 여러 칸이 들어가지 않는다. 화면을 덮는 모달이 아니라 눌린 줄에 붙는
                    // 드롭다운이라, 지금 어디를 눌러 열었는지가 화면에 그대로 남는다.
                    // 열고 닫기·Esc·바깥 클릭·포커스 복귀는 Popover(Radix)가 맡는다[8.2.1].
                    <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                        <div className={formTabsMobileBarClassName}>
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
                        <PopoverContent
                            align="start"
                            sideOffset={FORM_TABS_PICKER_OFFSET_PX}
                            aria-label="입력 항목"
                            className={formTabsPickerPanelClassName}
                        >
                            {items.map((item) => (
                                <FormTabTitle
                                    key={item.value}
                                    variant="row"
                                    className={formTabsPickerRowClassName}
                                    title={item.title}
                                    status={getStatus(item)}
                                    active={item.value === currentValue}
                                    aria-current={item.value === currentValue ? 'true' : undefined}
                                    onClick={() => {
                                        handleValueChange(item.value)
                                        setIsPickerOpen(false)
                                    }}
                                />
                            ))}
                        </PopoverContent>
                    </Popover>
                ) : null}
                {items.map((item) => (
                    <Collapsible
                        key={item.value}
                        open={currentValue === item.value}
                        onOpenChange={(isOpen) => handleOpenChange(item, isOpen)}
                    >
                        {/* 펼치면 이 행은 사라지고 폼 카드만 남는다 — 다시 접는 버튼은 카드 헤더에 있다.
                            모바일은 고정 헤더가 그 자리를 대신하므로 행을 만들지 않는다. */}
                        {isMobile ? null : (
                            <CollapsibleTrigger asChild>
                                <FormTabTitle
                                    chevron
                                    variant="row"
                                    ref={(node) => {
                                        rowRefs.current.set(item.value, node)
                                    }}
                                    title={item.title}
                                    status={getStatus(item)}
                                    // 가로 탭의 '선택' 강조는 세로 목록에서 자리를 잃는다(열린 행은 사라진다).
                                    // 시안이 작성중 섹션을 강조해 두었으므로 그 상태를 강조로 옮긴다.
                                    active={getStatus(item) === 'writing'}
                                    className="data-[state=open]:hidden"
                                />
                            </CollapsibleTrigger>
                        )}
                        {/* forceMount — 접힌 섹션도 마운트한 채로 두어야 다시 열었을 때 입력한 값이 남는다.
                            Radix 는 forceMount 면 hidden 을 붙이지 않으므로 접힘 상태를 보고 직접 감춘다. */}
                        <CollapsibleContent forceMount className="data-[state=closed]:hidden">
                            <FormSectionCollapseProvider
                                collapsible={!isMobile}
                                consumeFocus={() => consumeCardFocus(item.value)}
                            >
                                {/* 이 안의 입력이 어느 섹션 소속인지 알려 준다 — 탭 상태 계산의 근거다. */}
                                <FormFieldSection name={item.value}>{item.content}</FormFieldSection>
                            </FormSectionCollapseProvider>
                        </CollapsibleContent>
                    </Collapsible>
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
