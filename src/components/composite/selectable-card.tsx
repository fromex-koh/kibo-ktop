'use client'

import type {ComponentProps, ReactNode} from 'react'
import {createContext, useContext, useState} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldContent, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {
    selectableCardBadgesClassName,
    selectableCardContentClassName,
    selectableCardControlClassName,
    selectableCardFieldClassName,
    selectableCardTitleClassName,
    selectableCardVariants,
} from '@/components/theme/selectable-card.variants'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn Choice Card 패턴(FieldLabel > Field + Radio/Checkbox)을 프로젝트 선택 카드로 조합한다.
// PROJECT-STYLE: 카드와 상태 스타일은 theme/selectable-card.variants.ts에서 관리한다.

type SelectableCardGroupAccessibleName =
    {'aria-label': string; 'aria-labelledby'?: never} | {'aria-label'?: never; 'aria-labelledby': string}

type SelectableCardGroupProps = Omit<ComponentProps<typeof RadioGroup>, 'name' | 'aria-label' | 'aria-labelledby'> & {
    name: string
} & SelectableCardGroupAccessibleName

type SelectableCardGroupContextValue = {
    value: string | undefined
    name: string
    form: string | undefined
}

const SelectableCardValueContext = createContext<SelectableCardGroupContextValue | undefined>(undefined)

const SelectableCardGroup = ({
    value,
    defaultValue,
    onValueChange,
    name,
    form,
    children,
    ...props
}: SelectableCardGroupProps) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const currentValue = value ?? internalValue

    const handleValueChange = (nextValue: string) => {
        if (value === undefined) setInternalValue(nextValue)
        onValueChange?.(nextValue)
    }

    return (
        <SelectableCardValueContext.Provider value={{value: currentValue, name, form}}>
            <RadioGroup value={currentValue} onValueChange={handleValueChange} name={name} form={form} {...props}>
                {children}
            </RadioGroup>
        </SelectableCardValueContext.Provider>
    )
}

type SelectableCardBaseProps = {
    disabled?: boolean
    readOnly?: boolean
    badges?: ReactNode
    labelClassName?: string
    id?: string
    className?: string
    children: ReactNode
}

type SelectableCardRadioProps = SelectableCardBaseProps & {
    control: 'radio'
    value: string
    checked?: never
    onCheckedChange?: never
    name?: never
    required?: never
    form?: never
}

type SelectableCardCheckboxProps = SelectableCardBaseProps & {
    control?: 'checkbox'
    value?: string
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    name?: string
    required?: boolean
    form?: string
}

type SelectableCardProps = SelectableCardRadioProps | SelectableCardCheckboxProps

const SelectableCard = ({
    control = 'checkbox',
    value,
    checked,
    onCheckedChange,
    name,
    required,
    form,
    disabled,
    readOnly,
    badges,
    labelClassName,
    id,
    className,
    children,
}: SelectableCardProps) => {
    const group = useContext(SelectableCardValueContext)

    if (control === 'radio' && value === undefined) {
        throw new Error('SelectableCard의 radio control에는 value가 필요합니다.')
    }

    const radioValue = value ?? ''
    const selected = control === 'radio' ? group?.value === value : Boolean(checked)
    const locked = Boolean(disabled || readOnly)
    const visualSelected = selected && !locked
    const lockedSelected = selected && locked
    const controlTabIndex = readOnly ? -1 : undefined

    return (
        <FieldLabel
            data-slot="selectable-card"
            data-selected={visualSelected || undefined}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
            className={selectableCardVariants({
                selected: visualSelected,
                unselected: !visualSelected && !lockedSelected,
                locked,
                lockedSelected,
                disabled: Boolean(disabled),
                readOnly: Boolean(readOnly),
                className,
            })}
        >
            <Field orientation="horizontal" className={selectableCardFieldClassName}>
                {control === 'radio' ? (
                    <>
                        <RadioGroupItem
                            id={id}
                            value={radioValue}
                            disabled={disabled || readOnly}
                            tabIndex={controlTabIndex}
                            className={selectableCardControlClassName}
                        />
                        {readOnly && selected && group ? (
                            <input type="hidden" name={group.name} value={radioValue} form={group.form} />
                        ) : null}
                    </>
                ) : (
                    <>
                        <Checkbox
                            id={id}
                            name={name}
                            value={value}
                            checked={checked}
                            onCheckedChange={onCheckedChange}
                            required={required}
                            form={form}
                            disabled={disabled || readOnly}
                            tabIndex={controlTabIndex}
                            className={selectableCardControlClassName}
                        />
                        {readOnly && checked && name ? (
                            <input type="hidden" name={name} value={value ?? 'on'} form={form} />
                        ) : null}
                    </>
                )}
                <FieldContent className={selectableCardContentClassName}>
                    <span className={cn(selectableCardTitleClassName, labelClassName)}>{children}</span>
                </FieldContent>
                {badges ? <span className={selectableCardBadgesClassName}>{badges}</span> : null}
            </Field>
        </FieldLabel>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardGroupProps, SelectableCardProps}
