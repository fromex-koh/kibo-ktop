/**
 * Source: shadcn radix-nova registry
 * Purpose: 원본 CVA 기준선 비교용
 * Do not import from application code.
 */
import {cva} from 'class-variance-authority'

export const shadcnAlertVariants = cva('group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm', {
    variants: {variant: {default: 'bg-card text-card-foreground', destructive: 'bg-card text-destructive'}},
    defaultVariants: {variant: 'default'},
})
