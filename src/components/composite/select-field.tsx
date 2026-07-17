'use client'

import {createContext, useContext, type ComponentProps} from 'react'
import {
    Select as PrimitiveSelect,
    SelectContent,
    SelectGroup,
    SelectItem as PrimitiveSelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger as PrimitiveSelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {selectItemClassName, selectTriggerClassName} from '@/components/theme/select.variants'
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
