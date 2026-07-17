'use client'

import {useRef, useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field'

const CheckboxFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
    const [privacyChecked, setPrivacyChecked] = useState(false)
    const [privacyError, setPrivacyError] = useState(false)
    const [termsChecked, setTermsChecked] = useState(false)
    const [termsError, setTermsError] = useState(false)
    const privacyRef = useRef<HTMLButtonElement>(null)
    const termsRef = useRef<HTMLButtonElement>(null)

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextPrivacyError = !privacyChecked
                const nextTermsError = !termsChecked
                setPrivacyError(nextPrivacyError)
                setTermsError(nextTermsError)

                if (nextPrivacyError || nextTermsError) {
                    if (nextPrivacyError) privacyRef.current?.focus()
                    else termsRef.current?.focus()
                    return
                }

                const formData = new FormData(event.currentTarget)
                const result = {
                    interest: formData.getAll('interest'),
                    privacy: formData.get('privacy'),
                    terms: formData.get('terms'),
                }
                setSubmittedData(JSON.stringify(result))
            }}
        >
            <FieldSet>
                <FieldLegend className="typo-title-l-medium text-foreground">관심 분야</FieldLegend>
                <FieldDescription className="typo-body-l-regular">
                    관심 있는 분야를 모두 선택해 주세요.
                </FieldDescription>
                <FieldGroup className="gap-3">
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <Checkbox id="form-interest-ai" name="interest" value="ai" defaultChecked />
                        <FieldLabel htmlFor="form-interest-ai">AI</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <Checkbox id="form-interest-cloud" name="interest" value="cloud" />
                        <FieldLabel htmlFor="form-interest-cloud">클라우드</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <Checkbox id="form-interest-security" name="interest" value="security" />
                        <FieldLabel htmlFor="form-interest-security">보안</FieldLabel>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <Field
                orientation="horizontal"
                data-invalid={privacyError || undefined}
                className={cn('w-fit', FIELD_FOCUS_RING)}
            >
                <Checkbox
                    ref={privacyRef}
                    id="form-privacy"
                    name="privacy"
                    value="confirmed"
                    checked={privacyChecked}
                    onCheckedChange={(checked) => {
                        const nextChecked = checked === true
                        setPrivacyChecked(nextChecked)
                        if (nextChecked) setPrivacyError(false)
                    }}
                    required
                    aria-invalid={privacyError || undefined}
                    aria-describedby={privacyError ? 'form-privacy-error' : undefined}
                />
                <FieldContent className={privacyError ? undefined : 'min-h-6 justify-center'}>
                    <FieldLabel htmlFor="form-privacy" className="gap-1">
                        개인정보 처리방침을 확인했습니다.
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only"> (필수)</span>
                    </FieldLabel>
                    {privacyError ? (
                        <FieldError id="form-privacy-error">개인정보 처리방침을 확인해 주세요.</FieldError>
                    ) : null}
                </FieldContent>
            </Field>

            <Field
                orientation="horizontal"
                data-invalid={termsError || undefined}
                className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}
            >
                <Checkbox
                    ref={termsRef}
                    id="form-terms"
                    name="terms"
                    value="agreed"
                    checked={termsChecked}
                    onCheckedChange={(checked) => {
                        const nextChecked = checked === true
                        setTermsChecked(nextChecked)
                        if (nextChecked) setTermsError(false)
                    }}
                    required
                    aria-invalid={termsError || undefined}
                    aria-describedby={termsError ? 'form-terms-description form-terms-error' : 'form-terms-description'}
                />
                <FieldContent>
                    <div className="flex flex-col gap-0.5">
                        <FieldLabel htmlFor="form-terms" className="text-foreground gap-1 font-bold">
                            이용약관에 동의합니다.
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </FieldLabel>
                        <FieldDescription
                            id="form-terms-description"
                            className="typo-body-xl-regular text-label-foreground"
                        >
                            서비스 이용을 위해 이용약관 동의가 필요합니다.
                        </FieldDescription>
                    </div>
                    {termsError ? <FieldError id="form-terms-error">이용약관에 동의해 주세요.</FieldError> : null}
                </FieldContent>
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        선택 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        복수 선택값은 FormData.getAll()로 확인합니다.
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

export default CheckboxFormDemo
