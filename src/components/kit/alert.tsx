import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'

import {cn} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Alert (styled copy)
//
// `src/components/ui/alert.tsx`(shadcn 바닐라 원본)를 복사하고 스타일(cva·className)만 프로젝트 값으로
// 바꾼 것이다. 함수 셸(Alert·AlertTitle·AlertDescription·AlertAction·data-slot·props·export)은 원본과 동일([SC-04]).
//
// Figma "alert" 반영 — 아이콘 + 메시지의 인라인 알림. rounded-sm(8px)·패딩 16px·아이콘 20px(size-5).
//   variant = 상태색(info/success/warning/error): 배경 {status}-10 · 테두리 {status}-100 · 아이콘 {status}-500 ·
//   메시지 텍스트는 상태와 무관하게 label-foreground(gray.700)로 읽기 쉽게 둔다(Figma 동일).
// dark: 수동 분기는 두지 않는다(팔레트가 .dark 에서 자동 반사, [PB-06]).
// ─────────────────────────────────────────────────────────────────────────────
const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 rounded-sm border px-4 py-4 text-left text-sm text-label-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-5",
    {
        variants: {
            variant: {
                info: 'bg-info-10 border-info-100 *:[svg]:text-info-500',
                success: 'bg-success-10 border-success-100 *:[svg]:text-success-500',
                warning: 'bg-warning-10 border-warning-100 *:[svg]:text-warning-500',
                error: 'bg-error-10 border-error-100 *:[svg]:text-error-500',
            },
        },
        defaultVariants: {
            variant: 'info',
        },
    },
)

function Alert({className, variant, ...props}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
    return <div data-slot="alert" role="alert" className={cn(alertVariants({variant}), className)} {...props} />
}

function AlertTitle({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                'text-foreground [&_a]:hover:text-foreground font-bold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3',
                className,
            )}
            {...props}
        />
    )
}

function AlertDescription({className, ...props}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                'text-label-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4',
                className,
            )}
            {...props}
        />
    )
}

function AlertAction({className, ...props}: React.ComponentProps<'div'>) {
    return <div data-slot="alert-action" className={cn('absolute top-2 right-2', className)} {...props} />
}

export {Alert, AlertTitle, AlertDescription, AlertAction}
