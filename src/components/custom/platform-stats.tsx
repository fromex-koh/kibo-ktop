'use client'

import {useEffect, useRef, useState} from 'react'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {cn} from '@/lib/utils'

// 정량 지표 — 위쪽 얇은 선 아래 숫자 3칸(가운데 정렬 · 칸 사이 세로선, 모바일은 한 줄씩 가로선).
// 화면에 60% 들어오면 숫자가 0에서 값까지 1.6초 동안 올라간다(한 번만). 값이 숫자가 아니면(AI) 그대로 보인다.
//
// 알아둘 점
//   · 낭독기는 움직이는 숫자 대신 완성된 값(sr-only)을 읽는다 — 올라가는 숫자는 aria-hidden 이다.
//   · 자바스크립트가 없거나 동작 줄이기 설정이면 처음부터 완성된 값이다[6.3.1].
//   · 숫자 폭이 바뀌어 가운데 정렬이 흔들리지 않게 고정폭 숫자(tabular-nums)를 쓴다.
//   · 칸 수는 항목 수만큼 같은 폭으로 나뉜다(md 부터).
// 쓰는 곳: custom/platform-intro.tsx(정량 지표).

type PlatformStat = {
    /** 낭독기용 지표 이름(dt, 화면에는 숨김). */
    label: string
    /** 큰 값. 숫자면 0부터 올라간다. */
    value: string
    /** 값 뒤 작은 단위. */
    unit?: string
    /** 값 아래 설명. */
    description: string
}

const COUNT_DURATION_MS = 1600
const COUNT_START_DELAY_MS = 200
const COUNT_THRESHOLD = 0.6

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3

const decimalsOf = (value: string) => value.split('.')[1]?.length ?? 0

// 동작 줄이기 설정 — 브라우저에서만 읽는다(서버 렌더는 완성된 값).
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CountUpValue = ({value}: {value: string}) => {
    const ref = useRef<HTMLSpanElement>(null)
    const isHydrated = useIsHydrated()
    const target = Number(value)
    const isNumeric = value.trim() !== '' && Number.isFinite(target)
    // null = 아직 화면에 들어오지 않음(0 표시), 0~1 = 올라가는 중.
    const [progress, setProgress] = useState<number | null>(null)

    useEffect(() => {
        const element = ref.current
        if (!element || !isNumeric || prefersReducedMotion()) return undefined
        let frame = 0
        const run = () => {
            const startedAt = performance.now() + COUNT_START_DELAY_MS
            const step = (now: number) => {
                const next = Math.min(1, Math.max(0, (now - startedAt) / COUNT_DURATION_MS))
                setProgress(next)
                if (next < 1) frame = requestAnimationFrame(step)
            }
            frame = requestAnimationFrame(step)
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return
                observer.disconnect()
                run()
            },
            {threshold: COUNT_THRESHOLD},
        )
        observer.observe(element)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [isNumeric])

    const isCounting = isNumeric && isHydrated && !prefersReducedMotion() && progress !== 1
    const decimals = decimalsOf(value)
    const display = isCounting ? (target * easeOutCubic(progress ?? 0)).toFixed(decimals) : value

    return (
        <span ref={ref} aria-hidden="true" className="tabular-nums">
            {display}
        </span>
    )
}

const PlatformStats = ({
    items,
    label,
    className,
}: {
    items: readonly PlatformStat[]
    label?: string
    className?: string
}) => (
    <dl
        aria-label={label}
        className={cn('border-platform-line grid border-t md:auto-cols-fr md:grid-flow-col', className)}
    >
        {items.map((item, index) => (
            <div
                key={item.label}
                className={cn(
                    'relative flex flex-col items-center px-4 pt-6 pb-5 text-center md:px-6 md:pt-8 md:pb-1.5',
                    // 칸 사이 구분선 — 모바일은 양끝이 떨어진 가로선, md 부터 위아래가 떨어진 세로선.
                    index > 0 &&
                        'before:bg-subtle-3 before:absolute before:inset-x-12 before:top-0 before:h-px md:before:inset-x-auto md:before:top-10 md:before:bottom-2.5 md:before:left-0 md:before:h-auto md:before:w-px',
                )}
            >
                <dt className="sr-only">{item.label}</dt>
                <dd className="flex flex-col items-center gap-3">
                    <span className="typo-display-l-bold text-platform-stat-number flex items-baseline justify-center">
                        <span className="sr-only">{item.value}</span>
                        <CountUpValue value={item.value} />
                        {item.unit ? (
                            <span className="typo-title-xl-bold text-platform-accent-foreground ms-1">{item.unit}</span>
                        ) : null}
                    </span>
                    <span className="typo-body-xl-regular text-label-foreground break-keep">{item.description}</span>
                </dd>
            </div>
        ))}
    </dl>
)

export {PlatformStats}
export type {PlatformStat}
