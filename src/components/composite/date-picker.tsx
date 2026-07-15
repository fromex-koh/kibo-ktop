'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {useState} from 'react'
import {format} from 'date-fns'
import {ko} from 'date-fns/locale'
import {CalendarIcon} from 'lucide-react'
import {Calendar} from '@/components/kit/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/kit/popover'
import {cn} from '@/lib/utils'

// DatePicker — kit Input 스타일을 입힌 trigger button + kit Popover/Calendar 조합.
// PROJECT-STYLE: disabled/readOnly 배경은 입력형 컨트롤 공통 bg-field-disabled를 쓴다.
type DatePickerProps = {
    value?: Date
    onChange?: (date?: Date) => void
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    id?: string
    className?: string
} & Pick<ComponentPropsWithoutRef<'button'>, 'aria-invalid' | 'aria-describedby' | 'name'>

const DatePicker = ({
    value,
    onChange,
    placeholder = '연도-월-일',
    disabled,
    readOnly,
    id,
    className,
    ...props
}: DatePickerProps) => {
    const [open, setOpen] = useState(false)
    return (
        <Popover open={open} onOpenChange={(next) => !readOnly && setOpen(next)}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    id={id}
                    disabled={disabled}
                    data-slot="date-picker-trigger"
                    data-readonly={readOnly || undefined}
                    className={cn(
                        'h-control-h-lg border-control bg-surface text-label-foreground flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm border px-4 text-base transition-colors outline-none',
                        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
                        'aria-invalid:border-destructive',
                        'data-[readonly]:bg-field-disabled data-[readonly]:cursor-default',
                        'disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100',
                        className,
                    )}
                    {...props}
                >
                    <span
                        className={cn(
                            value ? 'text-label-foreground' : 'text-placeholder',
                            disabled && 'text-disabled',
                        )}
                    >
                        {value ? format(value, 'yyyy-MM-dd') : placeholder}
                    </span>
                    <CalendarIcon aria-hidden="true" className="text-foreground size-icon-md shrink-0" />
                </button>
            </PopoverTrigger>
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
    )
}

export {DatePicker}
export type {DatePickerProps}
