'use client'

import {
    FormResetButton,
    FormSubmitResult,
    formatSubmitResult,
    withFormReset,
    type FormResetProps,
} from '@/components/custom/form-submit-result'
import {useState} from 'react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Switch} from '@/components/composite/control-switch'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {Field, FieldDescription, FieldLabel} from '@/components/ui/field'

const SwitchFormDemoBody = ({onReset}: FormResetProps) => {
    const [pushEnabled, setPushEnabled] = useState(true)
    const [marketingEnabled, setMarketingEnabled] = useState(false)
    const [submittedData, setSubmittedData] = useState<string | null>(null)

    return (
        <form
            onReset={onReset}
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    formatSubmitResult({
                        pushNotification: formData.has('pushNotification'),
                        marketingNotification: formData.has('marketingNotification'),
                    }),
                )
            }}
        >
            <div className="flex flex-col gap-4">
                <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                    <Switch
                        id="form-push-notification"
                        name="pushNotification"
                        checked={pushEnabled}
                        onCheckedChange={setPushEnabled}
                    />
                    <FieldLabel htmlFor="form-push-notification">푸시 알림 받기</FieldLabel>
                </Field>
                <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                    <Switch
                        id="form-marketing-notification"
                        name="marketingNotification"
                        checked={marketingEnabled}
                        onCheckedChange={setMarketingEnabled}
                    />
                    <FieldLabel htmlFor="form-marketing-notification">마케팅 정보 수신</FieldLabel>
                </Field>
            </div>
            <FieldDescription>
                켜진 Switch만 FormData에 포함되므로 FormData.has()로 true·false 값으로 변환합니다.
            </FieldDescription>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" size="sm" className="w-fit">
                        설정 내용 확인
                    </Button>
                    <FormResetButton />
                </div>
                <FormSubmitResult data={submittedData} />
            </div>
        </form>
    )
}

const SwitchFormDemo = withFormReset(SwitchFormDemoBody)

export default SwitchFormDemo
