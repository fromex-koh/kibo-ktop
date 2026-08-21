import {cva} from 'class-variance-authority'

export const badgeVariants = cva(
    // 타이포는 base 가 아니라 type·size 조합이 가진다 — 라벨 배지는 typo-body-l-medium(14/21),
    // 숫자 배지는 typo-body-l-bold 로 서로 다른 굵기를 쓰기 때문이다. base 에 font-medium 을 두면
    // 같은 속성을 두 번 지정하게 되고([PB-08]) 어느 쪽이 이길지 CSS 순서에 맡기게 된다.
    'group/badge inline-flex w-fit shrink-0 items-center justify-center border border-transparent whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {'solid-pastel': '', outline: 'bg-card', solid: 'text-badge-solid-fg'},
            type: {label: '', number: 'typo-body-l-bold h-6 min-w-7 rounded-full px-2'},
            size: {xs: 'h-6 gap-1 [&>svg]:size-3', sm: 'h-7 gap-1 [&>svg]:size-3.5', lg: 'h-10 gap-1.5 [&>svg]:size-4'},
            color: {
                info: '',
                success: '',
                warning: '',
                error: '',
                neutral: '',
                navy: '',
                'secondary-green': '',
                'secondary-orange': '',
                'secondary-purple': '',
                primary: '',
                new: '',
            },
            shape: {pill: 'rounded-full', round: 'rounded-sm'},
        },
        compoundVariants: [
            {variant: 'solid-pastel', color: 'info', class: 'bg-pastel-info text-pastel-info-foreground'},
            {
                variant: 'solid-pastel',
                color: 'success',
                class: 'bg-pastel-success text-pastel-success-foreground',
            },
            {
                variant: 'solid-pastel',
                color: 'warning',
                class: 'bg-pastel-warning text-pastel-warning-foreground',
            },
            {
                variant: 'solid-pastel',
                color: 'error',
                class: 'bg-pastel-error text-pastel-error-foreground',
            },
            {
                variant: 'solid-pastel',
                color: 'neutral',
                class: 'bg-pastel-neutral text-pastel-neutral-foreground',
            },
            {
                variant: 'solid-pastel',
                color: 'navy',
                class: 'bg-pastel-navy text-pastel-navy-foreground',
            },
            {variant: 'solid-pastel', color: 'secondary-green', class: 'bg-green-50 text-green-800'},
            {variant: 'solid-pastel', color: 'secondary-orange', class: 'bg-orange-50 text-orange-700'},
            {variant: 'solid-pastel', color: 'secondary-purple', class: 'bg-purple-50 text-purple-600'},
            {variant: 'outline', color: 'info', class: 'border-info-500 text-info-600'},
            {variant: 'outline', color: 'success', class: 'border-success-500 text-success-600'},
            {variant: 'outline', color: 'warning', class: 'border-warning-500 text-warning-600'},
            {variant: 'outline', color: 'error', class: 'border-error-500 text-error-500'},
            {
                variant: 'outline',
                color: 'neutral',
                class: 'border-badge-outline-neutral text-badge-outline-neutral',
            },
            {variant: 'outline', color: 'navy', class: 'border-navy-500 text-navy-600'},
            {variant: 'outline', color: 'secondary-green', class: 'border-green-800 text-green-800'},
            {variant: 'outline', color: 'secondary-orange', class: 'border-orange-700 text-orange-700'},
            {variant: 'outline', color: 'secondary-purple', class: 'border-purple-600 text-purple-600'},
            {variant: 'solid', color: 'info', class: 'bg-badge-solid-info'},
            {variant: 'solid', color: 'success', class: 'bg-badge-solid-success'},
            {variant: 'solid', color: 'warning', class: 'bg-badge-solid-warning'},
            {variant: 'solid', color: 'error', class: 'bg-badge-solid-error'},
            {variant: 'solid', color: 'neutral', class: 'bg-badge-solid-neutral'},
            {variant: 'solid', color: 'navy', class: 'bg-badge-solid-navy'},
            {variant: 'solid', color: 'secondary-green', class: 'bg-green-800'},
            {variant: 'solid', color: 'secondary-orange', class: 'bg-orange-700'},
            {variant: 'solid', color: 'secondary-purple', class: 'bg-purple-600'},
            {type: 'number', color: 'primary', class: 'bg-primary text-primary-foreground'},
            {type: 'number', color: 'new', class: 'bg-number-badge-new text-badge-solid-fg'},
            // PROJECT-STYLE: badge sm(28px)는 글자 14/21(typo-body-l-medium) + 최소 너비 60px 이고,
            // 좌우 여백은 모양에 따라 다르다 — pill 12px · round 8px(Figma badge 컴포넌트 세트, 그리고
            // 실제 인스턴스 "KTRS-FM" 61+16=77px). 화면 인스턴스에서 "확인"(글자 28px)은 최소 너비 60px 로
            // 벌어지고 "성장초기"(글자 49px)는 pill 이면 49+24=73px 로 늘어난다.
            // lg(40px)는 Figma 에 없는 프로젝트 확장이라 기존 16px 여백을 유지한다.
            // PROJECT-STYLE: xs(24px)는 Figma badge 세트의 size=small 이다 — 글자 12/18(typo-caption-medium),
            // 좌우 여백 8px, 라운드 8px. 시안은 이 크기를 round 로만 그려 두었고 최소 너비도 정하지 않아
            // (인스턴스 폭 42px 는 글자 폭에 여백을 더한 값이다) 글자만큼만 차지하게 둔다. pill 여백은
            // 다른 크기와 같은 12px 를 따른다. Figma 의 size=large 는 프로젝트 sm(28px)에 해당한다.
            {type: 'label', size: 'xs', class: 'typo-caption-medium'},
            {type: 'label', size: 'xs', shape: 'pill', class: 'px-3'},
            {type: 'label', size: 'xs', shape: 'round', class: 'px-2'},
            {type: 'label', size: 'sm', class: 'typo-body-l-medium min-w-15'},
            {type: 'label', size: 'sm', shape: 'pill', class: 'px-3'},
            {type: 'label', size: 'sm', shape: 'round', class: 'px-2'},
            {type: 'label', size: 'lg', class: 'typo-body-xl-medium px-4'},
            // PROJECT-STYLE: 숫자 배지는 Figma 28×24 라 size 의 높이(h-7)를 덮어 24px 를 유지한다.
            // Figma 숫자 배지는 테두리가 없다 — 공통 base 의 투명 1px 테두리를 지워 안쪽 폭을
            // 시안(12px)과 같게 맞추고, 배율에 따라 좌우 테두리가 다르게 반올림되는 것도 막는다.
            {type: 'number', class: 'h-6 border-0'},
        ],
        defaultVariants: {variant: 'solid-pastel', color: 'neutral', shape: 'pill', size: 'sm'},
    },
)
