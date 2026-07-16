import {cva} from 'class-variance-authority'

// PROJECT-STYLE: shadcn Button 함수 셸은 ui/button.tsx에 유지하고 프로젝트 스타일만 이 파일에서 관리한다.
const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2 not-disabled:active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'border-primary bg-primary text-primary-foreground not-disabled:hover:bg-primary-hover not-disabled:active:bg-primary-pressed disabled:border-control-disabled disabled:bg-control-disabled disabled:text-disabled disabled:opacity-100',
                secondary:
                    'bg-secondary text-secondary-foreground border-secondary-strong not-disabled:hover:bg-secondary-hover not-disabled:hover:text-secondary-foreground-hover not-disabled:active:bg-secondary-pressed not-disabled:active:text-secondary-foreground-pressed disabled:bg-control-disabled disabled:border-disabled-subtle disabled:text-disabled disabled:opacity-100',
                tertiary:
                    'bg-tertiary text-tertiary-foreground border-tertiary-strong not-disabled:hover:bg-tertiary-hover not-disabled:active:bg-tertiary-pressed disabled:bg-control-disabled-subtle disabled:border-disabled-subtle disabled:text-disabled disabled:opacity-100',
                outline:
                    'border-input bg-background text-foreground not-disabled:hover:bg-accent aria-expanded:bg-accent',
                ghost: 'text-foreground not-disabled:hover:bg-accent aria-expanded:bg-accent',
                destructive:
                    'bg-destructive text-destructive-foreground not-disabled:hover:bg-destructive/90 not-disabled:active:bg-destructive/80',
                link: 'text-label-foreground underline-offset-4 not-disabled:hover:underline disabled:text-disabled-subtle disabled:opacity-100',
                text: 'text-label-foreground disabled:text-disabled-subtle disabled:opacity-100',
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
            {variant: 'default', size: 'large', class: 'min-w-control-min-w-md text-lg'},
            {variant: 'secondary', size: 'large', class: 'min-w-control-min-w-sm'},
            {variant: 'tertiary', size: 'large', class: 'min-w-control-min-w-sm'},
            {variant: 'default', size: 'medium', class: 'font-bold disabled:font-medium'},
            {variant: 'default', size: 'small', class: 'font-bold disabled:font-medium'},
            {variant: ['text', 'link'], class: 'min-h-0 min-w-0 p-0 font-normal'},
            {variant: ['text', 'link'], size: 'xlarge', class: "h-control-h-md [&_svg:not([class*='size-'])]:size-5"},
            {
                variant: ['text', 'link'],
                size: 'large',
                class: "h-control-h-md text-lg [&_svg:not([class*='size-'])]:size-5",
            },
            {
                variant: ['text', 'link'],
                size: 'medium',
                class: "h-control-h-xs text-base [&_svg:not([class*='size-'])]:size-5",
            },
            {
                variant: ['text', 'link'],
                size: 'small',
                class: "h-control-h-2xs text-sm [&_svg:not([class*='size-'])]:size-4",
            },
            {
                variant: ['text', 'link'],
                size: 'xsmall',
                class: "h-control-h-2xs text-xs [&_svg:not([class*='size-'])]:size-3",
            },
            {
                variant: ['text', 'link'],
                size: '2xsmall',
                class: "h-control-h-2xs text-xs [&_svg:not([class*='size-'])]:size-3",
            },
        ],
        defaultVariants: {variant: 'default', size: 'default'},
    },
)

export {buttonVariants}
