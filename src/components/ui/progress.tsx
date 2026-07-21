'use client'

import * as React from 'react'
import {Progress as ProgressPrimitive} from 'radix-ui'
import {cn} from '@/lib/utils'

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorStyle?: React.CSSProperties
}

const Progress = ({
    className,
    value = 0,
    max = 100,
    indicatorStyle,
    ...props
}: ProgressProps) => {
    const normalizedMax = Math.max(1, max ?? 100)
    const normalizedValue = Math.min(normalizedMax, Math.max(0, value ?? 0))
    const percentage = (normalizedValue / normalizedMax) * 100

    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn('bg-muted relative h-2 w-full overflow-hidden rounded-full', className)}
            value={normalizedValue}
            max={normalizedMax}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full w-full rounded-full transition-transform"
                style={{...indicatorStyle, transform: `translateX(-${100 - percentage}%)`}}
            />
        </ProgressPrimitive.Root>
    )
}

export {Progress}
export type {ProgressProps}
