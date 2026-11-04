import type {ComponentPropsWithRef, ReactNode} from 'react'
import {Check} from 'lucide-react'
import {getNameBreakClassName} from '@/lib/name-break'
import {cn} from '@/lib/utils'

// 선택 항목 요약(SelectedItemSummary) — 목록에서 고른 항목을 다음 단계 위에 한 번 더 보여 주는 띠다.
// 왼쪽 표시 · 이름 · 부가 정보, 오른쪽 동작(목록으로 돌아가기 등). 좁은 화면(md 미만)은 위아래로 쌓인다.
// 고른 상태는 면 색만이 아니라 체크 아이콘과 글자(label)로도 전한다[5.3.1].

type SelectedItemSummaryProps = Omit<ComponentPropsWithRef<'section'>, 'title'> & {
    /** 무엇을 골랐는지(예: 선택한 기업). 구역의 이름으로도 읽힌다. */
    label: string
    /** 고른 항목 이름. 띄어쓰기가 없으면 글자 사이에서 줄을 바꾼다. */
    title: ReactNode
    /** 이름 아래 부가 정보 한 줄. */
    meta?: ReactNode
    /** 오른쪽 동작. */
    action?: ReactNode
}

const SelectedItemSummary = ({label, title, meta, action, className, ...props}: SelectedItemSummaryProps) => (
    <section
        data-slot="selected-item-summary"
        aria-label={label}
        className={cn(
            'border-primary bg-primary-subtle flex flex-col gap-3 rounded-lg border px-6 py-5 md:flex-row md:items-center md:justify-between',
            className,
        )}
        {...props}
    >
        <div className="flex min-w-0 flex-col gap-1">
            <p className="typo-body-m-bold text-primary-strong flex items-center gap-1">
                <Check aria-hidden="true" className="size-icon-xs shrink-0" />
                {label}
            </p>
            {/* 고른 항목의 값이라 제목이 아니다 — 18 Bold 를 <p> 로 두면 WAVE 가 'Possible heading' 으로 잡아 블록 span 으로 둔다. */}
            <span className={cn('typo-title-m-bold text-foreground block wrap-anywhere', getNameBreakClassName(title))}>
                {title}
            </span>
            {meta != null ? (
                <p className="typo-body-l-regular text-foreground-subtle wrap-anywhere break-keep">{meta}</p>
            ) : null}
        </div>
        {action != null ? <div className="shrink-0 self-start md:self-auto">{action}</div> : null}
    </section>
)

export {SelectedItemSummary}
export type {SelectedItemSummaryProps}
