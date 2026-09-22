'use client'

import {Badge} from '@/components/ui/badge'
import {ARC_GAUGE_TONE_COLORS} from '@/components/custom/arc-gauge-shape'
import {GradeHistoryChart} from '@/components/custom/grade-history-chart'
import {GradeScaleGauge, type GradeScaleItem} from '@/components/custom/grade-scale-gauge'
import {Card, NoticeBox, ReportTable, SectionTitle, SubBlock} from '@/components/custom/innovation-growth-report-parts'
import {LineChart} from '@/components/custom/line-chart'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import {RatioStackBar} from '@/components/custom/ratio-stack-bar'
import {SegmentMeter} from '@/components/custom/segment-meter'
import {PRIVATE_SHORT_LABEL, PrivateCell, PrivateContent} from '@/components/composite/private-content'
import {SemicircleRatingGauge, type SemicircleRatingData} from '@/components/custom/semicircle-rating-gauge'
import {cn} from '@/lib/utils'
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'
import {
    getTechIndexGrade,
    getTechIndexLevel,
    INNOVATION_CREDIT_VISIBILITY,
    TECH_INDEX_LEVEL_COUNT,
    type InnovationBorrowingRow,
    type InnovationCreditInfoTable,
    type InnovationCreditVisibility,
    type InnovationCreditDetail,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · 신용/재무정보 탭 본문 — 기업신용등급(게이지 · 이전평가이력) → 현금흐름등급(등급 척도 · 기업신용정보 표)
// → 재무비율진단(성장성 · 수익성 · 안정성 · 활동성) → 차입금 분석(변동률 · 현황 표 · 변동현황 표) → 차입금 현황(기관별 비중 · 신용/담보 비중 · 담보 현황).
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 폭(1280)만 그린다(좁으면 문서가 가로로 넘친다).
//
// [프론트엔드 연동] 값은 detail(report.creditDetail)과 기업신용등급 게이지 데이터(rating — 진단브리핑과 같은 toCriRatingData 결과)로
// 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationCreditDetail.

const EMPTY_VALUE = '-'
const EMPTY_TABLE_TEXT = '해당사항 없음'
const numberFormatter = new Intl.NumberFormat('ko-KR')
const oneDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const twoDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

// 현금흐름등급 척도 — 낮은 등급(CR-6)부터 높은 등급(CR-1). 주황 칸은 밝아 짙은 글자.
const CASH_FLOW_GRADES: readonly GradeScaleItem[] = [
    {label: 'CR-6', color: 'var(--raw-gray-700)'},
    {label: 'CR-5', color: 'var(--raw-gray-300)'},
    {label: 'CR-4', color: 'var(--raw-error-500)'},
    {label: 'CR-3', color: 'var(--raw-orange-500)', isLightColor: true},
    {label: 'CR-2', color: 'var(--raw-success-500)'},
    {label: 'CR-1', color: 'var(--raw-blue-500)'},
]

// 재무비율진단 선 색 — 표의 줄 순서대로 navy.500 · blue.500 · purple.500 · mint.700.
const RATIO_COLORS = [
    'var(--raw-navy-500)',
    'var(--raw-blue-500)',
    'var(--raw-purple-500)',
    'var(--raw-mint-700)',
] as const
const BORROWING_TREND_COLOR = 'var(--raw-purple-500)'
const CREDIT_COLOR = 'var(--raw-blue-500)'
const COLLATERAL_COLOR = 'var(--raw-mint-700)'

// 상태 뱃지 색 — 우수 info · 양호 success · 보통 orange · 미흡 error · 취약 neutral(Tech-Index 탭과 같다).
const TONE_BADGE_COLORS = {
    excellent: 'info',
    good: 'success',
    normal: 'secondary-orange',
    poor: 'error',
    weak: 'neutral',
} as const

// 이전평가이력 원 높이 — CRI 등급표의 채움 비율(등급이 높을수록 큼). 표에 없는 등급은 0(맨 아래).
const toGradeValue = (grade: string) => {
    const item = findCriGrade(grade)
    return item ? criGradePercentage(item) : 0
}

const formatBorrowingCell = (cell: InnovationBorrowingRow['cells'][number], key: 'amount' | 'ratio') => {
    if (!cell) return EMPTY_VALUE
    return key === 'amount' ? numberFormatter.format(cell.amount) : oneDecimalFormatter.format(cell.ratio)
}

// 차입금 현황 표 — 두 단 머리(항목 · 연도별 금액/비중) · 구분(단기 · 장기)을 세로로 합친 칸 · 소계 줄(gray.10 — 문서 바탕 gray.50 보다 옅다) · 합계 줄(파란 면 굵게).
const BorrowingTable = ({borrowings}: {borrowings: InnovationCreditDetail['borrowings']}) => {
    const headClassName =
        'border-subtle-3 bg-primary-subtle typo-body-l-bold text-foreground border-b px-4 pt-3 pb-2.75'
    const cellClassName =
        'border-subtle-3 typo-body-l-regular text-label-foreground border-b px-4 pt-3 pb-2.75 tabular-nums'
    const valueCells = (row: InnovationBorrowingRow, className: string) =>
        row.cells.flatMap((cell, index) => [
            <td key={`${index}-amount`} className={className}>
                {formatBorrowingCell(cell, 'amount')}
            </td>,
            <td key={`${index}-ratio`} className={className}>
                {formatBorrowingCell(cell, 'ratio')}
            </td>,
        ])

    return (
        <div className="border-t-foreground-subtle border-t">
            <table className="w-full table-fixed border-collapse text-center">
                <caption className="sr-only">차입금 현황(단위: 백만원, %)</caption>
                <colgroup>
                    <col className="w-51" />
                    <col className="w-51" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="colgroup" colSpan={2} rowSpan={2} className={headClassName}>
                            항목
                        </th>
                        {borrowings.years.map((year) => (
                            <th key={year} scope="colgroup" colSpan={2} className={cn(headClassName, 'border-x')}>
                                {year}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {borrowings.years.flatMap((year) => [
                            <th
                                key={`${year}-amount`}
                                scope="col"
                                className={cn(headClassName, 'typo-body-l-medium border-x')}
                            >
                                금액
                            </th>,
                            <th
                                key={`${year}-ratio`}
                                scope="col"
                                className={cn(headClassName, 'typo-body-l-medium border-x')}
                            >
                                비중
                            </th>,
                        ])}
                    </tr>
                </thead>
                {borrowings.groups.map((group) => (
                    <tbody key={group.key}>
                        {group.rows.map((row, index) => (
                            <tr key={row.key}>
                                {index === 0 ? (
                                    <th
                                        scope="rowgroup"
                                        rowSpan={group.rows.length + 1}
                                        className={cn(cellClassName, 'bg-card border-r')}
                                    >
                                        {group.label}
                                    </th>
                                ) : null}
                                <th scope="row" className={cn(cellClassName, 'bg-card')}>
                                    {row.label}
                                </th>
                                {valueCells(row, cn(cellClassName, 'bg-card'))}
                            </tr>
                        ))}
                        <tr>
                            <th scope="row" className={cn(cellClassName, 'bg-surface-subtle')}>
                                {group.subtotal.label}
                            </th>
                            {valueCells(group.subtotal, cn(cellClassName, 'bg-surface-subtle'))}
                        </tr>
                    </tbody>
                ))}
                <tfoot>
                    <tr>
                        <th scope="row" colSpan={2} className={headClassName}>
                            {borrowings.total.label}
                        </th>
                        {valueCells(borrowings.total, headClassName)}
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

// 기업신용정보 표 하나 — 케이스에 따라 표 전체(비공개 · 자리 표시 값) 또는 연체금액 열만 가린다.
const OVERDUE_AMOUNT_COLUMN = '연체금액'
const PLACEHOLDER_CELL = '0000-00-00'
const PLACEHOLDER_AMOUNT = '000,000'
const CreditInfoTable = ({
    table,
    visibility,
}: {
    table: InnovationCreditInfoTable
    visibility: InnovationCreditVisibility
}) => {
    // 표 전체 비공개 — 실제 줄 대신 자리 표시 한 줄을 흐리게 깔고 '비공개' 를 띄운다.
    if (visibility.hiddenInfoTables.includes(table.id)) {
        return (
            <PrivateContent label={PRIVATE_SHORT_LABEL} className="min-h-0">
                <ReportTable
                    caption={`${table.title} — 비공개`}
                    minWidthClassName="min-w-0"
                    columns={table.columns.map((column, index) => ({
                        key: String(index),
                        label: column,
                        isNoWrap: true,
                    }))}
                    rows={[
                        {
                            id: `${table.id}-placeholder`,
                            cells: Object.fromEntries(
                                table.columns.map((_, index) => [String(index), PLACEHOLDER_CELL]),
                            ),
                        },
                    ]}
                />
            </PrivateContent>
        )
    }
    // 연체금액 열만 비공개 — 그 열의 머리 · 값 칸을 PrivateCell 로 가린다(값은 자리 표시). 안내는 첫 값 칸에만.
    const hiddenColumnIndex = visibility.hiddenAmountTables.includes(table.id)
        ? table.columns.indexOf(OVERDUE_AMOUNT_COLUMN)
        : -1
    return (
        <ReportTable
            caption={`${table.title} — ${table.status}`}
            minWidthClassName="min-w-0"
            columns={table.columns.map((column, index) => ({
                key: String(index),
                label: index === hiddenColumnIndex ? <PrivateCell>{column}</PrivateCell> : column,
                isNoWrap: true,
            }))}
            rows={table.rows.map((row, rowIndex) => ({
                id: `${table.id}-${rowIndex}`,
                cells: Object.fromEntries(
                    row.map((value, index) => [
                        String(index),
                        index === hiddenColumnIndex ? (
                            <PrivateCell label={rowIndex === 0 ? PRIVATE_SHORT_LABEL : undefined}>
                                {PLACEHOLDER_AMOUNT}
                            </PrivateCell>
                        ) : (
                            value || EMPTY_VALUE
                        ),
                    ]),
                ),
            }))}
            emptyText={EMPTY_TABLE_TEXT}
        />
    )
}

// 차입금 현황 카드 3개 — 실제 값과 자리 표시 값(비공개 케이스)을 같은 모양으로 그린다.
type BorrowingStatusSource = Pick<InnovationCreditDetail, 'institutions' | 'creditCollateral' | 'collaterals'>

const InstitutionShareCard = ({source}: {source: BorrowingStatusSource}) => (
    <Card className="h-full" title="기관별 비중" aside="단위 : %">
        <div className="grid grid-cols-2 items-center gap-12">
            <ReportTable
                caption="기관별 차입금 비중(단위: %)"
                minWidthClassName="min-w-0"
                columns={[
                    {key: 'label', label: '구분', isRowHeader: true, isNoWrap: true},
                    ...source.institutions.years.map((year) => ({key: year, label: year})),
                ]}
                rows={source.institutions.rows.map((row) => ({
                    id: row.key,
                    cells: {
                        label: row.label,
                        ...Object.fromEntries(
                            source.institutions.years.map((year, index) => {
                                const value = row.values[index]
                                return [
                                    year,
                                    value === null || value === undefined
                                        ? EMPTY_VALUE
                                        : oneDecimalFormatter.format(value),
                                ]
                            }),
                        ),
                    },
                }))}
            />
            <PercentageDonutChart
                animate={false}
                showTooltip={false}
                data={source.institutions.share.map((item) => ({...item}))}
                ariaLabel="최근 연도 기관별 차입금 비중"
            />
        </div>
    </Card>
)

const CreditCollateralCard = ({source}: {source: BorrowingStatusSource}) => (
    <Card className="h-full" title="신용/담보 비중" aside="단위 : %">
        <LineChart
            animate={false}
            appearance="columns"
            legendPlacement="top-end"
            plotHeight={180}
            showTooltip={false}
            showValueLabels
            valueFractionDigits={1}
            ariaLabel="시점별 신용 · 담보 비중"
            unit="%"
            data={source.creditCollateral.points.map((point) => ({
                id: point.label,
                label: point.label,
                values: {credit: point.credit, collateral: point.collateral},
            }))}
            series={[
                {key: 'credit', label: '신용', color: CREDIT_COLOR},
                {key: 'collateral', label: '담보', color: COLLATERAL_COLOR},
            ]}
        />
        <RatioStackBar
            data={[
                {
                    id: 'credit',
                    label: '신용',
                    value: source.creditCollateral.current.credit,
                    color: CREDIT_COLOR,
                },
                {
                    id: 'collateral',
                    label: '담보',
                    value: source.creditCollateral.current.collateral,
                    color: COLLATERAL_COLOR,
                },
            ]}
        />
    </Card>
)

const CollateralCard = ({source}: {source: BorrowingStatusSource}) => {
    const total = source.collaterals.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
    return (
        <Card className="h-full" title="담보 현황" aside="단위 : 백만원">
            <PercentageDonutChart
                animate={false}
                showTooltip={false}
                data={source.collaterals.map((item) => ({
                    id: item.id,
                    label: item.label,
                    color: item.color,
                    percentage: total ? Math.round((Math.max(0, item.amount) / total) * 1000) / 10 : 0,
                    valueLabel: numberFormatter.format(item.amount),
                }))}
                ariaLabel="담보 종류별 금액"
            />
        </Card>
    )
}

// [퍼블리싱 확인용] 비공개 케이스의 자리 표시 값 — 실제 값이 아닌 임의 값이다(흐리게 깔려 모양만 남긴다).
// 연도 · 시점 이름은 React key 로도 쓰이므로 서로 다르게 둔다.
// [프론트엔드 연동] 미노출 케이스에서는 API 가 실제 값을 주지 않으므로 이 자리 표시 값으로 카드를 그린다.
const PLACEHOLDER_BORROWING_STATUS: BorrowingStatusSource = {
    institutions: {
        years: ['0000년', '0001년', '0002년'],
        rows: ['구분 1', '구분 2', '구분 3', '구분 4', '구분 5'].map((label, index) => ({
            key: `placeholder-${index}`,
            label,
            values: [40, 30, 20],
        })),
        share: [
            {id: 'placeholder-a', label: '구분 1', percentage: 50, color: 'var(--raw-navy-500)'},
            {id: 'placeholder-b', label: '구분 2', percentage: 30, color: 'var(--raw-blue-500)'},
            {id: 'placeholder-c', label: '구분 3', percentage: 20, color: 'var(--raw-blue-300)'},
        ],
    },
    creditCollateral: {
        points: [
            {label: '00.01월', credit: 40, collateral: 60},
            {label: '00.02월', credit: 45, collateral: 55},
            {label: '00.03월', credit: 50, collateral: 50},
        ],
        current: {credit: 50, collateral: 50},
    },
    collaterals: [
        {id: 'placeholder-a', label: '구분 1', amount: 5000, color: 'var(--raw-navy-500)'},
        {id: 'placeholder-b', label: '구분 2', amount: 3000, color: 'var(--raw-blue-500)'},
        {id: 'placeholder-c', label: '구분 3', amount: 2000, color: 'var(--raw-blue-300)'},
    ],
}

type InnovationGrowthReportCreditProps = {
    detail: InnovationCreditDetail
    /** 기업신용등급 게이지 데이터 — 진단브리핑과 같은 값(toCriRatingData). */
    rating: SemicircleRatingData
    /** 열람 케이스별 미노출 범위(비공개로 가림). 기본은 전 항목 노출. */
    visibility?: InnovationCreditVisibility
}

const InnovationGrowthReportCredit = ({
    detail,
    rating,
    visibility = INNOVATION_CREDIT_VISIBILITY.self,
}: InnovationGrowthReportCreditProps) => {
    const {ratingHistory, cashFlow, borrowings, borrowingChanges} = detail
    // 이전평가이력 표 — 가장 최근(현재 등급)을 뺀 지난 평가를 최근 것부터.
    const previousRatings = [...ratingHistory.slice(0, -1)].reverse()
    return (
        <>
            {/* 기업신용등급 */}
            <section aria-labelledby="ig-credit-rating" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-rating" title="기업신용등급" />
                <div className="grid grid-cols-2 gap-6">
                    {/* 제목 없는 카드 — 게이지 · 요약 묶음을 옆 카드와 같은 높이의 세로 가운데에 둔다. */}
                    <Card className="justify-center">
                        <SemicircleRatingGauge
                            data={rating}
                            title="기업신용등급"
                            ariaLabel={`기업신용등급 ${rating.label}, ${rating.description}`}
                            className="max-w-65"
                        />
                        <NoticeBox className="text-center">
                            {detail.ratingSummary.map((line, index) => (
                                <span key={line}>
                                    {index > 0 ? <br /> : null}
                                    {line}
                                </span>
                            ))}
                        </NoticeBox>
                    </Card>
                    <Card title="이전평가이력">
                        <GradeHistoryChart
                            animate={false}
                            data={ratingHistory.map((item) => ({
                                id: item.date,
                                label: item.chartLabel,
                                grade: item.grade,
                                value: toGradeValue(item.grade),
                            }))}
                            ariaLabel="기업신용등급 이전평가이력"
                        />
                        <ReportTable
                            caption="기업신용등급 이전평가이력"
                            minWidthClassName="min-w-0"
                            columns={[
                                {key: 'date', label: '평가일자'},
                                {key: 'grade', label: '신용등급'},
                            ]}
                            rows={previousRatings.map((item) => ({
                                id: item.date,
                                cells: {date: item.date, grade: item.grade},
                            }))}
                            emptyText="이전 평가 이력이 없습니다."
                        />
                    </Card>
                </div>
            </section>

            {/* 현금흐름등급 */}
            <section aria-labelledby="ig-credit-cash-flow" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-cash-flow" title="현금흐름등급" />
                <Card>
                    <div className="grid grid-cols-2 items-center gap-6">
                        <GradeScaleGauge
                            grades={CASH_FLOW_GRADES}
                            current={cashFlow.grade}
                            lowLabel="미흡"
                            highLabel="양호"
                            scaleLabel="현금흐름 창출 능력"
                            ariaLabel={`현금흐름등급 ${cashFlow.grade}`}
                        />
                        <ReportTable
                            caption="연도별 현금흐름등급"
                            minWidthClassName="min-w-0"
                            columns={[
                                {key: 'year', label: '평가년도'},
                                {key: 'grade', label: '현금흐름등급'},
                            ]}
                            rows={cashFlow.history.map((item) => ({
                                id: item.year,
                                cells: {year: item.year, grade: item.grade},
                            }))}
                            emptyText={EMPTY_TABLE_TEXT}
                        />
                    </div>
                    <NoticeBox className="text-center">{cashFlow.summary}</NoticeBox>
                    <div className="flex flex-col gap-4">
                        <h4 className="typo-body-xl-bold text-foreground">기업신용정보</h4>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            {detail.creditInfo.map((table) => (
                                <SubBlock
                                    key={table.id}
                                    title={table.title}
                                    titleClassName="typo-body-l-medium"
                                    status={table.status}
                                >
                                    <CreditInfoTable table={table} visibility={visibility} />
                                </SubBlock>
                            ))}
                        </div>
                    </div>
                </Card>
            </section>

            {/* 재무비율진단 — 묶음마다 표 · 선 그래프, 머리 줄 오른쪽에 상태 칸 · 뱃지(점수 구간은 Tech-Index 와 같다). */}
            <section aria-labelledby="ig-credit-ratios" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-ratios" title="재무비율진단" />
                <div className="flex flex-col gap-6">
                    {detail.ratios.map((group) => {
                        const grade = getTechIndexGrade(group.score)
                        const level = getTechIndexLevel(group.score)
                        return (
                            <Card
                                key={group.id}
                                title={group.title}
                                aside={
                                    // 한 줄 높이(h-lh · 21)에 가둬 제목 줄이 뱃지(24) 때문에 높아지지 않게 한다.
                                    <span className="flex h-lh items-center gap-2">
                                        <SegmentMeter
                                            value={level}
                                            total={TECH_INDEX_LEVEL_COUNT}
                                            color={ARC_GAUGE_TONE_COLORS[grade.tone]}
                                            ariaLabel={`${group.title} ${TECH_INDEX_LEVEL_COUNT}단계 중 ${level}단계`}
                                        />
                                        {/* self-baseline — 제목 줄(items-baseline)이 뱃지 글자 기준선에 맞춰 줄을 세운다(칸 막대는 글자가 없어 기준선이 없다). */}
                                        <Badge
                                            size="xs"
                                            shape="round"
                                            color={TONE_BADGE_COLORS[grade.tone]}
                                            className="self-baseline"
                                        >
                                            {grade.label}
                                        </Badge>
                                    </span>
                                }
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <ReportTable
                                        caption={`${group.title} 재무비율(단위: %)`}
                                        minWidthClassName="min-w-0"
                                        columns={[
                                            {key: 'label', label: '재무비율', isNoWrap: true},
                                            ...detail.ratioYears.map((year) => ({key: year, label: year})),
                                            {key: 'comparison', label: '업종평균 대비', isNoWrap: true},
                                        ]}
                                        rows={group.rows.map((row) => ({
                                            id: row.key,
                                            cells: {
                                                label: row.label,
                                                ...Object.fromEntries(
                                                    detail.ratioYears.map((year, index) => [
                                                        year,
                                                        twoDecimalFormatter.format(row.values[index] ?? 0),
                                                    ]),
                                                ),
                                                comparison: row.comparison,
                                            },
                                        }))}
                                    />
                                    <LineChart
                                        animate={false}
                                        appearance="columns"
                                        legendPlacement="top-end"
                                        plotHeight={170}
                                        showTooltip={false}
                                        ariaLabel={`연도별 ${group.title} 재무비율`}
                                        unit="%"
                                        valueFractionDigits={2}
                                        data={detail.ratioYears.map((year, index) => ({
                                            id: year,
                                            label: year,
                                            values: Object.fromEntries(
                                                group.rows.map((row) => [row.key, row.values[index] ?? 0]),
                                            ),
                                        }))}
                                        series={group.rows.map((row, index) => ({
                                            key: row.key,
                                            label: row.label,
                                            color: RATIO_COLORS[index % RATIO_COLORS.length],
                                        }))}
                                    />
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 차입금 분석 */}
            <section aria-labelledby="ig-credit-borrowing" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-borrowing" title="차입금 분석" />
                <div className="flex flex-col gap-6">
                    <Card title="차입금 변동률" aside="단위 : %">
                        <LineChart
                            animate={false}
                            data={detail.borrowingTrend.map((item) => ({
                                id: item.label,
                                label: item.label,
                                values: {rate: item.value},
                            }))}
                            series={[{key: 'rate', label: '차입금 변동률', color: BORROWING_TREND_COLOR}]}
                            variant="area"
                            appearance="cells"
                            showLegend={false}
                            showValueLabels
                            showTooltip={false}
                            ariaLabel="월별 차입금 변동률"
                        />
                    </Card>
                    <SubBlock title="차입금 현황" aside="단위 : 백만원, %">
                        <BorrowingTable borrowings={borrowings} />
                    </SubBlock>
                    <SubBlock title="차입금 변동현황" aside="단위 : 백만원, %">
                        <ReportTable
                            caption="차입금 변동현황(단위: 백만원, %)"
                            columns={[
                                {key: 'label', label: '구분'},
                                ...borrowingChanges.years.map((year) => ({key: year, label: year})),
                            ]}
                            rows={borrowingChanges.rows.map((row) => ({
                                id: row.key,
                                cells: {
                                    label: row.label,
                                    ...Object.fromEntries(
                                        borrowingChanges.years.map((year, index) => [
                                            year,
                                            twoDecimalFormatter.format(row.values[index] ?? 0),
                                        ]),
                                    ),
                                },
                            }))}
                        />
                    </SubBlock>
                </div>
            </section>

            {/* 차입금 현황 */}
            <section aria-labelledby="ig-credit-borrowing-status" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-borrowing-status" title="차입금 현황" />
                <div className="flex flex-col gap-6">
                    {visibility.isBorrowingStatusHidden ? (
                        <PrivateContent>
                            <InstitutionShareCard source={PLACEHOLDER_BORROWING_STATUS} />
                        </PrivateContent>
                    ) : (
                        <InstitutionShareCard source={detail} />
                    )}
                    <div className="grid grid-cols-2 gap-6">
                        {visibility.isBorrowingStatusHidden ? (
                            <PrivateContent>
                                <CreditCollateralCard source={PLACEHOLDER_BORROWING_STATUS} />
                            </PrivateContent>
                        ) : (
                            <CreditCollateralCard source={detail} />
                        )}
                        {visibility.isBorrowingStatusHidden ? (
                            <PrivateContent>
                                <CollateralCard source={PLACEHOLDER_BORROWING_STATUS} />
                            </PrivateContent>
                        ) : (
                            <CollateralCard source={detail} />
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportCredit}
export type {InnovationGrowthReportCreditProps}
