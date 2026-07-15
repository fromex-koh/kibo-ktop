import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'
import {cn} from '@/lib/utils'

// 프로젝트 Badge (styled copy) — 원본 src/components/ui/badge.tsx(shadcn 바닐라)를 복사해 프로젝트 배지 시스템으로 확장한다([SC-04]).
// Badge 셸(함수·asChild·Slot·data-slot·props)은 원본과 동일하게 유지하고, 스타일 cva 와 숫자 배지 래퍼만 추가한다.
//
// Figma 배지 디자인 반영 — 3축(variant=type · color · shape). 색은 프로젝트 팔레트 유틸을
// 직접 쓴다(상태 색 계열, PB-05 보조). primary number 는 shadcn 표준 text-primary-foreground 를 쓰고,
// 그 외 solid 배지의 흰 텍스트는 text-white 가 무효라 badge-solid-fg 토큰을 쓴다. outline 배지의 흰 배경은 bg-card(다크 자동 반사)로 처리한다.
// 숫자 배지(Figma "badge_number")도 같은 badgeVariants 안에서 variant="number" 로 관리한다.
const badgeVariants = cva(
    'group/badge inline-flex w-fit shrink-0 items-center justify-center border border-transparent px-4 font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {
                'solid-pastel': '',
                outline: 'bg-card',
                solid: 'text-badge-solid-fg',
                number: 'typo-body-l-bold h-6 min-w-7 rounded-full px-2',
            },
            // 크기 — Figma 두 배지 크기. sm(기본)=28px·14px, lg=40px·16px(px-4 동일, 세로만 커짐).
            size: {
                sm: 'h-7 gap-1 text-sm [&>svg]:size-3.5',
                lg: 'h-10 gap-1.5 text-base [&>svg]:size-4',
            },
            color: {
                info: '',
                success: '',
                warning: '',
                error: '',
                neutral: '',
                // navy — 상태 색이 아닌 브랜드 분류색. 상태색과 동일한 스텝 패턴(pastel bg-50/text-600 ·
                // outline border-500/text-600 · solid bg-500)을 navy 팔레트로 적용(Figma 기본색 blue/green/… 과 동일 구조).
                navy: '',
                // 보조색(Figma secondary-*) — 상태 색이 아니라 분류용. 프로젝트 팔레트(green/orange/grape) 직접 사용.
                'secondary-green': '',
                'secondary-orange': '',
                'secondary-grape': '',
                // number — 일반 건수(primary)·새로움/알림(new) 전용 색.
                primary: '',
                new: '',
            },
            shape: {
                pill: 'rounded-full',
                round: 'rounded-sm',
            },
        },
        compoundVariants: [
            // solid-pastel: 연한 배경 + 진한 텍스트
            {variant: 'solid-pastel', color: 'info', class: 'bg-info-50 text-info-600'},
            {variant: 'solid-pastel', color: 'success', class: 'bg-success-50 text-success-600'},
            {variant: 'solid-pastel', color: 'warning', class: 'bg-warning-50 text-warning-600'},
            {variant: 'solid-pastel', color: 'error', class: 'bg-error-50 text-error-500'},
            {variant: 'solid-pastel', color: 'neutral', class: 'bg-gray-100 text-gray-500'},
            {variant: 'solid-pastel', color: 'navy', class: 'bg-navy-50 text-navy-600'},
            {variant: 'solid-pastel', color: 'secondary-green', class: 'bg-green-50 text-green-800'},
            {variant: 'solid-pastel', color: 'secondary-orange', class: 'bg-orange-50 text-orange-700'},
            {variant: 'solid-pastel', color: 'secondary-grape', class: 'bg-grape-50 text-grape-600'},
            // outline: 색 테두리 + 색 텍스트 (배경은 variant 에서 bg-card)
            {variant: 'outline', color: 'info', class: 'border-info-500 text-info-600'},
            {variant: 'outline', color: 'success', class: 'border-success-500 text-success-600'},
            {variant: 'outline', color: 'warning', class: 'border-warning-500 text-warning-600'},
            {variant: 'outline', color: 'error', class: 'border-error-500 text-error-500'},
            {variant: 'outline', color: 'neutral', class: 'border-gray-300 text-gray-300'},
            {variant: 'outline', color: 'navy', class: 'border-navy-500 text-navy-600'},
            {variant: 'outline', color: 'secondary-green', class: 'border-green-800 text-green-800'},
            {variant: 'outline', color: 'secondary-orange', class: 'border-orange-700 text-orange-700'},
            {variant: 'outline', color: 'secondary-grape', class: 'border-grape-600 text-grape-600'},
            // solid: 색 배경 + 흰 텍스트 (텍스트는 variant 에서 text-badge-solid-fg)
            {variant: 'solid', color: 'info', class: 'bg-info-500'},
            {variant: 'solid', color: 'success', class: 'bg-success-500'},
            {variant: 'solid', color: 'warning', class: 'bg-warning-500'},
            {variant: 'solid', color: 'error', class: 'bg-error-500'},
            {variant: 'solid', color: 'neutral', class: 'bg-gray-300'},
            {variant: 'solid', color: 'navy', class: 'bg-navy-500'},
            {variant: 'solid', color: 'secondary-green', class: 'bg-green-800'},
            {variant: 'solid', color: 'secondary-orange', class: 'bg-orange-700'},
            {variant: 'solid', color: 'secondary-grape', class: 'bg-grape-600'},
            // number: 숫자 전용 pill. 높이/패딩은 variant 에서, 색은 전용 컴포넌트 토큰으로 분리한다.
            {variant: 'number', color: 'primary', class: 'bg-primary text-primary-foreground'},
            {variant: 'number', color: 'new', class: 'bg-number-badge-new text-badge-solid-fg'},
        ],
        defaultVariants: {
            variant: 'solid-pastel',
            color: 'neutral',
            shape: 'pill',
            size: 'sm',
        },
    },
)

function Badge({
    className,
    variant = 'solid-pastel',
    color = 'neutral',
    shape = 'pill',
    size = 'sm',
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {asChild?: boolean}) {
    const Comp = asChild ? Slot.Root : 'span'

    return (
        <Comp
            data-slot="badge"
            data-variant={variant}
            data-color={color}
            data-shape={shape}
            data-size={size}
            className={cn(badgeVariants({variant, color, shape, size}), className)}
            {...props}
        />
    )
}

type NumberBadgeProps = Omit<React.ComponentProps<'span'>, 'color'> & {
    variant?: 'primary' | 'new'
}

function NumberBadge({className, variant = 'primary', ...props}: NumberBadgeProps) {
    return <Badge data-slot="number-badge" variant="number" color={variant} className={className} {...props} />
}

export {Badge, NumberBadge, badgeVariants}
