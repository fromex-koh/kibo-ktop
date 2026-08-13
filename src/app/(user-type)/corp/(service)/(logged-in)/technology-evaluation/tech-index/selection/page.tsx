import type {Metadata} from 'next'
import Image from 'next/image'
import {CircleAlert} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {OptionCard} from '@/components/composite/option-card'
import {PageTitleBar} from '@/components/composite/page-title-bar'

export const metadata: Metadata = {title: '평가모형 선택'}

// Tech-Index 평가모형 — 일반용/창업용 두 갈래로 나뉘고, 카드 전체가 각 갈래의 1단계 링크다.
// description 을 문장 단위 배열로 두는 이유 — 시안은 두 문장을 각자 한 줄에 놓는다(문장 사이 줄바꿈).
// 한 문자열로 두면 폭에 따라 문장 중간에서 접혀 시안과 다른 자리에서 끊긴다.
// 부제(subtitle) — 시안의 (일반) 카드에는 "KTRS-FM"이 적혀 있으나 두 카드 모두 Tech-Index 모형이라
// KTRS-FM 카드에서 복제된 흔적으로 보고 "Tech-Index"로 맞췄다(뱃지와 같은 값). 시안 확정 시 재확인 필요.
const EVALUATION_MODELS = [
    {
        // 이동할 화면(기술평가 > Tech-Index > 일반용 > (1) 고객정보활용동의 —
        // corp-technology-evaluation-tech-index-general-customer-consent)이 아직 없어 '#' 로 둔다.
        href: '#',
        badge: 'Tech-Index',
        title: '혁신성장지수 (일반)',
        subtitle: 'Tech-Index',
        description: [
            '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
            '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
        ],
        illustration: '/images/option-card/growth-index.webp',
    },
    {
        // 이동할 화면(기술평가 > Tech-Index > 창업용 > (1) 고객정보활용동의 —
        // corp-technology-evaluation-tech-index-startup-customer-consent)이 아직 없어 '#' 로 둔다.
        href: '#',
        badge: 'Tech-Index',
        title: '혁신성장지수 (창업)',
        subtitle: 'Tech-Index',
        description: [
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다.',
            '보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        ],
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

// 시안 "알려드려요" 안내 문구.
const NOTICES = [
    '기업의 자가진단용 기술사업평가는 기술ONE플랫폼 기업회원에 한해 월 1회 무료로 제공됩니다.',
    '기술사업평가를 신청하시면 국내최초 개방형 평가모형인 KTRS-FM을 통한 기술사업성 평가가 자동으로 진행됩니다.',
    '평가 신청 시 기업·기술 정보 및 체크리스트를 사실에 기반하여 작성해주셔야 정확한 평가가 가능합니다.',
] as const

// 시안 이미지 영역은 148×100 고정이다. preflight 의 img { height: auto } 가 높이만 덮어써
// next/image 비율 경고가 뜨므로 style 로 두 값을 함께 잠근다(OptionCard 가이드와 동일).
const ILLUSTRATION_SIZE = {width: 148, height: 100} as const

// 기업 기술평가 Tech-Index 평가모형 선택 — Figma "[혁신성장지수 평가 Tech-Index]".
// 화면 구성은 기존 컴포넌트 조합이다: PageTitleBar(+Breadcrumb) · OptionCard · InfoBox.
// 시안 하단에 남아 있는 CTA 버튼([이전]·[동의 후 인증서명]·[메인]·[결과조회])은 다른 단계 화면에서
// 복제된 잔여 요소다 — 카드가 곧 다음 화면 링크라 이 화면에는 하단 CTA 바를 두지 않는다.
const CorpTechIndexSelectionPage = () => (
    // 시안의 화면 배경은 흰색(카드 면)이고, 그 위에서 안내 상자만 회색으로 떠 있다.
    <main id="main" tabIndex={-1} className="bg-card flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout을 따른다. */}
        <div className="grid-layout gap-y-10 pt-7 pb-25 *:col-span-full md:pt-10">
            <div className="flex flex-col gap-2">
                <PageTitleBar
                    title="Tech-Index"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>기술평가</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <p className="typo-body-xl-regular text-foreground-subtle">Tech-Index 평가모형을 선택해 주세요.</p>
            </div>

            <section aria-labelledby="evaluation-models-title">
                {/* 카드 제목은 heading 이 아니라 강조 텍스트라(OptionCard 규칙) 목록 제목을 여기서 제공한다. */}
                <h2 id="evaluation-models-title" className="sr-only">
                    평가모형 목록
                </h2>
                {/* 2단은 xl(1280)부터다 — 카드 한 장에 제목 28px·설명 두 줄·148px 일러스트가 나란히 들어가야 해서
                    태블릿 폭(md~xl)에서 2단으로 쪼개면 설명이 여러 줄로 접히고 일러스트가 눌린다. */}
                <div className="grid gap-6 xl:grid-cols-2">
                    {EVALUATION_MODELS.map((model) => (
                        <OptionCard
                            key={model.title}
                            href={model.href}
                            badge={model.badge}
                            title={model.title}
                            subtitle={model.subtitle}
                            description={
                                <>
                                    {model.description[0]}
                                    <br />
                                    {model.description[1]}
                                </>
                            }
                            // 제목·설명이 정보를 전달하므로 일러스트는 장식이다([5.1.1]).
                            illustration={
                                <Image
                                    src={model.illustration}
                                    alt=""
                                    draggable={false}
                                    {...ILLUSTRATION_SIZE}
                                    priority
                                    style={ILLUSTRATION_SIZE}
                                />
                            }
                        />
                    ))}
                </div>
            </section>

            <InfoBox title="알려드려요" icon={<CircleAlert />}>
                {NOTICES.map((notice) => (
                    <InfoBoxItem key={notice}>{notice}</InfoBoxItem>
                ))}
            </InfoBox>
        </div>
    </main>
)

export default CorpTechIndexSelectionPage
