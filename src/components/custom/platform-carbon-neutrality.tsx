'use client'

import {useRef, useState, type ReactNode} from 'react'
import Image, {type StaticImageData} from 'next/image'
import {ArrowRight} from 'lucide-react'
import {Tabs as TabsPrimitive} from 'radix-ui'
import businessHandshake from '@public/images/platform-technology-evaluation/business-handshake.webp'
import officeCityView from '@public/images/platform-technology-evaluation/office-city-view.webp'
import reportChartsDesk from '@public/images/platform-technology-evaluation/report-charts-desk.webp'
import clipboardCheckChart from '@public/images/option-card/clipboard-check-chart.webp'
import keywordSearchDarkIcon from '@public/images/platform-carbon-neutrality/keyword-search-dark.webp'
import selfDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/self-diagnosis-dark.webp'
import emissionDiagnosisDarkIcon from '@public/images/platform-carbon-neutrality/emission-diagnosis-dark.webp'
import emissionDiagnosisIcon from '@public/images/platform-carbon-neutrality/emission-diagnosis.webp'
import reductionPlanDarkIcon from '@public/images/platform-carbon-neutrality/reduction-plan-dark.webp'
import heroLeadingSmeImage from '@public/images/platform-carbon-neutrality/hero-leading-sme.webp'
import heroPublicUseImage from '@public/images/platform-carbon-neutrality/hero-public-use.webp'
import heroSmeUseImage from '@public/images/platform-carbon-neutrality/hero-sme-use.webp'
import heroTaxonomyImage from '@public/images/platform-carbon-neutrality/hero-taxonomy.webp'
import keywordSearchIcon from '@public/images/platform-carbon-neutrality/keyword-search.webp'
import reductionPlanIcon from '@public/images/platform-carbon-neutrality/reduction-plan.webp'
import selfDiagnosisIcon from '@public/images/platform-carbon-neutrality/self-diagnosis.webp'
import economicUseDarkIcon from '@public/images/platform-patent-evaluation/economic-use-dark.webp'
import economicUseIcon from '@public/images/platform-patent-evaluation/economic-use.webp'
import patentedKnowledgeDarkIcon from '@public/images/platform-patent-evaluation/patented-knowledge-dark.webp'
import patentedKnowledgeIcon from '@public/images/platform-patent-evaluation/patented-knowledge.webp'
import {ConfirmDialog, ConfirmTarget} from '@/components/composite/confirm-dialog'
import {RollingAccordion, RollingAccordionBody} from '@/components/composite/rolling-accordion'
import {ChipMarquee} from '@/components/custom/chip-marquee'
import {
    PlatformServiceHero,
    ServiceFeatureList,
    ServiceGlassCard,
    ServiceGlassCardList,
} from '@/components/custom/platform-service-intro'
import {ProcedureSteps} from '@/components/custom/procedure-steps'
import {ThemeImage} from '@/components/custom/theme-image'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {PILL_TAB_LIST_CLASS_NAME, PILL_TAB_TRIGGER_CLASS_NAME} from '@/components/theme/pill-tabs.variants'
import {
    CARBON_PLATFORMS,
    PLATFORM_CARBON_NEUTRALITY,
    type CarbonFeature,
    type CarbonHeroCard,
    type CarbonPlatform,
    type CarbonPlatformKey,
} from '@/content/service/platform-carbon-neutrality'
import {cn} from '@/lib/utils'

// 플랫폼 소개 > 탄소중립 본문(기업 · 기관 공용). 화면 제목 줄은 page.tsx 가 titleBar 로 넘긴다.
//   ① 히어로(PlatformServiceHero) — 알약 탭으로 두 플랫폼(선도중소기업확인 · K-택소노미)을 고르고, 고른 쪽 카드 3장
//   ② 분석 기능(ServiceFeatureList) · ③ 아래 묶음(선도중소기업 = ProcedureSteps · 택소노미 = RollingAccordion) — 고른 플랫폼 것만
//   ④ 이런 기업에 적합합니다(ChipMarquee) · ⑤ 진단 바로가기(이동 확인 모달 → [확인] 시 외부 플랫폼 새 탭)
// 문구 · 링크 주소는 content/service/platform-carbon-neutrality.ts 에서 고친다.
//
// 알아둘 점 — 탭 전환
//   · 두 플랫폼 내용을 모두 그려 두고(forceMount) 고르지 않은 쪽을 바로 감춘다(카드 invisible · 아래 내용 hidden).
//     감추지 않고 언마운트를 기다리면 사라지는 쪽이 페이드 동안 남아 새 내용과 겹친다.
//   · 카드는 한 칸에 겹쳐 두어 칸 높이가 큰 쪽에 맞춰진다 — 탭을 바꿔도 아래 화면이 위아래로 흔들리지 않는다.
//   · transition-none 을 지우지 않는다 — 등장 클래스 duration-* 이 transition 시간도 정해 감춤이 그만큼 늦게 적용된다.
//   · 탭 접근성(role · 화살표 키 · aria-*)은 Radix Tabs 가 맡는다[8.2.1].

const {hero, target, moveDialog} = PLATFORM_CARBON_NEUTRALITY

// 아래 묶음 사진 — 기술평가와 같은 세 장(원본 2070 × 1284 = PC 690 × 428 의 3배). 항목 순서대로 쓴다.
const ACCORDION_PHOTOS: readonly StaticImageData[] = [reportChartsDesk, businessHandshake, officeCityView]
const ACCORDION_PHOTO_SIZES = '(min-width: 1280px) 690px, (min-width: 768px) 792px, calc(100vw - 32px)'

// 그림 · 아이콘은 모두 꾸밈(alt="")이다. 원본은 표시 크기의 3배 webp.
// 클립보드 그림만 여백 없이 꽉 찬 그림이라 다른 카드 그림(88 칸 여백 포함)과 맞추려고 76(size-19)으로 줄여 띄운다.
const HERO_CARD_IMAGES: Record<CarbonHeroCard['image'], {src: StaticImageData; className: string}> = {
    'hero-leading-sme': {src: heroLeadingSmeImage, className: 'h-22 w-auto'},
    'hero-sme-use': {src: heroSmeUseImage, className: 'h-22 w-auto'},
    'hero-taxonomy': {src: heroTaxonomyImage, className: 'h-22 w-auto'},
    'hero-public-use': {src: heroPublicUseImage, className: 'h-22 w-auto'},
    'clipboard-check-chart': {src: clipboardCheckChart, className: 'mt-1 mb-2 ml-2 size-19'},
}
// 분석 기능 아이콘 — 라이트 · 다크 그림이 따로다.
const FEATURE_ICONS: Record<CarbonFeature['icon'], {light: StaticImageData; dark: StaticImageData}> = {
    'emission-diagnosis': {light: emissionDiagnosisIcon, dark: emissionDiagnosisDarkIcon},
    'reduction-plan': {light: reductionPlanIcon, dark: reductionPlanDarkIcon},
    'level-diagnosis': {light: patentedKnowledgeIcon, dark: patentedKnowledgeDarkIcon},
    'keyword-search': {light: keywordSearchIcon, dark: keywordSearchDarkIcon},
    'self-diagnosis': {light: selfDiagnosisIcon, dark: selfDiagnosisDarkIcon},
    'expert-evaluation': {light: economicUseIcon, dark: economicUseDarkIcon},
}

const HeroCardImage = ({image}: {image: CarbonHeroCard['image']}) => (
    <Image
        src={HERO_CARD_IMAGES[image].src}
        alt=""
        preload
        className={cn('self-start', HERO_CARD_IMAGES[image].className)}
    />
)

const FeatureIcon = ({icon}: {icon: CarbonFeature['icon']}) => (
    <ThemeImage {...FEATURE_ICONS[icon]} className="size-10" />
)

const PlatformDetail = ({platform}: {platform: CarbonPlatform}) => {
    const headingId = `platform-carbon-${platform.key}-detail`
    const {detail} = platform

    return (
        <section aria-labelledby={headingId} className="flex flex-col gap-12">
            <h2 id={headingId} className="typo-lead-title-bold text-foreground break-keep">
                {detail.title}
            </h2>
            {detail.kind === 'steps' ? (
                <ProcedureSteps steps={detail.steps} />
            ) : (
                <ScrollReveal>
                    <RollingAccordion
                        items={detail.items.map((item, index) => ({
                            value: item.value,
                            title: item.title,
                            content: <RollingAccordionBody groups={item.groups} />,
                            image: (
                                <Image
                                    src={ACCORDION_PHOTOS[index % ACCORDION_PHOTOS.length] ?? reportChartsDesk}
                                    alt=""
                                    sizes={ACCORDION_PHOTO_SIZES}
                                />
                            ),
                        }))}
                    />
                </ScrollReveal>
            )}
        </section>
    )
}

// 칩 줄은 본문 칸 밖(화면 전체 폭)에 두어 브라우저 좌우 끝까지 흐른다 — 본문 칸 안에 두면 칸 가장자리에서 잘려 보인다.
const TargetSection = () => (
    <section aria-labelledby="platform-carbon-target" className="bg-service-target-band flex flex-col gap-12 py-20">
        <div className="grid-layout *:col-span-full">
            <div className="flex flex-col gap-2">
                <h2 id="platform-carbon-target" className="typo-lead-title-bold text-foreground break-keep">
                    {target.title}
                </h2>
                <p className="typo-title-m-regular text-label-foreground break-keep">{target.description}</p>
            </div>
        </div>
        <ChipMarquee items={target.items} label={target.title} className="w-full motion-reduce:px-4" />
    </section>
)

// 진단 바로가기 한 칸 — 버튼이 이동 확인 모달을 열고(Radix 가 aria-haspopup · 포커스 복귀를 맡는다[8.2.1]),
// [확인] 을 누를 때만 새 탭을 연다 — 누르자마자 다른 사이트로 넘어가지 않게 한 번 묻는다[7.2.1].
const PlatformStartButton = ({platform}: {platform: CarbonPlatform}) => {
    const [isOpen, setIsOpen] = useState(false)
    const openPlatform = () => {
        window.open(platform.startHref, '_blank', 'noopener,noreferrer')
        setIsOpen(false)
    }

    return (
        <ConfirmDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            title={moveDialog.title}
            question={
                // 좁은 화면에서 낱말 중간('제공됩니|다.')이 끊기지 않게 낱말 단위로 줄을 바꾼다.
                <span className="break-keep">
                    해당 서비스는 &lsquo;<ConfirmTarget>{moveDialog.platformName}</ConfirmTarget>&rsquo;에서 제공됩니다.
                    <br />
                    {moveDialog.question}
                    <span className="sr-only"> (확인을 누르면 새 창에서 열림)</span>
                </span>
            }
            onConfirm={openPlatform}
        >
            <button
                type="button"
                className="typo-callout-bold text-foreground hover:text-service-accent-green focus-visible:text-service-accent-green outline-ring focus-visible:outline-ring flex min-h-14 w-full items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid md:min-h-25"
            >
                {platform.startLabel}
                <ArrowRight aria-hidden="true" className="size-icon-lg" />
            </button>
        </ConfirmDialog>
    )
}

const PlatformCarbonNeutrality = ({titleBar}: {titleBar: ReactNode}) => {
    const [platformKey, setPlatformKey] = useState<CarbonPlatformKey>('leading-sme')
    const tabListRef = useRef<HTMLDivElement>(null)
    const handleValueChange = (value: string) => {
        const next = CARBON_PLATFORMS.find((platform) => platform.key === value)
        if (!next) return

        setPlatformKey(next.key)
        // 탭과 바뀐 내용이 화면 위쪽에 오도록 스크롤한다.
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        tabListRef.current?.scrollIntoView({block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    return (
        <TabsPrimitive.Root value={platformKey} onValueChange={handleValueChange}>
            <PlatformServiceHero
                headingId="platform-carbon-hero"
                titleBar={titleBar}
                titleLines={hero.titleLines}
                lead={hero.lead}
                descriptionLines={hero.descriptionLines}
                tone="green"
            >
                <div className="flex w-full flex-col items-center gap-6">
                    {/* 스크롤 후 탭이 상단 헤더에 가리지 않게 띄우는 거리(헤더 높이 + 16) — md 미만 56 → 72 · md 100 → 116 · xl 112 → 128 */}
                    <TabsPrimitive.List
                        ref={tabListRef}
                        aria-label={hero.tabListLabel}
                        className={cn(PILL_TAB_LIST_CLASS_NAME, 'scroll-mt-18 md:scroll-mt-29 xl:scroll-mt-32')}
                    >
                        {CARBON_PLATFORMS.map((platform) => (
                            <TabsPrimitive.Trigger
                                key={platform.key}
                                value={platform.key}
                                className={PILL_TAB_TRIGGER_CLASS_NAME}
                            >
                                {platform.label}
                            </TabsPrimitive.Trigger>
                        ))}
                    </TabsPrimitive.List>
                    {/* 카드 — 두 플랫폼 카드를 한 칸에 겹쳐 두고 고르지 않은 쪽은 감춘다(높이는 큰 쪽). */}
                    <div className="grid w-full *:col-start-1 *:row-start-1">
                        {CARBON_PLATFORMS.map((platform) => (
                            <TabsPrimitive.Content
                                key={platform.key}
                                value={platform.key}
                                forceMount
                                className="motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 transition-none outline-none data-[state=inactive]:invisible motion-safe:data-[state=active]:duration-500"
                            >
                                <ServiceGlassCardList className="h-full">
                                    {platform.cards.map((card, index) => (
                                        <ServiceGlassCard
                                            key={card.title}
                                            index={index}
                                            title={card.title}
                                            description={card.description}
                                            bullets={card.bullets}
                                            image={<HeroCardImage image={card.image} />}
                                        />
                                    ))}
                                </ServiceGlassCardList>
                            </TabsPrimitive.Content>
                        ))}
                    </div>
                </div>
            </PlatformServiceHero>

            {/* 아래 묶음은 탭 패널이 아니라 고른 탭을 따라 바뀌는 내용이다 — 같은 값의 Content 를 또 두면 Radix 가 같은 id 를
                한 번 더 만들어 id 가 중복된다[8.1.1]. 그래서 일반 div 에 data-state 만 붙여 위 카드와 같은 감춤 · 등장 클래스를 쓴다. */}
            <div className="grid-layout pt-20 pb-20 *:col-span-full">
                {CARBON_PLATFORMS.map((platform) => (
                    <div
                        key={platform.key}
                        data-state={platform.key === platformKey ? 'active' : 'inactive'}
                        className="motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:ease-roll flex flex-col gap-20 transition-none data-[state=inactive]:hidden motion-safe:data-[state=active]:duration-700"
                    >
                        <section
                            aria-labelledby={`platform-carbon-${platform.key}-features`}
                            className="flex flex-col gap-12"
                        >
                            <h2
                                id={`platform-carbon-${platform.key}-features`}
                                className="typo-lead-title-bold text-foreground break-keep"
                            >
                                {platform.featuresTitle}
                            </h2>
                            <ServiceFeatureList
                                columns={3}
                                iconSurfaceClassName="bg-platform-icon-surface"
                                items={platform.features.map((feature) => ({
                                    title: feature.title,
                                    description: feature.description,
                                    icon: <FeatureIcon icon={feature.icon} />,
                                }))}
                            />
                        </section>
                        <PlatformDetail platform={platform} />
                    </div>
                ))}
            </div>

            <TargetSection />

            {/* 바로가기 — 누르면 이동 확인 모달(공용 ConfirmDialog)이 뜨고, [확인] 을 눌러야 외부 진단 화면을 새 탭으로 연다.
                모바일은 칸이 화면 끝까지 뻗도록 그리드 가장자리 여백만큼 밖으로 뺀다(-mx-(--ds-grid-margin)). */}
            <nav aria-label="탄소중립 진단 바로가기" className="grid-layout *:col-span-full">
                <ul className="border-subtle-3 divide-subtle-3 -mx-(--ds-grid-margin) grid divide-y md:mx-0 md:grid-cols-2 md:divide-x md:divide-y-0 md:border-x">
                    {CARBON_PLATFORMS.map((platform) => (
                        <li key={platform.key}>
                            <PlatformStartButton platform={platform} />
                        </li>
                    ))}
                </ul>
            </nav>
        </TabsPrimitive.Root>
    )
}

export {PlatformCarbonNeutrality}
