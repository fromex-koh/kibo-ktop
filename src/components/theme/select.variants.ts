/** Select project styles. The ui component remains responsible for Radix composition only. */
const selectGroupClassName = 'scroll-my-1 p-1'
const selectTriggerClassName =
    "group/select-trigger border-control bg-surface text-label-foreground focus-visible:border-primary focus-visible:outline-ring data-[state=open]:border-primary data-[state=open]:outline-ring aria-invalid:border-destructive data-placeholder:text-placeholder data-[size=default]:h-control-h-lg aria-readonly:bg-field-disabled disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:data-placeholder:text-disabled data-[size=md]:h-control-h-md flex items-center justify-between gap-1.5 rounded-sm border text-base whitespace-nowrap transition-colors outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-100 data-[size=default]:px-4 data-[size=md]:px-4 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:px-3 data-[size=sm]:text-sm *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 data-[state=open]:outline-2 data-[state=open]:outline-offset-2 data-[state=open]:outline-solid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"
const selectTriggerIconClassName = 'text-foreground pointer-events-none size-5'
const selectContentClassName =
    'bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg shadow-md ring-1 duration-100 data-[align-trigger=true]:animate-none'
const selectContentPopperClassName =
    'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
const selectViewportClassName =
    'data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)'
const selectLabelClassName = 'text-muted-foreground px-1.5 py-1 text-xs'
const selectItemClassName =
    "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-base outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
const selectItemIndicatorClassName = 'pointer-events-none absolute right-2 flex size-4 items-center justify-center'
const selectItemIconClassName = 'pointer-events-none'
const selectSeparatorClassName = 'bg-border pointer-events-none -mx-1 my-1 h-px'
const selectScrollButtonClassName =
    "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4"

export {
    selectContentClassName,
    selectContentPopperClassName,
    selectGroupClassName,
    selectItemClassName,
    selectItemIconClassName,
    selectItemIndicatorClassName,
    selectLabelClassName,
    selectScrollButtonClassName,
    selectSeparatorClassName,
    selectTriggerClassName,
    selectTriggerIconClassName,
    selectViewportClassName,
}
