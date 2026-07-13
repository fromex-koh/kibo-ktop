'use client'

// 프로젝트 Switch (styled copy) — 원본 src/components/ui/switch.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 셸(구성·size prop·data-slot·Thumb·export)은 원본과 동일하고, className 만 Figma "toggle_switch" 에 맞춘다.
//   · 트랙 40×24(default)·완전 둥근, thumb 20(흰색)·2px inset, on 일 때 16px 이동. sm 은 컴팩트(32×20·thumb16·12px).
//   · 색은 기존 팔레트/시맨틱에서 Figma 최근사값으로: off=bg-gray-400(#6d7882 근사), on=bg-primary(brand blue,
//     Figma #256ef4 근사), thumb=bg-white(구조색, 항상 흰색). 원본의 arbitrary px 사이즈·dark 분기는 스케일 유틸/
//     토큰으로 대체(다크 자동 반사, [PB-06]). 포커스링·터치 hit-area(after:-inset)·disabled 는 원본 그대로.
import * as React from 'react'
import {Switch as SwitchPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

function Switch({
    className,
    size = 'default',
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: 'sm' | 'default'
}) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(
                'peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:bg-primary relative inline-flex shrink-0 items-center rounded-full border border-transparent px-0.5 transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 aria-invalid:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-unchecked:bg-gray-400 data-[size=default]:h-6 data-[size=default]:w-10 data-[size=sm]:h-5 data-[size=sm]:w-8',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className="pointer-events-none block rounded-full bg-white ring-0 transition-transform group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 data-unchecked:translate-x-0"
            />
        </SwitchPrimitive.Root>
    )
}

export {Switch}
