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
import {EvaluationApplicationForm} from '@/components/composite/evaluation-application-form'
import {TECH_INDEX_MODEL_META, type TechIndexModel} from './model-meta'

// 폼 바깥(화면 맨 아래)에 있는 [제출] 버튼을 form 속성으로 잇는 이름.
const FORM_ID = 'org-tech-index-evaluation-application-form'

// 기관 개별평가 Tech-Index (3) 평가 신청하기 — Figma "4단계_평가 신청하기".
// 화면 뼈대는 기존 조합이다: PageTitleBar(+Breadcrumb) · StepHeader · FormCard · StepNavigation.
// 첨부 칸 세 개와 제출 검사는 EvaluationApplicationForm 이 갖는다(첨부 칸은 신규 AttachField).
//
// 시안 상단은 "신속표준모형/KTRS-FM/기술평가" 인데 이 화면은 기관 Tech-Index 흐름이라 KTRS-FM 화면에서
// 복제된 잔여 표기로 보고, 앞 단계 화면들과 같은 "Tech-Index/개별평가"로 맞춘다. 진행바도 시안(4/5)은
// KTRS-FM 기준이라 기관 Tech-Index 단계(3/4)로 둔다.
const TechIndexEvaluationApplicationScreen = ({model}: {model: TechIndexModel}) => (
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

            {/* 단계 목록은 공통 상수, current 만 화면마다 다르다. */}
            <StepHeader
                title="평가 신청하기"
                description="평가 신청을 위해 필요한 첨부파일을 등록해 주세요."
                steps={ORG_TECH_INDEX_STEPS}
                current={3}
            />

            <EvaluationApplicationForm
                formId={FORM_ID}
                completePath={`${TECH_INDEX_MODEL_META[model].base}/complete`}
            />
        </div>

        {/* [제출]은 위 폼의 제출 버튼이다(검사 → 제출 전 확인 모달 → 완료 화면). */}
        <StepNavigation
            appearance="plain"
            prev={{
                asChild: true,
                children: <Link href={`${TECH_INDEX_MODEL_META[model].base}/company-technology-info`}>이전</Link>,
            }}
            next={{type: 'submit', form: FORM_ID, children: '제출'}}
        />
    </main>
)

export {TechIndexEvaluationApplicationScreen}
