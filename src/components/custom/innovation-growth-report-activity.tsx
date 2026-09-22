'use client'

import {ArrowDown, ArrowUp} from 'lucide-react'
import {ColumnChart} from '@/components/custom/column-chart'
import {Card, ReportTable, SectionTitle} from '@/components/custom/innovation-growth-report-parts'
import {LineChart} from '@/components/custom/line-chart'
import type {InnovationActivityDetail, InnovationEnergyRow} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · 활동성정보 탭 본문 — 인적자원 현황(표 · 분기별 종업원수 · 인당 매출액) → 에너지 사용 현황(전기 · 가스).
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 폭(1280)만 그린다(좁으면 문서가 가로로 넘친다).
//
// [프론트엔드 연동] 값은 detail(report.activityDetail)과 그래프용 분기 · 연도 값(employees · salesPerEmployee,
// report.activity)으로 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationActivityDetail.

const numberFormatter = new Intl.NumberFormat('ko-KR')
const oneDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const twoDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

// 에너지 선 색 — 행 순서대로 navy.500 · blue.500 · purple.500.
const ENERGY_COLORS = ['var(--raw-navy-500)', 'var(--raw-blue-500)', 'var(--raw-purple-500)'] as const

// 전년대비 증감(율) — '1명 (↑3.5%)'. 늘면 빨간 위 화살표, 줄면 파란 아래 화살표(0 이면 화살표 없음).
// 화살표는 장식이고 증감은 부호(-)와 숨김 글자로도 읽힌다 — 색에만 기대지 않는다[5.3.1].
const ChangeCell = ({change, changeRate}: {change: number; changeRate: number}) => {
    const Icon = change > 0 ? ArrowUp : change < 0 ? ArrowDown : null
    return (
        <span className="inline-flex items-center">
            {numberFormatter.format(change)}명 (
            {Icon ? (
                <>
                    <Icon
                        aria-hidden="true"
                        className={change > 0 ? 'text-error-500 size-4' : 'size-4 text-blue-500'}
                    />
                    <span className="sr-only">{change > 0 ? '증가' : '감소'}</span>
                </>
            ) : null}
            {oneDecimalFormatter.format(changeRate)}%)
        </span>
    )
}

// 에너지 사용량 카드 — 왼쪽 표(구분 + 연도) · 오른쪽 선 그래프(범례 위 오른쪽 · 높이 140), 세로 가운데 정렬.
const EnergyCard = ({
    title,
    years,
    rows,
}: {
    title: string
    years: readonly string[]
    rows: readonly InnovationEnergyRow[]
}) => (
    <Card title={title}>
        <div className="grid grid-cols-2 items-center gap-6">
            <ReportTable
                caption={`${title}(단위: %)`}
                columns={[{key: 'label', label: '구분'}, ...years.map((year) => ({key: year, label: year}))]}
                rows={rows.map((row) => ({
                    id: row.key,
                    cells: {
                        label: row.label,
                        ...Object.fromEntries(
                            years.map((year, index) => [year, twoDecimalFormatter.format(row.values[index] ?? 0)]),
                        ),
                    },
                }))}
            />
            <LineChart
                animate={false}
                appearance="columns"
                legendPlacement="top-end"
                plotHeight={140}
                showTooltip={false}
                ariaLabel={`연도별 ${title}`}
                unit="%"
                valueFractionDigits={2}
                data={years.map((year, index) => ({
                    id: year,
                    label: year,
                    values: Object.fromEntries(rows.map((row) => [row.key, row.values[index] ?? 0])),
                }))}
                series={rows.map((row, index) => ({
                    key: row.key,
                    label: row.label,
                    color: ENERGY_COLORS[index % ENERGY_COLORS.length],
                }))}
            />
        </div>
    </Card>
)

type InnovationGrowthReportActivityProps = {
    detail: InnovationActivityDetail
    employees: readonly {label: string; value: number}[]
    salesPerEmployee: readonly {label: string; value: number}[]
}

const InnovationGrowthReportActivity = ({detail, employees, salesPerEmployee}: InnovationGrowthReportActivityProps) => (
    <>
        {/* 인적자원 현황 */}
        <section aria-labelledby="ig-activity-hr" className="flex flex-col gap-4">
            <SectionTitle id="ig-activity-hr" title="인적자원 현황" date="단위 : 명, 천원" />
            <div className="flex flex-col gap-6">
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
                    rows={detail.humanResources.map((row) => ({
                        id: row.year,
                        cells: {
                            year: row.year,
                            employees: numberFormatter.format(row.employees),
                            change: <ChangeCell change={row.change} changeRate={row.changeRate} />,
                            hires: numberFormatter.format(row.hires),
                            leavers: numberFormatter.format(row.leavers),
                            sales: oneDecimalFormatter.format(row.salesPerEmployee),
                        },
                    }))}
                />
                {/* 선 카드 792 : 막대 카드 384. */}
                <div className="grid grid-cols-[minmax(0,792fr)_minmax(0,384fr)] gap-6">
                    <Card title="분기별 종업원수" aside="단위 : 명">
                        <LineChart
                            animate={false}
                            data={employees.map((item) => ({
                                id: item.label,
                                label: item.label,
                                values: {employees: item.value},
                            }))}
                            series={[{key: 'employees', label: '종업원수', color: 'var(--raw-purple-600)'}]}
                            variant="area"
                            appearance="cells"
                            showLegend={false}
                            showValueLabels
                            showTooltip={false}
                            ariaLabel="분기별 종업원수 추이"
                        />
                    </Card>
                    <Card title="인당 매출액" aside="단위 : 천원">
                        <ColumnChart
                            animate={false}
                            data={salesPerEmployee.map((item) => ({
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
            </div>
        </section>

        {/* 에너지 사용 현황 */}
        <section aria-labelledby="ig-activity-energy" className="flex flex-col gap-4">
            <SectionTitle id="ig-activity-energy" title="에너지 사용 현황" />
            <div className="flex flex-col gap-6">
                <EnergyCard title="전기 사용량" years={detail.energy.years} rows={detail.energy.electricity} />
                <EnergyCard title="가스 사용량" years={detail.energy.years} rows={detail.energy.gas} />
            </div>
        </section>
    </>
)

export {InnovationGrowthReportActivity}
export type {InnovationGrowthReportActivityProps}
