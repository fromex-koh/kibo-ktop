'use client'

import * as React from 'react'
import {Checkbox as CheckboxPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'
import {CheckIcon} from 'lucide-react'

function Checkbox({className, ...props}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                // PROJECT-STYLE: shadcn 원본의 동작 셸은 유지하고, Figma Checkbox 크기/표면/상태색만 kit에서 책임진다.
                // 기본 표면은 bg-surface(common.white), 기본 테두리는 border-input(gray.200), checked는 primary 슬롯에 연결한다.
                // disabled는 공통 control/disabled 계열 토큰으로 통일한다.
                'peer border-input bg-surface focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled-subtle rounded-2xs relative flex size-6 shrink-0 items-center justify-center border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted disabled:cursor-not-allowed disabled:opacity-100',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-4"
            >
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export {Checkbox}
