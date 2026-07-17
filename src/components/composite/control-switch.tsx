'use client'

import type {ComponentProps} from 'react'

import {Switch as PrimitiveSwitch} from '@/components/ui/switch'
import {cn} from '@/lib/utils'

type ControlSwitchSize = 'lg' | 'md' | 'sm'
type ControlSwitchProps = Omit<ComponentProps<typeof PrimitiveSwitch>, 'size'> & {size?: ControlSwitchSize}

function ControlSwitch({className, size = 'md', ...props}: ControlSwitchProps) {
    const primitiveSize = size === 'sm' ? 'sm' : 'default'
    const sizeStyles =
        size === 'lg'
            ? 'data-[size=default]:h-control-h-md data-[size=default]:w-18 data-[size=default]:[&>[data-slot=switch-thumb]]:size-8 data-[size=default]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-8'
            : size === 'sm'
              ? 'data-[size=sm]:h-control-h-xs data-[size=sm]:w-14 data-[size=sm]:[&>[data-slot=switch-thumb]]:size-6 data-[size=sm]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-6'
              : 'data-[size=default]:h-control-h-sm data-[size=default]:w-16 data-[size=default]:[&>[data-slot=switch-thumb]]:size-7 data-[size=default]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-7'

    return (
        <PrimitiveSwitch
            {...props}
            size={primitiveSize}
            className={cn(
                'peer group/switch focus-visible:outline-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground-subtle data-disabled:bg-control-disabled data-[disabled]:bg-control-disabled disabled:bg-control-disabled disabled:data-[state=checked]:bg-control-disabled disabled:data-[state=unchecked]:bg-control-disabled data-disabled:data-[state=checked]:bg-control-disabled data-disabled:data-[state=unchecked]:bg-control-disabled [&>[data-slot=switch-thumb]]:bg-surface data-disabled:[&>[data-slot=switch-thumb]]:bg-surface data-[disabled]:[&>[data-slot=switch-thumb]]:bg-surface disabled:[&>[data-slot=switch-thumb]]:bg-surface relative inline-flex shrink-0 items-center rounded-full border border-transparent p-1 transition-colors focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:opacity-100 data-disabled:opacity-100 data-[disabled]:opacity-100',
                sizeStyles,
                className,
            )}
        />
    )
}

export {ControlSwitch, ControlSwitch as Switch}
export type {ControlSwitchProps, ControlSwitchSize}
