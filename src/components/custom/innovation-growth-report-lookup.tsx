'use client'

import {useRef, useState, type ReactNode, type RefObject, type SubmitEvent} from 'react'
import {ArrowRight, ChevronRight, CircleAlert, Search} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {InputGroupButton} from '@/components/ui/input-group'
import {ClearableInput} from '@/components/composite/clearable-input'
import {EmptyState} from '@/components/composite/empty-state'
import {TruncatedText} from '@/components/composite/truncated-text'
import {Pagination} from '@/components/composite/pagination'
import {KbigxLegalBasisDialog} from '@/components/composite/k-bigx-legal-basis-dialog'
import {KbigxReportCreateDialog} from '@/components/composite/k-bigx-report-create-dialog'
import {LoadingState} from '@/components/composite/loading-state'
import {SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {SelectSearchForm, type SelectSearchSubmit} from '@/components/composite/select-search-form'
import {SelectableListCard, SelectableListCardGroup} from '@/components/composite/selectable-list-card'
import {SelectedItemSummary} from '@/components/composite/selected-item-summary'
import {StickyActionBar} from '@/components/composite/sticky-action-bar'
import {ListMarker} from '@/components/custom/list-marker'
import {
    passwordInputGroupClassName,
    passwordInputIconClassName,
    passwordInputToggleClassName,
} from '@/components/theme/password-input.variants'
import type {UserType} from '@/constants/header-navigation'
import {useIsMobile} from '@/hooks/use-mobile'
import {maskPersonName} from '@/lib/mask'
import {cn} from '@/lib/utils'
import {
    COMPANY_FIELD_LABELS,
    compareInnovationGrowthPatents,
    getInnovationGrowthCompanyNumber,
    getInnovationGrowthCompanyPage,
    getInnovationGrowthInvalidError,
    getInnovationGrowthPatentPage,
    getInnovationGrowthPatents,
    getInnovationGrowthReportCase,
    getInnovationGrowthReportNotice,
    INNOVATION_GROWTH_ACTION_IDLE,
    INNOVATION_GROWTH_ACTION_PATENT_IDLE,
    INNOVATION_GROWTH_CASE_COPY,
    INNOVATION_GROWTH_CHOOSE_COMPANY,
    INNOVATION_GROWTH_COMPANY_HELPER,
    INNOVATION_GROWTH_COMPANY_LIST_TITLE,
    INNOVATION_GROWTH_COMPANY_PAGE_LOADING,
    INNOVATION_GROWTH_COMPANY_SELECTED_HELPER_SUFFIX,
    INNOVATION_GROWTH_COUNT_UNIT,
    INNOVATION_GROWTH_DEFAULT_PATENT_SORT,
    INNOVATION_GROWTH_GENERATE_LABEL,
    INNOVATION_GROWTH_LEGAL_BASIS_LABEL,
    INNOVATION_GROWTH_NO_PATENT,
    INNOVATION_GROWTH_NO_PATENT_GUIDE,
    INNOVATION_GROWTH_NOT_FOUND,
    INNOVATION_GROWTH_PAGINATION,
    INNOVATION_GROWTH_PATENT_FILTER_EMPTY,
    INNOVATION_GROWTH_PATENT_FILTER_BUTTON_LABEL,
    INNOVATION_GROWTH_PATENT_FILTER_LABEL,
    INNOVATION_GROWTH_PATENT_PLACEHOLDER,
    INNOVATION_GROWTH_PATENT_RANGE_LABEL,
    INNOVATION_GROWTH_PATENT_HELPER,
    INNOVATION_GROWTH_PATENT_LIST_TITLE,
    INNOVATION_GROWTH_PATENT_LOADING,
    INNOVATION_GROWTH_PATENT_NOT_FOUND,
    INNOVATION_GROWTH_PATENT_PAGE_LOADING,
    INNOVATION_GROWTH_PATENT_NOTES,
    INNOVATION_GROWTH_PATENT_RESULT_FILTER_LABEL,
    INNOVATION_GROWTH_PATENT_RESULT_TITLE,
    INNOVATION_GROWTH_PATENT_SORT_LABEL,
    INNOVATION_GROWTH_PATENT_SORTS,
    INNOVATION_GROWTH_SEARCH_EMPTY_ERROR,
    INNOVATION_GROWTH_SEARCH_SCOPE,
    INNOVATION_GROWTH_SEARCH_TYPES,
    INNOVATION_GROWTH_SEARCHING,
    INNOVATION_GROWTH_SELECTED_COMPANY,
    INNOVATION_GROWTH_SELECTION_LABELS,
    INNOVATION_GROWTH_SHOW_SELECTED_COMPANY,
    INNOVATION_GROWTH_SHOW_SELECTED_PATENT,
    isInnovationGrowthPatentSort,
    isInnovationGrowthSearchType,
    PATENT_FIELD_LABELS,
    searchInnovationGrowthCompanies,
    searchInnovationGrowthPatents,
    type InnovationGrowthCompany,
    type InnovationGrowthPatent,
    type InnovationGrowthPatentResult,
    type InnovationGrowthPatentSort,
    type InnovationGrowthSearchType,
} from '@/content/service/innovation-growth-report'
import {
    INNOVATION_REPORT_CREATED_QUERY,
    INNOVATION_REPORT_CREATED_QUERY_VALUE,
    INNOVATION_REPORT_FREE_QUERY_VALUE,
    INNOVATION_REPORT_WINDOW_HEIGHT,
    INNOVATION_REPORT_WINDOW_NAME,
    INNOVATION_REPORT_WINDOW_WIDTH,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 보고서 · 기업혁신성장 조회.
//
// 흐름
//   · 기업 검색: 기업 목록 → 기업 선택 → 선택한 기업 요약 · 특허 목록 → 특허 선택
//   · 특허 검색: 특허 목록(카드마다 보유 기업) → 특허 선택
//   · 공통: 하단 바 [보고서 생성] → 생성 모달 [보고서 생성] → 보고서 문서 새 창
//     금일 같은 기업 · 같은 선택 특허로 조회한 이력이 있으면 생성 모달 대신 재조회 안내 모달(아래 연동 3)
//
// 동작 규칙
//   · 검색 기준(기업 · 특허)을 바꾸면 결과 · 선택 · 검색어를 모두 비운다(처음 상태).
//   · 차감 · 생성불가는 getInnovationGrowthReportCase 가 정한다.
//   · [보고서 생성]: 생성불가(기업 회원만)면 꺼짐, 특허를 고르면 켜짐, 특허가 없는 기업은 기업만 골라도 켜짐.
//   · 목록은 한 쪽에 10건이고, 쪽을 넘겨도 선택은 유지한다.
//   · 쪽을 넘겨도 화면을 움직이지 않는다 — 목록만 바뀌고 보던 위치(페이지 넘김 근처)가 그대로 남는다.
//     불러오는 동안 목록 자리는 직전 목록 높이를 지켜, 아래 내용이 끌려 올라왔다 내려가지 않는다.
//   · 목록 안 검색은 선택한 기업의 특허 목록에만 있다. 고른 특허가 결과에서 빠지면 선택을 푼다.
//
// [프론트엔드 연동]
//   1. content/service/innovation-growth-report.ts 의 목업 함수 다섯 개를 API 로 바꾼다.
//      · searchInnovationGrowthCompanies(검색어) — 기업 검색 [검색하기]
//      · searchInnovationGrowthPatents(검색어)   — 특허 검색 [검색하기]
//      · getInnovationGrowthPatents(기업 id)     — 기업 선택
//      · getInnovationGrowthCompanyPage(쪽)      — 기업 목록 쪽 이동
//      · getInnovationGrowthPatentPage(쪽)       — 특허 목록 쪽 이동
//   2. 지금은 받은 전체 목록을 화면에서 나누고(쪽) 거르고(목록 안 검색) 정렬한다. API 가 쪽 단위로 준다면
//      쪽 이동 함수에 쪽 · 검색어 · 정렬을 넘기고, 목록 · 전체 쪽 수 · '총 n건' 을 서버 값으로 바꾼다.
//   3. 보고서 생성 — 아래 KbigxReportCreateDialog 의 reportWindow 주석 참고(생성 요청과 새 창 여는 순서를 정해야 한다).
//      재조회 — [보고서 생성]을 누를 때 조회 이력을 확인해, 같은 이용자가 금일 같은 기업 · 같은 선택 특허로 조회했으면
//      생성 모달 대신 KbigxReportRecheckDialog(open · onOpenChange)를 연다. [조회하기]는 생성 모달의 [보고서 생성]과
//      같게 잇는다(onConfirm · reportWindow). 이력 판정은 서버 값으로 한다. 대량정보조회에는 쓰지 않는다.
//   4. userType 은 로그인 정보로 정한다.

type SearchStatus = 'idle' | 'loading' | 'done'

const LIST_PAGE_SIZE = 10

// 목록 제목 id — 제목(h2)과 목록(라디오 묶음)의 aria-labelledby 를 잇는다.
const COMPANY_LIST_TITLE_ID = 'ig-company-title'
const PATENT_LIST_TITLE_ID = 'ig-patent-title'

// 스크롤로 옮겨 갈 구역의 위 여백 — 고정 헤더 높이 + 16.
const SCROLL_TARGET_CLASS_NAME = 'scroll-mt-18 md:scroll-mt-28 xl:scroll-mt-32'

const toPatentFields = (patent: InnovationGrowthPatent) => [
    {label: PATENT_FIELD_LABELS.name, value: patent.name},
    {label: PATENT_FIELD_LABELS.applicationNumber, value: patent.applicationNumber},
    {label: PATENT_FIELD_LABELS.applicationDate, value: patent.applicationDate},
    {label: PATENT_FIELD_LABELS.infoDate, value: patent.infoDate},
    {label: PATENT_FIELD_LABELS.subCategoryName, value: patent.subCategoryName},
    {label: PATENT_FIELD_LABELS.subCategoryCode, value: patent.subCategoryCode},
]

// 특허 카드의 제목(특허명) 아래 한 줄 — 출원번호 · 특허출원일자 · 보유 기업(특허출원일자 오른쪽).
// 특허정보일자 · 소분류명 · 소분류코드는 카드에서 뺀다(보고서 생성 모달에는 그대로 보인다 — toPatentFields).
const toPatentFieldRows = (patent: InnovationGrowthPatent, companyName?: string) => [
    [
        {label: PATENT_FIELD_LABELS.applicationNumber, value: patent.applicationNumber},
        {label: PATENT_FIELD_LABELS.applicationDate, value: patent.applicationDate},
        ...(companyName ? [{label: PATENT_FIELD_LABELS.companyName, value: companyName}] : []),
    ],
]

const matchesPatentFilter = (patent: InnovationGrowthPatent, keyword: string) => {
    const digits = keyword.replace(/\D/g, '')
    return (
        patent.name.includes(keyword) ||
        patent.applicationNumber.includes(keyword) ||
        (Boolean(digits) && patent.applicationNumber.replace(/\D/g, '').includes(digits))
    )
}

// 목록 제목 — 20 Bold 제목 뒤에 16 Regular '총 n건', 오른쪽(좁은 화면은 아래)에 무엇을 할지 한 줄.
const ListTitle = ({
    id,
    title,
    count,
    helper,
    action,
}: {
    id: string
    title: string
    count: number
    helper?: ReactNode
    action?: ReactNode
}) => (
    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
        <h2 id={id} className="typo-title-l-bold text-foreground flex shrink-0 items-baseline gap-2">
            {title}
            <span className="typo-body-xl-regular">
                {/* 숫자만 강조 — 옅은 회색 면 위라 primary(blue.500)로는 본문 대비 4.5:1 에 못 미쳐
                    한 단계 짙은 primary-strong 을 쓴다[5.3.3]. */}
                총 <span className="typo-body-xl-bold text-primary-strong">{count}</span>
                {INNOVATION_GROWTH_COUNT_UNIT}
            </span>
        </h2>
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            {/* 안내에 기업명이 들어간다 — 띄어쓰기 없이 긴 이름도 화면 밖으로 넘치지 않게 끊는다. */}
            {helper ? (
                <p className="typo-body-l-regular text-foreground-subtle min-w-0 wrap-anywhere break-keep">{helper}</p>
            ) : null}
            {action}
        </div>
    </div>
)

// 특허 정보 기준 안내(※ 두 줄, 13 Regular) — 특허 목록 아래에만 둔다.
const PatentNotes = () => (
    <ul className="typo-caption-regular text-foreground-subtle flex list-none flex-col">
        {INNOVATION_GROWTH_PATENT_NOTES.map((note) => (
            <li key={note} className="flex">
                <ListMarker type="unordered-small" />
                <span className="min-w-0 break-keep">{note}</span>
            </li>
        ))}
    </ul>
)

// 목록 페이지 넘김 — 마이페이지 목록과 같은 공용 Pagination. 모바일은 번호만 좁게, 태블릿 이상은 [이전] · [다음] 글자와 함께.
type ListPaginationProps = {
    page: number
    total: number
    onPageChange: (page: number) => void
    /** 페이지 넘김 묶음의 이름(스크린리더) — 어느 목록의 쪽인지 알린다. */
    label: string
    className?: string
}

const ListPagination = ({page, total, onPageChange, label, className}: ListPaginationProps) => {
    const isMobile = useIsMobile()

    return (
        <Pagination
            page={page}
            total={total}
            onPageChange={onPageChange}
            siblingCount={isMobile ? 0 : 1}
            prevLabel={isMobile ? '' : INNOVATION_GROWTH_PAGINATION.prev}
            nextLabel={isMobile ? '' : INNOVATION_GROWTH_PAGINATION.next}
            maxVisibleItems={isMobile ? 5 : 10}
            compact={isMobile}
            aria-label={label}
            className={cn('justify-center', className)}
        />
    )
}

// 목록 자리의 빈 상태 · 불러오는 중 — 흰 면 · 반경 16 · 높이 208(아이콘 32 + 안내가 가운데).
const LIST_STATE_CLASS_NAME = 'bg-card min-h-52 rounded-lg break-keep'
// 특허 목록 패널 안의 빈 상태 · 불러오는 중 — 패널 테두리 안이라 옅은 면만 깐다.
const PATENT_LIST_STATE_CLASS_NAME = 'bg-surface-subtle min-h-52 break-keep'

// 다음 프레임에 옮긴다 — 방금 나타난 구역은 그때 그려져 있다.
const scrollToElement = (ref: RefObject<HTMLElement | null>) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.requestAnimationFrame(() =>
        ref.current?.scrollIntoView({behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start'}),
    )
}

type InnovationGrowthReportLookupProps = {
    /** 로그인 회원 유형 — 기관은 이용권을 차감하지 않는다. [프론트엔드 연동] 로그인 정보로 정한다. */
    userType: UserType
    /** 보고서 문서 주소 — 기업 /corp/… · 기관 /org/…. 보고서 생성 모달의 [보고서 생성]이 이 주소를 새 창으로 연다. */
    reportHref: string
    /**
     * 처음부터 보여 줄 검색 결과 — 주면 검색이 끝난 상태로 시작한다. 비우면 검색 전(조회 화면)이다.
     * [퍼블리싱 확인용] 결과 화면(search-result/…)들이 케이스별 목업을 넘긴다.
     *   · type 'company' — 기업 검색. companies 가 비었으면 결과 없음, selection 을 주면 그 기업을 고른 상태로 시작한다
     *   · type 'patent'  — 특허 검색. patents 가 비었으면 결과 없음
     * keyword 는 검색 칸에 넣어 둘 검색어, patentId 는 처음부터 골라 둘 특허다.
     */
    initialResult?:
        | {
              type: 'company'
              keyword?: string
              companies: readonly InnovationGrowthCompany[]
              selection?: {companyId: string; patents: readonly InnovationGrowthPatent[]}
              patentId?: string
          }
        | {type: 'patent'; keyword?: string; patents: readonly InnovationGrowthPatentResult[]; patentId?: string}
}

const InnovationGrowthReportLookup = ({userType, reportHref, initialResult}: InnovationGrowthReportLookupProps) => {
    // 마지막으로 검색한 기준 — 'company' 면 기업 목록부터, 'patent' 면 특허 목록이 바로 나온다.
    const initialCompanyResult = initialResult?.type === 'company' ? initialResult : undefined
    const [searchType, setSearchType] = useState<InnovationGrowthSearchType>(initialResult?.type ?? 'company')
    const [searchStatus, setSearchStatus] = useState<SearchStatus>(initialResult ? 'done' : 'idle')
    const [companies, setCompanies] = useState<readonly InnovationGrowthCompany[]>(
        initialCompanyResult?.companies ?? [],
    )
    const [companyId, setCompanyId] = useState(initialCompanyResult?.selection?.companyId ?? '')
    // 처음부터 고른 기업이 있으면 그 기업이 보이는 쪽에서 시작한다.
    const initialCompanyIndex =
        initialCompanyResult?.companies.findIndex((item) => item.id === initialCompanyResult.selection?.companyId) ?? -1
    const [companyPage, setCompanyPage] = useState(Math.floor(Math.max(initialCompanyIndex, 0) / LIST_PAGE_SIZE) + 1)
    const [isCompanyPageLoading, setIsCompanyPageLoading] = useState(false)
    // 특허 목록의 쪽 — 특허 목록이 바뀌면(기업을 고름 · 특허 검색 · 목록 안 검색 · 정렬 · 초기화) 1쪽으로 돌아간다.
    const [patentPage, setPatentPage] = useState(1)
    const [isPatentPageLoading, setIsPatentPageLoading] = useState(false)
    // 고른 기업의 특허 — null 이면 아직 불러오는 중이다.
    // 특허 검색이면 검색 결과(보유 기업이 붙은 특허)가 여기 들어간다.
    const [patents, setPatents] = useState<readonly (InnovationGrowthPatent | InnovationGrowthPatentResult)[] | null>(
        initialResult?.type === 'patent' ? initialResult.patents : (initialCompanyResult?.selection?.patents ?? null),
    )
    const [patentId, setPatentId] = useState(initialResult?.patentId ?? '')
    // 입력 중인 검색어와, [검색]으로 목록에 적용한 검색어.
    const [patentKeywordInput, setPatentKeywordInput] = useState('')
    const [patentKeyword, setPatentKeyword] = useState('')
    const [patentSort, setPatentSort] = useState<InnovationGrowthPatentSort>(INNOVATION_GROWTH_DEFAULT_PATENT_SORT)
    const resultRef = useRef<HTMLDivElement>(null)
    const companySectionRef = useRef<HTMLElement>(null)
    const selectedCompanyRef = useRef<HTMLElement>(null)
    // 목록 자리 — 쪽을 넘길 때 불러오는 동안 이 높이를 지킨다(화면이 튀지 않게).
    const companyListRef = useRef<HTMLDivElement>(null)
    const patentListRef = useRef<HTMLDivElement>(null)
    const [companyListHoldHeight, setCompanyListHoldHeight] = useState<number>()
    const [patentListHoldHeight, setPatentListHoldHeight] = useState<number>()
    // 마지막 요청 번호 — 앞선 요청의 응답이 늦게 와서 새 결과를 덮지 않게 한다.
    const requestRef = useRef(0)
    // 기업 목록 쪽 요청 번호 — 쪽을 빠르게 넘기면 마지막에 고른 쪽의 응답만 받는다.
    const companyPageRequestRef = useRef(0)
    const patentPageRequestRef = useRef(0)

    const isMobile = useIsMobile()
    const isPatentSearch = searchType === 'patent'
    // 셀렉트에서 지금 고른 기준 — 검색 전에도 바뀐다(searchType 은 검색한 기준). 카드 아래 안내 줄에 쓴다.
    const [selectedType, setSelectedType] = useState<InnovationGrowthSearchType>(
        initialResult?.type ?? INNOVATION_GROWTH_SEARCH_TYPES[0].value,
    )
    const isPatentSearchSelected = selectedType === 'patent'
    const company = companies.find((item) => item.id === companyId)
    const companyNumber = company ? getInnovationGrowthCompanyNumber(company) : undefined
    const patent = patents?.find((item) => item.id === patentId)
    const patentResult = patent && 'companyName' in patent ? patent : undefined
    const hasPatents = Boolean(patents?.length)
    // 특허 목록이 보이는 때 — 기업 검색은 기업을 고른 뒤, 특허 검색은 검색이 끝나자마자.
    const isPatentListShown = isPatentSearch ? searchStatus === 'done' : Boolean(company)
    const isChooseCompanyShown = searchStatus === 'done' && !isPatentSearch && Boolean(companies.length) && !company

    // 목록 안 검색 · 정렬을 거친 특허 — 고른 특허는 쪽을 넘기거나 정렬을 바꿔도 그대로다.
    const keyword = patentKeyword.trim()
    const visiblePatents = (patents ?? [])
        .filter((item) => !keyword || matchesPatentFilter(item, keyword))
        .toSorted(compareInnovationGrowthPatents(patentSort))
    const patentRangeStart = (patentPage - 1) * LIST_PAGE_SIZE + 1
    const patentRangeEnd = Math.min(patentPage * LIST_PAGE_SIZE, visiblePatents.length)

    // 차감 케이스 — 기업을 고른 뒤, 또는 특허 검색에서 특허를 고른 뒤에 정해진다.
    const reportCase = company
        ? getInnovationGrowthReportCase({
              userType,
              isSelf: company.isSelf,
              hasFinance: company.hasFinance,
              hasPatent: company.patentCount > 0,
          })
        : patentResult
          ? getInnovationGrowthReportCase({
                userType,
                isSelf: patentResult.isSelfCompany,
                // 특허가 있으면 재무정보와 상관없이 판정이 같다 — 특허 검색 결과에는 재무정보가 없어도 된다.
                hasFinance: false,
                hasPatent: true,
            })
          : undefined
    const caseCopy = reportCase ? INNOVATION_GROWTH_CASE_COPY[reportCase] : undefined
    const isBlocked = reportCase === 'blocked'
    const canGenerate =
        !isBlocked && (Boolean(patent) || (!isPatentSearch && Boolean(company) && patents?.length === 0))
    // 하단 바는 고를 결과가 있을 때만 — 검색 전 · 결과 없음에는 누를 것이 없다.
    const isActionBarShown = searchStatus === 'done' && (isPatentSearch ? hasPatents : Boolean(companies.length))
    const idleNote =
        isPatentSearch && searchStatus === 'done' && hasPatents
            ? INNOVATION_GROWTH_ACTION_PATENT_IDLE
            : INNOVATION_GROWTH_ACTION_IDLE
    const reportCompanyName = patentResult?.companyName ?? company?.name ?? ''
    // 하단 바의 고른 항목 — 어느 쪽을 보든 무엇을 골랐는지 보인다.
    const selectionSummary = [
        ...(reportCompanyName ? [{label: INNOVATION_GROWTH_SELECTION_LABELS.company, value: reportCompanyName}] : []),
        ...(patent ? [{label: INNOVATION_GROWTH_SELECTION_LABELS.patent, value: patent.name}] : []),
    ]
    // 기업을 골랐지만 특허가 있어 아직 고를 것이 남았을 때 — 차감 안내보다 다음 할 일을 먼저 알린다.
    const isPatentChoicePending = !isPatentSearch && Boolean(company) && !patent && (company?.patentCount ?? 0) > 0
    // 고른 항목이 있는 쪽 — 지금 쪽과 다르면 목록 제목 줄에 돌아가는 버튼을 둔다.
    const selectedCompanyPage = company ? Math.floor(companies.indexOf(company) / LIST_PAGE_SIZE) + 1 : companyPage
    const selectedPatentPage = patent ? Math.floor(visiblePatents.indexOf(patent) / LIST_PAGE_SIZE) + 1 : patentPage
    // 차감 알림은 차감될 때만 띄운다 — 자사조회 · 기관회원은 알림 없이 연다.
    const reportQueryValue =
        reportCase === 'charged' ? INNOVATION_REPORT_CREATED_QUERY_VALUE : INNOVATION_REPORT_FREE_QUERY_VALUE

    // 결과 영역(검색 중 안내 → 검색된 기업 목록 또는 특허 목록) 머리로 내려간다 — 결과가 그려진 다음 프레임에 옮긴다.
    const scrollToResult = () => scrollToElement(resultRef)

    // 특허 목록이 바뀌면(기업을 고름 · 새 검색 · 목록 안 검색 · 정렬) 기다리던 쪽 응답을 버린다.
    const cancelPatentPageRequest = () => {
        patentPageRequestRef.current += 1
        setIsPatentPageLoading(false)
    }

    // 새 검색 · 초기화 — 기다리던 쪽 응답을 버린다.
    const cancelCompanyPageRequest = () => {
        companyPageRequestRef.current += 1
        setIsCompanyPageLoading(false)
    }

    const clearSelection = () => {
        requestRef.current += 1
        cancelPatentPageRequest()
        setCompanyId('')
        setPatents(null)
        setPatentId('')
        setPatentPage(1)
        setPatentKeywordInput('')
        setPatentKeyword('')
    }

    const selectCompany = async (id: string) => {
        requestRef.current += 1
        cancelPatentPageRequest()
        const requestId = requestRef.current
        setCompanyId(id)
        setPatents(null)
        setPatentId('')
        setPatentPage(1)
        setPatentKeywordInput('')
        setPatentKeyword('')
        // 기업을 고르면 선택한 기업 요약으로 내려간다 — 기업 목록은 위에 그대로 남는다.
        scrollToElement(selectedCompanyRef)
        const result = await getInnovationGrowthPatents(id)
        if (requestId === requestRef.current) setPatents(result)
    }

    const handleSearch = async ({type, value}: SelectSearchSubmit) => {
        if (!isInnovationGrowthSearchType(type)) return

        clearSelection()
        cancelCompanyPageRequest()
        const requestId = requestRef.current
        setSearchType(type)
        setSearchStatus('loading')
        setCompanies([])
        setCompanyPage(1)
        scrollToResult()
        if (type === 'patent') {
            const result = await searchInnovationGrowthPatents(value)
            if (requestId !== requestRef.current) return
            setPatents(result)
            setPatentPage(1)
            setSearchStatus('done')
            scrollToResult()
            return
        }
        const result = await searchInnovationGrowthCompanies(value)
        if (requestId !== requestRef.current) return
        setCompanies(result)
        setSearchStatus('done')
        scrollToResult()
    }

    // 기업 목록 쪽을 넘기면 화면은 그대로 두고 목록만 바꾼다 — 불러오는 동안 목록 자리에 스피너가 서되 직전 목록 높이를 지킨다.
    // 고른 기업 · 특허는 그대로 둔다. 번호는 먼저 바꿔 어느 쪽으로 가는지 바로 보인다.
    const handleCompanyPageChange = async (nextPage: number) => {
        companyPageRequestRef.current += 1
        const requestId = companyPageRequestRef.current
        setCompanyListHoldHeight(companyListRef.current?.offsetHeight)
        setCompanyPage(nextPage)
        setIsCompanyPageLoading(true)
        await getInnovationGrowthCompanyPage(nextPage)
        if (requestId === companyPageRequestRef.current) setIsCompanyPageLoading(false)
    }

    // 특허 목록 쪽을 넘기면 화면은 그대로 두고 목록만 바꾼다 — 불러오는 동안 직전 목록 높이를 지킨다. 고른 특허는 그대로 둔다.
    const handlePatentPageChange = async (nextPage: number) => {
        patentPageRequestRef.current += 1
        const requestId = patentPageRequestRef.current
        setPatentListHoldHeight(patentListRef.current?.offsetHeight)
        setPatentPage(nextPage)
        setIsPatentPageLoading(true)
        await getInnovationGrowthPatentPage(nextPage)
        if (requestId === patentPageRequestRef.current) setIsPatentPageLoading(false)
    }

    const applyPatentKeyword = (nextKeyword: string) => {
        cancelPatentPageRequest()
        const trimmed = nextKeyword.trim()
        setPatentKeyword(trimmed)
        setPatentPage(1)
        if (patent && trimmed && !matchesPatentFilter(patent, trimmed)) setPatentId('')
    }

    // 입력은 [검색] · Enter 로 적용한다. 지우기로 칸을 비우면 바로 전체 목록으로 돌아간다.
    const handlePatentKeywordInputChange = (nextKeyword: string) => {
        setPatentKeywordInput(nextKeyword)
        if (!nextKeyword.trim()) applyPatentKeyword('')
    }

    const handlePatentSearch = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        applyPatentKeyword(patentKeywordInput)
    }

    const handlePatentSortChange = (nextSort: string) => {
        if (!isInnovationGrowthPatentSort(nextSort)) return
        cancelPatentPageRequest()
        setPatentSort(nextSort)
        setPatentPage(1)
    }

    const handleReset = () => {
        clearSelection()
        cancelCompanyPageRequest()
        setSearchStatus('idle')
        setCompanies([])
        setCompanyPage(1)
    }

    // 검색 기준(기업 · 특허)을 바꾸면 처음 들어왔을 때처럼 되돌린다 — 결과 · 고른 항목 · 빈 상태 · 하단 바가 모두 사라진다.
    const handleSearchTypeChange = (nextType: string) => {
        if (!isInnovationGrowthSearchType(nextType)) return
        setSelectedType(nextType)
        handleReset()
    }

    // 세로 간격 — 소개 · 검색 · 결과 사이 40, 검색 안내 줄과 결과 사이만 60(결과 영역 mt-5).
    // 화면 틀 · 제목 · 소개는 감싼 KbigxReportFrame 이 그린다(기업 · 기관 모두) — 여기서는 본문만 쌓는다.
    return (
        <div className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-4">
                <SelectSearchForm
                    options={INNOVATION_GROWTH_SEARCH_TYPES}
                    defaultType={initialResult?.type}
                    defaultValues={initialResult?.keyword ? {[initialResult.type]: initialResult.keyword} : undefined}
                    emptyError={INNOVATION_GROWTH_SEARCH_EMPTY_ERROR}
                    invalidError={getInnovationGrowthInvalidError}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    onTypeChange={handleSearchTypeChange}
                    isKeywordClearedOnTypeChange
                    isSearching={searchStatus === 'loading'}
                    // 테두리 글로우는 검색 전(첫 화면)에만 — 검색하면 끄고, [초기화]로 첫 화면에 돌아오면 다시 켠다.
                    hasGlow={searchStatus === 'idle'}
                />
                {/* 검색 범위 안내와 [기업정보 제공법적 근거] — 카드 아래 가운데 한 줄(좁은 화면에서는 두 줄).
                    특허 검색을 골랐을 때만 둔다 — 기업 검색에는 해당하지 않는 안내다. */}
                {isPatentSearchSelected ? (
                    <div className="flex flex-col items-center gap-x-4 gap-y-1 md:flex-row md:justify-center">
                        <p className="typo-body-l-medium text-label-foreground flex items-center gap-1 break-keep">
                            <CircleAlert aria-hidden="true" className="size-icon-sm shrink-0" />
                            {INNOVATION_GROWTH_SEARCH_SCOPE}
                        </p>
                        <KbigxLegalBasisDialog>
                            <Button type="button" variant="text-underline" size="sm" aria-haspopup="dialog">
                                {INNOVATION_GROWTH_LEGAL_BASIS_LABEL}
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </KbigxLegalBasisDialog>
                    </div>
                ) : null}
            </div>

            <div ref={resultRef} className={cn('mt-5 flex flex-col gap-10 empty:hidden', SCROLL_TARGET_CLASS_NAME)}>
                {searchStatus === 'loading' ? (
                    <LoadingState title={INNOVATION_GROWTH_SEARCHING} className={LIST_STATE_CLASS_NAME} />
                ) : null}

                {/* 검색된 기업 목록 — 하나를 고르면(라디오) 아래에 요약과 특허 목록이 선다. 목록은 그대로 남는다. */}
                {searchStatus === 'done' && !isPatentSearch ? (
                    <section
                        ref={companySectionRef}
                        aria-labelledby={COMPANY_LIST_TITLE_ID}
                        className={cn('flex flex-col gap-4', SCROLL_TARGET_CLASS_NAME)}
                    >
                        <ListTitle
                            id={COMPANY_LIST_TITLE_ID}
                            title={INNOVATION_GROWTH_COMPANY_LIST_TITLE}
                            count={companies.length}
                            action={
                                selectedCompanyPage !== companyPage ? (
                                    <Button
                                        type="button"
                                        variant="text-underline"
                                        size="sm"
                                        onClick={() => void handleCompanyPageChange(selectedCompanyPage)}
                                    >
                                        {INNOVATION_GROWTH_SHOW_SELECTED_COMPANY(selectedCompanyPage)}
                                    </Button>
                                ) : undefined
                            }
                            helper={
                                companies.length ? (
                                    company ? (
                                        // 기업명은 폭 상한(태블릿 이상 240)을 넘으면 말줄임 — 전체 이름은 툴팁과 아래 선택한 기업에 보인다.
                                        <span className="flex min-w-0 items-baseline">
                                            <span className="min-w-0 md:max-w-60">
                                                <TruncatedText>{company.name}</TruncatedText>
                                            </span>
                                            <span className="shrink-0">
                                                {INNOVATION_GROWTH_COMPANY_SELECTED_HELPER_SUFFIX}
                                            </span>
                                        </span>
                                    ) : (
                                        INNOVATION_GROWTH_COMPANY_HELPER
                                    )
                                ) : undefined
                            }
                        />
                        <div ref={companyListRef}>
                            {isCompanyPageLoading ? (
                                <LoadingState
                                    title={INNOVATION_GROWTH_COMPANY_PAGE_LOADING}
                                    className={LIST_STATE_CLASS_NAME}
                                    // 직전 목록 높이 — 런타임에 잰 값이라 클래스로 쓸 수 없다.
                                    style={{minHeight: companyListHoldHeight}}
                                />
                            ) : companies.length ? (
                                <SelectableListCardGroup
                                    value={companyId}
                                    onValueChange={(id) => void selectCompany(id)}
                                    aria-labelledby={COMPANY_LIST_TITLE_ID}
                                >
                                    {companies
                                        .slice((companyPage - 1) * LIST_PAGE_SIZE, companyPage * LIST_PAGE_SIZE)
                                        .map((item) => (
                                            <SelectableListCard
                                                key={item.id}
                                                value={item.id}
                                                title={item.name}
                                                badge={
                                                    item.isSelf ? (
                                                        <Badge variant="solid" color="navy" size="xs">
                                                            {INNOVATION_GROWTH_SELECTED_COMPANY.selfBadge}
                                                        </Badge>
                                                    ) : undefined
                                                }
                                                // 대표자명(두 번째 글자 가림) · 기업 번호(법인 → 법인번호, 개인기업 → 사업자번호)를 한 줄에.
                                                fieldRows={[
                                                    [
                                                        {
                                                            label: COMPANY_FIELD_LABELS.representativeName,
                                                            value: maskPersonName(item.representativeName),
                                                        },
                                                        getInnovationGrowthCompanyNumber(item),
                                                    ],
                                                ]}
                                                trailing={
                                                    <>
                                                        {COMPANY_FIELD_LABELS.patent}{' '}
                                                        <span className="typo-body-xl-bold text-label-foreground">
                                                            {item.patentCount}
                                                        </span>
                                                        {INNOVATION_GROWTH_COUNT_UNIT}
                                                    </>
                                                }
                                                hasChevron
                                            />
                                        ))}
                                </SelectableListCardGroup>
                            ) : (
                                <EmptyState
                                    title={INNOVATION_GROWTH_NOT_FOUND.title}
                                    description={INNOVATION_GROWTH_NOT_FOUND.description}
                                    className="bg-card min-h-58 rounded-lg"
                                />
                            )}
                        </div>
                        {companies.length > LIST_PAGE_SIZE ? (
                            <ListPagination
                                page={companyPage}
                                total={Math.ceil(companies.length / LIST_PAGE_SIZE)}
                                onPageChange={(nextPage) => void handleCompanyPageChange(nextPage)}
                                label={INNOVATION_GROWTH_PAGINATION.companyLabel}
                                className="py-2"
                            />
                        ) : null}
                    </section>
                ) : null}

                {/* 선택한 기업 요약 — 기업 목록과 특허 목록 사이. [기업 목록 보기]로 위 목록에 돌아간다. */}
                {!isPatentSearch && company ? (
                    <SelectedItemSummary
                        ref={selectedCompanyRef}
                        label={INNOVATION_GROWTH_SELECTED_COMPANY.title}
                        title={company.name}
                        meta={[
                            `${companyNumber?.label} ${companyNumber?.value}`,
                            `${COMPANY_FIELD_LABELS.patentCount} ${company.patentCount}${INNOVATION_GROWTH_COUNT_UNIT}`,
                            ...(company.isSelf ? [INNOVATION_GROWTH_SELECTED_COMPANY.selfLookup] : []),
                        ].join(' · ')}
                        className={SCROLL_TARGET_CLASS_NAME}
                        action={
                            <Button
                                type="button"
                                variant="tertiary"
                                size="sm"
                                onClick={() => scrollToElement(companySectionRef)}
                            >
                                {INNOVATION_GROWTH_SELECTED_COMPANY.showList}
                            </Button>
                        }
                    />
                ) : null}

                {isChooseCompanyShown ? (
                    <EmptyState
                        title={INNOVATION_GROWTH_CHOOSE_COMPANY.title}
                        description={INNOVATION_GROWTH_CHOOSE_COMPANY.description}
                        className={LIST_STATE_CLASS_NAME}
                    />
                ) : null}

                {/* 특허 목록 — 기업 검색은 기업을 골라야, 특허 검색은 검색하자마자 나타난다. */}
                {isPatentListShown ? (
                    <section aria-labelledby={PATENT_LIST_TITLE_ID} className="flex flex-col gap-4">
                        <ListTitle
                            id={PATENT_LIST_TITLE_ID}
                            title={
                                isPatentSearch
                                    ? INNOVATION_GROWTH_PATENT_RESULT_TITLE
                                    : INNOVATION_GROWTH_PATENT_LIST_TITLE
                            }
                            count={patents?.length ?? company?.patentCount ?? 0}
                            action={
                                selectedPatentPage !== patentPage ? (
                                    <Button
                                        type="button"
                                        variant="text-underline"
                                        size="sm"
                                        onClick={() => void handlePatentPageChange(selectedPatentPage)}
                                    >
                                        {INNOVATION_GROWTH_SHOW_SELECTED_PATENT(selectedPatentPage)}
                                    </Button>
                                ) : undefined
                            }
                            helper={hasPatents ? INNOVATION_GROWTH_PATENT_HELPER : undefined}
                        />
                        {patents === null ? (
                            <LoadingState title={INNOVATION_GROWTH_PATENT_LOADING} className={LIST_STATE_CLASS_NAME} />
                        ) : null}
                        {patents?.length === 0 ? (
                            <EmptyState
                                title={
                                    isPatentSearch
                                        ? INNOVATION_GROWTH_PATENT_NOT_FOUND.title
                                        : INNOVATION_GROWTH_NO_PATENT
                                }
                                description={
                                    isPatentSearch
                                        ? INNOVATION_GROWTH_PATENT_NOT_FOUND.description
                                        : isBlocked
                                          ? caseCopy?.note
                                          : INNOVATION_GROWTH_NO_PATENT_GUIDE
                                }
                                className={LIST_STATE_CLASS_NAME}
                            />
                        ) : null}
                        {hasPatents ? (
                            // 목록 패널 — 위 검색 · 정렬 줄과 아래 건수 줄은 흰 면, 그 사이 목록은 옅은 면이다.
                            <div className="border-subtle-3 bg-card flex flex-col rounded-lg border">
                                <div className="border-subtle-3 flex flex-col gap-2 border-b p-4 md:flex-row md:items-center md:justify-between md:px-6">
                                    {/* 목록 안 검색 — 기업을 골라 본 특허 목록과 특허 검색 결과 모두에 둔다. 입력칸 오른쪽 검색 버튼 · Enter 로 적용한다.
                                        특허 검색 결과에서는 검색된 특허 안에서 다시 좁힌다(위 검색 칸은 새로 검색한다). */}
                                    <form role="search" onSubmit={handlePatentSearch} className="w-full md:max-w-120">
                                        <ClearableInput
                                            // 검색 버튼은 비밀번호 표시 버튼과 같은 모양이다 — 칸 오른쪽 끝까지 채우고 마우스를 올리면 그 면이 칠해진다.
                                            className={passwordInputGroupClassName}
                                            aria-label={
                                                isPatentSearch
                                                    ? INNOVATION_GROWTH_PATENT_RESULT_FILTER_LABEL
                                                    : INNOVATION_GROWTH_PATENT_FILTER_LABEL
                                            }
                                            value={patentKeywordInput}
                                            onChange={(event) => handlePatentKeywordInputChange(event.target.value)}
                                            placeholder={INNOVATION_GROWTH_PATENT_PLACEHOLDER}
                                            endAddon={
                                                <InputGroupButton
                                                    type="submit"
                                                    size="icon-sm"
                                                    aria-label={INNOVATION_GROWTH_PATENT_FILTER_BUTTON_LABEL}
                                                    className={passwordInputToggleClassName}
                                                >
                                                    <Search aria-hidden="true" className={passwordInputIconClassName} />
                                                </InputGroupButton>
                                            }
                                        />
                                    </form>
                                    <SelectField value={patentSort} onValueChange={handlePatentSortChange}>
                                        <SelectTrigger
                                            size="lg"
                                            aria-label={INNOVATION_GROWTH_PATENT_SORT_LABEL}
                                            className="w-full md:w-32"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INNOVATION_GROWTH_PATENT_SORTS.map((sort) => (
                                                <SelectItem key={sort.value} value={sort.value}>
                                                    {sort.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </SelectField>
                                </div>
                                <div ref={patentListRef}>
                                    {isPatentPageLoading ? (
                                        <LoadingState
                                            title={INNOVATION_GROWTH_PATENT_PAGE_LOADING}
                                            className={PATENT_LIST_STATE_CLASS_NAME}
                                            // 직전 목록 높이 — 런타임에 잰 값이라 클래스로 쓸 수 없다.
                                            style={{minHeight: patentListHoldHeight}}
                                        />
                                    ) : visiblePatents.length ? (
                                        <SelectableListCardGroup
                                            value={patentId}
                                            onValueChange={setPatentId}
                                            aria-labelledby={PATENT_LIST_TITLE_ID}
                                            className="bg-surface-subtle p-3 md:p-4"
                                        >
                                            {visiblePatents
                                                .slice((patentPage - 1) * LIST_PAGE_SIZE, patentPage * LIST_PAGE_SIZE)
                                                .map((item) => (
                                                    <SelectableListCard
                                                        key={item.id}
                                                        value={item.id}
                                                        title={item.name}
                                                        // 보유 기업(출원일자 오른쪽) — 특허 검색은 특허마다 받은 기업명, 기업을 골라 본 목록은 고른 기업명.
                                                        fieldRows={toPatentFieldRows(
                                                            item,
                                                            'companyName' in item ? item.companyName : company?.name,
                                                        )}
                                                    />
                                                ))}
                                        </SelectableListCardGroup>
                                    ) : (
                                        <EmptyState
                                            title={INNOVATION_GROWTH_PATENT_FILTER_EMPTY.title}
                                            description={INNOVATION_GROWTH_PATENT_FILTER_EMPTY.description}
                                            className={PATENT_LIST_STATE_CLASS_NAME}
                                        />
                                    )}
                                </div>
                                <p
                                    aria-live="polite"
                                    className="border-subtle-3 typo-body-m-regular text-foreground-subtle border-t px-4 py-3 md:px-6"
                                >
                                    {/* 지금 보는 범위와 전체 건수만 굵게 — 건수는 목록 제목의 '총 n건' 과 같은 강조다. */}
                                    <span className="typo-body-m-bold text-foreground">
                                        {visiblePatents.length ? `${patentRangeStart}–${patentRangeEnd}` : 0}
                                    </span>
                                    {' / '}
                                    {keyword
                                        ? INNOVATION_GROWTH_PATENT_RANGE_LABEL.filtered
                                        : INNOVATION_GROWTH_PATENT_RANGE_LABEL.all}{' '}
                                    <span className="typo-body-m-bold text-primary-strong">
                                        {visiblePatents.length}
                                    </span>
                                    {INNOVATION_GROWTH_COUNT_UNIT}
                                </p>
                            </div>
                        ) : null}
                        {visiblePatents.length > LIST_PAGE_SIZE ? (
                            <ListPagination
                                page={patentPage}
                                total={Math.ceil(visiblePatents.length / LIST_PAGE_SIZE)}
                                onPageChange={(nextPage) => void handlePatentPageChange(nextPage)}
                                label={INNOVATION_GROWTH_PAGINATION.patentLabel}
                                className="py-2"
                            />
                        ) : null}
                        <PatentNotes />
                    </section>
                ) : null}
                {/* 하단 고정 바 — 결과 영역 안에 둬서, 결과가 화면에 있을 때만 아래에 붙고 검색 영역은 가리지 않는다. 결과가 있을 때만 보인다. */}
                {isActionBarShown ? (
                    <StickyActionBar
                        // KbigxReportFrame 의 아래 여백(pb-15)만큼 당겨, 목록 끝에서 푸터에 바로 붙는다 — 틀 여백이 바뀌면 같이 바꾼다.
                        className="-mb-15"
                        selection={selectionSummary}
                        message={
                            isPatentChoicePending ? INNOVATION_GROWTH_ACTION_PATENT_IDLE : (caseCopy?.note ?? idleNote)
                        }
                        tone={isBlocked ? 'error' : caseCopy && !isPatentChoicePending ? 'default' : 'muted'}
                        action={
                            <KbigxReportCreateDialog
                                companyName={reportCompanyName}
                                patent={patent ? toPatentFields(patent) : undefined}
                                notice={
                                    reportCase
                                        ? getInnovationGrowthReportNotice(reportCase, Boolean(patent))
                                        : undefined
                                }
                                // [프론트엔드 연동] 지금은 [보고서 생성]이 새 창 링크라, 생성 요청(onCreate)과 창 열기가 같은 클릭에
                                // 함께 일어나 요청 결과를 기다리지 못한다. 차감에 성공했을 때만 ?from=use 를 붙여야 하므로
                                // 요청을 먼저 보내고 응답으로 받은 보고서 id 로 창을 연다(팝업 차단을 피하려면 창은 클릭 안에서
                                // 먼저 열고 주소만 나중에 넣는다). 주소에는 고른 기업 · 특허 id 도 쿼리로 더한다.
                                reportWindow={{
                                    href: `${reportHref}?${INNOVATION_REPORT_CREATED_QUERY}=${reportQueryValue}`,
                                    width: INNOVATION_REPORT_WINDOW_WIDTH,
                                    height: INNOVATION_REPORT_WINDOW_HEIGHT,
                                    windowName: INNOVATION_REPORT_WINDOW_NAME,
                                }}
                            >
                                <Button
                                    type="button"
                                    size={isMobile ? 'md' : 'lg'}
                                    disabled={!canGenerate}
                                    aria-haspopup="dialog"
                                >
                                    {INNOVATION_GROWTH_GENERATE_LABEL}
                                    {/* 모바일은 안내 글에 폭을 더 준다. */}
                                    {isMobile ? null : <ArrowRight aria-hidden="true" />}
                                </Button>
                            </KbigxReportCreateDialog>
                        }
                    />
                ) : null}
            </div>
        </div>
    )
}

export {InnovationGrowthReportLookup}
export type {InnovationGrowthReportLookupProps}
