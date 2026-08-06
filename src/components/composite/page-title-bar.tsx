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
        {/* 뱃지는 제목과 8 떨어져 제목 첫 줄 위쪽에 붙는다(시안 "타이틀+뱃지" — 제목 상자 위에서 12).
            items-center 로 두면 제목이 두 줄이 될 때 뱃지가 줄 사이로 내려가므로 items-start 로 첫 줄에 고정한다.
            mt-3 는 데스크톱(48px 제목) 기준 시안 값이고, 제목이 작아지는 모바일(38px)에서는 세로 가운데에 가깝다. */}
        <div data-slot="page-title-bar-heading" className="flex items-start gap-2">
            <h1 className="typo-display-l-bold text-foreground text-balance">{title}</h1>
            {badge ? <span className="mt-3 shrink-0">{badge}</span> : null}
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
