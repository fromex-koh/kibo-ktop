import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// DualLineChart 와 같은 짜임의 스켈레톤 — 바닥선 · 두 선 · 점 · 값 글자 자리 · 항목 이름 자리를 같은 좌표에 그리고, 아래 10 에
// 범례 자리 둘을 둔다. 그림 범위(viewBox 560 × 290)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 선 높이는 실제 값이 아니라 자리를 보이는 고정 모양이다. 색은 다른 차트 스켈레톤과 같은 muted 면이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type DualLineChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 항목 수(기본 3 — 최근 3개년). */
    groupCount?: number
}

// 실제 차트(dual-line-chart.tsx)와 같은 치수.
const WIDTH = 560
const HEIGHT = 290
const BASELINE_Y = 250
const LINE_WIDTH = 3.5
const BASELINE_STROKE = 2
const DOT_RADIUS = 8
const VALUE_WIDTH = 34
const VALUE_HEIGHT = 16
const VALUE_GAP = 16
const CATEGORY_Y = 266
const CATEGORY_WIDTH = 60
const CATEGORY_HEIGHT = 18
const LABEL_RADIUS = 4
// 선마다 높이(y) — 위 선 · 아래 선, 항목 순서대로 돌려 쓴다.
const LINE_SHAPES = [
    [83, 114, 126],
    [207, 176, 164],
] as const

const skeletonPartClassName = chartSkeletonPartVariants()

const DualLineChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    groupCount = 3,
    className,
    ...props
}: DualLineChartSkeletonProps) => {
    const count = Math.max(groupCount, 1)
    const groupWidth = WIDTH / count
    const toX = (index: number) => groupWidth * (index + 0.5)

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('flex w-full min-w-0 animate-pulse flex-col gap-2.5', className)}
        >
            <span className="sr-only">{label}</span>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="text-muted block h-auto w-full" aria-hidden="true">
                <line
                    x1={0}
                    y1={BASELINE_Y}
                    x2={WIDTH}
                    y2={BASELINE_Y}
                    stroke="currentColor"
                    strokeWidth={BASELINE_STROKE}
                />
                {LINE_SHAPES.map((shape, lineIndex) => {
                    const points = Array.from({length: count}, (_, index) => ({
                        x: toX(index),
                        y: shape[index % shape.length],
                    }))
                    return (
                        <g key={lineIndex}>
                            <polyline
                                points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={LINE_WIDTH}
                            />
                            {points.map((point, index) => (
                                <g key={index}>
                                    <circle cx={point.x} cy={point.y} r={DOT_RADIUS} fill="currentColor" />
                                    <rect
                                        x={point.x - VALUE_WIDTH / 2}
                                        y={lineIndex === 0 ? point.y - VALUE_GAP - VALUE_HEIGHT : point.y + VALUE_GAP}
                                        width={VALUE_WIDTH}
                                        height={VALUE_HEIGHT}
                                        rx={LABEL_RADIUS}
                                        fill="currentColor"
                                    />
                                </g>
                            ))}
                        </g>
                    )
                })}
                {Array.from({length: count}, (_, index) => (
                    <rect
                        key={index}
                        x={toX(index) - CATEGORY_WIDTH / 2}
                        y={CATEGORY_Y}
                        width={CATEGORY_WIDTH}
                        height={CATEGORY_HEIGHT}
                        rx={LABEL_RADIUS}
                        fill="currentColor"
                    />
                ))}
            </svg>
            <div className="flex justify-center gap-7" aria-hidden="true">
                <span className={cn(skeletonPartClassName, 'h-4.5 w-20')} />
                <span className={cn(skeletonPartClassName, 'h-4.5 w-20')} />
            </div>
        </div>
    )
}

export {DualLineChartSkeleton}
export type {DualLineChartSkeletonProps}
