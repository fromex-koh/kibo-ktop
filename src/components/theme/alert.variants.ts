import {cva} from 'class-variance-authority'

export const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 rounded-sm border px-4 py-4 text-left text-sm text-label-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                info: 'bg-info-10 border-info-100 *:[svg]:text-info-500',
                success: 'bg-success-10 border-success-100 *:[svg]:text-success-500',
                warning: 'bg-warning-10 border-warning-100 *:[svg]:text-warning-500',
                error: 'bg-error-10 border-error-100 *:[svg]:text-error-500',
            },
        },
        defaultVariants: {variant: 'info'},
    },
)
export const alertTitleClassName =
    'text-foreground [&_a]:hover:text-foreground font-bold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3'
export const alertDescriptionClassName =
    'text-label-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4'
export const alertActionClassName = 'absolute top-2 right-2'
