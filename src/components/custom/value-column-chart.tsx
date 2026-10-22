import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 값 막대(ValueColumnChart) — 항목마다 막대 하나를 세우고 막대 위에 값을, 바닥선 아래에 항목 이름을 적는다.
// 세로축 · 눈금 없이 값 글자로 읽는다. 강조 항목(isHighlighted — 예: 신청기업)은 색 · 글자를 달리한다.
// K-BIGx 보고서 인쇄본 Tech-Index "기업 유형별 Tech-Index 비교"(wide) · "4대 혁신역량 부분별 비교" 카드(compact) ·
// 진단브리핑 "인당 매출액"(narrow).
// (세로축 · 툴팁이 있는 웹 화면용 막대는 ColumnChart.)
//
// 짜임(단위는 SVG 좌표 = 용지 px)
//   wide    그림 1168 × 338. 좌우 여백 20 · 칸 사이 40 으로 칸을 나누고 칸 가운데 폭 64 막대(모든 막대 같은 폭).
//           바닥선 y 299(짙은 선 2 — 막대 칸 300). 가장 큰 값(또는 max)이 높이 260. 값 글자 22px(강조 24px · 강조 색),
//           이름 21px 굵게(바닥선 아래 10).
//   compact 그림 230 × 290(카드 안). 칸마다 폭 64 막대, 칸 사이 세로 점선. 바닥선 y 250(옅은 선 2).
//           0~100 눈금(max 기본 100)이 높이 220. 값 글자 19px(강조 항목 가장 굵게 · 나머지 옅게), 이름 18px.
//   narrow  그림 360 × 440(두 칸 중 좁은 칸). 칸마다 폭 64 막대, 칸 사이 세로 점선. 바닥선 y 370(옅은 선 2).
//           가장 큰 값(또는 max)이 높이 308. 값 글자 19px 굵게(막대 끝 16 위), 이름 17px(600) y 408.
//   모두 막대 위 모서리 둥글림 8, 값 글자는 막대 끝 위.
// 데이터에 따라
//   · 0 이하 값은 막대 없이 값 글자만 바닥선 위에 적는다. max 를 넘는 값은 max 높이로 맞춘다.
//   · 항목 이름이 칸보다 길면 띄어쓰기 자리에서 줄을 바꾸고 그림 높이를 그만큼 늘린다.
//   · 값 글자가 칸보다 길면(항목이 많거나 값이 큼) 모든 값 글자를 같은 비율로 줄인다(최소 12px).
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
//
// [프론트엔드 연동] data 는 화면에 그릴 순서로 넘긴다(정렬하지 않는다). 막대 색은 항목 color(없으면 colors.bar ·
//   강조는 colors.highlight)로, 선 · 글자 색은 colors(CSS 색 값)로 넘긴다(웹 화면은 var(--ds-*), 인쇄본은 var(--kbx-color-*)).

type ValueColumnItem = {
    id: string
    label: string
    value: number
    /** 막대 색(CSS 색 값). 없으면 colors.bar(강조 항목은 colors.highlight). */
    color?: string
    /** 강조 항목 — 예: 신청기업. */
    isHighlighted?: boolean
    /** 값 글자 — 주면 formatValue(value) 대신 이 글자를 적는다(예: 값이 없는 고정 항목의 '-'). */
    valueText?: string
}

type ValueColumnColors = {
    bar: string
    /** 강조 막대 · 글자(wide). */
    highlight: string
    baseline: string
    /** 칸 사이 점선(compact). */
    divider: string
    /** 값 글자(wide 의 기본 항목 · compact 의 강조 항목). */
    value: string
    /** compact 의 강조 아닌 값 글자. */
    mutedValue: string
    category: string
}

type ValueColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly ValueColumnItem[]
    ariaLabel: string
    /** 'wide' 쪽 폭 막대 · 'compact' 카드 안 작은 막대 · 'narrow' 두 칸 중 좁은 칸(360) 막대. */
    variant?: 'wide' | 'compact' | 'narrow'
    /** 높이 끝 값. wide 는 기본 가장 큰 값, compact 는 기본 100. */
    max?: number
    colors?: Partial<ValueColumnColors>
    /** 값 글자 형식(기본: 소수 첫째 자리까지 — 46 → 46.0). */
    formatValue?: (value: number) => string
}

const DEFAULT_COLORS: ValueColumnColors = {
    bar: 'var(--ds-blue-500)',
    highlight: 'var(--ds-purple-500)',
    baseline: 'var(--ds-foreground)',
    divider: 'var(--ds-subtle-3)',
    value: 'var(--ds-foreground)',
    mutedValue: 'var(--ds-foreground-subtle)',
    category: 'var(--ds-foreground)',
}

// 모양별 치수 · 글자.
const LAYOUT = {
    wide: {
        width: 1168,
        height: 338,
        paddingX: 20,
        columnGap: 40,
        barWidthRatio: 1,
        maxBarWidth: 64,
        baselineY: 299,
        plotHeight: 260,
        valueOffset: 12,
        categoryY: 330,
        hasDividers: false,
        font: {
            value: {size: 22, weight: 800},
            highlightValue: {size: 24, weight: 900},
            category: {size: 21, weight: 700},
            highlightCategory: {size: 21, weight: 800},
        },
    },
    compact: {
        width: 230,
        height: 290,
        paddingX: 0,
        columnGap: 0,
        barWidthRatio: 0.56,
        maxBarWidth: 64,
        baselineY: 250,
        plotHeight: 220,
        valueOffset: 9,
        categoryY: 280,
        hasDividers: true,
        font: {
            value: {size: 19, weight: 600},
            highlightValue: {size: 19, weight: 800},
            category: {size: 18, weight: 400},
            highlightCategory: {size: 18, weight: 400},
        },
    },
    narrow: {
        width: 360,
        height: 440,
        paddingX: 0,
        columnGap: 0,
        barWidthRatio: 1,
        maxBarWidth: 64,
        baselineY: 370,
        /** 가장 큰 값이 그리는 높이 — 칸(y 20 ~ 370)의 88%. */
        plotHeight: 308,
        valueOffset: 16,
        categoryY: 408,
        hasDividers: true,
        font: {
            value: {size: 19, weight: 700},
            highlightValue: {size: 19, weight: 800},
            category: {size: 17, weight: 600},
            highlightCategory: {size: 17, weight: 600},
        },
    },
} as const
const BAR_RADIUS = 8
const BASELINE_STROKE = 2
const DIVIDER_TOP = 20
const DIVIDER_STROKE = 1.5
const DIVIDER_DASH = '4 5'
const COMPACT_MAX = 100
const CATEGORY_LINE_HEIGHT = 24
// 값 글자가 칸에 들어가지 않을 때 줄이는 한계 · 이웃 값 글자 사이 최소 간격.
const MIN_VALUE_FONT_SIZE = 12
const VALUE_GAP = 8
const CATEGORY_PADDING = 8
// 글자 폭 어림(글자 크기 대비) — 한글 0.9 · 그 밖 0.6.
const WIDE_RATIO = 0.9
const NARROW_RATIO = 0.6
const WIDE_CHAR_START = 0x1100

const round = (value: number) => Math.round(value * 10) / 10
const valueFormat = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const estimateWidth = (text: string, fontSize: number) =>
    [...text].reduce(
        (sum, char) => sum + fontSize * ((char.codePointAt(0) ?? 0) >= WIDE_CHAR_START ? WIDE_RATIO : NARROW_RATIO),
        0,
    )

// 항목 이름 접기 — 칸 폭을 넘으면 띄어쓰기 자리에서 줄을 바꾼다(한 낱말이 칸보다 길면 그대로 둔다).
const wrapLabel = (text: string, fontSize: number, maxWidth: number) =>
    text.split(' ').reduce<string[]>((lines, word) => {
        const last = lines.at(-1)
        return last !== undefined && estimateWidth(`${last} ${word}`, fontSize) <= maxWidth
            ? [...lines.slice(0, -1), `${last} ${word}`]
            : [...lines, word]
    }, [])

// 위만 둥근 막대.
const barPath = (x: number, width: number, baselineY: number, endY: number) => {
    const radius = Math.min(BAR_RADIUS, baselineY - endY, width / 2)
    const right = x + width
    return [
        `M${round(x)},${baselineY}`,
        `V${round(endY + radius)}`,
        `Q${round(x)},${round(endY)} ${round(x + radius)},${round(endY)}`,
        `H${round(right - radius)}`,
        `Q${round(right)},${round(endY)} ${round(right)},${round(endY + radius)}`,
        `V${baselineY} Z`,
    ].join(' ')
}

const ValueColumnChart = ({
    data,
    ariaLabel,
    variant = 'wide',
    max,
    colors,
    formatValue = (value) => valueFormat.format(value),
    className,
    ...props
}: ValueColumnChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const layout = LAYOUT[variant]
    const count = Math.max(data.length, 1)
    const columnWidth = (layout.width - layout.paddingX * 2 - layout.columnGap * (count - 1)) / count
    const barWidth = Math.min(layout.maxBarWidth, columnWidth * layout.barWidthRatio)
    const scaleMax = max ?? (variant === 'compact' ? COMPACT_MAX : Math.max(0, ...data.map((item) => item.value)))
    const barHeight = (value: number) =>
        scaleMax > 0 ? (Math.min(scaleMax, Math.max(0, value)) / scaleMax) * layout.plotHeight : 0
    const center = (index: number) => layout.paddingX + (columnWidth + layout.columnGap) * index + columnWidth / 2
    const labelLines = data.map((item) =>
        wrapLabel(item.label, layout.font.category.size, columnWidth + layout.columnGap - CATEGORY_PADDING),
    )
    const extraLines = Math.max(0, ...labelLines.map((lines) => lines.length - 1))
    // 값 글자가 칸(막대 칸 + 칸 사이)보다 길면 모든 값 글자를 같은 비율로 줄인다(최소 12px). 들어가면 그대로다.
    const slotWidth = columnWidth + layout.columnGap - VALUE_GAP
    const widestValue = Math.max(
        0,
        ...data.map((item) =>
            estimateWidth(
                item.valueText ?? formatValue(item.value),
                (item.isHighlighted ? layout.font.highlightValue : layout.font.value).size,
            ),
        ),
    )
    const valueScale = widestValue > slotWidth ? slotWidth / widestValue : 1
    const height = layout.height + extraLines * CATEGORY_LINE_HEIGHT

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg
                role="img"
                aria-label={ariaLabel}
                viewBox={`0 0 ${layout.width} ${height}`}
                className="block h-auto w-full"
            >
                {layout.hasDividers
                    ? data.slice(1).map((item, index) => {
                          const x = round(layout.paddingX + (columnWidth + layout.columnGap) * (index + 1))
                          return (
                              <line
                                  key={`divider-${item.id}`}
                                  x1={x}
                                  y1={DIVIDER_TOP}
                                  x2={x}
                                  y2={layout.baselineY}
                                  stroke={color.divider}
                                  strokeWidth={DIVIDER_STROKE}
                                  strokeDasharray={DIVIDER_DASH}
                              />
                          )
                      })
                    : null}
                {data.map((item, index) => {
                    const x = center(index)
                    const endY = layout.baselineY - barHeight(item.value)
                    const isHighlighted = Boolean(item.isHighlighted)
                    const valueFont = isHighlighted ? layout.font.highlightValue : layout.font.value
                    const categoryFont = isHighlighted ? layout.font.highlightCategory : layout.font.category
                    const fill = item.color ?? (isHighlighted ? color.highlight : color.bar)
                    // wide 는 강조 항목 글자를 강조 색으로, compact · narrow 는 강조 항목 값만 진하게(나머지는 mutedValue).
                    const valueColor =
                        variant === 'wide'
                            ? isHighlighted
                                ? color.highlight
                                : color.value
                            : isHighlighted
                              ? color.value
                              : color.mutedValue
                    const categoryColor = variant === 'wide' && isHighlighted ? color.highlight : color.category

                    return (
                        <g key={item.id}>
                            {endY < layout.baselineY ? (
                                <path d={barPath(x - barWidth / 2, barWidth, layout.baselineY, endY)} fill={fill} />
                            ) : null}
                            <text
                                x={round(x)}
                                y={round(endY - layout.valueOffset)}
                                textAnchor="middle"
                                fontSize={Math.max(MIN_VALUE_FONT_SIZE, round(valueFont.size * valueScale))}
                                fontWeight={valueFont.weight}
                                fill={valueColor}
                            >
                                {item.valueText ?? formatValue(item.value)}
                            </text>
                            <text
                                x={round(x)}
                                y={layout.categoryY}
                                textAnchor="middle"
                                fontSize={categoryFont.size}
                                fontWeight={categoryFont.weight}
                                fill={categoryColor}
                            >
                                {labelLines[index].map((line, lineIndex) => (
                                    <tspan
                                        key={`${lineIndex}-${line}`}
                                        x={round(x)}
                                        dy={lineIndex ? CATEGORY_LINE_HEIGHT : 0}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                        </g>
                    )
                })}
                <line
                    x1={0}
                    y1={layout.baselineY}
                    x2={layout.width}
                    y2={layout.baselineY}
                    stroke={color.baseline}
                    strokeWidth={BASELINE_STROKE}
                />
            </svg>
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}: {item.valueText ?? formatValue(item.value)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {ValueColumnChart}
export type {ValueColumnChartProps, ValueColumnColors, ValueColumnItem}
