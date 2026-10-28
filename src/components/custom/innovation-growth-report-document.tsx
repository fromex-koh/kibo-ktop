'use client'

import {Suspense, useEffect, useState, type ReactNode} from 'react'
import Image, {type StaticImageData} from 'next/image'
import {usePathname, useSearchParams} from 'next/navigation'
import {Award, Building2, Download, ExternalLink, ThumbsUp, TrendingUp, type LucideIcon} from 'lucide-react'
import {ButterflyBarChartSkeleton} from '@/components/composite/butterfly-bar-chart-skeleton'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {ComboBarLineChartSkeleton} from '@/components/composite/combo-bar-line-chart-skeleton'
import {DistributionCurveChartSkeleton} from '@/components/composite/distribution-curve-chart-skeleton'
import {GradeHistoryChartSkeleton} from '@/components/composite/grade-history-chart-skeleton'
import {GradeScaleGaugeSkeleton} from '@/components/composite/grade-scale-gauge-skeleton'
import {DivergingRankChartSkeleton} from '@/components/composite/diverging-rank-chart-skeleton'
import {showCheckToast} from '@/components/custom/check-toast'
import {KbigxPrintOutputSelectionDialog} from '@/components/composite/k-bigx-print-output-selection-dialog'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {EmptyState} from '@/components/composite/empty-state'
import {InfoTable} from '@/components/composite/info-table'
import {Button} from '@/components/ui/button'
import {ScrollToTopButton} from '@/components/composite/scroll-to-top-button'
import {Skeleton} from '@/components/ui/skeleton'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ChartRevealProvider} from '@/components/custom/chart-reveal'
import {ColumnChart} from '@/components/custom/column-chart'
import {ComparisonRadarChart, ComparisonRadarLegend} from '@/components/custom/comparison-radar-chart'
import {SECTOR_COMPARISON_RADAR_STYLE} from '@/components/custom/comparison-radar-style'
import {GroupedColumnChart} from '@/components/custom/grouped-column-chart'
import {LineChart} from '@/components/custom/line-chart'
import {RATING_LEVELS, RatingMatrix} from '@/components/custom/rating-matrix'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import {RankPyramidChart} from '@/components/custom/rank-pyramid-chart'
import {ScoreGauge} from '@/components/custom/score-gauge'
import {SemicircleRatingGauge} from '@/components/custom/semicircle-rating-gauge'
import {WordCloud} from '@/components/custom/word-cloud'
import {
    INNOVATION_ISSUE_COLORS,
    INNOVATION_REPORT_BADGE,
    INNOVATION_REPORT_CREATED_TOAST,
    INNOVATION_REPORT_CASE_QUERY,
    INNOVATION_REPORT_EMPTY_QUERY,
    INNOVATION_REPORT_CREATED_QUERY,
    INNOVATION_REPORT_ID_QUERY,
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
    INNOVATION_ISSUE_NOTE,
    isReportTab,
    type InnovationGrowthReport,
    type InnovationReportSectionId,
    type InnovationStatId,
    toRndSlots,
} from '@/content/service/k-bigx-innovation-report'
import {toCreditGaugeData} from '@/components/custom/credit-gauge-data'
import {toPrintOutputSummary, type PrintOutputSectionId} from '@/content/service/k-bigx-print-output-selection'
import {getKbigxPrintHref} from '@/content/service/k-bigx-print-report'
import {openReportTab} from '@/lib/open-report-print-tab'
import {cn} from '@/lib/utils'
import {
    Card,
    SectionTitle,
    StatBox,
    SubSectionTitle,
    WithUnit,
} from '@/components/custom/innovation-growth-report-parts'
import {InnovationGrowthReportCompany} from '@/components/custom/innovation-growth-report-company'
import {InnovationGrowthReportTech} from '@/components/custom/innovation-growth-report-tech'
import {InnovationGrowthReportActivity} from '@/components/custom/innovation-growth-report-activity'
import {InnovationGrowthReportTechIndex} from '@/components/custom/innovation-growth-report-tech-index'
import {InnovationGrowthReportCredit} from '@/components/custom/innovation-growth-report-credit'
import emblemGovernmentImage from '@public/images/emblem-government.webp'
import barChartIcon from '@public/images/icons/bar-chart.webp'
import buildingIcon from '@public/images/icons/building.webp'
import coinsIcon from '@public/images/icons/coins.webp'
import documentCheckIcon from '@public/images/icons/document-check.webp'
import gaugeIcon from '@public/images/icons/gauge.webp'
import lightbulbIcon from '@public/images/icons/lightbulb.webp'

// K-BIGx 기업혁신성장 보고서 — 새 창으로 여는 웹 보고서(진단브리핑 · 구성 항목 탭).
// 조회 화면의 [K-BIGx 보고서 출력] → 보고서 생성 모달 [보고서 생성] → 조회횟수 차감안내 모달 [이용권 사용]을 거쳐 열린다.
//
// 짜임(위에서 아래로): 남색 머리(배지 · 제목 · 기업명 | 발급일 · [보고서 다운로드]) → 구성 항목 탭 → 진단브리핑
//   기업 정보(표) → 기술혁신정보(보유기술 도넛 · 관련 기업/특허 현황 · R&D 이슈 워드클라우드 · 정부 R&D 접수현황)
//   → 혁신성장역량지수(점수 게이지 · 동일업종 상위 %) → 신용/재무 현황(신용등급 게이지 · 재무비율진단 · 부문별 비교 레이더 ·
//   최근 3개년 재무 표 + 묶음 막대) → 활동성 정보(분기별 종업원수 선 · 인당 매출액 막대).
// 다른 탭(기업현황 · 기술혁신정보 · Tech-Index · 신용/재무정보 · 활동성정보)은 탭마다 파일(innovation-growth-report-*.tsx)이 본문을 그린다.
//
// 반응형 — 진단브리핑은 모바일 · 태블릿 · PC 를 모두 지원한다. 나머지 탭은 태블릿(768 이상) · PC 를 지원한다.
//   모바일(768 미만)은 진단브리핑만 보여 주고 탭 줄을 숨긴다(다른 탭은 [더보기]로 연 PC 화면에서 본다).
//   나머지 탭은 768 미만에서도 태블릿(768) 모양을 그대로 쓰고 문서 최소 폭을 768(max-md:min-w-3xl)로 고정한다 — 창을 768 보다
//   줄이면 태블릿 화면을 가로 스크롤로 보여 준다(주소 ?tab= 로 바로 열린 경우도 같다). 바깥 틀(머리 · 탭 줄 · 여백)이 md: 로
//   갈리는 곳은 아래 PC_ONLY_TAB_* 로 768 미만에도 태블릿 값을 준다(탭 내용은 lg · xl 로만 갈려 따로 손댈 것이 없다).
// PC(768 이상)에서는 머리 + 탭 줄이 스크롤해도 화면 위에 붙는다(sticky).
// 인쇄물에서는 머리의 버튼 · 탭이 사라지고 구획 카드가 쪽 경계에서 나뉘지 않는다.
//
// 차트는 모두 프로젝트 공통 차트 컴포넌트다 — 여기서는 데이터를 넘기고 카드 안에 놓기만 한다.
// [프론트엔드 연동] 화면 값은 전부 report(InnovationGrowthReport) 한 개에서 읽는다 — 지금은 getInnovationGrowthReport 가
//   퍼블리싱용 샘플을 돌려주므로, 그 함수를 보고서 조회 API 로 바꾸면 이 컴포넌트는 고칠 것이 없다.

const numberFormatter = new Intl.NumberFormat('ko-KR')
// 정보가 없는 값의 표시.
const EMPTY_VALUE = '-'
// 혁신성장역량지수 점수가 없을 때 요약 문장 · 게이지 이름(Tech-Index 탭 · 인쇄본과 같은 문구).
const TECH_INDEX_NO_SCORE_TEXT = '평가 점수가 없습니다.'
// 차감 알림 식별자 — 같은 알림이 겹쳐 뜨지 않게 한다(새로고침 · 다시 그리기).
const INNOVATION_REPORT_CREATED_TOAST_ID = 'k-bigx-innovation-report-created'
// [퍼블리싱 확인용] 토스트를 보려고 ?from=use 없이도 화면을 열면 차감 알림을 띄운다.
// 연동할 때는 false 로 바꾸거나 이 상수를 지운다 — 그러면 [이용권 사용]을 거쳐 열렸을 때(?from=use)만 뜬다.
const PUBLISHING_ALWAYS_SHOW_CREATED_TOAST = true
// 재무비율진단 평가지표 — 5줄 고정(인쇄본과 같다). creditFinance.ratios 에서 같은 label 로 찾고, 없거나 다섯 단계 밖 값이면
// 그 줄의 단계 칸마다 '-'. 부문별 비교 레이더 축도 같은 다섯 지표다(값이 없으면 0 으로 그린다 — 레이더는 꼭짓점을 비울 수 없다).
const RATIO_INDICATORS = [
    {id: 'sales-growth', label: '매출액증가율'},
    {id: 'operating-margin', label: '영업이익률'},
    {id: 'equity-ratio', label: '자기자본비율'},
    {id: 'asset-turnover', label: '총자본회전율'},
    {id: 'cash-flow', label: '현금흐름'},
] as const
// 최근 3개년 재무 현황 구분 — 6줄 고정(인쇄본과 같다). statements 에서 같은 label 로 찾고, 없는 칸은 '-'.
const STATEMENT_ITEMS = ['총자산', '자본총계', '부채총계', '매출액', '영업이익', '순이익'] as const
const isFiniteNumber = (value: number | null | undefined): value is number =>
    typeof value === 'number' && Number.isFinite(value)
// 최근 3개년 재무 현황 막대 색 — years 순서(오래된 해부터)대로 입힌다.
const STATEMENT_YEAR_COLORS = [
    'var(--ds-report-series-1)',
    'var(--ds-report-series-2)',
    'var(--ds-report-series-3)',
] as const

// ── 조각 ─────────────────────────────────────────────────────────────────────────

// 탭 제목 띠 아이콘 — 흰 그림 에셋(public/images/icons)을 파란 칸 가운데에 둔다. 높이를 맞추고 폭은 그림 비율대로.
// 계기판(활동성정보)은 그림의 아래쪽이 비어 있어 가운데 맞춤이면 위로 떠 보이므로 조금 키우고 아래로 내린다.
const TAB_BANNER_ICONS: Record<InnovationReportSectionId, {src: StaticImageData; className: string}> = {
    briefing: {src: documentCheckIcon, className: 'h-5.5 w-auto'},
    company: {src: buildingIcon, className: 'h-5.5 w-auto'},
    innovation: {src: lightbulbIcon, className: 'h-5.5 w-auto'},
    'tech-index': {src: barChartIcon, className: 'h-5.5 w-auto'},
    'credit-finance': {src: coinsIcon, className: 'h-5.5 w-auto'},
    activity: {src: gaugeIcon, className: 'mt-1.5 size-6.5'},
}

// 관련 기업 및 특허현황 수치별 아이콘 — 데이터의 stat.id 로 고른다.
const INNOVATION_STAT_ICONS: Record<InnovationStatId, LucideIcon> = {
    companies: Building2,
    patents: Award,
    'high-growth-companies': TrendingUp,
    'high-growth-patents': ThumbsUp,
}

// 최근 3개년 재무 표 — 구분 + 연도 열(균등 폭). 줄 이름 칸이 머리 줄과 같은 면이고 그 오른쪽에만 세로선을 둔다.
// ReportTable 과 칸 모양이 달라(줄 머리 면 · 세로선) 따로 그린다. statements[].values 는 years 와 같은 순서 · 길이다.
// 칸이 좁아지는 폭(모바일 · lg 에서 표가 그래프 옆에 설 때)은 좌우 여백을 줄여 연도 · 금액이 한 줄에 들어가게 한다.
const STATEMENT_CELL_CLASS_NAME = 'border-subtle-3 border-b px-2 pt-3 pb-2.75 text-center md:px-4 lg:px-2 xl:px-4'
const STATEMENT_NAME_COLUMN_CLASS_NAME = 'border-subtle-3 border-r'
const STATEMENT_HEAD_CLASS_NAME = cn(STATEMENT_CELL_CLASS_NAME, 'bg-primary-subtle text-foreground whitespace-nowrap')

const StatementTable = ({years, statements}: Pick<InnovationGrowthReport['creditFinance'], 'years' | 'statements'>) => (
    // 맨 위 선은 표가 아니라 감싸는 상자에 긋는다 — 표(border-collapse)에 그으면 구분 칸의 세로선이
    // 위 선과 만나는 모서리를 덮어 위 선이 끊겨 보인다.
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
                        {years.map((year, index) => {
                            const value = row.values[index]
                            return (
                                <td
                                    key={year}
                                    className={cn(
                                        STATEMENT_CELL_CLASS_NAME,
                                        'typo-body-l-regular text-label-foreground tabular-nums',
                                    )}
                                >
                                    {isFiniteNumber(value) ? numberFormatter.format(value) : EMPTY_VALUE}
                                </td>
                            )
                        })}
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
    /** 인쇄본 화면 주소(KBIGX_PRINT_CORP_PATH · KBIGX_PRINT_ORG_PATH). 주면 [보고서 다운로드]가 보고서 내용 선택 모달을 열고, 모달의 [보고서 미리보기]가 인쇄본을 새 탭으로 연다. 없으면 동작 없는 버튼이다. */
    printPath?: string
}

// 혁신성장역량지수 점수 — 게이지와 같이 소수 첫째 자리까지(73.8).
const techIndexScoreFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

const ReportDocumentBody = ({report, isJustCreated = false, printPath}: InnovationGrowthReportDocumentProps) => {
    // 기업 정보 — 값이 비면(빈 글자 · 공백) '-'. 모든 값이 비면 표 대신 같은 높이의 빈 상태를 보인다.
    // [프론트엔드 연동] 받지 못한 값은 빈 글자로 보낸다('-' 로 보내도 빈 값으로 본다).
    const companyRows = report.company.rows.map((row) => ({
        key: row.label,
        label: row.label,
        value: row.value?.trim() || EMPTY_VALUE,
    }))
    const hasCompanyInfo = companyRows.some((row) => row.value !== EMPTY_VALUE)
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

    // 모바일 [더보기]가 여는 PC 화면 주소 — 지금 주소에 ?view=pc 를 붙인다. 차감 알림 표시(?from=use)는 새 창에서 다시 뜨지 않게 뺀다.
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pcViewParams = new URLSearchParams(searchParams.toString())
    pcViewParams.set(INNOVATION_REPORT_VIEW_QUERY, INNOVATION_REPORT_PC_VIEW)
    pcViewParams.delete(INNOVATION_REPORT_CREATED_QUERY)
    const pcViewHref = `${pathname}?${pcViewParams.toString()}`
    // 보고서 내용 선택 [보고서 미리보기] — 고른 장만 담은 보고서 문서 화면(report-print)을 새 탭으로 연다. 사용자는 그 화면의
    // [PDF 다운로드]로 받는다. 문서 화면은 이 화면을 찍지 않고 같은 보고서(reportId)를 다시 조회해 고른 장만 그린다.
    // ?case= · ?empty= 는 퍼블리싱 확인용(열람 케이스 · 값 모양)이라 문서 화면에도 그대로 넘긴다(연동 후 지운다).
    const printSections = (sections: PrintOutputSectionId[]) => {
        if (!printPath) return
        openReportTab(
            getKbigxPrintHref(printPath, {
                reportId: searchParams.get(INNOVATION_REPORT_ID_QUERY),
                sections,
                previewCase: searchParams.get(INNOVATION_REPORT_CASE_QUERY),
                previewEmpty: searchParams.get(INNOVATION_REPORT_EMPTY_QUERY),
            }),
        )
    }
    // 지금 탭 — ?tab= 값이 화면이 있는 탭이면 그 탭, 아니면 첫 탭(진단브리핑). 보고서는 한 페이지이고 탭은 주소 쿼리로만 바뀐다.
    const tabParam = searchParams.get(INNOVATION_REPORT_TAB_QUERY)
    const activeTab: InnovationReportSectionId =
        tabParam && isReportTab(tabParam) ? tabParam : INNOVATION_REPORT_SECTIONS[0].id
    // 차트 등장 움직임 — 처음 보는 탭에서만 움직이고, 이미 본 탭에 다시 들어가면(탭 · 뒤로 가기) 움직임 없이 바로 그린다.
    // 정보를 다시 보려고 탭을 자주 오가므로 같은 움직임을 반복하지 않는다. 모드는 탭에 들어갈 때 한 번 정하고 머무는 동안 그대로다
    // (머무는 중 바뀌면 아직 화면 밖이던 차트가 숨은 채 남는다). 새로고침하면 다시 처음 보는 것으로 친다.
    const [chartVisit, setChartVisit] = useState<{tab: InnovationReportSectionId; isRevisit: boolean; seen: string[]}>({
        tab: activeTab,
        isRevisit: false,
        seen: [activeTab],
    })
    if (chartVisit.tab !== activeTab) {
        setChartVisit({
            tab: activeTab,
            isRevisit: chartVisit.seen.includes(activeTab),
            seen: chartVisit.seen.includes(activeTab) ? chartVisit.seen : [...chartVisit.seen, activeTab],
        })
    }
    const chartRevealMode = chartVisit.tab === activeTab && chartVisit.isRevisit ? 'off' : 'reveal'
    // 진단브리핑 외 탭 — 태블릿 · PC 만 지원한다(768 미만은 태블릿 모양 그대로 최소 폭 768 — 아래 max-md:min-w-3xl).
    const isPcOnlyTab = activeTab !== INNOVATION_REPORT_SECTIONS[0].id
    const printButton = (
        <Button
            type="button"
            variant="tertiary"
            size="md"
            // 모든 화면 폭 · 모든 탭에서 보인다(모바일 진단브리핑은 [더보기]와 나란히).
            className="bg-card shrink-0 gap-1"
        >
            <Download aria-hidden="true" />
            {INNOVATION_REPORT_PRINT_LABEL}
        </Button>
    )
    // 혁신성장역량지수 게이지 색 · 상태 이름 · 요약 문장은 점수 하나로 정한다(Tech-Index 탭과 같은 점수 구간).
    const techIndexGrade = getTechIndexGrade(report.techIndex.score)
    // 점수 · 순위가 숫자가 아니면 값 없음 — 게이지 · 피라미드는 '-' 로 그리고, 요약 문장은 '평가 점수가 없습니다.'.
    const hasTechIndexScore = Number.isFinite(report.techIndex.score)
    const hasTechIndexPercentile = Number.isFinite(report.techIndex.industryPercentile)
    const techIndexScoreText = hasTechIndexScore
        ? `${techIndexScoreFormatter.format(report.techIndex.score)}점`
        : TECH_INDEX_NO_SCORE_TEXT
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
        // 탭을 옮기면 새 탭의 맨 위에서 시작한다 — 주소만 바꾸면 스크롤 위치가 그대로 남아 새 탭의 중간이 먼저 보인다.
        window.scrollTo(0, 0)
    }
    // 기업신용등급 — 등급 코드를 CRI 등급표로 풀어 게이지 데이터(등급명 · 채움 비율 · 색 단계)를 만든다(진단브리핑 · 신용/재무정보 탭 공용).
    // 게이지 색은 등급 단계마다 다르다(우량 ~ 위험 · 유보). 유보(R)는 절반, 평가제외(NR)는 채우지 않는다(credit-gauge-data.ts).
    const creditRating = toCreditGaugeData(report.creditFinance.rating.grade, [...report.creditFinance.rating.details])
    // 신용/재무 현황 — 모두 비면 빈 상태(EmptyState), 일부만 비면 그 칸만 '-'.
    const hasCreditRating =
        Boolean(report.creditFinance.rating.grade.trim()) ||
        report.creditFinance.rating.details.some((detail) => detail.value.trim())
    const ratioRows = RATIO_INDICATORS.map((indicator) => ({
        ...indicator,
        rating: report.creditFinance.ratios.find((row) => row.label === indicator.label)?.rating ?? null,
    }))
    // 5줄이 모두 '-'(등급 없음)이면 표 대신 빈 상태.
    const hasRatios = ratioRows.some((row) => RATING_LEVELS.some((level) => level.id === row.rating))
    const comparisonRows = RATIO_INDICATORS.map((indicator) => {
        const item = report.creditFinance.comparison.find((row) => row.label === indicator.label)
        return {label: indicator.label, company: item?.company, industry: item?.industry}
    })
    const hasComparison = comparisonRows.some((row) => isFiniteNumber(row.company) || isFiniteNumber(row.industry))
    const statementRows = STATEMENT_ITEMS.map((label) => ({
        label,
        values: report.creditFinance.statements.find((row) => row.label === label)?.values ?? [],
    }))
    const hasStatements =
        report.creditFinance.years.length > 0 && statementRows.some((row) => row.values.some(isFiniteNumber))

    return (
        // main 은 layout.tsx 가 하나만 그린다 — 문서 · 스켈레톤이 각자 main 을 그리면 스트리밍 HTML 한 벌에
        // main 이 여러 개 담겨 마크업 오류가 된다(id 중복 · 보이는 main 둘 이상)[8.1.1].
        <div
            className={cn(
                'print-exact',
                // 진단브리핑 외 탭은 768 미만에서 태블릿 폭(768)으로 고정한다 — 그보다 좁은 창은 가로 스크롤.
                isPcOnlyTab && 'max-md:min-w-3xl',
            )}
        >
            {/* 보고서 안 차트는 화면에 절반 이상 보일 때 움직인다(custom/chart-reveal.tsx) — 다시 들어간 탭은 움직이지 않는다. */}
            <ChartRevealProvider mode={chartRevealMode} scope={activeTab}>
                <Tabs value={activeTab} onValueChange={selectTab} className="gap-0 print:block">
                    {/* 머리 + 구성 항목 탭 줄을 한 덩이로 묶어 PC(768 이상)에서 스크롤해도 화면 위에 붙는다(sticky).
                    인쇄에서는 붙이지 않는다. 겹치는 차트보다 위에 오도록 z-sticky 토큰을 쓴다. */}
                    <div
                        className={cn(
                            'md:z-sticky md:sticky md:top-0 print:static',
                            isPcOnlyTab && 'z-sticky sticky top-0',
                        )}
                    >
                        {/* 머리 — 남색 면 전체 폭, 안쪽은 콘텐츠 폭 1200. 모바일은 버튼을 제목 아래로 내린다. */}
                        <header className="bg-tab-pill-active text-tab-pill-active-foreground break-after-avoid">
                            <div
                                className={cn(
                                    'max-w-content mx-auto flex flex-col items-start gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-12 md:px-6 xl:px-0',
                                    isPcOnlyTab && 'flex-row justify-between gap-12 px-6 xl:px-0',
                                )}
                            >
                                <div className="flex min-w-0 flex-1 flex-col gap-4">
                                    <p className="bg-info-50 text-info-600 typo-body-l-medium flex min-h-7 w-fit items-center rounded-full px-4">
                                        {INNOVATION_REPORT_BADGE}
                                    </p>
                                    <div className="flex flex-col">
                                        {/* 머리 값(제목 · 기업명 · 발급일)이 비면 '-' — 자리와 구분선은 그대로 둔다. */}
                                        <h1 className="typo-h1-bold wrap-break-word break-keep">
                                            {report.title.trim() || EMPTY_VALUE}
                                        </h1>
                                        <p className="typo-body-l-regular flex flex-wrap items-center gap-x-4">
                                            <span>{report.companyName.trim() || EMPTY_VALUE}</span>
                                            <span
                                                aria-hidden="true"
                                                className="bg-tab-pill-active-foreground/40 h-3 w-px"
                                            />
                                            <span>발급일 {report.issuedAt.trim() || EMPTY_VALUE}</span>
                                        </p>
                                    </div>
                                </div>
                                {/* 버튼은 인쇄물에서 사라진다(종이에서는 누를 수 없다). 모바일(768 미만)은 진단브리핑만 보이므로 [보고서 다운로드] 옆에
                                    [더보기]를 함께 둔다 — 모든 탭이 있는 PC 화면(?view=pc, 뷰포트 1280)을 새 창으로 열어 확대 · 축소하며 본다.
                                    [보고서 다운로드] → 보고서 내용 선택 모달 → [보고서 미리보기] → 고른 장만 담은 보고서 문서를 새 탭에서 연다 → 그 화면의 [PDF 다운로드]로 받는다
                                    (printSections). 인쇄본 주소(printPath)를 넘기지 않으면 동작 없는 버튼이다. */}
                                <div className="flex shrink-0 flex-wrap gap-2 md:self-center print:hidden">
                                    {printPath ? (
                                        <KbigxPrintOutputSelectionDialog
                                            summary={toPrintOutputSummary(report)}
                                            onPrint={printSections}
                                        >
                                            {printButton}
                                        </KbigxPrintOutputSelectionDialog>
                                    ) : (
                                        printButton
                                    )}
                                    <Button
                                        asChild
                                        variant="tertiary"
                                        size="md"
                                        className={cn('bg-card shrink-0 gap-1 md:hidden', isPcOnlyTab && 'hidden')}
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
                            </div>
                        </header>
                        {/* 구성 항목 탭 — 주소의 ?tab= 으로 고른다(없으면 진단브리핑). 탭을 바꾸면 주소만 바꾸고 서버에 다시 묻지 않는다 —
                        한 보고서의 모든 탭 데이터가 report 하나에 들어 있다.
                        모바일(768 미만)은 진단브리핑만 보여 주므로 탭 줄을 통째로 숨긴다 — 다른 항목은 [더보기](PC 화면)에서 본다. */}
                        <div className={cn('bg-background max-md:hidden print:hidden', isPcOnlyTab && 'max-md:block')}>
                            <div
                                className={cn(
                                    'max-w-content mx-auto px-4 pt-10 pb-4 md:px-6 xl:px-0',
                                    isPcOnlyTab && 'px-6 xl:px-0',
                                )}
                            >
                                <TabsList variant="pill-outline" aria-label="보고서 구성 항목">
                                    {INNOVATION_REPORT_SECTIONS.map((section) => (
                                        <TabsTrigger key={section.id} value={section.id}>
                                            {section.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                        </div>
                    </div>

                    {/* 본문은 TabsContent 안에 둔다 — 탭(role=tab)에는 짝이 되는 패널(role=tabpanel)이 있어야 한다[8.1.1].
                    지금 고른 탭 하나만 그리므로 value 는 늘 activeTab 이다. */}
                    <div
                        className={cn(
                            'max-w-content mx-auto flex w-full flex-col px-4 pt-10 pb-10 md:px-6 md:pt-6 xl:px-0 print:block print:pt-10',
                            // 진단브리핑 외 탭은 768 미만에서도 태블릿 여백(좌우 24 · 위 24)을 쓴다.
                            isPcOnlyTab && 'px-6 pt-6 xl:px-0',
                        )}
                    >
                        <TabsContent value={activeTab} className="flex flex-col gap-10 print:block print:space-y-10">
                            {/* 탭 제목 띠 — 아이콘 칸 + 탭 제목(section.title ?? label). 탭 줄이 있는 PC 에서만 위 간격을 더 띄운다(md:mt-5).
                                아이콘은 제목이 옆에 있어 장식이다(alt="")[5.1.1].
                                띠는 탭을 열면 바로 보이므로 지연 로딩을 끈다(eager) — 폭이 w-auto 라 lazy 면 "크기 미지정 지연 이미지" 로 검출된다. */}
                            <div
                                className={cn(
                                    'border-navy-200 flex items-center gap-3 rounded-md border bg-blue-50 p-4 md:mt-5',
                                    isPcOnlyTab && 'mt-5',
                                )}
                            >
                                <span className="text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-sm bg-blue-500">
                                    <Image
                                        src={TAB_BANNER_ICONS[activeTab].src}
                                        alt=""
                                        loading="eager"
                                        className={TAB_BANNER_ICONS[activeTab].className}
                                    />
                                </span>
                                <h2 className="typo-h2-bold text-navy-600 break-keep">
                                    {'title' in activeSection ? activeSection.title : activeSection.label}
                                </h2>
                            </div>

                            {activeTab === 'company' ? (
                                <InnovationGrowthReportCompany status={report.companyStatus} />
                            ) : activeTab === 'activity' ? (
                                <InnovationGrowthReportActivity
                                    detail={report.activityDetail}
                                    employees={report.activity.employees}
                                    salesPerEmployee={report.activity.salesPerEmployee}
                                    fallbackYears={report.companyStatus.finance.years}
                                />
                            ) : activeTab === 'credit-finance' ? (
                                <InnovationGrowthReportCredit
                                    detail={report.creditDetail}
                                    rating={creditRating}
                                    visibility={INNOVATION_CREDIT_VISIBILITY[report.viewerCase]}
                                    fallbackYears={report.companyStatus.finance.years}
                                />
                            ) : activeTab === 'tech-index' ? (
                                <InnovationGrowthReportTechIndex
                                    detail={report.techIndexDetail}
                                    score={report.techIndex.score}
                                    companyName={report.companyName}
                                    evaluationDate={report.techIndex.evaluationDate}
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
                                        <Card>
                                            {hasCompanyInfo ? (
                                                <InfoTable aria-label="기업 정보" items={companyRows} />
                                            ) : (
                                                // 값이 하나도 없을 때 — 빈 상태를 표와 같은 높이로. '-' 로 채운 표를 보이지 않게 깔아 두고(같은 칸에 겹침)
                                                // 그 위에 빈 상태를 둔다 — 화면 폭에 따라 표 높이가 바뀌어도(PC 2열 136 · 그 아래 1열 271) 늘 같다.
                                                // 줄 자체가 없어도 PC 표 높이(min-h-34 = 136)는 지킨다.
                                                <div className="grid">
                                                    <div
                                                        aria-hidden="true"
                                                        inert
                                                        className="invisible col-start-1 row-start-1"
                                                    >
                                                        <InfoTable items={companyRows} />
                                                    </div>
                                                    <EmptyState className="col-start-1 row-start-1 min-h-34" />
                                                </div>
                                            )}
                                        </Card>
                                    </section>

                                    {/* 기술혁신정보 */}
                                    <section aria-labelledby="ig-report-innovation" className="flex flex-col gap-4">
                                        <SectionTitle
                                            id="ig-report-innovation"
                                            title="기술혁신정보"
                                            aside={report.subCategoryName}
                                        />
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <Card title="기업 보유기술" aside="세부분야 기준" className="gap-4">
                                                <PercentageDonutChart
                                                    data={[...report.innovation.technologies]}
                                                    // [프론트엔드 연동 · 정렬] 비중 큰 순으로 받아 12시부터 시계 방향(첫 조각이 가장 진한 색).
                                                    // 조각에 올리면 분류명 툴팁이 뜬다(비중 · 건수는 범례).
                                                    ariaLabel="기업 보유기술 세부분야별 비중과 건수"
                                                    // 그래프 자리 최소 높이를 두고 세로 가운데 정렬 — 옆 카드(관련 기업 및 특허현황)와 높이를 맞춘다.
                                                    className="flex min-h-77.5 flex-col justify-center"
                                                />
                                            </Card>
                                            <Card title="관련 기업 및 특허현황" className="gap-4">
                                                <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
                                                    {report.innovation.stats.map((stat) => {
                                                        const StatIcon = INNOVATION_STAT_ICONS[stat.id]
                                                        return (
                                                            <StatBox
                                                                key={stat.id}
                                                                label={stat.label}
                                                                value={
                                                                    stat.value === null
                                                                        ? '-'
                                                                        : numberFormatter.format(stat.value)
                                                                }
                                                                unit={stat.value === null ? undefined : stat.unit}
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
                                                        <div
                                                            key={row.label}
                                                            className="flex items-center justify-between gap-4"
                                                        >
                                                            <dt className="typo-body-l-regular text-label-foreground">
                                                                {row.label}
                                                            </dt>
                                                            <dd className="m-0">
                                                                <span className="typo-body-xl-bold text-foreground">
                                                                    {row.value || '-'}
                                                                </span>
                                                                {/* 값이 없으면 단위 없이 '-' 만 — 실제 0건과 구분한다. */}
                                                                {row.value ? (
                                                                    <span className="typo-body-xl-regular text-label-foreground ms-1">
                                                                        {row.unit}
                                                                    </span>
                                                                ) : null}
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </Card>
                                            <Card title="R&D 이슈" className="gap-4">
                                                {/* 워드클라우드와 아래 안내는 한 묶음으로 붙인다(정부 R&D 카드의 목록 · 안내와 같은 간격). */}
                                                <div className="flex flex-1 flex-col gap-2 xl:flex-none">
                                                    {/* 키워드가 없으면 WordCloud 대신 같은 자리 · 높이의 빈 상태 — 빈 목록을 넘기면
                                                        WordCloud 가 스켈레톤을 계속 보인다. */}
                                                    {report.innovation.issues.length ? (
                                                        <WordCloud
                                                            words={[...report.innovation.issues]}
                                                            colors={INNOVATION_ISSUE_COLORS}
                                                            ariaLabel="최근 연구개발 이슈 키워드"
                                                            // PC(xl)는 높이 고정. 그 아래(태블릿 2열)는 옆 카드(정부 R&D)가 더 높아 아래가 비므로
                                                            // 같은 높이를 최소로 두고 카드 높이를 채운다. 단어 크기는 자리 높이에 맞춰 다시 그려진다.
                                                            className="h-auto min-h-54 flex-1 xl:h-54 xl:flex-none"
                                                        />
                                                    ) : (
                                                        <EmptyState className="h-auto min-h-54 flex-1 xl:h-54 xl:flex-none" />
                                                    )}
                                                    <p className="typo-caption-regular text-foreground-subtle break-keep">
                                                        {INNOVATION_ISSUE_NOTE}
                                                    </p>
                                                </div>
                                            </Card>
                                            <Card
                                                title="정부 R&D사업 접수현황"
                                                // 기준일자가 비면 '-'(인쇄본과 같다).
                                                aside={`기준일자 · ${report.createdAt || EMPTY_VALUE}`}
                                                className="gap-4"
                                            >
                                                {/* 부처 목록과 안내문은 한 묶음으로 붙인다(카드 간격보다 좁게). 건수가 null 이면 '-' 만 적고 단위는 뺀다.
                                                    부처는 늘 4칸 이상 — 받은 부처가 없거나 적으면 빠진 부처명을 채운다(toRndSlots · 인쇄본과 같은 규칙).
                                                    관련 기업 및 특허현황처럼 데이터가 없어도 칸은 두고 값만 '-'. */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2">
                                                        {toRndSlots(report.innovation.rnd).map((item) => (
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

                                    {/* 혁신성장역량지수 — 카드 하나에 점수 게이지(왼쪽) · 동일업종 순위 피라미드(오른쪽) · 아래 요약 상자. */}
                                    <section aria-labelledby="ig-report-tech-index" className="flex flex-col gap-4">
                                        <SectionTitle id="ig-report-tech-index" title="혁신성장역량지수" />
                                        <Card>
                                            {/* 두 칸은 lg(1024) 이상에서만 나란히 둔다 — 태블릿에서 나란히 두면 피라미드 칸이 글자 · 피라미드를
                                                위아래로 쌓아 높아진다. 안내 문구는 게이지 칸의 오른쪽 위. */}
                                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                <div className="flex flex-col gap-6">
                                                    <p className="typo-body-l-regular text-foreground-subtle text-end">
                                                        {report.techIndex.scoreNote}
                                                    </p>
                                                    {/* 평가일자는 게이지 안이 아니라 원호 아래 8 간격에 가운데 정렬로 둔다(기업신용등급 카드와 같은 모양). */}
                                                    <div className="flex flex-col gap-2">
                                                        <ScoreGauge
                                                            score={report.techIndex.score}
                                                            statusLabel={techIndexGrade.label}
                                                            tone={techIndexGrade.tone}
                                                            ariaLabel={
                                                                hasTechIndexScore
                                                                    ? `혁신성장역량지수 ${techIndexScoreText}, ${techIndexGrade.label}`
                                                                    : `혁신성장역량지수 ${TECH_INDEX_NO_SCORE_TEXT}`
                                                            }
                                                        />
                                                        <dl className="flex flex-wrap items-center justify-center gap-x-2">
                                                            <dt className="typo-body-xl-regular text-foreground-subtle">
                                                                평가일자
                                                            </dt>
                                                            <dd className="typo-body-xl-medium text-label-foreground m-0 tabular-nums">
                                                                {report.techIndex.evaluationDate || EMPTY_VALUE}
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                                {/* 태블릿(칸이 한 줄을 다 씀)에서는 글자 · 피라미드 묶음을 가운데로, lg 이상은 왼쪽 기준. */}
                                                <div className="flex flex-col justify-center">
                                                    <RankPyramidChart
                                                        percentile={report.techIndex.industryPercentile}
                                                        groupLabel={report.techIndex.industryLabel}
                                                        ariaLabel={
                                                            hasTechIndexPercentile
                                                                ? `동일업종(${report.techIndex.industryLabel}) 기준 상위 ${report.techIndex.industryPercentile}%`
                                                                : '동일업종 기준 순위 정보가 없습니다.'
                                                        }
                                                        className="pl-5 md:justify-center lg:justify-start"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                        {/* 요약 상자 — 문구 끝말(양호함 등)은 점수 구간(TECH_INDEX_GRADES.summaryLabel)에서 온다.
                                            모바일에서는 여러 줄로 접히므로 왼쪽 정렬, 태블릿 이상은 가운데 정렬. */}
                                        <p className="bg-navy-100 border-navy-200 text-navy-600 typo-body-xl-regular mt-2 rounded-sm border px-5 py-5 text-start break-keep md:text-center">
                                            {hasTechIndexScore ? (
                                                <>
                                                    기술신용평가(TCB) 시 제출한 정보를 기반으로 평가한
                                                    혁신성장역량지수(Tech-Index)는{' '}
                                                    <strong className="typo-body-xl-bold">{techIndexScoreText}</strong>
                                                    으로{' '}
                                                    <strong className="typo-body-xl-bold">
                                                        {techIndexGrade.summaryLabel}
                                                    </strong>
                                                </>
                                            ) : (
                                                TECH_INDEX_NO_SCORE_TEXT
                                            )}
                                        </p>
                                    </section>

                                    {/* 신용/재무 현황 */}
                                    <section aria-labelledby="ig-report-finance" className="flex flex-col gap-4">
                                        <SectionTitle id="ig-report-finance" title="신용/재무 현황" />
                                        {/* 기업신용등급 카드 : 진단 카드 ≈ 1 : 2. xl(1280) 부터 나란히, 그 아래는 위아래로 쌓인다. */}
                                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,384fr)_minmax(0,792fr)]">
                                            <Card title="기업신용등급" className="gap-4">
                                                {hasCreditRating ? (
                                                    <SemicircleRatingGauge
                                                        data={creditRating}
                                                        title="기업신용등급"
                                                        ariaLabel={
                                                            report.creditFinance.rating.grade.trim()
                                                                ? `기업신용등급 ${creditRating.label}, ${creditRating.description}`
                                                                : '기업신용등급 정보가 없습니다.'
                                                        }
                                                    />
                                                ) : (
                                                    <EmptyState className="min-h-59 flex-1" />
                                                )}
                                            </Card>
                                            {/* 재무비율진단과 부문별 비교는 카드 하나를 반씩 나눠 쓴다(md 미만은 위아래). 각 칸의 제목 줄은 카드 제목과 같은 모양. */}
                                            <Card>
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <section
                                                        aria-labelledby="ig-report-ratio-diagnosis"
                                                        className="flex min-w-0 flex-col gap-4"
                                                    >
                                                        <h4
                                                            id="ig-report-ratio-diagnosis"
                                                            className="typo-body-xl-bold text-foreground break-keep"
                                                        >
                                                            재무비율진단
                                                        </h4>
                                                        {hasRatios ? (
                                                            <RatingMatrix
                                                                ariaLabel="재무비율진단 — 항목별 수준"
                                                                rows={ratioRows}
                                                            />
                                                        ) : (
                                                            <EmptyState className="min-h-61" />
                                                        )}
                                                    </section>
                                                    <section
                                                        aria-labelledby="ig-report-sector-comparison"
                                                        className="flex min-w-0 flex-col gap-4"
                                                    >
                                                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                                            <h4
                                                                id="ig-report-sector-comparison"
                                                                className="typo-body-xl-bold text-foreground break-keep"
                                                            >
                                                                부문별 비교
                                                            </h4>
                                                            <ComparisonRadarLegend
                                                                primaryLabel="조회기업"
                                                                comparisonLabel="업종평균"
                                                                primaryColor={
                                                                    SECTOR_COMPARISON_RADAR_STYLE.primaryColor
                                                                }
                                                                comparisonColor={
                                                                    SECTOR_COMPARISON_RADAR_STYLE.comparisonColor
                                                                }
                                                                comparisonFillOpacity={
                                                                    SECTOR_COMPARISON_RADAR_STYLE.comparisonFillOpacity
                                                                }
                                                                className="ms-auto justify-end"
                                                            />
                                                        </div>
                                                        {hasComparison ? (
                                                            <ComparisonRadarChart
                                                                data={comparisonRows.map((item) => ({
                                                                    id: item.label,
                                                                    label: item.label,
                                                                    primaryValue: isFiniteNumber(item.company)
                                                                        ? item.company
                                                                        : 0,
                                                                    comparisonValue: isFiniteNumber(item.industry)
                                                                        ? item.industry
                                                                        : 0,
                                                                }))}
                                                                {...SECTOR_COMPARISON_RADAR_STYLE}
                                                                primaryLabel="조회기업"
                                                                comparisonLabel="업종평균"
                                                                ariaLabel="부문별 비교 — 조회기업과 업종평균"
                                                            />
                                                        ) : (
                                                            <EmptyState className="min-h-62" />
                                                        )}
                                                    </section>
                                                </div>
                                            </Card>
                                        </div>
                                        <Card title="최근 3개년 재무 현황" className="gap-0">
                                            {/* 표 : 그래프 ≈ 1 : 2. lg(1024) 부터 나란히, 그 아래는 표 위 · 그래프 아래로 쌓인다. */}
                                            {hasStatements ? (
                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,359fr)_minmax(0,767fr)]">
                                                    <WithUnit unit="단위: 백만원">
                                                        <StatementTable
                                                            years={report.creditFinance.years}
                                                            statements={statementRows}
                                                        />
                                                    </WithUnit>
                                                    <GroupedColumnChart
                                                        // 값이 없는 해는 빼고 넘긴다 — 그 자리에는 막대 대신 '-' 를 적는다(missingValueText · 표와 같다).
                                                        data={statementRows.map((row) => ({
                                                            id: row.label,
                                                            label: row.label,
                                                            values: Object.fromEntries(
                                                                report.creditFinance.years.flatMap((year, index) => {
                                                                    const value = row.values[index]
                                                                    return isFiniteNumber(value) ? [[year, value]] : []
                                                                }),
                                                            ),
                                                        }))}
                                                        series={report.creditFinance.years.map((year, index) => ({
                                                            key: year,
                                                            label: year,
                                                            color: STATEMENT_YEAR_COLORS[
                                                                index % STATEMENT_YEAR_COLORS.length
                                                            ],
                                                        }))}
                                                        ariaLabel="최근 3개년 재무 현황 항목별 연도 비교"
                                                        // 빈 값은 그래프 숨김 표도 '-' 로 읽는다(예전에는 0 으로 읽어 그래프를 낭독기에서 숨겼다).
                                                        missingValueText={EMPTY_VALUE}
                                                        variant="cells"
                                                        showValueLabels
                                                        // 값이 막대 위에 모두 적혀 있어 hover 말풍선은 두지 않는다.
                                                        showTooltip={false}
                                                    />
                                                </div>
                                            ) : (
                                                <EmptyState className="min-h-85" />
                                            )}
                                        </Card>
                                    </section>

                                    {/* 활동성 정보 */}
                                    <section aria-labelledby="ig-report-activity" className="flex flex-col gap-4">
                                        <SectionTitle id="ig-report-activity" title="활동성 정보" />
                                        {/* 선 카드 : 막대 카드 ≈ 2 : 1. lg(1024) 부터 나란히, 그 아래는 위아래로 쌓인다. */}
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,792fr)_minmax(0,384fr)]">
                                            <Card title="분기별 종업원수" className="gap-0">
                                                <WithUnit unit="단위: 명">
                                                    {report.activity.employees.some((item) =>
                                                        isFiniteNumber(item.value),
                                                    ) ? (
                                                        <LineChart
                                                            data={report.activity.employees.map((item) => ({
                                                                id: item.label,
                                                                label: item.label,
                                                                values: {employees: item.value},
                                                            }))}
                                                            series={[
                                                                {
                                                                    key: 'employees',
                                                                    label: '종업원수',
                                                                    color: 'var(--ds-purple-600)',
                                                                },
                                                            ]}
                                                            variant="area"
                                                            appearance="cells"
                                                            showLegend={false}
                                                            showValueLabels
                                                            // 값이 점 위에 모두 적혀 있어 hover 말풍선은 두지 않는다.
                                                            showTooltip={false}
                                                            ariaLabel="분기별 종업원수 추이"
                                                        />
                                                    ) : (
                                                        <EmptyState className="min-h-56.5" />
                                                    )}
                                                </WithUnit>
                                            </Card>
                                            <Card title="인당 매출액" className="gap-0">
                                                <WithUnit unit="단위: 천원">
                                                    {report.activity.salesPerEmployee.some((item) =>
                                                        isFiniteNumber(item.value),
                                                    ) ? (
                                                        <ColumnChart
                                                            // 값이 없는 해도 자리를 두고 막대 대신 '-'(missingValueText — 활동성정보 탭 · PDF 템플릿과 같다).
                                                            data={report.activity.salesPerEmployee.map((item) => ({
                                                                id: item.label,
                                                                label: item.label,
                                                                value: item.value,
                                                            }))}
                                                            missingValueText={EMPTY_VALUE}
                                                            // 천원 단위라 정수로 적는다(496,750).
                                                            valueFractionDigits={0}
                                                            compactValueLabels={false}
                                                            barWidth={48}
                                                            color="var(--ds-report-series-2)"
                                                            variant="cells"
                                                            showTooltip={false}
                                                            ariaLabel="연도별 인당 매출액"
                                                        />
                                                    ) : (
                                                        <EmptyState className="min-h-56.5" />
                                                    )}
                                                </WithUnit>
                                            </Card>
                                        </div>
                                    </section>
                                </>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </ChartRevealProvider>
            {/* 맨 위로 — 400px 넘게 내려가면 오른쪽 아래에 뜬다(scroll-to-top-button.tsx). 인쇄에는 안 찍힌다. */}
            <ScrollToTopButton className="right-4 bottom-4 md:right-6 md:bottom-6 print:hidden" />
        </div>
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

// 범례 자리 — 색 견본 + 이름 한 줄. 기본은 오른쪽 정렬(카드 머리 줄), 그래프 아래 범례는 className 으로 가운데.
const SkeletonLegend = ({count, className}: {count: number; className?: string}) => (
    <div className={cn('flex justify-end gap-6', className)}>
        {Array.from({length: count}, (_, index) => (
            <div key={index} className="flex h-lh items-center gap-2">
                <Skeleton className="size-4 rounded-none" />
                <SkeletonBar className="h-3 w-12" />
            </div>
        ))}
    </div>
)

// 최근 3개년 재무 표 자리 — 실제 표와 같은 칸 클래스에 글자 대신 막대를 둬 줄 높이가 같다.
// 줄 수는 머리 1 + 재무 항목 6(목업 statements 와 같은 수 — SKELETON_COMPANY_ROW_COUNT 를 빌려 쓴다).
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
                                <div className="flex h-lh items-center justify-center">
                                    <SkeletonBar className="h-3 w-full max-w-12" />
                                </div>
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

// 표 자리 — 실제 보고서 표(ReportTable)와 같은 머리 면 · 줄 선 · 칸 여백에 글자 대신 막대를 둔다.
// headRows 2 는 두 단 머리(거래처 표), isBadgeRow 는 값 칸 높이가 고정돼 줄이 더 높은 표(거래처 표의 신용등급 칸)에 쓴다.
const ReportTableSkeleton = ({
    columns,
    rows,
    headRows = 1,
    isBadgeRow = false,
}: {
    columns: number
    rows: number
    headRows?: number
    /** 값 칸 높이가 고정된 표(거래처 표의 신용등급 칸, h-7) — 줄이 더 높다. */
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
                    <div
                        key={column}
                        className={cn(
                            'typo-body-l-regular box-content flex items-center justify-center px-4 pt-3 pb-2.75',
                            isBadgeRow && row >= headRows ? 'h-7' : 'h-lh',
                        )}
                    >
                        <SkeletonBar className="h-3 w-full max-w-16" />
                    </div>
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
                        <div className="typo-body-l-regular flex h-lh items-center justify-center">
                            <SkeletonBar className="w-16" />
                        </div>
                    ),
                    value: (
                        <div className="typo-body-l-regular flex h-lh items-center">
                            <SkeletonBar className="w-full max-w-60" />
                        </div>
                    ),
                }))}
            />
        </section>
        <section aria-labelledby="ig-company-skeleton-management" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-management" title="경영진 및 주주현황" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card title="경영진 현황" className="gap-4">
                    <ReportTableSkeleton columns={3} rows={4} />
                </Card>
                <Card title="주주 현황" className="gap-0">
                    <SkeletonWithUnit>
                        <ReportTableSkeleton columns={4} rows={4} />
                    </SkeletonWithUnit>
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-company-skeleton-affiliates" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-affiliates" title="관계기업 현황" date="단위: 백만원" />
            <ReportTableSkeleton columns={6} rows={3} />
        </section>
        <section aria-labelledby="ig-company-skeleton-ip" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-ip" title="특허 및 인증현황" />
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card title="재무상태" className="gap-0">
                    <div className="flex min-w-0 flex-col gap-6">
                        <SkeletonWithUnit>
                            <ReportTableSkeleton columns={4} rows={3} />
                        </SkeletonWithUnit>
                        <ChartSkeleton type="overlay-column" label="재무상태를 불러오는 중입니다." />
                    </div>
                </Card>
                <Card title="손익현황" className="gap-0">
                    <div className="flex min-w-0 flex-col gap-6">
                        <SkeletonWithUnit>
                            <ReportTableSkeleton columns={4} rows={3} />
                        </SkeletonWithUnit>
                        <ChartSkeleton type="overlay-column" label="손익현황을 불러오는 중입니다." />
                    </div>
                </Card>
                <Card title="주요재무비율" className="gap-0">
                    <div className="flex min-w-0 flex-col gap-6">
                        <SkeletonWithUnit>
                            <ReportTableSkeleton columns={4} rows={5} />
                        </SkeletonWithUnit>
                        <ChartSkeleton type="columns-line" label="주요재무비율을 불러오는 중입니다." />
                    </div>
                </Card>
                <Card title="현금흐름" className="gap-0">
                    <div className="flex min-w-0 flex-col gap-6">
                        <SkeletonWithUnit>
                            <ReportTableSkeleton columns={4} rows={5} />
                        </SkeletonWithUnit>
                        <ChartSkeleton type="columns-line" label="현금흐름을 불러오는 중입니다." />
                    </div>
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-company-skeleton-trade" className="flex flex-col gap-4">
            <SectionTitle id="ig-company-skeleton-trade" title="거래처현황" />
            <div className="flex flex-col gap-6">
                {['매출처', '매입처'].map((title) => (
                    <Card key={title} title={title} className="gap-0">
                        <SkeletonWithUnit>
                            <ReportTableSkeleton columns={6} rows={5} headRows={2} isBadgeRow />
                        </SkeletonWithUnit>
                    </Card>
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
                <div key={index} className="typo-body-xl-regular flex h-lh items-center">
                    <SkeletonBar className={index === TECH_SKELETON_NOTICE_LINES - 1 ? 'w-1/3' : 'w-full'} />
                </div>
            ))}
        </div>
        <section aria-labelledby="ig-tech-skeleton-holdings" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-holdings" title="보유기술" />
            <div className="flex flex-col gap-6">
                <Card title="기술 보유현황" description={<SkeletonBar className="w-160" />}>
                    <div className="grid grid-cols-2 gap-12">
                        <ChartSkeleton type="donut" label="중분류 기준 보유기술을 불러오는 중입니다." />
                        <ChartSkeleton type="donut" label="세부분야 기준 보유기술을 불러오는 중입니다." />
                    </div>
                </Card>
                <Card title="특허 보유현황" className="gap-0">
                    <SkeletonWithUnit>
                        <ReportTableSkeleton columns={6} rows={10} isBadgeRow />
                    </SkeletonWithUnit>
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
                <Card title="경쟁기업 사업실적 (매출액, 영업이익률)" className="gap-0">
                    <SkeletonWithUnit>
                        <ComboBarLineChartSkeleton />
                    </SkeletonWithUnit>
                </Card>
                <Card title="성장률 우수기업">
                    <DivergingRankChartSkeleton label="성장률 우수기업을 불러오는 중입니다." />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-tech-skeleton-excellent" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-skeleton-excellent" title="맞춤형 기술정보 · 우수기술" />
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

// 단위 줄 자리 — 실제 WithUnit 과 같은 높이.
const SkeletonWithUnit = ({children}: {children: ReactNode}) => (
    <div className="flex min-w-0 flex-col gap-1">
        <div className="typo-body-l-regular flex h-lh items-center justify-end" aria-hidden="true">
            <SkeletonBar className="w-20" />
        </div>
        {children}
    </div>
)

// 활동성정보 탭 스켈레톤 — 실제 탭(innovation-growth-report-activity.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const ActivityTabSkeleton = () => (
    <>
        <section aria-labelledby="ig-activity-skeleton-hr" className="flex flex-col gap-4">
            <SectionTitle id="ig-activity-skeleton-hr" title="인적자원 현황" />
            <div className="flex flex-col gap-6">
                <Card>
                    <SkeletonWithUnit>
                        <ReportTableSkeleton columns={6} rows={3} />
                    </SkeletonWithUnit>
                </Card>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,792fr)_minmax(0,384fr)]">
                    <Card title="분기별 종업원수" className="gap-0">
                        <SkeletonWithUnit>
                            <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
                        </SkeletonWithUnit>
                    </Card>
                    <Card title="인당 매출액" className="gap-0">
                        <SkeletonWithUnit>
                            <ChartSkeleton type="cells-column" label="인당 매출액을 불러오는 중입니다." />
                        </SkeletonWithUnit>
                    </Card>
                </div>
            </div>
        </section>
        <section aria-labelledby="ig-activity-skeleton-energy" className="flex flex-col gap-4">
            <SectionTitle id="ig-activity-skeleton-energy" title="에너지 사용 현황" />
            <div className="flex flex-col gap-6">
                {['전기 사용량', '가스 사용량'].map((title) => (
                    <Card key={title} title={title} className="gap-0">
                        <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-2">
                            <SkeletonWithUnit>
                                <ReportTableSkeleton columns={4} rows={3} />
                            </SkeletonWithUnit>
                            <div className="flex flex-col gap-2">
                                <ChartSkeleton type="columns-line" label={`${title}을 불러오는 중입니다.`} />
                                <SkeletonLegend count={3} className="justify-center" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    </>
)

// Tech-Index 탭 스켈레톤 — 실제 탭(innovation-growth-report-tech-index.tsx)과 같은 구획 · 카드 짜임(PC 폭 전용).
const SKELETON_DESCRIPTION_COUNT = 3
const SKELETON_CAPABILITIES = ['인프라', '투입', '활동', '성과'] as const
const SKELETON_INDICATORS = ['인프라·투입 부문', '활동·성과 부문'] as const

// 안내 상자 자리 — 실제 NoticeBox 와 같은 여백 · 줄 높이에 줄 수만큼 막대를 둔다.
const SkeletonNoticeBox = ({lines}: {lines: number}) => (
    <div className="border-subtle-3 typo-body-xl-regular flex flex-col items-center rounded-sm border px-5 py-4">
        {Array.from({length: lines}, (_, index) => (
            <div key={index} className="flex h-lh w-full items-center justify-center">
                <SkeletonBar className={index === lines - 1 && lines > 1 ? 'w-1/3' : 'w-3/4'} />
            </div>
        ))}
    </div>
)

const TechIndexTabSkeleton = () => (
    <>
        {/* 지수설명 — 실제 탭과 같은 상자에 설명 줄 자리. */}
        <section
            aria-labelledby="ig-tech-index-skeleton-description"
            className="border-subtle-3 bg-card -mt-4 flex flex-col gap-4 rounded-lg border px-10 py-8"
        >
            <h3 id="ig-tech-index-skeleton-description" className="typo-h4-bold text-foreground">
                지수설명
            </h3>
            <div className="typo-body-xl-regular flex flex-col gap-2" aria-hidden="true">
                {Array.from({length: SKELETON_DESCRIPTION_COUNT}, (_, index) => (
                    <div key={index} className="flex h-lh items-center">
                        <SkeletonBar className={index === SKELETON_DESCRIPTION_COUNT - 1 ? 'w-2/3' : 'w-full'} />
                    </div>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-tech-index-skeleton-score" className="flex flex-col gap-6">
            <h3 id="ig-tech-index-skeleton-score" className="sr-only">
                혁신성장역량지수
            </h3>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card className="justify-center gap-4">
                    {/* 게이지 → 평가일자 줄. */}
                    <div className="flex flex-col items-center gap-2">
                        <ChartSkeleton
                            type="score-gauge"
                            label="Tech-Index 점수를 불러오는 중입니다."
                            className="w-80"
                        />
                        <div className="typo-body-xl-regular flex h-lh items-center" aria-hidden="true">
                            <SkeletonBar className="w-40" />
                        </div>
                    </div>
                    <SkeletonNoticeBox lines={1} />
                </Card>
                <Card title="Tech-Index 표준정보 비교" aside={<SkeletonBar className="w-24" />} className="gap-4">
                    <DistributionCurveChartSkeleton label="Tech-Index 표준정보를 불러오는 중입니다." />
                    <SkeletonNoticeBox lines={2} />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-tech-index-skeleton-indicators" className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <SectionTitle id="ig-tech-index-skeleton-indicators" title="혁신성장역량지수 부문별 지표 비교" />
                <SkeletonLegend count={2} />
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {SKELETON_INDICATORS.map((title) => (
                    <Card key={title} title={title} className="gap-4">
                        <ChartSkeleton type="circle-radar" label={`${title}를 불러오는 중입니다.`} className="h-54" />
                    </Card>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-tech-index-skeleton-comparison" className="flex flex-col gap-4">
            <SectionTitle id="ig-tech-index-skeleton-comparison" title="혁신성장역량지수 비교" />
            <div className="flex flex-col gap-8">
                <Card title="기업 유형별 Tech-Index 비교" className="gap-4">
                    <ChartSkeleton type="cells-column" label="기업 유형별 Tech-Index 를 불러오는 중입니다." />
                </Card>
                <section aria-labelledby="ig-tech-index-skeleton-capability" className="flex flex-col gap-4">
                    <SubSectionTitle id="ig-tech-index-skeleton-capability" title="4대 혁신역량 부분별 비교" />
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                        {SKELETON_CAPABILITIES.map((label) => (
                            <div
                                key={label}
                                className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6"
                            >
                                <ChartSkeleton type="cells-column" label={`${label} 점수를 불러오는 중입니다.`} />
                                <p className="typo-body-xl-bold text-foreground text-center">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section aria-labelledby="ig-tech-index-skeleton-by-type" className="flex flex-col gap-4">
                    <SubSectionTitle id="ig-tech-index-skeleton-by-type" title="기업 유형별 4대 혁신역량 비교" />
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {SKELETON_CAPABILITIES.map((label) => (
                            <Card key={label} title={label} titleAs="h5" className="gap-4">
                                <ChartSkeleton
                                    type="cells-column"
                                    label={`기업 유형별 ${label} 점수를 불러오는 중입니다.`}
                                />
                            </Card>
                        ))}
                    </div>
                </section>
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-2">
                    <GradeScaleGaugeSkeleton label="현금흐름등급을 불러오는 중입니다." hasDescription={false} />
                    <ReportTableSkeleton columns={2} rows={3} />
                </div>
                <SkeletonNoticeBox lines={1} />
                <div className="flex flex-col gap-4">
                    <h4 className="typo-body-xl-bold text-foreground">기업신용정보</h4>
                    <div className="grid grid-cols-1 gap-x-12 gap-y-4 xl:grid-cols-2">
                        {SKELETON_CREDIT_INFO_TABLES.map((columns, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="typo-body-l-medium flex h-lh items-center">
                                    <SkeletonBar className="w-32" />
                                </div>
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
                    <Card key={title} title={title} className="gap-0">
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <SkeletonWithUnit>
                                <ReportTableSkeleton columns={5} rows={4} />
                            </SkeletonWithUnit>
                            <div className="flex flex-col gap-2">
                                <ChartSkeleton type="columns-line" label={`${title} 재무비율을 불러오는 중입니다.`} />
                                <SkeletonLegend count={4} className="justify-center" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
        <section aria-labelledby="ig-credit-skeleton-borrowing" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-borrowing" title="차입금 분석" />
            <div className="flex flex-col gap-6">
                <Card title="차입금 변동률" className="gap-0">
                    <SkeletonWithUnit>
                        <ChartSkeleton type="cells-line" label="차입금 변동률을 불러오는 중입니다." />
                    </SkeletonWithUnit>
                </Card>
                <Card title="차입금 현황" className="gap-0">
                    <SkeletonWithUnit>
                        <ReportTableSkeleton columns={8} rows={SKELETON_BORROWING_ROWS} headRows={2} />
                    </SkeletonWithUnit>
                </Card>
                <Card title="차입금 변동현황" className="gap-4">
                    <ReportTableSkeleton columns={4} rows={4} />
                </Card>
            </div>
        </section>
        <section aria-labelledby="ig-credit-skeleton-borrowing-status" className="flex flex-col gap-4">
            <SectionTitle id="ig-credit-skeleton-borrowing-status" title="차입금 현황" />
            <div className="flex flex-col gap-6">
                <Card title="기관별 비중" className="gap-0">
                    <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-2">
                        <SkeletonWithUnit>
                            <ReportTableSkeleton columns={4} rows={5} />
                        </SkeletonWithUnit>
                        <ChartSkeleton type="donut" label="기관별 비중을 불러오는 중입니다." />
                    </div>
                </Card>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card title="신용/담보 비중" className="gap-0">
                        <div className="flex min-w-0 flex-col gap-6">
                            <SkeletonWithUnit>
                                <div className="flex flex-col gap-2">
                                    <ChartSkeleton type="columns-line" label="신용/담보 비중을 불러오는 중입니다." />
                                    <SkeletonLegend count={2} className="justify-center" />
                                </div>
                            </SkeletonWithUnit>
                            <SkeletonBar className="h-4 w-full rounded-full" />
                        </div>
                    </Card>
                    <Card title="담보 현황" className="gap-0">
                        <SkeletonWithUnit>
                            <ChartSkeleton type="donut" label="담보 현황을 불러오는 중입니다." />
                        </SkeletonWithUnit>
                    </Card>
                </div>
            </div>
        </section>
    </>
)

// 주소의 ?tab= 을 읽어 그 탭 모양의 스켈레톤을 고른다 — loading.tsx 는 주소 쿼리를 모르므로 여기서 고른다(Suspense 안에서만 쓴다).
const SkeletonFromQuery = () => {
    const searchParams = useSearchParams()
    const tabParam = searchParams.get(INNOVATION_REPORT_TAB_QUERY)
    return (
        <ReportSkeleton activeTab={tabParam && isReportTab(tabParam) ? tabParam : INNOVATION_REPORT_SECTIONS[0].id} />
    )
}

const ReportSkeleton = ({activeTab}: {activeTab: InnovationReportSectionId}) => {
    const isPcOnlyTab = activeTab !== INNOVATION_REPORT_SECTIONS[0].id
    const activeSection =
        INNOVATION_REPORT_SECTIONS.find((section) => section.id === activeTab) ?? INNOVATION_REPORT_SECTIONS[0]

    return (
        // main 은 layout.tsx 가 하나만 그린다(문서와 같은 이유).
        <div aria-busy="true" className={cn(isPcOnlyTab && 'max-md:min-w-3xl')}>
            <p role="status" className="sr-only">
                보고서를 불러오는 중입니다.
            </p>
            <header className="bg-tab-pill-active text-tab-pill-active-foreground">
                <div
                    className={cn(
                        'max-w-content mx-auto flex flex-col items-start gap-6 px-4 py-6 md:flex-row md:justify-between md:gap-12 md:px-6 xl:px-0',
                        isPcOnlyTab && 'flex-row justify-between gap-12 px-6 xl:px-0',
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
                    {/* 버튼 자리 — 모바일은 [보고서 다운로드] · [더보기], 그 위는 [보고서 다운로드]. */}
                    <div className="flex shrink-0 gap-2 md:self-center">
                        <Skeleton className="bg-tab-pill-active-foreground/20 h-control-h-md w-36 rounded-sm" />
                        <Skeleton
                            className={cn(
                                'bg-tab-pill-active-foreground/20 h-control-h-md w-24 rounded-sm md:hidden',
                                isPcOnlyTab && 'hidden',
                            )}
                        />
                    </div>
                </div>
            </header>

            <div
                className={cn(
                    'max-w-content mx-auto flex flex-col gap-10 px-4 py-10 md:px-6 xl:px-0',
                    isPcOnlyTab && 'px-6 xl:px-0',
                )}
            >
                {/* 받는 동안의 탭 줄 — 모양만 있는 자리라 Tabs 를 쓰지 않는다. 스켈레톤은 스트리밍 HTML 한 벌에
                    여러 벌 담기는데, Tabs 가 붙이는 id 가 벌마다 같아 id 중복이 된다[8.1.1]. 누를 수 없는
                    표시라 읽을 필요도 없어 숨긴다 — 받는 중이라는 사실은 위의 role="status" 가 알린다. */}
                <div
                    aria-hidden="true"
                    className={cn('flex flex-wrap gap-2 max-md:hidden', isPcOnlyTab && 'max-md:flex')}
                >
                    {INNOVATION_REPORT_SECTIONS.map((section) => (
                        <span
                            key={section.id}
                            className={cn(
                                'typo-body-xl-medium h-control-h-md border-subtle-3 bg-surface text-foreground-subtle flex items-center rounded-sm border px-6',
                                section.id === activeTab &&
                                    'bg-tab-pill-active text-tab-pill-active-foreground border-transparent font-bold',
                            )}
                        >
                            {section.label}
                        </span>
                    ))}
                </div>
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
                        <section aria-label="기업 정보" className="flex flex-col gap-4">
                            <SectionTitle title="기업 정보" />
                            <InfoTable
                                aria-label="기업 정보"
                                items={Array.from({length: SKELETON_COMPANY_ROW_COUNT}, (_, index) => ({
                                    key: String(index),
                                    // 막대는 글자 한 줄 높이(h-lh) 안에 둔다 — 실제 칸과 줄 높이가 같게.
                                    label: (
                                        <div className="typo-body-l-regular flex h-lh items-center justify-center">
                                            <SkeletonBar className="w-16" />
                                        </div>
                                    ),
                                    value: (
                                        <div className="typo-body-l-regular flex h-lh items-center">
                                            <SkeletonBar className="w-full max-w-60" />
                                        </div>
                                    ),
                                }))}
                            />
                        </section>

                        <section aria-label="기술혁신정보" className="flex flex-col gap-4">
                            <SectionTitle title="기술혁신정보" />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card title="기업 보유기술" aside="세부분야 기준" className="xl:min-h-100">
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

                        <section aria-label="혁신성장역량지수" className="flex flex-col gap-4">
                            <SectionTitle title="혁신성장역량지수" />
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                <Card aside={<SkeletonBar className="w-56" />} className="xl:min-h-76">
                                    <ChartSkeleton type="score-gauge" label="혁신성장역량지수를 불러오는 중입니다." />
                                </Card>
                                <Card className="justify-center xl:min-h-76">
                                    <ChartSkeleton type="rank-pyramid" label="동일업종 순위를 불러오는 중입니다." />
                                </Card>
                            </div>
                            {/* 안내 문구 자리 — 실제 요약 상자와 같은 짜임. PC 는 한 줄, 모바일은 네 줄로 접힌다. */}
                            <div className="border-subtle-3 typo-body-xl-regular mt-2 flex flex-col items-start rounded-sm border px-5 py-5 md:items-center">
                                <div className="flex h-lh w-full items-center md:justify-center">
                                    <SkeletonBar className="w-full max-w-160" />
                                </div>
                                {Array.from({length: SKELETON_NOTE_MOBILE_EXTRA_LINES}, (_, index) => (
                                    <div key={index} className="flex h-lh w-full items-center md:hidden">
                                        <SkeletonBar
                                            className={
                                                index === SKELETON_NOTE_MOBILE_EXTRA_LINES - 1 ? 'w-2/5' : 'w-full'
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section aria-label="신용/재무 현황" className="flex flex-col gap-4">
                            <SectionTitle title="신용/재무 현황" />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <Card title="기업신용등급" className="gap-4">
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
                            <Card title="최근 3개년 재무 현황" className="gap-0">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,359fr)_minmax(0,767fr)]">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <p className="typo-body-l-regular text-foreground-subtle text-end">
                                            단위: 백만원
                                        </p>
                                        <StatementTableSkeleton />
                                    </div>
                                    <ChartSkeleton
                                        type="grouped-column"
                                        label="최근 3개년 재무 현황을 불러오는 중입니다."
                                    />
                                </div>
                            </Card>
                        </section>

                        <section aria-label="활동성 정보" className="flex flex-col gap-4">
                            <SectionTitle title="활동성 정보" />
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,792fr)_minmax(0,384fr)]">
                                <Card title="분기별 종업원수" className="gap-0">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <p className="typo-body-l-regular text-foreground-subtle text-end">단위: 명</p>
                                        <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
                                    </div>
                                </Card>
                                <Card title="인당 매출액" className="gap-0">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <p className="typo-body-l-regular text-foreground-subtle text-end">
                                            단위: 천원
                                        </p>
                                        <ChartSkeleton type="cells-column" label="인당 매출액을 불러오는 중입니다." />
                                    </div>
                                </Card>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}

// 문서 · 스켈레톤은 주소의 ?tab= 을 읽는다(useSearchParams) — 정적 생성(빌드) 때는 주소를 알 수 없으므로 Suspense 로 감싸고,
// 그 동안에는 첫 탭(진단브리핑) 모양의 스켈레톤을 보인다. 감싸지 않으면 빌드가 실패한다(missing-suspense-with-csr-bailout).
const FIRST_TAB = INNOVATION_REPORT_SECTIONS[0].id

const InnovationGrowthReportDocument = (props: InnovationGrowthReportDocumentProps) => (
    <Suspense fallback={<ReportSkeleton activeTab={FIRST_TAB} />}>
        <ReportDocumentBody {...props} />
    </Suspense>
)

// 받는 동안의 문서 — 탭을 넘기면 그 탭 모양으로, 넘기지 않으면 주소의 ?tab= 을 읽어 고른다(loading.tsx).
const InnovationGrowthReportDocumentSkeleton = ({activeTab}: {activeTab?: InnovationReportSectionId}) =>
    activeTab ? (
        <ReportSkeleton activeTab={activeTab} />
    ) : (
        <Suspense fallback={<ReportSkeleton activeTab={FIRST_TAB} />}>
            <SkeletonFromQuery />
        </Suspense>
    )

export {InnovationGrowthReportDocument, InnovationGrowthReportDocumentSkeleton}
export type {InnovationGrowthReportDocumentProps}
