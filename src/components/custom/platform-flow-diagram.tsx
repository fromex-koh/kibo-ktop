import {Fragment, type ReactNode} from 'react'
import {ArrowRight, Info} from 'lucide-react'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {
    platformFlowBadgeClassName,
    platformFlowPanelClassName,
    platformFlowToneClassName,
} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 흐름 도식 — 칸(배지 · 제목 h3 · 항목들) → 화살표 → 칸 → … → 결과 칸(강조색 채움 · 메달 · 제목 · 설명). 아래 안내 한 줄(note).
//   · PC(1280↑): 칸이 가로로 놓이고(첫 칸 1.2 : 나머지 1) 사이에 원 화살표. 그 아래: 세로로 쌓고 화살표를 90° 돌린다.
//   · 색은 화면 <main> 의 --platform-flow-*(없으면 플랫폼 소개 파랑, theme platformFlowToneClassName).
//   · 칸마다 화면에 들어오면 차례로 떠오른다(PlatformReveal). 화살표 · 아이콘은 꾸밈이라 읽지 않는다.
//   · 목록이 아닌 개념도라 role="group" + aria-label 로 묶는다(label).
// 쓰는 곳: custom/platform-patent-evaluation.tsx(평가 원리).

type PlatformFlowItem = {icon: ReactNode; title: string; description: string}

type PlatformFlowColumn = {
    id: string
    /** 제목 앞 배지 아이콘(lucide). */
    icon: ReactNode
    title: string
    items: readonly PlatformFlowItem[]
}

type PlatformFlowResult = {icon: ReactNode; title: string; description: string}

const Arrow = () => (
    <span aria-hidden="true" className="grid place-items-center">
        <span className="bg-platform-panel grid size-9.5 place-items-center rounded-full text-(--flow-f) shadow-sm ring-1 ring-[color-mix(in_srgb,var(--flow-a)_18%,var(--color-platform-panel-border))]">
            <ArrowRight className="size-4.5 max-xl:rotate-90" strokeWidth={2.2} />
        </span>
    </span>
)

const PlatformFlowDiagram = ({
    columns,
    result,
    note,
    label,
    className,
}: {
    columns: readonly PlatformFlowColumn[]
    result: PlatformFlowResult
    note?: string
    /** 도식 전체 이름(낭독기). */
    label: string
    className?: string
}) => (
    <div className={cn(platformFlowToneClassName, className)}>
        <div
            role="group"
            aria-label={label}
            className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]"
        >
            {columns.map((column) => (
                <Fragment key={column.id}>
                    <PlatformReveal className={cn(platformFlowPanelClassName, 'flex flex-col gap-3 p-6')}>
                        <h3 className="typo-title-m-bold text-foreground flex items-center gap-2.5">
                            <span
                                aria-hidden="true"
                                className={cn(platformFlowBadgeClassName, 'size-7.5 rounded-sm [&_svg]:size-4.25')}
                            >
                                {column.icon}
                            </span>
                            {column.title}
                        </h3>
                        {column.items.map((item) => (
                            <div
                                key={item.title}
                                className="bg-platform-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-md px-4 py-3.5 shadow-xs ring-1 ring-[color-mix(in_srgb,var(--flow-a)_12%,var(--color-platform-panel-border))]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="row-span-2 grid size-9.5 place-items-center rounded-md bg-[color-mix(in_srgb,var(--flow-a)_10%,var(--color-platform-panel))] text-(--flow-f) [&_svg]:size-4.75"
                                >
                                    {item.icon}
                                </span>
                                <strong className="typo-body-xl-bold text-foreground">{item.title}</strong>
                                <span className="typo-body-l-regular text-label-foreground break-keep">
                                    {item.description}
                                </span>
                            </div>
                        ))}
                    </PlatformReveal>
                    <Arrow />
                </Fragment>
            ))}
            <PlatformReveal className="shadow-lift flex flex-col items-center justify-center gap-3 rounded-xl bg-[radial-gradient(120%_90%_at_85%_0%,var(--flow-b),transparent_60%),linear-gradient(135deg,var(--flow-b),var(--flow-a))] p-6 text-center text-white">
                <span
                    aria-hidden="true"
                    className="mb-1 grid size-13 place-items-center rounded-lg bg-white/16 ring-1 ring-white/28 ring-inset [&_svg]:size-6.5"
                >
                    {result.icon}
                </span>
                <h3 className="typo-title-m-bold">{result.title}</h3>
                <p className="typo-body-xl-regular break-keep">{result.description}</p>
            </PlatformReveal>
        </div>
        {note ? (
            <p className="typo-body-l-regular text-foreground-subtle mt-4 flex items-start gap-2">
                <Info aria-hidden="true" className="mt-0.75 size-4 shrink-0" />
                {note}
            </p>
        ) : null}
    </div>
)

export {PlatformFlowDiagram}
export type {PlatformFlowColumn, PlatformFlowItem, PlatformFlowResult}
