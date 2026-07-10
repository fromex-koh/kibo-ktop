import * as React from 'react'

import {cn} from '@/lib/utils'

// shadcn 슬롯(border/input/ring/destructive)에 연결. 다크는 --ds-* 가 자동 반사하므로 dark: 분기 없음(PB-06).
// Figma text_input 반영 — 높이 48px(control-h-lg), radius 8px, padding 16px, 16px 텍스트. Select 와 통일.
function Input({className, type, ...props}: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'h-control-h-lg border-input w-full min-w-0 rounded-sm border bg-transparent px-4 text-base transition-colors outline-none',
                'placeholder:text-muted-foreground',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
                'read-only:bg-muted',
                'disabled:bg-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
                'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
                className,
            )}
            {...props}
        />
    )
}

export {Input}
