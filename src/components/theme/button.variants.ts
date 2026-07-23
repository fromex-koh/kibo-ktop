import {cva} from 'class-variance-authority'

// PROJECT-STYLE: shadcn Button 함수 셸은 ui/button.tsx에 유지하고 프로젝트 스타일만 이 파일에서 관리한다.
const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2 interactive:active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-100 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'border-primary bg-primary text-primary-foreground interactive:hover:bg-primary-hover interactive:active:bg-primary-pressed disabled:border-control-disabled disabled:bg-control-disabled disabled:text-disabled disabled:opacity-100',
                secondary:
                    'bg-secondary text-secondary-foreground border-secondary-strong interactive:hover:bg-secondary-hover interactive:hover:text-secondary-foreground-hover interactive:active:bg-secondary-pressed interactive:active:text-secondary-foreground-pressed disabled:bg-control-disabled disabled:border-disabled-subtle disabled:text-disabled disabled:opacity-100',
                tertiary:
                    'bg-tertiary text-tertiary-foreground border-tertiary-strong interactive:hover:bg-tertiary-hover interactive:active:bg-tertiary-pressed disabled:bg-control-disabled-subtle disabled:border-disabled-subtle disabled:text-disabled disabled:opacity-100',
                outline:
                    'border-input bg-background text-foreground interactive:hover:bg-accent aria-expanded:bg-accent disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled',
                ghost: 'text-foreground interactive:hover:bg-accent aria-expanded:bg-accent disabled:bg-control-disabled disabled:text-disabled',
                destructive:
                    'bg-destructive text-destructive-foreground interactive:hover:bg-destructive/90 interactive:active:bg-destructive/80 disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled',
                link: 'text-label-foreground underline-offset-4 interactive:hover:underline disabled:text-disabled-subtle disabled:opacity-100',
                text: 'text-label-foreground disabled:text-disabled-subtle disabled:opacity-100',
            },
            size: {
                default: 'h-control-h-md min-h-11 gap-2 px-4',
                '2xl': "h-control-h-2xl min-h-11 min-w-control-min-w-lg gap-2 rounded-sm px-6 text-lg font-bold [&_svg:not([class*='size-'])]:size-6",
                xl: "h-control-h-xl min-h-11 gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                lg: "h-control-h-lg min-h-11 min-w-control-min-w-sm gap-2 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-6",
                md: "h-control-h-md min-w-control-min-w-sm gap-1.5 rounded-sm px-6 text-base font-medium [&_svg:not([class*='size-'])]:size-5",
                sm: "h-control-h-sm min-w-control-min-w-xs gap-1.5 rounded-sm px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
                xs: "h-control-h-xs min-w-control-min-w-xs gap-1 rounded-2xs px-3 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
                'icon-2xl':
                    "size-control-h-2xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-xl",
                'icon-xl': "size-control-h-xl min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-xl",
                icon: "size-control-h-md min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-lg",
                'icon-lg': "size-control-h-lg min-h-11 min-w-11 rounded-sm [&_svg:not([class*='size-'])]:size-icon-lg",
                'icon-sm': "size-control-h-sm rounded-sm [&_svg:not([class*='size-'])]:size-icon-md",
                'icon-xs': "size-control-h-xs rounded-2xs [&_svg:not([class*='size-'])]:size-icon-sm",
            },
        },
        compoundVariants: [
            {variant: 'default', size: 'xl', class: 'min-w-control-min-w-md text-lg'},
            {variant: 'secondary', size: 'xl', class: 'min-w-control-min-w-sm'},
            {variant: 'tertiary', size: 'xl', class: 'min-w-control-min-w-sm'},
            {variant: 'default', size: 'lg', class: 'font-bold disabled:font-medium'},
            {variant: 'default', size: 'md', class: 'font-bold disabled:font-medium'},
            {variant: ['text', 'link'], class: 'min-h-0 min-w-0 p-0 font-normal'},
            {variant: ['text', 'link'], size: '2xl', class: "h-control-h-md [&_svg:not([class*='size-'])]:size-5"},
            {
                variant: ['text', 'link'],
                size: 'xl',
                class: "h-control-h-md text-lg [&_svg:not([class*='size-'])]:size-5",
            },
            {
                variant: ['text', 'link'],
                size: 'lg',
                class: "h-control-h-xs text-base [&_svg:not([class*='size-'])]:size-5",
            },
            {
                variant: ['text', 'link'],
                size: 'md',
                class: "h-control-h-2xs text-sm [&_svg:not([class*='size-'])]:size-4",
            },
            {
                variant: ['text', 'link'],
                size: 'sm',
                class: "h-control-h-2xs text-xs [&_svg:not([class*='size-'])]:size-3",
            },
            {
                variant: ['text', 'link'],
                size: 'xs',
                class: "h-control-h-2xs text-xs [&_svg:not([class*='size-'])]:size-3",
            },
        ],
        defaultVariants: {variant: 'default', size: 'default'},
    },
)

export {buttonVariants}
