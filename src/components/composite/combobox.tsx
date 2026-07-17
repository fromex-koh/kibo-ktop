'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {
    Combobox as PrimitiveCombobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from '@/components/ui/combobox'
import {
    comboboxDropdownSearchClassName,
    comboboxDropdownContentClassName,
    comboboxDropdownTriggerClassName,
    comboboxInputClassName,
    comboboxItemClassName,
} from '@/components/theme/combobox.variants'
import {cn} from '@/lib/utils'

type ComboboxOption = {value: string; label: string}

type ComboboxProps = {
    options: ComboboxOption[]
    type?: 'input' | 'dropdown'
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    disabled?: boolean
    readOnly?: boolean
    id?: string
    name?: string
    form?: string
    required?: boolean
    className?: string
} & Pick<ComponentPropsWithoutRef<'input'>, 'aria-invalid' | 'aria-describedby'>

// PROJECT-COMPOSITE: shadcn Combobox primitive를 기존 단일 선택 API로 제공하는 호환 wrapper입니다.
// PROJECT-STYLE: 프로젝트 입력 스타일은 theme/combobox.variants.ts에서 관리합니다.
const Combobox = ({
    options,
    type = 'input',
    value,
    onValueChange,
    placeholder = '선택하세요',
    searchPlaceholder = '검색어를 입력하세요',
    emptyText = '결과가 없습니다.',
    disabled,
    readOnly,
    id,
    name,
    form,
    required,
    className,
    ...props
}: ComboboxProps) => {
    const selectedOption = options.find((option) => option.value === value)

    return (
        <PrimitiveCombobox
            items={options}
            value={value === undefined ? undefined : (selectedOption ?? null)}
            onValueChange={(option) => onValueChange?.(option?.value ?? '')}
            isItemEqualToValue={(option, selected) => option.value === selected.value}
            itemToStringLabel={(option) => option.label}
            itemToStringValue={(option) => option.value}
            name={name}
            form={form}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
        >
            {type === 'input' ? (
                <ComboboxInput
                    id={id}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(comboboxInputClassName, className)}
                    {...props}
                />
            ) : (
                <ComboboxTrigger
                    id={id}
                    disabled={disabled}
                    aria-invalid={props['aria-invalid']}
                    aria-describedby={props['aria-describedby']}
                    className={cn(comboboxDropdownTriggerClassName, className)}
                >
                    <ComboboxValue placeholder={placeholder} />
                </ComboboxTrigger>
            )}
            <ComboboxContent className={type === 'dropdown' ? comboboxDropdownContentClassName : undefined}>
                {type === 'dropdown' ? (
                    <ComboboxInput
                        showTrigger={false}
                        placeholder={searchPlaceholder}
                        disabled={disabled}
                        className={comboboxDropdownSearchClassName}
                    />
                ) : null}
                <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                <ComboboxList>
                    {(option: ComboboxOption) => (
                        <ComboboxItem key={option.value} value={option} className={comboboxItemClassName}>
                            {option.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </PrimitiveCombobox>
    )
}

export {Combobox}
export type {ComboboxProps, ComboboxOption}
