const datePickerGroupClassName =
    'p-0 has-[[data-readonly]]:bg-field-disabled has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control][data-state=open]]:border-primary has-[[data-slot=input-group-control][data-state=open]]:outline-ring has-[[data-slot=input-group-control][data-state=open]]:outline-2 has-[[data-slot=input-group-control][data-state=open]]:outline-offset-2 has-[[data-slot=input-group-control][data-state=open]]:outline-solid'
// PROJECT-STYLE: 시안 date_input(40006650:29729·29732)은 large 48 · medium 40 두 단계다.
// Select 와 같은 축·같은 토큰을 쓴다 — 같은 폼 줄에 나란히 놓이므로 높이가 어긋나면 안 된다.
// 글자(16/24)·아이콘(20)·좌우 여백(16)은 두 사이즈가 같아 높이만 다르다.
const datePickerSizeClassName = {
    lg: 'h-control-h-md',
    md: 'h-control-h-sm',
} as const

const datePickerTriggerClassName =
    'typo-body-xl-regular text-label-foreground flex h-full w-full min-w-0 cursor-pointer items-center justify-between gap-2 px-4 outline-none data-[readonly]:cursor-default disabled:cursor-not-allowed disabled:text-disabled'
const datePickerPlaceholderClassName = 'text-placeholder'
const datePickerValueClassName = 'text-label-foreground'
const datePickerDisabledValueClassName = 'text-disabled'
const datePickerIconClassName = 'text-foreground group-has-disabled/input-group:text-disabled size-icon-md shrink-0'
// PROJECT-STYLE: shadcn Popover 원본은 rounded-lg + ring-1 이지만,
// Figma 날짜선택 팝오버는 radius 8 + gray.200 테두리 1px 이라
// rounded-sm/border-subtle-2 를 쓰고 ring 은 끈다. 내부 여백은 Calendar(p-6)가 가진다.
// Portal 패널은 z-popover(1600)를 사용해 z-header(1200)보다 위에 표시한다.
const datePickerCalendarPopoverClassName = 'border-subtle-2 z-popover w-auto rounded-sm border p-0 ring-0'

// PROJECT-STYLE: 월 선택 — 날짜 달력과 같은 팝오버 안에서 날짜 격자만 12개월 격자로 바뀐다.
// 폭(360 = 패딩 24 + 그리드 312)과 안쪽 여백은 달력과 같게 두어, 같은 폼에서 날짜 칸과 월 칸이
// 나란히 있어도 팝오버 크기가 달라 보이지 않는다.
// 팝오버 안에서는 배경을 비운다 — 흰 면을 다시 깔면 팝오버의 둥근 모서리를 덮어 테두리가 끊겨 보인다
// (Calendar 도 같은 처리를 한다: in-data-[slot=popover-content]:bg-transparent).
const datePickerMonthPanelClassName =
    'bg-surface in-data-[slot=popover-content]:bg-transparent flex w-90 flex-col gap-4 p-6'
// 모바일 모달 안 — 카드 폭에 맞춰 늘어나고, 바깥 여백은 모달 본문이 이미 갖고 있어 없앤다.
const datePickerMobilePanelClassName = 'w-full bg-transparent p-0'
// 날짜 달력도 같은 이유로 자기 여백을 없애고 폭을 맡긴다. 날짜 버튼의 최소 폭(44)은 풀어 준다 —
// 7칸 × 44 는 360 화면에 들어가지 않는다. 셀 높이(--cell-size 40)는 그대로라 누르기에 무리가 없다.
const datePickerMobileCalendarClassName = 'w-full p-0 [&_td_button]:min-w-0'
const datePickerMonthHeaderClassName = 'flex items-center justify-between gap-2'
// 3열 × 4행 — 312px 을 셋으로 나눠 한 칸이 100 남짓이라 "12월" 이 여유 있게 들어간다.
const datePickerMonthGridClassName = 'grid grid-cols-3 gap-2'
// 셀 — 달력 날짜 셀과 같은 높이·라운드·선택 색을 쓴다(calendar.variants 의 day 버튼과 한 벌).
// hover 면은 고르지 않은 칸에만 준다 — 선택된 칸까지 덮으면 파란 면이 옅은 회색으로 바뀌면서
// 흰 글자만 남아 글씨가 사라진 것처럼 보인다(hover 와 선택은 같은 background 속성이라 뒤에 오는 쪽이 이긴다).
const datePickerMonthCellClassName =
    'text-label-foreground h-control-h-sm flex items-center justify-center rounded-sm text-base leading-6 font-normal transition-colors select-none outline-ring focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid not-data-[selected=true]:not-disabled:interactive:hover:bg-surface-subtle data-[current=true]:bg-primary-subtle data-[selected=true]:bg-primary data-[selected=true]:font-medium data-[selected=true]:text-primary-foreground disabled:text-disabled-subtle'

export {
    datePickerCalendarPopoverClassName,
    datePickerMonthCellClassName,
    datePickerMonthGridClassName,
    datePickerMonthHeaderClassName,
    datePickerMobileCalendarClassName,
    datePickerMobilePanelClassName,
    datePickerMonthPanelClassName,
    datePickerGroupClassName,
    datePickerSizeClassName,
    datePickerTriggerClassName,
    datePickerPlaceholderClassName,
    datePickerValueClassName,
    datePickerDisabledValueClassName,
    datePickerIconClassName,
}
