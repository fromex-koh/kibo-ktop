import {ArrowDown, Building2, FileBadge, FileChartColumn, Gauge, GraduationCap, Landmark, Leaf} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {PlatformQuestionTabs} from '@/components/composite/platform-question-tabs'
import {PlatformAnchorScroll} from '@/components/custom/platform-anchor-scroll'
import {PlatformHubOrbit} from '@/components/custom/platform-hub-orbit'
import {
    PlatformAudiencePanels,
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformSection,
} from '@/components/custom/platform-intro-blocks'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformProcessSteps} from '@/components/custom/platform-process-steps'
import {PlatformSectionNav} from '@/components/custom/platform-section-nav'
import {PlatformServiceCards} from '@/components/custom/platform-service-cards'
import {PlatformStats} from '@/components/custom/platform-stats'
import {platformServiceIconVariants} from '@/components/theme/platform-intro.variants'
import {Button} from '@/components/ui/button'
import {
    PLATFORM_AUDIENCE,
    PLATFORM_CTA,
    PLATFORM_FLOW,
    PLATFORM_HERO,
    PLATFORM_INTRO_TITLE,
    PLATFORM_QUESTIONS,
    PLATFORM_SECTIONS,
    PLATFORM_SERVICES,
    PLATFORM_VALUE,
    platformServiceHref,
    type PlatformIntroUserType,
    type PlatformServiceKind,
} from '@/content/service/platform-intro'
import platformData from '@public/images/platform-intro/platform-data.webp'
import platformExpertise from '@public/images/platform-intro/platform-expertise.webp'
import platformOpen from '@public/images/platform-intro/platform-open.webp'

// 플랫폼 소개(오픈 플랫폼 소개) 화면 본문 — 기업 · 기관 /platform/page.tsx 가 함께 쓴다. 문구는 content/service/platform-intro.ts.
//
// 짜임(위 → 아래): 화면 제목(PageTitleBar) → 히어로(글 | 허브 궤도 그림) → 섹션 이동 탭(헤더 밑에 붙어 따라옴)
//   → 핵심 가치(카드 3 + 지표 3) → 질문으로 알아보는 K-TOP(질문 탭) → 주요 서비스(카드 4) → 이용 대상(패널 3)
//   → 이용 흐름(3단계) → 마무리 배너. 섹션 바탕은 흰색 · 옅은 회색이 번갈아 온다.
// 블록은 플랫폼 소개 5화면이 같이 쓰는 틀이다(custom/platform-intro-blocks.tsx 등, 가이드 /component-guide/platform-intro).

type PlatformIntroProps = {
    userType: PlatformIntroUserType
}

const HERO_TITLE_ID = 'platform-hero-title'
const CTA_TITLE_ID = 'platform-cta-title'
const SERVICES_ANCHOR = '#services'

// 핵심 가치 카드 그림(88 × 88 자리, 원본 256) — 꾸밈이라 읽지 않는다[5.1.1].
const VALUE_IMAGES = {
    expertise: platformExpertise,
    data: platformData,
    open: platformOpen,
} as const

const VALUE_CARDS = PLATFORM_VALUE.items.map((item) => ({
    ...item,
    image: <PlatformFeatureImage src={VALUE_IMAGES[item.id]} />,
}))

// 서비스 아이콘 — 히어로 궤도 · 서비스 카드가 같이 쓴다.
const SERVICE_ICONS: Record<PlatformServiceKind, typeof Gauge> = {
    tech: Gauge,
    patent: FileBadge,
    bigx: FileChartColumn,
    carbon: Leaf,
}

const HUB_NODES = PLATFORM_SERVICES.items.map((service) => {
    const Icon = SERVICE_ICONS[service.kind]
    return {label: service.name, service: service.kind, icon: <Icon aria-hidden="true" />}
})
const HUB_LABEL = `K-TOP을 중심으로 ${PLATFORM_SERVICES.items.map((service) => service.name).join(', ')} 서비스가 연결된 개념도`

const AUDIENCE_ICONS = {company: Building2, finance: Landmark, public: GraduationCap} as const

const AUDIENCE_PANELS = PLATFORM_AUDIENCE.items.map((item) => {
    const Icon = AUDIENCE_ICONS[item.id]
    return {
        ...item,
        icon: (
            <span className={platformServiceIconVariants()}>
                <Icon aria-hidden="true" />
            </span>
        ),
    }
})

const PlatformIntro = ({userType}: PlatformIntroProps) => {
    const serviceCards = PLATFORM_SERVICES.items.map((service, index) => {
        const Icon = SERVICE_ICONS[service.kind]
        return {
            id: service.kind,
            order: String(index + 1).padStart(2, '0'),
            name: service.name,
            description: service.description,
            service: service.kind,
            icon: <Icon aria-hidden="true" />,
            chips: service.chips,
            chipsLabel: service.chipsLabel,
            linkLabel: service.linkLabel,
            href: platformServiceHref(userType, service.segment),
        }
    })

    return (
        // --platform-header-h · --platform-section-nav-h — 섹션 탭이 잰 값으로 바뀐다. 처음 값은 PC 헤더(112) · 탭 줄(57).
        // text-pretty · break-keep — 마지막 줄에 낱말 하나만 남지 않게 · 한글 낱말 중간에서 줄이 바뀌지 않게 한다(둘 다 상속되므로 여기 한 번만 둔다).
        <main
            id="main"
            tabIndex={-1}
            className="bg-page flex-1 text-pretty break-keep [--platform-header-h:--spacing(28)] [--platform-section-nav-h:--spacing(14)]"
        >
            <div className="grid-layout gap-10 pt-10 *:col-span-full">
                <PageTitleBar
                    size="sm"
                    title={PLATFORM_INTRO_TITLE}
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${userType}/home`}>홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <span>플랫폼 소개</span>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{PLATFORM_INTRO_TITLE}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <PlatformHero
                    headingId={HERO_TITLE_ID}
                    // 글 | 궤도 그림을 1:1 로 — 1024~1279 에서 궤도 그림 칸을 넓혀 도는 칸이 히어로 끝에 붙지 않게 한다(오른쪽 여백 = 안쪽 여백).
                    className="lg:grid-cols-2"
                    eyebrow={PLATFORM_HERO.eyebrow}
                    title={
                        <>
                            {PLATFORM_HERO.title}{' '}
                            <PlatformHeroEmphasis>{PLATFORM_HERO.titleEmphasis}</PlatformHeroEmphasis>
                        </>
                    }
                    lead={
                        <p>
                            <strong className="typo-title-l-bold text-foreground mb-2 block">
                                {PLATFORM_HERO.tagline}
                            </strong>
                            {PLATFORM_HERO.description}
                        </p>
                    }
                    actions={
                        <Button asChild size="lg">
                            <a href={SERVICES_ANCHOR}>
                                {PLATFORM_HERO.actionLabel}
                                <ArrowDown aria-hidden="true" />
                            </a>
                        </Button>
                    }
                    visual={<PlatformHubOrbit nodes={HUB_NODES} label={HUB_LABEL} className="justify-self-end" />}
                />
            </div>

            <PlatformSectionNav items={PLATFORM_SECTIONS} />
            {/* 이 화면 안의 #섹션 링크(탭 · 서비스 살펴보기 버튼)를 부드럽게 스크롤한다. */}
            <PlatformAnchorScroll />

            <PlatformSection id="value" title={PLATFORM_VALUE.title}>
                <PlatformFeatureCards items={VALUE_CARDS} />
                <PlatformReveal className="mt-12">
                    <PlatformStats items={PLATFORM_VALUE.stats} label="K-TOP 데이터 기반" />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection
                id="about"
                tone="muted"
                title={PLATFORM_QUESTIONS.title}
                description={PLATFORM_QUESTIONS.description}
            >
                <PlatformReveal>
                    <PlatformQuestionTabs items={PLATFORM_QUESTIONS.items} label="K-TOP 질문 목록" />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="services" title={PLATFORM_SERVICES.title} description={PLATFORM_SERVICES.description}>
                <PlatformServiceCards items={serviceCards} />
            </PlatformSection>

            <PlatformSection
                id="audience"
                tone="muted"
                title={PLATFORM_AUDIENCE.title}
                description={PLATFORM_AUDIENCE.description}
            >
                {/* 패널 위 짧은 안내 문구 — 짧고 큰 굵은 p 는 WAVE 가 '제목 같은 문단(Possible heading)'으로 보므로 div 로 둔다.
                    제목은 섹션 h2 와 패널 h3 이 맡는다. */}
                <div className="typo-title-l-bold text-foreground mb-5">{PLATFORM_AUDIENCE.lead}</div>
                <PlatformAudiencePanels items={AUDIENCE_PANELS} />
            </PlatformSection>

            <PlatformSection id="flow" title={PLATFORM_FLOW.title} description={PLATFORM_FLOW.description}>
                <PlatformReveal>
                    <PlatformProcessSteps steps={PLATFORM_FLOW.steps} />
                </PlatformReveal>
            </PlatformSection>

            <div className="grid-layout pb-14 *:col-span-full md:pb-18 xl:pb-24">
                <PlatformReveal>
                    <PlatformCtaBanner
                        headingId={CTA_TITLE_ID}
                        title={PLATFORM_CTA.title}
                        description={PLATFORM_CTA.description}
                        actions={
                            <Button asChild size="lg">
                                <a href={SERVICES_ANCHOR}>{PLATFORM_CTA.actionLabel}</a>
                            </Button>
                        }
                    />
                </PlatformReveal>
            </div>
        </main>
    )
}

export {PlatformIntro}
export type {PlatformIntroProps}
