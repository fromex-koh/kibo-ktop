import {
    Building2,
    ClipboardCheck,
    ExternalLink,
    Factory,
    FileText,
    Globe,
    Landmark,
    Leaf,
    Search,
    UserCheck,
} from 'lucide-react'
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
import {PlatformExternalLinkButton} from '@/components/custom/platform-external-link-button'
import {
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformIconPanels,
    PlatformIconTiles,
    PlatformRuleList,
    PlatformSection,
    PlatformSectionHeading,
} from '@/components/custom/platform-intro-blocks'
import {PlatformProcessSteps} from '@/components/custom/platform-process-steps'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformSectionNav} from '@/components/custom/platform-section-nav'
import {PlatformServiceHeroCards} from '@/components/custom/platform-service-hero-cards'
import {
    PlatformServicePanel,
    PlatformServiceSwitchProvider,
    PlatformServiceSwitchTabs,
} from '@/components/custom/platform-service-switch'
import {ThemeImage} from '@/components/custom/theme-image'
import type {PlatformIntroUserType} from '@/content/service/platform-intro'
import {
    PLATFORM_CARBON_AUDIENCE,
    PLATFORM_CARBON_CTA,
    PLATFORM_CARBON_HERO,
    PLATFORM_CARBON_MOVE_DIALOG,
    PLATFORM_CARBON_SECTIONS,
    PLATFORM_CARBON_SERVICES,
    PLATFORM_CARBON_SWITCH,
    PLATFORM_CARBON_TITLE,
    type CarbonServiceKey,
} from '@/content/service/platform-carbon-neutrality'
import clipboardCheckChart from '@public/images/option-card/clipboard-check-chart.webp'
import emissionDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/emission-diagnosis-dark.webp'
import emissionDiagnosisIcon from '@public/images/platform-carbon-neutrality/emission-diagnosis.webp'
import expertEvaluationDarkIcon from '@public/images/platform-carbon-neutrality/expert-evaluation-dark.webp'
import expertEvaluationIcon from '@public/images/platform-carbon-neutrality/expert-evaluation.webp'
import heroLeadingSme from '@public/images/platform-carbon-neutrality/hero-leading-sme.webp'
import heroPublicUse from '@public/images/platform-carbon-neutrality/hero-public-use.webp'
import heroSmeUse from '@public/images/platform-carbon-neutrality/hero-sme-use.webp'
import heroTaxonomy from '@public/images/platform-carbon-neutrality/hero-taxonomy.webp'
import keywordSearchDarkIcon from '@public/images/platform-carbon-neutrality/keyword-search-dark.webp'
import keywordSearchIcon from '@public/images/platform-carbon-neutrality/keyword-search.webp'
import levelDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/level-diagnosis-dark.webp'
import levelDiagnosisIcon from '@public/images/platform-carbon-neutrality/level-diagnosis.webp'
import reductionPlanDarkIcon from '@public/images/platform-carbon-neutrality/reduction-plan-dark.webp'
import reductionPlanIcon from '@public/images/platform-carbon-neutrality/reduction-plan.webp'
import selfDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/self-diagnosis-dark.webp'
import selfDiagnosisIcon from '@public/images/platform-carbon-neutrality/self-diagnosis.webp'

// 플랫폼 소개 > 탄소중립 화면 본문 — 기업 · 기관 /platform/carbon-neutrality/page.tsx 가 함께 쓴다.
// 문구 · 이동 주소는 content/service/platform-carbon-neutrality.ts.
//
// 짜임(위 → 아래): 화면 제목 → 히어로(글 | 서비스 카드 2장) → 서비스 토글 + 섹션 탭(한 줄 고정 바, 1024 아래는 두 단)
//   → 서비스 소개(카드 3) → 주요 기능(아이콘 패널 3) → 이용 절차 ← 이 셋은 토글로 고른 서비스의 패널만 보인다
//   → 이용 대상(공통 6) → 마무리 배너(회색 띠 위, 진단 시작하기 두 개). 섹션 바탕은 흰색 · 옅은 회색이 번갈아 온다.
// 외부 탄소중립 플랫폼으로 가는 버튼은 모두 이동 확인 모달을 거친다(PlatformExternalLinkButton).
// 탄소중립 색(초록) — 히어로 · 배너는 tone="green", 그 밖은 <main> 의 CSS 변수(아래 main 주석)로 넘긴다.

type PlatformCarbonNeutralityProps = {
    userType: PlatformIntroUserType
}

const HERO_TITLE_ID = 'platform-carbon-hero-title'
const CTA_TITLE_ID = 'platform-carbon-cta-title'
const SERVICE_KEYS: readonly CarbonServiceKey[] = ['leading-sme', 'taxonomy']
// 서비스별 패널을 둔 섹션 — 패널 id 는 `${섹션}-${서비스}` (토글의 aria-controls).
const SERVICE_PANEL_KEYS = ['intro', 'features', 'process'] as const

// 히어로 카드 · 서비스 소개 카드 그림 · 주요 기능 아이콘 · 이용 절차(K-택소노미) · 이용 대상 아이콘 — 모두 꾸밈.
const HERO_CARD_ICONS = {'leading-sme': <Factory />, taxonomy: <Leaf />} as const
const INTRO_IMAGES = {
    'leading-sme': {service: heroLeadingSme, target: heroSmeUse, difference: clipboardCheckChart},
    taxonomy: {service: heroTaxonomy, target: heroPublicUse, difference: clipboardCheckChart},
} as const
const FEATURE_ICONS = {
    'emission-diagnosis': {light: emissionDiagnosisIcon, dark: emissionDiagnosisDarkIcon},
    'reduction-plan': {light: reductionPlanIcon, dark: reductionPlanDarkIcon},
    'level-diagnosis': {light: levelDiagnosisIcon, dark: levelDiagnosisDarkIcon},
    'keyword-search': {light: keywordSearchIcon, dark: keywordSearchDarkIcon},
    'self-diagnosis': {light: selfDiagnosisIcon, dark: selfDiagnosisDarkIcon},
    'expert-evaluation': {light: expertEvaluationIcon, dark: expertEvaluationDarkIcon},
} as const
const RULE_ICONS = {
    'keyword-search': <Search />,
    'self-diagnosis': <ClipboardCheck />,
    'expert-evaluation': <UserCheck />,
}
const AUDIENCE_ICONS = {
    'green-finance': <Building2 />,
    'financial-institution': <Landmark />,
    cbam: <Globe />,
    'supply-chain': <Factory />,
    esg: <FileText />,
    reviewer: <UserCheck />,
} as const

const HERO_CARDS = PLATFORM_CARBON_HERO.cards.map((card) => ({...card, icon: HERO_CARD_ICONS[card.key]}))
const AUDIENCE_TILES = PLATFORM_CARBON_AUDIENCE.items.map((item) => ({...item, icon: AUDIENCE_ICONS[item.id]}))

// 서비스 소개 카드 — 차별점 카드는 설명 대신 점 목록(점 = 탄소중립 아이콘 색).
const introCards = (service: CarbonServiceKey) =>
    PLATFORM_CARBON_SERVICES[service].intro.cards.map((card) => ({
        id: card.id,
        title: card.title,
        image: <PlatformFeatureImage src={INTRO_IMAGES[service][card.id]} />,
        description:
            'bullets' in card ? (
                <ul className="flex flex-col gap-1.5">
                    {card.bullets.map((bullet) => (
                        <li
                            key={bullet}
                            className="before:bg-platform-carbon-accent relative pl-3.5 before:absolute before:top-[0.72em] before:left-0 before:size-1.25 before:rounded-full"
                        >
                            {bullet}
                        </li>
                    ))}
                </ul>
            ) : (
                card.description
            ),
    }))

const featurePanels = (service: CarbonServiceKey) =>
    PLATFORM_CARBON_SERVICES[service].features.items.map((item) => ({
        ...item,
        icon: <ThemeImage {...FEATURE_ICONS[item.id]} />,
    }))

const PlatformCarbonNeutrality = ({userType}: PlatformCarbonNeutralityProps) => {
    const taxonomyProcess = PLATFORM_CARBON_SERVICES.taxonomy.process
    return (
        // --platform-header-h · --platform-section-nav-h — 섹션 탭이 잰 값으로 바뀐다(토글이 붙어 1024 아래는 두 단이라 더 높다).
        // 탄소중립 초록 — --platform-card-accent(서비스 소개 카드) · --platform-tone-fill(주요 기능 · 이용 대상 막대)
        // · --platform-tone-step(-foreground)(절차 번호 원 · 선) · --platform-icon-surface · --platform-icon-color(아이콘 칸 · 태그)
        // · --platform-switch-accent · --platform-switch-on-accent(서비스 토글의 고른 칸).
        // text-pretty · break-keep — 마지막 줄에 낱말 하나만 남지 않게 · 한글 낱말 중간에서 줄이 바뀌지 않게 한다(둘 다 상속되므로 여기 한 번만 둔다).
        <main
            id="main"
            tabIndex={-1}
            className="bg-page flex-1 text-pretty break-keep [--platform-card-accent:var(--color-platform-carbon-accent)] [--platform-header-h:--spacing(28)] [--platform-icon-color:var(--color-platform-carbon-accent)] [--platform-icon-surface:var(--color-platform-accent-carbon-surface)] [--platform-section-nav-h:--spacing(14)] [--platform-switch-accent:var(--color-platform-carbon-accent)] [--platform-switch-on-accent:var(--color-platform-carbon-on-accent)] [--platform-tone-fill:var(--color-service-carbon-fill)] [--platform-tone-step-foreground:var(--color-service-hero-green-on-emphasis)] [--platform-tone-step:var(--color-service-hero-green-emphasis)]"
        >
            <div className="grid-layout gap-10 pt-10 *:col-span-full">
                <PageTitleBar
                    size="sm"
                    title={PLATFORM_CARBON_TITLE}
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
                                    <BreadcrumbPage>{PLATFORM_CARBON_TITLE}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <PlatformHero
                    tone="green"
                    headingId={HERO_TITLE_ID}
                    titleSize="compact"
                    // 문구가 가장 긴 화면이라 PC(1280↑)에서는 글 칸을 넓힌다(글 1.25 : 그림 0.75). 1024~1279 는 그림 칸이 좁아지면 카드
                    // 제목이 꺾이고 태그가 세로로 쌓여 기본 비율을 그대로 둔다.
                    className="xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] xl:gap-10"
                    eyebrow={PLATFORM_CARBON_HERO.eyebrow}
                    title={
                        <>
                            {PLATFORM_CARBON_HERO.titleTop}{' '}
                            <span className="whitespace-nowrap">{PLATFORM_CARBON_HERO.titleTopKeep}</span>
                            {/* PC(1024↑)에서는 둘째 줄을 새 줄로 — 시안처럼 두 줄 제목. */}
                            <br className="max-lg:hidden" /> {PLATFORM_CARBON_HERO.title}{' '}
                            <PlatformHeroEmphasis>{PLATFORM_CARBON_HERO.titleEmphasis}</PlatformHeroEmphasis>
                        </>
                    }
                    lead={
                        <>
                            <p>{PLATFORM_CARBON_HERO.lead}</p>
                            {/* 둘째 문단은 글자가 작아(16) 시안 폭 34em = 544 로 따로 묶는다(첫 문단은 히어로가 612 로 묶는다). */}
                            <p className="typo-body-xl-regular mt-2.5 max-w-136">{PLATFORM_CARBON_HERO.subLead}</p>
                        </>
                    }
                    actions={
                        <PlatformExternalLinkButton
                            href={PLATFORM_CARBON_HERO.actionHref}
                            dialog={PLATFORM_CARBON_MOVE_DIALOG}
                        >
                            {PLATFORM_CARBON_HERO.actionLabel}
                        </PlatformExternalLinkButton>
                    }
                    note={
                        <>
                            <ExternalLink aria-hidden="true" className="size-icon-xs" />
                            {PLATFORM_CARBON_HERO.note}
                        </>
                    }
                    visual={<PlatformServiceHeroCards items={HERO_CARDS} label={PLATFORM_CARBON_HERO.cardsLabel} />}
                />
            </div>

            <PlatformServiceSwitchProvider options={PLATFORM_CARBON_SWITCH.options} panelKeys={SERVICE_PANEL_KEYS}>
                <PlatformSectionNav
                    items={PLATFORM_CARBON_SECTIONS}
                    leading={<PlatformServiceSwitchTabs label={PLATFORM_CARBON_SWITCH.label} />}
                />
                {/* 이 화면 안의 #섹션 링크(탭)를 부드럽게 스크롤한다. */}
                <PlatformAnchorScroll />

                <PlatformSection id="intro" label="서비스 소개">
                    {SERVICE_KEYS.map((service) => (
                        <PlatformServicePanel key={service} value={service} panelKey="intro">
                            <PlatformSectionHeading
                                titleId={`intro-${service}-title`}
                                title={PLATFORM_CARBON_SERVICES[service].intro.title}
                                description={PLATFORM_CARBON_SERVICES[service].intro.description}
                            />
                            <PlatformFeatureCards items={introCards(service)} />
                        </PlatformServicePanel>
                    ))}
                </PlatformSection>

                <PlatformSection id="features" tone="muted" label="주요 기능">
                    {SERVICE_KEYS.map((service) => (
                        <PlatformServicePanel key={service} value={service} panelKey="features">
                            <PlatformSectionHeading
                                titleId={`features-${service}-title`}
                                eyebrow={PLATFORM_CARBON_SERVICES[service].features.eyebrow}
                                title={PLATFORM_CARBON_SERVICES[service].features.title}
                            />
                            <PlatformIconPanels items={featurePanels(service)} columns={3} />
                        </PlatformServicePanel>
                    ))}
                </PlatformSection>

                <PlatformSection id="process" label="이용 절차">
                    <PlatformServicePanel value="leading-sme" panelKey="process">
                        <PlatformSectionHeading
                            titleId="process-leading-sme-title"
                            title={PLATFORM_CARBON_SERVICES['leading-sme'].process.title}
                        />
                        <PlatformProcessSteps steps={PLATFORM_CARBON_SERVICES['leading-sme'].process.steps} />
                    </PlatformServicePanel>
                    <PlatformServicePanel value="taxonomy" panelKey="process">
                        <PlatformSectionHeading titleId="process-taxonomy-title" title={taxonomyProcess.title} />
                        <PlatformRuleList
                            items={taxonomyProcess.items.map((item) => ({...item, icon: RULE_ICONS[item.id]}))}
                        />
                    </PlatformServicePanel>
                </PlatformSection>
            </PlatformServiceSwitchProvider>

            <PlatformSection
                id="audience"
                tone="muted"
                title={PLATFORM_CARBON_AUDIENCE.title}
                description={PLATFORM_CARBON_AUDIENCE.description}
            >
                <PlatformIconTiles items={AUDIENCE_TILES} />
            </PlatformSection>

            {/* 마무리 배너 — 이용 대상과 같은 회색 띠(화면 전체 폭) 위에 이어서 놓는다(위 여백 없이 한 덩어리로 보이게). */}
            <div className="bg-platform-section-band pb-14 md:pb-18 xl:pb-24">
                <PlatformReveal className="grid-layout *:col-span-full">
                    <PlatformCtaBanner
                        tone="green"
                        headingId={CTA_TITLE_ID}
                        title={PLATFORM_CARBON_CTA.title}
                        actions={PLATFORM_CARBON_CTA.actions.map((action) => (
                            <PlatformExternalLinkButton
                                key={action.id}
                                href={action.href}
                                dialog={PLATFORM_CARBON_MOVE_DIALOG}
                            >
                                {action.label}
                            </PlatformExternalLinkButton>
                        ))}
                    />
                </PlatformReveal>
            </div>
        </main>
    )
}

export {PlatformCarbonNeutrality}
export type {PlatformCarbonNeutralityProps}
