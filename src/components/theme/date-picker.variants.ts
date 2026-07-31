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

export {
    datePickerCalendarPopoverClassName,
    datePickerGroupClassName,
    datePickerSizeClassName,
    datePickerTriggerClassName,
    datePickerPlaceholderClassName,
    datePickerValueClassName,
    datePickerDisabledValueClassName,
    datePickerIconClassName,
}
