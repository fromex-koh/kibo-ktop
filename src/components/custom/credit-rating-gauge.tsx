'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, RadialBar, RadialBarChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type CreditRatingData = {
    grade: string
    description: string
    score: number
    evaluationDate: string
    settlementDate: string
    tone: CreditRatingTone
}

type CreditRatingTone = 'caution' | 'danger' | 'excellent' | 'good' | 'normal'

type CreditRatingGaugeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: CreditRatingData
    ariaLabel: string
}

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value))

const CREDIT_RATING_COLORS: Record<CreditRatingTone, string> = {
    excellent: 'var(--ds-info)',
    good: 'var(--ds-primary)',
    normal: 'var(--ds-success)',
    caution: 'var(--ds-warning)',
    danger: 'var(--ds-error)',
}

const CreditRatingGauge = ({data, ariaLabel, className, ...props}: CreditRatingGaugeProps) => {
    const score = clampPercentage(data.score)
    const keyColor = CREDIT_RATING_COLORS[data.tone]
    const hasCompactGrade = data.grade.length >= 3
    const hasLongDescription = data.description.length >= 10
    const chartConfig: ChartConfig = {score: {label: '기업신용등급', color: keyColor}}
    const chartData = [{name: 'score', score, fill: 'var(--color-score)'}]

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
                                            <p className="typo-body-l-bold">기업신용등급 {data.grade}</p>
                                            <p className="typo-body-s-regular mt-1">
                                                {data.description} · 지수 {score}
                                            </p>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <RadialBar dataKey="score" background={{fill: 'var(--ds-muted)'}} cornerRadius={999} />
                    </RadialBarChart>
                </ChartContainer>

                <div
                    className={cn(
                        'pointer-events-none absolute inset-x-0 flex flex-col items-center text-center',
                        hasCompactGrade ? 'top-[34%]' : hasLongDescription ? 'top-[30%]' : 'top-[32%]',
                    )}
                >
                    <strong
                        className={cn(
                            'leading-none tabular-nums',
                            data.grade.length >= 4
                                ? 'text-3xl'
                                : data.grade.length >= 3 || hasLongDescription
                                  ? 'text-4xl'
                                  : 'text-5xl',
                        )}
                        style={{color: keyColor}}
                    >
                        {data.grade}
                    </strong>
                    <span
                        className={cn(
                            'typo-body-m-regular text-foreground-subtle max-w-28 leading-snug text-balance break-keep whitespace-normal',
                            hasCompactGrade ? 'mt-1' : hasLongDescription ? 'mt-2' : 'mt-3',
                        )}
                    >
                        {data.description}
                    </span>
                </div>
            </div>

            <dl className="typo-body-m-regular -mt-8 grid grid-cols-[auto_auto] gap-x-2 gap-y-2">
                <dt className="text-foreground-subtle">평가일자</dt>
                <dd className="text-foreground font-medium tabular-nums">
                    <time dateTime={data.evaluationDate}>{data.evaluationDate}</time>
                </dd>
                <dt className="text-foreground-subtle">결산일자</dt>
                <dd className="text-foreground font-medium tabular-nums">
                    <time dateTime={data.settlementDate}>{data.settlementDate}</time>
                </dd>
            </dl>

            <p className="sr-only">
                기업신용등급 {data.grade}, {data.description}, 지수 {score}, 평가일자 {data.evaluationDate}, 결산일자{' '}
                {data.settlementDate}
            </p>
        </div>
    )
}

export {CreditRatingGauge}
export type {CreditRatingData, CreditRatingGaugeProps, CreditRatingTone}
