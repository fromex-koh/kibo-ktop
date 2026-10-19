'use client'

import type {ComponentProps, ReactNode} from 'react'
import {RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import {
    radioChipClassName,
    radioChipDescriptionClassName,
    radioChipGroupClassName,
    radioChipTitleClassName,
} from '@/components/theme/radio-chip.variants'
import {cn} from '@/lib/utils'

// 라디오 칩(RadioChip) — 제목과 설명을 가운데 정렬로 담은 선택 상자. 여럿 중 하나를 골라 값으로 제출한다.
//
// 언제 쓰나: 제목 + 설명 한두 줄짜리 선택지. 한 줄 값은 Chip(ChipRadio), 배지 · 일러스트가 있으면 RadioCard.
// 상태: 선택 = RadioChipGroup 의 value · defaultValue, 비활성 = RadioChip(한 칩) 또는 RadioChipGroup(전체)의 disabled.
//   상태별 모양은 theme/radio-chip.variants.ts 에 있다.
// 접근성: 화살표 키 이동 · 하나만 선택 · 묶음 안 Tab 한 번은 Radix RadioGroup 이 처리한다[6.1.1].
//   묶음 이름은 사용처에서 aria-label 또는 aria-labelledby 로 준다[7.4.1].
// 주의: title · description 에는 span 만 넣는다. 칩이 <button> 이라 p · div 를 넣을 수 없다[8.1.1].

const RadioChipGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root
        data-slot="radio-chip-group"
        className={cn(radioChipGroupClassName, className)}
        {...props}
    />
)

type RadioChipProps = {
    // 칩 제목. 라디오의 접근 이름이 된다.
    title: ReactNode
    // 제목 아래 설명. 문장별 줄바꿈이 필요하면 ReactNode 로 넘긴다.
    description?: ReactNode
} & ComponentProps<typeof RadioGroupPrimitive.Item>

const RadioChip = ({title, description, className, ...props}: RadioChipProps) => (
    <RadioGroupPrimitive.Item data-slot="radio-chip" className={cn(radioChipClassName, className)} {...props}>
        <span data-slot="radio-chip-title" className={radioChipTitleClassName}>
            {title}
        </span>
        {description != null ? (
            <span data-slot="radio-chip-description" className={radioChipDescriptionClassName}>
                {description}
            </span>
        ) : null}
    </RadioGroupPrimitive.Item>
)

export {RadioChip, RadioChipGroup}
export type {RadioChipProps}
