import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// ValueLineChart 와 같은 짜임의 스켈레톤 — 바닥선 · 꺾은선 · 점 · 값 글자 자리 · 기간 이름 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox 1168 × 440)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 선 모양은 실제 값이 아니라 자리를 보이는 고정 물결이다. 색은 다른 차트 스켈레톤과 같은 muted 면이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type ValueLineChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 점 수(기본 11 — 23.03월 ~ 25.09월 분기). 실제 차트와 같게 두면 점 자리가 맞는다. */
    pointCount?: number
    /** 실제 차트와 같은 변형 — medium 은 높이 340(활동성정보 분기별 종업원수), compact 는 290(차입금 변동률). */
    variant?: 'default' | 'medium' | 'compact' | 'narrow'
}

// 실제 차트(value-line-chart.tsx)와 같은 치수.
// 폭 · 점 가로 범위 — narrow 만 두 칸 중 넓은 칸(752), 나머지는 쪽 폭(1168).
const WIDE_FRAME = {width: 1168, xStart: 60, xEnd: 1144}
const BASELINE_X = 20
// 변형마다 높이 · 세로 위치(실제 차트의 GEOMETRY 와 같다). 기간 이름 자리 = 이름 글자 위쪽.
const GEOMETRY = {
    default: {...WIDE_FRAME, height: 440, plotTop: 40, baselineY: 370, labelY: 392},
    medium: {...WIDE_FRAME, height: 340, plotTop: 30, baselineY: 290, labelY: 306},
    compact: {...WIDE_FRAME, height: 290, plotTop: 30, baselineY: 250, labelY: 264},
    narrow: {width: 752, xStart: 40, xEnd: 712, height: 440, plotTop: 40, baselineY: 370, labelY: 392},
} as const
const LINE_WIDTH = 4
const BASELINE_STROKE = 2
const DOT_RADIUS = 7
const VALUE_OFFSET = 34
const VALUE_WIDTH = 28
const VALUE_HEIGHT = 16
const LABEL_WIDTH = 64
const LABEL_HEIGHT = 18
const LABEL_RADIUS = 4
// 물결 모양(그림 영역 대비 높이) — 점 순서대로 돌려 쓴다.
const WAVE = [0.88, 0.76, 0.8, 0.66, 0.6, 0.62, 0.46, 0.54, 0.3, 0.36, 0.22] as const

const ValueLineChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    pointCount = WAVE.length,
    variant = 'default',
    className,
    ...props
}: ValueLineChartSkeletonProps) => {
    const geometry = GEOMETRY[variant]
    const count = Math.max(pointCount, 1)
    const spacing = count > 1 ? (geometry.xEnd - geometry.xStart) / (count - 1) : 0
    const points = Array.from({length: count}, (_, index) => ({
        x: count > 1 ? geometry.xStart + spacing * index : geometry.width / 2,
        y: geometry.baselineY - WAVE[index % WAVE.length] * (geometry.baselineY - geometry.plotTop),
    }))
    const labelWidth = spacing ? Math.min(LABEL_WIDTH, spacing * 0.8) : LABEL_WIDTH
    const clampX = (x: number, width: number) => Math.min(geometry.width - width / 2, Math.max(width / 2, x))

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('w-full min-w-0 animate-pulse', className)}
        >
            <span className="sr-only">{label}</span>
            <svg
                viewBox={`0 0 ${geometry.width} ${geometry.height}`}
                className="text-muted block h-auto w-full"
                aria-hidden="true"
            >
                <line
                    x1={BASELINE_X}
                    y1={geometry.baselineY}
                    x2={geometry.width}
                    y2={geometry.baselineY}
                    stroke="currentColor"
                    strokeWidth={BASELINE_STROKE}
                />
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
                            x={clampX(point.x, VALUE_WIDTH) - VALUE_WIDTH / 2}
                            y={point.y - VALUE_OFFSET}
                            width={VALUE_WIDTH}
                            height={VALUE_HEIGHT}
                            rx={LABEL_RADIUS}
                            fill="currentColor"
                        />
                        <rect
                            x={clampX(point.x, labelWidth) - labelWidth / 2}
                            y={geometry.labelY}
                            width={labelWidth}
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

export {ValueLineChartSkeleton}
export type {ValueLineChartSkeletonProps}
