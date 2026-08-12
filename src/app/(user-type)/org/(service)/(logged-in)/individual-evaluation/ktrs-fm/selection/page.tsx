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
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '진행방식 선택'}

// 진행방식 — 기업이 보낸 자가진단 내역을 검증할지, 새 개별평가를 신청할지 고른다. 카드 전체가 다음 화면 링크다.
// description 을 문장 단위 배열로 두는 이유 — 시안은 두 문장을 각자 한 줄에 놓는다(문장 사이 줄바꿈).
// 한 문자열로 두면 폭에 따라 문장 중간에서 접혀 시안과 다른 자리에서 끊긴다.
const EVALUATION_METHODS = [
    {
        // 마이페이지 > 평가검증 신청 조회(org-mypage-verification-application).
        href: '/org/mypage/verification-application',
        title: '평가검증 하기',
        subtitle: 'KTRS-FM',
        description: [
            '기업이 은행으로 전송한 자가진단 입력정보를 수정하여 평가검증을 진행합니다.',
            '평가검증 신청 조회 화면으로 이동합니다.',
        ],
        illustration: '/images/option-card/ktrs-fm.webp',
    },
    {
        // 개별평가 > KTRS-FM > (1) 고객정보활용동의(org-individual-evaluation-ktrs-fm-customer-consent).
        href: '/org/individual-evaluation/ktrs-fm/customer-consent',
        title: '개별평가 하기',
        subtitle: 'KTRS-FM',
        description: [
            '기업의 자가진단 전송 내역과 관계없이 새로운 KTRS-FM 개별평가를 신청합니다.',
            '고객정보활용동의 단계로 이동합니다.',
        ],
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

// 시안 "알려드려요" 안내 문구.
const NOTICES = [
    '협약기관은 횟수 제한 없이 개별평가가 가능합니다.',
    '평가를 신청하시면, 기술사업성 평가가 자동으로 진행됩니다.',
    '협약기관에서는 평가를 진행하는 업체로부터 반드시 정보이용동의 PDF를 징구받아 업로드 바랍니다.',
] as const

// 시안 이미지 영역은 148×100 고정이다. preflight 의 img { height: auto } 가 높이만 덮어써
// next/image 비율 경고가 뜨므로 style 로 두 값을 함께 잠근다(OptionCard 가이드와 동일).
const ILLUSTRATION_SIZE = {width: 148, height: 100} as const

// 기관 개별평가 KTRS-FM 진행방식 선택 — Figma "1단계_평가진행방식 선택".
// 화면 구성은 기존 컴포넌트 조합이다: PageTitleBar(+Breadcrumb) · OptionCard · InfoBox.
const OrgKtrsFmSelectionPage = () => (
    // 시안의 화면 배경은 흰색(카드 면)이고, 그 위에서 안내 상자만 회색으로 떠 있다.
    <main id="main" tabIndex={-1} className="bg-card flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout을 따른다. 카드가 곧 다음 화면 링크라 하단 CTA 바는 두지 않는다. */}
        <div className="grid-layout gap-y-10 pt-7 pb-25 *:col-span-full md:pt-10">
            <div className="flex flex-col gap-2">
                <PageTitleBar
                    title="신속표준모형"
                    badge={
                        <Badge variant="solid" color="info" shape="round">
                            KTRS-FM
                        </Badge>
                    }
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <span>개별평가</span>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <p className="typo-body-xl-regular text-foreground-subtle">
                    기업이 전송한 자가진단 내역이 있습니다. 전송된 내역을 검증하려면 [평가검증 하기], 새로운 평가를
                    진행하려면 [개별평가 하기]를 선택해 주세요.
                </p>
            </div>

            <section aria-labelledby="evaluation-methods-title">
                {/* 카드 제목은 heading 이 아니라 강조 텍스트라(OptionCard 규칙) 목록 제목을 여기서 제공한다. */}
                <h2 id="evaluation-methods-title" className="sr-only">
                    진행방식 목록
                </h2>
                {/* 2단은 xl(1280)부터다 — 카드 한 장에 제목 28px·설명 두 줄·148px 일러스트가 나란히 들어가야 해서
                    태블릿 폭(md~xl)에서 2단으로 쪼개면 설명이 여러 줄로 접히고 일러스트가 눌린다. */}
                <div className="grid gap-6 xl:grid-cols-2">
                    {EVALUATION_METHODS.map((method) => (
                        <OptionCard
                            key={method.title}
                            href={method.href}
                            title={method.title}
                            subtitle={method.subtitle}
                            description={
                                <>
                                    {method.description[0]}
                                    <br />
                                    {method.description[1]}
                                </>
                            }
                            // 제목·설명이 정보를 전달하므로 일러스트는 장식이다([5.1.1]).
                            illustration={
                                <Image
                                    src={method.illustration}
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

export default OrgKtrsFmSelectionPage
