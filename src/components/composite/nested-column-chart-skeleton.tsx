import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// NestedColumnChart 와 같은 짜임의 스켈레톤 — 바닥선 · 기준 막대 · 구성 막대 · 값 글자 자리 · 항목 이름 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox 560 × 354)가 실제 차트와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 기준 막대는 옅게, 구성 막대는 진하게(같은 muted 색의 투명도) 그려 겹친 모양을 보인다. 막대 높이는 고정 모양이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type NestedColumnChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 항목 수(기본 3 — 최근 3개년). */
    groupCount?: number
    /** 구성 막대 수(기본 2 — 부채총계 · 자본총계). */
    seriesCount?: number
}

// 실제 차트(nested-column-chart.tsx)와 같은 치수.
const WIDTH = 560
const HEIGHT = 354
const BASELINE_Y = 300
const PLOT_HEIGHT = 246.4
const BASE_WIDTH = 108
const BAR_WIDTH = 30
const INNER_INSET = 16
const BAR_RADIUS = 8
const BASELINE_STROKE = 2
const VALUE_HEIGHT = 12
const VALUE_WIDTH = 44
const VALUE_OFFSET = 22
const CATEGORY_Y = 330
const CATEGORY_WIDTH = 60
const CATEGORY_HEIGHT = 18
const LABEL_RADIUS = 4
const BASE_OPACITY = 0.5
// 막대 높이 모양(그림 영역 대비) — 기준 막대, 구성 막대 순서. 항목마다 조금씩 키운다.
const BASE_SHAPE = 0.55
const SERIES_SHAPES = [0.22, 0.32, 0.4] as const
const GROUP_STEP = 0.18

const NestedColumnChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    groupCount = 3,
    seriesCount = 2,
    className,
    ...props
}: NestedColumnChartSkeletonProps) => {
    const groupWidth = WIDTH / Math.max(groupCount, 1)
    const innerSpace = BASE_WIDTH - INNER_INSET * 2
    const barWidth = seriesCount ? Math.min(BAR_WIDTH, innerSpace / seriesCount) : BAR_WIDTH
    const barGap = seriesCount > 1 ? (innerSpace - barWidth * seriesCount) / (seriesCount - 1) : 0
    // 위만 둥근 막대 — 둥근 사각형 아래 둥글림을 같은 색 사각형으로 덮는다.
    const bar = (key: string, x: number, width: number, height: number, opacity?: number) => (
        <g key={key} opacity={opacity}>
            <rect x={x} y={BASELINE_Y - height} width={width} height={height} rx={BAR_RADIUS} fill="currentColor" />
            <rect x={x} y={BASELINE_Y - BAR_RADIUS} width={width} height={BAR_RADIUS} fill="currentColor" />
        </g>
    )

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
                {Array.from({length: groupCount}, (_, groupIndex) => {
                    const center = groupWidth * (groupIndex + 0.5)
                    const baseX = center - BASE_WIDTH / 2
                    const grow = 1 + groupIndex * GROUP_STEP
                    const baseHeight = PLOT_HEIGHT * Math.min(1, BASE_SHAPE * grow)

                    return (
                        <g key={groupIndex}>
                            {bar('base', baseX, BASE_WIDTH, baseHeight, BASE_OPACITY)}
                            <rect
                                x={center - VALUE_WIDTH / 2}
                                y={BASELINE_Y - baseHeight - VALUE_OFFSET}
                                width={VALUE_WIDTH}
                                height={VALUE_HEIGHT}
                                rx={LABEL_RADIUS}
                                fill="currentColor"
                            />
                            {Array.from({length: seriesCount}, (__, index) =>
                                bar(
                                    `bar-${index}`,
                                    baseX + INNER_INSET + index * (barWidth + barGap),
                                    barWidth,
                                    PLOT_HEIGHT * Math.min(0.9, SERIES_SHAPES[index % SERIES_SHAPES.length] * grow),
                                ),
                            )}
                            <rect
                                x={center - CATEGORY_WIDTH / 2}
                                y={CATEGORY_Y}
                                width={CATEGORY_WIDTH}
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

export {NestedColumnChartSkeleton}
export type {NestedColumnChartSkeletonProps}
