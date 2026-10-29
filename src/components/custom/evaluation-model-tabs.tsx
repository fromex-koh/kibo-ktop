'use client'

import {useEffect, useRef, useState, type ReactElement} from 'react'
import Image, {type StaticImageData} from 'next/image'
import {Tabs as TabsPrimitive} from 'radix-ui'
import businessHandshake from '@public/images/platform-technology-evaluation/business-handshake.webp'
import officeCityView from '@public/images/platform-technology-evaluation/office-city-view.webp'
import reportChartsDesk from '@public/images/platform-technology-evaluation/report-charts-desk.webp'
import {RollingAccordion, RollingAccordionBody} from '@/components/composite/rolling-accordion'
import {
    EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
    EVALUATION_MODEL_TONE_CLASS,
    EvaluationModelCardContent,
} from '@/components/custom/evaluation-model-card'
import {InvestmentModelStructureDiagram} from '@/components/custom/investment-model-structure-diagram'
import {KtrsFmStructureDiagram} from '@/components/custom/ktrs-fm-structure-diagram'
import {ListMarker} from '@/components/custom/list-marker'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {TechIndexStructureDiagram} from '@/components/custom/tech-index-structure-diagram'
import {EVALUATION_MODELS, type EvaluationModel} from '@/content/service/evaluation-model-selection'
import {
    MODEL_DETAIL_SECTION_KEYS,
    MODEL_DETAIL_SECTION_TITLES,
    MODEL_DETAILS,
    PLATFORM_TECHNOLOGY_EVALUATION,
    type ModelSectionKey,
} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// EvaluationModelTabs — 플랫폼 소개 > 기술평가. 평가모형 카드 3장이 탭이고, 고르면 아래에 그 모형 소개가 나온다.
//   소개 = 소개 목록 · 모형 구조도(MODEL_DIAGRAMS) · 결과정보 · 기대효과 · 활용분야(RollingAccordion)
// 문구는 content/service/platform-technology-evaluation.ts, 카드 내용은 evaluation-model-selection.ts(평가모형 선택과 공용).
//
// 알아둘 점
//   · 처음에는 아무 카드도 고르지 않는다(value '') — 카드를 골라야 소개가 나타난다.
//   · 카드 모양이 ui/tabs 와 전혀 달라 Radix 원형(TabsPrimitive)에 바로 얹는다. 탭 접근성은 Radix 가 맡는다[8.2.1].
//   · 모형을 추가하면 MODEL_DIAGRAMS 에 구조도를 등록한다.
//   · 열 때 카드가 차례로 떠오르고, 고를 때 소개가 떠오른다. 동작 줄이기면 없다[6.3.1].

// 아래 묶음 항목별 사진 — 세 모형이 같은 사진을 쓴다(시안). 원본 2070 × 1284 = PC 표시 크기(690 × 428)의 3배.
// 표시 폭: PC 690 · 태블릿 792(md 그리드 콘텐츠 폭) · 모바일 화면 폭 − 좌우 여백 32. 화면 아래쪽이라 미리 받지 않는다(lazy).
const SECTION_PHOTOS: Record<ModelSectionKey, StaticImageData> = {
    results: reportChartsDesk,
    effect: businessHandshake,
    usage: officeCityView,
}
const SECTION_PHOTO_SIZES = '(min-width: 1280px) 690px, (min-width: 768px) 792px, calc(100vw - 32px)'

// 카드 = 탭 단추. 선택(data-state=active) · hover · 포커스 때 그라데이션 테두리가 비친다.
const triggerClassName = cn(
    EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
    'w-full cursor-pointer text-left hover:bg-linear-to-br focus-visible:bg-linear-to-br focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid data-[state=active]:bg-linear-to-br',
    'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-12 motion-safe:ease-roll motion-safe:fill-mode-both motion-safe:duration-900',
)
// 카드가 차례로 떠오르는 지연 — 카드 순서대로(클래스는 Tailwind 가 읽도록 리터럴로 둔다).
const TRIGGER_DELAY_CLASS = ['motion-safe:delay-300', 'motion-safe:delay-400', 'motion-safe:delay-500'] as const

// 모형 구조도 — 모형마다 시안 구조도를 글 · 도형으로 옮긴 컴포넌트다(덩어리마다 안에서 ScrollReveal 로 떠오름).
const MODEL_DIAGRAMS: Record<EvaluationModel['id'], () => ReactElement> = {
    'ktrs-fm': KtrsFmStructureDiagram,
    'tech-index': TechIndexStructureDiagram,
    'investment-model': InvestmentModelStructureDiagram,
}

// 소개 목록 — 점(ListMarker) + 글. 점 칸 높이는 글의 한 줄 높이(h-lh)에 맞춘다.
const BulletItem = ({children}: {children: string}) => (
    <li className="flex">
        <ListMarker className="h-lh" />
        <span className="break-keep">{children}</span>
    </li>
)

const ModelDetailPanel = ({modelId}: {modelId: EvaluationModel['id']}) => {
    const detail = MODEL_DETAILS[modelId]
    const Diagram = MODEL_DIAGRAMS[modelId]

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2">
                <h3 className="typo-h2-bold text-foreground break-keep">{detail.title}</h3>
                <ul className="typo-title-l-regular text-label-foreground flex flex-col gap-2">
                    {detail.summary.map((line) => (
                        <BulletItem key={line}>{line}</BulletItem>
                    ))}
                </ul>
            </div>
            <div className="mt-10">
                <Diagram />
            </div>
            {/* 결과정보 · 기대효과 · 활용분야 — 일정 시간마다 다음 항목이 열리고 옆 사진도 바뀐다(RollingAccordion). */}
            <ScrollReveal className="mt-15 xl:mt-20">
                <RollingAccordion
                    items={MODEL_DETAIL_SECTION_KEYS.map((key) => ({
                        value: key,
                        title: MODEL_DETAIL_SECTION_TITLES[key],
                        content: <RollingAccordionBody groups={detail.sections[key]} />,
                        image: <Image src={SECTION_PHOTOS[key]} alt="" sizes={SECTION_PHOTO_SIZES} />,
                    }))}
                />
            </ScrollReveal>
        </div>
    )
}

// 카드를 누르면(클릭 · Enter · Space) 모형 소개의 맨 위로 스크롤한다 — 카드가 화면을 많이 차지해(모바일은 세로 3장)
// 고른 내용이 화면 아래에 가려지기 때문이다. 이미 고른 카드를 다시 눌러도 내용으로 간다.
// 소개는 고른 뒤에야 그려지므로(처음엔 자리가 비어 숨겨져 있음) 누른 표시만 해 두고, 소개가 그려진 다음에 스크롤한다.
// 좌우 화살표로 탭을 옮길 때는 스크롤하지 않는다 — 화살표마다 화면이 움직이면 포커스한 카드가 화면 밖으로 사라진다[6.1.2].
// 포커스는 카드에 그대로 둔다(Tab 을 누르면 이어서 내용으로 들어간다). 동작 줄이기 설정이면 바로 이동한다[6.3.1].
// 멈추는 위치는 사이트 헤더(sticky top-0) 아래 24 — 헤더 높이 모바일 56 · 태블릿 100 · PC 112 에 24 를 더한 scroll-mt.
const EvaluationModelTabs = () => {
    const panelAreaRef = useRef<HTMLDivElement>(null)
    const isScrollPendingRef = useRef(false)
    // 고른 모형 — 처음엔 비어 있다(아무 카드도 고르지 않음).
    const [selectedModelId, setSelectedModelId] = useState('')
    // 같은 카드를 다시 눌러도 스크롤하도록 누를 때마다 센다.
    const [clickCount, setClickCount] = useState(0)

    useEffect(() => {
        if (!isScrollPendingRef.current) return
        isScrollPendingRef.current = false
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        panelAreaRef.current?.scrollIntoView({block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }, [selectedModelId, clickCount])

    const handleCardClick = () => {
        isScrollPendingRef.current = true
        setClickCount((count) => count + 1)
    }

    return (
        <TabsPrimitive.Root
            value={selectedModelId}
            onValueChange={setSelectedModelId}
            className="flex flex-col gap-15 xl:gap-20"
        >
            <TabsPrimitive.List
                aria-label={PLATFORM_TECHNOLOGY_EVALUATION.tabListLabel}
                className="grid gap-4 md:grid-cols-3 md:gap-6"
            >
                {EVALUATION_MODELS.map((model, index) => {
                    const titleId = `evaluation-model-tab-${model.id}-title`

                    return (
                        // 탭 이름은 모형 제목만 읽는다 — 약칭 · 설명까지 한 줄로 길게 읽히지 않게 한다.
                        <TabsPrimitive.Trigger
                            key={model.id}
                            value={model.id}
                            aria-labelledby={titleId}
                            onClick={handleCardClick}
                            className={cn(
                                triggerClassName,
                                TRIGGER_DELAY_CLASS[index],
                                EVALUATION_MODEL_TONE_CLASS[model.tone].border,
                            )}
                        >
                            <EvaluationModelCardContent model={model} titleId={titleId} isArrowDesktopOnly />
                        </TabsPrimitive.Trigger>
                    )
                })}
            </TabsPrimitive.List>
            {/* 모형 소개 자리 — 어느 모형이든 같은 자리에서 시작하므로 이 상자 맨 위로 스크롤한다.
                아무것도 고르지 않았으면 숨긴다(카드 아래 빈 간격이 생기지 않게) — 고르지 않은 탭 내용도 빈 칸(hidden)으로 남으므로
                열린 칸(data-state=active)이 있는지로 가른다. */}
            <div
                ref={panelAreaRef}
                className="scroll-mt-20 md:scroll-mt-31 xl:scroll-mt-34 [&:not(:has([data-state=active]))]:hidden"
            >
                {EVALUATION_MODELS.map((model) => (
                    <TabsPrimitive.Content
                        key={model.id}
                        value={model.id}
                        className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-8 motion-safe:ease-roll outline-none motion-safe:duration-700"
                    >
                        <ModelDetailPanel modelId={model.id} />
                    </TabsPrimitive.Content>
                ))}
            </div>
        </TabsPrimitive.Root>
    )
}

export {EvaluationModelTabs}
