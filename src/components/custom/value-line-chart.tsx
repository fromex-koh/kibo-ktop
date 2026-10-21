import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 값 꺾은선(ValueLineChart) — 한 계열의 추이를 면 + 꺾은선 + 점으로 그리고, 점마다 값을 바로 적는다. 세로축 없이 값 글자로 읽는다.
// K-BIGx 보고서 인쇄본 진단브리핑 "분기별 종업원수"(narrow) · 활동성정보 "분기별 종업원수"(medium) ·
// 신용/재무정보 "차입금 변동률"(compact) 그래프.
// (세로축 · 툴팁 · 여러 계열이 있는 웹 화면용 선 그래프는 LineChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 폭 1168 × 높이 440. 점은 x 60 ~ 1144 사이에 같은 간격으로 놓고, 점마다 세로 점선(y 20 ~ 370)을 긋는다.
//   바닥선 = y 370(x 20 ~ 1168). 값 범위는 가장 작은 · 큰 값을 윗자리 단위로 내리고 올린 값(25 ~ 39 → 20 ~ 40)이고,
//   큰 끝이 y 40 · 작은 끝이 바닥선이다. 면은 선 아래를 바닥선까지 옅게(8%) 채운다.
//   선 굵기 4 · 점 = 흰 면 + 테두리 3 · 반지름 7. 값 글자 = 점 18.5 위(21px 굵게), 기간 이름 = y 408(19px).
//   medium = 높이 340 · 바닥선 y 290 · 기간 이름 y 320 — 나머지는 compact 와 같다(활동성정보 분기별 종업원수).
//   compact = 높이 290 · 세로 점선 y 14 ~ 250 · 큰 끝 y 30 · 바닥선 y 250 · 점 반지름 6 · 값 글자 점 17 위(20px 굵게) ·
//   기간 이름 y 278(18px). 폭 · 점 간격 · 값 범위 규칙은 같다.
//   narrow = 폭 752(높이 · 세로 위치 · 점 · 값 글자는 기본과 같다) · 점 x 40 ~ 712 · 바닥선 x 0 ~ 752 · 기간 이름 17px.
// 데이터에 따라
//   · 값이 모두 같으면 범위를 한 단위 넓혀 선을 가운데쯤에 둔다. 점이 하나면 가운데에 둔다.
//   · 기간 이름이 그림 끝을 넘으면 안쪽으로 당긴다(템플릿 마지막 25.09월 x 1144 → 1136).
//   · 점이 많아 기간 이름이 겹치면 몇 칸씩 건너뛰어 적는다(처음 · 마지막은 늘 적음). 값 글자가 겹치면 값 글자를 줄인다(최소 12px).
//   · 값이 없는 점(undefined)은 선을 끊고 점 · 글자를 그리지 않는다.
//   · 값 글자 뒤에 바탕색(colors.dotFill) 테두리를 깔아 선이 글자를 지나가도 읽힌다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
//
// [프론트엔드 연동] data 는 시간 순서대로 넘긴다. 선 · 면 · 점 테두리 색은 color, 나머지 선 · 글자 색은 colors 로 넘긴다
//   (웹 화면은 var(--ds-*), 인쇄본은 var(--kbx-color-*)).

type ValueLineItem = {
    id: string
    /** 기간 이름(예: 23.03월). */
    label: string
    /** 값. 없으면 그 자리에서 선을 끊는다. */
    value: number | undefined
}

type ValueLineColors = {
    /** 점마다 긋는 세로 점선. */
    grid: string
    /** 바닥선. */
    baseline: string
    /** 값 글자. */
    value: string
    /** 기간 이름. */
    label: string
    /** 점 안쪽 면. */
    dotFill: string
}

type ValueLineChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly ValueLineItem[]
    ariaLabel: string
    /** 선 · 면 · 점 테두리 색(CSS 색 값). */
    color?: string
    /** 선 · 글자 색. 넘기지 않은 항목은 웹 화면 시맨틱 색을 쓴다. */
    colors?: Partial<ValueLineColors>
    /** 값 글자 형식(기본: 천 단위 쉼표). */
    formatValue?: (value: number) => string
    /**
     * 크기 — 기본 1168 × 440, medium 1168 × 340(활동성정보 분기별 종업원수), compact 1168 × 290(차입금 변동률),
     * narrow 752 × 440(진단브리핑 분기별 종업원수 — 인당 매출액과 두 칸).
     */
    variant?: 'default' | 'medium' | 'compact' | 'narrow'
}

const DEFAULT_COLOR = 'var(--ds-chart-1)'
const DEFAULT_COLORS: ValueLineColors = {
    grid: 'var(--ds-subtle-3)',
    baseline: 'var(--ds-border)',
    value: 'var(--ds-foreground)',
    label: 'var(--ds-foreground-subtle)',
    dotFill: 'var(--ds-card)',
}

// 치수(SVG 좌표).
// 폭 · 점 가로 범위 · 바닥선 시작 — default · medium · compact 는 쪽 폭(1168), narrow 는 두 칸 중 넓은 칸(752).
const WIDE_FRAME = {width: 1168, xStart: 60, xEnd: 1144, baselineX: 20}
const LINE_WIDTH = 4
const GRID_STROKE = 1.5
const GRID_DASH = '5 6'
const BASELINE_STROKE = 2
const AREA_OPACITY = 0.08
const DOT_STROKE = 3
// 값 글자 뒤 바탕색 테두리 굵기.
const VALUE_HALO_WIDTH = 4
// 높이 · 세로 위치 · 점 · 글자 — 변형마다.
const GEOMETRY = {
    default: {
        ...WIDE_FRAME,
        height: 440,
        gridTop: 20,
        plotTop: 40,
        baselineY: 370,
        labelY: 408,
        dotRadius: 7,
        valueOffset: 18.5,
        font: {value: {size: 21, weight: 700}, label: {size: 19, weight: 400}},
    },
    medium: {
        ...WIDE_FRAME,
        height: 340,
        gridTop: 14,
        plotTop: 30,
        baselineY: 290,
        labelY: 320,
        dotRadius: 6,
        valueOffset: 17,
        font: {value: {size: 20, weight: 700}, label: {size: 18, weight: 400}},
    },
    compact: {
        ...WIDE_FRAME,
        height: 290,
        gridTop: 14,
        plotTop: 30,
        baselineY: 250,
        labelY: 278,
        dotRadius: 6,
        valueOffset: 17,
        font: {value: {size: 20, weight: 700}, label: {size: 18, weight: 400}},
    },
    narrow: {
        width: 752,
        xStart: 40,
        xEnd: 712,
        baselineX: 0,
        height: 440,
        gridTop: 20,
        plotTop: 40,
        baselineY: 370,
        labelY: 408,
        dotRadius: 7,
        valueOffset: 18.5,
        font: {value: {size: 21, weight: 700}, label: {size: 17, weight: 400}},
    },
} as const
const MIN_VALUE_FONT_SIZE = 12
// 글자를 그림 끝 안쪽으로 당길 때 남기는 폭(템플릿: 마지막 기간 이름 오른쪽 끝 = 그림 끝) · 이웃 글자 사이 최소 간격.
const EDGE_PADDING = 0
const LABEL_GAP = 8
// 글자 폭 어림(글자 크기 대비) — Pretendard 실측(굵은 숫자 0.615 · 보통 숫자 0.56 · 쉼표 · 점 0.29 · 한글 0.86).
const DIGIT_RATIO = 0.615
const REGULAR_DIGIT_RATIO = 0.56
const PUNCT_RATIO = 0.29
const WIDE_RATIO = 0.9
const WIDE_CHAR_START = 0x1100
const TEN = 10

const numberFormat = new Intl.NumberFormat('ko-KR')
const round = (value: number) => Math.round(value * 10) / 10

const estimateWidth = (text: string, fontSize: number, digitRatio = DIGIT_RATIO) =>
    [...text].reduce(
        (sum, char) =>
            sum +
            fontSize *
                ((char.codePointAt(0) ?? 0) >= WIDE_CHAR_START
                    ? WIDE_RATIO
                    : char === ',' || char === '.'
                      ? PUNCT_RATIO
                      : digitRatio),
        0,
    )

// 값 범위 — 가장 큰 값의 윗자리 단위로 작은 끝은 내리고 큰 끝은 올린다(25 ~ 39 → 20 ~ 40). 같으면 한 단위 넓힌다.
const valueDomain = (values: readonly number[]) => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const magnitude = Math.max(Math.abs(min), Math.abs(max), 1)
    const step = TEN ** Math.floor(Math.log10(magnitude))
    const low = Math.floor(min / step) * step
    const high = Math.ceil(max / step) * step
    return high > low ? {low, high} : {low: low - step, high: high + step}
}

const ValueLineChart = ({
    data,
    ariaLabel,
    color = DEFAULT_COLOR,
    colors,
    formatValue = (value) => numberFormat.format(value),
    variant = 'default',
    className,
    ...props
}: ValueLineChartProps) => {
    const geometry = GEOMETRY[variant]
    const palette = {...DEFAULT_COLORS, ...colors}
    const values = data.map((item) => item.value).filter((value): value is number => Number.isFinite(value))
    const {low, high} = valueDomain(values.length ? values : [0])
    const toY = (value: number) =>
        geometry.baselineY - ((value - low) / (high - low)) * (geometry.baselineY - geometry.plotTop)
    const spacing = data.length > 1 ? (geometry.xEnd - geometry.xStart) / (data.length - 1) : 0
    const toX = (index: number) => (data.length > 1 ? geometry.xStart + spacing * index : geometry.width / 2)
    const points = data.map((item, index) => ({
        item,
        x: toX(index),
        y: item.value === undefined || !Number.isFinite(item.value) ? null : toY(item.value),
    }))
    // 값이 있는 점끼리 이어지는 구간(값 없음에서 끊는다).
    const segments = points
        .reduce<{x: number; y: number}[][]>(
            (acc, point) => {
                if (point.y === null) return [...acc, []]
                const last = acc.at(-1) ?? []
                return [...acc.slice(0, -1), [...last, {x: point.x, y: point.y}]]
            },
            [[]],
        )
        .filter((segment) => segment.length)

    // 기간 이름 — 겹치면 몇 칸씩 건너뛴다(처음 · 마지막은 늘 적는다).
    const labelWidthOf = (text: string) => estimateWidth(text, geometry.font.label.size, REGULAR_DIGIT_RATIO)
    const labelWidth = Math.max(0, ...data.map((item) => labelWidthOf(item.label)))
    const labelStep = spacing ? Math.max(1, Math.ceil((labelWidth + LABEL_GAP) / spacing)) : 1
    const isLabelShown = (index: number) =>
        index === 0 || index === data.length - 1 || (index % labelStep === 0 && data.length - 1 - index >= labelStep)
    const clampX = (x: number, width: number) =>
        Math.min(geometry.width - EDGE_PADDING - width / 2, Math.max(EDGE_PADDING + width / 2, x))
    // 값 글자 — 이웃 값 글자가 겹치면 겹치지 않을 만큼 줄인다.
    const valueWidth = Math.max(
        0,
        ...values.map((value) => estimateWidth(formatValue(value), geometry.font.value.size)),
    )
    const valueFontSize =
        spacing && valueWidth + LABEL_GAP > spacing
            ? Math.max(MIN_VALUE_FONT_SIZE, (geometry.font.value.size * (spacing - LABEL_GAP)) / valueWidth)
            : geometry.font.value.size

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg
                role="img"
                aria-label={ariaLabel}
                viewBox={`0 0 ${geometry.width} ${geometry.height}`}
                className="block h-auto w-full"
            >
                {points.map((point) => (
                    <line
                        key={`grid-${point.item.id}`}
                        x1={round(point.x)}
                        y1={geometry.gridTop}
                        x2={round(point.x)}
                        y2={geometry.baselineY}
                        stroke={palette.grid}
                        strokeWidth={GRID_STROKE}
                        strokeDasharray={GRID_DASH}
                    />
                ))}
                <line
                    x1={geometry.baselineX}
                    y1={geometry.baselineY}
                    x2={geometry.width}
                    y2={geometry.baselineY}
                    stroke={palette.baseline}
                    strokeWidth={BASELINE_STROKE}
                />
                {segments.map((segment) => {
                    const line = segment.map((point) => `${round(point.x)},${round(point.y)}`).join(' ')
                    const first = segment[0]
                    const last = segment.at(-1) ?? first

                    return (
                        <g key={`segment-${first.x}`}>
                            <polygon
                                points={`${line} ${round(last.x)},${geometry.baselineY} ${round(first.x)},${geometry.baselineY}`}
                                fill={color}
                                opacity={AREA_OPACITY}
                            />
                            <polyline
                                points={line}
                                fill="none"
                                stroke={color}
                                strokeWidth={LINE_WIDTH}
                                strokeLinejoin="round"
                            />
                        </g>
                    )
                })}
                <g fill={palette.dotFill} stroke={color} strokeWidth={DOT_STROKE}>
                    {points.map((point) =>
                        point.y === null ? null : (
                            <circle
                                key={point.item.id}
                                cx={round(point.x)}
                                cy={round(point.y)}
                                r={geometry.dotRadius}
                            />
                        ),
                    )}
                </g>
                {/* 값 글자 뒤에 바탕색 테두리(점 안쪽 색)를 깔아, 값이 크게 오르내려 선이 글자를 지나가도 읽힌다. */}
                <g
                    fill={palette.value}
                    fontSize={round(valueFontSize)}
                    fontWeight={geometry.font.value.weight}
                    textAnchor="middle"
                    stroke={palette.dotFill}
                    strokeWidth={VALUE_HALO_WIDTH}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                >
                    {points.map((point) => {
                        if (point.y === null || point.item.value === undefined) return null
                        const text = formatValue(point.item.value)
                        return (
                            <text
                                key={point.item.id}
                                x={round(clampX(point.x, estimateWidth(text, valueFontSize)))}
                                y={round(point.y - geometry.valueOffset)}
                            >
                                {text}
                            </text>
                        )
                    })}
                </g>
                <g
                    fill={palette.label}
                    fontSize={geometry.font.label.size}
                    fontWeight={geometry.font.label.weight}
                    textAnchor="middle"
                >
                    {points.map((point, index) =>
                        isLabelShown(index) ? (
                            <text
                                key={point.item.id}
                                x={round(clampX(point.x, labelWidthOf(point.item.label)))}
                                y={geometry.labelY}
                            >
                                {point.item.label}
                            </text>
                        ) : null,
                    )}
                </g>
            </svg>
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}:{' '}
                        {item.value === undefined || !Number.isFinite(item.value) ? '값 없음' : formatValue(item.value)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {ValueLineChart}
export type {ValueLineChartProps, ValueLineColors, ValueLineItem}
