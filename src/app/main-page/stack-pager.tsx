'use client'

import {useEffect, useRef, type ReactNode} from 'react'

// godo.co.kr 참고 풀스크린 스택 전환의 휠·키보드 페이징 스크롤 컨테이너.
// snap-mandatory만으로는 휠 한 틱(±100px 안팎)이 화면 중간을 못 넘겨 항상 제자리로 되돌아온다
// (사용자에겐 "스크롤이 안 되는" 상태). 그래서 md 이상에서 휠 한 번 = 한 화면 전환으로 매핑한다.
// 터치·스크롤바 드래그는 네이티브 스크롤 + CSS 스냅에 그대로 맡긴다. [KWCAG 6.1.1]
const WHEEL_DELTA_TRIGGER = 18 // 작은 트랙패드 입력도 한 제스처 안에서 누적해 전환한다.
const WHEEL_GESTURE_IDLE_MS = 140 // 이 시간 동안 입력이 없으면 새 휠 제스처로 본다.
const SETTLE_FALLBACK_MS = 1000 // scrollend 미지원 브라우저에서 전환 잠금을 푸는 타임아웃
const INERTIA_QUIET_MS = 180 // 전환 뒤 이 시간 동안 휠 입력이 완전히 멈춘 뒤에만 다음 제스처를 허용한다.
const PAGE_POSITION_TOLERANCE = 2

const PAGE_DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' '])
const PAGE_UP_KEYS = new Set(['ArrowUp', 'PageUp'])
export const STACK_PAGE_CHANGE_EVENT = 'stackpagechange'

const StackPager = ({children, className}: {children: ReactNode; className?: string}) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = ref.current
        if (!container) return

        // 페이징이 걸리는 폭(스냅과 동일한 md)·감속 모션 선호를 미디어쿼리로 판별
        const desktopQuery = window.matchMedia('(min-width: 768px)')
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let isPaging = false
        let isWheelArmed = true
        let settleTimer = 0
        let wheelGestureTimer = 0
        let wheelArmTimer = 0
        let accumulatedWheelDelta = 0
        let lastWheelAt = Number.NEGATIVE_INFINITY
        let targetScrollTop: number | null = null
        const getPagePositions = () => {
            const containerRect = container.getBoundingClientRect()
            const maxTop = Math.max(0, container.scrollHeight - container.clientHeight)
            const positions = Array.from(container.querySelectorAll<HTMLElement>('[data-stack-page]')).map((page) =>
                Math.min(
                    maxTop,
                    Math.max(0, page.getBoundingClientRect().top - containerRect.top + container.scrollTop),
                ),
            )

            return positions.filter(
                (position, index) => index === 0 || Math.abs(position - positions[index - 1]) > PAGE_POSITION_TOLERANCE,
            )
        }

        const getNearestPage = (positions: number[]) => {
            let nearestPage = 0
            let nearestDistance = Number.POSITIVE_INFINITY
            positions.forEach((position, index) => {
                const distance = Math.abs(container.scrollTop - position)
                if (distance < nearestDistance) {
                    nearestPage = index
                    nearestDistance = distance
                }
            })
            return {page: nearestPage, distance: nearestDistance}
        }

        let currentPage = getNearestPage(getPagePositions()).page

        const announcePageChange = () => {
            const {page: nextPage, distance} = getNearestPage(getPagePositions())
            if (distance > PAGE_POSITION_TOLERANCE) return
            if (nextPage === currentPage) return
            currentPage = nextPage
            container.dispatchEvent(new CustomEvent(STACK_PAGE_CHANGE_EVENT, {detail: {page: currentPage}}))
        }

        const releaseLock = () => {
            isPaging = false
            targetScrollTop = null
            accumulatedWheelDelta = 0
            // 트랙패드 관성은 섹션 도착 뒤에도 끊겼다가 다시 들어올 수 있다.
            // 마지막 입력 이후 조용한 구간이 확보되기 전에는 다음 페이지 이동을 절대 허용하지 않는다.
            isWheelArmed = false
            window.clearTimeout(wheelArmTimer)
            wheelArmTimer = window.setTimeout(() => {
                isWheelArmed = true
            }, INERTIA_QUIET_MS)
        }

        // 각 섹션의 실제 위치를 기준으로 한 화면 이동한다. Footer처럼 높이가 뷰포트와 다르거나
        // snap-end를 쓰는 영역도 고정된 `화면 높이 × 번호` 계산에서 벗어나 정확한 이전 섹션으로 돌아간다.
        const stepPage = (isForward: boolean): boolean => {
            const positions = getPagePositions()
            const currentTop = container.scrollTop
            const targetTop = isForward
                ? positions.find((position) => position > currentTop + PAGE_POSITION_TOLERANCE)
                : positions.findLast((position) => position < currentTop - PAGE_POSITION_TOLERANCE)
            if (targetTop === undefined) return false

            isPaging = true
            targetScrollTop = targetTop
            window.clearTimeout(settleTimer)
            settleTimer = window.setTimeout(() => {
                // smooth 스크롤이 비활성인 환경(감속 설정·일부 내장 브라우저) 폴백 —
                // 전환이 목표에 못 갔으면 즉시 이동으로 마무리해 페이징이 항상 보장되게 한다.
                if (Math.abs(container.scrollTop - targetTop) > 1) container.scrollTop = targetTop
                releaseLock()
            }, SETTLE_FALLBACK_MS)
            container.scrollTo({
                top: targetTop,
                behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
            })
            return true
        }

        const handleWheel = (event: WheelEvent) => {
            if (!desktopQuery.matches) return
            event.preventDefault()

            const now = performance.now()
            const isNewGesture = now - lastWheelAt > WHEEL_GESTURE_IDLE_MS
            lastWheelAt = now

            if (isPaging) {
                // 진행 중인 전환에서 발생한 입력은 관성인지 새 입력인지 안전하게 구분할 수 없다.
                // 예약 이동을 만들지 않고 모두 소모해야 도착 후 임의의 연속 이동이 생기지 않는다.
                return
            }

            if (!isWheelArmed) {
                window.clearTimeout(wheelArmTimer)
                wheelArmTimer = window.setTimeout(() => {
                    isWheelArmed = true
                }, INERTIA_QUIET_MS)
                return
            }

            window.clearTimeout(wheelGestureTimer)
            if (isNewGesture) accumulatedWheelDelta = 0
            accumulatedWheelDelta += event.deltaY
            wheelGestureTimer = window.setTimeout(() => {
                accumulatedWheelDelta = 0
            }, WHEEL_GESTURE_IDLE_MS)

            // 고해상도 트랙패드는 한 번의 스와이프를 여러 개의 작은 delta로 나눈다.
            // 이벤트 하나를 버리지 않고 누적해 임계값에 도달한 순간 정확히 한 페이지 이동한다.
            if (Math.abs(accumulatedWheelDelta) < WHEEL_DELTA_TRIGGER) return

            const isForward = accumulatedWheelDelta > 0
            accumulatedWheelDelta = 0
            stepPage(isForward)
        }

        // 스크롤 컨테이너 자체에 포커스가 있을 때의 키 스크롤도 스냅에 갇히지 않게 페이징으로 매핑
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!desktopQuery.matches || event.target !== container) return
            const isForward = PAGE_DOWN_KEYS.has(event.key)
            if (!isForward && !PAGE_UP_KEYS.has(event.key)) return
            if (isPaging || stepPage(isForward)) event.preventDefault()
        }

        // 부드러운 전환이 실제로 끝난 시점에 잠금 해제(미지원 브라우저는 타임아웃이 대신 해제)
        const handleScrollEnd = () => {
            if (!isPaging) return
            window.clearTimeout(settleTimer)
            releaseLock()
        }

        const handleScroll = () => {
            announcePageChange()
            // 일부 브라우저에서는 footer의 snap-end 전환 뒤 scrollend가 늦게 발생한다.
            // 목표 위치에 실제 도착한 순간 잠금을 풀어 다음 휠 입력이 누락되지 않게 한다.
            if (
                isPaging &&
                targetScrollTop !== null &&
                Math.abs(container.scrollTop - targetScrollTop) <= PAGE_POSITION_TOLERANCE
            ) {
                window.clearTimeout(settleTimer)
                releaseLock()
            }
        }

        container.addEventListener('wheel', handleWheel, {passive: false})
        container.addEventListener('keydown', handleKeyDown)
        container.addEventListener('scroll', handleScroll, {passive: true})
        container.addEventListener('scrollend', handleScrollEnd)
        return () => {
            window.clearTimeout(settleTimer)
            window.clearTimeout(wheelGestureTimer)
            window.clearTimeout(wheelArmTimer)
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('keydown', handleKeyDown)
            container.removeEventListener('scroll', handleScroll)
            container.removeEventListener('scrollend', handleScrollEnd)
        }
    }, [])

    return (
        <div ref={ref} data-stack-pager className={className}>
            {children}
        </div>
    )
}

export default StackPager
