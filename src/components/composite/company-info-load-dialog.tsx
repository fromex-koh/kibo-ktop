'use client'

import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react'
import {EmptyState} from '@/components/composite/empty-state'
import {LoadingState} from '@/components/composite/loading-state'
import {Pagination} from '@/components/composite/pagination'
import {CompanyNameField, DateRangeField, SearchFilterFields} from '@/components/composite/search-filter-form'
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
import {
    fetchCompanyInfoLoadResult,
    type CompanyInfoLoadFilters,
    type CompanyInfoLoadItem,
    type CompanyInfoLoadModel,
    type CompanyInfoLoadResult,
} from '@/content/service/company-info-load'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/lib/utils'

// 기업정보 불러오기 모달 — 기관 개별평가 기업·기술정보 입력 > 기업정보 카드의 [기업정보 관리] 버튼이 연다.
// Figma "신속표준모형 [KTRS-FM]_2단계_기업·기술정보 입력_기업정보_기업정보 불러오기"(40007524:123924).
//
// 구성 — 조회기간(빠른 기간 / 시작·종료일) · [기업명][초기화][검색] → "모형 | 총 N건" → 라디오 목록 → [선택].
// 목록은 한 쪽 10줄이고, 다섯 줄 높이의 상자 안에서 스크롤한다. 쪽이 둘 이상이면 아래에 페이지 이동을 둔다. 조회 결과가 없으면 목록 대신
// 빈 상태("이력이 없습니다.")를 둔다(시안 "…_내역없음" 40007524:124037).
//
// [프론트엔드 연동] 이 모달은 데이터를 갖지 않는다 — 받은 결과를 그리고, [검색]·[초기화] 때 loadResult 를
// 부를 뿐이다(페이지 이동 때도 같다). 목업과 조회 API 의 교체 지점은 content/service/company-info-load.ts 한 곳이다.
//   · model         — 어느 평가모형의 기업정보인지(키). 조회에 함께 싣고, 결과 줄의 모형 이름은 응답의 modelName 이다.
//   · initialResult — 모달을 처음 열었을 때 보여 줄 결과(쓰는 쪽이 getCompanyInfoLoadResult(model) 로 넘긴다)
//   · loadResult    — (모형, 조회 조건, 쪽 번호) → 결과. 기본값이 fetchCompanyInfoLoadResult(응답을 기다리는
//                     목업)이고, 바로 결과를 돌려주는 함수도 받는다.
// 응답이 LOADING_DELAY_MS 넘게 걸리면 목록 자리에 "불러오는 중입니다."(LoadingState)를 둔다 — 그보다 빨리 온
// 응답에는 안내가 깜빡이지 않는다. 조회 API 를 붙여도 따로 손대지 않고 이 안내가 나온다.
//
// 검색·초기화 — [검색]은 조회기간·기업명으로 거른 목록을 1쪽부터 보인다. [초기화]는 검색 결과에서 처음 목록으로
// 돌아가는 버튼이다 — 조건 칸도 처음 조건(전체 기간 · 기업명 없음)으로 되돌려 목록과 칸이 어긋나지 않게 한다.
//
// 고르기 — 시안 메모 "[선택] 버튼 선택 시, 팝업 닫히며, 해당 기업 정보로 입력됨". 줄 어디를 눌러도 라디오가
// 골라지고, 고른 뒤에야 [선택]이 활성되어 고른 줄을 넘기며 닫는다.
// 넘겨받은 줄로 기업정보 칸을 채우는 일은 쓰는 쪽(onSelect)이 맡는다.

// 시안의 조회 조건 — 전체 기간이 골라져 있고 날짜 칸에는 최근 3개월이 채워져 있다.
const DEFAULT_PRESET = 'all'
const DEFAULT_FROM = new Date(2026, 1, 25)
const DEFAULT_TO = new Date(2026, 4, 25)

const FIRST_PAGE = 1
// 로딩 안내를 띄우기까지 기다리는 시간 — 이보다 빨리 온 응답에는 안내를 보이지 않는다.
const LOADING_DELAY_MS = 300

const EMPTY_RESULT: CompanyInfoLoadResult = {modelName: '', items: [], totalCount: 0, totalPages: 0}

// 줄 아래 보조 정보 — 시안 순서.
const ITEM_DETAILS = [
    {key: 'businessNumber', label: '기업 사업자번호'},
    {key: 'inquiryAgency', label: '조회 기관'},
    {key: 'evaluatedAt', label: '평가일'},
] as const

// 폼 값 → 조회 조건. 파일 입력이 없는 폼이라 값은 모두 문자열이지만, 타입을 좁히려고 한 번 거른다.
const readFilters = (form: HTMLFormElement): CompanyInfoLoadFilters =>
    Object.fromEntries(
        [...new FormData(form).entries()].map(([key, value]) => [key, typeof value === 'string' ? value : value.name]),
    )

type CompanyInfoLoadDialogProps = {
    /** 모달을 여는 버튼. 모달 단독 화면처럼 열어만 둘 때는 생략하고 defaultOpen 을 준다. */
    children?: ReactNode
    defaultOpen?: boolean
    /** 어느 평가모형의 기업정보를 불러오는지. 결과 줄에 보이는 모형 이름은 조회 응답(modelName)이 준다. */
    model?: CompanyInfoLoadModel
    /** 처음 열었을 때 보여 줄 결과. */
    initialResult?: CompanyInfoLoadResult
    /** [검색]·[초기화]·페이지 이동 때 부르는 조회 함수. */
    loadResult?: (
        model: CompanyInfoLoadModel,
        filters: CompanyInfoLoadFilters,
        page: number,
    ) => CompanyInfoLoadResult | Promise<CompanyInfoLoadResult>
    /** [선택]으로 고른 줄. 모달은 이 값을 넘긴 뒤 닫힌다. */
    onSelect?: (item: CompanyInfoLoadItem) => void
}

const CompanyInfoLoadDialog = ({
    children,
    defaultOpen,
    model = 'ktrs-fm',
    initialResult = EMPTY_RESULT,
    loadResult = fetchCompanyInfoLoadResult,
    onSelect,
}: CompanyInfoLoadDialogProps) => {
    const isMobile = useIsMobile()
    const [result, setResult] = useState(initialResult)
    // 페이지 이동 때 다시 실을 조회 조건과 지금 쪽.
    const [filters, setFilters] = useState<CompanyInfoLoadFilters>({})
    const [page, setPage] = useState(FIRST_PAGE)
    // 고른 줄 — 아무것도 고르지 않은 채로 시작하고, 새로 조회하면 다시 비운다. 고르기 전에는 [선택]이 막힌다.
    const [selectedId, setSelectedId] = useState('')
    // [초기화] — 필드들이 각자 쥔 값을 시안의 기본 조건으로 되돌린다. 조회 카드(SearchFilterForm)는 카드 면을
    // 함께 그려 모달 안에 쓰지 않으므로, 필드를 다시 그려(key) 기본값으로 돌아가게 한다.
    const [filterKey, setFilterKey] = useState(0)
    const selectedItem = result.items.find((item) => item.id === selectedId)

    const [isLoading, setIsLoading] = useState(false)
    // 조회 번호 — 앞선 조회의 응답이 늦게 와서 나중 조회의 결과를 덮지 않게, 마지막 조회의 응답만 받는다.
    const requestIdRef = useRef(0)
    // 로딩 안내 자리 — 모바일은 본문이 짧아 [검색] 아래가 화면 밖이라, 안내가 뜨면 본문을 굴려 보이게 한다.
    const loadingRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isLoading) loadingRef.current?.scrollIntoView({block: 'nearest'})
    }, [isLoading])

    const load = async (nextFilters: CompanyInfoLoadFilters, nextPage: number) => {
        requestIdRef.current += 1
        const requestId = requestIdRef.current
        setFilters(nextFilters)
        setPage(nextPage)
        setSelectedId('')
        const loadingTimer = window.setTimeout(() => setIsLoading(true), LOADING_DELAY_MS)
        try {
            const nextResult = await loadResult(model, nextFilters, nextPage)
            if (requestId === requestIdRef.current) setResult(nextResult)
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
        void load(readFilters(event.currentTarget), FIRST_PAGE)
    }

    const handleReset = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setFilterKey((current) => current + 1)
        void load({}, FIRST_PAGE)
    }

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 시안 모달 폭 588 — 기본 모달 폭(max-w-modal) 그대로다. */}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>기업정보 불러오기</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogBodyClassName, 'gap-6')}>
                    <form
                        aria-label="기업정보 조회 필터"
                        noValidate
                        onSubmit={handleSearch}
                        onReset={handleReset}
                        className="flex flex-col gap-4"
                    >
                        {/* 시안에 "조회기간"·"기업명" 라벨이 보이지 않아 감추되 스크린리더에는 남긴다[7.4.1].
                            칸 이름(name)이 곧 조회 조건의 키다(content/service/company-info-load.ts). */}
                        <SearchFilterFields key={filterKey} className="gap-4">
                            <DateRangeField
                                name="loadPeriod"
                                defaultPreset={DEFAULT_PRESET}
                                defaultFrom={DEFAULT_FROM}
                                defaultTo={DEFAULT_TO}
                                labelHidden
                                size="lg"
                                stackedTilde="inline"
                            />
                            {/* 시안 — 기업명 칸 오른쪽에 [초기화][검색]이 한 줄로 붙는다(간격 8). 버튼은 아이콘 없이
                                글자 폭만큼만 차지한다(90 · 76) — Button md 의 최소 폭을 이 자리에서 푼다.
                                모바일 시안 — 기업명 칸이 한 줄을 다 쓰고, 두 버튼은 그 아래(16)에서 폭을 반씩 나눈다. */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-2">
                                <div className="min-w-0 flex-1">
                                    <CompanyNameField
                                        name="loadCompanyName"
                                        label="기업명"
                                        placeholder="기업명 입력"
                                        labelHidden
                                        size="lg"
                                    />
                                </div>
                                {/* 폼 안의 버튼도 id 를 둔다(HTML 검사기 "form field element should have an id or name"). */}
                                <div className="flex gap-2 max-sm:*:flex-1">
                                    <Button
                                        id="company-info-load-reset"
                                        type="reset"
                                        variant="tertiary"
                                        size="md"
                                        className="min-w-0 shrink-0"
                                    >
                                        초기화
                                    </Button>
                                    <Button
                                        id="company-info-load-submit"
                                        type="submit"
                                        size="md"
                                        className="min-w-0 shrink-0"
                                    >
                                        검색
                                    </Button>
                                </div>
                            </div>
                        </SearchFilterFields>
                    </form>

                    {isLoading ? (
                        // 응답을 기다리는 동안 — 빈 상태와 같은 자리·높이에 로딩 안내를 둔다.
                        <div ref={loadingRef}>
                            <LoadingState className="min-h-0 px-0 py-10" />
                        </div>
                    ) : result.items.length ? (
                        <div className="flex flex-col gap-4">
                            <p className="typo-body-xl-regular text-foreground flex items-center gap-4">
                                <span className="typo-body-xl-bold">{result.modelName}</span>
                                <span aria-hidden="true" className="border-subtle-3 h-3 border-l" />
                                <span>
                                    총{' '}
                                    <span className="typo-body-xl-bold text-primary-strong">{result.totalCount}</span>건
                                </span>
                            </p>
                            {/* 목록 상자 — 시안 높이 551(윗선 1 + 줄 110 × 5)만큼 보이고 넘치면 스크롤한다.
                                스크롤 막대(8)는 목록과 4 떨어져 상자 오른쪽 끝에 붙는다(pr-1). */}
                            <div className="max-h-138 overflow-y-auto">
                                <RadioGroup
                                    aria-label={`${result.modelName} 기업정보 조회 결과`}
                                    value={selectedId}
                                    onValueChange={setSelectedId}
                                    className="border-t-foreground-subtle flex flex-col gap-0 border-t pr-1"
                                >
                                    {result.items.map((item) => (
                                        // label 이라 줄 어디를 눌러도 라디오가 골라진다. 라디오 버튼 안에는 글이 없으므로
                                        // 이름은 label 의 글(기업명·보조 정보)에서 얻는다[7.4.1].
                                        <label
                                            key={item.id}
                                            htmlFor={`company-info-load-${item.id}`}
                                            className="border-subtle-3 has-[:focus-visible]:outline-ring flex cursor-pointer items-center gap-2 border-b py-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-solid"
                                        >
                                            <RadioGroupItem
                                                id={`company-info-load-${item.id}`}
                                                value={item.id}
                                                className="focus-visible:outline-none"
                                            />
                                            <span className="flex min-w-0 flex-1 flex-col gap-2">
                                                <span className="typo-body-xl-regular text-label-foreground wrap-break-word break-keep">
                                                    {item.companyName}
                                                </span>
                                                {/* 보조 정보 — 가로로 이어 두고(간격 24), 모바일 시안은 세 항목을 세로로 쌓는다(간격 8). */}
                                                <span className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                                                    {ITEM_DETAILS.map((detail) => (
                                                        <span key={detail.key} className="flex min-w-0 flex-col gap-1">
                                                            <span className="typo-body-l-regular text-foreground-subtle">
                                                                {detail.label}
                                                            </span>
                                                            <span className="typo-body-l-regular text-foreground wrap-break-word break-keep">
                                                                {item[detail.key]}
                                                            </span>
                                                        </span>
                                                    ))}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            </div>
                            {result.totalPages > 1 ? (
                                <Pagination
                                    page={page}
                                    total={result.totalPages}
                                    onPageChange={(nextPage) => void load(filters, nextPage)}
                                    siblingCount={isMobile ? 0 : 1}
                                    prevLabel={isMobile ? '' : '이전'}
                                    nextLabel={isMobile ? '' : '다음'}
                                    maxVisibleItems={isMobile ? 5 : 10}
                                    compact={isMobile}
                                    aria-label="기업정보 조회 결과 페이지 이동"
                                    className="justify-center pt-6"
                                />
                            ) : null}
                        </div>
                    ) : (
                        // 시안 "…_내역없음" — 목록 자리를 빈 상태가 대신한다.
                        <EmptyState title="이력이 없습니다." className="min-h-0 px-0 py-10" />
                    )}
                </div>
                <DialogFooter>
                    {/* 라디오로 줄을 골라야 활성된다 — 결과가 없을 때(시안 "…_내역없음")도 고를 줄이 없어 막혀 있다. */}
                    <DialogClose asChild>
                        <Button
                            type="button"
                            size="xl"
                            disabled={!selectedItem}
                            onClick={() => selectedItem && onSelect?.(selectedItem)}
                        >
                            선택
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {CompanyInfoLoadDialog}
export type {CompanyInfoLoadDialogProps}
