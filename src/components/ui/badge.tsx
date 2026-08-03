import * as React from 'react'
import {type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'
import {badgeVariants} from '@/components/theme/badge.variants'
import {cn} from '@/lib/utils'

function Badge({className, variant = 'solid-pastel', type = 'label', color = 'neutral', shape = 'pill', size = 'sm', asChild = false, ...props}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {asChild?: boolean}) {
    const Comp = asChild ? Slot.Root : 'span'
    return <Comp data-slot="badge" data-variant={variant} data-type={type} data-color={color} data-shape={shape} data-size={size} className={cn(badgeVariants({variant, type, color, shape, size}), className)} {...props} />
}
export {Badge, badgeVariants}
