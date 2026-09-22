'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Pie, PieChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {ChartTooltipDescription, ChartTooltipTitle} from '@/components/composite/chart-tooltip-parts'
import {chartTooltipClassName, chartTooltipTitleClassName} from '@/components/theme/chart-tooltip.variants'

// 기업 보유기술 도넛(PercentageDonutChart) — 분류별 비중을 도넛과 범례로 함께 보여 준다.
//
// 짜임("기업 보유기술" 카드 그래프):
//   도넛 = 지름 260 · 구멍 지름 104(바깥 반지름의 40%) · 조각 사이 흰 선 2 · 모서리 둥글림과 틈 없음.
//   조각은 12시에서 시작해 반시계 방향으로 큰 분류부터 이어진다(가장 진한 조각이 12시 왼쪽).
//   도넛 위에는 라벨을 두지 않는다 — 비중은 범례와 툴팁으로 읽는다.
//   범례 = 16 사각 칩 · 간격 8 · 14 Regular 분류명 + 14 Bold '비중%·건수개', 항목 간격 16.
//   라벨은 길이에 따라 어절 단위로 접히고(붙여 쓴 긴 말은 칸 안에서 끊는다) '비중%·건수개'는 한 덩어리로 남는다.
//   도넛과 범례는 간격 60 으로 나란히 가운데 정렬, 좁은 폭에서는 범례가 도넛 아래로 내려간다.
// 색은 데이터가 넘긴다(분류마다 color). 수치 전체는 화면에 보이지 않는 목록으로도 읽어 준다[5.1.1].

type PercentageDonutItem = {
    id: string
    label: string
    percentage: number
    /** 건수 — 기본 범례('비중%·건수개')와 말풍선에 쓴다. 항목 valueLabel 로 범례를 바꾸면 없어도 된다. */
    count?: number
    color: string
    /**
     * 범례 이름 옆 굵은 값. 없으면 '비중%·건수개'(건수가 없으면 '비중%') — 금액 등 다른 값을 적을 때 넘긴다
     * (예: 담보 현황 '2,000').
     */
    valueLabel?: string
}

type PercentageDonutChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: PercentageDonutItem[]
    ariaLabel: string
    /** 조각 위에 올렸을 때 뜨는 말풍선. 비중 · 건수가 범례에 모두 적혀 있는 보고서에서는 끈다. */
    showTooltip?: boolean
    /** 그리는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
    /** 도넛 아래 이름(14 Bold, 간격 16) — 도넛이 둘 이상 나란히 놓여 무엇의 비중인지 밝혀야 할 때(예: 중분류 기준 · 기업수 비중). */
    caption?: string
    /**
     * 조각 바깥에 비중(%)을 굵게 적을 항목 id(짧은 이끌림 선과 함께). 가장 큰 조각을 짚어 줄 때 쓴다.
     * 조각 가운데 각도의 바깥에 붙으며, 비중이 0 이하면 적지 않는다.
     */
    calloutId?: string
}

// 반지름 % 는 Recharts 기준(상자 한 변의 절반 = 100%)이다 — 상자 260 이면 바깥 130 · 구멍 52.
// 12시에서 반시계 방향으로 한 바퀴.
const START_ANGLE = 90
const END_ANGLE = 450
// 강조 글자 — 조각 바깥 테두리에서 이끌림 선 12 · 글자 13 Bold(blue.800).
const CALLOUT_LINE_LENGTH = 12
const CALLOUT_TEXT_GAP = 4
const CALLOUT_FONT_SIZE = 13
const CALLOUT_FILL = 'var(--raw-blue-800)'
const RADIAN = Math.PI / 180

type CalloutLabelProps = {cx?: number; cy?: number; midAngle?: number; outerRadius?: number; index?: number}

const toValueLabel = (item: PercentageDonutItem) =>
    item.valueLabel ?? (item.count === undefined ? `${item.percentage}%` : `${item.percentage}%·${item.count}개`)

const PercentageDonutChart = ({
    data,
    ariaLabel,
    showTooltip = true,
    animate = true,
    caption,
    calloutId,
    className,
    ...props
}: PercentageDonutChartProps) => {
    const calloutIndex = data.findIndex((item) => item.id === calloutId && item.percentage > 0)
    // 강조 글자 — 조각 가운데 각도 방향으로 테두리 밖에 이끌림 선을 긋고 그 끝에 비중을 적는다. 글자는 바깥쪽으로 정렬해
    // 도넛과 겹치지 않는다(왼쪽 조각은 선 끝에서 왼쪽으로, 오른쪽 조각은 오른쪽으로).
    const renderCallout = ({cx, cy, midAngle, outerRadius, index}: CalloutLabelProps) => {
        const item = data[index ?? -1]
        if (
            index !== calloutIndex ||
            !item ||
            typeof cx !== 'number' ||
            typeof cy !== 'number' ||
            typeof midAngle !== 'number' ||
            typeof outerRadius !== 'number'
        ) {
            return null
        }
        const cos = Math.cos(-midAngle * RADIAN)
        const sin = Math.sin(-midAngle * RADIAN)
        const startX = cx + outerRadius * cos
        const startY = cy + outerRadius * sin
        const endX = cx + (outerRadius + CALLOUT_LINE_LENGTH) * cos
        const endY = cy + (outerRadius + CALLOUT_LINE_LENGTH) * sin
        const isRight = cos >= 0
        return (
            <g>
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={CALLOUT_FILL} strokeWidth={1} />
                <text
                    x={endX + (isRight ? CALLOUT_TEXT_GAP : -CALLOUT_TEXT_GAP)}
                    y={endY}
                    dy="0.35em"
                    textAnchor={isRight ? 'start' : 'end'}
                    fill={CALLOUT_FILL}
                    fontSize={CALLOUT_FONT_SIZE}
                    fontWeight={700}
                >
                    {item.percentage}%
                </text>
            </g>
        )
    }
    const config: ChartConfig = Object.fromEntries(data.map(({id, label, color}) => [id, {label, color}]))
    const chartData = data.map((item) => ({...item, fill: `var(--color-${item.id})`}))

    return (
        // 바깥 상자 폭(@container)에 맞춘다 — 512(@lg) 이상은 기본 크기(도넛 260 · 간격 60). 384~511(@sm, 1024 화면의 2열 카드 등)은
        // 도넛 208 · 간격 24 로 줄여 범례가 도넛 옆에 남게 한다(아래로 내려가면 카드가 길어져 옆 카드 아래가 빈다).
        // 384 미만(모바일)은 어차피 범례가 아래로 내려가므로 도넛을 기본 크기(260)로 둔다.
        <div {...props} className={cn('@container w-full', className)}>
            <div className="flex flex-wrap items-center justify-center gap-x-15 gap-y-6 @sm:gap-x-6 @lg:gap-x-15">
                <div className="flex w-full max-w-65 shrink-0 flex-col items-center gap-4 @sm:max-w-52 @lg:max-w-65">
                    <ChartContainer
                        config={config}
                        className={cn(
                            'aspect-square w-full',
                            showTooltip && '[&_.recharts-sector]:cursor-pointer',
                            // 강조 글자는 도넛 바깥(상자 밖)에 서므로 잘리지 않게 SVG 밖 그리기를 허용한다.
                            calloutIndex >= 0 && '[&_.recharts-surface]:overflow-visible',
                        )}
                        role="img"
                        aria-label={ariaLabel}
                    >
                        <PieChart accessibilityLayer>
                            {showTooltip ? (
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            className={chartTooltipClassName}
                                            labelClassName={chartTooltipTitleClassName}
                                            hideLabel
                                            hideIndicator
                                            formatter={(_value, _name, item) => (
                                                <div className="grid gap-1">
                                                    <ChartTooltipTitle>{item.payload.label}</ChartTooltipTitle>
                                                    <ChartTooltipDescription>
                                                        비중 {item.payload.percentage}%
                                                        {item.payload.count === undefined
                                                            ? ''
                                                            : ` · ${item.payload.count}개`}
                                                    </ChartTooltipDescription>
                                                </div>
                                            )}
                                        />
                                    }
                                />
                            ) : null}
                            <Pie
                                data={chartData}
                                dataKey="percentage"
                                nameKey="id"
                                isAnimationActive={animate}
                                startAngle={START_ANGLE}
                                endAngle={END_ANGLE}
                                innerRadius="40%"
                                outerRadius="100%"
                                paddingAngle={0}
                                label={calloutIndex >= 0 ? renderCallout : false}
                                labelLine={false}
                                stroke="var(--ds-card)"
                                strokeWidth={2}
                            />
                        </PieChart>
                    </ChartContainer>
                    {caption ? <p className="typo-body-l-bold text-foreground text-center">{caption}</p> : null}
                </div>

                {/* 범례 폭 — 짧으면 내용만큼(max-w-max)이라 도넛과 한 묶음으로 가운데 정렬되고, 길면 남은 폭 안에서 접힌다.
                남은 폭이 160(basis-40) 아래로 줄 때만 도넛 아래 줄로 내려간다. */}
                <ul className="flex max-w-max min-w-0 flex-1 basis-40 flex-col gap-4">
                    {data.map((item) => (
                        <li key={item.id} className="typo-body-l-regular text-label-foreground flex items-start gap-2">
                            {/* 칩은 첫 줄 높이(h-lh)의 가운데 — 라벨이 여러 줄로 접혀도 첫 줄 옆에 남는다. */}
                            <span aria-hidden="true" className="flex h-lh shrink-0 items-center">
                                <span className="size-4" style={{backgroundColor: item.color}} />
                            </span>
                            <span className="min-w-0 wrap-anywhere break-keep">
                                {item.label}{' '}
                                <strong className="typo-body-l-bold text-foreground whitespace-nowrap tabular-nums">
                                    {toValueLabel(item)}
                                </strong>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label}: 비중 {item.percentage}%, {toValueLabel(item)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {PercentageDonutChart}
export type {PercentageDonutChartProps, PercentageDonutItem}
