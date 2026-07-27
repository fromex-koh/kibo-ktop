import type {Metadata} from 'next'
import Link from 'next/link'
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

// 자가진단 4단계 제출 완료 데모. 3단계 체크리스트의 "다음" 버튼으로 진입한다.
// 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · ActionCheck(완료 애니메이션) · InfoBox · Button · StepNavigation.
// 진행 표시(StepHeader)는 이 화면에 없다 — 흐름이 끝나 완료 메시지만 남는다(시안 동일).
const SelfDiagnosisCompletePage = () => (
    <ViewportFitLayout
        header={
            <>
                <SkipNav links={SKIP_LINKS} />
                <Header overlay={false} showThemeToggle navigationByUserType={PLATFORM_NAVIGATION} />
            </>
        }
        footer={
            <StepNavigation
                appearance="plain"
                className="[&>div]:py-[clamp(--spacing(3),2dvh,--spacing(6))]"
                prev={{asChild: true, children: <Link href={MAIN_PAGE_PATH}>메인으로 이동</Link>}}
                next={{children: '결과조회'}}
            />
        }
        // 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다.
        mainProps={{id: 'main', tabIndex: -1}}
    >
        <PageTitleBar
            title="KTRS-FM"
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
                            <BreadcrumbLink href="/component-guide/self-diagnosis/evaluation-model">
                                KTRS-FM
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>제출 완료</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
        />

        {/* 완료 알림 — 애니메이션(150px) 바로 아래에 완료 문구가 온다(시안). 완료 사실은 문구가 전달하므로
                애니메이션은 장식으로 두고(decorative) 접근성 트리에서 제외한다[5.1.1]. */}
        <div className="flex flex-col items-center">
            <ActionCheck decorative />
            <h2 className="typo-h2-bold text-foreground text-center text-balance">
                자가진단 - KTRS-FM 평가 완료되었습니다.
            </h2>
        </div>

        <InfoBox variant="outline" title="알려드려요" className="py-[clamp(--spacing(4),3dvh,--spacing(8))]">
            <InfoBoxItem>제출하신 자가진단 결과는 마이페이지 &gt; 진행현황 조회에서 확인할 수 있어요.</InfoBoxItem>
            <InfoBoxItem>진단 결과발송은 마이페이지 &gt; 진행현황 조회에서 진행할 수 있어요.</InfoBoxItem>
            <InfoBoxItem>
                은행으로 평가결과를 전송하려면{' '}
                <Button type="button" variant="text-underline" size="md">
                    은행전송
                </Button>
                을 선택하거나 마이페이지 &gt; 평가결과 조회에서 진행할 수 있어요.
            </InfoBoxItem>
            <InfoBoxItem>
                기관으로 평가결과를 전송하려면{' '}
                <Button type="button" variant="text-underline" size="md">
                    보증신청
                </Button>
                을 선택하거나 마이페이지 &gt; 평가결과 조회에서 진행할 수 있어요.
            </InfoBoxItem>
        </InfoBox>
    </ViewportFitLayout>
)

export default SelfDiagnosisCompletePage
