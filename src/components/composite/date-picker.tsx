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
    datePickerCalendarPopoverClassName,
    datePickerDisabledValueClassName,
    datePickerGroupClassName,
    datePickerIconClassName,
    datePickerPlaceholderClassName,
    datePickerTriggerClassName,
    datePickerValueClassName,
} from '@/components/theme/date-picker.variants'
import {cn} from '@/lib/utils'

type DatePickerProps = {
    // 제어 사용: value 를 넘기면 표시 값은 항상 이 값이다.
    value?: Date
    // 비제어 사용: 초기값만 주고 선택 값은 내부 상태로 관리한다(폼에 그대로 꽂아 쓰는 경우).
    defaultValue?: Date
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
    defaultValue,
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
    // 제어/비제어 겸용 — value 를 넘기면 그 값을, 안 넘기면 내부 상태를 쓴다.
    // (value 없이 쓰면 선택한 날짜가 화면에도, name 으로 제출되는 값에도 반영되지 않던 문제를 막는다.)
    const [internalDate, setInternalDate] = useState<Date | undefined>(defaultValue)
    const isControlled = value !== undefined
    const selectedDate = isControlled ? value : internalDate

    const handleSelect = (date?: Date) => {
        if (!isControlled) setInternalDate(date)
        onChange?.(date)
        setOpen(false)
    }
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
                                    selectedDate ? datePickerValueClassName : datePickerPlaceholderClassName,
                                    disabled && datePickerDisabledValueClassName,
                                )}
                            >
                                {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : placeholder}
                            </span>
                            <CalendarIcon aria-hidden="true" className={datePickerIconClassName} />
                        </button>
                    </PopoverTrigger>
                </InputGroup>
                <PopoverContent className={datePickerCalendarPopoverClassName} align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        locale={ko}
                        // 디자인의 헤더는 [이전] 2026.07 [다음] 이 가운데 모인 형태다.
                        navLayout="around"
                        formatters={{formatCaption: (date) => format(date, 'yyyy.MM')}}
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
                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
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
