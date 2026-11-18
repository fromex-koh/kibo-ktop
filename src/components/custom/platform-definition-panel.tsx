import type {ReactNode} from 'react'
import {ShieldCheck} from 'lucide-react'
import {
    platformFlowBadgeClassName,
    platformFlowPanelClassName,
    platformFlowToneClassName,
} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 정의 패널 — 제목(h3) → 칸 3개(동그란 아이콘 자리 · 굵은 이름 · 설명) → 결론 한 줄(방패 배지 + 강조 낱말).
//   · 칸은 PC · 태블릿 3열, 모바일(768 미만) 1열. 바탕 · 테두리 · 배지 색은 흐름 도식과 같은 --platform-flow-*.
//   · 칸 내용은 위에서부터 쌓는다(content-start) — 설명이 두 줄인 칸이 있어도 아이콘 · 이름 줄이 옆 칸과 맞는다.
//   · 설명 · 결론은 줄 길이를 고르게(text-balance) — 좁은 폭에서 낱말 하나만 다음 줄로 떨어지지 않게.
//   · 아이콘은 꾸밈(라이트 · 다크 그림은 ThemeImage 로 넘긴다).
// 쓰는 곳: custom/platform-patent-evaluation.tsx(KPAS 가 정의한 재산적 가치가 있는 지식재산).

type PlatformDefinitionItem = {id: string; icon: ReactNode; title: string; description: string}

const PlatformDefinitionPanel = ({
    title,
    items,
    conclusion,
    className,
}: {
    title: string
    items: readonly PlatformDefinitionItem[]
    /** 결론 한 줄 — 강조 낱말은 <b> 로 감싸면 강조색 굵은 글이 된다. */
    conclusion: ReactNode
    className?: string
}) => (
    <section
        aria-label={title}
        className={cn(platformFlowToneClassName, platformFlowPanelClassName, 'p-5.5 md:p-8', className)}
    >
        <h3 className="typo-title-l-bold text-foreground mb-5">{title}</h3>
        <ol className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
                <li
                    key={item.id}
                    className="bg-platform-panel grid content-start justify-items-center gap-1.5 rounded-lg p-5 text-center shadow-sm ring-1 ring-[color-mix(in_srgb,var(--flow-a)_10%,var(--color-platform-panel-border))]"
                >
                    <span
                        aria-hidden="true"
                        className="mb-1 grid size-18 place-items-center rounded-full bg-[color-mix(in_srgb,var(--flow-a)_9%,var(--color-platform-panel))] [&_img]:size-10.5"
                    >
                        {item.icon}
                    </span>
                    <strong className="typo-body-xl-bold text-foreground">{item.title}</strong>
                    <span className="typo-body-l-regular text-label-foreground text-balance break-keep">
                        {item.description}
                    </span>
                </li>
            ))}
        </ol>
        <p className="typo-body-xl-bold text-foreground to-platform-panel mt-5 flex items-center gap-3.5 rounded-md border border-[color-mix(in_srgb,var(--flow-f)_32%,var(--color-platform-panel-border))] bg-linear-to-r from-[color-mix(in_srgb,var(--flow-a)_9%,var(--color-platform-panel))] to-65% px-5 py-4 break-keep [&_b]:font-bold [&_b]:text-(--flow-f)">
            <span aria-hidden="true" className={cn(platformFlowBadgeClassName, 'size-8.5 rounded-sm [&_svg]:size-5')}>
                <ShieldCheck />
            </span>
            <span className="text-balance">{conclusion}</span>
        </p>
    </section>
)

export {PlatformDefinitionPanel}
export type {PlatformDefinitionItem}
