import type {Metadata} from 'next'
import Image from 'next/image'
import {ChevronRight} from 'lucide-react'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import Footer from '@/components/composite/footer'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {OptionCard} from '@/components/composite/option-card'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'

export const metadata: Metadata = {title: '기술평가 평가모형 선택'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#evaluation-models', label: '평가모형 목록 바로가기'},
]

// 메인페이지 목업과 같은 주 메뉴 구성(시안 GNB). 실제 경로는 화면 목업이라 '#' 로 둔다.
const PLATFORM_NAVIGATION = {
    corp: [
        {label: '플랫폼 소개', href: '#'},
        {label: '기술평가', href: '#'},
        {label: '특허평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
    org: [
        {label: '플랫폼 소개', href: '#'},
        {label: '개별평가', href: '#'},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '특허평가', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
} satisfies HeaderNavigationByUserType

// 평가모형 카드 — 시안의 두 모형. 일러스트는 OptionCard 가이드와 같은 경로 규약을 따른다.
const EVALUATION_MODELS = [
    {
        // 선택하면 자가진단 1단계(고객 정보 활용 동의)로 진입한다.
        href: '/component-guide/self-diagnosis/customer-consent',
        badge: '혁신평가',
        title: '혁신성장지수 평가',
        subtitle: 'Tech-Index',
        description:
            '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다. 기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
        illustration: '/images/option-card/growth-index.webp',
    },
    {
        // 창업용 모형 화면은 아직 시안이 없어 같은 1단계로 연결한다.
        href: '/component-guide/self-diagnosis/customer-consent',
        badge: '혁신평가',
        title: '창업용 Tech-Index',
        subtitle: '창업기업용',
        description:
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다. 보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

// 시안 "알려드려요" 안내 문구.
const NOTICES = [
    '기업의 자가진단용 기술사업평가는 기술ONE플랫폼 기업회원에 한해 월 1회 무료로 제공됩니다.',
    '기술사업평가를 신청하시면 국내최초 개방형 평가모형인 KTRS-FM을 통한 기술사업성 평가가 자동으로 진행됩니다.',
    '평가 신청 시 기업·기술 정보 및 체크리스트를 사실에 기반하여 작성해주셔야 정확한 평가가 가능합니다.',
    '아래 기술사업평가 신청 버튼을 누르면 평가를 위한 정보 입력화면으로 이동합니다.',
] as const

// 평가모형 선택 목업 — Figma "[자가진단] 평가모형선택". 메인페이지 2섹션의 "자가진단 시작하기" CTA 로 진입한다.
// 화면 구성은 전부 기존 컴포넌트 조합이다: Header · PageTitleBar(+Breadcrumb) · OptionCard · InfoBox · Footer.
const EvaluationModelPage = () => (
    <div className="bg-card flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <Header navigationByUserType={PLATFORM_NAVIGATION} />

        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다. */}
        <main id="main" tabIndex={-1} className="content-layout flex flex-col gap-15 pt-10 pb-25">
            <div className="flex flex-col gap-2">
                <PageTitleBar
                    title="기술평가"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>기술평가</BreadcrumbPage>
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="text-foreground size-icon-sm shrink-0"
                                    />
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <p className="typo-title-l-medium text-foreground">기술평가를 진행할 평가모형을 선택해주세요.</p>
            </div>

            <section id="evaluation-models" aria-labelledby="evaluation-models-title" tabIndex={-1}>
                {/* 카드 제목은 heading 이 아니라 강조 텍스트라(OptionCard 규칙) 목록 제목을 여기서 제공한다. */}
                <h2 id="evaluation-models-title" className="sr-only">
                    평가모형 목록
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {EVALUATION_MODELS.map((model) => (
                        <OptionCard
                            key={model.title}
                            href={model.href}
                            badge={model.badge}
                            title={model.title}
                            subtitle={model.subtitle}
                            description={model.description}
                            // 제목·설명이 정보를 전달하므로 일러스트는 장식이다([5.1.1]).
                            illustration={<Image src={model.illustration} alt="" width={148} height={100} priority />}
                        />
                    ))}
                </div>
            </section>

            {/* 시안의 하단 안내는 제목 앞 아이콘이 없다 — icon 슬롯을 비워 제목만 렌더한다. */}
            <InfoBox title="알려드려요">
                {NOTICES.map((notice) => (
                    <InfoBoxItem key={notice}>{notice}</InfoBoxItem>
                ))}
            </InfoBox>
        </main>

        <Footer showMarquee={false} />
    </div>
)

export default EvaluationModelPage
