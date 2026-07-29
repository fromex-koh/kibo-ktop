'use client'

import {createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode} from 'react'
import {cn} from '@/lib/utils'
import {stackPagerRootClassName} from '@/components/theme/stack-pager.variants'

const WHEEL_DELTA_TRIGGER = 20
// 터치 스와이프로 페이지를 넘기는 최소 이동 거리(px). 휠보다 크게 잡아 스크롤 의도와 탭을 구분한다.
const TOUCH_SWIPE_TRIGGER = 40
const WHEEL_GESTURE_IDLE_MS = 120
const TRANSITION_DURATION_MS = 600
const PAGE_DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' '])
const PAGE_UP_KEYS = new Set(['ArrowUp', 'PageUp'])
// 페이저가 켜지는 화면 조건 — globals.css 의 .stack-page 고정 레이어 미디어쿼리와 같은 값이어야 한다.
// 값을 바꾸면 globals.css 도 함께 고친다. 같은 판단이 필요한 화면 코드는 이 상수를 import 한다.
export const STACK_PAGER_QUERY = '(min-width: 768px) and (min-height: 640px)'
// 페이지 안쪽 스크롤로 인정하는 overflow 값 — hidden 은 화면이 움직이지 않으므로 제외한다.
const SCROLLABLE_OVERFLOW = new Set(['auto', 'scroll'])
const StackPagerActivePageContext = createContext(0)

export const useStackPagerActivePage = () => useContext(StackPagerActivePageContext)

const syncPageElements = (container: HTMLElement, activePage: number, isDesktop: boolean) => {
    const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-stack-page]'))
    const activePageElement = pages[activePage]
    const focusedElement = container.ownerDocument.activeElement
    const focusWillBeHidden =
        isDesktop &&
        focusedElement instanceof HTMLElement &&
        pages.some((page, index) => index !== activePage && (page === focusedElement || page.contains(focusedElement)))

    // 새 페이지가 이전 상태에서 inert 였다면 먼저 접근성 트리와 포커스 대상에 복귀시킨다.
    // 그 다음 포커스를 옮겨야 이전 페이지에 aria-hidden 을 적용할 때 브라우저 경고가 발생하지 않는다.
    if (isDesktop && activePageElement) {
        activePageElement.removeAttribute('aria-hidden')
        activePageElement.inert = false
        if (focusWillBeHidden) activePageElement.focus({preventScroll: true})
    }

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
const StackPager = ({
    children,
    className,
    mediaQuery = STACK_PAGER_QUERY,
    transition = 'slide',
}: {
    children: ReactNode
    className?: string
    mediaQuery?: string
    // slide: 이전 페이지가 위로 빠진다. cover: 이전 페이지를 제자리에 두고 다음 페이지가 덮는다
    // (전환 중 두 페이지 사이로 빈 배경이 드러나지 않는다). 실제 전환 규칙은 globals.css.
    transition?: 'slide' | 'cover'
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const activePageRef = useRef(0)
    const isTransitioningRef = useRef(false)
    const isGestureArmedRef = useRef(true)
    const accumulatedDeltaRef = useRef(0)
    // 이번 제스처가 페이지 안쪽 스크롤에 쓰였는지 — 쓰였다면 같은 제스처로는 페이지를 넘기지 않는다.
    const hasScrolledInsideRef = useRef(false)
    const transitionTimerRef = useRef(0)
    const gestureTimerRef = useRef(0)
    const [activePage, setActivePage] = useState(0)

    const movePage = useCallback((direction: 1 | -1, pageCount: number, reducedMotion: boolean) => {
        if (isTransitioningRef.current || !isGestureArmedRef.current) return

        const nextPage = Math.min(pageCount - 1, Math.max(0, activePageRef.current + direction))
        if (nextPage === activePageRef.current) return

        const nextPageElement = ref.current?.querySelectorAll<HTMLElement>('[data-stack-page]')[nextPage]
        nextPageElement?.scrollTo({top: 0, left: 0, behavior: 'auto'})

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

    const goToPage = useCallback(
        (page: number) => {
            const container = ref.current
            if (!container) return

            const pageCount = container.querySelectorAll('[data-stack-page]').length
            const nextPage = Math.min(pageCount - 1, Math.max(0, page))

            const nextPageElement = container.querySelectorAll<HTMLElement>('[data-stack-page]')[nextPage]
            nextPageElement?.scrollTo({top: 0, left: 0, behavior: 'auto'})

            activePageRef.current = nextPage
            isTransitioningRef.current = false
            isGestureArmedRef.current = true
            accumulatedDeltaRef.current = 0
            syncPageElements(container, nextPage, window.matchMedia(mediaQuery).matches)
            setActivePage(nextPage)
        },
        [mediaQuery],
    )

    useEffect(() => {
        const container = ref.current
        if (!container) return
        syncPageElements(container, activePage, window.matchMedia(mediaQuery).matches)
    }, [activePage, mediaQuery])

    useEffect(() => {
        const container = ref.current
        if (!container) return

        const desktopQuery = window.matchMedia(mediaQuery)
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const pages = Array.from(container.querySelectorAll<HTMLElement>('[data-stack-page]'))

        // 페이지 안에서 먼저 스크롤할지 판단할 때 overflow 를 함께 본다 — overflow:hidden 페이지도
        // 확대된 배경 같은 장식 요소 때문에 scrollHeight 가 커질 수 있는데, 그러면 화면에는 아무 변화가
        // 없는 상태로 입력만 먹혀 "조금 굴리면 빈 공간만 뜨고 다음 섹션으로 안 넘어가는" 문제가 된다.
        const canScrollPageInside = (page: HTMLElement | undefined, direction: 1 | -1) => {
            if (!page || !SCROLLABLE_OVERFLOW.has(getComputedStyle(page).overflowY)) return false
            const maxScroll = page.scrollHeight - page.clientHeight
            return direction > 0 ? page.scrollTop < maxScroll - 1 : page.scrollTop > 1
        }

        const armAfterGestureEnds = () => {
            window.clearTimeout(gestureTimerRef.current)
            gestureTimerRef.current = window.setTimeout(() => {
                isGestureArmedRef.current = true
                accumulatedDeltaRef.current = 0
                hasScrolledInsideRef.current = false
            }, WHEEL_GESTURE_IDLE_MS)
        }

        const handleWheel = (event: WheelEvent) => {
            if (!desktopQuery.matches) return

            // 섹션 전환 직후 같은 트랙패드 제스처의 관성 입력이 다음 섹션 내부 스크롤이나
            // 후속 스크롤로 이어지지 않게 전환 잠금과 제스처 종료를 가장 먼저 확인한다.
            if (isTransitioningRef.current || !isGestureArmedRef.current) {
                event.preventDefault()
                isGestureArmedRef.current = false
                armAfterGestureEnds()
                return
            }

            const activePageElement = pages[activePageRef.current]
            const canScrollActivePageDown = canScrollPageInside(activePageElement, 1)
            const canScrollActivePageUp = canScrollPageInside(activePageElement, -1)

            if (
                activePageElement &&
                ((event.deltaY > 0 && canScrollActivePageDown) || (event.deltaY < 0 && canScrollActivePageUp))
            ) {
                event.preventDefault()
                activePageElement.scrollBy({top: event.deltaY, behavior: 'auto'})
                accumulatedDeltaRef.current = 0
                // 이 제스처는 안쪽 스크롤용으로 표시하고, 제스처가 끝날 때까지 계속 안쪽만 굴린다.
                hasScrolledInsideRef.current = true
                armAfterGestureEnds()
                return
            }

            // 안쪽을 굴리던 제스처가 트랙 끝에 닿았다고 해서 그대로 페이지까지 넘기지 않는다.
            // 한 번 세게 굴렸을 때 2섹션의 두 화면을 지나쳐 1섹션이나 3섹션으로 튀던 원인이다.
            // 페이지를 넘기려면 손을 떼고(WHEEL_GESTURE_IDLE_MS) 다시 굴려야 한다.
            if (hasScrolledInsideRef.current) {
                event.preventDefault()
                armAfterGestureEnds()
                return
            }

            accumulatedDeltaRef.current += event.deltaY
            if (Math.abs(accumulatedDeltaRef.current) < WHEEL_DELTA_TRIGGER) {
                event.preventDefault()
                return
            }

            const direction = accumulatedDeltaRef.current > 0 ? 1 : -1
            event.preventDefault()
            movePage(direction, pages.length, reducedMotionQuery.matches)
            armAfterGestureEnds()
        }

        // 터치 스와이프 — 페이저가 켜진 화면(태블릿 포함)은 페이지가 fixed·overflow hidden 이라 네이티브
        // 스크롤이 없다. 휠만 듣고 있으면 터치로는 다음 섹션으로 갈 수 없으므로 세로 스와이프를 함께 받는다.
        // 안쪽이 스크롤되는 페이지는 네이티브 스크롤을 그대로 두고, 끝에 닿았을 때만 페이지를 넘긴다.
        let touchStartY = 0
        let isTouchTracking = false

        const handleTouchStart = (event: TouchEvent) => {
            if (!desktopQuery.matches || event.touches.length !== 1) {
                isTouchTracking = false
                return
            }
            touchStartY = event.touches[0].clientY
            isTouchTracking = true
            hasScrolledInsideRef.current = false
        }

        const handleTouchMove = (event: TouchEvent) => {
            if (!desktopQuery.matches || !isTouchTracking || event.touches.length !== 1) return

            // 위로 스와이프(손가락이 위로) = 다음 섹션.
            const swipeDistance = touchStartY - event.touches[0].clientY
            const direction = swipeDistance > 0 ? 1 : -1

            if (canScrollPageInside(pages[activePageRef.current], direction)) {
                hasScrolledInsideRef.current = true
                return
            }

            // 휠과 같은 이유 — 안쪽을 스크롤하던 스와이프가 끝에 닿아도 그대로 페이지를 넘기지 않는다.
            if (hasScrolledInsideRef.current) {
                event.preventDefault()
                return
            }

            if (isTransitioningRef.current) {
                event.preventDefault()
                return
            }

            if (Math.abs(swipeDistance) < TOUCH_SWIPE_TRIGGER) {
                event.preventDefault()
                return
            }

            event.preventDefault()
            isTouchTracking = false
            isGestureArmedRef.current = true
            movePage(direction, pages.length, reducedMotionQuery.matches)
        }

        const handleTouchEnd = () => {
            isTouchTracking = false
            hasScrolledInsideRef.current = false
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
        container.addEventListener('touchstart', handleTouchStart, {passive: true})
        container.addEventListener('touchmove', handleTouchMove, {passive: false})
        container.addEventListener('touchend', handleTouchEnd, {passive: true})
        container.addEventListener('touchcancel', handleTouchEnd, {passive: true})
        container.addEventListener('keydown', handleKeyDown)
        container.addEventListener('click', handleFragmentClick)
        desktopQuery.addEventListener('change', handleDesktopChange)

        return () => {
            window.clearTimeout(transitionTimerRef.current)
            window.clearTimeout(gestureTimerRef.current)
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchmove', handleTouchMove)
            container.removeEventListener('touchend', handleTouchEnd)
            container.removeEventListener('touchcancel', handleTouchEnd)
            container.removeEventListener('keydown', handleKeyDown)
            container.removeEventListener('click', handleFragmentClick)
            desktopQuery.removeEventListener('change', handleDesktopChange)
            pages.forEach((page) => {
                delete page.dataset.stackState
                page.removeAttribute('aria-hidden')
                page.inert = false
            })
        }
    }, [movePage, goToPage, mediaQuery])

    return (
        <StackPagerActivePageContext.Provider value={activePage}>
            <div
                ref={ref}
                data-stack-pager
                data-active-page={activePage}
                data-stack-transition={transition}
                // 페이저가 꺼지는 화면에서는 스크롤 스냅을 쓰지 않는다 — 모바일의 2·3섹션은 내용을 모두
                // 펼쳐 화면보다 훨씬 길어서(812 화면에 1992·3815), 스냅을 걸면 mandatory 든 proximity 든
                // 스크롤이 붙잡히는 느낌이 남는다. 그냥 평범한 세로 스크롤로 둔다.
                //
                // 컨테이너를 스크롤러로 두는 것은 유지한다 — 히어로 배경의 확대·페이드가 이 컨테이너의
                // scrollTop 을 읽는다(hero-background.tsx).
                className={cn(
                    stackPagerRootClassName,
                    'pager-off:h-dvh pager-off:overflow-y-auto pager-off:overscroll-y-contain',
                    className,
                )}
            >
                {children}
            </div>
        </StackPagerActivePageContext.Provider>
    )
}

export default StackPager
