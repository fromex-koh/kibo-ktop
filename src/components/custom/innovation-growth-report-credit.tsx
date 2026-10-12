'use client'

import {GradeHistoryChart} from '@/components/custom/grade-history-chart'
import {GradeScaleGauge, type GradeScaleItem} from '@/components/custom/grade-scale-gauge'
import {
    Card,
    NoticeBox,
    REPORT_LINE_STYLES,
    ReportTable,
    SectionTitle,
    SubBlock,
    WithUnit,
} from '@/components/custom/innovation-growth-report-parts'
import {LineChart} from '@/components/custom/line-chart'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import {RatioStackBar} from '@/components/custom/ratio-stack-bar'
import {PRIVATE_SHORT_LABEL, PrivateCell, PrivateContent} from '@/components/composite/private-content'
import {SemicircleRatingGauge, type SemicircleRatingData} from '@/components/custom/semicircle-rating-gauge'
import {cn} from '@/lib/utils'
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'
import {
    INNOVATION_CREDIT_VISIBILITY,
    type InnovationBorrowingRow,
    type InnovationCreditInfoTable,
    type InnovationCreditVisibility,
    type InnovationCreditDetail,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · 신용/재무정보 탭 본문 — 기업신용등급(게이지 · 이전평가이력) → 현금흐름등급(등급 척도 · 기업신용정보 표)
// → 재무비율진단(성장성 · 수익성 · 안정성 · 활동성) → 차입금 분석(변동률 · 현황 표 · 변동현황 표) → 차입금 현황(기관별 비중 · 신용/담보 비중 · 담보 현황).
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 값은 detail(report.creditDetail)과 기업신용등급 게이지 데이터(rating — 진단브리핑과 같은 toCriRatingData 결과)로
// 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationCreditDetail.

const EMPTY_VALUE = '-'
const EMPTY_TABLE_TEXT = '해당사항 없음'
const numberFormatter = new Intl.NumberFormat('ko-KR')
const oneDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const twoDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

// 현금흐름등급 척도 — 낮은 등급(CR-6)부터 높은 등급(CR-1). 밝은 칸(CR-5 회색 · CR-3 주황)은 흰 글자로는 본문 대비 4.5:1 에 못 미쳐 짙은 글자를 쓴다[5.3.3].
// 칸 글자 색(흰색 · grade-scale-chip-foreground)이 테마와 무관하게 고정이라 칸 색도 고정 색(--raw-*)을 쓴다.
const CASH_FLOW_GRADES: readonly GradeScaleItem[] = [
    {label: 'CR-6', color: 'var(--raw-gray-700)'},
    {label: 'CR-5', color: 'var(--raw-gray-200)', isLightColor: true},
    {label: 'CR-4', color: 'var(--raw-error-500)'},
    {label: 'CR-3', color: 'var(--raw-orange-500)', isLightColor: true},
    {label: 'CR-2', color: 'var(--raw-success-500)'},
    {label: 'CR-1', color: 'var(--raw-blue-500)'},
]

const BORROWING_TREND_COLOR = 'var(--ds-report-series-3)'
// 신용/담보 비중 — 선 모양은 보고서 공통(REPORT_LINE_STYLES)의 1번 · 4번을 쓰고, 아래 비율 막대(RatioStackBar)도 같은 색을 쓴다.
const CREDIT_LINE_STYLE = REPORT_LINE_STYLES[0]
const COLLATERAL_LINE_STYLE = REPORT_LINE_STYLES[3]

// [프론트엔드 연동 · 정렬] 기획 메모 '최신순으로 정렬' — 이전평가이력 · 현금흐름등급 표는 평가일자 최근 것부터 그린다.
// 받은 순서와 무관하게 화면이 날짜(YYYY-MM-DD 문자열)로 정렬한다.
const byLatestDate = (a: {date: string}, b: {date: string}) => b.date.localeCompare(a.date)

// 이전평가이력 원 높이 — CRI 등급표의 채움 비율(등급이 높을수록 큼). 표에 없는 등급은 0(맨 아래).
const toGradeValue = (grade: string) => {
    const item = findCriGrade(grade)
    return item ? criGradePercentage(item) : 0
}

const formatBorrowingCell = (cell: InnovationBorrowingRow['cells'][number], key: 'amount' | 'ratio') => {
    if (!cell) return EMPTY_VALUE
    return key === 'amount' ? numberFormatter.format(cell.amount) : oneDecimalFormatter.format(cell.ratio)
}

// 차입금 현황 표 — 두 단 머리(항목 · 연도별 금액/비중) · 묶음(group.label)을 세로로 합친 칸 · 묶음마다 소계 줄 · 맨 아래 합계 줄.
// ReportTable 로는 묶음 칸 세로 합치기(rowgroup)를 표현할 수 없어 따로 그린다. 값이 null 인 칸은 '-'.
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
                {/* 열 수를 실제 셀 수와 맞춘다 — 앞 두 칸만 폭을 고정하고 연도별 금액 · 비중 칸은 span 으로 함께 센다.
                    선언한 열보다 셀이 많으면 마크업 오류가 된다[8.1.1]. */}
                <colgroup>
                    <col className="w-51" />
                    <col className="w-51" />
                    <col span={borrowings.years.length * 2} />
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
    <Card className="h-full gap-4" title="기관별 비중">
        <div className="grid grid-cols-2 items-center gap-12">
            <WithUnit unit="단위: %">
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
            </WithUnit>
            <PercentageDonutChart
                data={source.institutions.share.map((item) => ({...item}))}
                ariaLabel="최근 연도 기관별 차입금 비중"
            />
        </div>
    </Card>
)

const CreditCollateralCard = ({source}: {source: BorrowingStatusSource}) => (
    <Card className="h-full gap-4" title="신용/담보 비중">
        <WithUnit unit="단위: %">
            <LineChart
                appearance="columns"
                legendPlacement="bottom-center"
                showTooltip={false}
                showValueLabels
                valueFractionDigits={1}
                isValueFractionFixed={false}
                ariaLabel="시점별 신용 · 담보 비중"
                unit="%"
                showUnitLabel={false}
                data={source.creditCollateral.points.map((point) => ({
                    id: point.label,
                    label: point.label,
                    values: {credit: point.credit, collateral: point.collateral},
                }))}
                series={[
                    {key: 'credit', label: '신용', ...CREDIT_LINE_STYLE},
                    {key: 'collateral', label: '담보', ...COLLATERAL_LINE_STYLE},
                ]}
            />
        </WithUnit>
        <RatioStackBar
            data={[
                {
                    id: 'credit',
                    label: '신용',
                    value: source.creditCollateral.current.credit,
                    color: CREDIT_LINE_STYLE.color,
                },
                {
                    id: 'collateral',
                    label: '담보',
                    value: source.creditCollateral.current.collateral,
                    color: COLLATERAL_LINE_STYLE.color,
                },
            ]}
        />
    </Card>
)

const CollateralCard = ({source}: {source: BorrowingStatusSource}) => {
    const total = source.collaterals.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
    return (
        <Card className="h-full gap-4" title="담보 현황">
            <WithUnit unit="단위: 백만원">
                <PercentageDonutChart
                    data={source.collaterals.map((item) => ({
                        id: item.id,
                        label: item.label,
                        color: item.color,
                        percentage: total ? Math.round((Math.max(0, item.amount) / total) * 1000) / 10 : 0,
                        valueLabel: numberFormatter.format(item.amount),
                    }))}
                    ariaLabel="담보 종류별 금액"
                />
            </WithUnit>
        </Card>
    )
}

// 비공개 케이스의 자리 표시 값 — 실제 값이 아닌 임의 값이다(흐리게 깔려 모양만 남긴다).
// [프론트엔드 연동] 연동 후에도 그대로 쓴다 — 미노출 케이스에서는 API 가 실제 값을 주지 않으므로 이 값으로 카드 모양을 그린다.
// 연도 · 시점 이름은 React key 로도 쓰이므로 서로 다르게 둔다. 도넛 조각 색은 percentage-donut-colors.ts 와 같은 고정 색(--raw-*)이다.
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
    // 이전평가이력 표 — 최신순으로 정렬한 뒤 가장 최근(현재 등급 — 왼쪽 게이지)을 뺀 지난 평가만.
    const previousRatings = [...ratingHistory].sort(byLatestDate).slice(1)
    // 현금흐름등급 표 — 최신순.
    const cashFlowHistory = [...cashFlow.history].sort(byLatestDate)
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
                                {key: 'grade', label: '신용등급'},
                                {key: 'date', label: '평가일자'},
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
                            // 원호 안에는 등급만 둔다(설명 글자 없음).
                            description=""
                            lowLabel="취약"
                            highLabel="우수"
                            scaleLabel="현금흐름 창출 능력"
                            ariaLabel={`현금흐름등급 ${cashFlow.grade}`}
                        />
                        <ReportTable
                            caption="현금흐름등급 평가이력"
                            minWidthClassName="min-w-0"
                            columns={[
                                {key: 'grade', label: '현금흐름등급'},
                                {key: 'date', label: '평가일자'},
                            ]}
                            rows={cashFlowHistory.map((item) => ({
                                id: item.date,
                                cells: {grade: item.grade, date: item.date},
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

            {/* 재무비율진단 — 묶음마다 표(위에 단위) · 선 그래프(아래 가운데 범례). 선은 줄 순서대로 색 · 선 · 점 모양이 함께 바뀐다. */}
            <section aria-labelledby="ig-credit-ratios" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-ratios" title="재무비율진단" />
                <div className="flex flex-col gap-6">
                    {detail.ratios.map((group) => (
                        <Card key={group.id} title={group.title} className="gap-4">
                            <div className="grid grid-cols-2 gap-6">
                                <WithUnit unit={`단위: ${group.unit}`}>
                                    <ReportTable
                                        caption={`${group.title} 재무비율(단위: ${group.unit})`}
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
                                </WithUnit>
                                <LineChart
                                    appearance="columns"
                                    legendPlacement="bottom-center"
                                    showTooltip={false}
                                    ariaLabel={`연도별 ${group.title} 재무비율`}
                                    unit={group.unit}
                                    showUnitLabel={false}
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
                                        ...REPORT_LINE_STYLES[index % REPORT_LINE_STYLES.length],
                                    }))}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 차입금 분석 — 변동률(선 그래프) · 현황 · 변동현황 카드. 단위는 그래프 · 표 위 오른쪽 줄. */}
            <section aria-labelledby="ig-credit-borrowing" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-borrowing" title="차입금 분석" />
                <div className="flex flex-col gap-6">
                    <Card title="차입금 변동률" className="gap-4">
                        <WithUnit unit="단위: %">
                            <LineChart
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
                        </WithUnit>
                    </Card>
                    <Card title="차입금 현황" className="gap-4">
                        <WithUnit unit="단위: 백만원, %">
                            <BorrowingTable borrowings={borrowings} />
                        </WithUnit>
                    </Card>
                    {/* 단위는 줄 이름에 붙어 있다(차입금(백만원) 등) — 표 위 단위 줄이 없다. */}
                    <Card title="차입금 변동현황" className="gap-4">
                        <ReportTable
                            caption="차입금 변동현황"
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
                    </Card>
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
