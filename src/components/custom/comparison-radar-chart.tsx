'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type ComparisonRadarItem = {
    id: string
    label: string
    primaryValue: number
    /** 비교 대상 값. 비교 없이 한 계열만 그릴 때는 비운다. */
    comparisonValue?: number
}

type ComparisonRadarChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /**
     * 다각형이 가운데에서 펼쳐지는 움직임. 인쇄용 문서처럼 그린 즉시 그대로 찍혀야 하는 곳에서는 끈다 —
     * 켜 두면 펼쳐지는 도중에 인쇄돼 다각형이 덜 자란 채로 남을 수 있다.
     */
    animate?: boolean
    ariaLabel: string
    /** 비교 계열의 이름. 주면 점선 계열이 함께 그려지고, 주지 않으면 주 계열만 그린다. */
    comparisonLabel?: string
    data: ComparisonRadarItem[]
    /** 다각형 중심의 세로 위치. 숫자는 px, 문자열은 비율('50%')이다. 기본은 그릴 자리의 한가운데다. */
    centerY?: number | string
    /** 차트가 앉는 자리의 여백. */
    margin?: {top?: number; right?: number; bottom?: number; left?: number}
    /** 다각형의 반지름. 숫자는 px, 문자열은 그릴 자리 대비 비율('72%')이다. */
    outerRadius?: number | string
    primaryLabel: string
    /** 격자 고리 수. */
    ringCount?: number
    /** 축 이름의 글자 크기·굵기. */
    tickFontSize?: number
    tickFontWeight?: number
    /** 꼭짓점의 점. 값이 몇인지 표로 따로 보여 줄 때는 끈다. */
    showDots?: boolean
    /** 차트 위 범례. 계열이 하나뿐이라 범례가 필요 없을 때 끈다. */
    showLegend?: boolean
    /**
     * 값 위에 올렸을 때 뜨는 말풍선. 끄면 호버 때 나타나는 강조점도 함께 사라진다 —
     * 인쇄용 문서처럼 손이 닿지 않는 자리에서는 둘 다 필요 없다.
     */
    showTooltip?: boolean
}

const clampScore = (value: number) => Math.min(100, Math.max(0, value))
const RADAR_DOT_RADIUS = 5

const DEFAULT_RADAR_MARGIN = {top: 20, right: 48, bottom: 20, left: 48}

const ComparisonRadarChart = ({
    animate = true,
    data,
    primaryLabel,
    comparisonLabel,
    centerY,
    margin = DEFAULT_RADAR_MARGIN,
    outerRadius = '72%',
    ringCount = 5,
    tickFontSize = 12,
    tickFontWeight = 600,
    showDots = true,
    showLegend = true,
    showTooltip = true,
    ariaLabel,
    className,
    ...props
}: ComparisonRadarChartProps) => {
    // 비교 계열은 이름이 있을 때만 그린다 — 값만 있고 이름이 없으면 범례에 쓸 말이 없다.
    const hasComparison = Boolean(comparisonLabel)
    const chartConfig = {
        primaryValue: {label: primaryLabel, color: 'var(--ds-chart-1)'},
        comparisonValue: {label: comparisonLabel ?? '', color: 'var(--ds-chart-5)'},
    } satisfies ChartConfig
    // recharts 는 자료 한 줄의 속성을 그린 도형에 그대로 옮긴다 — id 를 담아 보내면 배경 막대·계열 막대가
    // 모두 같은 id 를 달아 문서에 같은 id 가 여러 번 생긴다[8.1.1]. id 는 아래 숨김 표의 key 로만 쓰므로
    // 차트로는 넘기지 않는다.
    const chartData = data.map((item) => ({
        label: item.label,
        primaryValue: clampScore(item.primaryValue),
        comparisonValue: clampScore(item.comparisonValue ?? 0),
    }))

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            {showLegend ? (
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
                    {hasComparison ? (
                        <span className="flex items-center gap-1.5">
                            <span
                                className="size-3 border-2 border-dashed"
                                style={{borderColor: 'var(--ds-chart-5)'}}
                                aria-hidden="true"
                            />
                            {comparisonLabel}
                        </span>
                    ) : null}
                </div>
            ) : null}

            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-96 min-h-72 w-full max-w-xl [&_.recharts-polygon]:cursor-pointer"
                role="img"
                aria-label={ariaLabel}
            >
                <RadarChart accessibilityLayer data={chartData} cy={centerY} outerRadius={outerRadius} margin={margin}>
                    <PolarGrid key="grid" gridType="polygon" stroke="var(--ds-subtle-2)" />
                    <PolarAngleAxis
                        key="angle-axis"
                        dataKey="label"
                        tick={{fill: 'var(--ds-foreground)', fontSize: tickFontSize, fontWeight: tickFontWeight}}
                    />
                    <PolarRadiusAxis
                        key="radius-axis"
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                        tickCount={ringCount}
                    />
                    {showTooltip ? (
                        <ChartTooltip
                            key="tooltip"
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
                                                <strong className="text-foreground tabular-nums">
                                                    {Number(value)}
                                                </strong>
                                            </div>
                                        )
                                    }}
                                />
                            }
                        />
                    ) : null}
                    {hasComparison ? (
                        <Radar
                            key="comparison"
                            name="comparisonValue"
                            dataKey="comparisonValue"
                            isAnimationActive={animate}
                            activeDot={showTooltip}
                            stroke="var(--color-comparisonValue)"
                            strokeWidth={2}
                            strokeDasharray="5 4"
                            fill="transparent"
                            dot={
                                showDots && {
                                    r: RADAR_DOT_RADIUS,
                                    fill: 'var(--color-comparisonValue)',
                                    fillOpacity: 1,
                                    strokeWidth: 0,
                                }
                            }
                        />
                    ) : null}
                    <Radar
                        key="primary"
                        name="primaryValue"
                        dataKey="primaryValue"
                        isAnimationActive={animate}
                        activeDot={showTooltip}
                        stroke="var(--color-primaryValue)"
                        strokeWidth={2.5}
                        fill="var(--color-primaryValue)"
                        fillOpacity={0.16}
                        dot={
                            showDots && {
                                r: RADAR_DOT_RADIUS,
                                fill: 'var(--color-primaryValue)',
                                fillOpacity: 1,
                                strokeWidth: 0,
                            }
                        }
                    />
                </RadarChart>
            </ChartContainer>

            <table className="sr-only">
                <caption>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">평가지표</th>
                        <th scope="col">{primaryLabel}</th>
                        {hasComparison ? <th scope="col">{comparisonLabel}</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <th scope="row">{item.label}</th>
                            <td>{clampScore(item.primaryValue)}</td>
                            {hasComparison ? <td>{clampScore(item.comparisonValue ?? 0)}</td> : null}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {ComparisonRadarChart}
export type {ComparisonRadarChartProps, ComparisonRadarItem}
