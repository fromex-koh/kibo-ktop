'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'

const SegmentedControlFormDemo = () => {
    const [memberType, setMemberType] = useState('')
    const [memberTypeError, setMemberTypeError] = useState(false)
    const [result, setResult] = useState('')

    return (
        <form
            noValidate
            className="border-border flex flex-col items-start gap-6 rounded-md border p-6"
            onSubmit={(event) => {
                event.preventDefault()
                if (!memberType) {
                    setMemberTypeError(true)
                    const firstRadio = event.currentTarget.querySelector('#member-type-corp')
                    if (firstRadio instanceof HTMLElement) firstRadio.focus()
                    return
                }

                setMemberTypeError(false)
                const formData = new FormData(event.currentTarget)
                setResult(JSON.stringify(Object.fromEntries(formData.entries())))
            }}
        >
            <Field data-invalid={memberTypeError || undefined} className="max-w-90 items-start">
                <FieldLabel
                    id="member-type-label"
                    htmlFor="member-type-corp"
                    className="text-foreground gap-1 font-bold"
                >
                    회원 유형
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only">필수</span>
                </FieldLabel>
                <div className="w-fit">
                    <SegmentedControl
                        type="radio"
                        name="memberType"
                        value={memberType}
                        onValueChange={(value) => {
                            setMemberType(value)
                            setMemberTypeError(false)
                        }}
                        required
                        aria-labelledby="member-type-label"
                        aria-invalid={memberTypeError || undefined}
                        aria-describedby={memberTypeError ? 'member-type-error' : undefined}
                    >
                        <SegmentedControlItem id="member-type-corp" value="corp">
                            기업
                        </SegmentedControlItem>
                        <SegmentedControlItem value="org">기관</SegmentedControlItem>
                    </SegmentedControl>
                </div>
                {memberTypeError ? <FieldError id="member-type-error">회원 유형을 선택해 주세요.</FieldError> : null}
            </Field>

            <Field className="max-w-90 items-start">
                <FieldLabel
                    id="notification-channel-label"
                    htmlFor="notification-channel-email"
                    className="text-foreground font-bold"
                >
                    알림 수신 방식 (선택)
                </FieldLabel>
                <div className="w-fit">
                    <SegmentedControl
                        type="radio"
                        name="notificationChannel"
                        aria-labelledby="notification-channel-label"
                    >
                        <SegmentedControlItem id="notification-channel-email" value="email">
                            이메일
                        </SegmentedControlItem>
                        <SegmentedControlItem value="sms">문자</SegmentedControlItem>
                    </SegmentedControl>
                </div>
            </Field>

            <Button type="submit" variant="default" size="md">
                선택 내용 확인
            </Button>

            {result ? (
                <output className="typo-body-l-regular bg-background border-border rounded-sm border px-4 py-3 font-mono">
                    {result}
                </output>
            ) : null}
        </form>
    )
}

export default SegmentedControlFormDemo
