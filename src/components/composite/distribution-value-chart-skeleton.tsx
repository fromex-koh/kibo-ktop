import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// DistributionValueChart 와 같은 짜임의 스켈레톤 — 바닥선 · 종 모양 면 · 눈금 숫자 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox 1168 × 336)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 곡선은 실제 값이 아니라 가운데에 놓인 고정 모양이다. 색은 다른 차트 스켈레톤과 같은 muted 면이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type DistributionValueChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 눈금 숫자 수(기본 11 — 0 ~ 100, 10 단위). */
    tickCount?: number
}

// 실제 차트(distribution-value-chart.tsx)와 같은 치수.
const WIDTH = 1168
const HEIGHT = 336
const PLOT_LEFT = 20
const PLOT_RIGHT = 1148
const BASELINE_Y = 290
const PEAK_Y = 40
const BASELINE_STROKE = 2
const TICK_Y = 310
const TICK_HEIGHT = 18
const TICK_WIDTH = 28
const LABEL_RADIUS = 4
const CURVE_STEPS = 60
// 고정 모양 — 가운데 평균, 표준편차는 가로 범위의 18%.
const SHAPE_SD_RATIO = 0.18

const round = (value: number) => Math.round(value * 10) / 10

const DistributionValueChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    tickCount = 11,
    className,
    ...props
}: DistributionValueChartSkeletonProps) => {
    const span = PLOT_RIGHT - PLOT_LEFT
    const center = PLOT_LEFT + span / 2
    const sd = span * SHAPE_SD_RATIO
    const points = Array.from({length: CURVE_STEPS + 1}, (_, index) => {
        const x = PLOT_LEFT + (span * index) / CURVE_STEPS
        const y = BASELINE_Y - Math.exp(-((x - center) ** 2) / (2 * sd ** 2)) * (BASELINE_Y - PEAK_Y)
        return `${round(x)},${round(y)}`
    })
    const areaPath = `M${points.join(' L')} L${PLOT_RIGHT},${BASELINE_Y} L${PLOT_LEFT},${BASELINE_Y} Z`

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('w-full min-w-0 animate-pulse', className)}
        >
            <span className="sr-only">{label}</span>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="text-muted block h-auto w-full" aria-hidden="true">
                <path d={areaPath} fill="currentColor" />
                <line
                    x1={PLOT_LEFT}
                    y1={BASELINE_Y}
                    x2={PLOT_RIGHT}
                    y2={BASELINE_Y}
                    stroke="currentColor"
                    strokeWidth={BASELINE_STROKE}
                />
                {Array.from({length: tickCount}, (_, index) => {
                    const x = PLOT_LEFT + (span * index) / Math.max(tickCount - 1, 1)
                    return (
                        <rect
                            key={index}
                            x={round(x - TICK_WIDTH / 2)}
                            y={TICK_Y}
                            width={TICK_WIDTH}
                            height={TICK_HEIGHT}
                            rx={LABEL_RADIUS}
                            fill="currentColor"
                        />
                    )
                })}
            </svg>
        </div>
    )
}

export {DistributionValueChartSkeleton}
export type {DistributionValueChartSkeletonProps}
