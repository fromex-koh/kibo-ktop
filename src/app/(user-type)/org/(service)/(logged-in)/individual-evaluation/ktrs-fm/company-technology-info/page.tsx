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
import {StepHeader, StepHeaderCompact} from '@/components/composite/step-header'
import {StepNavigation} from '@/components/composite/step-navigation'
// 입력값은 FormValues 보관소에 모인다 — 탭을 옮기거나 화면 폭이 바뀌어도 입력한 내용이 남는다.
// 실제 연동에서는 form-values.tsx 의 Provider·래퍼만 폼 라이브러리로 바꾸면 이 화면은 그대로 쓸 수 있다.
// 탭 구성과 "업종코드에 따라 갈 체크리스트를 정하는" 판단은 이 조각이 갖는다.
import ChecklistStepForm from './checklist-step-form'
import AutosaveToast from '@/components/custom/autosave-toast'
import {Badge} from '@/components/ui/badge'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

const CONSENT_PATH = '/org/individual-evaluation/ktrs-fm/customer-consent'
// 폼과 [다음] 버튼을 잇는 이름 — 버튼이 폼 바깥(화면 맨 아래 CTA)에 있어 form 속성으로 연결한다.
const FORM_ID = 'company-technology-info-form'

// 기관 개별평가 KTRS-FM 2단계 — 기업 신속표준모형 2단계와 같은 구성이다(입력 탭 다섯 개).
// 기관 시안이 나오면 이 화면부터 조정한다 — 지금은 기업 화면을 그대로 옮기고 경로·브레드크럼만 기관 IA 로 바꿨다.
const OrgKtrsFmCompanyTechnologyInfoPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 자동저장 안내 — 시안의 토스트를 화면 확인용으로 진입 시 한 번 띄운다(렌더 결과는 없다).
            저장 기능이 붙으면 이 줄을 지우고, 저장이 끝날 때마다 showAutosaveToast(new Date()) 를 부른다. */}
        <AutosaveToast />
        {/* 콘텐츠 폭은 공통 grid-layout을 따르고, 하단 여백은 StepNavigation이 담당한다.
            모바일은 시안대로 화면 제목·단계 진행바 없이 [단계·제목 + 섹션 줄]이 헤더 아래에 붙는다 —
            위쪽 여백은 그 고정 영역이 직접 갖는다(시안 실측 8). */}
        <div className="grid-layout gap-y-10 pt-0 *:col-span-full md:pt-10">
            <PageTitleBar
                className="hidden md:flex"
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
                                <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>개별평가</span>
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
                className="hidden md:flex"
                title="기업·기술정보 입력"
                description="평가에 필요한 기업 및 기술 정보를 입력해 주세요."
                steps={SELF_DIAGNOSIS_STEPS}
                current={2}
            />

            {/* 모바일에서는 위 두 헤더가 감춰지고, 축약 제목이 섹션 줄과 함께 헤더 아래에 고정된다.
                한 상자로 고정해야 제목이 길어져도 줄이 겹치지 않는다(FormTabs 의 stickyHeader). */}
            <ChecklistStepForm
                formId={FORM_ID}
                stickyHeader={<StepHeaderCompact title="기업·기술정보 입력" steps={SELF_DIAGNOSIS_STEPS} current={2} />}
            />
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다 — 모든 탭을 검사하고, 통과하면 값을 콘솔에 찍은 뒤
            3단계(체크리스트 입력)로 이동한다. */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={CONSENT_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export default OrgKtrsFmCompanyTechnologyInfoPage
