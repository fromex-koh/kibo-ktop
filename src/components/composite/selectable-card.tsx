'use client'

import type {ComponentProps, ReactNode} from 'react'
import {createContext, useContext} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: kit Radio/Checkbox primitive를 카드형 선택 패턴으로 조합한다.
// 카드 전체가 label 역할을 하고, 선택 강조는 CSS :has() 대신 React 상태(data-selected)로 안정적으로 표시한다.
// PROJECT-STYLE: selected는 primary/primary-subtle, disabled/readOnly는 공통 disabled 토큰을 쓴다.
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
        // htmlFor를 두면 감싸기+for 연결이 겹쳐 토글이 두 번 발생한다.
        <label
            data-slot="selectable-card"
            data-selected={visualSelected || undefined}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
            className={cn(
                'bg-surface flex cursor-pointer items-center gap-2 rounded-lg border-2 px-10 py-6 transition-colors',
                !visualSelected && !lockedSelected && 'border-transparent',
                visualSelected && 'border-primary bg-primary-subtle',
                locked && 'bg-control-disabled text-disabled opacity-100',
                lockedSelected && 'border-disabled-subtle',
                disabled && 'cursor-not-allowed',
                readOnly && 'pointer-events-none cursor-default',
                // 내부 컨트롤 포커스는 카드 전체 링으로 표시한다.
                'has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid',
                className,
            )}
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
            <span className={cn('typo-title-l-bold flex-1 text-current', labelClassName)}>{children}</span>
            {badges ? <span className="flex shrink-0 items-center gap-2">{badges}</span> : null}
        </label>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
