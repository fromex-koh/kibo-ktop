'use client'

import {useState, type FormEvent, type ReactNode} from 'react'
import {RotateCcw, Search} from 'lucide-react'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {
    CompanyNameField,
    DateRangeField,
    SearchFilterActions,
    SearchFilterFields,
} from '@/components/composite/search-filter-form'
import {Button} from '@/components/ui/button'
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {
    getCompanyInfoLoadResult,
    type CompanyInfoLoadFilters,
    type CompanyInfoLoadItem,
    type CompanyInfoLoadModel,
    type CompanyInfoLoadResult,
} from '@/content/service/company-info-load'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/lib/utils'

// 기업정보 불러오기 모달 — 기관 개별평가 기업·기술정보 입력 > 기업정보 카드의 [기업정보 관리] 버튼이 연다.
// Figma "…_기업정보_기업정보 불러오기"(40007505:96135) · "…_내역없음"(40007505:96246).
//
// 구성 — 조회기간(빠른 기간 + 시작·종료일) · 기업명 · [초기화][조회] → "모형 | 총 N건" → 표 → 페이지 이동.
// 조회 결과가 없으면 표와 페이지 이동 대신 빈 상태("이력이 없습니다.")를 둔다.
//
// [프론트엔드 연동] 이 모달은 데이터를 갖지 않는다 — 받은 결과를 그리고, [조회]·페이지 이동 때 loadResult 를
// 부를 뿐이다. 목업과 조회 API 의 교체 지점은 content/service/company-info-load.ts 한 곳이다.
//   · model         — 어느 평가모형의 기업정보인지(키). 조회에 함께 싣고, 결과 줄의 모형 이름은 응답의 modelName 이다.
//   · initialResult — 모달을 처음 열었을 때 보여 줄 결과(쓰는 쪽이 getCompanyInfoLoadResult(model) 로 넘긴다)
//   · loadResult    — (모형, 조회 조건, 쪽 번호) → 결과. 기본값이 getCompanyInfoLoadResult 이고 Promise 도 받는다.
//
// 고르기 — 시안 메모 "[선택] 버튼 선택 시, 팝업 닫히며, 해당 기업 정보로 입력됨". 줄 어디를 눌러도 고른다.
// 넘겨받은 줄로 기업정보 칸을 채우는 일은 쓰는 쪽(onSelect)이 맡는다.

// 시안의 조회 조건 — 전체 기간이 골라져 있고 날짜 칸에는 최근 3개월이 채워져 있다.
const DEFAULT_PRESET = 'all'
const DEFAULT_FROM = new Date(2026, 1, 25)
const DEFAULT_TO = new Date(2026, 4, 25)
const FIRST_PAGE = 1

const EMPTY_RESULT: CompanyInfoLoadResult = {modelName: '', items: [], totalCount: 0, totalPages: 0}

// 표 머리·칸 — 이용내역 모달(PaidServiceUsageHistoryDialog)과 같은 모양이다(시안 공통 표).
const headCellClassName =
    'bg-primary-subtle border-subtle-3 border-t-foreground-subtle typo-body-l-bold text-foreground border-0 border-y px-4 py-3 text-center'
// 줄에 올리면 네 칸 글자에 모두 밑줄이 선다 — 줄 전체가 고르는 자리임을 보여 준다.
const cellClassName =
    'border-subtle-3 typo-body-l-regular text-foreground border-0 border-b px-4 py-3 text-center group-hover:underline'

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
    /** [조회]·페이지 이동 때 부르는 조회 함수. */
    loadResult?: (
        model: CompanyInfoLoadModel,
        filters: CompanyInfoLoadFilters,
        page: number,
    ) => CompanyInfoLoadResult | Promise<CompanyInfoLoadResult>
    /** 고른 줄. 모달은 이 값을 넘긴 뒤 닫힌다. */
    onSelect?: (item: CompanyInfoLoadItem) => void
}

const CompanyInfoLoadDialog = ({
    children,
    defaultOpen,
    model = 'ktrs-fm',
    initialResult = EMPTY_RESULT,
    loadResult = getCompanyInfoLoadResult,
    onSelect,
}: CompanyInfoLoadDialogProps) => {
    const isMobile = useIsMobile()
    const [result, setResult] = useState(initialResult)
    const [filters, setFilters] = useState<CompanyInfoLoadFilters>({})
    const [page, setPage] = useState(FIRST_PAGE)
    // [초기화] — 필드들이 각자 쥔 값을 시안의 기본 조건으로 되돌린다. 조회 카드(SearchFilterForm)는 카드 면을
    // 함께 그려 모달 안에 쓰지 않으므로, 필드를 다시 그려(key) 기본값으로 돌아가게 한다.
    const [filterKey, setFilterKey] = useState(0)
    const hasItems = result.items.length > 0

    const load = async (nextFilters: CompanyInfoLoadFilters, nextPage: number) => {
        setFilters(nextFilters)
        setPage(nextPage)
        setResult(await loadResult(model, nextFilters, nextPage))
    }

    // 이 모달은 기업정보 입력 폼 안에서도 열린다 — 포털로 그려져도 React 이벤트는 바깥 폼으로 올라가므로,
    // 조회·초기화가 입력 폼의 제출·검사를 부르지 않게 여기서 멈춘다.
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
            {/* 시안 모달 폭 792 — 이용내역 모달과 같은 넓은 모달이다. */}
            <DialogContent aria-describedby={undefined} style={{maxWidth: 792}}>
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
                            />
                            <CompanyNameField
                                name="loadCompanyName"
                                label="기업명"
                                placeholder="기업명 입력"
                                labelHidden
                                size="lg"
                            />
                        </SearchFilterFields>
                        {/* 폼 안의 버튼도 id 를 둔다(HTML 검사기 "form field element should have an id or name"). */}
                        <SearchFilterActions className="gap-2 max-sm:*:min-w-0 max-sm:*:flex-1">
                            <Button id="company-info-load-reset" type="reset" variant="tertiary" size="md">
                                초기화
                                <RotateCcw aria-hidden="true" />
                            </Button>
                            <Button id="company-info-load-submit" type="submit" size="md">
                                조회
                                <Search aria-hidden="true" />
                            </Button>
                        </SearchFilterActions>
                    </form>

                    {hasItems ? (
                        <div className="flex flex-col gap-10">
                            {/* 건수와 표는 한 덩어리로 붙고(16), 페이지 이동만 멀리 떨어진다(40) — 시안. */}
                            <div className="flex flex-col gap-4">
                                <p className="typo-body-xl-regular text-foreground flex items-center gap-3">
                                    <span className="typo-body-xl-bold">{result.modelName}</span>
                                    <span aria-hidden="true" className="border-subtle-3 h-3 border-l" />
                                    <span>
                                        총{' '}
                                        <span className="typo-body-xl-bold text-primary-strong">
                                            {result.totalCount}
                                        </span>
                                        건
                                    </span>
                                </p>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-160 table-fixed border-separate border-spacing-0">
                                        <caption className="sr-only">
                                            {result.modelName} 기업정보 불러오기 조회 결과 — 기업명을 누르면 그 기업
                                            정보가 입력됩니다
                                        </caption>
                                        <thead>
                                            <tr>
                                                <th scope="col" className={headCellClassName}>
                                                    기업명
                                                </th>
                                                <th scope="col" className={headCellClassName}>
                                                    기업 사업자번호
                                                </th>
                                                <th scope="col" className={headCellClassName}>
                                                    조회 기관
                                                </th>
                                                <th scope="col" className={headCellClassName}>
                                                    평가일
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.items.map((item) => (
                                                // 줄 전체가 고르는 자리다 — 손가락 모양·hover 면(업종코드 조회 모달에서 고른 줄과
                                                // 같은 색, secondary)·네 칸 밑줄로 보여 준다. 실제로 누르는 것은 기업명 버튼 하나이고,
                                                // 그 버튼의 누름 영역(after)을 줄 전체로 펼친다 — tr 에 클릭을 달면 키보드로 고를 수
                                                // 없고, 칸마다 버튼을 두면 스크린리더가 한 줄에서 같은 동작을 네 번 읽는다[6.1.1].
                                                <tr
                                                    key={item.id}
                                                    className="group hover:bg-secondary relative cursor-pointer"
                                                >
                                                    <td className={cellClassName}>
                                                        <DialogClose asChild>
                                                            <button
                                                                type="button"
                                                                className="focus-visible:outline-ring cursor-pointer break-keep group-hover:underline after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
                                                                onClick={() => onSelect?.(item)}
                                                            >
                                                                {item.companyName}
                                                            </button>
                                                        </DialogClose>
                                                    </td>
                                                    <td className={cellClassName}>{item.businessNumber}</td>
                                                    <td className={cellClassName}>{item.inquiryAgency}</td>
                                                    <td className={cellClassName}>{item.evaluatedAt}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
                                    className="justify-center"
                                />
                            ) : null}
                        </div>
                    ) : (
                        // 시안 "…_내역없음" — 표 자리를 빈 상태가 대신한다.
                        <EmptyState title="이력이 없습니다." className="min-h-0 px-0 py-10" />
                    )}
                </div>
                {/* 바닥 여백 — 머리 위 여백(모바일 24 · sm 이상 40)과 같게 둔다. 본문 스크롤 영역 밖(세 행 그리드의
                    마지막 행)이라 스크롤 도중에도 글이 이 여백 위에서 잘리고, 바닥이 가장자리에 붙지 않는다.
                    높이는 본문이 이미 가진 아래 py-1(4)을 뺀 값이다(20 + 4 = 24 · 36 + 4 = 40). */}
                <div aria-hidden="true" className="h-5 sm:h-9" />
            </DialogContent>
        </Dialog>
    )
}

export {CompanyInfoLoadDialog}
export type {CompanyInfoLoadDialogProps}
