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
import {EvaluationApplicationForm} from '@/components/composite/evaluation-application-form'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {StepHeader} from '@/components/composite/step-header'
import {StepNavigation} from '@/components/composite/step-navigation'
import {ORG_INVESTMENT_MODEL_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '평가 신청하기'}

const BASE_PATH = '/org/individual-evaluation/investment-model'
// 앞 화면 — (3) 체크리스트 입력. 업종코드에 따라 두 갈래라 [이전]은 제조 화면을 가리킨다.
// 실제로는 앞 단계에서 고른 업종코드로 정해지므로, 연동 시 그 값으로 두 경로 중 하나를 넣는다.
const CHECKLIST_PATH = `${BASE_PATH}/checklist/manufacturing`
const COMPLETE_PATH = `${BASE_PATH}/complete`
// 폼 바깥(화면 맨 아래)에 있는 [제출] 버튼을 form 속성으로 잇는 이름.
const FORM_ID = 'evaluation-application-form'

// 기관 개별평가 투자모형 (4) 평가 신청하기 — Figma "투자모형_4단계_평가 신청하기".
// 화면 뼈대는 기존 조합이다: PageTitleBar(+Breadcrumb) · StepHeader · FormCard · StepNavigation.
// 첨부 칸 세 개와 제출 검사는 EvaluationApplicationForm 이 갖는다(기관 Tech-Index 와 같은 서류다).
const OrgInvestmentModelEvaluationApplicationPage = () => (
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
                title="평가 신청하기"
                description="평가 신청을 위해 필요한 첨부파일을 등록해 주세요."
                steps={ORG_INVESTMENT_MODEL_STEPS}
                current={4}
            />

            <EvaluationApplicationForm formId={FORM_ID} completePath={COMPLETE_PATH} />
        </div>

        {/* [제출]은 위 폼의 제출 버튼이다(검사 → 제출 전 확인 모달 → 완료 화면). */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={CHECKLIST_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '제출'}}
        />
    </main>
)

export default OrgInvestmentModelEvaluationApplicationPage
