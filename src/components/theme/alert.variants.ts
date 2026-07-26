import {cva} from 'class-variance-authority'

// PROJECT-STYLE: 스타일(variant)과 색(color)을 분리한다(Badge 와 동일한 축 구성).
//  - variant outline: 테두리 있는 기존 콜아웃. 아이콘은 상태색.
//  - variant solid: Figma 시안의 테두리 없는 옅은 채움(-50) 콜아웃. 아이콘·텍스트는 중립(label-foreground).
export const alertVariants = cva(
    // PROJECT-STYLE: shadcn 원본은 아이콘을 2px 내려(translate-y-0.5) 자기네 제목 타이포에 맞추는데,
    // 프로젝트 알림은 제목·본문이 모두 text-sm(행간 20px)이고 아이콘도 20px 라 그만큼 아래로 밀려 어긋난다.
    // 아이콘을 첫 줄 상자 위쪽에 그대로 붙이면(self-start) 20px 아이콘과 20px 첫 줄의 중심이 맞는다 —
    // 한 줄 알림은 텍스트와 수직 중앙, 여러 줄·제목 알림은 첫 줄과 정렬된다.
    "group/alert relative grid w-full gap-0.5 rounded-sm px-4 py-4 text-left text-sm text-label-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:self-start *:[svg:not([class*='size-'])]:size-5",
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
                class: 'bg-info-10 border-alert-info-border *:[svg]:text-info-500',
            },
            {
                variant: 'outline',
                color: 'success',
                class: 'bg-success-10 border-alert-success-border *:[svg]:text-success-500',
            },
            {
                variant: 'outline',
                color: 'warning',
                class: 'bg-warning-10 border-alert-warning-border *:[svg]:text-warning-500',
            },
            {
                variant: 'outline',
                color: 'error',
                class: 'bg-error-10 border-alert-error-border *:[svg]:text-error-500',
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
