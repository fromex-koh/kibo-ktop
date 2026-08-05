import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {CircleAlert} from 'lucide-react'
import {cn} from '@/lib/utils'

// 공용 빈 상태 — 목록·검색 결과처럼 표시할 데이터가 없을 때 사용하는 안내 영역.
// 카드나 페이지 레이아웃은 사용처에서 감싸고, 이 컴포넌트는 메시지·아이콘·액션만 담당한다.
//
// PROJECT-STYLE: 시안 "리스트"의 빈 상태(40006769:23706) — 세로 가운데에 알림 아이콘 32(size-icon-xl)와
// 한 줄 안내(16/24 Regular · foreground-subtle)를 8px(gap-2) 간격으로 둔다. 카드 높이는 360(min-h-90).
// 설명·액션은 시안에 없는 선택 슬롯이라 넘길 때만 렌더한다.
//
// 아이콘은 시안의 icon-fill/alert 처럼 "채운 원 + 흰 느낌표"다. lucide 는 채움 아이콘을 따로 주지 않으므로
// (단일 아이콘 라이브러리 유지 [NA-008]) CircleAlert 의 자식 도형을 각각 칠한다 — 원(circle)은 현재 색으로
// 채우고, 느낌표(line 2개)만 대비색으로 덮는다. 원의 stroke 는 현재 색 그대로라 테두리가 따로 보이지 않는다.
// 색은 이 용도로 만들어 둔 짝 토큰을 쓴다: 면 icon-solid-subtle · 글리프 icon-solid-subtle-foreground.
type EmptyStateProps = {
    title?: ReactNode
    description?: ReactNode
    icon?: ReactNode
    action?: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'title'>

const EmptyState = ({
    title = '조회된 데이터가 없습니다.',
    description,
    icon = <CircleAlert aria-hidden="true" />,
    action,
    className,
    ...props
}: EmptyStateProps) => (
    <div
        data-slot="empty-state"
        role="status"
        aria-live="polite"
        className={cn('flex min-h-90 w-full flex-col items-center justify-center gap-2 px-4 text-center', className)}
        {...props}
    >
        {icon != null ? (
            <span
                aria-hidden="true"
                className="text-icon-solid-subtle [&_svg]:size-icon-xl [&_svg>line]:stroke-icon-solid-subtle-foreground [&_svg>circle]:fill-current"
            >
                {icon}
            </span>
        ) : null}
        <div className="flex flex-col gap-1">
            <p className="typo-body-xl-regular text-foreground-subtle">{title}</p>
            {description != null ? <p className="typo-body-l-regular text-muted-foreground">{description}</p> : null}
        </div>
        {action != null ? <div className="mt-4">{action}</div> : null}
    </div>
)

export {EmptyState}
export type {EmptyStateProps}
