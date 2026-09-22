import type {LabelProps} from 'recharts'

// 칸형(cells) 차트 공통 — K-BIGx 기업혁신성장 보고서의 막대 · 선 그래프(최근 3개년 재무 현황 · 분기별 종업원수 · 인당 매출액)가
// 같이 쓰는 치수 · 선 · 값 글자 · 세로 범위다. GroupedColumnChart · ColumnChart(variant="cells")와
// LineChart(appearance="cells")가 가져다 쓴다. 한 곳을 고치면 세 차트가 함께 바뀐다.
//
// 짜임: 그릴 자리 위 선 없음 · 바닥선 실선 · y축 · 가로 눈금 없음 · 선 색 gray.100 · 점선은 3 긋고 3 띄움.
//   값 글자 11 Regular(gray.600) · 항목 이름 12 Regular(gray.700)는 그릴 자리 아래 8 에 둔다(자리 28).

const CELLS_GRID_STROKE = 'var(--ds-subtle-3)'
const CELLS_DIVIDER_DASH = '3 3'
// 항목 이름 자리 — 바닥 아래 8 + 글자 줄 18. 칸 200 과 합쳐 226(h-56.5)이다.
const CELLS_X_AXIS_HEIGHT = 26
const CELLS_X_TICK_MARGIN = 8
const CELLS_X_TICK = {fill: 'var(--ds-label-foreground)', fontSize: 12} as const
// 가장 큰 값이 그릴 자리 높이의 78% 에 닿게 한다 — 남는 자리는 값 글자 자리다.
const CELLS_MAX_VALUE_RATIO = 0.78
const CELLS_LABEL_OFFSET = 4
const CELLS_LABEL_FONT_SIZE = 11
const CELLS_LABEL_FILL = 'var(--ds-foreground-subtle)'
// 막대 한 자리에 들어가는 글자 수 — 넘으면 '123.5만'처럼 줄여 옆 값과 겹치지 않게 한다.
// 줄인 값은 화면에만 보이고, 숨김 표(화면 낭독기)는 원래 값을 그대로 읽는다.
const CELLS_LABEL_MAX_CHARS = 6
const compactFormatter = new Intl.NumberFormat('ko-KR', {notation: 'compact', maximumFractionDigits: 1})

type GridOffset = {left?: number; top?: number; width?: number; height?: number}

// 세로 범위 — 값이 차지하는 폭(최솟값~최댓값)이 그릴 자리의 78% 가 되게 남는 자리를 위 · 아래로 나눈다.
// 양수만 있으면 0 에서 시작해 남는 자리는 모두 위(가장 큰 값의 글자 자리)에, 음수가 있으면 위아래 반씩 둔다.
// ratio 로 비율을 바꿀 수 있다(값 글자가 한 줄뿐인 막대만 — 최대 CELLS_MAX_VALUE_RATIO_LIMIT).
const CELLS_MAX_VALUE_RATIO_LIMIT = 0.9
const cellsBarDomain = (
    minimumValue: number,
    maximumValue: number,
    ratio: number = CELLS_MAX_VALUE_RATIO,
): [number, number] => {
    const safeRatio = Number.isFinite(ratio)
        ? Math.min(CELLS_MAX_VALUE_RATIO_LIMIT, Math.max(CELLS_MAX_VALUE_RATIO, ratio))
        : CELLS_MAX_VALUE_RATIO
    const span = maximumValue - Math.min(0, minimumValue) || 1
    const padding = span / safeRatio - span
    return minimumValue < 0 ? [minimumValue - padding / 2, maximumValue + padding / 2] : [0, maximumValue + padding]
}

const formatCellsValue = (value: number, format: (value: number) => string) => {
    const formatted = format(value)
    return formatted.length > CELLS_LABEL_MAX_CHARS ? compactFormatter.format(value) : formatted
}

// 값 글자 폭 어림 — 11px 글자 한 자에 약 6.2px(숫자 · 쉼표 · 점 평균). 측정 없이 겹침만 판단하는 용도다.
const CELLS_LABEL_CHAR_WIDTH = 6.2
// 이웃한 값 글자 사이 최소 여백.
const CELLS_LABEL_GAP = 4
const estimateLabelWidth = (text: string) => text.length * CELLS_LABEL_CHAR_WIDTH

// 값 글자 솎기 — 한 자리(칸 또는 점 사이)가 글자보다 좁으면 k 칸마다 하나만 적는다(k = 글자 폭 ÷ 자리 폭).
// 처음 · 끝 · 가장 큰 값 · 가장 작은 값은 늘 적는다. 적지 않은 값도 숨김 표(화면 낭독기)에는 모두 남는다.
type CellsLabelThinning = {
    index: number
    count: number
    slotWidth: number
    text: string
    isExtreme: boolean
}
const shouldShowCellsLabel = ({index, count, slotWidth, text, isExtreme}: CellsLabelThinning) => {
    if (isExtreme || index === 0 || index === count - 1) return true
    const step = Math.max(1, Math.ceil((estimateLabelWidth(text) + CELLS_LABEL_GAP) / Math.max(1, slotWidth)))
    return index % step === 0
}

type CellsBarLabelOptions = {
    /** 항목 수 — 주면 칸 폭(그릴 자리 ÷ 항목 수)보다 넓은 값은 솎는다(ColumnChart). */
    count?: number
    /** 값 목록 — 가장 큰 · 작은 값은 솎지 않는다. */
    values?: readonly number[]
}

// 막대 값 글자 — 막대가 자라는 쪽 끝에서 4 떨어진다(양수는 위, 음수는 아래). 0 은 막대 없이 바닥선 바로 위에 값만 남는다.
// 칸이 좁아 이웃 값과 겹치면 솎는다(options.count). 글자는 막대 밖에 있어 막대 색에 가려지지 않는다.
const renderCellsBarValueLabel = (
    props: LabelProps,
    format: (value: number) => string,
    options: CellsBarLabelOptions = {},
) => {
    // recharts 3 는 막대 자리를 viewBox({x, y, width, height})로 넘긴다(음수 막대는 height 가 음수).
    const {viewBox, parentViewBox, value, index} = props
    if (!viewBox || !('width' in viewBox)) return null
    const {x, y, width, height} = viewBox
    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        return null
    }
    const numericValue = Number(value ?? 0)
    const text = formatCellsValue(numericValue, format)
    const {count, values = []} = options
    if (count && parentViewBox && 'width' in parentViewBox && typeof parentViewBox.width === 'number') {
        const isExtreme =
            values.length > 0 && (numericValue === Math.max(...values) || numericValue === Math.min(...values))
        const isShown = shouldShowCellsLabel({
            index: index ?? 0,
            count,
            slotWidth: parentViewBox.width / count,
            text,
            isExtreme,
        })
        if (!isShown) return null
    }
    const isNegative = numericValue < 0
    const top = Math.min(y, y + height)
    const bottom = Math.max(y, y + height)

    return (
        <text
            x={x + width / 2}
            y={isNegative ? bottom + CELLS_LABEL_OFFSET + CELLS_LABEL_FONT_SIZE : top - CELLS_LABEL_OFFSET}
            textAnchor="middle"
            fill={CELLS_LABEL_FILL}
            fontSize={CELLS_LABEL_FONT_SIZE}
        >
            {text}
        </text>
    )
}

type CellsLineLabelOptions = {
    /** 이 계열의 값(점 순서) — 골짜기 판단 · 가장 큰 · 작은 값 판단에 쓴다. */
    values: readonly number[]
    /** 양 끝 점이 가장자리에서 들어온 거리 — 점 사이 폭 계산에 쓴다. */
    edgePadding: number
    /** 점 반지름(테두리 포함) — 값 글자는 점 가장자리에서 2 떨어진다. */
    dotRadius: number
    /** 세로 범위 — 이웃 점까지의 선 기울기(px)를 구해 글자와 겹치는지 판단한다. */
    domain: readonly [number, number]
    /**
     * 점마다 글자 자리를 정해 둘 때(여러 계열) — 'above' · 'below' 면 기울기 판단 대신 그 자리에 둔다.
     * 같은 시점에서 다른 계열보다 아래에 있는 점은 아래, 위에 있는 점은 위에 적어 두 계열 글자가 서로 부딪히지 않게 한다.
     */
    placementAt?: (index: number) => 'above' | 'below' | undefined
}

// 선 값 글자 — 기본은 점 바로 위에 둔다. 다만 이웃 점으로 가는 선이 가팔라 글자 자리(점 위)를 지나가면
// 선에 가려 읽히지 않으므로, 그때만 점 아래로 내린다(아래도 선이 지나가면 그대로 위).
// 점 사이가 글자보다 좁으면 솎는다(처음 · 끝 · 가장 큰 · 작은 값은 늘 적는다).
const renderCellsLineValueLabel = (
    props: LabelProps,
    format: (value: number) => string,
    {values, edgePadding, dotRadius, domain, placementAt}: CellsLineLabelOptions,
) => {
    const {value, index = 0, parentViewBox, viewBox} = props
    // 점 자리는 props.x · y 로 오고, 없으면 viewBox 에서 읽는다(recharts 버전에 따라 다르다).
    const x = typeof props.x === 'number' ? props.x : viewBox && 'x' in viewBox ? viewBox.x : undefined
    const y = typeof props.y === 'number' ? props.y : viewBox && 'y' in viewBox ? viewBox.y : undefined
    if (typeof x !== 'number' || typeof y !== 'number') return null
    const numericValue = Number(value ?? 0)
    const text = formatCellsValue(numericValue, format)
    const count = values.length
    const plotWidth =
        parentViewBox && 'width' in parentViewBox && typeof parentViewBox.width === 'number'
            ? parentViewBox.width
            : undefined
    if (plotWidth && count > 1) {
        const isExtreme = numericValue === Math.max(...values) || numericValue === Math.min(...values)
        const slotWidth = (plotWidth - edgePadding * 2) / (count - 1)
        if (!shouldShowCellsLabel({index, count, slotWidth, text, isExtreme})) return null
    }
    const gap = dotRadius + 2
    const plotHeight =
        parentViewBox && 'height' in parentViewBox && typeof parentViewBox.height === 'number'
            ? parentViewBox.height
            : 0
    const slot = plotWidth && count > 1 ? (plotWidth - edgePadding * 2) / (count - 1) : 0
    const pixelsPerUnit = plotHeight / (domain[1] - domain[0] || 1)
    // 글자 가장자리(가로 w/2 + 여백)에서 이웃으로 가는 선이 점보다 얼마나 올라가는지(px, 양수 = 위).
    const halfWidth = estimateLabelWidth(text) / 2 + CELLS_LABEL_GAP
    const riseAtLabelEdge = (neighbor: number | undefined) =>
        neighbor === undefined || !slot
            ? 0
            : ((neighbor - numericValue) * pixelsPerUnit * Math.min(halfWidth, slot)) / slot
    const rises = [riseAtLabelEdge(values[index - 1]), riseAtLabelEdge(values[index + 1])]
    const isAboveBlocked = rises.some((rise) => rise > gap)
    const isBelowBlocked = rises.some((rise) => -rise > gap)
    const forcedPlacement = placementAt?.(index)
    const isBelow = forcedPlacement ? forcedPlacement === 'below' : isAboveBlocked && !isBelowBlocked

    return (
        <text
            x={x}
            y={isBelow ? y + gap + CELLS_LABEL_FONT_SIZE : y - gap}
            textAnchor="middle"
            fill={CELLS_LABEL_FILL}
            fontSize={CELLS_LABEL_FONT_SIZE}
        >
            {text}
        </text>
    )
}

// 막대 최소 높이 — recharts 는 높이 0 인 막대를 그리지 않고, 그 막대의 값 글자(LabelList)도 함께 빠진다.
// 그래서 0 은 눈에 띄지 않는 높이(0.01)로 막대 자리를 남겨 값 글자 '0' 만 바닥선 위에 보이게 하고,
// 0 이 아닌 아주 작은 값(1px 미만으로 그려지는 값)은 2px 로 보이게 한다. 값이 없으면(null) 막대 · 글자를 두지 않는다.
// Bar 의 minPointSize 에 넘긴다(칸형 막대 차트 공통).
const CELLS_MIN_BAR_HEIGHT = 2
const CELLS_ZERO_BAR_HEIGHT = 0.01
const cellsMinPointSize = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 0
    return value === 0 ? CELLS_ZERO_BAR_HEIGHT : CELLS_MIN_BAR_HEIGHT
}

// 선 · 칸 좌표 — CartesianGrid 의 좌표 생성기에 넘긴다.
const cellsBottomLine = ({offset}: {offset: GridOffset}) => [(offset.top ?? 0) + (offset.height ?? 0)]
const cellsEdgeLines = ({offset}: {offset: GridOffset}) => [offset.left ?? 0, (offset.left ?? 0) + (offset.width ?? 0)]
// 항목 경계(양 끝 제외) — 항목 수만큼 폭을 똑같이 나눈 사이.
const cellsDividerLines =
    (count: number) =>
    ({offset}: {offset: GridOffset}) =>
        Array.from(
            {length: Math.max(0, count - 1)},
            (_, index) => (offset.left ?? 0) + ((offset.width ?? 0) * (index + 1)) / Math.max(1, count),
        )

export {
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
    renderCellsLineValueLabel,
}
