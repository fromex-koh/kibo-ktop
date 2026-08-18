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

// 라디오 칩(RadioChip) — 제목과 설명을 가운데 정렬로 담은 낮은 선택 상자. Figma "진행할 업무 선택" 반영.
// 고른 칩만 파란 테두리 + 파란 글자로 남는다.
//
// 작은 칩(composite/chip 의 ChipRadio)과 나누어 둔 이유 — 그쪽은 한 줄짜리 값 하나를 고르는 컨트롤이고,
// 이쪽은 제목 아래 설명 한두 줄이 붙는 큰 선택지다. 색 규칙은 같지만 담는 내용과 크기가 다르다.
// 카드(RadioCard)와도 다르다 — 배지·일러스트 없이 글만 놓이고 높이가 낮다.
//
// 동작·접근성은 Radix RadioGroup 이 갖는다 — 화살표 키 이동, 하나만 선택, 그룹 안에서 탭 한 번[6.1.1].
// 그룹 이름은 사용처에서 aria-label 이나 aria-labelledby 로 준다[7.4.1].
//
// 칩 안을 모두 span 으로 두는 이유 — Radix 가 칩을 <button role="radio"> 로 그리는데, 버튼 안에는
// p·div 같은 블록 요소를 넣을 수 없다(HTML 중첩 규칙[8.1.1]).

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
