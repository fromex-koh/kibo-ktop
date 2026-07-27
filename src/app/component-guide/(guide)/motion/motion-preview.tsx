'use client'

import {useState} from 'react'
import {Menu, Pause, Play, RotateCcw, X} from 'lucide-react'
import AnimatedCounter from '@/components/custom/animated-counter'
import {Button} from '@/components/ui/button'

// 미리보기 도형 종류 — 실제 유틸리티를 그대로 붙여 원본과 같은 시간·가속도로 움직인다.
export type MotionPreviewKind =
    'scale' | 'line' | 'progress' | 'enter' | 'marquee' | 'counter' | 'menu-close' | 'menu-return'

// 정지 조작이 필요한 이유
//  · 한 번만 도는 애니메이션(7s·5s·600ms)은 페이지를 연 순간 끝나 버려, 표까지 내려오면 이미 멈춰 있다.
//  · 무한 반복은 반대로 계속 움직여, 자동 이동 콘텐츠에 정지 수단이 필요하다. [KWCAG 6.2.2]
// 그래서 반복이면 정지/재생, 한 번만 돌면 다시 재생 버튼을 둔다. 다시 재생은 key 를 바꿔 요소를
// 새로 만드는 방식이다 — CSS 애니메이션은 같은 요소에 다시 걸어도 처음부터 재생되지 않는다.

const PAUSABLE = 'data-[paused=true]:[animation-play-state:paused] motion-reduce:animate-none'

const PreviewShape = ({kind, isPaused}: {kind: MotionPreviewKind; isPaused: boolean}) => {
    if (kind === 'scale') {
        // 프레임보다 작은 도형을 넣는다 — 프레임과 같은 크기면 1.2배가 잘려 시종일관 꽉 찬 사각형으로 보인다.
        return (
            <span className="bg-muted grid size-12 place-items-center overflow-hidden rounded-md">
                <span
                    data-paused={isPaused}
                    className={`bg-primary animate-hero-zoom-out size-8 rounded-sm ${PAUSABLE}`}
                />
            </span>
        )
    }
    if (kind === 'line') {
        return (
            <span className="bg-muted relative block h-12 w-1 overflow-hidden rounded-full">
                <span
                    data-paused={isPaused}
                    className={`bg-primary animate-scroll-line absolute inset-0 origin-top ${PAUSABLE}`}
                />
            </span>
        )
    }
    if (kind === 'menu-close') {
        return <X data-paused={isPaused} className={`animate-header-menu-close-enter size-icon-lg ${PAUSABLE}`} />
    }
    if (kind === 'menu-return') {
        return <Menu data-paused={isPaused} className={`animate-header-menu-trigger-return size-icon-lg ${PAUSABLE}`} />
    }
    if (kind === 'progress') {
        return (
            <span className="bg-muted relative block h-12 w-1 overflow-hidden rounded-full">
                <span
                    data-paused={isPaused}
                    className={`bg-primary animate-tech-progress absolute inset-0 origin-top ${PAUSABLE}`}
                />
            </span>
        )
    }
    if (kind === 'enter') {
        return (
            <span className="block h-12 w-24 overflow-hidden">
                <span
                    data-paused={isPaused}
                    className={`bg-primary animate-tech-enter block size-full rounded-md ${PAUSABLE}`}
                />
            </span>
        )
    }
    if (kind === 'marquee') {
        return (
            <span className="block h-12 w-40 overflow-hidden">
                <span data-paused={isPaused} className={`animate-marquee flex h-full w-max items-center ${PAUSABLE}`}>
                    <span className="typo-body-m-bold text-muted-foreground pr-6 whitespace-nowrap">K-TOP</span>
                    <span className="typo-body-m-bold text-muted-foreground pr-6 whitespace-nowrap">K-TOP</span>
                </span>
            </span>
        )
    }
    // 카운터는 자릿수 릴 구조가 있어야 의미가 있어, 도형 대신 실제 컴포넌트를 그대로 쓴다.
    // 시간을 인라인으로 주입하는 것까지 원본 그대로라 표에서 보는 움직임이 화면의 것과 같다.
    return (
        <span data-paused={isPaused} className={`typo-h4-bold text-foreground block ${PAUSABLE}`}>
            <AnimatedCounter value="1,060" />
        </span>
    )
}

const MotionPreview = ({kind, loop, label}: {kind: MotionPreviewKind; loop: boolean; label: string}) => {
    const [runId, setRunId] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const controlLabel = loop ? (isPaused ? `${label} 재생` : `${label} 정지`) : `${label} 다시 재생`

    return (
        <span className="flex items-center gap-3">
            <span aria-hidden="true" className="block">
                <PreviewShape key={runId} kind={kind} isPaused={isPaused} />
            </span>
            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={controlLabel}
                onClick={() => (loop ? setIsPaused((current) => !current) : setRunId((current) => current + 1))}
            >
                {loop ? (
                    isPaused ? (
                        <Play aria-hidden="true" />
                    ) : (
                        <Pause aria-hidden="true" />
                    )
                ) : (
                    <RotateCcw aria-hidden="true" />
                )}
            </Button>
        </span>
    )
}

export default MotionPreview
