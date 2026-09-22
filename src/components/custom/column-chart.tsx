'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, XAxis, YAxis} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {
    CELLS_DIVIDER_DASH,
    CELLS_GRID_STROKE,
    CELLS_MAX_VALUE_RATIO,
    CELLS_X_AXIS_HEIGHT,
    CELLS_X_TICK,
    CELLS_X_TICK_MARGIN,
    cellsBarDomain,
    cellsBottomLine,
    cellsDividerLines,
    cellsEdgeLines,
    cellsMinPointSize,
    renderCellsBarValueLabel,
} from '@/components/custom/chart-cells'
import {ChartTooltipRow} from '@/components/composite/chart-tooltip-parts'
import {chartTooltipClassName, chartTooltipTitleClassName} from '@/components/theme/chart-tooltip.variants'

type ColumnChartItem = {
    color?: string
    id: string
    label: string
    value: number
}

type ColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /** 막대 두께(px). 16~120 으로 맞춘다. */
    barWidth?: number
    color?: string
    data: ColumnChartItem[]
    showValueLabels?: boolean
    /** 값 위에 올렸을 때 뜨는 말풍선. 값이 막대 위에 모두 적혀 있는 보고서에서는 끈다. */
    showTooltip?: boolean
    /** 그리는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
    unit?: string
    /**
     * 모양. 'default' 는 y축 · 점선 눈금 · 위 모서리 12 둥근 막대다. 'cells' 는 K-BIGx 보고서 "인당 매출액" 카드 모양 —
     * 높이 200 칸 상자(위 선 없음 · 바닥 · 양 끝 실선 · 항목 사이 점선)에 위 모서리 8 둥근 막대, 값 11 Regular(gray.600),
     * 항목 이름 12 Regular(gray.700)이다. y축 · 가로 눈금 · 단위 글자는 없다(단위는 카드 머리에 둔다).
     */
    variant?: 'default' | 'cells'
    valueFractionDigits?: number
    yAxisStep?: number
    /**
     * cells: 세로 눈금의 기준 최댓값(예: 점수 100). 주면 이 값이 칸 높이의 78% 에 닿고, 값이 더 크면 그 값을 쓴다.
     * 여러 카드가 같은 눈금으로 견줘야 할 때(4대 혁신역량 점수) 쓴다 — 주지 않으면 카드마다 제 가장 큰 값이 78% 가 된다.
     */
    scaleMax?: number
    /**
     * cells: 가장 큰 값(또는 scaleMax)이 닿는 칸 높이 비율. 기본 0.78, 0.78~0.9 로 맞춘다 — 0.9 면 위에 값 글자 한 줄
     * (막대 끝 4 + 글자 11) 자리만 남는다. 칸형 막대 공통 비율을 바꾸지 않고 이 차트만 막대를 키울 때 쓴다.
     */
    maxValueRatio?: number
}

const numberFormatter = new Intl.NumberFormat('ko-KR')
// variant 'cells' — 막대 위 모서리 반경 8.
const CELLS_BAR_RADIUS = 8

const ColumnChart = ({
    data,
    barWidth = 56,
    color = 'var(--ds-chart-1)',
    showValueLabels = true,
    showTooltip = true,
    animate = true,
    unit,
    variant = 'default',
    valueFractionDigits = 0,
    yAxisStep,
    scaleMax,
    maxValueRatio = CELLS_MAX_VALUE_RATIO,
    ariaLabel,
    className,
    ...props
}: ColumnChartProps) => {
    const fractionDigits = Math.min(6, Math.max(0, valueFractionDigits))
    const normalizedBarWidth = Math.min(120, Math.max(16, barWidth))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const config = {
        value: {label: '값', color},
    } satisfies ChartConfig
    const isCells = variant === 'cells'
    const maximumValue = Math.max(0, ...data.map(({value}) => Math.max(0, value)))
    const minimumValue = Math.min(0, ...data.map(({value}) => Math.min(0, value)))
    const normalizedStep = yAxisStep && yAxisStep > 0 ? yAxisStep : undefined
    const yAxisMaximum = normalizedStep
        ? Math.max(normalizedStep, Math.ceil(maximumValue / normalizedStep) * normalizedStep)
        : undefined
    const yAxisTicks = normalizedStep
        ? Array.from({length: yAxisMaximum! / normalizedStep + 1}, (_, index) => index * normalizedStep)
        : undefined

    return (
        <div {...props} className={cn('w-full', className)}>
            <div className="relative w-full">
                {unit && !isCells ? (
                    <span className="typo-body-s-regular text-foreground absolute top-0 left-3 z-10" aria-hidden="true">
                        단위: {unit}
                    </span>
                ) : null}
                <ChartContainer
                    config={config}
                    className={cn(
                        'w-full min-w-0',
                        showTooltip && '[&_.recharts-rectangle]:cursor-pointer',
                        // cells: 칸 200 + 항목 이름 자리 26 = 226.
                        isCells ? 'h-56.5' : 'h-80',
                    )}
                    role="img"
                    aria-label={ariaLabel}
                >
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={
                            isCells ? {top: 0, right: 1, bottom: 0, left: 1} : {top: 40, right: 12, bottom: 8, left: 8}
                        }
                        // cells: 막대는 칸 폭의 80% 까지만 — 항목이 많아 칸이 barWidth 보다 좁아져도 옆 막대와 붙지 않는다.
                        barCategoryGap={isCells ? '20%' : '46%'}
                    >
                        {isCells ? (
                            // 칸 테두리 — 바닥선 · 양 끝 세로선은 실선, 항목 사이 세로선은 점선(위 선 없음).
                            <CartesianGrid
                                key="cells-solid"
                                stroke={CELLS_GRID_STROKE}
                                horizontalCoordinatesGenerator={cellsBottomLine}
                                verticalCoordinatesGenerator={cellsEdgeLines}
                            />
                        ) : null}
                        {isCells ? (
                            <CartesianGrid
                                key="cells-dashed"
                                stroke={CELLS_GRID_STROKE}
                                strokeDasharray={CELLS_DIVIDER_DASH}
                                horizontal={false}
                                verticalCoordinatesGenerator={cellsDividerLines(data.length)}
                            />
                        ) : (
                            <CartesianGrid
                                key="grid"
                                vertical={false}
                                stroke="var(--ds-subtle-2)"
                                strokeDasharray="4 4"
                                horizontalCoordinatesGenerator={({yAxis}) =>
                                    yAxisTicks
                                        ?.map((value) => yAxis?.scale?.map(value))
                                        .filter((coordinate): coordinate is number => typeof coordinate === 'number') ??
                                    []
                                }
                            />
                        )}
                        {isCells ? (
                            <XAxis
                                key="x-axis"
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tick={CELLS_X_TICK}
                                tickMargin={CELLS_X_TICK_MARGIN}
                                height={CELLS_X_AXIS_HEIGHT}
                                interval={0}
                            />
                        ) : (
                            <XAxis
                                key="x-axis"
                                dataKey="label"
                                tickLine={false}
                                axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                                tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                                tickMargin={10}
                                interval={0}
                            />
                        )}
                        {isCells ? (
                            <YAxis
                                key="y-axis"
                                hide
                                domain={cellsBarDomain(
                                    minimumValue,
                                    Math.max(maximumValue, Number.isFinite(scaleMax) ? (scaleMax ?? 0) : 0),
                                    maxValueRatio,
                                )}
                            />
                        ) : (
                            <YAxis
                                key="y-axis"
                                domain={[0, yAxisMaximum ?? (maximumValue === 0 ? 1 : 'auto')]}
                                ticks={yAxisTicks}
                                tickLine={false}
                                axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                                tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                                tickMargin={8}
                                tickFormatter={(value: number) => numberFormatter.format(value)}
                                width={72}
                            />
                        )}
                        {isCells && minimumValue < 0 ? (
                            // 음수가 있으면 0 기준선을 긋는다 — 막대가 위아래로 갈리는 자리.
                            <ReferenceLine key="zero" y={0} stroke="var(--ds-foreground-subtle)" />
                        ) : null}
                        {showTooltip ? (
                            <ChartTooltip
                                key="tooltip"
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        className={chartTooltipClassName}
                                        labelClassName={chartTooltipTitleClassName}
                                        hideIndicator
                                        labelKey="label"
                                        formatter={(value, _name, item) => {
                                            const itemColor =
                                                typeof item.payload?.color === 'string' ? item.payload.color : color

                                            return (
                                                <ChartTooltipRow
                                                    color={itemColor}
                                                    value={`${valueFormatter.format(Number(value))}${unit ? ` ${unit}` : ''}`}
                                                />
                                            )
                                        }}
                                    />
                                }
                            />
                        ) : null}
                        <Bar
                            key="bar"
                            dataKey="value"
                            name="value"
                            isAnimationActive={animate}
                            fill="var(--color-value)"
                            radius={isCells ? [CELLS_BAR_RADIUS, CELLS_BAR_RADIUS, 0, 0] : [12, 12, 0, 0]}
                            barSize={isCells ? undefined : normalizedBarWidth}
                            maxBarSize={isCells ? normalizedBarWidth : undefined}
                            // cells: 0 · 아주 작은 값도 막대 자리(와 값 글자)를 남긴다(chart-cells).
                            minPointSize={isCells ? cellsMinPointSize : undefined}
                            activeBar={showTooltip && {filter: 'brightness(0.82)'}}
                        >
                            {data.map((item) => (
                                <Cell key={item.id} fill={item.color ?? color} />
                            ))}
                            {showValueLabels && isCells ? (
                                <LabelList
                                    dataKey="value"
                                    content={(labelProps) =>
                                        renderCellsBarValueLabel(labelProps, (value) => valueFormatter.format(value), {
                                            count: data.length,
                                            values: data.map((item) => item.value),
                                        })
                                    }
                                />
                            ) : null}
                            {showValueLabels && !isCells ? (
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    fill="var(--ds-foreground)"
                                    fontSize={11}
                                    fontWeight={600}
                                    formatter={(value) => valueFormatter.format(Number(value ?? 0))}
                                />
                            ) : null}
                        </Bar>
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
                            <th scope="col">값{unit ? ` (${unit})` : ''}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <th scope="row">{item.label}</th>
                                <td>{valueFormatter.format(item.value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {ColumnChart}
export type {ColumnChartItem, ColumnChartProps}
