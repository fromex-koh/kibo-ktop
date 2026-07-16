'use client'

import * as React from 'react'
import {RadioGroup as RadioGroupPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

function RadioGroup({className, ...props}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid w-full gap-2', className)} {...props} />
    )
}

function RadioGroupItem({className, ...props}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                // PROJECT-STYLE: shadcn 원본의 동작 셸은 유지하고, Figma Radio 크기/표면/상태색만 kit에서 책임진다.
                // 기본 표면은 bg-surface(common.white), 기본 테두리는 border-control(gray.200), checked는 primary 슬롯에 연결한다.
                // disabled는 Checkbox와 같은 공통 control/disabled 계열 토큰으로 통일한다.
                'group/radio-group-item peer border-control bg-surface focus-visible:outline-ring aria-invalid:border-destructive aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground disabled:border-disabled-subtle disabled:bg-control-disabled relative flex aspect-square size-6 shrink-0 rounded-full border outline-none after:absolute after:-inset-x-3 after:-inset-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-100',
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="flex size-6 items-center justify-center"
            >
                <span className="bg-primary-foreground group-data-disabled/radio-group-item:bg-disabled-subtle absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
}

export {RadioGroup, RadioGroupItem}
