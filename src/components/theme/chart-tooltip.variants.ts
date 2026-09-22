// 차트 툴팁 한 가지 스타일 — Recharts 툴팁(ChartTooltipContent)과 직접 그리는 툴팁(워드클라우드 · 네트워크 그래프)이 함께 쓴다.
// ui/chart.tsx 는 순정 셸이라 고치지 않고, 여기 정의를 className · labelClassName 으로 입힌다[SC-02/SC-04].
//
// 짜임: 흰 면(card — background 는 옅은 회색 gray.50 이라 떠 있는 면에는 card 를 쓴다) · 옅은 테두리(border/50) · 둥근 모서리 8(rounded-sm · 카드와 같음) · 그림자 xl · 여백 8/12 · 최소 폭 128.
//   제목 = 14 Bold(foreground) · 설명 = 13 Regular(foreground-subtle) · 계열 줄 = 점 8 + 이름 13 Regular(subtle) ↔ 값 13 Bold.
//   글자는 접지 않는다 — 좁은 가장자리에서도 한 줄로 읽히게(whitespace-nowrap).

// PROJECT-STYLE: shadcn 원본 툴팁은 text-xs · px-2.5 py-1.5 · rounded-lg(이 프로젝트에서는 16) · font-medium 라벨이지만,
// 프로젝트 차트 툴팁은 typo 토큰(14/13)과 여백 8/12 로 통일하므로 아래 정의로 덮는다.
const chartTooltipClassName =
    'text-foreground grid min-w-32 gap-1.5 rounded-sm border border-border/50 bg-card px-3 py-2 whitespace-nowrap shadow-xl'
const chartTooltipTitleClassName = 'typo-body-l-bold text-foreground'
const chartTooltipDescriptionClassName = 'typo-body-m-regular text-foreground-subtle'
const chartTooltipRowClassName = 'flex w-full items-center justify-between gap-6'
const chartTooltipRowNameClassName = 'typo-body-m-regular text-foreground-subtle flex items-center gap-1.5'
const chartTooltipDotClassName = 'size-2 shrink-0 rounded-full'
const chartTooltipValueClassName = 'typo-body-m-bold text-foreground tabular-nums'

export {
    chartTooltipClassName,
    chartTooltipDescriptionClassName,
    chartTooltipDotClassName,
    chartTooltipRowClassName,
    chartTooltipRowNameClassName,
    chartTooltipTitleClassName,
    chartTooltipValueClassName,
}
