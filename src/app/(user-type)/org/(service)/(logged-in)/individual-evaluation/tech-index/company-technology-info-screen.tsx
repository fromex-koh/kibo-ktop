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
import {Badge} from '@/components/ui/badge'
import {
    ORG_TECH_INDEX_GENERAL_FORM_TABS,
    ORG_TECH_INDEX_STARTUP_FORM_TABS,
    TECH_INDEX_GENERAL_DEFAULT_VALUES,
} from '@/components/composite/self-diagnosis-form-tabs'
// 입력값은 FormValues 보관소에 모인다 — 탭을 옮기거나 화면 폭이 바뀌어도 입력한 내용이 남는다.
// 실제 연동에서는 form-values.tsx 의 Provider·래퍼만 폼 라이브러리로 바꾸면 이 화면은 그대로 쓸 수 있다.
import {SelfDiagnosisTabsForm} from '@/components/composite/self-diagnosis-tabs-form'
import {TECH_INDEX_MODEL_META, type TechIndexModel} from './model-meta'
import AutosaveToast from '@/components/custom/autosave-toast'
import {ORG_TECH_INDEX_STEPS} from '@/constants/technology-evaluation'

// 폼과 [다음] 버튼을 잇는 이름 — 버튼이 폼 바깥(화면 맨 아래 CTA)에 있어 form 속성으로 연결한다.
const FORM_ID = 'company-technology-info-form'

// 기관 개별평가 Tech-Index 2단계 — 기업 Tech-Index 일반용 2단계와 같은 구성이다(입력 탭 여섯 개).
// 기업정보 탭만 기관용이다 — KTRS-FM 기관 2단계와 같은 탭(기업정보 · 기업 담당자 정보)이고,
// Tech-Index 의 [기업 상세 정보] 구획이 그 카드 맨 아래에 붙는다. 탭 구성은 라우트의 모형이 가른다 —
// 일반 6개 · 창업 7개([경영진 역량 및 구성] 추가). 일반용/창업용 라우트가 model 만 다르게 넘겨 공유한다.
//
// [프론트엔드 연동] 지금은 일반용 탭 구성 고정이다 — (0) 평가모형 선택에서 고른 값(일반/창업)을 받아
// 창업용이면 TECH_INDEX_STARTUP_FORM_TABS(7개 탭)로 갈아 끼운다.
const TechIndexCompanyTechnologyInfoScreen = ({model}: {model: TechIndexModel}) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 자동저장 안내 — 시안의 토스트를 화면 확인용으로 진입 시 한 번 띄운다(렌더 결과는 없다).
            저장 기능이 붙으면 이 줄을 지우고, 저장이 끝날 때마다 showAutosaveToast(new Date()) 를 부른다. */}
        <AutosaveToast />
        {/* 콘텐츠 폭은 공통 grid-layout을 따르고, 하단 여백은 StepNavigation이 담당한다.
            모바일은 시안대로 화면 제목·단계 진행바 없이 [단계·제목 + 섹션 줄]이 헤더 아래에 붙는다. */}
        <div className="grid-layout gap-y-10 pt-0 *:col-span-full md:pt-10">
            <PageTitleBar
                className="hidden md:flex"
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

            <StepHeader
                className="hidden md:flex"
                title="기업·기술정보 입력"
                description="평가에 필요한 기업 및 기술 정보를 입력해주세요."
                steps={ORG_TECH_INDEX_STEPS}
                current={2}
            />

            {/* 모바일에서는 위 두 헤더가 감춰지고, 축약 제목이 섹션 줄과 함께 헤더 아래에 고정된다. */}
            <SelfDiagnosisTabsForm
                formId={FORM_ID}
                stickyHeader={<StepHeaderCompact title="기업·기술정보 입력" steps={ORG_TECH_INDEX_STEPS} current={2} />}
                nextHref={`${TECH_INDEX_MODEL_META[model].base}/evaluation-application`}
                tabs={model === 'startup' ? ORG_TECH_INDEX_STARTUP_FORM_TABS : ORG_TECH_INDEX_GENERAL_FORM_TABS}
                defaultValues={TECH_INDEX_GENERAL_DEFAULT_VALUES}
            />
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다 — 모든 탭을 검사하고 값을 콘솔에 찍은 뒤 평가 신청 화면으로 간다. */}
        <StepNavigation
            appearance="plain"
            prev={{
                asChild: true,
                children: <Link href={`${TECH_INDEX_MODEL_META[model].base}/customer-consent`}>이전</Link>,
            }}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export {TechIndexCompanyTechnologyInfoScreen}
