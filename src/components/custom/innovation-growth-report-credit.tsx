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
import {EmptyState} from '@/components/composite/empty-state'
import {PRIVATE_PLACEHOLDER, PRIVATE_SHORT_LABEL, PrivateContent} from '@/components/composite/private-content'
import {SemicircleRatingGauge, type SemicircleRatingData} from '@/components/custom/semicircle-rating-gauge'
import {cn} from '@/lib/utils'
import {CASH_FLOW_GRADES_LOW_FIRST, cashFlowLevel, findCashFlowGrade} from '@/content/service/cash-flow-grades'
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

// 현금흐름등급 척도 — 현금흐름등급표(cash-flow-grades.ts)의 낮은 등급(CF6)부터 높은 등급(CF1). 칸 · 원호 색과 칸 글자 색은
// cash-flow-cf-<n> 토큰(tokens.json, n = 등급 숫자)이다. 다크에서는 칸 색이 밝은 단계로 바뀌고 글자도 짙은 색으로 바뀐다
// (CF5 만 어두운 칸 + 밝은 글자). 척도 양 끝 이름도 같은 표의 등급내용(CF6 부실 · CF1 우수)이다.
const CASH_FLOW_SCALE: readonly GradeScaleItem[] = CASH_FLOW_GRADES_LOW_FIRST.map((item) => ({
    label: item.grade,
    color: `var(--ds-cash-flow-cf-${cashFlowLevel(item.grade)})`,
    foreground: `var(--ds-cash-flow-cf-${cashFlowLevel(item.grade)}-foreground)`,
}))
const CASH_FLOW_LOW_LABEL = CASH_FLOW_GRADES_LOW_FIRST[0].name
const CASH_FLOW_HIGH_LABEL = CASH_FLOW_GRADES_LOW_FIRST[CASH_FLOW_GRADES_LOW_FIRST.length - 1].name

const BORROWING_TREND_COLOR = 'var(--ds-report-series-3)'
// 신용/담보 비중 — 선 모양은 보고서 공통(REPORT_LINE_STYLES)의 1번 · 4번을 쓰고, 아래 비율 막대(RatioStackBar)도 같은 색을 쓴다.
const CREDIT_LINE_STYLE = REPORT_LINE_STYLES[0]
const COLLATERAL_LINE_STYLE = REPORT_LINE_STYLES[3]

// [프론트엔드 연동 · 정렬] 기획 메모 '최신순으로 정렬' — 이전평가이력(평가일자) · 현금흐름등급(결산일자) 표는 날짜 최근 것부터 그린다.
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

// 기업신용정보 표 하나 — 인쇄본(kbigx-print-credit.tsx CreditInfoBlock)과 같은 규칙.
//   · 비공개 표(케이스의 hiddenInfoTables): 표 머리는 그대로, 값 줄은 '비공개' 한 줄, 제목 옆 상태 글은 뺀다.
//   · 상태가 '해당없음' 인 표: 비공개 케이스여도 상태 글 + '해당사항 없음' 줄을 그대로 보인다.
const CREDIT_STATUS_NONE = '해당없음'
const isCreditRowPrivate = (table: InnovationCreditInfoTable, visibility: InnovationCreditVisibility) =>
    table.status !== CREDIT_STATUS_NONE && visibility.hiddenInfoTables.includes(table.id)
const CreditInfoTable = ({
    table,
    visibility,
}: {
    table: InnovationCreditInfoTable
    visibility: InnovationCreditVisibility
}) => {
    const isRowPrivate = isCreditRowPrivate(table, visibility)
    return (
        <ReportTable
            caption={`${table.title} — ${isRowPrivate ? PRIVATE_SHORT_LABEL : table.status}`}
            minWidthClassName="min-w-0"
            columns={table.columns.map((column, index) => ({
                key: String(index),
                label: column,
                isNoWrap: true,
            }))}
            rows={
                isRowPrivate || table.status === CREDIT_STATUS_NONE
                    ? []
                    : table.rows.map((row, rowIndex) => ({
                          id: `${table.id}-${rowIndex}`,
                          cells: Object.fromEntries(row.map((value, index) => [String(index), value || EMPTY_VALUE])),
                      }))
            }
            emptyText={isRowPrivate ? PRIVATE_SHORT_LABEL : EMPTY_TABLE_TEXT}
        />
    )
}

// 차입금 현황 카드 3개 — 실제 값과 자리 표시 값(비공개 케이스)을 같은 모양으로 그린다.
type BorrowingStatusSource = Pick<InnovationCreditDetail, 'institutions' | 'creditCollateral' | 'collaterals'>

const InstitutionShareCard = ({source}: {source: BorrowingStatusSource}) => (
    <Card className="h-full gap-0" title="기관별 비중">
        <div className="grid grid-cols-2 items-center gap-6">
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

// 신용/담보 비중 · 담보 현황 — 나란한 두 카드라 차트가 차례 없이 동시에 움직인다(같은 revealGroup).
const BORROWING_PAIR_REVEAL_GROUP = 'borrowing-credit-collateral'

const CreditCollateralCard = ({source}: {source: BorrowingStatusSource}) => (
    <Card className="h-full gap-0" title="신용/담보 비중" revealGroup={BORROWING_PAIR_REVEAL_GROUP}>
        {/* 그래프(범례 포함) → 아래 비율 막대 간격 24. */}
        <div className="flex min-w-0 flex-col gap-6">
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
        </div>
    </Card>
)

const CollateralCard = ({source}: {source: BorrowingStatusSource}) => {
    const total = source.collaterals.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
    return (
        <Card className="h-full gap-0" title="담보 현황" revealGroup={BORROWING_PAIR_REVEAL_GROUP}>
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

// 비공개 케이스의 차입금 현황 자리 표시 — 숫자는 공용 가짜 값(PRIVATE_PLACEHOLDER, composite/private-content.tsx)이고,
// 이름('구분 n')과 도넛 조각 색만 여기서 붙인다. 색은 percentage-donut-colors.ts 와 같은 donut-<n> 토큰이다(다크에서 밝은 색).
const PLACEHOLDER_LABELS = ['구분 1', '구분 2', '구분 3', '구분 4', '구분 5'] as const
const PLACEHOLDER_SLICE_COLORS = ['var(--ds-donut-2)', 'var(--ds-donut-4)', 'var(--ds-donut-6)'] as const
const PLACEHOLDER_SLICE_IDS = ['placeholder-a', 'placeholder-b', 'placeholder-c'] as const
const PLACEHOLDER_BORROWING_STATUS: BorrowingStatusSource = {
    institutions: {
        years: PRIVATE_PLACEHOLDER.years,
        rows: PLACEHOLDER_LABELS.map((label, index) => ({
            key: `placeholder-${index}`,
            label,
            values: PRIVATE_PLACEHOLDER.yearValues,
        })),
        share: PRIVATE_PLACEHOLDER.shares.map((percentage, index) => ({
            id: PLACEHOLDER_SLICE_IDS[index],
            label: PLACEHOLDER_LABELS[index],
            percentage,
            color: PLACEHOLDER_SLICE_COLORS[index],
        })),
    },
    creditCollateral: PRIVATE_PLACEHOLDER.creditCollateral,
    collaterals: PRIVATE_PLACEHOLDER.amounts.map((amount, index) => ({
        id: PLACEHOLDER_SLICE_IDS[index],
        label: PLACEHOLDER_LABELS[index],
        amount,
        color: PLACEHOLDER_SLICE_COLORS[index],
    })),
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
    const ratingDefinition = findCriGrade(rating.label)?.definition
    // 이전평가이력 표 — 최신순으로 정렬한 뒤 가장 최근(현재 등급 — 왼쪽 게이지)을 뺀 지난 평가만.
    const previousRatings = [...ratingHistory].sort(byLatestDate).slice(1)
    // 현금흐름등급 표 — 최신순.
    const cashFlowHistory = [...cashFlow.history].sort(byLatestDate)
    const cashFlowGrade = findCashFlowGrade(cashFlow.grade)
    const cashFlowName = cashFlowGrade?.name
    const cashFlowDefinition = cashFlowGrade?.definition
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
                        {/* 등급 정의 — 등급 코드로 CRI 등급표(cri-grades.ts)에서 찾는다. 표에 없는 코드면 상자를 숨긴다(게이지가 '등급 코드 확인 필요' 표시). */}
                        {ratingDefinition ? <NoticeBox className="text-center">{ratingDefinition}</NoticeBox> : null}
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
                            grades={CASH_FLOW_SCALE}
                            current={cashFlow.grade}
                            // 원호 안에는 등급만 둔다(설명 글자 없음).
                            description=""
                            lowLabel={CASH_FLOW_LOW_LABEL}
                            highLabel={CASH_FLOW_HIGH_LABEL}
                            scaleLabel="현금흐름 창출 능력"
                            ariaLabel={`현금흐름등급 ${cashFlow.grade}${cashFlowName ? `(${cashFlowName})` : ''}`}
                        />
                        {/* 이력이 없으면 머리글 아래에 빈 상태(경영진 · 주주 표와 같은 방식) — '해당사항 없음'은 기업신용정보 표의
                            '해당없음' 상태 문구라 쓰지 않는다. 높이는 이력 3줄(min-h-34 = 136, 한 줄 약 45). */}
                        <div className="flex flex-col">
                            <ReportTable
                                caption="현금흐름등급 평가이력"
                                minWidthClassName="min-w-0"
                                columns={[
                                    {key: 'grade', label: '현금흐름등급'},
                                    {key: 'date', label: '결산일자'},
                                ]}
                                rows={cashFlowHistory.map((item) => ({
                                    id: item.date,
                                    cells: {grade: item.grade, date: item.date},
                                }))}
                            />
                            {cashFlowHistory.length ? null : (
                                <EmptyState className="border-subtle-3 min-h-34 border-b" />
                            )}
                        </div>
                    </div>
                    {/* 등급 정의 — 등급 코드로 현금흐름등급표(cash-flow-grades.ts)에서 찾는다. 표에 없는 코드면 상자를 숨긴다. */}
                    {cashFlowDefinition ? <NoticeBox className="text-center">{cashFlowDefinition}</NoticeBox> : null}
                    <div className="flex flex-col gap-4">
                        <h4 className="typo-body-xl-bold text-foreground">기업신용정보</h4>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            {detail.creditInfo.map((table) => (
                                <SubBlock
                                    key={table.id}
                                    title={table.title}
                                    titleClassName="typo-body-l-medium"
                                    // 비공개 표는 상태 글을 뺀다(값 줄과 함께 가린다).
                                    status={isCreditRowPrivate(table, visibility) ? undefined : table.status}
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
                        <Card key={group.id} title={group.title} className="gap-0">
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

            {/* 차입금 분석 — 변동률(선 그래프) · 현황 · 변동현황 카드. 단위는 WithUnit 규칙(innovation-growth-report-parts.tsx). */}
            <section aria-labelledby="ig-credit-borrowing" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-borrowing" title="차입금 분석" />
                <div className="flex flex-col gap-6">
                    <Card title="차입금 변동률" className="gap-0">
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
                    <Card title="차입금 현황" className="gap-0">
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
