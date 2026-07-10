'use client'

import * as React from 'react'
import {Checkbox as CheckboxPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'
import {CheckIcon} from 'lucide-react'

function Checkbox({className, ...props}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-checkbox-checked data-checked:border-checkbox-checked data-checked:bg-checkbox-checked data-checked:text-primary-foreground disabled:border-checkbox-disabled-border disabled:bg-checkbox-disabled-fill disabled:text-checkbox-disabled-border relative flex size-6 shrink-0 items-center justify-center rounded-xs border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-3 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-100 aria-invalid:ring-3',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-4"
            >
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export {Checkbox}
