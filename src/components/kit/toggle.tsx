'use client'

import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Toggle as TogglePrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Toggle (styled copy)
//
// `src/components/ui/toggle.tsx`(shadcn 바닐라 원본)를 복사하고 스타일 정의(toggleVariants)만
// 프로젝트 값으로 바꾼 것이다. 함수 셸(Toggle·data-slot·props·export)은 원본과 동일하게 유지한다([SC-04]).
//
// 원본 대비 차이:
//   • variant 에 `segmented`(세그먼티드 컨트롤용 항목 스타일)를 추가 — Figma "회원 유형(기업/기관)" 토글.
//     선택 시 흰색 알약(bg-background) + 옅은 그림자, 트랙(회색 배경)은 ToggleGroup 쪽에서 그린다.
//   • 색은 시맨틱 토큰(muted/background/foreground)만 사용, dark: 수동 분기 제거(토큰 자동 반사, [PB-06]).
//
// ToggleGroupItem 도 이 toggleVariants 를 공유하므로, 세그먼티드 스타일은 여기(변형)에 두고
// 트랙(그룹 배경)은 kit/toggle-group 에서 data-[variant=segmented] 로 얹는다.
// ─────────────────────────────────────────────────────────────────────────────
const toggleVariants = cva(
    "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline: 'border border-input bg-transparent hover:bg-muted',
                // 세그먼티드 항목 — 선택 시 흰 알약 + 그림자, 비선택은 트랙(muted) 위 투명.
                segmented:
                    'rounded-2xs bg-transparent text-gray-700 hover:bg-transparent data-[state=on]:bg-card data-[state=on]:shadow-sm',
            },
            size: {
                default: 'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                sm: "h-7 min-w-7 px-2.5 text-sm has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Toggle({
    className,
    variant = 'default',
    size = 'default',
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
    return (
        <TogglePrimitive.Root
            data-slot="toggle"
            className={cn(toggleVariants({variant, size, className}))}
            {...props}
        />
    )
}

export {Toggle, toggleVariants}
