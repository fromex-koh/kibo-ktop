import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'
import {cn} from '@/lib/utils'

// 프로젝트 Badge (styled copy) — 원본 src/components/ui/badge.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 원본과의 차이는 badgeVariants(스타일 cva) 뿐이고, 셸(함수·data-slot·props·export)은 동일하다.
//
// Figma 배지 디자인 반영 — 3축(variant=type · color · shape). 색은 프로젝트 팔레트 유틸을
// 직접 쓴다(상태 색 계열, PB-05 보조). solid 배지의 흰 텍스트는 text-white 가 무효라
// badge-solid-fg 토큰을 쓰고, outline 배지의 흰 배경은 bg-card(다크 자동 반사)로 처리한다.
const badgeVariants = cva(
    'group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1 border border-transparent px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3.5',
    {
        variants: {
            variant: {
                'solid-pastel': '',
                outline: 'bg-card',
                solid: 'text-badge-solid-fg',
            },
            color: {
                info: '',
                success: '',
                warning: '',
                error: '',
                neutral: '',
                // 보조색(Figma secondary-*) — 상태 색이 아니라 분류용. 프로젝트 팔레트(green/orange/grape) 직접 사용.
                'secondary-green': '',
                'secondary-orange': '',
                'secondary-grape': '',
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
            {variant: 'solid-pastel', color: 'neutral', class: 'bg-gray-50 text-gray-500'},
            {variant: 'solid-pastel', color: 'secondary-green', class: 'bg-green-50 text-green-800'},
            {variant: 'solid-pastel', color: 'secondary-orange', class: 'bg-orange-50 text-orange-700'},
            {variant: 'solid-pastel', color: 'secondary-grape', class: 'bg-grape-50 text-grape-600'},
            // outline: 색 테두리 + 색 텍스트 (배경은 variant 에서 bg-card)
            {variant: 'outline', color: 'info', class: 'border-info-500 text-info-600'},
            {variant: 'outline', color: 'success', class: 'border-success-500 text-success-600'},
            {variant: 'outline', color: 'warning', class: 'border-warning-500 text-warning-600'},
            {variant: 'outline', color: 'error', class: 'border-error-500 text-error-500'},
            {variant: 'outline', color: 'neutral', class: 'border-gray-300 text-gray-300'},
            {variant: 'outline', color: 'secondary-green', class: 'border-green-800 text-green-800'},
            {variant: 'outline', color: 'secondary-orange', class: 'border-orange-700 text-orange-700'},
            {variant: 'outline', color: 'secondary-grape', class: 'border-grape-600 text-grape-600'},
            // solid: 색 배경 + 흰 텍스트 (텍스트는 variant 에서 text-badge-solid-fg)
            {variant: 'solid', color: 'info', class: 'bg-info-500'},
            {variant: 'solid', color: 'success', class: 'bg-success-500'},
            {variant: 'solid', color: 'warning', class: 'bg-warning-500'},
            {variant: 'solid', color: 'error', class: 'bg-error-500'},
            {variant: 'solid', color: 'neutral', class: 'bg-gray-300'},
            {variant: 'solid', color: 'secondary-green', class: 'bg-green-800'},
            {variant: 'solid', color: 'secondary-orange', class: 'bg-orange-700'},
            {variant: 'solid', color: 'secondary-grape', class: 'bg-grape-600'},
        ],
        defaultVariants: {
            variant: 'solid-pastel',
            color: 'neutral',
            shape: 'pill',
        },
    },
)

function Badge({
    className,
    variant = 'solid-pastel',
    color = 'neutral',
    shape = 'pill',
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
            className={cn(badgeVariants({variant, color, shape}), className)}
            {...props}
        />
    )
}

export {Badge, badgeVariants}
