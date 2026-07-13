'use client'

import type {ComponentProps} from 'react'
import {RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import {cn} from '@/lib/utils'

// 칩(Chip) — 폼 값으로 제출되는 카드형 라디오 선택 컨트롤(L2 composite). Figma "chip_single" 반영.
// 겉모습은 칩(박스 전체가 컨트롤)이지만 속은 Radix RadioGroup 이라, 그룹에 name 을 주면 선택값이
// hidden input 으로 실려 네이티브 폼 제출된다(별도 상태 없이 name + defaultValue 만으로 제출 가능).
// role=radio·화살표 키·단일 선택은 radix 가 처리한다. (버튼 툴바인 ToggleGroup 은 폼 미연동이라 안 쓴다.)
//
// 상태색(Figma): 미선택 = 흰 배경·border-input·label-foreground(Regular),
//   선택 = border-chip-checked(blue.500)·text-primary(blue.600, Bold), 비활성 = bg-muted + 흐림.
// data-checked = radix data-state=checked (shadcn/tailwind.css 커스텀 변형). 선택 테두리는 Figma 그대로
// chip-checked(blue.500) 컴포넌트 시맨틱 토큰(radio-checked 와 동일 계열).

// 칩 박스 스타일.
const chipClassName = cn(
    'text-label-foreground border-input bg-surface inline-flex h-control-h-lg cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-base font-normal whitespace-nowrap transition-colors outline-none',
    'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted',
    'data-checked:border-chip-checked data-checked:text-primary data-checked:font-bold',
    'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
)

// 라디오 칩 그룹 — name 을 주면 선택값이 hidden input 으로 폼에 제출된다. 화살표 키·단일 선택은 radix 처리.
const ChipRadioGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root
        data-slot="chip-radio-group"
        className={cn('flex w-fit flex-wrap gap-2', className)}
        {...props}
    />
)

const ChipRadio = ({className, children, ...props}: ComponentProps<typeof RadioGroupPrimitive.Item>) => (
    <RadioGroupPrimitive.Item data-slot="chip-radio" className={cn(chipClassName, className)} {...props}>
        {children}
    </RadioGroupPrimitive.Item>
)

export {ChipRadioGroup, ChipRadio}
