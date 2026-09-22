'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {
    Bar,
    ComposedChart,
    CartesianGrid,
    LabelList,
    Line,
    Rectangle,
    XAxis,
    YAxis,
    type BarShapeProps,
    type LabelProps,
} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {
    CELLS_DIVIDER_DASH,
    CELLS_GRID_STROKE,
    CELLS_LABEL_FILL,
    CELLS_LABEL_FONT_SIZE,
    CELLS_MAX_VALUE_RATIO,
    CELLS_X_AXIS_HEIGHT,
    CELLS_X_TICK,
    CELLS_X_TICK_MARGIN,
    cellsBarDomain,
    cellsBottomLine,
    cellsDividerLines,
    cellsEdgeLines,
    cellsMinPointSize,
    formatCellsValue,
    renderCellsBarValueLabel,
} from '@/components/custom/chart-cells'

// 막대 + 선 겹침(ComboBarLineChart) — 항목마다 막대(예: 매출액)를 세우고, 그 안에 다른 값(예: 매출 증가율)을 선으로 잇는다.
// 막대와 선은 세로 눈금을 따로 쓴다(단위가 달라도 된다). K-BIGx 보고서 "경쟁기업 사업실적" 카드에서 쓴다.
//
// 짜임: 높이 200 칸 상자(chart-cells 공통 — 위 선 없음 · 바닥 · 양 끝 실선 · 항목 사이 점선) → 항목 이름 12 Regular.
//   막대 폭 48 · 위 모서리 6 이 칸 가운데에 서고, 값 글자는 막대 끝에서 4(11 Regular).
//   선은 굵기 1.5, 점은 지름 12(흰 채움 · 선 색 테두리 2), 선 값 글자는 점 위 3(11 Regular) — 막대 안이면 흰 글자.
//
// 막대 세로 범위(baseline 을 주지 않을 때):
//   · 값이 모두 양수이고 서로 다르면 0 에서 시작하지 않는다(잘린 축). 가장 작은 값이 칸 높이의 30%, 가장 큰 값이 78% 에
//     닿도록 아래 끝을 정한다 — 31.2 와 32.8 처럼 차이가 작은 값도 높이 차이가 드러난다. 아래 끝은 0 보다 내려가지 않는다.
//   · 값이 모두 같으면(차이 0) 0 에서 시작해 모두 78% 높이로 선다 — 잘린 축이 높이 0 으로 무너지지 않게 한다.
//   · 0 이하 값이 있으면 잘린 축을 쓰지 않고 chart-cells 공통 범위(0 기준, 음수는 아래로)를 따른다.
//   잘린 축은 막대 높이가 값에 비례하지 않으므로 값 글자를 늘 함께 적는다. 0 부터 그리려면 baseline={0} 을 준다.
// 선 세로 범위: 가장 작은 값이 칸 높이의 8%, 가장 큰 값이 50% 에 오도록 잡는다 — 선은 늘 칸 아래쪽 절반 안에 있어 막대 값
//   글자와 부딪히지 않고, 대부분 막대 안에 들어간다. 음수 선 값도 같은 띠 안에 있다(0 선은 긋지 않는다). 값이 모두 같으면 29%.
//
// [프론트엔드 연동] data 는 화면 순서 그대로 넘긴다(조회기업 · 평균 위치 포함). lineValue 가 없으면(null) 그 점은 비우고 선도 끊는다.

type ComboBarTone = 'default' | 'highlight' | 'average'

type ComboBarLineItem = {
    id: string
    label: string
    /** 막대 값. */
    value: number
    /** 선 값 — 없으면 null(점 · 선을 비운다). */
    lineValue: number | null
    /** 막대 색 역할 — default(파랑) · highlight(조회기업, 초록) · average(평균, 보라). */
    tone?: ComboBarTone
}

type ComboBarLineChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: ComboBarLineItem[]
    /** 숨김 표 머리 — 막대 값 이름(예: 매출액). */
    barLabel: string
    /** 숨김 표 머리 — 선 값 이름(예: 증가율). */
    lineLabel: string
    barUnit?: string
    lineUnit?: string
    /** 막대 세로 범위의 아래 끝. 주지 않으면 잘린 축 규칙(위 설명)을 따르고, 0 을 주면 0 부터 그린다. */
    baseline?: number
    valueFractionDigits?: number
    lineFractionDigits?: number
    /** 막대 · 선이 자라는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
    /**
     * 가장 큰 막대가 닿는 칸 높이 비율. 기본 0.78, 0.78~0.9 로 맞춘다 — 0.9 면 위에 막대 값 글자 한 줄 자리만 남는다.
     * 선은 늘 칸 아래쪽 8%~50% 띠에 그려 영향이 없다.
     */
    maxValueRatio?: number
}

const TONE_COLORS: Record<ComboBarTone, string> = {
    default: 'var(--ds-blue-500)',
    highlight: 'var(--ds-mint-700)',
    average: 'var(--ds-purple-500)',
}
const LINE_COLOR = 'var(--ds-blue-500)'
// 막대 위 글자 · 점 채움은 막대 색과 대비되는 구조색 흰색이다(색 모드와 무관하게 막대 색 위에 놓인다).
const LINE_LABEL_ON_BAR_FILL = 'var(--color-white)'
const DOT_FILL = 'var(--color-white)'

// 칸 상자 높이(h-56.5 = 226 에서 항목 이름 자리 26 을 뺀 값) — 선 값 글자가 막대 안인지 판단할 때 쓴다.
const PLOT_HEIGHT = 200
const BAR_SIZE = 48
const BAR_RADIUS = 6
// 칸 한 개의 최소 폭 — 막대(48) 양옆에 값 글자 여유를 둔다. 항목이 많아 이보다 좁아지면 그래프만 가로로 넘긴다.
// 보고서 카드(안쪽 1150)에 항목 12개가 스크롤 없이 들어가도록 80 으로 둔다(80 × 12 = 960).
const MIN_CELL_WIDTH = 80
// 잘린 축에서 가장 작은 막대가 차지하는 높이 비율(최소 보이는 높이).
const BAR_MIN_VALUE_RATIO = 0.3
const LINE_MIN_RATIO = 0.08
const LINE_MAX_RATIO = 0.5
const LINE_STROKE_WIDTH = 1.5
const DOT_RADIUS = 5
const DOT_STROKE_WIDTH = 2
const DOT_OUTER_RADIUS = DOT_RADIUS + DOT_STROKE_WIDTH / 2
const LINE_LABEL_GAP = 3
// 막대 값 글자 자리 — 막대 끝에서 4 위, 글자 11.
const BAR_LABEL_OFFSET = 4
// 글자 상자가 막대 가장자리에서 떨어져야 하는 최소 거리(둥근 모서리 · 글자 아래 획 여유).
const INSIDE_PADDING = 2
const BAR_AXIS_ID = 'bar'
const LINE_AXIS_ID = 'line'

// 막대 세로 범위 — 위 설명의 잘린 축 규칙. 가장 큰 값은 늘 78% 높이(위 여백은 값 글자 자리).
// ratio — 가장 큰 막대가 닿는 높이 비율(기본 78%, 최대 90%).
const MAX_VALUE_RATIO_LIMIT = 0.9
const comboBarDomain = (
    values: readonly number[],
    baseline: number | undefined,
    ratio: number = CELLS_MAX_VALUE_RATIO,
): [number, number] => {
    const safeRatio = Number.isFinite(ratio)
        ? Math.min(MAX_VALUE_RATIO_LIMIT, Math.max(CELLS_MAX_VALUE_RATIO, ratio))
        : CELLS_MAX_VALUE_RATIO
    const minimumValue = Math.min(...values)
    const maximumValue = Math.max(...values)
    if (baseline === undefined && minimumValue <= 0) return cellsBarDomain(minimumValue, maximumValue, safeRatio)
    const span = maximumValue - minimumValue
    const autoLower = span
        ? Math.max(0, minimumValue - (span * BAR_MIN_VALUE_RATIO) / (safeRatio - BAR_MIN_VALUE_RATIO))
        : 0
    const lower = baseline === undefined ? autoLower : Math.min(baseline, minimumValue)
    const upper = lower + (maximumValue - lower) / safeRatio
    return [lower, upper > lower ? upper : lower + 1]
}

// 선 세로 범위 — 가장 작은 값 8% · 가장 큰 값 50%. 값이 하나뿐이거나 모두 같으면 띠 가운데(29%).
const comboLineDomain = (values: readonly number[]): [number, number] => {
    if (!values.length) return [0, 1]
    const minimumValue = Math.min(...values)
    const maximumValue = Math.max(...values)
    const bandRatio = LINE_MAX_RATIO - LINE_MIN_RATIO
    const span = maximumValue - minimumValue
    if (!span) {
        const unit = Math.max(1, Math.abs(minimumValue))
        const middleRatio = (LINE_MIN_RATIO + LINE_MAX_RATIO) / 2
        return [minimumValue - unit * middleRatio, minimumValue + unit * (1 - middleRatio)]
    }
    const lower = minimumValue - (span * LINE_MIN_RATIO) / bandRatio
    return [lower, lower + span / bandRatio]
}

type LineDotProps = {cx?: number; cy?: number; index?: number}
type TickProps = {x?: number | string; y?: number | string; payload?: {value?: unknown}}

// 항목 이름 한 글자 폭 어림(12px 한글) — 칸보다 긴 이름은 줄임표로 자르고 전체 이름은 title 로 남긴다.
const TICK_CHAR_WIDTH = 12
const TICK_SIDE_PADDING = 8
const ELLIPSIS = '…'

const ComboBarLineChart = ({
    ariaLabel,
    data,
    barLabel,
    lineLabel,
    barUnit,
    lineUnit,
    baseline,
    valueFractionDigits = 1,
    lineFractionDigits = 1,
    animate = true,
    maxValueRatio = CELLS_MAX_VALUE_RATIO,
    className,
    ...props
}: ComboBarLineChartProps) => {
    const toFormatter = (digits: number) => {
        const fractionDigits = Math.min(6, Math.max(0, digits))
        return new Intl.NumberFormat('ko-KR', {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        })
    }
    const barFormatter = toFormatter(valueFractionDigits)
    const lineFormatter = toFormatter(lineFractionDigits)
    const formatBar = (value: number) => barFormatter.format(value)
    const config = {
        value: {label: barLabel, color: TONE_COLORS.default},
        lineValue: {label: lineLabel, color: LINE_COLOR},
    } satisfies ChartConfig
    // id 는 숨김 표의 key 로만 쓴다 — 차트로 넘기면 그린 도형마다 같은 id 가 붙는다[8.1.1].
    const chartData = data.map((item) => ({label: item.label, value: item.value, lineValue: item.lineValue}))
    const barValues = data.map((item) => item.value)
    const lineValues = data.flatMap((item) => (item.lineValue === null ? [] : [item.lineValue]))
    const barDomain = comboBarDomain(barValues.length ? barValues : [0], baseline, maxValueRatio)
    const lineDomain = comboLineDomain(lineValues)
    // 막대 끝 y(칸 위 끝 = 0) — recharts 와 같은 선형 눈금으로 계산해 선 값 글자 자리를 정한다.
    const barBaseValue = barDomain[0] <= 0 && barDomain[1] >= 0 ? 0 : barDomain[0]
    const toBarY = (value: number) =>
        PLOT_HEIGHT - ((value - barDomain[0]) / (barDomain[1] - barDomain[0] || 1)) * PLOT_HEIGHT
    const barBottomY = toBarY(barBaseValue)
    const toLineY = (value: number) =>
        PLOT_HEIGHT - ((value - lineDomain[0]) / (lineDomain[1] - lineDomain[0] || 1)) * PLOT_HEIGHT

    // 선 점 + 값 글자. 글자 자리는 순서대로 고른다.
    //   1) 점 위 — 글자 상자가 막대 안에 들어가면 흰 글자.
    //   2) 점 아래 — 위가 막대 끝을 넘으면(막대 값 글자와 겹칠 수 있음) 아래가 막대 안에 들어가는지 본다 → 흰 글자.
    //   3) 막대 밖 — 흰 바탕에서 사라지지 않게 짙은 글자(gray.600)로 적는다. 위 글자가 막대 값 글자와 세로로 겹치면 아래로 내린다.
    //   음수 막대는 속이 막대 아래쪽이므로 막대 안 판단을 위아래로 뒤집어 계산한다.
    const getLinePlacement = (index: number) => {
        const item = data[index]
        if (!item || item.lineValue === null) return null
        const cy = toLineY(item.lineValue)
        const barEndY = toBarY(item.value)
        const barTop = Math.min(barEndY, barBottomY)
        const barBottom = Math.max(barEndY, barBottomY)
        const aboveBaseline = cy - DOT_OUTER_RADIUS - LINE_LABEL_GAP
        const belowBaseline = cy + DOT_OUTER_RADIUS + LINE_LABEL_GAP + CELLS_LABEL_FONT_SIZE
        const isInsideBar = (textBaseline: number) =>
            textBaseline - CELLS_LABEL_FONT_SIZE >= barTop + INSIDE_PADDING &&
            textBaseline + INSIDE_PADDING <= barBottom
        // 막대 값 글자 상자(양수 막대 위 · 음수 막대 아래).
        const barLabelBottom =
            item.value < 0 ? barBottom + BAR_LABEL_OFFSET + CELLS_LABEL_FONT_SIZE : barTop - BAR_LABEL_OFFSET
        const barLabelTop = barLabelBottom - CELLS_LABEL_FONT_SIZE
        const overlapsBarLabel = (textBaseline: number) =>
            textBaseline > barLabelTop - INSIDE_PADDING &&
            textBaseline - CELLS_LABEL_FONT_SIZE < barLabelBottom + INSIDE_PADDING
        if (isInsideBar(aboveBaseline)) return {cy, y: aboveBaseline, isOnBar: true}
        if (isInsideBar(belowBaseline)) return {cy, y: belowBaseline, isOnBar: true}
        const isBelow = overlapsBarLabel(aboveBaseline) && belowBaseline <= PLOT_HEIGHT
        return {cy, y: isBelow ? belowBaseline : aboveBaseline, isOnBar: false}
    }

    const renderLineDot = ({cx, cy, index = 0}: LineDotProps) => {
        const item = data[index]
        const placement = getLinePlacement(index)
        if (typeof cx !== 'number' || typeof cy !== 'number' || !item || item.lineValue === null || !placement) {
            return <g key={`dot-${index}`} />
        }
        return (
            <g key={`dot-${index}`}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={DOT_RADIUS}
                    fill={DOT_FILL}
                    stroke={LINE_COLOR}
                    strokeWidth={DOT_STROKE_WIDTH}
                />
                <text
                    x={cx}
                    y={placement.y}
                    textAnchor="middle"
                    fill={placement.isOnBar ? LINE_LABEL_ON_BAR_FILL : CELLS_LABEL_FILL}
                    fontSize={CELLS_LABEL_FONT_SIZE}
                >
                    {formatCellsValue(item.lineValue, (value) => lineFormatter.format(value))}
                </text>
            </g>
        )
    }

    // 막대 값 글자 — 기본은 막대 끝 바로 밖(chart-cells 공통). 가장 큰 막대가 눈금을 끌어올려 다른 막대가 낮아지면 선 점 ·
    // 선 값 글자가 막대 끝 위로 올라와 막대 값 글자를 가릴 수 있다 — 그때는 막대 값 글자를 점 · 선 글자 바깥(양수는 위,
    // 음수는 아래)으로 밀어낸다. 막대 끝을 그만큼 늘린 자리로 공통 글자 함수에 넘겨 모양(글꼴 · 색 · 솎기)은 같게 둔다.
    const renderBarLabel = (labelProps: LabelProps) => {
        const {viewBox, index = 0} = labelProps
        const placement = getLinePlacement(index)
        if (!placement || !viewBox || !('width' in viewBox)) return renderCellsBarValueLabel(labelProps, formatBar)
        const {y, height} = viewBox
        if (typeof y !== 'number' || typeof height !== 'number') return renderCellsBarValueLabel(labelProps, formatBar)
        const barTop = Math.min(y, y + height)
        const barBottom = Math.max(y, y + height)
        const isNegative = (data[index]?.value ?? 0) < 0
        const obstacleTop = Math.min(placement.cy - DOT_OUTER_RADIUS, placement.y - CELLS_LABEL_FONT_SIZE)
        const obstacleBottom = Math.max(placement.cy + DOT_OUTER_RADIUS, placement.y + INSIDE_PADDING)
        const labelBottom = isNegative
            ? barBottom + BAR_LABEL_OFFSET + CELLS_LABEL_FONT_SIZE
            : barTop - BAR_LABEL_OFFSET
        const labelTop = labelBottom - CELLS_LABEL_FONT_SIZE
        const isBlocked = labelTop < obstacleBottom + INSIDE_PADDING && labelBottom > obstacleTop - INSIDE_PADDING
        if (!isBlocked) return renderCellsBarValueLabel(labelProps, formatBar)
        const shiftedViewBox = isNegative
            ? {...viewBox, y: barTop, height: Math.max(barBottom, obstacleBottom + INSIDE_PADDING) - barTop}
            : {...viewBox, y: Math.min(barTop, obstacleTop - INSIDE_PADDING), height: 0}
        return renderCellsBarValueLabel({...labelProps, viewBox: shiftedViewBox}, formatBar)
    }

    // 항목 이름 — 칸(최소 80) 폭을 넘으면 줄여 옆 칸 · 그래프 가장자리 밖으로 넘치지 않게 한다. 숨김 표는 전체 이름을 읽는다.
    const renderTick = ({x, y, payload}: TickProps) => {
        const text = String(payload?.value ?? '')
        const maxChars = Math.max(2, Math.floor((MIN_CELL_WIDTH - TICK_SIDE_PADDING) / TICK_CHAR_WIDTH))
        const isTruncated = text.length > maxChars
        return (
            <text
                x={Number(x ?? 0)}
                y={Number(y ?? 0)}
                dy="0.71em"
                textAnchor="middle"
                fill={CELLS_X_TICK.fill}
                fontSize={CELLS_X_TICK.fontSize}
            >
                {isTruncated ? <title>{text}</title> : null}
                {isTruncated ? `${text.slice(0, maxChars - 1)}${ELLIPSIS}` : text}
            </text>
        )
    }

    // 막대 색은 항목의 tone 으로 정한다(조회기업 · 평균 강조).
    const renderBarShape = (shapeProps: BarShapeProps) => (
        <Rectangle {...shapeProps} fill={TONE_COLORS[data[shapeProps.index]?.tone ?? 'default']} />
    )

    return (
        <div {...props} className={cn('flex w-full flex-col', className)}>
            {/* 칸 폭 80 × 항목 수를 최소 폭으로 지키고, 모자라면 그래프만 가로로 넘긴다. */}
            <div className="w-full overflow-x-auto">
                <ChartContainer
                    config={config}
                    className="h-56.5 w-full"
                    style={{minWidth: data.length * MIN_CELL_WIDTH}}
                    role="img"
                    aria-label={ariaLabel}
                >
                    <ComposedChart accessibilityLayer data={chartData} margin={{top: 0, right: 1, bottom: 0, left: 1}}>
                        <CartesianGrid
                            key="cells-solid"
                            yAxisId={BAR_AXIS_ID}
                            stroke={CELLS_GRID_STROKE}
                            horizontalCoordinatesGenerator={cellsBottomLine}
                            verticalCoordinatesGenerator={cellsEdgeLines}
                        />
                        <CartesianGrid
                            key="cells-dashed"
                            yAxisId={BAR_AXIS_ID}
                            stroke={CELLS_GRID_STROKE}
                            strokeDasharray={CELLS_DIVIDER_DASH}
                            horizontal={false}
                            verticalCoordinatesGenerator={cellsDividerLines(data.length)}
                        />
                        <XAxis
                            key="x-axis"
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={renderTick}
                            tickMargin={CELLS_X_TICK_MARGIN}
                            height={CELLS_X_AXIS_HEIGHT}
                            interval={0}
                        />
                        <YAxis key="bar-axis" yAxisId={BAR_AXIS_ID} hide domain={barDomain} allowDataOverflow />
                        <YAxis key="line-axis" yAxisId={LINE_AXIS_ID} hide domain={lineDomain} allowDataOverflow />
                        <Bar
                            key="bar"
                            yAxisId={BAR_AXIS_ID}
                            dataKey="value"
                            barSize={BAR_SIZE}
                            radius={[BAR_RADIUS, BAR_RADIUS, 0, 0]}
                            shape={renderBarShape}
                            isAnimationActive={animate}
                            // 0 · 아주 작은 값도 막대 자리(와 값 글자)를 남긴다(chart-cells).
                            minPointSize={cellsMinPointSize}
                        >
                            <LabelList dataKey="value" content={renderBarLabel} />
                        </Bar>
                        <Line
                            key="line"
                            yAxisId={LINE_AXIS_ID}
                            dataKey="lineValue"
                            type="linear"
                            stroke={LINE_COLOR}
                            strokeWidth={LINE_STROKE_WIDTH}
                            dot={renderLineDot}
                            activeDot={false}
                            connectNulls={false}
                            isAnimationActive={animate}
                        />
                    </ComposedChart>
                </ChartContainer>
            </div>

            {/* 감추는 상자를 따로 둔다 — 표에 직접 sr-only 를 걸면 표가 제 폭만큼 자리를 차지해 문서가 가로로 넓어진다. */}
            <div className="sr-only">
                <table>
                    <caption>{ariaLabel}</caption>
                    <thead>
                        <tr>
                            <th scope="col">항목</th>
                            <th scope="col">
                                {barLabel}
                                {barUnit ? ` (${barUnit})` : ''}
                            </th>
                            <th scope="col">
                                {lineLabel}
                                {lineUnit ? ` (${lineUnit})` : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <th scope="row">{item.label}</th>
                                <td>{barFormatter.format(item.value)}</td>
                                <td>{item.lineValue === null ? '값 없음' : lineFormatter.format(item.lineValue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {ComboBarLineChart, comboBarDomain, comboLineDomain}
export type {ComboBarLineChartProps, ComboBarLineItem, ComboBarTone}
