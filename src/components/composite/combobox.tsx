'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {useId, useState} from 'react'
import {ChevronDownIcon} from 'lucide-react'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command'
import {InputGroup} from '@/components/ui/input-group'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
    comboboxDisabledValueClassName,
    comboboxGroupClassName,
    comboboxIconClassName,
    comboboxPlaceholderClassName,
    comboboxTriggerClassName,
    comboboxValueClassName,
} from '@/components/theme/combobox.variants'
import {cn} from '@/lib/utils'

type ComboboxOption = {value: string; label: string}

type ComboboxProps = {
    options: ComboboxOption[]
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
} & Pick<ComponentPropsWithoutRef<'button'>, 'aria-invalid' | 'aria-describedby'>

const Combobox = ({
    options,
    value,
    onValueChange,
    placeholder = '선택하세요',
    searchPlaceholder = '검색...',
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
    const [open, setOpen] = useState(false)
    const listId = useId()
    const selected = options.find((option) => option.value === value)

    return (
        <>
            <Popover open={open} onOpenChange={(next) => !readOnly && setOpen(next)}>
                <InputGroup className={cn(comboboxGroupClassName, className)}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            id={id}
                            role="combobox"
                            aria-expanded={open}
                            aria-controls={listId}
                            aria-haspopup="listbox"
                            aria-readonly={readOnly || undefined}
                            disabled={disabled}
                            data-slot="input-group-control"
                            data-readonly={readOnly || undefined}
                            className={comboboxTriggerClassName}
                            {...props}
                        >
                            <span
                                className={cn(
                                    selected ? comboboxValueClassName : comboboxPlaceholderClassName,
                                    disabled && comboboxDisabledValueClassName,
                                )}
                            >
                                {selected ? selected.label : placeholder}
                            </span>
                            <ChevronDownIcon aria-hidden="true" className={comboboxIconClassName} />
                        </button>
                    </PopoverTrigger>
                </InputGroup>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Command
                        filter={(itemValue, search) => (itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
                    >
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList id={listId}>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        data-checked={value === option.value}
                                        onSelect={() => {
                                            onValueChange?.(option.value)
                                            setOpen(false)
                                        }}
                                    >
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {name ? (
                <input
                    type="hidden"
                    name={name}
                    form={form}
                    required={required}
                    disabled={disabled}
                    value={value ?? ''}
                />
            ) : null}
        </>
    )
}

export {Combobox}
export type {ComboboxProps, ComboboxOption}
