import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'

import {cn} from '@/lib/utils'

const cardVariants = cva(
    'group/card bg-card text-foreground flex flex-col overflow-hidden rounded-lg py-(--card-spacing) text-sm [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg',
    {
        variants: {
            align: {
                center: 'text-center',
                left: 'text-left',
                right: 'text-right',
            },
        },
        defaultVariants: {
            align: 'center',
        },
    },
)

// gap-x/gap-y 는 spacingBase(4px) 배수 유틸만 허용한다(PB-13) — Tailwind 가 클래스명을 정적으로
// 스캔하므로 동적 조합(`gap-x-${n}`) 대신 고정 매핑에서 선택한다.
const CARD_GAP_X = {
    0: 'gap-x-0',
    1: 'gap-x-1',
    2: 'gap-x-2',
    3: 'gap-x-3',
    4: 'gap-x-4',
    6: 'gap-x-6',
    8: 'gap-x-8',
} as const

const CARD_GAP_Y = {
    0: 'gap-y-0',
    1: 'gap-y-1',
    2: 'gap-y-2',
    3: 'gap-y-3',
    4: 'gap-y-4',
    6: 'gap-y-6',
    8: 'gap-y-8',
} as const

type CardGapX = keyof typeof CARD_GAP_X
type CardGapY = keyof typeof CARD_GAP_Y

function Card({
    className,
    size = 'default',
    align,
    gapX,
    gapY,
    ...props
}: React.ComponentProps<'div'> &
    VariantProps<typeof cardVariants> & {
        size?: 'default' | 'sm'
        gapX?: CardGapX
        gapY?: CardGapY
    }) {
    return (
        <div
            data-slot="card"
            data-size={size}
            data-align={align}
            className={cn(
                cardVariants({align}),
                gapX !== undefined && CARD_GAP_X[gapX],
                gapY !== undefined && CARD_GAP_Y[gapY],
                className,
            )}
            {...props}
        />
    )
}

function CardHeader({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
                className,
            )}
            {...props}
        />
    )
}

function CardTitle({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-title"
            className={cn('text-base leading-snug font-medium group-data-[size=sm]/card:text-sm', className)}
            {...props}
        />
    )
}

function CardDescription({className, ...props}: React.ComponentProps<'div'>) {
    return <div data-slot="card-description" className={cn('text-foreground text-sm', className)} {...props} />
}

function CardAction({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-action"
            className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
            {...props}
        />
    )
}

function CardContent({className, ...props}: React.ComponentProps<'div'>) {
    return <div data-slot="card-content" className={cn('px-(--card-spacing)', className)} {...props} />
}

function CardFooter({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                'bg-card flex items-center rounded-b-lg px-(--card-spacing) pt-0 pb-(--card-spacing)',
                className,
            )}
            {...props}
        />
    )
}

export {Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, cardVariants}
