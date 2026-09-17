'use client'

import {memo, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {EmptyState} from '@/components/composite/empty-state'
import {LoadingState} from '@/components/composite/loading-state'
import {ItemDescriptionDialogContent} from '@/components/composite/item-description-dialog'
import {SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import type {ItemDescription} from '@/content/service/item-descriptions'
import {
    ALL_TECHNOLOGY_CATEGORY_THEMES,
    fetchTechnologyCategoryGroups,
    TECHNOLOGY_CATEGORY_GROUPS,
    TECHNOLOGY_CATEGORY_THEMES,
    type TechnologyCategoryGroup,
    type TechnologyCategoryQuery,
} from '@/content/service/technology-categories'
import {cn} from '@/lib/utils'

// 혁신성장영위기업 분류근거 모달 — 기업정보의 [기술분류] 옆 [조회]가 연다.
// Figma "SB-FOTA-CP6-0103_혁신성장영위기업 분류근거"(40007524:142962) · "…_내역없음"(40007524:143156) ·
// 모바일(40007524:143060).
//
// 구성 — [테마 셀렉트][검색어] · [초기화][검색] → "총 N건" →
// "테마 | 분야" 묶음별 품목 목록(고르기 동그라미 · 품목명 · [품목설명]) → [선택].
//
// 고르기 — 한 번 열 때 품목 하나만 고른다(라디오). 다른 품목을 누르면 그 품목으로 바뀌고, 검색 조건을
// 바꿔도 고른 품목은 남는다. [선택]을 누르면 그 품목의 코드·테마·분야·품목명을 onSelect 로 넘기고 창을 닫는다
// (고르기 전에는 막힘). 코드는 데이터에 따로 없어 원문 항목 번호를 임시로 쓴다.
// 기술분류 칸은 최대 4개라, 여러 개를 넣으려면 모달을 다시 열어 하나씩 채운다 — 빈 칸 찾기는 쓰는 쪽이 한다.
// 라디오 기본 동작 그대로라 고른 품목을 다시 눌러도 풀리지 않는다.
// 시안의 "꼭 알아두세요" 안내는 두지 않는다(요청으로 삭제).
//
// 검색 — [검색]·Enter 를 눌러야 테마와 검색어가 함께 걸린다. 검색어는 품목명·분야·테마(품목분류)에서 찾는다.
// [프론트엔드 연동] 조회는 content/service/technology-categories.ts 의 fetchTechnologyCategoryGroups 한 곳이다.
// 지금은 목업이 0.8초 뒤에 거른 결과를 돌려준다 — 그동안 목록 자리에 로딩 안내가 보인다.
// [초기화]는 테마를 [전체]로, 검색어를 비우고 다시 건다(고른 품목은 그대로다).

const ALL_THEMES = ALL_TECHNOLOGY_CATEGORY_THEMES
const THEME_FIELD_ID = 'technology-category-theme'
const KEYWORD_FIELD_ID = 'technology-category-keyword'

const INITIAL_QUERY: TechnologyCategoryQuery = {theme: ALL_THEMES, keyword: ''}

// 로딩 안내를 띄우기까지 기다리는 시간 — 이보다 빨리 온 응답에는 안내를 보이지 않는다(기업정보 불러오기와 같다).
const LOADING_DELAY_MS = 300

// 창이 처음 뜰 때 먼저 그리는 줄 수 — 목록 상자에 한 번에 보이는 줄(10)만큼이다.
const FIRST_PAINT_ITEM_COUNT = 10

// 앞에서부터 품목 count 개만 남긴다(묶음 순서 유지).
const takeFirstItems = (groups: readonly TechnologyCategoryGroup[], count: number): TechnologyCategoryGroup[] =>
    groups.reduce<TechnologyCategoryGroup[]>((taken, group) => {
        const remaining = count - taken.reduce((sum, item) => sum + item.items.length, 0)
        return remaining > 0 ? [...taken, {...group, items: group.items.slice(0, remaining)}] : taken
    }, [])

// 화면이 한 번 그려진 뒤 true — requestAnimationFrame 안의 setTimeout 은 그 프레임이 칠해진 다음에 돈다.
const useIsAfterFirstPaint = () => {
    const [isAfterFirstPaint, setIsAfterFirstPaint] = useState(false)

    useEffect(() => {
        let timeoutId = 0
        const frameId = requestAnimationFrame(() => {
            timeoutId = window.setTimeout(() => setIsAfterFirstPaint(true))
        })

        return () => {
            cancelAnimationFrame(frameId)
            window.clearTimeout(timeoutId)
        }
    }, [])

    return isAfterFirstPaint
}

type TechnologyCategoryDescription = {item: ItemDescription; theme: string; field: string}

type OpenDescription = (description: TechnologyCategoryDescription, trigger: HTMLElement) => void

// 원문 번호로 품목과 그 테마·분야를 찾는다(확인용 화면이 설명 모달을 열어 둘 때).
const findDescription = (no: number | undefined): TechnologyCategoryDescription | null => {
    const group = TECHNOLOGY_CATEGORY_GROUPS.find((candidate) => candidate.items.some((item) => item.no === no))
    const item = group?.items.find((candidate) => candidate.no === no)

    return group && item ? {item, theme: group.theme, field: group.field} : null
}

// [선택]으로 넘기는 값 — 품목 하나의 네 가지 정보.
// [프론트엔드 연동] code 는 기술분류 코드가 내려오면 그 값으로 바꾼다(지금은 원문 항목 번호).
type TechnologyCategorySelection = {code: string; theme: string; field: string; name: string}

type TechnologyCategoryDialogProps = {
    children: ReactNode
    defaultOpen?: boolean
    /** [선택]을 눌렀을 때 — 고른 품목 하나의 코드·테마(1depth)·분야(2depth)·품목명(3depth). 창은 이 컴포넌트가 닫는다. */
    onSelect?: (value: TechnologyCategorySelection) => void
    /**
     * 이 번호(원문 항목 번호)를 가진 줄의 [품목설명]까지 함께 열어 둔다.
     * 모달 두 겹을 한 화면에서 보여 주는 확인용 화면에서만 쓴다 — 실제 화면에서는 넘기지 않는다.
     */
    defaultOpenItemNo?: number
}

const TechnologyCategoryDialog = ({
    children,
    defaultOpen,
    onSelect,
    defaultOpenItemNo,
}: TechnologyCategoryDialogProps) => {
    // 칸에 보이는 조건과 [검색]으로 건 조건을 나눈다 — 고르는 중에 목록이 흔들리지 않게 한다.
    const [themeInput, setThemeInput] = useState(ALL_THEMES)
    const [keywordInput, setKeywordInput] = useState('')
    // 목록 — 처음에는 전체 품목, [검색]·[초기화] 뒤에는 조회 응답(fetchTechnologyCategoryGroups)이다.
    const [groups, setGroups] = useState<readonly TechnologyCategoryGroup[]>(TECHNOLOGY_CATEGORY_GROUPS)
    const [isLoading, setIsLoading] = useState(false)
    // 조회 번호 — 앞선 조회의 응답이 늦게 와서 나중 조회의 결과를 덮지 않게, 마지막 조회의 응답만 받는다.
    const requestIdRef = useRef(0)
    // [검색]·[초기화]를 누른 횟수 — 목록을 새로 만들어(key) 로딩 안내부터 보이고 다시 채우게 한다.
    const [searchCount, setSearchCount] = useState(0)
    // 고른 품목 — 원문 번호(문자열)를 쥔다. 이름은 두 분야에 겹치는 것이 있어 열쇠가 되지 못한다.
    const [selectedNo, setSelectedNo] = useState('')
    // [품목설명] — 줄마다 모달을 두지 않고 하나만 둔 채 누른 품목을 넘겨 연다. 240줄이 각자 모달을 만들면
    // 열 때마다 그만큼 그려야 해 창이 늦게 뜬다. 확인용 화면(defaultOpenItemNo)은 그 품목으로 열어 둔다.
    const [description, setDescription] = useState<TechnologyCategoryDescription | null>(() =>
        findDescription(defaultOpenItemNo),
    )
    // 설명 모달을 닫으면 누른 [품목설명]으로 포커스를 돌려준다 — 트리거가 모달 밖에 따로 있지 않아서다.
    const descriptionTriggerRef = useRef<HTMLElement | null>(null)
    // useCallback — 목록(memo)에 넘기는 함수라, 매번 새로 만들면 검색어 한 글자마다 목록이 다시 그려진다.
    const openDescription = useCallback((next: TechnologyCategoryDescription, trigger: HTMLElement) => {
        descriptionTriggerRef.current = trigger
        setDescription(next)
    }, [])

    const totalCount = groups.reduce((count, group) => count + group.items.length, 0)
    const selectedItem = TECHNOLOGY_CATEGORY_GROUPS.flatMap((group) => group.items).find(
        (item) => String(item.no) === selectedNo,
    )

    // 조회 — 응답이 LOADING_DELAY_MS 넘게 걸리면 목록 자리에 로딩 안내를 둔다. 응답이 오면 목록을 새로
    // 만들어(key) 다시 채운다(240줄을 그리는 동안에도 로딩 안내가 이어진다).
    const load = async (nextQuery: TechnologyCategoryQuery) => {
        requestIdRef.current += 1
        const requestId = requestIdRef.current
        const loadingTimer = window.setTimeout(() => setIsLoading(true), LOADING_DELAY_MS)
        try {
            const nextGroups = await fetchTechnologyCategoryGroups(nextQuery)
            if (requestId !== requestIdRef.current) return
            setGroups(nextGroups)
            setSearchCount((count) => count + 1)
        } finally {
            window.clearTimeout(loadingTimer)
            if (requestId === requestIdRef.current) setIsLoading(false)
        }
    }

    // 이 모달은 기업정보 입력 폼 안에서도 열린다 — 포털로 그려져도 React 이벤트는 바깥 폼으로 올라가므로,
    // 검색·초기화가 입력 폼의 제출·검사를 부르지 않게 여기서 멈춘다.
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        void load({theme: themeInput, keyword: keywordInput})
    }

    const handleReset = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setThemeInput(ALL_THEMES)
        setKeywordInput('')
        void load(INITIAL_QUERY)
    }

    return (
        // 열 때마다 고른 품목을 비운다 — 앞서 [선택]으로 넣은 품목이 다시 열었을 때 골라진 채 남지 않게 한다.
        <Dialog
            defaultOpen={defaultOpen}
            onOpenChange={(isOpen) => {
                if (isOpen) setSelectedNo('')
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>혁신성장영위기업 분류근거</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogBodyClassName, 'gap-6')}>
                    {/* 검색 — 시안에 라벨이 보이지 않아 감추되 스크린리더에는 남긴다[7.4.1].
                        PC 는 셀렉트·검색어가 한 줄(각 절반)이고 버튼은 그 아래 오른쪽 끝, 모바일은 모두 세로로
                        쌓고 두 버튼이 폭을 반씩 나눈다. 간격은 모두 8 이다. */}
                    <form
                        aria-label="혁신성장영위기업 품목 검색"
                        noValidate
                        onSubmit={handleSearch}
                        onReset={handleReset}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="min-w-0 sm:flex-1">
                                <label htmlFor={THEME_FIELD_ID} className="sr-only">
                                    혁신성장영위기업품목
                                </label>
                                <SelectField value={themeInput} onValueChange={setThemeInput}>
                                    <SelectTrigger id={THEME_FIELD_ID} className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL_THEMES}>품목분류 전체</SelectItem>
                                        {TECHNOLOGY_CATEGORY_THEMES.map((theme) => (
                                            <SelectItem key={theme} value={theme}>
                                                {theme}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectField>
                            </div>
                            <div className="min-w-0 sm:flex-1">
                                <label htmlFor={KEYWORD_FIELD_ID} className="sr-only">
                                    품목명·분야·품목분류 검색어
                                </label>
                                <ClearableInput
                                    id={KEYWORD_FIELD_ID}
                                    name="technologyCategoryKeyword"
                                    value={keywordInput}
                                    onChange={(event) => setKeywordInput(event.currentTarget.value)}
                                    placeholder="품목명·분야·품목분류 검색"
                                    autoComplete="off"
                                    className="h-control-h-md"
                                />
                            </div>
                        </div>
                        {/* 버튼은 아이콘 없이 글자 폭만큼(90 · 76) — Button md 의 최소 폭을 이 자리에서 푼다.
                            폼 안의 버튼도 id 를 둔다(HTML 검사기 "form field element should have an id or name"). */}
                        <div className="flex gap-2 max-sm:*:flex-1 sm:justify-end">
                            <Button
                                id="technology-category-reset"
                                type="reset"
                                variant="tertiary"
                                size="md"
                                className="min-w-0"
                            >
                                초기화
                            </Button>
                            <Button id="technology-category-submit" type="submit" size="md" className="min-w-0">
                                검색
                            </Button>
                        </div>
                    </form>

                    {isLoading ? (
                        <TechnologyCategoryListLoading />
                    ) : groups.length ? (
                        <div className="flex flex-col gap-4">
                            {/* 건수 — 숫자만 파랗게. 검색하면 바뀐 건수를 스크린리더에도 알린다. */}
                            <p aria-live="polite" className="typo-body-xl-regular text-foreground">
                                총 <strong className="typo-body-xl-bold text-primary">{totalCount}</strong>건
                            </p>
                            {/* 목록 상자 — 시안 높이 641(윗선 1 + 줄 64 × 10)만큼 보이고 넘치면 스크롤한다.
                                스크롤 막대(8)는 목록과 4 떨어져 상자 오른쪽 끝에 붙는다(pr-1).
                                묶음 머리("테마 | 분야")는 상자 위에 붙박이로 서서, 어느 묶음을 보는지 알려 준다. */}
                            <div className="max-h-160 overflow-y-auto pr-1">
                                <TechnologyCategoryList
                                    key={searchCount}
                                    isSearchResult={searchCount > 0}
                                    groups={groups}
                                    selectedNo={selectedNo}
                                    onSelectedNoChange={setSelectedNo}
                                    onOpenDescription={openDescription}
                                />
                            </div>
                        </div>
                    ) : (
                        // 빈 결과 — 시안은 한 덩이 글이 두 줄로 접힌 모습이라 두 문장을 모두 title 로 준다.
                        <EmptyState
                            className="min-h-0 px-0 py-10"
                            title={
                                <>
                                    조회 결과가 없습니다.
                                    <br />
                                    검색 조건을 변경해 주세요.
                                </>
                            }
                        />
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            size="xl"
                            disabled={!selectedItem}
                            onClick={() => {
                                const selected = findDescription(selectedItem?.no)
                                if (!selected) return
                                onSelect?.({
                                    code: String(selected.item.no),
                                    theme: selected.theme,
                                    field: selected.field,
                                    name: selected.item.name,
                                })
                            }}
                        >
                            선택
                        </Button>
                    </DialogClose>
                </DialogFooter>
                <Dialog
                    open={description !== null}
                    onOpenChange={(isOpen) => {
                        if (isOpen) return
                        setDescription(null)
                        requestAnimationFrame(() => descriptionTriggerRef.current?.focus())
                    }}
                >
                    {/* 설명 모달의 카테고리 경로가 누른 줄의 테마·분야를 그대로 받는다. */}
                    {description ? (
                        <ItemDescriptionDialogContent
                            item={description.item}
                            theme={description.theme}
                            field={description.field}
                        />
                    ) : null}
                </Dialog>
            </DialogContent>
        </Dialog>
    )
}

type TechnologyCategoryListProps = {
    groups: readonly TechnologyCategoryGroup[]
    selectedNo: string
    onSelectedNoChange: (no: string) => void
    onOpenDescription: OpenDescription
    /** [검색]·[초기화]로 다시 그리는 목록이면 채우기 전까지 로딩 안내를 보인다. */
    isSearchResult: boolean
}

// 품목 목록(최대 240줄) — memo 로 감싼다. 줄마다 라디오와 [품목설명] 모달이 붙어 있어 한 번 그리는 값이 크다.
// 검색어·테마 칸은 모달 본체의 상태라, 감싸지 않으면 한 글자 칠 때마다 목록 전체가 다시 그려져 입력이
// 눈에 띄게 늦어진다. 목록은 [검색]으로 건 조건(groups)과 고른 품목이 바뀔 때만 다시 그린다.
// 목록을 다시 채우는 동안의 로딩 안내 — 모바일은 본문이 짧아 [검색] 아래가 화면 밖이라, 뜰 때 본문을 굴려 보이게 한다.
const TechnologyCategoryListLoading = () => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        ref.current?.scrollIntoView({block: 'nearest'})
    }, [])

    return (
        <div ref={ref}>
            <LoadingState className="min-h-0 px-0 py-10" />
        </div>
    )
}

// 목록은 나눠 그린다 — 240줄(라디오 240개)을 한 번에 그리면 그동안 창이 뜨지 않고 기다리게 된다.
// 처음에는 앞부분(FIRST_PAINT_ITEM_COUNT 줄)만 그려 창부터 띄우고, 화면이 한 번 그려진 뒤 나머지를 채운다.
// 이 컴포넌트는 창이 열릴 때 새로 생기므로(닫으면 사라짐) 열 때마다 같은 순서로 그린다.
// [검색]·[초기화] 때는 key 로 새로 만들고, 앞부분 대신 로딩 안내(LoadingState)를 먼저 보인다.
// 건수와 빈 결과 판단은 모달 본체가 실제 결과(groups)로 한다.
const TechnologyCategoryListView = ({
    groups,
    selectedNo,
    onSelectedNoChange,
    onOpenDescription,
    isSearchResult,
}: TechnologyCategoryListProps) => {
    const isListReady = useIsAfterFirstPaint()
    const visibleGroups = isListReady ? groups : takeFirstItems(groups, FIRST_PAINT_ITEM_COUNT)

    // [검색]·[초기화] — 목록을 다시 채우는 동안 빈 상태와 같은 자리에 로딩 안내를 둔다.
    if (isSearchResult && !isListReady) return <TechnologyCategoryListLoading />

    return (
        <RadioGroup
            aria-label="혁신성장영위기업 품목"
            aria-busy={!isListReady}
            value={selectedNo}
            onValueChange={onSelectedNoChange}
            className="flex flex-col gap-6"
        >
            {visibleGroups.map((group) => (
                <TechnologyCategoryGroupList
                    key={`${group.theme}-${group.field}`}
                    group={group}
                    onOpenDescription={onOpenDescription}
                />
            ))}
        </RadioGroup>
    )
}
const TechnologyCategoryList = memo(TechnologyCategoryListView)

type TechnologyCategoryGroupListProps = {
    group: TechnologyCategoryGroup
    onOpenDescription: OpenDescription
}

// 묶음 하나 — "테마 | 분야" 머리 아래 품목 줄들. 머리 → 8 → 진한 선 → 줄(64, 아래 옅은 선).
// 진한 선은 목록의 윗선이 아니라 머리의 아랫선이다 — 머리가 붙박이가 될 때 선도 함께 따라온다.
const TechnologyCategoryGroupList = ({group, onOpenDescription}: TechnologyCategoryGroupListProps) => {
    const headingId = `technology-category-${group.items[0]?.no}-heading`

    return (
        <section aria-labelledby={headingId} className="flex flex-col">
            {/* 묶음 머리 — 스크롤 상자 맨 위에 붙어 따라온다. 테마는 굵은 남색, 분야는 보통 글자다.
                z-sticky — 뒤에 오는 줄의 라디오(relative)가 DOM 순서상 머리 위로 그려지지 않게 한다[CD-002]. */}
            <h3
                id={headingId}
                className="bg-card typo-body-xl-regular text-label-foreground border-b-foreground-subtle z-sticky sticky top-0 flex items-center gap-4 border-b pb-2"
            >
                <span className="typo-body-xl-bold text-navy-600">{group.theme}</span>
                <span aria-hidden="true" className="border-subtle-3 h-3 border-l" />
                <span>{group.field}</span>
            </h3>
            <ul className="list-none">
                {group.items.map((item) => (
                    <TechnologyCategoryItemRow
                        key={item.no}
                        item={item}
                        theme={group.theme}
                        field={group.field}
                        onOpenDescription={onOpenDescription}
                    />
                ))}
            </ul>
        </section>
    )
}

type TechnologyCategoryItemRowProps = {
    item: ItemDescription
    theme: string
    field: string
    onOpenDescription: OpenDescription
}

// 품목 한 줄 — 고르기(라디오 + 품목명)와 [품목설명]. label 이라 품목명을 눌러도 라디오가 골라진다.
// [품목설명]은 label 밖에 두어 누를 때 라디오가 함께 골라지지 않게 한다.
const TechnologyCategoryItemRow = ({item, theme, field, onOpenDescription}: TechnologyCategoryItemRowProps) => {
    const radioId = `technology-category-item-${item.no}`

    return (
        <li className="border-subtle-3 flex items-center gap-3 border-b py-4">
            <label
                htmlFor={radioId}
                className="has-[:focus-visible]:outline-ring flex min-w-0 flex-1 cursor-pointer items-center gap-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid"
            >
                <RadioGroupItem id={radioId} value={String(item.no)} className="focus-visible:outline-none" />
                <span className="typo-body-xl-regular text-label-foreground min-w-0 break-keep">{item.name}</span>
            </label>
            {/* 설명은 고르는 것과 다른 일이라 겹쳐 여는 별도 모달이다. 모달 하나를 모두가 나눠 쓰고, 그 줄의 품목만 넘긴다. */}
            <Button
                type="button"
                variant="tertiary"
                size="xs"
                className="shrink-0"
                aria-haspopup="dialog"
                aria-label={`${item.name} 품목설명`}
                onClick={(event) => onOpenDescription({item, theme, field}, event.currentTarget)}
            >
                품목설명
            </Button>
        </li>
    )
}

export {TechnologyCategoryDialog}
export type {TechnologyCategoryDialogProps, TechnologyCategorySelection}
