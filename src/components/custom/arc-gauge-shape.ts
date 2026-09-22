// 원호 게이지의 모양 값(ArcGauge 공통) — 크기별 치수 · 상태 색 · 원호 기하 · 스켈레톤 경로.
// 'use client' 가 없는 순수 계산 파일이다 — 서버 컴포넌트(ChartSkeleton)와 클라이언트 컴포넌트(ArcGauge)가 함께 쓴다.
// (클라이언트 파일의 함수는 서버에서 부를 수 없다.)

type ArcGaugeTone = 'excellent' | 'good' | 'normal' | 'poor' | 'weak'
type ArcGaugeSize = 'lg' | 'md'

// 상태별 채움 색(우수 · 양호 · 보통 · 미흡 · 취약).
const ARC_GAUGE_TONE_COLORS: Record<ArcGaugeTone, string> = {
    excellent: 'var(--raw-blue-500)',
    good: 'var(--raw-mint-700)',
    normal: 'var(--raw-orange-500)',
    poor: 'var(--raw-error-500)',
    weak: 'var(--raw-gray-700)',
}

// 크기별 치수와 Tailwind 클래스 — 클래스는 정적 문자열이어야 생성된다.
//   box = 최대 폭 · 비율, overlay = 가운데 글자 묶음 축소 기준(100cqw ÷ 원 지름).
const ARC_GAUGE_SIZES = {
    lg: {
        width: 320,
        height: 208,
        stroke: 46,
        boxClassName: 'max-w-80',
        chartClassName: 'aspect-[320/208]',
        overlayClassName: 'scale-[min(1,calc(100cqw/--spacing(80)))]',
    },
    md: {
        width: 260,
        height: 172,
        stroke: 37,
        boxClassName: 'max-w-65',
        chartClassName: 'aspect-[260/172]',
        overlayClassName: 'scale-[min(1,calc(100cqw/--spacing(65)))]',
    },
} as const

// Recharts 는 둥글림 두 개보다 '커야' 끝을 둥글린다(같거나 짧으면 각지게 그려 시작점이 아래 밖으로 나가 잘린다) — 2° 여유.
const MIN_FILL_MARGIN_DEGREE = 2
const toDegree = (radian: number) => (radian * 180) / Math.PI

// 크기별 원호 기하 — 반지름(%) · 시작/끝 각도 · 최소 채움 비율.
const arcGeometry = (size: ArcGaugeSize) => {
    const {width, height, stroke} = ARC_GAUGE_SIZES[size]
    const outer = width / 2
    const inner = outer - stroke
    const center = outer - stroke / 2
    // 양 끝이 수평선 아래로 내려가는 각도 — 둥근 끝의 바닥이 보이는 높이에 닿는 자리.
    const endDrop = toDegree(Math.asin((height - stroke / 2 - outer) / center))
    // Recharts 의 둥근 끝은 원호 각도 안쪽으로 말려 들어간다 — 끝 반원이 차지하는 각도만큼 양쪽을 늘린다.
    const cap = toDegree(Math.asin(stroke / 2 / center))
    const start = 180 + endDrop + cap
    const end = -(endDrop + cap)
    // Recharts 는 반지름 % 를 '그림 상자 짧은 변의 절반' 기준으로 잰다 — 상자가 줄어도 비율이 유지되게 % 로 준다.
    const base = Math.min(width, height) / 2
    return {
        start,
        end,
        cy: `${(outer / height) * 100}%`,
        innerRadius: `${(inner / base) * 100}%`,
        outerRadius: `${(outer / base) * 100}%`,
        minFillRatio: (cap * 2 + MIN_FILL_MARGIN_DEGREE) / (start - end),
    }
}

// 스켈레톤(ChartSkeleton)이 같은 원호를 그리도록 — 굵기의 가운데 선을 따라 그린 경로(선 굵기 = stroke, 끝 둥글림).
const arcGaugeTrackPath = (size: ArcGaugeSize) => {
    const {width, height, stroke} = ARC_GAUGE_SIZES[size]
    const outer = width / 2
    const center = outer - stroke / 2
    const endDrop = Math.asin((height - stroke / 2 - outer) / center)
    const x = center * Math.cos(endDrop)
    const y = outer + center * Math.sin(endDrop)
    const round = (value: number) => Math.round(value * 100) / 100
    return `M ${round(outer - x)} ${round(y)} A ${round(center)} ${round(center)} 0 1 1 ${round(outer + x)} ${round(y)}`
}

export {ARC_GAUGE_SIZES, ARC_GAUGE_TONE_COLORS, arcGaugeTrackPath, arcGeometry}
export type {ArcGaugeSize, ArcGaugeTone}
