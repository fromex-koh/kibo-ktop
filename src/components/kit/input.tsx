import * as React from 'react'
import {cn} from '@/lib/utils'

// 프로젝트 Input (styled copy) — 원본 src/components/ui/input.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 원본과의 차이는 className(스타일) 뿐이고, 셸(함수·data-slot·props·export)은 동일하다.
//
// PROJECT-STYLE: Input은 Select/Combobox와 같은 control/surface/field-disabled 토큰과 상태 border를 쓴다.
function Input({className, type, ...props}: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'h-control-h-lg border-control bg-surface text-label-foreground focus-visible:border-primary focus-visible:outline-ring w-full min-w-0 rounded-sm border px-4 text-base transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
                'placeholder:text-placeholder disabled:placeholder:text-disabled',
                'aria-invalid:border-destructive',
                'read-only:bg-field-disabled',
                'disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100',
                'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
                className,
            )}
            {...props}
        />
    )
}

export {Input}
