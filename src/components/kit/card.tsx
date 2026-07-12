import * as React from 'react'

import {cn} from '@/lib/utils'

// 프로젝트 Card (styled copy) — 원본 src/components/ui/card.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 셸(함수·data-slot·props·export)은 원본과 동일하고, 차이는 className(스타일)뿐이다.
//
// Figma "카드" 반영 — 흰 배경(bg-card) · 라운드 16px(rounded-lg) · 그림자·테두리 없음.
// 배경(gray.50) 위 흰 카드라 테두리 없이도 구분되므로 원본의 ring 을 제거했다(Figma 기업정보 카드와 동일).
// 선택/강조가 필요하면 사용처에서 className 으로 테두리를 얹는다(예: border border-primary).
// 안쪽 여백은 --card-spacing 하나로 상하(py)·좌우(px)를 함께 제어한다(기본 24px, sm 16px).

function Card({className, size = 'default', ...props}: React.ComponentProps<'div'> & {size?: 'default' | 'sm'}) {
    return (
        <div
            data-slot="card"
            data-size={size}
            className={cn(
                'group/card bg-card text-card-foreground flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg py-(--card-spacing) text-sm [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg',
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
    return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
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
            className={cn('bg-muted/50 flex items-center rounded-b-lg border-t p-(--card-spacing)', className)}
            {...props}
        />
    )
}

export {Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent}
