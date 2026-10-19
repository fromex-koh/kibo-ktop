import {cn} from '@/lib/utils'

// 정보 표 스타일 — 표 모양을 바꿀 때는 이 파일만 고친다.
// 쓰는 곳: composite/info-table.tsx(공용 조각) · ui/table 로 그리는 정보 표 유형(아래 표 상수).
//   표 유형별 마크업은 /component-guide/info-table 참고.
//
// 모양: 위 진한 선 1 · 칸 아래 선 1 · 줄 높이 45 · 칸 여백 위 12 / 아래 11 / 좌우 16
//   머리 칸 = 옅은 파란 면 · 14 Bold, 행 머리(열 머리와 함께 쓸 때) = 14 Medium, 값 칸 = 카드 면 · 14 Regular
//
// 주의: twMerge 가 typo-* 를 몰라 두 개를 덧붙이면 나중 것이 이긴다. 굵기를 바꾸려면 덧붙이지 말고
//   해당 상수(예: infoTableRowHeadClassName)를 쓴다[PB-08].

// ── 공용 조각 — InfoTable 과 ui/table 표가 함께 쓴다 ──

// 표 위 진한 선.
const infoTableTopLineClassName = 'border-t-foreground-subtle border-t'

// 칸 아래 선 + 여백. 줄 높이 45 = 글자 21 + 위 12 + 아래 11 + 선 1(보고서 표 ReportTable 과 같은 높이).
const infoTableCellLineClassName = 'border-subtle-3 border-b px-4 pt-3 pb-2.75'

// 머리 칸 면 · 글자(옅은 파란 면 · 14 Bold).
const infoTableHeadSurfaceClassName = 'bg-primary-subtle text-foreground typo-body-l-bold'

// 값 칸 면 · 글자(카드 면 · 14 Regular).
const infoTableValueSurfaceClassName = 'bg-card text-label-foreground typo-body-l-regular'

// 긴 글 접기 — 한글은 어절 단위로, 띄어쓰기 없는 긴 영문 · 숫자는 칸 안에서 끊는다(칸 밖으로 넘치지 않게).
const infoTableWrapClassName = 'wrap-anywhere break-keep'

// ── ui/table 로 그리는 정보 표 유형 ──

// 표 — 위 진한 선 · 열 폭 균등(table-fixed). 특정 열만 넓히려면 그 열 첫 칸에 w-* 를 준다.
const infoTableClassName = cn(infoTableTopLineClassName, 'table-fixed')

// 줄 — 셸이 주는 아래 선 · hover 면을 끈다(선은 칸이 갖는다).
const infoTableRowClassName = 'border-0 hover:bg-transparent'

// 칸 공통 — ui/table 셸의 고정 높이 · 한 줄 고정(whitespace-nowrap)을 풀고 가운데 정렬한다.
const infoTableCellBaseClassName = cn(
    infoTableCellLineClassName,
    infoTableWrapClassName,
    'h-auto text-center align-middle whitespace-normal',
)

// 열 머리 · 행 머리(가로형 · 세로형) — 옅은 파란 면 · 14 Bold.
const infoTableHeadClassName = cn(infoTableCellBaseClassName, infoTableHeadSurfaceClassName)

// 열 머리와 함께 쓰는 행 머리(행/열 머리 유형) — 열 머리와 구분되게 14 Medium.
const infoTableRowHeadClassName = cn(infoTableCellBaseClassName, 'bg-primary-subtle text-foreground typo-body-l-medium')

// 값 칸 — 카드 면 · 14 Regular.
const infoTableCellClassName = cn(infoTableCellBaseClassName, infoTableValueSurfaceClassName)

// 값 칸 나눔 유형에서 나뉜 값의 왼쪽 칸 — 오른쪽에 세로 선.
const infoTableSplitCellClassName = cn(infoTableCellClassName, 'border-r')

export {
    infoTableCellClassName,
    infoTableCellLineClassName,
    infoTableClassName,
    infoTableHeadClassName,
    infoTableHeadSurfaceClassName,
    infoTableRowClassName,
    infoTableRowHeadClassName,
    infoTableSplitCellClassName,
    infoTableTopLineClassName,
    infoTableValueSurfaceClassName,
    infoTableWrapClassName,
}
