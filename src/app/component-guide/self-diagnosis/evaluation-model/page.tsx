import type {Metadata} from 'next'
import Image from 'next/image'
import {ChevronRight} from 'lucide-react'
import Link from 'next/link'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
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
import {cn} from '@/lib/utils'

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

// ── 서브페이지 푸터(임시) ─────────────────────────────────────────────────────────────────
// Figma "footer_area"(40006485:17762)를 이 화면에만 붙인 목업이다. 시안이 확정 전이라 공용
// 컴포넌트로 만들지 않고 여기서만 쓴다 — 확정되면 composite/footer 로 합치거나 별도 컴포넌트로 승격한다.
//
// 시안 값 → 간격: 위 56 / 로고행~정보 48 / 정보~하단 64 / 아래 40, 유틸 링크 24, 소셜 32.
// 색은 시안의 Hex(#111827·#e5e7eb·#d1d5db) 대신 같은 역할의 시맨틱 토큰을 쓴다. [PB-04]
const FOOTER_UTILITY_LINKS = [
    {label: '플랫폼 소개', href: '#'},
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항', href: '#'},
]

// 시안의 소셜 아이콘 5종(페이스북·엑스·유튜브·인스타그램·블로그)과 웹접근성 품질마크는 아직 없다 —
// Figma 프레임에 벡터 자식이 노출되지 않아 API 로 가져올 수 없고 브랜드 아이콘은 lucide 에도 없다([NA-008]).
// 실제 파일을 받으면 정보 영역 우측과 관련사이트 왼쪽에 넣는다.

const FOOTER_FAMILY_SITES = [
    {value: 'kibo', label: '기술보증기금'},
    {value: 'mss', label: '중소벤처기업부'},
    {value: 'smes', label: '중소벤처24'},
]

const footerLinkFocusClassName =
    'outline-ring focus-visible:outline-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

const SubPageFooter = () => (
    <footer aria-label="사이트 정보" className="border-subtle-3 bg-card text-foreground border-t">
        <div className="content-layout flex flex-col gap-16 pt-14 pb-10">
            <div className="flex flex-col gap-12">
                {/* 로고 + 유틸 링크 — 시안은 로고 좌측, 링크 우측 정렬이다. */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <Link href="#" className={cn('flex w-fit items-center', footerLinkFocusClassName)}>
                        <Image
                            src="/images/logo-kibo.svg"
                            alt="기술보증기금"
                            width={240}
                            height={32}
                            className="[display:var(--logo-on-light)] h-auto w-45 md:w-60"
                        />
                        <Image
                            src="/images/logo-kibo-white.svg"
                            alt="기술보증기금"
                            width={240}
                            height={32}
                            className="[display:var(--logo-on-dark)] h-auto w-45 md:w-60"
                        />
                    </Link>
                    <nav aria-label="푸터 유틸 메뉴">
                        <ul className="flex flex-wrap items-center gap-6">
                            {FOOTER_UTILITY_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            link.emphasized ? 'typo-body-xl-bold' : 'typo-body-xl-regular',
                                            footerLinkFocusClassName,
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* 고객센터·주소 */}
                <div className="flex flex-col gap-8 xl:flex-row xl:justify-between">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="flex flex-wrap items-baseline gap-4">
                                <span className="typo-title-m-bold">대표전화</span>
                                <span className="typo-h4-bold">1544-1120</span>
                            </p>
                            <p className="typo-body-xl-regular">평일 09:00 ~ 18:00 (토요일 및 공휴일 휴무)</p>
                        </div>
                        <p className="typo-body-xl-regular">48400 부산광역시 남구 문현금융로 33 기술보증기금</p>
                    </div>
                </div>
            </div>

            {/* 저작권 + 품질마크·관련사이트 */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <p className="typo-body-l-regular">ⓒ The Government of the Republic of Korea. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Select>
                        <SelectTrigger aria-label="관련 사이트" className="w-47">
                            <SelectValue placeholder="관련사이트" />
                        </SelectTrigger>
                        <SelectContent>
                            {FOOTER_FAMILY_SITES.map((site) => (
                                <SelectItem key={site.value} value={site.value}>
                                    {site.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    </footer>
)

// 평가모형 선택 목업 — Figma "[자가진단] 평가모형선택". 메인페이지 2섹션의 "자가진단 시작하기" CTA 로 진입한다.
// 화면 구성은 전부 기존 컴포넌트 조합이다: Header · PageTitleBar(+Breadcrumb) · OptionCard · InfoBox. 푸터만 이 화면 전용 목업이다.
const EvaluationModelPage = () => (
    <div className="bg-card flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <Header overlay={false} showThemeToggle navigationByUserType={PLATFORM_NAVIGATION} />

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
                            illustration={
                                // preflight 의 img { height: auto } 가 높이만 덮어써 next/image 비율 경고가 뜬다.
                                // 시안 이미지 영역은 148×100 고정이라 style 로 두 값을 함께 잠근다(가이드와 동일).
                                <Image
                                    src={model.illustration}
                                    alt=""
                                    width={148}
                                    height={100}
                                    priority
                                    style={{width: 148, height: 100}}
                                />
                            }
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

        <SubPageFooter />
    </div>
)

export default EvaluationModelPage
