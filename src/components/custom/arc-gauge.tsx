'use client'

import {CHART_ANIMATION_MS, useChartAnimation} from '@/components/custom/chart-reveal'
import {useId, type ReactNode} from 'react'
import {PolarAngleAxis, RadialBar, RadialBarChart} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {ARC_GAUGE_SIZES, arcGaugeTrackPath, arcGeometry, type ArcGaugeSize} from '@/components/custom/arc-gauge-shape'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {cn} from '@/lib/utils'

const MAX_VALUE = 100
const CHART_MARGIN = {top: 0, right: 0, bottom: 0, left: 0}

// 원호 게이지 뼈대(ArcGauge) — 위가 열린 굵은 원호(트랙 + 채움)를 그리고, 가운데 글자는 children 으로 겹쳐 놓는다.
// ScoreGauge(혁신성장역량지수) · SemicircleRatingGauge(기업신용등급)가 함께 쓴다 — 같은 모양을 크기만 달리한다.
//
// 짜임: 끝이 둥근 원호. 양 끝이 수평선 아래로 조금 내려가(왼쪽 아래 → 위 → 오른쪽 아래) 둥근 끝의 바닥이 보이는 높이에 닿는다.
//   트랙 = gauge-track(시맨틱 — 다크에서 어두운 회색), 채움 = color(gradientTo 를 주면 color → gradientTo 그라데이션). 크기(size)
//     lg — 원 지름 320 · 굵기 46 · 보이는 높이 208(혁신성장역량지수)
//     md — 원 지름 260 · 굵기 37 · 보이는 높이 172(기업신용등급)
// Recharts RadialBarChart 로 그린다 — 트랙은 막대의 background, 끝은 cornerRadius 로 둥글린다.
// 폭이 기준 크기(size)보다 좁으면 원호와 가운데 글자가 같은 비율로 함께 줄어든다(컨테이너 쿼리).

type ArcGaugeProps = {
    /** 0~100. 범위 밖 · 숫자가 아닌 값은 0 · 100 으로 맞춘다. 0 보다 크면 최소 둥근 끝 두 개만큼은 그린다. */
    value: number
    /** 채움 색(CSS 색 · 토큰 변수). gradientTo 를 주면 그라데이션의 시작 색(오른쪽 위)이 된다. */
    color: string
    /** 주면 원호를 color → gradientTo 그라데이션(오른쪽 위 → 왼쪽 아래)으로 칠한다. 색 짝은 arc-gauge-shape 의 gaugeGradient 참고. */
    gradientTo?: string
    size?: ArcGaugeSize
    ariaLabel: string
    /** 원호가 차오르는 움직임. 안 주면 useChartAnimation() 값을 따른다(chart-reveal.tsx). */
    animate?: boolean
    className?: string
    /** 원호 위에 겹칠 가운데 글자 — 아래를 기준으로 쌓인다. */
    children?: ReactNode
    /** 가운데 글자 묶음에 더할 클래스 — 기본 아래 여백은 12(pb-3)이고, 더 올리려면 pb-* 를 준다. */
    overlayClassName?: string
}

const ArcGauge = ({
    value,
    color,
    gradientTo,
    size = 'lg',
    ariaLabel,
    className,
    children,
    overlayClassName,
    animate: animateProp,
}: ArcGaugeProps) => {
    const revealAnimate = useChartAnimation()
    const animate = animateProp ?? revealAnimate
    const {
        width,
        height,
        stroke,
        boxClassName,
        chartClassName,
        overlayClassName: scaleClassName,
    } = ARC_GAUGE_SIZES[size]
    const geometry = arcGeometry(size)
    const gradientId = useId()
    const safeValue = Number.isFinite(value) ? Math.min(MAX_VALUE, Math.max(0, value)) : 0
    const ratio = safeValue > 0 ? Math.max(geometry.minFillRatio, safeValue / MAX_VALUE) : 0
    const config: ChartConfig = {value: {label: ariaLabel, color}}
    const isHydrated = useIsHydrated()

    // 새로고침 직후(하이드레이션 전)에는 Recharts 가 칸의 폭을 재기 전이라 원호가 비어 보인다 — 그동안 같은 자리 · 같은 크기의
    // 스켈레톤(회색 원호 + 가운데 막대 두 줄)을 보이고, 붙은 뒤 실제 원호로 바꾼다.
    if (!isHydrated) {
        return (
            <div
                role="status"
                aria-label={`${ariaLabel} — 불러오는 중`}
                className={cn('mx-auto grid w-full animate-pulse', boxClassName, className)}
            >
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="text-muted col-start-1 row-start-1 h-auto w-full"
                    aria-hidden="true"
                >
                    <path
                        d={arcGaugeTrackPath(size)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                    />
                </svg>
                <div
                    aria-hidden="true"
                    className="col-start-1 row-start-1 flex flex-col items-center justify-end gap-2 pb-3"
                >
                    <div className={cn(chartSkeletonPartVariants(), 'h-12 w-24 max-w-full')} />
                    <div className={cn(chartSkeletonPartVariants(), 'h-5 w-16 max-w-full')} />
                </div>
            </div>
        )
    }

    return (
        // 원호와 가운데 글자를 같은 칸에 겹쳐 놓는다(grid 한 칸 · absolute 없이).
        // @container — 가운데 글자가 게이지 폭을 기준으로 줄어들게(아래 scale).
        <div
            role="img"
            aria-label={ariaLabel}
            className={cn('@container mx-auto grid w-full', boxClassName, className)}
        >
            {/* 서버에서도 기준 크기로 먼저 그린다 — 브라우저가 폭을 잰 뒤 같은 비율로 맞춘다. */}
            <ChartContainer
                config={config}
                initialDimension={{width, height}}
                // 트랙 색 — ChartContainer(shadcn 원본)가 원호 배경에 fill-muted 를 입히므로 같은 선택자로
                // fill-gauge-track 으로 덮는다(원본 셸은 고치지 않는다).
                className={cn(
                    '[&_.recharts-radial-bar-background-sector]:fill-gauge-track col-start-1 row-start-1 w-full',
                    chartClassName,
                )}
                aria-hidden="true"
            >
                {/* recharts 키보드 탐색 층은 끈다 — 값은 바깥 role="img" 의 이름이 읽어 주고, role="img" 안의 svg 에 tabindex 가 들어가면 마크업 경고다[8.1.1]. */}
                <RadialBarChart
                    accessibilityLayer={false}
                    data={[
                        {
                            name: 'value',
                            value: ratio * MAX_VALUE,
                            fill: gradientTo ? `url(#${gradientId})` : 'var(--color-value)',
                        },
                    ]}
                    cx="50%"
                    cy={geometry.cy}
                    innerRadius={geometry.innerRadius}
                    outerRadius={geometry.outerRadius}
                    startAngle={geometry.start}
                    endAngle={geometry.end}
                    // 원호가 하나뿐이다 — 막대 굵기(barSize)를 따로 주지 않고 간격을 0 으로 두어, 원호가 안쪽~바깥 반지름을
                    // 그대로 채우게 한다(기본 간격 10% · barSize 조합은 크기에 따라 굵기를 깎는다).
                    barCategoryGap={0}
                    barGap={0}
                    margin={CHART_MARGIN}
                >
                    {gradientTo ? (
                        // 그라데이션 — 오른쪽 위 → 왼쪽 아래. id 는 한 화면에 게이지가 여럿이라 useId 로 고유하게 둔다.
                        <defs>
                            <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={color} />
                                <stop offset="100%" stopColor={gradientTo} />
                            </linearGradient>
                        </defs>
                    ) : null}
                    <PolarAngleAxis type="number" domain={[0, MAX_VALUE]} tick={false} axisLine={false} />
                    <RadialBar
                        dataKey="value"
                        background
                        cornerRadius={stroke / 2}
                        isAnimationActive={animate}
                        animationDuration={CHART_ANIMATION_MS}
                    />
                </RadialBarChart>
            </ChartContainer>
            <div
                aria-hidden="true"
                className={cn(
                    'col-start-1 row-start-1 flex origin-bottom flex-col items-center justify-end pb-3 text-center',
                    scaleClassName,
                    overlayClassName,
                )}
            >
                {children}
            </div>
        </div>
    )
}

export {ArcGauge}
export type {ArcGaugeProps}
