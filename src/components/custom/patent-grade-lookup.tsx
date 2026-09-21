'use client'

import {useRef, useState, type ReactNode} from 'react'
import {Printer} from 'lucide-react'
import {EmptyState} from '@/components/composite/empty-state'
import {LoadingState} from '@/components/composite/loading-state'
import {StepNavigation} from '@/components/composite/step-navigation'
import {PatentGradeReport} from '@/components/custom/patent-grade-report'
import {cn} from '@/lib/utils'
import {
    findPatentGradeReport,
    getPatentGradeNotFoundMessage,
    PATENT_GRADE_REPORT_TITLE,
    PATENT_GRADE_SEARCHING,
    PATENT_SEARCH_EMPTY_ERROR,
    PATENT_SEARCH_TYPES,
    type PatentGradeReport as PatentGradeReportData,
    type PatentSearchType,
} from '@/content/service/patent-grade'
import {SelectSearchForm, type SelectSearchSubmit} from '@/components/composite/select-search-form'

// 특허 등급조회 — 검색해야 결과 보고서가 보인다. 기업 · 기관의 조회 화면(patent-grade-list)과 결과 화면(patent-grade-result)이
// 함께 쓰고, 넘기는 처음 값(searchDefaults · initialReport)만 다르다.
// 처음(검색 전): 결과 영역 없음 → [검색하기]: 검색 중 안내(스피너) → 결과 보고서, 또는 결과 없음 안내.
// [결과 보고서 출력]은 보고서가 검색되었을 때만 나타난다.
//
// [프론트엔드 연동] handleSearch 안의 findPatentGradeReport(목업)를 조회 API 로 바꾼다 — 요청 중에는 status 가
// 'loading' 이라 결과 자리에 '검색 중' 안내(스피너)가 보이고 [검색하기]도 스피너로 바뀐다.

type LookupStatus = 'idle' | 'loading' | 'found' | 'not-found'

// 목업 조회가 끝나기까지의 시간 — 검색 중 상태를 확인할 수 있게 둔다. API 연결 시 지운다.
const MOCK_LOOKUP_DELAY_MS = 800

type PatentGradeLookupProps = {
    /** 화면 제목 · 소개 — 검색 위에 놓인다. */
    intro: ReactNode
    /** 주의사항 — 결과 아래, 버튼 위에 놓인다. */
    notice: ReactNode
    /** 퍼블리싱 확인용 — true 면 처음부터 결과 자리에 검색 중 안내를 보인다(?loading=1). */
    isLoadingPreview?: boolean
    /**
     * 검색 칸에 기준별로 미리 넣어 둘 번호. 비우면 빈 칸으로 시작한다.
     * [퍼블리싱 확인용] 결과 화면(patent-grade-result/page.tsx)만 목업 보고서의 번호(MOCK_PATENT_SEARCH_DEFAULTS)를 넘긴다.
     */
    searchDefaults?: Partial<Record<PatentSearchType, string>>
    /**
     * 처음부터 보여 줄 검색 결과(결과 화면 corp-patent-evaluation-patent-grade-list-patent-grade-result).
     * 주면 결과 보고서가 보이는 상태로 시작한다. [프론트엔드 연동] 결과 화면은 주소의 검색 조건으로 조회한 보고서를 넘긴다.
     */
    initialReport?: PatentGradeReportData | null
}

const isPatentSearchType = (value: string): value is PatentSearchType =>
    PATENT_SEARCH_TYPES.some((type) => type.value === value)

const PatentGradeLookup = ({
    intro,
    notice,
    isLoadingPreview = false,
    searchDefaults,
    initialReport = null,
}: PatentGradeLookupProps) => {
    const getInitialStatus = (): LookupStatus => {
        if (isLoadingPreview) return 'loading'
        return initialReport ? 'found' : 'idle'
    }
    const [status, setStatus] = useState<LookupStatus>(getInitialStatus)
    const [report, setReport] = useState<PatentGradeReportData | null>(initialReport)
    const resultRef = useRef<HTMLDivElement>(null)
    // 결과 없음 안내에 넣을 검색 기준 이름(특허등록번호 · 특허출원번호) — 마지막으로 검색한 기준이다.
    const [searchedLabel, setSearchedLabel] = useState<string>(PATENT_SEARCH_TYPES[0].label)

    const handleSearch = ({type, value}: SelectSearchSubmit) => {
        if (!isPatentSearchType(type)) return

        setStatus('loading')
        setReport(null)
        setSearchedLabel(
            PATENT_SEARCH_TYPES.find((option) => option.value === type)?.label ?? PATENT_SEARCH_TYPES[0].label,
        )

        window.setTimeout(() => {
            const found = findPatentGradeReport({type, number: value})
            setReport(found)
            setStatus(found ? 'found' : 'not-found')
            // 결과가 바뀌었음을 알 수 있도록 결과 영역으로 포커스를 옮기고[7.2.1], 결과 카드 맨 위('특허평가 결과 보고서'
            // 제목)가 고정 헤더 바로 아래에 오도록 스크롤한다 — 포커스의 기본 스크롤은 요소를 '가장 가까운' 자리에만 맞춰
            // 제목이 헤더에 가리거나 표 중간부터 보인다. 동작 줄이기 설정에서는 즉시 이동한다[6.3.1].
            const result = resultRef.current
            if (!result) return
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            result.focus({preventScroll: true})
            result.scrollIntoView({block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
        }, MOCK_LOOKUP_DELAY_MS)
    }

    return (
        <>
            <div className={cn('grid-layout gap-y-10 pt-10 *:col-span-full', status !== 'found' && 'pb-15')}>
                {intro}

                <SelectSearchForm
                    options={PATENT_SEARCH_TYPES}
                    defaultValues={searchDefaults}
                    emptyError={PATENT_SEARCH_EMPTY_ERROR}
                    onSearch={handleSearch}
                    // [초기화] — 검색 칸과 함께 결과도 검색 전(결과 영역 없음)으로 되돌린다.
                    onReset={() => {
                        setStatus('idle')
                        setReport(null)
                    }}
                    isSearching={status === 'loading'}
                />

                {/* 결과 영역 — 검색 중 안내 · 결과 보고서 · 결과 없음을 한 자리에서 바꿔 보인다. 검색 전(idle)에는 아무것도 두지
                    않는다 — 영역을 감춰(hidden) 그리드 간격도 생기지 않게 한다. */}
                {/* 스크롤 여백 = 고정 헤더 높이 + 16 — 모바일 헤더 56 → 72(scroll-mt-18) · md~xl 헤더 100 → 112(scroll-mt-28) ·
                    xl 이상 헤더 112 → 128(scroll-mt-32). */}
                <div
                    ref={resultRef}
                    tabIndex={-1}
                    aria-live="polite"
                    className={cn(
                        'scroll-mt-18 outline-none md:scroll-mt-28 xl:scroll-mt-32',
                        status === 'idle' && 'hidden',
                    )}
                >
                    {/* 결과 없음 · 검색 중 — 시안(검색 결과 없음)대로 결과 보고서와 같은 카드(반경 16 · 여백 40/100)에 제목
                        '특허평가 결과 보고서'(24 Bold)를 두고, 40 아래 높이 208 자리 가운데에 안내(아이콘 32 · 16 Regular)를 둔다.
                        검색 중은 같은 자리에 도는 표시와 '검색 중' 안내다 — 두 상태의 카드 높이가 같아 바뀔 때 흔들리지 않는다. */}
                    {status === 'not-found' || status === 'loading' ? (
                        <section
                            aria-labelledby="patent-grade-result-title"
                            className="bg-card flex min-w-0 flex-col gap-10 rounded-lg px-6 py-10 md:px-12 xl:px-25"
                        >
                            <h2 id="patent-grade-result-title" className="typo-h4-bold text-foreground break-keep">
                                {PATENT_GRADE_REPORT_TITLE}
                            </h2>
                            {status === 'loading' ? (
                                <LoadingState title={PATENT_GRADE_SEARCHING} className="min-h-52" />
                            ) : (
                                <EmptyState
                                    title={getPatentGradeNotFoundMessage(searchedLabel)}
                                    className="min-h-52 break-keep"
                                />
                            )}
                        </section>
                    ) : null}
                    {status === 'found' && report ? <PatentGradeReport report={report} /> : null}
                </div>

                {notice}
            </div>
            {/* [결과 보고서 출력] — 보고서가 검색되었을 때만 보인다. 마지막 콘텐츠와 40 · 아래 60 은 StepNavigation(plain)이
                갖고, 버튼이 없을 때는 같은 아래 여백(60)을 위 그리드가 갖는다. */}
            {status === 'found' ? (
                <StepNavigation
                    appearance="plain"
                    next={{
                        children: (
                            <>
                                <Printer aria-hidden="true" />
                                결과 보고서 출력
                            </>
                        ),
                    }}
                />
            ) : null}
        </>
    )
}

export {PatentGradeLookup}
export type {PatentGradeLookupProps}
