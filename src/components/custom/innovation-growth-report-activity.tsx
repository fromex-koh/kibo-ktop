'use client'

import {Triangle} from 'lucide-react'
import {EmptyState} from '@/components/composite/empty-state'
import {ColumnChart} from '@/components/custom/column-chart'
import {
    Card,
    REPORT_LINE_STYLES,
    ReportTable,
    SectionTitle,
    WithUnit,
} from '@/components/custom/innovation-growth-report-parts'
import {LineChart} from '@/components/custom/line-chart'
import {
    ENERGY_CATEGORIES,
    getHumanResourceYearRows,
    getRecentYears,
    toEnergyYearRows,
    type InnovationActivityDetail,
    type InnovationEnergyRow,
} from '@/content/service/k-bigx-innovation-report'
import {cn} from '@/lib/utils'

// K-BIGx 기업혁신성장 보고서 · 활동성정보 탭 본문 — 인적자원 현황(표 · 분기별 종업원수 · 인당 매출액) → 에너지 사용 현황(전기 · 가스).
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 값은 detail(report.activityDetail)과 그래프용 분기 · 연도 값(employees · salesPerEmployee,
// report.activity)으로 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationActivityDetail.

const numberFormatter = new Intl.NumberFormat('ko-KR')
// 인당 매출액 — 천원 단위라 정수로 반올림해 적는다(496,750).
const integerFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 0})
const twoDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
// 증감률 — 소수 첫째 자리까지(3.0 은 3). PDF 템플릿과 같다.
const changeRateFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

// 에너지 사용량 단위 — 전기 · 가스 모두 kWh. 표 위 단위 줄 · 표 이름(caption) · 그래프 단위에 함께 쓴다.
const ENERGY_UNIT = 'kWh'
const ENERGY_TOTAL_LABEL = '합계'
const EMPTY_VALUE = '-'
// 값 칸 — 숫자가 아니면 '-'(0 은 0). PDF 템플릿과 같은 규칙.
const formatOrEmpty = (value: number | undefined, formatter: Intl.NumberFormat) =>
    typeof value === 'number' && Number.isFinite(value) ? formatter.format(value) : EMPTY_VALUE
// 에너지 합계 칸 — 그 연도에 숫자가 있는 구분만 더한다. 하나도 없으면 '-'(PDF 템플릿 kbigx-print-activity.tsx 와 같은 규칙).
const formatEnergyTotal = (values: readonly (number | undefined)[]) => {
    const numbers = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
    return numbers.length ? twoDecimalFormatter.format(numbers.reduce((sum, value) => sum + value, 0)) : EMPTY_VALUE
}

// 전년대비 증감(율) — '1명 (▲ 3.5%)'. PDF 템플릿(kbigx-print-activity.tsx ChangeCell)과 같은 표기다 — 늘면 빨강 ▲,
// 줄면 파랑 ▼, 같으면 기호 없음. 율은 절댓값으로 적고(방향은 ▲▼ 가 알린다) 괄호 묶음은 굵게.
// 색 · 기호만으로 뜻을 전하지 않도록 ▲▼ 는 숨기고 '증가 · 감소 · 변동 없음'을 sr-only 글자로 읽힌다[5.3.1].
const ChangeCell = ({change, changeRate}: {change: number; changeRate: number}) => {
    const isUp = change > 0
    const isDown = change < 0
    // 증감 수('1명') · 증감률('(▲ 3.5%)')을 각각 한 덩어리로 묶는다(whitespace-nowrap) — 괄호 · 기호만 따로 떨어지지 않는다.
    // 칸이 좁으면(태블릿 · 큰 값) 증감률 덩어리만 아랫줄로 내려간다 — 한 줄로 고정하면 옆 칸 위로 넘친다.
    return (
        <span className="inline-flex flex-wrap items-center justify-center gap-x-1 tabular-nums">
            <span className="whitespace-nowrap">{numberFormatter.format(change)}명</span>
            <span
                className={cn(
                    'typo-body-l-bold inline-flex items-center gap-1 whitespace-nowrap',
                    isUp && 'text-error-500',
                    isDown && 'text-blue-500',
                )}
            >
                (
                {isUp || isDown ? (
                    <Triangle aria-hidden="true" className={cn('size-3 fill-current', isDown && 'rotate-180')} />
                ) : null}
                <span className="sr-only">{isUp ? '증가' : isDown ? '감소' : '변동 없음'}</span>
                {changeRateFormatter.format(Math.abs(changeRate))}%)
            </span>
        </span>
    )
}

// 에너지 사용량 카드 — 왼쪽 표(위에 단위 줄 · 맨 아래 합계 줄) · 오른쪽 선 그래프(아래 가운데 범례). 표 한 줄(사업장) = 선 하나.
// 선은 줄 순서대로 보고서 공통 모양(REPORT_LINE_STYLES)을 쓴다 — 다섯 줄을 넘으면 모양이 처음부터 되풀이된다.
const EnergyCard = ({
    title,
    years,
    rows,
}: {
    title: string
    years: readonly string[]
    rows: readonly InnovationEnergyRow[]
}) => (
    <Card title={title} className="gap-0">
        <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-2">
            <WithUnit unit={`단위: ${ENERGY_UNIT}`}>
                <ReportTable
                    caption={`${title}(단위: ${ENERGY_UNIT})`}
                    columns={[{key: 'label', label: '구분'}, ...years.map((year) => ({key: year, label: year}))]}
                    // 구분은 늘 본사 · 공장 · 기타 세 줄 — 받지 못한 구분 · 값은 '-'.
                    rows={ENERGY_CATEGORIES.map((category) => {
                        const row = rows.find((item) => item.label === category)
                        return {
                            id: category,
                            cells: {
                                label: category,
                                ...Object.fromEntries(
                                    years.map((year, index) => [
                                        year,
                                        formatOrEmpty(row?.values[index], twoDecimalFormatter),
                                    ]),
                                ),
                            },
                        }
                    })}
                    // 합계 줄 — 연도마다 값이 있는 구분만 더한다. 그 연도 값이 하나도 없으면 '-'.
                    footerCells={[
                        {key: 'label', content: ENERGY_TOTAL_LABEL},
                        ...years.map((year, index) => ({
                            key: year,
                            content: formatEnergyTotal(rows.map((row) => row.values[index])),
                        })),
                    ]}
                />
            </WithUnit>
            {/* 받은 값이 하나도 없으면 그래프 자리에 빈 상태. */}
            {rows.some((row) => row.values.some(Number.isFinite)) ? (
                <LineChart
                    appearance="columns"
                    legendPlacement="bottom-center"
                    plotHeight={160}
                    showTooltip={false}
                    ariaLabel={`연도별 ${title}`}
                    unit={ENERGY_UNIT}
                    showUnitLabel={false}
                    valueFractionDigits={2}
                    data={years.map((year, index) => ({
                        id: year,
                        label: year,
                        // 값이 없는 점은 NaN 그대로 — 선을 끊는다.
                        values: Object.fromEntries(rows.map((row) => [row.key, row.values[index]])),
                    }))}
                    series={rows.map((row, index) => ({
                        key: row.key,
                        label: row.label,
                        ...REPORT_LINE_STYLES[index % REPORT_LINE_STYLES.length],
                    }))}
                />
            ) : (
                <EmptyState className="min-h-56.5" />
            )}
        </div>
    </Card>
)

type InnovationGrowthReportActivityProps = {
    detail: InnovationActivityDetail
    employees: readonly {label: string; value: number}[]
    salesPerEmployee: readonly {label: string; value: number}[]
    /** 인적자원 · 에너지 연도를 하나도 받지 못했을 때 쓸 연도(재무현황 연도 — report.companyStatus.finance.years). */
    fallbackYears?: readonly string[]
}

// 값이 하나라도 숫자면 그래프, 모두 없으면 그래프 높이(226 = h-56.5)의 빈 상태.
const hasFiniteValue = (items: readonly {value: number}[]) => items.some((item) => Number.isFinite(item.value))

const InnovationGrowthReportActivity = ({
    detail,
    employees,
    salesPerEmployee,
    fallbackYears = [],
}: InnovationGrowthReportActivityProps) => {
    // 에너지 연도는 늘 최근 3개년 — 받은 연도가 없으면 재무현황 연도. 값은 그 연도 순서로 다시 맞춘다(PDF 템플릿과 같다).
    const energyYears = getRecentYears(detail.energy.years, fallbackYears)
    const toYears = (rows: readonly InnovationEnergyRow[]) => toEnergyYearRows(rows, detail.energy.years, energyYears)
    return (
        <>
            {/* 인적자원 현황 */}
            <section aria-labelledby="ig-activity-hr" className="flex flex-col gap-4">
                <SectionTitle id="ig-activity-hr" title="인적자원 현황" />
                <div className="flex flex-col gap-6">
                    {/* 제목 없는 카드 — 표 위 오른쪽에 단위 줄. */}
                    <Card>
                        <WithUnit unit="단위: 명, 천원">
                            <ReportTable
                                caption="인적자원 현황(단위: 명, 천원)"
                                columns={[
                                    {key: 'year', label: '기준년도'},
                                    {key: 'employees', label: '종업원수'},
                                    {key: 'change', label: '전년대비 증감(율)'},
                                    {key: 'hires', label: '입사자'},
                                    {key: 'leavers', label: '퇴사자'},
                                    {key: 'sales', label: '인당매출액'},
                                ]}
                                // 늘 최근 3개년 3줄 — 받지 못한 연도도 줄을 두고, 숫자가 아닌 값은 '-'(PDF 템플릿과 같은 규칙).
                                rows={getHumanResourceYearRows(detail.humanResources, fallbackYears).map(
                                    ({year, row}) => ({
                                        id: year,
                                        cells: {
                                            year,
                                            employees: formatOrEmpty(row?.employees, numberFormatter),
                                            change:
                                                row &&
                                                Number.isFinite(row.change) &&
                                                Number.isFinite(row.changeRate) ? (
                                                    <ChangeCell change={row.change} changeRate={row.changeRate} />
                                                ) : (
                                                    EMPTY_VALUE
                                                ),
                                            hires: formatOrEmpty(row?.hires, numberFormatter),
                                            leavers: formatOrEmpty(row?.leavers, numberFormatter),
                                            sales: formatOrEmpty(row?.salesPerEmployee, integerFormatter),
                                        },
                                    }),
                                )}
                            />
                        </WithUnit>
                    </Card>
                    {/* 분기별 종업원수(선) : 인당 매출액(막대) 카드 폭 비율 ≈ 2 : 1.
                    단위는 WithUnit 규칙(innovation-growth-report-parts.tsx). */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,792fr)_minmax(0,384fr)]">
                        <Card title="분기별 종업원수" className="gap-0">
                            <WithUnit unit="단위 : 명">
                                {hasFiniteValue(employees) ? (
                                    <LineChart
                                        data={employees.map((item) => ({
                                            id: item.label,
                                            label: item.label,
                                            values: {employees: item.value},
                                        }))}
                                        series={[{key: 'employees', label: '종업원수', color: 'var(--ds-purple-600)'}]}
                                        variant="area"
                                        appearance="cells"
                                        showLegend={false}
                                        showValueLabels
                                        showTooltip={false}
                                        ariaLabel="분기별 종업원수 추이"
                                    />
                                ) : (
                                    <EmptyState className="min-h-56.5" />
                                )}
                            </WithUnit>
                        </Card>
                        <Card title="인당 매출액" className="gap-0">
                            <WithUnit unit="단위 : 천원">
                                {hasFiniteValue(salesPerEmployee) ? (
                                    <ColumnChart
                                        // 값이 없는 해도 자리를 남기고 막대 대신 '-' 를 적는다(PDF 템플릿과 같다).
                                        // missingValueText 는 이 화면에서만 켜는 옵션이라 다른 화면의 막대 그래프는 그대로다.
                                        data={salesPerEmployee.map((item) => ({
                                            id: item.label,
                                            label: item.label,
                                            value: item.value,
                                        }))}
                                        missingValueText={EMPTY_VALUE}
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
                </div>
            </section>

            {/* 에너지 사용 현황 */}
            <section aria-labelledby="ig-activity-energy" className="flex flex-col gap-4">
                <SectionTitle id="ig-activity-energy" title="에너지 사용 현황" />
                <div className="flex flex-col gap-6">
                    <EnergyCard title="전기 사용량" years={energyYears} rows={toYears(detail.energy.electricity)} />
                    <EnergyCard title="가스 사용량" years={energyYears} rows={toYears(detail.energy.gas)} />
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportActivity}
export type {InnovationGrowthReportActivityProps}
