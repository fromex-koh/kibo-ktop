import * as React from 'react'

import {cn} from '@/lib/utils'

// shadcn 슬롯(border/input/ring/destructive)에 연결. 다크는 --ds-* 가 자동 반사하므로 dark: 분기 없음(PB-06).
// 높이는 control-h-md + min-h-11(44px, KWCAG 6.1.3).
function Input({className, type, ...props}: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'h-control-h-md border-input bg-background min-h-11 w-full min-w-0 rounded-lg border px-3 py-1 text-base transition-colors outline-none',
                'placeholder:text-muted-foreground',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
                'disabled:bg-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
                'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
                'wide:text-sm',
                className,
            )}
            {...props}
        />
    )
}

export {Input}
