'use client'

import {createContext, useContext, type ComponentProps} from 'react'
import {
    Select as PrimitiveSelect,
    SelectContent as PrimitiveSelectContent,
    SelectGroup,
    SelectItem as PrimitiveSelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger as PrimitiveSelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {selectContentClassName, selectItemClassName, selectTriggerClassName} from '@/components/theme/select.variants'
import {cn} from '@/lib/utils'

type SelectFieldProps = ComponentProps<typeof PrimitiveSelect> & {readOnly?: boolean}
type SelectTriggerProps = Omit<ComponentProps<typeof PrimitiveSelectTrigger>, 'size'> & {
    size?: 'lg' | 'md'
}

const SelectFieldReadOnlyContext = createContext(false)

function SelectField({readOnly = false, open, defaultOpen, onOpenChange, onValueChange, ...props}: SelectFieldProps) {
    return (
        <SelectFieldReadOnlyContext.Provider value={readOnly}>
            <PrimitiveSelect
                open={readOnly ? false : open}
                defaultOpen={readOnly ? false : defaultOpen}
                onOpenChange={(nextOpen) => {
                    if (!readOnly) onOpenChange?.(nextOpen)
                }}
                onValueChange={(value) => {
                    if (!readOnly) onValueChange?.(value)
                }}
                {...props}
            />
        </SelectFieldReadOnlyContext.Provider>
    )
}

function SelectTrigger({className, size = 'lg', ...props}: SelectTriggerProps) {
    const readOnly = useContext(SelectFieldReadOnlyContext)

    return (
        <PrimitiveSelectTrigger
            {...props}
            size="default"
            data-project-size={size}
            aria-readonly={readOnly || undefined}
            className={cn(selectTriggerClassName, className)}
        />
    )
}

// PROJECT-STYLE: 시안 드롭다운(40006671:23294)은 목록이 트리거 '아래' 4px 자리에 트리거와 같은 폭으로 열린다.
// 셸 기본값 item-aligned 는 선택된 항목을 트리거에 겹쳐 띄우고 폭도 min-w-36(144) 고정이라 시안과 다르다.
// popper 로 두면 셸이 준비해 둔 규칙이 켜진다 — translate-y-1(4px) 과 min-w-(--radix-select-trigger-width).
// 사용처에서 필요하면 position 을 넘겨 덮을 수 있다.
function SelectContent({className, position = 'popper', ...props}: ComponentProps<typeof PrimitiveSelectContent>) {
    return <PrimitiveSelectContent position={position} {...props} className={cn(selectContentClassName, className)} />
}

function SelectItem({className, ...props}: ComponentProps<typeof PrimitiveSelectItem>) {
    return <PrimitiveSelectItem {...props} className={cn(selectItemClassName, className)} />
}

export {
    SelectField,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
}
export {SelectField as Select}
export type {SelectFieldProps, SelectTriggerProps}
