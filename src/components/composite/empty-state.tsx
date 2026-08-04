import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {FileSearch} from 'lucide-react'
import {cn} from '@/lib/utils'

// 공용 빈 상태 — 목록·검색 결과처럼 표시할 데이터가 없을 때 사용하는 안내 영역.
// 카드나 페이지 레이아웃은 사용처에서 감싸고, 이 컴포넌트는 메시지·아이콘·액션만 담당한다.
type EmptyStateProps = {
    title?: ReactNode
    description?: ReactNode
    icon?: ReactNode
    action?: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'title'>

const EmptyState = ({
    title = '조회된 데이터가 없습니다.',
    description,
    icon = <FileSearch aria-hidden="true" />,
    action,
    className,
    ...props
}: EmptyStateProps) => (
    <div
        data-slot="empty-state"
        role="status"
        aria-live="polite"
        className={cn('flex min-h-40 w-full flex-col items-center justify-center gap-4 px-4 text-center', className)}
        {...props}
    >
        {icon != null ? (
            <span aria-hidden="true" className="text-muted-foreground [&_svg]:size-icon-xl">
                {icon}
            </span>
        ) : null}
        <div className="flex flex-col gap-1">
            <p className="typo-title-m-medium text-foreground">{title}</p>
            {description != null ? <p className="typo-body-l-regular text-muted-foreground">{description}</p> : null}
        </div>
        {action != null ? <div className="mt-1">{action}</div> : null}
    </div>
)

export {EmptyState}
export type {EmptyStateProps}
