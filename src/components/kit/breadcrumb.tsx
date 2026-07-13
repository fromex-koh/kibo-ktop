import * as React from 'react'
import {Slot} from 'radix-ui'

import {cn} from '@/lib/utils'
import {ChevronRightIcon, MoreHorizontalIcon} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Breadcrumb (styled copy)
//
// `src/components/ui/breadcrumb.tsx`(shadcn 바닐라 원본)를 복사하고 스타일(className)만 프로젝트 값으로
// 바꾼 것이다. 함수 셸(컴포넌트·본문·data-slot·props·export)은 원본과 동일하게 유지한다([SC-04]).
//
// Figma "브레드크럼" 반영(전부 className/스타일만):
//   • 텍스트 16px(text-base)·중간 항목/링크 색 label-foreground(gray.700), 항목 간 간격 12px(gap-3).
//   • 현재 페이지(BreadcrumbPage)는 굵게(font-bold) + foreground(gray.900).
//   • 구분자(BreadcrumbSeparator)는 원본 그대로(기본 chevron). 프로젝트 표준인 4px 회색 점 구분자는
//     kit 에서 기본값을 바꾸지 않고 사용처에서 children 으로 주입한다(셸=바닐라 유지, [SC-02]/[SC-04]).
// dark: 수동 분기는 두지 않는다(토큰 자동 반사, [PB-06]).
// ─────────────────────────────────────────────────────────────────────────────

function Breadcrumb({className, ...props}: React.ComponentProps<'nav'>) {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
}

function BreadcrumbList({className, ...props}: React.ComponentProps<'ol'>) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                'text-label-foreground flex flex-wrap items-center gap-3 text-base wrap-break-word',
                className,
            )}
            {...props}
        />
    )
}

function BreadcrumbItem({className, ...props}: React.ComponentProps<'li'>) {
    return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1', className)} {...props} />
}

function BreadcrumbLink({
    asChild,
    className,
    ...props
}: React.ComponentProps<'a'> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot.Root : 'a'

    return (
        <Comp
            data-slot="breadcrumb-link"
            className={cn('hover:text-foreground transition-colors', className)}
            {...props}
        />
    )
}

function BreadcrumbPage({className, ...props}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="breadcrumb-page"
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn('text-foreground font-bold', className)}
            {...props}
        />
    )
}

function BreadcrumbSeparator({children, className, ...props}: React.ComponentProps<'li'>) {
    return (
        <li
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden="true"
            className={cn('[&>svg]:size-3.5', className)}
            {...props}
        >
            {children ?? <ChevronRightIcon />}
        </li>
    )
}

function BreadcrumbEllipsis({className, ...props}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            aria-hidden="true"
            className={cn('flex size-5 items-center justify-center [&>svg]:size-4', className)}
            {...props}
        >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
        </span>
    )
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
}
