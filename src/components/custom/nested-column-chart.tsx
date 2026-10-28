import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 겹친 막대(NestedColumnChart) — 항목(예: 연도)마다 넓은 기준 막대(예: 총자산) 안에 구성 막대(예: 부채총계 · 자본총계)를
// 겹쳐 세우고, 막대마다 값을 바로 적는다. 세로축 없이 값 글자로 읽는다.
// K-BIGx 보고서 인쇄본 기업현황 "재무상태 · 손익현황" 그래프. (세로축 · 툴팁이 있는 웹 화면용은 OverlayColumnChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 폭 560 × 높이 354. 항목 칸은 폭을 항목 수로 똑같이 나누고, 칸 사이에 세로 점선(y 20 ~ 300)을 긋는다.
//   바닥선(0 선) = y 300. 가장 큰 값의 막대 끝이 y 53.6(바닥선 위 246.4)에 오도록 맞춘다.
//   기준 막대 = 폭 108 · 칸 가운데. 구성 막대 = 폭 30 · 기준 막대 안 양끝에서 16 안쪽부터 같은 간격. 모서리 둥글림 8.
//   값 글자 = 막대 끝 위(기준 9 · 17px, 구성 7 · 15.5px, 굵기 600). 항목 이름 = y 348(19px 600).
// 데이터에 따라
//   · 음수(예: 당기순이익 적자 · 자본잠식)는 0 선 아래로 내리고 값 글자를 막대 아래에 적는다. 바닥선 아래 자리(NEGATIVE_ROOM)
//     보다 깊으면 가장 큰 양수 ~ 가장 큰 음수를 그림 영역 안에 비례로 담고 0 선을 그만큼 올린다 — 막대 · 글자가 늘 그림 안이고,
//     음수 값 글자와 항목 이름 사이에 4 가 남는다.
//   · 아주 작은 값도 최소 높이 MIN_BAR_HEIGHT 로 세워 보이게 한다. 0 은 막대 없이 값 글자만 적는다.
//   · 구성 막대가 많아 기준 막대 안에 들지 않으면 구성 막대 폭을 줄인다(사이는 최소 MIN_BAR_GAP).
//     같은 높이 근처의 이웃 값 글자가 겹치면 구성 막대 값 글자를 줄이고(최소 10px), 그래도 겹치면 뒤 글자를 위로 올린다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
// 범례는 그리지 않는다 — 사용처가 그림 위에 둔다(인쇄본은 KbxLegend density="compact").
//
// [프론트엔드 연동] data 의 values 는 계열 key → 값. 기준 · 구성 막대 색은 base · series 의 color 로, 선 · 글자 색은 colors 로
//   넘긴다(웹 화면은 var(--ds-*), 인쇄본은 var(--kbx-color-*)).

type NestedColumnSeries = {
    key: string
    label: string
    /** 막대 색(CSS 색 값). */
    color: string
}

type NestedColumnItem = {
    id: string
    label: string
    /** 계열 key → 값(기준 · 구성 모두). 없으면 그 막대를 비운다. */
    values: Readonly<Record<string, number | undefined>>
}

type NestedColumnColors = {
    /** 바닥선(0 선). */
    baseline: string
    /** 항목 칸 사이 점선. */
    divider: string
    /** 값 글자. */
    value: string
    /** 항목 이름. */
    category: string
}

type NestedColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly NestedColumnItem[]
    /** 기준 막대(넓은 막대 — 예: 총자산 · 매출액). */
    base: NestedColumnSeries
    /** 기준 막대 안에 겹칠 구성 막대(예: 부채총계 · 자본총계). */
    series: readonly NestedColumnSeries[]
    ariaLabel: string
    /** 선 · 글자 색. 넘기지 않은 항목은 웹 화면 시맨틱 색을 쓴다. */
    colors?: Partial<NestedColumnColors>
    /** 값 글자 형식(기본: 천 단위 쉼표). */
    formatValue?: (value: number) => string
    /**
     * 값이 없는 막대(그 계열 값이 없거나 숫자가 아님) 자리에 적을 글자(예: '-'). 막대는 그리지 않고, 값이 0 일 때 값 글자가
     * 놓이는 자리(바닥선 바로 위)에 적는다 — 웹 화면 OverlayColumnChart 와 같은 모양. 주지 않으면 지금처럼 자리를 비운다.
     */
    missingValueText?: string
}

const DEFAULT_COLORS: NestedColumnColors = {
    baseline: 'var(--ds-foreground-subtle)',
    divider: 'var(--ds-subtle-3)',
    value: 'var(--ds-label-foreground)',
    category: 'var(--ds-foreground)',
}

// 치수(SVG 좌표).
const WIDTH = 560
const HEIGHT = 354
const DIVIDER_TOP = 20
const BASELINE_Y = 300
// 가장 큰 값 막대의 높이(바닥선 위).
const PLOT_HEIGHT = 246.4
// 음수 막대가 바닥선을 올리지 않고 내려갈 수 있는 깊이.
const NEGATIVE_ROOM = 4
const BASE_WIDTH = 108
const BAR_WIDTH = 30
const INNER_INSET = 16
const BAR_RADIUS = 8
const MIN_BAR_HEIGHT = 4
// 구성 막대 사이 최소 간격 · 값 글자를 줄일 때의 하한(px) · 겹침으로 보지 않는 여유(px).
const MIN_BAR_GAP = 6
// 겹쳐 올린 값 글자와 아래 글자 사이 간격.
const LABEL_GAP = 2
// 글자 상자 높이(글자 크기 대비, 받침 포함) — 겹침 판단에 쓴다.
const LABEL_BOX_RATIO = 1.3
const MIN_VALUE_FONT_SIZE = 10
const VALUE_OVERLAP_TOLERANCE = 2
// 글자 폭 어림(글자 크기 대비) — Pretendard 굵은 글씨 실측(숫자 0.615 · 쉼표 0.29 · 빼기 0.45).
const DIGIT_RATIO = 0.615
const COMMA_RATIO = 0.29
const MINUS_RATIO = 0.45
const BASE_LABEL_OFFSET = 9
const BAR_LABEL_OFFSET = 7
const NEGATIVE_LABEL_OFFSET = 18
const CATEGORY_Y = 348
const BASELINE_STROKE = 2
const DIVIDER_STROKE = 1.5
const DIVIDER_DASH = '4 5'
const FONT = {
    base: {size: 17, weight: 600},
    bar: {size: 15.5, weight: 600},
    category: {size: 19, weight: 600},
} as const

const numberFormat = new Intl.NumberFormat('ko-KR')
const estimateWidth = (text: string, fontSize: number) =>
    [...text].reduce(
        (sum, char) =>
            sum + fontSize * (char === ',' || char === '.' ? COMMA_RATIO : char === '-' ? MINUS_RATIO : DIGIT_RATIO),
        0,
    )
const round = (value: number) => Math.round(value * 10) / 10

// 둥근 끝 막대 — 0 에서 먼 쪽 모서리만 둥글린다. 높이가 둥글림보다 낮으면 둥글림을 줄인다.
const barPath = (x: number, width: number, zeroY: number, endY: number) => {
    const height = Math.abs(zeroY - endY)
    const radius = Math.min(BAR_RADIUS, height, width / 2)
    const direction = endY < zeroY ? 1 : -1
    const right = x + width
    const curveY = endY + direction * radius
    return [
        `M${round(x)},${round(zeroY)}`,
        `V${round(curveY)}`,
        `Q${round(x)},${round(endY)} ${round(x + radius)},${round(endY)}`,
        `H${round(right - radius)}`,
        `Q${round(right)},${round(endY)} ${round(right)},${round(curveY)}`,
        `V${round(zeroY)} Z`,
    ].join(' ')
}

const NestedColumnChart = ({
    data,
    base,
    series,
    ariaLabel,
    colors,
    formatValue = (value) => numberFormat.format(value),
    missingValueText,
    className,
    ...props
}: NestedColumnChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const allSeries = [base, ...series]
    const values = data.flatMap((item) =>
        allSeries.map((line) => item.values[line.key]).filter((value): value is number => Number.isFinite(value)),
    )
    // 양수가 없으면(모두 0 이하) 위쪽 끝을 음수 크기로 잡아 0 선이 그림 위에 붙지 않게 한다.
    const maxValue = Math.max(0, ...values) || Math.max(1, -Math.min(0, ...values))
    const minValue = Math.min(0, ...values)
    // 비율 — 가장 큰 값이 PLOT_HEIGHT. 음수가 NEGATIVE_ROOM 보다 깊으면 가장 큰 양수 ~ 가장 큰 음수 전체를
    // PLOT_HEIGHT + NEGATIVE_ROOM 안에 비례로 담고, 음수가 넘친 만큼 0 선을 위로 올린다.
    const naturalScale = PLOT_HEIGHT / maxValue
    const isDeepNegative = -minValue * naturalScale > NEGATIVE_ROOM
    const scale = isDeepNegative ? (PLOT_HEIGHT + NEGATIVE_ROOM) / (maxValue - minValue) : naturalScale
    const zeroY = BASELINE_Y - Math.max(0, -minValue * scale - NEGATIVE_ROOM)
    const endYOf = (value: number) => {
        const height = Math.max(MIN_BAR_HEIGHT, Math.abs(value) * scale)
        return value < 0 ? zeroY + height : zeroY - height
    }
    const groupWidth = WIDTH / Math.max(data.length, 1)
    // 구성 막대 — 기준 막대 안 양끝 INNER_INSET 안쪽에 같은 간격으로. 들지 않으면 폭 · 사이를 줄인다.
    const innerSpace = BASE_WIDTH - INNER_INSET * 2
    const barWidth = series.length
        ? Math.min(BAR_WIDTH, (innerSpace - MIN_BAR_GAP * (series.length - 1)) / series.length)
        : BAR_WIDTH
    const barGap = series.length > 1 ? (innerSpace - barWidth * series.length) / (series.length - 1) : 0

    // 구성 막대 값 글자 — 같은 묶음의 이웃 값 글자가 같은 높이 근처(글자 크기 안)에서 겹치면 겹치지 않을 만큼 줄인다.
    const barPitch = barWidth + barGap
    const overlapRatio = Math.max(
        1,
        ...data.flatMap((item) =>
            series.slice(1).map((line, index) => {
                const previous = item.values[series[index].key]
                const current = item.values[line.key]
                if (previous === undefined || current === undefined) return 1
                if (!Number.isFinite(previous) || !Number.isFinite(current)) return 1
                if (Math.abs(endYOf(previous) - endYOf(current)) >= FONT.bar.size * LABEL_BOX_RATIO) return 1
                const width =
                    (estimateWidth(formatValue(previous), FONT.bar.size) +
                        estimateWidth(formatValue(current), FONT.bar.size)) /
                    2
                return width / (barPitch + VALUE_OVERLAP_TOLERANCE)
            }),
        ),
    )
    const barFontSize = Math.max(MIN_VALUE_FONT_SIZE, FONT.bar.size / overlapRatio)

    const naturalLabelY = (value: number, isBase: boolean) =>
        value < 0
            ? endYOf(value) + NEGATIVE_LABEL_OFFSET
            : endYOf(value) - (isBase ? BASE_LABEL_OFFSET : BAR_LABEL_OFFSET)
    // 구성 막대 값 글자 자리 — 왼쪽부터 놓으며 앞 글자와 겹치면 그 위로 올린다(양수 막대만 — 음수는 막대 아래).
    const innerLabelYs = (item: NestedColumnItem, baseX: number) =>
        series.reduce<{y: number | null; x: number; width: number}[]>((acc, line, index) => {
            const value = item.values[line.key]
            const x = baseX + INNER_INSET + index * (barWidth + barGap) + barWidth / 2
            if (value === undefined || !Number.isFinite(value)) return [...acc, {y: null, x, width: 0}]
            const width = estimateWidth(formatValue(value), barFontSize)
            const natural = naturalLabelY(value, false)
            const previous = acc.findLast((label) => label.y !== null)
            const isOverlapping =
                value >= 0 &&
                previous?.y != null &&
                Math.abs(x - previous.x) < (width + previous.width) / 2 &&
                Math.abs(natural - previous.y) < barFontSize * LABEL_BOX_RATIO
            const y =
                isOverlapping && previous?.y != null ? Math.min(natural, previous.y - barFontSize - LABEL_GAP) : natural
            return [...acc, {y, x, width}]
        }, [])

    const valueLabel = (
        key: string,
        value: number,
        x: number,
        width: number,
        isBase: boolean,
        labelY?: number,
        text = formatValue(value),
    ) => {
        const font = isBase ? FONT.base : {...FONT.bar, size: round(barFontSize)}
        const y = labelY ?? naturalLabelY(value, isBase)
        return (
            <text
                key={`label-${key}`}
                x={round(x + width / 2)}
                y={round(y)}
                textAnchor="middle"
                fontSize={font.size}
                fontWeight={font.weight}
                fill={color.value}
            >
                {text}
            </text>
        )
    }

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full">
                <line
                    x1={0}
                    y1={round(zeroY)}
                    x2={WIDTH}
                    y2={round(zeroY)}
                    stroke={color.baseline}
                    strokeWidth={BASELINE_STROKE}
                />
                {data.slice(1).map((item, index) => (
                    <line
                        key={`divider-${item.id}`}
                        x1={round(groupWidth * (index + 1))}
                        y1={DIVIDER_TOP}
                        x2={round(groupWidth * (index + 1))}
                        y2={round(zeroY)}
                        stroke={color.divider}
                        strokeWidth={DIVIDER_STROKE}
                        strokeDasharray={DIVIDER_DASH}
                    />
                ))}
                {data.map((item, groupIndex) => {
                    const center = groupWidth * (groupIndex + 0.5)
                    const baseX = center - BASE_WIDTH / 2
                    const baseValue = item.values[base.key]
                    const hasBase = baseValue !== undefined && Number.isFinite(baseValue)
                    const labelYs = innerLabelYs(item, baseX)
                    // 기준 · 구성 막대가 모두 값이 없으면 막대마다 적지 않고 가운데(기준 막대 자리)에 missingValueText 하나만.
                    const isAllMissing = allSeries.every((line) => {
                        const value = item.values[line.key]
                        return value === undefined || !Number.isFinite(value)
                    })

                    return (
                        <g key={item.id}>
                            {hasBase && baseValue !== 0 ? (
                                <path d={barPath(baseX, BASE_WIDTH, zeroY, endYOf(baseValue))} fill={base.color} />
                            ) : null}
                            {hasBase
                                ? valueLabel(base.key, baseValue, baseX, BASE_WIDTH, true)
                                : missingValueText !== undefined
                                  ? valueLabel(base.key, 0, baseX, BASE_WIDTH, true, undefined, missingValueText)
                                  : null}
                            {series.map((line, index) => {
                                const value = item.values[line.key]
                                const x = baseX + INNER_INSET + index * (barWidth + barGap)
                                if (value === undefined || !Number.isFinite(value)) {
                                    // 값이 없으면 막대 없이 0 자리에 missingValueText(주지 않으면 비운다). 모두 없으면 가운데 하나뿐.
                                    return missingValueText !== undefined && !isAllMissing
                                        ? valueLabel(line.key, 0, x, barWidth, false, undefined, missingValueText)
                                        : null
                                }
                                return (
                                    <g key={line.key}>
                                        {value !== 0 ? (
                                            <path d={barPath(x, barWidth, zeroY, endYOf(value))} fill={line.color} />
                                        ) : null}
                                        {valueLabel(
                                            line.key,
                                            value,
                                            x,
                                            barWidth,
                                            false,
                                            labelYs[index]?.y ?? undefined,
                                        )}
                                    </g>
                                )
                            })}
                            <text
                                x={round(center)}
                                y={CATEGORY_Y}
                                textAnchor="middle"
                                fontSize={FONT.category.size}
                                fontWeight={FONT.category.weight}
                                fill={color.category}
                            >
                                {item.label}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}:{' '}
                        {allSeries
                            .map((line) => {
                                const value = item.values[line.key]
                                return `${line.label} ${value === undefined || !Number.isFinite(value) ? '값 없음' : formatValue(value)}`
                            })
                            .join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {NestedColumnChart}
export type {NestedColumnChartProps, NestedColumnColors, NestedColumnItem, NestedColumnSeries}
