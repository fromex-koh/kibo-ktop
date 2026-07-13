'use client'

import type {ComponentPropsWithoutRef, KeyboardEvent, ReactNode} from 'react'
import {Badge} from '@/components/kit/badge'
import {cn} from '@/lib/utils'

// 탭 카드 — 카드 모양의 탭(L2 composite). Figma "입력타겟" 반영: 제목 + 진행 상태 배지의 카드가
// 가로로 나열되고, 선택된 탭만 파란 테두리(border-primary) + 제목 bold 로 강조된다.
// 폼 섹션을 전환하는 탭 내비게이션에 쓴다(각 탭 = 한 섹션, 배지 = 그 섹션의 작성 상태).

// 진행 상태 → kit Badge 매핑. 작성중(info)·작성완료(info 아웃라인)·미작성(neutral).
type TabCardStatus = '작성중' | '작성완료' | '미작성'
const STATUS_BADGE: Record<TabCardStatus, {color: 'info' | 'neutral'; variant?: 'outline'}> = {
    작성중: {color: 'info'},
    작성완료: {color: 'info', variant: 'outline'},
    미작성: {color: 'neutral'},
}

type TabCardProps = {
    title: ReactNode
    status?: TabCardStatus
    active?: boolean
} & ComponentPropsWithoutRef<'button'>

// 개별 탭 카드. active 면 role=tab 의 유일한 탭 스톱(tabIndex 0)이 되고 파란 테두리로 강조된다.
// 좌우 화살표·Home/End 로 같은 tablist 안 탭 사이의 포커스를 옮긴다([6.1.1] 키보드). 포커스는 button
// 자신이 받으므로(tablist 컨테이너가 아니라) 키보드 처리도 여기(탭)에 둔다.
const TabCard = ({title, status, active = false, className, onKeyDown, ...props}: TabCardProps) => {
    const badge = status ? STATUS_BADGE[status] : null
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        const tablist = event.currentTarget.closest('[role="tablist"]')
        if (tablist) {
            const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'))
            const current = tabs.indexOf(event.currentTarget)
            const focusAt = (index: number) => {
                event.preventDefault()
                tabs[(index + tabs.length) % tabs.length].focus()
            }
            if (event.key === 'ArrowRight') focusAt(current + 1)
            else if (event.key === 'ArrowLeft') focusAt(current - 1)
            else if (event.key === 'Home') focusAt(0)
            else if (event.key === 'End') focusAt(tabs.length - 1)
        }
        onKeyDown?.(event)
    }
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            data-active={active}
            onKeyDown={handleKeyDown}
            className={cn(
                'bg-card focus-visible:ring-ring shadow-1 flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 px-4 py-6 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                active ? 'border-primary' : 'hover:border-border border-transparent',
                className,
            )}
            {...props}
        >
            <span className={cn('text-foreground', active ? 'typo-title-l-bold' : 'typo-title-l-medium')}>{title}</span>
            {badge ? (
                <Badge color={badge.color} variant={badge.variant}>
                    {status}
                </Badge>
            ) : null}
        </button>
    )
}

// 탭 카드 목록(role=tablist) — 균등 폭으로 가로 배치한다. 선택(활성 전환)은 사용처의 onClick,
// 탭 사이 키보드 이동은 각 TabCard 가 담당한다.
const TabCardList = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div role="tablist" className={cn('grid auto-cols-fr grid-flow-col gap-4', className)} {...props} />
)

export {TabCard, TabCardList}
export type {TabCardProps, TabCardStatus}
