'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, RadialBar, RadialBarChart} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type ScoreBenchmarkData = {
    benchmarkLabel: string
    benchmarkPercentage: number
    score: number
    scoreLabel: string
    statusLabel: string
    summary: string
    tone: ScoreBenchmarkTone
}

type ScoreBenchmarkTone = 'caution' | 'danger' | 'positive' | 'strong'

type ScoreBenchmarkChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: ScoreBenchmarkData
    ariaLabel: string
}

const TONE_COLORS: Record<ScoreBenchmarkTone, string> = {
    strong: 'var(--ds-info)',
    positive: 'var(--ds-success)',
    caution: 'var(--ds-warning)',
    danger: 'var(--ds-error)',
}

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value))

const ScoreBenchmarkChart = ({data, ariaLabel, className, ...props}: ScoreBenchmarkChartProps) => {
    const score = clampPercentage(data.score)
    const benchmarkPercentage = clampPercentage(data.benchmarkPercentage)
    const keyColor = TONE_COLORS[data.tone]
    const chartConfig: ChartConfig = {score: {label: data.scoreLabel, color: keyColor}}
    const chartData = [{name: 'score', score, fill: 'var(--color-score)'}]

    return (
        <div {...props} className={cn('grid items-center gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]', className)}>
            <div className="relative mx-auto size-56 max-w-full">
                <ChartContainer config={chartConfig} className="aspect-square size-full" aria-label={ariaLabel}>
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius="70%"
                        outerRadius="100%"
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar dataKey="score" background={{fill: 'var(--ds-muted)'}} cornerRadius={999} />
                    </RadialBarChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex translate-y-2 flex-col items-center justify-center text-center leading-none">
                    <span className="text-foreground-subtle text-xs font-bold">{data.scoreLabel}</span>
                    <strong className="mt-1.5 text-4xl leading-none tabular-nums" style={{color: keyColor}}>
                        {score.toFixed(1)}
                    </strong>
                    <span className="typo-body-l-bold mt-2" style={{color: keyColor}}>
                        {data.statusLabel}
                    </span>
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
                <p
                    className="bg-muted text-foreground rounded-r-xl border-l-4 px-5 py-4 text-base leading-7"
                    style={{borderColor: keyColor}}
                >
                    {data.summary} {data.scoreLabel}는 <strong style={{color: keyColor}}>{score.toFixed(1)}점</strong>
                    이며 상태는 <strong style={{color: keyColor}}>{data.statusLabel}</strong>입니다.
                </p>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <span className="typo-body-m-regular text-foreground-subtle">{data.benchmarkLabel}</span>
                        <strong className="typo-title-m-bold" style={{color: keyColor}}>
                            상위 {benchmarkPercentage}%
                        </strong>
                    </div>
                    <div
                        role="progressbar"
                        aria-label={`${data.benchmarkLabel} 상위 비율`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={benchmarkPercentage}
                        className="bg-muted h-3 overflow-hidden rounded-full"
                    >
                        <div
                            className="h-full rounded-full"
                            style={{width: `${benchmarkPercentage}%`, backgroundColor: keyColor}}
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
                {data.scoreLabel} {score.toFixed(1)}점, 상태 {data.statusLabel}, {data.benchmarkLabel} 상위{' '}
                {benchmarkPercentage}%
            </p>
        </div>
    )
}

export {ScoreBenchmarkChart}
export type {ScoreBenchmarkChartProps, ScoreBenchmarkData, ScoreBenchmarkTone}
