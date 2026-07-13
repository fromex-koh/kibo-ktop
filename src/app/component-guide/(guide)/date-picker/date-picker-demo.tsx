'use client'

import {useState} from 'react'
import {DatePicker} from '@/components/composite/date-picker'
import {Label} from '@/components/kit/label'

// 데이트피커 데모 — 선택 값을 상태로 관리한다(controlled).
const DatePickerDemo = () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    return (
        <div className="flex max-w-90 flex-col gap-2">
            <Label htmlFor="demo-date" className="text-foreground gap-1 font-bold">
                날짜 선택
            </Label>
            <DatePicker id="demo-date" value={date} onChange={setDate} />
        </div>
    )
}

export default DatePickerDemo
