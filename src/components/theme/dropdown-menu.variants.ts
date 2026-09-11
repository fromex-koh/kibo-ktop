// 드롭다운 메뉴 — 카드의 [⋮] 처럼 눌러서 할 일을 고르는 메뉴.
// 셸(ui/dropdown-menu)의 구조·동작·접근성은 radix 가 담당하고 이 파일은 스타일만 갖는다.
// 바닐라 정의는 vendor/shadcn-baseline/dropdown-menu.variants.ts 에 있다.

// PROJECT-STYLE: 바닐라는 popover 면에 radius 8·padding 4 인 촘촘한 메뉴지만, 시안(마이페이지 [⋮] 메뉴)은
// 흰 면 · gray.200 테두리 · radius 8 · 안쪽 여백 8 이고 항목이 48 로 넉넉하다. 폭은 트리거를 따르지 않고
// 내용이 정한다 — 트리거가 아이콘 하나(24)라 그 폭에 묶이면 글자가 다 접힌다.
export const dropdownMenuContentClassName =
    'bg-surface border-input z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-45 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-sm border p-2 shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'

// PROJECT-STYLE: 바닐라는 14px·py-1 의 촘촘한 항목이지만, 시안은 16px 글자에 높이 48(좌우 여백 8)이다.
// 고른 항목·마우스가 올라간 항목의 면은 blue.50(primary-subtle) 이다.
//
// 커서도 바닐라의 cursor-default 대신 cursor-pointer 다 — 눌러서 일을 고르는 자리라 마우스를 올렸을 때
// 누를 수 있다는 것이 보여야 한다(잠긴 항목은 data-disabled 가 포인터 이벤트를 막는다).
export const dropdownMenuItemClassName =
    'group/dropdown-menu-item typo-body-xl-regular text-label-foreground focus:bg-primary-subtle focus:text-label-foreground data-[variant=destructive]:text-error data-[variant=destructive]:focus:bg-error-subtle data-[variant=destructive]:focus:text-error relative flex h-12 cursor-pointer items-center gap-1.5 rounded-sm px-2 outline-hidden select-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-icon-sm'

export const dropdownMenuCheckboxItemClassName =
    "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const dropdownMenuRadioItemClassName =
    "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const dropdownMenuLabelClassName = 'px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7'

export const dropdownMenuSeparatorClassName = '-mx-1 my-1 h-px bg-border'

export const dropdownMenuShortcutClassName =
    'ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground'

export const dropdownMenuSubTriggerClassName =
    "flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// PROJECT-STYLE: 바닐라의 min-w-24 은 arbitrary value 라 같은 값의 스케일 유틸(min-w-24 = 96)로 바꾼다.
// 하위 메뉴 면·테두리는 바깥 메뉴와 같은 것을 쓴다.
export const dropdownMenuSubContentClassName =
    'z-50 min-w-24 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden bg-surface border-input rounded-sm border p-2 shadow-md duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
