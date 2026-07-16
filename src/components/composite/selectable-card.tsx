'use client'

import type {ComponentProps, ReactNode} from 'react'
import {createContext, useContext} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldContent, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn Choice Card 패턴(FieldLabel > Field + Radio/Checkbox)을 프로젝트 선택 카드로 조합한다.
// PROJECT-STYLE: FieldLabel 기본 카드 selector를 덮고 기존 padding/border와 프로젝트 상태 토큰을 유지한다.
// selected는 primary/primary-subtle, disabled/readOnly는 공통 disabled 토큰을 쓴다.
// disabled/readOnly에서도 선택된 카드만 border를 보이고, 미선택 카드는 border를 숨긴다.

const SelectableCardValueContext = createContext<string | undefined>(undefined)

const SelectableCardGroup = ({value, children, ...props}: ComponentProps<typeof RadioGroup>) => (
    <SelectableCardValueContext.Provider value={typeof value === 'string' ? value : undefined}>
        <RadioGroup value={value} {...props}>
            {children}
        </RadioGroup>
    </SelectableCardValueContext.Provider>
)

type SelectableCardProps = {
    control?: 'radio' | 'checkbox'
    value?: string
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    name?: string
    disabled?: boolean
    readOnly?: boolean
    badges?: ReactNode
    labelClassName?: string
    id?: string
    className?: string
    children: ReactNode
}

const SelectableCard = ({
    control = 'checkbox',
    value,
    checked,
    onCheckedChange,
    name,
    disabled,
    readOnly,
    badges,
    labelClassName,
    id,
    className,
    children,
}: SelectableCardProps) => {
    const groupValue = useContext(SelectableCardValueContext)
    const selected = control === 'radio' ? groupValue !== undefined && groupValue === value : Boolean(checked)
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
            className={cn(
                'bg-surface flex cursor-pointer items-center gap-2 rounded-lg border-2 px-10 py-6 transition-colors has-[>[data-slot=field]]:border-2 *:data-[slot=field]:p-0',
                !visualSelected && !lockedSelected && 'border-transparent',
                visualSelected &&
                    'border-primary bg-primary-subtle has-data-checked:border-primary has-data-checked:bg-primary-subtle dark:has-data-checked:border-primary dark:has-data-checked:bg-primary-subtle',
                locked && 'bg-control-disabled text-disabled opacity-100',
                lockedSelected &&
                    'border-disabled-subtle has-data-checked:border-disabled-subtle has-data-checked:bg-control-disabled dark:has-data-checked:border-disabled-subtle dark:has-data-checked:bg-control-disabled',
                disabled && 'cursor-not-allowed',
                readOnly && 'pointer-events-none cursor-default',
                // 내부 컨트롤 포커스는 카드 전체 링으로 표시한다.
                'has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid',
                className,
            )}
        >
            <Field
                orientation="horizontal"
                className="items-center gap-2 has-[>[data-slot=field-content]]:items-center"
            >
                {control === 'radio' ? (
                    <RadioGroupItem
                        id={id}
                        value={value ?? ''}
                        disabled={disabled || readOnly}
                        tabIndex={controlTabIndex}
                        className="focus-visible:outline-none"
                    />
                ) : (
                    <Checkbox
                        id={id}
                        name={name}
                        value={value}
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                        disabled={disabled || readOnly}
                        tabIndex={controlTabIndex}
                        className="focus-visible:outline-none"
                    />
                )}
                <FieldContent className="gap-0">
                    <span className={cn('typo-title-l-bold text-current', labelClassName)}>{children}</span>
                </FieldContent>
                {badges ? <span className="flex shrink-0 items-center gap-2">{badges}</span> : null}
            </Field>
        </FieldLabel>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
