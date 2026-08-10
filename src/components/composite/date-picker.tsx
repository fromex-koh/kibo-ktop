'use client'

import type {ChangeEvent, ComponentPropsWithoutRef, MouseEvent} from 'react'
import {Children, isValidElement, useEffect, useRef, useState} from 'react'
import {addYears, endOfMonth, format, isSameMonth, setMonth, startOfMonth} from 'date-fns'
import {ko} from 'date-fns/locale'
import {CalendarIcon} from 'lucide-react'
import {Calendar} from '@/components/ui/calendar'
import {calendarNavButtonClassName} from '@/components/theme/calendar.variants'
import {Button} from '@/components/ui/button'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {InputGroup} from '@/components/ui/input-group'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {SelectText, type SelectTextOption} from '@/components/composite/select-text'
import {
    datePickerCalendarPopoverClassName,
    datePickerMonthCellClassName,
    datePickerMonthGridClassName,
    datePickerMonthHeaderClassName,
    datePickerMonthPanelClassName,
    datePickerDisabledValueClassName,
    datePickerGroupClassName,
    datePickerIconClassName,
    datePickerPlaceholderClassName,
    datePickerSizeClassName,
    datePickerTriggerClassName,
    datePickerValueClassName,
} from '@/components/theme/date-picker.variants'
import {cn} from '@/lib/utils'

// 고르는 단위 — 'day' 는 날짜 달력, 'month' 는 12개월 격자다. 라벨이 "년월" 인 칸(근무 시작·종료 등)은
// 일까지 고를 이유가 없어 month 를 쓴다. 값은 그 달의 1일로 담고 화면과 제출에는 연월만 쓴다.
type DatePickerGranularity = 'day' | 'month'

const MONTHS_PER_YEAR = 12
const YEAR_RANGE = 100

type DatePickerProps = {
    // 제어 사용: value 를 넘기면 표시 값은 항상 이 값이다.
    value?: Date
    // 비제어 사용: 초기값만 주고 선택 값은 내부 상태로 관리한다(폼에 그대로 꽂아 쓰는 경우).
    defaultValue?: Date
    onChange?: (date?: Date) => void
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    /** 고를 수 있는 가장 이른 날 · 가장 늦은 날. 범위 밖의 날은 달력에서 눌리지 않고 월·연도 목록에도 나오지 않는다. */
    minDate?: Date
    maxDate?: Date
    /**
     * 고를 수는 있지만 폼 검사에서 걸리게 할 사유. 두 칸의 앞뒤 순서처럼 "왜 안 되는지" 를 알려 줘야 하는
     * 규칙에 쓴다 — 달력에서 아예 막으면 사용자는 이유를 모른 채 고장으로 읽는다.
     * 값을 주면 제출이 막히고, 그 문구가 브라우저 검사 메시지가 된다(setCustomValidity).
     */
    validationMessage?: string
    id?: string
    name?: string
    form?: string
    required?: boolean
    onInvalid?: ComponentPropsWithoutRef<'input'>['onInvalid']
    /** 고르는 단위. month 면 달력 대신 12개월 격자가 열리고 값도 연월까지만 다룬다. */
    granularity?: DatePickerGranularity
    /** 시안 date_input 의 large(48px) · medium(40px). Select 와 같은 축이다. */
    size?: 'lg' | 'md'
    className?: string
} & Pick<ComponentPropsWithoutRef<'button'>, 'aria-invalid' | 'aria-describedby'>

// react-day-picker는 월·연도 변경 시 select DOM을 다시 렌더링해 네이티브 포커스가 body로 빠진다.
// primitive를 수정하지 않고 Select 슬롯에서 새 DOM이 연결된 다음 동일 컨트롤로 포커스를 복원한다.
const CalendarDropdownSelect = ({onChange, children, className, ...props}: ComponentPropsWithoutRef<'select'>) => {
    const options = Children.toArray(children).flatMap<SelectTextOption>((child) => {
        if (!isValidElement<ComponentPropsWithoutRef<'option'>>(child)) return []
        return [
            {
                value: String(child.props.value ?? ''),
                label: String(child.props.children ?? ''),
                disabled: child.props.disabled,
            },
        ]
    })

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const accessibleName = event.currentTarget.getAttribute('aria-label')
        onChange?.(event)
        requestAnimationFrame(() => {
            const nextSelect = Array.from(document.querySelectorAll<HTMLSelectElement>('select')).find(
                (select) => select.getAttribute('aria-label') === accessibleName,
            )
            nextSelect?.focus()
        })
    }

    return <SelectText {...props} options={options} size="sm" selectClassName={className} onChange={handleChange} />
}

const CalendarNavigationButton = ({onClick, ...props}: ComponentPropsWithoutRef<'button'>) => {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        const accessibleName = event.currentTarget.getAttribute('aria-label')
        onClick?.(event)
        requestAnimationFrame(() => {
            const nextButton = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
                (button) => button.getAttribute('aria-label') === accessibleName,
            )
            nextButton?.focus()
        })
    }

    return <button onClick={handleClick} {...props} />
}

// 12개월 격자 — 날짜 달력 자리에 들어가며 헤더 구성(이전/연도/다음)과 셀 크기를 달력과 맞춘다.
// 경력처럼 20년 전 일을 적는 칸이 있어 연도는 버튼만으로 옮기지 않고 목록에서도 고를 수 있게 둔다.
const MonthGrid = ({
    month,
    selected,
    onMonthChange,
    onSelect,
    isMonthDisabled,
    minDate,
    maxDate,
}: {
    month: Date
    selected?: Date
    onMonthChange: (month: Date) => void
    onSelect: (month: Date) => void
    isMonthDisabled: (month: Date) => boolean
    minDate?: Date
    maxDate?: Date
}) => {
    const today = new Date()
    const months = Array.from({length: MONTHS_PER_YEAR}, (_, index) => setMonth(startOfMonth(month), index))
    const firstYear = (minDate ?? addYears(today, -YEAR_RANGE)).getFullYear()
    const lastYear = (maxDate ?? addYears(today, YEAR_RANGE)).getFullYear()
    const years = Array.from({length: Math.max(1, lastYear - firstYear + 1)}, (_, index) => firstYear + index)
    const shiftYear = (step: number) => onMonthChange(addYears(month, step))

    return (
        <div className={datePickerMonthPanelClassName}>
            <div className={datePickerMonthHeaderClassName}>
                <Button
                    type="button"
                    variant="tertiary"
                    size="icon-xs"
                    aria-label="이전 연도"
                    disabled={month.getFullYear() <= firstYear}
                    className={calendarNavButtonClassName}
                    onClick={() => shiftYear(-1)}
                >
                    <ChevronLeft aria-hidden="true" />
                </Button>
                <SelectText
                    size="sm"
                    aria-label="연도 선택"
                    value={String(month.getFullYear())}
                    options={years.map((year) => ({value: String(year), label: `${year}년`}))}
                    onChange={(event) =>
                        onMonthChange(addYears(month, Number(event.target.value) - month.getFullYear()))
                    }
                />
                <Button
                    type="button"
                    variant="tertiary"
                    size="icon-xs"
                    aria-label="다음 연도"
                    disabled={month.getFullYear() >= lastYear}
                    className={calendarNavButtonClassName}
                    onClick={() => shiftYear(1)}
                >
                    <ChevronRight aria-hidden="true" />
                </Button>
            </div>
            <div className={datePickerMonthGridClassName}>
                {months.map((candidate) => (
                    <button
                        key={candidate.getMonth()}
                        type="button"
                        disabled={isMonthDisabled(candidate)}
                        data-selected={selected && isSameMonth(candidate, selected) ? true : undefined}
                        data-current={isSameMonth(candidate, today) ? true : undefined}
                        className={datePickerMonthCellClassName}
                        onClick={() => onSelect(candidate)}
                    >
                        {format(candidate, 'MM월')}
                    </button>
                ))}
            </div>
        </div>
    )
}

const DatePicker = ({
    value,
    defaultValue,
    onChange,
    granularity = 'day',
    placeholder,
    disabled,
    readOnly,
    minDate,
    maxDate,
    validationMessage,
    id,
    name,
    form,
    required,
    onInvalid,
    size = 'lg',
    className,
    ...props
}: DatePickerProps) => {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    // 폼에 값을 전달하는 입력 — 여기에 사유를 걸어야 브라우저 검사(checkValidity)가 함께 걸린다.
    const valueInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        valueInputRef.current?.setCustomValidity(validationMessage ?? '')
    }, [validationMessage])
    // 제어/비제어 겸용 — value 를 넘기면 그 값을, 안 넘기면 내부 상태를 쓴다.
    // (value 없이 쓰면 선택한 날짜가 화면에도, name 으로 제출되는 값에도 반영되지 않던 문제를 막는다.)
    const [internalDate, setInternalDate] = useState<Date | undefined>(defaultValue)
    const isControlled = value !== undefined
    const selectedDate = isControlled ? value : internalDate
    // 패널을 다시 열면 이전 탐색 위치가 아니라 현재 선택값이 속한 월부터 보여준다.
    const [calendarMonth, setCalendarMonth] = useState(() => selectedDate ?? new Date())

    // 범위 밖의 날은 달력에서 눌리지 않게 막는다 — 두 조건은 각각의 matcher 라 배열로 넘긴다
    // (한 객체에 before·after 를 같이 넣으면 "두 날짜 사이" 라는 다른 뜻이 된다).
    const disabledDays = [...(minDate ? [{before: minDate}] : []), ...(maxDate ? [{after: maxDate}] : [])]

    // 단위에 따라 표시·제출 형식이 함께 바뀐다. 월 단위 값은 그 달의 1일로 담고 연월까지만 쓴다.
    const isMonthly = granularity === 'month'
    const valueFormat = isMonthly ? 'yyyy-MM' : 'yyyy-MM-dd'
    const emptyText = placeholder ?? (isMonthly ? '연도-월' : '연도-월-일')
    const toInputValue = (date?: Date) => (date ? format(date, valueFormat) : undefined)

    // 월 칸이 고를 수 있는지 — 그 달이 통째로 범위 밖일 때만 막는다(오늘이 낀 달은 고를 수 있다).
    const isMonthDisabled = (month: Date) =>
        Boolean((minDate && endOfMonth(month) < minDate) || (maxDate && startOfMonth(month) > maxDate))

    const handleSelect = (date?: Date) => {
        if (!isControlled) setInternalDate(date)
        if (date) setCalendarMonth(date)
        onChange?.(date)
        setOpen(false)
    }

    const handleSelectMonth = (month: Date) => handleSelect(startOfMonth(month))

    const handleOpenChange = (next: boolean) => {
        if (readOnly) return
        if (next && selectedDate) setCalendarMonth(selectedDate)
        setOpen(next)
    }

    return (
        <>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <InputGroup className={cn(datePickerGroupClassName, datePickerSizeClassName[size], className)}>
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
                                {selectedDate ? format(selectedDate, valueFormat) : emptyText}
                            </span>
                            <CalendarIcon aria-hidden="true" className={datePickerIconClassName} />
                        </button>
                    </PopoverTrigger>
                </InputGroup>
                <PopoverContent className={datePickerCalendarPopoverClassName} align="start">
                    {isMonthly ? (
                        <MonthGrid
                            month={calendarMonth}
                            selected={selectedDate}
                            onMonthChange={setCalendarMonth}
                            onSelect={handleSelectMonth}
                            isMonthDisabled={isMonthDisabled}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            disabled={disabledDays.length ? disabledDays : undefined}
                            startMonth={minDate}
                            endMonth={maxDate}
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
                            classNames={{
                                dropdown_root: 'static rounded-none has-[:focus]:outline-0',
                                dropdown: 'static inset-auto opacity-100',
                                caption_label: 'sr-only',
                            }}
                            // react-day-picker 는 연도를 먼저 그리는데 시안은 월이 앞이다.
                            // 보기만 뒤집으면 읽는 순서가 어긋나므로(DOM 순서 = 읽기 순서 [KWCAG 7.3.1])
                            // 자식 순서 자체를 바꾼다.
                            components={{
                                Select: CalendarDropdownSelect,
                                PreviousMonthButton: CalendarNavigationButton,
                                NextMonthButton: CalendarNavigationButton,
                                DropdownNav: ({children, ...navProps}) => (
                                    <div {...navProps}>{Children.toArray(children).reverse()}</div>
                                ),
                            }}
                        />
                    )}
                </PopoverContent>
            </Popover>
            {name ? (
                <input
                    ref={valueInputRef}
                    type={isMonthly ? 'month' : 'date'}
                    name={name}
                    form={form}
                    // 화면에 보이는 컨트롤의 값을 폼에 전달만 하는 입력이라 브라우저 자동완성 대상이 아니다.
                    autoComplete="off"
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    min={toInputValue(minDate)}
                    max={toInputValue(maxDate)}
                    tabIndex={-1}
                    aria-label={emptyText}
                    className="sr-only"
                    value={selectedDate ? format(selectedDate, valueFormat) : ''}
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
