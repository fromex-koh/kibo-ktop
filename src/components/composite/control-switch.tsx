'use client'

import type {ComponentProps} from 'react'

import {Switch as PrimitiveSwitch} from '@/components/ui/switch'
import {controlSwitchClassName, controlSwitchSizeClassNames} from '@/components/theme/switch.variants'
import {cn} from '@/lib/utils'

type ControlSwitchSize = 'lg' | 'md' | 'sm'
type ControlSwitchProps = Omit<ComponentProps<typeof PrimitiveSwitch>, 'size'> & {size?: ControlSwitchSize}

function ControlSwitch({className, size = 'md', ...props}: ControlSwitchProps) {
    const primitiveSize = size === 'sm' ? 'sm' : 'default'

    return (
        <PrimitiveSwitch
            {...props}
            size={primitiveSize}
            className={cn(controlSwitchClassName, controlSwitchSizeClassNames[size], className)}
        />
    )
}

export {ControlSwitch, ControlSwitch as Switch}
export type {ControlSwitchProps, ControlSwitchSize}
