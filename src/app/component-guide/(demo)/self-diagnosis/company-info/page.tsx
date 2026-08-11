import type {Metadata} from 'next'
import SelfDiagnosisInputHeader from '@/components/composite/self-diagnosis-input-header'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import AutosaveToast from '@/components/custom/autosave-toast'
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
import {StepNavigation} from '@/components/composite/step-navigation'
// 입력값은 FormValues 보관소에 모인다 — 탭을 옮기거나 화면 폭이 바뀌어도 입력한 내용이 남는다.
// 실제 연동에서는 form-values.tsx 의 Provider·래퍼만 폼 라이브러리로 바꾸면 이 화면은 그대로 쓸 수 있다.
import {FormValuesProvider} from '@/components/composite/form-values'
import {COMPANY_ETC_DEFAULT_VALUES} from '@/components/composite/company-etc-form'
// 탭 구성 — 컴포넌트 가이드(FormTabs)도 같은 것을 쓴다.
import {FormTabs} from '@/components/composite/form-tabs'
import {SELF_DIAGNOSIS_FORM_TABS} from '@/components/composite/self-diagnosis-form-tabs'
import {Badge} from '@/components/ui/badge'
import Link from 'next/link'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#main', label: '본문 바로가기'},
    {href: '#company-form', label: '입력 폼 바로가기'},
]

const CONSENT_PATH = '/component-guide/self-diagnosis/customer-consent'

// 자가진단 2단계 목업 — Figma "[자가진단] 2단계_기업정보·기술정보 입력_기업정보".
// 1단계(고객 정보 활용 동의)의 "동의 후 인증서명" 버튼으로 진입한다. 전부 기존 컴포넌트 조합이다:
// Header · PageTitleBar(+Breadcrumb) · StepHeader(progress) · FormTabs · FormCard · Select/Input/DatePicker ·
// Alert · SubSectionHeader · Separator · StepNavigation.
const CompanyInfoPage = () => (
    <div className="bg-background flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <SelfDiagnosisInputHeader
            overlay={false}
            showThemeToggle
            logoHref="/component-guide/main-page"
            navigationByUserType={DEFAULT_HEADER_NAVIGATION}
        />

        {/* 자동저장 토스트 — 시안의 토스트 노출 예시. 화면을 열면 한 번 뜬다(렌더 결과는 없음). */}
        <AutosaveToast />

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
                title="기업·기술정보 입력"
                description="평가에 필요한 기업 및 기술 정보를 입력해 주세요."
                steps={SELF_DIAGNOSIS_STEPS}
                current={2}
            />

            {/* 탭과 스텝 헤더 사이는 60px(시안) — main 의 gap-10(40) 에 20 을 더한다.
                값 보관소가 FormTabs 를 감싼다 — 탭을 옮기거나 화면 폭이 바뀌어도 입력한 값이 남는다. */}
            <FormValuesProvider defaultValues={COMPANY_ETC_DEFAULT_VALUES}>
                <FormTabs items={SELF_DIAGNOSIS_FORM_TABS} className="mt-5" />
            </FormValuesProvider>
        </main>

        {/* 하단 CTA — 본문 끝에 그대로 붙는 블록이다. */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={CONSENT_PATH}>이전</Link>}}
            next={{
                asChild: true,
                children: <Link href="/component-guide/self-diagnosis/checklist">다음</Link>,
            }}
        />
    </div>
)

export default CompanyInfoPage
