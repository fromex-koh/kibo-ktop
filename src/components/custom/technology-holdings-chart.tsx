'use client'

import {useMemo, type ComponentPropsWithoutRef} from 'react'
import {Pie, PieChart, type PieLabelRenderProps} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type TechnologyHoldingItem = {
    id: string
    label: string
    percentage: number
    count: number
    color: string
}

type TechnologyHoldingsChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: TechnologyHoldingItem[]
    ariaLabel: string
}

const RADIAN = Math.PI / 180
const EXTERNAL_LABEL_THRESHOLD = 0.08

type LabelPosition = {
    side: -1 | 1
    normalizedY: number
}

const getLabelPositions = (data: TechnologyHoldingItem[]) => {
    const total = data.reduce((sum, item) => sum + Math.max(0, item.percentage), 0) || 1
    let accumulated = 0
    const positions = new Map<string, LabelPosition>()
    const sides: Record<'left' | 'right', Array<{id: string; desiredY: number}>> = {left: [], right: []}

    data.forEach((item) => {
        const angle = 90 - ((accumulated + Math.max(0, item.percentage) / 2) / total) * 360
        const shouldUseExternalLabel = Math.max(0, item.percentage) / total < EXTERNAL_LABEL_THRESHOLD

        if (shouldUseExternalLabel) {
            const side = Math.cos(-angle * RADIAN) >= 0 ? 'right' : 'left'
            sides[side].push({id: item.id, desiredY: Math.sin(-angle * RADIAN)})
        }
        accumulated += Math.max(0, item.percentage)
    })

    Object.entries(sides).forEach(([side, labels]) => {
        const sorted = labels.sort((a, b) => a.desiredY - b.desiredY)
        const edge = 0.82
        const availableHeight = edge * 2
        const minimumGap = Math.min(0.24, sorted.length > 1 ? availableHeight / (sorted.length - 1) : availableHeight)
        const adjusted = sorted.map(({desiredY}) => Math.max(-edge, Math.min(edge, desiredY)))

        for (let index = 1; index < adjusted.length; index += 1) {
            adjusted[index] = Math.max(adjusted[index], adjusted[index - 1] + minimumGap)
        }

        if (adjusted.at(-1)! > edge) {
            const overflow = adjusted.at(-1)! - edge
            for (let index = 0; index < adjusted.length; index += 1) adjusted[index] -= overflow
        }

        for (let index = adjusted.length - 2; index >= 0; index -= 1) {
            adjusted[index] = Math.min(adjusted[index], adjusted[index + 1] - minimumGap)
        }

        sorted.forEach(({id}, index) => {
            positions.set(id, {side: side === 'right' ? 1 : -1, normalizedY: adjusted[index]})
        })
    })

    return positions
}

const createExternalLabelRenderer = (positions: Map<string, LabelPosition>) => {
    return function TechnologyHoldingExternalLabel({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        payload,
    }: PieLabelRenderProps) {
        const centerX = Number(cx)
        const centerY = Number(cy)
        const angle = Number(midAngle)
        const inner = Number(innerRadius)
        const radius = Number(outerRadius)
        const id = typeof payload?.id === 'string' ? payload.id : ''
        const position = positions.get(id)
        const percentage = typeof payload?.percentage === 'number' ? payload.percentage : 0

        if (!position) {
            const labelRadius = inner + (radius - inner) / 2
            const labelX = centerX + labelRadius * Math.cos(-angle * RADIAN)
            const labelY = centerY + labelRadius * Math.sin(-angle * RADIAN)

            return (
                <text
                    className="technology-holding-value"
                    x={labelX}
                    y={labelY}
                    fill="var(--ds-foreground)"
                    stroke="var(--ds-background)"
                    strokeWidth={3}
                    paintOrder="stroke"
                    fontSize={11}
                    fontWeight={700}
                    dominantBaseline="central"
                    textAnchor="middle"
                    aria-hidden="true"
                >
                    {percentage}%
                </text>
            )
        }

        const horizontalDirection: -1 | 1 = Math.cos(-angle * RADIAN) >= 0 ? 1 : -1
        const normalizedY = position?.side === horizontalDirection ? position.normalizedY : Math.sin(-angle * RADIAN)
        const startX = centerX + (radius + 2) * Math.cos(-angle * RADIAN)
        const startY = centerY + (radius + 2) * Math.sin(-angle * RADIAN)
        const middleX = centerX + horizontalDirection * (radius + 14)
        const middleY = centerY + normalizedY * (radius + 36)
        const endX = centerX + horizontalDirection * (radius + 30)
        const dotX = endX + horizontalDirection * 3
        const labelX = dotX + horizontalDirection * 7
        const color = typeof payload?.fill === 'string' ? payload.fill : 'var(--ds-foreground-subtle)'

        return (
            <g className="technology-holding-label" aria-hidden="true">
                <polyline
                    points={`${startX},${startY} ${middleX},${middleY} ${endX},${middleY}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                />
                <circle cx={dotX} cy={middleY} r={3} fill={color} />
                <text
                    x={labelX}
                    y={middleY}
                    fill="var(--ds-foreground)"
                    fontSize={11}
                    fontWeight={700}
                    dominantBaseline="central"
                    textAnchor={horizontalDirection > 0 ? 'start' : 'end'}
                >
                    {percentage}%
                </text>
            </g>
        )
    }
}

const TechnologyHoldingsChart = ({data, ariaLabel, className, ...props}: TechnologyHoldingsChartProps) => {
    const config: ChartConfig = Object.fromEntries(data.map(({id, label, color}) => [id, {label, color}]))
    const chartData = data.map((item) => ({...item, fill: `var(--color-${item.id})`}))
    const labelPositions = useMemo(() => getLabelPositions(data), [data])

    return (
        <div
            {...props}
            className={cn('grid items-center gap-6 lg:grid-cols-[minmax(20rem,1fr)_minmax(15rem,1fr)]', className)}
        >
            <ChartContainer
                config={config}
                className="mx-auto aspect-square max-h-80 w-full [&_.recharts-sector]:cursor-pointer"
                aria-label={ariaLabel}
            >
                <PieChart accessibilityLayer>
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                hideLabel
                                hideIndicator
                                formatter={(_value, _name, item) => (
                                    <div>
                                        <p className="typo-body-l-bold">{item.payload.label}</p>
                                        <p className="typo-body-s-regular mt-1">
                                            비중 {item.payload.percentage}% · {item.payload.count}개
                                        </p>
                                    </div>
                                )}
                            />
                        }
                    />
                    <Pie
                        data={chartData}
                        dataKey="percentage"
                        nameKey="id"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius="38%"
                        outerRadius="56%"
                        paddingAngle={1}
                        cornerRadius={8}
                        label={createExternalLabelRenderer(labelPositions)}
                        labelLine={false}
                        stroke="var(--ds-background)"
                        strokeWidth={2}
                    />
                </PieChart>
            </ChartContainer>

            <ul className="typo-body-m-regular text-foreground-subtle flex min-w-0 flex-col gap-3">
                {data.map((item) => (
                    <li key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                        <span
                            className="size-2.5 rounded-full"
                            style={{backgroundColor: item.color}}
                            aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                        <span className="text-foreground whitespace-nowrap tabular-nums">
                            <strong>{item.percentage}%</strong> · {item.count}개
                        </span>
                    </li>
                ))}
            </ul>

            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}: 비중 {item.percentage}%, {item.count}개
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {TechnologyHoldingsChart}
export type {TechnologyHoldingItem, TechnologyHoldingsChartProps}
