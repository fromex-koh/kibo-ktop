import type {ReactNode} from 'react'
import {platformCardClassName} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 서비스 히어로 카드 — 히어로 오른쪽 그림(PlatformHero visual). 서비스 카드가 위아래로 놓이고 둘째 카드는 오른쪽으로 40 밀려 엇갈린다.
//   · 카드 = 아이콘 칸(56, 옅은 서비스 면 --platform-icon-surface · 아이콘 색 --platform-icon-color) · 서비스 이름 · 기능 태그.
//   · 카드마다 6초에 한 번 떠올랐다 내려온다(platform-float — 둘째는 3초 엇갈림). 마우스를 올리면 멈추고, 동작 줄이기면 정지[6.3.1].
//   · 한 장의 예시 그림이라 role="img" + aria-label 로 한 번에 읽힌다(label). 쓰는 곳: custom/platform-carbon-neutrality.tsx.

type PlatformServiceHeroCard = {
    title: string
    tags: readonly string[]
    /** 아이콘(lucide, 꾸밈). */
    icon: ReactNode
}

// 카드별 떠다니기 시작점 · 자리 — 둘째 카드는 3초 늦게(반 주기) 떠오르고, PC(1280↑)에서는 오른쪽으로 40 밀려 엇갈린다
// (1024~1279 는 그림 칸이 좁아 밀지 않는다 · 1024 아래는 그림이 숨는다).
const CARD_CLASS = ['', '[--platform-float-delay:-3s] xl:ml-10'] as const

const PlatformServiceHeroCards = ({
    items,
    label,
    className,
}: {
    items: readonly PlatformServiceHeroCard[]
    /** 그림 전체 설명(낭독기). */
    label: string
    className?: string
}) => (
    <div role="img" aria-label={label} className={cn('grid w-full max-w-110 gap-4', className)}>
        {items.map((item, index) => (
            <div
                key={item.title}
                className={cn(
                    platformCardClassName,
                    'motion-safe:animate-platform-float shadow-float flex items-start gap-3.5 p-4.5 hover:[animation-play-state:paused] xl:gap-4 xl:p-5.5',
                    CARD_CLASS[index],
                )}
            >
                <span
                    aria-hidden="true"
                    className="grid size-14 shrink-0 place-items-center rounded-md bg-[var(--platform-icon-surface,var(--color-platform-accent-subtle))] text-[var(--platform-icon-color,var(--color-platform-accent-foreground))] [&_svg]:size-7"
                >
                    {item.icon}
                </span>
                <div className="flex min-w-0 flex-col gap-2.5 pt-0.5">
                    <strong className="typo-title-m-bold text-foreground break-keep">{item.title}</strong>
                    <span className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className="typo-body-m-bold rounded-xs bg-[var(--platform-icon-surface,var(--color-platform-accent-subtle))] px-2.25 py-0.75 text-[var(--platform-icon-color,var(--color-platform-accent-foreground))]"
                            >
                                {tag}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        ))}
    </div>
)

export {PlatformServiceHeroCards}
export type {PlatformServiceHeroCard}
