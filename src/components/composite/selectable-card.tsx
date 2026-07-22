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
    selectableCardTitleVariants,
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
    const control = props.control ?? 'checkbox'
    const generatedId = useId()
    const controlId = id ?? generatedId
    const labelId = `${controlId}-label`
    const badgesId = `${controlId}-badges`

    return (
        <FieldLabel
            data-slot="selectable-card"
            data-disabled={disabled || undefined}
            className={selectableCardVariants({
                disabled: Boolean(disabled),
                control,
                className,
            })}
        >
            {/* Figma 선택 카드 — 뱃지와 라벨이 왼쪽에 오고 선택 컨트롤이 카드 오른쪽 끝에 붙는다.
                DOM 순서(뱃지 → 라벨 → 컨트롤) = 시각 순서라 읽기 순서도 일치한다([7.3.1]).
                뱃지는 항목의 성격(필수·선택)을 알려주므로 접근 가능한 이름에도 라벨과 함께 넣는다. */}
            <Field orientation="horizontal" className={selectableCardFieldClassName}>
                {badges ? (
                    <span id={badgesId} className={selectableCardBadgesClassName}>
                        {badges}
                    </span>
                ) : null}
                <FieldContent className={selectableCardContentClassName}>
                    <span
                        id={labelId}
                        data-slot="selectable-card-title"
                        className={cn(selectableCardTitleVariants({control}), labelClassName)}
                    >
                        {children}
                    </span>
                </FieldContent>
                {props.control === 'radio' ? (
                    <RadioGroupItem
                        id={controlId}
                        value={props.value}
                        disabled={disabled}
                        aria-labelledby={badges ? `${badgesId} ${labelId}` : labelId}
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
                        aria-labelledby={badges ? `${badgesId} ${labelId}` : labelId}
                        className={selectableCardControlClassName}
                    />
                )}
            </Field>
        </FieldLabel>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
