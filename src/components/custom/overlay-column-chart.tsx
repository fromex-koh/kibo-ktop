'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis, type LabelProps} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {
    CELLS_DIVIDER_DASH,
    CELLS_GRID_STROKE,
    CELLS_LABEL_FILL,
    CELLS_LABEL_FONT_SIZE,
    CELLS_X_AXIS_HEIGHT,
    CELLS_X_TICK,
    CELLS_X_TICK_MARGIN,
    cellsBarDomain,
    cellsBottomLine,
    cellsDividerLines,
    cellsEdgeLines,
    cellsMinPointSize,
    formatCellsValue,
    renderCellsBarValueLabel,
} from '@/components/custom/chart-cells'

// 겹친 막대(OverlayColumnChart) — 항목마다 기준 값(예: 총자산 · 매출액)을 넓고 옅은 막대로 깔고, 그 앞에 세부 값
// (예: 부채총계 · 자본총계)을 좁은 막대로 세운다. 기준 대비 세부 값의 크기를 한 칸에서 견준다.
// K-BIGx 보고서 기업현황 "재무상태 · 손익현황" 카드에서 쓴다.
//
// 짜임: 오른쪽 위 16 사각 견본 범례 → 8 → 높이 200 칸 상자(chart-cells 공통 — 위 선 없음 · 바닥 · 양 끝 실선 · 항목 사이 점선)
//   → 항목 이름 12 Regular. 기준 막대 폭 96(위 모서리 8), 세부 막대 폭 24 · 사이 18(위 모서리 4)이며 모두 칸 가운데에 모인다.
//   값 글자는 막대마다 끝에서 4(11 Regular). 음수는 0 기준선 아래로 자라고 값 글자도 아래에 붙는다.
// 두 겹은 x축을 둘(기준 · 세부) 두어 그린다 — 같은 항목 순서라 두 축의 칸 가운데가 일치한다.
//
// [프론트엔드 연동] data 의 values 키는 base · series 의 key 와 같아야 한다(예: {totalAssets, liabilities, equity}).

type OverlayColumnSeries = {
    key: string
    label: string
    color: string
}

type OverlayColumnItem = {
    id: string
    label: string
    values: Record<string, number>
}

type OverlayColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: OverlayColumnItem[]
    /** 뒤에 깔리는 기준 값(넓고 옅은 막대). */
    base: OverlayColumnSeries
    /** 앞에 서는 세부 값(좁은 막대) — 순서대로 왼쪽부터. */
    series: OverlayColumnSeries[]
    showLegend?: boolean
    valueFractionDigits?: number
    unit?: string
    /** 막대가 자라는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
}

const BASE_BAR_SIZE = 96
const BASE_BAR_RADIUS = 8
const SERIES_BAR_SIZE = 24
const SERIES_BAR_GAP = 18
const SERIES_BAR_RADIUS = 4
// 항목 한 칸의 최소 폭 — 기준 막대(96)와 양옆 여백. 항목이 많아 칸이 이보다 좁아지면 그래프만 가로로 넘긴다
// (막대가 칸을 넘어 옆 칸과 겹치지 않게).
const MIN_CELL_WIDTH = 120
// 기준 값 글자와 세부 값 글자가 겹치지 않게 둘 세로 간격(글자 높이 11 + 여백).
const LABEL_STACK_GAP = 14
const LABEL_OFFSET = 4
const BASE_AXIS_ID = 'base'
const SERIES_AXIS_ID = 'series'

const OverlayColumnChart = ({
    ariaLabel,
    data,
    base,
    series,
    showLegend = true,
    valueFractionDigits = 0,
    unit,
    animate = true,
    className,
    ...props
}: OverlayColumnChartProps) => {
    const fractionDigits = Math.min(6, Math.max(0, valueFractionDigits))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const allSeries = [base, ...series]
    const config = Object.fromEntries(
        allSeries.map((item) => [item.key, {label: item.label, color: item.color}]),
    ) satisfies ChartConfig
    // id 는 숨김 표의 key 로만 쓴다 — 차트로 넘기면 그린 도형마다 같은 id 가 붙는다[8.1.1].
    const chartData = data.map((item) => ({label: item.label, ...item.values}))
    const values = data.flatMap((item) => allSeries.map(({key}) => item.values[key] ?? 0))
    const maximumValue = Math.max(0, ...values)
    const minimumValue = Math.min(0, ...values)
    const format = (value: number) => valueFormatter.format(value)
    const domain = cellsBarDomain(minimumValue, maximumValue)

    // 기준 값 글자 — 기본은 기준 막대 위. 세부 막대가 기준과 높이가 비슷하거나 더 높으면(부채가 자산을 넘는 등) 세부 값 글자와
    // 겹치거나 세부 막대 위에 얹히므로, 그때는 가장 높은 세부 값 글자 위로 올린다. 막대 높이(px)는 세로 범위와 그릴 자리
    // 높이로 계산한다.
    const renderBaseLabel = (labelProps: LabelProps) => {
        const {viewBox, parentViewBox, value, index = 0} = labelProps
        if (!viewBox || !('width' in viewBox) || !parentViewBox || !('height' in parentViewBox)) return null
        const {x, y, width, height} = viewBox
        const plotHeight = parentViewBox.height
        if (
            typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof width !== 'number' ||
            typeof height !== 'number' ||
            typeof plotHeight !== 'number'
        ) {
            return null
        }
        const numericValue = Number(value ?? 0)
        // 음수 기준 값은 공통 글자(막대 아래)로 그린다.
        if (numericValue < 0) return renderCellsBarValueLabel(labelProps, format)
        const pixelsPerUnit = plotHeight / (domain[1] - domain[0] || 1)
        const zeroY = y + height
        const baseTop = y
        const seriesTops = series
            .map(({key}) => data[index]?.values[key] ?? 0)
            .filter((seriesValue) => seriesValue >= 0)
            .map((seriesValue) => zeroY - seriesValue * pixelsPerUnit)
        const highestSeriesTop = seriesTops.length ? Math.min(...seriesTops) : Infinity
        // 세부 막대 끝이 기준 막대 끝보다 글자 한 줄 안쪽으로 가까우면(또는 더 높으면) 세부 값 글자 위로 올린다.
        const isCrowded = highestSeriesTop < baseTop + LABEL_STACK_GAP
        const stackedBaseline = isCrowded
            ? Math.min(baseTop, highestSeriesTop - LABEL_OFFSET - LABEL_STACK_GAP) - LABEL_OFFSET
            : baseTop - LABEL_OFFSET
        // 그릴 자리 위 끝 밖으로 나가지 않게 막는다 — 가장 큰 값이 78% 높이라 위 여백(약 44)에 글자 두 줄(세부 · 기준)이
        // 들어가지만, 높이를 줄여 쓰는 경우를 위해 한 번 더 막아 둔다.
        const plotTop = 'y' in parentViewBox && typeof parentViewBox.y === 'number' ? parentViewBox.y : 0
        const baseline = Math.max(stackedBaseline, plotTop + CELLS_LABEL_FONT_SIZE)

        return (
            <text
                x={x + width / 2}
                y={baseline}
                textAnchor="middle"
                fill={CELLS_LABEL_FILL}
                fontSize={CELLS_LABEL_FONT_SIZE}
            >
                {formatCellsValue(numericValue, format)}
            </text>
        )
    }

    return (
        <div {...props} className={cn('flex w-full flex-col gap-2', className)}>
            {showLegend ? (
                <ul className="typo-body-l-regular text-label-foreground flex flex-wrap justify-end gap-x-6 gap-y-2">
                    {allSeries.map((item) => (
                        <li key={item.key} className="flex items-center gap-2">
                            <span
                                className="size-4 shrink-0"
                                style={{backgroundColor: item.color}}
                                aria-hidden="true"
                            />
                            {item.label}
                        </li>
                    ))}
                </ul>
            ) : null}
            {/* 칸마다 기준 막대(96)가 들어가게 칸 폭 120 × 항목 수를 최소 폭으로 지키고, 모자라면 그래프만 가로로 넘긴다. */}
            <div className="w-full overflow-x-auto">
                <ChartContainer
                    config={config}
                    className="h-56.5 w-full"
                    style={{minWidth: data.length * MIN_CELL_WIDTH}}
                    role="img"
                    aria-label={ariaLabel}
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{top: 0, right: 1, bottom: 0, left: 1}}
                        barGap={SERIES_BAR_GAP}
                    >
                        <CartesianGrid
                            key="cells-solid"
                            xAxisId={SERIES_AXIS_ID}
                            stroke={CELLS_GRID_STROKE}
                            horizontalCoordinatesGenerator={cellsBottomLine}
                            verticalCoordinatesGenerator={cellsEdgeLines}
                        />
                        <CartesianGrid
                            key="cells-dashed"
                            xAxisId={SERIES_AXIS_ID}
                            stroke={CELLS_GRID_STROKE}
                            strokeDasharray={CELLS_DIVIDER_DASH}
                            horizontal={false}
                            verticalCoordinatesGenerator={cellsDividerLines(data.length)}
                        />
                        {/* 기준 막대용 축 — 숨겨도 기본 높이(30)만큼 아래 자리를 차지해 항목 이름 축을 그래프 밖으로 밀어내므로 높이를 0 으로 둔다. */}
                        <XAxis key="base-axis" xAxisId={BASE_AXIS_ID} dataKey="label" hide height={0} />
                        <XAxis
                            key="series-axis"
                            xAxisId={SERIES_AXIS_ID}
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={CELLS_X_TICK}
                            tickMargin={CELLS_X_TICK_MARGIN}
                            height={CELLS_X_AXIS_HEIGHT}
                            interval={0}
                        />
                        <YAxis key="y-axis" hide domain={domain} />
                        {minimumValue < 0 ? (
                            <ReferenceLine
                                key="zero"
                                xAxisId={SERIES_AXIS_ID}
                                y={0}
                                stroke="var(--ds-foreground-subtle)"
                            />
                        ) : null}
                        <Bar
                            key={base.key}
                            xAxisId={BASE_AXIS_ID}
                            dataKey={base.key}
                            fill={`var(--color-${base.key})`}
                            barSize={BASE_BAR_SIZE}
                            radius={[BASE_BAR_RADIUS, BASE_BAR_RADIUS, 0, 0]}
                            isAnimationActive={animate}
                            minPointSize={cellsMinPointSize}
                        >
                            <LabelList dataKey={base.key} content={renderBaseLabel} />
                        </Bar>
                        {series.map((item) => (
                            <Bar
                                key={item.key}
                                xAxisId={SERIES_AXIS_ID}
                                dataKey={item.key}
                                fill={`var(--color-${item.key})`}
                                barSize={SERIES_BAR_SIZE}
                                radius={[SERIES_BAR_RADIUS, SERIES_BAR_RADIUS, 0, 0]}
                                isAnimationActive={animate}
                                minPointSize={cellsMinPointSize}
                            >
                                <LabelList
                                    dataKey={item.key}
                                    content={(labelProps) => renderCellsBarValueLabel(labelProps, format)}
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </ChartContainer>
            </div>

            {/* 감추는 상자를 따로 둔다 — 표에 직접 sr-only 를 걸면 표가 제 폭만큼 자리를 차지해 문서가 가로로 넓어진다. */}
            <div className="sr-only">
                <table>
                    <caption>{ariaLabel}</caption>
                    <thead>
                        <tr>
                            <th scope="col">항목</th>
                            {allSeries.map((item) => (
                                <th key={item.key} scope="col">
                                    {item.label}
                                    {unit ? ` (${unit})` : ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <th scope="row">{item.label}</th>
                                {allSeries.map(({key}) => (
                                    <td key={key}>{valueFormatter.format(item.values[key] ?? 0)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {OverlayColumnChart}
export type {OverlayColumnChartProps, OverlayColumnItem, OverlayColumnSeries}
