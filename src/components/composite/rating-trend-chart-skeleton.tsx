import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// RatingTrendChart 와 같은 짜임의 스켈레톤 — 등급 줄 · 꺾은선 · 점 · 등급 글자 자리 · 시점 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox 680 × 280)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 선 모양은 실제 등급이 아니라 자리를 보이는 고정 계단이다. 색은 다른 차트 스켈레톤과 같은 muted 면이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type RatingTrendChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 점 수(기본 3 — 최근 세 번 평가). 실제 차트와 같게 두면 점 자리가 맞는다. */
    pointCount?: number
}

// 실제 차트(rating-trend-chart.tsx)와 같은 치수.
const WIDTH = 680
const HEIGHT = 280
const GRID_LEFT = 90
const ROW_TOP = 50
const ROW_BOTTOM = 210
const POINT_LEFT = 150
const POINT_RIGHT = 610
const LINE_WIDTH = 4
const GRID_STROKE = 1.5
const DOT_RADIUS = 10
const GRADE_OFFSET = 38
const GRADE_WIDTH = 52
const GRADE_HEIGHT = 20
const LABEL_Y = 250
const LABEL_WIDTH = 64
const LABEL_HEIGHT = 18
const LABEL_RADIUS = 4
// 줄 수 · 점마다 줄 순서(위 → 아래) — 점 순서대로 돌려 쓴다.
const ROW_COUNT = 3
const STEPS = [0, 1, 2, 1, 2] as const

const RatingTrendChartSkeleton = ({
    label = '등급 이력을 불러오는 중입니다.',
    pointCount = ROW_COUNT,
    className,
    ...props
}: RatingTrendChartSkeletonProps) => {
    const count = Math.max(pointCount, 1)
    const rowY = (row: number) => ROW_TOP + ((ROW_BOTTOM - ROW_TOP) * row) / (ROW_COUNT - 1)
    const points = Array.from({length: count}, (_, index) => ({
        x: count > 1 ? POINT_LEFT + ((POINT_RIGHT - POINT_LEFT) * index) / (count - 1) : (POINT_LEFT + POINT_RIGHT) / 2,
        y: rowY(STEPS[index % STEPS.length]),
    }))

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('w-full min-w-0 animate-pulse', className)}
        >
            <span className="sr-only">{label}</span>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="text-muted block h-auto w-full" aria-hidden="true">
                {Array.from({length: ROW_COUNT}, (_, row) => (
                    <line
                        key={row}
                        x1={GRID_LEFT}
                        y1={rowY(row)}
                        x2={WIDTH}
                        y2={rowY(row)}
                        stroke="currentColor"
                        strokeWidth={GRID_STROKE}
                    />
                ))}
                <polyline
                    points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={LINE_WIDTH}
                    strokeLinejoin="round"
                />
                {points.map((point, index) => (
                    <g key={index}>
                        <circle cx={point.x} cy={point.y} r={DOT_RADIUS} fill="currentColor" />
                        <rect
                            x={point.x - GRADE_WIDTH / 2}
                            y={point.y - GRADE_OFFSET}
                            width={GRADE_WIDTH}
                            height={GRADE_HEIGHT}
                            rx={LABEL_RADIUS}
                            fill="currentColor"
                        />
                        <rect
                            x={point.x - LABEL_WIDTH / 2}
                            y={LABEL_Y}
                            width={LABEL_WIDTH}
                            height={LABEL_HEIGHT}
                            rx={LABEL_RADIUS}
                            fill="currentColor"
                        />
                    </g>
                ))}
            </svg>
        </div>
    )
}

export {RatingTrendChartSkeleton}
export type {RatingTrendChartSkeletonProps}
