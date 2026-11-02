import type {ReactNode} from 'react'
import {ListMarker} from '@/components/custom/list-marker'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {cn} from '@/lib/utils'

// 플랫폼 소개 서비스 화면 공용 조각.
// 쓰는 곳: 플랫폼 소개 > K-BIGx 보고서(tone navy) · 탄소중립(tone green).
//   · PlatformServiceHero — 화면 전체 폭 띠 + 번진 원 두 개(천천히 떠다님) 안에 제목 줄 · 큰 제목 · 설명 · children
//   · ServiceGlassCard(List) — 띠 위 반투명 카드. 설명 대신 점 목록(bullets)도 된다
//   · ServiceFeatureList — 아이콘 + 제목 · 설명 목록(2열 · 3열)
//
// 알아둘 점
//   · 히어로 보조 문구는 p 가 아니라 div 다 — 짧고 굵은 문단이면 WAVE 가 제목 후보(Possible heading)로 경고한다.
//   · ServiceGlassCard 의 transition-none 을 지우지 않는다 — 등장 클래스 duration-* 이 transition 시간도 정해,
//     탭 전환에서 카드를 감출 때 감춤이 그만큼 늦게 적용돼 이전 카드가 남아 보인다.
//   · 동작 줄이기면 모든 움직임이 없다[6.3.1].

type PlatformServiceTone = 'navy' | 'green'

// 띠 · 번진 원(오른쪽 아래 · 왼쪽 위) · 큰 제목 둘째 줄 강조색 한 벌.
const TONE_CLASS: Record<PlatformServiceTone, {band: string; circleRight: string; circleLeft: string; accent: string}> =
    {
        // 다크는 팔레트 반사 값이 시안보다 밝아, 전용 토큰(service-hero-navy-*)으로 짙은 남색 띠 + 은은한 원을 쓴다.
        navy: {
            band: 'bg-service-hero-navy-band',
            circleRight: 'from-service-hero-navy-glow-right',
            circleLeft: 'from-service-hero-navy-glow-left',
            accent: 'text-primary-strong',
        },
        // 다크는 팔레트 반사 값이 시안과 달라, 전용 토큰(service-hero-green-*)으로 짙은 초록 띠 + 은은한 원을 쓴다.
        green: {
            band: 'bg-service-hero-green-band',
            circleRight: 'from-service-hero-green-glow-right',
            circleLeft: 'from-service-hero-green-glow-left',
            accent: 'text-service-accent-green',
        },
    }

const RISE_CLASS_NAME =
    'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-10 motion-safe:ease-roll motion-safe:fill-mode-both motion-safe:duration-900'
// 차례로 떠오르는 지연 — 클래스는 Tailwind 가 읽도록 리터럴로 둔다.
const TITLE_LINE_DELAY_CLASS = ['motion-safe:delay-100', 'motion-safe:delay-250'] as const
const CARD_DELAY_CLASS = ['motion-safe:delay-500', 'motion-safe:delay-600', 'motion-safe:delay-700'] as const

// 줄마다 끊긴 문장 — 태블릿부터 시안처럼 줄을 나누고, 모바일은 이어서 흐른다.
const BrokenLines = ({lines}: {lines: readonly string[]}) =>
    lines.map((line, index) => (
        <span key={line} className="md:block">
            {index > 0 ? ' ' : null}
            {line}
        </span>
    ))

type PlatformServiceHeroProps = {
    headingId: string
    titleBar: ReactNode
    titleLines: readonly string[]
    lead: string
    descriptionLines: readonly string[]
    tone: PlatformServiceTone
    /** 설명 아래 칸(카드 목록 · 전환 버튼 등). */
    children: ReactNode
}

const PlatformServiceHero = ({
    headingId,
    titleBar,
    titleLines,
    lead,
    descriptionLines,
    tone,
    children,
}: PlatformServiceHeroProps) => {
    const toneClass = TONE_CLASS[tone]

    return (
        <section aria-labelledby={headingId} className={cn('relative isolate overflow-hidden', toneClass.band)}>
            {/* 번진 원 — 꾸밈. 서로 다른 경로 · 주기로 천천히 떠다닌다(animate-ambient-drift-a · b). */}
            <div
                aria-hidden="true"
                className={cn(
                    'motion-safe:animate-ambient-drift-b pointer-events-none absolute top-34 -right-43 -z-10 size-241 rounded-full bg-radial to-transparent to-70%',
                    toneClass.circleRight,
                )}
            />
            <div
                aria-hidden="true"
                className={cn(
                    'motion-safe:animate-ambient-drift-a pointer-events-none absolute -top-20 -left-52 -z-10 size-214 rounded-full bg-radial to-transparent to-70%',
                    toneClass.circleLeft,
                )}
            />
            <div className="grid-layout pt-10 pb-24 *:col-span-full">
                {titleBar}
                <div className="mt-15 flex flex-col items-center gap-12 text-center md:mt-25">
                    <div className="flex flex-col items-center gap-8">
                        <h2 id={headingId} className="typo-display-hero-black text-foreground break-keep">
                            {titleLines.map((line, index) => (
                                <span key={line} className="block overflow-hidden">
                                    <span
                                        className={cn(
                                            'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-full motion-safe:ease-roll motion-safe:fill-mode-both block motion-safe:duration-900',
                                            TITLE_LINE_DELAY_CLASS[index],
                                            index > 0 && toneClass.accent,
                                        )}
                                    >
                                        {line}
                                    </span>
                                </span>
                            ))}
                        </h2>
                        <div className={cn('flex flex-col gap-4', RISE_CLASS_NAME, 'motion-safe:delay-300')}>
                            <div className="typo-h4-bold text-foreground break-keep">{lead}</div>
                            <p className="typo-title-l-regular text-label-foreground break-keep">
                                <BrokenLines lines={descriptionLines} />
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </section>
    )
}

type ServiceGlassCardProps = {
    /** 카드 순서(0 ~ 2) — 차례로 떠오르는 지연. */
    index: number
    /** 그림(높이 88 칸) — next/image(alt=""). */
    image: ReactNode
    title: string
    description?: string
    /** 설명 대신 점 목록(16 Medium · 줄 사이 8). */
    bullets?: readonly string[]
}

const ServiceGlassCard = ({index, image, title, description, bullets}: ServiceGlassCardProps) => (
    <li
        className={cn(
            'rounded-glass border-service-glass-border flex flex-col gap-3 border bg-white/20 p-8 text-left transition-none',
            RISE_CLASS_NAME,
            CARD_DELAY_CLASS[index],
        )}
    >
        {image}
        <div className="flex flex-col gap-2">
            <h3 className="typo-h4-bold text-foreground wrap-break-word break-keep">{title}</h3>
            {description ? <p className="typo-body-xl-medium text-label-foreground break-keep">{description}</p> : null}
            {bullets ? (
                <ul className="typo-body-xl-medium text-label-foreground flex flex-col gap-2">
                    {bullets.map((bullet) => (
                        <li key={bullet} className="flex">
                            <ListMarker className="[&>span]:bg-service-hero-marker h-lh" />
                            <span className="break-keep">{bullet}</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    </li>
)

// 카드 목록 — 모바일 1열(사이 16) · 태블릿부터 3열(사이 24).
const ServiceGlassCardList = ({children, className}: {children: ReactNode; className?: string}) => (
    <ul className={cn('grid w-full gap-4 md:grid-cols-3 md:gap-6', className)}>{children}</ul>
)

type ServiceFeature = {icon: ReactNode; title: string; description: string}

const FEATURE_COLUMNS_CLASS = {2: 'md:grid-cols-2', 3: 'md:grid-cols-3'} as const

const ServiceFeatureList = ({
    items,
    columns,
    iconSurfaceClassName = 'bg-model-icon-surface',
}: {
    items: readonly ServiceFeature[]
    columns: 2 | 3
    /** 아이콘 칸 바탕 — 화면 전용 색이 있을 때만 넘긴다. */
    iconSurfaceClassName?: string
}) => (
    <ScrollReveal>
        <ul className={cn('grid gap-8 md:gap-x-6 md:gap-y-12', FEATURE_COLUMNS_CLASS[columns])}>
            {items.map((item) => (
                <li key={item.title} className={cn('flex gap-6', columns === 2 ? 'items-center' : 'items-start')}>
                    <span
                        className={cn(
                            'flex size-20 shrink-0 items-center justify-center rounded-2xl',
                            iconSurfaceClassName,
                        )}
                    >
                        {item.icon}
                    </span>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-h4-bold text-foreground break-keep">{item.title}</h3>
                        <p className="typo-body-xl-medium text-foreground-subtle break-keep">{item.description}</p>
                    </div>
                </li>
            ))}
        </ul>
    </ScrollReveal>
)

export {PlatformServiceHero, ServiceFeatureList, ServiceGlassCard, ServiceGlassCardList}
export type {PlatformServiceTone, ServiceFeature}
