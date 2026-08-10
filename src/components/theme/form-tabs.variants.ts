// PROJECT-STYLE: Figma "탭 타이틀" — 폼 섹션을 카드형 탭으로 나열하고, 그 아래 폼 카드에 그대로 얹힌다.
// 탭 한 칸의 생김새는 theme/form-tab-title.variants.ts 가 전부 가진다. 여기에는 목록·본문의 배치만 남는다.
// 목록은 TabsList 의 plain variant(표면 스타일 없음)를 쓰므로 칸 사이 간격만 지정하면 된다(시안 실측 4).
const formTabsListClassName = 'gap-1'

// 본문 — 시안은 폼 카드가 탭 아래쪽을 32px 덮는 구조다(카드 라운드는 그대로 유지). z-index 를 쓰지 않고
// DOM 순서(뒤에 오는 형제가 위)로 겹침을 만든다[CD-002] — relative 만 주면 탭 위에 그려진다.
// 탭 아래 여백이 40 이라 두 줄짜리 제목이 있어도 상태 문구가 카드에 가려지지 않는다.
const formTabsContentClassName = 'relative -mt-8'

// PROJECT-STYLE: 태블릿(md~xl) — 가로 탭 대신 세로 펼침 목록이다(Figma "Tablet_2단계_기업정보").
// 접힌 섹션은 탭 행 한 줄, 펼친 섹션은 탭 행이 사라지고 폼 카드만 남는다.
const formTabsAccordionClassName = 'flex flex-col gap-2'

// PROJECT-STYLE: 모바일(md 미만) — 현재 섹션 한 줄만 헤더 아래에 고정되고, 본문은 그 섹션만 펼쳐진다
// (Figma "Mobile_2단계_기업정보" 두 번째 프레임). 흰 띠는 화면 폭을 가득 채우므로 페이지 좌우 여백만큼
// 밖으로 넓혔다가 같은 값으로 다시 안쪽 여백을 준다(--ds-grid-margin = grid-layout 의 가장자리 여백).
// top-14 는 모바일 사이트 헤더 높이(56px)다 — 헤더가 sticky top-0 이라 그 아래에 붙여야 가려지지 않는다.
// 헤더 높이가 바뀌면 이 값도 함께 고친다. z-sticky 는 헤더(z-header)보다 낮아 헤더 위로 올라오지 않는다[CD-002].
// PROJECT-STYLE: 화면 폭을 꽉 채우는 고정 줄이라 아래 모서리만 둥글다 — 시안의 카드 라운드(16)와 같은
// 값을 써서 아래로 이어지는 폼 카드와 한 덩어리로 읽힌다.
const formTabsMobileBarClassName =
    'bg-card sticky top-14 z-sticky -mx-(--ds-grid-margin) mb-5 flex rounded-b-lg px-(--ds-grid-margin) py-4'

// 섹션 목록 패널 — 고정 줄 바로 아래에 떠서 열린다(Figma "open" 328×424 · 라운드 8 · 여백 8 · 테두리 gray.200).
// 폭은 눌린 줄과 같게 맞춘다 — Radix 가 알려주는 트리거 폭을 그대로 쓴다.
// 순정 PopoverContent 의 고정 폭(w-72)·라운드(lg)·여백(2.5)·그림자를 시안 값으로 덮는다.
const formTabsPickerPanelClassName =
    'border-control bg-card w-(--radix-popover-trigger-width) gap-0 rounded-sm border p-2 shadow-none ring-0'

// 목록 안의 행 — row 는 태블릿 카드용이라 여백이 넓다(좌우 40 · 아래 40). 좁은 패널에서는 시안 실측대로
// 좌우 8 · 위아래 12 로 줄이고, 눌러서 고르는 자리라 hover 면을 준다(선택된 행은 액센트 바로 구분된다).
const formTabsPickerRowClassName = 'interactive:hover:bg-surface-subtle rounded-sm px-2 py-3'

// 카드 헤더의 접기 버튼 — 아이콘만 있는 컨트롤이라 사용처에서 sr-only 문구를 함께 준다[5.1.1].
const formSectionCollapseTriggerClassName =
    'text-foreground outline-ring focus-visible:outline-ring inline-flex items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

export {
    formSectionCollapseTriggerClassName,
    formTabsAccordionClassName,
    formTabsContentClassName,
    formTabsListClassName,
    formTabsMobileBarClassName,
    formTabsPickerPanelClassName,
    formTabsPickerRowClassName,
}
