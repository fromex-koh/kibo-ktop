import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 두 계열 꺾은선(DualLineChart) — 두 값(예: 신용 · 담보 비중)의 추이를 두 선으로 그리고, 점마다 값을 바로 적는다.
// 첫 계열은 실선 + 빈 원, 둘째 계열은 파선 + 마름모라 색 없이도 구분된다[5.3.1]. 범례(선 견본 + 이름)는 그래프 아래 가운데.
// K-BIGx 보고서 인쇄본 신용/재무정보 "신용/담보 비중" 그래프.
// (계열이 셋 이상이고 값 글자가 없는 추이는 MarkerLineChart, 한 계열 + 면은 ValueLineChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 560 × 290. 점은 항목 칸(폭 ÷ 항목 수) 가운데에 놓고, 칸 사이에 세로 점선(y 20 ~ 250)을 긋는다. 바닥선 = y 250.
//   두 계열을 합친 값 가운데 가장 큰 값이 y 83, 가장 작은 값이 y 207 — 그 사이는 값에 비례한다(세로축 없음).
//   선 굵기 3.5. 첫 계열 = 실선 · 빈 원(반지름 8 · 테두리 3) · 값 글자 계열 색 19px 굵게(700).
//   둘째 계열 = 파선(9 7) · 마름모(반지름 10) · 값 글자 옅은 글자 색 19px 600. 항목 이름 = y 280(19px).
//   범례 = 그래프 아래 10, 견본 40 × 18 · 견본과 이름 사이 8 · 항목 사이 28.
// 데이터에 따라
//   · 값 글자는 한 항목에서 큰 값은 점 18 위, 작은 값은 점 32 아래에 둔다 — 두 선이 엇갈려도 글자가 선 사이로 들어가지 않는다.
//   · 값이 모두 같으면 두 선을 가운데(y 145)에 둔다. 값이 없는 점(undefined)은 선을 끊고 점 · 글자를 그리지 않는다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
//
// [프론트엔드 연동] data 는 시간 순서대로 넘긴다. values 는 계열 key → 값. 계열 색은 series 의 color(웹 화면은 var(--ds-*),
//   인쇄본은 var(--kbx-color-*)), 나머지 선 · 글자 색은 colors 로 넘긴다.

type DualLineSeries = {
    key: string
    label: string
    /** 선 · 점 색(CSS 색 값). */
    color: string
}

type DualLineItem = {
    id: string
    label: string
    /** 계열 key → 값. 없으면 그 계열의 선을 끊는다. */
    values: Readonly<Record<string, number | undefined>>
}

type DualLineColors = {
    /** 항목 칸 사이 점선. */
    divider: string
    /** 바닥선. */
    baseline: string
    /** 항목 이름. */
    category: string
    /** 둘째 계열 값 글자. */
    value: string
    /** 빈 원 점의 안쪽 면. */
    dotFill: string
}

type DualLineChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly DualLineItem[]
    /** 두 계열 — 순서대로 실선 · 빈 원, 파선 · 마름모. */
    series: readonly [DualLineSeries, DualLineSeries]
    ariaLabel: string
    colors?: Partial<DualLineColors>
    /** 값 글자 형식(기본: 소수 첫째 자리까지, 0 은 지움 — 56.2 · 70). */
    formatValue?: (value: number) => string
    /** 범례 글자 크기 · 색. 기본 typo-body-m-regular text-foreground-subtle. */
    legendClassName?: string
}

const DEFAULT_COLORS: DualLineColors = {
    divider: 'var(--ds-subtle-3)',
    baseline: 'var(--ds-border)',
    category: 'var(--ds-foreground)',
    value: 'var(--ds-foreground-subtle)',
    dotFill: 'var(--ds-card)',
}

// 치수(SVG 좌표).
const WIDTH = 560
const HEIGHT = 290
const DIVIDER_TOP = 20
const BASELINE_Y = 250
const VALUE_TOP = 83
const VALUE_BOTTOM = 207
const CATEGORY_Y = 280
const LINE_WIDTH = 3.5
const DIVIDER_STROKE = 1.5
const DIVIDER_DASH = '4 5'
const BASELINE_STROKE = 2
const DOT_RADIUS = 8
const DOT_STROKE = 3
const DIAMOND_RADIUS = 10
const SECOND_DASH = '9 7'
const LABEL_ABOVE = 18
const LABEL_BELOW = 32
const FONT = {value: {size: 19}, category: {size: 19}} as const
const VALUE_WEIGHTS = [700, 600] as const
// 범례 견본(viewBox 40 × 18).
const LEGEND = {width: 40, height: 18, inset: 2, line: 3, dot: 6, dotStroke: 2.5, diamond: 7, dash: '6 4'} as const

const valueFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})
const round = (value: number) => Math.round(value * 10) / 10
const isValue = (value: number | undefined): value is number => value !== undefined && Number.isFinite(value)

const diamondPath = (x: number, y: number, radius: number) =>
    `M${round(x)},${round(y - radius)} L${round(x + radius)},${round(y)} L${round(x)},${round(y + radius)} L${round(x - radius)},${round(y)} Z`

const DualLineChart = ({
    data,
    series,
    ariaLabel,
    colors,
    formatValue = (value) => valueFormat.format(value),
    legendClassName,
    className,
    ...props
}: DualLineChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const values = data.flatMap((item) => series.map((line) => item.values[line.key]).filter(isValue))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const toY = (value: number) =>
        max > min
            ? VALUE_BOTTOM - ((value - min) / (max - min)) * (VALUE_BOTTOM - VALUE_TOP)
            : (VALUE_TOP + VALUE_BOTTOM) / 2
    const groupWidth = WIDTH / Math.max(data.length, 1)
    const toX = (index: number) => groupWidth * (index + 0.5)
    // 계열마다 점 — 값이 없으면 null.
    const points = series.map((line) =>
        data.map((item, index) => {
            const value = item.values[line.key]
            return isValue(value) ? {x: toX(index), y: toY(value), value} : null
        }),
    )
    // 한 항목에서 다른 계열보다 크거나 같으면 값 글자를 위에 둔다(같으면 둘째 계열이 위).
    const isAbove = (seriesIndex: number, index: number) => {
        const own = points[seriesIndex][index]
        const other = points[1 - seriesIndex][index]
        if (!own || !other) return seriesIndex === 1
        return own.value === other.value ? seriesIndex === 1 : own.value > other.value
    }

    return (
        <div className={cn('flex w-full flex-col gap-2.5', className)} {...props}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full">
                {data.slice(1).map((item, index) => (
                    <line
                        key={`divider-${item.id}`}
                        x1={round(groupWidth * (index + 1))}
                        y1={DIVIDER_TOP}
                        x2={round(groupWidth * (index + 1))}
                        y2={BASELINE_Y}
                        stroke={color.divider}
                        strokeWidth={DIVIDER_STROKE}
                        strokeDasharray={DIVIDER_DASH}
                    />
                ))}
                <line
                    x1={0}
                    y1={BASELINE_Y}
                    x2={WIDTH}
                    y2={BASELINE_Y}
                    stroke={color.baseline}
                    strokeWidth={BASELINE_STROKE}
                />
                {/* 선 — 둘째 계열(파선)을 먼저 그려 첫 계열 실선이 위에 온다. */}
                {[1, 0].map((seriesIndex) => {
                    const line = series[seriesIndex]
                    // 값이 있는 점끼리 이어지는 구간(값 없음에서 끊는다).
                    const segments = points[seriesIndex]
                        .reduce<{x: number; y: number}[][]>(
                            (acc, point) =>
                                point ? [...acc.slice(0, -1), [...(acc.at(-1) ?? []), point]] : [...acc, []],
                            [[]],
                        )
                        .filter((segment) => segment.length > 1)
                    return segments.map((segment) => (
                        <polyline
                            key={`${line.key}-${segment[0].x}`}
                            points={segment.map((point) => `${round(point.x)},${round(point.y)}`).join(' ')}
                            fill="none"
                            stroke={line.color}
                            strokeWidth={LINE_WIDTH}
                            strokeDasharray={seriesIndex === 1 ? SECOND_DASH : undefined}
                        />
                    ))
                })}
                {series.map((line, seriesIndex) =>
                    points[seriesIndex].map((point, index) => {
                        if (!point) return null
                        const labelY = isAbove(seriesIndex, index) ? point.y - LABEL_ABOVE : point.y + LABEL_BELOW
                        return (
                            <g key={`${line.key}-${data[index].id}`}>
                                {seriesIndex === 0 ? (
                                    <circle
                                        cx={round(point.x)}
                                        cy={round(point.y)}
                                        r={DOT_RADIUS}
                                        fill={color.dotFill}
                                        stroke={line.color}
                                        strokeWidth={DOT_STROKE}
                                    />
                                ) : (
                                    <path d={diamondPath(point.x, point.y, DIAMOND_RADIUS)} fill={line.color} />
                                )}
                                <text
                                    x={round(point.x)}
                                    y={round(labelY)}
                                    textAnchor="middle"
                                    fontSize={FONT.value.size}
                                    fontWeight={VALUE_WEIGHTS[seriesIndex]}
                                    fill={seriesIndex === 0 ? line.color : color.value}
                                >
                                    {formatValue(point.value)}
                                </text>
                            </g>
                        )
                    }),
                )}
                {data.map((item, index) => (
                    <text
                        key={`category-${item.id}`}
                        x={round(toX(index))}
                        y={CATEGORY_Y}
                        textAnchor="middle"
                        fontSize={FONT.category.size}
                        fill={color.category}
                    >
                        {item.label}
                    </text>
                ))}
            </svg>
            {/* 범례 견본은 꾸밈이다(aria-hidden) — 그래프 이름 · 숨김 목록이 값을 읽는다. */}
            <ul
                className={cn(
                    'flex flex-wrap justify-center gap-x-7 gap-y-1.5',
                    legendClassName ?? 'typo-body-m-regular text-foreground-subtle',
                )}
            >
                {series.map((line, seriesIndex) => (
                    <li key={line.key} className="flex items-center gap-2">
                        <svg
                            aria-hidden="true"
                            width={LEGEND.width}
                            height={LEGEND.height}
                            viewBox={`0 0 ${LEGEND.width} ${LEGEND.height}`}
                            className="shrink-0"
                        >
                            <line
                                x1={LEGEND.inset}
                                y1={LEGEND.height / 2}
                                x2={LEGEND.width - LEGEND.inset}
                                y2={LEGEND.height / 2}
                                stroke={line.color}
                                strokeWidth={LEGEND.line}
                                strokeDasharray={seriesIndex === 1 ? LEGEND.dash : undefined}
                            />
                            {seriesIndex === 0 ? (
                                <circle
                                    cx={LEGEND.width / 2}
                                    cy={LEGEND.height / 2}
                                    r={LEGEND.dot}
                                    fill={color.dotFill}
                                    stroke={line.color}
                                    strokeWidth={LEGEND.dotStroke}
                                />
                            ) : (
                                <path
                                    d={diamondPath(LEGEND.width / 2, LEGEND.height / 2, LEGEND.diamond)}
                                    fill={line.color}
                                />
                            )}
                        </svg>
                        {line.label}
                    </li>
                ))}
            </ul>
            <ul className="sr-only">
                {series.map((line) => (
                    <li key={line.key}>
                        {line.label}:{' '}
                        {data
                            .map((item) => {
                                const value = item.values[line.key]
                                return `${item.label} ${isValue(value) ? formatValue(value) : '값 없음'}`
                            })
                            .join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {DualLineChart}
export type {DualLineChartProps, DualLineColors, DualLineItem, DualLineSeries}
