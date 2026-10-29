import type {ReactNode} from 'react'
import Image, {type StaticImageData} from 'next/image'
import businessHandshake from '@public/images/platform-technology-evaluation/business-handshake.webp'
import officeCityView from '@public/images/platform-technology-evaluation/office-city-view.webp'
import reportChartsDesk from '@public/images/platform-technology-evaluation/report-charts-desk.webp'
import clipboardCheckChart from '@public/images/option-card/clipboard-check-chart.webp'
import aiAnalysisReportIcon from '@public/images/platform-k-bigx-report/ai-analysis-report.webp'
import heroAiReportImage from '@public/images/platform-k-bigx-report/hero-ai-report.webp'
import heroSmeTargetImage from '@public/images/platform-k-bigx-report/hero-sme-target.webp'
import industryTrendIcon from '@public/images/platform-k-bigx-report/industry-trend.webp'
import insightIcon from '@public/images/platform-k-bigx-report/insight.webp'
import peerComparisonIcon from '@public/images/platform-k-bigx-report/peer-comparison.webp'
import {RollingAccordion, RollingAccordionBody} from '@/components/composite/rolling-accordion'
import {KBigxReportFlowDiagram} from '@/components/custom/k-bigx-report-flow-diagram'
import {
    PlatformServiceHero,
    ServiceFeatureList,
    ServiceGlassCard,
    ServiceGlassCardList,
} from '@/components/custom/platform-service-intro'
import {ProcedureSteps} from '@/components/custom/procedure-steps'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {K_BIGX_REPORT_SECTIONS, PLATFORM_K_BIGX_REPORT} from '@/content/service/platform-k-bigx-report'
import {cn} from '@/lib/utils'

// 플랫폼 소개 > K-BIGx 보고서 본문(기업 · 기관 공용). 화면 제목 줄은 page.tsx 가 titleBar 로 넘긴다.
//   ① 히어로(PlatformServiceHero · navy) ② 분석 기능(ServiceFeatureList · 2열) ③ 생성 흐름도(KBigxReportFlowDiagram)
//   ④ 절차(ProcedureSteps) ⑤ 결과정보 · 기대효과 · 활용분야(RollingAccordion)
// 문구는 content/service/platform-k-bigx-report.ts 에서 고친다.
//
// 그림 · 아이콘은 모두 꾸밈(alt="")이다. 원본은 표시 크기의 3배 webp.
// 클립보드 그림만 여백 없이 꽉 찬 그림이라 다른 카드 그림(88 칸 여백 포함)과 맞추려고 76(size-19)으로 줄여 띄운다.

const {hero, features, procedure} = PLATFORM_K_BIGX_REPORT

// 아래 묶음 사진 — 기술평가와 같은 세 장(원본 2070 × 1284 = PC 690 × 428 의 3배).
const SECTION_PHOTOS: Record<(typeof K_BIGX_REPORT_SECTIONS)[number]['value'], StaticImageData> = {
    results: reportChartsDesk,
    effect: businessHandshake,
    usage: officeCityView,
}
// 히어로 카드 그림 — 높이 88 · 폭은 그림 비율대로(중소·벤처기업 그림은 105 × 88).
const HERO_CARD_IMAGES: Record<(typeof hero.cards)[number]['image'], {src: StaticImageData; className: string}> = {
    'hero-ai-report': {src: heroAiReportImage, className: 'h-22 w-auto'},
    'hero-sme-target': {src: heroSmeTargetImage, className: 'h-22 w-auto'},
    'clipboard-check-chart': {src: clipboardCheckChart, className: 'mt-1 mb-2 ml-2 size-19'},
}
// 분석 기능 아이콘(40).
const FEATURE_ICONS: Record<(typeof features.items)[number]['icon'], StaticImageData> = {
    'ai-analysis-report': aiAnalysisReportIcon,
    'peer-comparison': peerComparisonIcon,
    'industry-trend': industryTrendIcon,
    insight: insightIcon,
}
const SECTION_PHOTO_SIZES = '(min-width: 1280px) 690px, (min-width: 768px) 792px, calc(100vw - 32px)'

const PlatformKBigxReport = ({titleBar}: {titleBar: ReactNode}) => (
    <>
        <PlatformServiceHero
            headingId="platform-k-bigx-hero"
            titleBar={titleBar}
            titleLines={hero.titleLines}
            lead={hero.lead}
            descriptionLines={hero.descriptionLines}
            tone="navy"
        >
            <ServiceGlassCardList>
                {hero.cards.map((card, index) => (
                    <ServiceGlassCard
                        key={card.title}
                        index={index}
                        title={card.title}
                        description={card.description}
                        image={
                            <Image
                                src={HERO_CARD_IMAGES[card.image].src}
                                alt=""
                                preload
                                className={cn('self-start', HERO_CARD_IMAGES[card.image].className)}
                            />
                        }
                    />
                ))}
            </ServiceGlassCardList>
        </PlatformServiceHero>
        <div className="grid-layout gap-20 pt-20 pb-15 *:col-span-full">
            <div className="flex flex-col gap-20">
                <section aria-labelledby="platform-k-bigx-features" className="flex flex-col gap-12">
                    <h2 id="platform-k-bigx-features" className="typo-lead-title-bold text-foreground break-keep">
                        {features.title}
                    </h2>
                    <ServiceFeatureList
                        columns={2}
                        items={features.items.map((item) => ({
                            title: item.title,
                            description: item.description,
                            icon: <Image src={FEATURE_ICONS[item.icon]} alt="" className="size-10" />,
                        }))}
                    />
                </section>
                <KBigxReportFlowDiagram />
                <section aria-labelledby="platform-k-bigx-procedure" className="flex flex-col gap-12">
                    <h2 id="platform-k-bigx-procedure" className="typo-lead-title-bold text-foreground break-keep">
                        {procedure.title}
                    </h2>
                    <ProcedureSteps steps={procedure.steps} />
                </section>
                <section aria-labelledby="platform-k-bigx-sections">
                    <h2 id="platform-k-bigx-sections" className="sr-only">
                        K-BIGx 보고서 결과정보 · 기대효과 · 활용분야
                    </h2>
                    <ScrollReveal>
                        <RollingAccordion
                            items={K_BIGX_REPORT_SECTIONS.map((section) => ({
                                value: section.value,
                                title: section.title,
                                content: <RollingAccordionBody groups={section.groups} />,
                                image: <Image src={SECTION_PHOTOS[section.value]} alt="" sizes={SECTION_PHOTO_SIZES} />,
                            }))}
                        />
                    </ScrollReveal>
                </section>
            </div>
        </div>
    </>
)

export {PlatformKBigxReport}
