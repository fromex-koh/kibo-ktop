'use client'

import * as React from 'react'
import {CheckIcon, XIcon} from 'lucide-react'
import {Switch as SwitchPrimitive} from 'radix-ui'
import {switchRootClassName, switchThumbClassName} from '@/components/theme/switch.variants'
import {cn} from '@/lib/utils'

type SwitchSize = 'large' | 'medium' | 'small' | 'default' | 'sm' | 'xsmall' | '2xsmall'

// PROJECT-STYLE: shadcn Switch 셸은 유지하고 프로젝트 크기·상태 스타일은 theme에서 주입한다.
function Switch({className, size = 'large', ...props}: React.ComponentProps<typeof SwitchPrimitive.Root> & {size?: SwitchSize}) {
    const visualSize = size === 'default' ? 'large' : size === 'sm' || size === '2xsmall' ? 'small' : size === 'xsmall' ? 'medium' : size
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={visualSize}
            className={cn(
                switchRootClassName,
                'data-[size=large]:h-control-h-md data-[size=medium]:h-control-h-sm data-[size=small]:h-control-h-xs data-[size=large]:w-18 data-[size=medium]:w-16 data-[size=small]:w-14',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    switchThumbClassName,
                    'group-data-[size=large]/switch:size-8 group-data-[size=medium]/switch:size-7 group-data-[size=small]/switch:size-6',
                    'group-data-[size=large]/switch:data-[state=checked]:translate-x-8 group-data-[size=medium]/switch:data-[state=checked]:translate-x-7 group-data-[size=small]/switch:data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0',
                )}
            >
                <CheckIcon aria-hidden="true" className="group-data-disabled/switch:text-disabled hidden size-5 group-data-[size=small]/switch:size-4 group-data-[state=checked]/thumb:block" strokeWidth={3} />
                <XIcon aria-hidden="true" className="group-data-disabled/switch:text-disabled block size-5 group-data-[size=small]/switch:size-4 group-data-[state=checked]/thumb:hidden" strokeWidth={2.75} />
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    )
}

export {Switch}
