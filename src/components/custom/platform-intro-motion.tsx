'use client'

import {type ReactNode, useEffect, useRef, useState} from 'react'

// 플랫폼 소개 상단 등장 연출의 단계 전환 — 감싼 영역의 data-platform-intro 를 intro → reveal → done 으로 바꾼다.
// 움직임은 전부 src/styles/platform-intro.css 가 맡는다(이 부품은 단계만 바꾼다).
//   · intro  — 서버가 그린 첫 화면부터 1단계가 CSS 로 재생된다(스크립트를 기다리지 않는다).
//   · reveal — 처음 스크롤(휠 · 터치 · 키보드) · 누름 · 영역 안 포커스가 들어오면 2단계를 재생한다. 시안의 '누르면 다음 화면'을
//     웹에서는 첫 스크롤로 옮겼다. 포커스로도 넘어가 감춰 둔 개요 카드에 키보드 포커스가 갈 때 보이지 않는 일이 없다[6.1.2].
//   · done   — 2단계가 끝난 뒤(3초). 동작 줄이기 설정이거나 스크롤된 채 연 화면(뒤로 가기 등)은 연출 없이 바로 done 이다[6.3.1].

type PlatformIntroStage = 'intro' | 'reveal' | 'done'

type PlatformIntroMotionProps = {
    children: ReactNode
    className?: string
}

// 2단계 길이 — platform-intro.css 의 --platform-intro-duration 과 같다.
const REVEAL_DURATION_MS = 3000
const REVEAL_TRIGGER_EVENTS = ['scroll', 'wheel', 'touchmove', 'keydown', 'pointerdown'] as const

const PlatformIntroMotion = ({children, className}: PlatformIntroMotionProps) => {
    const [stage, setStage] = useState<PlatformIntroStage>('intro')
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = rootRef.current
        const shouldSkip = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY > 0
        const reveal = () => setStage((current) => (current === 'intro' ? (shouldSkip ? 'done' : 'reveal') : current))
        if (shouldSkip) {
            reveal()
            return undefined
        }
        REVEAL_TRIGGER_EVENTS.forEach((type) => window.addEventListener(type, reveal, {passive: true}))
        root?.addEventListener('focusin', reveal)
        return () => {
            REVEAL_TRIGGER_EVENTS.forEach((type) => window.removeEventListener(type, reveal))
            root?.removeEventListener('focusin', reveal)
        }
    }, [])

    useEffect(() => {
        if (stage !== 'reveal') return undefined
        const timer = window.setTimeout(() => setStage('done'), REVEAL_DURATION_MS)
        return () => window.clearTimeout(timer)
    }, [stage])

    return (
        <div ref={rootRef} data-platform-intro={stage} className={className}>
            {children}
        </div>
    )
}

export {PlatformIntroMotion}
export type {PlatformIntroMotionProps}
