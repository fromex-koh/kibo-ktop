'use client'

import {useId, useRef, type ComponentProps, type PointerEvent, type ReactNode} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
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
    // 카드 클릭 시 실행한다. 선택값 변경 여부와 관계없이 호출된다(이미 고른 카드를 다시 눌러도).
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
    const controlRef = useRef<HTMLButtonElement>(null)

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const controlElement = controlRef.current
        if (!controlElement) return

        // 실제 컨트롤과 링크 등은 자체 동작을 유지하고, 카드의 빈 영역만 컨트롤 클릭으로 전달한다.
        if (event.target instanceof Node && controlElement.contains(event.target)) return
        if (event.target instanceof Element && event.target.closest('a, button, input, select, textarea')) return
        controlElement.click()
    }
    const control = props.control ?? 'checkbox'
    const generatedId = useId()
    const controlId = id ?? generatedId
    const labelId = `${controlId}-label`
    const badgesId = `${controlId}-badges`

    return (
        <div
            data-slot="selectable-card"
            data-disabled={disabled || undefined}
            onPointerUp={handlePointerUp}
            className={selectableCardVariants({
                disabled: Boolean(disabled),
                control,
                className,
            })}
        >
            {/* 컨트롤·라벨·뱃지를 aria-labelledby로 연결해 카드의 접근 가능한 이름을 구성한다. */}
            <span
                role="group"
                data-orientation="horizontal"
                data-slot="field"
                className={cn(
                    'flex w-full flex-row gap-2',
                    selectableCardFieldClassName,
                    control === 'checkbox' && selectableCardCheckboxFieldClassName,
                )}
            >
                {props.control === 'radio' ? (
                    <RadioGroupItem
                        ref={controlRef}
                        id={controlId}
                        value={props.value}
                        disabled={disabled}
                        onClick={onClick}
                        aria-labelledby={badges ? `${labelId} ${badgesId}` : labelId}
                        className={selectableCardControlClassName}
                    />
                ) : (
                    <Checkbox
                        ref={controlRef}
                        id={controlId}
                        name={props.name}
                        value={props.value}
                        checked={props.checked}
                        defaultChecked={props.defaultChecked}
                        onCheckedChange={props.onCheckedChange}
                        required={props.required}
                        form={props.form}
                        disabled={disabled}
                        onClick={onClick}
                        aria-labelledby={badges ? `${labelId} ${badgesId}` : labelId}
                        className={selectableCardControlClassName}
                    />
                )}
                <span
                    data-slot="field-content"
                    className={cn(
                        'flex flex-1 flex-col gap-0.5 leading-snug',
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
                </span>
                {badges ? (
                    <span id={badgesId} className={selectableCardBadgesClassName}>
                        {badges}
                    </span>
                ) : null}
            </span>
        </div>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
