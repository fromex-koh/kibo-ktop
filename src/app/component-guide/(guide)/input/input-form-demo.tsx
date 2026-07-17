'use client'

import {useRef, useState} from 'react'
import {Lock} from 'lucide-react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'

const InputFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const formData = new FormData(event.currentTarget)
                const nextNameError = String(formData.get('applicantName') ?? '').trim() === ''
                const nextEmailError = !(emailRef.current?.validity.valid ?? false)
                setNameError(nextNameError)
                setEmailError(nextEmailError)

                if (nextNameError || nextEmailError) {
                    if (nextNameError) nameRef.current?.focus()
                    else emailRef.current?.focus()
                    return
                }

                setSubmittedData(
                    JSON.stringify({
                        applicantName: formData.get('applicantName'),
                        email: formData.get('email'),
                        applicantCount: formData.get('applicantCount'),
                        corporateNumber: formData.get('corporateNumber'),
                    }),
                )
            }}
        >
            <Field data-invalid={nameError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-applicant-name" className="text-foreground gap-1 font-bold">
                    신청자 이름
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <Input
                    ref={nameRef}
                    id="form-applicant-name"
                    name="applicantName"
                    required
                    placeholder="이름을 입력하세요"
                    aria-invalid={nameError || undefined}
                    aria-describedby={nameError ? 'form-applicant-name-error' : undefined}
                    onChange={() => setNameError(false)}
                />
                {nameError ? (
                    <FieldError id="form-applicant-name-error">신청자 이름을 입력해 주세요.</FieldError>
                ) : null}
            </Field>

            <Field data-invalid={emailError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-email" className="text-foreground gap-1 font-bold">
                    이메일
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <Input
                    ref={emailRef}
                    id="form-email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@domain.com"
                    aria-invalid={emailError || undefined}
                    aria-describedby={emailError ? 'form-email-error' : undefined}
                    onChange={() => setEmailError(false)}
                />
                {emailError ? <FieldError id="form-email-error">올바른 이메일 주소를 입력해 주세요.</FieldError> : null}
            </Field>

            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-applicant-count" className="text-foreground font-bold">
                    신청 인원
                </FieldLabel>
                <div className="flex items-center gap-2">
                    <Input
                        id="form-applicant-count"
                        name="applicantCount"
                        type="number"
                        min="1"
                        defaultValue="3"
                        className="flex-1 md:min-w-0"
                    />
                    <span className="typo-body-xl-regular text-foreground shrink-0">명</span>
                </div>
            </Field>

            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-corporate-number" className="text-foreground font-bold">
                    법인번호
                </FieldLabel>
                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:outline-none">
                    <InputGroupInput
                        id="form-corporate-number"
                        name="corporateNumber"
                        readOnly
                        defaultValue="11222-1234567"
                    />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        <Lock aria-hidden="true" className="size-5" />
                    </InputGroupAddon>
                </InputGroup>
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        입력 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        일반 입력값과 readOnly 값 모두 각 Input의 name으로 제출됩니다.
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

export default InputFormDemo
