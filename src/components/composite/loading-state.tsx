import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {LoaderCircle} from 'lucide-react'
import {cn} from '@/lib/utils'

// 공용 로딩 상태 — 목록·검색 결과를 불러오거나 다시 그리는 동안 그 자리를 대신하는 안내 영역.
// EmptyState 와 같은 자리·같은 모양(세로 가운데 · 아이콘 32 · 간격 8 · 16/24 안내)이라, 로딩이 끝나 결과가
// 없으면 EmptyState 로 바뀌어도 자리가 흔들리지 않는다. 카드 면·높이는 사용처가 준다.
//
// 아이콘은 도는 원(LoaderCircle)이다. 동작 줄이기 설정에서는 돌지 않는다[6.3.1].
// role="status" — 스크린리더에 "불러오는 중"을 알린다. 끝나면 사용처가 이 영역을 결과로 바꾼다.
// shrink-0 — 높이가 제한된 세로 flex(모바일 모달 본문 등) 안에서 눌려 아이콘이 찌그러지지 않게 한다.
type LoadingStateProps = {
    title?: ReactNode
    /** 제목 아래 보조 설명(14 Regular). 주면 제목이 16 Bold 본문 색으로 올라간다 — 오래 걸리는 처리 안내용
        (예: 대량정보조회 "대량 조회 처리 중입니다." / "파일을 분석하여 …"). 주지 않으면 기존 한 줄 모양 그대로다. */
    description?: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'title'>

const LoadingState = ({title = '불러오는 중입니다.', description, className, ...props}: LoadingStateProps) => (
    <div
        data-slot="loading-state"
        role="status"
        aria-live="polite"
        className={cn(
            'flex min-h-90 w-full shrink-0 flex-col items-center justify-center gap-2 px-4 text-center',
            className,
        )}
        {...props}
    >
        <LoaderCircle
            aria-hidden="true"
            className="text-primary size-icon-xl shrink-0 motion-safe:animate-spin motion-reduce:animate-none"
        />
        {description ? (
            <div className="flex flex-col gap-1">
                <p className="typo-body-xl-bold text-label-foreground">{title}</p>
                <p className="typo-body-l-regular text-foreground-subtle">{description}</p>
            </div>
        ) : (
            <p className="typo-body-xl-regular text-foreground-subtle">{title}</p>
        )}
    </div>
)

export {LoadingState}
export type {LoadingStateProps}
