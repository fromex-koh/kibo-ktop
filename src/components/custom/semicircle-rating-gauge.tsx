'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, RadialBar, RadialBarChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type RatingGaugeDetail = {
    label: string
    value: string
}

type SemicircleRatingData = {
    description: string
    details: RatingGaugeDetail[]
    label: string
    percentage: number
    tone: RatingGaugeTone
}

type RatingGaugeTone = 'caution' | 'danger' | 'excellent' | 'good' | 'normal'

type SemicircleRatingGaugeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: SemicircleRatingData
    title: string
}

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value))

const RATING_COLORS: Record<RatingGaugeTone, string> = {
    excellent: 'var(--ds-info)',
    good: 'var(--ds-primary)',
    normal: 'var(--ds-success)',
    caution: 'var(--ds-warning)',
    danger: 'var(--ds-error)',
}

const SemicircleRatingGauge = ({data, title, ariaLabel, className, ...props}: SemicircleRatingGaugeProps) => {
    const percentage = clampPercentage(data.percentage)
    const keyColor = RATING_COLORS[data.tone]
    const hasCompactLabel = data.label.length >= 3
    const hasLongDescription = data.description.length >= 10
    const chartConfig: ChartConfig = {percentage: {label: title, color: keyColor}}
    const chartData = [{name: 'percentage', percentage, fill: 'var(--color-percentage)'}]

    return (
        <div {...props} className={cn('mx-auto flex w-full max-w-md flex-col items-center', className)}>
            <div className="relative h-52 w-88 max-w-full overflow-visible">
                <ChartContainer
                    config={chartConfig}
                    className="relative h-full w-full overflow-visible [&_.recharts-radial-bar-sector]:cursor-pointer [&_.recharts-tooltip-wrapper]:!z-50"
                    aria-label={ariaLabel}
                >
                    <RadialBarChart
                        accessibilityLayer
                        data={chartData}
                        cx="50%"
                        cy="58%"
                        startAngle={190}
                        endAngle={-10}
                        innerRadius="70%"
                        outerRadius="92%"
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    className="relative z-50"
                                    hideLabel
                                    hideIndicator
                                    formatter={() => (
                                        <div>
                                            <p className="typo-body-l-bold">
                                                {title} {data.label}
                                            </p>
                                            <p className="typo-body-s-regular mt-1">
                                                {data.description} · 표시 비율 {percentage}%
                                            </p>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <RadialBar dataKey="percentage" background={{fill: 'var(--ds-muted)'}} cornerRadius={999} />
                    </RadialBarChart>
                </ChartContainer>

                <div
                    className={cn(
                        'pointer-events-none absolute inset-x-0 flex flex-col items-center text-center',
                        hasCompactLabel ? 'top-[34%]' : hasLongDescription ? 'top-[30%]' : 'top-[32%]',
                    )}
                >
                    <strong
                        className={cn(
                            'leading-none tabular-nums',
                            data.label.length >= 4
                                ? 'text-3xl'
                                : data.label.length >= 3 || hasLongDescription
                                  ? 'text-4xl'
                                  : 'text-5xl',
                        )}
                        style={{color: keyColor}}
                    >
                        {data.label}
                    </strong>
                    <span
                        className={cn(
                            'typo-body-m-regular text-foreground-subtle max-w-28 leading-snug text-balance break-keep whitespace-normal',
                            hasCompactLabel ? 'mt-1' : hasLongDescription ? 'mt-2' : 'mt-3',
                        )}
                    >
                        {data.description}
                    </span>
                </div>
            </div>

            <dl className="typo-body-m-regular -mt-8 grid grid-cols-[auto_auto] gap-x-2 gap-y-2">
                {data.details.map((detail) => (
                    <div key={detail.label} className="contents">
                        <dt className="text-foreground-subtle">{detail.label}</dt>
                        <dd className="text-foreground font-medium tabular-nums">{detail.value}</dd>
                    </div>
                ))}
            </dl>

            <p className="sr-only">
                {title} {data.label}, {data.description}, 표시 비율 {percentage}%,{' '}
                {data.details.map(({label, value}) => `${label} ${value}`).join(', ')}
            </p>
        </div>
    )
}

export {SemicircleRatingGauge}
export type {RatingGaugeDetail, RatingGaugeTone, SemicircleRatingData, SemicircleRatingGaugeProps}
