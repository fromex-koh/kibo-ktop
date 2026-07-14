'use client'

import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'
import {Button} from '@/components/kit/button'
import {Input} from '@/components/kit/input'
import {Textarea} from '@/components/kit/textarea'

// 프로젝트 InputGroup (styled copy) — 원본 src/components/ui/input-group.tsx(shadcn 바닐라)를 복사하고
// 스타일만 교체한다([SC-04]). 인풋에 아이콘·버튼 등 부속(addon)을 붙이는 프리미티브 — Figma "text_input"의
// 검색창(입력 + 원형 검색 버튼)이 정확히 이 조합이라 승격했다(SearchBar composite 의 기반).
//
// 셸은 원본과 동일(컴포넌트 구성·data-slot·props·export) — 손댄 건 className(박스 모델)과, 내부가 참조하는
// 프리미티브를 ui/Button·ui/Input·ui/Textarea 대신 프로젝트 kit/Button·kit/Input·kit/Textarea 로 바꾼 것뿐이다
// (kit/dialog.tsx 가 kit/Button 을 쓰는 것과 같은 선례 — 조립된 결과물 전체가 Figma 스타일을 반영해야 하므로).
//
// 박스 모델 변경 — 원본은 컨테이너에 고정 h-8 + 개별 px 보정(has-[data-align=...])으로 여백을 짰지만,
// 이 프로젝트는 "여백은 컨테이너가 한 번에, 자식은 p-0"로 단순화했다: InputGroup 이 rounded-sm·h-control-h-lg·
// px-4·gap-2 를 갖고, InputGroupInput/Textarea 는 자기 테두리·배경·패딩을 전부 지우고 컨테이너 안에 꽉 찬다.
// 포커스도 원본의 ring 대신 kit/Input 과 통일된 outline(점선) 스타일을 컨테이너에 얹는다.
//
// InputGroupButton 은 원본처럼 별도 size 축(xs/sm/icon-xs/icon-sm)을 새로 두지 않는다 — kit/Button 이 이미
// icon-xs~icon-2xl 의 촘촘한 크기 스케일을 갖고 있어(32~60px), 중복 스케일을 또 만들 이유가 없다. kit/Button 의
// size prop 을 그대로 받는다(기본 icon-sm=36px).

const inputGroupClassName = cn(
    'group/input-group border-input bg-surface has-disabled:bg-muted has-disabled:opacity-50 relative flex h-control-h-lg w-full min-w-0 items-center gap-2 rounded-sm border px-4 transition-colors outline-none',
    'has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-dotted',
    'has-[[data-slot][aria-invalid=true]]:border-destructive',
)

function InputGroup({className, ...props}: React.ComponentProps<'div'>) {
    return <div data-slot="input-group" role="group" className={cn(inputGroupClassName, className)} {...props} />
}

const inputGroupAddonVariants = cva(
    "text-foreground-subtle flex h-auto items-center justify-center gap-2 text-sm font-medium select-none group-has-disabled/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-icon-sm",
    {
        variants: {
            align: {
                'inline-start': 'order-first',
                'inline-end': 'order-last',
            },
        },
        defaultVariants: {
            align: 'inline-start',
        },
    },
)

function InputGroupAddon({
    className,
    align = 'inline-start',
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({align}), className)}
            {...props}
        />
    )
}

// kit/Button 을 그대로 감싼다 — 자체 size 축을 두지 않고 Button 의 size(icon-xs~icon-2xl 등)를 그대로 받는다.
function InputGroupButton({
    className,
    type = 'button',
    variant = 'ghost',
    size = 'icon-sm',
    ...props
}: React.ComponentProps<typeof Button>) {
    return <Button type={type} variant={variant} size={size} className={cn('shrink-0', className)} {...props} />
}

function InputGroupText({className, ...props}: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn(
                "text-foreground-subtle [&_svg:not([class*='size-'])]:size-icon-sm flex items-center gap-2 text-sm [&_svg]:pointer-events-none",
                className,
            )}
            {...props}
        />
    )
}

function InputGroupInput({className, ...props}: React.ComponentProps<'input'>) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn(
                'h-full flex-1 rounded-none border-0 bg-transparent p-0 outline-none read-only:bg-transparent disabled:bg-transparent',
                'focus-visible:outline-none',
                className,
            )}
            {...props}
        />
    )
}

function InputGroupTextarea({className, ...props}: React.ComponentProps<'textarea'>) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn(
                'min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-0 outline-none read-only:bg-transparent disabled:bg-transparent',
                'focus-visible:outline-none',
                className,
            )}
            {...props}
        />
    )
}

export {InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea}
