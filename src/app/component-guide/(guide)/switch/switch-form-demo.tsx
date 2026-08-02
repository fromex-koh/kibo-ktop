'use client'

import {useState} from 'react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Switch} from '@/components/composite/control-switch'
import {FIELD_FOCUS_RING} from '@/constants/publishing-guide'
import {Field, FieldDescription, FieldLabel} from '@/components/ui/field'

const SwitchFormDemo = () => {
    const [pushEnabled, setPushEnabled] = useState(true)
    const [marketingEnabled, setMarketingEnabled] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
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
                <Button type="submit" size="sm" className="w-fit">
                    설정 내용 확인
                </Button>
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

export default SwitchFormDemo
