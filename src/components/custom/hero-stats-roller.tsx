'use client'

import {useState} from 'react'
import AnimatedCounter from './animated-counter'

export type HeroStat = {
    id: string
    value: string
    label: string
    note: string
}

const toZeroValue = (value: string) => value.replace(/\d/g, '0')

const HeroStatsRoller = ({stats}: {stats: HeroStat[]}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isRolling, setIsRolling] = useState(false)
    const orderedStats = [...stats.slice(activeIndex), ...stats.slice(0, activeIndex)]
    const visibleStats = [...orderedStats, orderedStats[0]]

    const finishRolling = () => {
        setActiveIndex((current) => (current + 1) % stats.length)
        setIsRolling(false)
    }

    // 우측 지표. md(768)부터 우반부(4열, 5번째 컬럼 시작), xl(1280)부터 5열(8번째 시작),
    // 2xl(1536)부터 4열(9번째 시작)로 좁혀 초광폭에서 카피와 균형을 맞춘다.
    return (
        <div className="hero-stats-viewport col-span-4 min-w-0 md:col-start-5 xl:col-span-5 xl:col-start-8 2xl:col-span-4 2xl:col-start-9">
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
                            <p className="hero-stat-title typo-title-xl-medium text-foreground flex h-auto min-h-[var(--raw-font-size-h1)] items-center gap-1 break-keep md:h-[var(--raw-font-size-h1)] md:whitespace-nowrap">
                                <strong data-active={isActive} className="hero-stat-value">
                                    {isActive ? (
                                        <AnimatedCounter
                                            key={stat.id}
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
