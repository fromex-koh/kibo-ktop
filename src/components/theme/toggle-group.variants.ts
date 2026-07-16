// ToggleGroup은 Toggle의 variant/size 스타일을 공유하고 그룹 레이아웃만 별도로 관리한다.
export const toggleGroupClassName =
    'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-vertical:flex-col data-vertical:items-stretch data-[size=sm]:rounded-[min(var(--radius-md),10px)]'
export const toggleGroupSegmentedClassName =
    'data-[variant=segmented]:bg-muted data-[variant=segmented]:gap-0.5 data-[variant=segmented]:rounded-xs data-[variant=segmented]:p-0.5'
export const toggleGroupItemClassName =
    'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t'
export const toggleGroupItemSegmentedClassName =
    'group-data-[variant=segmented]/toggle-group:h-auto group-data-[variant=segmented]/toggle-group:py-0.5 group-data-[variant=segmented]/toggle-group:leading-normal'
