'use client'

import {useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {DatePicker} from '@/components/composite/date-picker'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'

const READONLY_DATE = new Date(2026, 6, 13)

const DatePickerFormDemo = () => {
    const [visitDate, setVisitDate] = useState<Date>()
    const [visitDateError, setVisitDateError] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextVisitDateError = visitDate === undefined
                setVisitDateError(nextVisitDateError)
                if (nextVisitDateError) {
                    document.getElementById('form-visit-date')?.focus()
                    return
                }

                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
                        visitDate: formData.get('visitDate'),
                        applicationDate: formData.get('applicationDate'),
                    }),
                )
            }}
        >
            <Field data-invalid={visitDateError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-visit-date" className="text-foreground gap-1 font-bold">
                    방문 예정일
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <DatePicker
                    id="form-visit-date"
                    name="visitDate"
                    required
                    value={visitDate}
                    onChange={(date) => {
                        setVisitDate(date)
                        setVisitDateError(false)
                    }}
                    aria-invalid={visitDateError || undefined}
                    aria-describedby={visitDateError ? 'form-visit-date-error' : undefined}
                />
                {visitDateError ? (
                    <FieldError id="form-visit-date-error">방문 예정일을 선택해 주세요.</FieldError>
                ) : null}
            </Field>

            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-application-date" className="text-foreground font-bold">
                    신청일
                </FieldLabel>
                <DatePicker id="form-application-date" name="applicationDate" value={READONLY_DATE} readOnly />
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        날짜 선택 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        선택 날짜와 readOnly 날짜가 yyyy-MM-dd 형식으로 제출됩니다.
                    </span>
                </div>
                <output
                    className="typo-body-l-regular bg-surface border-border text-muted-foreground min-h-10 rounded-md border px-3 py-2 break-all"
                    aria-live="polite"
                >
                    {submittedData}
                </output>
            </div>
        </form>
    )
}

export default DatePickerFormDemo
