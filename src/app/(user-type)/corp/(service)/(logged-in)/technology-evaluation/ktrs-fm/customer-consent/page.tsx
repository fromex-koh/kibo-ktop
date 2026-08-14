import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {EmailField} from '@/components/composite/email-field'
import {FormCard} from '@/components/composite/form-card'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {StepHeader} from '@/components/composite/step-header'
import {
    CustomerConsentAgreement,
    CustomerConsentForm,
    CustomerConsentProvider,
    CustomerConsentStepNavigation,
} from '@/components/custom/customer-consent-agreement'
import {Badge} from '@/components/ui/badge'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '고객 정보 활용 동의'}

// 다음 화면 — 기술평가 > KTRS-FM > (2) 기업·기술정보 입력.
const COMPANY_TECHNOLOGY_INFO_PATH = '/corp/technology-evaluation/ktrs-fm/company-technology-info'
// 폼과 CTA를 잇는 이름 — [동의 후 인증서명] 이 폼 바깥(화면 맨 아래)에 있어 form 속성으로 연결한다.
const FORM_ID = 'customer-consent-form'

const CorpKtrsFmCustomerConsentPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 동의서와 하단 CTA가 동의 상태를 공유한다. */}
        <CustomerConsentProvider>
            {/* 콘텐츠 폭은 공통 grid-layout을 따르고, 하단 여백은 StepNavigation이 담당한다. */}
            <CustomerConsentForm formId={FORM_ID} nextHref={COMPANY_TECHNOLOGY_INFO_PATH}>
                <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
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
                                        <BreadcrumbLink href="/">홈</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbDotSeparator />
                                    <BreadcrumbItem>
                                        <span>기술평가</span>
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
                        title="고객 정보 활용 동의"
                        description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해 주세요."
                        steps={SELF_DIAGNOSIS_STEPS}
                        current={1}
                    />

                    <CustomerConsentAgreement />

                    <FormCard
                        title="부분발송 이메일등록"
                        subtitle="안내문을 추가로 받으실 이메일 주소를 입력해 주세요."
                    >
                        {/* 아이디·도메인을 분리 입력하고 제출 시 하나의 이메일 값으로 조합한다. */}
                        <EmailField name="additionalNoticeEmail" />
                    </FormCard>
                </div>
            </CustomerConsentForm>

            <CustomerConsentStepNavigation formId={FORM_ID} />
        </CustomerConsentProvider>
    </main>
)

export default CorpKtrsFmCustomerConsentPage
