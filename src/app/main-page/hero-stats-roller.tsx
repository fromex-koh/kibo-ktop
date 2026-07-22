'use client'

import {useEffect, useRef, useState} from 'react'
import AnimatedCounter from './animated-counter'
import {STACK_PAGE_CHANGE_EVENT} from './stack-pager'

export type HeroStat = {
    id: string
    value: string
    label: string
    note: string
}

const toZeroValue = (value: string) => value.replace(/\d/g, '0')

const HeroStatsRoller = ({stats}: {stats: HeroStat[]}) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isRolling, setIsRolling] = useState(false)
    const [resetKey, setResetKey] = useState(0)
    const orderedStats = [...stats.slice(activeIndex), ...stats.slice(0, activeIndex)]
    const visibleStats = [...orderedStats, orderedStats[0]]

    const finishRolling = () => {
        setActiveIndex((current) => (current + 1) % stats.length)
        setIsRolling(false)
    }

    useEffect(() => {
        const scrollContainer = rootRef.current?.closest<HTMLElement>('[data-stack-pager]')
        if (!scrollContainer) return

        const resetOnReentry = (event: Event) => {
            if (!(event instanceof CustomEvent) || event.detail.page !== 0) return
            setActiveIndex(0)
            setIsRolling(false)
            setResetKey((current) => current + 1)
        }

        scrollContainer.addEventListener(STACK_PAGE_CHANGE_EVENT, resetOnReentry)
        return () => scrollContainer.removeEventListener(STACK_PAGE_CHANGE_EVENT, resetOnReentry)
    }, [])

    return (
        <div ref={rootRef} className="hero-stats-viewport col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-9">
            <ul
                data-rolling={isRolling}
                onTransitionEnd={(event) => {
                    if (event.propertyName === 'transform') finishRolling()
                }}
                className="hero-stats-track"
            >
                {visibleStats.map((stat, index) => {
                    const isActive = index === 0
                    const isIncoming = isRolling && index === 1
                    const isClone = index === visibleStats.length - 1

                    return (
                        <li
                            key={`${stat.id}-${isClone ? 'clone' : 'item'}`}
                            aria-hidden={isClone || undefined}
                            className="hero-stat-row flex flex-col justify-start gap-0 md:items-end md:text-right"
                        >
                            <p className="hero-stat-title typo-title-xl-medium text-foreground flex items-center gap-1">
                                <strong data-active={isActive} className="hero-stat-value">
                                    {isActive ? (
                                        <AnimatedCounter
                                            key={`${stat.id}-${resetKey}`}
                                            value={stat.value}
                                            onComplete={() => setIsRolling(true)}
                                        />
                                    ) : isIncoming ? (
                                        toZeroValue(stat.value)
                                    ) : (
                                        stat.value
                                    )}
                                </strong>
                                {stat.label}
                            </p>
                            <p className="typo-caption-medium text-foreground-subtle">{stat.note}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default HeroStatsRoller
