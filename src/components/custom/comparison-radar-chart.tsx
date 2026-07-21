'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type ComparisonRadarItem = {
    id: string
    label: string
    primaryValue: number
    comparisonValue: number
}

type ComparisonRadarChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    comparisonLabel: string
    data: ComparisonRadarItem[]
    primaryLabel: string
}

const clampScore = (value: number) => Math.min(100, Math.max(0, value))
const RADAR_DOT_RADIUS = 5

const ComparisonRadarChart = ({
    data,
    primaryLabel,
    comparisonLabel,
    ariaLabel,
    className,
    ...props
}: ComparisonRadarChartProps) => {
    const chartConfig = {
        primaryValue: {label: primaryLabel, color: 'var(--ds-chart-1)'},
        comparisonValue: {label: comparisonLabel, color: 'var(--ds-chart-5)'},
    } satisfies ChartConfig
    const chartData = data.map((item) => ({
        ...item,
        primaryValue: clampScore(item.primaryValue),
        comparisonValue: clampScore(item.comparisonValue),
    }))

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            <div className="typo-body-s-regular text-foreground-subtle flex flex-wrap justify-end gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-3 border-2"
                        style={{
                            borderColor: 'var(--ds-chart-1)',
                            backgroundColor: 'color-mix(in srgb, var(--ds-chart-1) 15%, transparent)',
                        }}
                        aria-hidden="true"
                    />
                    {primaryLabel}
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-3 border-2 border-dashed"
                        style={{borderColor: 'var(--ds-chart-5)'}}
                        aria-hidden="true"
                    />
                    {comparisonLabel}
                </span>
            </div>

            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-96 min-h-72 w-full max-w-xl [&_.recharts-polygon]:cursor-pointer"
                aria-label={ariaLabel}
            >
                <RadarChart
                    accessibilityLayer
                    data={chartData}
                    outerRadius="72%"
                    margin={{top: 20, right: 48, bottom: 20, left: 48}}
                >
                    <PolarGrid gridType="polygon" stroke="var(--ds-subtle-2)" />
                    <PolarAngleAxis
                        dataKey="label"
                        tick={{fill: 'var(--ds-foreground)', fontSize: 12, fontWeight: 600}}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} tickCount={6} />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                hideIndicator
                                labelKey="label"
                                formatter={(value, name) => {
                                    const item =
                                        name === 'primaryValue'
                                            ? chartConfig.primaryValue
                                            : name === 'comparisonValue'
                                              ? chartConfig.comparisonValue
                                              : undefined

                                    return (
                                        <div className="flex w-full items-center justify-between gap-6">
                                            <span className="flex items-center gap-1.5">
                                                <span
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{backgroundColor: item?.color}}
                                                    aria-hidden="true"
                                                />
                                                {item?.label}
                                            </span>
                                            <strong className="text-foreground tabular-nums">{Number(value)}</strong>
                                        </div>
                                    )
                                }}
                            />
                        }
                    />
                    <Radar
                        name="comparisonValue"
                        dataKey="comparisonValue"
                        stroke="var(--color-comparisonValue)"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        fill="transparent"
                        dot={{
                            r: RADAR_DOT_RADIUS,
                            fill: 'var(--color-comparisonValue)',
                            fillOpacity: 1,
                            strokeWidth: 0,
                        }}
                    />
                    <Radar
                        name="primaryValue"
                        dataKey="primaryValue"
                        stroke="var(--color-primaryValue)"
                        strokeWidth={2.5}
                        fill="var(--color-primaryValue)"
                        fillOpacity={0.16}
                        dot={{
                            r: RADAR_DOT_RADIUS,
                            fill: 'var(--color-primaryValue)',
                            fillOpacity: 1,
                            strokeWidth: 0,
                        }}
                    />
                </RadarChart>
            </ChartContainer>

            <table className="sr-only">
                <caption>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">평가지표</th>
                        <th scope="col">{primaryLabel}</th>
                        <th scope="col">{comparisonLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((item) => (
                        <tr key={item.id}>
                            <th scope="row">{item.label}</th>
                            <td>{item.primaryValue}</td>
                            <td>{item.comparisonValue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {ComparisonRadarChart}
export type {ComparisonRadarChartProps, ComparisonRadarItem}
