import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// ValueColumnChart 와 같은 짜임의 스켈레톤 — 바닥선 · 막대 · 값 글자 자리 · 항목 이름 자리를 같은 좌표에 그린다.
// 그림 범위(wide 1168 × 338 · compact 230 × 290)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 막대 높이는 실제 값이 아니라 자리를 보이는 고정 모양이다(항목마다 조금씩 다르게 돌려 쓴다).
// 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가
// 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type ValueColumnChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 실제 차트와 같은 모양. */
    variant?: 'wide' | 'compact' | 'narrow'
    /** 항목 수(기본 wide 6 — 기업 유형, compact 2 — 신청기업 · 전체기업, narrow 3 — 3개년). */
    itemCount?: number
}

// 실제 차트(value-column-chart.tsx)와 같은 치수.
const LAYOUT = {
    wide: {width: 1168, height: 338, paddingX: 20, columnGap: 40, barRatio: 1, maxBar: 64, baselineY: 299},
    compact: {width: 230, height: 290, paddingX: 0, columnGap: 0, barRatio: 0.56, maxBar: 64, baselineY: 250},
    narrow: {width: 360, height: 440, paddingX: 0, columnGap: 0, barRatio: 1, maxBar: 64, baselineY: 370},
} as const
const PLOT_HEIGHT = {wide: 260, compact: 220, narrow: 308} as const
const BAR_RADIUS = 8
const BASELINE_STROKE = 2
const VALUE_HEIGHT = 14
const VALUE_GAP = 26
const CATEGORY_GAP = 14
const CATEGORY_HEIGHT = 18
const LABEL_RADIUS = 4
// 이름 자리 폭(칸 대비 상한).
const LABEL_WIDTH_RATIO = 0.7
// 막대 높이 모양(영역 대비) — 항목 순서대로 돌려 쓴다.
const BAR_SHAPES = [1, 0.68, 0.62, 0.75, 0.7, 0.8] as const

const ValueColumnChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    variant = 'wide',
    itemCount,
    className,
    ...props
}: ValueColumnChartSkeletonProps) => {
    const layout = LAYOUT[variant]
    const count = itemCount ?? (variant === 'wide' ? 6 : variant === 'narrow' ? 3 : 2)
    const columnWidth = (layout.width - layout.paddingX * 2 - layout.columnGap * (count - 1)) / count
    const barWidth = Math.min(layout.maxBar, columnWidth * layout.barRatio)
    const labelWidth = Math.min(barWidth, columnWidth * LABEL_WIDTH_RATIO)

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('w-full min-w-0 animate-pulse', className)}
        >
            <span className="sr-only">{label}</span>
            <svg
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                className="text-muted block h-auto w-full"
                aria-hidden="true"
            >
                {Array.from({length: count}, (_, index) => {
                    const center = layout.paddingX + (columnWidth + layout.columnGap) * index + columnWidth / 2
                    const height = PLOT_HEIGHT[variant] * BAR_SHAPES[index % BAR_SHAPES.length]
                    const top = layout.baselineY - height
                    const x = center - barWidth / 2

                    return (
                        <g key={index}>
                            {/* 위만 둥근 막대 — 둥근 사각형 아래쪽 둥글림을 같은 색 사각형으로 덮어 바닥은 각지게 한다. */}
                            <rect x={x} y={top} width={barWidth} height={height} rx={BAR_RADIUS} fill="currentColor" />
                            <rect
                                x={x}
                                y={layout.baselineY - BAR_RADIUS}
                                width={barWidth}
                                height={BAR_RADIUS}
                                fill="currentColor"
                            />
                            <rect
                                x={center - labelWidth / 4}
                                y={top - VALUE_GAP}
                                width={labelWidth / 2}
                                height={VALUE_HEIGHT}
                                rx={LABEL_RADIUS}
                                fill="currentColor"
                            />
                            <rect
                                x={center - labelWidth / 2}
                                y={layout.baselineY + CATEGORY_GAP}
                                width={labelWidth}
                                height={CATEGORY_HEIGHT}
                                rx={LABEL_RADIUS}
                                fill="currentColor"
                            />
                        </g>
                    )
                })}
                <line
                    x1={0}
                    y1={layout.baselineY}
                    x2={layout.width}
                    y2={layout.baselineY}
                    stroke="currentColor"
                    strokeWidth={BASELINE_STROKE}
                />
            </svg>
        </div>
    )
}

export {ValueColumnChartSkeleton}
export type {ValueColumnChartSkeletonProps}
