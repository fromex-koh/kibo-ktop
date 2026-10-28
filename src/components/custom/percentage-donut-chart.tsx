'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Pie, PieChart} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {CHART_ANIMATION_MS, useChartAnimation} from '@/components/custom/chart-reveal'
import {cn} from '@/lib/utils'
import {ChartTooltipTitle} from '@/components/composite/chart-tooltip-parts'
import {EmptyState} from '@/components/composite/empty-state'
import {TruncatedText} from '@/components/composite/truncated-text'
import {chartTooltipClassName, chartTooltipTitleClassName} from '@/components/theme/chart-tooltip.variants'

// 기업 보유기술 도넛(PercentageDonutChart) — 분류별 비중을 도넛과 범례로 함께 보여 준다.
//
// 짜임("기업 보유기술" 카드 그래프):
//   도넛 = 지름 260 · 구멍 지름 104(바깥 반지름의 40%) · 조각 사이 흰 선 2 · 모서리 둥글림과 틈 없음.
//   조각은 12시에서 시작해 시계 방향으로 큰 분류부터 이어진다(가장 진한 조각이 12시 오른쪽).
//   도넛 위에는 라벨을 두지 않는다 — 비중 · 값은 범례로 읽는다. 조각에 올리면 툴팁이 그 조각의 분류명(범례 이름)만 보인다.
//   범례 = 16 사각 칩 · 간격 8 · 14 Regular 분류명 + 14 Bold '비중%·건수개', 항목 간격 16.
//   분류명은 한 줄 — '비중%·건수개'(한 덩어리)가 차지하고 남은 폭을 쓰고, 넘치면 말줄임(…) + 툴팁으로 전체 이름을 본다.
//   도넛과 범례는 간격 30 으로 나란히 가운데 정렬, 좁은 폭에서는 범례가 도넛 아래로 내려간다.
// 색은 데이터가 넘긴다(분류마다 color). 수치 전체는 화면에 보이지 않는 목록으로도 읽어 준다[5.1.1].
// 그릴 조각이 없으면(항목 없음 · 비중이 모두 0 이하) 도넛 자리에 같은 높이의 빈 상태(EmptyState · emptyText)를 두고
// caption 은 그대로 둔다 — 카드 높이가 데이터 유무로 흔들리지 않고, 나란한 도넛 중 어느 쪽이 비었는지 보인다.
//
// [프론트엔드 연동] data 는 비중 내림차순으로 정렬해 넘기고, color 는 donutColorsFor(항목 수)[index] 로 정한다
//   (percentage-donut-colors.ts — 항목은 8개까지). percentage 는 범례 · 숨김 목록에 그대로 적히므로 표시할 자릿수로 넘긴다.

type PercentageDonutItem = {
    id: string
    label: string
    percentage: number
    /** 건수 — 기본 범례('비중%·건수개')에 쓴다. 항목 valueLabel 로 범례를 바꾸면 없어도 된다. */
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
    /** 조각 위에 올렸을 때 그 조각의 분류명(범례 이름)만 보이는 툴팁. 비중 · 값은 범례에 있어 툴팁에 적지 않는다. */
    showTooltip?: boolean
    /** 그리는 움직임. 안 주면 useChartAnimation() 값을 따른다(chart-reveal.tsx). 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 false. */
    animate?: boolean
    /** 도넛 아래 이름(14 Bold, 간격 16) — 도넛이 둘 이상 나란히 놓여 무엇의 비중인지 밝혀야 할 때(예: 중분류 기준 · 기업수 비중). */
    caption?: string
    /** 그릴 조각이 없을 때 도넛 자리에 적는 안내. */
    emptyText?: string
}

// 반지름 % 는 Recharts 기준(상자 한 변의 절반 = 100%)이다 — 상자 260 이면 바깥 130 · 구멍 52(Pie 의 innerRadius · outerRadius).

// 12시에서 시계 방향으로 한 바퀴(recharts 각도는 반시계가 양수라 끝 각을 줄인다).
const START_ANGLE = 90
const END_ANGLE = -270

const toValueLabel = (item: PercentageDonutItem) =>
    item.valueLabel ?? (item.count === undefined ? `${item.percentage}%` : `${item.percentage}%·${item.count}개`)

const PercentageDonutChart = ({
    data,
    ariaLabel,
    showTooltip = true,
    animate: animateProp,
    caption,
    emptyText = '조회된 데이터가 없습니다.',
    className,
    ...props
}: PercentageDonutChartProps) => {
    // animate 를 안 주면 문서 설정을 따른다(chart-reveal.tsx) — 보고서는 스크롤해서 보일 때, 그 밖에는 바로 움직인다.
    const revealAnimate = useChartAnimation()
    const animate = animateProp ?? revealAnimate
    const config: ChartConfig = Object.fromEntries(data.map(({id, label, color}) => [id, {label, color}]))
    const chartData = data.map((item) => ({...item, fill: `var(--color-${item.id})`}))

    // 빈 상태 — 도넛과 같은 크기(기본 260 · @sm 208)의 칸에 안내, 아래 caption.
    if (!data.some((item) => item.percentage > 0)) {
        return (
            <div {...props} className={cn('@container w-full', className)}>
                <div className="flex flex-col items-center gap-4">
                    <EmptyState title={emptyText} className="min-h-65 @sm:min-h-52 @lg:min-h-65" />
                    {caption ? <p className="typo-body-l-bold text-foreground text-center">{caption}</p> : null}
                </div>
            </div>
        )
    }

    return (
        // 바깥 상자 폭(@container)에 맞춘다 — 512(@lg) 이상은 기본 크기(도넛 260 · 간격 30). 384~511(@sm, 1024 화면의 2열 카드 등)은
        // 도넛 208 · 간격 24 로 줄여 범례가 도넛 옆에 남게 한다(아래로 내려가면 카드가 길어져 옆 카드 아래가 빈다).
        // 384 미만(모바일)은 어차피 범례가 아래로 내려가므로 도넛을 기본 크기(260)로 둔다.
        <div {...props} className={cn('@container w-full', className)}>
            <div className="flex flex-wrap items-center justify-center gap-x-7.5 gap-y-6 @sm:gap-x-6 @lg:gap-x-7.5">
                <div className="flex w-full max-w-65 shrink-0 flex-col items-center gap-4 @sm:max-w-52 @lg:max-w-65">
                    <ChartContainer
                        config={config}
                        className={cn('aspect-square w-full', showTooltip && '[&_.recharts-sector]:cursor-pointer')}
                        role="img"
                        aria-label={ariaLabel}
                    >
                        {/* recharts 키보드 탐색 층은 끈다 — 값은 숨김 목록(sr-only)이 읽어 주고, role="img" 안의 svg 에 tabindex 가 들어가면 마크업 경고다[8.1.1]. */}
                        <PieChart accessibilityLayer={false}>
                            {showTooltip ? (
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            className={chartTooltipClassName}
                                            labelClassName={chartTooltipTitleClassName}
                                            hideLabel
                                            hideIndicator
                                            // 이름 한 줄 — 상자가 글자 폭만큼이라 가운데 정렬은 여러 줄로 접힐 때만 드러난다.
                                            formatter={(_value, _name, item) => (
                                                <div className="w-full text-center">
                                                    <ChartTooltipTitle>{item.payload.label}</ChartTooltipTitle>
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
                                // recharts Pie 는 기본으로 0.4초 기다렸다 그린다(다른 차트는 0) — 나타난 뒤 빈 원으로 머물지 않게 바로 시작한다.
                                animationBegin={0}
                                animationDuration={CHART_ANIMATION_MS}
                                startAngle={START_ANGLE}
                                endAngle={END_ANGLE}
                                innerRadius="40%"
                                outerRadius="100%"
                                paddingAngle={0}
                                label={false}
                                labelLine={false}
                                stroke="var(--ds-card)"
                                strokeWidth={2}
                            />
                        </PieChart>
                    </ChartContainer>
                    {caption ? <p className="typo-body-l-bold text-foreground text-center">{caption}</p> : null}
                </div>

                {/* 범례 폭 — 짧으면 내용만큼(max-w-max)이라 도넛과 한 묶음으로 가운데 정렬되고, 길면 남은 폭 안에서 말줄임한다.
                남은 폭이 160(basis-40) 아래로 줄 때만 도넛 아래 줄로 내려간다. */}
                <ul className="flex max-w-max min-w-0 flex-1 basis-40 flex-col gap-4">
                    {data.map((item) => (
                        <li key={item.id} className="typo-body-l-regular text-label-foreground flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="size-4 shrink-0"
                                style={{backgroundColor: item.color}}
                            />
                            {/* 분류명은 한 줄 — '비중%·건수개'가 차지하고 남은 폭을 쓰고, 넘치면 말줄임(…). 잘렸을 때만
                                마우스 올리기 · 탭 · Tab 초점으로 전체 이름을 툴팁으로 본다(TruncatedText). */}
                            <TruncatedText lines={1} className="min-w-0">
                                {item.label}
                            </TruncatedText>
                            <strong className="typo-body-l-bold text-foreground shrink-0 whitespace-nowrap tabular-nums">
                                {toValueLabel(item)}
                            </strong>
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
