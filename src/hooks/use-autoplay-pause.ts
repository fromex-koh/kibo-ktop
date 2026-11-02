import {useEffect, useRef, useState, type FocusEvent, type PointerEvent as ReactPointerEvent} from 'react'

// 자동 롤링(자동으로 넘어가는 콘텐츠)을 사용자가 보는 동안 잠시 멈추는 공통 규칙.
//   · 마우스 — 영역에 올리면 멈추고, 영역을 벗어나면(mouseleave) 다시 재생한다.
//   · 터치(펜 포함) — 영역 안을 누르면 멈춘 채로 두고, 영역 밖 다른 곳을 누르면 다시 재생한다.
//     터치는 손을 떼는 순간 pointerleave 가 와서 hover 방식으로는 바로 다시 넘어가 버리기 때문이다.
//   · 키보드 — 포커스(focus-visible)가 안에 있는 동안 멈추고, 밖으로 나가면 다시 재생한다[6.2.1].
//     마우스로 눌러 생긴 포커스는 세지 않는다 — 누른 뒤 벗어났는데도 멈춘 채로 남지 않게 한다.
// 쓰는 곳: 서비스 소개 화면의 RollingAccordion · ChipMarquee.
//
// 사용: const {isPaused, pauseHandlers} = useAutoplayPause()
//       <div {...pauseHandlers}>…</div>  — isPaused 일 때 타이머를 멈춘다.

const useAutoplayPause = () => {
    const containerRef = useRef<Element | null>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [isTouchHeld, setIsTouchHeld] = useState(false)
    const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false)

    // 터치로 멈춘 동안에만 문서 전체의 누름을 듣는다 — 영역 밖을 누르면 다시 재생한다.
    useEffect(() => {
        if (!isTouchHeld) return

        const handlePointerDown = (event: PointerEvent) => {
            const container = containerRef.current
            if (container && event.target instanceof Node && container.contains(event.target)) return
            setIsTouchHeld(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [isTouchHeld])

    const pauseHandlers = {
        onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => {
            if (event.pointerType === 'mouse') setIsHovered(true)
        },
        onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => {
            if (event.pointerType === 'mouse') setIsHovered(false)
        },
        onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
            containerRef.current = event.currentTarget
            if (event.pointerType !== 'mouse') setIsTouchHeld(true)
        },
        onFocus: (event: FocusEvent<HTMLElement>) => {
            if (event.target.matches(':focus-visible')) setHasKeyboardFocus(true)
        },
        onBlur: (event: FocusEvent<HTMLElement>) => {
            if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return
            setHasKeyboardFocus(false)
        },
    }

    return {isPaused: isHovered || isTouchHeld || hasKeyboardFocus, pauseHandlers}
}

export {useAutoplayPause}
