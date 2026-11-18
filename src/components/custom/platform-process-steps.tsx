'use client'

import {useEffect, useRef, type ReactNode} from 'react'
import {PLATFORM_REVEAL_CLASS, usePlatformReveal} from '@/components/custom/platform-reveal'
import {cn} from '@/lib/utils'

// 이용 절차 — 번호 원과 연결선으로 이어진 단계 목록.
//   · PC(1024↑): 단계가 가로로 고르게 놓이고 가운데 정렬, 번호 원 사이를 가로선 한 줄이 잇는다.
//   · 태블릿 · 모바일: 번호 원이 왼쪽 열에 서고 다음 단계까지 세로선이 내려간다.
// 선 그리기 — 목록이 화면에 35% 이상 보이면 연결선이 1 → 2 → 3 … 순서로 하나씩(1초) 그려지고, 다 그린 채로 멈춘다(반복 없음).
// 목록이 화면에서 완전히 벗어나면 빈 선으로 되돌리고, 다시 보이면 첫 선부터 새로 그린다. 반쯤 보이는 동안에는 다시 시작하지 않는다.
// 선 개수에 맞춰 시간표를 계산해야 해서 CSS 키프레임 대신 Web Animations API(element.animate)로 돌린다.
// PC 는 왼 → 오, 태블릿 · 모바일은 위 → 아래로 그린다.
// 서비스 색 — 화면 <main> 이 --platform-tone-step(번호 원 · 흐르는 선) · --platform-tone-step-foreground(번호)를 정하면 그 색,
// 없으면 플랫폼 소개 색(platform-step · platform-accent-foreground).
// 동작 줄이기 설정이면 처음부터 선이 다 그려진 채 움직이지 않는다[6.3.1]. 번호는 꾸밈이고, 낭독기는 제목 앞 "n단계"를 읽는다.
// 쓰는 곳: 플랫폼 소개 5화면 이용 절차(custom/platform-intro.tsx · platform-technology-evaluation.tsx · platform-patent-evaluation.tsx · platform-k-bigx-report.tsx · platform-carbon-neutrality.tsx).

type PlatformProcessStep = {
    title: string
    description?: string
    /** 단계 아래 태그(선택할 수 있는 항목 등). */
    tags?: readonly string[]
    /** 태그 목록 이름(낭독기). */
    tagsLabel?: string
}

// 선 하나 그리는 시간(ms) · 그리기 시작하는 보이는 비율(목록의 35%).
const LINE_DRAW_MS = 1000
const INVIEW_THRESHOLD = 0.35
// 가로 절차로 바뀌는 폭 — 아래 lg: 클래스(1024)와 같다.
const HORIZONTAL_QUERY = '(min-width: 1024px)'
const FULL_CLIP = 'inset(0)'

// 연결선 — 옅은 선(platform-line) 위로 강조색 선(platform-accent-foreground)이 흐른다. 한 줄짜리라 단계 사이에 이음매가 없다.
//   PC: 번호 원(44) 오른쪽 12 에서 다음 번호 원 왼쪽 12 까지(칸 폭이 같아 다음 원 중심 = +100%).
//   태블릿 · 모바일: 번호 원 아래 8(위 52)에서 단계 아래 끝 6 앞까지.
const LINE_TRACK_CLASS =
    'bg-platform-line absolute overflow-hidden rounded-full max-lg:top-13 max-lg:bottom-1.5 max-lg:left-[calc(--spacing(5.5)-1px)] max-lg:w-0.5 lg:top-[calc(--spacing(5.5)-1px)] lg:left-[calc(50%+--spacing(8.5))] lg:h-0.5 lg:w-[calc(100%-var(--spacing)*17)]'
// 강조색 선 — 평소에는 감춰 두고(빈 길) 흐르는 동안만 애니메이션이 보인다. 동작 줄이기면 감추지 않아 다 그려진 채 보인다.
const LINE_FILL_CLASS =
    'block size-full bg-[var(--platform-tone-step,var(--color-platform-accent-foreground))] motion-safe:max-lg:[clip-path:inset(0_0_100%_0)] motion-safe:lg:[clip-path:inset(0_100%_0_0)]'

// 단계 칸 — 화면에 들어오면 차례로 떠오른다(PlatformReveal, 같이 들어오면 0.14초 간격).
const StepItem = ({className, children}: {className: string; children: ReactNode}) => {
    const ref = usePlatformReveal<HTMLLIElement>()
    return (
        <li ref={ref} data-revealed="false" className={cn(PLATFORM_REVEAL_CLASS, className)}>
            {children}
        </li>
    )
}

const PlatformProcessSteps = ({steps, className}: {steps: readonly PlatformProcessStep[]; className?: string}) => {
    const ref = useRef<HTMLOListElement>(null)

    useEffect(() => {
        const list = ref.current
        if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
        const fills = Array.from(list.querySelectorAll<HTMLElement>('[data-step-line]'))
        const horizontal = window.matchMedia(HORIZONTAL_QUERY)
        let animations: Animation[] = []

        // 그리는 중이거나 다 그려진 상태면 true — 화면을 완전히 벗어나야 false 로 돌아간다.
        let isPlayed = false

        const stop = () => {
            animations.forEach((animation) => animation.cancel())
            animations = []
        }

        const start = () => {
            stop()
            const total = fills.length * LINE_DRAW_MS
            const hidden = horizontal.matches ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)'
            animations = fills.map((fill, index) =>
                fill.animate(
                    [
                        {clipPath: hidden, offset: 0},
                        {clipPath: hidden, offset: (index * LINE_DRAW_MS) / total},
                        {clipPath: FULL_CLIP, offset: ((index + 1) * LINE_DRAW_MS) / total},
                        {clipPath: FULL_CLIP, offset: 1},
                    ],
                    // 끝난 뒤에도 다 그린 모습을 유지한다.
                    {duration: total, fill: 'forwards'},
                ),
            )
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return
                if (!entry.isIntersecting) {
                    isPlayed = false
                    stop()
                    return
                }
                if (!isPlayed && entry.intersectionRatio >= INVIEW_THRESHOLD) {
                    isPlayed = true
                    start()
                }
            },
            // 0 = 완전히 벗어남(초기화) · 0.35 = 그리기 시작.
            {threshold: [0, INVIEW_THRESHOLD]},
        )
        // 가로 ↔ 세로로 바뀌면 그리는 방향이 달라지므로, 이미 보이는 중이면 새 방향으로 다시 그린다.
        const restart = () => {
            if (isPlayed) start()
        }
        observer.observe(list)
        horizontal.addEventListener('change', restart)
        return () => {
            observer.disconnect()
            horizontal.removeEventListener('change', restart)
            stop()
        }
    }, [steps.length])

    return (
        <ol ref={ref} className={cn('grid lg:auto-cols-fr lg:grid-flow-col', className)}>
            {steps.map((step, index) => (
                <StepItem
                    key={step.title}
                    className="relative grid grid-cols-[--spacing(11)_minmax(0,1fr)] content-start gap-x-4.5 gap-y-1.5 pb-7 last:pb-0 lg:flex lg:flex-col lg:items-center lg:gap-2.5 lg:px-3 lg:pb-0 lg:text-center"
                >
                    <span
                        aria-hidden="true"
                        className="typo-title-m-bold row-span-4 grid size-11 shrink-0 place-items-center rounded-full bg-[var(--platform-tone-step,var(--color-platform-step))] text-[var(--platform-tone-step-foreground,var(--color-platform-step-foreground))] lg:mb-1.5"
                    >
                        {index + 1}
                    </span>
                    {index < steps.length - 1 ? (
                        <span aria-hidden="true" className={LINE_TRACK_CLASS}>
                            <span data-step-line className={LINE_FILL_CLASS} />
                        </span>
                    ) : null}
                    <h3 className="typo-title-m-bold text-foreground flex min-h-11 items-center break-keep lg:min-h-0">
                        <span className="sr-only">{index + 1}단계 </span>
                        {step.title}
                    </h3>
                    {step.description ? (
                        <p className="typo-body-xl-regular text-label-foreground max-w-96 break-keep">
                            {step.description}
                        </p>
                    ) : null}
                    {step.tags ? (
                        <ul aria-label={step.tagsLabel} className="mt-1 flex flex-wrap gap-1.5 lg:justify-center">
                            {step.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="typo-body-m-bold bg-platform-accent-subtle text-platform-accent-foreground rounded-full px-2.5 py-0.5"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </StepItem>
            ))}
        </ol>
    )
}

export {PlatformProcessSteps}
export type {PlatformProcessStep}
