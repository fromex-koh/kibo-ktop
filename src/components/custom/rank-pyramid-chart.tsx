'use client'

// 'use client' — 단이 떠오르는 움직임 여부를 문서 설정(chart-reveal.tsx)에서 읽는다.
import {TruncatedText} from '@/components/composite/truncated-text'
import {useChartAnimation} from '@/components/custom/chart-reveal'
import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {
    TIER_COUNT,
    TIER_RANGE,
    PYRAMID_HEIGHT,
    APEX_X,
    TIERS,
    VIEW_WIDTH,
    tierPath,
} from '@/components/custom/rank-pyramid-shape'

// 순위 피라미드(RankPyramidChart) — 동일 집단 안에서의 상위 % 를 4단 피라미드(0~25 · 25~50 · 50~75 · 75~100%)로 보여 준다.
// K-BIGx 기업혁신성장 보고서 "혁신성장역량지수" 오른쪽 카드.
//
// 짜임: 왼쪽 글자 묶음 — 제목 14 Bold · 상위 % 32 Bold · 집단 이름 14 Regular(foreground-subtle).
//   오른쪽 피라미드 — 폭 258 · 높이 220 의 한 삼각형 윤곽(옆변 기울기 0.589)을 4단으로 자른다(단 사이 4).
//   꼭짓점은 반경 12, 밑변 양 끝은 반경 10 으로 둥글리고 가운데 모서리는 각지다.
//   단마다 가운데에 구간 글자 12(0~25% · 25~50% · …). 맨 위 단은 삼각형이라 높이 75% 지점에 둔다(APEX_LABEL_RATIO).
//   현재 구간 = 보라 면(purple.500) + 흰 구간 글자, 나머지 단 = 옅은 보라 면(purple.50) + 구간 글자(gray.700).
// 색: 현재 구간 면은 흰 글자가 올라가므로 고정 색(--raw-purple-500)이고, 나머지는 --ds-<색>-<단계>라
//   다크에서 단계가 뒤집혀 어두운 면 위에서도 읽힌다.
// 폭이 좁으면 글자 묶음이 위, 피라미드가 아래로 내려가고 피라미드는 폭에 맞춰 줄어든다(SVG viewBox).
// 보고서 안에서는 카드가 보일 때 아래 단부터 차례로 떠오른다(chart-reveal.tsx · animate-chart-rise).
// 상위 % 가 숫자가 아니면(NaN 등 — 순위 없음) '상위 %' 자리에 '-', 피라미드는 강조 단 없이(모두 옅은 면) 둔다.
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

// 맨 위 단 구간 글자의 높이 위치(단 높이 대비) — 삼각형이라 아래로 내려야 글자 폭이 들어간다.
const APEX_LABEL_RATIO = 0.75

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
    // 맨 위 삼각형은 위가 좁다 — 구간 글자(0~25%)가 옆변에 닿지 않도록 높이의 APEX_LABEL_RATIO 지점(넓은 아래쪽)에 둔다.
    const labelY = (tier: (typeof TIERS)[number]) =>
        tier.isApex ? tier.top + (tier.bottom - tier.top) * APEX_LABEL_RATIO : (tier.top + tier.bottom) / 2

    return (
        <div
            {...props}
            role="img"
            aria-label={ariaLabel}
            className={cn('flex flex-wrap items-start gap-x-2 gap-y-4', className)}
        >
            <div aria-hidden="true" className="flex max-w-full min-w-0 shrink-0 flex-col pt-8">
                {/* 글자 묶음은 제목이 아닌 그림 속 글자라 p 대신 div 를 쓴다 — 크고 굵은 p 는 접근성 검사기(WAVE)가 '제목일 수 있음'으로 잡는다. 값은 role="img" 이름으로 읽힌다. */}
                <div className="typo-body-l-bold text-foreground">{title}</div>
                <div className="typo-h1-bold text-foreground">
                    {hasPercentile ? `상위 ${clamped}%` : EMPTY_PERCENTILE}
                </div>
                {/* 업종명 — 한 줄, 카드 폭을 넘으면 말줄임(…). 잘렸을 때만 마우스 올리기 · 탭으로 전체 이름을 툴팁으로 본다.
                    그림(role="img") 안이라 Tab 초점은 두지 않는다 — 전체 이름은 그림 이름(ariaLabel)이 읽어 준다. */}
                {groupLabel ? (
                    <TruncatedText
                        lines={1}
                        isFocusable={false}
                        className="typo-body-l-regular text-foreground-subtle mt-3"
                    >
                        {groupLabel}
                    </TruncatedText>
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
                            {/* 구간 글자 — 현재 구간의 글자는 흰색. */}
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
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

export {RankPyramidChart}
export type {RankPyramidChartProps}
