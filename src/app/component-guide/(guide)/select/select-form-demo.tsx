'use client'

import {useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

const SelectFormDemo = () => {
    const [applicationType, setApplicationType] = useState('')
    const [applicationTypeError, setApplicationTypeError] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextApplicationTypeError = applicationType === ''
                setApplicationTypeError(nextApplicationTypeError)

                if (nextApplicationTypeError) {
                    document.getElementById('form-application-type')?.focus()
                    return
                }

                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
                        applicationType: formData.get('applicationType'),
                        receptionChannel: formData.get('receptionChannel'),
                    }),
                )
            }}
        >
            <Field data-invalid={applicationTypeError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-application-type" className="text-foreground gap-1 font-bold">
                    신청 유형
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <Select
                    name="applicationType"
                    required
                    value={applicationType}
                    onValueChange={(value) => {
                        setApplicationType(value)
                        setApplicationTypeError(false)
                    }}
                >
                    <SelectTrigger
                        id="form-application-type"
                        className="w-full"
                        aria-invalid={applicationTypeError || undefined}
                        aria-describedby={applicationTypeError ? 'form-application-type-error' : undefined}
                    >
                        <SelectValue placeholder="신청 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="corporation">기업</SelectItem>
                        <SelectItem value="institution">기관</SelectItem>
                        <SelectItem value="individual">개인</SelectItem>
                    </SelectContent>
                </Select>
                {applicationTypeError ? (
                    <FieldError id="form-application-type-error">신청 유형을 선택해 주세요.</FieldError>
                ) : null}
            </Field>

            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-reception-channel" className="text-foreground font-bold">
                    접수 경로
                </FieldLabel>
                <Select name="receptionChannel" defaultValue="online" readOnly>
                    <SelectTrigger id="form-reception-channel" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="online">온라인 접수</SelectItem>
                        <SelectItem value="visit">방문 접수</SelectItem>
                    </SelectContent>
                </Select>
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        선택 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        선택값과 readOnly 값 모두 각 Select의 name으로 제출됩니다.
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

export default SelectFormDemo
