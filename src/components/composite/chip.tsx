'use client'

import type {ComponentProps, ReactNode} from 'react'
import {Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import type {VariantProps} from 'class-variance-authority'
import {CheckIcon} from 'lucide-react'
import {
    chipCheckboxClassName,
    chipCheckboxContentClassName,
    chipCheckboxIconClassName,
    chipCheckboxIndicatorClassName,
    chipGroupClassName,
    chipStateClassName,
    chipVariants,
} from '@/components/theme/chip.variants'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn에는 Chip primitive가 없으므로 Radix RadioGroup/Checkbox primitive를 조합해
// Figma selectable chip 패턴으로 제공한다. 동작/접근성은 Radix가 담당하고, 이 파일은 프로젝트 API와 스타일 조합을 책임진다.
// PROJECT-STYLE: 프로젝트 스타일과 size variant는 theme/chip.variants.ts에서 관리한다.
const ChipRadioGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root data-slot="chip-radio-group" className={cn(chipGroupClassName, className)} {...props} />
)

const ChipRadio = ({
    className,
    size = 'lg',
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item> & VariantProps<typeof chipVariants>) => (
    <RadioGroupPrimitive.Item
        data-slot="chip-radio"
        className={cn(chipVariants({size}), chipStateClassName, className)}
        {...props}
    />
)

type ChipCheckboxGroupProps = Omit<ComponentProps<'fieldset'>, 'children'> & {
    children: ReactNode
    legend?: ReactNode
}

const ChipCheckboxGroup = ({
    className,
    children,
    legend,
    'aria-label': ariaLabel,
    ...props
}: ChipCheckboxGroupProps) => (
    <fieldset
        data-slot="chip-checkbox-group"
        className={cn('m-0 min-w-0 border-0 p-0', chipGroupClassName, className)}
        {...props}
    >
        <legend className="sr-only">{legend ?? ariaLabel ?? '항목 선택'}</legend>
        {children}
    </fieldset>
)

const ChipCheckbox = ({
    className,
    children,
    size = 'lg',
    ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof chipVariants>) => (
    <CheckboxPrimitive.Root
        data-slot="chip-checkbox"
        className={cn(chipVariants({size}), chipStateClassName, chipCheckboxClassName, className)}
        {...props}
    >
        <span className={chipCheckboxContentClassName}>{children}</span>
        <CheckboxPrimitive.Indicator data-slot="chip-checkbox-indicator" className={chipCheckboxIndicatorClassName}>
            <CheckIcon aria-hidden="true" strokeWidth={3} className={chipCheckboxIconClassName} />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
)

export {ChipRadioGroup, ChipRadio, ChipCheckboxGroup, ChipCheckbox}
export type {ChipCheckboxGroupProps}
