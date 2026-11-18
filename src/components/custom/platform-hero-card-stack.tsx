import type {ReactNode} from 'react'
import {platformCardClassName, platformServiceIconVariants} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 히어로 카드 묶음 — 플랫폼 소개 히어로 오른쪽 그림(PlatformHero visual)으로 쓰는 카드 목록.
// 카드 = 아이콘 칸 · 작은 이름(label) · 제목 · 한 줄 설명. 아래 카드일수록 오른쪽으로 28씩 밀려 계단처럼 놓인다.
//   · 카드가 천천히 떠올랐다 내려온다(animate-platform-float, 카드마다 2초씩 엇갈림). 마우스를 올리면 멈추고,
//     동작 줄이기 설정이면 움직이지 않는다[6.3.1].
//   · 글이라 낭독기가 읽는다 — label 은 목록 이름(aria-label). 히어로가 1024 미만에서 그림을 숨기므로 그 폭에서는 보이지 않는다.
// 쓰는 곳: custom/platform-technology-evaluation.tsx(기술평가 소개).

type PlatformHeroCard = {
    id: string
    /** 아이콘(lucide, aria-hidden). */
    icon: ReactNode
    /** 제목 위 작은 이름(모형 이름 등). */
    label: string
    title: string
    description: string
}

// 카드 순서별 왼쪽 들여쓰기 · 떠오름 시작점(6초 주기에서 0 · 2 · 4초 앞당김). Tailwind 가 읽도록 리터럴로 둔다.
const CARD_OFFSET_CLASS = ['', 'ml-7', 'ml-14'] as const
const CARD_FLOAT_DELAY_CLASS = ['', '[--platform-float-delay:-2s]', '[--platform-float-delay:-4s]'] as const

const PlatformHeroCardStack = ({
    items,
    label,
    className,
}: {
    items: readonly PlatformHeroCard[]
    label: string
    className?: string
}) => (
    <ul aria-label={label} className={cn('group/stack grid w-full max-w-110 gap-3.5', className)}>
        {items.map((item, index) => (
            <li
                key={item.id}
                className={cn(
                    platformCardClassName,
                    'shadow-lift flex items-center gap-4 px-4.5 py-4',
                    'motion-safe:animate-platform-float group-hover/stack:[animation-play-state:paused]',
                    CARD_OFFSET_CLASS[index % CARD_OFFSET_CLASS.length],
                    CARD_FLOAT_DELAY_CLASS[index % CARD_FLOAT_DELAY_CLASS.length],
                )}
            >
                <span className={platformServiceIconVariants({service: 'tech'})}>{item.icon}</span>
                <div className="flex min-w-0 flex-col">
                    <span className="typo-body-m-bold text-foreground-subtle">{item.label}</span>
                    <strong className="typo-title-m-bold text-foreground">{item.title}</strong>
                    <span className="typo-body-l-regular text-label-foreground break-keep">{item.description}</span>
                </div>
            </li>
        ))}
    </ul>
)

export {PlatformHeroCardStack}
export type {PlatformHeroCard}
