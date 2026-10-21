import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 등급 이력 꺾은선(RatingTrendChart) — 시점마다 받은 등급(예: A- → BBB+ → BBB0)을 등급 높낮이 줄 위에 점으로 찍고 선으로 잇는다.
// 등급이 숫자가 아니라 세로축 없이 점 위 등급 글자로 읽는다. 가장 최근 점(마지막)은 채운 점 · 강조 색 글자다.
// K-BIGx 보고서 인쇄본 신용/재무정보 기업신용등급 "이전평가이력" · 현금흐름등급 "평가이력" 그래프.
// (원호 · 툴팁이 있는 웹 화면용은 GradeHistoryChart, 등급 눈금 격자 위 비교 기준선은 GradeTrendChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 680 × 280. 받은 등급 가운데 서로 다른 등급마다 가로줄(x 90 ~ 680)을 긋는다 — 높은 등급이 위(y 50), 낮은 등급이
//   아래(y 210), 그 사이는 같은 간격. 점은 x 150 ~ 610 사이에 같은 간격(하나면 가운데).
//   점 = 흰 면 + 테두리 4 · 반지름 10(마지막은 채운 점 · 반지름 12), 등급 글자 = 점 20 위(22px 가장 굵게), 시점 = y 266(20px).
// 데이터에 따라
//   · 등급이 하나뿐이면 줄 하나(가운데 y 130)에 놓는다. 같은 rank 는 같은 줄이다.
//   · 높낮이는 rank(클수록 높은 등급)로 정한다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다. 값 전체는 화면에 보이지 않는 목록으로도 읽어 준다.
//
// [프론트엔드 연동] data 는 시간순(오래된 것부터)으로 넘긴다. rank 는 등급표 순서로 사용처가 정한다
//   (신용등급은 criGradePercentage, 현금흐름등급은 7 − cashFlowLevel — CF1 이 가장 위).

type RatingTrendItem = {
    id: string
    /** 시점(예: 23.09월). */
    label: string
    /** 등급 글자(예: BBB+). */
    grade: string
    /** 등급 높낮이 — 클수록 위. */
    rank: number
}

type RatingTrendColors = {
    line: string
    grid: string
    grade: string
    /** 마지막(현재) 등급 글자 · 채운 점. */
    current: string
    label: string
    dotFill: string
}

type RatingTrendChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly RatingTrendItem[]
    ariaLabel: string
    colors?: Partial<RatingTrendColors>
}

const DEFAULT_COLORS: RatingTrendColors = {
    line: 'var(--ds-blue-500)',
    grid: 'var(--ds-border)',
    grade: 'var(--ds-foreground)',
    current: 'var(--ds-blue-500)',
    label: 'var(--ds-foreground-subtle)',
    dotFill: 'var(--ds-card)',
}

// 치수(SVG 좌표).
const WIDTH = 680
const HEIGHT = 280
const GRID_LEFT = 90
const ROW_TOP = 50
const ROW_BOTTOM = 210
const POINT_LEFT = 150
const POINT_RIGHT = 610
const LABEL_Y = 266
const GRADE_OFFSET = 20
const LINE_WIDTH = 4
const GRID_STROKE = 1.5
const DOT_RADIUS = 10
const CURRENT_DOT_RADIUS = 12
const FONT = {grade: {size: 22, weight: 800}, label: {size: 20}} as const

const round = (value: number) => Math.round(value * 10) / 10

const RatingTrendChart = ({data, ariaLabel, colors, className, ...props}: RatingTrendChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    // 서로 다른 등급 높낮이 — 높은 것부터.
    const ranks = [...new Set(data.map((item) => item.rank))].sort((a, b) => b - a)
    const rowY = (rank: number) => {
        const index = ranks.indexOf(rank)
        return ranks.length > 1
            ? ROW_TOP + ((ROW_BOTTOM - ROW_TOP) * index) / (ranks.length - 1)
            : (ROW_TOP + ROW_BOTTOM) / 2
    }
    const pointX = (index: number) =>
        data.length > 1
            ? POINT_LEFT + ((POINT_RIGHT - POINT_LEFT) * index) / (data.length - 1)
            : (POINT_LEFT + POINT_RIGHT) / 2
    const points = data.map((item, index) => ({item, x: pointX(index), y: rowY(item.rank)}))

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full">
                {ranks.map((rank) => (
                    <line
                        key={`row-${rank}`}
                        x1={GRID_LEFT}
                        y1={round(rowY(rank))}
                        x2={WIDTH}
                        y2={round(rowY(rank))}
                        stroke={color.grid}
                        strokeWidth={GRID_STROKE}
                    />
                ))}
                {points.length > 1 ? (
                    <polyline
                        points={points.map((point) => `${round(point.x)},${round(point.y)}`).join(' ')}
                        fill="none"
                        stroke={color.line}
                        strokeWidth={LINE_WIDTH}
                    />
                ) : null}
                {points.map((point, index) => {
                    const isCurrent = index === points.length - 1
                    return (
                        <g key={point.item.id}>
                            {isCurrent ? (
                                <circle
                                    cx={round(point.x)}
                                    cy={round(point.y)}
                                    r={CURRENT_DOT_RADIUS}
                                    fill={color.current}
                                />
                            ) : (
                                <circle
                                    cx={round(point.x)}
                                    cy={round(point.y)}
                                    r={DOT_RADIUS}
                                    fill={color.dotFill}
                                    stroke={color.line}
                                    strokeWidth={LINE_WIDTH}
                                />
                            )}
                            <text
                                x={round(point.x)}
                                y={round(point.y - GRADE_OFFSET)}
                                textAnchor="middle"
                                fontSize={FONT.grade.size}
                                fontWeight={FONT.grade.weight}
                                fill={isCurrent ? color.current : color.grade}
                            >
                                {point.item.grade}
                            </text>
                            <text
                                x={round(point.x)}
                                y={LABEL_Y}
                                textAnchor="middle"
                                fontSize={FONT.label.size}
                                fill={color.label}
                            >
                                {point.item.label}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}: {item.grade}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {RatingTrendChart}
export type {RatingTrendChartProps, RatingTrendColors, RatingTrendItem}
