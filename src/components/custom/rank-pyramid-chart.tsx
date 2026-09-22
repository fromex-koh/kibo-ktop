import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import crownPurpleImage from '@public/images/rank-pyramid/crown-purple.webp'
import crownImage from '@public/images/rank-pyramid/crown.webp'

// 순위 피라미드(RankPyramidChart) — 동일 집단 안에서의 상위 % 를 4단 피라미드(0~25 · 25~50 · 50~75 · 75~100%)로 보여 준다.
// K-BIGx 기업혁신성장 보고서 "혁신성장역량지수" 오른쪽 카드.
//
// 짜임: 왼쪽 글자 묶음 — 제목 14 Bold · 상위 % 32 Bold · 집단 이름 14 Regular(gray.500).
//   오른쪽 피라미드 — 폭 258 · 높이 220 의 한 삼각형 윤곽(옆변 기울기 0.589)을 4단으로 자른다(단 사이 4).
//   꼭짓점은 반경 12, 밑변 양 끝은 반경 10 으로 둥글리고 가운데 모서리는 각지다.
//   맨 위 단 = 최상위 표시 왕관(crown.webp 에셋 · 20×18) — 현재 구간과 무관하게 늘 둔다.
//   현재 구간 = 보라 면(purple.500)으로만 표시하고, 그 위 구간 글자는 흰색이 된다. 왕관은 현재 구간이면 흰색, 아니면 보라색 에셋이다.
//   나머지 단 = 옅은 보라 면(purple.50) + 구간 글자 12(gray.700).
//   맨 위 단 오른쪽으로 지시선 · 점 · 구간 글자(0~25%) 13 Bold(purple.600) — 왕관이 가린 구간 이름을 밖에 적는다.
// 폭이 좁으면 글자 묶음이 위, 피라미드가 아래로 내려가고 피라미드는 폭에 맞춰 줄어든다(SVG viewBox).

type RankPyramidChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 상위 % (0~100). 이 값이 속한 단이 강조된다. */
    percentile: number
    /** 글자 묶음 제목(기본 '동일업종 기준'). */
    title?: string
    /** 비교 집단 이름(예: 그 외 기타 전자부품 제조업). */
    groupLabel: string
    ariaLabel: string
}

const TIER_COUNT = 4
const TIER_RANGE = 100 / TIER_COUNT
const PYRAMID_WIDTH = 258
const PYRAMID_HEIGHT = 220
const APEX_X = PYRAMID_WIDTH / 2
// 피라미드 윤곽 — 옆변 기울기 0.589 의 한 직선이다. 꼭짓점은 보이는 위쪽 끝(y 0)보다 11.4 위에 있고
// 반경 12 로 크게 둥글려 잘린다(위쪽 끝의 폭 약 13). 밑변 양 끝도 반경 10 으로 둥글려, 보이는 폭이 258 이 된다.
// 단은 이 윤곽을 4칸으로 자른 것이라 모든 단의 옆변이 한 직선 위에 놓인다(단 사이 4). 가운데 모서리는 각지다.
const SIDE_SLOPE = 0.589
const APEX_Y = -11.4
const APEX_RADIUS = 12
const BASE_RADIUS = 10
const halfWidthAt = (y: number) => SIDE_SLOPE * (y - APEX_Y)
const tier = (top: number, bottom: number, radius: readonly [number, number], isApex = false) => ({
    top,
    bottom,
    topHalf: halfWidthAt(top),
    bottomHalf: halfWidthAt(bottom),
    radius,
    isApex,
})
const TIERS = [
    tier(0, 42.5, [APEX_RADIUS, 0], true),
    tier(46.5, 101.5, [0, 0]),
    tier(105.5, 161, [0, 0]),
    tier(165, 220, [0, BASE_RADIUS]),
] as const
// 지시선 — 맨 위 단 오른쪽 변에서 대각선으로 올라간 뒤 수평으로 점까지. 점 x 248 · 글자 x 256.
const LEADER_RISE_X = 7.5
const LEADER_RISE_Y = 9.5
const LEADER_DOT_X = 248
const LEADER_TEXT_X = 256
const LEADER_DOT_RADIUS = 3
const VIEW_WIDTH = 320

type Point = {x: number; y: number}

// 경로 숫자는 소수 둘째 자리로 반올림한다 — 서버와 브라우저의 부동소수 계산 끝자리가 달라(12 대 11.999…) 하이드레이션이
// 어긋나지 않게.
const PATH_PRECISION = 100
const round = (value: number) => Math.round(value * PATH_PRECISION) / PATH_PRECISION

// 꼭짓점마다 반경만큼 모서리를 원호로 둥글린 다각형 경로 — 두 변에 접하는 원(반경 r)의 접점 사이를 원호(A)로 잇는다.
// 반경이 0 이면 각진 모서리 그대로다.
const roundedPolygonPath = (points: readonly Point[], radii: readonly number[]) =>
    points
        .map((point, index) => {
            const previous = points[(index - 1 + points.length) % points.length]
            const next = points[(index + 1) % points.length]
            const radius = radii[index]
            const command = index === 0 ? 'M' : 'L'
            if (!radius) return `${command} ${round(point.x)} ${round(point.y)}`
            const toPrevious = {x: previous.x - point.x, y: previous.y - point.y}
            const toNext = {x: next.x - point.x, y: next.y - point.y}
            const previousLength = Math.hypot(toPrevious.x, toPrevious.y)
            const nextLength = Math.hypot(toNext.x, toNext.y)
            const cosine = (toPrevious.x * toNext.x + toPrevious.y * toNext.y) / (previousLength * nextLength)
            const halfAngle = Math.acos(Math.min(1, Math.max(-1, cosine))) / 2
            // 접점까지의 거리 — 변 길이의 절반을 넘지 않게 줄인다.
            const tangent = Math.min(radius / Math.tan(halfAngle), previousLength / 2, nextLength / 2)
            const arcRadius = tangent * Math.tan(halfAngle)
            const start = {
                x: point.x + (toPrevious.x / previousLength) * tangent,
                y: point.y + (toPrevious.y / previousLength) * tangent,
            }
            const end = {x: point.x + (toNext.x / nextLength) * tangent, y: point.y + (toNext.y / nextLength) * tangent}
            const sweep = toPrevious.x * toNext.y - toPrevious.y * toNext.x < 0 ? 1 : 0
            return `${command} ${round(start.x)} ${round(start.y)} A ${round(arcRadius)} ${round(arcRadius)} 0 0 ${sweep} ${round(end.x)} ${round(end.y)}`
        })
        .join(' ') + ' Z'

const tierPath = ({top, bottom, topHalf, bottomHalf, radius, isApex}: (typeof TIERS)[number]) => {
    const [topRadius, bottomRadius] = radius
    const bottomLeft = {x: APEX_X - bottomHalf, y: bottom}
    const bottomRight = {x: APEX_X + bottomHalf, y: bottom}
    // 맨 위 단은 보이지 않는 꼭짓점(APEX_Y)에서 시작하는 삼각형 — 둥글림(12)이 보이는 위쪽 끝을 만든다.
    return isApex
        ? roundedPolygonPath([{x: APEX_X, y: APEX_Y}, bottomRight, bottomLeft], [topRadius, bottomRadius, bottomRadius])
        : roundedPolygonPath(
              [{x: APEX_X - topHalf, y: top}, {x: APEX_X + topHalf, y: top}, bottomRight, bottomLeft],
              [topRadius, topRadius, bottomRadius, bottomRadius],
          )
}

// 단 오른쪽 변 위의 점(y 높이).
const rightEdgeAt = ({top, bottom, topHalf, bottomHalf}: (typeof TIERS)[number], y: number) =>
    APEX_X + topHalf + ((bottomHalf - topHalf) * (y - top)) / (bottom - top)

// 스켈레톤(ChartSkeleton type="rank-pyramid")이 같은 모양을 쓰도록 단 경로를 내보낸다.
const RANK_PYRAMID_TIER_PATHS = TIERS.map(tierPath)
const RANK_PYRAMID_VIEW_BOX = `0 0 ${VIEW_WIDTH} ${PYRAMID_HEIGHT}`

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

const RankPyramidChart = ({
    percentile,
    title = '동일업종 기준',
    groupLabel,
    ariaLabel,
    className,
    ...props
}: RankPyramidChartProps) => {
    const clamped = Math.min(100, Math.max(0, percentile))
    const activeIndex = Math.min(TIER_COUNT - 1, Math.max(0, Math.ceil(clamped / TIER_RANGE) - 1))
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
                <div className="typo-h1-bold text-foreground">상위 {clamped}%</div>
                <div className="typo-body-l-regular text-foreground-subtle mt-3 break-keep">{groupLabel}</div>
            </div>
            <svg
                viewBox={`0 0 ${VIEW_WIDTH} ${PYRAMID_HEIGHT}`}
                className="h-auto w-full max-w-80 min-w-0 flex-1 basis-60 overflow-visible"
                aria-hidden="true"
            >
                {TIERS.map((tier, index) => {
                    const isActive = index === activeIndex
                    const y = labelY(tier)
                    return (
                        <g key={tier.top}>
                            <path
                                d={tierPath(tier)}
                                fill={isActive ? 'var(--raw-purple-500)' : 'var(--raw-purple-50)'}
                            />
                            {/* 왕관은 최상위(맨 위 단)의 표시다 — 현재 구간과 무관하게 늘 맨 위에 둔다.
                                현재 구간은 보라 면으로만 표시하고, 그 위 구간 글자는 흰색으로 바꾼다. 왕관은 현재 구간이면 흰색, 아니면 보라색 에셋이다. */}
                            {index === 0 ? (
                                <Crown cx={APEX_X} cy={y} isOnActive={isActive} />
                            ) : (
                                <text
                                    x={APEX_X}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize={12}
                                    fill={isActive ? 'white' : 'var(--raw-gray-700)'}
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
                    stroke="var(--raw-purple-600)"
                    strokeWidth={1}
                />
                <circle cx={LEADER_DOT_X} cy={leaderY} r={LEADER_DOT_RADIUS} fill="var(--raw-purple-600)" />
                <text
                    x={LEADER_TEXT_X}
                    y={leaderY}
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={700}
                    fill="var(--raw-purple-600)"
                >
                    {tierLabel(0)}
                </text>
            </svg>
        </div>
    )
}

export {RANK_PYRAMID_TIER_PATHS, RANK_PYRAMID_VIEW_BOX, RankPyramidChart}
export type {RankPyramidChartProps}
