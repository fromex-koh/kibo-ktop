'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 섹션이 뷰포트에 들어올 때 콘텐츠를 아래→위로 페이드 인시키는 래퍼.
// 숨김 상태를 motion-safe로만 적용해 감속 모션 선호·JS 미동작 환경에서는 항상 보이는 상태를 유지한다. [KWCAG 6.3.1]
const REVEAL_THRESHOLD = 0.3

const Reveal = ({children, className}: {children: ReactNode; className?: string}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        // 섹션을 떠나면 다시 숨겨 재진입 시 전환이 반복되도록 양방향으로 토글한다.
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry?.isIntersecting ?? false), {
            threshold: REVEAL_THRESHOLD,
        })
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            data-visible={isVisible}
            className={cn(
                'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out',
                'data-[visible=false]:motion-safe:translate-y-12 data-[visible=false]:motion-safe:opacity-0',
                className,
            )}
        >
            {children}
        </div>
    )
}

export default Reveal
