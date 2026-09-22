'use client'

import {useId, type ComponentPropsWithoutRef} from 'react'
import {Area, AreaChart, CartesianGrid, XAxis, YAxis, usePlotArea} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {
    CELLS_DIVIDER_DASH,
    CELLS_GRID_STROKE,
    CELLS_X_TICK,
    CELLS_X_TICK_MARGIN,
    cellsBottomLine,
    cellsDividerLines,
    cellsEdgeLines,
} from '@/components/custom/chart-cells'

// 분포 곡선(DistributionCurveChart) — 점수 분포를 종 모양(정규분포) 곡선으로 그리고, 조회 대상의 점수 자리에 점과 글자
// (예: 상위 2.2%)를 찍는다. K-BIGx 기업혁신성장 보고서 Tech-Index 탭 "Tech-Index 표준정보 비교" 카드에서 쓴다.
//
// 짜임: 높이 162 칸 상자(chart-cells 공통 — 위 선 없음 · 바닥 · 양 끝 실선 · 눈금 사이 점선) → 8 → 눈금 숫자 12 Regular.
//   눈금은 min~max 를 tickStep 으로 나눈 자리이며, 처음 숫자는 왼쪽 끝 · 마지막 숫자는 오른쪽 끝에 붙는다.
//   곡선: 선 1 + 위에서 아래로 옅어지는 면. 곡선 꼭대기는 칸 높이의 92% 에 닿는다.
//   점: 지름 12(color). 점 글자 12 Bold(blue.600)는 점 아래 12 에 둔다 — 곡선 비탈 · 분포 꼬리라 곡선이나 칸 바닥에 닿으면
//   점 위로 올리고(곡선보다 위), 좌우 끝에 가까우면 칸 밖으로 나가지 않게 글자 정렬을 끝 쪽으로 바꾼다(DistributionMarker).
// 그림은 role="img" 이름으로 읽고, 숨김 문단이 평균 · 점수 · 점 글자를 읽어 준다.
//
// [프론트엔드 연동] mean · standardDeviation 은 전체 분포 값, value 는 조회 대상 점수, markerLabel 은 백엔드가 준 순위 문구를 그대로 넘긴다.
// 곡선은 두 값으로 계산해 그린다(실제 표본 분포를 그리지 않는다).

type DistributionCurveChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /** 분포 평균. */
    mean: number
    /** 분포 표준편차. 0 이하 · 숫자가 아니면 가로 범위의 5% 로 맞춘다(곡선이 선 한 줄로 사라지지 않게). */
    standardDeviation: number
    /** 조회 대상 점수. 없으면 점을 찍지 않는다. 범위를 벗어나면 끝으로 맞춘다. */
    value?: number
    /** 점 글자(예: '상위 2.2%'). */
    markerLabel?: string
    /** 가로 범위(기본 0~100). */
    min?: number
    max?: number
    /** 눈금 간격(기본 10). 칸이 20 개를 넘지 않게 넓힌다. */
    tickStep?: number
    /** 곡선 · 점 색(토큰 변수). */
    color?: string
    /** 곡선이 그려지는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
}

// 곡선을 나누는 점 수 — 칸 폭 538 에서 꺾임이 보이지 않을 만큼.
const SAMPLE_COUNT = 200
// 곡선 꼭대기 높이 — 칸 높이의 92%.
const PEAK_RATIO = 0.92
const MAX_TICK_COUNT = 20
// 칸 높이 162 + 눈금 자리 34(8 + 글자 18 + 여유 8) = 196(h-49).
const X_AXIS_HEIGHT = 34
const DOT_RADIUS = 6
// 점 글자 자리 — 점 아래는 점 가장자리에서 12 띄우고, 위는 6 띄운다. 12 글자의 기준선 위 높이 10 · 아래 3.
const LABEL_BELOW_GAP = 12
const LABEL_ABOVE_GAP = 6
const LABEL_ASCENT = 10
const LABEL_DESCENT = 3
// 곡선과 글자 사이에 둘 최소 여백.
const LABEL_CURVE_GAP = 2
// 글자가 걸치는 가로 구간에서 곡선 높이를 재는 점 수.
const LABEL_SPAN_SAMPLES = 16
// 점 글자 폭 어림(12 Bold 한 글자 ≈ 11 · 숫자 ≈ 7 의 평균) — 끝 쪽 정렬 판단에만 쓴다.
const LABEL_CHAR_WIDTH = 9
const LABEL_FONT_SIZE = 12
const LABEL_FILL = 'var(--raw-blue-600)'

const normalDensity = (x: number, mean: number, deviation: number) =>
    Math.exp(-((x - mean) ** 2) / (2 * deviation ** 2)) / (deviation * Math.sqrt(2 * Math.PI))

const scoreFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

type TickProps = {x?: number | string; y?: number | string; payload?: {value?: unknown}; index?: number}

// 점 + 글자 — 그릴 자리(plot area)의 크기를 직접 읽어 자리를 잡는다.
//   가로: 글자 폭(어림)의 절반이 칸 끝을 넘으면 그 끝 쪽에 글자를 붙인다(0점 · 100점 · 긴 글자).
//   세로: 기본은 점 아래(곡선 면 안). 글자가 걸치는 가로 구간 어디서든 곡선이 글자 윗선보다 낮아지거나(비탈 · 분포 꼬리)
//   칸 바닥을 넘으면 점 위로 올리고, 그 구간의 가장 높은 곡선보다도 위에 둬 선과 겹치지 않게 한다.
const DistributionMarker = ({
    xRatio,
    yRatio,
    heightRatioAt,
    label,
    color,
}: {
    xRatio: number
    yRatio: number
    /** 가로 비율(0~1) 자리의 곡선 높이 비율(0~1). */
    heightRatioAt: (ratio: number) => number
    label?: string
    color: string
}) => {
    const plot = usePlotArea()
    if (!plot) return null
    const cx = plot.x + plot.width * xRatio
    const cy = plot.y + plot.height * (1 - yRatio)
    const plotBottom = plot.y + plot.height
    const halfWidth = ((label?.length ?? 0) * LABEL_CHAR_WIDTH) / 2
    const anchor = cx - halfWidth < plot.x ? 'start' : cx + halfWidth > plot.x + plot.width ? 'end' : 'middle'
    const labelX = anchor === 'start' ? plot.x : anchor === 'end' ? plot.x + plot.width : cx
    const spanStart =
        anchor === 'start' ? plot.x : anchor === 'end' ? plot.x + plot.width - halfWidth * 2 : cx - halfWidth
    // 글자 구간의 곡선 y(화면 좌표) — 위(가장 높은 곡선) · 아래(가장 낮은 곡선).
    const curveYs = Array.from({length: LABEL_SPAN_SAMPLES + 1}, (_, index) => {
        const x = spanStart + (halfWidth * 2 * index) / LABEL_SPAN_SAMPLES
        const ratio = Math.min(1, Math.max(0, (x - plot.x) / (plot.width || 1)))
        return plot.y + plot.height * (1 - heightRatioAt(ratio))
    })
    const belowBaseline = cy + DOT_RADIUS + LABEL_BELOW_GAP + LABEL_ASCENT
    const isBelowClear =
        Math.max(...curveYs) + LABEL_CURVE_GAP <= belowBaseline - LABEL_ASCENT &&
        belowBaseline + LABEL_DESCENT <= plotBottom
    const aboveBaseline = Math.max(
        plot.y + LABEL_ASCENT,
        Math.min(cy - DOT_RADIUS - LABEL_ABOVE_GAP, Math.min(...curveYs) - LABEL_CURVE_GAP) - LABEL_DESCENT,
    )
    // 위로 올려도 칸 위 끝에 막혀 점과 겹치면(뾰족한 분포의 꼭대기) 점 옆에 둔다 — 오른쪽에 자리가 없으면 왼쪽.
    const isAboveClear = aboveBaseline + LABEL_DESCENT <= cy - DOT_RADIUS
    const sideStart = cx + DOT_RADIUS + LABEL_ABOVE_GAP
    const isRightSide = sideStart + halfWidth * 2 <= plot.x + plot.width
    type Placement = {x: number; y: number; anchor: 'start' | 'middle' | 'end'}
    const placement: Placement = isBelowClear
        ? {x: labelX, y: belowBaseline, anchor}
        : isAboveClear
          ? {x: labelX, y: aboveBaseline, anchor}
          : {
                x: isRightSide ? sideStart : cx - DOT_RADIUS - LABEL_ABOVE_GAP,
                y: cy + LABEL_ASCENT / 2,
                anchor: isRightSide ? 'start' : 'end',
            }

    return (
        <g className="recharts-distribution-marker">
            <circle cx={cx} cy={cy} r={DOT_RADIUS} fill={color} />
            {label ? (
                <text
                    x={placement.x}
                    y={placement.y}
                    textAnchor={placement.anchor}
                    fill={LABEL_FILL}
                    fontSize={LABEL_FONT_SIZE}
                    fontWeight={700}
                >
                    {label}
                </text>
            ) : null}
        </g>
    )
}

const DistributionCurveChart = ({
    ariaLabel,
    mean,
    standardDeviation,
    value,
    markerLabel,
    min = 0,
    max = 100,
    tickStep = 10,
    color = 'var(--raw-blue-500)',
    animate = true,
    className,
    ...props
}: DistributionCurveChartProps) => {
    const gradientId = `distribution-${useId().replace(/:/g, '')}`
    const safeMin = Number.isFinite(min) ? min : 0
    const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100
    const span = safeMax - safeMin
    const safeMean = Number.isFinite(mean) ? mean : safeMin + span / 2
    const safeDeviation = Number.isFinite(standardDeviation) && standardDeviation > 0 ? standardDeviation : span / 20
    // 눈금 — 칸이 MAX_TICK_COUNT 를 넘으면 간격을 넓힌다(글자가 서로 겹치지 않게).
    const baseStep = Number.isFinite(tickStep) && tickStep > 0 ? tickStep : span / 10
    const step = Math.max(baseStep, span / MAX_TICK_COUNT)
    const ticks = Array.from({length: Math.floor(span / step + 1e-9) + 1}, (_, index) => safeMin + index * step)
    if (ticks[ticks.length - 1] < safeMax) ticks.push(safeMax)
    const cellCount = ticks.length - 1

    const curve = Array.from({length: SAMPLE_COUNT + 1}, (_, index) => {
        const x = safeMin + (span * index) / SAMPLE_COUNT
        return {x, density: normalDensity(x, safeMean, safeDeviation)}
    })
    // 꼭대기는 평균 자리의 높이다 — 평균이 범위 밖이면 범위 안에서 가장 높은 곳을 쓴다.
    const peak = Math.max(...curve.map((point) => point.density)) || 1
    const yMaximum = peak / PEAK_RATIO

    const hasMarker = value !== undefined && Number.isFinite(value)
    const markerX = hasMarker ? Math.min(safeMax, Math.max(safeMin, value)) : safeMin
    const markerY = normalDensity(markerX, safeMean, safeDeviation)

    const config = {density: {label: '분포', color}} satisfies ChartConfig

    // 눈금 숫자 — 처음은 왼쪽 끝 · 마지막은 오른쪽 끝에 붙여 칸 밖으로 나가지 않게 한다.
    const renderTick = ({x, y, payload, index = 0}: TickProps) => {
        const anchor = index === 0 ? 'start' : index === ticks.length - 1 ? 'end' : 'middle'
        return (
            <text
                x={Number(x ?? 0)}
                y={Number(y ?? 0)}
                dy={12}
                textAnchor={anchor}
                fill={CELLS_X_TICK.fill}
                fontSize={CELLS_X_TICK.fontSize}
            >
                {scoreFormatter.format(Number(payload?.value ?? 0))}
            </text>
        )
    }

    return (
        <div {...props} className={cn('w-full', className)}>
            <ChartContainer
                config={config}
                className="h-49 w-full [&_.recharts-surface]:overflow-visible"
                role="img"
                aria-label={ariaLabel}
            >
                <AreaChart data={curve} margin={{top: 0, right: 1, bottom: 0, left: 1}}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.16} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        key="cells-solid"
                        stroke={CELLS_GRID_STROKE}
                        horizontalCoordinatesGenerator={cellsBottomLine}
                        verticalCoordinatesGenerator={cellsEdgeLines}
                    />
                    <CartesianGrid
                        key="cells-dashed"
                        stroke={CELLS_GRID_STROKE}
                        strokeDasharray={CELLS_DIVIDER_DASH}
                        horizontal={false}
                        verticalCoordinatesGenerator={cellsDividerLines(cellCount)}
                    />
                    <XAxis
                        key="x-axis"
                        type="number"
                        dataKey="x"
                        domain={[safeMin, safeMax]}
                        ticks={ticks}
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={CELLS_X_TICK_MARGIN}
                        tick={renderTick}
                        height={X_AXIS_HEIGHT}
                        allowDataOverflow
                    />
                    <YAxis key="y-axis" hide domain={[0, yMaximum]} allowDataOverflow />
                    <Area
                        key="curve"
                        type="monotone"
                        dataKey="density"
                        stroke={color}
                        strokeWidth={1}
                        fill={`url(#${gradientId})`}
                        fillOpacity={1}
                        dot={false}
                        activeDot={false}
                        isAnimationActive={animate}
                    />
                    {hasMarker ? (
                        <DistributionMarker
                            key="marker"
                            xRatio={(markerX - safeMin) / span}
                            yRatio={markerY / yMaximum}
                            heightRatioAt={(ratio) =>
                                normalDensity(safeMin + span * ratio, safeMean, safeDeviation) / yMaximum
                            }
                            label={markerLabel}
                            color={color}
                        />
                    ) : null}
                </AreaChart>
            </ChartContainer>
            <p className="sr-only">
                {`평균 ${scoreFormatter.format(safeMean)}`}
                {hasMarker ? `, 점수 ${scoreFormatter.format(markerX)}` : ''}
                {markerLabel ? `, ${markerLabel}` : ''}
            </p>
        </div>
    )
}

export {DistributionCurveChart}
export type {DistributionCurveChartProps}
