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
import {ChecklistForm} from '@/components/composite/checklist-form'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {StepHeader} from '@/components/composite/step-header'
import {StepNavigation} from '@/components/composite/step-navigation'
import {Badge} from '@/components/ui/badge'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'
// 문항·보기 목업 — 연동 시 같은 모양(ChecklistData)의 API 응답으로 교체한다.
import {SERVICE_CHECKLIST} from '@/content/technology-evaluation/industry-checklist'

export const metadata: Metadata = {title: '체크리스트 입력'}

const COMPANY_TECHNOLOGY_INFO_PATH = '/corp/technology-evaluation/ktrs-fm/company-technology-info'
const COMPLETE_PATH = '/corp/technology-evaluation/ktrs-fm/complete'
// 폼 바깥에 있는 [다음] 버튼을 form 속성으로 잇는 이름.
const FORM_ID = 'checklist-form'

// 신속표준모형 (3) 체크리스트 입력 — 업종코드가 서비스일 때의 화면. 화면 뼈대만 조립한다.
// 문항 렌더·검사는 ChecklistForm, 문항 글·보기·분기는 SERVICE_CHECKLIST 가 갖는다(투자모형과 같은 체크리스트다).
//
// - 데이터: data prop 하나로 들어간다. 문항·보기·안내 문구 변경은 데이터에서만 한다.
// - 제출: [다음] = 이 폼의 submit. 필수 선택이 비면 이동 대신 그 자리에 안내 문구를 띄운다.
//   통과하면 모은 값을 console.log 로 찍고 최종 확인 모달을 띄우며, [제출] 을 누르면 completeHref 로 간다.
//   저장 API 는 ChecklistForm 의 handleSubmit(console.log 자리)에 붙인다.
// - 값: 체크박스·칩은 name 만 가진 폼 요소다 — FormData 로 읽는다.
const CorpKtrsFmChecklistServicePage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 폭·좌우 여백은 grid-layout 이 정한다. 카드 위 60 = gap-y-10(40) + 카드 mt-5(20). */}
        <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
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

            {/* 단계 목록은 공통 상수, current 만 화면마다 다르다. */}
            <StepHeader
                title="체크리스트 입력"
                description="평가 항목별 체크리스트를 작성해주세요. 해당사항에 맞게 선택해 주십시오."
                steps={SELF_DIAGNOSIS_STEPS}
                current={3}
            />

            {/* id 는 바로가기(SkipNav) 대상이다. */}
            <div className="mt-5">
                <ChecklistForm data={SERVICE_CHECKLIST} id="checklist" formId={FORM_ID} completeHref={COMPLETE_PATH} />
            </div>
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다(검사 → 최종 확인 모달 → 완료 화면). */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={COMPANY_TECHNOLOGY_INFO_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export default CorpKtrsFmChecklistServicePage
