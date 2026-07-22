'use client'

import {useEffect, useRef, type ReactNode} from 'react'

// godo.co.kr 참고 풀스크린 스택 전환의 휠·키보드 페이징 스크롤 컨테이너.
// snap-mandatory만으로는 휠 한 틱(±100px 안팎)이 화면 중간을 못 넘겨 항상 제자리로 되돌아온다
// (사용자에겐 "스크롤이 안 되는" 상태). 그래서 md 이상에서 휠 한 번 = 한 화면 전환으로 매핑한다.
// 터치·스크롤바 드래그는 네이티브 스크롤 + CSS 스냅에 그대로 맡긴다. [KWCAG 6.1.1]
const WHEEL_DELTA_MIN = 20 // 트랙패드 관성 잔진동 무시 기준
const SETTLE_FALLBACK_MS = 1000 // scrollend 미지원 브라우저에서 전환 잠금을 푸는 타임아웃
const INERTIA_COOLDOWN_MS = 300 // 전환 직후 트랙패드 관성으로 연속 전환되는 것을 막는 냉각시간

const PAGE_DOWN_KEYS = new Set(['ArrowDown', 'PageDown', ' '])
const PAGE_UP_KEYS = new Set(['ArrowUp', 'PageUp'])

const StackPager = ({children, className}: {children: ReactNode; className?: string}) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = ref.current
        if (!container) return

        // 페이징이 걸리는 폭(스냅과 동일한 md)·감속 모션 선호를 미디어쿼리로 판별
        const desktopQuery = window.matchMedia('(min-width: 768px)')
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let isPaging = false
        let cooldownUntil = 0
        let settleTimer = 0

        const releaseLock = () => {
            isPaging = false
            cooldownUntil = performance.now() + INERTIA_COOLDOWN_MS
        }

        // 현재 화면 번호에서 한 화면 이동. 범위 밖(마지막 화면이 뷰포트보다 길어 남은 부분 등)이면
        // false를 돌려 네이티브 스크롤에 맡긴다.
        const stepPage = (isForward: boolean): boolean => {
            const pageHeight = container.clientHeight
            const maxTop = container.scrollHeight - pageHeight
            const page = Math.round(container.scrollTop / pageHeight)
            const target = isForward ? page + 1 : page - 1
            if (target < 0 || target * pageHeight > maxTop) return false

            const targetTop = target * pageHeight
            isPaging = true
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
            if (isPaging || performance.now() < cooldownUntil) {
                event.preventDefault()
                return
            }
            if (Math.abs(event.deltaY) < WHEEL_DELTA_MIN) return
            if (stepPage(event.deltaY > 0)) event.preventDefault()
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

        container.addEventListener('wheel', handleWheel, {passive: false})
        container.addEventListener('keydown', handleKeyDown)
        container.addEventListener('scrollend', handleScrollEnd)
        return () => {
            window.clearTimeout(settleTimer)
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('keydown', handleKeyDown)
            container.removeEventListener('scrollend', handleScrollEnd)
        }
    }, [])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}

export default StackPager
