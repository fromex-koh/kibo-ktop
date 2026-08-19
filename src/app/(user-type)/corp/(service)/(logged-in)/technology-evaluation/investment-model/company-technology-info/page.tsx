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
// 탭 구성과 "업종코드에 따라 갈 체크리스트를 정하는" 판단은 이 조각이 갖는다.
import ChecklistStepForm from './checklist-step-form'
import AutosaveToast from '@/components/custom/autosave-toast'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

// 앞 화면 — 기술평가 > 투자모형 > (1) 고객정보활용동의.
const CONSENT_PATH = '/corp/technology-evaluation/investment-model/customer-consent'
// 폼과 [다음] 버튼을 잇는 이름 — 버튼이 폼 바깥(화면 맨 아래 CTA)에 있어 form 속성으로 연결한다.
const FORM_ID = 'company-technology-info-form'

// 기업 투자모형 2단계 — Figma "투자모형_2단계_기업·기술정보 입력_기업정보".
// 탭 여섯 개가 한 화면이고, 이 파일은 화면 뼈대(제목·스텝·탭·CTA)만 조립한다.
// 탭 본문은 composite/self-diagnosis-form-tabs 의 INVESTMENT_MODEL_FORM_TABS 가 갖는다
// (지금은 시안이 확인된 [기업정보] 탭만 채워져 있고 나머지 다섯은 비어 있다).
const CorpInvestmentModelCompanyTechnologyInfoPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 자동저장 안내 — 시안의 토스트를 화면 확인용으로 진입 시 한 번 띄운다(렌더 결과는 없다).
            저장 기능이 붙으면 이 줄을 지우고, 저장이 끝날 때마다 showAutosaveToast(new Date()) 를 부른다. */}
        <AutosaveToast />
        {/* 콘텐츠 폭은 공통 grid-layout을 따르고, 하단 여백은 StepNavigation이 담당한다.
            모바일은 시안대로 화면 제목·단계 진행바 없이 [단계·제목 + 섹션 줄]이 헤더 아래에 붙는다. */}
        <div className="grid-layout gap-y-10 pt-0 *:col-span-full md:pt-10">
            <PageTitleBar
                className="hidden md:flex"
                title="투자모형"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>기술평가</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>투자모형</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <StepHeader
                className="hidden md:flex"
                title="기업·기술정보 입력"
                description="평가에 필요한 기업 및 기술 정보를 입력해주세요."
                steps={SELF_DIAGNOSIS_STEPS}
                current={2}
            />

            {/* 모바일에서는 위 두 헤더가 감춰지고, 축약 제목이 섹션 줄과 함께 헤더 아래에 고정된다. */}
            <ChecklistStepForm
                formId={FORM_ID}
                stickyHeader={<StepHeaderCompact title="기업·기술정보 입력" steps={SELF_DIAGNOSIS_STEPS} current={2} />}
            />
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다 — 모든 탭을 검사하고 값을 콘솔에 찍은 뒤 다음 단계로 간다. */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={CONSENT_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export default CorpInvestmentModelCompanyTechnologyInfoPage
