'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Area, CartesianGrid, ComposedChart, LabelList, Line, XAxis, YAxis} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type LineChartSeries = {
    color: string
    key: string
    label: string
}

type LineChartItem = {
    id: string
    label: string
    values: Record<string, number>
}

type LineChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    axisValueSuffix?: string
    curveType?: 'linear' | 'monotone'
    data: LineChartItem[]
    series: LineChartSeries[]
    showLegend?: boolean
    showValueLabels?: boolean
    unit?: string
    valueFractionDigits?: number
    variant?: 'area' | 'line'
    yAxisDomain?: [number, number]
    yAxisStep?: number
}

const LineChart = ({
    data,
    series,
    showLegend = true,
    showValueLabels = false,
    unit,
    axisValueSuffix = '',
    curveType = 'linear',
    valueFractionDigits = 0,
    variant = 'line',
    yAxisDomain,
    yAxisStep,
    ariaLabel,
    className,
    ...props
}: LineChartProps) => {
    const fractionDigits = Math.min(6, Math.max(0, valueFractionDigits))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const config = Object.fromEntries(
        series.map((item) => [item.key, {label: item.label, color: item.color}]),
    ) satisfies ChartConfig
    const chartData = data.map((item) => ({id: item.id, label: item.label, ...item.values}))
    const values = data.flatMap((item) => series.map(({key}) => item.values[key] ?? 0))
    const minimumValue = Math.min(0, ...values)
    const maximumValue = Math.max(0, ...values)
    const normalizedStep = yAxisStep && yAxisStep > 0 ? yAxisStep : undefined
    const calculatedMinimum = normalizedStep ? Math.floor(minimumValue / normalizedStep) * normalizedStep : minimumValue
    const calculatedMaximum = normalizedStep
        ? Math.max(normalizedStep, Math.ceil(maximumValue / normalizedStep) * normalizedStep)
        : maximumValue || 1
    const domainMinimum = yAxisDomain?.[0] ?? calculatedMinimum
    const domainMaximum = yAxisDomain?.[1] ?? calculatedMaximum
    const yAxisTicks = normalizedStep
        ? Array.from(
              {length: Math.floor((domainMaximum - domainMinimum) / normalizedStep) + 1},
              (_, index) => domainMinimum + index * normalizedStep,
          )
        : undefined

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            <div className="relative w-full overflow-x-auto">
                {unit ? (
                    <span className="typo-body-s-regular text-foreground absolute top-0 left-3 z-10" aria-hidden="true">
                        단위: {unit}
                    </span>
                ) : null}
                <ChartContainer
                    config={config}
                    className="h-80 w-full min-w-160 sm:min-w-0 [&_.recharts-dot]:cursor-pointer [&_.recharts-line-curve]:cursor-pointer"
                    aria-label={ariaLabel}
                >
                    <ComposedChart
                        accessibilityLayer
                        data={chartData}
                        margin={{top: 40, right: 16, bottom: 8, left: 8}}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="var(--ds-subtle-2)"
                            strokeDasharray="4 4"
                            horizontalCoordinatesGenerator={({yAxis}) =>
                                yAxisTicks
                                    ?.map((value) => yAxis?.scale?.map(value))
                                    .filter((coordinate): coordinate is number => typeof coordinate === 'number') ?? []
                            }
                        />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                            tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                            tickMargin={10}
                            interval={0}
                        />
                        <YAxis
                            domain={[domainMinimum, domainMaximum]}
                            ticks={yAxisTicks}
                            tickLine={false}
                            axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                            tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                            tickMargin={8}
                            tickFormatter={(value: number) => `${valueFormatter.format(value)}${axisValueSuffix}`}
                            width={64}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideIndicator
                                    labelKey="label"
                                    formatter={(value, name) => (
                                        <div className="flex w-full items-center justify-between gap-6">
                                            <span className="flex items-center gap-1.5">
                                                <span
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{backgroundColor: config[String(name)]?.color}}
                                                    aria-hidden="true"
                                                />
                                                {config[String(name)]?.label}
                                            </span>
                                            <strong className="text-foreground tabular-nums">
                                                {valueFormatter.format(Number(value))}
                                                {unit ? ` ${unit}` : ''}
                                            </strong>
                                        </div>
                                    )}
                                />
                            }
                        />
                        {series.map((item) => {
                            const labels = showValueLabels ? (
                                <LabelList
                                    dataKey={item.key}
                                    position="top"
                                    offset={12}
                                    fill="var(--ds-foreground)"
                                    fontSize={11}
                                    fontWeight={600}
                                    formatter={(value) => valueFormatter.format(Number(value ?? 0))}
                                />
                            ) : null

                            return variant === 'area' ? (
                                <Area
                                    key={item.key}
                                    type={curveType}
                                    dataKey={item.key}
                                    name={item.key}
                                    stroke={`var(--color-${item.key})`}
                                    strokeWidth={2.5}
                                    fill={`var(--color-${item.key})`}
                                    fillOpacity={0.1}
                                    dot={{
                                        r: 6,
                                        fill: 'var(--ds-background)',
                                        fillOpacity: 1,
                                        stroke: `var(--color-${item.key})`,
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: `var(--color-${item.key})`,
                                        fillOpacity: 1,
                                        strokeWidth: 0,
                                    }}
                                >
                                    {labels}
                                </Area>
                            ) : (
                                <Line
                                    key={item.key}
                                    type={curveType}
                                    dataKey={item.key}
                                    name={item.key}
                                    stroke={`var(--color-${item.key})`}
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 6,
                                        fill: 'var(--ds-background)',
                                        fillOpacity: 1,
                                        stroke: `var(--color-${item.key})`,
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: `var(--color-${item.key})`,
                                        fillOpacity: 1,
                                        strokeWidth: 0,
                                    }}
                                >
                                    {labels}
                                </Line>
                            )
                        })}
                    </ComposedChart>
                </ChartContainer>
            </div>

            {showLegend ? (
                <ul className="typo-body-s-regular text-foreground flex flex-wrap justify-center gap-x-5 gap-y-2">
                    {series.map((item) => (
                        <li key={item.key} className="flex items-center gap-1.5">
                            <span
                                className="size-3 rounded-full"
                                style={{backgroundColor: item.color}}
                                aria-hidden="true"
                            />
                            {item.label}
                        </li>
                    ))}
                </ul>
            ) : null}

            <table className="sr-only">
                <caption>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">기간</th>
                        {series.map((item) => (
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
                            {series.map(({key}) => (
                                <td key={key}>{valueFormatter.format(item.values[key] ?? 0)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {LineChart}
export type {LineChartItem, LineChartProps, LineChartSeries}
