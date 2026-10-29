'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {cn} from '@/lib/utils'

// ScrollReveal — 화면에 들어올 때 한 번만 아래에서 떠오르며 나타나는 래퍼. 동작 줄이기면 처음부터 보인다[6.3.1].
// 쓰는 곳: 플랫폼 소개 > 기술평가 · 특허평가 · K-BIGx 보고서 · 탄소중립(구조도 · 아코디언 · 기능 목록 · 절차).
//
// 알아둘 점
//   · 메인의 Reveal 과 달리 반복하지 않는다 — 읽는 화면에서 내용이 사라졌다 나타나지 않게.
//   · 요소 비율이 아니라 위치로 판단한다(윗부분이 화면 아래 15% 선을 넘으면) — 화면보다 긴 덩어리도 나타난다.
//   · 안쪽을 나타나는 순간에 맞춰 움직이려면 group-data-[revealed=true]/reveal: 변형을 쓰고,
//     안쪽만 움직이려면 hasRise={false} 로 래퍼의 떠오름을 끈다(예: ProcedureSteps).

// 감지 범위 — 아래는 화면 아래 15% 선까지, 위는 화면 위로 아주 멀리까지 연다. 빠르게 스크롤하거나(End 키 · 앵커 이동)
// 이미 지나간 채로 연 화면에서도 화면 위로 지나간 덩어리가 '보이는 중'으로 잡혀 숨은 채 남지 않는다.
const REVEAL_ROOT_MARGIN = '100000px 0px -15% 0px'

type ScrollRevealProps = {
    children: ReactNode
    className?: string
    /** 래퍼 자신이 떠오르며 나타날지. false 면 나타나는 시점(data-revealed)만 알리고 안쪽 조각이 움직인다. 기본 true. */
    hasRise?: boolean
}

const ScrollReveal = ({children, className, hasRise = true}: ScrollRevealProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return undefined

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return
                setIsRevealed(true)
                observer.disconnect()
            },
            {rootMargin: REVEAL_ROOT_MARGIN},
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            data-revealed={isRevealed}
            className={cn(
                'group/reveal',
                hasRise &&
                    'motion-safe:ease-roll motion-safe:transition-[opacity,translate] motion-safe:duration-900 motion-safe:data-[revealed=false]:translate-y-12 motion-safe:data-[revealed=false]:opacity-0',
                className,
            )}
        >
            {children}
        </div>
    )
}

export {ScrollReveal}
export type {ScrollRevealProps}
