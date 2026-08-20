import type {Metadata} from 'next'
import {EmailField} from '@/components/composite/email-field'
import {FormCard} from '@/components/composite/form-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {
    CustomerConsentAgreement,
    CustomerConsentForm,
    CustomerConsentProvider,
    CustomerConsentStepNavigation,
} from '@/components/custom/customer-consent-agreement'

export const metadata: Metadata = {title: '고객 정보 활용 동의'}

// 기업 마이페이지 · 대표자 이력의 고객정보활용동의 —
// 기술평가 신청 1단계(technology-evaluation/ktrs-fm/customer-consent)와 같은 화면이다.
// 동의서 본문뿐 아니라 화면 구성(단계 머리 · 동의서 · 부분발송 이메일등록 · 하단 CTA)도 그대로 쓴다.
// 마이페이지의 두 열(LNB + 본문)에 넣지 않는다 — 이 화면은 마이페이지 메뉴를 오가는 자리가 아니라
// 앞뒤가 정해진 한 단계다.
//
// 원본과 다른 것은 세 가지다.
//   · 화면 제목 줄(PageTitleBar)을 두지 않는다.
//   · 단계 진행 표시(StepProgress)를 두지 않는다 — 5단계 신청 흐름 안에 있는 화면이 아니다.
//   · 앞뒤로 잇는 화면이 신청 흐름이 아니라 대표자 이력이다(아래 경로).
const REPRESENTATIVE_HISTORY_PATH = '/corp/mypage/representative-history'
// 폼과 CTA를 잇는 이름 — [동의 후 인증서명] 이 폼 바깥(화면 맨 아래)에 있어 form 속성으로 연결한다.
const FORM_ID = 'customer-consent-form'

const CorpMypageRepresentativeHistoryCustomerConsentPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        {/* 동의서와 하단 CTA가 동의 상태를 공유한다. */}
        <CustomerConsentProvider>
            {/* [프론트엔드 연동] 화면정의서의 전자서명 화면이 만들어지면 nextHref 를 그쪽으로 바꾼다.
                지금은 동의를 마치면 대표자 이력으로 돌아간다. */}
            <CustomerConsentForm formId={FORM_ID} nextHref={REPRESENTATIVE_HISTORY_PATH}>
                {/* 콘텐츠 폭은 공통 grid-layout을 따르고, 하단 여백은 StepNavigation이 담당한다. */}
                <div className="grid-layout gap-y-10 pt-7 *:col-span-full md:pt-10">
                    {/* 화면 제목 줄(PageTitleBar)을 두지 않아 보이는 h1 이 없다 — 제목이 하나도 없으면
                        제목 구조가 없는 페이지가 되므로(WAVE "Missing first level heading") 페이지 이름을
                        h1 으로 두되 sr-only 로 감춘다[6.4.2]. 아래 단계 제목(h2)과 단계가 이어진다.
                        sr-only 는 흐름 밖(absolute)이라 그리드 간격에 자리를 만들지 않는다. */}
                    <h1 className="sr-only">마이페이지</h1>

                    {/* 신청 화면은 여기에 StepHeader(제목 + 단계 진행 표시)를 두지만, 이 화면은 5단계
                        신청 흐름 안에 있지 않아 진행 표시를 두지 않는다. 제목·설명의 크기는 그대로다
                        (size="lg" = 제목 typo-h1-bold · 설명 typo-title-m-regular). */}
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">고객 정보 활용 동의</SectionHeaderTitle>
                        {/* 신청 화면은 "자가진단 진행을 위해…" 로 시작하지만, 이 화면은 자가진단 흐름
                            안에 있지 않아 그 앞머리를 두지 않는다. */}
                        <SectionHeaderDescription size="lg">
                            정보제공 동의 여부를 확인해 주세요
                        </SectionHeaderDescription>
                    </SectionHeader>

                    <CustomerConsentAgreement />

                    <FormCard
                        title="부분발송 이메일등록"
                        subtitle="안내문을 추가로 받으실 이메일 주소를 입력해 주세요."
                    >
                        {/* 아이디·도메인을 분리 입력하고 제출 시 하나의 이메일 값으로 조합한다. */}
                        <EmailField name="additionalNoticeEmail" />
                    </FormCard>
                </div>
            </CustomerConsentForm>

            {/* [이전] 은 이 동의를 요구한 대표자 이력으로 돌아간다. */}
            <CustomerConsentStepNavigation formId={FORM_ID} prevHref={REPRESENTATIVE_HISTORY_PATH} />
        </CustomerConsentProvider>
    </main>
)

export default CorpMypageRepresentativeHistoryCustomerConsentPage
