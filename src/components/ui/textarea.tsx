import * as React from 'react'
import {textareaClassName} from '@/components/theme/textarea.variants'
import {cn} from '@/lib/utils'

function Textarea({className, ...props}: React.ComponentProps<'textarea'>) {
    return <textarea data-slot="textarea" className={cn(textareaClassName, className)} {...props} />
}

export {Textarea}
