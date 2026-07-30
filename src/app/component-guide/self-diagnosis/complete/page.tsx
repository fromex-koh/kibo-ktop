import type {Metadata} from 'next'
import Link from 'next/link'
import {SquareArrowOutUpRight} from 'lucide-react'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
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
import {StepNavigation} from '@/components/composite/step-navigation'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {ViewportFitLayout} from '@/components/composite/viewport-fit-layout'
import {ActionCheck} from '@/components/custom/action-check'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '제출 완료'}

const SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

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

const MAIN_PAGE_PATH = '/component-guide/main-page'

// 시안(알려드려요)은 안내 문장 중 이동 경로만 본문(gray.500)보다 진한 foreground(gray.900)로 강조한다.
// Figma 에서는 문자 단위 색 override 라 텍스트 노드 색만 보면 드러나지 않는다 — 렌더 이미지로 확인했다.
const ResultPath = () => <span className="text-foreground">마이페이지 &gt; 평가결과 조회</span>

// 자가진단 4단계 제출 완료 데모. 3단계 체크리스트의 "다음" 버튼으로 진입한다.
// 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · ActionCheck(완료 애니메이션) · InfoBox · Button · StepNavigation.
// 진행 표시(StepHeader)는 이 화면에 없다 — 흐름이 끝나 완료 메시지만 남는다(시안 동일).
const SelfDiagnosisCompletePage = () => (
    <ViewportFitLayout
        // max-h-dvh — 셸의 기본은 min-h-dvh 라 내용이 넘치면 그대로 늘어난다(= 아래 간격들이 줄지 않는다).
        // 상한을 두면 자리가 모자랄 때 flex 가 간격부터 줄여 한 화면에 담긴다. 간격을 다 줄여도 모자라면
        // 그때는 셸의 원래 동작대로 넘쳐 문서 스크롤로 넘어간다(잘리지 않는다).
        className="max-h-dvh"
        header={
            <>
                <SkipNav links={SKIP_LINKS} />
                <Header
                    overlay={false}
                    showThemeToggle
                    logoHref="/component-guide/main-page"
                    navigationByUserType={PLATFORM_NAVIGATION}
                />
            </>
        }
        // 세로 간격은 시안([자가진단] 5단계_제출 완료, 1920×1080)을 기준으로 화면 높이에 같은 비율로
        // 따라간다 — 헤더 아래 40px(3.7dvh), 타이틀 아래 100px(9.26dvh), 문구 아래 60px(5.56dvh),
        // 안내상자 아래 40px(3.7dvh).
        //
        // 간격을 gap 이 아니라 별도 요소로 둔 이유 — 헤더·타이틀·안내상자는 높이가 고정이라 화면이
        // 낮아져도 줄지 않는다. 간격만 비율로 줄이면 1366×768 에서 55px 이 넘쳐 스크롤이 생겼다.
        // flex 항목으로 두면 자리가 모자랄 때 네 간격이 각자 크기에 비례해 함께 줄어 한 화면에 남는다.
        // 공용 셸의 기본값은 다른 완료·결과 화면도 쓰므로 이 화면에서만 덮어쓴다.
        mainProps={{id: 'main', tabIndex: -1, className: 'gap-0 pt-0 [&>:not([aria-hidden])]:shrink-0'}}
    >
        <div aria-hidden="true" className="h-[clamp(--spacing(2),3.7dvh,--spacing(10))]" />

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
                            <BreadcrumbLink href={MAIN_PAGE_PATH}>홈</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
                                기술평가
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>KTRS-FM</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
        />

        <div aria-hidden="true" className="h-[clamp(--spacing(5),9.26dvh,--spacing(25))]" />

        {/* 완료 알림 — 완료 사실은 문구가 전달하므로 애니메이션은 장식으로 두고 접근성 트리에서 제외한다. */}
        <div className="flex flex-col items-center">
            <ActionCheck decorative />
            <h2 className="typo-h2-bold text-foreground text-center text-balance">KTRS-FM 기술평가가 완료되었어요.</h2>
        </div>

        <div aria-hidden="true" className="h-[clamp(--spacing(3),5.56dvh,--spacing(15))]" />

        <div className="flex flex-col gap-[clamp(--spacing(2),3.7dvh,--spacing(10))]">
            <InfoBox variant="outline" title="알려드려요">
                <InfoBoxItem>
                    제출하신 기술평가 결과는 <ResultPath />
                    에서 확인할 수 있어요.
                </InfoBoxItem>
                <InfoBoxItem>
                    기술평가 결과발송은 <ResultPath />
                    에서 진행할 수 있어요.
                </InfoBoxItem>
                <InfoBoxItem>
                    은행으로 평가결과를 전송하려면{' '}
                    <Button type="button" variant="text-underline" size="md">
                        은행전송
                        <SquareArrowOutUpRight aria-hidden="true" />
                    </Button>
                    을 선택하거나 <ResultPath />
                    에서 진행할 수 있어요.
                </InfoBoxItem>
                <InfoBoxItem>
                    기관으로 평가결과를 전송하려면{' '}
                    <Button type="button" variant="text-underline" size="md">
                        보증신청
                        <SquareArrowOutUpRight aria-hidden="true" />
                    </Button>
                    을 선택하거나 <ResultPath />
                    에서 진행할 수 있어요.
                </InfoBoxItem>
            </InfoBox>

            {/* InfoBox 아래 간격 — 시안 40px(3.7dvh)로 후속 액션을 배치한다. */}
            <StepNavigation
                appearance="plain"
                className="[&>div]:max-w-none [&>div]:px-0 [&>div]:py-0"
                prev={{asChild: true, children: <Link href={MAIN_PAGE_PATH}>메인으로 이동</Link>}}
                next={{children: '결과조회'}}
            />
        </div>
    </ViewportFitLayout>
)

export default SelfDiagnosisCompletePage
