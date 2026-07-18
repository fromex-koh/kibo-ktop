'use client'

import {useEffect, useRef, useState} from 'react'
import type {ComponentPropsWithoutRef} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {TabsList} from '@/components/ui/tabs'
import {cn} from '@/lib/utils'

// 좌우 스크롤 탭(TabsScrollArea) — 탭이 많아 폭을 넘칠 때, 좌우 화살표 버튼으로 넘겨보는 TabsList(variant="line")
// 래퍼. radix/shadcn 어디에도 없는 동작(스크롤 위치 추적·화살표 활성/비활성·활성 탭 중앙정렬)이라 kit 셸을
// 건드리지 않고 composite 에서 kit 프리미티브(TabsList·Button)를 조합해 만든다([SC-04] 기능은 composite 레이어에서).
//
// 스크롤은 네이티브 overflow-x-auto 를 가진 div(scrollRef)로 직접 제어한다 — 화살표가 스크롤 신호를 이미 주므로
// 네이티브 스크롤바는 globals.css 의 scrollbar-hidden 으로 숨긴다(중복 방지).
//
// 폭: TabsList 를 w-max + min-w-full → 실제 폭 = max(내용, 부모 100%). 안 넘칠 땐 부모 풀폭이라 하단 밑줄이
// 끝까지 이어지고(안 그러면 내용 폭까지만 그어져 잘림), 넘칠 땐 내용 폭이라 스크롤이 생긴다. w-max 는 kit line
// variant 기본 w-full 을 이기려 같은 접두사로 특이도를 맞춘다(min-w-full 은 경쟁 규칙이 없어 접두사 불필요).
//
// 화살표: 탭 제목이 모두 노출되면 렌더하지 않고, 실제로 overflow 가 생길 때만 노출한다. 노출된 뒤에는 그 방향으로
// 더 이동할 수 없는 버튼만 aria-disabled + 흐림 처리한다 — 네이티브 disabled 는 포커스를 못 가져 포커스된 채
// disabled 되면 포커스가 사라지므로(WAI-ARIA APG), aria-disabled 로 포커스를 유지한다. 클릭 시 탭 하나의 너비만큼
// 다음/이전 영역을 보여준다.
//
// 중앙정렬: 키보드로 활성 탭을 옮길 때 해당 탭을 스크롤 영역 중앙에 배치한다. 화살표는 탭 너비만큼만 이동한다.
//
// 페이드: 스크롤 가능한 쪽만 카드 표면색→투명 그라데이션 오버레이(토큰·유틸: from-surface + w-8)로 가장자리를
// 부드럽게 가려 하드컷을 없앤다. 순수 장식이라 aria-hidden·pointer-events-none. 클릭·중앙정렬 스크롤은
// prefers-reduced-motion 을 존중한다([6.3.1]).

const KEYBOARD_NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
const DIMMED_ARROW_CLASS = 'pointer-events-none opacity-50'

type TabsScrollAreaProps = ComponentPropsWithoutRef<typeof TabsList>

const TabsScrollArea = ({className, children, ...props}: TabsScrollAreaProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    useEffect(() => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return

        const updateScrollState = () => {
            const nextIsOverflowing = scrollEl.scrollWidth > scrollEl.clientWidth + 1
            setIsOverflowing(nextIsOverflowing)
            setCanScrollLeft(nextIsOverflowing && scrollEl.scrollLeft > 0)
            setCanScrollRight(
                nextIsOverflowing && scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 1,
            )
        }

        let isKeyboardNav = false
        const handleKeyDownCapture = (event: KeyboardEvent) => {
            if (KEYBOARD_NAV_KEYS.includes(event.key)) isKeyboardNav = true
        }
        const handlePointerDown = () => {
            isKeyboardNav = false
        }
        const handleFocusIn = (event: FocusEvent) => {
            if (!isKeyboardNav) return
            isKeyboardNav = false
            const target = event.target
            if (!(target instanceof HTMLElement) || !target.matches('[data-slot="tabs-trigger"]')) return
            const scrollRect = scrollEl.getBoundingClientRect()
            const targetRect = target.getBoundingClientRect()
            const targetCenter = targetRect.left - scrollRect.left + scrollEl.scrollLeft + targetRect.width / 2
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            scrollEl.scrollTo({
                left: targetCenter - scrollEl.clientWidth / 2,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            })
        }

        updateScrollState()
        scrollEl.addEventListener('scroll', updateScrollState, {passive: true})
        scrollEl.addEventListener('keydown', handleKeyDownCapture, true)
        scrollEl.addEventListener('pointerdown', handlePointerDown, true)
        scrollEl.addEventListener('focusin', handleFocusIn)
        const resizeObserver = new ResizeObserver(updateScrollState)
        resizeObserver.observe(scrollEl)
        return () => {
            scrollEl.removeEventListener('scroll', updateScrollState)
            scrollEl.removeEventListener('keydown', handleKeyDownCapture, true)
            scrollEl.removeEventListener('pointerdown', handlePointerDown, true)
            scrollEl.removeEventListener('focusin', handleFocusIn)
            resizeObserver.disconnect()
        }
    }, [])

    const scrollByTab = (direction: 1 | -1) => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return
        const tab = scrollEl.querySelector<HTMLElement>('[data-slot="tabs-trigger"]')
        const scrollAmount = tab ? tab.getBoundingClientRect().width : scrollEl.clientWidth
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        scrollEl.scrollBy({left: direction * scrollAmount, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    return (
        <div data-slot="tabs-scroll-area" className="flex items-center gap-1">
            {isOverflowing ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="탭 목록 왼쪽으로 스크롤"
                    aria-disabled={!canScrollLeft}
                    onClick={() => canScrollLeft && scrollByTab(-1)}
                    className={cn('shrink-0', !canScrollLeft && DIMMED_ARROW_CLASS)}
                >
                    <ChevronLeft aria-hidden="true" />
                </Button>
            ) : null}
            <div className="relative min-w-0 flex-1">
                <div ref={scrollRef} className="scrollbar-hidden overflow-x-auto">
                    <TabsList
                        variant="line"
                        className={cn('min-w-full data-[variant=line]:w-max', className)}
                        {...props}
                    >
                        {children}
                    </TabsList>
                </div>
                {canScrollLeft ? (
                    <div
                        aria-hidden="true"
                        className="from-surface pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent"
                    />
                ) : null}
                {canScrollRight ? (
                    <div
                        aria-hidden="true"
                        className="from-surface pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent"
                    />
                ) : null}
            </div>
            {isOverflowing ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="탭 목록 오른쪽으로 스크롤"
                    aria-disabled={!canScrollRight}
                    onClick={() => canScrollRight && scrollByTab(1)}
                    className={cn('shrink-0', !canScrollRight && DIMMED_ARROW_CLASS)}
                >
                    <ChevronRight aria-hidden="true" />
                </Button>
            ) : null}
        </div>
    )
}

export {TabsScrollArea}
export type {TabsScrollAreaProps}
