'use client'

import {useEffect, useState} from 'react'
import {ChevronUp} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 플로팅 "맨 위로" 버튼 — 일정 높이 이상 스크롤하면 우측 하단에 나타난다.
// 스크롤 리스너는 window 기준이다(이 프로젝트 레이아웃은 별도 스크롤 컨테이너 없이 문서 자체가 스크롤된다 —
// sidebar-layout 의 <main> 참고). boolean 하나를 비교하는 가벼운 연산이라 별도 스로틀 없이 그대로 둔다
// (React 는 같은 값으로의 setState 를 자체적으로 무시해 불필요한 리렌더가 없다).
// 보이지 않을 때는 DOM 에서 아예 제거한다 — 화면 밖에 숨겨진 버튼이 Tab 순서에 남아 포커스를 받는 것을
// 막기 위함이다([6.1.2] 포커스 순서 연계). 이렇게 마운트/언마운트로 켜고 끄면 opacity 전환(transition)은
// "이전 상태"가 없어 재생되지 않으므로, 대신 tw-animate-css 의 진입 키프레임(animate-in)을 쓴다 — 이
// 프로젝트의 Radix 컴포넌트(select·popover 등)가 열릴 때 쓰는 것과 같은 방식이라 별도 커스텀 애니메이션을
// 새로 정의하지 않는다. prefers-reduced-motion 은 motion-safe: 로 감싸 존중한다([6.3.1]).
// 클릭 시 맨 위로 스크롤할 때도 prefers-reduced-motion 을 존중해 부드러운 스크롤 대신 즉시 이동한다.
const SCROLL_THRESHOLD_PX = 400

type ScrollToTopButtonProps = {
    // 아이콘 전용 버튼의 접근성 라벨([5.1.1]).
    label?: string
    className?: string
}

const ScrollToTopButton = ({label = '맨 위로 이동', className}: ScrollToTopButtonProps) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > SCROLL_THRESHOLD_PX)

        handleScroll()
        window.addEventListener('scroll', handleScroll, {passive: true})
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleClick = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    if (!isVisible) return null

    return (
        <Button
            variant="default"
            size="icon"
            onClick={handleClick}
            aria-label={label}
            className={cn(
                'z-sticky shadow-1 fixed right-6 bottom-6 rounded-full',
                'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300',
                className,
            )}
        >
            <ChevronUp aria-hidden="true" />
        </Button>
    )
}

export {ScrollToTopButton}
export type {ScrollToTopButtonProps}
