import {cva} from 'class-variance-authority'
import {cn} from '@/lib/utils'

const chipVariants = cva(
    'text-label-foreground border-control bg-surface inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-base font-normal whitespace-nowrap transition-colors outline-none',
    {
        variants: {
            size: {
                lg: 'h-control-h-lg',
                md: 'h-control-h-md',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    },
)

const chipStateClassName = cn(
    'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
    'data-checked:border-2 data-checked:border-primary data-checked:text-primary-strong data-checked:font-bold',
    'disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100',
)

const chipGroupClassName = 'flex w-fit flex-wrap gap-2'
const chipCheckboxClassName = 'justify-between px-6'
const chipCheckboxContentClassName = 'flex-1 text-left'
const chipCheckboxIndicatorClassName = 'shrink-0 text-current'
const chipCheckboxIconClassName = 'size-4'

export {
    chipVariants,
    chipStateClassName,
    chipGroupClassName,
    chipCheckboxClassName,
    chipCheckboxContentClassName,
    chipCheckboxIndicatorClassName,
    chipCheckboxIconClassName,
}
