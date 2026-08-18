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
import {
    TECH_INDEX_STARTUP_DEFAULT_VALUES,
    TECH_INDEX_STARTUP_FORM_TABS,
} from '@/components/composite/self-diagnosis-form-tabs'
// 입력값은 FormValues 보관소에 모인다 — 탭을 옮기거나 화면 폭이 바뀌어도 입력한 내용이 남는다.
// 실제 연동에서는 form-values.tsx 의 Provider·래퍼만 폼 라이브러리로 바꾸면 이 화면은 그대로 쓸 수 있다.
import {SelfDiagnosisTabsForm} from '@/components/composite/self-diagnosis-tabs-form'
import AutosaveToast from '@/components/custom/autosave-toast'
import {Badge} from '@/components/ui/badge'
import {TECH_INDEX_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

const CONSENT_PATH = '/corp/technology-evaluation/tech-index/startup/customer-consent'
const COMPLETE_PATH = '/corp/technology-evaluation/tech-index/startup/complete'
// 폼과 [다음] 버튼을 잇는 이름 — 버튼이 폼 바깥(화면 맨 아래 CTA)에 있어 form 속성으로 연결한다.
const FORM_ID = 'company-technology-info-form'

// 기업 Tech-Index 창업용 2단계 — Figma "[혁신성장지수 (창업) Tech-Index] 2단계_기업정보".
// 화면 뼈대(제목·스텝·탭·CTA)는 일반용과 같고, 다른 것은 제목(혁신성장지수 (창업))과 탭 구성이다 —
// 일반용 여섯 탭에 [경영진 역량 및 구성] 이 더해져 일곱이다.
//
// 탭 본문은 composite/self-diagnosis-form-tabs 의 TECH_INDEX_STARTUP_FORM_TABS 가 갖는다 — 지금은 시안이
// 확인된 [기업정보] 탭만 채워져 있고 나머지 여섯 탭은 비어 있다(시안이 나오는 대로 하나씩 채운다).
//
// [다음]은 일곱 탭을 모두 검사하고 통과하면 (3) 완료 화면으로 간다.
const CorpTechIndexStartupCompanyTechnologyInfoPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 자동저장 안내 — 시안의 토스트를 화면 확인용으로 진입 시 한 번 띄운다(렌더 결과는 없다).
            저장 기능이 붙으면 이 줄을 지우고, 저장이 끝날 때마다 showAutosaveToast(new Date()) 를 부른다. */}
        <AutosaveToast />
        {/* 콘텐츠 폭은 공통 grid-layout을 따르고, 하단 여백은 StepNavigation이 담당한다.
            모바일은 시안대로 화면 제목·단계 진행바 없이 [단계·제목 + 섹션 줄]이 헤더 아래에 붙는다. */}
        <div className="grid-layout gap-y-10 pt-0 *:col-span-full md:pt-10">
            <PageTitleBar
                className="hidden md:flex"
                title="혁신성장지수 (창업)"
                badge={
                    <Badge variant="solid" color="info" shape="round">
                        Tech-Index
                    </Badge>
                }
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
                steps={TECH_INDEX_STEPS}
                current={2}
            />

            {/* 모바일에서는 위 두 헤더가 감춰지고, 축약 제목이 섹션 줄과 함께 헤더 아래에 고정된다. */}
            <SelfDiagnosisTabsForm
                formId={FORM_ID}
                stickyHeader={<StepHeaderCompact title="기업·기술정보 입력" steps={TECH_INDEX_STEPS} current={2} />}
                nextHref={COMPLETE_PATH}
                tabs={TECH_INDEX_STARTUP_FORM_TABS}
                defaultValues={TECH_INDEX_STARTUP_DEFAULT_VALUES}
            />
        </div>

        {/* [다음]은 위 폼의 제출 버튼이다 — 모든 탭을 검사하고 값을 콘솔에 찍은 뒤 완료 화면으로 간다. */}
        <StepNavigation
            appearance="plain"
            prev={{asChild: true, children: <Link href={CONSENT_PATH}>이전</Link>}}
            next={{type: 'submit', form: FORM_ID, children: '다음'}}
        />
    </main>
)

export default CorpTechIndexStartupCompanyTechnologyInfoPage
