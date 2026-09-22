// 'use client' 가 없는 파일 — 서버 컴포넌트(가이드 페이지 등)에서도 이 묶음을 펼쳐 쓸 수 있게 차트 파일과 떼어 둔다.
import type {ComparisonRadarChartProps} from '@/components/custom/comparison-radar-chart'

// K-BIGx 기업혁신성장 보고서 "부문별 비교" 카드(차트 칸 334×248) 모양 묶음 — 보고서와 가이드가 같이 쓴다.
//   동심원 격자 4고리(gray.100) · 반지름 96 · 축 이름 14 Regular(gray.700)
//   조회기업: blue.500 실선 + 반투명 면(10%) + 속이 빈 점 8 / 업종평균: blue.200 반투명 면(50%) + 점선, 점 없음
//   범례는 카드 머리 줄에 ComparisonRadarLegend 로 따로 둔다(showLegend 끔).
const SECTOR_COMPARISON_RADAR_STYLE = {
    gridType: 'circle',
    gridColor: 'var(--raw-gray-100)',
    outerRadius: 96,
    // 원 중심은 칸(248) 가운데보다 10 아래(134)다 — 위쪽 축 이름(매출액증가율) 자리를 남긴다.
    centerY: 134,
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    tickFontSize: 14,
    tickFontWeight: 400,
    tickColor: 'var(--raw-gray-700)',
    primaryColor: 'var(--raw-blue-500)',
    comparisonColor: 'var(--raw-blue-200)',
    // 두 면 모두 반투명 — 업종평균 면이 조회기업 면 아래에 비쳐 겹친 곳이 한 단계 진해진다.
    primaryFillOpacity: 0.1,
    comparisonFillOpacity: 0.5,
    comparisonAppearance: 'filled',
    dotAppearance: 'hollow',
    showLegend: false,
    // 좁은 화면(모바일 카드 안쪽 ~290)에서는 좌우 축 이름이 칸 밖으로 10 남짓 나간다 — 잘리지 않게 SVG 밖 그리기를 허용하고
    // 카드 여백(24) 안에 들어가게 둔다.
    chartClassName: 'aspect-auto h-62 min-h-0 [&_.recharts-surface]:overflow-visible',
} as const satisfies Partial<ComparisonRadarChartProps>

export {SECTOR_COMPARISON_RADAR_STYLE}
