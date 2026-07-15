'use client'

import type {ReactNode} from 'react'
import {useState} from 'react'
import {DatePicker} from '@/components/composite/date-picker'
import {Label} from '@/components/kit/label'

const FIELD_DEMO_CLASS = 'max-w-90 flex w-full flex-col gap-2'
const FIELD_LABEL_CLASS = 'text-foreground font-bold'

// 데이트피커 데모 — 선택 값을 상태로 관리한다(controlled).
const DatePickerDemo = () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
        <div className={FIELD_DEMO_CLASS}>
            <Label htmlFor="demo-date" className={FIELD_LABEL_CLASS}>
                날짜 선택
            </Label>
            <DatePicker id="demo-date" value={date} onChange={setDate} />
        </div>
    )
}

// 상태 필드 wrapper — Label + 컨트롤(Input 상태 가이드와 동일 구조).
const StateField = ({id, label, children}: {id: string; label: string; children: ReactNode}) => (
    <div className={FIELD_DEMO_CLASS}>
        <Label htmlFor={id} className={FIELD_LABEL_CLASS}>
            {label}
        </Label>
        {children}
    </div>
)

// 상태 큐레이션 — 기본(placeholder)·값 입력됨·읽기전용·비활성.
// 읽기전용/비활성은 고정 표본 날짜(2026-07-13)를 값으로 둔다.
const SAMPLE_DATE = new Date(2026, 6, 13)

export const DatePickerStatesDemo = () => {
    const [empty, setEmpty] = useState<Date | undefined>(undefined)
    const [filled, setFilled] = useState<Date | undefined>(SAMPLE_DATE)
    return (
        <div className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2">
            <StateField id="st-empty" label="기본 (placeholder)">
                <DatePicker id="st-empty" value={empty} onChange={setEmpty} />
            </StateField>
            <StateField id="st-filled" label="값 입력됨">
                <DatePicker id="st-filled" value={filled} onChange={setFilled} />
            </StateField>
            <StateField id="st-readonly" label="읽기전용 (readOnly)">
                <DatePicker id="st-readonly" value={SAMPLE_DATE} readOnly />
            </StateField>
            <StateField id="st-disabled" label="비활성 (disabled)">
                <DatePicker id="st-disabled" value={SAMPLE_DATE} disabled />
            </StateField>
        </div>
    )
}

export default DatePickerDemo
