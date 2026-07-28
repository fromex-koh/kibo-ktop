import type {CSSProperties} from 'react'

type SonnerStyle = CSSProperties & Record<`--${string}`, string>

export const sonnerClassName = 'toaster group'

export const sonnerStyle: SonnerStyle = {
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)',
    '--border-radius': 'var(--radius)',
    zIndex: 'var(--ds-z-toast)',
}

export const sonnerToastClassNames = {
    toast: 'bg-popover text-popover-foreground border-border shadow-md flex w-full items-start gap-3 rounded-lg border px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    content: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'typo-body-m-medium text-foreground',
    description: 'typo-caption-regular text-muted-foreground',
    icon: 'text-foreground flex size-icon-md shrink-0 items-center justify-center',
    closeButton:
        'text-muted-foreground interactive:hover:bg-accent interactive:hover:text-foreground order-last flex size-icon-md shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-icon-sm',
    actionButton:
        'typo-caption-bold bg-primary text-primary-foreground interactive:hover:bg-primary-hover interactive:active:bg-primary-pressed ml-auto inline-flex h-control-h-xs shrink-0 items-center justify-center rounded-2xs px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    cancelButton:
        'typo-caption-bold bg-secondary text-secondary-foreground interactive:hover:bg-secondary-hover ml-auto inline-flex h-control-h-xs shrink-0 items-center justify-center rounded-2xs px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    success: '[&_[data-icon]]:text-success',
    info: '[&_[data-icon]]:text-info',
    warning: '[&_[data-icon]]:text-warning',
    error: '[&_[data-icon]]:text-destructive',
} as const
