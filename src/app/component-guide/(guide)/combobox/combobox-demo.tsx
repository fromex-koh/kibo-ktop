'use client'

import type {ReactNode} from 'react'
import {useState} from 'react'
import {Combobox} from '@/components/composite/combobox'
import {Label} from '@/components/kit/label'

const CORP_TYPES = [
    {value: 'corp', label: '주식회사'},
    {value: 'llc', label: '유한회사'},
    {value: 'lp', label: '합자회사'},
    {value: 'general', label: '합명회사'},
    {value: 'llp', label: '유한책임회사'},
]

// 필드 wrapper — Label + 컨트롤. w-full max-w-90(360px) 로 Input/Select/DatePicker 필드와 동일.
const Field = ({id, label, children}: {id: string; label: string; children: ReactNode}) => (
    <div className="flex w-full max-w-90 flex-col gap-2">
        <Label htmlFor={id} className="text-foreground font-bold">
            {label}
        </Label>
        {children}
    </div>
)

// 사용 예시 — Label + Combobox(제어). 열면 검색 입력 + 필터된 목록.
export const ComboboxDemo = () => {
    const [value, setValue] = useState('')
    return (
        <Field id="demo-combobox" label="기업형태">
            <Combobox
                id="demo-combobox"
                options={CORP_TYPES}
                value={value}
                onValueChange={setValue}
                placeholder="기업형태를 선택하세요"
                searchPlaceholder="기업형태 검색..."
            />
        </Field>
    )
}

// 상태 큐레이션 — 기본(placeholder)·값 선택됨·오류·읽기전용·비활성.
export const ComboboxStatesDemo = () => {
    const [empty, setEmpty] = useState('')
    const [filled, setFilled] = useState('corp')
    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Field id="st-empty" label="기본 (placeholder)">
                <Combobox
                    id="st-empty"
                    options={CORP_TYPES}
                    value={empty}
                    onValueChange={setEmpty}
                    placeholder="선택하세요"
                />
            </Field>
            <Field id="st-filled" label="값 선택됨">
                <Combobox id="st-filled" options={CORP_TYPES} value={filled} onValueChange={setFilled} />
            </Field>
            <Field id="st-error" label="오류 (error)">
                <Combobox
                    id="st-error"
                    options={CORP_TYPES}
                    value=""
                    placeholder="선택하세요"
                    aria-invalid="true"
                    aria-describedby="st-error-msg"
                />
                <p id="st-error-msg" role="alert" className="typo-caption-regular text-error-500">
                    필수 항목입니다.
                </p>
            </Field>
            <Field id="st-readonly" label="읽기전용 (readOnly)">
                <Combobox id="st-readonly" options={CORP_TYPES} value="corp" readOnly />
            </Field>
            <Field id="st-disabled" label="비활성 (disabled)">
                <Combobox id="st-disabled" options={CORP_TYPES} value="corp" disabled />
            </Field>
        </div>
    )
}
