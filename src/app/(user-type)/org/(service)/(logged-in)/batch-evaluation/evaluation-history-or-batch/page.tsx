import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {BatchEvaluationForm} from './batch-evaluation-form'

export const metadata: Metadata = {title: '평가모형 선택'}

// 시안 "알려드려요" 안내 문구.
const NOTICES = [
    '일괄평가는 다수 기업의 기술사업성 평가를 한 번에 신청하는 서비스입니다.',
    '표준 엑셀 양식을 다운로드하여 평가 대상 기업 정보를 입력한 후 업로드해 주세요.',
    '협약기관에서는 평가를 진행하는 각 업체로부터 반드시 정보이용동의서를 징구받아 압축파일로 업로드 바랍니다.',
] as const

const MODELS_TITLE_ID = 'evaluation-models-title'
const TASKS_TITLE_ID = 'next-tasks-title'

// 기관 일괄평가 (1) Tech-Index 선택 + (2) 평가내역조회/일괄평가 진행 선택 — Figma "[일괄평가] Tech-Index 선택".
// 퍼블리싱 인덱스에서 두 단계가 한 화면으로 묶여 있어 여기서 함께 다룬다.
// 화면 구성은 기존 컴포넌트 조합이다: PageTitleBar(+Breadcrumb) · RadioCard · RadioChip · InfoBox · StepNavigation.
// 카드와 칩 모두 링크가 아니라 라디오이고, 두 선택과 이동은 BatchEvaluationForm 이 갖는다.
const OrgBatchEvaluationSelectionPage = () => (
    // 시안의 화면 배경은 흰색(카드 면)이고, 그 위에서 안내 상자만 회색으로 떠 있다.
    <main id="main" tabIndex={-1} className="bg-card flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout을 따른다. 하단 여백은 StepNavigation 이 담당한다. */}
        <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
            <div className="flex flex-col gap-2">
                <PageTitleBar
                    title="Tech-Index"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>일괄평가</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                {/* 평가모형 묶음의 이름으로 잇는다 — 무엇을 고르는 자리인지 이 문장이 말한다[7.4.1]. */}
                <p id={MODELS_TITLE_ID} className="typo-body-xl-regular text-foreground-subtle">
                    Tech-Index 평가모형을 선택해 주세요.
                </p>
            </div>

            {/* 시안 순서 — 평가모형 카드 → 진행할 업무 칩 → 안내 상자 → [다음]. 넷이 한 폼이라 폼이 자리를 잡는다. */}
            <BatchEvaluationForm
                modelsLabelledBy={MODELS_TITLE_ID}
                tasksLabelledBy={TASKS_TITLE_ID}
                tasksTitle={
                    // 칩 제목은 heading 이 아니라 강조 텍스트라 이 구획의 제목을 여기서 제공한다.
                    <h2 id={TASKS_TITLE_ID} className="typo-title-l-bold text-foreground">
                        진행할 업무 선택
                    </h2>
                }
            >
                <InfoBox title="알려드려요">
                    {NOTICES.map((notice) => (
                        <InfoBoxItem key={notice}>{notice}</InfoBoxItem>
                    ))}
                </InfoBox>
            </BatchEvaluationForm>
        </div>
    </main>
)

export default OrgBatchEvaluationSelectionPage
