import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: 페이지 최상단 wayfinding 바. 제목(h1)·Badge·Breadcrumb 슬롯을 조합한다.
// PROJECT-STYLE: Breadcrumb 슬롯은 bg-surface + shadow-1 알약 컨테이너로 감싼다.
const BREADCRUMB_PILL = 'inline-flex items-center rounded-full bg-surface px-10 py-4 shadow-1'

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
            <div data-slot="page-title-bar-nav" className={BREADCRUMB_PILL}>
                {breadcrumb}
            </div>
        ) : null}
    </header>
)

export {PageTitleBar}
export type {PageTitleBarProps}
