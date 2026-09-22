// 'use client' 가 없는 파일 — 서버 컴포넌트(가이드 페이지 등)에서도 이 묶음을 펼쳐 쓸 수 있게 차트 파일과 떼어 둔다.
import type {ComparisonRadarChartProps} from '@/components/custom/comparison-radar-chart'

// K-BIGx 기업혁신성장 보고서 Tech-Index 탭 "세부지표별 상대비교분석" 카드(차트 칸 538×216) 모양 묶음 — 보고서와 가이드가 같이 쓴다.
//   동심원 격자 4고리(gray.100) · 반지름 70 · 축 이름 12 Regular(gray.700)
//   신청기업: blue.500 실선 + 반투명 면(10%) + 속이 빈 점 8 / 전체평균: blue.200 반투명 면(50%) + 점선, 점 없음
//   범례는 구획 제목 줄에 ComparisonRadarLegend 로 따로 둔다(showLegend 끔).
const TECH_INDEX_RADAR_STYLE = {
    gridType: 'circle',
    gridColor: 'var(--raw-gray-100)',
    outerRadius: 70,
    // 원 중심은 칸(216)의 세로 가운데다 — 위 · 아래 축 이름(기술인력역량 · 고객자산투자) 자리가 같다.
    centerY: 108,
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    tickFontSize: 12,
    tickFontWeight: 400,
    tickColor: 'var(--raw-gray-700)',
    primaryColor: 'var(--raw-blue-500)',
    comparisonColor: 'var(--raw-blue-200)',
    primaryFillOpacity: 0.1,
    comparisonFillOpacity: 0.5,
    comparisonAppearance: 'filled',
    dotAppearance: 'hollow',
    showLegend: false,
    showTooltip: false,
    // 축 이름이 긴 지표(기술개발상용화 등)는 원 밖으로 나가므로 SVG 밖 그리기를 허용한다 — 카드 안쪽 폭(538)에는 넉넉히 든다.
    chartClassName: 'aspect-auto h-54 min-h-0 [&_.recharts-surface]:overflow-visible',
} as const satisfies Partial<ComparisonRadarChartProps>

export {TECH_INDEX_RADAR_STYLE}
