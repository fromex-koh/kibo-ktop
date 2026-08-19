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
import {Badge} from '@/components/ui/badge'
import {EvaluationMethodForm} from './evaluation-method-form'

export const metadata: Metadata = {title: '진행방식 선택'}

// 시안 "알려드려요" 안내 문구.
const NOTICES = [
    '협약기관은 횟수 제한 없이 개별평가가 가능합니다.',
    '평가를 신청하시면, 기술사업성 평가가 자동으로 진행됩니다.',
    '협약기관에서는 평가를 진행하는 업체로부터 반드시 정보이용동의 PDF를 징구받아 업로드 바랍니다.',
] as const

const METHODS_TITLE_ID = 'evaluation-methods-title'

// 기관 개별평가 KTRS-FM 진행방식 선택 — Figma "1단계_평가진행방식 선택".
// 화면 구성은 기존 컴포넌트 조합이다: PageTitleBar(+Breadcrumb) · RadioCard · InfoBox · StepNavigation.
// 카드는 링크가 아니라 라디오이고, 고르는 것과 이동은 EvaluationMethodForm 이 갖는다
// (Tech-Index 평가모형 선택 화면과 같은 구성).
const OrgKtrsFmSelectionPage = () => (
    // 시안의 화면 배경은 흰색(카드 면)이고, 그 위에서 안내 상자만 회색으로 떠 있다.
    <main id="main" tabIndex={-1} className="bg-card flex-1">
        {/* 콘텐츠 폭은 공통 grid-layout을 따른다. 하단 여백은 StepNavigation 이 담당한다. */}
        <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
            <div className="flex flex-col gap-2">
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
                {/* 라디오 그룹의 이름으로 잇는다 — 무엇을 고르는 자리인지 이 문장이 말한다[7.4.1]. */}
                <p id={METHODS_TITLE_ID} className="typo-body-xl-regular text-foreground-subtle">
                    기업이 전송한 자가진단 내역이 있습니다. 전송된 내역을 검증하려면 [평가검증 하기], 새로운 평가를
                    진행하려면 [개별평가 하기]를 선택해 주세요.
                </p>
            </div>

            {/* 시안 순서 — 진행방식 카드 → 안내 상자 → [다음]. 카드와 버튼이 한 폼이라 사이의 안내를 넘겨 받는다. */}
            <EvaluationMethodForm labelledBy={METHODS_TITLE_ID}>
                <InfoBox title="알려드려요">
                    {NOTICES.map((notice) => (
                        <InfoBoxItem key={notice}>{notice}</InfoBoxItem>
                    ))}
                </InfoBox>
            </EvaluationMethodForm>
        </div>
    </main>
)

export default OrgKtrsFmSelectionPage
