'use client'

import type {ReactNode} from 'react'
import {useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Combobox} from '@/components/composite/combobox'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'

const CORP_TYPES = [
    {value: 'corp', label: '주식회사'},
    {value: 'llc', label: '유한회사'},
    {value: 'lp', label: '합자회사'},
    {value: 'general', label: '합명회사'},
    {value: 'llp', label: '유한책임회사'},
]

const StateField = ({id, label, children, error}: {id: string; label: string; children: ReactNode; error?: string}) => (
    <Field data-invalid={error ? true : undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
        <FieldLabel htmlFor={id} className="text-foreground font-bold">
            {label}
        </FieldLabel>
        {children}
        {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
)

export const ComboboxDemo = () => {
    const [value, setValue] = useState('')
    const [dropdownValue, setDropdownValue] = useState('')
    return (
        <div className="grid gap-6">
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="demo-combobox" className="text-foreground font-bold">
                    입력형
                </FieldLabel>
                <Combobox
                    id="demo-combobox"
                    options={CORP_TYPES}
                    value={value}
                    onValueChange={setValue}
                    placeholder="기업형태를 선택하세요"
                    aria-describedby="demo-combobox-help"
                />
                <FieldDescription id="demo-combobox-help">외부 입력창에서 검색하고 선택합니다.</FieldDescription>
            </Field>
            <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                <FieldLabel htmlFor="demo-dropdown-combobox" className="text-foreground font-bold">
                    드롭다운 검색형
                </FieldLabel>
                <Combobox
                    id="demo-dropdown-combobox"
                    type="dropdown"
                    options={CORP_TYPES}
                    value={dropdownValue}
                    onValueChange={setDropdownValue}
                    placeholder="기업형태를 선택하세요"
                    searchPlaceholder="기업형태 검색"
                    aria-describedby="demo-dropdown-combobox-help"
                />
                <FieldDescription id="demo-dropdown-combobox-help">
                    목록을 연 후 드롭다운 내부에서 검색합니다.
                </FieldDescription>
            </Field>
        </div>
    )
}

export const ComboboxStatesDemo = () => {
    const [empty, setEmpty] = useState('')
    const [filled, setFilled] = useState('corp')
    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <StateField id="st-empty" label="기본 (placeholder)">
                <Combobox
                    id="st-empty"
                    options={CORP_TYPES}
                    value={empty}
                    onValueChange={setEmpty}
                    placeholder="선택하세요"
                />
            </StateField>
            <StateField id="st-filled" label="값 선택됨">
                <Combobox id="st-filled" options={CORP_TYPES} value={filled} onValueChange={setFilled} />
            </StateField>
            <StateField id="st-error" label="오류 (error)" error="필수 항목입니다.">
                <Combobox
                    id="st-error"
                    options={CORP_TYPES}
                    value=""
                    placeholder="선택하세요"
                    aria-invalid="true"
                    aria-describedby="st-error-error"
                />
            </StateField>
            <StateField id="st-readonly" label="읽기전용 (readOnly)">
                <Combobox id="st-readonly" options={CORP_TYPES} value="corp" readOnly />
            </StateField>
            <StateField id="st-disabled" label="비활성 (disabled)">
                <Combobox id="st-disabled" options={CORP_TYPES} value="corp" disabled />
            </StateField>
        </div>
    )
}
