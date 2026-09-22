'use client'

import {useEffect} from 'react'
import Image from 'next/image'
import {usePathname, useSearchParams} from 'next/navigation'
import {Award, Building2, Download, ExternalLink, ThumbsUp, TrendingUp, type LucideIcon} from 'lucide-react'
import {ButterflyBarChartSkeleton} from '@/components/composite/butterfly-bar-chart-skeleton'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {ComboBarLineChartSkeleton} from '@/components/composite/combo-bar-line-chart-skeleton'
import {DistributionCurveChartSkeleton} from '@/components/composite/distribution-curve-chart-skeleton'
import {SegmentMeterSkeleton} from '@/components/composite/segment-meter-skeleton'
import {GradeHistoryChartSkeleton} from '@/components/composite/grade-history-chart-skeleton'
import {GradeScaleGaugeSkeleton} from '@/components/composite/grade-scale-gauge-skeleton'
import {DivergingRankChartSkeleton} from '@/components/composite/diverging-rank-chart-skeleton'
import {showCheckToast} from '@/components/custom/check-toast'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {InfoTable} from '@/components/composite/info-table'
import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ColumnChart} from '@/components/custom/column-chart'
import {ComparisonRadarChart, ComparisonRadarLegend} from '@/components/custom/comparison-radar-chart'
import {SECTOR_COMPARISON_RADAR_STYLE} from '@/components/custom/comparison-radar-style'
import {GroupedColumnChart} from '@/components/custom/grouped-column-chart'
import {LineChart} from '@/components/custom/line-chart'
import {RatingMatrix} from '@/components/custom/rating-matrix'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import {RankPyramidChart} from '@/components/custom/rank-pyramid-chart'
import {ScoreGauge} from '@/components/custom/score-gauge'
import {SemicircleRatingGauge} from '@/components/custom/semicircle-rating-gauge'
import {WordCloud} from '@/components/custom/word-cloud'
import {
    INNOVATION_ISSUE_COLORS,
    INNOVATION_REPORT_BADGE,
    INNOVATION_REPORT_CREATED_TOAST,
    INNOVATION_REPORT_CREATED_QUERY,
    INNOVATION_REPORT_MORE_LABEL,
    INNOVATION_REPORT_PC_VIEW,
    INNOVATION_REPORT_PRINT_LABEL,
    INNOVATION_REPORT_VIEW_QUERY,
    INNOVATION_REPORT_WINDOW_HEIGHT,
    INNOVATION_REPORT_WINDOW_WIDTH,
    INNOVATION_REPORT_SECTIONS,
    INNOVATION_REPORT_TAB_QUERY,
    getTechIndexGrade,
    INNOVATION_CREDIT_VISIBILITY,
    isReportTab,
    type InnovationGrowthReport,
    type InnovationReportSectionId,
    type InnovationStatId,
} from '@/content/service/k-bigx-innovation-report'
import {toCriRatingData} from '@/content/service/cri-grades'
import {cn} from '@/lib/utils'
import {Card, SectionTitle, StatBox} from '@/components/custom/innovation-growth-report-parts'
import {InnovationGrowthReportCompany} from '@/components/custom/innovation-growth-report-company'
import {InnovationGrowthReportTech} from '@/components/custom/innovation-growth-report-tech'
import {InnovationGrowthReportActivity} from '@/components/custom/innovation-growth-report-activity'
import {InnovationGrowthReportTechIndex} from '@/components/custom/innovation-growth-report-tech-index'
import {InnovationGrowthReportCredit} from '@/components/custom/innovation-growth-report-credit'
import emblemGovernmentImage from '@public/images/emblem-government.webp'

// K-BIGx 기업혁신성장 보고서 — 새 창으로 여는 문서(보고서 출력 · 진단브리핑).
// 조회 화면의 [K-BIGx 보고서 출력] → 보고서 생성 모달 [보고서 생성] → 조회횟수 차감안내 모달 [이용권 사용]을 거쳐 열린다.
//
// 짜임(위에서 아래로): 남색 머리(배지 · 제목 · 기업명 | 발급일 · [보고서 출력]) → 구성 항목 탭 → 진단브리핑
//   기업 정보(표) → 기술혁신정보(보유기술 도넛 · 관련 기업/특허 현황 · R&D 이슈 워드클라우드 · 정부 R&D 접수현황)
//   → 혁신성장역량지수(점수 게이지 · 동일업종 상위 %) → 신용/재무 현황(신용등급 게이지 · 재무비율진단 · 부문별 비교 레이더 ·
//   최근 3개년 재무 표 + 묶음 막대) → 활동성 정보(분기별 종업원수 선 · 인당 매출액 막대).
// 문서 폭은 콘텐츠 상한 1200 이고, 좁은 창에서는 구획이 1열(모바일) · 2열(태블릿)로 내려앉는다. 표만 칸이 찌그러지지 않게
// 제 상자 안에서 가로 스크롤한다.
// 인쇄물에서는 머리의 버튼 · 탭이 사라지고 구획 카드가 쪽 경계에서 나뉘지 않는다.
//
// 차트는 모두 프로젝트 공통 차트 컴포넌트다 — 여기서는 데이터를 넘기고 카드 안에 놓기만 한다.
// [프론트엔드 연동] 화면 값은 전부 report(InnovationGrowthReport) 한 개에서 읽는다 — 지금은 getInnovationGrowthReport 가
//   퍼블리싱용 샘플을 돌려주므로, 그 함수를 보고서 조회 API 로 바꾸면 이 컴포넌트는 고칠 것이 없다.

const numberFormatter = new Intl.NumberFormat('ko-KR')
// 정보가 없는 값의 표시.
const EMPTY_VALUE = '-'
// 차감 알림 식별자 — 같은 알림이 겹쳐 뜨지 않게 한다(새로고침 · 다시 그리기).
const INNOVATION_REPORT_CREATED_TOAST_ID = 'k-bigx-innovation-report-created'
// [퍼블리싱 확인용] 토스트를 보려고 ?from=use 없이도 화면을 열면 차감 알림을 띄운다.
// 연동할 때는 false 로 바꾸거나 이 상수를 지운다 — 그러면 [이용권 사용]을 거쳐 열렸을 때(?from=use)만 뜬다.
const PUBLISHING_ALWAYS_SHOW_CREATED_TOAST = true
// 최근 3개년 재무 현황 막대 색 — 오래된 해부터 navy.500 · blue.500 · purple.500.
const STATEMENT_YEAR_COLORS = ['var(--raw-navy-500)', 'var(--raw-blue-500)', 'var(--raw-purple-500)'] as const

// ── 조각 ─────────────────────────────────────────────────────────────────────────

// 관련 기업 및 특허현황 수치별 선 아이콘(16) — 데이터의 stat.id 로 고른다.
const INNOVATION_STAT_ICONS: Record<InnovationStatId, LucideIcon> = {
    companies: Building2,
    patents: Award,
    'high-growth-companies': TrendingUp,
    'high-growth-patents': ThumbsUp,
}

// 최근 3개년 재무 표 — 4칸 균등 · 맨 위 선 gray.600 · 줄마다 아래 선(gray.100) · 줄 높이 45(여백 12/16 + 글자 21).
// 세로선은 이름 칸(구분) 오른쪽 하나뿐이고 바깥 좌우 선은 없다.
// 머리 줄과 이름 칸은 옅은 파란 면(primary-subtle)에 14 Bold · 14 Medium, 값은 14 Regular(gray.700) 가운데 정렬이다.
// 칸이 좁을 때(모바일 · lg 에서 표가 그래프 옆에 설 때 4칸 ≈ 74)는 좌우 여백을 8 로 줄여 '2022년' · '18,768' 이 한 줄에 들어가게 한다.
const STATEMENT_CELL_CLASS_NAME = 'border-subtle-3 border-b px-2 pt-3 pb-2.75 text-center md:px-4 lg:px-2 xl:px-4'
const STATEMENT_NAME_COLUMN_CLASS_NAME = 'border-subtle-3 border-r'
const STATEMENT_HEAD_CLASS_NAME = cn(STATEMENT_CELL_CLASS_NAME, 'bg-primary-subtle text-foreground whitespace-nowrap')

const StatementTable = ({years, statements}: Pick<InnovationGrowthReport['creditFinance'], 'years' | 'statements'>) => (
    // 맨 위 선(gray.600)은 표가 아니라 감싸는 상자에 긋는다 — 표(border-collapse)에 그으면 구분 칸의 세로선(gray.100)이
    // 위 선과 만나는 모서리를 덮어 위 선이 끊겨 보인다. 상자 선 아래에서 세로선이 시작되게 한다.
    <div className="border-t-foreground-subtle overflow-x-auto border-t contain-inline-size">
        <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">최근 3개년 재무 현황(단위: 백만원)</caption>
            <thead>
                <tr>
                    <th
                        scope="col"
                        className={cn(STATEMENT_HEAD_CLASS_NAME, STATEMENT_NAME_COLUMN_CLASS_NAME, 'typo-body-l-bold')}
                    >
                        구분
                    </th>
                    {years.map((year) => (
                        <th key={year} scope="col" className={cn(STATEMENT_HEAD_CLASS_NAME, 'typo-body-l-bold')}>
                            {year}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {statements.map((row) => (
                    <tr key={row.label}>
                        <th
                            scope="row"
                            className={cn(
                                STATEMENT_HEAD_CLASS_NAME,
                                STATEMENT_NAME_COLUMN_CLASS_NAME,
                                'typo-body-l-medium',
                            )}
                        >
                            {row.label}
                        </th>
                        {row.values.map((value, index) => (
                            <td
                                key={years[index]}
                                className={cn(
                                    STATEMENT_CELL_CLASS_NAME,
                                    'typo-body-l-regular text-label-foreground tabular-nums',
                                )}
                            >
                                {numberFormatter.format(value)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

// ── 문서 ─────────────────────────────────────────────────────────────────────────

type InnovationGrowthReportDocumentProps = {
    report: InnovationGrowthReport
    /** [이용권 사용]을 거쳐 열렸는지 — true 면 '이용권이 차감되어 보고서를 생성하였습니다.' 알림을 띄운다. */
    isJustCreated?: boolean
}

// 혁신성장역량지수 점수 — 게이지와 같이 소수 첫째 자리까지(73.8).
const techIndexScoreFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

const InnovationGrowthReportDocument = ({report, isJustCreated = false}: InnovationGrowthReportDocumentProps) => {
    // [이용권 사용]을 거쳐 열렸을 때(?from=use) 차감 알림을 한 번 띄운다 — 확인 토스트(체크 표시 · 머리 아래 가운데 · 4초).
    // 이 문서의 effect 가 루트의 Toaster 보다 먼저 돌아 바로 부르면 아무도 받지 못하므로 한 틱 미룬다.
    // [프론트엔드 연동] 차감 성공 여부는 새 창을 여는 쪽(조회횟수 차감안내 모달)이 알고 있다 — 성공했을 때만 ?from=use 를 붙여 연다.
    useEffect(() => {
        if (!isJustCreated && !PUBLISHING_ALWAYS_SHOW_CREATED_TOAST) return
        const timer = window.setTimeout(
            () => showCheckToast(INNOVATION_REPORT_CREATED_TOAST, {id: INNOVATION_REPORT_CREATED_TOAST_ID}),
            0,
        )
        return () => window.clearTimeout(timer)
    }, [isJustCreated])

    // 기업신용등급 — 등급 코드를 CRI 등급표로 풀어 게이지 데이터(등급명 · 채움 비율)를 만든다.
    // 모바일 [더보기]가 여는 PC 화면 주소 — 지금 주소에 ?view=pc 를 붙인다. 차감 알림 표시(?from=use)는 새 창에서 다시 뜨지 않게 뺀다.
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pcViewParams = new URLSearchParams(searchParams.toString())
    pcViewParams.set(INNOVATION_REPORT_VIEW_QUERY, INNOVATION_REPORT_PC_VIEW)
    pcViewParams.delete(INNOVATION_REPORT_CREATED_QUERY)
    const pcViewHref = `${pathname}?${pcViewParams.toString()}`
    // 지금 탭 — ?tab= 값이 화면이 있는 탭이면 그 탭, 아니면 첫 탭(진단브리핑). 보고서는 한 페이지이고 탭은 주소 쿼리로만 바뀐다.
    const tabParam = searchParams.get(INNOVATION_REPORT_TAB_QUERY)
    const activeTab: InnovationReportSectionId =
        tabParam && isReportTab(tabParam) ? tabParam : INNOVATION_REPORT_SECTIONS[0].id
    // 진단브리핑만 반응형이고, 나머지 탭은 PC 폭(1280)만 그린다 — 창이 좁으면 가로 스크롤.
    const isPcOnlyTab = activeTab !== INNOVATION_REPORT_SECTIONS[0].id
    // 혁신성장역량지수 게이지 색 · 상태 이름 · 요약 문장은 점수 하나로 정한다(Tech-Index 탭과 같은 점수 구간).
    const techIndexGrade = getTechIndexGrade(report.techIndex.score)
    const techIndexScoreText = `${techIndexScoreFormatter.format(report.techIndex.score)}점`
    const activeSection =
        INNOVATION_REPORT_SECTIONS.find((section) => section.id === activeTab) ?? INNOVATION_REPORT_SECTIONS[0]
    // 탭을 바꾸면 주소의 ?tab= 만 바꾼다(뒤로 가기로 앞 탭에 돌아온다). Next 는 history.pushState 를 useSearchParams 와 맞춰 준다.
    // 보고서 id · 케이스 등 쿼리는 그대로 두고, 차감 알림 표시(?from=use)만 뺀다 — 탭을 옮길 때마다 알림이 다시 뜨지 않게.
    const selectTab = (value: string) => {
        if (!isReportTab(value)) return
        const nextParams = new URLSearchParams(searchParams.toString())
        if (value === INNOVATION_REPORT_SECTIONS[0].id) nextParams.delete(INNOVATION_REPORT_TAB_QUERY)
        else nextParams.set(INNOVATION_REPORT_TAB_QUERY, value)
        nextParams.delete(INNOVATION_REPORT_CREATED_QUERY)
        const query = nextParams.toString()
        window.history.pushState(null, '', query ? `${pathname}?${query}` : pathname)
    }
    const creditRating = toCriRatingData(report.creditFinance.rating.grade, [...report.creditFinance.rating.details])

    return (
        <main
            id="main"
            tabIndex={-1}
            className={cn(
                'bg-background text-foreground print-exact min-h-dvh',
                // 진단브리핑 외 탭은 PC 폭(1280)만 그린다 — 창이 좁으면 문서 폭을 지키고 가로로 넘긴다.
                isPcOnlyTab && 'min-w-320',
            )}
        >
            {/* 머리 — 남색 면 전체 폭, 안쪽은 콘텐츠 폭 1200. 모바일은 버튼을 제목 아래로 내린다. */}
            <header className="bg-tab-pill-active text-tab-pill-active-foreground break-after-avoid">
                <div
                    className={cn(
                        'max-w-content mx-auto flex flex-col items-start gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-12 md:px-6 xl:px-0',
                        isPcOnlyTab && 'px-0 md:px-0',
                    )}
                >
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <p className="bg-info-50 text-info-600 typo-body-l-medium flex min-h-7 w-fit items-center rounded-full px-4">
                            {INNOVATION_REPORT_BADGE}
                        </p>
                        <div className="flex flex-col">
                            <h1 className="typo-h1-bold wrap-break-word break-keep">{report.title}</h1>
                            <p className="typo-body-l-regular flex flex-wrap items-center gap-x-4">
                                <span>{report.companyName}</span>
                                <span aria-hidden="true" className="bg-tab-pill-active-foreground/40 h-3 w-px" />
                                <span>발급일 {report.issuedAt}</span>
                            </p>
                        </div>
                    </div>
                    {/* 인쇄물에서는 스스로 사라진다 — 종이에 남아도 누를 수 없다. 모바일(768 미만)은 진단브리핑만 보이므로 출력 대신
                        [더보기]를 둔다 — 모든 탭이 있는 PC 화면(?view=pc, 뷰포트 1280)을 새 창으로 열어 확대 · 축소하며 본다.
                        [퍼블리싱 전용] [보고서 출력]은 아직 동작이 없는 버튼이다 — 출력 범위 · 방식이 정해지면 onClick 을 연결한다. */}
                    <Button
                        type="button"
                        variant="tertiary"
                        size="md"
                        className="bg-card shrink-0 gap-1 max-md:hidden md:self-center print:hidden"
                    >
                        <Download aria-hidden="true" />
                        {INNOVATION_REPORT_PRINT_LABEL}
                    </Button>
                    <Button
                        asChild
                        variant="tertiary"
                        size="md"
                        className="bg-card shrink-0 gap-1 md:hidden print:hidden"
                    >
                        <NewWindowLink
                            href={pcViewHref}
                            width={INNOVATION_REPORT_WINDOW_WIDTH}
                            height={INNOVATION_REPORT_WINDOW_HEIGHT}
                            windowName="k-bigx-innovation-report-pc"
                            // 창 폭이 곧 PC 화면이라 화면 폭으로 줄이지 않는다.
                            fitToScreen={false}
                        >
                            {INNOVATION_REPORT_MORE_LABEL}
                            <ExternalLink aria-hidden="true" />
                        </NewWindowLink>
                    </Button>
                </div>
            </header>

            <div
                className={cn(
                    'max-w-content mx-auto flex flex-col gap-10 px-4 py-10 md:px-6 xl:px-0 print:block print:space-y-10',
                    // PC 전용 탭은 창 폭과 무관하게 콘텐츠 폭 1200 을 쓴다(좌우 여백은 문서 폭 1280 이 만든다).
                    isPcOnlyTab && 'px-0 md:px-0',
                )}
            >
                {/* 구성 항목 탭 — 주소의 ?tab= 으로 고른다(없으면 진단브리핑). 탭을 바꾸면 주소만 바꾸고 서버에 다시 묻지 않는다 —
                    한 보고서의 모든 탭 데이터가 report 하나에 들어 있다.
                    모바일(768 미만)은 진단브리핑만 보여 주므로 탭을 숨긴다 — 다른 항목은 [더보기](PC 화면)에서 본다. */}
                <Tabs value={activeTab} onValueChange={selectTab} className="max-md:hidden print:hidden">
                    <TabsList variant="pill-outline" aria-label="보고서 구성 항목">
                        {INNOVATION_REPORT_SECTIONS.map((section) => (
                            <TabsTrigger key={section.id} value={section.id}>
                                {section.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* 탭 제목 줄 — 탭과는 60 을 띄우므로 문서 간격(40)에 20(pt-5)을 더한다(탭이 없는 모바일은 더하지 않는다). 날짜는 제목 높이의 세로 가운데. */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 md:pt-5">
                    <h2 className="typo-h4-bold text-foreground">{activeSection.label}</h2>
                    <p className="typo-body-l-regular text-foreground-subtle">보고서 생성일자 · {report.createdAt}</p>
                </div>

                {activeTab === 'company' ? (
                    <InnovationGrowthReportCompany status={report.companyStatus} />
                ) : activeTab === 'activity' ? (
                    <InnovationGrowthReportActivity
                        detail={report.activityDetail}
                        employees={report.activity.employees}
                        salesPerEmployee={report.activity.salesPerEmployee}
                    />
                ) : activeTab === 'credit-finance' ? (
                    <InnovationGrowthReportCredit
                        detail={report.creditDetail}
                        rating={creditRating}
                        visibility={INNOVATION_CREDIT_VISIBILITY[report.viewerCase]}
                    />
                ) : activeTab === 'tech-index' ? (
                    <InnovationGrowthReportTechIndex
                        detail={report.techIndexDetail}
                        score={report.techIndex.score}
                        companyName={report.companyName}
                        baseDate={report.createdAt}
                    />
                ) : activeTab === 'innovation' ? (
                    <InnovationGrowthReportTech
                        detail={report.techInnovation}
                        issues={report.innovation.issues}
                        issueColors={INNOVATION_ISSUE_COLORS}
                    />
                ) : (
                    <>
                        {/* 기업 정보 */}
                        <section aria-labelledby="ig-report-company" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-company" title="기업 정보" />
                            <InfoTable
                                aria-label="기업 정보"
                                items={report.company.rows.map((row) => ({key: row.label, ...row}))}
                            />
                        </section>

                        {/* 기술혁신정보 */}
                        <section aria-labelledby="ig-report-innovation" className="flex flex-col gap-4">
                            <SectionTitle
                                id="ig-report-innovation"
                                title="기술혁신정보"
                                aside={report.subCategoryName}
                            />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card title="기업 보유기술" aside="소분류 기준">
                                    <PercentageDonutChart
                                        animate={false}
                                        data={[...report.innovation.technologies]}
                                        // 비중 · 건수가 범례에 모두 적혀 있어 hover 말풍선은 두지 않는다.
                                        showTooltip={false}
                                        ariaLabel="기업 보유기술 소분류별 비중과 건수"
                                    />
                                </Card>
                                <Card title="관련 기업 및 특허현황">
                                    <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
                                        {report.innovation.stats.map((stat) => {
                                            const StatIcon = INNOVATION_STAT_ICONS[stat.id]
                                            return (
                                                <StatBox
                                                    key={stat.id}
                                                    label={stat.label}
                                                    value={numberFormatter.format(stat.value)}
                                                    unit={stat.unit}
                                                    icon={
                                                        <StatIcon
                                                            aria-hidden="true"
                                                            className="size-icon-sm shrink-0"
                                                        />
                                                    }
                                                />
                                            )
                                        })}
                                    </div>
                                    <dl className="flex flex-col gap-2">
                                        {report.innovation.averages.map((row) => (
                                            <div key={row.label} className="flex items-center justify-between gap-4">
                                                <dt className="typo-body-l-regular text-label-foreground">
                                                    {row.label}
                                                </dt>
                                                <dd className="m-0">
                                                    <span className="typo-body-xl-bold text-foreground">
                                                        {row.value}
                                                    </span>
                                                    <span className="typo-body-xl-regular text-label-foreground ms-1">
                                                        {row.unit}
                                                    </span>
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </Card>
                                <Card title="R&D 이슈">
                                    <WordCloud
                                        words={[...report.innovation.issues]}
                                        colors={INNOVATION_ISSUE_COLORS}
                                        ariaLabel="최근 연구개발 이슈 키워드"
                                        // PC(xl)는 높이 216 고정. 그 아래(태블릿 2열)는 옆 카드(정부 R&D)가 더 높아 아래가 비므로
                                        // 216 을 최소로 두고 카드 높이를 채운다. 단어 크기는 자리 높이에 맞춰 다시 그려진다.
                                        className="h-auto min-h-54 flex-1 xl:h-54 xl:flex-none"
                                    />
                                </Card>
                                <Card title="정부 R&D사업 접수현황" aside={`기준일자 · ${report.createdAt}`}>
                                    {/* 부처 목록과 안내문은 8 간격으로 붙는다(카드 기본 간격 24 와 다르다). */}
                                    <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
                                            {report.innovation.rnd.map((item) => (
                                                <StatBox
                                                    key={item.label}
                                                    label={item.label}
                                                    value={
                                                        item.value === null
                                                            ? EMPTY_VALUE
                                                            : numberFormatter.format(item.value)
                                                    }
                                                    unit={item.value === null ? undefined : item.unit}
                                                    labelClassName="typo-body-m-regular text-foreground-subtle"
                                                    icon={
                                                        // 정부 상징 문양 — 옆에 부처명이 있어 장식이다(alt="")[5.1.1].
                                                        <Image
                                                            src={emblemGovernmentImage}
                                                            alt=""
                                                            sizes="24px"
                                                            className="size-icon-lg shrink-0"
                                                        />
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <p className="typo-caption-regular text-foreground-subtle break-keep">
                                            {report.innovation.rndNote}
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </section>

                        {/* 혁신성장역량지수 — 점수 게이지 카드 · 동일업종 순위 피라미드 카드 · 요약 상자. */}
                        <section aria-labelledby="ig-report-tech-index" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-tech-index" title="혁신성장역량지수" />
                            {/* 두 카드는 lg(1024) 이상에서만 나란히 둔다 — 태블릿에서 나란히 두면 피라미드 카드가 글자 · 피라미드를
                        위아래로 쌓아 높아지고, 옆 게이지 카드가 같은 높이로 늘어나 아래가 크게 빈다. */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <Card aside={report.techIndex.scoreNote}>
                                    <ScoreGauge
                                        score={report.techIndex.score}
                                        statusLabel={techIndexGrade.label}
                                        tone={techIndexGrade.tone}
                                        caption={`기준일자 · ${report.createdAt}`}
                                        ariaLabel={`혁신성장역량지수 ${techIndexScoreText}, ${techIndexGrade.label}`}
                                    />
                                </Card>
                                {/* 태블릿(카드가 한 줄을 다 씀)에서는 글자 · 피라미드 묶음을 가운데로, lg 이상은 왼쪽 기준. */}
                                <Card className="justify-center">
                                    <RankPyramidChart
                                        percentile={report.techIndex.industryPercentile}
                                        groupLabel={report.techIndex.industryLabel}
                                        ariaLabel={`동일업종(${report.techIndex.industryLabel}) 기준 상위 ${report.techIndex.industryPercentile}%`}
                                        className="pl-5 md:justify-center lg:justify-start"
                                    />
                                </Card>
                            </div>
                            {/* 카드와 요약 상자 사이는 24 — 구획 간격(16)에 8(mt-2)을 더한다. */}
                            {/* 모바일에서는 여러 줄로 접히므로 왼쪽 정렬, 태블릿 이상(한두 줄)은 가운데 정렬. */}
                            <p className="bg-navy-100 border-navy-200 text-navy-600 typo-body-xl-regular mt-2 rounded-sm border px-5 py-5 text-start break-keep md:text-center">
                                기술신용평가(TCB) 시 제출한 정보를 기반으로 평가한 혁신성장역량지수(Tech-Index)는{' '}
                                <strong className="typo-body-xl-bold">{techIndexScoreText}</strong>으로{' '}
                                <strong className="typo-body-xl-bold">{techIndexGrade.summaryLabel}</strong>
                            </p>
                        </section>

                        {/* 신용/재무 현황 */}
                        <section aria-labelledby="ig-report-finance" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-finance" title="신용/재무 현황" />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <Card title="기업신용등급">
                                    <SemicircleRatingGauge
                                        data={creditRating}
                                        title="기업신용등급"
                                        ariaLabel={`기업신용등급 ${creditRating.label}, ${creditRating.description}`}
                                    />
                                </Card>
                                <Card title="재무비율진단">
                                    <RatingMatrix
                                        ariaLabel="재무비율진단 — 항목별 수준"
                                        rows={report.creditFinance.ratios}
                                    />
                                </Card>
                                {/* 태블릿(md 2열)에서 홀로 남는 셋째 카드는 한 줄을 다 쓴다 — 오른쪽 빈 칸이 생기지 않게. */}
                                <Card
                                    className="md:col-span-2 xl:col-span-1"
                                    title="부문별 비교"
                                    aside={
                                        <ComparisonRadarLegend
                                            primaryLabel="조회기업"
                                            comparisonLabel="업종평균"
                                            primaryColor={SECTOR_COMPARISON_RADAR_STYLE.primaryColor}
                                            comparisonColor={SECTOR_COMPARISON_RADAR_STYLE.comparisonColor}
                                            comparisonFillOpacity={SECTOR_COMPARISON_RADAR_STYLE.comparisonFillOpacity}
                                            className="justify-end"
                                        />
                                    }
                                >
                                    <ComparisonRadarChart
                                        animate={false}
                                        data={report.creditFinance.comparison.map((item) => ({
                                            id: item.label,
                                            label: item.label,
                                            primaryValue: item.company,
                                            comparisonValue: item.industry,
                                        }))}
                                        {...SECTOR_COMPARISON_RADAR_STYLE}
                                        primaryLabel="조회기업"
                                        comparisonLabel="업종평균"
                                        ariaLabel="부문별 비교 — 조회기업과 업종평균"
                                    />
                                </Card>
                            </div>
                            <Card title="최근 3개년 재무 현황" aside="단위 : 백만원">
                                {/* 표 359 : 그래프 767 비율 · 간격 24. lg(1024) 부터 나란히 — 그래프 칸이 576 이상이 되는 폭이다. 그 아래는 표 위 · 그래프 아래로 쌓인다. */}
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,359fr)_minmax(0,767fr)]">
                                    <StatementTable
                                        years={report.creditFinance.years}
                                        statements={report.creditFinance.statements}
                                    />
                                    <GroupedColumnChart
                                        animate={false}
                                        data={report.creditFinance.statements.map((row) => ({
                                            id: row.label,
                                            label: row.label,
                                            values: Object.fromEntries(
                                                report.creditFinance.years.map((year, index) => [
                                                    year,
                                                    row.values[index],
                                                ]),
                                            ),
                                        }))}
                                        series={report.creditFinance.years.map((year, index) => ({
                                            key: year,
                                            label: year,
                                            color: STATEMENT_YEAR_COLORS[index % STATEMENT_YEAR_COLORS.length],
                                        }))}
                                        ariaLabel="최근 3개년 재무 현황 항목별 연도 비교"
                                        variant="cells"
                                        showValueLabels
                                        // 값이 막대 위에 모두 적혀 있어 hover 말풍선은 두지 않는다.
                                        showTooltip={false}
                                    />
                                </div>
                            </Card>
                        </section>

                        {/* 활동성 정보 */}
                        <section aria-labelledby="ig-report-activity" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-activity" title="활동성 정보" />
                            {/* 선 카드 792 : 막대 카드 384 비율. lg(1024) 부터 나란히 — 선 그래프 자리가 576 이상이 되는 폭이다. */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,792fr)_minmax(0,384fr)]">
                                <Card title="분기별 종업원수" aside="단위 : 명">
                                    <LineChart
                                        animate={false}
                                        data={report.activity.employees.map((item) => ({
                                            id: item.label,
                                            label: item.label,
                                            values: {employees: item.value},
                                        }))}
                                        series={[{key: 'employees', label: '종업원수', color: 'var(--raw-purple-600)'}]}
                                        variant="area"
                                        appearance="cells"
                                        showLegend={false}
                                        showValueLabels
                                        // 값이 점 위에 모두 적혀 있어 hover 말풍선은 두지 않는다.
                                        showTooltip={false}
                                        ariaLabel="분기별 종업원수 추이"
                                    />
                                </Card>
                                <Card title="인당 매출액" aside="단위 : 백만원">
                                    <ColumnChart
                                        animate={false}
                                        data={report.activity.salesPerEmployee.map((item) => ({
                                            id: item.label,
                                            label: item.label,
                                            value: item.value,
                                        }))}
                                        valueFractionDigits={1}
                                        barWidth={48}
                                        color="var(--raw-blue-500)"
                                        variant="cells"
                                        showTooltip={false}
                                        ariaLabel="연도별 인당 매출액"
                                    />
                                </Card>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    )
}

// ── 불러오는 중(스켈레톤) ──────────────────────────────────────────────────────────
// 보고서를 받는 동안 같은 자리에 같은 틀을 그린다 — 라우트의 loading.tsx 가 쓴다.
// 데이터와 무관한 것(배지 · 탭 · 구획 · 카드 제목 · 고정 문구)은 그대로 보이고, 데이터 자리만 회색 막대 ·
// ChartSkeleton 으로 비운다. 격자 · 간격은 위 문서와 같은 조각(Card · SectionTitle)을 써서 받은 뒤에도 흔들리지 않는다.
// 스크린리더에는 '불러오는 중' 한 번만 알린다(aria-busy · 상태 문구) — 차트 스켈레톤마다의 상태 문구는 그대로 둔다.
const SKELETON_COMPANY_ROW_COUNT = 6
const SKELETON_STAT_COUNT = 4
const SKELETON_AVERAGE_COUNT = 3

const SkeletonBar = ({className}: {className?: string}) => <Skeleton className={cn('h-4 rounded-sm', className)} />

// 카드 머리 줄 범례 자리 — 16 견본 + 이름(14 Regular 한 줄 높이).
const SkeletonLegend = ({count}: {count: number}) => (
    <div className="flex justify-end gap-6">
        {Array.from({length: count}, (_, index) => (
            <div key={index} className="flex h-lh items-center gap-2">
                <Skeleton className="size-4 rounded-none" />
                <SkeletonBar className="h-3 w-12" />
            </div>
        ))}
    </div>
)

// 최근 3개년 재무 표 자리 — 실제 표와 같은 칸 클래스(테두리 · 여백 · 파란 머리 면)에 글자 대신 막대를 둬 줄 높이(46)가 같다.
const SKELETON_STATEMENT_COLUMN_COUNT = 4
// 혁신성장역량지수 안내 문구가 모바일에서 더 접히는 줄 수(한 줄 + 3).
const SKELETON_NOTE_MOBILE_EXTRA_LINES = 3
const StatementTableSkeleton = () => (
    // 실제 표와 같이 맨 위 선은 감싸는 상자에 긋는다.
    <div className="border-t-foreground-subtle border-t" aria-hidden="true">
        <table className="w-full table-fixed border-collapse">
            <tbody>
                {Array.from({length: SKELETON_COMPANY_ROW_COUNT + 1}, (_, row) => (
                    <tr key={row}>
                        {Array.from({length: SKELETON_STATEMENT_COLUMN_COUNT}, (_, column) => (
                            <td
                                key={column}
                                className={cn(
                                    row === 0 || column === 0 ? STATEMENT_HEAD_CLASS_NAME : STATEMENT_CELL_CLASS_NAME,
                                    'typo-body-l-regular',
                                    column === 0 && STATEMENT_NAME_COLUMN_CLASS_NAME,
                                )}
                            >
                                <span className="flex h-lh items-center justify-center">
                                    <SkeletonBar className="h-3 w-full max-w-12" />
                                </span>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

const SkeletonStatGrid = () => (
    <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
        {Array.from({length: SKELETON_STAT_COUNT}, (_, index) => (
            <div key={index} className="bg-surface-subtle flex flex-col gap-3 rounded-sm px-5 py-4">
                <SkeletonBar className="w-20" />
                <SkeletonBar className="ms-auto h-6 w-16" />
            </div>
        ))}
    </div>
)

// 표 자리 — 실제 보고서 표(ReportTable)와 같은 머리 면 · 줄 선 · 줄 높이(여백 12 + 글자 21)에 글자 대신 막대를 둔다.
// headRows 2 는 두 단 머리(거래처 표), isBadgeRow 는 뱃지가 있어 줄이 더 높은 표에 쓴다.
const ReportTableSkeleton = ({
    columns,
    rows,
    headRows = 1,
    isBadgeRow = false,
}: {
    columns: number
    rows: number
    headRows?: number
    /** 값 줄에 뱃지(높이 28)가 있는 표 — 거래처 표처럼 줄이 더 높다. */
    isBadgeRow?: boolean
}) => (
    <div className="border-t-foreground-subtle border-t" aria-hidden="true">
        {Array.from({length: headRows + rows}, (_, row) => (
            <div
                key={row}
                className={cn('border-subtle-3 grid border-b', row < headRows ? 'bg-primary-subtle' : 'bg-card')}
                style={{gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`}}
            >
                {Array.from({length: columns}, (_, column) => (
                    <span
                        key={column}
                        className={cn(
                            'typo-body-l-regular box-content flex items-center justify-center px-4 pt-3 pb-2.75',
                            isBadgeRow && row >= headRows ? 'h-7' : 'h-lh',
                        )}
                    >
                        <SkeletonBar className="h-3 w-full max-w-16" />
                    </span>
                ))}
            </div>
        ))}
    </div>
)

// 기업현황 탭 스켈레톤 — 실제 탭(innovation-growth-report-company.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const COMPANY_SKELETON_OVERVIEW_COUNT = 12
const COMPANY_SKELETON_IP_COUNT = 8
const CompanyTabSkeleton = () => (
    <>
        <section aria-labelledby="ig-company-skeleton-overview" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-overview" title="개요" />
            <InfoTable
                layout="pairs"
                aria-label="기업 개요"
                items={Array.from({length: COMPANY_SKELETON_OVERVIEW_COUNT}, (_, index) => ({
                    key: String(index),
                    label: (
                        <span className="typo-body-l-regular flex h-lh items-center justify-center">
                            <SkeletonBar className="w-16" />
                        </span>
                    ),
                    value: (
                        <span className="typo-body-l-regular flex h-lh items-center">
                            <SkeletonBar className="w-full max-w-60" />
                        </span>
                    ),
                }))}
            />
        </section>
        <section aria-labelledby="ig-company-skeleton-management" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-management" title="경영진 및 주주현황" />
            <div className="grid grid-cols-2 gap-6">
                {['경영진 현황', '주주 현황'].map((title, index) => (
                    <div key={title} className="flex flex-col gap-2">
                        <h4 className="typo-body-xl-bold text-foreground">{title}</h4>
                        <ReportTableSkeleton columns={index === 0 ? 3 : 4} rows={4} />
                    </div>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-company-skeleton-affiliates" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-affiliates" title="관계기업 현황" date="단위 : 백만원" />
            <ReportTableSkeleton columns={6} rows={3} />
        </section>
        <section aria-labelledby="ig-company-skeleton-ip" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-ip" title="특허 및 인증현황" />
            <div className="grid grid-cols-4 gap-6">
                {Array.from({length: COMPANY_SKELETON_IP_COUNT}, (_, index) => (
                    <div key={index} className="bg-card flex flex-col gap-3 rounded-sm px-5 py-4">
                        <SkeletonBar className="w-20" />
                        <SkeletonBar className="ms-auto h-6 w-16" />
                    </div>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-company-skeleton-finance" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-finance" title="재무현황" />
            <div className="grid grid-cols-2 gap-6">
                <Card title="재무상태">
                    <ReportTableSkeleton columns={4} rows={3} />
                    <ChartSkeleton type="overlay-column" label="재무상태를 불러오는 중입니다." />
                </Card>
                <Card title="손익현황">
                    <ReportTableSkeleton columns={4} rows={3} />
                    <ChartSkeleton type="overlay-column" label="손익현황을 불러오는 중입니다." />
                </Card>
                <Card title="주요재무비율" aside="단위 : %">
                    <ReportTableSkeleton columns={4} rows={5} />
                    <ChartSkeleton type="columns-line" label="주요재무비율을 불러오는 중입니다." />
                </Card>
                <Card title="현금흐름">
                    <ReportTableSkeleton columns={4} rows={5} />
                    <ChartSkeleton type="columns-line" label="현금흐름을 불러오는 중입니다." />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-company-skeleton-trade" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-trade" title="거래처현황" />
            <div className="flex flex-col gap-6">
                {['매출처', '매입처'].map((title) => (
                    <div key={title} className="flex flex-col gap-2">
                        <div className="flex items-baseline justify-between gap-4">
                            <h4 className="typo-body-xl-bold text-foreground">{title}</h4>
                            <p className="typo-body-l-regular text-foreground-subtle">단위 : %, 백만원</p>
                        </div>
                        <ReportTableSkeleton columns={6} rows={5} headRows={2} isBadgeRow />
                    </div>
                ))}
            </div>
        </section>
    </>
)

// 기술혁신정보 탭 스켈레톤 — 실제 탭(innovation-growth-report-tech.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const TECH_SKELETON_NOTICE_LINES = 3
const TechTabSkeleton = () => (
    <>
        <div className="border-navy-200 bg-navy-100 -mt-6 flex flex-col rounded-sm border px-5 py-4">
            {Array.from({length: TECH_SKELETON_NOTICE_LINES}, (_, index) => (
                <span key={index} className="typo-body-xl-regular flex h-lh items-center">
                    <SkeletonBar className={index === TECH_SKELETON_NOTICE_LINES - 1 ? 'w-1/3' : 'w-full'} />
                </span>
            ))}
        </div>
        <section aria-labelledby="ig-tech-skeleton-holdings" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-holdings" title="보유기술" />
            <div className="flex flex-col gap-6">
                <Card title="기술 보유현황" description={<SkeletonBar className="w-160" />}>
                    <div className="grid grid-cols-2 gap-12">
                        <ChartSkeleton type="donut" label="중분류 기준 보유기술을 불러오는 중입니다." />
                        <ChartSkeleton type="donut" label="소분류 기준 보유기술을 불러오는 중입니다." />
                    </div>
                </Card>
                <Card title="특허 보유현황" aside="최대 10개 · 출원일 최근순">
                    <ReportTableSkeleton columns={6} rows={10} isBadgeRow />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-tech-skeleton-analysis" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-analysis" title="특허기술 분석" />
            <div className="flex flex-col gap-6">
                {['분석특허', '맞춤형 기술분야'].map((title) => (
                    <Card key={title} title={title}>
                        <Skeleton className="h-15 w-full rounded-sm" />
                        <div className="flex flex-col gap-2">
                            <SkeletonBar className="h-5 w-24" />
                            <SkeletonBar className="w-full" />
                            <SkeletonBar className="w-3/4" />
                        </div>
                    </Card>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-tech-skeleton-market" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-market" title="맞춤형 기술정보-기업·특허 현황" />
            <Card title="매출 규모별 기업 및 특허 현황">
                <ButterflyBarChartSkeleton label="매출 규모별 기업 및 특허 현황을 불러오는 중입니다." />
                <div className="grid grid-cols-2 gap-12">
                    <ChartSkeleton type="donut" label="기업수 비중을 불러오는 중입니다." />
                    <ChartSkeleton type="donut" label="특허수 비중을 불러오는 중입니다." />
                </div>
            </Card>
        </section>
        <section aria-labelledby="ig-tech-skeleton-competitors" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-competitors" title="맞춤형 기술정보-경쟁기업 및 우수기업" />
            <div className="flex flex-col gap-6">
                <Card title="경쟁기업 사업실적">
                    <ComboBarLineChartSkeleton />
                </Card>
                <Card title="성장률 우수기업">
                    <DivergingRankChartSkeleton label="성장률 우수기업을 불러오는 중입니다." />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-tech-skeleton-excellent" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-excellent" title="맞춤형 기술정보-우수기술" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h4 className="typo-body-xl-bold text-foreground">우수특허</h4>
                    <ReportTableSkeleton columns={7} rows={10} isBadgeRow />
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="typo-body-xl-bold text-foreground">이머징 기술</h4>
                    <ReportTableSkeleton columns={10} rows={11} headRows={2} />
                </div>
            </div>
        </section>
        <section aria-labelledby="ig-tech-skeleton-rnd" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-rnd" title="맞춤형 기술정보-R&D" />
            <div className="flex flex-col gap-6">
                <Card title="R&D 이슈" description={<SkeletonBar className="w-160" />}>
                    <ChartSkeleton type="word-cloud" label="R&D 이슈를 불러오는 중입니다." className="h-54 sm:h-54" />
                </Card>
                <div className="flex flex-col gap-2">
                    <h4 className="typo-body-xl-bold text-foreground">R&D 전문기관 현황</h4>
                    <ReportTableSkeleton columns={7} rows={12} headRows={2} />
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="typo-body-xl-bold text-foreground">정부 R&D 사업 현황</h4>
                    <ReportTableSkeleton columns={6} rows={5} />
                    <ReportTableSkeleton columns={6} rows={10} />
                </div>
            </div>
        </section>
    </>
)

// 활동성정보 탭 스켈레톤 — 실제 탭(innovation-growth-report-activity.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const ActivityTabSkeleton = () => (
    <>
        <section aria-labelledby="ig-activity-skeleton-hr" className="flex flex-col gap-4">
            <SectionTitle id="ig-activity-skeleton-hr" title="인적자원 현황" date="단위 : 명, 천원" />
            <div className="flex flex-col gap-6">
                <ReportTableSkeleton columns={6} rows={3} />
                <div className="grid grid-cols-[minmax(0,792fr)_minmax(0,384fr)] gap-6">
                    <Card title="분기별 종업원수" aside="단위 : 명">
                        <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
                    </Card>
                    <Card title="인당 매출액" aside="단위 : 천원">
                        <ChartSkeleton type="cells-column" label="인당 매출액을 불러오는 중입니다." />
                    </Card>
                </div>
            </div>
        </section>
        <section aria-labelledby="ig-activity-skeleton-energy" className="flex flex-col gap-4">
            <SectionTitle id="ig-activity-skeleton-energy" title="에너지 사용 현황" />
            <div className="flex flex-col gap-6">
                {['전기 사용량', '가스 사용량'].map((title) => (
                    <Card key={title} title={title}>
                        <div className="grid grid-cols-2 items-center gap-6">
                            <ReportTableSkeleton columns={4} rows={3} />
                            <ChartSkeleton type="columns-line" label={`${title}을 불러오는 중입니다.`} />
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    </>
)

// Tech-Index 탭 스켈레톤 — 실제 탭(innovation-growth-report-tech-index.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const SKELETON_GRADE_ROW_COUNT = 5
const SKELETON_DESCRIPTION_COUNT = 3
const SKELETON_CAPABILITIES = ['인프라', '투입', '활동', '성과'] as const
const SKELETON_INDICATORS = ['역량·투자 지표', '특허·기술 지표'] as const

// 안내 상자 자리 — 실제 NoticeBox(여백 16/20 · 16 Regular 줄 높이)와 같은 짜임에 줄 수만큼 막대를 둔다.
const SkeletonNoticeBox = ({lines}: {lines: number}) => (
    <div className="border-subtle-3 typo-body-xl-regular flex flex-col items-center rounded-sm border px-5 py-4">
        {Array.from({length: lines}, (_, index) => (
            <span key={index} className="flex h-lh w-full items-center justify-center">
                <SkeletonBar className={index === lines - 1 && lines > 1 ? 'w-1/3' : 'w-3/4'} />
            </span>
        ))}
    </div>
)

const TechIndexTabSkeleton = () => (
    <>
        <section aria-labelledby="ig-tech-index-skeleton-score" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-index-skeleton-score" title="혁신성장역량지수" />
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <Card className="justify-center">
                        <div className="flex items-center gap-6">
                            <ChartSkeleton
                                type="score-gauge"
                                label="Tech-Index 점수를 불러오는 중입니다."
                                className="w-80 shrink-0"
                            />
                            {/* 점수 구간표 자리 — 머리 1줄 + 구간 5줄(줄 높이 34). */}
                            <div className="border-t-foreground-subtle min-w-0 flex-1 border-t" aria-hidden="true">
                                {Array.from({length: SKELETON_GRADE_ROW_COUNT + 1}, (_, row) => (
                                    <div
                                        key={row}
                                        className={cn(
                                            'border-subtle-3 flex h-8.5 items-center justify-center border-b',
                                            row === 0 && 'bg-primary-subtle',
                                        )}
                                    >
                                        <SkeletonBar className="h-3 w-12" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <SkeletonNoticeBox lines={1} />
                    </Card>
                    <Card title="Tech-Index 표준정보 비교" aside={<SkeletonBar className="w-24" />}>
                        <DistributionCurveChartSkeleton label="Tech-Index 표준정보를 불러오는 중입니다." />
                        <SkeletonNoticeBox lines={2} />
                    </Card>
                </div>
                <Card title="기업 유형별 Tech-Index 비교">
                    <ChartSkeleton type="cells-column" label="기업 유형별 Tech-Index 를 불러오는 중입니다." />
                    <div className="flex flex-col gap-2">
                        <h5 className="typo-body-xl-bold text-foreground">지수설명</h5>
                        <div className="typo-body-xl-regular flex flex-col gap-1">
                            {Array.from({length: SKELETON_DESCRIPTION_COUNT}, (_, index) => (
                                <span key={index} className="flex h-lh items-center">
                                    <SkeletonBar
                                        className={index === SKELETON_DESCRIPTION_COUNT - 1 ? 'w-2/3' : 'w-full'}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-tech-index-skeleton-capability" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-index-skeleton-capability" title="4대 혁신역량 점수" />
            <div className="grid grid-cols-4 gap-6">
                {SKELETON_CAPABILITIES.map((label) => (
                    <div
                        key={label}
                        className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6"
                    >
                        <ChartSkeleton type="cells-column" label={`${label} 점수를 불러오는 중입니다.`} />
                        {/* 역량 이름 · 뱃지 줄(24) → 8 → 단계 칸 줄(16). */}
                        <div className="flex flex-col items-center gap-2" aria-hidden="true">
                            <span className="typo-body-xl-bold text-foreground flex h-6 items-center gap-2">
                                {label}
                                <SkeletonBar className="h-6 w-10" />
                            </span>
                            <SegmentMeterSkeleton />
                        </div>
                    </div>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-tech-index-skeleton-by-type" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-index-skeleton-by-type" title="기업 유형별 4대 혁신역량 비교" />
            <div className="grid grid-cols-2 gap-6">
                {SKELETON_CAPABILITIES.map((label) => (
                    <Card key={label} title={label}>
                        <ChartSkeleton type="cells-column" label={`기업 유형별 ${label} 점수를 불러오는 중입니다.`} />
                    </Card>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-tech-index-skeleton-indicators" className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <SectionTitle id="ig-tech-index-skeleton-indicators" title="세부지표별 상대비교분석" />
                <SkeletonLegend count={2} />
            </div>
            <div className="grid grid-cols-2 gap-6">
                {SKELETON_INDICATORS.map((title) => (
                    <Card key={title} title={title}>
                        <ChartSkeleton type="circle-radar" label={`${title}를 불러오는 중입니다.`} className="h-54" />
                    </Card>
                ))}
            </div>
        </section>
    </>
)

// 신용/재무정보 탭 스켈레톤 — 실제 탭(innovation-growth-report-credit.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const SKELETON_CREDIT_INFO_TABLES = [4, 4, 3, 5, 6, 6] as const
const SKELETON_RATIO_GROUPS = ['성장성', '수익성', '안정성', '활동성'] as const
const SKELETON_BORROWING_ROWS = 10

const CreditTabSkeleton = () => (
    <>
        <section aria-labelledby="ig-credit-skeleton-rating" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-rating" title="기업신용등급" />
            <div className="grid grid-cols-2 gap-6">
                <Card className="justify-center">
                    <ChartSkeleton
                        type="gauge"
                        label="기업신용등급을 불러오는 중입니다."
                        className="mx-auto max-w-65"
                    />
                    <SkeletonNoticeBox lines={2} />
                </Card>
                <Card title="이전평가이력">
                    <GradeHistoryChartSkeleton label="이전평가이력을 불러오는 중입니다." />
                    <ReportTableSkeleton columns={2} rows={2} />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-credit-skeleton-cash-flow" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-cash-flow" title="현금흐름등급" />
            <Card>
                <div className="grid grid-cols-2 items-center gap-6">
                    <GradeScaleGaugeSkeleton label="현금흐름등급을 불러오는 중입니다." />
                    <ReportTableSkeleton columns={2} rows={3} />
                </div>
                <SkeletonNoticeBox lines={1} />
                <div className="flex flex-col gap-4">
                    <h4 className="typo-body-xl-bold text-foreground">기업신용정보</h4>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {SKELETON_CREDIT_INFO_TABLES.map((columns, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <span className="typo-body-l-medium flex h-lh items-center">
                                    <SkeletonBar className="w-32" />
                                </span>
                                <ReportTableSkeleton columns={columns} rows={1} />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </section>
        <section aria-labelledby="ig-credit-skeleton-ratios" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-ratios" title="재무비율진단" />
            <div className="flex flex-col gap-6">
                {SKELETON_RATIO_GROUPS.map((title) => (
                    <Card
                        key={title}
                        title={title}
                        aside={
                            <span className="flex h-lh items-center gap-2">
                                <SegmentMeterSkeleton />
                                <SkeletonBar className="h-6 w-10" />
                            </span>
                        }
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <ReportTableSkeleton columns={5} rows={4} />
                            <div className="flex flex-col gap-2">
                                <SkeletonLegend count={4} />
                                <ChartSkeleton type="columns-line" label={`${title} 재무비율을 불러오는 중입니다.`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-credit-skeleton-borrowing" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-borrowing" title="차입금 분석" />
            <div className="flex flex-col gap-6">
                <Card title="차입금 변동률" aside="단위 : %">
                    <ChartSkeleton type="cells-line" label="차입금 변동률을 불러오는 중입니다." />
                </Card>
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <h4 className="typo-body-xl-bold text-foreground">차입금 현황</h4>
                        <p className="typo-body-l-regular text-foreground-subtle">단위 : 백만원, %</p>
                    </div>
                    <ReportTableSkeleton columns={8} rows={SKELETON_BORROWING_ROWS} headRows={2} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <h4 className="typo-body-xl-bold text-foreground">차입금 변동현황</h4>
                        <p className="typo-body-l-regular text-foreground-subtle">단위 : 백만원, %</p>
                    </div>
                    <ReportTableSkeleton columns={4} rows={4} />
                </div>
            </div>
        </section>
        <section aria-labelledby="ig-credit-skeleton-borrowing-status" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-borrowing-status" title="차입금 현황" />
            <div className="flex flex-col gap-6">
                <Card title="기관별 비중" aside="단위 : %">
                    <div className="grid grid-cols-2 items-center gap-12">
                        <ReportTableSkeleton columns={4} rows={5} />
                        <ChartSkeleton type="donut" label="기관별 비중을 불러오는 중입니다." />
                    </div>
                </Card>
                <div className="grid grid-cols-2 gap-6">
                    <Card title="신용/담보 비중" aside="단위 : %">
                        <div className="flex flex-col gap-2">
                            <SkeletonLegend count={2} />
                            <ChartSkeleton type="columns-line" label="신용/담보 비중을 불러오는 중입니다." />
                        </div>
                        <SkeletonBar className="h-4 w-full rounded-full" />
                    </Card>
                    <Card title="담보 현황" aside="단위 : 백만원">
                        <ChartSkeleton type="donut" label="담보 현황을 불러오는 중입니다." />
                    </Card>
                </div>
            </div>
        </section>
    </>
)

// 받는 동안의 문서 — 주소의 ?tab= 을 읽어 그 탭 모양의 스켈레톤을 보인다(loading.tsx 는 주소 쿼리를 모르므로 여기서 고른다).
const InnovationGrowthReportDocumentSkeleton = () => {
    const searchParams = useSearchParams()
    const tabParam = searchParams.get(INNOVATION_REPORT_TAB_QUERY)
    const activeTab: InnovationReportSectionId =
        tabParam && isReportTab(tabParam) ? tabParam : INNOVATION_REPORT_SECTIONS[0].id
    const isPcOnlyTab = activeTab !== INNOVATION_REPORT_SECTIONS[0].id
    const activeSection =
        INNOVATION_REPORT_SECTIONS.find((section) => section.id === activeTab) ?? INNOVATION_REPORT_SECTIONS[0]

    return (
        <main
            id="main"
            tabIndex={-1}
            aria-busy="true"
            className={cn('bg-background text-foreground min-h-dvh', isPcOnlyTab && 'min-w-320')}
        >
            <p role="status" className="sr-only">
                보고서를 불러오는 중입니다.
            </p>
            <header className="bg-tab-pill-active text-tab-pill-active-foreground">
                <div
                    className={cn(
                        'max-w-content mx-auto flex flex-col items-start gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-12 md:px-6 xl:px-0',
                        isPcOnlyTab && 'px-0 md:px-0',
                    )}
                >
                    <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
                        <p className="bg-info-50 text-info-600 typo-body-l-medium flex min-h-7 w-fit items-center rounded-full px-4">
                            {INNOVATION_REPORT_BADGE}
                        </p>
                        {/* 막대는 실제 글자 줄 높이(h-lh) 안에 둔다 — 받은 뒤 머리 높이가 바뀌지 않게. */}
                        <div className="flex flex-col">
                            <div className="typo-h1-bold flex h-lh items-center">
                                <Skeleton className="bg-tab-pill-active-foreground/20 h-8 w-full max-w-120 rounded-sm" />
                            </div>
                            {/* 모바일은 긴 보고서 제목이 두 줄로 접힌다 — 둘째 줄 자리. */}
                            <div className="typo-h1-bold flex h-lh items-center md:hidden">
                                <Skeleton className="bg-tab-pill-active-foreground/20 h-8 w-3/5 rounded-sm" />
                            </div>
                            <div className="typo-body-l-regular flex h-lh items-center">
                                <Skeleton className="bg-tab-pill-active-foreground/20 h-4 w-56 rounded-sm" />
                            </div>
                        </div>
                    </div>
                    {/* 버튼 자리 — 모바일은 [더보기](좁은 버튼), 그 위는 [보고서 출력]. */}
                    <Skeleton className="bg-tab-pill-active-foreground/20 h-control-h-md w-24 shrink-0 rounded-sm md:w-36 md:self-center" />
                </div>
            </header>

            <div
                className={cn(
                    'max-w-content mx-auto flex flex-col gap-10 px-4 py-10 md:px-6 xl:px-0',
                    isPcOnlyTab && 'px-0 md:px-0',
                )}
            >
                <Tabs value={activeTab} className="max-md:hidden">
                    <TabsList variant="pill-outline" aria-label="보고서 구성 항목">
                        {INNOVATION_REPORT_SECTIONS.map((section) => (
                            <TabsTrigger
                                key={section.id}
                                value={section.id}
                                // 받는 동안은 누를 수 없게 두되, 모양은 받은 뒤의 탭과 같게 둔다(흐린 비활성 색 대신).
                                disabled
                                className="disabled:text-foreground-subtle"
                            >
                                {section.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 md:pt-5">
                    <h2 className="typo-h4-bold text-foreground">{activeSection.label}</h2>
                    <SkeletonBar className="w-44" />
                </div>

                {activeTab === 'company' ? (
                    <CompanyTabSkeleton />
                ) : activeTab === 'innovation' ? (
                    <TechTabSkeleton />
                ) : activeTab === 'activity' ? (
                    <ActivityTabSkeleton />
                ) : activeTab === 'tech-index' ? (
                    <TechIndexTabSkeleton />
                ) : activeTab === 'credit-finance' ? (
                    <CreditTabSkeleton />
                ) : (
                    <>
                        <section aria-labelledby="ig-report-skeleton-company" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-skeleton-company" title="기업 정보" />
                            <InfoTable
                                aria-label="기업 정보"
                                items={Array.from({length: SKELETON_COMPANY_ROW_COUNT}, (_, index) => ({
                                    key: String(index),
                                    // 막대는 글자 한 줄 높이(h-lh) 안에 둔다 — 실제 칸(14 · 줄 21)과 줄 높이가 같게.
                                    label: (
                                        <span className="typo-body-l-regular flex h-lh items-center justify-center">
                                            <SkeletonBar className="w-16" />
                                        </span>
                                    ),
                                    value: (
                                        <span className="typo-body-l-regular flex h-lh items-center">
                                            <SkeletonBar className="w-full max-w-60" />
                                        </span>
                                    ),
                                }))}
                            />
                        </section>

                        <section aria-labelledby="ig-report-skeleton-innovation" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-skeleton-innovation" title="기술혁신정보" />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card title="기업 보유기술" aside="소분류 기준" className="xl:min-h-100">
                                    <ChartSkeleton type="donut" label="기업 보유기술을 불러오는 중입니다." />
                                </Card>
                                <Card title="관련 기업 및 특허현황" className="xl:min-h-100">
                                    <SkeletonStatGrid />
                                    <div className="flex flex-col gap-2">
                                        {Array.from({length: SKELETON_AVERAGE_COUNT}, (_, index) => (
                                            <div key={index} className="flex justify-between gap-4">
                                                <SkeletonBar className="w-32" />
                                                <SkeletonBar className="w-10" />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card title="R&D 이슈">
                                    <ChartSkeleton
                                        type="word-cloud"
                                        label="R&D 이슈를 불러오는 중입니다."
                                        className="h-54 sm:h-54"
                                    />
                                </Card>
                                <Card title="정부 R&D사업 접수현황" aside={<SkeletonBar className="w-32" />}>
                                    <SkeletonStatGrid />
                                    <SkeletonBar className="h-3 w-full" />
                                </Card>
                            </div>
                        </section>

                        <section aria-labelledby="ig-report-skeleton-tech-index" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-skeleton-tech-index" title="혁신성장역량지수" />
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <Card aside={<SkeletonBar className="w-56" />} className="xl:min-h-76">
                                    <ChartSkeleton type="score-gauge" label="혁신성장역량지수를 불러오는 중입니다." />
                                </Card>
                                <Card className="justify-center xl:min-h-76">
                                    <ChartSkeleton type="rank-pyramid" label="동일업종 순위를 불러오는 중입니다." />
                                </Card>
                            </div>
                            {/* 안내 문구 자리 — 실제 상자(여백 20 · 18 줄 높이)와 같은 짜임. PC 는 한 줄, 모바일은 네 줄로 접힌다. */}
                            <div className="border-subtle-3 typo-body-xl-regular mt-2 flex flex-col items-start rounded-sm border px-5 py-5 md:items-center">
                                <span className="flex h-lh w-full items-center md:justify-center">
                                    <SkeletonBar className="w-full max-w-160" />
                                </span>
                                {Array.from({length: SKELETON_NOTE_MOBILE_EXTRA_LINES}, (_, index) => (
                                    <span key={index} className="flex h-lh w-full items-center md:hidden">
                                        <SkeletonBar
                                            className={
                                                index === SKELETON_NOTE_MOBILE_EXTRA_LINES - 1 ? 'w-2/5' : 'w-full'
                                            }
                                        />
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section aria-labelledby="ig-report-skeleton-finance" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-skeleton-finance" title="신용/재무 현황" />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <Card title="기업신용등급">
                                    <ChartSkeleton type="gauge" label="기업신용등급을 불러오는 중입니다." />
                                </Card>
                                <Card title="재무비율진단">
                                    <ChartSkeleton type="matrix" label="재무비율진단을 불러오는 중입니다." />
                                </Card>
                                <Card
                                    className="md:col-span-2 xl:col-span-1"
                                    title="부문별 비교"
                                    aside={<SkeletonLegend count={2} />}
                                >
                                    <ChartSkeleton type="circle-radar" label="부문별 비교를 불러오는 중입니다." />
                                </Card>
                            </div>
                            <Card title="최근 3개년 재무 현황" aside="단위 : 백만원">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,359fr)_minmax(0,767fr)]">
                                    <StatementTableSkeleton />
                                    <ChartSkeleton
                                        type="grouped-column"
                                        label="최근 3개년 재무 현황을 불러오는 중입니다."
                                    />
                                </div>
                            </Card>
                        </section>

                        <section aria-labelledby="ig-report-skeleton-activity" className="flex flex-col gap-4">
                            <SectionTitle id="ig-report-skeleton-activity" title="활동성 정보" />
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,792fr)_minmax(0,384fr)]">
                                <Card title="분기별 종업원수" aside="단위 : 명">
                                    <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
                                </Card>
                                <Card title="인당 매출액" aside="단위 : 백만원">
                                    <ChartSkeleton type="cells-column" label="인당 매출액을 불러오는 중입니다." />
                                </Card>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    )
}

export {InnovationGrowthReportDocument, InnovationGrowthReportDocumentSkeleton}
export type {InnovationGrowthReportDocumentProps}
