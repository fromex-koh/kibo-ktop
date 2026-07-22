'use client'

import {createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode} from 'react'

const WHEEL_DELTA_TRIGGER = 20
const WHEEL_GESTURE_IDLE_MS = 120
const TRANSITION_DURATION_MS = 600
const PAGE_DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' '])
const PAGE_UP_KEYS = new Set(['ArrowUp', 'PageUp'])
const StackPagerActivePageContext = createContext(0)

export const useStackPagerActivePage = () => useContext(StackPagerActivePageContext)

const syncPageElements = (container: HTMLElement, activePage: number, isDesktop: boolean) => {
    const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-stack-page]'))
    pages.forEach((page, index) => {
        const state = index < activePage ? 'previous' : index > activePage ? 'next' : 'active'
        page.dataset.stackState = state

        if (isDesktop && state !== 'active') {
            page.setAttribute('aria-hidden', 'true')
            page.inert = true
        } else {
            page.removeAttribute('aria-hidden')
            page.inert = false
        }
    })
}

// godo.co.kr처럼 데스크톱에서는 실제 문서 스크롤 대신 고정 레이어의 상태만 전환한다.
// 한 제스처가 끝날 때까지 다음 입력을 받지 않아 트랙패드 관성이 여러 페이지를 통과시키지 않는다.
// 모바일은 고정 레이어를 사용하지 않고 기존 자연 스크롤을 유지한다. [KWCAG 6.1.1]
const StackPager = ({children, className}: {children: ReactNode; className?: string}) => {
    const ref = useRef<HTMLDivElement>(null)
    const activePageRef = useRef(0)
    const isTransitioningRef = useRef(false)
    const isGestureArmedRef = useRef(true)
    const accumulatedDeltaRef = useRef(0)
    const transitionTimerRef = useRef(0)
    const gestureTimerRef = useRef(0)
    const [activePage, setActivePage] = useState(0)

    const movePage = useCallback((direction: 1 | -1, pageCount: number, reducedMotion: boolean) => {
        if (isTransitioningRef.current || !isGestureArmedRef.current) return

        const nextPage = Math.min(pageCount - 1, Math.max(0, activePageRef.current + direction))
        if (nextPage === activePageRef.current) return

        activePageRef.current = nextPage
        isTransitioningRef.current = true
        isGestureArmedRef.current = false
        accumulatedDeltaRef.current = 0
        setActivePage(nextPage)

        window.clearTimeout(transitionTimerRef.current)
        transitionTimerRef.current = window.setTimeout(
            () => {
                isTransitioningRef.current = false
            },
            reducedMotion ? 0 : TRANSITION_DURATION_MS,
        )
    }, [])

    useEffect(() => {
        const container = ref.current
        if (!container) return
        syncPageElements(container, activePage, window.matchMedia('(min-width: 768px)').matches)
    }, [activePage])

    useEffect(() => {
        const container = ref.current
        if (!container) return

        const desktopQuery = window.matchMedia('(min-width: 768px)')
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-stack-page]'))

        const armAfterGestureEnds = () => {
            window.clearTimeout(gestureTimerRef.current)
            gestureTimerRef.current = window.setTimeout(() => {
                isGestureArmedRef.current = true
                accumulatedDeltaRef.current = 0
            }, WHEEL_GESTURE_IDLE_MS)
        }

        const handleWheel = (event: WheelEvent) => {
            if (!desktopQuery.matches) return
            event.preventDefault()

            if (isTransitioningRef.current || !isGestureArmedRef.current) {
                isGestureArmedRef.current = false
                armAfterGestureEnds()
                return
            }

            accumulatedDeltaRef.current += event.deltaY
            if (Math.abs(accumulatedDeltaRef.current) < WHEEL_DELTA_TRIGGER) return

            const direction = accumulatedDeltaRef.current > 0 ? 1 : -1
            movePage(direction, pages.length, reducedMotionQuery.matches)
            armAfterGestureEnds()
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!desktopQuery.matches || event.target !== container) return
            const direction = PAGE_DOWN_KEYS.has(event.key) ? 1 : PAGE_UP_KEYS.has(event.key) ? -1 : null
            if (direction === null) return
            event.preventDefault()
            isGestureArmedRef.current = true
            movePage(direction, pages.length, reducedMotionQuery.matches)
        }

        const handleDesktopChange = () => {
            if (!desktopQuery.matches) {
                activePageRef.current = 0
                isTransitioningRef.current = false
                isGestureArmedRef.current = true
                setActivePage(0)
            }
            syncPageElements(container, activePageRef.current, desktopQuery.matches)
        }

        syncPageElements(container, activePageRef.current, desktopQuery.matches)
        container.addEventListener('wheel', handleWheel, {passive: false})
        container.addEventListener('keydown', handleKeyDown)
        desktopQuery.addEventListener('change', handleDesktopChange)

        return () => {
            window.clearTimeout(transitionTimerRef.current)
            window.clearTimeout(gestureTimerRef.current)
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('keydown', handleKeyDown)
            desktopQuery.removeEventListener('change', handleDesktopChange)
            pages.forEach((page) => {
                delete page.dataset.stackState
                page.removeAttribute('aria-hidden')
                page.inert = false
            })
        }
    }, [movePage])

    return (
        <StackPagerActivePageContext.Provider value={activePage}>
            <div ref={ref} data-stack-pager data-active-page={activePage} className={className}>
                {children}
            </div>
        </StackPagerActivePageContext.Provider>
    )
}

export default StackPager
