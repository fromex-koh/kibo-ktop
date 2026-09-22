'use client'

import {useId, type ComponentPropsWithoutRef} from 'react'
import {Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {CELLS_GRID_STROKE, CELLS_DIVIDER_DASH, CELLS_X_TICK, CELLS_X_TICK_MARGIN} from '@/components/custom/chart-cells'

// 등급 이력(GradeHistoryChart) — 평가 시점마다 등급을 큰 원(지름 60, 원 안에 등급 글자)으로 찍고 선으로 잇는다.
// 등급이 높을수록 원이 위에 선다. K-BIGx 기업혁신성장 보고서 신용/재무정보 탭 "이전평가이력" 카드에서 쓴다.
//
// 짜임: 높이 160 그릴 자리(바닥선 실선 · 점마다 세로 점선) → 8 → 시점 이름 12 Regular. 선 1.5(color) 아래를 위에서 아래로
//   옅어지는 면으로 채운다. 원 = color 채움 · 등급 14 Bold 흰 글자. 양 끝 원은 원 사이 간격의 0.59 배만큼 안쪽(카드 538 · 시점 셋이면 100).
//   원 높이는 value(0~100, 등급이 높을수록 큼 — CRI 등급표 채움 비율 등)로 정한다. 그릴 자리 위아래 원 반지름만큼은 비워
//   원이 잘리지 않고(가장 높은 원 중심은 위에서 52, 가장 낮은 원 중심은 바닥에서 50), 값 차이가 작아도(10 미만) 원이
//   들쭉날쭉 튀지 않게 최소 폭 10 으로 눈금을 잡는다. 값이 모두 같으면 가운데 높이에 선다.
// 그림은 role="img" 이름으로 읽고, 숨김 표가 시점 · 등급을 읽어 준다.
//
// [프론트엔드 연동] data 는 시간순(오래된 것부터)이다. value 는 등급 순위를 0~100 으로 바꾼 값을 넘긴다
// (신용등급은 content/service/cri-grades.ts 의 criGradePercentage).

type GradeHistoryItem = {
    id: string
    /** 시점 이름(예: 23.09월). */
    label: string
    /** 원 안에 적을 등급(예: BBB+). */
    grade: string
    /** 등급 높이(0~100, 높을수록 위). */
    value: number
}

type GradeHistoryChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: GradeHistoryItem[]
    /** 원 · 선 색(토큰 변수). */
    color?: string
    /** 원이 그려지는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
}

const DOT_RADIUS = 30
// 원 사이 최소 간격(원 지름 + 여유 12) — 시점이 많아 칸이 이보다 좁아지면 그래프만 가로로 넘긴다.
const MIN_POINT_GAP = DOT_RADIUS * 2 + 12
// 양 끝 원의 가장자리 안쪽 거리 — 원 사이 간격의 0.59 배(보고서 카드 538 에서 시점 셋이면 100 · 사이 169).
// 가로축을 순번(0, 1, 2 …) 숫자 축으로 두고 양 끝을 이만큼 넓혀 폭이 바뀌어도 비율이 유지된다.
const EDGE_SPACING_RATIO = 100 / 169
// 가장 좁을 때도 양 끝 원이 그릴 자리 밖으로 잘리지 않는 여백(원 반지름 + 8).
const EDGE_PADDING_MIN = DOT_RADIUS + 8
const MIN_VALUE_SPAN = 10
// 그릴 자리 높이와, 가장 높은 · 낮은 원 중심이 놓이는 위 · 아래 거리(원 반지름 30 + 여유) — 카드 그래프와 같은 자리.
const PLOT_HEIGHT = 160
const TOP_INSET = 52
const BOTTOM_INSET = 50
const X_AXIS_HEIGHT = 26
const GRADE_FONT_SIZE = 14
const LINE_STROKE_WIDTH = 1.5

const clampValue = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0)

type DotProps = {cx?: number; cy?: number; index?: number}

const GradeHistoryChart = ({
    ariaLabel,
    data,
    color = 'var(--raw-blue-500)',
    animate = true,
    className,
    ...props
}: GradeHistoryChartProps) => {
    const gradientId = `grade-history-${useId().replace(/:/g, '')}`
    const values = data.map((item) => clampValue(item.value))
    const minimumValue = values.length ? Math.min(...values) : 0
    const maximumValue = values.length ? Math.max(...values) : 100
    // 값 폭이 작으면 가운데를 기준으로 최소 폭만큼 넓힌다 — 한 등급 차이가 칸 전체 높이로 튀지 않게.
    const middle = (minimumValue + maximumValue) / 2
    const span = Math.max(MIN_VALUE_SPAN, maximumValue - minimumValue)
    // 원 중심이 위 52 · 아래 50 안쪽에 들도록 눈금을 위아래로 넓힌다 — 면은 넓힌 눈금의 아래 끝(바닥선)까지 채운다.
    const usableHeight = PLOT_HEIGHT - TOP_INSET - BOTTOM_INSET
    const lower = middle - span / 2 - (span * BOTTOM_INSET) / usableHeight
    const upper = middle + span / 2 + (span * TOP_INSET) / usableHeight
    const config = {value: {label: '등급', color}} satisfies ChartConfig
    const chartData = data.map((item, index) => ({position: index, value: values[index]}))
    const lastIndex = Math.max(0, data.length - 1)
    // 시점이 하나면 가운데에 선다(양쪽 1 씩).
    const edge = data.length > 1 ? EDGE_SPACING_RATIO : 1
    const ticks = data.map((_, index) => index)

    // 원 + 등급 글자.
    const renderDot = ({cx, cy, index = 0}: DotProps) => {
        const item = data[index]
        if (typeof cx !== 'number' || typeof cy !== 'number' || !item) return <g key={`dot-${index}`} />
        return (
            <g key={`dot-${index}`}>
                <circle cx={cx} cy={cy} r={DOT_RADIUS} fill={color} />
                <text
                    x={cx}
                    y={cy}
                    dy="0.35em"
                    textAnchor="middle"
                    fill="var(--color-white)"
                    fontSize={GRADE_FONT_SIZE}
                    fontWeight={700}
                >
                    {item.grade}
                </text>
            </g>
        )
    }

    return (
        <div {...props} className={cn('w-full', className)}>
            <div className="w-full overflow-x-auto">
                <ChartContainer
                    config={config}
                    className="h-46.5 w-full"
                    style={{minWidth: data.length * MIN_POINT_GAP + EDGE_PADDING_MIN * 2}}
                    role="img"
                    aria-label={ariaLabel}
                >
                    <ComposedChart data={chartData} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.16} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {/* 바닥선 실선 · 점마다 세로 점선. */}
                        <CartesianGrid
                            key="bottom"
                            stroke={CELLS_GRID_STROKE}
                            vertical={false}
                            horizontalCoordinatesGenerator={({offset}) => [(offset.top ?? 0) + (offset.height ?? 0)]}
                        />
                        <CartesianGrid
                            key="points"
                            stroke={CELLS_GRID_STROKE}
                            strokeDasharray={CELLS_DIVIDER_DASH}
                            horizontal={false}
                        />
                        <XAxis
                            key="x-axis"
                            type="number"
                            dataKey="position"
                            domain={[-edge, lastIndex + edge]}
                            ticks={ticks}
                            tickFormatter={(position: number) => data[position]?.label ?? ''}
                            tickLine={false}
                            axisLine={false}
                            tick={CELLS_X_TICK}
                            tickMargin={CELLS_X_TICK_MARGIN}
                            height={X_AXIS_HEIGHT}
                            interval={0}
                        />
                        <YAxis key="y-axis" hide domain={[lower, upper]} allowDataOverflow />
                        {/* 시점이 하나면 면을 그리지 않는다 — recharts 는 점 하나짜리 면에 작은 점을 따로 찍는다. */}
                        {data.length > 1 ? (
                            <Area
                                key="area"
                                type="linear"
                                dataKey="value"
                                stroke="none"
                                fill={`url(#${gradientId})`}
                                fillOpacity={1}
                                baseValue={lower}
                                isAnimationActive={animate}
                                activeDot={false}
                                dot={false}
                            />
                        ) : null}
                        <Line
                            key="line"
                            type="linear"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={LINE_STROKE_WIDTH}
                            dot={renderDot}
                            activeDot={false}
                            isAnimationActive={animate}
                        />
                    </ComposedChart>
                </ChartContainer>
            </div>
            <div className="sr-only">
                <table>
                    <caption>{ariaLabel}</caption>
                    <thead>
                        <tr>
                            <th scope="col">시점</th>
                            <th scope="col">등급</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <th scope="row">{item.label}</th>
                                <td>{item.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {GradeHistoryChart}
export type {GradeHistoryChartProps, GradeHistoryItem}
