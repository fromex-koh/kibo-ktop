'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Children, useRef, useState} from 'react'
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
    // 패널을 다시 열면 이전 탐색 위치가 아니라 현재 선택값이 속한 월부터 보여준다.
    const [calendarMonth, setCalendarMonth] = useState(() => selectedDate ?? new Date())

    const handleSelect = (date?: Date) => {
        if (!isControlled) setInternalDate(date)
        if (date) setCalendarMonth(date)
        onChange?.(date)
        setOpen(false)
    }

    const handleOpenChange = (next: boolean) => {
        if (readOnly) return
        if (next && selectedDate) setCalendarMonth(selectedDate)
        setOpen(next)
    }

    return (
        <>
            <Popover open={open} onOpenChange={handleOpenChange}>
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
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        locale={ko}
                        // 시안 헤더는 [이전] 07월▾ 2026년▾ [다음] 이다 — 월·연도를 각각 고르는 두 드롭다운이라
                        // captionLayout="dropdown" 을 쓰고, 표기만 시안대로(월 2자리·연도 뒤 '년') 맞춘다.
                        navLayout="around"
                        captionLayout="dropdown"
                        formatters={{
                            formatMonthDropdown: (date) => format(date, 'MM월'),
                            formatYearDropdown: (year) => format(year, 'yyyy년'),
                        }}
                        // 드롭다운 접근성 이름은 라이브러리 기본값이 영어라 한국어로 바꾼다. [KWCAG 5.1.1]
                        labels={{
                            labelMonthDropdown: () => '월 선택',
                            labelYearDropdown: () => '연도 선택',
                        }}
                        // react-day-picker 는 연도를 먼저 그리는데 시안은 월이 앞이다.
                        // 보기만 뒤집으면 읽는 순서가 어긋나므로(DOM 순서 = 읽기 순서 [KWCAG 7.3.1])
                        // 자식 순서 자체를 바꾼다.
                        components={{
                            DropdownNav: ({children, ...navProps}) => (
                                <div {...navProps}>{Children.toArray(children).reverse()}</div>
                            ),
                        }}
                    />
                </PopoverContent>
            </Popover>
            {name ? (
                <input
                    type="date"
                    name={name}
                    form={form}
                    // 화면에 보이는 컨트롤의 값을 폼에 전달만 하는 입력이라 브라우저 자동완성 대상이 아니다.
                    autoComplete="off"
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
