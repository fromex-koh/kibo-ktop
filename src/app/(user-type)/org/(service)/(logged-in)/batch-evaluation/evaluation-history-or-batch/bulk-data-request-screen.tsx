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
import {BATCH_EVALUATION_STEPS} from '@/constants/technology-evaluation'
import {BulkDataRequestForm} from './bulk-data-request-form'
import {BATCH_MODEL_META, BATCH_SELECTION_PATH, type BatchEvaluationModel} from './batch-model-meta'

// 폼 바깥(화면 맨 아래)에 있는 [신청] 버튼을 form 속성으로 잇는 이름.
const FORM_ID = 'org-bulk-data-request-form'

// 기관 일괄평가 2단계 대량정보 조회 신청 — Figma "[일괄평가] 2단계_대량정보 조회 신청".
// 화면 뼈대는 기존 조합이다: PageTitleBar(+Breadcrumb) · StepHeader · FormCard · StepNavigation.
// 입력 카드 두 장과 제출 검사는 BulkDataRequestForm 이 갖는다.
//
// 시안에는 "일괄평가 1단계에서 선택한 조건" 카드와 각 카드 제목 옆 버튼·필수 안내 목록이 함께 그려져 있으나,
// 모두 다른 요소 아래에 겹쳐 가려진 잔여 요소라 화면에는 나타나지 않는다(프레임 렌더 기준). 그래서 두지 않았다.
const BulkDataRequestScreen = ({model}: {model: BatchEvaluationModel}) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout 을 따르고, 하단 여백은 StepNavigation 이 담당한다. */}
        <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
            <PageTitleBar
                title={BATCH_MODEL_META[model].title}
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        대량정보 조회
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
                                <span>일괄평가</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>평가내역조회</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 단계 목록은 공통 상수, current 만 화면마다 다르다. */}
            <StepHeader
                title="평가내역조회"
                description="여러 기업의 평가 데이터를 한 번에 조회할 수 있습니다. 표준 양식을 다운로드하여 작성 후 업로드해 주세요."
                steps={BATCH_EVALUATION_STEPS}
                current={2}
            />

            <BulkDataRequestForm formId={FORM_ID} completePath={`${BATCH_MODEL_META[model].base}/bulk-data-complete`} />
        </div>

        {/* [신청]은 위 폼의 제출 버튼이다(검사 → 신청). */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={BATCH_SELECTION_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '신청'}}
        />
    </main>
)

export {BulkDataRequestScreen}
