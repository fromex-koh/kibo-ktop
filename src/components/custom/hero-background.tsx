'use client'

import Image, {type StaticImageData} from 'next/image'
import {useEffect, useRef, useState} from 'react'
import {cn} from '@/lib/utils'

type HeroBackgroundSlide = {
    src: StaticImageData
    position: string
}

const CHANGE_INTERVAL_MS = 7000

// 배경 레이어를 겹쳐 크로스페이드하고, 활성 이미지는 확대 상태에서 원래 크기로 돌아온다.
// 전달받은 배경 배열을 순환하므로 이미지를 추가하거나 교체할 때 slides 데이터만 변경한다.
const HeroBackground = ({slides}: {slides: HeroBackgroundSlide[]}) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [{activeIndex, previousIndex}, setTransition] = useState<{
        activeIndex: number
        previousIndex: number | null
    }>({activeIndex: 0, previousIndex: null})

    useEffect(() => {
        const root = rootRef.current
        const section = root?.closest<HTMLElement>('section')
        const scrollContainer = root?.closest<HTMLElement>('[data-stack-pager]')
        if (!root || !section || !scrollContainer) return

        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let frame = 0

        const updateScrollProgress = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const progress = Math.min(Math.max(scrollContainer.scrollTop / scrollContainer.clientHeight, 0), 1)
                section.style.setProperty('--hero-scroll-progress', String(progress))
            })
        }

        const startRotation = () => {
            if (reducedMotionQuery.matches || slides.length < 2) return undefined
            return window.setInterval(() => {
                setTransition((current) => ({
                    activeIndex: (current.activeIndex + 1) % slides.length,
                    previousIndex: current.activeIndex,
                }))
            }, CHANGE_INTERVAL_MS)
        }

        let rotationTimer = startRotation()
        const restartRotation = () => {
            if (rotationTimer) window.clearInterval(rotationTimer)
            rotationTimer = startRotation()
        }

        scrollContainer.addEventListener('scroll', updateScrollProgress, {passive: true})
        reducedMotionQuery.addEventListener('change', restartRotation)
        updateScrollProgress()

        return () => {
            cancelAnimationFrame(frame)
            if (rotationTimer) window.clearInterval(rotationTimer)
            scrollContainer.removeEventListener('scroll', updateScrollProgress)
            reducedMotionQuery.removeEventListener('change', restartRotation)
            section.style.removeProperty('--hero-scroll-progress')
        }
    }, [slides.length])

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className="absolute -inset-px [backface-visibility:hidden] motion-safe:[transform:scale(calc(1+var(--hero-scroll-progress,0)*0.035))]"
        >
            {slides.map((slide, index) => {
                const isActive = activeIndex === index
                const isPrevious = previousIndex === index

                return (
                    <div
                        key={`${slide.position}-${index}`}
                        className={cn(
                            'after:to-background/75 main-hero-background-slide absolute inset-0 transition-opacity duration-500 [transition-timing-function:ease] after:absolute after:inset-0 after:z-2 after:bg-linear-to-b after:from-transparent motion-reduce:transition-none',
                            isActive && 'main-hero-background-active',
                            isActive ? 'z-1 opacity-100' : 'z-0 opacity-0',
                        )}
                        style={isPrevious ? {transform: 'scale(1)'} : undefined}
                    >
                        <Image
                            src={slide.src}
                            alt=""
                            fill
                            sizes="100vw"
                            placeholder="blur"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            className="object-cover brightness-[0.55]"
                            style={{objectPosition: slide.position}}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default HeroBackground
