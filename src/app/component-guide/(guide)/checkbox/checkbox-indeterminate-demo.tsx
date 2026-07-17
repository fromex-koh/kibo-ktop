'use client'

import {useState, type ComponentProps} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Label} from '@/components/ui/label'

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
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Checkbox id="notification-all" checked={parentChecked} onCheckedChange={toggleAll} />
                <Label htmlFor="notification-all" className="text-foreground font-bold">
                    알림 전체 선택
                </Label>
            </div>
            <div className="border-border ml-3 flex flex-col gap-2 border-l pl-5">
                {OPTIONS.map(({id, label}) => (
                    <div key={id} className="flex items-center gap-2">
                        <Checkbox
                            id={`notification-${id}`}
                            checked={selected.has(id)}
                            onCheckedChange={(checked) => toggleOption(id, checked)}
                        />
                        <Label htmlFor={`notification-${id}`}>{label}</Label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CheckboxIndeterminateDemo
