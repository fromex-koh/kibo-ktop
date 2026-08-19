import type {Metadata} from 'next'
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
import {StepHeader} from '@/components/composite/step-header'
import {StepNavigation} from '@/components/composite/step-navigation'
import {ORG_INVESTMENT_MODEL_STEPS} from '@/constants/technology-evaluation'
import {OrgCustomerConsentForm} from '@/components/composite/org-customer-consent-form'

export const metadata: Metadata = {title: '고객정보활용동의'}

const SELECTION_PATH = '/org/individual-evaluation/investment-model/selection'
const COMPANY_TECHNOLOGY_INFO_PATH = '/org/individual-evaluation/investment-model/company-technology-info'
// 폼 바깥(화면 맨 아래)에 있는 [다음] 버튼을 form 속성으로 잇는 이름.
const FORM_ID = 'org-customer-consent-form'

// 기관 개별평가 투자모형 1단계 고객정보활용동의 — Figma "1단계_고객정보활용동의".
// 화면 뼈대는 기존 조합이다: PageTitleBar(+Breadcrumb) · StepHeader · FormCard · StepNavigation.
// 입력 카드 두 장과 제출 검사는 OrgCustomerConsentForm 이 갖는다.
const OrgInvestmentModelCustomerConsentPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout 을 따르고, 하단 여백은 StepNavigation 이 담당한다. */}
        <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
            <PageTitleBar
                title="투자모형"
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
                                <BreadcrumbPage>투자모형</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 단계 목록은 공통 상수, current 만 화면마다 다르다. */}
            <StepHeader
                title="고객정보활용동의"
                description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
                steps={ORG_INVESTMENT_MODEL_STEPS}
                current={1}
            />

            <OrgCustomerConsentForm
                formId={FORM_ID}
                nextHref={COMPANY_TECHNOLOGY_INFO_PATH}
                logLabel="기관 개별평가 투자모형"
            />
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다(검사 → 다음 단계 이동). */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={SELECTION_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export default OrgInvestmentModelCustomerConsentPage
