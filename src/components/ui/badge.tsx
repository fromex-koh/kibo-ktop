import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'

import {cn} from '@/lib/utils'

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
            // outline: 색 테두리 + 색 텍스트 (배경은 variant 에서 bg-card)
            {variant: 'outline', color: 'info', class: 'border-info-500 text-info-600'},
            {variant: 'outline', color: 'success', class: 'border-success-500 text-success-600'},
            {variant: 'outline', color: 'warning', class: 'border-warning-500 text-warning-600'},
            {variant: 'outline', color: 'error', class: 'border-error-500 text-error-500'},
            {variant: 'outline', color: 'neutral', class: 'border-gray-300 text-gray-300'},
            // solid: 색 배경 + 흰 텍스트 (텍스트는 variant 에서 text-badge-solid-fg)
            {variant: 'solid', color: 'info', class: 'bg-info-500'},
            {variant: 'solid', color: 'success', class: 'bg-success-500'},
            {variant: 'solid', color: 'warning', class: 'bg-warning-500'},
            {variant: 'solid', color: 'error', class: 'bg-error-500'},
            {variant: 'solid', color: 'neutral', class: 'bg-gray-300'},
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
