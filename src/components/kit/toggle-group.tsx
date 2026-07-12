'use client'

import * as React from 'react'
import {type VariantProps} from 'class-variance-authority'
import {ToggleGroup as ToggleGroupPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'
import {toggleVariants} from '@/components/kit/toggle'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 ToggleGroup (styled copy)
//
// `src/components/ui/toggle-group.tsx`(shadcn 바닐라 원본)를 복사하고 스타일(className)만 바꾼 것이다.
// 함수 셸(ToggleGroup·ToggleGroupItem·context·data-slot·props·export)은 원본과 동일하게 유지한다([SC-04]).
//
// 원본 대비 차이 — `variant="segmented"` 세그먼티드 컨트롤(Figma "회원 유형" 토글):
//   • 그룹: 회색 트랙(bg-muted) + 안쪽 여백(p-0.5) + 라운드(rounded-xs=6px). data-[variant=segmented] 로 얹는다.
//   • 항목: 선택 시 흰 알약 — 스타일은 toggleVariants 의 segmented 변형(kit/toggle)에서 정의한다.
// toggleVariants 는 kit/toggle(styled copy)에서 가져와, 항목 스타일도 프로젝트 값으로 일관되게 한다.
// ─────────────────────────────────────────────────────────────────────────────

const ToggleGroupContext = React.createContext<
    VariantProps<typeof toggleVariants> & {
        spacing?: number
        orientation?: 'horizontal' | 'vertical'
    }
>({
    size: 'default',
    variant: 'default',
    spacing: 2,
    orientation: 'horizontal',
})

function ToggleGroup({
    className,
    variant,
    size,
    spacing = 2,
    orientation = 'horizontal',
    children,
    ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
        spacing?: number
        orientation?: 'horizontal' | 'vertical'
    }) {
    // CSS 커스텀 프로퍼티(--gap)는 기본 CSSProperties 타입에 없어, 템플릿 키 인덱스로 타이핑한다([ST-002] as 회피).
    const groupStyle: React.CSSProperties & Record<`--${string}`, string | number> = {'--gap': spacing}

    return (
        <ToggleGroupPrimitive.Root
            data-slot="toggle-group"
            data-variant={variant}
            data-size={size}
            data-spacing={spacing}
            data-orientation={orientation}
            style={groupStyle}
            className={cn(
                'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-vertical:flex-col data-vertical:items-stretch data-[size=sm]:rounded-[min(var(--radius-md),10px)]',
                // 세그먼티드 트랙 — 회색 배경 + 안쪽 여백 + 촘촘한 간격.
                'data-[variant=segmented]:bg-muted data-[variant=segmented]:gap-0.5 data-[variant=segmented]:rounded-xs data-[variant=segmented]:p-0.5',
                className,
            )}
            {...props}
        >
            <ToggleGroupContext.Provider value={{variant, size, spacing, orientation}}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    )
}

function ToggleGroupItem({
    className,
    children,
    variant = 'default',
    size = 'default',
    ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
    const context = React.useContext(ToggleGroupContext)

    return (
        <ToggleGroupPrimitive.Item
            data-slot="toggle-group-item"
            data-variant={context.variant || variant}
            data-size={context.size || size}
            data-spacing={context.spacing}
            className={cn(
                'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
                toggleVariants({
                    variant: context.variant || variant,
                    size: context.size || size,
                }),
                // 세그먼티드 항목 크기 = Figma 스펙: 항목 25px(텍스트 lh 21 + py 2*2), 트랙은 +패딩 4px=29px.
                // size 의 고정 h-7/h-8 을 무시하고 텍스트를 hug 하도록 h-auto+py-0.5+leading-normal(14px→21px).
                // group-data 선택자 특이도(0,2,0)로 size 유틸(0,1,0)을 확실히 이긴다(size 무관하게 29px).
                'group-data-[variant=segmented]/toggle-group:h-auto group-data-[variant=segmented]/toggle-group:py-0.5 group-data-[variant=segmented]/toggle-group:leading-normal',
                className,
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    )
}

export {ToggleGroup, ToggleGroupItem}
