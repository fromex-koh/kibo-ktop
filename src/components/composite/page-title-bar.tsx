import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 페이지 타이틀 바(PageTitleBar) — 페이지 최상단 가로 스트립(L2 composite). Figma "상단" 반영.
//   · 좌측: 큰 페이지 제목(h1, display-xl) + 분류 Badge.
//   · 우측: 현재 위치를 보여주는 Breadcrumb(surface 알약 컨테이너).
// PageHeader(제목+설명 블록)·StepHeader 와는 다른 레이어 — 최상단 wayfinding 바다(한 페이지에 이것과
// PageHeader 가 함께 놓일 수 있다). badge·breadcrumb 는 기존 컴포넌트를 그대로 꽂는 슬롯(조합)이다.

// 브레드크럼 알약 컨테이너 — bg-surface + shadow-1 + rounded-full 로 토큰화한다.
const BREADCRUMB_PILL = 'inline-flex items-center rounded-full bg-surface px-10 py-4 shadow-1'

type PageTitleBarProps = {
    // 페이지 제목(예: "자가진단"). 페이지 최상단 제목이라 h1 로 렌더된다.
    title: ReactNode
    // 제목 옆 분류 배지 슬롯(<Badge> 조합). 선택.
    badge?: ReactNode
    // 우측 위치 표시 슬롯(<Breadcrumb> 조합). surface 알약 컨테이너로 감싸 렌더한다. 선택.
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
