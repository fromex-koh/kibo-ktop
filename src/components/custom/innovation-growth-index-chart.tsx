'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, RadialBar, RadialBarChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type InnovationGrowthIndexData = {
    score: number
    grade: InnovationGrowthGrade
    topPercentage: number
    comparisonLabel: string
}

type InnovationGrowthGrade = '양호' | '우수' | '위험' | '주의'

type InnovationGrowthIndexChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: InnovationGrowthIndexData
    ariaLabel: string
}

const GRADE_COLORS: Record<InnovationGrowthGrade, string> = {
    우수: 'var(--ds-info)',
    양호: 'var(--ds-success)',
    주의: 'var(--ds-warning)',
    위험: 'var(--ds-error)',
}

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value))

const InnovationGrowthIndexChart = ({data, ariaLabel, className, ...props}: InnovationGrowthIndexChartProps) => {
    const score = clampPercentage(data.score)
    const topPercentage = clampPercentage(data.topPercentage)
    const keyColor = GRADE_COLORS[data.grade]
    const chartConfig: ChartConfig = {score: {label: 'Tech-Index', color: keyColor}}
    const chartData = [{name: 'score', score, fill: 'var(--color-score)'}]

    return (
        <div {...props} className={cn('grid items-center gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]', className)}>
            <div className="relative mx-auto size-60 max-w-full">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square size-full [&_.recharts-radial-bar-sector]:cursor-pointer"
                    aria-label={ariaLabel}
                >
                    <RadialBarChart
                        accessibilityLayer
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius="70%"
                        outerRadius="100%"
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    hideIndicator
                                    formatter={() => (
                                        <div>
                                            <p className="typo-body-l-bold">Tech-Index</p>
                                            <p className="typo-body-s-regular mt-1">
                                                {score.toFixed(1)}점 · {data.grade}
                                            </p>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <RadialBar dataKey="score" background={{fill: 'var(--ds-muted)'}} cornerRadius={999} />
                    </RadialBarChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-foreground-subtle text-xs font-bold">TECH-INDEX SCORE</span>
                    <strong className="mt-1 text-5xl leading-none tabular-nums" style={{color: keyColor}}>
                        {score.toFixed(1)}
                    </strong>
                    <span className="typo-body-m-bold mt-2" style={{color: keyColor}}>
                        {data.grade}
                    </span>
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
                <p
                    className="bg-muted text-foreground rounded-r-xl border-l-4 px-5 py-4 text-base leading-7"
                    style={{borderColor: keyColor}}
                >
                    인프라, 투입, 활동, 성과 부문별 전문가검증 혁신성장역량 평가 결과, Tech-Index는{' '}
                    <strong style={{color: keyColor}}>{score.toFixed(1)}점</strong>으로 진단되었으며 등급은{' '}
                    <strong style={{color: keyColor}}>{data.grade}</strong>입니다.
                </p>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <span className="typo-body-m-regular text-foreground-subtle">{data.comparisonLabel}</span>
                        <strong className="typo-title-m-bold" style={{color: keyColor}}>
                            상위 {topPercentage}%
                        </strong>
                    </div>
                    <div
                        role="progressbar"
                        aria-label={`${data.comparisonLabel} 상위 비율`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={topPercentage}
                        className="bg-muted h-3 overflow-hidden rounded-full"
                    >
                        <div
                            className="h-full rounded-full"
                            style={{width: `${topPercentage}%`, backgroundColor: keyColor}}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="typo-body-s-regular text-foreground-subtle flex justify-between tabular-nums">
                        <span>상위 0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            <p className="sr-only">
                Tech-Index {score.toFixed(1)}점, 진단 등급 {data.grade}, {data.comparisonLabel} 상위 {topPercentage}%
            </p>
        </div>
    )
}

export {InnovationGrowthIndexChart}
export type {InnovationGrowthGrade, InnovationGrowthIndexChartProps, InnovationGrowthIndexData}
