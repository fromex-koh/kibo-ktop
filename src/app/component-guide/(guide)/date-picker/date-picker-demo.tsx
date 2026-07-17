'use client'

import type {ReactNode} from 'react'
import {useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {DatePicker} from '@/components/composite/date-picker'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'

const FIELD_DEMO_CLASS = 'max-w-90'
const FIELD_LABEL_CLASS = 'text-foreground font-bold'

const DatePickerDemo = () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
        <Field className={cn(FIELD_DEMO_CLASS, FIELD_FOCUS_RING)}>
            <FieldLabel htmlFor="demo-date" className={FIELD_LABEL_CLASS}>
                날짜 선택
            </FieldLabel>
            <DatePicker id="demo-date" value={date} onChange={setDate} aria-describedby="demo-date-help" />
            <FieldDescription id="demo-date-help">달력에서 날짜를 선택해 주세요.</FieldDescription>
        </Field>
    )
}

const StateField = ({id, label, children, error}: {id: string; label: string; children: ReactNode; error?: string}) => (
    <Field data-invalid={error ? true : undefined} className={cn(FIELD_DEMO_CLASS, FIELD_FOCUS_RING)}>
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
