'use client'

import {useId, useRef, useState, type ChangeEvent, type ComponentPropsWithoutRef} from 'react'
import {Search, X} from 'lucide-react'
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from '@/components/ui/input-group'
import {
    searchBarAddonClassName,
    searchBarClearButtonClassName,
    searchBarGroupClassName,
    searchBarLabelClassName,
    searchBarSubmitButtonClassName,
} from '@/components/theme/search-bar.variants'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn InputGroup과 Button을 조합한 검색 입력입니다.
// PROJECT-STYLE: SearchBar 전용 레이아웃은 theme/search-bar.variants.ts에서 관리합니다.
type SearchBarProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'readOnly'> & {
    label: string
    searchLabel?: string
    clearLabel?: string
    inputClassName?: string
}

const SearchBar = ({
    id,
    label,
    className,
    inputClassName,
    searchLabel = '검색',
    clearLabel = '입력 지우기',
    onChange,
    disabled,
    form,
    value,
    defaultValue,
    ...props
}: SearchBarProps) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const inputRef = useRef<HTMLInputElement>(null)
    const [uncontrolledHasValue, setUncontrolledHasValue] = useState(() => Boolean(defaultValue))
    const hasValue = value !== undefined ? Boolean(value) : uncontrolledHasValue

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUncontrolledHasValue(event.currentTarget.value.length > 0)
        onChange?.(event)
    }

    const handleClear = () => {
        const input = inputRef.current
        if (!input) return
        const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        nativeValueSetter?.call(input, '')
        input.dispatchEvent(new Event('input', {bubbles: true}))
        setUncontrolledHasValue(false)
        input.focus()
    }

    return (
        <>
            <label htmlFor={inputId} className={searchBarLabelClassName}>
                {label}
            </label>
            <InputGroup className={cn(searchBarGroupClassName, className)}>
                <InputGroupInput
                    ref={inputRef}
                    id={inputId}
                    type="search"
                    onChange={handleChange}
                    value={value}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    form={form}
                    className={inputClassName}
                    {...props}
                />
                <InputGroupAddon align="inline-end" className={searchBarAddonClassName}>
                    {hasValue && !disabled ? (
                        <InputGroupButton
                            variant="ghost"
                            size="icon-sm"
                            className={searchBarClearButtonClassName}
                            aria-label={clearLabel}
                            onClick={handleClear}
                        >
                            <X aria-hidden="true" />
                        </InputGroupButton>
                    ) : null}
                    <InputGroupButton
                        type="submit"
                        form={form}
                        variant="default"
                        size="icon-sm"
                        className={searchBarSubmitButtonClassName}
                        aria-label={searchLabel}
                        disabled={disabled}
                    >
                        <Search aria-hidden="true" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </>
    )
}

export {SearchBar}

export type {SearchBarProps}
