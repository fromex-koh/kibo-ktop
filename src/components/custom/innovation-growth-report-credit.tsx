'use client'

import {Fragment} from 'react'
import {GradeHistoryChart} from '@/components/custom/grade-history-chart'
import {GradeScaleGauge, type GradeScaleItem} from '@/components/custom/grade-scale-gauge'
import {
    Card,
    NoticeBox,
    REPORT_LINE_STYLES,
    ReportTable,
    ReportTextCell,
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
    BORROWING_CHANGE_LABELS,
    getRecentYears,
    INNOVATION_CREDIT_VISIBILITY,
    INSTITUTION_LABELS,
    COLLATERAL_LABELS,
    pickYearValue,
    RATIO_GROUP_SPECS,
    toFixedBorrowings,
    type InnovationBorrowingRow,
    type InnovationCreditInfoTable,
    type InnovationCreditVisibility,
    type InnovationCreditDetail,
    INNOVATION_REPORT_GRADE_HISTORY_COUNT,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · 신용/재무정보 탭 본문 — 기업신용등급(게이지 · 이전평가이력) → 현금흐름등급(등급 척도 · 평가이력 · 기업신용정보 표)
// → 재무비율진단(성장성 · 수익성 · 안정성 · 활동성) → 차입금 분석(변동률 · 현황 표 · 변동현황 표) → 차입금 현황(기관별 비중 · 신용/담보 비중 · 담보 현황).
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 값은 detail(report.creditDetail)과 기업신용등급 게이지 데이터(rating — 진단브리핑과 같은 toCriRatingData 결과)로
// 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationCreditDetail.

const EMPTY_VALUE = '-'
const EMPTY_TABLE_TEXT = '해당사항 없음'
// 값 칸 — 숫자가 아니면 '-'(0 은 0). PDF 템플릿과 같은 규칙.
const formatOrEmpty = (value: number | undefined, formatter: Intl.NumberFormat) =>
    typeof value === 'number' && Number.isFinite(value) ? formatter.format(value) : EMPTY_VALUE
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
    // 원호 — 라이트는 혁신성장역량지수 게이지와 같은 2색 그라데이션, 다크는 칸 색과 같은 단색(tokens.json cash-flow-gauge-cf-<n>).
    arcColor: `var(--ds-cash-flow-gauge-cf-${cashFlowLevel(item.grade)}-from)`,
    arcGradientTo: `var(--ds-cash-flow-gauge-cf-${cashFlowLevel(item.grade)}-to)`,
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
// 현금흐름등급 원 높이 — 높은 등급(CF1)이 위. CF6 … CF1 을 0~100 으로 고르게 나눈다. 표에 없는 등급은 0(맨 아래).
const toCashFlowValue = (grade: string) => {
    const level = cashFlowLevel(grade)
    return level ? ((CASH_FLOW_GRADES_LOW_FIRST.length - level) / (CASH_FLOW_GRADES_LOW_FIRST.length - 1)) * 100 : 0
}

// 등급 이력 — 그래프(오래된 것부터) 아래 표(최근 것부터). 기업신용등급 · 현금흐름등급이 같이 쓴다(PDF 템플릿 GradeHistory 와 같은 규칙).
// 그래프 · 표 모두 최근 INNOVATION_REPORT_GRADE_HISTORY_COUNT 건이고, 표는 늘 그 줄 수 — 모자라면 '-' 줄로 채운다. 이력이 하나도 없으면 표 머리 아래 빈 상태.
type GradeHistoryRecord = {date: string; chartLabel: string; grade: string}
const GradeHistory = ({
    title,
    history,
    toValue,
    gradeHeader,
    dateHeader,
}: {
    /** 그래프 · 표 이름(낭독기용) — 예: 기업신용등급 이전평가이력. */
    title: string
    history: readonly GradeHistoryRecord[]
    /** 등급 → 원 높이(0~100, 높을수록 위). */
    toValue: (grade: string) => number
    gradeHeader: string
    dateHeader: string
}) => {
    const latest = [...history].sort(byLatestDate).slice(0, INNOVATION_REPORT_GRADE_HISTORY_COUNT)
    const columns = [
        {key: 'grade', label: gradeHeader},
        {key: 'date', label: dateHeader},
    ]
    // 이력이 하나도 없으면 그래프 없이 표 머리 아래 빈 상태 하나 — 그래프 + 표 3줄 자리(약 336)를 지킨다.
    if (!latest.length) {
        return (
            <div className="flex flex-col">
                <ReportTable caption={title} minWidthClassName="min-w-0" columns={columns} rows={[]} />
                <EmptyState className="border-subtle-3 min-h-84 border-b" />
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-6">
            <GradeHistoryChart
                data={[...latest].reverse().map((item) => ({
                    id: item.date,
                    label: item.chartLabel,
                    grade: item.grade,
                    value: toValue(item.grade),
                }))}
                ariaLabel={title}
            />
            <ReportTable
                caption={title}
                minWidthClassName="min-w-0"
                columns={columns}
                rows={Array.from({length: INNOVATION_REPORT_GRADE_HISTORY_COUNT}, (_, index) => {
                    const item = latest[index]
                    return item
                        ? {id: item.date, cells: {grade: item.grade, date: item.date}}
                        : {id: `empty-${index}`, cells: {grade: EMPTY_VALUE, date: EMPTY_VALUE}}
                })}
            />
        </div>
    )
}

// 차입금 칸 — 칸이 없거나(null) 숫자가 아니면 '-'(0 은 0 · 0.0). PDF 템플릿과 같은 규칙.
const formatBorrowingCell = (cell: InnovationBorrowingRow['cells'][number] | undefined, key: 'amount' | 'ratio') => {
    const value = key === 'amount' ? cell?.amount : cell?.ratio
    if (typeof value !== 'number' || !Number.isFinite(value)) return EMPTY_VALUE
    return key === 'amount' ? numberFormatter.format(value) : oneDecimalFormatter.format(value)
}

// 차입금 현황 표 — 두 단 머리(항목 · 연도별 금액/비중) · 묶음(group.label)을 세로로 합친 칸 · 묶음마다 소계 줄 · 맨 아래 합계 줄.
// ReportTable 로는 묶음 칸 세로 합치기(rowgroup)를 표현할 수 없어 따로 그린다. 값이 null 인 칸은 '-'.
// years — 머리에 적을 연도. 받은 연도가 없으면 바깥에서 최근 3개년을 넘긴다(칸은 '-').
// 줄은 고정 묶음 · 항목(toFixedBorrowings — PDF 템플릿과 공용)이라 데이터가 없어도 줄 이름은 남고 칸만 '-'.
const BorrowingTable = ({
    borrowings,
    years,
}: {
    borrowings: InnovationCreditDetail['borrowings']
    years: readonly string[]
}) => {
    const headClassName =
        'border-subtle-3 bg-primary-subtle typo-body-l-bold text-foreground border-b px-4 pt-3 pb-2.75 whitespace-nowrap'
    // 항목 이름 · 금액 · 비중 모두 한 줄로 둔다 — 글자가 칸 안에서 접히지 않고 칸이 그 폭만큼 넓어진다.
    const cellClassName =
        'border-subtle-3 typo-body-l-regular text-label-foreground border-b px-4 pt-3 pb-2.75 tabular-nums whitespace-nowrap'
    const valueCells = (row: InnovationBorrowingRow, className: string) =>
        years.flatMap((_, index) => [
            <td key={`${index}-amount`} className={className}>
                {formatBorrowingCell(row.cells[index], 'amount')}
            </td>,
            <td key={`${index}-ratio`} className={className}>
                {formatBorrowingCell(row.cells[index], 'ratio')}
            </td>,
        ])

    return (
        // 다른 보고서 표와 같이 좁은 화면(태블릿)에서는 표 상자 안에서 좌우로 넘긴다 — 최소 폭 800 = 앞 두 칸(204 × 2) +
        // 연도별 금액 · 비중 6칸(약 65). 줄이면 연도 칸이 글자 몇 개 폭으로 눌린다.
        // 열 폭을 고정으로 나누지 않는다(table-fixed 아님) — 큰 금액(608,100,000 등)이 들어오면 그 칸이 숫자 폭만큼
        // 넓어지고, 넓어진 만큼 표 상자 안에서 좌우로 넘긴다. 고정으로 나누면 숫자가 옆 비중 칸을 덮는다.
        <div className="border-t-foreground-subtle overflow-x-auto border-t contain-inline-size">
            <table className="w-full min-w-200 border-collapse text-center">
                <caption className="sr-only">차입금 현황(단위: 백만원, %)</caption>
                {/* 열 수를 실제 셀 수와 맞춘다 — 앞 두 칸만 폭을 고정하고 연도별 금액 · 비중 칸은 span 으로 함께 센다.
                    선언한 열보다 셀이 많으면 마크업 오류가 된다[8.1.1]. */}
                <colgroup>
                    <col className="w-51" />
                    <col className="w-51" />
                    <col span={years.length * 2} />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="colgroup" colSpan={2} rowSpan={2} className={headClassName}>
                            항목
                        </th>
                        {years.map((year) => (
                            <th key={year} scope="colgroup" colSpan={2} className={cn(headClassName, 'border-x')}>
                                {year}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {years.flatMap((year) => [
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
// 숫자 값(금액 1,200,000 · 일자 2023-11-06 · 번호 123-45-67890) — 말줄임하지 않고 다 보인다.
const CREDIT_NUMBER_VALUE = /^[-+]?\d[\d,.-]*$/
// 숫자 값이 칸보다 길면 쉼표 뒤에서 줄을 바꾼다(묶음 중간에서 끊기지 않게). 그래도 넘치면 아무 곳에서나(wrap-anywhere).
const CreditNumberValue = ({value}: {value: string}) => (
    <span className="wrap-anywhere whitespace-normal">
        {value.split(',').map((part, index) => (
            <Fragment key={index}>
                {index ? (
                    <>
                        ,<wbr />
                    </>
                ) : null}
                {part}
            </Fragment>
        ))}
    </span>
)
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
                          // 글 값(상태 · 기관명 등 — 대개 짧은 정해진 명사)은 칸 폭을 넘으면 한 줄 말줄임 + 툴팁(빈 값은 '-').
                          // 숫자 값(금액 · 일자 · 번호)은 자르지 않는다 — 칸보다 길면 줄을 바꿔 다 보인다.
                          cells: Object.fromEntries(
                              row.map((value, index) => [
                                  String(index),
                                  CREDIT_NUMBER_VALUE.test(value) ? (
                                      <CreditNumberValue key={index} value={value} />
                                  ) : (
                                      <ReportTextCell key={index} lines={1}>
                                          {value}
                                      </ReportTextCell>
                                  ),
                              ]),
                          ),
                      }))
            }
            emptyText={isRowPrivate ? PRIVATE_SHORT_LABEL : EMPTY_TABLE_TEXT}
            // '해당사항 없음' · '비공개' 줄은 옅은 면으로 값 줄과 구분한다(PDF 템플릿과 같은 규칙).
            emptyClassName="bg-surface-subtle text-foreground-subtle"
        />
    )
}

// 차입금 현황 카드 3개 — 실제 값과 자리 표시 값(비공개 케이스)을 같은 모양으로 그린다.
type BorrowingStatusSource = Pick<InnovationCreditDetail, 'institutions' | 'creditCollateral' | 'collaterals'>

// 표 줄은 업권 5개 고정(INSTITUTION_LABELS — PDF 템플릿과 공용), 연도는 years(최근 3개년). 없는 업권 · 연도는 '-'.
// 비공개 자리 표시는 가짜 이름(labels)과 가짜 연도를 그대로 넘긴다.
const InstitutionShareCard = ({
    source,
    years = source.institutions.years,
    labels = INSTITUTION_LABELS,
}: {
    source: BorrowingStatusSource
    years?: readonly string[]
    labels?: readonly string[]
}) => (
    <Card className="h-full gap-0" title="기관별 비중">
        <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-2">
            <WithUnit unit="단위: %">
                <ReportTable
                    caption="기관별 차입금 비중(단위: %)"
                    minWidthClassName="min-w-0"
                    columns={[
                        {key: 'label', label: '구분', isRowHeader: true, isNoWrap: true},
                        ...years.map((year) => ({key: year, label: year})),
                    ]}
                    rows={labels.map((label) => {
                        const row = source.institutions.rows.find((item) => item.label === label)
                        return {
                            id: label,
                            cells: {
                                label,
                                ...Object.fromEntries(
                                    years.map((year) => {
                                        const value = pickYearValue(row?.values, source.institutions.years, year)
                                        return [
                                            year,
                                            value === undefined ? EMPTY_VALUE : oneDecimalFormatter.format(value),
                                        ]
                                    }),
                                ),
                            },
                        }
                    })}
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
                {/* 시점이 하나도 없으면 그래프 자리에 빈 상태. */}
                {source.creditCollateral.points.length ? (
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
                ) : (
                    <EmptyState className="min-h-56.5" />
                )}
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

// 범례는 담보 종류 3개 고정(COLLATERAL_LABELS — PDF 템플릿과 공용)이고 받지 못한 종류는 '-'. 도넛은 받은 값으로만 그린다.
// 비공개 자리 표시는 가짜 이름(labels)을 그대로 넘긴다.
const CollateralCard = ({
    source,
    labels = COLLATERAL_LABELS,
}: {
    source: BorrowingStatusSource
    labels?: readonly string[]
}) => {
    const items = labels.map((label, index) => {
        const received = source.collaterals.find((item) => item.label === label)
        return {
            id: received?.id ?? `collateral-${index}`,
            label,
            amount: received && Number.isFinite(received.amount) ? received.amount : undefined,
            // 받지 못한 종류는 범례 칩 색만 필요해 순서대로 같은 도넛 색을 쓴다.
            color: received?.color ?? PLACEHOLDER_SLICE_COLORS[index % PLACEHOLDER_SLICE_COLORS.length],
        }
    })
    const total = items.reduce((sum, item) => sum + Math.max(0, item.amount ?? 0), 0)
    return (
        <Card className="h-full gap-0" title="담보 현황" revealGroup={BORROWING_PAIR_REVEAL_GROUP}>
            <WithUnit unit="단위: 백만원">
                <PercentageDonutChart
                    // 하나도 받지 못하면 빈 상태(범례 없이).
                    data={
                        items.some((item) => item.amount !== undefined)
                            ? items.map((item) => ({
                                  id: item.id,
                                  label: item.label,
                                  color: item.color,
                                  percentage:
                                      item.amount !== undefined && total
                                          ? Math.round((Math.max(0, item.amount) / total) * 1000) / 10
                                          : 0,
                                  valueLabel:
                                      item.amount === undefined ? EMPTY_VALUE : numberFormatter.format(item.amount),
                              }))
                            : []
                    }
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
    /** 재무비율 · 차입금 연도를 하나도 받지 못했을 때 쓸 연도(재무현황 연도 — report.companyStatus.finance.years). */
    fallbackYears?: readonly string[]
}

const InnovationGrowthReportCredit = ({
    detail,
    rating,
    visibility = INNOVATION_CREDIT_VISIBILITY.self,
    fallbackYears = [],
}: InnovationGrowthReportCreditProps) => {
    const {ratingHistory, cashFlow, borrowings, borrowingChanges} = detail
    // 연도는 표마다 최근 3개년 — 받은 연도가 없으면 PDF 템플릿과 같은 대체 연도를 쓴다(값은 '-').
    const ratioYears = getRecentYears(detail.ratioYears, fallbackYears)
    const borrowingYears = borrowings.years.length ? borrowings.years : getRecentYears([], fallbackYears)
    const changeYears = getRecentYears(borrowingChanges.years, borrowingYears)
    const institutionYears = getRecentYears(detail.institutions.years, borrowingYears)
    const ratingDefinition = findCriGrade(rating.label)?.definition
    const cashFlowGrade = findCashFlowGrade(cashFlow.grade)
    const cashFlowName = cashFlowGrade?.name
    const cashFlowDefinition = cashFlowGrade?.definition
    return (
        <>
            {/* 기업신용등급 */}
            <section aria-labelledby="ig-credit-rating" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-rating" title="기업신용등급" />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                        <GradeHistory
                            title="기업신용등급 이전평가이력"
                            history={ratingHistory}
                            toValue={toGradeValue}
                            gradeHeader="신용등급"
                            dateHeader="평가일자"
                        />
                    </Card>
                </div>
            </section>

            {/* 현금흐름등급 */}
            <section aria-labelledby="ig-credit-cash-flow" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-cash-flow" title="현금흐름등급" />
                <Card>
                    <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-2">
                        <GradeScaleGauge
                            grades={CASH_FLOW_SCALE}
                            // 등급을 받지 못하면 가운데에 '-'(기업신용등급 게이지 · PDF 와 같다).
                            current={cashFlow.grade || EMPTY_VALUE}
                            // 원호 안에는 등급만 둔다(설명 글자 없음).
                            description=""
                            lowLabel={CASH_FLOW_LOW_LABEL}
                            highLabel={CASH_FLOW_HIGH_LABEL}
                            scaleLabel="현금흐름 창출 능력"
                            ariaLabel={`현금흐름등급 ${cashFlow.grade || EMPTY_VALUE}${cashFlowName ? `(${cashFlowName})` : ''}`}
                        />
                        {/* 평가이력 — 기업신용등급 이전평가이력과 같은 추이 그래프 + 최근 3건 표. */}
                        <GradeHistory
                            title="현금흐름등급 평가이력"
                            history={cashFlow.history}
                            toValue={toCashFlowValue}
                            gradeHeader="현금흐름등급"
                            dateHeader="결산일자"
                        />
                    </div>
                    {/* 등급 정의 — 등급 코드로 현금흐름등급표(cash-flow-grades.ts)에서 찾는다. 표에 없는 코드면 상자를 숨긴다. */}
                    {cashFlowDefinition ? <NoticeBox className="text-center">{cashFlowDefinition}</NoticeBox> : null}
                    <div className="flex flex-col gap-4">
                        <h4 className="typo-body-xl-bold text-foreground">기업신용정보</h4>
                        <div className="grid grid-cols-1 gap-x-12 gap-y-4 xl:grid-cols-2">
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
                    {/* 묶음 4개 · 지표 4개 고정(RATIO_GROUP_SPECS — PDF 템플릿과 공용). 연도는 최근 3개년, 없는 지표 · 값 · 업종평균 대비는 '-'.
                        그래프는 값이 하나라도 있는 지표만 그리고, 모두 없으면 빈 상태. */}
                    {RATIO_GROUP_SPECS.map((spec) => {
                        const group = detail.ratios.find((item) => item.id === spec.id)
                        const unit = group?.unit || spec.unit
                        const rows = spec.labels.map((label, labelIndex) => {
                            const row = group?.rows.find((item) => item.label === label)
                            return {
                                key: `${spec.id}-${labelIndex}`,
                                label,
                                comparison: row?.comparison,
                                values: ratioYears.map((year) => pickYearValue(row?.values, detail.ratioYears, year)),
                                lineStyle: REPORT_LINE_STYLES[labelIndex % REPORT_LINE_STYLES.length],
                            }
                        })
                        const chartRows = rows.filter((row) => row.values.some((value) => value !== undefined))
                        return (
                            <Card key={spec.id} title={spec.title} className="gap-0">
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                    <WithUnit unit={`단위: ${unit}`}>
                                        <ReportTable
                                            caption={`${spec.title} 재무비율(단위: ${unit})`}
                                            minWidthClassName="min-w-0"
                                            columns={[
                                                {key: 'label', label: '재무비율', isNoWrap: true},
                                                ...ratioYears.map((year) => ({key: year, label: year})),
                                                {key: 'comparison', label: '업종평균 대비', isNoWrap: true},
                                            ]}
                                            rows={rows.map((row) => ({
                                                id: row.key,
                                                cells: {
                                                    label: row.label,
                                                    ...Object.fromEntries(
                                                        ratioYears.map((year, index) => [
                                                            year,
                                                            formatOrEmpty(row.values[index], twoDecimalFormatter),
                                                        ]),
                                                    ),
                                                    comparison: row.comparison || EMPTY_VALUE,
                                                },
                                            }))}
                                        />
                                    </WithUnit>
                                    {chartRows.length ? (
                                        <LineChart
                                            appearance="columns"
                                            legendPlacement="bottom-center"
                                            showTooltip={false}
                                            ariaLabel={`연도별 ${spec.title} 재무비율`}
                                            unit={unit}
                                            showUnitLabel={false}
                                            valueFractionDigits={2}
                                            // 값이 없는 점은 NaN — 선을 끊는다.
                                            data={ratioYears.map((year, index) => ({
                                                id: year,
                                                label: year,
                                                values: Object.fromEntries(
                                                    chartRows.map((row) => [row.key, row.values[index] ?? Number.NaN]),
                                                ),
                                            }))}
                                            series={chartRows.map((row) => ({
                                                key: row.key,
                                                label: row.label,
                                                ...row.lineStyle,
                                            }))}
                                        />
                                    ) : (
                                        <EmptyState className="min-h-56.5" />
                                    )}
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 차입금 분석 — 변동률(선 그래프) · 현황 · 변동현황 카드. 단위는 WithUnit 규칙(innovation-growth-report-parts.tsx). */}
            <section aria-labelledby="ig-credit-borrowing" className="flex flex-col gap-4">
                <SectionTitle id="ig-credit-borrowing" title="차입금 분석" />
                <div className="flex flex-col gap-6">
                    <Card title="차입금 변동률" className="gap-0">
                        <WithUnit unit="단위: %">
                            {/* 값이 하나도 없으면 빈 상태 — 일부만 빈 달은 선을 끊고 '-'. */}
                            {detail.borrowingTrend.some((item) => Number.isFinite(item.value)) ? (
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
                            ) : (
                                <EmptyState className="min-h-56.5" />
                            )}
                        </WithUnit>
                    </Card>
                    <Card title="차입금 현황" className="gap-0">
                        <WithUnit unit="단위: 백만원, %">
                            <BorrowingTable borrowings={toFixedBorrowings(borrowings)} years={borrowingYears} />
                        </WithUnit>
                    </Card>
                    {/* 단위는 줄 이름에 붙어 있다(차입금(백만원) 등) — 표 위 단위 줄이 없다. */}
                    <Card title="차입금 변동현황" className="gap-4">
                        <ReportTable
                            caption="차입금 변동현황"
                            columns={[
                                {key: 'label', label: '구분'},
                                ...changeYears.map((year) => ({key: year, label: year})),
                            ]}
                            // 4줄 고정(BORROWING_CHANGE_LABELS — PDF 템플릿과 공용). 없는 줄 · 연도 · 값은 '-'.
                            rows={BORROWING_CHANGE_LABELS.map((label) => {
                                const row = borrowingChanges.rows.find((item) => item.label === label)
                                return {
                                    id: label,
                                    cells: {
                                        label,
                                        ...Object.fromEntries(
                                            changeYears.map((year) => [
                                                year,
                                                formatOrEmpty(
                                                    pickYearValue(row?.values, borrowingChanges.years, year),
                                                    twoDecimalFormatter,
                                                ),
                                            ]),
                                        ),
                                    },
                                }
                            })}
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
                            <InstitutionShareCard source={PLACEHOLDER_BORROWING_STATUS} labels={PLACEHOLDER_LABELS} />
                        </PrivateContent>
                    ) : (
                        <InstitutionShareCard source={detail} years={institutionYears} />
                    )}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {visibility.isBorrowingStatusHidden ? (
                            <PrivateContent>
                                <CreditCollateralCard source={PLACEHOLDER_BORROWING_STATUS} />
                            </PrivateContent>
                        ) : (
                            <CreditCollateralCard source={detail} />
                        )}
                        {visibility.isBorrowingStatusHidden ? (
                            <PrivateContent>
                                <CollateralCard
                                    source={PLACEHOLDER_BORROWING_STATUS}
                                    labels={PLACEHOLDER_LABELS.slice(0, 3)}
                                />
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
