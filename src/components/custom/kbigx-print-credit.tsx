import type {ReactNode} from 'react'
import {DonutListChart} from '@/components/custom/donut-list-chart'
import {DualLineChart} from '@/components/custom/dual-line-chart'
import {InsideLabelPieChart} from '@/components/custom/inside-label-pie-chart'
import {
    KBX_CASH_FLOW_TAG_CLASS,
    KBX_CHART_EMPTY_CLASS,
    KBX_CHART_EMPTY_TEXT,
    KbxBlock,
    KbxChartBox,
    KbxFitName,
    KbxPrivateCell,
    KbxPrivateContent,
    KbxSubBlock,
    KbxTable,
    KbxUnitBelow,
} from '@/components/custom/kbigx-print-parts'
import {MarkerLineChart, MarkerLineLegend} from '@/components/custom/marker-line-chart'
import {RatingTrendChart} from '@/components/custom/rating-trend-chart'
import {ValueLineChart} from '@/components/custom/value-line-chart'
import {CASH_FLOW_GRADES_LOW_FIRST, cashFlowLevel, findCashFlowGrade} from '@/content/service/cash-flow-grades'
import {criGradePercentage, findCriGrade, getCriGradeTone} from '@/content/service/cri-grades'
import {
    getRecentYears,
    INNOVATION_CREDIT_VISIBILITY,
    isSameYear,
    type InnovationGrowthReport,
} from '@/content/service/k-bigx-innovation-report'
import type {KbigxPrintPage} from '@/content/service/k-bigx-print-report'
import {cn} from '@/lib/utils'
import {PRIVATE_PLACEHOLDER, PRIVATE_SHORT_LABEL} from '@/components/composite/private-content'
import {
    isKbxNumber,
    KBX_EMPTY_VALUE,
    KBX_NOT_APPLICABLE_TEXT,
    kbxFixed1Format,
    kbxFixed2Format,
    kbxNumberFormat,
} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — 신용/재무정보 장(쪽 6개 — 기업신용정보는 표가 많으면 '(계속)' 쪽이 붙는다).
// [프론트엔드 연동] 값은 report.creditDetail · report.creditFinance(기업신용등급)에서 읽는다. 화면 보고서 신용/재무정보 탭
// (innovation-growth-report-credit.tsx)과 같은 값 · 정렬 · 비공개 규칙(INNOVATION_CREDIT_VISIBILITY)을 쓴다.
// 공통 규칙: 값이 없거나 숫자가 아니면 '-', 0 은 현행 포맷(0 · 0.0 · 0.00)으로 적는다.
// 비공개 케이스: 가린 자리는 실제 값 대신 가짜 값(PRIVATE_PLACEHOLDER — composite/private-content.tsx, 웹 보고서와 공용)으로
//   그려 흐리게 덮는다(KbxPrivateContent · KbxPrivateCell).

type PageProps = {report: InnovationGrowthReport}

// 기업신용정보 표는 표마다 값 한 줄 — 받은 줄 중 첫 줄만 그린다.
// k-bigx-print-report.ts 의 CREDIT_INFO_PAGE.blockHeight 가 '값 한 줄'로 어림하므로 이 값을 바꾸면 그쪽도 고친다.
const CREDIT_INFO_ROW_LIMIT = 1
const OVERDUE_AMOUNT_COLUMN = '연체금액'
// 기업신용등급 아래 줄 — rating.details 에서 이 label 로 찾아 적는다. 없으면 '-'.
const RATING_DETAIL_LABELS = ['평가일자', '결산일자'] as const

// [프론트엔드 연동] 이력은 평가일자 최근 것부터(화면과 같다). date 문자열 비교라 'YYYY-MM-DD' 처럼 자릿수가 고정된 형식이어야 한다.
const byLatestDate = (a: {date: string}, b: {date: string}) => b.date.localeCompare(a.date)

// 기업신용등급 알약 색 — getCriGradeTone 결과별 kbx grade-tag 색. tone 이 없으면 GradePill 기본(남색 테두리).
const GRADE_TAG_CLASS = {
    weak: 'bg-kbx-grade-tag-weak border-kbx-grade-tag-weak text-kbx-paper',
    poor: 'bg-kbx-grade-tag-poor border-kbx-grade-tag-poor text-kbx-paper',
    normal: 'bg-kbx-grade-tag-normal border-kbx-grade-tag-normal text-kbx-paper',
    good: 'bg-kbx-grade-tag-good border-kbx-grade-tag-good text-kbx-paper',
    excellent: 'bg-kbx-grade-tag-excellent border-kbx-grade-tag-excellent text-kbx-paper',
} as const
const GradePill = ({className, children}: {className?: string; children: string}) => (
    <span
        className={cn(
            'kbx-text-22 font-kbx-extrabold kbx-border-regular border-kbx-primary text-kbx-primary py-kbx-5 px-kbx-18 shrink-0 rounded-full whitespace-nowrap',
            className,
        )}
    >
        {children}
    </span>
)

// 등급표에 없는 코드를 받으면 정의 상자에 이 문구를 적는다(기업신용등급 · 현금흐름등급 공통). 빈 값이면 정의 상자 없음.
const UNKNOWN_GRADE_TEXT = '존재하지 않는 등급입니다.'
const CASH_FLOW_LOWEST = CASH_FLOW_GRADES_LOW_FIRST[0].grade
const CASH_FLOW_HIGHEST = CASH_FLOW_GRADES_LOW_FIRST[CASH_FLOW_GRADES_LOW_FIRST.length - 1].grade

// 이력 그래프 · 정의 상자 색 · 모양 — 기업신용등급 · 현금흐름등급이 같이 쓴다.
const TREND_CHART_COLORS = {
    line: 'var(--kbx-color-blue)',
    grid: 'var(--kbx-color-border)',
    grade: 'var(--kbx-color-foreground)',
    current: 'var(--kbx-color-blue)',
    label: 'var(--kbx-color-foreground-subtle)',
    dotFill: 'var(--kbx-color-paper)',
}
// 정의 상자 — 옅은 면 · 왼쪽 남색 굵은 선(Tech-Index 요약 상자와 같은 모양).
const DEFINITION_BOX_CLASS =
    'bg-kbx-surface border-kbx-primary kbx-border-l-heavy kbx-text-22 font-kbx-semibold leading-kbx-155 min-w-0 flex-1 px-6 py-kbx-18 break-keep'

// 등급 머리 — 왼쪽(폭 440): 큰 등급 코드 + 알약(등급 이름) → children(평가일자 · 안내 문장).
// 오른쪽: 등급 정의 상자(남은 폭). 사이 56, 세로 가운데.
const GradeHeader = ({
    grade,
    name,
    tagClassName,
    definition,
    children,
}: {
    grade: string
    name?: string
    tagClassName?: string
    definition?: string
    children: ReactNode
}) => (
    <div className="flex items-center gap-14">
        <div className="flex w-110 shrink-0 flex-col gap-4">
            <div className="text-kbx-primary gap-kbx-18 flex items-baseline">
                <span className="kbx-text-116 font-kbx-black leading-kbx-90 tracking-kbx-tight">{grade}</span>
                {name ? <GradePill className={tagClassName}>{name}</GradePill> : null}
            </div>
            {children}
        </div>
        {/* p 대신 div — 큰 글자 짧은 문단을 접근성 검사기가 제목 후보로 잡지 않게(WAVE Possible heading). */}
        {definition ? <div className={DEFINITION_BOX_CLASS}>{definition}</div> : null}
    </div>
)

// 이력 건수 — 표 · 그래프 모두 최근 3건. 표는 늘 3줄이고 모자라면 '-' 줄로 채운다(전체 이력은 웹 화면에서 본다).
const HISTORY_ROW_COUNT = 3

// 이력 — 왼쪽 그래프(오래된 것부터) · 오른쪽 표(최근 것부터, 3줄). chart · rows 는 같은 3건을 순서만 달리 넘긴다.
// 값이 없으면 그래프 자리는 빈 상태(KbxChartBox).
const GradeHistory = ({
    title,
    gradeHeader,
    chart,
    rows,
    emptyText,
}: {
    title: string
    gradeHeader: string
    chart: {id: string; label: string; grade: string; rank: number}[]
    rows: {date: string; grade: string}[]
    emptyText: string
}) => (
    <KbxSubBlock title={title} className="mt-2">
        {/* 본문 1168 − 사이 40 을 85:56 으로 → 그래프 680 · 표 448. */}
        <div className="grid grid-cols-[85fr_56fr] items-start gap-10">
            <KbxChartBox isEmpty={!chart.length} emptyClassName="h-69">
                <RatingTrendChart ariaLabel={title} data={chart} colors={TREND_CHART_COLORS} />
            </KbxChartBox>
            <KbxTable
                caption={title}
                columns={[
                    {key: 'grade', header: gradeHeader, isRowHeader: true},
                    {key: 'date', header: '평가일자'},
                ]}
                emptyText={emptyText}
                rows={Array.from({length: HISTORY_ROW_COUNT}, (_, index) => {
                    const item = rows[index]
                    return item
                        ? {key: item.date, cells: [item.grade, item.date]}
                        : {key: `empty-${index}`, cells: [KBX_EMPTY_VALUE, KBX_EMPTY_VALUE]}
                })}
            />
        </div>
    </KbxSubBlock>
)

// ── 신용/재무정보 1 — 기업신용등급(등급 · 정의 · 이전평가이력) · 현금흐름등급(등급 · 정의 · 평가이력) ──

const KbigxPrintCreditRating = ({report}: PageProps) => {
    const {rating} = report.creditFinance
    const {ratingHistory, cashFlow} = report.creditDetail
    const criGrade = findCriGrade(rating.grade)
    const tone = getCriGradeTone(rating.grade)
    // 이력은 받은 순서와 관계없이 날짜로 정렬해 최근 3건만 쓴다(이전평가이력은 지금 등급 포함).
    const previousRatings = [...ratingHistory].sort(byLatestDate).slice(0, HISTORY_ROW_COUNT)
    const cashFlowHistory = [...cashFlow.history].sort(byLatestDate).slice(0, HISTORY_ROW_COUNT)
    const cashFlowGrade = findCashFlowGrade(cashFlow.grade)
    // level 은 CF1 = 1 … CF6 = 6(클수록 낮은 등급). 안내 문장 · 그래프 높낮이는 낮은 쪽부터 센 순번으로 뒤집어 쓴다.
    // 등급표에 없는 코드 · 빈 값이면 0.
    const level = cashFlowLevel(cashFlow.grade)
    const levelFromLow = level ? CASH_FLOW_GRADES_LOW_FIRST.length - level + 1 : 0

    return (
        <>
            <KbxBlock title="기업신용등급">
                <GradeHeader
                    grade={rating.grade || KBX_EMPTY_VALUE}
                    name={criGrade?.name}
                    tagClassName={tone ? GRADE_TAG_CLASS[tone] : undefined}
                    definition={rating.grade && !criGrade ? UNKNOWN_GRADE_TEXT : criGrade?.definition}
                >
                    <dl className="kbx-text-21 text-kbx-foreground-subtle flex gap-7 whitespace-nowrap">
                        {RATING_DETAIL_LABELS.map((label) => (
                            <div key={label} className="flex gap-1.5">
                                <dt>{label}</dt>
                                <dd className="text-kbx-foreground font-kbx-bold">
                                    {rating.details.find((item) => item.label === label)?.value || KBX_EMPTY_VALUE}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </GradeHeader>
                <GradeHistory
                    title="이전평가이력"
                    gradeHeader="신용등급"
                    // 높낮이(rank) — 등급별 게이지 비율(criGradePercentage). 표에 없는 코드는 맨 아래(0).
                    chart={[...previousRatings].reverse().map((item) => {
                        const grade = findCriGrade(item.grade)
                        return {
                            id: item.date,
                            label: item.chartLabel,
                            grade: item.grade,
                            rank: grade ? criGradePercentage(grade) : 0,
                        }
                    })}
                    rows={previousRatings}
                    emptyText="이전 평가 이력이 없습니다."
                />
            </KbxBlock>
            {/* 기업신용등급 → 현금흐름등급 160 — 쪽 기본 간격 80 + mt-20. */}
            <KbxBlock title="현금흐름등급" className="mt-20">
                <GradeHeader
                    grade={cashFlow.grade || KBX_EMPTY_VALUE}
                    name={cashFlowGrade?.name}
                    tagClassName={KBX_CASH_FLOW_TAG_CLASS[level]}
                    definition={cashFlow.grade && !cashFlowGrade ? UNKNOWN_GRADE_TEXT : cashFlowGrade?.definition}
                >
                    {/* 단계 안내 문장 — 등급표에 있는 코드일 때만. 없는 코드 · 빈 값이면 생략한다. */}
                    {levelFromLow ? (
                        <p className="kbx-text-20 leading-kbx-155 text-kbx-foreground-subtle break-keep">
                            현금흐름등급 {cashFlow.grade}. 전체 {CASH_FLOW_GRADES_LOW_FIRST.length}단계(
                            {CASH_FLOW_LOWEST} ~ {CASH_FLOW_HIGHEST}) 중 낮은 쪽부터 {levelFromLow}번째 등급입니다.
                        </p>
                    ) : null}
                </GradeHeader>
                <GradeHistory
                    title="평가이력"
                    gradeHeader="현금흐름등급"
                    chart={[...cashFlowHistory].reverse().map((item) => ({
                        id: item.date,
                        label: item.chartLabel,
                        grade: item.grade,
                        // 높낮이 — 높은 등급(CF1)이 위. 표에 없는 코드는 맨 아래.
                        rank: cashFlowLevel(item.grade)
                            ? CASH_FLOW_GRADES_LOW_FIRST.length - cashFlowLevel(item.grade) + 1
                            : 0,
                    }))}
                    rows={cashFlowHistory}
                    emptyText={KBX_NOT_APPLICABLE_TEXT}
                />
            </KbxBlock>
        </>
    )
}

// ── 신용/재무정보 2 — 기업신용정보(표 여섯) ──

// 표 하나 — 제목 + 상태 알약 → 표(값 한 줄). 열람 케이스(report.viewerCase)에 따라 표 전체 또는 '연체금액' 열을
// 비공개로 가린다 — 웹 보고서와 같은 규칙 · 같은 모양(가짜 값을 흐리게 깔고 '비공개' 를 얹는다, KbxPrivateContent · KbxPrivateCell).
// 열 이름 '연체금액'이 정확히 같아야 그 열을 찾는다.
// [주의] 제목 줄 · 간격을 바꾸면 k-bigx-print-report.ts 의 CREDIT_INFO_PAGE.blockHeight 도 고친다.
const CreditInfoBlock = ({
    table,
    visibility,
}: {
    table: InnovationGrowthReport['creditDetail']['creditInfo'][number]
    visibility: (typeof INNOVATION_CREDIT_VISIBILITY)[keyof typeof INNOVATION_CREDIT_VISIBILITY]
}) => {
    const isHidden = visibility.hiddenInfoTables.includes(table.id)
    const hiddenColumn = visibility.hiddenAmountTables.includes(table.id)
        ? table.columns.indexOf(OVERDUE_AMOUNT_COLUMN)
        : -1
    const columns = table.columns.map((column, index) => ({
        key: `${table.id}-${index}`,
        header: index === hiddenColumn ? <KbxPrivateCell>{column}</KbxPrivateCell> : column,
        isRowHeader: index === 0,
    }))

    return (
        <section aria-label={table.title} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
                <h4 className="kbx-text-23 font-kbx-extrabold">{table.title}</h4>
                <span className="kbx-text-18 font-kbx-extrabold kbx-border-regular border-kbx-primary text-kbx-primary rounded-full px-3 py-0.5">
                    {table.status}
                </span>
            </div>
            {isHidden ? (
                // 표 전체 비공개 — 가짜 값 한 줄로 표 모양을 남기고 '비공개' 를 얹는다(값 한 줄 표와 높이가 같다).
                <KbxPrivateContent label={PRIVATE_SHORT_LABEL}>
                    <KbxTable
                        caption={`${table.title} — ${PRIVATE_SHORT_LABEL}`}
                        columns={columns}
                        rows={[
                            {key: `${table.id}-placeholder`, cells: table.columns.map(() => PRIVATE_PLACEHOLDER.cell)},
                        ]}
                    />
                </KbxPrivateContent>
            ) : (
                <KbxTable
                    caption={`${table.title} — ${table.status}`}
                    columns={columns}
                    emptyText={KBX_NOT_APPLICABLE_TEXT}
                    // 빈 칸 — 옅은 면 · 옅은 글자 · 굵게(행 머리 칸과 같은 굵기).
                    emptyClassName="bg-kbx-surface-subtle font-kbx-bold py-kbx-10"
                    rows={table.rows.slice(0, CREDIT_INFO_ROW_LIMIT).map((row, rowIndex) => ({
                        key: `${table.id}-${rowIndex}`,
                        cells: row.map((value, index) =>
                            // 연체금액 열만 비공개 — 가짜 금액을 흐리게 깔고, 안내는 첫 값 칸에만.
                            index === hiddenColumn ? (
                                <KbxPrivateCell
                                    key={`${table.id}-${rowIndex}-${index}`}
                                    label={rowIndex === 0 ? PRIVATE_SHORT_LABEL : undefined}
                                >
                                    {PRIVATE_PLACEHOLDER.amount}
                                </KbxPrivateCell>
                            ) : (
                                value || KBX_EMPTY_VALUE
                            ),
                        ),
                    }))}
                />
            )}
        </section>
    )
}

// 기업신용정보 쪽 — 표 높이를 고정 어림(CREDIT_INFO_PAGE)으로 쌓아 한 쪽에 8개까지 들어간다(지금 6개라 늘 한 쪽).
// 넘치면 k-bigx-print-report.ts 가 '(계속)' 쪽을 붙이고 page.range 를 넘기므로, 이 쪽은 그 범위의 표만 그린다.
const KbigxPrintCreditInfo = ({report, page}: PageProps & {page: KbigxPrintPage}) => {
    const visibility = INNOVATION_CREDIT_VISIBILITY[report.viewerCase]
    const tables = report.creditDetail.creditInfo.slice(page.range?.start ?? 0, page.range?.end)

    return (
        <KbxBlock title="기업신용정보">
            {/* 표 사이 40(gap-10) — CREDIT_INFO_PAGE.blockHeight 의 40 과 맞물린다. 남는 자리는 아래에 둔다. */}
            <div className="flex flex-col gap-10">
                {tables.map((table) => (
                    <CreditInfoBlock key={table.id} table={table} visibility={visibility} />
                ))}
            </div>
        </KbxBlock>
    )
}

// 소제목 줄 오른쪽 단위 — 12 내려 표 · 그래프 바로 위에 붙인다. 차입금 현황 쪽(기관별 비중 · 신용/담보 비중)만 쓴다.
const CreditUnit = ({children}: {children: ReactNode}) => (
    <span className="kbx-text-18 block translate-y-3">{children}</span>
)

// ── 신용/재무정보 3 · 4 — 재무비율진단(성장성 · 수익성 / 안정성 · 활동성) ──

// 재무비율 계열 색 — 기업현황 주요재무비율 그래프와 같은 순서. 지표 4개라 앞 4색을 쓴다.
const RATIO_SERIES_COLORS = [
    'var(--kbx-color-navy)',
    'var(--kbx-color-blue)',
    'var(--kbx-color-purple)',
    'var(--kbx-color-mint)',
    'var(--kbx-color-orange)',
] as const
const RATIO_CHART_COLORS = {
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-border)',
    category: 'var(--kbx-color-foreground)',
    dotFill: 'var(--kbx-color-paper)',
}
// 재무비율 그래프 폭 — 쪽 본문 폭 1168 전체.
const RATIO_CHART_WIDTH = 1168

// 재무비율 묶음 — 묶음 4개 · 묶음마다 지표 4개 고정. 받은 데이터는 묶음 id · 지표 label 로 찾아 넣고,
// 없는 지표 · 값 · 업종평균 대비는 '-'. 연도는 늘 최근 3개년(getRecentYears). 단위는 받은 unit 이 없을 때만 spec.unit.
// [프론트엔드 연동] 묶음 id 와 지표 label 은 아래 문자열과 정확히 같게 보낸다(다르면 그 줄이 '-').
// 배열 순서대로 2개씩 쪽을 나눈다 — 앞 두 묶음은 credit-finance-3 쪽, 뒤 두 묶음은 credit-finance-4 쪽.
type RatioGroupSpec = {id: string; title: string; unit: string; labels: readonly string[]}
const RATIO_GROUP_SPECS: readonly RatioGroupSpec[] = [
    {
        id: 'growth',
        title: '성장성',
        unit: '%',
        labels: ['매출액증가율', '총자산증가율', '순이익증가율', '영업이익증가율'],
    },
    {
        id: 'profitability',
        title: '수익성',
        unit: '%',
        labels: ['영업이익률', '당기순이익률', '자기자본이익률', '총자본영업이익률'],
    },
    {
        id: 'stability',
        title: '안정성',
        unit: '%, 배',
        labels: ['자기자본비율', '부채비율', '이자보상비율 (배)', '차입금의존도'],
    },
    {
        id: 'activity',
        title: '활동성',
        unit: '회',
        labels: ['총자본회전율', '매출채권회전율', '재고자산회전율', '순운전자본회전율'],
    },
]
const RATIO_GROUPS_PER_PAGE = 2

// 재무비율 한 묶음 — 소제목 → 단위 → 표(재무비율 · 연도 · 업종평균 대비) → 꺾은선 → 범례.
// 그래프 · 범례는 값이 하나라도 있는 지표만 그리고, 모두 없으면 높이 300 의 빈 상태.
const RatioGroup = ({
    spec,
    group,
    receivedYears,
    years,
    className,
}: {
    spec: RatioGroupSpec
    group: InnovationGrowthReport['creditDetail']['ratios'][number] | undefined
    receivedYears: readonly string[]
    years: readonly string[]
    className?: string
}) => {
    const unit = group?.unit || spec.unit
    const rows = spec.labels.map((label, labelIndex) => {
        const row = group?.rows.find((item) => item.label === label)
        return {
            key: `${spec.id}-${labelIndex}`,
            label,
            comparison: row?.comparison,
            values: years.map((year) => {
                const index = receivedYears.findIndex((received) => isSameYear(received, year))
                const value = index < 0 ? undefined : row?.values[index]
                return isKbxNumber(value) ? value : undefined
            }),
        }
    })
    const series = rows
        .map((row, index) => ({
            key: row.key,
            label: row.label,
            color: RATIO_SERIES_COLORS[index % RATIO_SERIES_COLORS.length],
            hasValue: row.values.some(isKbxNumber),
        }))
        .filter((item) => item.hasValue)

    return (
        <KbxSubBlock title={spec.title} className={className}>
            <KbxUnitBelow unit={`단위: ${unit}`}>
                <KbxTable
                    caption={`${spec.title} 재무비율(단위: ${unit})`}
                    columns={[
                        {key: 'label', header: '재무비율', isRowHeader: true, className: 'w-1/4'},
                        ...years.map((year) => ({key: year, header: year})),
                        {key: 'comparison', header: '업종평균 대비', className: 'w-1/6'},
                    ]}
                    rows={rows.map((row) => ({
                        key: row.key,
                        cells: [
                            row.label,
                            ...row.values.map((value) =>
                                isKbxNumber(value) ? kbxFixed2Format.format(value) : KBX_EMPTY_VALUE,
                            ),
                            row.comparison || KBX_EMPTY_VALUE,
                        ],
                    }))}
                />
            </KbxUnitBelow>
            <div className="flex flex-col gap-2.5">
                <KbxChartBox isEmpty={!series.length} emptyClassName="h-75">
                    <>
                        <MarkerLineChart
                            width={RATIO_CHART_WIDTH}
                            ariaLabel={`연도별 ${spec.title} 재무비율`}
                            data={years.map((year, index) => ({
                                id: year,
                                label: year,
                                values: Object.fromEntries(rows.map((row) => [row.key, row.values[index]])),
                            }))}
                            series={series}
                            colors={RATIO_CHART_COLORS}
                            formatValue={(value) => kbxFixed2Format.format(value)}
                        />
                        <MarkerLineLegend
                            series={series}
                            dotFill={RATIO_CHART_COLORS.dotFill}
                            className="kbx-text-16 text-kbx-foreground-subtle"
                        />
                    </>
                </KbxChartBox>
            </div>
        </KbxSubBlock>
    )
}

// 재무비율 쪽 — groupStart 부터 두 묶음. 묶음 사이 40(블록 안 간격 32 + mt-2).
const RatioPage = ({report, groupStart}: PageProps & {groupStart: number}) => {
    const {ratios, ratioYears} = report.creditDetail
    const years = getRecentYears(ratioYears, report.companyStatus.finance.years)

    return (
        <KbxBlock title="재무비율진단">
            {RATIO_GROUP_SPECS.slice(groupStart, groupStart + RATIO_GROUPS_PER_PAGE).map((spec, index) => (
                <RatioGroup
                    key={spec.id}
                    spec={spec}
                    group={ratios.find((item) => item.id === spec.id)}
                    receivedYears={ratioYears}
                    years={years}
                    className={cn(index > 0 && 'mt-2')}
                />
            ))}
        </KbxBlock>
    )
}

const KbigxPrintCreditRatiosFirst = ({report}: PageProps) => <RatioPage report={report} groupStart={0} />
const KbigxPrintCreditRatiosSecond = ({report}: PageProps) => (
    <RatioPage report={report} groupStart={RATIO_GROUPS_PER_PAGE} />
)

// ── 신용/재무정보 5 — 차입금 분석(변동률 그래프 · 차입금 현황 표 · 차입금 변동현황 표) ──

const BORROWING_TREND_COLORS = {
    grid: 'var(--kbx-color-chart-grid)',
    baseline: 'var(--kbx-color-chart-line-subtle)',
    value: 'var(--kbx-color-foreground)',
    label: 'var(--kbx-color-foreground-subtle)',
    dotFill: 'var(--kbx-color-paper)',
}

// 차입금 현황 표는 두 단 머리 · 세로 합친 칸이 있어 KbxTable 대신 직접 그린다. 칸 여백은 KbxTable 기본(위아래 10 ·
// 좌우 14)과 같게 둔다 — KbxTable 기본 여백을 바꾸면 같이 고친다.
const BORROWING_CELL = 'py-kbx-10 px-kbx-14 text-center'
const BORROWING_HEAD = 'bg-kbx-surface border-kbx-border kbx-border-b-regular font-kbx-bold'
const BORROWING_LINE = 'border-kbx-border kbx-border-b-hairline'

type BorrowingRow = InnovationGrowthReport['creditDetail']['borrowings']['total']

// 한 줄의 연도별 금액 · 비중 칸 — 값이 없거나 숫자가 아니면 '-'(0 은 0 · 0.0). row.cells 순서 = borrowings.years.
const borrowingCells = (row: BorrowingRow, className?: string) =>
    row.cells.flatMap((cell, index) => [
        <td key={`${row.key}-${index}-amount`} className={cn(BORROWING_CELL, BORROWING_LINE, className)}>
            {isKbxNumber(cell?.amount) ? kbxNumberFormat.format(cell.amount) : KBX_EMPTY_VALUE}
        </td>,
        <td key={`${row.key}-${index}-ratio`} className={cn(BORROWING_CELL, BORROWING_LINE, className)}>
            {isKbxNumber(cell?.ratio) ? kbxFixed1Format.format(cell.ratio) : KBX_EMPTY_VALUE}
        </td>,
    ])

// 차입금 현황 — 두 단 머리(항목 / 연도 → 금액 · 비중) · 묶음(단기 · 장기 등) 칸 세로 합침 · 묶음별 소계 줄 · 합계 줄.
// 묶음 · 줄 · 연도 수는 받은 데이터대로 늘어난다(고정 줄 없음) — 줄이 많으면 한 쪽을 넘칠 수 있다.
const BorrowingTable = ({borrowings}: {borrowings: InnovationGrowthReport['creditDetail']['borrowings']}) => (
    <table className="border-kbx-primary kbx-text-20 leading-kbx-140 kbx-border-t-strong w-full table-fixed tabular-nums">
        <caption className="sr-only">차입금 현황(단위: 백만원, %)</caption>
        <colgroup>
            <col className="w-1/14" />
            <col className="w-2/11" />
            {borrowings.years.flatMap((year) => [<col key={`${year}-amount`} />, <col key={`${year}-ratio`} />])}
        </colgroup>
        <thead className="text-kbx-primary">
            <tr>
                <th scope="col" colSpan={2} rowSpan={2} className={cn(BORROWING_CELL, BORROWING_HEAD)}>
                    항목
                </th>
                {borrowings.years.map((year) => (
                    <th key={year} scope="colgroup" colSpan={2} className={cn(BORROWING_CELL, BORROWING_HEAD)}>
                        {year}
                    </th>
                ))}
            </tr>
            <tr>
                {borrowings.years.flatMap((year) =>
                    ['금액', '비중'].map((label) => (
                        <th
                            key={`${year}-${label}`}
                            scope="col"
                            className={cn(BORROWING_CELL, BORROWING_HEAD, 'bg-kbx-surface-subtle')}
                        >
                            {label}
                        </th>
                    )),
                )}
            </tr>
        </thead>
        <tbody>
            {borrowings.groups.flatMap((group) => {
                const groupRows = [...group.rows, group.subtotal]
                return groupRows.map((row, rowIndex) => {
                    const isSubtotal = row === group.subtotal
                    return (
                        <tr key={row.key} className={cn(isSubtotal && 'bg-kbx-surface-faint font-kbx-bold')}>
                            {rowIndex === 0 ? (
                                <th
                                    scope="rowgroup"
                                    rowSpan={groupRows.length}
                                    className={cn(
                                        BORROWING_CELL,
                                        'bg-kbx-surface-subtle border-kbx-border kbx-border-r-hairline kbx-border-b-thin font-kbx-bold px-1',
                                    )}
                                >
                                    {group.label}
                                </th>
                            ) : null}
                            <th scope="row" className={cn(BORROWING_CELL, BORROWING_LINE, 'font-kbx-bold px-1')}>
                                {row.label}
                            </th>
                            {borrowingCells(row)}
                        </tr>
                    )
                })
            })}
            {/* 차입금 합계 — 위 남색 선 · 남색 가장 굵은 글자(소계보다 한 단계 강조). */}
            <tr className="bg-kbx-surface text-kbx-primary font-kbx-extrabold">
                <th
                    scope="row"
                    colSpan={2}
                    className={cn(
                        BORROWING_CELL,
                        BORROWING_LINE,
                        'border-t-kbx-primary kbx-border-t-regular font-kbx-extrabold',
                    )}
                >
                    {borrowings.total.label}
                </th>
                {borrowingCells(borrowings.total, 'border-t-kbx-primary kbx-border-t-regular')}
            </tr>
        </tbody>
    </table>
)

// 차입금 변동현황 줄 — 4줄 고정. 받은 줄을 label 로 찾으므로 API 도 이 문자열 그대로 보낸다. 없는 줄 · 연도는 '-'.
const BORROWING_CHANGE_LABELS = ['차입금(백만원)', '차입금/매출액(%)', '차입금상환계수', '총차입금변동률(%)'] as const

// 차입금 분석 쪽 — 변동률(그래프) → 차입금 현황(표) → 차입금 변동현황(표). 소블록 사이 40.
const KbigxPrintCreditBorrowing = ({report}: PageProps) => {
    const {borrowingTrend, borrowings, borrowingChanges} = report.creditDetail
    // 변동현황 연도 — 최근 3개년 고정. 받은 연도가 없으면 차입금 현황 연도를 쓴다.
    const changeYears = getRecentYears(borrowingChanges.years, borrowings.years)

    return (
        <KbxBlock title="차입금 분석">
            <KbxSubBlock title="차입금 변동률">
                <KbxUnitBelow unit="단위: %">
                    <KbxChartBox isEmpty={!borrowingTrend.length} emptyClassName="h-72">
                        <ValueLineChart
                            variant="compact"
                            ariaLabel="월별 차입금 변동률"
                            color="var(--kbx-color-purple)"
                            colors={BORROWING_TREND_COLORS}
                            data={borrowingTrend.map((item) => ({
                                id: item.label,
                                label: item.label,
                                value: item.value,
                            }))}
                        />
                    </KbxChartBox>
                </KbxUnitBelow>
            </KbxSubBlock>
            <KbxSubBlock title="차입금 현황" className="mt-2">
                <KbxUnitBelow unit="단위: 백만원, %">
                    <BorrowingTable borrowings={borrowings} />
                </KbxUnitBelow>
            </KbxSubBlock>
            {/* 단위는 줄 이름에 들어 있어(차입금(백만원) 등) 소제목 단위가 없다. */}
            <KbxSubBlock title="차입금 변동현황" className="mt-2">
                <KbxTable
                    caption="차입금 변동현황"
                    columns={[
                        {key: 'label', header: '구분', isRowHeader: true, className: 'w-1/4'},
                        ...changeYears.map((year) => ({key: year, header: year})),
                    ]}
                    rows={BORROWING_CHANGE_LABELS.map((label) => {
                        const row = borrowingChanges.rows.find((item) => item.label === label)
                        return {
                            key: label,
                            cells: [
                                label,
                                ...changeYears.map((year) => {
                                    const yearIndex = borrowingChanges.years.findIndex((item) => isSameYear(item, year))
                                    const value = yearIndex < 0 ? undefined : row?.values[yearIndex]
                                    return isKbxNumber(value) ? kbxFixed2Format.format(value) : KBX_EMPTY_VALUE
                                }),
                            ],
                        }
                    })}
                />
            </KbxSubBlock>
        </KbxBlock>
    )
}

// ── 신용/재무정보 6 — 차입금 현황(기관별 비중 · 신용/담보 비중 · 담보 현황) ──

// 도넛 조각 색 — 받은 순서대로 짙은 색부터 고른다(데이터의 color 는 쓰지 않는다 — 인쇄본은 kbx 색만 쓴다).
// [프론트엔드 연동] 기관별 비중(share)은 비중 큰 순으로 정렬해 보낸다.
const SHARE_COLORS = [
    'var(--kbx-color-navy)',
    'var(--kbx-color-blue)',
    'var(--kbx-color-blue-lighter)',
    'var(--kbx-color-blue-faint)',
    'var(--kbx-color-purple)',
    'var(--kbx-color-mint)',
    'var(--kbx-color-orange)',
    'var(--kbx-color-chart-neutral)',
] as const
const shareColor = (index: number) => SHARE_COLORS[index % SHARE_COLORS.length]
// 도넛 고리 — viewBox 300 기준 값. 기관별 비중은 230px 로 그려 안쪽 반지름 64 · 조각 틈 2.5px 가 된다.
// 도넛 표시 폭(donutClassName)을 바꾸면 이 값도 다시 환산한다.
const INSTITUTION_RING = {outer: 150, inner: 83.5, gap: 3.26} as const
const COLLATERAL_RING = {outer: 150, inner: 82.1, gap: 3.95} as const
const PERCENT = 100
// 기관별 비중 표 구분 칸 글자 폭 — 표 칸 672(InstitutionShare 의 3fr) × 1/3 − 좌우 여백 28.
// 업권 이름이 이 폭을 넘으면 KbxFitName 이 글자를 줄인다.
const INSTITUTION_LABEL_WIDTH = 196
const shareFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

// 도넛 아래 '{연도} 기준' 글. year 가 없으면 그리지 않는다.
const BaseYearCaption = ({year}: {year?: string}) =>
    year ? <p className="kbx-text-18 text-kbx-foreground-subtle text-center">{year} 기준</p> : null

// 기관별 비중 표 줄 — 업권 5개 고정. 받은 줄을 label 로 찾으므로 API 도 이 문자열 그대로 보낸다. 없는 업권 · 연도는 '-'.
// 표는 institutions.rows(연도별), 도넛은 institutions.share(최근 연도)로 따로 받는다.
const INSTITUTION_LABELS = ['은행업권', '상호금융업권', '저축은행업권', '카드/캐피탈업권', '대부업권'] as const

const InstitutionShare = ({
    institutions,
    years,
}: {
    institutions: InnovationGrowthReport['creditDetail']['institutions']
    years: readonly string[]
}) => (
    // 표(3fr) · 도넛 + 범례 + 기준 연도(2fr) — 사이 48, 세로 가운데. 비율을 바꾸면 INSTITUTION_LABEL_WIDTH ·
    // 소제목 headerClassName 도 고친다.
    <div className="grid grid-cols-[3fr_2fr] items-center gap-12">
        <KbxTable
            caption="기관별 차입금 비중(단위: %)"
            columns={[
                {key: 'label', header: '구분', isRowHeader: true, className: 'w-1/3'},
                ...years.map((year) => ({key: year, header: year})),
            ]}
            rows={INSTITUTION_LABELS.map((label) => {
                const row = institutions.rows.find((item) => item.label === label)
                return {
                    key: label,
                    cells: [
                        <KbxFitName key="label" text={label} widthPx={INSTITUTION_LABEL_WIDTH} />,
                        ...years.map((year) => {
                            const yearIndex = institutions.years.findIndex((item) => isSameYear(item, year))
                            const value = yearIndex < 0 ? undefined : (row?.values[yearIndex] ?? undefined)
                            return isKbxNumber(value) ? kbxFixed1Format.format(value) : KBX_EMPTY_VALUE
                        }),
                    ],
                }
            })}
        />
        <div className="flex flex-col items-center gap-2.5">
            <DonutListChart
                ariaLabel={`최근 연도 기관별 차입금 비중 — ${institutions.share
                    .map((item) => `${item.label} ${shareFormat.format(item.percentage)}%`)
                    .join(', ')}`}
                data={institutions.share.map((item, index) => ({
                    id: item.id,
                    label: item.label,
                    percentage: item.percentage,
                    color: shareColor(index),
                }))}
                emptyText={KBX_CHART_EMPTY_TEXT}
                emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-57.5 w-full')}
                ring={INSTITUTION_RING}
                gapColor="var(--kbx-color-paper)"
                // 도넛 위 · 범례 아래(가운데 정렬, 넘치면 다음 줄로).
                className="flex-col gap-6"
                donutClassName="w-kbx-230"
                listClassName="kbx-text-19 text-kbx-label flex-none flex-row flex-wrap justify-center gap-x-5 gap-y-2.5"
                rowClassName="gap-1.5"
                lastRowClassName="gap-1.5"
                highlightClassName=""
                labelClassName="flex-none"
                swatchClassName="size-3"
            />
            {/* 기준 연도는 표의 마지막(최근) 연도. 도넛이 빈 상태면 적지 않는다. */}
            <BaseYearCaption year={institutions.share.length ? years.at(-1) : undefined} />
        </div>
    </div>
)

// 신용/담보 비중 — 시점별 꺾은선(왼쪽 반, points) · 최근 비중 원형(오른쪽 반 가운데, 330px, current). 사이 56.
const CreditCollateral = ({
    creditCollateral,
}: {
    creditCollateral: InnovationGrowthReport['creditDetail']['creditCollateral']
}) => {
    const {current} = creditCollateral
    const total = current.credit + current.collateral

    return (
        <div className="grid grid-cols-2 items-start gap-14">
            <KbxChartBox isEmpty={!creditCollateral.points.length} emptyClassName="h-79">
                <DualLineChart
                    ariaLabel="신용/담보 비중 추이"
                    data={creditCollateral.points.map((point) => ({
                        id: point.label,
                        label: point.label,
                        values: {credit: point.credit, collateral: point.collateral},
                    }))}
                    series={[
                        {key: 'credit', label: '신용', color: 'var(--kbx-color-navy)'},
                        {key: 'collateral', label: '담보', color: 'var(--kbx-color-mint)'},
                    ]}
                    colors={{
                        divider: 'var(--kbx-color-chart-grid)',
                        baseline: 'var(--kbx-color-chart-line-subtle)',
                        category: 'var(--kbx-color-foreground)',
                        value: 'var(--kbx-color-label)',
                        dotFill: 'var(--kbx-color-paper)',
                    }}
                    legendClassName="kbx-text-18 text-kbx-label"
                />
            </KbxChartBox>
            {/* 비중은 두 값 합 대비로 다시 계산해 소수 첫째 자리로 반올림한다(받은 값 합이 100 이 아니어도 원이 찬다). */}
            <InsideLabelPieChart
                ariaLabel="최근 신용/담보 비중"
                data={[
                    {
                        id: 'credit',
                        label: '신용',
                        percentage: total ? Math.round((current.credit / total) * PERCENT * 10) / 10 : 0,
                        color: 'var(--kbx-color-navy)',
                    },
                    {
                        id: 'collateral',
                        label: '담보',
                        percentage: total ? Math.round((current.collateral / total) * PERCENT * 10) / 10 : 0,
                        color: 'var(--kbx-color-mint)',
                    },
                ]}
                gapColor="var(--kbx-color-paper)"
                labelColor="var(--kbx-color-paper)"
                emptyText={KBX_CHART_EMPTY_TEXT}
                emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-82.5')}
                className="w-82.5 justify-self-center"
            />
        </div>
    )
}

// 담보 현황 — 도넛 + 기준 연도(왼쪽 반) · 단위 + 목록(오른쪽 반). 사이 56.
const COLLATERAL_UNIT = '단위: 백만원'
// 담보 종류 3개 고정 — 받은 값을 label 로 찾으므로 API 도 이 문자열 그대로 보낸다.
const COLLATERAL_LABELS = ['부동산', '특수저당', '보증'] as const
const Collaterals = ({
    collaterals,
    year,
}: {
    collaterals: InnovationGrowthReport['creditDetail']['collaterals']
    year: string
}) => {
    // 받지 못한 종류는 목록에 '-'(0 은 0% · 0). 비중은 세 금액 합 대비로 계산한다. 하나도 없으면 빈 상태.
    const items = COLLATERAL_LABELS.map((label) => ({
        label,
        amount: collaterals.find((item) => item.label === label)?.amount,
    }))
    const total = items.reduce((sum, item) => sum + (isKbxNumber(item.amount) ? item.amount : 0), 0)
    const hasAny = items.some((item) => isKbxNumber(item.amount))

    return (
        <DonutListChart
            ariaLabel="담보 종류별 금액 비중"
            data={
                hasAny
                    ? items.map((item, index) => {
                          const amount = isKbxNumber(item.amount) ? item.amount : undefined
                          return {
                              id: item.label,
                              label: item.label,
                              percentage:
                                  amount !== undefined && total ? Math.round((amount / total) * PERCENT * 10) / 10 : 0,
                              count: amount,
                              valueText: amount === undefined ? KBX_EMPTY_VALUE : undefined,
                              color: shareColor(index),
                          }
                      })
                    : []
            }
            countUnit=""
            emptyText={KBX_CHART_EMPTY_TEXT}
            emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-75')}
            ring={COLLATERAL_RING}
            gapColor="var(--kbx-color-paper)"
            donutCaption={`${year} 기준`}
            donutBoxClassName="w-1/2 pr-7 gap-2.5"
            captionClassName="kbx-text-18 text-kbx-foreground-subtle"
            className="items-center gap-7"
            // 단위는 목록 바로 위 오른쪽 끝 — 단위 · 목록 묶음이 도넛 높이의 세로 가운데에 온다.
            listHeader={
                <div className="kbx-text-18 leading-kbx-130 text-kbx-foreground-subtle mb-2 self-end">
                    {COLLATERAL_UNIT}
                </div>
            }
            donutClassName="w-75"
            listClassName="kbx-text-20 text-kbx-foreground border-kbx-border kbx-border-t-regular"
            rowClassName="border-kbx-border-subtle kbx-border-b-hairline py-3"
            lastRowClassName="border-kbx-border-subtle kbx-border-b-hairline py-3"
            highlightClassName=""
            labelClassName="font-kbx-bold"
            countClassName="font-kbx-bold"
            swatchClassName="size-kbx-14"
        />
    )
}

// 차입금 현황 비공개 자리 표시 — 숫자는 공용 가짜 값(PRIVATE_PLACEHOLDER, composite/private-content.tsx)이고,
// 이름은 인쇄본의 고정 이름(업권 · 담보 종류), 색은 kbx 조각 색(shareColor)을 붙인다.
const PLACEHOLDER_BORROWING_STATUS: Pick<
    InnovationGrowthReport['creditDetail'],
    'institutions' | 'creditCollateral' | 'collaterals' | 'collateralYear'
> = {
    institutions: {
        years: PRIVATE_PLACEHOLDER.years,
        rows: INSTITUTION_LABELS.map((label, index) => ({
            key: `placeholder-${index}`,
            label,
            values: PRIVATE_PLACEHOLDER.yearValues,
        })),
        share: PRIVATE_PLACEHOLDER.shares.map((percentage, index) => ({
            id: `placeholder-${index}`,
            label: INSTITUTION_LABELS[index],
            percentage,
            color: shareColor(index),
        })),
    },
    creditCollateral: PRIVATE_PLACEHOLDER.creditCollateral,
    collaterals: COLLATERAL_LABELS.map((label, index) => ({
        id: `placeholder-${index}`,
        label,
        amount: PRIVATE_PLACEHOLDER.amounts[index],
        color: shareColor(index),
    })),
    collateralYear: PRIVATE_PLACEHOLDER.years[PRIVATE_PLACEHOLDER.years.length - 1],
}

// 차입금 현황 쪽 — 기관별 비중 → 신용/담보 비중 → 담보 현황. 소블록 사이 85(이 쪽만 — 블록 안 간격 32 + mt 53).
// 소제목 줄 폭을 단위가 붙을 칸(표 · 꺾은선) 폭으로 줄여 단위가 그 칸 오른쪽 끝에 오게 한다.
const KbigxPrintCreditBorrowingStatus = ({report}: PageProps) => {
    const {institutions, creditCollateral, collaterals, collateralYear, borrowings} = report.creditDetail
    // 기관별 비중 연도 — 최근 3개년 고정. 받은 연도가 없으면 차입금 현황 연도를 쓴다.
    const institutionYears = getRecentYears(institutions.years, borrowings.years)
    const isHidden = INNOVATION_CREDIT_VISIBILITY[report.viewerCase].isBorrowingStatusHidden
    // 가린 케이스 — 웹 보고서처럼 가짜 값(PLACEHOLDER_BORROWING_STATUS)으로 같은 모양을 그려 흐리게 깔고 안내를 얹는다.
    // 실제 값은 쓰지 않는다. 단위는 그대로 둔다(웹과 같다).
    const source = isHidden
        ? PLACEHOLDER_BORROWING_STATUS
        : {institutions: {...institutions, years: institutionYears}, creditCollateral, collaterals, collateralYear}
    const content = (node: ReactNode) => (isHidden ? <KbxPrivateContent>{node}</KbxPrivateContent> : node)

    return (
        <KbxBlock title="차입금 현황">
            {/* 표 칸 = (전체 − 사이 48)의 3/5. */}
            <KbxSubBlock
                title="기관별 비중"
                unit={<CreditUnit>단위: %</CreditUnit>}
                headerClassName="w-[calc((100%-var(--spacing)*12)*3/5)]"
            >
                {content(<InstitutionShare institutions={source.institutions} years={source.institutions.years} />)}
            </KbxSubBlock>
            {/* 꺾은선 칸 = (전체 − 사이 56)의 1/2. */}
            <KbxSubBlock
                title="신용/담보 비중"
                unit={<CreditUnit>단위: %</CreditUnit>}
                headerClassName="w-[calc((100%-var(--spacing)*14)/2)]"
                className="mt-13.25"
            >
                {content(<CreditCollateral creditCollateral={source.creditCollateral} />)}
            </KbxSubBlock>
            <KbxSubBlock title="담보 현황" className="mt-13.25">
                {content(<Collaterals collaterals={source.collaterals} year={source.collateralYear} />)}
            </KbxSubBlock>
        </KbxBlock>
    )
}

export {
    KbigxPrintCreditBorrowing,
    KbigxPrintCreditBorrowingStatus,
    KbigxPrintCreditInfo,
    KbigxPrintCreditRating,
    KbigxPrintCreditRatiosFirst,
    KbigxPrintCreditRatiosSecond,
}
