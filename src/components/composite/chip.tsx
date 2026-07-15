'use client'

import type {ComponentProps} from 'react'
import {Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import {cva, type VariantProps} from 'class-variance-authority'
import {CheckIcon} from 'lucide-react'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn에는 Chip primitive가 없으므로 Radix RadioGroup/Checkbox primitive를 조합해
// Figma selectable chip 패턴으로 제공한다. 동작/접근성은 Radix가 담당하고, 이 파일은 프로젝트 API와 스타일 조합을 책임진다.
// PROJECT-STYLE: 기본 border는 공통 control 슬롯, selected는 primary/primary-strong, disabled는 공통 disabled 토큰을 쓴다.
// Checkbox 아이콘은 text-current로 라벨 색상을 상속해 selected/disabled 상태와 함께 변한다.

const chipVariants = cva(
    'text-label-foreground border-control bg-surface inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-base font-normal whitespace-nowrap transition-colors outline-none',
    {
        variants: {
            size: {
                large: 'h-control-h-lg',
                medium: 'h-control-h-md',
            },
        },
        defaultVariants: {
            size: 'large',
        },
    },
)

const chipStateClassName = cn(
    'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted',
    'data-checked:border-2 data-checked:border-primary data-checked:text-primary-strong data-checked:font-bold',
    'disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100',
)

const ChipRadioGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root
        data-slot="chip-radio-group"
        className={cn('flex w-fit flex-wrap gap-2', className)}
        {...props}
    />
)

const ChipRadio = ({
    className,
    size = 'large',
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item> & VariantProps<typeof chipVariants>) => (
    <RadioGroupPrimitive.Item
        data-slot="chip-radio"
        className={cn(chipVariants({size}), chipStateClassName, className)}
        {...props}
    />
)

const ChipCheckboxGroup = ({className, ...props}: ComponentProps<'div'>) => (
    <div
        data-slot="chip-checkbox-group"
        role="group"
        className={cn('flex w-fit flex-wrap gap-2', className)}
        {...props}
    />
)

const ChipCheckbox = ({
    className,
    children,
    size = 'large',
    ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof chipVariants>) => (
    <CheckboxPrimitive.Root
        data-slot="chip-checkbox"
        className={cn(chipVariants({size}), chipStateClassName, 'justify-between px-6', className)}
        {...props}
    >
        <span className="flex-1 text-left">{children}</span>
        <CheckboxPrimitive.Indicator data-slot="chip-checkbox-indicator" className="shrink-0 text-current">
            <CheckIcon aria-hidden="true" strokeWidth={3} className="size-4" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
)

export {ChipRadioGroup, ChipRadio, ChipCheckboxGroup, ChipCheckbox}
