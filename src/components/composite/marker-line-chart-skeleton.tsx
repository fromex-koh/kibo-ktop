import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// MarkerLineChart 와 같은 짜임의 스켈레톤 — 바닥선 · 계열 선 · 점 · 항목 이름 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox 560(width) × 300)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다(범례는 따로 둔다).
// 선 높이는 실제 값이 아니라 자리를 보이는 고정 모양이다. 색은 다른 차트 스켈레톤과 같은 muted 면이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type MarkerLineChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 항목 수(기본 3 — 최근 3개년). */
    groupCount?: number
    /** 계열 수(기본 3). */
    seriesCount?: number
    /** 그림 폭 — 실제 차트의 width 와 같게(기본 560, 한 줄 전체 1168). */
    width?: number
    /** 그림 높이 — 실제 차트의 height 와 같게(기본 300). 바닥선 · 항목 이름 자리는 아래 끝 기준이다. */
    height?: number
}

// 실제 차트(marker-line-chart.tsx)와 같은 치수.
const DEFAULT_WIDTH = 560
const DEFAULT_HEIGHT = 300
const PLOT_TOP = 16
// 바닥선 · 항목 이름 자리 위쪽 — 그림 아래 끝에서 위로(높이 300 → 260 · 274).
const BASELINE_FROM_BOTTOM = 40
const LINE_WIDTH = 3.5
const BASELINE_STROKE = 2
const DOT_RADIUS = 7
const CATEGORY_FROM_BOTTOM = 26
const CATEGORY_WIDTH = 60
const CATEGORY_HEIGHT = 18
const LABEL_RADIUS = 4
// 계열마다 높이(그림 영역 대비) — 항목 순서대로 돌려 쓴다.
const SERIES_SHAPES = [
    [0.82, 0.92, 0.88],
    [0.5, 0.62, 0.56],
    [0.2, 0.3, 0.26],
    [0.68, 0.42, 0.74],
    [0.36, 0.14, 0.4],
] as const

const MarkerLineChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    groupCount = 3,
    seriesCount = 3,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    className,
    ...props
}: MarkerLineChartSkeletonProps) => {
    const baselineY = height - BASELINE_FROM_BOTTOM
    const categoryY = height - CATEGORY_FROM_BOTTOM
    const count = Math.max(groupCount, 1)
    const groupWidth = width / count
    const toX = (index: number) => groupWidth * (index + 0.5)

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('w-full min-w-0 animate-pulse', className)}
        >
            <span className="sr-only">{label}</span>
            <svg viewBox={`0 0 ${width} ${height}`} className="text-muted block h-auto w-full" aria-hidden="true">
                <line
                    x1={0}
                    y1={baselineY}
                    x2={width}
                    y2={baselineY}
                    stroke="currentColor"
                    strokeWidth={BASELINE_STROKE}
                />
                {Array.from({length: seriesCount}, (_, seriesIndex) => {
                    const shape = SERIES_SHAPES[seriesIndex % SERIES_SHAPES.length]
                    const points = Array.from({length: count}, (__, index) => ({
                        x: toX(index),
                        y: baselineY - shape[index % shape.length] * (baselineY - PLOT_TOP),
                    }))
                    return (
                        <g key={seriesIndex}>
                            <polyline
                                points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={LINE_WIDTH}
                                strokeLinejoin="round"
                            />
                            {points.map((point, index) => (
                                <circle key={index} cx={point.x} cy={point.y} r={DOT_RADIUS} fill="currentColor" />
                            ))}
                        </g>
                    )
                })}
                {Array.from({length: count}, (_, index) => (
                    <rect
                        key={index}
                        x={toX(index) - CATEGORY_WIDTH / 2}
                        y={categoryY}
                        width={CATEGORY_WIDTH}
                        height={CATEGORY_HEIGHT}
                        rx={LABEL_RADIUS}
                        fill="currentColor"
                    />
                ))}
            </svg>
        </div>
    )
}

export {MarkerLineChartSkeleton}
export type {MarkerLineChartSkeletonProps}
