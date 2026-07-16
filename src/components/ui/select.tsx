'use client'

import * as React from 'react'
import {Select as SelectPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'
import {ChevronDownIcon, CheckIcon, ChevronUpIcon} from 'lucide-react'
import {
    selectContentClassName,
    selectContentPopperClassName,
    selectGroupClassName,
    selectItemClassName,
    selectItemIconClassName,
    selectItemIndicatorClassName,
    selectLabelClassName,
    selectScrollButtonClassName,
    selectSeparatorClassName,
    selectTriggerClassName,
    selectTriggerIconClassName,
    selectViewportClassName,
} from '@/components/theme/select.variants'

const SelectReadOnlyContext = React.createContext(false)

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
    readOnly?: boolean
}

function Select({readOnly = false, open, defaultOpen, onOpenChange, onValueChange, ...props}: SelectProps) {
    return (
        <SelectReadOnlyContext.Provider value={readOnly}>
            <SelectPrimitive.Root
                data-slot="select"
                open={readOnly ? false : open}
                defaultOpen={readOnly ? false : defaultOpen}
                onOpenChange={(open) => {
                    if (readOnly) return
                    onOpenChange?.(open)
                }}
                onValueChange={(value) => {
                    if (readOnly) return
                    onValueChange?.(value)
                }}
                {...props}
            />
        </SelectReadOnlyContext.Provider>
    )
}

function SelectGroup({className, ...props}: React.ComponentProps<typeof SelectPrimitive.Group>) {
    return <SelectPrimitive.Group data-slot="select-group" className={cn(selectGroupClassName, className)} {...props} />
}

function SelectValue({...props}: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
    className,
    size = 'default',
    children,
    'aria-readonly': ariaReadOnly,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'md' | 'default'
}) {
    const readOnly = useSelectReadOnly()

    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            aria-readonly={readOnly || ariaReadOnly || undefined}
            className={cn(selectTriggerClassName, className)}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon className={selectTriggerIconClassName} />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
}

function useSelectReadOnly() {
    return React.useContext(SelectReadOnlyContext)
}

function SelectContent({
    className,
    children,
    position = 'item-aligned',
    align = 'center',
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                data-align-trigger={position === 'item-aligned'}
                className={cn(
                    selectContentClassName,
                    position === 'popper' &&
                        selectContentPopperClassName,
                    className,
                )}
                position={position}
                align={align}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    data-position={position}
                    className={selectViewportClassName}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
}

function SelectLabel({className, ...props}: React.ComponentProps<typeof SelectPrimitive.Label>) {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn(selectLabelClassName, className)}
            {...props}
        />
    )
}

function SelectItem({className, children, ...props}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(selectItemClassName, className)}
            {...props}
        >
            <span className={selectItemIndicatorClassName}>
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className={selectItemIconClassName} />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
}

function SelectSeparator({className, ...props}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(selectSeparatorClassName, className)}
            {...props}
        />
    )
}

function SelectScrollUpButton({className, ...props}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn(selectScrollButtonClassName, className)}
            {...props}
        >
            <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
    )
}

function SelectScrollDownButton({className, ...props}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn(selectScrollButtonClassName, className)}
            {...props}
        >
            <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
    )
}

export {
    Select,
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
