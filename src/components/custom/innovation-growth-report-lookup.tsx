'use client'

import {useRef, useState, type ReactNode} from 'react'
import {ChevronRight, CircleAlert} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {EmptyState} from '@/components/composite/empty-state'
import {KbigxLegalBasisDialog} from '@/components/composite/k-bigx-legal-basis-dialog'
import {KbigxReportCreateDialog} from '@/components/composite/k-bigx-report-create-dialog'
import {LoadingState} from '@/components/composite/loading-state'
import {SelectSearchForm, type SelectSearchSubmit} from '@/components/composite/select-search-form'
import {SelectableInfoCard, SelectableInfoCardGroup} from '@/components/composite/selectable-info-card'
import {ListMarker} from '@/components/custom/list-marker'
import {
    COMPANY_FIELD_LABELS,
    getInnovationGrowthInvalidError,
    getInnovationGrowthPatents,
    INNOVATION_GROWTH_COMPANY_LIST_TITLE,
    INNOVATION_GROWTH_LEGAL_BASIS_LABEL,
    INNOVATION_GROWTH_NO_PATENT,
    INNOVATION_GROWTH_NOT_FOUND,
    INNOVATION_GROWTH_PATENT_LIST_TITLE,
    INNOVATION_GROWTH_PATENT_LOADING,
    INNOVATION_GROWTH_PATENT_NOTES,
    INNOVATION_GROWTH_PRINT_LABEL,
    INNOVATION_GROWTH_SEARCH_EMPTY_ERROR,
    INNOVATION_GROWTH_SEARCH_SCOPE,
    INNOVATION_GROWTH_SEARCH_TYPES,
    INNOVATION_GROWTH_SEARCHING,
    INNOVATION_GROWTH_USAGE,
    INNOVATION_GROWTH_USAGE_NO_PATENT,
    isInnovationGrowthSearchType,
    PATENT_FIELD_LABELS,
    INNOVATION_GROWTH_PATENT_NOT_FOUND,
    searchInnovationGrowthCompanies,
    searchInnovationGrowthPatents,
    type InnovationGrowthCompany,
    type InnovationGrowthPatent,
    type InnovationGrowthPatentResult,
    type InnovationGrowthSearchType,
} from '@/content/service/innovation-growth-report'

// K-BIGx 보고서 · 기업혁신성장 조회.
//
// 흐름은 검색 기준에 따라 두 가지다.
//   · 기업 검색: 검색된 기업 목록 → 기업 카드를 고름 → 그 기업의 특허 목록을 불러옴 → 특허 카드를 고름
//   · 특허 검색: 기업 목록 없이 특허 목록이 바로 나옴(카드마다 기업명) → 특허 카드를 고름
//   → 이용횟수 안내 → [K-BIGx 보고서 출력](보고서 생성 모달)
//   · 출력 버튼은 평소 꺼져 있고, 특허 카드를 골라야 켜진다.
//   · 기업을 고르기 전에는 특허 목록 · 이용횟수 안내가 없고, 출력 버튼은 꺼져 있다.
//   · 특허가 없는 기업(특허수 0)은 특허 목록 자리에 '특허 정보가 없습니다.' 빈 상태가 서고, 이용횟수 안내가
//     '차감되지 않음'으로 바뀌며, 바로 출력할 수 있다(기술혁신정보를 뺀 보고서).
//   · 검색 결과가 없으면 기업 목록(총 0건) 자리에 '검색된 기업이 없습니다.' 빈 상태가 선다.
//
// [프론트엔드 연동] 화면(UI)은 건드리지 않고 content/service/innovation-growth-report.ts 의 목업 함수 두 개만 API 로 바꾼다.
//   · searchInnovationGrowthCompanies(검색어) — '기업 검색'의 [검색하기] 때 부른다. 기다리는 동안 결과 자리에 '검색 중' 안내.
//   · searchInnovationGrowthPatents(검색어)   — '특허 검색'의 [검색하기] 때 부른다. 결과는 특허 목록 자리에 바로 선다.
//   · getInnovationGrowthPatents(기업 id)            — 기업 카드를 고를 때 부른다. 기다리는 동안 특허 목록 자리에 '불러오는 중' 안내.
//   보고서 생성 요청은 KbigxReportCreateDialog 의 onCreate 에 잇는다.

type SearchStatus = 'idle' | 'loading' | 'done'

const toCompanyFields = (company: InnovationGrowthCompany) => [
    {label: COMPANY_FIELD_LABELS.name, value: company.name},
    {label: COMPANY_FIELD_LABELS.corporateNumber, value: company.corporateNumber},
    {label: COMPANY_FIELD_LABELS.patentCount, value: `${company.patentCount}건`},
]

const toPatentFields = (patent: InnovationGrowthPatent) => [
    {label: PATENT_FIELD_LABELS.name, value: patent.name},
    {label: PATENT_FIELD_LABELS.applicationNumber, value: patent.applicationNumber},
    {label: PATENT_FIELD_LABELS.applicationDate, value: patent.applicationDate},
    {label: PATENT_FIELD_LABELS.infoDate, value: patent.infoDate},
    {label: PATENT_FIELD_LABELS.subCategoryName, value: patent.subCategoryName},
    {label: PATENT_FIELD_LABELS.subCategoryCode, value: patent.subCategoryCode},
]

// 목록 제목 — 20 Bold 제목 뒤에 16 Regular '총 n건'(숫자만 primary).
const ListTitle = ({id, title, count}: {id: string; title: string; count: number}) => (
    <h2 id={id} className="typo-title-l-bold text-foreground flex items-baseline gap-2">
        {title}
        <span className="typo-body-xl-regular">
            총 <span className="text-primary">{count}</span>건
        </span>
    </h2>
)

// 목록 자리의 빈 상태 · 불러오는 중 — 흰 면 · 반경 16 · 높이 208(아이콘 32 + 안내 한 줄이 가운데).
const LIST_STATE_CLASS_NAME = 'bg-card min-h-52 rounded-lg'

type InnovationGrowthReportLookupProps = {
    /** 화면 제목 · 소개 — 검색 위에 놓인다. */
    intro: ReactNode
    /**
     * 처음부터 보여 줄 검색 결과 — 주면 검색이 끝난 상태로 시작한다. 비우면 검색 전(조회 화면)이다.
     * [퍼블리싱 확인용] 결과 화면(search-result/…)들이 케이스별 목업을 넘긴다.
     *   · type 'company' — 기업 검색. companies 가 비었으면 결과 없음, selection 을 주면 그 기업을 고른 상태
     *   · type 'patent'  — 특허 검색. patents 가 비었으면 결과 없음
     * keyword 는 검색 칸에 넣어 둘 검색어다.
     */
    initialResult?:
        | {
              type: 'company'
              keyword?: string
              companies: readonly InnovationGrowthCompany[]
              selection?: {companyId: string; patents: readonly InnovationGrowthPatent[]}
          }
        | {type: 'patent'; keyword?: string; patents: readonly InnovationGrowthPatentResult[]}
}

const InnovationGrowthReportLookup = ({intro, initialResult}: InnovationGrowthReportLookupProps) => {
    // 마지막으로 검색한 기준 — 'company' 면 기업 목록부터, 'patent' 면 특허 목록이 바로 나온다.
    const initialCompanyResult = initialResult?.type === 'company' ? initialResult : undefined
    const [searchType, setSearchType] = useState<InnovationGrowthSearchType>(initialResult?.type ?? 'company')
    const [searchStatus, setSearchStatus] = useState<SearchStatus>(initialResult ? 'done' : 'idle')
    const [companies, setCompanies] = useState<readonly InnovationGrowthCompany[]>(
        initialCompanyResult?.companies ?? [],
    )
    const [companyId, setCompanyId] = useState(initialCompanyResult?.selection?.companyId ?? '')
    // 고른 기업의 특허 — null 이면 아직 불러오는 중이다.
    // 특허 검색이면 검색 결과(기업명이 붙은 특허)가 여기 들어간다.
    const [patents, setPatents] = useState<readonly (InnovationGrowthPatent | InnovationGrowthPatentResult)[] | null>(
        initialResult?.type === 'patent' ? initialResult.patents : (initialCompanyResult?.selection?.patents ?? null),
    )
    const [patentId, setPatentId] = useState('')
    const resultRef = useRef<HTMLDivElement>(null)
    const patentSectionRef = useRef<HTMLElement>(null)
    const printRef = useRef<HTMLDivElement>(null)
    // 마지막 요청 번호 — 앞선 요청의 응답이 늦게 와서 새 결과를 덮지 않게 한다.
    const requestRef = useRef(0)

    const isPatentSearch = searchType === 'patent'
    const company = companies.find((item) => item.id === companyId)
    const patent = patents?.find((item) => item.id === patentId)
    const hasPatents = Boolean(patents?.length)
    // 특허 목록이 보이는 때 — 기업 검색은 기업을 고른 뒤, 특허 검색은 검색이 끝나자마자.
    const isPatentListShown = isPatentSearch ? searchStatus === 'done' : Boolean(company)
    // 이용횟수 안내 — 기업 검색은 특허를 불러온 뒤(특허 유무에 따라 문구가 바뀜), 특허 검색은 찾은 특허가 있을 때.
    const isUsageShown = isPatentSearch ? hasPatents : Boolean(company) && patents !== null
    // 출력 — 특허 카드를 골라야 켜진다. 특허가 없는 기업만 기업을 고른 것으로 켜진다(기술혁신정보 제외 보고서).
    const canPrint = Boolean(patent) || (!isPatentSearch && Boolean(company) && patents?.length === 0)
    const usage = hasPatents ? INNOVATION_GROWTH_USAGE : INNOVATION_GROWTH_USAGE_NO_PATENT
    const reportCompanyName = patent && 'companyName' in patent ? patent.companyName : (company?.name ?? '')
    const isPrintShown = searchStatus === 'done' && (isPatentSearch ? hasPatents : Boolean(companies.length))

    // 결과 영역(검색 중 안내 → 검색된 기업 목록 또는 특허 목록) 머리로 내려간다 — 결과가 그려진 다음 프레임에 옮긴다.
    const scrollToResult = () =>
        window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}))

    // 특허 카드를 고르면 [K-BIGx 보고서 출력]이 화면 가운데 오도록 내려간다 — 켜진 버튼을 바로 누를 수 있다.
    const selectPatent = (id: string) => {
        setPatentId(id)
        window.requestAnimationFrame(() => printRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'}))
    }

    const clearSelection = () => {
        requestRef.current += 1
        setCompanyId('')
        setPatents(null)
        setPatentId('')
    }

    const selectCompany = async (id: string) => {
        requestRef.current += 1
        const requestId = requestRef.current
        setCompanyId(id)
        setPatents(null)
        setPatentId('')
        // 기업을 고르면 그 기업의 특허 목록 섹션으로 내려간다 — 섹션이 그려진 다음 프레임에 옮긴다.
        window.requestAnimationFrame(() =>
            patentSectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}),
        )
        const result = await getInnovationGrowthPatents(id)
        if (requestId === requestRef.current) setPatents(result)
    }

    const handleSearch = async ({type, value}: SelectSearchSubmit) => {
        if (!isInnovationGrowthSearchType(type)) return

        clearSelection()
        const requestId = requestRef.current
        setSearchType(type)
        setSearchStatus('loading')
        setCompanies([])
        scrollToResult()
        if (type === 'patent') {
            const result = await searchInnovationGrowthPatents(value)
            if (requestId !== requestRef.current) return
            setPatents(result)
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

    const handleReset = () => {
        clearSelection()
        setSearchStatus('idle')
        setCompanies([])
    }

    // 세로 간격 — 소개 · 검색 · 결과 · 버튼 사이 40, 검색 안내 줄과 결과 사이만 60(결과 영역 mt-5).
    return (
        <div className="grid-layout gap-y-10 pt-10 pb-15 *:col-span-full">
            {intro}
            <div className="flex flex-col gap-4">
                <SelectSearchForm
                    options={INNOVATION_GROWTH_SEARCH_TYPES}
                    defaultType={initialResult?.type}
                    defaultValues={initialResult?.keyword ? {[initialResult.type]: initialResult.keyword} : undefined}
                    emptyError={INNOVATION_GROWTH_SEARCH_EMPTY_ERROR}
                    invalidError={getInnovationGrowthInvalidError}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    isSearching={searchStatus === 'loading'}
                />
                {/* 검색 범위 안내와 [기업정보 제공법적 근거] — 카드 아래 가운데 한 줄(좁은 화면에서는 두 줄). */}
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
            </div>

            {/* 결과 영역 — 검색 전에는 비어 있다. */}
            <div
                ref={resultRef}
                className="mt-5 flex scroll-mt-18 flex-col gap-10 empty:hidden md:scroll-mt-28 xl:scroll-mt-32"
            >
                {searchStatus === 'loading' ? (
                    <LoadingState title={INNOVATION_GROWTH_SEARCHING} className={LIST_STATE_CLASS_NAME} />
                ) : null}

                {/* 검색된 기업 목록 — 카드 하나를 고르면(라디오) 그 기업의 특허 목록을 불러온다. */}
                {searchStatus === 'done' && !isPatentSearch ? (
                    <section aria-labelledby="ig-company-title" className="flex flex-col gap-6">
                        <ListTitle
                            id="ig-company-title"
                            title={INNOVATION_GROWTH_COMPANY_LIST_TITLE}
                            count={companies.length}
                        />
                        {companies.length ? (
                            <SelectableInfoCardGroup
                                value={companyId}
                                onValueChange={(id) => void selectCompany(id)}
                                aria-labelledby="ig-company-title"
                            >
                                {companies.map((item) => (
                                    <SelectableInfoCard key={item.id} value={item.id} fields={toCompanyFields(item)} />
                                ))}
                            </SelectableInfoCardGroup>
                        ) : (
                            <EmptyState title={INNOVATION_GROWTH_NOT_FOUND} className={LIST_STATE_CLASS_NAME} />
                        )}
                    </section>
                ) : null}

                {/* 특허 목록 — 기업 검색은 기업을 골라야, 특허 검색은 검색하자마자 나타난다. */}
                {isPatentListShown ? (
                    <section
                        ref={patentSectionRef}
                        aria-labelledby="ig-patent-title"
                        className="flex scroll-mt-18 flex-col gap-6 md:scroll-mt-28 xl:scroll-mt-32"
                    >
                        <ListTitle
                            id="ig-patent-title"
                            title={INNOVATION_GROWTH_PATENT_LIST_TITLE}
                            count={patents?.length ?? company?.patentCount ?? 0}
                        />
                        <div className="flex flex-col gap-2">
                            {patents === null ? (
                                <LoadingState
                                    title={INNOVATION_GROWTH_PATENT_LOADING}
                                    className={LIST_STATE_CLASS_NAME}
                                />
                            ) : null}
                            {patents?.length ? (
                                <SelectableInfoCardGroup
                                    value={patentId}
                                    onValueChange={selectPatent}
                                    aria-labelledby="ig-patent-title"
                                >
                                    {patents.map((item) => (
                                        <SelectableInfoCard
                                            key={item.id}
                                            value={item.id}
                                            fields={
                                                'companyName' in item
                                                    ? [
                                                          {label: COMPANY_FIELD_LABELS.name, value: item.companyName},
                                                          ...toPatentFields(item),
                                                      ]
                                                    : toPatentFields(item)
                                            }
                                        />
                                    ))}
                                </SelectableInfoCardGroup>
                            ) : null}
                            {patents?.length === 0 ? (
                                <EmptyState
                                    title={
                                        isPatentSearch
                                            ? INNOVATION_GROWTH_PATENT_NOT_FOUND
                                            : INNOVATION_GROWTH_NO_PATENT
                                    }
                                    className={LIST_STATE_CLASS_NAME}
                                />
                            ) : null}
                            <ul className="typo-caption-regular text-foreground-subtle flex list-none flex-col">
                                {INNOVATION_GROWTH_PATENT_NOTES.map((note) => (
                                    <li key={note} className="flex">
                                        <ListMarker type="unordered-small" />
                                        <span className="min-w-0 break-keep">{note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ) : null}

                {/* 이용횟수 안내 — 특허를 불러온 뒤 보이고, 특허 유무에 따라 문구가 바뀐다. */}
                {isUsageShown ? (
                    <section
                        aria-labelledby="ig-usage-title"
                        className="border-subtle-3 bg-card flex flex-col gap-4 rounded-lg border px-6 py-6 md:px-10 md:py-8"
                    >
                        <div className="flex flex-col">
                            <h2 id="ig-usage-title" className="typo-title-l-bold text-foreground break-keep">
                                {usage.title}
                            </h2>
                            <p className="typo-body-xl-regular text-foreground-subtle mt-1 break-keep">
                                {usage.description}
                            </p>
                        </div>
                        <dl className="bg-surface-subtle typo-body-xl-regular flex flex-col gap-3 rounded-md p-6">
                            {usage.rows.map((row) => (
                                <div key={row.label} className="flex justify-between gap-4">
                                    <dt className="text-foreground-subtle shrink-0">{row.label}</dt>
                                    <dd
                                        className={
                                            row.isHighlighted
                                                ? 'typo-body-xl-medium text-primary text-end break-keep'
                                                : 'typo-body-xl-medium text-label-foreground text-end break-keep'
                                        }
                                    >
                                        {row.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                ) : null}
            </div>

            {/* [K-BIGx 보고서 출력] — 검색 결과가 있으면 보이고, 평소에는 꺼져 있다가 특허 카드를 골라야 켜진다. */}
            {isPrintShown ? (
                <div ref={printRef} className="flex justify-center">
                    <KbigxReportCreateDialog
                        companyName={reportCompanyName}
                        patent={patent ? toPatentFields(patent) : undefined}
                    >
                        <Button type="button" size="xl" disabled={!canPrint} aria-haspopup="dialog">
                            {INNOVATION_GROWTH_PRINT_LABEL}
                        </Button>
                    </KbigxReportCreateDialog>
                </div>
            ) : null}
        </div>
    )
}

export {InnovationGrowthReportLookup}
export type {InnovationGrowthReportLookupProps}
