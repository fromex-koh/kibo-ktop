'use client'

import type {ReactNode} from 'react'
import {useState} from 'react'
import {DatePicker} from '@/components/composite/date-picker'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'

const FIELD_DEMO_CLASS = 'max-w-90'
const FIELD_LABEL_CLASS = 'text-foreground font-bold'

const DatePickerDemo = () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
        <Field className={FIELD_DEMO_CLASS}>
            <FieldLabel htmlFor="demo-date" className={FIELD_LABEL_CLASS}>
                날짜 선택
            </FieldLabel>
            <DatePicker id="demo-date" value={date} onChange={setDate} aria-describedby="demo-date-help" />
            <FieldDescription id="demo-date-help">달력에서 날짜를 선택해 주세요.</FieldDescription>
        </Field>
    )
}

// 연-월 단위 — 라벨이 "년월" 인 칸(근무 시작·종료 등)처럼 일까지 고를 이유가 없는 자리에 쓴다.
export const DatePickerMonthDemo = () => {
    const [month, setMonth] = useState<Date | undefined>(undefined)
    const [rangeStart, setRangeStart] = useState<Date | undefined>(undefined)
    const [rangeEnd, setRangeEnd] = useState<Date | undefined>(undefined)

    return (
        <div className="flex flex-col gap-6">
            <Field className={FIELD_DEMO_CLASS}>
                <FieldLabel htmlFor="demo-month" className={FIELD_LABEL_CLASS}>
                    기준 연월
                </FieldLabel>
                <DatePicker
                    id="demo-month"
                    granularity="month"
                    value={month}
                    onChange={setMonth}
                    aria-describedby="demo-month-help"
                />
                <FieldDescription id="demo-month-help">
                    12개월 격자에서 고릅니다. 값은 그 달의 1일로 담기고 표시·제출은 연월까지만 합니다.
                </FieldDescription>
            </Field>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 시작에 값이 생기면 종료의 하한이, 종료에 값이 생기면 시작의 상한이 된다. */}
                <Field className={FIELD_DEMO_CLASS}>
                    <FieldLabel htmlFor="demo-month-start" className={FIELD_LABEL_CLASS}>
                        시작 연월
                    </FieldLabel>
                    <DatePicker
                        id="demo-month-start"
                        granularity="month"
                        value={rangeStart}
                        onChange={setRangeStart}
                        maxDate={rangeEnd}
                    />
                </Field>
                <Field className={FIELD_DEMO_CLASS}>
                    <FieldLabel htmlFor="demo-month-end" className={FIELD_LABEL_CLASS}>
                        종료 연월
                    </FieldLabel>
                    <DatePicker
                        id="demo-month-end"
                        granularity="month"
                        value={rangeEnd}
                        onChange={setRangeEnd}
                        minDate={rangeStart}
                    />
                </Field>
            </div>
        </div>
    )
}

export const DatePickerSizesDemo = () => {
    const [lgDate, setLgDate] = useState<Date | undefined>(undefined)
    const [mdDate, setMdDate] = useState<Date | undefined>(undefined)
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field className={FIELD_DEMO_CLASS}>
                <FieldLabel htmlFor="size-lg-date" className={FIELD_LABEL_CLASS}>
                    lg (default · 48px)
                </FieldLabel>
                <DatePicker id="size-lg-date" value={lgDate} onChange={setLgDate} />
            </Field>
            <Field className={FIELD_DEMO_CLASS}>
                <FieldLabel htmlFor="size-md-date" className={FIELD_LABEL_CLASS}>
                    md (40px)
                </FieldLabel>
                <DatePicker id="size-md-date" size="md" value={mdDate} onChange={setMdDate} />
            </Field>
        </div>
    )
}

const StateField = ({id, label, children, error}: {id: string; label: string; children: ReactNode; error?: string}) => (
    <Field data-invalid={error ? true : undefined} className={FIELD_DEMO_CLASS}>
        <FieldLabel htmlFor={id} className={FIELD_LABEL_CLASS}>
            {label}
        </FieldLabel>
        {children}
        {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
)

const SAMPLE_DATE = new Date(2026, 6, 13)

export const DatePickerStatesDemo = () => {
    const [empty, setEmpty] = useState<Date | undefined>(undefined)
    const [filled, setFilled] = useState<Date | undefined>(SAMPLE_DATE)
    return (
        <div className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2">
            <StateField id="st-empty" label="기본 (placeholder)">
                <DatePicker id="st-empty" value={empty} onChange={setEmpty} />
            </StateField>
            <StateField id="st-filled" label="값 입력됨">
                <DatePicker id="st-filled" value={filled} onChange={setFilled} />
            </StateField>
            <StateField id="st-error" label="오류 (error)" error="날짜를 선택해 주세요.">
                <DatePicker id="st-error" aria-invalid aria-describedby="st-error-error" />
            </StateField>
            <StateField id="st-readonly" label="읽기전용 (readOnly)">
                <DatePicker id="st-readonly" value={SAMPLE_DATE} readOnly />
            </StateField>
            <StateField id="st-disabled" label="비활성 (disabled)">
                <DatePicker id="st-disabled" value={SAMPLE_DATE} disabled />
            </StateField>
        </div>
    )
}

export default DatePickerDemo
