'use client'

import {useState} from 'react'
import {EmailField} from '@/components/composite/email-field'
import {
    FormResetButton,
    FormSubmitResult,
    formatSubmitResult,
    withFormReset,
    type FormResetProps,
} from '@/components/custom/form-submit-result'
import {Button} from '@/components/ui/button'

// 이메일 입력의 폼 제출 예시 — 화면의 세 칸이 name 하나(합친 주소)와 {name}Preset(셀렉트 값)으로 제출되는 것을 보여 준다.
// required 는 보이는 두 칸에 걸리므로 비어 있으면 브라우저 검사가 제출을 막는다.
const EmailFieldFormDemoBody = ({onReset}: FormResetProps) => {
    const [submittedData, setSubmittedData] = useState<string | null>(null)

    return (
        <form
            className="flex flex-col gap-4"
            autoComplete="off"
            onReset={onReset}
            onSubmit={(event) => {
                event.preventDefault()
                setSubmittedData(formatSubmitResult(Object.fromEntries(new FormData(event.currentTarget))))
            }}
        >
            <EmailField name="contactEmail" required />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="sm">
                        입력 내용 확인
                    </Button>
                    <FormResetButton />
                </div>
                <FormSubmitResult data={submittedData} />
            </div>
        </form>
    )
}

const EmailFieldFormDemo = withFormReset(EmailFieldFormDemoBody)

export default EmailFieldFormDemo
