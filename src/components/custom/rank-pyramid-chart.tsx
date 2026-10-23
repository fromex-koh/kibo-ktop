'use client'

// 'use client' — 단이 떠오르는 움직임 여부를 문서 설정(chart-reveal.tsx)에서 읽는다.
import {useChartAnimation} from '@/components/custom/chart-reveal'
import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {
    TIER_COUNT,
    TIER_RANGE,
    PYRAMID_HEIGHT,
    APEX_X,
    TIERS,
    LEADER_RISE_X,
    LEADER_RISE_Y,
    LEADER_DOT_X,
    LEADER_TEXT_X,
    LEADER_DOT_RADIUS,
    VIEW_WIDTH,
    tierPath,
    rightEdgeAt,
} from '@/components/custom/rank-pyramid-shape'
import crownPurpleImage from '@public/images/rank-pyramid/crown-purple.webp'
import crownImage from '@public/images/rank-pyramid/crown.webp'

// 순위 피라미드(RankPyramidChart) — 동일 집단 안에서의 상위 % 를 4단 피라미드(0~25 · 25~50 · 50~75 · 75~100%)로 보여 준다.
// K-BIGx 기업혁신성장 보고서 "혁신성장역량지수" 오른쪽 카드.
//
// 짜임: 왼쪽 글자 묶음 — 제목 14 Bold · 상위 % 32 Bold · 집단 이름 14 Regular(foreground-subtle).
//   오른쪽 피라미드 — 폭 258 · 높이 220 의 한 삼각형 윤곽(옆변 기울기 0.589)을 4단으로 자른다(단 사이 4).
//   꼭짓점은 반경 12, 밑변 양 끝은 반경 10 으로 둥글리고 가운데 모서리는 각지다.
//   맨 위 단 = 최상위 표시 왕관(crown.webp 에셋 · 20×18) — 현재 구간과 무관하게 늘 둔다.
//   현재 구간 = 보라 면(purple.500) + 흰 구간 글자로만 표시한다. 왕관은 현재 구간이면 흰색, 아니면 보라색 에셋이다.
//   나머지 단 = 옅은 보라 면(purple.50) + 구간 글자 12(gray.700).
//   맨 위 단 오른쪽으로 지시선 · 점 · 구간 글자(0~25%) 13 Bold(purple.600) — 왕관이 가린 구간 이름을 밖에 적는다.
// 색: 현재 구간 면은 흰 글자 · 흰 왕관이 올라가므로 고정 색(--raw-purple-500)이고, 나머지는 --ds-<색>-<단계>라
//   다크에서 단계가 뒤집혀 어두운 면 위에서도 읽힌다.
// 폭이 좁으면 글자 묶음이 위, 피라미드가 아래로 내려가고 피라미드는 폭에 맞춰 줄어든다(SVG viewBox).
// 보고서 안에서는 카드가 보일 때 아래 단부터 차례로 떠오른다(chart-reveal.tsx · animate-chart-rise).
// 상위 % 가 숫자가 아니면(NaN 등 — 순위 없음) '상위 %' 자리에 '-', 피라미드는 강조 단 없이(모두 옅은 면 · 보라 왕관) 둔다.
//   집단 이름이 비면 그 줄을 두지 않는다.

type RankPyramidChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 상위 % (0~100). 이 값이 속한 단이 강조된다. 숫자가 아니면 순위 없음('-' · 강조 없음). */
    percentile: number
    /** 글자 묶음 제목(기본 '동일업종 기준'). */
    title?: string
    /** 비교 집단 이름(예: 그 외 기타 전자부품 제조업). */
    groupLabel: string
    ariaLabel: string
}

const EMPTY_PERCENTILE = '-'

const tierLabel = (index: number) => `${index * TIER_RANGE}~${(index + 1) * TIER_RANGE}%`

// 왕관 — 최상위 표시 에셋. 맨 위 단이 현재 구간이면 보라 면 위 흰 왕관, 아니면 옅은 면 위 보라 왕관을 쓴다.
//   흰 왕관: public/images/rank-pyramid/crown.webp — 60×54(= 표시 20×18 의 3배), 여백 없음.
//   보라 왕관: public/images/rank-pyramid/crown-purple.webp — 72×72 안에 같은 60×54 그림이 여백(왼쪽 6 · 위 9)을 두고 있다.
//     같은 3배 비율로 24×24 에 그리고 여백(2 · 3)만큼 당겨, 왕관 모양이 흰 왕관과 같은 자리(20×18)에 놓이게 한다.
// SVG 안이라 next/image 대신 <image> 로 그리고, 경로는 정적 import 로 받는다[NA-005 예외 · SVG 내부].
const CROWN_WIDTH = 20
const CROWN_HEIGHT = 18
const CROWN_PURPLE_BOX = 24
const CROWN_PURPLE_OFFSET = {x: 2, y: 3}
const Crown = ({cx, cy, isOnActive}: {cx: number; cy: number; isOnActive: boolean}) => {
    const x = cx - CROWN_WIDTH / 2
    const y = cy - CROWN_HEIGHT / 2
    return isOnActive ? (
        <image href={crownImage.src} x={x} y={y} width={CROWN_WIDTH} height={CROWN_HEIGHT} />
    ) : (
        <image
            href={crownPurpleImage.src}
            x={x - CROWN_PURPLE_OFFSET.x}
            y={y - CROWN_PURPLE_OFFSET.y}
            width={CROWN_PURPLE_BOX}
            height={CROWN_PURPLE_BOX}
        />
    )
}

// 단이 차례로 떠오르는 간격(ms).
const RISE_STAGGER_MS = 120

const RankPyramidChart = ({
    percentile,
    title = '동일업종 기준',
    groupLabel,
    ariaLabel,
    className,
    ...props
}: RankPyramidChartProps) => {
    const animate = useChartAnimation()
    const hasPercentile = Number.isFinite(percentile)
    const clamped = Math.min(100, Math.max(0, percentile))
    // 순위가 없으면 어느 단도 강조하지 않는다(-1).
    const activeIndex = hasPercentile ? Math.min(TIER_COUNT - 1, Math.max(0, Math.ceil(clamped / TIER_RANGE) - 1)) : -1
    // 맨 위 삼각형은 아래가 넓어 가운데가 아래로 치우친다 — 글자 · 왕관은 높이의 60% 지점.
    const labelY = (tier: (typeof TIERS)[number]) =>
        tier.isApex ? tier.top + (tier.bottom - tier.top) * 0.6 : (tier.top + tier.bottom) / 2
    // 지시선 — 맨 위 단은 왕관이 구간 글자 자리를 차지하므로 구간 이름(0~25%)을 밖으로 빼 준다. 현재 구간과 무관하게
    // 늘 맨 위 단에서만 나간다(현재 구간은 보라 면으로만 표시). 시작 = 맨 위 단 오른쪽 변.
    const topTier = TIERS[0]
    const leaderStartY = labelY(topTier) - 2
    const leaderStartX = rightEdgeAt(topTier, leaderStartY)
    const leaderY = leaderStartY - LEADER_RISE_Y

    return (
        <div
            {...props}
            role="img"
            aria-label={ariaLabel}
            className={cn('flex flex-wrap items-start gap-x-2 gap-y-4', className)}
        >
            <div aria-hidden="true" className="flex shrink-0 flex-col pt-8">
                {/* 글자 묶음은 제목이 아닌 그림 속 글자라 p 대신 div 를 쓴다 — 크고 굵은 p 는 접근성 검사기(WAVE)가 '제목일 수 있음'으로 잡는다. 값은 role="img" 이름으로 읽힌다. */}
                <div className="typo-body-l-bold text-foreground">{title}</div>
                <div className="typo-h1-bold text-foreground">
                    {hasPercentile ? `상위 ${clamped}%` : EMPTY_PERCENTILE}
                </div>
                {groupLabel ? (
                    <div className="typo-body-l-regular text-foreground-subtle mt-3 break-keep">{groupLabel}</div>
                ) : null}
            </div>
            <svg
                viewBox={`0 0 ${VIEW_WIDTH} ${PYRAMID_HEIGHT}`}
                className="h-auto w-full max-w-80 min-w-0 flex-1 basis-60 overflow-visible"
                data-chart-reveal=""
                aria-hidden="true"
            >
                {TIERS.map((tier, index) => {
                    const isActive = index === activeIndex
                    const y = labelY(tier)
                    return (
                        // 아래 단부터 차례로 떠오른다. SVG 의 g 에도 CSS 애니메이션(opacity · transform)이 걸린다.
                        <g
                            key={tier.top}
                            className={cn(animate && 'motion-safe:animate-chart-rise')}
                            style={{animationDelay: `${(TIERS.length - 1 - index) * RISE_STAGGER_MS}ms`}}
                        >
                            <path
                                d={tierPath(tier)}
                                fill={isActive ? 'var(--raw-purple-500)' : 'var(--ds-purple-50)'}
                            />
                            {/* 맨 위 단은 구간 글자 대신 왕관을 둔다(현재 구간이면 흰 왕관). 현재 구간의 글자는 흰색. */}
                            {index === 0 ? (
                                <Crown cx={APEX_X} cy={y} isOnActive={isActive} />
                            ) : (
                                <text
                                    x={APEX_X}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize={12}
                                    fill={isActive ? 'white' : 'var(--ds-gray-700)'}
                                >
                                    {tierLabel(index)}
                                </text>
                            )}
                        </g>
                    )
                })}
                <polyline
                    points={`${leaderStartX},${leaderStartY} ${leaderStartX + LEADER_RISE_X},${leaderY} ${LEADER_DOT_X},${leaderY}`}
                    fill="none"
                    stroke="var(--ds-purple-600)"
                    strokeWidth={1}
                />
                <circle cx={LEADER_DOT_X} cy={leaderY} r={LEADER_DOT_RADIUS} fill="var(--ds-purple-600)" />
                <text
                    x={LEADER_TEXT_X}
                    y={leaderY}
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={700}
                    fill="var(--ds-purple-600)"
                >
                    {tierLabel(0)}
                </text>
            </svg>
        </div>
    )
}

export {RankPyramidChart}
export type {RankPyramidChartProps}
