'use client'

import {useState, useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode} from 'react'
import {ChevronDown, CircleAlert} from 'lucide-react'
import {ListMarker} from '@/components/custom/list-marker'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'
import {
    noticeAccordionChevronClassName,
    noticeAccordionClassName,
    noticeAccordionIconClassName,
    noticeAccordionItemClassName,
    noticeAccordionListClassName,
    noticeAccordionTriggerClassName,
} from '@/components/theme/notice-accordion.variants'
import {cn} from '@/lib/utils'

// 알림 아코디언(NoticeAccordion) — 모달·화면 위쪽에서 "꼭 알아두세요" 같은 안내 목록을 여닫는 패널.
// InfoBox 와 같은 "제목 + 불릿 목록" 이지만 제목 줄을 눌러 목록을 접을 수 있다. 여닫기·aria-expanded·
// aria-controls 는 radix Collapsible 이 맡는다.
//
// 처음 상태 — defaultOpen 을 주지 않으면 화면 폭으로 정한다: PC(xl, 1280 이상)는 펼치고 태블릿·모바일은
// 접는다(좁은 화면에서 안내가 목록을 밀어내지 않게). 사용자가 한 번 누르면 그 뒤로는 누른 상태를 따른다.
// 서버 렌더와 첫 그림은 접힌 상태이고, PC 면 하이드레이션 직후 펼쳐진다.
//
// 복합 API — 컨테이너(NoticeAccordion)와 항목(NoticeAccordionItem)을 나눈다(InfoBox 와 같은 모양).

const PC_MEDIA_QUERY = '(min-width: 80rem)' // xl(1280) — tokens.json breakpoint.xl

const subscribePcMedia = (onChange: () => void) => {
    const media = window.matchMedia(PC_MEDIA_QUERY)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
}
const getPcMediaSnapshot = () => window.matchMedia(PC_MEDIA_QUERY).matches
const getPcMediaServerSnapshot = () => false

type NoticeAccordionProps = {
    /** 제목 줄 글자. */
    title?: ReactNode
    /** 처음에 펼칠지. 주지 않으면 PC 는 펼치고 태블릿·모바일은 접는다. */
    defaultOpen?: boolean
    /** 여닫기를 바깥에서 쥘 때. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** NoticeAccordionItem 들. */
    children: ReactNode
} & Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'defaultValue' | 'dir'>

const NoticeAccordion = ({
    title = '꼭 알아두세요',
    defaultOpen,
    open,
    onOpenChange,
    className,
    children,
    ...props
}: NoticeAccordionProps) => {
    const isPc = useSyncExternalStore(subscribePcMedia, getPcMediaSnapshot, getPcMediaServerSnapshot)
    // 사용자가 누른 상태 — 누르기 전(null)에는 defaultOpen, 그것도 없으면 화면 폭을 따른다.
    const [userOpen, setUserOpen] = useState<boolean | null>(null)
    const isOpen = open ?? userOpen ?? defaultOpen ?? isPc

    const handleOpenChange = (nextOpen: boolean) => {
        setUserOpen(nextOpen)
        onOpenChange?.(nextOpen)
    }

    return (
        <Collapsible
            data-slot="notice-accordion"
            open={isOpen}
            onOpenChange={handleOpenChange}
            className={cn(noticeAccordionClassName, className)}
            {...props}
        >
            <CollapsibleTrigger className={noticeAccordionTriggerClassName}>
                <CircleAlert aria-hidden="true" className={noticeAccordionIconClassName} />
                <span className="min-w-0">{title}</span>
                <ChevronDown aria-hidden="true" className={noticeAccordionChevronClassName} />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ul className={noticeAccordionListClassName}>{children}</ul>
            </CollapsibleContent>
        </Collapsible>
    )
}

// 항목 — 본문이 14/21 이라 작은 점(12×20 칸 · 3×3 점)을 쓴다(DialogNotice 와 같은 마커).
const NoticeAccordionItem = ({className, children, ...props}: ComponentPropsWithoutRef<'li'>) => (
    <li className={cn(noticeAccordionItemClassName, className)} {...props}>
        <ListMarker type="unordered-small" />
        <span className="min-w-0 break-keep">{children}</span>
    </li>
)

export {NoticeAccordion, NoticeAccordionItem}
export type {NoticeAccordionProps}
