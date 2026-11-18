'use client'

import {useEffect, useRef, type PointerEvent, type ReactNode} from 'react'
import {ArrowRight} from 'lucide-react'
import Link from 'next/link'
import {PLATFORM_REVEAL_CLASS, usePlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformServiceArt} from '@/components/custom/platform-service-art'
import {
    platformCardClassName,
    platformChipClassName,
    platformServiceIconVariants,
} from '@/components/theme/platform-intro.variants'
import type {PlatformServiceKind} from '@/content/service/platform-intro'
import {cn} from '@/lib/utils'

// 서비스 카드 — 2 × 2 카드. 카드 어디를 눌러도 그 서비스 소개로 간다(링크 하나를 카드 전체로 넓힌다 — 링크를 겹치지 않는다).
//
// 호버 렌즈 — 마우스를 올리면 커서를 따라다니는 원 안에서 카드가 반전된다. 원 안에는 짙은 남색 면(platform-lens) 위에
// 서비스 예시 그림(PlatformServiceArt)이 깔리고, 렌즈 면 62% 막 위로 흰 글자가 보인다.
//   · 원 지름 = 카드 폭의 54.4%. 들어올 때 반 크기에서 튀듯이 커지고(back.out · 0.6초, 0.3초에 걸쳐 나타남),
//     나갈 때 반 크기로 줄며 사라진다(back.in · 0.4초). 원 중심은 커서를 프레임마다 18%씩 따라가 살짝 늦게 붙는다.
//   · 움직임은 requestAnimationFrame 으로 그리고 렌즈가 쉬면 멈춘다. 값은 카드에 CSS 변수(--lens-x · -y · -r · -o)로 둔다.
//   · 반전 카드는 같은 내용을 한 번 더 그린 꾸밈이라 낭독기 · 키보드에서 뺀다(aria-hidden · inert, 링크 대신 글자).
//   · 터치 · 펜 입력, 동작 줄이기 설정에서는 켜지 않는다[6.3.1]. 키보드 포커스는 카드 테두리 · 링으로 보인다.
// 쓰는 곳: custom/platform-intro.tsx(주요 서비스).

type PlatformServiceCard = {
    id: string
    /** 이름 위 작은 번호(01 등). */
    order: string
    name: string
    description: string
    /** 서비스 — 아이콘 칸 색을 고른다. */
    service: PlatformServiceKind
    /** 아이콘(lucide, aria-hidden). */
    icon: ReactNode
    chips: readonly string[]
    chipsLabel: string
    linkLabel: string
    href: string
}

// 렌즈 — 지름 / 카드 폭, 커서 따라가기 비율(프레임당), 커짐 · 나타남 · 사라짐 시간(ms), 쉴 때 크기 배율.
const LENS_DIAMETER_RATIO = 0.544
const LENS_FOLLOW = 0.18
const LENS_IN_MS = 600
const LENS_FADE_IN_MS = 300
const LENS_OUT_MS = 400
const LENS_REST_SCALE = 0.5
// back 곡선의 넘침 정도(GSAP back 기본값 1.7 에 해당).
const BACK_OVERSHOOT = 1.70158

const backOut = (x: number) => 1 + (BACK_OVERSHOOT + 1) * (x - 1) ** 3 + BACK_OVERSHOOT * (x - 1) ** 2
const backIn = (x: number) => (BACK_OVERSHOOT + 1) * x ** 3 - BACK_OVERSHOOT * x ** 2
const easeOut = (x: number) => 1 - (1 - x) ** 2
const easeIn = (x: number) => x ** 2

type LensPhase = 'idle' | 'in' | 'out'

type LensState = {
    phase: LensPhase
    startedAt: number
    scale: number
    scaleFrom: number
    opacity: number
    opacityFrom: number
    x: number
    y: number
    targetX: number
    targetY: number
    diameter: number
    frame: number
}

const CardBody = ({card, isInverted}: {card: PlatformServiceCard; isInverted: boolean}) => (
    <>
        <div className="flex items-center gap-4">
            <span
                className={
                    isInverted
                        ? '[&_svg]:size-icon-lg grid size-14 shrink-0 place-items-center rounded-md bg-white/20'
                        : platformServiceIconVariants({service: card.service})
                }
            >
                {card.icon}
            </span>
            <h3 className="typo-title-xl-bold break-keep">
                <span className={cn('typo-body-l-bold block', isInverted ? 'opacity-80' : 'text-foreground-subtle')}>
                    {card.order}
                </span>
                {card.name}
            </h3>
        </div>
        <p className={cn('typo-body-xl-regular flex-1 break-keep', !isInverted && 'text-label-foreground')}>
            {card.description}
        </p>
        <ul aria-label={card.chipsLabel} className="flex flex-wrap gap-1.5">
            {card.chips.map((chip) => (
                <li
                    key={chip}
                    className={
                        isInverted
                            ? 'typo-body-m-bold rounded-xs border border-white/30 bg-white/15 px-3 py-1'
                            : platformChipClassName
                    }
                >
                    {chip}
                </li>
            ))}
        </ul>
        <div className={cn('flex border-t pt-4', isInverted ? 'border-white/30' : 'border-platform-panel-border')}>
            {isInverted ? (
                <span className="typo-body-xl-bold inline-flex items-center gap-1.5">
                    {card.linkLabel}
                    <ArrowRight className="size-icon-sm" />
                </span>
            ) : (
                // 링크를 카드 전체로 넓힌다(after) — 키보드 포커스 표시는 카드 테두리 · 링(has-focus-visible)이 맡는다[6.1.2].
                <Link
                    href={card.href}
                    className="typo-body-xl-bold text-platform-accent-foreground inline-flex items-center gap-1.5 outline-none after:absolute after:inset-0 after:rounded-lg"
                >
                    {card.linkLabel}
                    <ArrowRight aria-hidden="true" className="size-icon-sm" />
                </Link>
            )}
        </div>
    </>
)

const ServiceCard = ({card}: {card: PlatformServiceCard}) => {
    const cardRef = useRef<HTMLLIElement>(null)
    // 화면에 들어오면 카드마다 차례로 떠오른다(PlatformReveal).
    const revealRef = usePlatformReveal<HTMLLIElement>()
    const setCardRef = (element: HTMLLIElement | null) => {
        cardRef.current = element
        revealRef.current = element
    }
    // 렌즈 상태 — 그리기 루프가 읽고 쓴다(다시 그리기 없이 CSS 변수만 바꾼다).
    const lensRef = useRef<LensState>({
        phase: 'idle',
        startedAt: 0,
        scale: LENS_REST_SCALE,
        scaleFrom: LENS_REST_SCALE,
        opacity: 0,
        opacityFrom: 0,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        diameter: 0,
        frame: 0,
    })

    useEffect(() => {
        const lens = lensRef.current
        return () => cancelAnimationFrame(lens.frame)
    }, [])

    const draw = (now: number) => {
        const element = cardRef.current
        const lens = lensRef.current
        if (!element) return
        const elapsed = now - lens.startedAt
        lens.x += (lens.targetX - lens.x) * LENS_FOLLOW
        lens.y += (lens.targetY - lens.y) * LENS_FOLLOW
        if (lens.phase === 'in') {
            lens.scale = lens.scaleFrom + (1 - lens.scaleFrom) * backOut(Math.min(1, elapsed / LENS_IN_MS))
            lens.opacity = lens.opacityFrom + (1 - lens.opacityFrom) * easeOut(Math.min(1, elapsed / LENS_FADE_IN_MS))
        }
        if (lens.phase === 'out') {
            const progress = Math.min(1, elapsed / LENS_OUT_MS)
            lens.scale = lens.scaleFrom + (LENS_REST_SCALE - lens.scaleFrom) * backIn(progress)
            lens.opacity = lens.opacityFrom * (1 - easeIn(progress))
            if (progress >= 1) lens.phase = 'idle'
        }
        element.style.setProperty('--lens-x', `${lens.x}px`)
        element.style.setProperty('--lens-y', `${lens.y}px`)
        element.style.setProperty('--lens-r', lens.phase === 'idle' ? '0px' : `${(lens.diameter / 2) * lens.scale}px`)
        element.style.setProperty('--lens-o', String(lens.phase === 'idle' ? 0 : lens.opacity))
        if (lens.phase !== 'idle') lens.frame = requestAnimationFrame(draw)
    }

    const pointOf = (event: PointerEvent<HTMLLIElement>, element: HTMLElement) => {
        const box = element.getBoundingClientRect()
        return {x: event.clientX - box.left, y: event.clientY - box.top}
    }

    const enterLens = (event: PointerEvent<HTMLLIElement>) => {
        const element = cardRef.current
        const lens = lensRef.current
        const isOff = event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!element || isOff) return
        const point = pointOf(event, element)
        lens.targetX = point.x
        lens.targetY = point.y
        if (lens.phase === 'idle') {
            // 쉬던 렌즈는 커서 자리에서 반 크기 · 투명으로 시작한다.
            lens.x = point.x
            lens.y = point.y
            lens.scale = LENS_REST_SCALE
            lens.opacity = 0
        }
        lens.diameter = element.clientWidth * LENS_DIAMETER_RATIO
        lens.scaleFrom = lens.scale
        lens.opacityFrom = lens.opacity
        lens.startedAt = performance.now()
        const wasIdle = lens.phase === 'idle'
        lens.phase = 'in'
        if (wasIdle) lens.frame = requestAnimationFrame(draw)
    }

    const moveLens = (event: PointerEvent<HTMLLIElement>) => {
        const element = cardRef.current
        const lens = lensRef.current
        if (!element || lens.phase === 'idle') return
        const point = pointOf(event, element)
        lens.targetX = point.x
        lens.targetY = point.y
    }

    const leaveLens = () => {
        const lens = lensRef.current
        if (lens.phase === 'idle') return
        lens.scaleFrom = lens.scale
        lens.opacityFrom = lens.opacity
        lens.startedAt = performance.now()
        lens.phase = 'out'
    }

    return (
        <li
            ref={setCardRef}
            data-revealed="false"
            onPointerEnter={enterLens}
            onPointerMove={moveLens}
            onPointerLeave={leaveLens}
            className={cn(
                PLATFORM_REVEAL_CLASS,
                platformCardClassName,
                'hover:border-platform-accent has-focus-visible:border-platform-accent has-focus-visible:ring-ring relative flex flex-col gap-4 overflow-hidden px-6 py-6 transition-[border-color,box-shadow,translate] duration-200 hover:shadow-md has-focus-visible:ring-2 motion-safe:hover:-translate-y-0.5 md:p-8',
                '[--lens-o:0] [--lens-r:0px] [--lens-x:50%] [--lens-y:50%]',
            )}
        >
            <CardBody card={card} isInverted={false} />
            {/* 반전 카드(렌즈) — 카드 전체에 겹쳐 그리고 원 모양으로만 보인다. 렌즈 면(바탕) 위에 예시 그림 · 렌즈 면 62% 막 · 흰 글자.
                렌즈 면은 글자를 감싼 이 요소의 배경으로 둔다 — 명도 대비 검사기가 글자 뒤 배경을 카드 흰 바탕이 아닌 남색으로 읽게 한다[5.3.3]. */}
            <div
                aria-hidden="true"
                inert
                className="bg-platform-lens pointer-events-none absolute inset-0 opacity-(--lens-o) [clip-path:circle(var(--lens-r)_at_var(--lens-x)_var(--lens-y))]"
            >
                <PlatformServiceArt service={card.service} className="absolute inset-0 size-full" />
                <span className="bg-platform-lens/62 absolute inset-0" />
                <div className="text-platform-lens-foreground relative flex h-full flex-col gap-4 px-6 py-6 md:p-8">
                    <CardBody card={card} isInverted />
                </div>
            </div>
        </li>
    )
}

const PlatformServiceCards = ({items, className}: {items: readonly PlatformServiceCard[]; className?: string}) => (
    <ul className={cn('grid gap-4 md:grid-cols-2 md:gap-6', className)}>
        {items.map((card) => (
            <ServiceCard key={card.id} card={card} />
        ))}
    </ul>
)

export {PlatformServiceCards}
export type {PlatformServiceCard}
