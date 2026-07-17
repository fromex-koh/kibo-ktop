'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {useRef, useState} from 'react'
import {format} from 'date-fns'
import {ko} from 'date-fns/locale'
import {CalendarIcon} from 'lucide-react'
import {Calendar} from '@/components/ui/calendar'
import {InputGroup} from '@/components/ui/input-group'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
    datePickerDisabledValueClassName,
    datePickerGroupClassName,
    datePickerIconClassName,
    datePickerPlaceholderClassName,
    datePickerTriggerClassName,
    datePickerValueClassName,
} from '@/components/theme/date-picker.variants'
import {cn} from '@/lib/utils'

type DatePickerProps = {
    value?: Date
    onChange?: (date?: Date) => void
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    id?: string
    name?: string
    form?: string
    required?: boolean
    onInvalid?: ComponentPropsWithoutRef<'input'>['onInvalid']
    className?: string
} & Pick<ComponentPropsWithoutRef<'button'>, 'aria-invalid' | 'aria-describedby'>

const DatePicker = ({
    value,
    onChange,
    placeholder = '연도-월-일',
    disabled,
    readOnly,
    id,
    name,
    form,
    required,
    onInvalid,
    className,
    ...props
}: DatePickerProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
        <>
            <Popover open={open} onOpenChange={(next) => !readOnly && setOpen(next)}>
                <InputGroup className={cn(datePickerGroupClassName, className)}>
                    <PopoverTrigger asChild>
                        <button
                            ref={triggerRef}
                            type="button"
                            id={id}
                            disabled={disabled}
                            data-slot="input-group-control"
                            data-readonly={readOnly || undefined}
                            className={datePickerTriggerClassName}
                            {...props}
                        >
                            <span
                                className={cn(
                                    value ? datePickerValueClassName : datePickerPlaceholderClassName,
                                    disabled && datePickerDisabledValueClassName,
                                )}
                            >
                                {value ? format(value, 'yyyy-MM-dd') : placeholder}
                            </span>
                            <CalendarIcon aria-hidden="true" className={datePickerIconClassName} />
                        </button>
                    </PopoverTrigger>
                </InputGroup>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            onChange?.(date)
                            setOpen(false)
                        }}
                        locale={ko}
                    />
                </PopoverContent>
            </Popover>
            {name ? (
                <input
                    type="date"
                    name={name}
                    form={form}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    tabIndex={-1}
                    aria-label={placeholder}
                    className="sr-only"
                    value={value ? format(value, 'yyyy-MM-dd') : ''}
                    onChange={() => undefined}
                    onInvalid={(event) => {
                        onInvalid?.(event)
                        triggerRef.current?.focus()
                    }}
                />
            ) : null}
        </>
    )
}

export {DatePicker}
export type {DatePickerProps}
