import {cva} from 'class-variance-authority'

export const badgeVariants = cva(
    'group/badge inline-flex w-fit shrink-0 items-center justify-center border border-transparent font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {'solid-pastel': '', outline: 'bg-card', solid: 'text-badge-solid-fg'},
            type: {label: '', number: 'typo-body-l-bold h-6 min-w-7 rounded-full px-2'},
            size: {sm: 'h-7 gap-1 text-sm [&>svg]:size-3.5', lg: 'h-10 gap-1.5 text-base [&>svg]:size-4'},
            color: {
                info: '',
                success: '',
                warning: '',
                error: '',
                neutral: '',
                navy: '',
                'secondary-green': '',
                'secondary-orange': '',
                'secondary-grape': '',
                primary: '',
                new: '',
            },
            shape: {pill: 'rounded-full', round: 'rounded-sm'},
        },
        compoundVariants: [
            {variant: 'solid-pastel', color: 'info', class: 'bg-info-50 text-info-600 dark:bg-muted dark:text-info'},
            {
                variant: 'solid-pastel',
                color: 'success',
                class: 'bg-success-50 text-success-600 dark:bg-muted dark:text-success',
            },
            {
                variant: 'solid-pastel',
                color: 'warning',
                class: 'bg-warning-50 text-warning-600 dark:bg-muted dark:text-warning',
            },
            {
                variant: 'solid-pastel',
                color: 'error',
                class: 'bg-error-50 text-error-500 dark:bg-muted dark:text-error',
            },
            {
                variant: 'solid-pastel',
                color: 'neutral',
                class: 'bg-gray-50 text-gray-500 dark:bg-muted dark:text-foreground',
            },
            {
                variant: 'solid-pastel',
                color: 'navy',
                class: 'bg-navy-50 text-navy-600 dark:bg-primary-subtle dark:text-primary',
            },
            {variant: 'solid-pastel', color: 'secondary-green', class: 'bg-green-50 text-green-800'},
            {variant: 'solid-pastel', color: 'secondary-orange', class: 'bg-orange-50 text-orange-700'},
            {variant: 'solid-pastel', color: 'secondary-grape', class: 'bg-grape-50 text-grape-600'},
            {variant: 'outline', color: 'info', class: 'border-info-500 text-info-600'},
            {variant: 'outline', color: 'success', class: 'border-success-500 text-success-600'},
            {variant: 'outline', color: 'warning', class: 'border-warning-500 text-warning-600'},
            {variant: 'outline', color: 'error', class: 'border-error-500 text-error-500'},
            {
                variant: 'outline',
                color: 'neutral',
                class: 'border-gray-300 text-gray-300 dark:border-foreground-subtle dark:text-foreground-subtle',
            },
            {variant: 'outline', color: 'navy', class: 'border-navy-500 text-navy-600'},
            {variant: 'outline', color: 'secondary-green', class: 'border-green-800 text-green-800'},
            {variant: 'outline', color: 'secondary-orange', class: 'border-orange-700 text-orange-700'},
            {variant: 'outline', color: 'secondary-grape', class: 'border-grape-600 text-grape-600'},
            {variant: 'solid', color: 'info', class: 'bg-info-500 dark:bg-info dark:text-background'},
            {variant: 'solid', color: 'success', class: 'bg-success-500 dark:bg-success dark:text-background'},
            {variant: 'solid', color: 'warning', class: 'bg-warning-500 dark:bg-warning dark:text-background'},
            {variant: 'solid', color: 'error', class: 'bg-error-500 dark:bg-error dark:text-background'},
            {variant: 'solid', color: 'neutral', class: 'bg-gray-300 dark:bg-foreground dark:text-background'},
            {variant: 'solid', color: 'navy', class: 'bg-navy-500 dark:bg-primary dark:text-primary-foreground'},
            {variant: 'solid', color: 'secondary-green', class: 'bg-green-800'},
            {variant: 'solid', color: 'secondary-orange', class: 'bg-orange-700'},
            {variant: 'solid', color: 'secondary-grape', class: 'bg-grape-600'},
            {type: 'number', color: 'primary', class: 'bg-primary text-primary-foreground'},
            {type: 'number', color: 'new', class: 'bg-number-badge-new text-badge-solid-fg'},
            // PROJECT-STYLE: Figma badge(28px)는 좌우 여백 8px + 최소 너비 60px 이다. 화면 인스턴스에서
            // "확인"(글자 28px)은 60px 로 벌어지고 "성장초기"(글자 49px)는 49+16=65px 로 늘어난다.
            // lg(40px)는 Figma 에 없는 프로젝트 확장이라 기존 16px 여백을 유지한다.
            {type: 'label', size: 'sm', class: 'min-w-15 px-2'},
            {type: 'label', size: 'lg', class: 'px-4'},
            // PROJECT-STYLE: 숫자 배지는 Figma 28×24 라 size 의 높이(h-7)를 덮어 24px 를 유지한다.
            // Figma 숫자 배지는 테두리가 없다 — 공통 base 의 투명 1px 테두리를 지워 안쪽 폭을
            // 시안(12px)과 같게 맞추고, 배율에 따라 좌우 테두리가 다르게 반올림되는 것도 막는다.
            {type: 'number', class: 'h-6 border-0'},
        ],
        defaultVariants: {variant: 'solid-pastel', color: 'neutral', shape: 'pill', size: 'sm'},
    },
)
