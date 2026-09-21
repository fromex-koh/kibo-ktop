'use client'

import type {ComponentProps} from 'react'
import {RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import {cn} from '@/lib/utils'

// 선택 정보 카드 — 항목 이름 · 값 몇 줄로 된 카드 여러 장 중 하나를 고르는 목록이다(K-BIGx 기업혁신성장의 검색된 기업 · 특허).
// 카드는 라디오 한 개다: 흰 면 · 테두리 1 · 반경 12 · 여백 24, 고르면 테두리만 primary 로 바뀐다. 동그라미 표시는 없다.
// 선택 · 방향키 이동 · 이름 전달은 Radix RadioGroup 이 맡는다[8.2.1]. 카드 안 글이 곧 그 라디오의 이름이다.
//
// 항목 이름은 줄바꿈하지 않고, 값은 남은 폭에서 오른쪽 정렬로 낱말(띄어쓰기 · 하이픈) 단위로 줄바꿈한다 — 번호가 글자
// 중간에서 끊기지 않는다. 띄어쓰기 없이 한 칸보다 긴 값(긴 기업명 · 코드)만 넘치는 자리에서 끊어 카드 밖으로 나가지 않게 한다(wrap-anywhere).
// 목록은 1열(모바일) → 2열(md 이상), 카드 사이 24 다.

type SelectableInfoCardField = {
    label: string
    value: string
}

const SelectableInfoCardGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root
        data-slot="selectable-info-card-group"
        className={cn('grid grid-cols-1 gap-6 md:grid-cols-2', className)}
        {...props}
    />
)

type SelectableInfoCardProps = Omit<ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'> & {
    /** 카드의 줄 — 왼쪽 항목 이름(16 Regular gray.600), 오른쪽 값(16 Medium gray.700). */
    fields: readonly SelectableInfoCardField[]
}

const SelectableInfoCard = ({fields, className, ...props}: SelectableInfoCardProps) => (
    <RadioGroupPrimitive.Item
        data-slot="selectable-info-card"
        className={cn(
            'border-subtle-3 bg-card data-[state=checked]:border-primary interactive:hover:border-primary focus-visible:outline-ring outline-ring flex w-full cursor-pointer flex-col gap-3 rounded-md border p-6 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    >
        {fields.map((field) => (
            <span key={field.label} className="typo-body-xl-regular flex justify-between gap-4">
                <span className="text-foreground-subtle shrink-0">{field.label}</span>
                <span className="typo-body-xl-medium text-label-foreground min-w-0 text-end wrap-anywhere break-keep">
                    {field.value}
                </span>
            </span>
        ))}
    </RadioGroupPrimitive.Item>
)

export {SelectableInfoCard, SelectableInfoCardGroup}
export type {SelectableInfoCardField, SelectableInfoCardProps}
