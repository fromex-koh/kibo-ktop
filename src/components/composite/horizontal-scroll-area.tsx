'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 가로 스크롤 영역(HorizontalScrollArea) — 한 줄 목록(탭 · 세그먼트 필터)이 넘치면 이 영역만 가로로 스크롤한다.
// 쓰는 곳: TabsScrollArea(탭) · 이용권 관리 상태 필터(SegmentedControl).
// [프론트엔드 연동] 안의 목록에는 w-max 를 준다 — 부모 폭에 맞춰 줄면 넘치지 않아 스크롤이 생기지 않는다.
//
// 동작
//   · 넘칠 때만 좌우 화살표가 나온다. 클릭하면 항목 하나 폭만큼 넘긴다. 스와이프도 된다.
//   · 더 못 가는 쪽 화살표는 disabled 대신 aria-disabled + 흐림 — disabled 는 포커스를 잃는다(WAI-ARIA APG).
//   · 키보드(방향키 · Home · End)로 옮긴 항목은 영역 가운데로 온다.
//   · 넘친 쪽 가장자리는 mask 로 흐리게 — 배경색과 무관하게 경계가 보이지 않는다.
//   · 스크롤 애니메이션은 prefers-reduced-motion 을 따른다[6.3.1]. 네이티브 스크롤바는 scrollbar-hidden 으로 숨긴다.

const KEYBOARD_NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
// 더 못 가는 쪽 화살표의 흐림. 클릭은 onClick 가드가 막고, not-allowed 커서 · hover 억제는 Button 이 처리한다.
// pointer-events-none 은 쓰지 않는다 — 커서가 안 잡혀 not-allowed 가 보이지 않는다.
const DIMMED_ARROW_CLASS = 'opacity-50'

type HorizontalScrollAreaProps = {
    children: ReactNode
    /** 항목 하나를 찾는 선택자 — 화살표가 넘기는 폭과 키보드 가운데 맞춤의 기준이다. 예: '[data-slot="tabs-trigger"]'. */
    itemSelector: string
    /** 화살표 버튼 이름에 붙는 목록 이름 — "{scrollLabel} 왼쪽으로 스크롤". */
    scrollLabel: string
    className?: string
}

const HorizontalScrollArea = ({children, itemSelector, scrollLabel, className}: HorizontalScrollAreaProps) => {
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
            // 포커스는 항목 안쪽(세그먼트의 라디오 버튼 등)에 갈 수 있어 가장 가까운 항목을 찾는다.
            const target = event.target instanceof Element ? event.target.closest(itemSelector) : null
            if (!(target instanceof HTMLElement)) return
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
    }, [itemSelector])

    const scrollByItem = (direction: 1 | -1) => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return
        const item = scrollEl.querySelector<HTMLElement>(itemSelector)
        const scrollAmount = item ? item.getBoundingClientRect().width : scrollEl.clientWidth
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        scrollEl.scrollBy({left: direction * scrollAmount, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    return (
        <div data-slot="horizontal-scroll-area" className={cn('flex items-center gap-1', className)}>
            {isOverflowing ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${scrollLabel} 왼쪽으로 스크롤`}
                    aria-disabled={!canScrollLeft}
                    onClick={() => canScrollLeft && scrollByItem(-1)}
                    className={cn('shrink-0', !canScrollLeft && DIMMED_ARROW_CLASS)}
                >
                    <ChevronLeft aria-hidden="true" />
                </Button>
            ) : null}
            <div className="relative min-w-0 flex-1">
                <div
                    ref={scrollRef}
                    className={cn(
                        'scrollbar-hidden overflow-x-auto',
                        canScrollLeft && 'mask-l-from-90%',
                        canScrollRight && 'mask-r-from-90%',
                    )}
                >
                    {children}
                </div>
            </div>
            {isOverflowing ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${scrollLabel} 오른쪽으로 스크롤`}
                    aria-disabled={!canScrollRight}
                    onClick={() => canScrollRight && scrollByItem(1)}
                    className={cn('shrink-0', !canScrollRight && DIMMED_ARROW_CLASS)}
                >
                    <ChevronRight aria-hidden="true" />
                </Button>
            ) : null}
        </div>
    )
}

export {HorizontalScrollArea}
export type {HorizontalScrollAreaProps}
