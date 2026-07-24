'use client'

import {useEffect, useRef, useState} from 'react'
import AnimatedCounter, {counterTotalDurationMs} from './animated-counter'

export type HeroStat = {
    id: string
    value: string
    label: string
    note: string
}

// globals.css 의 .hero-stats-track[data-rolling='true'] transition 시간과 동기 유지
const ROLLING_TRANSITION_MS = 700
// animationend/transitionend 가 스로틀로 늦게 도착할 여유를 둔 안전장치 지연
const FALLBACK_BUFFER_MS = 600

const toZeroValue = (value: string) => value.replace(/\d/g, '0')

const HeroStatsRoller = ({stats}: {stats: HeroStat[]}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isRolling, setIsRolling] = useState(false)
    // 이벤트와 안전장치 타이머가 같은 롤링을 두 번 마감해 항목을 건너뛰지 않게 하는 잠금
    const hasFinishedRef = useRef(false)
    const orderedStats = [...stats.slice(activeIndex), ...stats.slice(0, activeIndex)]
    const visibleStats = [...orderedStats, orderedStats[0]]

    const startRolling = () => {
        hasFinishedRef.current = false
        setIsRolling(true)
    }

    const finishRolling = () => {
        if (hasFinishedRef.current) return
        hasFinishedRef.current = true
        setActiveIndex((current) => (current + 1) % stats.length)
        setIsRolling(false)
    }

    // 안전장치 — animationend/transitionend 는 창이 가려지거나(스크린샷 UI·탭 전환)
    // 전환이 취소되면 유실될 수 있어, 예상 소요 시간이 지나면 타이머로 단계를 강제 진행한다.
    // 이벤트가 먼저 도착하면 상태 변경 → 재렌더 → cleanup 으로 타이머가 취소된다.
    const activeValue = orderedStats[0].value
    useEffect(() => {
        // 리듀스드 모션에서는 애니메이션 없이 정적 목록을 유지하므로 자동 진행하지 않는다. [KWCAG 6.3.1]
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const delay = isRolling
            ? ROLLING_TRANSITION_MS + FALLBACK_BUFFER_MS
            : counterTotalDurationMs(activeValue) + FALLBACK_BUFFER_MS
        const timer = setTimeout(() => {
            if (isRolling) {
                finishRolling()
            } else {
                startRolling()
            }
        }, delay)
        return () => clearTimeout(timer)
        // startRolling/finishRolling 은 렌더마다 새로 만들어지지만 동작이 같아 의존성에서 제외한다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRolling, activeIndex, activeValue])

    // 우측 지표. md(768)부터 우반부(4열, 5번째 컬럼 시작), xl(1280)부터 5열(8번째 시작),
    // 2xl(1536)부터 4열(9번째 시작)로 좁혀 초광폭에서 카피와 균형을 맞춘다.
    return (
        <div className="hero-stats-viewport col-span-4 min-w-0 md:col-start-5 xl:col-span-5 xl:col-start-8 2xl:col-span-4 2xl:col-start-9">
            <ul
                data-rolling={isRolling}
                onTransitionEnd={(event) => {
                    // 자식(.hero-stat-value 등)에서 버블링된 transitionend 를 걸러 트랙 이동만 마감한다.
                    if (event.target === event.currentTarget && event.propertyName === 'transform') {
                        finishRolling()
                    }
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
                                        <AnimatedCounter key={stat.id} value={stat.value} onComplete={startRolling} />
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
