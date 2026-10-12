// 순위 피라미드 모양(경로 · 치수) — 'use client' 없는 순수 파일이라 서버 컴포넌트(ChartSkeleton)와
// 차트(RankPyramidChart, 클라이언트) 양쪽이 같은 값을 쓴다. 클라이언트 파일에서 가져오면 서버에서는 값이 아니라
// 참조 객체가 되어 RANK_PYRAMID_TIER_PATHS.map 같은 호출이 빌드(프리렌더)에서 깨진다.

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

export {
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
    RANK_PYRAMID_TIER_PATHS,
    RANK_PYRAMID_VIEW_BOX,
}
