import {Triangle} from 'lucide-react'
import {
    KbxBlock,
    KbxChartBox,
    KbxSalesBarList,
    KbxSubBlock,
    KbxTable,
    KbxUnitBelow,
} from '@/components/custom/kbigx-print-parts'
import {MarkerLineChart, MarkerLineLegend} from '@/components/custom/marker-line-chart'
import {ValueLineChart} from '@/components/custom/value-line-chart'
import {
    ENERGY_CATEGORIES,
    getHumanResourceYearRows,
    getRecentYears,
    toEnergyYearRows,
    type InnovationGrowthReport,
} from '@/content/service/k-bigx-innovation-report'
import {cn} from '@/lib/utils'
import {
    isKbxNumber,
    KBX_EMPTY_VALUE,
    KBX_NOT_APPLICABLE_TEXT,
    kbxIntegerFormat,
    kbxFixed2Format,
    kbxNumberFormat,
} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — 활동성정보 장(쪽 2개: 인적자원 현황 · 에너지 사용 현황).
// [프론트엔드 연동] 인적자원 표 · 에너지 사용량은 report.activityDetail(화면 활동성정보 탭과 같은 값),
// 분기별 종업원수 · 인당 매출액 그래프는 report.activity(진단브리핑과 같은 값)에서 읽는다.
// 공통 규칙: 값이 없으면 '-', 0 은 0 으로 적는다. 연도별 표는 늘 최근 3개년 3열(또는 3줄).

type PageProps = {report: InnovationGrowthReport}

const rateFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})
const formatOrEmpty = (value: number, format: Intl.NumberFormat) =>
    isKbxNumber(value) ? format.format(value) : KBX_EMPTY_VALUE

// ── 활동성정보 1 — 인적자원 현황(표) · 분기별 종업원수(꺾은선) · 인당 매출액(막대 목록) ──

// 전년대비 증감 — '1명 (▲ 3.5%)'. 늘면 빨강 ▲, 줄면 파랑 ▼, 같으면 기호 없음. 율은 절댓값으로 적는다.
// 색 · 기호만으로 뜻을 전하지 않도록 ▲▼ 는 숨기고 '증가 · 감소 · 변동 없음'을 sr-only 글자로 읽힌다[5.3.1].
const ChangeCell = ({change, changeRate}: {change: number; changeRate: number}) => {
    const isUp = change > 0
    const isDown = change < 0

    return (
        <>
            {kbxNumberFormat.format(change)}명{' '}
            <span
                className={cn(
                    'font-kbx-bold inline-flex items-center gap-1',
                    isUp && 'text-kbx-red',
                    isDown && 'text-kbx-blue',
                )}
            >
                (
                {isUp || isDown ? (
                    <Triangle aria-hidden="true" className={cn('size-3 fill-current', isDown && 'rotate-180')} />
                ) : null}
                <span className="sr-only">{isUp ? '증가' : isDown ? '감소' : '변동 없음'}</span>
                {rateFormat.format(Math.abs(changeRate))}%)
            </span>
        </>
    )
}

// 분기별 종업원수 그래프의 선 · 글자 색 — 진단브리핑 그래프와 같다(바꾸면 같이 맞춘다).
const EMPLOYEE_CHART_COLORS = {
    grid: 'var(--kbx-color-border)',
    baseline: 'var(--kbx-color-chart-line-subtle)',
    value: 'var(--kbx-color-foreground)',
    label: 'var(--kbx-color-foreground-subtle)',
    dotFill: 'var(--kbx-color-paper)',
}

// 인적자원 현황 쪽 — 표 → 분기별 종업원수(꺾은선) → 인당 매출액(막대 목록). 소블록 사이 40 = 블록 안 간격 32 + mt-2.
// 표는 늘 3개년 3줄 — 받지 못한 연도도 줄을 두고 값은 '-'(getHumanResourceYearRows, 연도 기준은 재무현황 연도).
// 그래프는 받은 데이터가 없으면 빈 상태(KbxChartBox)로 자리를 지킨다 — 한 쪽 높이가 바뀌지 않게.
const KbigxPrintActivityHumanResources = ({report}: PageProps) => {
    const yearRows = getHumanResourceYearRows(report.activityDetail.humanResources, report.companyStatus.finance.years)

    return (
        <KbxBlock title="인적자원 현황" unit="단위: 명, 천원" unitPosition="below">
            <KbxTable
                caption="인적자원 현황(단위: 명, 천원)"
                columns={[
                    {key: 'year', header: '기준년도', isRowHeader: true, className: 'w-1/7'},
                    {key: 'employees', header: '종업원수'},
                    {key: 'change', header: '전년대비 증감(율)', className: 'w-2/9'},
                    {key: 'hires', header: '입사자'},
                    {key: 'leavers', header: '퇴사자'},
                    {key: 'sales', header: '인당매출액'},
                ]}
                emptyText={KBX_NOT_APPLICABLE_TEXT}
                emptyClassName="bg-kbx-surface-subtle py-kbx-10"
                rows={yearRows.map(({year, row}) => ({
                    key: year,
                    // 값이 숫자가 아닌 칸은 '-'. 증감은 증감 인원 · 증감률이 모두 숫자일 때만 적는다.
                    cells: row
                        ? [
                              year,
                              formatOrEmpty(row.employees, kbxNumberFormat),
                              isKbxNumber(row.change) && isKbxNumber(row.changeRate) ? (
                                  <ChangeCell key="change" change={row.change} changeRate={row.changeRate} />
                              ) : (
                                  KBX_EMPTY_VALUE
                              ),
                              formatOrEmpty(row.hires, kbxNumberFormat),
                              formatOrEmpty(row.leavers, kbxNumberFormat),
                              formatOrEmpty(row.salesPerEmployee, kbxIntegerFormat), // 천원 단위 — 정수
                          ]
                        : [year, KBX_EMPTY_VALUE, KBX_EMPTY_VALUE, KBX_EMPTY_VALUE, KBX_EMPTY_VALUE, KBX_EMPTY_VALUE],
                }))}
            />
            <KbxSubBlock title="분기별 종업원수" className="mt-2">
                <KbxUnitBelow unit="단위: 명">
                    <KbxChartBox isEmpty={!report.activity.employees.length} emptyClassName="h-85">
                        <ValueLineChart
                            variant="medium"
                            data={report.activity.employees.map((item) => ({
                                id: item.label,
                                label: item.label,
                                value: item.value,
                            }))}
                            color="var(--kbx-color-purple-strong)"
                            colors={EMPLOYEE_CHART_COLORS}
                            ariaLabel="분기별 종업원수 추이"
                        />
                    </KbxChartBox>
                </KbxUnitBelow>
            </KbxSubBlock>
            <KbxSubBlock title="인당 매출액" className="mt-2">
                <KbxUnitBelow unit="단위: 천원">
                    {/* 값이 없으면 막대 세 줄 높이(240)의 빈 상태. */}
                    <KbxChartBox isEmpty={!report.activity.salesPerEmployee.length} emptyClassName="h-60">
                        <KbxSalesBarList items={report.activity.salesPerEmployee} />
                    </KbxChartBox>
                </KbxUnitBelow>
            </KbxSubBlock>
        </KbxBlock>
    )
}

// ── 활동성정보 2 — 에너지 사용 현황(전기 · 가스 — 표 · 한 줄 전체 꺾은선 · 범례) ──

// 구분(본사 · 공장 · 기타) 계열 색 — 재무비율진단 그래프와 같은 순서. 지금은 구분이 3개라 앞 3색만 쓴다.
const ENERGY_SERIES_COLORS = [
    'var(--kbx-color-navy)',
    'var(--kbx-color-blue)',
    'var(--kbx-color-purple)',
    'var(--kbx-color-mint)',
    'var(--kbx-color-orange)',
    'var(--kbx-color-red)',
    'var(--kbx-color-blue-light)',
] as const
const ENERGY_CHART_COLORS = {
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-border)',
    category: 'var(--kbx-color-foreground)',
    dotFill: 'var(--kbx-color-paper)',
}
// 에너지 그래프 — 쪽 본문 폭 1168 전체 · 높이 240. 높이를 바꾸면 빈 상태(h-60 = 240)도 같이 고친다.
const ENERGY_CHART_WIDTH = 1168
const ENERGY_CHART_HEIGHT = 240
// [프론트엔드 연동] 전기 · 가스 모두 kWh 로 적는다 — 가스 단위가 따로 오면 이 값을 데이터에서 받도록 바꾼다.
const ENERGY_UNIT = 'kWh'
const ENERGY_TOTAL_LABEL = '합계'
// 구분은 늘 본사 · 공장 · 기타 세 줄(+ 합계) — ENERGY_CATEGORIES(k-bigx-innovation-report.ts, 웹 보고서와 공용). 없는 구분은 '-'.
const formatEnergy = (value: number | undefined) =>
    isKbxNumber(value) ? kbxFixed2Format.format(value) : KBX_EMPTY_VALUE

// 에너지 한 묶음(전기 또는 가스) — 소제목 → 단위 → 표(구분 3줄 + 합계) → 꺾은선 → 범례.
// rows 는 KbigxPrintActivityEnergy 의 toYears(toEnergyYearRows) 로 3개년 · 세 구분에 맞춘 값이다(값 자리 순서 = years).
const EnergyGroup = ({
    title,
    years,
    rows,
    className,
}: {
    title: string
    years: readonly string[]
    rows: InnovationGrowthReport['activityDetail']['energy']['electricity']
    className?: string
}) => {
    const series = rows.map((row, index) => ({
        key: row.key,
        label: row.label,
        color: ENERGY_SERIES_COLORS[index % ENERGY_SERIES_COLORS.length],
    }))

    return (
        <KbxSubBlock title={title} className={className}>
            <KbxUnitBelow unit={`단위: ${ENERGY_UNIT}`}>
                <KbxTable
                    caption={`${title}(단위: ${ENERGY_UNIT})`}
                    columns={[
                        {key: 'label', header: '구분', isRowHeader: true, className: 'w-1/4'},
                        ...years.map((year) => ({key: year, header: year})),
                    ]}
                    rows={[
                        ...ENERGY_CATEGORIES.map((category) => {
                            const row = rows.find((item) => item.label === category)
                            return {
                                key: category,
                                cells: [category, ...years.map((_, index) => formatEnergy(row?.values[index]))],
                            }
                        }),
                        // 합계 줄 — 연도마다 값이 있는 구분만 더한다. 그 연도 값이 하나도 없으면 '-'.
                        {
                            key: 'total',
                            isTotal: true,
                            cells: [
                                ENERGY_TOTAL_LABEL,
                                ...years.map((_, index) => {
                                    const values = rows
                                        .filter((row) => ENERGY_CATEGORIES.some((category) => category === row.label))
                                        .map((row) => row.values[index])
                                        .filter(isKbxNumber)
                                    return values.length
                                        ? kbxFixed2Format.format(values.reduce((sum, value) => sum + value, 0))
                                        : KBX_EMPTY_VALUE
                                }),
                            ],
                        },
                    ]}
                />
            </KbxUnitBelow>
            {/* 받은 구분이 하나도 없으면 그래프 자리에 높이 240 의 빈 상태. */}
            <KbxChartBox isEmpty={!rows.length} emptyClassName="h-60">
                <div className="flex flex-col gap-2.5">
                    <MarkerLineChart
                        width={ENERGY_CHART_WIDTH}
                        height={ENERGY_CHART_HEIGHT}
                        ariaLabel={`연도별 사업장 ${title}`}
                        data={years.map((year, index) => ({
                            id: year,
                            label: year,
                            values: Object.fromEntries(rows.map((row) => [row.key, row.values[index]])),
                        }))}
                        series={series}
                        colors={ENERGY_CHART_COLORS}
                        formatValue={(value) => kbxFixed2Format.format(value)}
                    />
                    <MarkerLineLegend
                        series={series}
                        dotFill={ENERGY_CHART_COLORS.dotFill}
                        className="kbx-text-16 text-kbx-foreground-subtle"
                    />
                </div>
            </KbxChartBox>
        </KbxSubBlock>
    )
}

// 에너지 사용 현황 쪽 — 전기 → 40 → 가스(블록 안 간격 32 + mt-2).
const KbigxPrintActivityEnergy = ({report}: PageProps) => {
    const {years: receivedYears, electricity, gas} = report.activityDetail.energy
    // 연도는 늘 최근 3개년 — 받은 연도가 없으면 재무현황 연도를 쓴다. 받지 못한 연도 값은 '-'(그래프는 그 점을 비운다).
    const years = getRecentYears(receivedYears, report.companyStatus.finance.years)
    // 받은 줄을 본사 · 공장 · 기타 순으로 골라 values 를 years 순서로 다시 맞춘다(없는 연도 = NaN). 표 · 그래프가 같이 쓴다.
    const toYears = (rows: typeof electricity) => toEnergyYearRows(rows, receivedYears, years)

    return (
        <KbxBlock title="에너지 사용 현황">
            <EnergyGroup title="전기 사용량" years={years} rows={toYears(electricity)} />
            <EnergyGroup title="가스 사용량" years={years} rows={toYears(gas)} className="mt-2" />
        </KbxBlock>
    )
}

export {KbigxPrintActivityEnergy, KbigxPrintActivityHumanResources}
