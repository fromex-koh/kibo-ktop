import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 막대 + 선 값 차트(ComboValueChart) — 항목마다 막대(예: 매출액) 하나와 선 위의 점(예: 영업이익률)을 함께 그리고,
// 막대 위 · 점 위에 값을 바로 적는다. 세로축 · 눈금 없이 값 글자로 읽는다.
// K-BIGx 보고서 인쇄본 기술혁신정보 "경쟁기업 사업실적 (매출액, 영업이익률)" 그래프.
// (세로축 · 툴팁이 있는 웹 화면용은 ComboBarLineChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 폭 1168 × 높이 480. 항목 칸은 폭을 항목 수로 똑같이 나누고, 칸 사이에 세로 점선을 긋는다.
//   막대 = 폭 60 · 위 모서리 둥글림 8. 바닥선(y 438)에서 가장 큰 값이 y 66.5 까지 선다(위 36.5 는 값 글자 자리).
//     값 글자 = 막대 끝에서 9 위(17px). 조회기업(tone subject)은 막대 · 글자 색이 다르고 굵게, 평균(average)은 막대 색만 다르다.
//   선 = 가장 큰 선 값이 y 220, 가장 작은 값이 y 383.4 — 막대 아래쪽 띠 안에서 오르내린다(막대 높이와 따로 된 눈금).
//     점 = 흰 원(반지름 7 · 테두리 3), 값 글자 = 점에서 15 위 흰 글자(막대 위에 얹힌다).
//   항목 이름 = 바닥선 아래(y 468 · 18px).
// 데이터에 따라
//   · 막대 바닥 — 값 차이가 작으면(예: 32.8 ~ 31.2) 0 부터 그리면 막대가 다 같아 보이므로, 가장 작은 값에서 차이의
//     절반만큼 아래를 차이의 자릿수 단위로 내린 값(31.2 − 0.8 → 30)에서 시작한다. 그 값이 0 이하면 0 부터 그린다.
//     바닥이 0 이 아닐 때 막대 길이는 값의 비율이 아니다 — 값은 글자로 읽는다.
//   · 막대 값이 모두 같으면 0 부터 그려 모두 가장 큰 높이로 선다. 바닥보다 작거나 같은 값은 최소 높이로 세운다.
//   · 선 값이 null 이면 그 점 · 글자를 비우고 선을 끊는다. 선 값이 모두 같으면 띠 가운데에 가로로 놓인다.
//   · 점 글자가 막대 밖(막대 끝보다 위)에 오면 흰 글자가 안 보이므로 값 글자 색으로 바꾼다.
//   · 점이나 점 글자가 막대 값 글자를 가리면 막대 값 글자를 점 글자 위로 올린다(위로 넘치면 점 글자를 점 아래로).
//   · 항목이 많아 칸이 좁아지면 막대 폭을 칸의 62% 로 줄이고, 값 글자가 칸보다 넓으면 글자를 줄인다(최소 11px).
//   · 항목 이름이 칸보다 길면 띄어쓰기 자리에서 줄을 바꾸고 그림 높이를 그만큼 늘린다. maxCategoryLines 를 주면 그 줄 수를
//     넘는 이름만 글자를 한 단계씩 줄여(11px 까지) 그 줄 수 안에 맞춘다 — 짧은 이름은 원래 크기, 그림 높이도 크게 늘지 않는다.
//     isCategoryTruncated 를 주면 이름을 원래 크기 한 줄로 두고, 칸보다 길면 뒤를 말줄임(…)한다(그림 높이 그대로).
//     줄인 이름도 화면에 보이지 않는 목록에는 전체로 읽어 준다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
// 범례 · 단위는 그리지 않는다 — 사용처가 제목 줄에 둔다(인쇄본은 소제목 오른쪽 '단위: 백만원, %').
//
// [프론트엔드 연동] data 는 화면에 그릴 순서로 넘긴다(정렬하지 않는다). 색은 colors(CSS 색 값)로 넘긴다
//   (웹 화면은 var(--ds-*), 인쇄본은 var(--kbx-color-*)).

type ComboValueTone = 'default' | 'subject' | 'average'

type ComboValueItem = {
    id: string
    label: string
    /** 막대 값. */
    value: number
    /** 선 값. null 이면 그 점을 비우고 선을 끊는다. */
    lineValue: number | null
    /** subject = 조회기업(막대 · 글자 강조), average = 평균(막대 색만 다름). */
    tone?: ComboValueTone
}

type ComboValueColors = {
    /** 막대(기본 · 조회기업 · 평균). */
    bar: string
    subjectBar: string
    averageBar: string
    /** 선 · 점 테두리. */
    line: string
    /** 점 안쪽(바탕색과 같게). */
    marker: string
    /** 바닥선. */
    baseline: string
    /** 항목 칸 사이 점선. */
    divider: string
    /** 막대 값 글자 · 막대 밖에 놓인 점 값 글자. */
    value: string
    /** 막대 위에 얹힌 점 값 글자. */
    lineValue: string
    /** 항목 이름. */
    category: string
    /** 조회기업 값 글자 · 이름. */
    subject: string
}

type ComboValueChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly ComboValueItem[]
    ariaLabel: string
    /** 화면 낭독기가 읽을 막대 · 선 이름과 단위(예: '매출액' · '백만원'). */
    barLabel: string
    lineLabel: string
    barUnit?: string
    lineUnit?: string
    /** 선 · 글자 · 막대 색. 넘기지 않은 항목은 웹 화면 시맨틱 색을 쓴다. */
    colors?: Partial<ComboValueColors>
    /** 막대 · 선 값 글자 형식(기본: 천 단위 쉼표, 소수는 받은 그대로). */
    formatValue?: (value: number) => string
    formatLineValue?: (value: number) => string
    /** 항목 이름 최대 줄 수 — 넘으면 이름 글자를 줄인다(인쇄본처럼 높이가 정해진 곳). 없으면 줄 수 제한 없이 그림이 늘어난다. */
    maxCategoryLines?: number
    /** 항목 이름을 한 줄로 — 칸보다 길면 말줄임(…). maxCategoryLines 보다 먼저 쓴다. */
    isCategoryTruncated?: boolean
}

const DEFAULT_COLORS: ComboValueColors = {
    bar: 'var(--ds-blue-500)',
    subjectBar: 'var(--ds-mint-700)',
    averageBar: 'var(--ds-purple-500)',
    line: 'var(--ds-navy-500)',
    marker: 'var(--ds-card)',
    baseline: 'var(--ds-foreground-subtle)',
    divider: 'var(--ds-subtle-3)',
    value: 'var(--ds-label-foreground)',
    lineValue: 'var(--ds-primary-foreground)',
    category: 'var(--ds-foreground)',
    subject: 'var(--ds-primary)',
}

// 치수(SVG 좌표).
const WIDTH = 1168
const HEIGHT = 480
const PLOT_TOP = 30
const BASELINE_Y = 438
// 가장 큰 막대 끝 — 위 36.5 는 값 글자 자리.
const BAR_TOP_Y = 66.5
const BAR_WIDTH = 60
// 칸이 좁을 때 막대 폭 상한(칸 대비) — 템플릿 12항목은 60 / 97.3 = 0.62.
const BAR_FILL_RATIO = 0.62
const BAR_RADIUS = 8
const MIN_BAR_HEIGHT = 4
const VALUE_OFFSET = 9
const LINE_TOP_Y = 220
const LINE_BOTTOM_Y = 383.4
const LINE_STROKE = 3
const MARKER_RADIUS = 7
const LINE_VALUE_OFFSET = 15
const CATEGORY_Y = 468
const BASELINE_STROKE = 2
const DIVIDER_STROKE = 1.5
const DIVIDER_DASH = '4 5'
const FONT = {
    value: {size: 17, weight: 600, strongWeight: 800},
    lineValue: {size: 17, weight: 700},
    category: {size: 18, weight: 500, strongWeight: 800},
} as const
const MIN_VALUE_FONT_SIZE = 11
const MIN_CATEGORY_FONT_SIZE = 11
// 값 글자 칸 안 여백 비율 — 글자가 칸의 90% 를 넘으면 줄인다.
const VALUE_FILL_RATIO = 0.9
// 막대 바닥을 내리는 몫(값 차이 대비)과 자릿수.
const FLOOR_MARGIN_RATIO = 0.5
const TEN = 10
// 글자 높이 어림(글자 크기 대비) — 점 글자가 막대 끝보다 위인지 볼 때 쓴다.
const CAP_HEIGHT_RATIO = 0.75
// 값 글자끼리 띄우는 간격.
const LABEL_GAP = 6
// 글자 폭 어림(글자 크기 대비) — Pretendard 실측(숫자 0.615 · 쉼표/점 0.29 · 빼기 0.45 · 괄호 0.36 · 한글 0.9).
const DIGIT_RATIO = 0.615
const COMMA_RATIO = 0.29
const MINUS_RATIO = 0.45
const PAREN_RATIO = 0.36
const WIDE_RATIO = 0.9
const WIDE_CHAR_START = 0x1100
const CATEGORY_LINE_HEIGHT = 22
// 이름 칸 양옆 여백 합 — 이웃 이름과 붙지 않을 만큼만('(주)온새미로' 18px 실측 90.6 이 칸 97.3 에 한 줄로 들어가게).
const CATEGORY_PADDING = 2

const numberFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 20})
const round = (value: number) => Math.round(value * 10) / 10

// 낱말 잇기 문자(U+2060) — 폭이 없고 앞뒤 글자 사이에서 줄을 바꾸지 않는다(인쇄본이 '(주)' 뒤에 넣는다).
const WORD_JOINER = '\u2060'
// 글자 단위로 끊을 때 한 덩어리 — 앞 '(주)' + 낱말 잇기 + 다음 글자는 함께, 나머지는 한 글자씩.
const BREAK_UNIT = /^\([^)]{1,2}\)\u2060.|./gu

const estimateWidth = (text: string, fontSize: number) =>
    [...text].reduce((sum, char) => {
        if (char === WORD_JOINER) return sum
        const ratio =
            (char.codePointAt(0) ?? 0) >= WIDE_CHAR_START
                ? WIDE_RATIO
                : char === ',' || char === '.'
                  ? COMMA_RATIO
                  : char === '-'
                    ? MINUS_RATIO
                    : char === '(' || char === ')'
                      ? PAREN_RATIO
                      : DIGIT_RATIO
        return sum + fontSize * ratio
    }, 0)

// 항목 이름 접기 — 칸 폭을 넘으면 띄어쓰기 자리에서 먼저 끊고, 한 단어가 칸보다 길면 글자 단위로 끊는다.
const wrapCategory = (text: string, maxWidth: number, fontSize: number = FONT.category.size) => {
    const fits = (line: string) => estimateWidth(line, fontSize) <= maxWidth
    const pieces = text.split(' ').flatMap((word) =>
        fits(word)
            ? [word]
            : (word.match(BREAK_UNIT) ?? []).reduce<string[]>((acc, char) => {
                  const last = acc.at(-1) ?? ''
                  return last && fits(last + char) ? [...acc.slice(0, -1), last + char] : [...acc, char]
              }, []),
    )
    return pieces.reduce<string[]>((lines, piece) => {
        const last = lines.at(-1)
        return last !== undefined && fits(`${last} ${piece}`)
            ? [...lines.slice(0, -1), `${last} ${piece}`]
            : [...lines, piece]
    }, [])
}

// 항목 이름 한 줄 — 칸보다 길면 들어가는 만큼 앞에서부터 두고 뒤에 말줄임(…)을 붙인다. '(주)' 덩어리는 쪼개지 않는다.
const ELLIPSIS = '…'
const truncateCategory = (text: string, maxWidth: number, fontSize: number) => {
    if (estimateWidth(text, fontSize) <= maxWidth) return text
    const room = maxWidth - estimateWidth(ELLIPSIS, fontSize)
    const units = text.match(BREAK_UNIT) ?? []
    const kept = units.reduce<{text: string; isDone: boolean}>(
        (acc, unit) =>
            acc.isDone || estimateWidth(acc.text + unit, fontSize) > room
                ? {text: acc.text, isDone: true}
                : {text: acc.text + unit, isDone: false},
        {text: '', isDone: false},
    )
    return `${kept.text.trimEnd()}${ELLIPSIS}`
}

// 항목 이름 글자 크기 — 그 이름이 maxLines 줄 안에 드는 가장 큰 크기(18 → 11). 없으면 원래 크기.
const CATEGORY_FONT_SIZES = Array.from(
    {length: FONT.category.size - MIN_CATEGORY_FONT_SIZE + 1},
    (_, index) => FONT.category.size - index,
)
const fitCategoryFontSize = (label: string, maxWidth: number, maxLines?: number) =>
    maxLines
        ? (CATEGORY_FONT_SIZES.find((size) => wrapCategory(label, maxWidth, size).length <= maxLines) ??
          MIN_CATEGORY_FONT_SIZE)
        : FONT.category.size

// 막대 바닥 값 — 위 설명(데이터에 따라 · 막대 바닥) 참고.
const barFloor = (min: number, max: number) => {
    const range = max - min
    if (min <= 0 || range <= 0) return 0
    const step = TEN ** Math.floor(Math.log10(range))
    return Math.max(0, Math.floor((min - range * FLOOR_MARGIN_RATIO) / step) * step)
}

// 둥근 끝 막대 — 위 모서리만 둥글린다. 높이가 둥글림보다 낮으면 둥글림을 줄인다.
const barPath = (x: number, width: number, endY: number) => {
    const radius = Math.min(BAR_RADIUS, BASELINE_Y - endY, width / 2)
    const right = x + width
    return [
        `M${round(x)},${BASELINE_Y}`,
        `V${round(endY + radius)}`,
        `Q${round(x)},${round(endY)} ${round(x + radius)},${round(endY)}`,
        `H${round(right - radius)}`,
        `Q${round(right)},${round(endY)} ${round(right)},${round(endY + radius)}`,
        `V${BASELINE_Y} Z`,
    ].join(' ')
}

const ComboValueChart = ({
    data,
    ariaLabel,
    barLabel,
    lineLabel,
    barUnit = '',
    lineUnit = '',
    colors,
    formatValue = (value) => numberFormat.format(value),
    formatLineValue = (value) => numberFormat.format(value),
    maxCategoryLines,
    isCategoryTruncated = false,
    className,
    ...props
}: ComboValueChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const columnWidth = WIDTH / Math.max(data.length, 1)
    const barWidth = Math.min(BAR_WIDTH, columnWidth * BAR_FILL_RATIO)

    // 막대 높이 — 바닥(floor)에서 가장 큰 값까지를 바닥선 ~ BAR_TOP_Y 에 펼친다.
    const barValues = data.map((item) => item.value).filter((value) => Number.isFinite(value))
    const barMax = Math.max(0, ...barValues)
    const floor = barFloor(Math.min(...barValues, barMax), barMax)
    const barSpan = barMax - floor
    // 값이 숫자가 아니면(값 없음) 막대 없이 값 글자만 바닥선 위에 둔다.
    const barEndY = (value: number) => {
        if (!Number.isFinite(value)) return BASELINE_Y
        const height = barSpan > 0 ? ((value - floor) / barSpan) * (BASELINE_Y - BAR_TOP_Y) : 0
        return BASELINE_Y - Math.max(MIN_BAR_HEIGHT, height)
    }

    // 선 — 가장 큰 값 LINE_TOP_Y, 가장 작은 값 LINE_BOTTOM_Y. 모두 같으면 가운데.
    const lineValues = data
        .map((item) => item.lineValue)
        .filter((value): value is number => value !== null && Number.isFinite(value))
    const lineMax = Math.max(...lineValues)
    const lineMin = Math.min(...lineValues)
    const lineY = (value: number) =>
        lineMax > lineMin
            ? LINE_TOP_Y + ((lineMax - value) / (lineMax - lineMin)) * (LINE_BOTTOM_Y - LINE_TOP_Y)
            : (LINE_TOP_Y + LINE_BOTTOM_Y) / 2
    const points = data.map((item, index) => {
        const x = columnWidth * (index + 0.5)
        return item.lineValue === null || !Number.isFinite(item.lineValue)
            ? null
            : {x, y: lineY(item.lineValue), value: item.lineValue}
    })
    // 선 조각 — null 에서 끊는다.
    const segments = points.reduce<{x: number; y: number}[][]>(
        (acc, point) => {
            if (!point) return [...acc, []]
            const last = acc.at(-1) ?? []
            return [...acc.slice(0, -1), [...last, point]]
        },
        [[]],
    )

    // 값 글자 크기 — 가장 넓은 값 글자가 칸의 VALUE_FILL_RATIO 를 넘으면 줄인다.
    const widestValue = Math.max(
        0,
        ...data.map((item) => estimateWidth(formatValue(item.value), FONT.value.size)),
        ...lineValues.map((value) => estimateWidth(formatLineValue(value), FONT.lineValue.size)),
    )
    const valueScale = Math.min(1, (columnWidth * VALUE_FILL_RATIO) / Math.max(widestValue, 1))
    const valueFontSize = Math.max(MIN_VALUE_FONT_SIZE, FONT.value.size * valueScale)
    const lineFontSize = Math.max(MIN_VALUE_FONT_SIZE, FONT.lineValue.size * valueScale)

    // 값 글자 자리 — 막대 값은 막대 끝 위, 점 값은 점 위가 기본이다.
    // 점(원)이나 점 글자가 막대 값 글자를 가리면 막대 값 글자를 점 글자 위로 올린다.
    // 올릴 자리가 그림 위로 넘치면 막대 값은 그대로 두고 점 글자를 점 아래로 내린다.
    const valueCap = valueFontSize * CAP_HEIGHT_RATIO
    const lineCap = lineFontSize * CAP_HEIGHT_RATIO
    const labels = data.map((item, index) => {
        const barY = barEndY(item.value) - VALUE_OFFSET
        const point = points[index]
        if (!point) return {barY, lineY: 0}
        const lineY = point.y - LINE_VALUE_OFFSET
        const coverTop = lineY - lineCap
        const coverBottom = point.y + MARKER_RADIUS + LINE_STROKE / 2
        const isCovered = barY - valueCap < coverBottom && barY + LABEL_GAP > coverTop
        if (!isCovered) return {barY, lineY}
        const liftedBarY = coverTop - LABEL_GAP
        return liftedBarY - valueCap >= 0
            ? {barY: liftedBarY, lineY}
            : {barY, lineY: point.y + LINE_VALUE_OFFSET + lineCap}
    })

    const categoryWidth = columnWidth - CATEGORY_PADDING
    const categories = data.map((item) => {
        const fontSize = isCategoryTruncated
            ? FONT.category.size
            : fitCategoryFontSize(item.label, categoryWidth, maxCategoryLines)
        return {
            fontSize,
            lineHeight: (CATEGORY_LINE_HEIGHT * fontSize) / FONT.category.size,
            lines: isCategoryTruncated
                ? [truncateCategory(item.label, categoryWidth, fontSize)]
                : wrapCategory(item.label, categoryWidth, fontSize),
        }
    })
    // 그림 높이 — 가장 높은 이름(줄 수 × 줄 높이)만큼 첫 줄 아래로 늘린다.
    const categoryExtra = Math.max(0, ...categories.map(({lines, lineHeight}) => (lines.length - 1) * lineHeight))
    const height = HEIGHT + categoryExtra

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${WIDTH} ${height}`} className="block h-auto w-full">
                {data.slice(1).map((item, index) => (
                    <line
                        key={`divider-${item.id}`}
                        x1={round(columnWidth * (index + 1))}
                        y1={PLOT_TOP}
                        x2={round(columnWidth * (index + 1))}
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
                {data.map((item, index) => {
                    const center = columnWidth * (index + 0.5)
                    const isSubject = item.tone === 'subject'
                    const fill =
                        item.tone === 'subject'
                            ? color.subjectBar
                            : item.tone === 'average'
                              ? color.averageBar
                              : color.bar
                    const endY = barEndY(item.value)

                    return (
                        <g key={item.id}>
                            {Number.isFinite(item.value) ? (
                                <path d={barPath(center - barWidth / 2, barWidth, endY)} fill={fill} />
                            ) : null}
                            <text
                                x={round(center)}
                                y={round(labels[index].barY)}
                                textAnchor="middle"
                                fontSize={round(valueFontSize)}
                                fontWeight={isSubject ? FONT.value.strongWeight : FONT.value.weight}
                                fill={isSubject ? color.subject : color.value}
                            >
                                {formatValue(item.value)}
                            </text>
                            <text
                                x={round(center)}
                                y={CATEGORY_Y}
                                textAnchor="middle"
                                fontSize={categories[index].fontSize}
                                fontWeight={isSubject ? FONT.category.strongWeight : FONT.category.weight}
                                fill={isSubject ? color.subject : color.category}
                            >
                                {categories[index].lines.map((line, lineIndex) => (
                                    <tspan
                                        key={`${lineIndex}-${line}`}
                                        x={round(center)}
                                        dy={lineIndex ? round(categories[index].lineHeight) : 0}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                        </g>
                    )
                })}
                {segments
                    .filter((segment) => segment.length > 1)
                    .map((segment) => (
                        <polyline
                            key={`line-${segment[0].x}`}
                            points={segment.map((point) => `${round(point.x)},${round(point.y)}`).join(' ')}
                            fill="none"
                            stroke={color.line}
                            strokeWidth={LINE_STROKE}
                            strokeLinejoin="round"
                        />
                    ))}
                {points.map((point, index) => {
                    if (!point) return null
                    const labelY = labels[index].lineY
                    const isOnBar = labelY - lineFontSize * CAP_HEIGHT_RATIO >= barEndY(data[index].value)

                    return (
                        <g key={`point-${data[index].id}`}>
                            <circle
                                cx={round(point.x)}
                                cy={round(point.y)}
                                r={MARKER_RADIUS}
                                fill={color.marker}
                                stroke={color.line}
                                strokeWidth={LINE_STROKE}
                            />
                            <text
                                x={round(point.x)}
                                y={round(labelY)}
                                textAnchor="middle"
                                fontSize={round(lineFontSize)}
                                fontWeight={FONT.lineValue.weight}
                                fill={isOnBar ? color.lineValue : color.value}
                            >
                                {formatLineValue(point.value)}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}: {barLabel} {formatValue(item.value)}
                        {barUnit}, {lineLabel}{' '}
                        {item.lineValue === null || !Number.isFinite(item.lineValue)
                            ? '값 없음'
                            : `${formatLineValue(item.lineValue)}${lineUnit}`}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {ComboValueChart}
export type {ComboValueChartProps, ComboValueColors, ComboValueItem, ComboValueTone}
