'use client'

import {useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Combobox, type ComboboxOption} from '@/components/composite/combobox'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'

const ORGANIZATIONS: ComboboxOption[] = [
    {value: 'technology-guarantee-fund', label: '기술보증기금'},
    {value: 'korea-credit-guarantee-fund', label: '신용보증기금'},
    {value: 'small-enterprise-agency', label: '소상공인시장진흥공단'},
]

const ComboboxFormDemo = () => {
    const [organization, setOrganization] = useState('')
    const [organizationError, setOrganizationError] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextOrganizationError = organization === ''
                setOrganizationError(nextOrganizationError)
                if (nextOrganizationError) {
                    document.getElementById('form-organization')?.focus()
                    return
                }

                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
                        organization: formData.get('organization'),
                        receptionOffice: formData.get('receptionOffice'),
                    }),
                )
            }}
        >
            <Field data-invalid={organizationError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-organization" className="text-foreground gap-1 font-bold">
                    신청 기관
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </FieldLabel>
                <Combobox
                    id="form-organization"
                    name="organization"
                    required
                    options={ORGANIZATIONS}
                    value={organization}
                    onValueChange={(value) => {
                        setOrganization(value)
                        setOrganizationError(false)
                    }}
                    placeholder="기관을 선택하세요"
                    searchPlaceholder="기관명 검색..."
                    aria-invalid={organizationError || undefined}
                    aria-describedby={organizationError ? 'form-organization-error' : undefined}
                />
                {organizationError ? (
                    <FieldError id="form-organization-error">신청 기관을 선택해 주세요.</FieldError>
                ) : null}
            </Field>

            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="form-reception-office" className="text-foreground font-bold">
                    접수 지점
                </FieldLabel>
                <Combobox
                    id="form-reception-office"
                    name="receptionOffice"
                    options={[{value: 'head-office', label: '본점'}]}
                    value="head-office"
                    readOnly
                />
            </Field>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        선택 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        선택값과 readOnly 값 모두 각 Combobox의 name으로 제출됩니다.
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

export default ComboboxFormDemo
