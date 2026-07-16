import {cva} from 'class-variance-authority'

export const inputGroupClassName = cnInputGroup()
function cnInputGroup() {
    return 'group/input-group border-control bg-surface has-disabled:bg-field-disabled has-disabled:opacity-100 relative flex h-control-h-lg w-full min-w-0 items-center gap-2 rounded-sm border px-4 transition-colors outline-none has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-solid has-[[data-slot][aria-invalid=true]]:border-destructive'
}
export const inputGroupAddonVariants = cva(
    "text-foreground-subtle group-has-disabled/input-group:text-disabled flex h-auto items-center justify-center gap-2 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-icon-sm",
    {
        variants: {align: {'inline-start': 'order-first', 'inline-end': 'order-last'}},
        defaultVariants: {align: 'inline-start'},
    },
)
export const inputGroupButtonClassName = 'shrink-0'
export const inputGroupTextClassName =
    "text-foreground-subtle [&_svg:not([class*='size-'])]:size-icon-sm flex items-center gap-2 text-sm [&_svg]:pointer-events-none"
export const inputGroupInputClassName =
    'h-full flex-1 rounded-none border-0 bg-transparent p-0 outline-none read-only:bg-transparent disabled:bg-transparent focus-visible:outline-none'
export const inputGroupTextareaClassName =
    'min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-0 outline-none read-only:bg-transparent disabled:bg-transparent focus-visible:outline-none'
