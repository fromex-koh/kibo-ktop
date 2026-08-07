'use client'

import {useId, type ComponentProps, type ReactNode} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldContent, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {
    selectableCardBadgesClassName,
    selectableCardCheckboxContentClassName,
    selectableCardCheckboxFieldClassName,
    selectableCardContentClassName,
    selectableCardControlClassName,
    selectableCardFieldClassName,
    selectableCardTitleVariants,
    selectableCardVariants,
} from '@/components/theme/selectable-card.variants'
import {cn} from '@/lib/utils'

// 라디오·체크박스 컨트롤과 라벨·뱃지를 하나의 선택 카드로 제공한다.
// 카드와 상태 스타일은 theme/selectable-card.variants.ts에서 관리한다.

const SelectableCardGroup = (props: ComponentProps<typeof RadioGroup>) => <RadioGroup {...props} />

type SelectableCardBaseProps = {
    disabled?: boolean
    badges?: ReactNode
    labelClassName?: string
    id?: string
    className?: string
    children: ReactNode
    // 카드 클릭 시 실행한다. 선택값 변경 여부와 관계없이 호출된다.
    onClick?: () => void
}

type SelectableCardRadioProps = SelectableCardBaseProps & {
    control: 'radio'
    value: string
}

type SelectableCardCheckboxProps = SelectableCardBaseProps & {
    control?: 'checkbox'
    value?: string
    checked?: boolean
    // 비제어 방식의 초기 선택 상태.
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    name?: string
    required?: boolean
    form?: string
}

type SelectableCardProps = SelectableCardRadioProps | SelectableCardCheckboxProps

const SelectableCard = (props: SelectableCardProps) => {
    const {disabled, badges, labelClassName, id, className, children, onClick} = props
    const control = props.control ?? 'checkbox'
    const generatedId = useId()
    const controlId = id ?? generatedId
    const labelId = `${controlId}-label`
    const badgesId = `${controlId}-badges`

    return (
        <FieldLabel
            data-slot="selectable-card"
            data-disabled={disabled || undefined}
            onClick={onClick}
            className={selectableCardVariants({
                disabled: Boolean(disabled),
                control,
                className,
            })}
        >
            {/* 컨트롤·라벨·뱃지를 aria-labelledby로 연결해 카드의 접근 가능한 이름을 구성한다. */}
            <Field
                orientation="horizontal"
                className={cn(
                    selectableCardFieldClassName,
                    control === 'checkbox' && selectableCardCheckboxFieldClassName,
                )}
            >
                {props.control === 'radio' ? (
                    <RadioGroupItem
                        id={controlId}
                        value={props.value}
                        disabled={disabled}
                        aria-labelledby={badges ? `${labelId} ${badgesId}` : labelId}
                        className={selectableCardControlClassName}
                    />
                ) : (
                    <Checkbox
                        id={controlId}
                        name={props.name}
                        value={props.value}
                        checked={props.checked}
                        defaultChecked={props.defaultChecked}
                        onCheckedChange={props.onCheckedChange}
                        required={props.required}
                        form={props.form}
                        disabled={disabled}
                        aria-labelledby={badges ? `${labelId} ${badgesId}` : labelId}
                        className={selectableCardControlClassName}
                    />
                )}
                <FieldContent
                    className={cn(
                        selectableCardContentClassName,
                        control === 'checkbox' && selectableCardCheckboxContentClassName,
                    )}
                >
                    <span
                        id={labelId}
                        data-slot="selectable-card-title"
                        className={cn(selectableCardTitleVariants({control}), labelClassName)}
                    >
                        {children}
                    </span>
                </FieldContent>
                {badges ? (
                    <span id={badgesId} className={selectableCardBadgesClassName}>
                        {badges}
                    </span>
                ) : null}
            </Field>
        </FieldLabel>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
