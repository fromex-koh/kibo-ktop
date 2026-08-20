import type {ReactNode} from 'react'
import {SquareArrowOutUpRight} from 'lucide-react'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 이력 목록(HistoryList) — 날짜·상태로 시작해 제목·액션·이동 링크로 이어지는 한 줄짜리 이력 항목의 목록.
// Figma "[마이페이지] 평가이력 조회" 의 결과 목록을 옮긴 것으로, 마이페이지의 조회 화면들
// (평가결과 조회 · K-BIGx 보고서 이력 · 평가검증 신청 조회)이 같은 짜임을 쓴다.
//
// 카드에 담지 않고 배경 위에 놓이며 항목 사이는 구분선으로 나눈다(시안). 카드에 담아야 하는 목록
// (공지사항·1:1 문의)은 사용처에서 BaseCard 로 감싼다 — 이 컴포넌트는 줄 구성만 갖는다.
//
// 값을 보여 주기만 하므로 client 로 두지 않는다. 상태(필터·페이지)는 이 목록을 쓰는 화면이 갖는다.

// 목록 맨 위에는 굵고 진한 선(2px)이, 각 항목 아래에는 얇고 연한 선(1px)이 온다(시안).
// 위쪽 선이 목록의 시작을 긋고 — 그 위에 오는 건수·정렬 줄과 결과를 가른다 — 아래 선들이 건을 나눈다.
// 위쪽 선이 필요 없는 자리(카드 맨 위 등)는 사용처에서 border-t-0 으로 끈다.
// 선과 항목 사이 여백(24)은 항목이 갖는다(아래 HistoryItem).
const HistoryList = ({className, ...props}: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul data-slot="history-list" className={cn('border-foreground flex flex-col border-t-2', className)} {...props} />
)

type HistoryItemProps = {
    /**
     * 메타 줄 맨 앞에 오는 배지(평가 모형 등). 뒤에 오는 값들과 달리 구분선 없이 간격(12)만 두고 놓인다 —
     * 값이 아니라 그 건이 무엇인지 가르는 표라서다.
     */
    badge?: ReactNode
    /**
     * 제목 위 한 줄에 오는 값들(등록 일시 · 진행 상태 · 등급 등). 세로 구분선으로 이어 그린다.
     * 값마다 색이 다르면(상태·등급) 사용처에서 span 에 색을 주어 넘긴다.
     */
    meta?: readonly ReactNode[]
    title: ReactNode
    /** 제목 오른쪽에 오는 버튼 묶음. 좁아지면 제목 아래로 내려간다. */
    action?: ReactNode
    /** 아래 줄의 동작 버튼(HistoryAction). 없으면 그 줄을 그리지 않는다. */
    children?: ReactNode
} & Omit<React.ComponentPropsWithoutRef<'li'>, 'title' | 'children'>

const HistoryItem = ({badge, meta, title, action, children, className, ...props}: HistoryItemProps) => (
    <li
        data-slot="history-item"
        className={cn('border-subtle-3 flex flex-col gap-2 border-b py-6', className)}
        {...props}
    >
        <div className="flex flex-col gap-2">
            {badge || meta?.length ? (
                <div className="flex flex-wrap items-center gap-y-1">
                    {/* 배지 뒤에는 구분선을 두지 않는다 — 값과 값 사이가 아니라 표와 값 사이라서다(시안). */}
                    {badge ? <span className="me-3 flex items-center">{badge}</span> : null}
                    {meta?.map((value, index) => (
                        // 값 자체가 키가 될 만한 것이 없어(같은 등급이 여러 줄에 나온다) 자리를 키로 쓴다.
                        // 한 항목 안에서 순서가 바뀌거나 중간이 지워지지 않는 고정 목록이라 자리로 충분하다.
                        <span key={index} className="flex items-center">
                            {index > 0 ? <InlineSeparator /> : null}
                            {value}
                        </span>
                    ))}
                </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-2">
                {title}
                {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
            </div>
        </div>
        {children ? <ul className="flex flex-wrap gap-x-3 gap-y-2">{children}</ul> : null}
    </li>
)

// 이력 항목 아래의 동작 버튼 — 은행전송·기관전송·전송내역처럼 그 건에 대해 실행하는 일이다.
// 화면 이동이 아니라 동작이라 button 으로 둔다([NA-006] 의 링크 대상이 아니다).
//
// 시안의 button_text(xsmall)이 그대로 공용 Button 에 있다 — variant="text-underline" size="xs" 가
// 12px·행간 18·아이콘 12·글자와 아이콘 사이 4 를 모두 갖는다. 여기서 스타일을 다시 쓰지 않는다.
//
// 아직 실행할 수 없는 건은 disabled 로 둔다 — 눌리지 않는 이유가 화면에 그대로 보인다[6.1.1].
type HistoryActionProps = {
    /** 눌렀을 때 할 일. 넘기지 않으면 아무 일도 하지 않는다(퍼블리싱 목업). */
    onClick?: () => void
    disabled?: boolean
    children: ReactNode
}

const HistoryAction = ({onClick, disabled, children}: HistoryActionProps) => (
    <li data-slot="history-action">
        <Button type="button" variant="text-underline" size="xs" disabled={disabled} onClick={onClick}>
            {children}
            <SquareArrowOutUpRight aria-hidden="true" />
        </Button>
    </li>
)

export {HistoryList, HistoryItem, HistoryAction}
export type {HistoryItemProps, HistoryActionProps}
