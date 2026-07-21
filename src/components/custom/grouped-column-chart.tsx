'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type GroupedColumnSeries = {
    color: string
    key: string
    label: string
}

type GroupedColumnItem = {
    id: string
    label: string
    values: Record<string, number>
}

type GroupedColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: GroupedColumnItem[]
    series: GroupedColumnSeries[]
    showLegend?: boolean
    showValueLabels?: boolean
    unit?: string
    valueFractionDigits?: number
    yAxisStep?: number
}

const numberFormatter = new Intl.NumberFormat('ko-KR')

const GroupedColumnChart = ({
    data,
    series,
    showLegend = true,
    showValueLabels = false,
    unit,
    valueFractionDigits = 0,
    yAxisStep,
    ariaLabel,
    className,
    ...props
}: GroupedColumnChartProps) => {
    const fractionDigits = Math.min(6, Math.max(0, valueFractionDigits))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const config = Object.fromEntries(
        series.map((item) => [item.key, {label: item.label, color: item.color}]),
    ) satisfies ChartConfig
    const chartData = data.map((item) => ({id: item.id, label: item.label, ...item.values}))
    const maximumValue = Math.max(
        0,
        ...data.flatMap((item) => series.map(({key}) => Math.max(0, item.values[key] ?? 0))),
    )
    const normalizedStep = yAxisStep && yAxisStep > 0 ? yAxisStep : undefined
    const yAxisMaximum = normalizedStep
        ? Math.max(normalizedStep, Math.ceil(maximumValue / normalizedStep) * normalizedStep)
        : undefined
    const yAxisTicks = normalizedStep
        ? Array.from({length: yAxisMaximum! / normalizedStep + 1}, (_, index) => index * normalizedStep)
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
                    className="h-80 w-full min-w-160 sm:min-w-0 [&_.recharts-rectangle]:cursor-pointer"
                    aria-label={ariaLabel}
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{top: 40, right: 12, bottom: 8, left: 8}}
                        barCategoryGap="24%"
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
                            domain={[0, yAxisMaximum ?? (maximumValue === 0 ? 1 : 'auto')]}
                            ticks={yAxisTicks}
                            tickLine={false}
                            axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                            tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                            tickMargin={8}
                            tickFormatter={(value: number) => numberFormatter.format(value)}
                            width={64}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
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
                        {series.map((item) => (
                            <Bar
                                key={item.key}
                                dataKey={item.key}
                                name={item.key}
                                fill={`var(--color-${item.key})`}
                                activeBar={{
                                    fill: `color-mix(in srgb, var(--color-${item.key}) 78%, var(--ds-foreground))`,
                                }}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={32}
                            >
                                {showValueLabels ? (
                                    <LabelList
                                        dataKey={item.key}
                                        position="top"
                                        fill="var(--ds-foreground)"
                                        fontSize={11}
                                        fontWeight={600}
                                        formatter={(value) => valueFormatter.format(Number(value ?? 0))}
                                    />
                                ) : null}
                            </Bar>
                        ))}
                    </BarChart>
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
                        <th scope="col">항목</th>
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

export {GroupedColumnChart}
export type {GroupedColumnChartProps, GroupedColumnItem, GroupedColumnSeries}
