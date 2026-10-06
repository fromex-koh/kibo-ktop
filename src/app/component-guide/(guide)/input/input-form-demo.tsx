'use client'

import {useRef, useState} from 'react'
import {Lock} from 'lucide-react'
import {
    FormResetButton,
    FormSubmitResult,
    formatSubmitResult,
    withFormReset,
    type FormResetProps,
} from '@/components/custom/form-submit-result'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {ClearableInput} from '@/components/composite/clearable-input'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'

const InputFormDemoBody = ({onReset}: FormResetProps) => {
    const [submittedData, setSubmittedData] = useState<string | null>(null)
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [applicantCountError, setApplicantCountError] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const applicantCountRef = useRef<HTMLInputElement>(null)

    return (
        <form
            className="flex flex-col gap-4"
            autoComplete="off"
            noValidate
            onReset={onReset}
            onSubmit={(event) => {
                event.preventDefault()

                const formData = new FormData(event.currentTarget)
                const nextNameError = String(formData.get('applicantName') ?? '').trim() === ''
                const nextEmailError = !(emailRef.current?.validity.valid ?? false)
                const nextApplicantCountError = !(applicantCountRef.current?.validity.valid ?? true)
                setNameError(nextNameError)
                setEmailError(nextEmailError)
                setApplicantCountError(nextApplicantCountError)

                if (nextNameError || nextEmailError || nextApplicantCountError) {
                    if (nextNameError) nameRef.current?.focus()
                    else if (nextEmailError) emailRef.current?.focus()
                    else applicantCountRef.current?.focus()
                    return
                }

                setSubmittedData(
                    formatSubmitResult({
                        applicantName: formData.get('applicantName'),
                        email: formData.get('email'),
                        applicantCount: formData.get('applicantCount'),
                        corporateNumber: formData.get('corporateNumber'),
                    }),
                )
            }}
        >
            <Field data-invalid={nameError || undefined} className="max-w-90">
                <FieldLabel htmlFor="form-applicant-name" className="text-foreground gap-1 font-bold">
                    신청자 이름
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <ClearableInput
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

            <Field data-invalid={emailError || undefined} className="max-w-90">
                <FieldLabel htmlFor="form-email" className="text-foreground gap-1 font-bold">
                    이메일
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <ClearableInput
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

            <Field data-invalid={applicantCountError || undefined} className="max-w-90">
                <FieldLabel htmlFor="form-applicant-count" className="text-foreground font-bold">
                    신청 인원
                </FieldLabel>
                {/* 단위는 서비스 폼과 같은 방식으로 상자 안 오른쪽에 두고 값은 오른쪽 정렬한다. */}
                <InputGroup>
                    <InputGroupInput
                        ref={applicantCountRef}
                        id="form-applicant-count"
                        placeholder="0"
                        name="applicantCount"
                        type="number"
                        min="1"
                        defaultValue="3"
                        aria-invalid={applicantCountError || undefined}
                        aria-describedby={applicantCountError ? 'form-applicant-count-error' : undefined}
                        onChange={() => setApplicantCountError(false)}
                        className="text-right"
                    />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        명
                    </InputGroupAddon>
                </InputGroup>
                {applicantCountError ? (
                    <FieldError id="form-applicant-count-error">신청 인원은 1명 이상 입력해 주세요.</FieldError>
                ) : null}
            </Field>

            <Field className="max-w-90">
                <FieldLabel htmlFor="form-corporate-number" className="text-foreground font-bold">
                    법인번호
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="form-corporate-number"
                        placeholder="법인번호"
                        name="corporateNumber"
                        readOnly
                        defaultValue="110111-1234567"
                    />
                    <InputGroupAddon align="inline-end" className="text-foreground">
                        <Lock aria-hidden="true" className="size-5" />
                    </InputGroupAddon>
                </InputGroup>
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="sm">
                        입력 내용 확인
                    </Button>
                    <FormResetButton />
                    <span className="typo-body-l-regular text-muted-foreground">
                        일반 입력값과 readOnly 값 모두 각 Input의 name으로 제출됩니다.
                    </span>
                </div>
                <FormSubmitResult data={submittedData} />
            </div>
        </form>
    )
}

const InputFormDemo = withFormReset(InputFormDemoBody)

export default InputFormDemo
