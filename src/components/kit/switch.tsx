'use client'

import * as React from 'react'
import {CheckIcon, XIcon} from 'lucide-react'
import {Switch as SwitchPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

// PROJECT-STYLE: Figma switch on/off 아이콘과 Button small/xsmall/2xsmall 높이에 맞춘 크기를 kit styled copy에서 책임진다.
// 색은 primary/surface/foreground-subtle/disabled 계열 슬롯으로 연결해 직접 팔레트 유틸을 두지 않는다.
type SwitchSize = 'large' | 'medium' | 'small' | 'default' | 'sm' | 'xsmall' | '2xsmall'

function Switch({
    className,
    size = 'large',
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: SwitchSize
}) {
    const visualSize =
        size === 'default'
            ? 'large'
            : size === 'sm' || size === '2xsmall'
              ? 'small'
              : size === 'xsmall'
                ? 'medium'
                : size

    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={visualSize}
            className={cn(
                'peer group/switch focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground-subtle data-disabled:bg-control-disabled data-disabled:data-[state=checked]:bg-control-disabled data-disabled:data-[state=unchecked]:bg-control-disabled relative inline-flex shrink-0 items-center rounded-full border border-transparent p-1 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid aria-invalid:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-100',
                'data-[size=large]:h-control-h-md data-[size=medium]:h-control-h-sm data-[size=small]:h-control-h-xs data-[size=large]:w-18 data-[size=medium]:w-16 data-[size=small]:w-14',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    'group/thumb bg-surface text-foreground-subtle data-[state=checked]:text-primary group-data-disabled/switch:bg-disabled-subtle group-data-disabled/switch:text-disabled pointer-events-none flex items-center justify-center rounded-full ring-0 transition-transform',
                    'group-data-[size=large]/switch:size-8 group-data-[size=medium]/switch:size-7 group-data-[size=small]/switch:size-6',
                    'group-data-[size=large]/switch:data-[state=checked]:translate-x-8 group-data-[size=medium]/switch:data-[state=checked]:translate-x-7 group-data-[size=small]/switch:data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0',
                )}
            >
                <CheckIcon
                    aria-hidden="true"
                    className="group-data-disabled/switch:text-disabled hidden size-5 group-data-[size=small]/switch:size-4 group-data-[state=checked]/thumb:block"
                    strokeWidth={3}
                />
                <XIcon
                    aria-hidden="true"
                    className="group-data-disabled/switch:text-disabled block size-5 group-data-[size=small]/switch:size-4 group-data-[state=checked]/thumb:hidden"
                    strokeWidth={2.75}
                />
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    )
}

export {Switch}
