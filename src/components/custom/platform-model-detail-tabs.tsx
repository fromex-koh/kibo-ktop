import type {ReactNode} from 'react'
import {PlatformTabsList, PlatformTabsTrigger} from '@/components/composite/platform-tabs'
import {platformCardClassName, platformTagClassName} from '@/components/theme/platform-intro.variants'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import type {ModelOutcome, ModelSummaryLine} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// 모형 상세 탭 — 플랫폼 탭으로 모형을 고르면 아래 카드 하나에 그 모형 소개가 나온다(플랫폼 소개 > 기술평가 평가모형 섹션).
// 카드 짜임(위 → 아래, 여백 36 · 모바일 22):
//   머리(그림 96 × 80 · 모바일 60 × 52 | 제목 h4 20 · 설명 · 회색 키워드 태그, 아래 선) → 소개 점 목록
//   → 구조도(diagram, 위 28 · 소제목 h5) → 결과 카드 3장(위 20 · h5, PC 1280↑ 3열 · 그 아래 1열).
//   · 탭 위에 낭독기 전용 제목(h3, heading)을 두어 섹션 h2 → h4 사이 단계를 잇는다.
//   · 탭 역할 · 방향키 이동 · aria-selected 는 Radix Tabs 가 맡는다[8.2.1]. 고르지 않은 패널은 그리지 않는다.
// 서버 컴포넌트다 — 탭(PlatformTabs) · 구조도는 각자 클라이언트 컴포넌트다.
// 쓰는 곳: custom/platform-technology-evaluation.tsx(평가모형).

type PlatformModelDetail = {
    value: string
    tabLabel: string
    title: string
    lead: string
    chips: readonly string[]
    /** 머리 왼쪽 3D 그림(next/image, alt=""). */
    image?: ReactNode
    summary: readonly ModelSummaryLine[]
    /** 모형 구조도(custom/*-structure-diagram.tsx). */
    diagram?: ReactNode
    outcomes: readonly ModelOutcome[]
}

// 점 목록 — 강조색 점(지름 5, 글 첫 줄 가운데) + 글(15.5 → body-xl · 보조 글자색). 점은 꾸밈이라 가상 요소로 둔다.
const BulletList = ({children, className}: {children: ReactNode; className?: string}) => (
    <ul className={cn('typo-body-xl-regular text-label-foreground flex flex-col', className)}>{children}</ul>
)
const BulletItem = ({children}: {children: ReactNode}) => (
    <li className="before:bg-platform-accent relative pl-3.5 break-keep before:absolute before:top-[0.72em] before:left-0 before:size-1.25 before:rounded-full">
        {children}
    </li>
)

const PlatformModelDetailTabs = ({
    items,
    label,
    heading,
    chipsLabel,
    defaultValue,
    className,
}: {
    items: readonly PlatformModelDetail[]
    /** 탭 목록 이름(낭독기). */
    label: string
    /** 탭 위 제목(h3) — 화면에 보이지 않고 낭독기만 읽는다(섹션 h2 → 패널 h4 사이 단계를 잇는다). */
    heading?: string
    /** 키워드 태그 목록 이름(낭독기). */
    chipsLabel: string
    defaultValue?: string
    className?: string
}) => (
    <Tabs defaultValue={defaultValue ?? items[0]?.value} className={cn('flex flex-col gap-6', className)}>
        {heading ? <h3 className="sr-only">{heading}</h3> : null}
        <PlatformTabsList aria-label={label}>
            {items.map((item) => (
                <PlatformTabsTrigger key={item.value} value={item.value}>
                    {item.tabLabel}
                </PlatformTabsTrigger>
            ))}
        </PlatformTabsList>
        {items.map((item) => (
            <TabsContent
                key={item.value}
                value={item.value}
                className={cn(
                    platformCardClassName,
                    'outline-ring focus-visible:outline-ring flex flex-col p-5.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid md:p-9',
                )}
            >
                <div className="border-platform-panel-border mb-5.5 flex items-start gap-3 border-b pb-5.5 md:gap-5">
                    {item.image ? (
                        <span aria-hidden="true" className="h-13 w-15 shrink-0 md:h-20 md:w-24">
                            {item.image}
                        </span>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <h4 className="typo-title-l-bold text-foreground mb-3 break-keep">{item.title}</h4>
                        <p className="typo-body-xl-medium text-label-foreground break-keep">{item.lead}</p>
                        <ul aria-label={chipsLabel} className="mt-3.5 flex flex-wrap gap-1.5">
                            {item.chips.map((chip) => (
                                <li key={chip} className={platformTagClassName}>
                                    {chip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <BulletList className="gap-1.5">
                    {item.summary.map((line) => (
                        <BulletItem key={line.text}>
                            {line.label ? <b className="text-foreground">{line.label}</b> : null}
                            {line.label ? ' : ' : null}
                            {line.text}
                        </BulletItem>
                    ))}
                </BulletList>
                {item.diagram ? <div className="mt-7">{item.diagram}</div> : null}
                <ul className="mt-5 grid gap-3 xl:grid-cols-3 xl:gap-4">
                    {item.outcomes.map((outcome) => (
                        <li
                            key={outcome.title}
                            className={cn(platformCardClassName, 'rounded-md p-5 md:px-6 md:pt-6 md:pb-6.5')}
                        >
                            <h5 className="typo-title-l-bold text-foreground mb-3.5">{outcome.title}</h5>
                            {outcome.groups.map((group) => (
                                <div key={group.heading ?? group.items[0]} className="mt-4 first-of-type:mt-0">
                                    {group.heading ? (
                                        <p className="typo-body-xl-bold text-foreground mb-2">{group.heading}</p>
                                    ) : null}
                                    <BulletList className="gap-2">
                                        {group.items.map((text) => (
                                            <BulletItem key={text}>{text}</BulletItem>
                                        ))}
                                    </BulletList>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            </TabsContent>
        ))}
    </Tabs>
)

export {PlatformModelDetailTabs}
export type {PlatformModelDetail}
