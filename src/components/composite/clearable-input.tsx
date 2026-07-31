'use client'

import {useRef, useState, type ChangeEvent, type ComponentProps, type ReactNode} from 'react'
import {X} from 'lucide-react'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'
import {Icon} from '@/components/custom/icon'
import {
    clearableInputAddonClassName,
    clearableInputClearButtonClassName,
    clearableInputGroupClassName,
    clearableInputIconClassName,
} from '@/components/theme/clearable-input.variants'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: 시안 text_input 의 focused 상태에 있는 지우기 버튼을 담은 입력이다.
// Input 셸은 지우기 버튼을 알지 못하므로([SC-02] 구조 수정 금지) InputGroup 과 Button 을 조합한다.
// 지우기 버튼은 값이 있고 필드에 포커스가 있는 동안에만 보인다(표시 조건은 theme 의 variant 참고).
type ClearableInputProps = Omit<ComponentProps<'input'>, 'size'> & {
    /** 아이콘만 있는 버튼이라 대체 텍스트가 필요하다([5.1.1]) */
    clearLabel?: string
    /** 입력 요소에만 얹을 클래스 — 바깥 상자에는 className 을 쓴다 */
    inputClassName?: string
    /**
     * 지우기 버튼 오른쪽에 함께 놓을 애드온(검색 버튼·상태 아이콘 등).
     * 지우기와 달리 값·포커스와 무관하게 항상 보인다.
     */
    endAddon?: ReactNode
}

const ClearableInput = ({
    ref,
    className,
    inputClassName,
    endAddon,
    clearLabel = '입력 지우기',
    onChange,
    value,
    defaultValue,
    disabled,
    readOnly,
    ...props
}: ClearableInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uncontrolledHasValue, setUncontrolledHasValue] = useState(() => Boolean(defaultValue))
    const hasValue = value !== undefined ? Boolean(value) : uncontrolledHasValue

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUncontrolledHasValue(event.currentTarget.value.length > 0)
        onChange?.(event)
    }

    // 값을 지운 뒤 포커스를 입력으로 돌려준다 — 버튼이 사라지면서 포커스가 body 로 튀는 것을 막는다([8.2.1]).
    // React 가 관리하는 input 이라 value 를 직접 비우면 상태와 어긋나므로, 네이티브 setter 로 바꾸고
    // input 이벤트를 다시 쏘아 제어·비제어 두 경우 모두 onChange 가 정상적으로 흐르게 한다(SearchBar 와 동일).
    const handleClear = () => {
        const input = inputRef.current
        if (!input) return
        const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        nativeValueSetter?.call(input, '')
        input.dispatchEvent(new Event('input', {bubbles: true}))
        setUncontrolledHasValue(false)
        input.focus()
    }

    const canClear = hasValue && !disabled && !readOnly

    return (
        <InputGroup className={cn(clearableInputGroupClassName, className)}>
            <InputGroupInput
                // 지우기에 쓸 내부 ref 와 바깥에서 넘어온 ref 를 함께 채운다 — Input 이 ref 를 그대로 넘기므로
                // 바꿔 끼워도 사용처의 focus()·validity 검사가 그대로 동작해야 한다.
                ref={(node) => {
                    inputRef.current = node
                    if (typeof ref === 'function') ref(node)
                    else if (ref) ref.current = node
                }}
                onChange={handleChange}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                readOnly={readOnly}
                className={inputClassName}
                {...props}
            />
            {canClear || endAddon ? (
                <InputGroupAddon align="inline-end" className={clearableInputAddonClassName}>
                    {canClear ? (
                        <Button
                            variant="plain"
                            size="icon-sm"
                            className={clearableInputClearButtonClassName}
                            aria-label={clearLabel}
                            onClick={handleClear}
                        >
                            <Icon icon={X} variant="solid" className={clearableInputIconClassName} />
                        </Button>
                    ) : null}
                    {endAddon}
                </InputGroupAddon>
            ) : null}
        </InputGroup>
    )
}

export {ClearableInput}

export type {ClearableInputProps}
