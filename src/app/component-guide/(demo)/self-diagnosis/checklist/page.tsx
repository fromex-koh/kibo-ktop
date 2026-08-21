import type {Metadata} from 'next'
import FinalSubmitNavigation from './final-submit-navigation'
import SelfDiagnosisInputHeader from '@/components/composite/self-diagnosis-input-header'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
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
import {StepHeader} from '@/components/composite/step-header'
import {ChecklistForm} from '@/components/composite/checklist-form'
// 업종코드가 제조일 때의 한 벌 — 목업 화면이라 갈래 하나만 보여 준다.
import {KTRS_FM_MANUFACTURING_CHECKLIST} from '@/content/technology-evaluation/ktrs-fm-checklist'
import {Badge} from '@/components/ui/badge'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '체크리스트 입력'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#checklist', label: '체크리스트 바로가기'},
]

const COMPANY_INFO_PATH = '/component-guide/self-diagnosis/company-info'

// 자가진단 3단계 목업 — Figma "[자가진단] 3단계_체크리스트 입력".
// 2단계(기업·기술정보 입력)의 "다음" 버튼으로 진입한다. 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · StepHeader(progress) · FormCard · QuestionList · QuestionGroupHeader ·
// Chip · Select · Checkbox · Badge · StepNavigation.
const ChecklistPage = () => (
    <div className="bg-background flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <SelfDiagnosisInputHeader
            overlay={false}
            showThemeToggle
            logoHref="/component-guide/main-page"
            navigationByUserType={DEFAULT_HEADER_NAVIGATION}
        />

        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다. */}
        <main id="main" tabIndex={-1} className="content-layout flex flex-1 flex-col gap-10 pt-10">
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
                                <BreadcrumbLink href="/component-guide/main-page">홈</BreadcrumbLink>
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

            <StepHeader
                title="체크리스트 입력"
                description="평가 항목별 체크리스트를 작성해 주세요. 해당사항에 맞게 선택해 주십시오."
                steps={SELF_DIAGNOSIS_STEPS}
                current={3}
            />

            {/* 카드와 스텝 헤더 사이는 60px(시안) — main 의 gap-10(40) 에 20 을 더한다. */}
            <div className="mt-5">
                <ChecklistForm data={KTRS_FM_MANUFACTURING_CHECKLIST} id="checklist" />
            </div>
        </main>

        {/* 하단 CTA — '다음'은 바로 넘어가지 않고 최종 확인 모달을 먼저 띄운다(시안 [자가진단] alert). */}
        <FinalSubmitNavigation prevHref={COMPANY_INFO_PATH} completeHref="/component-guide/self-diagnosis/complete" />
    </div>
)

export default ChecklistPage
