'use client'

import {useId, type ComponentProps, type ReactNode} from 'react'
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

const SelectableCardGroup = (props: ComponentProps<typeof RadioGroup>) => <RadioGroup {...props} />

type SelectableCardBaseProps = {
    disabled?: boolean
    badges?: ReactNode
    labelClassName?: string
    id?: string
    className?: string
    children: ReactNode
}

type SelectableCardRadioProps = SelectableCardBaseProps & {
    control: 'radio'
    value: string
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

const SelectableCard = (props: SelectableCardProps) => {
    const {disabled, badges, labelClassName, id, className, children} = props
    const generatedId = useId()
    const controlId = id ?? generatedId
    const labelId = `${controlId}-label`

    return (
        <FieldLabel
            data-slot="selectable-card"
            data-disabled={disabled || undefined}
            className={selectableCardVariants({
                disabled: Boolean(disabled),
                className,
            })}
        >
            <Field orientation="horizontal" className={selectableCardFieldClassName}>
                {props.control === 'radio' ? (
                    <RadioGroupItem
                        id={controlId}
                        value={props.value}
                        disabled={disabled}
                        aria-labelledby={labelId}
                        className={selectableCardControlClassName}
                    />
                ) : (
                    <Checkbox
                        id={controlId}
                        name={props.name}
                        value={props.value}
                        checked={props.checked}
                        onCheckedChange={props.onCheckedChange}
                        required={props.required}
                        form={props.form}
                        disabled={disabled}
                        aria-labelledby={labelId}
                        className={selectableCardControlClassName}
                    />
                )}
                <FieldContent className={selectableCardContentClassName}>
                    <span id={labelId} className={cn(selectableCardTitleClassName, labelClassName)}>
                        {children}
                    </span>
                </FieldContent>
                {badges ? <span className={selectableCardBadgesClassName}>{badges}</span> : null}
            </Field>
        </FieldLabel>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
