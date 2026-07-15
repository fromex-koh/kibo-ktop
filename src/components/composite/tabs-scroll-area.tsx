'use client'

import {useEffect, useRef, useState} from 'react'
import type {ComponentPropsWithoutRef} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/kit/button'
import {TabsList} from '@/components/kit/tabs'
import {cn} from '@/lib/utils'

// 좌우 스크롤 탭(TabsScrollArea) — 탭이 많아 폭을 넘칠 때, 좌우 화살표 버튼으로 넘겨보는 TabsList(variant="line")
// 래퍼. 화살표는 데스크톱·모바일 모두에서 항상 노출한다(스와이프가 어려운 데스크톱 + 터치 접근성). radix/shadcn
// 어디에도 없는 동작(스크롤 위치 추적·화살표 활성/비활성·활성 탭 중앙정렬)이라 kit 셸을 건드리지 않고 composite
// 에서 kit 프리미티브(TabsList·Button)를 조합해 만든다([SC-04] 기능은 composite 레이어에서).
//
// 스크롤은 네이티브 overflow-x-auto 를 가진 div(scrollRef)로 직접 제어한다 — 화살표가 스크롤 신호를 이미 주므로
// 네이티브 스크롤바는 globals.css 의 scrollbar-hidden 으로 숨긴다(중복 방지).
//
// 폭: TabsList 를 w-max + min-w-full → 실제 폭 = max(내용, 부모 100%). 안 넘칠 땐 부모 풀폭이라 하단 밑줄이
// 끝까지 이어지고(안 그러면 내용 폭까지만 그어져 잘림), 넘칠 땐 내용 폭이라 스크롤이 생긴다. w-max 는 kit line
// variant 기본 w-full 을 이기려 같은 접두사로 특이도를 맞춘다(min-w-full 은 경쟁 규칙이 없어 접두사 불필요).
//
// 화살표: 항상 렌더하고, 그 방향으로 더 스크롤할 수 없으면 그 버튼만 aria-disabled + 흐림 처리한다 — 네이티브
// disabled 는 포커스를 못 가져 포커스된 채 disabled 되면 포커스가 사라지므로(WAI-ARIA APG), aria-disabled 로
// 포커스를 유지하고 클릭 핸들러에서 동작만 막는다([6.1.2]). 클릭 시 SCROLL_STEP_PX 만큼 스크롤.
//
// 중앙정렬: 키보드 화살표(←/→·Home/End)로 탭 포커스를 옮기면(Radix 자동 활성화라 포커스=활성 탭) 그 탭이 스크롤
// 영역 중앙에 오게 한다. keydown 을 capture 로 먼저 잡아 플래그를 세운 뒤 뒤이어 오는 focusin 에서만 중앙정렬한다
// — 마우스 클릭 focusin 은 제외(이미 보고 클릭한 탭을 임의로 스크롤하지 않게). pointerdown 시 플래그를 내려, 끝
// 탭에서 화살표를 눌러 포커스가 안 움직인 뒤의 클릭이 플래그를 물려받는 것도 막는다.
//
// 페이드: 스크롤 가능한 쪽만 배경색→투명 그라데이션 오버레이(토큰·유틸: from-background + w-8)로 가장자리를 부드럽게
// 가려 하드컷을 없앤다. 순수 장식이라 aria-hidden·pointer-events-none. 배경이 bg-background 아닌 표면 위에선 색이
// 어긋나므로 그땐 부모 배경을 맞춘다. 클릭·중앙정렬 스크롤은 prefers-reduced-motion 을 존중한다([6.3.1]).

const SCROLL_STEP_PX = 240
const KEYBOARD_NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
const DIMMED_ARROW_CLASS = 'pointer-events-none opacity-50'

type TabsScrollAreaProps = ComponentPropsWithoutRef<typeof TabsList>

const TabsScrollArea = ({className, children, ...props}: TabsScrollAreaProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    useEffect(() => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return

        const updateScrollState = () => {
            setCanScrollLeft(scrollEl.scrollLeft > 0)
            setCanScrollRight(scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 1)
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

    const scrollByStep = (direction: 1 | -1) => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        scrollEl.scrollBy({left: direction * SCROLL_STEP_PX, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    return (
        <div data-slot="tabs-scroll-area" className="flex items-center gap-1">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="탭 목록 왼쪽으로 스크롤"
                aria-disabled={!canScrollLeft}
                onClick={() => canScrollLeft && scrollByStep(-1)}
                className={cn('shrink-0', !canScrollLeft && DIMMED_ARROW_CLASS)}
            >
                <ChevronLeft aria-hidden="true" />
            </Button>
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
                        className="from-background pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent"
                    />
                ) : null}
                {canScrollRight ? (
                    <div
                        aria-hidden="true"
                        className="from-background pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent"
                    />
                ) : null}
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="탭 목록 오른쪽으로 스크롤"
                aria-disabled={!canScrollRight}
                onClick={() => canScrollRight && scrollByStep(1)}
                className={cn('shrink-0', !canScrollRight && DIMMED_ARROW_CLASS)}
            >
                <ChevronRight aria-hidden="true" />
            </Button>
        </div>
    )
}

export {TabsScrollArea}
export type {TabsScrollAreaProps}
