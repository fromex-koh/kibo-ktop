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
    CustomerConsentProvider,
    CustomerConsentStepNavigation,
} from '@/components/custom/customer-consent-agreement'
import {Badge} from '@/components/ui/badge'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '고객 정보 활용 동의'}

const CorpKtrsFmCustomerConsentPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 동의서와 하단 CTA가 같은 동의 상태를 사용하도록 Provider로 감싼다. */}
        <CustomerConsentProvider>
            {/* 하단 간격은 StepNavigation이 담당하므로 콘텐츠에 별도 bottom padding을 추가하지 않는다. */}
            <div className="content-layout flex flex-col gap-10 pt-10">
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
                                    {/* 현재 평가 모형 코드를 표시한다. */}
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

                <FormCard title="부분발송 이메일등록" subtitle="안내문을 추가로 받으실 이메일 주소를 입력해 주세요.">
                    {/* 아이디·도메인은 화면에서 나누어 입력하고, 서버에는 하나의 이메일 주소로 전달한다. */}
                    <EmailField name="additionalNoticeEmail" />
                </FormCard>
            </div>

            <CustomerConsentStepNavigation />
        </CustomerConsentProvider>
    </main>
)

export default CorpKtrsFmCustomerConsentPage
