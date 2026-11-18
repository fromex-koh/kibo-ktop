import {ArrowRight, Award, FileText, Layers, Lock, Network, Scale, UserCheck} from 'lucide-react'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {PlatformAnchorScroll} from '@/components/custom/platform-anchor-scroll'
import {PlatformDefinitionPanel} from '@/components/custom/platform-definition-panel'
import {PlatformFlowDiagram} from '@/components/custom/platform-flow-diagram'
import {
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformSection,
} from '@/components/custom/platform-intro-blocks'
import {PlatformNotice} from '@/components/custom/platform-notice'
import {PlatformPatentGradeCard} from '@/components/custom/platform-patent-grade-card'
import {PlatformProcessSteps} from '@/components/custom/platform-process-steps'
import {PlatformReportFrame, PlatformReportItemList} from '@/components/custom/platform-report-preview'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformSectionNav} from '@/components/custom/platform-section-nav'
import {ThemeImage} from '@/components/custom/theme-image'
import {platformCardClassName} from '@/components/theme/platform-intro.variants'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Button} from '@/components/ui/button'
import type {PlatformIntroUserType} from '@/content/service/platform-intro'
import {
    PLATFORM_PATENT_CTA,
    PLATFORM_PATENT_HERO,
    PLATFORM_PATENT_PRINCIPLE,
    PLATFORM_PATENT_PROCESS,
    PLATFORM_PATENT_RESULT,
    PLATFORM_PATENT_ROUTES,
    PLATFORM_PATENT_SECTIONS,
    PLATFORM_PATENT_TITLE,
    PLATFORM_PATENT_VALUE,
    type RichText,
} from '@/content/service/platform-patent-evaluation'
import economicUseDarkIcon from '@public/images/platform-patent-evaluation/economic-use-violet-dark.webp'
import economicUseIcon from '@public/images/platform-patent-evaluation/economic-use-violet.webp'
import patentEnvironment from '@public/images/platform-patent-evaluation/patent-environment.webp'
import patentGrade from '@public/images/platform-patent-evaluation/patent-grade.webp'
import patentIntrinsic from '@public/images/platform-patent-evaluation/patent-intrinsic.webp'
import patentReport from '@public/images/platform-patent-evaluation/patent-report.webp'
import patentTradeDarkIcon from '@public/images/platform-patent-evaluation/patent-trade-violet-dark.webp'
import patentTradeIcon from '@public/images/platform-patent-evaluation/patent-trade-violet.webp'
import patentedKnowledgeDarkIcon from '@public/images/platform-patent-evaluation/patented-knowledge-violet-dark.webp'
import patentedKnowledgeIcon from '@public/images/platform-patent-evaluation/patented-knowledge-violet.webp'

// 플랫폼 소개 > 특허평가 화면 본문 — 기업 · 기관 /platform/patent-evaluation/page.tsx 가 함께 쓴다.
// 문구 · 이동 주소는 content/service/platform-patent-evaluation.ts.
//
// 짜임(위 → 아래): 화면 제목 → 히어로(글 | 특허 평가등급 카드) → 섹션 이동 탭 → 핵심 가치(카드 3 + KPAS 공식 소개 전문 펼치기)
//   → 평가 원리(흐름 도식 + 재산적 가치 정의) → 평가 결과(보고서 미리보기 | 확인 정보 · 주요평가요인, 아래 조회 안내)
//   → 평가절차(4단계) → 마무리 배너. 섹션 바탕은 흰색 · 옅은 회색이 번갈아 온다.
// 특허평가 색(보라) — 히어로 · 배너는 tone="violet", 그 밖은 <main> 의 CSS 변수(아래 main 주석)로 넘긴다.

type PlatformPatentEvaluationProps = {
    userType: PlatformIntroUserType
}

const HERO_TITLE_ID = 'platform-patent-hero-title'
const CTA_TITLE_ID = 'platform-patent-cta-title'
const PRINCIPLE_ANCHOR = '#principle'

// 강조 낱말 조각(content 의 RichText)을 글로 그린다 — isBold 조각은 <b>.
const Rich = ({parts}: {parts: RichText}) => (
    <>{parts.map((part) => (part.isBold ? <b key={part.text}>{part.text}</b> : part.text))}</>
)

// 핵심 가치 카드 그림(88 × 88 자리, 원본 256) — 꾸밈이라 읽지 않는다[5.1.1].
const VALUE_IMAGES = {
    intrinsic: patentIntrinsic,
    environment: patentEnvironment,
    grade: patentGrade,
} as const

const VALUE_CARDS = PLATFORM_PATENT_VALUE.items.map((item) => ({
    id: item.id,
    title: item.title,
    description: <Rich parts={item.description} />,
    image: <PlatformFeatureImage src={VALUE_IMAGES[item.id]} />,
}))

// 평가 원리 흐름 도식 — 칸 배지 · 항목 아이콘(lucide).
const FLOW_COLUMN_ICONS = {source: <Layers />, basis: <Scale />} as const
const FLOW_ITEM_ICONS = {intrinsic: <FileText />, extrinsic: <Network />, expert: <UserCheck />} as const

const FLOW_COLUMNS = PLATFORM_PATENT_PRINCIPLE.columns.map((column) => ({
    id: column.id,
    title: column.title,
    icon: FLOW_COLUMN_ICONS[column.id],
    items: column.items.map((item) => ({...item, icon: FLOW_ITEM_ICONS[item.id]})),
}))

// 재산적 가치 정의 아이콘 — 라이트 · 다크 그림(운영 화면 아이콘).
const DEFINITION_ICONS = {
    'patented-knowledge': {light: patentedKnowledgeIcon, dark: patentedKnowledgeDarkIcon},
    'patent-trade': {light: patentTradeIcon, dark: patentTradeDarkIcon},
    'economic-use': {light: economicUseIcon, dark: economicUseDarkIcon},
} as const

const DEFINITION_ITEMS = PLATFORM_PATENT_PRINCIPLE.definition.items.map((item) => ({
    ...item,
    icon: <ThemeImage {...DEFINITION_ICONS[item.id]} />,
}))

// 주요평가요인 — 보라(platform-accent-patent) 8% 면 · 26% 테두리, 칩은 카드 면 · 30% 테두리 · 보라 글자.
const KeyFactors = () => (
    <div className="mt-4 rounded-md border border-[color-mix(in_srgb,var(--color-platform-accent-patent)_26%,var(--color-platform-panel-border))] bg-[color-mix(in_srgb,var(--color-platform-accent-patent)_8%,var(--color-platform-panel))] px-5.5 py-5">
        <h4 className="typo-title-m-bold text-foreground mb-3">{PLATFORM_PATENT_RESULT.keyFactors.title}</h4>
        <ul className="flex flex-wrap gap-2">
            {PLATFORM_PATENT_RESULT.keyFactors.items.map((factor) => (
                <li
                    key={factor}
                    className="typo-body-xl-bold bg-platform-panel text-platform-accent-patent inline-flex h-8.5 items-center rounded-full border border-[color-mix(in_srgb,var(--color-platform-accent-patent)_30%,var(--color-platform-panel-border))] px-3.5"
                >
                    {factor}
                </li>
            ))}
        </ul>
        <p className="typo-body-l-regular text-label-foreground mt-3">{PLATFORM_PATENT_RESULT.keyFactors.note}</p>
    </div>
)

const PlatformPatentEvaluation = ({userType}: PlatformPatentEvaluationProps) => {
    const startHref = PLATFORM_PATENT_ROUTES[userType]
    const {report} = PLATFORM_PATENT_RESULT

    return (
        // --platform-header-h · --platform-section-nav-h — 섹션 탭이 잰 값으로 바뀐다. 처음 값은 PC 헤더(112) · 탭 줄(57).
        // 특허평가 보라 — --platform-card-accent(기능 카드) · --platform-tone-fill(샘플 배지) · --platform-tone-step(-foreground)
        // (절차 번호 원 · 선, 보고서 구성 번호) · --platform-flow-*(평가 원리 도식 · 정의 패널).
        // text-pretty · break-keep — 마지막 줄에 낱말 하나만 남지 않게 · 한글 낱말 중간에서 줄이 바뀌지 않게 한다(둘 다 상속되므로 여기 한 번만 둔다).
        <main
            id="main"
            tabIndex={-1}
            className="bg-page flex-1 text-pretty break-keep [--platform-card-accent:var(--color-platform-accent-patent)] [--platform-flow-accent-bright:var(--color-platform-patent-accent-bright)] [--platform-flow-accent:var(--color-platform-patent-accent)] [--platform-flow-foreground:var(--color-platform-patent-accent-foreground)] [--platform-header-h:--spacing(28)] [--platform-section-nav-h:--spacing(14)] [--platform-tone-fill:var(--color-service-patent-fill)] [--platform-tone-step-foreground:var(--color-service-hero-violet-on-emphasis)] [--platform-tone-step:var(--color-service-hero-violet-emphasis)]"
        >
            <div className="grid-layout gap-10 pt-10 *:col-span-full">
                <PageTitleBar
                    size="sm"
                    title={PLATFORM_PATENT_TITLE}
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${userType}/home`}>홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${userType}/platform`}>플랫폼 소개</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{PLATFORM_PATENT_TITLE}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <PlatformHero
                    tone="violet"
                    headingId={HERO_TITLE_ID}
                    eyebrow={PLATFORM_PATENT_HERO.eyebrow}
                    title={
                        <>
                            {PLATFORM_PATENT_HERO.title}{' '}
                            <PlatformHeroEmphasis>{PLATFORM_PATENT_HERO.titleEmphasis}</PlatformHeroEmphasis>
                        </>
                    }
                    lead={<p>{PLATFORM_PATENT_HERO.lead}</p>}
                    actions={
                        <>
                            <Button asChild variant="secondary" size="lg">
                                <a href={PRINCIPLE_ANCHOR}>{PLATFORM_PATENT_HERO.principleActionLabel}</a>
                            </Button>
                            <Button asChild size="lg">
                                <Link href={startHref}>
                                    {PLATFORM_PATENT_HERO.startActionLabel}
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </>
                    }
                    // [개발] 첫 화면 '특허평가 이용하기'와 맨 아래 배너 버튼이 같은 주소라 WAVE 'Redundant link' 알림 1건이 난다.
                    //   고객사 요청 디자인대로 둔 접근성 예외다 — 고치지 않는다(component-guide 접근성 예외사항 > WAVE > 고객사 요청).
                    note={
                        <>
                            <Lock aria-hidden="true" className="size-icon-xs" />
                            {PLATFORM_PATENT_HERO.loginNote}
                        </>
                    }
                    visual={<PlatformPatentGradeCard {...PLATFORM_PATENT_HERO.gradeCard} />}
                />
            </div>

            <PlatformSectionNav items={PLATFORM_PATENT_SECTIONS} />
            {/* 이 화면 안의 #섹션 링크(탭 · KPAS 알아보기 버튼)를 부드럽게 스크롤한다. */}
            <PlatformAnchorScroll />

            <PlatformSection id="value" title={PLATFORM_PATENT_VALUE.title}>
                <PlatformFeatureCards items={VALUE_CARDS} />
                <PlatformReveal className="mt-8">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="kpas" className={`${platformCardClassName} px-6 py-0`}>
                            <AccordionTrigger className="min-h-12 items-center py-5">
                                {/* 트리거 기본 타이포(medium)와 겹치지 않게 글만 굵은 타이포로 감싼다(PB-08). */}
                                <span className="typo-title-m-bold">{PLATFORM_PATENT_VALUE.fullText.title}</span>
                            </AccordionTrigger>
                            <AccordionContent className="mt-0 border-t-0 pt-0 pb-5.5">
                                <ul className="flex flex-col gap-1.5">
                                    {PLATFORM_PATENT_VALUE.fullText.items.map((line) => (
                                        <li
                                            key={line}
                                            className="before:bg-foreground-subtle relative pl-3.5 break-keep before:absolute before:top-[0.72em] before:left-0 before:size-1.25 before:rounded-full"
                                        >
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="principle" tone="muted" title={PLATFORM_PATENT_PRINCIPLE.title}>
                <PlatformFlowDiagram
                    columns={FLOW_COLUMNS}
                    result={{...PLATFORM_PATENT_PRINCIPLE.result, icon: <Award />}}
                    note={PLATFORM_PATENT_PRINCIPLE.note}
                    label={PLATFORM_PATENT_PRINCIPLE.flowLabel}
                />
                <PlatformReveal className="mt-12">
                    <PlatformDefinitionPanel
                        title={PLATFORM_PATENT_PRINCIPLE.definition.title}
                        items={DEFINITION_ITEMS}
                        conclusion={<Rich parts={PLATFORM_PATENT_PRINCIPLE.definition.conclusion} />}
                    />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="result" title={PLATFORM_PATENT_RESULT.title}>
                <PlatformReveal className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <PlatformReportFrame
                        label={report.label}
                        image={patentReport}
                        alt={report.alt}
                        description={report.description}
                        sampleBadge={report.sampleBadge}
                        scrollCaption={report.scrollCaption}
                    />
                    <div className="flex flex-col gap-4">
                        <h3 className="typo-title-l-bold text-foreground">{PLATFORM_PATENT_RESULT.itemsTitle}</h3>
                        <PlatformReportItemList items={PLATFORM_PATENT_RESULT.items} />
                        <KeyFactors />
                    </div>
                </PlatformReveal>
                <PlatformReveal className="mt-8">
                    <PlatformNotice
                        items={PLATFORM_PATENT_RESULT.notices.map((parts) => (
                            <Rich key={parts.map((part) => part.text).join('')} parts={parts} />
                        ))}
                    />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="process" tone="muted" title={PLATFORM_PATENT_PROCESS.title}>
                <PlatformProcessSteps steps={PLATFORM_PATENT_PROCESS.steps} />
            </PlatformSection>

            <div className="grid-layout pt-14 pb-14 *:col-span-full md:pt-18 md:pb-18 xl:pt-24 xl:pb-24">
                <PlatformReveal>
                    <PlatformCtaBanner
                        tone="violet"
                        headingId={CTA_TITLE_ID}
                        title={PLATFORM_PATENT_CTA.title}
                        description={PLATFORM_PATENT_CTA.description}
                        actions={
                            <Button asChild size="lg">
                                <Link href={startHref}>{PLATFORM_PATENT_CTA.actionLabel}</Link>
                            </Button>
                        }
                    />
                </PlatformReveal>
            </div>
        </main>
    )
}

export {PlatformPatentEvaluation}
export type {PlatformPatentEvaluationProps}
