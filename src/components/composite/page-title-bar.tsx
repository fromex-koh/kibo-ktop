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
        className={cn(
            // 모바일(768 미만) 시안은 [뱃지] / [제목] / [브레드크럼] 세로 3단이고, md 부터 제목과 브레드크럼이
            // 양끝으로 갈린다. 제목↔브레드크럼 간격은 두 배치 모두 16 이다.
            'flex flex-col items-start gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between',
            className,
        )}
        {...props}
    >
        {/* md 이상 — 뱃지는 제목과 8 떨어져 제목 첫 줄 위쪽에 붙는다(시안 "타이틀+뱃지" — 제목 상자 위에서 12).
            items-center 로 두면 제목이 두 줄이 될 때 뱃지가 줄 사이로 내려가므로 items-start 로 첫 줄에 고정한다.
            모바일 — 시안은 뱃지가 제목 위에 온다. DOM 은 제목 → 뱃지 순서를 유지하고(읽기 순서 [7.3.1])
            flex-col-reverse 로 보이는 순서만 뒤집는다. */}
        <div
            data-slot="page-title-bar-heading"
            className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-start"
        >
            <h1 className="typo-display-l-bold text-foreground text-balance">{title}</h1>
            {badge ? <span className="shrink-0 md:mt-3">{badge}</span> : null}
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
