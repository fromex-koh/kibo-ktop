'use client'

import {useState, type ComponentProps} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldGroup, FieldLabel} from '@/components/ui/field'

const OPTIONS = [
    {id: 'email', label: '이메일 알림'},
    {id: 'message', label: '문자 알림'},
    {id: 'push', label: '앱 푸시 알림'},
]

const CheckboxIndeterminateDemo = () => {
    const [selected, setSelected] = useState(() => new Set(['email']))
    const parentChecked: ComponentProps<typeof Checkbox>['checked'] =
        selected.size === OPTIONS.length ? true : selected.size === 0 ? false : 'indeterminate'

    const toggleAll = (checked: ComponentProps<typeof Checkbox>['checked']) => {
        setSelected(checked === true ? new Set(OPTIONS.map(({id}) => id)) : new Set())
    }

    const toggleOption = (id: string, checked: ComponentProps<typeof Checkbox>['checked']) => {
        setSelected((current) => {
            const next = new Set(current)
            if (checked === true) next.add(id)
            else next.delete(id)
            return next
        })
    }

    return (
        <FieldGroup className="gap-3">
            <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                <Checkbox
                    id="notification-all"
                    checked={parentChecked}
                    onCheckedChange={toggleAll}
                    aria-labelledby="notification-all-label"
                />
                <FieldLabel
                    id="notification-all-label"
                    htmlFor="notification-all"
                    className="text-foreground font-bold"
                >
                    알림 전체 선택
                </FieldLabel>
            </Field>
            <FieldGroup className="border-border ml-3 gap-2 border-l pl-5">
                {OPTIONS.map(({id, label}) => (
                    <Field key={id} orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <Checkbox
                            id={`notification-${id}`}
                            aria-labelledby={`notification-${id}-label`}
                            checked={selected.has(id)}
                            onCheckedChange={(checked) => toggleOption(id, checked)}
                        />
                        <FieldLabel id={`notification-${id}-label`} htmlFor={`notification-${id}`}>
                            {label}
                        </FieldLabel>
                    </Field>
                ))}
            </FieldGroup>
        </FieldGroup>
    )
}

export default CheckboxIndeterminateDemo
