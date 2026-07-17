'use client'

import {useRef, useState, type ComponentProps} from 'react'
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

const INTEREST_OPTIONS = [
    {value: 'ai', label: 'AI'},
    {value: 'cloud', label: '클라우드'},
    {value: 'security', label: '보안'},
] as const

const CheckboxFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
    const [selectedInterests, setSelectedInterests] = useState(() => new Set<string>(['ai']))
    const [privacyChecked, setPrivacyChecked] = useState(false)
    const [privacyError, setPrivacyError] = useState(false)
    const [termsChecked, setTermsChecked] = useState(false)
    const [termsError, setTermsError] = useState(false)
    const privacyRef = useRef<HTMLButtonElement>(null)
    const termsRef = useRef<HTMLButtonElement>(null)
    const interestChecked: ComponentProps<typeof Checkbox>['checked'] =
        selectedInterests.size === INTEREST_OPTIONS.length
            ? true
            : selectedInterests.size === 0
              ? false
              : 'indeterminate'

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
                    interestAggregate: interestChecked,
                    privacy: formData.get('privacy'),
                    terms: formData.get('terms'),
                }
                setSubmittedData(JSON.stringify(result))
            }}
        >
            <FieldSet>
                <FieldLegend className="typo-title-l-medium text-foreground">관심 분야</FieldLegend>
                <FieldDescription className="typo-body-l-regular">
                    전체 선택은 하위 항목의 상태를 요약하며, 실제 제출에는 선택된 하위 값만 포함됩니다.
                </FieldDescription>
                <FieldGroup className="gap-3">
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <Checkbox
                            id="form-interest-all"
                            checked={interestChecked}
                            onCheckedChange={(checked) =>
                                setSelectedInterests(
                                    checked === true
                                        ? new Set(INTEREST_OPTIONS.map((option) => option.value))
                                        : new Set(),
                                )
                            }
                        />
                        <FieldLabel htmlFor="form-interest-all">관심 분야 전체 선택</FieldLabel>
                    </Field>
                    <div className="flex flex-col gap-3 pl-8">
                        {INTEREST_OPTIONS.map((option) => (
                            <Field
                                key={option.value}
                                orientation="horizontal"
                                className={cn('w-fit', FIELD_FOCUS_RING)}
                            >
                                <Checkbox
                                    id={`form-interest-${option.value}`}
                                    name="interest"
                                    value={option.value}
                                    checked={selectedInterests.has(option.value)}
                                    onCheckedChange={(checked) => {
                                        setSelectedInterests((current) => {
                                            const next = new Set(current)
                                            if (checked === true) next.add(option.value)
                                            else next.delete(option.value)
                                            return next
                                        })
                                    }}
                                />
                                <FieldLabel htmlFor={`form-interest-${option.value}`}>{option.label}</FieldLabel>
                            </Field>
                        ))}
                    </div>
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
                        Indeterminate는 요약 상태이며, 하위 선택값은 FormData.getAll()로 확인합니다.
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
