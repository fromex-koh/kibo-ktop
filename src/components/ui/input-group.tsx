'use client'

import * as React from 'react'
import {type VariantProps} from 'class-variance-authority'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {
    inputGroupAddonVariants,
    inputGroupButtonVariants,
    inputGroupClassName,
    inputGroupInputClassName,
    inputGroupTextClassName,
    inputGroupTextareaClassName,
} from '@/components/theme/input-group.variants'
import {cn} from '@/lib/utils'

function InputGroup({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-group"
            role="group"
            className={cn(inputGroupClassName, className)}
            {...props}
        />
    )
}

function InputGroupAddon({
    className,
    align = 'inline-start',
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({align}), className)}
            onClick={(event) => {
                const target = event.target
                if (target instanceof Element && target.closest('button')) return
                event.currentTarget.parentElement?.querySelector('input')?.focus()
            }}
            {...props}
        />
    )
}

function InputGroupButton({
    className,
    type = 'button',
    variant = 'ghost',
    size = 'xs',
    ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> & VariantProps<typeof inputGroupButtonVariants>) {
    return (
        <Button
            type={type}
            data-size={size}
            variant={variant}
            size={size}
            className={cn(inputGroupButtonVariants({size}), className)}
            {...props}
        />
    )
}

function InputGroupText({className, ...props}: React.ComponentProps<'span'>) {
    return <span className={cn(inputGroupTextClassName, className)} {...props} />
}

function InputGroupInput({className, ...props}: React.ComponentProps<'input'>) {
    return <Input data-slot="input-group-control" className={cn(inputGroupInputClassName, className)} {...props} />
}

function InputGroupTextarea({className, ...props}: React.ComponentProps<'textarea'>) {
    return (
        <Textarea data-slot="input-group-control" className={cn(inputGroupTextareaClassName, className)} {...props} />
    )
}

export {InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea}
