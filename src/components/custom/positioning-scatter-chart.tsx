'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Customized, ScatterChart, XAxis, YAxis, usePlotArea} from 'recharts'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

// 포지셔닝 산점도(PositioningScatterChart) — 가로·세로 두 축 위에 당사와 견줄 기업들을 점으로 흩어 놓고,
// 두 축이 모두 높은 오른쪽 위 구역을 옅게 칠한다.
// 투자모형 심층분석 리포트의 '성장·밸류업포지셔닝'에서 쓴다. 문서: /component-guide/positioning-scatter-chart
//
// [프론트엔드 연동] 점 하나는 {id, x, y} 다 — 당사 점에만 isPrimary 를 준다. 값의 범위는 xDomain·yDomain
// 으로 정하고(기본 0~100), 기준선(threshold)을 넘는 오른쪽 위가 옅게 칠해진다.
//
// 눈금·축선·말풍선은 두지 않는다(시안) — 값이 몇인지는 표가 따로 알리고, 여기서는 자리만 본다.

type PositioningScatterPoint = {
    id: string
    x: number
    y: number
    /** 당사 점. 진한 색에 지름이 크고 이름표가 붙는다 — 한 점에만 준다. */
    isPrimary?: boolean
}

type PositioningScatterChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    points: readonly PositioningScatterPoint[]
    /** 세로축 이름(상자 왼쪽 위). */
    yAxisLabel: string
    /** 가로축 이름(상자 오른쪽 아래). */
    xAxisLabel: string
    /** 당사 점 아래 이름표. */
    primaryLabel?: string
    /** 값의 범위. 점수가 아닌 값(금액 · 증감률)을 그대로 넘길 때 바꾼다. */
    xDomain?: [number, number]
    yDomain?: [number, number]
    /** 기준선 자리. 두 축 모두 이 값을 넘는 구역이 칠해진다. 주지 않으면 범위의 한가운데다. */
    threshold?: number
    /** 칸 높이 유틸리티. 종이에서도 같은 높이로 찍히도록 값으로 정해 둔다. */
    heightClassName?: string
    isLoading?: boolean
    loadingLabel?: string
}

// 표본 점 반지름(지름 12).
const PEER_DOT_RADIUS = 6
// 당사 점 반지름(지름 16) · 이름표 자리 — 시안은 점 바로 아래 2 에 12 글자다.
const PRIMARY_DOT_RADIUS = 8
const LABEL_GAP = 2
// 12 글자의 기준선 위 높이와 아래 높이(어림값) · 한 글자 폭.
const LABEL_ASCENT = 13
const LABEL_DESCENT = 4
const LABEL_CHAR_WIDTH = 12

// 그림은 한 겹에서 순서대로 그린다 — 사분면 음영 → 기준선 → 표본 점 → 당사 점과 이름표.
// recharts 의 ReferenceArea·Scatter 로 나눠 두면 음영이 점보다 나중에 그려져 점을 덮는다.
const ChartLayer = ({
    points,
    primaryLabel,
    xDomain,
    yDomain,
    xThreshold,
    yThreshold,
}: {
    points: readonly PositioningScatterPoint[]
    primaryLabel: string
    xDomain: [number, number]
    yDomain: [number, number]
    xThreshold: number
    yThreshold: number
}) => {
    const plot = usePlotArea()
    if (!plot) return null

    const toRatio = (value: number, [min, max]: [number, number]) =>
        Math.min(Math.max((value - min) / (max - min || 1), 0), 1)
    // 점은 늘 칸 안에 온전히 들어온다 — 끝에 붙은 값도 반지름만큼 안으로 당겨 반쪽만 보이지 않게 한다.
    const toX = (value: number, radius: number) =>
        Math.min(Math.max(plot.x + plot.width * toRatio(value, xDomain), plot.x + radius), plot.x + plot.width - radius)
    const toY = (value: number, radius: number) =>
        Math.min(
            Math.max(plot.y + plot.height * (1 - toRatio(value, yDomain)), plot.y + radius),
            plot.y + plot.height - radius,
        )
    const plotRight = plot.x + plot.width
    const plotBottom = plot.y + plot.height
    const thresholdX = plot.x + plot.width * toRatio(xThreshold, xDomain)
    const thresholdY = plot.y + plot.height * (1 - toRatio(yThreshold, yDomain))
    const primary = points.find((point) => point.isPrimary)

    // 이름표는 늘 칸 안에 둔다 — 점 아래가 기본이고, 자리가 없으면 위로 올린 뒤 그래도 넘치면 끝에 붙인다.
    const labelHalfWidth = (primaryLabel.length * LABEL_CHAR_WIDTH) / 2
    const primaryX = primary ? toX(primary.x, PRIMARY_DOT_RADIUS) : 0
    const primaryY = primary ? toY(primary.y, PRIMARY_DOT_RADIUS) : 0
    const belowBaseline = primaryY + PRIMARY_DOT_RADIUS + LABEL_GAP + LABEL_ASCENT
    const preferredBaseline =
        belowBaseline + LABEL_DESCENT <= plotBottom ? belowBaseline : primaryY - PRIMARY_DOT_RADIUS - LABEL_GAP
    const labelBaseline = Math.min(Math.max(preferredBaseline, plot.y + LABEL_ASCENT), plotBottom - LABEL_DESCENT)
    const labelX = Math.min(Math.max(primaryX, plot.x + labelHalfWidth), plotRight - labelHalfWidth)

    // 옅게 칠하는 구역은 당사 점이 선 분면이다 — 기준선이 나눈 네 칸 중 당사가 든 칸만 칠한다.
    // 당사 값이 없으면 두 축이 모두 높은 오른쪽 위를 칠한다.
    const isRightHalf = primary ? primary.x >= xThreshold : true
    const isTopHalf = primary ? primary.y >= yThreshold : true
    const quadrant = {
        x: isRightHalf ? thresholdX : plot.x,
        y: isTopHalf ? plot.y : thresholdY,
        width: isRightHalf ? plotRight - thresholdX : thresholdX - plot.x,
        height: isTopHalf ? thresholdY - plot.y : plotBottom - thresholdY,
    }

    return (
        <g>
            <rect
                x={quadrant.x}
                y={quadrant.y}
                width={quadrant.width}
                height={quadrant.height}
                fill="var(--raw-purple-50)"
            />
            <g stroke="var(--ds-navy-200)" strokeDasharray="4 4">
                <line x1={plot.x} x2={plotRight} y1={thresholdY} y2={thresholdY} />
                <line x1={thresholdX} x2={thresholdX} y1={plot.y} y2={plotBottom} />
            </g>
            {points
                .filter((point) => !point.isPrimary)
                .map((point) => (
                    <circle
                        key={point.id}
                        cx={toX(point.x, PEER_DOT_RADIUS)}
                        cy={toY(point.y, PEER_DOT_RADIUS)}
                        r={PEER_DOT_RADIUS}
                        fill="var(--ds-navy-200)"
                    />
                ))}
            {primary ? (
                <g>
                    <circle cx={primaryX} cy={primaryY} r={PRIMARY_DOT_RADIUS} fill="var(--raw-purple-600)" />
                    <text
                        x={labelX}
                        y={labelBaseline}
                        textAnchor="middle"
                        className="typo-caption-bold"
                        fill="var(--raw-purple-900)"
                    >
                        {primaryLabel}
                    </text>
                </g>
            ) : null}
        </g>
    )
}

const PositioningScatterChart = ({
    ariaLabel,
    points,
    yAxisLabel,
    xAxisLabel,
    primaryLabel = '당사',
    xDomain = [0, 100],
    yDomain = [0, 100],
    threshold,
    heightClassName = 'h-70',
    isLoading = false,
    loadingLabel = '포지셔닝 그래프를 불러오는 중입니다.',
    className,
    ...props
}: PositioningScatterChartProps) => {
    const isHydrated = useIsHydrated()

    // 새로고침 직후에는 차트가 칸의 폭을 재기 전이라 빈 칸으로 보인다 — 붙기 전까지 같은 스켈레톤을 보인다.
    if (isLoading || !isHydrated) {
        return (
            <ChartSkeleton
                {...props}
                type="positioning-scatter"
                label={loadingLabel}
                className={cn('w-full', className)}
            />
        )
    }

    const xThreshold = threshold ?? (xDomain[0] + xDomain[1]) / 2
    const yThreshold = threshold ?? (yDomain[0] + yDomain[1]) / 2
    const config = {
        peer: {label: '비교 기업', color: 'var(--ds-navy-200)'},
        primary: {label: primaryLabel, color: 'var(--raw-purple-600)'},
    } satisfies ChartConfig

    return (
        <figure {...props} className={cn('flex flex-col gap-1', className)}>
            <figcaption className="typo-caption-regular text-label-foreground">{yAxisLabel}</figcaption>
            <ChartContainer
                config={config}
                // 이름표가 칸 끝에 닿아도 잘리지 않게 한다 — 귀퉁이에 붙은 점에서 생긴다.
                // 테두리는 좌 · 우 · 아래만 그린다(시안) — 위는 열어 둔다.
                className={cn(
                    'border-subtle-3 w-full border-x border-b [&_.recharts-surface]:overflow-visible',
                    heightClassName,
                )}
                role="img"
                aria-label={ariaLabel}
            >
                {/* 여백을 두지 않는다(시안) — 사분면 음영과 기준선이 상자 가장자리까지 닿아야 한다. */}
                <ScatterChart margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                    {/* 눈금과 축선은 그리지 않는다 — 자리 계산에만 쓴다. 축 이름은 상자 밖에 글자로 둔다. */}
                    <XAxis type="number" dataKey="x" domain={xDomain} hide allowDataOverflow />
                    <YAxis type="number" dataKey="y" domain={yDomain} hide allowDataOverflow />
                    <Customized
                        component={() => (
                            <ChartLayer
                                points={points}
                                primaryLabel={primaryLabel}
                                xDomain={xDomain}
                                yDomain={yDomain}
                                xThreshold={xThreshold}
                                yThreshold={yThreshold}
                            />
                        )}
                    />
                </ScatterChart>
            </ChartContainer>
            <p className="typo-caption-regular text-label-foreground text-right">{xAxisLabel}</p>
        </figure>
    )
}

export {PositioningScatterChart}
export type {PositioningScatterChartProps, PositioningScatterPoint}
