import {cva} from 'class-variance-authority'

// PROJECT-STYLE: 스타일(variant)과 색(color)을 분리한다(Badge 와 동일한 축 구성).
//  - variant outline: 테두리 있는 기존 콜아웃. 아이콘은 상태색.
//  - variant solid: Figma 시안의 테두리 없는 옅은 채움(-50) 콜아웃. 아이콘·텍스트는 중립(label-foreground).
export const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 rounded-sm px-4 py-4 text-left text-sm text-label-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                outline: 'border',
                solid: 'border-transparent',
            },
            color: {
                info: '',
                success: '',
                warning: '',
                error: '',
            },
        },
        compoundVariants: [
            // outline — 테두리 + 옅은 배경(-10) + 상태색 아이콘
            {
                variant: 'outline',
                color: 'info',
                class: 'bg-info-10 border-info-100 dark:border-info-400 *:[svg]:text-info-500',
            },
            {
                variant: 'outline',
                color: 'success',
                class: 'bg-success-10 border-success-100 dark:border-success-400 *:[svg]:text-success-500',
            },
            {
                variant: 'outline',
                color: 'warning',
                class: 'bg-warning-10 border-warning-100 dark:border-warning-400 *:[svg]:text-warning-500',
            },
            {
                variant: 'outline',
                color: 'error',
                class: 'bg-error-10 border-error-100 dark:border-error-400 *:[svg]:text-error-500',
            },
            // solid — 채움 배경(-50) + 중립 아이콘(label-foreground)
            // info 는 Figma 시안 배경 그대로 blue.50(#f3f8ff)을 쓴다(info-50 보다 약간 더 밝은 파랑).
            {variant: 'solid', color: 'info', class: 'bg-blue-50 *:[svg]:text-label-foreground'},
            {variant: 'solid', color: 'success', class: 'bg-success-50 *:[svg]:text-label-foreground'},
            {variant: 'solid', color: 'warning', class: 'bg-warning-50 *:[svg]:text-label-foreground'},
            {variant: 'solid', color: 'error', class: 'bg-error-50 *:[svg]:text-label-foreground'},
        ],
        defaultVariants: {variant: 'outline', color: 'info'},
    },
)
export const alertTitleClassName =
    'text-foreground [&_a]:hover:text-foreground font-bold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3'
export const alertDescriptionClassName =
    'text-label-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4'
export const alertActionClassName = 'absolute top-2 right-2'
