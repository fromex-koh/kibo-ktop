'use client'

import {useState} from 'react'
import {DatePicker} from '@/components/composite/date-picker'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'

const READONLY_DATE = new Date(2026, 6, 13)

const DatePickerFormDemo = () => {
    const [visitDate, setVisitDate] = useState<Date>()
    const [visitDateError, setVisitDateError] = useState(false)
    const [startMonth, setStartMonth] = useState<Date>()
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            autoComplete="off"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
                        visitDate: formData.get('visitDate'),
                        applicationDate: formData.get('applicationDate'),
                        startMonth: formData.get('startMonth'),
                    }),
                )
            }}
        >
            <Field data-invalid={visitDateError || undefined} className="max-w-90">
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
                    onInvalid={() => setVisitDateError(true)}
                    aria-invalid={visitDateError || undefined}
                    aria-describedby={visitDateError ? 'form-visit-date-error' : undefined}
                />
                {visitDateError ? (
                    <FieldError id="form-visit-date-error">방문 예정일을 선택해 주세요.</FieldError>
                ) : null}
            </Field>

            <Field className="max-w-90">
                <FieldLabel htmlFor="form-application-date" className="text-foreground font-bold">
                    신청일
                </FieldLabel>
                <DatePicker id="form-application-date" name="applicationDate" value={READONLY_DATE} readOnly />
            </Field>

            {/* 연-월 칸 — 같은 폼에서 날짜 칸과 나란히 두어 제출 값 형식이 어떻게 다른지 함께 본다. */}
            <Field className="max-w-90">
                <FieldLabel htmlFor="form-start-month" className="text-foreground font-bold">
                    시작 연월
                </FieldLabel>
                <DatePicker
                    id="form-start-month"
                    name="startMonth"
                    granularity="month"
                    value={startMonth}
                    onChange={setStartMonth}
                />
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="sm">
                        날짜 선택 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        날짜 칸은 yyyy-MM-dd, 연-월 칸은 yyyy-MM 형식으로 제출됩니다.
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
