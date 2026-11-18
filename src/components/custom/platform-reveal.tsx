'use client'

import {useEffect, useRef, type ComponentPropsWithoutRef, type ElementType, type RefObject} from 'react'
import {cn} from '@/lib/utils'

// 플랫폼 소개 순서대로 나타나기 — 요소가 화면에 들어오면 20px 아래에서 제자리로 떠오르며 나타난다(0.8초, 한 번).
// 같은 순간에 함께 들어온 요소끼리는 위 → 아래(DOM) 순서로 0.14초씩 늦게 나타난다(최대 8칸 = 1.12초).
//   · 관찰기 하나를 화면 전체가 같이 써서 '같이 들어온 요소'를 한 묶음으로 센다(요소마다 관찰기를 두면 순서를 셀 수 없다).
//   · 위로 지나간 요소도 나타난다(감지 범위 위쪽을 크게 연다) — 앵커로 건너뛴 뒤 위로 올라가도 빈칸이 없다.
//   · 고르지 않은 탭 패널 안 요소는 탭을 열어 그려질 때 나타난다.
//   · 동작 줄이기 설정이면 처음부터 보인다[6.3.1]. 떠오름은 transition 이 아니라 animation 이라 카드의 호버 전환을 덮지 않는다.
// 쓰는 곳: 플랫폼 소개 5화면 블록(PlatformSection 제목 · 카드 · 절차 · 표 · 탭 · 배너).
//   <PlatformReveal>…</PlatformReveal>  — 감싸는 div(as 로 태그 변경)
//   const ref = usePlatformReveal<HTMLLIElement>() + <li ref={ref} data-revealed="false" className={PLATFORM_REVEAL_CLASS}>
//     — 목록 칸처럼 래퍼를 둘 수 없을 때.

// 감지 범위 — 위는 아주 멀리까지, 아래는 화면 아래 8% 선까지.
const REVEAL_ROOT_MARGIN = '100000px 0px -8% 0px'
// 한 묶음에서 늦추는 최대 칸 수.
const MAX_STAGGER_STEPS = 8

/** 나타나기 스타일 — 요소에 data-revealed="false" 를 함께 둔다. 늦춤 칸(--reveal-i) × 0.14초는 animate-platform-reveal 값 안에 있다. */
const PLATFORM_REVEAL_CLASS =
    'motion-safe:data-[revealed=false]:opacity-0 motion-safe:data-[revealed=true]:animate-platform-reveal'

let sharedObserver: IntersectionObserver | null = null

const getObserver = () => {
    if (sharedObserver) return sharedObserver
    sharedObserver = new IntersectionObserver(
        (entries) => {
            const entered = entries.filter((entry) => entry.isIntersecting)
            entered.forEach((entry, index) => {
                const element = entry.target
                if (!(element instanceof HTMLElement)) return
                element.style.setProperty('--reveal-i', String(Math.min(index, MAX_STAGGER_STEPS)))
                element.dataset.revealed = 'true'
                sharedObserver?.unobserve(element)
            })
        },
        {rootMargin: REVEAL_ROOT_MARGIN},
    )
    return sharedObserver
}

const usePlatformReveal = <T extends HTMLElement>(): RefObject<T | null> => {
    const ref = useRef<T>(null)
    useEffect(() => {
        const element = ref.current
        if (!element) return undefined
        const observer = getObserver()
        observer.observe(element)
        return () => observer.unobserve(element)
    }, [])
    return ref
}

type PlatformRevealProps<T extends ElementType> = {as?: T; className?: string} & Omit<
    ComponentPropsWithoutRef<T>,
    'as' | 'className'
>

const PlatformReveal = <T extends ElementType = 'div'>({as, className, ...props}: PlatformRevealProps<T>) => {
    const ref = usePlatformReveal<HTMLElement>()
    const Component: ElementType = as ?? 'div'
    return <Component ref={ref} data-revealed="false" className={cn(PLATFORM_REVEAL_CLASS, className)} {...props} />
}

export {PLATFORM_REVEAL_CLASS, PlatformReveal, usePlatformReveal}
