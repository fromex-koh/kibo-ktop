import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 지시선 원형 차트(CalloutPieChart) — 분류별 비중을 꽉 찬 원형(파이)과 지시선 라벨로 보여 준다.
// K-BIGx 보고서 인쇄본 진단브리핑의 "기업 보유기술" 차트. 범례 없이 조각마다 이름 · 비중 · 건수를 바로 적는다.
// (가운데가 빈 도넛 + 범례 모양은 PercentageDonutChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   원 = 반지름 112 · 조각 사이 흰 선 2. 12시에서 시작해 시계 방향으로 큰 분류부터 이어진다.
//   가장 큰 조각(비중 INSIDE_LABEL_MIN_PERCENT 이상)은 조각 안에 흰 글자로 이름 · 비중 · 건수를 적는다.
//   자리는 조각 가운데 각도의 반지름 × 0.48 지점이고, 라벨 묶음이 원 밖으로 나가면(한 조각이 90% 이상 등) 원 안에
//   모두 들어갈 때까지 중심 쪽으로 당긴다.
//   나머지 조각은 원 밖(반지름 × 1.21)으로 지시선을 긋고 그 끝에 '이름 비중 건수' 를 적는다.
//   라벨이 겹치면 같은 쪽 라벨끼리 LABEL_GAP 간격이 되도록 위아래로 밀어내고, 가로 위치는 밀려난 높이의 원 둘레로
//   다시 맞춘다(원보다 멀리 밀리면 원 중심에서 LABEL_MIN_OFFSET_X 떨어진 세로줄).
//   위 배치에서 한쪽 지시선이 서로 엇갈리거나 원을 가로지르면(작은 조각이 한쪽에 많이 몰린 경우) 그쪽만
//   세로줄 배치로 바꾼다 — 라벨을 원 바깥 세로줄(반지름 × 1.21)에 놓고, 선은 꺾은 지시선이다: 조각에서 라벨
//   높이의 바깥 원(LEADER_ELBOW) 지점까지 짧게 나간 뒤 가로선(LEADER_TAIL)으로 라벨에 닿는다.
//   세로줄 배치가 생기면 원 돌리기(ROTATION_STEP) × 위 · 아래 가로줄 범위(ROW_ZONES) 배치를 모두 그려 보고,
//   선 엇갈림 · 원 가로지름 · 라벨 겹침 · 선이 글자를 지남이 가장 적고 그다음 그림이 가장 낮은 배치를 쓴다.
//   라벨이 왼쪽에만 쌓이지 않고 오른쪽 · 위 · 아래 빈 자리로 나뉜다. 엉키지 않으면 12시 시작 그대로다.
//   위로 밀어낸 라벨 때문에 그림이 BASE_MAX_HEIGHT 를 넘을 때(한 분류가 아주 큰 경우)도 같은 비교를 한다. 돌린 배치에서는
//   겹친 라벨 묶음을 위로만 밀지 않고 위아래로 고르게 펼친다.
//   높이가 정해진 자리(min-h-0 flex 자리)에서는 그림이 그 높이에 맞춰 같은 비율로 줄어든다(svg size-full).
// 데이터에 따라
//   · 비중이 0 이하인 항목은 그리지 않는다(숨김 목록에는 남는다). 그릴 항목이 없으면 emptyText 만 보인다.
//   · 비중 합이 100 이 아니어도(반올림 99 · 101) 합 기준으로 원을 채우고, 글자는 받은 비중을 그대로 적는다.
//   · 원 크기 · 자리는 늘 같다(그림 폭 556 고정, 원은 가운데). 라벨이 길면 줄을 바꾸고 그림 높이만 늘어난다.
//   · 라벨은 잘리지 않고 모두 보인다. 지시선 라벨은 자기 자리에서 그림 끝까지 남은 폭에 맞춰 줄 수 제한 없이 접고,
//     비중 · 건수가 마지막 줄에 들어가지 않으면 다음 줄로 내린다. 줄이 늘면 이웃 라벨과의 간격도 그만큼 늘린다.
//     maxLabelLines 를 주면(인쇄본 진단브리핑 2) 그 줄 수를 넘는 이름은 마지막 줄 끝에서 말줄임하고 비중 · 건수를 그 줄에
//     붙인다 — 그림 높이 · 원 크기가 이름 길이로 바뀌지 않는다. 화면 낭독기용 목록에는 이름 전체가 남는다.
//     띄어쓰기 · 가운뎃점(·) 뒤에서 먼저 접고, 띄어쓰기 없는 긴 말은 글자 단위로 끊는다.
//   · 조각 안 라벨은 이름이 INSIDE_NAME_MAX_LINES 줄(폭 INSIDE_NAME_MAX_WIDTH) 안에 들 때만 쓴다 — 더 길면 조각 밖으로
//     넘치므로 첫 분류도 지시선 라벨로 적는다.
// SVG 로 직접 그려 크기를 재지 않는다 — 서버에서 바로 그려지고 인쇄에서도 늦게 나타나지 않는다.
// 마우스 반응 · 움직임이 없다(툴팁 없음). 수치 전체는 화면에 보이지 않는 목록으로도 읽어 준다[5.1.1].
//
// [프론트엔드 연동] data 는 비중 내림차순, 최대 8개(기타 포함)로 넘긴다. 색은 항목마다 color 로, 글자 · 선 색은 colors 로 넘긴다
//   (값은 CSS 변수 — 웹 화면은 var(--ds-*), 인쇄본은 var(--kbx-color-*)).

type CalloutPieItem = {
    id: string
    label: string
    /** 비중(%) — 적힌 그대로 보이므로 표시할 자릿수로 넘긴다. */
    percentage: number
    /** 건수 — 비중 옆에 '7개' 처럼 적는다. */
    count?: number
    /** 조각 색(CSS 색 값). */
    color: string
}

type CalloutPieColors = {
    /** 바깥 라벨 이름. */
    label: string
    /** 바깥 라벨 비중. */
    value: string
    /** 바깥 라벨 건수. */
    count: string
    /** 지시선. */
    leader: string
    /** 조각 사이 선 · 안쪽 라벨 이름 · 비중. */
    inside: string
    /** 안쪽 라벨 건수. */
    insideMuted: string
}

type CalloutPieChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly CalloutPieItem[]
    ariaLabel: string
    /** 건수 단위. 기본 '개'. */
    countUnit?: string
    /** 글자 · 선 색. 넘기지 않은 항목은 웹 화면 시맨틱 색을 쓴다. */
    colors?: Partial<CalloutPieColors>
    /** 그릴 조각이 없을 때(빈 목록 · 모두 0%) 보일 문구. */
    emptyText?: string
    /**
     * 그림 칸 높이(칸 폭을 556 으로 볼 때의 높이). 주면 원 크기는 그대로 두고 그림 범위를 칸 높이까지 넓혀,
     * 라벨이 칸 밖으로 나가지 않는 범위에서 원 중심을 칸 세로 가운데에 최대한 맞춘다.
     */
    areaHeight?: number
    /**
     * 바깥 라벨 줄 수 상한(비중 · 건수 줄 포함). 주면 이름이 그 줄 수를 넘을 때 마지막 줄 끝에서 말줄임(…)해
     * 그림 높이가 늘지 않게 한다(원 크기도 그대로). 안 주면 줄 수 제한 없이 모두 보인다.
     */
    maxLabelLines?: number
}

const DEFAULT_COLORS: CalloutPieColors = {
    label: 'var(--ds-foreground)',
    value: 'var(--ds-primary-strong)',
    count: 'var(--ds-foreground-subtle)',
    leader: 'var(--ds-border)',
    // 카드 바탕색 — 라이트는 흰색, 다크는 어두운 색이라 다크에서 밝아지는 조각 위에서도 글자가 보인다(조각 사이 선도 같은 색).
    inside: 'var(--ds-card)',
    insideMuted: 'var(--ds-card)',
}

// 치수(SVG 좌표).
const WIDTH = 556
const RADIUS = 112
const SLICE_STROKE = 2
const LEADER_STROKE = 1.5
const LEADER_START = 1.02
const LEADER_END = 1.21
const LABEL_OFFSET_X = 8
const LABEL_BASELINE = 6
const LABEL_GAP = 46
// 원보다 높이(낮게) 밀려난 라벨은 원 중심에서 이만큼 떨어진 세로줄에 맞춘다.
const LABEL_MIN_OFFSET_X = 40
// 세로줄 배치에서 선이 꺾이는 자리(반지름 배수).
const LEADER_ELBOW = 1.12
// 세로줄 배치에서 꺾인 뒤 라벨까지 이어지는 가로선 길이.
const LEADER_TAIL = 16
// 그림 아래 여백(원 아래 끝 기준).
const VIEW_PADDING_BOTTOM = 29
// 안쪽 라벨 — 조각 가운데 방향으로 반지름의 48% 지점.
const INSIDE_LABEL_RADIUS = 0.48
// 조각 안 라벨이 원 테두리에 닿지 않도록 두는 여백 · 자리를 찾을 때 중심 쪽으로 당기는 단계(반지름 비율).
const INSIDE_EDGE_PADDING = 8
const INSIDE_PULL_STEP = 0.04
const INSIDE_LABEL_MIN_PERCENT = 25
const INSIDE_LINE_HEIGHT = 23
const INSIDE_NAME_Y = -22
const INSIDE_VALUE_Y = 34
const INSIDE_COUNT_Y = 58
// 글자 윗선 높이(글자 크기 대비) — 안쪽 라벨 묶음을 가운데 맞출 때 쓴다.
const CAP_HEIGHT_RATIO = 0.75
// 글자 아랫선 깊이(글자 크기 대비).
const DESCENT_RATIO = 0.25
// 글자 크기 · 굵기.
const FONT = {
    label: {size: 19, weight: 700},
    value: {size: 18, weight: 800},
    count: {size: 16, weight: 500},
    insideName: {size: 18, weight: 700},
    insideValue: {size: 26, weight: 800},
} as const
const VALUE_DX = 10
const COUNT_DX = 6
// 글자 폭 어림(글자 크기 대비) — Pretendard 굵은 글씨 실측(한글 0.86 · 영문 · 숫자 0.5~0.62 · % 1)에 여유를 둔 값.
// 한글 · 한자와 % 는 WIDE, 그 밖(영문 · 숫자 · 기호)은 NARROW.
const WIDE_CHAR_RATIO = 0.9
const NARROW_CHAR_RATIO = 0.62
const WIDE_SYMBOLS = '%'
const WIDE_CHAR_START = 0x1100
const FULL_TURN = 360
const HALF_TURN = 180
// 라벨이 엉킬 때 원을 돌려 보는 각도 간격(도).
const ROTATION_STEP = 15
// 12시 시작 배치를 그대로 쓰는 그림 높이 상한 — 표준 8조각(템플릿) 높이 401 에 여유를 둔 값.
const BASE_MAX_HEIGHT = 420
// 위 · 아래 가로줄 배치 — 12시 · 6시에서 이 각도(도) 안의 조각 라벨을 원 위 · 아래에 가로로 놓아 본다(0 = 쓰지 않음).
const ROW_ZONES = [0, 30, 45] as const
// 가로줄 라벨 한 줄 폭 상한 · 라벨 사이 가로 간격 · 지시선 끝과 글자 사이.
const ROW_LABEL_MAX_WIDTH = 160
const ROW_GAP_X = 24
const ROW_TEXT_GAP = 10
// 선이 라벨 글자를 지나는지 볼 때 선 위에 찍는 점 수.
const SEGMENT_SAMPLES = 24
const PERCENT = 100
// 긴 이름 접기 — 조각 안 줄 폭 · 줄 수 상한, 지시선 라벨 줄 간격.
const INSIDE_NAME_MAX_WIDTH = 100
const INSIDE_NAME_MAX_LINES = 3
const OUTSIDE_LINE_HEIGHT = 23
// 라벨 글자가 그림 가장자리에 붙지 않게 남기는 폭.
const EDGE_PADDING = 4
// 라벨 줄 수가 바뀌면 자리를 다시 잡는다 — 그 반복 상한.
const LAYOUT_PASSES = 3

// 건수는 천 단위 쉼표를 넣는다(1234 → 1,234).
const countFormat = new Intl.NumberFormat('ko-KR')

const toRadian = (degree: number) => (degree * Math.PI) / HALF_TURN
// 12시 기준 시계 방향 각도 → 좌표.
const pointAt = (cx: number, radius: number, degree: number) => ({
    x: cx + radius * Math.sin(toRadian(degree)),
    y: -radius * Math.cos(toRadian(degree)),
})
const round = (value: number) => Math.round(value * 10) / 10

const slicePath = (cx: number, radius: number, start: number, end: number) => {
    const r = round(radius)
    if (end - start >= FULL_TURN) {
        // 한 조각이 원 전체 — 반원 두 개로 그린다.
        return `M ${cx} ${-r} A ${r} ${r} 0 1 1 ${cx} ${r} A ${r} ${r} 0 1 1 ${cx} ${-r} Z`
    }
    const from = pointAt(cx, radius, start)
    const to = pointAt(cx, radius, end)
    const isLarge = end - start > HALF_TURN ? 1 : 0

    return `M ${cx} 0 L ${round(from.x)} ${round(from.y)} A ${r} ${r} 0 ${isLarge} 1 ${round(to.x)} ${round(to.y)} Z`
}

type Point = {x: number; y: number}

// 선분이 원 중심에 가장 가까이 가는 거리 — 원 반지름보다 작으면 선이 원을 가로지른다.
const distanceToCenter = (cx: number, from: Point, to: Point) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const lengthSquared = dx * dx + dy * dy
    const t = lengthSquared ? Math.min(1, Math.max(0, ((cx - from.x) * dx - from.y * dy) / lengthSquared)) : 0
    return Math.hypot(from.x + t * dx - cx, from.y + t * dy)
}

// 두 선분이 서로 엇갈리는지.
const isCrossing = (a1: Point, a2: Point, b1: Point, b2: Point) => {
    const side = (p: Point, q: Point, r: Point) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
    return side(a1, a2, b1) * side(a1, a2, b2) < 0 && side(b1, b2, a1) * side(b1, b2, a2) < 0
}

// 묶음 배치 — 위 → 아래 순서의 원래 높이(naturals)를 지키며 겹치지 않게 놓는다. 겹치는 라벨은 한 묶음으로 합쳐
// 그 원래 높이들의 평균을 중심으로 위아래로 고르게 펼친다(한쪽으로만 밀어 길게 쌓이지 않게).
// gaps[i] = i 번째 라벨과 바로 아래 라벨 사이에 필요한 간격.
// 라벨 자리 — 원 오른쪽 · 왼쪽 · 위 가로줄 · 아래 가로줄.
type LabelPlace = 'right' | 'left' | 'top' | 'bottom'

// 라벨 글자 상자. textY 는 첫 줄 글자 바닥선.
// 그림 범위용(labelBox)은 위아래로 글자 크기만큼 여유를 두고, 겹침 판단용(labelInkBox)은 실제 글자 높이(윗선 ~ 아랫선)만 본다.
type LabelText = {anchor: 'start' | 'end' | 'middle'; textX: number; textY: number; width: number; lineCount: number}
const labelLeft = ({anchor, textX, width}: LabelText) =>
    anchor === 'start' ? textX : anchor === 'end' ? textX - width : textX - width / 2
const labelBox = (label: LabelText) => ({
    left: labelLeft(label),
    right: labelLeft(label) + label.width,
    top: label.textY - LABEL_BASELINE - FONT.label.size,
    bottom: label.textY - LABEL_BASELINE + (label.lineCount - 1) * OUTSIDE_LINE_HEIGHT + FONT.label.size,
})
const labelInkBox = (label: LabelText) => ({
    left: labelLeft(label),
    right: labelLeft(label) + label.width,
    top: label.textY - FONT.label.size * CAP_HEIGHT_RATIO,
    bottom: label.textY + (label.lineCount - 1) * OUTSIDE_LINE_HEIGHT + FONT.label.size * DESCENT_RATIO,
})

type LabelGroup = {start: number; end: number; top: number}
const packBalanced = (naturals: readonly number[], gaps: readonly number[]) => {
    const offset = (start: number, index: number) => gaps.slice(start, index).reduce((sum, gap) => sum + gap, 0)
    const merge = (groups: readonly LabelGroup[], group: LabelGroup): LabelGroup[] => {
        const previous = groups.at(-1)
        if (!previous || previous.top + offset(previous.start, previous.end) + gaps[previous.end] <= group.top) {
            return [...groups, group]
        }
        const members = Array.from({length: group.end - previous.start + 1}, (_, index) => previous.start + index)
        const top =
            members.reduce((sum, member) => sum + naturals[member] - offset(previous.start, member), 0) / members.length
        return merge(groups.slice(0, -1), {start: previous.start, end: group.end, top})
    }
    const groups = naturals.reduce<LabelGroup[]>(
        (acc, natural, index) => merge(acc, {start: index, end: index, top: natural}),
        [],
    )
    return groups.flatMap((group) =>
        Array.from(
            {length: group.end - group.start + 1},
            (_, index) => group.top + offset(group.start, group.start + index),
        ),
    )
}

const estimateTextWidth = (text: string, fontSize: number) =>
    [...text].reduce(
        (sum, char) =>
            sum +
            fontSize *
                ((char.codePointAt(0) ?? 0) >= WIDE_CHAR_START || WIDE_SYMBOLS.includes(char)
                    ? WIDE_CHAR_RATIO
                    : NARROW_CHAR_RATIO),
        0,
    )

// 이름 접기 — 띄어쓰기 · 가운뎃점(·) 뒤를 먼저 끊을 자리로 쓰고, 한 덩어리가 폭을 넘으면 글자 단위로 끊는다.
// 줄 수 제한 없이 모두 남긴다(글자를 줄이지 않는다).
const wrapName = (text: string, fontSize: number, maxWidth: number) => {
    const fits = (line: string) => estimateTextWidth(line.trimEnd(), fontSize) <= maxWidth
    const pieces = text.split(/(?<=[\s·])/).flatMap((piece) =>
        fits(piece)
            ? [piece]
            : [...piece].reduce<string[]>((acc, char) => {
                  const last = acc.at(-1) ?? ''
                  return last && fits(last + char) ? [...acc.slice(0, -1), last + char] : [...acc, char]
              }, []),
    )
    return pieces
        .reduce<string[]>((acc, piece) => {
            const last = acc.at(-1)
            return last !== undefined && fits(last + piece) ? [...acc.slice(0, -1), last + piece] : [...acc, piece]
        }, [])
        .map((line) => line.trim())
}

const ELLIPSIS = '…'

// 줄 끝 말줄임 — 남은 폭(maxWidth)에 '…' 까지 들어가는 데까지 글자를 남긴다.
const ellipsize = (text: string, fontSize: number, maxWidth: number) =>
    [...text].reduce(
        (acc, char) => (estimateTextWidth(`${acc}${char}${ELLIPSIS}`, fontSize) <= maxWidth ? `${acc}${char}` : acc),
        '',
    ) + ELLIPSIS

// 라벨 줄 나누기 — 이름을 폭에 맞춰 접고, 비중 · 건수(reserve 폭)가 마지막 줄에 들어가지 않으면 다음 줄로 내린다.
// maxLines 를 주면 전체 줄 수가 그 안에 들도록 넘치는 이름은 마지막 줄 끝에서 말줄임하고 비중 · 건수를 그 줄에 붙인다.
const wrapWithValue = (text: string, fontSize: number, maxWidth: number, reserve: number, maxLines?: number) => {
    const nameLines = wrapName(text, fontSize, maxWidth)
    const isValueOnNewLine = estimateTextWidth(nameLines.at(-1) ?? '', fontSize) + reserve > maxWidth
    const lineCount = nameLines.length + (isValueOnNewLine ? 1 : 0)
    if (!maxLines || lineCount <= maxLines) return {nameLines, isValueOnNewLine, lineCount}
    const kept = nameLines.slice(0, maxLines - 1)
    const rest = nameLines.slice(maxLines - 1).join(' ')
    return {
        nameLines: [...kept, ellipsize(rest, fontSize, maxWidth - reserve)],
        isValueOnNewLine: false,
        lineCount: maxLines,
    }
}

const CalloutPieChart = ({
    data,
    ariaLabel,
    countUnit = '개',
    colors,
    emptyText = '표시할 데이터가 없습니다.',
    areaHeight,
    maxLabelLines,
    className,
    ...props
}: CalloutPieChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const visible = data.filter((item) => item.percentage > 0)
    const total = visible.reduce((sum, item) => sum + item.percentage, 0) || PERCENT

    if (!visible.length) {
        return (
            <div className={cn('w-full', className)} {...props}>
                <p className="py-10 text-center" style={{color: color.count}}>
                    {emptyText}
                </p>
            </div>
        )
    }

    const cx = WIDTH / 2
    // 원 돌린 각도(rotation, 도) · 가로줄 범위(zone, 도)별 배치 — 둘 다 0 이면 12시에서 시작하고 라벨은 좌우에만 둔다
    // (템플릿 모양). 배치가 그림 폭에 들어가지 않으면 null.
    const layoutAt = (rotation: number, zone: number, radius: number) => {
        const isTemplate = rotation === 0 && zone === 0
        // 조각 각도.
        const slices = visible.reduce<{item: CalloutPieItem; start: number; end: number}[]>((acc, item) => {
            const start = acc.at(-1)?.end ?? rotation
            return [...acc, {item, start, end: start + (item.percentage / total) * FULL_TURN}]
        }, [])
        const [first] = slices
        const insideNameLines = first ? wrapName(first.item.label, FONT.insideName.size, INSIDE_NAME_MAX_WIDTH) : []
        const hasInsideLabel = Boolean(
            first &&
            first.item.percentage >= INSIDE_LABEL_MIN_PERCENT &&
            insideNameLines.length <= INSIDE_NAME_MAX_LINES,
        )
        // 조각 가운데 각도는 0 ~ 360 으로 맞춘다 — 원을 돌리면 마지막 조각들이 360 을 넘거나 첫 조각이 0 아래에서 시작한다.
        const outside = slices
            .slice(hasInsideLabel ? 1 : 0)
            .map((slice) => {
                const middle = ((((slice.start + slice.end) / 2) % FULL_TURN) + FULL_TURN) % FULL_TURN
                const isTop = zone > 0 && (middle < zone || middle > FULL_TURN - zone)
                const isBottom = zone > 0 && Math.abs(middle - HALF_TURN) < zone
                const place: LabelPlace = isTop ? 'top' : isBottom ? 'bottom' : middle < HALF_TURN ? 'right' : 'left'
                return {...slice, middle, isRight: middle < HALF_TURN, place}
            })
            // 오른쪽은 위 → 아래, 왼쪽은 아래 → 위 순서(각도 오름차순)로 놓는다.
            .sort((a, b) => a.middle - b.middle)
        type OutsideSlice = (typeof outside)[number]

        const valueWidth = (item: CalloutPieItem) =>
            VALUE_DX +
            estimateTextWidth(`${item.percentage}%`, FONT.value.size) +
            (item.count === undefined
                ? 0
                : COUNT_DX + estimateTextWidth(`${countFormat.format(item.count)}${countUnit}`, FONT.count.size))

        // 라벨 폭 — 가장 긴 줄(비중 · 건수가 붙은 마지막 줄 포함).
        const labelWidth = (wrap: Wrapped, item: CalloutPieItem) =>
            Math.max(
                ...wrap.nameLines.map((line) => estimateTextWidth(line, FONT.label.size)),
                wrap.isValueOnNewLine
                    ? valueWidth(item) - VALUE_DX
                    : estimateTextWidth(wrap.nameLines.at(-1) ?? '', FONT.label.size) + valueWidth(item),
            )

        // 라벨 줄 — 지시선 끝(x)에서 그림 가장자리까지 남은 폭에 맞춰 이름을 접고, 비중 · 건수가 마지막 줄에
        // 들어가지 않으면 다음 줄로 내린다.
        const wrapLabel = (slice: OutsideSlice, x: number) => {
            const available = slice.isRight
                ? WIDTH - EDGE_PADDING - (x + LABEL_OFFSET_X)
                : x - LABEL_OFFSET_X - EDGE_PADDING
            return wrapWithValue(slice.item.label, FONT.label.size, available, valueWidth(slice.item), maxLabelLines)
        }
        type Wrapped = ReturnType<typeof wrapLabel>

        // 한 쪽 라벨 자리 — 원에서 먼 쪽으로 차례대로 놓으며 겹치면 밀어낸다(오른쪽은 위 → 아래, 왼쪽은 아래 → 위).
        // 라벨 첫 줄이 지시선 끝에 오고 나머지 줄은 아래로 이어지므로, 아래쪽 라벨의 줄 수만큼 간격을 더 둔다.
        // 그 배치에서 선이 엇갈리거나 원을 가로지르면 그쪽만 세로줄 배치(꺾인 선)로 바꾼다.
        const placeSide = (side: readonly OutsideSlice[], wraps: readonly Wrapped[], isRight: boolean) => {
            // 위 → 아래 순서(오른쪽은 그대로, 왼쪽은 뒤집어)와 라벨 사이 간격(위 라벨의 줄 수만큼 늘린다).
            const order = isRight ? side.map((_, index) => index) : side.map((_, index) => side.length - 1 - index)
            const gaps = order.map((index) => LABEL_GAP + (wraps[index].lineCount - 1) * OUTSIDE_LINE_HEIGHT)
            const naturalYs = order.map((index) => pointAt(cx, radius * LEADER_END, side[index].middle).y)
            // 원을 돌리거나 가로줄을 쓴 배치는 겹친 라벨 묶음을 위아래로 고르게 펼친다. 템플릿 배치(12시 시작)만
            // 원 위쪽으로 밀어 올린다.
            const balancedYs = isTemplate ? [] : packBalanced(naturalYs, gaps)
            const placed = side.reduce<{y: number; x: number}[]>((acc, slice, index) => {
                const natural = pointAt(cx, radius * LEADER_END, slice.middle)
                const previous = acc.at(-1)
                const y = !isTemplate
                    ? balancedYs[order.indexOf(index)]
                    : previous === undefined
                      ? natural.y
                      : isRight
                        ? Math.max(
                              natural.y,
                              previous.y + LABEL_GAP + (wraps[index - 1].lineCount - 1) * OUTSIDE_LINE_HEIGHT,
                          )
                        : Math.min(
                              natural.y,
                              previous.y - LABEL_GAP - (wraps[index].lineCount - 1) * OUTSIDE_LINE_HEIGHT,
                          )
                // 가로 위치 — 라벨의 모든 줄이 원 둘레(반지름 × 1.21) 밖에 오도록 가장 바깥이 필요한 줄에 맞춘다.
                // 위쪽 라벨이 여러 줄이면 아래 줄이 원의 볼록한 쪽으로 내려가므로 첫 줄만 보면 원에 닿는다.
                const leaderRadius = radius * LEADER_END
                const lineYs = Array.from({length: wraps[index].lineCount}, (_, line) => y + line * OUTSIDE_LINE_HEIGHT)
                const offsetX = Math.max(
                    LABEL_MIN_OFFSET_X,
                    ...lineYs.map((lineY) => Math.sqrt(Math.max(leaderRadius ** 2 - lineY ** 2, 0))),
                )
                return [...acc, {y, x: isRight ? cx + offsetX : cx - offsetX}]
            }, [])
            const leaders = side.map((slice, index) => ({
                from: pointAt(cx, radius * LEADER_START, slice.middle),
                to: placed[index],
            }))
            const isTangled =
                leaders.some((leader) => distanceToCenter(cx, leader.from, leader.to) < radius - 1) ||
                leaders.some((a, index) => leaders.slice(index + 1).some((b) => isCrossing(a.from, a.to, b.from, b.to)))
            const columnX = cx + (isRight ? 1 : -1) * radius * LEADER_END
            // 세로줄 배치 — 라벨 높이를 원래 자리(지시선 끝) 기준 묶음 배치로 다시 잡는다.
            const packed = isTangled ? packBalanced(naturalYs, gaps) : []
            const columnY = (index: number) => packed[order.indexOf(index)]

            // 세로줄 선(보고서 차트의 꺾은 지시선) — 조각 바깥(반지름 × LEADER_ELBOW) 지점에서 라벨 높이까지 세로로
            // 오르내린 뒤 꺾여, 가로선으로 라벨에 닿는다. 세로 · 가로로만 꺾여 이웃 선과 엇갈리지 않는다.
            // 세로선이 원을 가로지르면 조각에서 바깥으로 곧게 나간 뒤 세로줄에서 꺾는다.
            const direction = isRight ? 1 : -1
            const elbowRadius = radius * LEADER_ELBOW
            return side.map((slice, index) => {
                if (!isTangled)
                    return {slice, end2: placed[index], points: [leaders[index].from, placed[index]], isTangled}
                const {from} = leaders[index]
                const y = columnY(index)
                const end2 = {x: columnX + direction * LEADER_TAIL, y}
                const elbow = pointAt(cx, elbowRadius, slice.middle)
                const bend = {x: elbow.x, y}
                const points =
                    distanceToCenter(cx, from, bend) < radius
                        ? [from, elbow, {x: columnX, y}, end2]
                        : [from, bend, end2]
                return {slice, end2, points, isTangled}
            })
        }

        // 줄 수가 자리에 따라 달라지므로(남은 폭) 자리 → 줄 → 자리를 줄 수가 바뀌지 않을 때까지 되풀이한다.
        const layoutSide = (isRight: boolean) => {
            const side = outside.filter((slice) => slice.place === (isRight ? 'right' : 'left'))
            const initial = side.map((slice) => wrapLabel(slice, pointAt(cx, radius * LEADER_END, slice.middle).x))
            const result = Array.from({length: LAYOUT_PASSES}).reduce<{
                wraps: Wrapped[]
                placed: ReturnType<typeof placeSide>
                isStable: boolean
            }>(
                (acc) => {
                    if (acc.isStable) return acc
                    const placed = placeSide(side, acc.wraps, isRight)
                    const wraps = placed.map((label) => wrapLabel(label.slice, label.end2.x))
                    const isStable = wraps.every((wrap, index) => wrap.lineCount === acc.wraps[index].lineCount)
                    return {wraps, placed: isStable ? placed : placeSide(side, wraps, isRight), isStable}
                },
                {wraps: initial, placed: placeSide(side, initial, isRight), isStable: false},
            )
            return result.placed.map((label, index) => {
                const wrap = result.wraps[index]
                return {
                    ...label,
                    ...wrap,
                    anchor: isRight ? ('start' as const) : ('end' as const),
                    textX: label.end2.x + (isRight ? LABEL_OFFSET_X : -LABEL_OFFSET_X),
                    textY: label.end2.y + LABEL_BASELINE,
                    width: labelWidth(wrap, label.slice.item),
                }
            })
        }

        // 위 · 아래 가로줄 — 원 위(아래)에 라벨을 가로로 나란히 놓는다. 라벨 가운데를 조각 방향의 원 둘레 x 에
        // 두고, 겹치면 묶음 배치로 좌우로 펼친다. 줄은 ROW_LABEL_MAX_WIDTH 로 접는다. 위 줄은 마지막 줄 아래를,
        // 아래 줄은 첫 줄 위를 원 둘레(반지름 × 1.21) 높이에 맞춰 원과 닿지 않는다. 그림 폭을 넘으면 null.
        const layoutRow = (isTop: boolean) => {
            const row = outside
                .filter((slice) => slice.place === (isTop ? 'top' : 'bottom'))
                .map((slice) => {
                    const wrap = wrapWithValue(
                        slice.item.label,
                        FONT.label.size,
                        ROW_LABEL_MAX_WIDTH,
                        valueWidth(slice.item),
                        maxLabelLines,
                    )
                    return {slice, wrap, natural: pointAt(cx, radius * LEADER_END, slice.middle).x}
                })
                .sort((a, b) => a.natural - b.natural)
            if (!row.length) return []
            const widths = row.map(({slice, wrap}) => labelWidth(wrap, slice.item))
            const packed = packBalanced(
                row.map(({natural}) => natural),
                widths.slice(1).map((width, index) => (widths[index] + width) / 2 + ROW_GAP_X),
            )
            const left = packed[0] - widths[0] / 2
            const right = (packed.at(-1) ?? 0) + (widths.at(-1) ?? 0) / 2
            if (right - left > WIDTH - EDGE_PADDING * 2) return null
            const shift = Math.max(EDGE_PADDING - left, 0) + Math.min(WIDTH - EDGE_PADDING - right, 0)
            const edgeY = radius * LEADER_END
            return row.map(({slice, wrap}, index) => {
                const x = packed[index] + shift
                const end2 = {x, y: isTop ? -edgeY : edgeY}
                const textY = isTop
                    ? -edgeY - ROW_TEXT_GAP - (wrap.lineCount - 1) * OUTSIDE_LINE_HEIGHT
                    : edgeY + ROW_TEXT_GAP + FONT.label.size
                return {
                    slice,
                    end2,
                    points: [pointAt(cx, radius * LEADER_START, slice.middle), end2],
                    isTangled: false,
                    ...wrap,
                    anchor: 'middle' as const,
                    textX: x,
                    textY,
                    width: widths[index],
                }
            })
        }
        const topRow = layoutRow(true)
        const bottomRow = layoutRow(false)
        if (!topRow || !bottomRow) return null
        const labels = [...layoutSide(true), ...layoutSide(false), ...topRow, ...bottomRow]

        const top = Math.min(-radius, ...labels.map((label) => labelBox(label).top))
        const bottom = Math.max(radius + VIEW_PADDING_BOTTOM, ...labels.map((label) => labelBox(label).bottom))
        return {slices, first, hasInsideLabel, insideNameLines, labels, top, bottom, radius}
    }
    // 원 돌리기 — 12시 시작 배치에서 지시선이 엉켜 세로줄 배치가 생기면(작은 조각이 한쪽에 몰린 경우) 원을
    // ROTATION_STEP 씩 돌려 보며 선이 엉키는 수가 가장 적고, 그다음 그림 높이가 가장 낮은 각도를 쓴다(같으면 덜 돌린 쪽). 큰 조각이 아래 · 옆으로 가면
    // 작은 조각이 원 위쪽 양옆으로 나뉘어, 라벨이 왼쪽 한 줄에 몰리지 않고 오른쪽 · 아래의 빈 자리도 쓴다.
    // 엉키지 않으면 돌리지 않는다(템플릿 모양 유지).
    type Layout = NonNullable<ReturnType<typeof layoutAt>>
    // 비교 기준 — 지시선(꺾인 선 포함)끼리 엇갈리거나 원을 가로지르는 수가 적은 쪽, 같으면 그림 높이가 낮은 쪽.
    const tangleCount = (layout: Layout) => {
        const segments = layout.labels.flatMap((label, owner) =>
            label.points.slice(1).map((to, index) => ({owner, from: label.points[index], to})),
        )
        const piercing = segments.filter(({from, to}) => distanceToCenter(cx, from, to) < layout.radius - 1).length
        const crossing = segments.reduce(
            (sum, a, index) =>
                sum +
                segments.slice(index + 1).filter((b) => a.owner !== b.owner && isCrossing(a.from, a.to, b.from, b.to))
                    .length,
            0,
        )
        const boxes = layout.labels.map(labelInkBox)
        const overlapping = boxes.reduce(
            (sum, a, index) =>
                sum +
                boxes
                    .slice(index + 1)
                    .filter((b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom).length,
            0,
        )
        // 선이 다른 라벨 글자 위를 지나는 수 — 선 위 점을 고르게 찍어 글자 상자 안에 드는지 본다.
        const throughText = segments.filter(({owner, from, to}) =>
            Array.from({length: SEGMENT_SAMPLES}, (_, step) => (step + 1) / (SEGMENT_SAMPLES + 1)).some((t) => {
                const x = from.x + (to.x - from.x) * t
                const y = from.y + (to.y - from.y) * t
                return boxes.some(
                    (box, index) => index !== owner && x > box.left && x < box.right && y > box.top && y < box.bottom,
                )
            }),
        ).length
        return piercing + crossing + overlapping + throughText
    }
    const height = (layout: Layout) => layout.bottom - layout.top
    // 다른 배치를 비교하는 경우 — 선이 엉키거나(세로줄 배치), 위로 밀어낸 라벨 때문에 그림이 표준 8조각 높이를
    // 넘을 때(한 분류가 아주 커서 작은 조각이 12시 근처에 몰린 경우).
    const pickLayout = (radius: number) => {
        const base = layoutAt(0, 0, radius) ?? null
        if (!base) return null
        const isBaseTangled = base.labels.some((label) => label.isTangled)
        const shouldCompare = isBaseTangled || height(base) > BASE_MAX_HEIGHT
        const candidates = shouldCompare
            ? ROW_ZONES.flatMap((zone) =>
                  Array.from({length: FULL_TURN / ROTATION_STEP}, (_, index) =>
                      layoutAt(index * ROTATION_STEP, zone, radius),
                  ),
              ).filter((layout): layout is Layout => layout !== null)
            : [base]
        const scored = candidates.map((layout) => ({layout, tangles: tangleCount(layout), height: height(layout)}))
        return scored.reduce((best, candidate) =>
            candidate.tangles < best.tangles || (candidate.tangles === best.tangles && candidate.height < best.height)
                ? candidate
                : best,
        ).layout
    }
    const radius = RADIUS
    const chosen = pickLayout(radius)
    if (!chosen) return null
    const {slices, first, hasInsideLabel, insideNameLines, labels, top, bottom} = chosen
    // 그림 범위 — 칸 높이를 받으면 그 높이까지 넓히고, 원 중심(y = 0)이 가운데에 오도록 위치를 잡되 라벨이
    // 범위 밖으로 나가지 않게 한다(라벨이 위로 길면 원이 조금 아래에 온다).
    const viewHeight = Math.max(areaHeight ?? 0, bottom - top)
    const viewTop = Math.min(top, Math.max(bottom - viewHeight, -viewHeight / 2))

    // 조각이 하나(원 전체)면 안쪽 라벨 묶음(이름 첫 줄 윗선 ~ 마지막 줄 아랫선)이 원 한가운데에 오게 올린다.
    const insideTop =
        INSIDE_NAME_Y - (insideNameLines.length - 2) * INSIDE_LINE_HEIGHT - FONT.insideName.size * CAP_HEIGHT_RATIO
    const insideBottom = first?.item.count === undefined ? INSIDE_VALUE_Y : INSIDE_COUNT_Y
    // 조각 안 라벨의 줄마다(이름 줄 · 비중 · 건수) 글자 상자가 원 안에 모두 들어가는지.
    // 한 조각이 아주 크면(90% 이상 등) 조각 가운데 각도가 원 아래쪽이라 기본 자리에서는 라벨이 원 밖으로 나가
    // 흰 글자가 흰 바탕에 묻힌다 — 들어갈 때까지 원 중심 쪽으로 당긴다(중심은 늘 들어간다).
    const insideLines = first
        ? [
              ...insideNameLines.map((line, index) => ({
                  text: line,
                  font: FONT.insideName,
                  y: INSIDE_NAME_Y + (index - insideNameLines.length + 2) * INSIDE_LINE_HEIGHT,
              })),
              {text: `${first.item.percentage}%`, font: FONT.insideValue, y: INSIDE_VALUE_Y},
              ...(first.item.count === undefined
                  ? []
                  : [
                        {
                            text: `${countFormat.format(first.item.count)}${countUnit}`,
                            font: FONT.count,
                            y: INSIDE_COUNT_Y,
                        },
                    ]),
          ]
        : []
    const isInsideCircle = (point: {x: number; y: number}) =>
        insideLines.every((line) => {
            const halfWidth = estimateTextWidth(line.text, line.font.size) / 2
            return [point.x - halfWidth, point.x + halfWidth].every((x) =>
                [
                    point.y + line.y - line.font.size * CAP_HEIGHT_RATIO,
                    point.y + line.y + line.font.size * DESCENT_RATIO,
                ].every((y) => Math.hypot(x - cx, y) <= radius - INSIDE_EDGE_PADDING),
            )
        })
    const pullRatios = Array.from(
        {length: Math.floor(INSIDE_LABEL_RADIUS / INSIDE_PULL_STEP) + 1},
        (_, index) => INSIDE_LABEL_RADIUS - index * INSIDE_PULL_STEP,
    )
    const inside = !first
        ? null
        : slices.length === 1
          ? {x: cx, y: -(insideTop + insideBottom) / 2}
          : (pullRatios
                .map((ratio) => pointAt(cx, radius * ratio, (first.start + first.end) / 2))
                .find(isInsideCircle) ?? {x: cx, y: 0})

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg
                role="img"
                aria-label={ariaLabel}
                viewBox={`0 ${round(viewTop)} ${WIDTH} ${round(viewHeight)}`}
                className="block size-full overflow-visible"
            >
                {slices.map((slice) => (
                    <path
                        key={slice.item.id}
                        d={slicePath(cx, radius, slice.start, slice.end)}
                        fill={slice.item.color}
                        stroke={color.inside}
                        strokeWidth={SLICE_STROKE}
                    />
                ))}

                {labels.map((label) => {
                    const {item} = label.slice
                    const textX = round(label.textX)

                    return (
                        <g key={item.id}>
                            <polyline
                                points={label.points.map((point) => `${round(point.x)},${round(point.y)}`).join(' ')}
                                fill="none"
                                stroke={color.leader}
                                strokeWidth={LEADER_STROKE}
                            />
                            <text
                                x={textX}
                                y={round(label.textY)}
                                textAnchor={label.anchor}
                                fontSize={FONT.label.size}
                                fontWeight={FONT.label.weight}
                                fill={color.label}
                            >
                                {label.nameLines.map((line, index) => (
                                    <tspan key={`${index}-${line}`} x={textX} dy={index ? OUTSIDE_LINE_HEIGHT : 0}>
                                        {line}
                                    </tspan>
                                ))}
                                {/* 비중 · 건수 — 마지막 줄 뒤에 붙고, 들어가지 않으면 다음 줄 처음에 온다. */}
                                <tspan
                                    {...(label.isValueOnNewLine ? {x: textX, dy: OUTSIDE_LINE_HEIGHT} : {dx: VALUE_DX})}
                                    fontSize={FONT.value.size}
                                    fontWeight={FONT.value.weight}
                                    fill={color.value}
                                >
                                    {item.percentage}%
                                </tspan>
                                {item.count !== undefined ? (
                                    <tspan
                                        dx={COUNT_DX}
                                        fontSize={FONT.count.size}
                                        fontWeight={FONT.count.weight}
                                        fill={color.count}
                                    >
                                        {countFormat.format(item.count)}
                                        {countUnit}
                                    </tspan>
                                ) : null}
                            </text>
                        </g>
                    )
                })}

                {hasInsideLabel && first && inside ? (
                    <g textAnchor="middle">
                        {/* 이름은 마지막 줄이 비중 바로 위에 오도록 위로 쌓는다(2줄이면 템플릿 자리). */}
                        <text
                            y={round(inside.y + INSIDE_NAME_Y - (insideNameLines.length - 2) * INSIDE_LINE_HEIGHT)}
                            fontSize={FONT.insideName.size}
                            fontWeight={FONT.insideName.weight}
                            fill={color.inside}
                        >
                            {insideNameLines.map((line, index) => (
                                <tspan key={`${index}-${line}`} x={round(inside.x)} dy={index ? INSIDE_LINE_HEIGHT : 0}>
                                    {line}
                                </tspan>
                            ))}
                        </text>
                        <text
                            x={round(inside.x)}
                            y={round(inside.y + INSIDE_VALUE_Y)}
                            fontSize={FONT.insideValue.size}
                            fontWeight={FONT.insideValue.weight}
                            fill={color.inside}
                        >
                            {first.item.percentage}%
                        </text>
                        {first.item.count !== undefined ? (
                            <text
                                x={round(inside.x)}
                                y={round(inside.y + INSIDE_COUNT_Y)}
                                fontSize={FONT.count.size}
                                fontWeight={FONT.count.weight}
                                fill={color.insideMuted}
                            >
                                {countFormat.format(first.item.count)}
                                {countUnit}
                            </text>
                        ) : null}
                    </g>
                ) : null}
            </svg>
            {/* 그림을 볼 수 없는 사용자를 위한 같은 내용의 목록. */}
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label} {item.percentage}%
                        {item.count !== undefined ? ` ${countFormat.format(item.count)}${countUnit}` : ''}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {CalloutPieChart}
export type {CalloutPieChartProps, CalloutPieColors, CalloutPieItem}
