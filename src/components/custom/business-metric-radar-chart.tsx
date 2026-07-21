'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type BusinessMetricRadarItem = {
    id: string
    metric: string
    company: number
    industryAverage: number
}

type BusinessMetricRadarChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: BusinessMetricRadarItem[]
}

const clampScore = (value: number) => Math.min(100, Math.max(0, value))
const RADAR_DOT_RADIUS = 5

const CHART_CONFIG = {
    company: {label: '조회기업', color: 'var(--ds-chart-1)'},
    industryAverage: {label: '업종평균', color: 'var(--ds-chart-5)'},
} satisfies ChartConfig

const BusinessMetricRadarChart = ({data, ariaLabel, className, ...props}: BusinessMetricRadarChartProps) => {
    const chartData = data.map((item) => ({
        ...item,
        company: clampScore(item.company),
        industryAverage: clampScore(item.industryAverage),
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
                    조회기업
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-3 border-2 border-dashed"
                        style={{borderColor: 'var(--ds-chart-5)'}}
                        aria-hidden="true"
                    />
                    업종평균
                </span>
            </div>

            <ChartContainer
                config={CHART_CONFIG}
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
                        dataKey="metric"
                        tick={{fill: 'var(--ds-foreground)', fontSize: 12, fontWeight: 600}}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} tickCount={6} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelKey="metric" />} />
                    <Radar
                        name="industryAverage"
                        dataKey="industryAverage"
                        stroke="var(--color-industryAverage)"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        fill="transparent"
                        dot={{
                            r: RADAR_DOT_RADIUS,
                            fill: 'var(--color-industryAverage)',
                            fillOpacity: 1,
                            strokeWidth: 0,
                        }}
                    />
                    <Radar
                        name="company"
                        dataKey="company"
                        stroke="var(--color-company)"
                        strokeWidth={2.5}
                        fill="var(--color-company)"
                        fillOpacity={0.16}
                        dot={{
                            r: RADAR_DOT_RADIUS,
                            fill: 'var(--color-company)',
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
                        <th scope="col">조회기업</th>
                        <th scope="col">업종평균</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((item) => (
                        <tr key={item.id}>
                            <th scope="row">{item.metric}</th>
                            <td>{item.company}</td>
                            <td>{item.industryAverage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {BusinessMetricRadarChart}
export type {BusinessMetricRadarChartProps, BusinessMetricRadarItem}
