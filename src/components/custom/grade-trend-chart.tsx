'use client'

import {useState, type ComponentPropsWithoutRef} from 'react'
import {LabelList, Line, LineChart as RechartsLineChart, ReferenceDot, usePlotArea, XAxis, YAxis} from 'recharts'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

// 등급 추이 차트 — 값이 숫자가 아니라 등급(AAA · AA · A …)인 꺾은선이다.
// 꺾은선은 비교 기준(특허 등급조회에서는 '동일 특허분야 평균')의 분기별 등급이고,
// 진하게 채운 점 하나는 그 기준과 견주는 주인공(평가대상)이다 — 선과 다른 값이며 마지막 분기 자리에 선다.
//
// 시안 규격(특허 등급조회 '동일 특허분야 평균(등급)' 카드): 격자 4칸 × 8칸(칸 59.5×29) ·
// 세로축 등급 9단(11 Regular gray.700) · 가로축 분기 두 줄(12 Regular gray.700) · 격자 안쪽 점선 · 바깥 실선 · 꼭짓점 원 12(흰 면 · 선 색 테두리) ·
// 꼭짓점 위 등급(11 Regular gray.600) · 평가대상 점 12(navy.500 채움) · 점 아래 "등급 평가대상"(11 Bold navy.600).

type GradeTrendPoint = {
    /** 가로축 이름. 줄을 바꿀 자리는 \n 으로 나눈다(예: "'26년\n2분기"). */
    label: string
    /** 이 시점의 등급. scale 에 있는 값이어야 한다. */
    grade: string
}

type GradeTrendTarget = {
    /** 주인공의 등급. 선과 다른 값일 수 있다. */
    grade: string
    /** 점 아래에 등급과 함께 붙는 말. */
    label?: string
    /** 주인공이 설 자리(0부터). 기본은 마지막 시점이다. */
    index?: number
}

type GradeTrendChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /** 꺾은선으로 그릴 비교 기준의 시점별 등급. */
    data: GradeTrendPoint[]
    /** 세로축 등급 눈금 — 높은 등급부터 낮은 등급 순으로 준다. */
    scale: readonly string[]
    /** 꺾은선의 이름(숨김 표의 열 이름). */
    seriesLabel?: string
    /** 꺾은선과 꼭짓점의 색. 차트 토큰(var(--ds-chart-N))을 쓴다. */
    color?: string
    /** 비교 대상인 주인공. 없으면 꺾은선만 그린다. */
    target?: GradeTrendTarget
    /**
     * 처음 그릴 때의 움직임. 한 번 그린 뒤에는 창 폭이 바뀌어도 다시 그리지 않는다.
     * 인쇄용 문서에서는 끈다.
     */
    animate?: boolean
    /**
     * 값을 불러오는 중. 같은 크기(h-72)의 스켈레톤을 대신 보인다.
     * 새로고침 직후 차트가 칸의 폭을 재기 전(하이드레이션 전)에도 같은 스켈레톤이 자동으로 보인다.
     */
    isLoading?: boolean
    /** 불러오는 중에 화면 낭독기가 읽을 말. */
    loadingLabel?: string
}

const AXIS_FONT_SIZE = 11
const TICK_FONT_SIZE = 12
const DOT_RADIUS = 6
// 점 위 등급은 점에서 6, 평가대상 이름표는 점에서 5 떨어진다(시안).
const VALUE_LABEL_GAP = 6
const TARGET_LABEL_GAP = 5
const TARGET_LINE_HEIGHT = 16.5
// 이름표 자리 판단 — 평가대상 이름표(두 줄 ≈ 40)는 격자 한 칸(29)보다 커서 위아래 두 칸을 차지한다.
// 가장 낮은 두 등급(C · CC)에서 아래로 두면 가로축 이름과, 가장 높은 두 등급(AAA · AA)에서 위로 두면 격자 밖과 부딪친다.
const TARGET_LABEL_ROWS = 2
// 세로축 이름 칸 31 · 격자 위아래로 등급 글자가 반씩 넘치므로 위 8 을 둔다. 오른쪽 1 은 격자 테두리 선의 두께다.
// 차트 높이는 시안의 그래프 영역(격자 234 + 가로축 44 + 위 여백 8 = 286)에 가장 가까운 h-72(288)다.
const Y_AXIS_WIDTH = 31
const X_AXIS_HEIGHT = 44
const CHART_MARGIN = {top: 8, right: 1, bottom: 0, left: 0}
const GRID_DASH = '4 4'
// recharts 기본 층 — 선 400 · 점 600 · 이름표 2000. 평가대상은 그 위(2100)에 둔다.
const TARGET_Z_INDEX = 2100

// 격자 — 시안은 바깥 테두리가 실선이고 안쪽 칸 경계가 점선이다. 세로 경계는 분기 칸 사이(점이 칸 가운데 선다)라
// 눈금 위치에 선을 긋는 CartesianGrid 로는 그릴 수 없어, 그릴 자리(plot area)를 받아 직접 긋는다.
type GridFrameProps = {columns: number; rows: number}

const GridFrame = ({columns, rows}: GridFrameProps) => {
    const plotArea = usePlotArea()
    if (!plotArea) return null

    const {x, y, width, height} = plotArea
    const columnWidth = width / columns
    const rowHeight = height / rows

    return (
        <g aria-hidden="true">
            {Array.from({length: rows - 1}, (_, index) => (
                <line
                    key={`row-${index}`}
                    x1={x}
                    x2={x + width}
                    y1={y + rowHeight * (index + 1)}
                    y2={y + rowHeight * (index + 1)}
                    stroke="var(--ds-subtle-3)"
                    strokeDasharray={GRID_DASH}
                />
            ))}
            {Array.from({length: columns - 1}, (_, index) => (
                <line
                    key={`column-${index}`}
                    x1={x + columnWidth * (index + 1)}
                    x2={x + columnWidth * (index + 1)}
                    y1={y}
                    y2={y + height}
                    stroke="var(--ds-subtle-3)"
                    strokeDasharray={GRID_DASH}
                />
            ))}
            <rect x={x} y={y} width={width} height={height} fill="none" stroke="var(--ds-subtle-3)" />
        </g>
    )
}

// 세로축 등급 — 시안은 이름 칸 왼쪽 끝에 붙여 쓰고(왼쪽 정렬), 격자 가로선 높이에 가운데를 맞춘다.
type GradeTickProps = {y?: number; payload?: {value?: string | number}; scale: readonly string[]}

const GradeTick = ({y = 0, payload, scale}: GradeTickProps) => (
    <text
        x={CHART_MARGIN.left}
        y={y}
        dominantBaseline="central"
        textAnchor="start"
        fill="var(--ds-label-foreground)"
        fontSize={AXIS_FONT_SIZE}
    >
        {scale[scale.length - 1 - Number(payload?.value ?? 0)] ?? ''}
    </text>
)

// 평가대상 점 — 진하게 채운 점 아래에 "등급" / "평가대상" 두 줄(11 Bold)을 둔다.
// 아래 두 등급(CC · C)에서는 점 아래 두 줄이 가로축 이름과 겹치므로 점 위로 올린다.
type TargetDotProps = {cx?: number; cy?: number; grade: string; label: string; isLabelAbove: boolean}

const TargetDot = ({cx = 0, cy = 0, grade, label, isLabelAbove}: TargetDotProps) => (
    <g>
        <circle cx={cx} cy={cy} r={DOT_RADIUS} fill="var(--ds-navy-500)" />
        <text
            x={cx}
            y={
                isLabelAbove
                    ? cy - DOT_RADIUS - TARGET_LABEL_GAP - TARGET_LINE_HEIGHT
                    : cy + DOT_RADIUS + TARGET_LABEL_GAP
            }
            textAnchor="middle"
            fill="var(--ds-navy-600)"
            fontSize={AXIS_FONT_SIZE}
            fontWeight={700}
        >
            <tspan x={cx} dy={isLabelAbove ? -4 : 12}>
                {grade}
            </tspan>
            <tspan x={cx} dy={TARGET_LINE_HEIGHT}>
                {label}
            </tspan>
        </text>
    </g>
)

// 가로축 이름은 두 줄("'26년" / "2분기")이라 tspan 으로 나눠 그린다 — recharts 기본 눈금은 \n 을 줄바꿈으로 읽지 않는다.
type AxisTickProps = {x?: number; y?: number; payload?: {value?: string | number}}

const MultilineTick = ({x = 0, y = 0, payload}: AxisTickProps) => (
    <text x={x} y={y + 12} textAnchor="middle" fill="var(--ds-label-foreground)" fontSize={TICK_FONT_SIZE}>
        {String(payload?.value ?? '')
            .split('\n')
            .map((line, index) => (
                <tspan key={line} x={x} dy={index === 0 ? 0 : 18}>
                    {line}
                </tspan>
            ))}
    </text>
)

// 꺾은선 꼭짓점 — 시안은 속이 빈 원(흰 면 · 선 색 테두리)이다.
type GradeDotProps = {cx?: number; cy?: number; color: string}

const GradeDot = ({cx, cy, color}: GradeDotProps) =>
    cx === undefined || cy === undefined ? null : (
        <circle cx={cx} cy={cy} r={DOT_RADIUS} fill="var(--ds-surface)" stroke={color} strokeWidth={2} />
    )

// 꼭짓점 위 등급 이름표. recharts 가 LabelList 의 content 요소를 복제하며 x·y·index 를 넣어 준다.
// 끝 등급에서 격자 밖으로 나가지 않도록 — 가장 높은 등급 점은 이름표를 점 아래에 둔다.
// 평가대상과 겹친 자리는 평가대상 이름표가 같은 등급을 보여 주므로 그리지 않는다.
type GradeValueLabelProps = {
    data: GradeTrendPoint[]
    values: (number | null)[]
    topValue: number
    hiddenIndex: number
    /** 이름표를 점 아래로 내릴 자리 — 평가대상이 바로 위에 선 분기. */
    belowIndex: number
    x?: number | string
    y?: number | string
    index?: number
}

const GradeValueLabel = ({data, values, topValue, hiddenIndex, belowIndex, x, y, index = 0}: GradeValueLabelProps) => {
    const point = data[index]
    // 눈금에 없는 등급(빈 값)은 점이 없으므로 이름표도 없다.
    if (!point || values[index] === null || index === hiddenIndex) return null
    if (!Number.isFinite(Number(x)) || !Number.isFinite(Number(y))) return null

    const isBelow = values[index] === topValue || index === belowIndex
    const labelY = isBelow
        ? Number(y) + DOT_RADIUS + VALUE_LABEL_GAP + AXIS_FONT_SIZE
        : Number(y) - DOT_RADIUS - VALUE_LABEL_GAP

    return (
        <text x={Number(x)} y={labelY} textAnchor="middle" fill="var(--ds-foreground-subtle)" fontSize={AXIS_FONT_SIZE}>
            {point.grade}
        </text>
    )
}

const GradeTrendChart = ({
    data,
    scale,
    seriesLabel = '평균',
    color = 'var(--ds-chart-1)',
    target,
    animate = true,
    isLoading = false,
    loadingLabel = '등급 추이를 불러오는 중입니다.',
    ariaLabel,
    className,
    ...props
}: GradeTrendChartProps) => {
    // 처음 한 번만 그리는 움직임을 보인다 — recharts 는 폭이 바뀔 때마다 새로 그리며 움직임을 되풀이하는데,
    // 창 폭을 움직일 때마다 선이 다시 그어지면 산만하다. 첫 움직임이 끝나면 끈다.
    const [hasAnimated, setHasAnimated] = useState(false)
    const isAnimationActive = animate && !hasAnimated
    // 새로고침 직후에는 차트가 칸의 폭을 재기 전이라 빈 칸으로 보인다 — 화면이 붙기 전까지도 같은 스켈레톤을 보인다.
    const isHydrated = useIsHydrated()
    // 등급을 자리 번호로 바꾼다 — 목록의 끝(가장 낮은 등급)이 0 이라 위로 갈수록 값이 커진다.
    // 눈금에 없는 등급(빈 값 · 오타)은 그리지 않는다 — 받은 값을 그대로 넣어도 차트가 깨지지 않게 한다.
    const gradeToValue = (grade: string) => {
        const position = scale.indexOf(grade)

        return position < 0 ? null : scale.length - 1 - position
    }
    const chartData = data.map((point) => ({label: point.label, value: gradeToValue(point.grade)}))
    const chartConfig = {value: {label: seriesLabel, color}} satisfies ChartConfig

    const targetIndex = target ? (target.index ?? data.length - 1) : -1
    const targetPoint = target ? data[targetIndex] : undefined
    const targetValue = target ? gradeToValue(target.grade) : null
    // 평가대상이 평균 점과 같은 분기 · 같은 등급이면 두 점이 겹친다.
    const overlapIndex = targetValue !== null && chartData[targetIndex]?.value === targetValue ? targetIndex : -1

    // 평가대상 이름표의 위아래 — 같은 분기의 평균 점과 부딪치지 않는 쪽, 격자 끝에서 잘리지 않는 쪽을 고른다.
    // 기본은 시안대로 점 아래다. 아래가 막혔으면 위로, 위아래가 모두 막혔으면(평균 점이 바로 아래에 붙은 C 근처 등)
    // 평균 점과 떨어진 위쪽을 쓴다.
    const lineValue = overlapIndex === targetIndex ? null : (chartData[targetIndex]?.value ?? null)
    const topValue = scale.length - 1
    const isBelowBlocked =
        targetValue !== null &&
        (targetValue < TARGET_LABEL_ROWS ||
            (lineValue !== null && lineValue < targetValue && targetValue - lineValue <= TARGET_LABEL_ROWS))
    const isAboveBlocked =
        targetValue !== null &&
        (targetValue > topValue - TARGET_LABEL_ROWS ||
            (lineValue !== null && lineValue > targetValue && lineValue - targetValue <= TARGET_LABEL_ROWS))
    const isLineBelowTarget = lineValue !== null && targetValue !== null && lineValue < targetValue
    const getTargetLabelAbove = () => {
        if (!isBelowBlocked) return false
        if (!isAboveBlocked) return true
        return isLineBelowTarget
    }
    const isTargetLabelAbove = getTargetLabelAbove()
    // 평가대상이 평균 점 바로 위(두 칸 안)에 서면 평균 등급 글자가 두 점 사이에 끼어 평가대상 점과 겹친다 —
    // 평균 등급 글자를 점 아래로 내리고, 평균 점이 가장 낮은 등급(C)이라 아래도 가로축에 막히면 글자를 감춘다
    // (같은 분기의 평균 등급은 격자 높이로 읽을 수 있다).
    const isTargetRightAboveLine =
        targetValue !== null &&
        lineValue !== null &&
        targetValue > lineValue &&
        targetValue - lineValue <= TARGET_LABEL_ROWS
    const lineLabelBelowIndex = isTargetRightAboveLine && lineValue > 0 ? targetIndex : -1
    const hiddenLabelIndex = isTargetRightAboveLine && lineValue === 0 ? targetIndex : overlapIndex
    const targetLabel = target?.label ?? '평가대상'

    if (isLoading || !isHydrated) {
        return <ChartSkeleton {...props} type="grade-trend" label={loadingLabel} className={cn('w-full', className)} />
    }

    // 받은 값이 비어 있으면 격자를 나눌 칸이 없다 — 빈 차트 대신 안내 문구만 둔다.
    if (!data.length) {
        return (
            <div {...props} className={cn('w-full', className)}>
                <p className="typo-body-l-regular text-foreground-subtle grid h-72 place-items-center">
                    표시할 등급 정보가 없습니다.
                </p>
            </div>
        )
    }

    return (
        <div {...props} className={cn('w-full', className)}>
            <ChartContainer config={chartConfig} className="h-72 w-full" role="img" aria-label={ariaLabel}>
                <RechartsLineChart data={chartData} margin={CHART_MARGIN}>
                    <GridFrame columns={data.length} rows={scale.length - 1} />
                    <XAxis
                        dataKey="label"
                        scale="band"
                        axisLine={false}
                        tickLine={false}
                        tick={<MultilineTick />}
                        interval={0}
                        height={X_AXIS_HEIGHT}
                    />
                    <YAxis
                        type="number"
                        domain={[0, scale.length - 1]}
                        ticks={scale.map((_, index) => scale.length - 1 - index)}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                        width={Y_AXIS_WIDTH}
                        tick={<GradeTick scale={scale} />}
                    />
                    <Line
                        dataKey="value"
                        type="linear"
                        stroke={color}
                        strokeWidth={2}
                        isAnimationActive={isAnimationActive}
                        onAnimationEnd={() => setHasAnimated(true)}
                        activeDot={false}
                        dot={(dotProps: {cx?: number; cy?: number; index?: number}) =>
                            // 평가대상과 같은 자리의 평균 점은 그리지 않는다 — 채운 점 뒤로 테두리가 비쳐 보이지 않게 한다.
                            dotProps.index === overlapIndex ? (
                                <g key={dotProps.index} />
                            ) : (
                                <GradeDot key={dotProps.index} cx={dotProps.cx} cy={dotProps.cy} color={color} />
                            )
                        }
                    >
                        <LabelList
                            content={
                                <GradeValueLabel
                                    data={data}
                                    values={chartData.map((point) => point.value)}
                                    topValue={scale.length - 1}
                                    hiddenIndex={hiddenLabelIndex}
                                    belowIndex={lineLabelBelowIndex}
                                />
                            }
                        />
                    </Line>
                    {/* 평가대상 — 선과 다른 값이라 꺾은선에 잇지 않고 그 분기 자리에 점 하나로만 둔다. */}
                    {target && targetPoint && targetValue !== null ? (
                        <ReferenceDot
                            x={targetPoint.label}
                            y={targetValue}
                            r={DOT_RADIUS}
                            // 평가대상이 주인공이라 평균 꺾은선의 점·이름표보다 항상 앞에 그린다.
                            zIndex={TARGET_Z_INDEX}
                            shape={(dotProps: {cx?: number; cy?: number}) => (
                                <TargetDot
                                    cx={dotProps.cx}
                                    cy={dotProps.cy}
                                    grade={target.grade}
                                    label={targetLabel}
                                    isLabelAbove={isTargetLabelAbove}
                                />
                            )}
                        />
                    ) : null}
                </RechartsLineChart>
            </ChartContainer>

            {/* 값을 눈으로만 읽게 두지 않도록 같은 내용을 글로도 둔다[5.1.1]. 감추는 상자를 따로 둔다 —
                표에 직접 sr-only 를 걸면 표가 제 크기대로 자리를 차지해 좁은 화면에서 가로로 밀린다. */}
            <div className="sr-only">
                <table>
                    <caption>{ariaLabel}</caption>
                    <thead>
                        <tr>
                            <th scope="col">시점</th>
                            <th scope="col">{seriesLabel}</th>
                            {target ? <th scope="col">{targetLabel}</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((point, index) => (
                            <tr key={point.label}>
                                <th scope="row">{point.label.replace('\n', ' ')}</th>
                                <td>{point.grade}</td>
                                {target ? <td>{index === targetIndex ? target.grade : '-'}</td> : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {GradeTrendChart}
export type {GradeTrendChartProps, GradeTrendPoint, GradeTrendTarget}
