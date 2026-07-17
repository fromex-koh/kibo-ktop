'use client'

import {useId, useState, type ComponentProps, type ReactNode} from 'react'
import {Textarea} from '@/components/ui/textarea'
import {
    textareaCounterContainerClassName,
    textareaCounterControlClassName,
    textareaCounterCountClassName,
    textareaCounterCurrentClassName,
    textareaCounterFooterClassName,
    textareaCounterLimitClassName,
    textareaCounterMessageClassName,
} from '@/components/theme/textarea-counter.variants'
import {cn} from '@/lib/utils'

type TextareaCounterProps = ComponentProps<typeof Textarea> & {
    maxLength: number
    containerClassName?: string
    footer?: ReactNode
}

const TextareaCounter = ({
    className,
    containerClassName,
    footer,
    defaultValue,
    value,
    maxLength,
    onChange,
    'aria-describedby': ariaDescribedBy,
    ...props
}: TextareaCounterProps) => {
    const counterId = useId()
    const [uncontrolledLength, setUncontrolledLength] = useState(() => String(defaultValue ?? '').length)
    const currentLength = value === undefined ? uncontrolledLength : String(value).length
    const describedBy = [ariaDescribedBy, counterId].filter(Boolean).join(' ')

    return (
        <div className={cn(textareaCounterContainerClassName, containerClassName)}>
            <Textarea
                {...props}
                className={cn(textareaCounterControlClassName, className)}
                defaultValue={defaultValue}
                value={value}
                maxLength={maxLength}
                aria-describedby={describedBy}
                onChange={(event) => {
                    if (value === undefined) setUncontrolledLength(event.currentTarget.value.length)
                    onChange?.(event)
                }}
            />
            <div className={textareaCounterFooterClassName}>
                <div className={textareaCounterMessageClassName}>{footer}</div>
                <span
                    id={counterId}
                    className={cn('typo-body-m-regular', textareaCounterCountClassName)}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <span className="sr-only">
                        현재 {currentLength}자, 최대 {maxLength}자
                    </span>
                    <span aria-hidden="true" className={textareaCounterCurrentClassName}>
                        {currentLength}
                    </span>
                    <span aria-hidden="true" className={textareaCounterLimitClassName}>
                        {' '}
                        / {maxLength}
                    </span>
                </span>
            </div>
        </div>
    )
}

export {TextareaCounter}
export type {TextareaCounterProps}
