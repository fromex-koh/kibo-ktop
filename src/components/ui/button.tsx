import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'

import {cn} from '@/lib/utils'

// 색/반경/포커스는 프로젝트 디자인 토큰(--ds-*) 브릿지 유틸을 사용한다.
// variant 는 전용 버튼 토큰(button-*-fill / -hover / -pressed)에 정밀 연결한다.
// size 는 control-h 토큰을 쓰되, 상호작용 타깃은 min-h-11(44px, KWCAG 6.1.3)로 보정한다.
const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
                outline: 'border-input bg-background text-foreground hover:bg-accent aria-expanded:bg-accent',
                ghost: 'text-foreground hover:bg-accent aria-expanded:bg-accent',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                // 기본/큰 사이즈 + 아이콘 버튼은 44px 터치 타깃 보장
                default: 'h-control-h-md min-h-11 gap-2 px-4',
                lg: 'h-control-h-lg min-h-11 gap-2 px-6',
                icon: 'size-control-h-md min-h-11 min-w-11',
                'icon-lg': 'size-control-h-lg min-h-11 min-w-11',
                // 컴팩트 변형(밀도 높은 UI용) — 44px 미만, 인접 간격 확보 전제하에 제한적으로 사용
                sm: 'h-control-h-sm gap-1.5 rounded-md px-3 text-xs',
                xs: "h-control-h-xs gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
                'icon-sm': 'size-control-h-sm rounded-md',
                'icon-xs': "size-control-h-xs rounded-md [&_svg:not([class*='size-'])]:size-3",
            },
        },
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
