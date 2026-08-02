'use client'

import * as React from 'react'
import {Checkbox as CheckboxPrimitive} from 'radix-ui'
import {CheckIcon} from 'lucide-react'
import {checkboxClassName, checkboxIndicatorClassName} from '@/components/theme/checkbox.variants'
import {cn} from '@/lib/utils'

function Checkbox({className, ...props}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root data-slot="checkbox" className={cn(checkboxClassName, className)} {...props}>
            <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className={checkboxIndicatorClassName}>
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export {Checkbox}
