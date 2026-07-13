'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {useState} from 'react'
import {format} from 'date-fns'
import {ko} from 'date-fns/locale'
import {CalendarIcon} from 'lucide-react'
import {Calendar} from '@/components/kit/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/kit/popover'
import {cn} from '@/lib/utils'

// 데이트피커 — kit Input 의 스타일을 그대로 입힌 트리거 버튼 + kit Popover·Calendar 조합(L2 composite).
// 클릭하면 달력이 열리고, 날짜를 고르면 트리거에 yyyy-MM-dd 로 표시되며 달력이 닫힌다.
// 값은 controlled(value/onChange). 트리거 스타일은 kit/input 과 시각적으로 통일한다(높이 48px·rounded-sm·
// border-input·bg-surface·px-4·text-base·점선 포커스). 비어 있으면 placeholder 색(text-placeholder).
// 상태(Input 과 동일): disabled = bg-muted + 흐림 + 클릭 불가, readOnly = 값은 보이되 달력이 안 열리고
//   bg-muted(흐림 없음). native readonly 가 없는 button 이라 readOnly 는 open 차단 + data-readonly 스타일로 구현.
type DatePickerProps = {
    value?: Date
    onChange?: (date?: Date) => void
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    id?: string
    className?: string
} & Pick<ComponentPropsWithoutRef<'button'>, 'aria-invalid' | 'aria-describedby' | 'name'>

const DatePicker = ({
    value,
    onChange,
    placeholder = '연도-월-일',
    disabled,
    readOnly,
    id,
    className,
    ...props
}: DatePickerProps) => {
    const [open, setOpen] = useState(false)
    return (
        <Popover open={open} onOpenChange={(next) => !readOnly && setOpen(next)}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    id={id}
                    disabled={disabled}
                    data-slot="date-picker-trigger"
                    data-readonly={readOnly || undefined}
                    className={cn(
                        'h-control-h-lg border-input bg-surface flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm border px-4 text-base transition-colors outline-none',
                        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted',
                        'aria-invalid:border-destructive',
                        'data-[readonly]:bg-muted data-[readonly]:cursor-default',
                        'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    {...props}
                >
                    <span className={value ? 'text-foreground' : 'text-placeholder'}>
                        {value ? format(value, 'yyyy-MM-dd') : placeholder}
                    </span>
                    <CalendarIcon aria-hidden="true" className="text-muted-foreground size-icon-md shrink-0" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                        onChange?.(date)
                        setOpen(false)
                    }}
                    locale={ko}
                />
            </PopoverContent>
        </Popover>
    )
}

export {DatePicker}
export type {DatePickerProps}
