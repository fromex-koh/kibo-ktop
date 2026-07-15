import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'

import {cn} from '@/lib/utils'

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-dotted focus-visible:outline-ring focus-visible:outline-offset-2 not-disabled:active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                // PROJECT-STYLE: shadcn 원본은 hover:bg-primary/80 + disabled:opacity-50 이지만,
                // Figma 상태값은 solid brand/control token과 disabled text token(blue.600/blue.700/gray.100/gray.300)이므로
                // bg-primary-hover/bg-primary-pressed/disabled:bg-control-disabled/disabled:text-disabled + disabled:opacity-100을 유지한다.
                default:
                    'bg-primary text-primary-foreground not-disabled:hover:bg-primary-hover not-disabled:active:bg-primary-pressed disabled:bg-control-disabled disabled:text-disabled disabled:opacity-100',
                secondary:
                    'bg-button-secondary-fill text-button-secondary-text border-button-secondary-border not-disabled:hover:bg-button-secondary-fill-hover not-disabled:hover:text-button-secondary-text-hover not-disabled:active:bg-button-secondary-fill-hover not-disabled:active:text-button-secondary-text-pressed disabled:bg-button-secondary-disabled-fill disabled:border-button-secondary-disabled-border disabled:text-button-secondary-disabled-text disabled:opacity-100',
                tertiary:
                    'bg-button-tertiary-fill text-button-tertiary-text border-button-tertiary-border not-disabled:hover:bg-button-tertiary-fill-hover not-disabled:active:bg-button-tertiary-fill-hover disabled:border-button-tertiary-disabled-border disabled:text-button-tertiary-disabled-text disabled:opacity-100',
                outline:
                    'border-input bg-background text-foreground not-disabled:hover:bg-accent aria-expanded:bg-accent',
                ghost: 'text-foreground not-disabled:hover:bg-accent aria-expanded:bg-accent',
                destructive:
                    'bg-destructive text-destructive-foreground not-disabled:hover:bg-destructive/90 not-disabled:active:bg-destructive/80',
                link: 'text-primary underline-offset-4 not-disabled:hover:underline',
                text: 'typo-body-l-regular text-label-foreground not-disabled:hover:text-foreground aria-expanded:text-foreground',
            },
            size: {
                default: 'h-control-h-md min-h-11 gap-2 px-4',
                lg: 'h-control-h-lg min-h-11 gap-2 px-6',
                'icon-2xl':
                    "size-control-h-2xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-xl",
                'icon-xl': "size-control-h-xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-xl",
                icon: "size-control-h-md min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-lg",
                'icon-lg': "size-control-h-lg min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-lg",
                sm: 'h-control-h-sm gap-1.5 rounded-md px-3 text-xs',
                xs: "h-control-h-xs gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
                'icon-sm': "size-control-h-sm rounded-sm [&_svg:not([class*='size-'])]:size-icon-md",
                'icon-xs': "size-control-h-xs rounded-2xs [&_svg:not([class*='size-'])]:size-icon-sm",
                xlarge: "h-control-h-2xl min-h-11 min-w-control-min-w-lg gap-2 rounded-sm px-6 text-lg font-bold [&_svg:not([class*='size-'])]:size-6",
                large: "h-control-h-xl min-h-11 gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                medium: "h-control-h-lg min-h-11 min-w-control-min-w-sm gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                small: "h-control-h-md min-w-control-min-w-sm gap-1.5 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-5",
                xsmall: "h-control-h-sm min-w-control-min-w-xs gap-1.5 rounded-sm px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
                '2xsmall':
                    "h-control-h-xs min-w-control-min-w-xs gap-1 rounded-2xs px-3 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
            },
        },
        compoundVariants: [
            // PROJECT-STYLE: Figma Primary(default)는 size별 font/min-width가 다른 button type과 달라 별도 보정한다.
            {variant: 'default', size: 'large', class: 'min-w-control-min-w-md text-lg'},
            {variant: 'secondary', size: 'large', class: 'min-w-control-min-w-sm'},
            {variant: 'tertiary', size: 'large', class: 'min-w-control-min-w-sm'},
            {variant: 'default', size: 'medium', class: 'font-bold disabled:font-medium'},
            {variant: 'default', size: 'small', class: 'font-bold disabled:font-medium'},
            {variant: 'link', class: 'h-auto min-h-0 min-w-0 gap-1 p-0'},
            {variant: 'text', class: 'h-auto min-h-0 min-w-0 p-0 font-normal'},
        ],
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Button({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({variant, size, className}))}
            {...props}
        />
    )
}

export {Button, buttonVariants}
