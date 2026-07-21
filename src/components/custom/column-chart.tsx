'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type ColumnChartItem = {
    color?: string
    id: string
    label: string
    value: number
}

type ColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    barWidth?: number
    color?: string
    data: ColumnChartItem[]
    showValueLabels?: boolean
    unit?: string
    valueFractionDigits?: number
    yAxisStep?: number
}

const numberFormatter = new Intl.NumberFormat('ko-KR')

const ColumnChart = ({
    data,
    barWidth = 56,
    color = 'var(--ds-chart-1)',
    showValueLabels = true,
    unit,
    valueFractionDigits = 0,
    yAxisStep,
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
    const maximumValue = Math.max(0, ...data.map(({value}) => Math.max(0, value)))
    const normalizedStep = yAxisStep && yAxisStep > 0 ? yAxisStep : undefined
    const yAxisMaximum = normalizedStep
        ? Math.max(normalizedStep, Math.ceil(maximumValue / normalizedStep) * normalizedStep)
        : undefined
    const yAxisTicks = normalizedStep
        ? Array.from({length: yAxisMaximum! / normalizedStep + 1}, (_, index) => index * normalizedStep)
        : undefined

    return (
        <div {...props} className={cn('w-full', className)}>
            <div className="relative w-full overflow-x-auto">
                {unit ? (
                    <span className="typo-body-s-regular text-foreground absolute top-0 left-3 z-10" aria-hidden="true">
                        단위: {unit}
                    </span>
                ) : null}
                <ChartContainer
                    config={config}
                    className="h-80 w-full min-w-120 sm:min-w-0 [&_.recharts-rectangle]:cursor-pointer"
                    aria-label={ariaLabel}
                >
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{top: 40, right: 12, bottom: 8, left: 8}}
                        barCategoryGap="46%"
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
                            width={72}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideIndicator
                                    labelKey="label"
                                    formatter={(value, _name, item) => {
                                        const itemColor =
                                            typeof item.payload?.color === 'string' ? item.payload.color : color

                                        return (
                                            <div className="flex w-full items-center gap-1.5">
                                                <span className="flex items-center gap-1.5">
                                                    <span
                                                        className="size-2.5 shrink-0 rounded-full"
                                                        style={{backgroundColor: itemColor}}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <strong className="text-foreground tabular-nums">
                                                    {valueFormatter.format(Number(value))}
                                                    {unit ? ` ${unit}` : ''}
                                                </strong>
                                            </div>
                                        )
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey="value"
                            name="value"
                            fill="var(--color-value)"
                            radius={[12, 12, 0, 0]}
                            barSize={normalizedBarWidth}
                            activeBar={{filter: 'brightness(0.82)'}}
                        >
                            {data.map((item) => (
                                <Cell key={item.id} fill={item.color ?? color} />
                            ))}
                            {showValueLabels ? (
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

            <table className="sr-only">
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
    )
}

export {ColumnChart}
export type {ColumnChartItem, ColumnChartProps}
