/**
 * Source: shadcn radix-nova registry
 * Purpose: 원본 CVA 기준선 비교용
 * Do not import from application code.
 */
import {cva} from 'class-variance-authority'

export const shadcnBadgeVariants = cva('group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50', {
    variants: {variant: {default: 'bg-primary text-primary-foreground', secondary: 'bg-secondary text-secondary-foreground', destructive: 'bg-destructive/10 text-destructive', outline: 'border-border text-foreground', ghost: 'hover:bg-muted', link: 'text-primary underline-offset-4 hover:underline'}},
    defaultVariants: {variant: 'default'},
})
