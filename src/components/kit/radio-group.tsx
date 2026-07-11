'use client'

import * as React from 'react'
import {RadioGroup as RadioGroupPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 RadioGroup (styled copy)
//
// 이 파일은 `src/components/ui/radio-group.tsx`(shadcn 갓 다운로드 바닐라 원본)를 **그대로 복사**한 것으로,
// 원본과의 유일한 차이는 아래 className(스타일 정의)뿐이다. 함수 셸(RadioGroup·RadioGroupItem·data-slot·
// Indicator·props·export)은 원본과 100% 동일하게 유지한다.
//
// 책임 분리:
//   • ui/radio-group.tsx (원본) … 동작·접근성·라이브러리 업데이트를 책임진다. 손대지 않는다(항상 재다운로드 가능).
//   • kit/radio-group.tsx (복사본) … 스타일(className)만 프로젝트 Figma 값으로 책임진다.
//   • 화면·도메인 코드는 항상 이 파일(@/components/kit/radio-group)을 import 한다([SC-04]).
//
// Figma 반영(checkbox 와 동일 체계):
//   • 크기 size-6(24px)·rounded-full, 내부 점 size-2.5.
//   • 색은 전용 radio 토큰에 연결 — 체크됨 border/bg-radio-checked, 비활성 border-radio-disabled-border·
//     bg-radio-disabled-fill(회색 원), 비활성 점 bg-radio-disabled-border.
//   • dark: 수동 분기는 두지 않는다(토큰이 .dark 에서 자동 반사, [PB-06]).
// ─────────────────────────────────────────────────────────────────────────────
function RadioGroup({className, ...props}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid w-full gap-2', className)} {...props} />
    )
}

function RadioGroupItem({className, ...props}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                'group/radio-group-item peer border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-radio-checked data-checked:border-radio-checked data-checked:bg-radio-checked data-checked:text-primary-foreground disabled:border-radio-disabled-border disabled:bg-radio-disabled-fill relative flex aspect-square size-6 shrink-0 rounded-full border outline-none after:absolute after:-inset-x-3 after:-inset-y-3 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-100 aria-invalid:ring-3',
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="flex size-6 items-center justify-center"
            >
                <span className="bg-primary-foreground group-data-[disabled]/radio-group-item:bg-radio-disabled-border absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
}

export {RadioGroup, RadioGroupItem}
