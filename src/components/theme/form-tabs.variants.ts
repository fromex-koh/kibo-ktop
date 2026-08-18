// PROJECT-STYLE: Figma "탭 타이틀" — 폼 섹션을 카드형 탭으로 나열하고, 그 아래 폼 카드에 그대로 얹힌다.
// 탭 한 칸의 생김새는 theme/form-tab-title.variants.ts 가 전부 가진다. 여기에는 목록·본문의 배치만 남는다.
// 목록은 TabsList 의 plain variant(표면 스타일 없음)를 쓰므로 칸 사이 간격만 지정하면 된다(시안 실측 4).
const formTabsListClassName = 'gap-1'

// 본문 — 시안은 폼 카드가 탭 아래쪽을 32px 덮는 구조다(카드 라운드는 그대로 유지). z-index 를 쓰지 않고
// DOM 순서(뒤에 오는 형제가 위)로 겹침을 만든다[CD-002] — relative 만 주면 탭 위에 그려진다.
// 탭 아래 여백이 40 이라 두 줄짜리 제목이 있어도 상태 문구가 카드에 가려지지 않는다.
const formTabsContentClassName = 'relative -mt-8'

// 태블릿 이하의 바깥 틀 — [현재 섹션 줄] 다음에 그 섹션의 폼 카드가 온다.
const formTabsStackClassName = 'flex flex-col'

// PROJECT-STYLE: 태블릿(md~xl) — 모바일과 같은 방식이다(Figma "Tablet_2단계_기업정보" 792×104).
// 현재 섹션 한 줄만 카드로 두고, 그 줄을 누르면 섹션 목록이 바로 아래로 열린다.
// 여백은 시안 실측 좌우 40 · 위 20 · 아래 40 이다. 아래만 넓은 이유는 폼 카드가 이 줄의 아래쪽 20 을
// 덮고 올라오기 때문이며(본문의 -mt-5), 제목이 두 줄이 되어도 상태 문구가 가려지지 않는다.
// 모바일과 달리 화면 폭을 꽉 채우지 않고 콘텐츠 열 안의 카드로 놓이므로 고정(sticky)하지 않는다 — 시안 동일.
const formTabsTabletBarClassName = 'bg-card flex rounded-lg px-10 pt-5 pb-10'

// PROJECT-STYLE: 모바일(md 미만) — 헤더 아래에 고정되는 영역(Figma "Mobile_2단계_기업정보").
// 시안은 [단계·제목]과 [현재 섹션 줄]이 함께 붙어 있다. 둘을 한 상자에 담아 통째로 고정한다 —
// 따로 고정하면 줄의 top 을 제목 높이만큼 못 박아야 해서 제목이 두 줄이 되는 순간 어긋난다.
// 화면 폭을 가득 채우므로 페이지 좌우 여백만큼 밖으로 넓혔다가 안쪽에서 같은 값으로 되돌린다
// (--ds-grid-margin = grid-layout 의 가장자리 여백). 뒤로 지나가는 본문이 비치지 않게 페이지 면을 깐다.
// top-14 는 모바일 사이트 헤더 높이(56px)다 — 헤더가 sticky top-0 이라 그 아래에 붙여야 가려지지 않는다.
// 헤더 높이가 바뀌면 이 값도 함께 고친다. z-sticky 는 헤더(z-header)보다 낮아 헤더 위로 올라오지 않는다[CD-002].
const formTabsMobileStickyClassName = 'bg-background sticky top-14 z-sticky -mx-(--ds-grid-margin) mb-5 flex flex-col'

// 고정 영역 안의 단계·제목 자리 — 시안 실측 위 8 · 아래 8, 좌우는 페이지 가장자리 여백.
const formTabsMobileStickyHeaderClassName = 'px-(--ds-grid-margin) pt-2 pb-2'

// PROJECT-STYLE: 현재 섹션 줄 — 화면 폭을 꽉 채우는 흰 띠라 아래 모서리만 둥글다. 시안의 카드 라운드(16)와
// 같은 값을 써서 아래로 이어지는 폼 카드와 한 덩어리로 읽힌다.
const formTabsMobileBarClassName = 'bg-card flex rounded-b-lg px-(--ds-grid-margin) py-4'

// PROJECT-STYLE: 목록에서 지금 열려 있는 섹션 — 시안은 액센트 바나 굵기가 아니라 글자색만으로 구분한다
// (Figma selected #14325f = navy.600). Select 드롭다운의 선택 항목과 같은 방식·같은 토큰을 쓴다.
// 색만으로 구분하지만 같은 제목이 바로 위 줄에도 그대로 떠 있고 aria-current 로도 알리므로,
// 색을 못 보는 경우에도 지금 어느 섹션인지 알 수 있다[5.3.1].
const formTabsPickerCurrentRowClassName = 'text-select-selected-foreground'

// 섹션 목록 패널 — 고정 줄 바로 아래에 떠서 열린다(Figma "open" 328×424 · 라운드 8 · 여백 8 · 테두리 gray.200).
// 폭은 눌린 줄과 같게 맞춘다 — Radix 가 알려주는 트리거 폭을 그대로 쓴다.
// 순정 PopoverContent 의 고정 폭(w-72)·라운드(lg)·여백(2.5)·그림자를 시안 값으로 덮는다.
const formTabsPickerPanelClassName =
    'z-sticky border-control bg-card w-(--radix-popover-trigger-width) gap-0 rounded-sm border p-2 shadow-none ring-0'

export {
    formTabsContentClassName,
    formTabsListClassName,
    formTabsMobileBarClassName,
    formTabsMobileStickyClassName,
    formTabsMobileStickyHeaderClassName,
    formTabsPickerCurrentRowClassName,
    formTabsPickerPanelClassName,
    formTabsStackClassName,
    formTabsTabletBarClassName,
}
