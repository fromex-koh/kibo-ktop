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

// 시안 "알려드려요" 안내 문구.
const NOTICES = [
    '기업의 자가진단용 기술사업평가는 기술ONE플랫폼 기업회원에 한해 월 1회 무료로 제공됩니다.',
    '기술사업평가를 신청하시면 국내최초 개방형 평가모형인 KTRS-FM을 통한 기술사업성 평가가 자동으로 진행됩니다.',
    '평가 신청 시 기업·기술 정보 및 체크리스트를 사실에 기반하여 작성해주셔야 정확한 평가가 가능합니다.',
] as const

const MODELS_TITLE_ID = 'evaluation-models-title'

// 기업 기술평가 Tech-Index 평가모형 선택 — Figma "[혁신성장지수 평가 Tech-Index]".
// 화면 구성은 기존 컴포넌트 조합이다: PageTitleBar(+Breadcrumb) · RadioCard · InfoBox · StepNavigation.
// 카드는 링크가 아니라 라디오이고, 고르는 것과 이동은 TechIndexModelForm 이 갖는다(기관 화면과 같은 구성).
const CorpTechIndexSelectionPage = () => (
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
                                    <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>기술평가</BreadcrumbPage>
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

            {/* 시안 순서 — 평가모형 카드 → 안내 상자 → [다음]. 카드와 버튼이 한 폼이라 사이의 안내를 넘겨 받는다. */}
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

export default CorpTechIndexSelectionPage
