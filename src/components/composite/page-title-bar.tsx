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
        {/* md 이상 — 뱃지는 제목 글자 뒤에 이어 붙는다(시안 "타이틀+뱃지"). 제목을 flex 칸으로 두면 제목이
            줄바꿈될 때 뱃지가 줄 끝이 아니라 상자 오른쪽 끝으로 밀리므로, 제목을 inline 으로 흘려 마지막
            글자 뒤에 오게 한다.
            모바일 — 시안은 뱃지가 제목 위에 온다. DOM 은 제목 → 뱃지 순서를 유지하고(읽기 순서 [7.3.1])
            flex-col-reverse 로 보이는 순서만 뒤집는다. */}
        <div data-slot="page-title-bar-heading" className="flex flex-col-reverse items-start gap-2 md:block">
            {/* break-keep — 좁은 화면에서 낱말 가운데가 아니라 낱말 사이에서만 줄이 바뀐다
                ("혁신성장역량지수 (일반)"이 "(일 / 반)"으로 쪼개지지 않고 괄호째 다음 줄로 내려간다). */}
            <h1 className="typo-display-l-bold text-foreground break-keep md:inline">{title}</h1>
            {/* align-top + mt-3 — 시안은 뱃지 윗변이 제목 글자 윗변에 맞는다(제목 줄 상자 위에서 12).
                가운데 정렬로 두면 제목 줄 높이가 커서 뱃지가 글자보다 아래로 내려앉는다. */}
            {badge ? <span className="shrink-0 md:mt-3 md:ml-2 md:inline-block md:align-top">{badge}</span> : null}
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
