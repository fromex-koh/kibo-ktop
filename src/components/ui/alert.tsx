import * as React from 'react'
import {type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'
import {alertActionClassName, alertDescriptionClassName, alertTitleClassName, alertVariants} from '@/components/theme/alert.variants'
function Alert({className, variant, ...props}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) { return <div data-slot="alert" role="alert" className={cn(alertVariants({variant}), className)} {...props} /> }
function AlertTitle({className, ...props}: React.ComponentProps<'div'>) { return <div data-slot="alert-title" className={cn(alertTitleClassName, className)} {...props} /> }
function AlertDescription({className, ...props}: React.ComponentProps<'div'>) { return <div data-slot="alert-description" className={cn(alertDescriptionClassName, className)} {...props} /> }
function AlertAction({className, ...props}: React.ComponentProps<'div'>) { return <div data-slot="alert-action" className={cn(alertActionClassName, className)} {...props} /> }
export {Alert, AlertTitle, AlertDescription, AlertAction}
