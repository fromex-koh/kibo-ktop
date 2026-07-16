'use client'

import * as React from 'react'
import {type VariantProps} from 'class-variance-authority'
import {ToggleGroup as ToggleGroupPrimitive} from 'radix-ui'
import {toggleVariants} from '@/components/theme/toggle.variants'
import {toggleGroupClassName, toggleGroupItemClassName, toggleGroupItemSegmentedClassName, toggleGroupSegmentedClassName} from '@/components/theme/toggle-group.variants'
import {cn} from '@/lib/utils'

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants> & {spacing?: number; orientation?: 'horizontal' | 'vertical'}>({size: 'default', variant: 'default', spacing: 2, orientation: 'horizontal'})

function ToggleGroup({className, variant, size, spacing = 2, orientation = 'horizontal', children, ...props}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants> & {spacing?: number; orientation?: 'horizontal' | 'vertical'}) {
    const groupStyle: React.CSSProperties & Record<`--${string}`, string | number> = {'--gap': spacing}
    return (
        <ToggleGroupPrimitive.Root data-slot="toggle-group" data-variant={variant} data-size={size} data-spacing={spacing} data-orientation={orientation} style={groupStyle} className={cn(toggleGroupClassName, toggleGroupSegmentedClassName, className)} {...props}>
            <ToggleGroupContext.Provider value={{variant, size, spacing, orientation}}>{children}</ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    )
}

function ToggleGroupItem({className, children, variant = 'default', size = 'default', ...props}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
    const context = React.useContext(ToggleGroupContext)
    return (
        <ToggleGroupPrimitive.Item data-slot="toggle-group-item" data-variant={context.variant || variant} data-size={context.size || size} data-spacing={context.spacing} className={cn(toggleGroupItemClassName, toggleVariants({variant: context.variant || variant, size: context.size || size}), toggleGroupItemSegmentedClassName, className)} {...props}>{children}</ToggleGroupPrimitive.Item>
    )
}

export {ToggleGroup, ToggleGroupItem}
