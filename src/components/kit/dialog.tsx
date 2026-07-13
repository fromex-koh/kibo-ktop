'use client'

// 프로젝트 Dialog (styled copy) — 원본 src/components/ui/dialog.tsx(shadcn 바닐라)를 복사하고 스타일만 교체한다([SC-04]).
// 셸(컴포넌트 구성·본문 구조·props·data-slot·export)은 원본과 '동일'하고, className 만 Figma 팝업에 맞춘다:
//   · Content: rounded-2xl(24px)·p-10(40px)·gap-6·본문 text-base(16px)·넓은 max-width(sm:max-w-xl)·테두리(ring) 제거.
//   · Title: 24px Bold(text-2xl font-bold) — 원본 16px medium 에서 교체.
//   · Close(X): 카드 우상단(top-8 right-8) — 원본 top-2 right-2 에서 이동.
//   · Footer: muted 바(음영·상단선·음수 마진)를 걷어내고, Figma 처럼 카드 패딩 안에서 버튼을 가운데 정렬(gap-6).
//   · Overlay: 배경 딤을 Figma "dim"(검정 75%)에 맞춰 bg-overlay-xl(scrim 토큰)로, 블러 제거.
// 포커스 트랩·Esc 닫기·바깥 클릭 닫기·배경 스크롤 잠금 등 동작/접근성은 전부 radix(DialogPrimitive) 원형 그대로다 —
// styled copy 는 스타일만 책임진다. 내용이 길 때의 스크롤은 primitive 가 높이를 강제하지 않고, 사용처에서 스크롤 영역
// (예: max-h-* + overflow-y-auto)을 두어 처리한다(가이드의 '내부 스크롤' 케이스 참고).
// dark: 수동 분기는 두지 않는다(토큰 자동 반사, [PB-06]).
import * as React from 'react'
import {Dialog as DialogPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'
import {Button} from '@/components/kit/button'
import {XIcon} from 'lucide-react'

function Dialog({...props}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({...props}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({...props}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({...props}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({className, ...props}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                // 배경 딤(scrim) — Figma "dim" 반영: 검정 75%(다크는 흰색 75% 자동). 프로젝트 scrim 토큰
                // bg-overlay-xl 사용(블러 없음). 원본의 bg-black/10·backdrop-blur 에서 교체(스타일만, [SC-04]).
                'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 bg-overlay-xl fixed inset-0 isolate z-50 duration-100',
                className,
            )}
            {...props}
        />
    )
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
}) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-2xl p-10 text-base duration-100 outline-none sm:max-w-xl',
                    className,
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close data-slot="dialog-close" asChild>
                        <Button variant="ghost" className="absolute top-8 right-8" size="icon-sm">
                            <XIcon />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    )
}

function DialogHeader({className, ...props}: React.ComponentProps<'div'>) {
    return <div data-slot="dialog-header" className={cn('flex flex-col gap-2', className)} {...props} />
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    showCloseButton?: boolean
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn('flex flex-col-reverse gap-6 sm:flex-row sm:justify-center', className)}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close asChild>
                    <Button variant="tertiary">Close</Button>
                </DialogPrimitive.Close>
            )}
        </div>
    )
}

function DialogTitle({className, ...props}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn('text-2xl leading-tight font-bold', className)}
            {...props}
        />
    )
}

function DialogDescription({className, ...props}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn(
                'text-label-foreground *:[a]:hover:text-foreground text-base *:[a]:underline *:[a]:underline-offset-3',
                className,
            )}
            {...props}
        />
    )
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
}
