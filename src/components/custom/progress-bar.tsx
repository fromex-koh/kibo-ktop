'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Progress} from '@/components/ui/progress'
import {cn} from '@/lib/utils'

type ProgressBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    color?: string
    label: string
    max?: number
    showValue?: boolean
    value: number
    valueFractionDigits?: number
}

const ProgressBar = ({
    label,
    color,
    max = 100,
    showValue = true,
    value,
    valueFractionDigits = 1,
    className,
    ...props
}: ProgressBarProps) => {
    const normalizedMax = Math.max(1, max)
    const normalizedValue = Math.min(normalizedMax, Math.max(0, value))
    const percentage = (normalizedValue / normalizedMax) * 100
    const fractionDigits = Math.min(6, Math.max(0, valueFractionDigits))
    const valueText = `${percentage.toFixed(fractionDigits)}%`

    return (
        <div {...props} className={cn('flex w-full flex-col gap-2', className)}>
            {showValue ? (
                <span className="typo-body-m-bold text-foreground text-center tabular-nums" aria-hidden="true">
                    {valueText}
                </span>
            ) : null}
            <Progress
                value={percentage}
                max={100}
                aria-label={label}
                aria-valuetext={valueText}
                getValueLabel={() => valueText}
                indicatorStyle={color ? {backgroundColor: color} : undefined}
            />
        </div>
    )
}

export {ProgressBar}
export type {ProgressBarProps}
