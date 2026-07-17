'use client'

import {useRef, useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {TextareaCounter} from '@/components/composite/textarea-counter'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Textarea} from '@/components/ui/textarea'

const TextareaFormDemo = () => {
    const [inquiry, setInquiry] = useState('')
    const [inquiryError, setInquiryError] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
    const inquiryRef = useRef<HTMLTextAreaElement>(null)

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextInquiryError = inquiry.trim() === ''
                setInquiryError(nextInquiryError)
                if (nextInquiryError) {
                    inquiryRef.current?.focus()
                    return
                }

                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
                        inquiry: formData.get('inquiry'),
                        processingNote: formData.get('processingNote'),
                    }),
                )
            }}
        >
            <Field data-invalid={inquiryError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-inquiry" className="text-foreground gap-1 font-bold">
                    문의 내용
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <TextareaCounter
                    ref={inquiryRef}
                    id="form-inquiry"
                    name="inquiry"
                    required
                    maxLength={100}
                    value={inquiry}
                    onChange={(event) => {
                        setInquiry(event.currentTarget.value)
                        setInquiryError(false)
                    }}
                    placeholder="내용을 입력하세요"
                    aria-invalid={inquiryError || undefined}
                    aria-describedby={inquiryError ? 'form-inquiry-error' : undefined}
                    footer={
                        inquiryError ? (
                            <FieldError id="form-inquiry-error">문의 내용을 입력해 주세요.</FieldError>
                        ) : null
                    }
                />
            </Field>

            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-processing-note" className="text-foreground font-bold">
                    처리 메모
                </FieldLabel>
                <Textarea id="form-processing-note" name="processingNote" defaultValue="담당 부서 확인 완료" readOnly />
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        입력 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        일반 입력값과 readOnly 값 모두 각 Textarea의 name으로 제출됩니다.
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

export default TextareaFormDemo
