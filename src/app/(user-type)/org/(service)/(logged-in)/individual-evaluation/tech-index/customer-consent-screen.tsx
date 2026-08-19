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
import {Badge} from '@/components/ui/badge'
import {ORG_TECH_INDEX_STEPS} from '@/constants/technology-evaluation'
import {OrgCustomerConsentForm} from '@/components/composite/org-customer-consent-form'
import {TECH_INDEX_MODEL_META, TECH_INDEX_SELECTION_PATH, type TechIndexModel} from './model-meta'

// 폼 바깥(화면 맨 아래)에 있는 [다음] 버튼을 form 속성으로 잇는 이름.
const FORM_ID = 'org-tech-index-customer-consent-form'

// 기관 개별평가 Tech-Index (2) 고객정보활용동의 화면 셸 — 신속표준모형(KTRS-FM) 1단계와 같은 화면이다.
// 일반용/창업용 라우트가 model 만 다르게 넘겨 공유한다(제목과 앞뒤 경로가 갈린다).
// 기관은 업체에서 이미 받은 정보이용동의서를 올리는 흐름이라 동의 여부 확인 + 파일 업로드 두 카드로 끝나고,
// 입력 카드 두 장과 제출 검사는 KTRS-FM 의 OrgCustomerConsentForm 을 그대로 쓴다(단일 소스).
// 이 화면에서 달라지는 것은 상단 제목·브레드크럼(Tech-Index)과 진행 단계(3단계), 앞뒤 경로뿐이다.
const TechIndexCustomerConsentScreen = ({model}: {model: TechIndexModel}) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout 을 따르고, 하단 여백은 StepNavigation 이 담당한다. */}
        <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
            <PageTitleBar
                title={TECH_INDEX_MODEL_META[model].title}
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        Tech-Index
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
                                <BreadcrumbPage>Tech-Index</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 단계 목록은 공통 상수(Tech-Index 는 체크리스트가 없어 3단계), current 만 화면마다 다르다. */}
            <StepHeader
                title="고객정보활용동의"
                description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
                steps={ORG_TECH_INDEX_STEPS}
                current={1}
            />

            <OrgCustomerConsentForm
                formId={FORM_ID}
                nextHref={`${TECH_INDEX_MODEL_META[model].base}/company-technology-info`}
            />
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다(검사 → 다음 단계 이동). */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={TECH_INDEX_SELECTION_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export {TechIndexCustomerConsentScreen}
