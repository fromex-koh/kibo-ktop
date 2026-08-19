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
import {TechIndexModelForm} from './tech-index-model-form'

export const metadata: Metadata = {title: '평가모형 선택'}

// "알려드려요" 안내 문구 — 기관 기준(협약기관 개별평가 안내, KTRS-FM 진행방식 선택 화면과 같은 계열).
// 원문 "반드시정보이용동의"는 띄어쓰기 오탈자로 보고 "반드시 정보이용동의"로 적었다.
const NOTICES = [
    '협약기관은 횟수 제한 없이 개별평가가 가능합니다.',
    '평가를 신청하시면, 기술사업성 평가가 자동으로 진행됩니다.',
    '협약기관에서는 평가를 진행하는 업체로부터 반드시 정보이용동의 PDF를 징구받아 업로드 바랍니다.',
] as const

const MODELS_TITLE_ID = 'evaluation-models-title'

// 기관 개별평가 Tech-Index 평가모형 선택 — Figma "[혁신성장지수 평가 Tech-Index]".
// 화면 구성은 기존 컴포넌트 조합이다: PageTitleBar(+Breadcrumb) · RadioCard · InfoBox · StepNavigation.
// 카드는 링크가 아니라 라디오이고, 고르는 것과 제출은 TechIndexModelForm 이 갖는다.
//
// 브레드크럼은 시안("홈 · 기술평가")이 아니라 이 화면이 실제로 놓인 기관 IA(홈 · 개별평가)를 따른다 —
// 시안 문구는 기업 화면에서 옮겨온 표기로 보이고, 브레드크럼은 실제 이동 경로를 가리켜야 한다.
const OrgTechIndexSelectionPage = () => (
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
                                    <BreadcrumbPage>개별평가</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                {/* 라디오 그룹의 이름으로 잇는다 — 무엇을 고르는 자리인지 이 문장이 말한다[7.4.1]. */}
                <p id={MODELS_TITLE_ID} className="typo-body-xl-regular text-foreground-subtle">
                    Tech-Index 평가모형을 선택해 주세요.
                </p>
            </div>

            {/* 시안 순서 — 평가모형 카드 → 안내 상자 → [신청]. 카드와 버튼이 한 폼이라 사이의 안내를 넘겨 받는다. */}
            <TechIndexModelForm labelledBy={MODELS_TITLE_ID}>
                <InfoBox title="알려드려요">
                    {NOTICES.map((notice) => (
                        <InfoBoxItem key={notice}>{notice}</InfoBoxItem>
                    ))}
                </InfoBox>
            </TechIndexModelForm>
        </div>
    </main>
)

export default OrgTechIndexSelectionPage
