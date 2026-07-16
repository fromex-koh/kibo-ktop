import * as React from 'react'
import {inputClassName} from '@/components/theme/input.variants'
import {cn} from '@/lib/utils'

function Input({className, type, ...props}: React.ComponentProps<'input'>) {
    return <input type={type} data-slot="input" className={cn(inputClassName, className)} {...props} />
}

export {Input}
