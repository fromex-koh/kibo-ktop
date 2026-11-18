import {ArrowRight, Lock} from 'lucide-react'
import {Fragment} from 'react'
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
import {
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformIconPanels,
    PlatformSection,
} from '@/components/custom/platform-intro-blocks'
import {PlatformKBigxAnalysisDiagram} from '@/components/custom/platform-k-bigx-analysis-diagram'
import {PlatformKBigxReportCover} from '@/components/custom/platform-k-bigx-report-cover'
import {PlatformNotice} from '@/components/custom/platform-notice'
import {PlatformProcessSteps} from '@/components/custom/platform-process-steps'
import {PlatformReportViewer} from '@/components/custom/platform-report-viewer'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {PlatformSectionNav} from '@/components/custom/platform-section-nav'
import {ThemeImage} from '@/components/custom/theme-image'
import {Button} from '@/components/ui/button'
import type {PlatformIntroUserType} from '@/content/service/platform-intro'
import {
    PLATFORM_K_BIGX_ANALYSIS,
    PLATFORM_K_BIGX_CTA,
    PLATFORM_K_BIGX_FEATURES,
    PLATFORM_K_BIGX_FUNCTIONS,
    PLATFORM_K_BIGX_HERO,
    PLATFORM_K_BIGX_PREVIEW,
    PLATFORM_K_BIGX_PROCESS,
    PLATFORM_K_BIGX_ROUTES,
    PLATFORM_K_BIGX_SECTIONS,
    PLATFORM_K_BIGX_TITLE,
} from '@/content/service/platform-k-bigx-report'
import clipboardCheckChart from '@public/images/option-card/clipboard-check-chart.webp'
import aiAnalysisReportDarkIcon from '@public/images/platform-k-bigx-report/ai-analysis-report-dark.webp'
import aiAnalysisReportIcon from '@public/images/platform-k-bigx-report/ai-analysis-report.webp'
import heroAiReport from '@public/images/platform-k-bigx-report/hero-ai-report.webp'
import heroSmeTarget from '@public/images/platform-k-bigx-report/hero-sme-target.webp'
import industryTrendDarkIcon from '@public/images/platform-k-bigx-report/industry-trend-dark.webp'
import industryTrendIcon from '@public/images/platform-k-bigx-report/industry-trend.webp'
import insightDarkIcon from '@public/images/platform-k-bigx-report/insight-dark.webp'
import insightIcon from '@public/images/platform-k-bigx-report/insight.webp'
import peerComparisonDarkIcon from '@public/images/platform-k-bigx-report/peer-comparison-dark.webp'
import peerComparisonIcon from '@public/images/platform-k-bigx-report/peer-comparison.webp'
import reportActivityDark from '@public/images/platform-k-bigx-report/report-activity-dark.webp'
import reportActivity from '@public/images/platform-k-bigx-report/report-activity.webp'
import reportBriefingDark from '@public/images/platform-k-bigx-report/report-briefing-dark.webp'
import reportBriefing from '@public/images/platform-k-bigx-report/report-briefing.webp'
import reportCompanyDark from '@public/images/platform-k-bigx-report/report-company-dark.webp'
import reportCompany from '@public/images/platform-k-bigx-report/report-company.webp'
import reportCreditDark from '@public/images/platform-k-bigx-report/report-credit-dark.webp'
import reportCredit from '@public/images/platform-k-bigx-report/report-credit.webp'
import reportInnovationDark from '@public/images/platform-k-bigx-report/report-innovation-dark.webp'
import reportInnovation from '@public/images/platform-k-bigx-report/report-innovation.webp'
import reportReferenceDark from '@public/images/platform-k-bigx-report/report-reference-dark.webp'
import reportReference from '@public/images/platform-k-bigx-report/report-reference.webp'
import reportTechIndexDark from '@public/images/platform-k-bigx-report/report-tech-index-dark.webp'
import reportTechIndex from '@public/images/platform-k-bigx-report/report-tech-index.webp'

// 플랫폼 소개 > K-BIGx 보고서 화면 본문 — 기업 · 기관 /platform/k-bigx-report/page.tsx 가 함께 쓴다.
// 문구 · 이동 주소는 content/service/platform-k-bigx-report.ts.
//
// 짜임(위 → 아래): 화면 제목 → 히어로(글 | 보고서 표지 + 반원 게이지) → 섹션 이동 탭 → 서비스 소개(카드 3)
//   → 분석 기능(아이콘 패널 4) → 보고서 미리보기(항목 메뉴 | 캡처 · 주요 제공 정보) → 분석 구조(도식 + 제공정보 · 기대효과 · 활용분야)
//   → 이용 절차(4단계 + 이용 안내) → 마무리 배너. 섹션 바탕은 흰색 · 옅은 회색이 번갈아 온다.
// K-BIGx 색(파랑) — 히어로 · 배너는 tone="navy", 그 밖은 <main> 의 CSS 변수(아래 main 주석)로 넘긴다.

type PlatformKBigxReportProps = {
    userType: PlatformIntroUserType
}

const HERO_TITLE_ID = 'platform-k-bigx-hero-title'
const CTA_TITLE_ID = 'platform-k-bigx-cta-title'
const PREVIEW_ANCHOR = '#preview'

// 서비스 소개 카드 그림(높이 88, 원본 3배) — 꾸밈이라 읽지 않는다[5.1.1].
const FEATURE_IMAGES = {
    'ai-report': heroAiReport,
    'sme-target': heroSmeTarget,
    difference: clipboardCheckChart,
} as const

// 원고의 줄 배열을 <br> 로 잇는다(문자열이면 그대로).
//   breakClassName 을 주면 그 조건에서 <br> 이 숨고, 줄 사이 띄어쓰기로 이어져 칸 폭대로 흐른다.
const joinLines = (lines: string | readonly string[], breakClassName?: string) =>
    typeof lines === 'string'
        ? lines
        : lines.map((line, index) => (
              <Fragment key={line}>
                  {index > 0 ? (
                      <>
                          {' '}
                          <br className={breakClassName} />
                      </>
                  ) : null}
                  {line}
              </Fragment>
          ))

// 분석 기능 설명은 PC(1280↑, 패널 4열)에서만 원고 줄대로 끊는다 — 더 넓은 2열 · 1열 패널에서 억지로 끊으면 짧은 줄이 생긴다.
const FUNCTION_LINE_BREAK_CLASS = 'max-xl:hidden'

const FEATURE_CARDS = PLATFORM_K_BIGX_FEATURES.items.map((item) => ({
    ...item,
    description: joinLines(item.description),
    image: <PlatformFeatureImage src={FEATURE_IMAGES[item.id]} />,
}))

// 분석 기능 아이콘 — 라이트 · 다크 그림(K-BIGx 파랑).
const FUNCTION_ICONS = {
    'ai-analysis-report': {light: aiAnalysisReportIcon, dark: aiAnalysisReportDarkIcon},
    'peer-comparison': {light: peerComparisonIcon, dark: peerComparisonDarkIcon},
    'industry-trend': {light: industryTrendIcon, dark: industryTrendDarkIcon},
    insight: {light: insightIcon, dark: insightDarkIcon},
} as const

const FUNCTION_PANELS = PLATFORM_K_BIGX_FUNCTIONS.items.map((item) => ({
    ...item,
    description: joinLines(item.description, FUNCTION_LINE_BREAK_CLASS),
    icon: <ThemeImage {...FUNCTION_ICONS[item.id]} />,
}))

// 보고서 미리보기 캡처 — 항목 순서, 라이트 · 다크(원본 1200 폭).
const PREVIEW_IMAGES = {
    briefing: {light: reportBriefing, dark: reportBriefingDark},
    company: {light: reportCompany, dark: reportCompanyDark},
    innovation: {light: reportInnovation, dark: reportInnovationDark},
    'tech-index': {light: reportTechIndex, dark: reportTechIndexDark},
    credit: {light: reportCredit, dark: reportCreditDark},
    activity: {light: reportActivity, dark: reportActivityDark},
    reference: {light: reportReference, dark: reportReferenceDark},
} as const

const PREVIEW_SECTIONS = PLATFORM_K_BIGX_PREVIEW.sections.map((section) => ({
    ...section,
    image: PREVIEW_IMAGES[section.id],
}))

// 제공정보 · 기대효과 · 활용분야 — 굵은 윗줄(본문색 2px)로 나눈 글 묶음. PC(1024↑) 왼쪽 제공정보(넓게) | 오른쪽 두 묶음.
// 제공정보 목록은 글자색과 같은 점(bg-current), 아래 단계 목록은 '-' 표시(보조 글자).
const OUTCOME_BLOCK_CLASS = 'border-foreground flex flex-col gap-4 border-t-2 pt-6'
const Outcome = () => {
    const {outcome} = PLATFORM_K_BIGX_ANALYSIS
    return (
        <PlatformReveal className="mt-14 md:mt-16">
            <h3 className="typo-title-xl-bold text-foreground mb-5">{outcome.title}</h3>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className={OUTCOME_BLOCK_CLASS}>
                    <h4 className="typo-title-xl-bold text-foreground">{outcome.results.title}</h4>
                    <ul className="typo-body-xl-regular text-label-foreground grid gap-1.5">
                        {outcome.results.items.map((item) => (
                            <li
                                key={item.text}
                                className="relative pl-3.5 break-keep before:absolute before:top-[0.72em] before:left-0 before:size-1.25 before:rounded-full before:bg-current"
                            >
                                {item.text}
                                {'subItems' in item ? (
                                    <ul className="typo-body-l-regular text-foreground-subtle mt-1.5 grid gap-1">
                                        {item.subItems.map((subItem) => (
                                            <li
                                                key={subItem}
                                                className="relative pl-3 before:absolute before:left-0 before:content-['-']"
                                            >
                                                {subItem}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="grid content-start gap-6">
                    {outcome.notes.map((note) => (
                        <div key={note.title} className={OUTCOME_BLOCK_CLASS}>
                            <h4 className="typo-title-xl-bold text-foreground">{note.title}</h4>
                            {'rows' in note ? (
                                // 대상별 한 줄 — '대상: 내용' 을 글 그대로 잇는다.
                                <ul className="typo-body-xl-regular text-label-foreground grid gap-1.5 break-keep">
                                    {note.rows.map((row) => (
                                        <li key={row.label}>
                                            {row.label}: {row.text}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="typo-body-xl-regular text-label-foreground break-keep">
                                    {note.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PlatformReveal>
    )
}

const PlatformKBigxReport = ({userType}: PlatformKBigxReportProps) => {
    const startHref = PLATFORM_K_BIGX_ROUTES[userType]
    const {notice} = PLATFORM_K_BIGX_PROCESS

    return (
        // --platform-header-h · --platform-section-nav-h — 섹션 탭이 잰 값으로 바뀐다. 처음 값은 PC 헤더(112) · 탭 줄(57).
        // K-BIGx 파랑 — --platform-card-accent(서비스 소개 카드) · --platform-tone-fill(샘플 배지 · 분석 기능 막대 · 미리보기 고른 칸 · 기술혁신정보 DB 머리)
        // · --platform-tone-step(-foreground)(절차 번호 원 · 선, 미리보기 번호) · --platform-flow-*(분석 구조 도식).
        // text-pretty · break-keep — 마지막 줄에 낱말 하나만 남지 않게 · 한글 낱말 중간에서 줄이 바뀌지 않게 한다(둘 다 상속되므로 여기 한 번만 둔다).
        <main
            id="main"
            tabIndex={-1}
            className="bg-page flex-1 text-pretty break-keep [--platform-card-accent:var(--color-platform-bigx-accent-foreground)] [--platform-flow-accent-bright:var(--color-platform-bigx-accent-bright)] [--platform-flow-accent:var(--color-platform-bigx-accent)] [--platform-flow-foreground:var(--color-platform-bigx-accent-foreground)] [--platform-header-h:--spacing(28)] [--platform-section-nav-h:--spacing(14)] [--platform-tone-fill:var(--color-service-bigx-fill)] [--platform-tone-step-foreground:var(--color-service-hero-navy-on-emphasis)] [--platform-tone-step:var(--color-service-hero-navy-emphasis)]"
        >
            <div className="grid-layout gap-10 pt-10 *:col-span-full">
                <PageTitleBar
                    size="sm"
                    title={PLATFORM_K_BIGX_TITLE}
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
                                    <BreadcrumbPage>{PLATFORM_K_BIGX_TITLE}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <PlatformHero
                    tone="navy"
                    headingId={HERO_TITLE_ID}
                    // PC(1280↑)는 제목 둘째 줄('AI 기반 … K-BIGx', 50px 기준 약 734)이 한 줄에 들어가게 글 칸을 넓힌다(약 752) —
                    // 그림 칸은 표지 폭(최대 270)에 조금 더한 288 로 고정한다.
                    className="xl:grid-cols-[minmax(0,1fr)_--spacing(72)]"
                    title={
                        <>
                            {/* 첫 줄은 본문색 — '혁신 인사이트'는 줄이 바뀌어도 함께 넘어간다. */}
                            <span className="block">
                                {PLATFORM_K_BIGX_HERO.titleTop}{' '}
                                <span className="whitespace-nowrap">{PLATFORM_K_BIGX_HERO.titleTopKeep}</span>
                            </span>
                            {PLATFORM_K_BIGX_HERO.title}{' '}
                            <PlatformHeroEmphasis>{PLATFORM_K_BIGX_HERO.titleEmphasis}</PlatformHeroEmphasis>
                        </>
                    }
                    lead={<p>{joinLines(PLATFORM_K_BIGX_HERO.lead)}</p>}
                    actions={
                        <>
                            <Button asChild variant="secondary" size="lg">
                                <a href={PREVIEW_ANCHOR}>{PLATFORM_K_BIGX_HERO.previewActionLabel}</a>
                            </Button>
                            <Button asChild size="lg">
                                <Link href={startHref}>
                                    {PLATFORM_K_BIGX_HERO.startActionLabel}
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </>
                    }
                    // 로그인 안내 — 시안대로 글만 둔다(링크 없음).
                    note={
                        <>
                            <Lock aria-hidden="true" className="size-icon-xs" />
                            {PLATFORM_K_BIGX_HERO.loginNote}
                        </>
                    }
                    visual={
                        // PC(1280↑)는 그림 칸(288)보다 게이지가 오른쪽으로 더 나간다 — 그림 전체를 왼쪽으로 28 옮겨
                        // 보이는 게이지 끝 ~ 띠 오른쪽 끝 간격을 왼쪽 안쪽 여백(56)과 맞춘다.
                        <PlatformKBigxReportCover {...PLATFORM_K_BIGX_HERO.cover} className="xl:-translate-x-7" />
                    }
                />
            </div>

            <PlatformSectionNav items={PLATFORM_K_BIGX_SECTIONS} />
            {/* 이 화면 안의 #섹션 링크(탭 · 보고서 미리보기 버튼)를 부드럽게 스크롤한다. */}
            <PlatformAnchorScroll />

            <PlatformSection
                id="features"
                title={PLATFORM_K_BIGX_FEATURES.title}
                description={joinLines(PLATFORM_K_BIGX_FEATURES.description)}
            >
                <PlatformFeatureCards items={FEATURE_CARDS} />
            </PlatformSection>

            <PlatformSection id="functions" tone="muted" title={PLATFORM_K_BIGX_FUNCTIONS.title}>
                <PlatformIconPanels items={FUNCTION_PANELS} />
            </PlatformSection>

            <PlatformSection id="preview" title={PLATFORM_K_BIGX_PREVIEW.title}>
                <PlatformReveal>
                    <PlatformReportViewer
                        sections={PREVIEW_SECTIONS}
                        listLabel={PLATFORM_K_BIGX_PREVIEW.listLabel}
                        reportName={PLATFORM_K_BIGX_PREVIEW.reportName}
                        infoTitle={PLATFORM_K_BIGX_PREVIEW.infoTitle}
                        sampleBadge={PLATFORM_K_BIGX_PREVIEW.sampleBadge}
                        scrollCaption={PLATFORM_K_BIGX_PREVIEW.scrollCaption}
                        sampleNote={PLATFORM_K_BIGX_PREVIEW.sampleNote}
                    />
                </PlatformReveal>
            </PlatformSection>

            <PlatformSection id="analysis" tone="muted" title={PLATFORM_K_BIGX_ANALYSIS.title}>
                <PlatformKBigxAnalysisDiagram analysis={PLATFORM_K_BIGX_ANALYSIS.diagram} />
                <Outcome />
            </PlatformSection>

            <PlatformSection id="process" title={PLATFORM_K_BIGX_PROCESS.title}>
                <PlatformProcessSteps steps={PLATFORM_K_BIGX_PROCESS.steps} />
                <PlatformReveal className="mt-7">
                    <PlatformNotice
                        items={[
                            <>
                                {notice.before}
                                <Link
                                    href={`/${userType}/pricing`}
                                    className="hover:text-platform-bigx-accent-foreground outline-ring focus-visible:outline-ring rounded-xs font-bold underline underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-2"
                                >
                                    {notice.pricingLinkLabel}
                                </Link>
                                {notice.after}
                            </>,
                        ]}
                    />
                </PlatformReveal>
            </PlatformSection>

            <div className="grid-layout pt-14 pb-14 *:col-span-full md:pt-18 md:pb-18 xl:pt-24 xl:pb-24">
                <PlatformReveal>
                    <PlatformCtaBanner
                        tone="navy"
                        headingId={CTA_TITLE_ID}
                        title={PLATFORM_K_BIGX_CTA.title}
                        description={PLATFORM_K_BIGX_CTA.description}
                        actions={
                            <Button asChild size="lg">
                                <Link href={startHref}>{PLATFORM_K_BIGX_CTA.actionLabel}</Link>
                            </Button>
                        }
                    />
                </PlatformReveal>
            </div>
        </main>
    )
}

export {PlatformKBigxReport}
export type {PlatformKBigxReportProps}
