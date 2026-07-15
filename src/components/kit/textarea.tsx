import * as React from 'react'
import {cn} from '@/lib/utils'

// 프로젝트 Textarea (styled copy) — 원본 src/components/ui/textarea.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 셸(구성·props·data-slot·export)은 원본과 동일하고, className 만 Figma 에 맞춘다.
//
// PROJECT-STYLE: Textarea는 Input/Select/Combobox와 같은 control/surface/field-disabled 토큰을 쓴다.
function Textarea({className, ...props}: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-control bg-surface text-label-foreground min-h-30 w-full min-w-0 resize-none rounded-sm border px-4 py-3 text-base transition-colors outline-none',
                'placeholder:text-placeholder disabled:placeholder:text-disabled',
                'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
                'aria-invalid:border-destructive',
                'read-only:bg-field-disabled',
                'disabled:bg-field-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100',
                className,
            )}
            {...props}
        />
    )
}

export {Textarea}
