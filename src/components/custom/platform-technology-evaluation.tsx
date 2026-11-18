import type {ReactElement} from 'react'
import {ChartNoAxesCombined, Coins, Gauge, Lock} from 'lucide-react'
import Image from 'next/image'
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
import {InvestmentModelStructureDiagram} from '@/components/custom/investment-model-structure-diagram'
import {KtrsFmStructureDiagram} from '@/components/custom/ktrs-fm-structure-diagram'
import {PlatformAnchorScroll} from '@/components/custom/platform-anchor-scroll'
import {PlatformCompareTable} from '@/components/custom/platform-compare-table'
import {PlatformHeroCardStack} from '@/components/custom/platform-hero-card-stack'
import {
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformSection,
} from '@/components/custom/platform-intro-blocks'
import {PlatformModelDetailTabs} from '@/components/custom/platform-model-detail-tabs'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformProcessSteps} from '@/components/custom/platform-process-steps'
import {PlatformReportPreview} from '@/components/custom/platform-report-preview'
import {PlatformSectionNav} from '@/components/custom/platform-section-nav'
import {TechIndexStructureDiagram} from '@/components/custom/tech-index-structure-diagram'
import {Button} from '@/components/ui/button'
import {EVALUATION_MODELS} from '@/content/service/evaluation-model-selection'
import type {PlatformIntroUserType} from '@/content/service/platform-intro'
import {
    MODEL_DETAILS,
    PLATFORM_TECH_COMPARE,
    PLATFORM_TECH_CTA,
    PLATFORM_TECH_FEATURES,
    PLATFORM_TECH_HERO,
    PLATFORM_TECH_MODELS,
    PLATFORM_TECH_PROCESS,
    PLATFORM_TECH_REPORT,
    PLATFORM_TECH_ROUTES,
    PLATFORM_TECH_SECTIONS,
    PLATFORM_TECH_TITLE,
    type PlatformTechModelId,
} from '@/content/service/platform-technology-evaluation'
import buildingCoins from '@public/images/option-card/building-coins.webp'
import reportInvestmentDeep from '@public/images/platform-technology-evaluation/report-investment-deep.webp'
import reportInvestmentGeneral from '@public/images/platform-technology-evaluation/report-investment-general.webp'
import reportKtrsFmDeep from '@public/images/platform-technology-evaluation/report-ktrs-fm-deep.webp'
import reportKtrsFmGeneral from '@public/images/platform-technology-evaluation/report-ktrs-fm-general.webp'
import reportTechIndexDeep from '@public/images/platform-technology-evaluation/report-tech-index-deep.webp'
import reportTechIndexGeneral from '@public/images/platform-technology-evaluation/report-tech-index-general.webp'
import rocketGrowth from '@public/images/option-card/rocket-growth.webp'
import speedGauge from '@public/images/option-card/speed-gauge.webp'
import techCapability from '@public/images/platform-technology-evaluation/tech-capability.webp'
import techCommercialization from '@public/images/platform-technology-evaluation/tech-commercialization.webp'
import techModels from '@public/images/platform-technology-evaluation/tech-models.webp'

// 플랫폼 소개 > 기술평가 화면 본문 — 기업 · 기관 /platform/technology-evaluation/page.tsx 가 함께 쓴다.
// 문구 · 이동 주소는 content/service/platform-technology-evaluation.ts.
//
// 짜임(위 → 아래): 화면 제목 → 히어로(글 | 모형 카드 3장) → 섹션 이동 탭 → 핵심 특징(카드 3) → 평가모형(모형 상세 탭)
//   → 모형 비교(표) → 평가 결과(보고서 미리보기) → 이용 절차(4단계) → 마무리 배너. 섹션 바탕은 흰색 · 옅은 회색이 번갈아 온다.
// 기업 · 기관 차이 — '기술평가 시작하기' 이동, 마무리 배너 안내, 모형별 신청 주소.
// 블록은 플랫폼 소개 5화면이 같이 쓰는 틀이다(가이드 /component-guide/platform-intro).

type PlatformTechnologyEvaluationProps = {
    userType: PlatformIntroUserType
}

const HERO_TITLE_ID = 'platform-tech-hero-title'
const CTA_TITLE_ID = 'platform-tech-cta-title'
const MODELS_ANCHOR = '#models'

// 히어로 카드 아이콘 — 모형 순서.
const HERO_ICONS: Record<PlatformTechModelId, typeof Gauge> = {
    'ktrs-fm': Gauge,
    'tech-index': ChartNoAxesCombined,
    'investment-model': Coins,
}

const HERO_CARDS = PLATFORM_TECH_HERO.cards.map((card) => {
    const Icon = HERO_ICONS[card.id]
    return {...card, icon: <Icon aria-hidden="true" />}
})

// 핵심 특징 카드 그림(88 × 88 자리, 원본 256) — 꾸밈이라 읽지 않는다[5.1.1].
const FEATURE_IMAGES = {
    capability: techCapability,
    commercialization: techCommercialization,
    models: techModels,
} as const

const FEATURE_CARDS = PLATFORM_TECH_FEATURES.items.map((item) => ({
    ...item,
    image: <PlatformFeatureImage src={FEATURE_IMAGES[item.id]} />,
}))

// 모형 그림(3D) · 구조도 — 모형 상세 탭 머리 · 비교표 머리 칸이 같이 쓴다.
const MODEL_IMAGES = {
    'ktrs-fm': speedGauge,
    'tech-index': rocketGrowth,
    'investment-model': buildingCoins,
} as const

const MODEL_DIAGRAMS: Record<PlatformTechModelId, () => ReactElement> = {
    'ktrs-fm': KtrsFmStructureDiagram,
    'tech-index': TechIndexStructureDiagram,
    'investment-model': InvestmentModelStructureDiagram,
}

const ModelImage = ({modelId, sizes}: {modelId: PlatformTechModelId; sizes: string}) => (
    <Image src={MODEL_IMAGES[modelId]} alt="" sizes={sizes} className="size-full object-contain object-left-top" />
)

const MODEL_DETAIL_ITEMS = EVALUATION_MODELS.map((model) => {
    const detail = MODEL_DETAILS[model.id]
    const Diagram = MODEL_DIAGRAMS[model.id]
    return {
        value: model.id,
        ...detail,
        image: <ModelImage modelId={model.id} sizes="96px" />,
        diagram: <Diagram />,
    }
})

// 보고서 화면 캡처 — 모형 × 유형(일반 · 심층).
const REPORT_IMAGES = {
    'ktrs-fm': {general: reportKtrsFmGeneral, deep: reportKtrsFmDeep},
    'tech-index': {general: reportTechIndexGeneral, deep: reportTechIndexDeep},
    'investment-model': {general: reportInvestmentGeneral, deep: reportInvestmentDeep},
} as const

const REPORT_MODELS = EVALUATION_MODELS.map((model) => {
    const report = PLATFORM_TECH_REPORT.models[model.id]
    return {
        value: model.id,
        name: report.name,
        images: REPORT_IMAGES[model.id],
        // 심층 = 일반 목록 + 심층 항목.
        items: {general: report.general, deep: [...report.general, ...report.deep]},
    }
})

const PlatformTechnologyEvaluation = ({userType}: PlatformTechnologyEvaluationProps) => {
    const routes = PLATFORM_TECH_ROUTES[userType]
    // 시작 링크 — 옆의 '평가모형 알아보기'(#models)와 다른 곳으로 가야 같은 링크가 겹치지 않는다(WAVE Redundant link).
    const startAction = (label: string) => <Link href={routes.start}>{label}</Link>

    const compareRows = PLATFORM_TECH_COMPARE.rows.map((row) => {
        const tone = EVALUATION_MODELS.find((model) => model.id === row.modelId)?.tone ?? 'blue'
        return {
            ...row,
            tone,
            image: <ModelImage modelId={row.modelId} sizes="52px" />,
            href: routes.models[row.modelId],
        }
    })

    return (
        // --platform-header-h · --platform-section-nav-h — 섹션 탭이 잰 값으로 바뀐다. 처음 값은 PC 헤더(112) · 탭 줄(57).
        // --platform-card-accent — 기능 카드 강조색(다크 밝은 파랑, 시안 --pf-acc-tech). --platform-tone-fill — 기술평가 서비스 채움색(샘플 배지 · 비교표 머리 줄). --platform-tone-step(-foreground) — 이용 절차
        // 번호 원 · 흐르는 선 색. 히어로 · 배너 색은 tone="teal".
        // text-pretty · break-keep — 마지막 줄에 낱말 하나만 남지 않게 · 한글 낱말 중간에서 줄이 바뀌지 않게 한다(둘 다 상속되므로 여기 한 번만 둔다).
        <main
            id="main"
            tabIndex={-1}
            className="bg-page flex-1 text-pretty break-keep [--platform-card-accent:var(--color-platform-accent-foreground)] [--platform-header-h:--spacing(28)] [--platform-section-nav-h:--spacing(14)] [--platform-tone-fill:var(--color-service-tech-fill)] [--platform-tone-step-foreground:var(--color-service-hero-teal-on-emphasis)] [--platform-tone-step:var(--color-service-hero-teal-emphasis)]"
        >
            <div className="grid-layout gap-10 pt-10 *:col-span-full">
                <PageTitleBar
                    size="sm"
                    title={PLATFORM_TECH_TITLE}
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
                                    <BreadcrumbPage>{PLATFORM_TECH_TITLE}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <PlatformHero
                    tone="teal"
                    headingId={HERO_TITLE_ID}
                    eyebrow={PLATFORM_TECH_HERO.eyebrow}
                    title={
                        <>
                            {PLATFORM_TECH_HERO.title}{' '}
                            <PlatformHeroEmphasis>{PLATFORM_TECH_HERO.titleEmphasis}</PlatformHeroEmphasis>
                        </>
                    }
                    lead={<p>{PLATFORM_TECH_HERO.lead}</p>}
                    actions={
                        <>
                            <Button asChild variant="secondary" size="lg">
                                <a href={MODELS_ANCHOR}>{PLATFORM_TECH_HERO.modelsActionLabel}</a>
                            </Button>
                            <Button asChild size="lg">
                                {startAction(PLATFORM_TECH_HERO.startActionLabel)}
                            </Button>
                        </>
                    }
                    note={
                        <>
                            <Lock aria-hidden="true" className="size-icon-xs" />
                            {PLATFORM_TECH_HERO.loginNote}
                        </>
                    }
                    visual={<PlatformHeroCardStack items={HERO_CARDS} label={PLATFORM_TECH_HERO.cardsLabel} />}
                />
            </div>

            <PlatformSectionNav items={PLATFORM_TECH_SECTIONS} />
            {/* 이 화면 안의 #섹션 링크(탭 · 평가모형 알아보기 버튼)를 부드럽게 스크롤한다. */}
            <PlatformAnchorScroll />

            <PlatformSection id="features" title={PLATFORM_TECH_FEATURES.title}>
                <PlatformFeatureCards items={FEATURE_CARDS} />
            </PlatformSection>

            <PlatformSection
                id="models"
                tone="muted"
                title={PLATFORM_TECH_MODELS.title}
                description={PLATFORM_TECH_MODELS.description}
            >
                <PlatformReveal>
                    <PlatformModelDetailTabs
                        items={MODEL_DETAIL_ITEMS}
                        label={PLATFORM_TECH_MODELS.tabListLabel}
                        heading={PLATFORM_TECH_MODELS.tabsHeading}
                        chipsLabel={PLATFORM_TECH_MODELS.chipsLabel}
                    />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="compare" title={PLATFORM_TECH_COMPARE.title}>
                <PlatformReveal>
                    <PlatformCompareTable
                        rows={compareRows}
                        columns={PLATFORM_TECH_COMPARE.columns}
                        caption={PLATFORM_TECH_COMPARE.caption}
                    />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection
                id="report"
                tone="muted"
                title={PLATFORM_TECH_REPORT.title}
                description={PLATFORM_TECH_REPORT.description}
            >
                <PlatformReveal>
                    <PlatformReportPreview
                        models={REPORT_MODELS}
                        types={PLATFORM_TECH_REPORT.types}
                        modelListLabel={PLATFORM_TECH_REPORT.modelListLabel}
                        typeLabel={PLATFORM_TECH_REPORT.typeLabel}
                        sampleBadge={PLATFORM_TECH_REPORT.sampleBadge}
                        scrollCaption={PLATFORM_TECH_REPORT.scrollCaption}
                        sampleNote={PLATFORM_TECH_REPORT.sampleNote}
                    />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="process" title={PLATFORM_TECH_PROCESS.title}>
                <PlatformReveal>
                    <PlatformProcessSteps steps={PLATFORM_TECH_PROCESS.steps} />
                </PlatformReveal>
            </PlatformSection>

            <div className="grid-layout pb-14 *:col-span-full md:pb-18 xl:pb-24">
                <PlatformReveal>
                    <PlatformCtaBanner
                        tone="teal"
                        headingId={CTA_TITLE_ID}
                        title={PLATFORM_TECH_CTA.title}
                        description={PLATFORM_TECH_CTA.description[userType]}
                        actions={
                            <Button asChild size="lg">
                                {startAction(PLATFORM_TECH_CTA.actionLabel)}
                            </Button>
                        }
                    />
                </PlatformReveal>
            </div>
        </main>
    )
}

export {PlatformTechnologyEvaluation}
export type {PlatformTechnologyEvaluationProps}
