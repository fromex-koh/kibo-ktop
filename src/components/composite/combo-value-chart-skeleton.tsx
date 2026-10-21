import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// ComboValueChart 와 같은 짜임의 스켈레톤 — 바닥선 · 막대 · 막대 값 글자 자리 · 항목 이름 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox 1168 × 480)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 막대 높이는 실제 값이 아니라 자리를 보이는 고정 모양이다(항목마다 조금씩 다르게 돌려 쓴다). 선은 그리지 않는다.
// 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가
// 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type ComboValueChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 항목 수(기본 12 — 경쟁기업 10 · 조회기업 · 평균). 실제 차트와 같게 두면 막대 자리가 맞는다. */
    itemCount?: number
}

// 실제 차트(combo-value-chart.tsx)와 같은 치수.
const WIDTH = 1168
const HEIGHT = 480
const BASELINE_Y = 438
const BAR_TOP_Y = 66.5
const BAR_WIDTH = 60
const BAR_FILL_RATIO = 0.62
const BAR_RADIUS = 8
const BASELINE_STROKE = 2
const VALUE_HEIGHT = 12
const VALUE_WIDTH = 36
const VALUE_OFFSET = 22
const CATEGORY_Y = 454
const CATEGORY_HEIGHT = 18
const CATEGORY_WIDTH = 56
const LABEL_RADIUS = 4
// 막대 높이 모양(영역 대비) — 항목 순서대로 돌려 쓴다.
const BAR_SHAPES = [0.96, 0.9, 0.84, 0.72, 0.8, 0.66, 0.88, 0.6] as const

const ComboValueChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    itemCount = 12,
    className,
    ...props
}: ComboValueChartSkeletonProps) => {
    const columnWidth = WIDTH / Math.max(itemCount, 1)
    const barWidth = Math.min(BAR_WIDTH, columnWidth * BAR_FILL_RATIO)
    const categoryWidth = Math.min(CATEGORY_WIDTH, columnWidth * BAR_FILL_RATIO)

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('w-full min-w-0 animate-pulse', className)}
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
                {Array.from({length: itemCount}, (_, index) => {
                    const center = columnWidth * (index + 0.5)
                    const height = (BASELINE_Y - BAR_TOP_Y) * BAR_SHAPES[index % BAR_SHAPES.length]
                    const top = BASELINE_Y - height
                    const x = center - barWidth / 2

                    return (
                        <g key={index}>
                            {/* 위만 둥근 막대 — 둥근 사각형 아래쪽 둥글림을 같은 색 사각형으로 덮어 바닥은 각지게 한다. */}
                            <rect
                                x={x}
                                y={top}
                                width={barWidth}
                                height={height}
                                rx={Math.min(BAR_RADIUS, barWidth / 2)}
                                fill="currentColor"
                            />
                            <rect
                                x={x}
                                y={BASELINE_Y - BAR_RADIUS}
                                width={barWidth}
                                height={BAR_RADIUS}
                                fill="currentColor"
                            />
                            <rect
                                x={center - Math.min(VALUE_WIDTH, barWidth) / 2}
                                y={top - VALUE_OFFSET}
                                width={Math.min(VALUE_WIDTH, barWidth)}
                                height={VALUE_HEIGHT}
                                rx={LABEL_RADIUS}
                                fill="currentColor"
                            />
                            <rect
                                x={center - categoryWidth / 2}
                                y={CATEGORY_Y}
                                width={categoryWidth}
                                height={CATEGORY_HEIGHT}
                                rx={LABEL_RADIUS}
                                fill="currentColor"
                            />
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

export {ComboValueChartSkeleton}
export type {ComboValueChartSkeletonProps}
