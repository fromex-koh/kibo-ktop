import {cn} from '@/lib/utils'

// PROJECT-STYLE: 모달 안의 데이터 표 — 실적인정 지식재산·보증제한 업종이 같은 표를 쓴다(Figma 동일 컴포넌트).
// 시안 실측: 행 높이 45(글자 21 + 위아래 12) · 좌우 여백 16 · 테두리 gray.100 · 글자 14px.
// 셸(ui/table)이 셀에 주는 한 줄 고정(whitespace-nowrap)은 풀어 준다 — 좁은 화면에서는 줄을 바꿔야
// 표가 화면 안에 들어온다.
const dialogTableCellClassName =
    'border-subtle-3 typo-body-l-regular text-foreground border px-4 py-3 align-middle whitespace-normal'

// 제목 칸(열 제목·분류 칸) — 옅은 파란 면에 가운데 정렬. 글자 굵기는 쓰는 쪽이 정한다
// (열 제목은 Bold, 행 묶음의 분류는 Medium — 시안).
const dialogTableHeaderCellClassName = cn(dialogTableCellClassName, 'bg-primary-subtle text-center')

// 표 자체 — 좁은 화면에서 열이 글자 단위로 찌그러지지 않도록 최소 폭을 넓은 화면과 같게 잡는다.
// 넘치면 셸(ui/table)이 두른 상자가 좌우로 스크롤돼, 위아래 스크롤(모달 본문)과 방향이 나뉜다.
// 500 은 모달 본문 폭 508 에서 세로 스크롤바 자리(8)를 뺀 값이다 — 넓은 화면에서 가로 스크롤바가
// 6px 때문에 생기지 않도록 그만큼만 줄여 둔다.
const dialogTableClassName = 'min-w-125'

export {dialogTableCellClassName, dialogTableClassName, dialogTableHeaderCellClassName}
