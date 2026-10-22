import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 표식 꺾은선(MarkerLineChart) — 여러 계열의 추이를 계열마다 다른 선 모양(실선 · 점선 · 파선 · 일점쇄선)과 점 모양
// (빈 원 · 채운 원 · 네모 · 마름모 · 세모)으로 그린다. 색만으로 구분하지 않는다[5.3.1]. 값 글자 · 세로축 없이 추이만 보인다.
// K-BIGx 보고서 인쇄본 기업현황 "주요재무비율 · 현금흐름"(폭 560) · 신용/재무정보 "재무비율진단"(폭 1168) 그래프.
// 범례는 MarkerLineLegend 로 그래프 아래에 둔다.
// (세로축 · 툴팁이 있는 웹 화면용 선 그래프는 LineChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 폭 560(width 로 바꿈) × 높이 300(height 로 바꿈 — 바닥선 · 항목 이름은 아래 끝에서 40 · 10 위를 지킨다). 점은 항목 칸(폭 ÷ 항목 수) 가운데에 놓고, 칸 사이에 세로 점선(y 16 ~ 260)을 긋는다.
//   바닥선 = y 260 · 그림 영역 꼭대기 = y 16. 값 범위 — 모두 0 이상이면 0 ~ 가장 큰 값을 윗자리 단위로 올린 값(77.16 → 80),
//   음수가 있으면 작은 끝은 윗자리 단위로 내리고 큰 끝은 그 1/5 단위로 올린다(-1,640 ~ 2,370 → -2,000 ~ 2,400).
//   선 굵기 3.5. 항목 이름 = y 290(19px 600).
// 계열 모양(순서대로 돌려 쓴다) — MARKER_LINE_STYLES. 색은 사용처가 계열마다 넘긴다.
// 데이터에 따라
//   · 값이 없는 점(undefined)은 그 계열의 선을 끊고 점을 그리지 않는다.
//   · 계열이 다섯을 넘으면 모양을 처음부터 다시 쓴다 — 색도 함께 바꿔 넘긴다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
//
// [프론트엔드 연동] data 의 values 는 계열 key → 값. 계열 색은 series 의 color, 선 · 글자 색은 colors 로 넘긴다.

type MarkerShape = 'circle' | 'circle-filled' | 'square' | 'diamond' | 'triangle'

type MarkerLineSeries = {
    key: string
    label: string
    /** 선 · 점 색(CSS 색 값). */
    color: string
}

type MarkerLineItem = {
    id: string
    label: string
    /** 계열 key → 값. 없으면 그 계열의 선을 끊는다. */
    values: Readonly<Record<string, number | undefined>>
}

type MarkerLineColors = {
    /** 바닥선. */
    baseline: string
    /** 항목 칸 사이 점선. */
    divider: string
    /** 항목 이름. */
    category: string
    /** 빈 원 점의 안쪽 면. */
    dotFill: string
}

type MarkerLineChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly MarkerLineItem[]
    series: readonly MarkerLineSeries[]
    ariaLabel: string
    /** 선 · 글자 색. 넘기지 않은 항목은 웹 화면 시맨틱 색을 쓴다. */
    colors?: Partial<MarkerLineColors>
    /** 숨김 목록의 값 형식(기본: 천 단위 쉼표). */
    formatValue?: (value: number) => string
    /** 그림 폭(SVG 좌표). 기본 560, 한 줄 전체 폭 그래프는 1168. 높이 · 글자는 그대로다. */
    width?: number
    /** 그림 높이(SVG 좌표). 기본 300, 활동성정보 에너지 사용량은 240. 바닥선 = 높이 − 40, 항목 이름 = 높이 − 10. */
    height?: number
}

// 계열 순서별 선 · 점 모양(템플릿).
const MARKER_LINE_STYLES: readonly {dash?: string; isRoundCap?: boolean; marker: MarkerShape}[] = [
    {marker: 'circle'},
    {dash: '2 7', isRoundCap: true, marker: 'circle-filled'},
    {dash: '14 6 3 6', marker: 'square'},
    {dash: '9 7', marker: 'diamond'},
    {marker: 'triangle'},
]

const DEFAULT_COLORS: MarkerLineColors = {
    baseline: 'var(--ds-foreground-subtle)',
    divider: 'var(--ds-subtle-3)',
    category: 'var(--ds-foreground)',
    dotFill: 'var(--ds-card)',
}

// 치수(SVG 좌표).
const DEFAULT_WIDTH = 560
const DEFAULT_HEIGHT = 300
const PLOT_TOP = 16
// 바닥선 · 항목 이름 — 그림 아래 끝에서 위로(높이 300 → 260 · 290).
const BASELINE_FROM_BOTTOM = 40
const CATEGORY_FROM_BOTTOM = 10
const LINE_WIDTH = 3.5
const BASELINE_STROKE = 2
const DIVIDER_STROKE = 1.5
const DIVIDER_DASH = '4 5'
const FONT = {category: {size: 19, weight: 600}} as const
// 점 크기 — 그래프(큰 점)와 범례 견본(작은 점).
const MARKER_SIZES = {
    chart: {circle: 7, filled: 8, square: 14, diamond: 9, triangleHalf: 9.5, triangleHeight: 16, stroke: 3},
    legend: {circle: 5, filled: 6, square: 10, diamond: 7, triangleHalf: 7.5, triangleHeight: 12, stroke: 3},
} as const
const LEGEND_WIDTH = 40
const LEGEND_HEIGHT = 18
const LEGEND_LINE_WIDTH = 3
const LEGEND_LINE_INSET = 2
const TEN = 10
const MIXED_STEP_DIVISOR = 5

const numberFormat = new Intl.NumberFormat('ko-KR')
const round = (value: number) => Math.round(value * 10) / 10

// 값 범위 — 모두 0 이상이면 0 ~ 큰 끝을 윗자리 단위로 올림. 음수가 있으면 작은 끝은 윗자리 단위로 내리고, 큰 끝은 그 1/5 단위로 올림.
const valueDomain = (values: readonly number[]) => {
    const min = Math.min(0, ...values)
    const max = Math.max(0, ...values)
    const magnitude = Math.max(Math.abs(min), Math.abs(max), 1)
    const step = TEN ** Math.floor(Math.log10(magnitude))
    if (min >= 0) return {low: 0, high: Math.ceil(max / step) * step || step}
    const fineStep = step / MIXED_STEP_DIVISOR
    return {low: Math.floor(min / step) * step, high: Math.ceil(max / fineStep) * fineStep}
}

// 점 하나 — 모양 · 크기 · 색.
const Marker = ({
    shape,
    x,
    y,
    color,
    fill,
    size,
}: {
    shape: MarkerShape
    x: number
    y: number
    color: string
    fill: string
    size: (typeof MARKER_SIZES)[keyof typeof MARKER_SIZES]
}) => {
    if (shape === 'circle') {
        return (
            <circle cx={round(x)} cy={round(y)} r={size.circle} fill={fill} stroke={color} strokeWidth={size.stroke} />
        )
    }
    if (shape === 'circle-filled') return <circle cx={round(x)} cy={round(y)} r={size.filled} fill={color} />
    if (shape === 'square') {
        return (
            <rect
                x={round(x - size.square / 2)}
                y={round(y - size.square / 2)}
                width={size.square}
                height={size.square}
                fill={color}
            />
        )
    }
    if (shape === 'diamond') {
        const d = size.diamond
        return (
            <path
                d={`M${round(x)},${round(y - d)} L${round(x + d)},${round(y)} L${round(x)},${round(y + d)} L${round(x - d)},${round(y)} Z`}
                fill={color}
            />
        )
    }
    // 세모 — 무게중심이 점 자리에 오도록 꼭짓점을 높이의 9/16 위에 둔다(템플릿).
    const top = y - (size.triangleHeight * 9) / 16
    const bottom = top + size.triangleHeight
    return (
        <path
            d={`M${round(x)},${round(top)} L${round(x + size.triangleHalf)},${round(bottom)} L${round(x - size.triangleHalf)},${round(bottom)} Z`}
            fill={color}
        />
    )
}

const MarkerLineChart = ({
    data,
    series,
    ariaLabel,
    colors,
    formatValue = (value) => numberFormat.format(value),
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    className,
    ...props
}: MarkerLineChartProps) => {
    const baselineY = height - BASELINE_FROM_BOTTOM
    const categoryY = height - CATEGORY_FROM_BOTTOM
    const color = {...DEFAULT_COLORS, ...colors}
    const values = data.flatMap((item) =>
        series.map((line) => item.values[line.key]).filter((value): value is number => Number.isFinite(value)),
    )
    const {low, high} = valueDomain(values)
    const toY = (value: number) => baselineY - ((value - low) / (high - low)) * (baselineY - PLOT_TOP)
    const groupWidth = width / Math.max(data.length, 1)
    const toX = (index: number) => groupWidth * (index + 0.5)

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full">
                {data.slice(1).map((item, index) => (
                    <line
                        key={`divider-${item.id}`}
                        x1={round(groupWidth * (index + 1))}
                        y1={PLOT_TOP}
                        x2={round(groupWidth * (index + 1))}
                        y2={baselineY}
                        stroke={color.divider}
                        strokeWidth={DIVIDER_STROKE}
                        strokeDasharray={DIVIDER_DASH}
                    />
                ))}
                <line
                    x1={0}
                    y1={baselineY}
                    x2={width}
                    y2={baselineY}
                    stroke={color.baseline}
                    strokeWidth={BASELINE_STROKE}
                />
                {series.map((line, seriesIndex) => {
                    const style = MARKER_LINE_STYLES[seriesIndex % MARKER_LINE_STYLES.length]
                    const points = data.map((item, index) => {
                        const value = item.values[line.key]
                        return value === undefined || !Number.isFinite(value) ? null : {x: toX(index), y: toY(value)}
                    })
                    // 값이 있는 점끼리 이어지는 구간(값 없음에서 끊는다).
                    const segments = points
                        .reduce<{x: number; y: number}[][]>(
                            (acc, point) =>
                                point ? [...acc.slice(0, -1), [...(acc.at(-1) ?? []), point]] : [...acc, []],
                            [[]],
                        )
                        .filter((segment) => segment.length > 1)

                    return (
                        <g key={line.key}>
                            {segments.map((segment) => (
                                <polyline
                                    key={`${line.key}-${segment[0].x}`}
                                    points={segment.map((point) => `${round(point.x)},${round(point.y)}`).join(' ')}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth={LINE_WIDTH}
                                    strokeDasharray={style.dash}
                                    strokeLinecap={style.isRoundCap ? 'round' : undefined}
                                    strokeLinejoin="round"
                                />
                            ))}
                            {points.map((point, index) =>
                                point ? (
                                    <Marker
                                        key={`${line.key}-${data[index].id}`}
                                        shape={style.marker}
                                        x={point.x}
                                        y={point.y}
                                        color={line.color}
                                        fill={color.dotFill}
                                        size={MARKER_SIZES.chart}
                                    />
                                ) : null,
                            )}
                        </g>
                    )
                })}
                {data.map((item, index) => (
                    <text
                        key={`category-${item.id}`}
                        x={round(toX(index))}
                        y={categoryY}
                        textAnchor="middle"
                        fontSize={FONT.category.size}
                        fontWeight={FONT.category.weight}
                        fill={color.category}
                    >
                        {item.label}
                    </text>
                ))}
            </svg>
            <ul className="sr-only">
                {series.map((line) => (
                    <li key={line.key}>
                        {line.label}:{' '}
                        {data
                            .map((item) => {
                                const value = item.values[line.key]
                                return `${item.label} ${value === undefined || !Number.isFinite(value) ? '값 없음' : formatValue(value)}`
                            })
                            .join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    )
}

type MarkerLineLegendProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'> & {
    series: readonly MarkerLineSeries[]
    /** 빈 원 점의 안쪽 면 색. */
    dotFill?: string
}

// 범례 — 그래프와 같은 순서 · 모양의 선 견본(40 × 18) + 이름. 가운데 정렬로 접힌다. 글자 크기 · 색은 className 으로 준다.
// 그래프 이름 · 숨김 목록이 값을 읽으므로 견본 그림은 꾸밈이다(aria-hidden).
const MarkerLineLegend = ({series, dotFill = DEFAULT_COLORS.dotFill, className, ...props}: MarkerLineLegendProps) => (
    <ul {...props} className={cn('flex flex-wrap justify-center gap-x-4 gap-y-1.5', className)}>
        {series.map((line, index) => {
            const style = MARKER_LINE_STYLES[index % MARKER_LINE_STYLES.length]
            return (
                <li key={line.key} className="gap-kbx-7 flex items-center">
                    <svg
                        aria-hidden="true"
                        width={LEGEND_WIDTH}
                        height={LEGEND_HEIGHT}
                        viewBox={`0 0 ${LEGEND_WIDTH} ${LEGEND_HEIGHT}`}
                        className="shrink-0"
                    >
                        <line
                            x1={LEGEND_LINE_INSET}
                            y1={LEGEND_HEIGHT / 2}
                            x2={LEGEND_WIDTH - LEGEND_LINE_INSET}
                            y2={LEGEND_HEIGHT / 2}
                            stroke={line.color}
                            strokeWidth={LEGEND_LINE_WIDTH}
                            strokeDasharray={style.dash}
                            strokeLinecap={style.isRoundCap ? 'round' : undefined}
                        />
                        <Marker
                            shape={style.marker}
                            x={LEGEND_WIDTH / 2}
                            y={LEGEND_HEIGHT / 2}
                            color={line.color}
                            fill={dotFill}
                            size={MARKER_SIZES.legend}
                        />
                    </svg>
                    {line.label}
                </li>
            )
        })}
    </ul>
)

export {MARKER_LINE_STYLES, MarkerLineChart, MarkerLineLegend}
export type {
    MarkerLineChartProps,
    MarkerLineColors,
    MarkerLineItem,
    MarkerLineLegendProps,
    MarkerLineSeries,
    MarkerShape,
}
