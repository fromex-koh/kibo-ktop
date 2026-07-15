'use client'

import * as React from 'react'
import {Label as LabelPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

// PROJECT-STYLE: Label은 shadcn 원본 셸을 유지하고, 프로젝트 기본 라벨 타이포와 색상만 kit에서 책임진다.
function Label({className, ...props}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                'text-label-foreground group-data-[disabled=true]:text-disabled peer-disabled:text-disabled flex cursor-pointer items-center gap-2 text-base leading-normal font-normal select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
                className,
            )}
            {...props}
        />
    )
}

export {Label}
