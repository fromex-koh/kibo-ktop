'use client'

// PROJECT-STYLE: shadcn 원본은 bg-border 배경으로 선을 그리지만,
// 프로젝트 구분선은 subtle border token을 쓰는 실제 border 선으로 표현한다.
import * as React from 'react'
import {Separator as SeparatorPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

function Separator({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                'border-subtle-3 shrink-0 bg-transparent data-horizontal:h-px data-horizontal:w-full data-horizontal:border-t data-vertical:w-px data-vertical:self-stretch data-vertical:border-l',
                className,
            )}
            {...props}
        />
    )
}

export {Separator}
