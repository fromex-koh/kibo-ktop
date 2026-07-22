'use client'

import {createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode} from 'react'

const WHEEL_DELTA_TRIGGER = 20
const WHEEL_GESTURE_IDLE_MS = 120
const TRANSITION_DURATION_MS = 600
const PAGE_DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' '])
const PAGE_UP_KEYS = new Set(['ArrowUp', 'PageUp'])
const STACK_PAGER_QUERY = '(min-width: 768px) and (min-height: 720px)'
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

// 화면 너비와 높이가 모두 충분하면 실제 문서 스크롤 대신 고정 레이어의 상태만 전환한다.
// 한 제스처가 끝날 때까지 다음 입력을 받지 않아 트랙패드 관성이 여러 페이지를 통과시키지 않는다.
// 모바일 또는 낮은 데스크톱 화면은 고정 레이어를 사용하지 않고 자연 스크롤을 유지한다. [KWCAG 6.1.1]
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

    const goToPage = useCallback((page: number) => {
        const container = ref.current
        if (!container) return

        const pageCount = container.querySelectorAll('[data-stack-page]').length
        const nextPage = Math.min(pageCount - 1, Math.max(0, page))

        activePageRef.current = nextPage
        isTransitioningRef.current = false
        isGestureArmedRef.current = true
        accumulatedDeltaRef.current = 0
        syncPageElements(container, nextPage, window.matchMedia(STACK_PAGER_QUERY).matches)
        setActivePage(nextPage)
    }, [])

    useEffect(() => {
        const container = ref.current
        if (!container) return
        syncPageElements(container, activePage, window.matchMedia(STACK_PAGER_QUERY).matches)
    }, [activePage])

    useEffect(() => {
        const container = ref.current
        if (!container) return

        const desktopQuery = window.matchMedia(STACK_PAGER_QUERY)
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

        // 바로가기 링크(#id) 대응 — 비활성 페이지는 inert 라 앵커 이동만으로는 포커스가 옮겨가지 않는다.
        // 기본 이동이 일어나기 전에 대상이 속한 페이지를 활성화해 inert 를 동기적으로 풀어준다. [KWCAG 6.1.1]
        const handleFragmentClick = (event: MouseEvent) => {
            if (!(event.target instanceof Element)) return

            const link = event.target.closest('a[href^="#"]')
            if (!link) return

            const targetId = link.getAttribute('href')?.slice(1)
            const target = targetId ? container.querySelector(`#${CSS.escape(targetId)}`) : null
            const targetPage = target?.closest('[data-stack-page]')
            if (!targetPage) return

            const targetIndex = pages.indexOf(targetPage instanceof HTMLElement ? targetPage : pages[0])
            if (targetIndex >= 0) goToPage(targetIndex)
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
        container.addEventListener('click', handleFragmentClick)
        desktopQuery.addEventListener('change', handleDesktopChange)

        return () => {
            window.clearTimeout(transitionTimerRef.current)
            window.clearTimeout(gestureTimerRef.current)
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('keydown', handleKeyDown)
            container.removeEventListener('click', handleFragmentClick)
            desktopQuery.removeEventListener('change', handleDesktopChange)
            pages.forEach((page) => {
                delete page.dataset.stackState
                page.removeAttribute('aria-hidden')
                page.inert = false
            })
        }
    }, [movePage, goToPage])

    return (
        <StackPagerActivePageContext.Provider value={activePage}>
            <div ref={ref} data-stack-pager data-active-page={activePage} className={className}>
                {children}
            </div>
        </StackPagerActivePageContext.Provider>
    )
}

export default StackPager
