import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: 페이지 최상단 wayfinding 바. 제목(h1)·Badge·Breadcrumb 슬롯을 조합한다.
// PROJECT-STYLE: Breadcrumb 슬롯을 감싸는 알약 외형은 theme/breadcrumb.variants.ts 가 단일 소스다.

type PageTitleBarProps = {
    title: ReactNode
    badge?: ReactNode
    breadcrumb?: ReactNode
} & Omit<ComponentPropsWithoutRef<'header'>, 'title'>

const PageTitleBar = ({title, badge, breadcrumb, className, ...props}: PageTitleBarProps) => (
    <header
        data-slot="page-title-bar"
        className={cn('flex flex-wrap items-center justify-between gap-4', className)}
        {...props}
    >
        <div data-slot="page-title-bar-heading" className="flex items-center gap-4">
            <h1 className="typo-display-xl-bold text-foreground text-balance">{title}</h1>
            {badge}
        </div>
        {breadcrumb ? (
            <div data-slot="page-title-bar-nav" className={breadcrumbPillClassName}>
                {breadcrumb}
            </div>
        ) : null}
    </header>
)

export {PageTitleBar}
export type {PageTitleBarProps}
