'use client'

import {useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {TextareaCounter} from '@/components/composite/textarea-counter'
import {Field, FieldDescription, FieldLabel} from '@/components/ui/field'

const TextareaCounterDemo = () => {
    const [message, setMessage] = useState('')

    return (
        <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
            <FieldLabel htmlFor="demo-msg" className="text-foreground gap-1 font-bold">
                문의 내용
                <span aria-hidden="true" className="text-error-500">
                    *
                </span>
                <span className="sr-only"> (필수)</span>
            </FieldLabel>
            <TextareaCounter
                id="demo-msg"
                required
                maxLength={100}
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                placeholder="내용을 입력하세요"
                aria-describedby="demo-msg-help"
                footer={<FieldDescription id="demo-msg-help">문의 내용을 100자 이내로 입력해 주세요.</FieldDescription>}
            />
        </Field>
    )
}

export default TextareaCounterDemo
