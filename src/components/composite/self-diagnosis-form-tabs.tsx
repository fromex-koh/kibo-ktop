import {
    INVESTMENT_MODEL_COMPANY_ETC_DEFAULT_VALUES,
    TECH_INDEX_PATENT_DEFAULT_VALUES,
    TECH_INDEX_RECORD_DEFAULT_VALUES,
    TECH_INDEX_STAFF_SUMMARY_DEFAULT_VALUES,
} from '@/constants/technology-evaluation'
import type {FormTabItem} from '@/components/composite/form-tabs'
import CompanyInfoForm from '@/components/composite/company-info-form'
import CareerForm from '@/components/composite/career-form'
import CompanyEtcForm from '@/components/composite/company-etc-form'
import TechStaffForm, {TECH_INDEX_STAFF_CATEGORIES} from '@/components/composite/tech-staff-form'
import RndForm from '@/components/composite/rnd-form'
import InvestmentModelCompanyEtcForm from '@/components/composite/investment-model-company-etc-form'
import InvestmentModelCompanyInfoForm from '@/components/composite/investment-model-company-info-form'
import InvestmentModelFinanceForm from '@/components/composite/investment-model-finance-form'
import InvestmentModelRepresentativeCapability from '@/components/composite/investment-model-representative-capability'
import OrgCompanyInfoForm from '@/components/composite/org-company-info-form'
import TechIndexCompanyInfoForm, {
    TechIndexCompanyDetailSection,
} from '@/components/composite/tech-index-company-info-form'
import TechIndexRepresentativeCapability from '@/components/composite/tech-index-representative-capability'
import TechIndexStaffSummary from '@/components/composite/tech-index-staff-summary'
import TechIndexPatentForm from '@/components/composite/tech-index-patent-form'
import TechIndexRecordForm from '@/components/composite/tech-index-record-form'
import TechIndexFinanceForm from '@/components/composite/tech-index-finance-form'
import TechIndexManagementForm from '@/components/composite/tech-index-management-form'

// 자가진단 2단계(기업·기술정보 입력)의 탭 구성 — 제목과 순서는 시안 값 그대로다.
// 실제 화면과 FormTabs 컴포넌트 가이드가 같은 것을 보도록 여기 한 벌만 둔다.
// (한 화면에 두 번 렌더하면 입력 id 가 겹치므로 페이지마다 한 번만 쓴다.)
//
// 작성 상태(미작성·작성중·작성완료)는 적지 않는다 — 그 탭에 입력한 값에서 FormTabs 가 계산한다.
const SELF_DIAGNOSIS_FORM_TABS: readonly FormTabItem[] = [
    {value: 'company', title: '기업정보', content: <CompanyInfoForm />},
    {value: 'ceo', title: '대표자 경력사항', content: <CareerForm />},
    {value: 'etc', title: '기업 기타 정보', content: <CompanyEtcForm />},
    {value: 'staff', title: '핵심 기술 인력 현황', content: <TechStaffForm />},
    {value: 'rnd', title: '기술 개발 실적', content: <RndForm />},
]

// 기관 개별평가의 탭 구성 — 기업정보 탭만 기관용(직접 입력 + 기업형태 분기)으로 바꾸고 나머지는 같다.
const ORG_SELF_DIAGNOSIS_FORM_TABS: readonly FormTabItem[] = SELF_DIAGNOSIS_FORM_TABS.map((tab) =>
    tab.value === 'company' ? {...tab, content: <OrgCompanyInfoForm />} : tab,
)

// Tech-Index 일반용 2단계의 탭 구성 — 제목과 순서는 시안 값 그대로다(KTRS-FM 5개와 달리 6개이고 항목도 다르다).
// 창업용은 여기에 [경영진 역량 및 구성] 이 더해진 7개다(아래 TECH_INDEX_STARTUP_FORM_TABS).
//
// 대표자 역량 및 경력사항 — 경력사항 본문은 KTRS-FM 과 같은 CareerForm 이고, 이 모형에만 있는
// [대표자 역량] 구획을 leading 으로 앞에 끼운다(카드 제목도 그만큼 달라진다).
// 기술 인력 현황 — 인력 카드는 KTRS-FM 과 같은 TechStaffForm 이고, 앞에 인원 요약 줄만 더 붙는다.
// KTRS-FM 은 대표자 제외 2명까지지만 이 모형은 시안에 구분1~3 이 있어 카드 수를 제한하지 않는다
// (maxCount 를 명시하지 않으면 KTRS-FM 의 2장 제한을 그대로 물려받는다).
// 기술실적 및 인증실적 — 인정 기준 안내 네 줄과 실적 건수 네 칸뿐이라 반복 카드가 없다.
// 재무정보 — 재무기준일 한 줄과 과거 3개년 묶음이다. 연도 묶음은 기준일에 따라 바뀌므로 값 이름에 연도가 들어간다.
const TECH_INDEX_GENERAL_FORM_TABS: readonly FormTabItem[] = [
    {value: 'company', title: '기업정보', content: <TechIndexCompanyInfoForm />},
    {
        value: 'ceo',
        title: '대표자 역량 및 경력사항',
        content: <CareerForm title="대표자 역량 및 경력사항" leading={<TechIndexRepresentativeCapability />} />,
    },
    {
        value: 'staff',
        title: '기술 인력 현황',
        content: (
            <TechStaffForm
                title="기술 인력 현황"
                subtitle="현재 귀사에 재직중인 기술인력의 최종학력, 동업종 경력년수를 입력해주십시오."
                leading={<TechIndexStaffSummary />}
                maxCount={Number.POSITIVE_INFINITY}
                categories={TECH_INDEX_STAFF_CATEGORIES}
            />
        ),
    },
    {value: 'patent', title: '특허 보유현황', content: <TechIndexPatentForm />},
    {value: 'record', title: '기술실적 및 인증실적', content: <TechIndexRecordForm />},
    {value: 'finance', title: '재무정보', content: <TechIndexFinanceForm />},
]

// Tech-Index 일반용 탭이 화면을 열 때 이미 들고 있어야 하는 값 — 수량 칸의 0 이다.
// KTRS-FM 의 기업 기타 정보 기본값(COMPANY_ETC_DEFAULT_VALUES)은 넣지 않는다 — 이 모형에는 그 탭이
// 없어 화면에 없는 칸의 값만 제출에 섞인다.
const TECH_INDEX_GENERAL_DEFAULT_VALUES: Record<string, string> = {
    ...TECH_INDEX_STAFF_SUMMARY_DEFAULT_VALUES,
    ...TECH_INDEX_PATENT_DEFAULT_VALUES,
    ...TECH_INDEX_RECORD_DEFAULT_VALUES,
}

// 기관 개별평가 Tech-Index 의 탭 구성 — 기업정보 탭만 기관용(OrgCompanyInfoForm)으로 바꾸고 나머지는
// 일반용과 같다(ORG_SELF_DIAGNOSIS_FORM_TABS 가 KTRS-FM 에서 하는 것과 같은 치환).
// 기관은 KTRS-FM 2단계와 같은 기업정보 탭(기업정보 · 기업 담당자 정보, 직접 입력 + 기업형태 분기)을 쓰되,
// Tech-Index 모형에만 있는 [기업 상세 정보] 구획을 카드 맨 아래에 그대로 이어 붙인다.
const ORG_TECH_INDEX_GENERAL_FORM_TABS: readonly FormTabItem[] = TECH_INDEX_GENERAL_FORM_TABS.map((tab) =>
    tab.value === 'company'
        ? {...tab, content: <OrgCompanyInfoForm trailing={<TechIndexCompanyDetailSection />} />}
        : tab,
)

// 창업용 — 위 일반용에 [경영진 역량 및 구성] 탭(창업 모형에만 있다)을 [기술 인력 현황] 다음에 더한다.
// 어느 세트를 쓸지는 화면이 (0) 평가모형 선택에서 고른 값으로 정한다.
const ORG_TECH_INDEX_STARTUP_FORM_TABS: readonly FormTabItem[] = ORG_TECH_INDEX_GENERAL_FORM_TABS.flatMap(
    (tab): readonly FormTabItem[] =>
        tab.value === 'staff'
            ? [tab, {value: 'management', title: '경영진 역량 및 구성', content: <TechIndexManagementForm />}]
            : [tab],
)

// Tech-Index 창업용 2단계의 탭 구성 — Figma "[혁신성장지수 (창업) Tech-Index] 2단계_기업정보".
// 일반용 여섯 탭에 [경영진 역량 및 구성] 이 더해져 일곱이고, 자리도 시안 그대로 [기술 인력 현황] 다음이다.
//
// [작업 중] 시안이 확인된 탭만 채운다. 나머지는 비워 두고, 시안이 나오는 대로 content 를 하나씩 채운다.
// 일반용에 같은 이름의 탭이 있더라도 창업용 시안을 보기 전에는 붙이지 않는다 — 모형이 다르면 항목도
// 달라질 수 있다. 지금까지 확인한 두 탭은 일반용 시안과 같아 그 조각을 그대로 쓴다.
//   기업정보 — 카드 세 장(기업정보 · 기업 담당자 정보 · 기업 상세 정보)과 칸이 일반용과 같다.
//   대표자 역량 및 경력사항 — [대표자 역량] 구획과 경력 카드·행추가·총 경력 연수가 일반용과 같다.
//   기술 인력 현황 — 인원 요약 줄은 일반용과 같고, 인력 카드에 두 가지가 더 있다.
//     [전공과 평가대상 기술 분야 일치여부] 칸이 마지막 줄에 끼고, 동업종 종사경력이 햇수(년) 칸이 된다.
//     [확인 필요] 일반용 시안에도 같은 두 가지가 있는지는 아직 못 봤다 — 확인되면 일반용 탭에도 같은
//     props 를 넘긴다(TechStaffForm 은 이미 두 모양을 모두 그린다).
//   경영진 역량 및 구성 — 이 모형에만 있는 탭이다. 반복 카드 모양은 인력 카드와 같지만 칸이 전혀 달라
//     별도 조각(tech-index-management-form)으로 둔다.
//   특허 보유현황 — 안내·특허 카드는 일반용과 같고, 위 합계 요약만 [등록 특허 · 출원 특허] 두 칸이다
//     (일반용은 조회로 채워지는 항목의 합계 다섯 칸이 더 있다).
//   기술실적 및 인증실적 — 안내 네 줄과 실적 건수 네 칸이 일반용과 같다.
//   재무정보 — 안내·기준일 줄·연도 묶음이 일반용과 같고, 묶음 제목만 "2023년" 처럼 "년" 이 붙는다
//     (일반용 시안은 "2023"). 두 시안의 차이라 옵션으로 두었다.
const TECH_INDEX_STARTUP_FORM_TABS: readonly FormTabItem[] = [
    {value: 'company', title: '기업정보', content: <TechIndexCompanyInfoForm />},
    {
        value: 'ceo',
        title: '대표자 역량 및 경력사항',
        content: <CareerForm title="대표자 역량 및 경력사항" leading={<TechIndexRepresentativeCapability />} />,
    },
    {
        value: 'staff',
        title: '기술 인력 현황',
        content: (
            <TechStaffForm
                title="기술 인력 현황"
                subtitle="현재 귀사에 재직중인 기술인력의 최종학력, 동업종 경력년수를 입력해주십시오."
                leading={<TechIndexStaffSummary />}
                maxCount={Number.POSITIVE_INFINITY}
                categories={TECH_INDEX_STAFF_CATEGORIES}
                showMajorMatch
                industryCareerUnit="년"
            />
        ),
    },
    {value: 'management', title: '경영진 역량 및 구성', content: <TechIndexManagementForm />},
    {value: 'patent', title: '특허 보유현황', content: <TechIndexPatentForm showLookupTotals={false} />},
    {value: 'record', title: '기술실적 및 인증실적', content: <TechIndexRecordForm />},
    {value: 'finance', title: '재무정보', content: <TechIndexFinanceForm showYearUnit />},
]

// 창업용 탭이 화면을 열 때 이미 들고 있어야 하는 값 — 지금은 인원 요약 두 칸의 0 뿐이다.
// KTRS-FM 의 기업 기타 정보 기본값(COMPANY_ETC_DEFAULT_VALUES)은 넣지 않는다 — 이 모형에는 그 탭이
// 없어 화면에 없는 칸의 값만 제출에 섞인다(일반용과 같은 이유). 탭을 채울 때 여기도 함께 채운다.
const TECH_INDEX_STARTUP_DEFAULT_VALUES: Record<string, string> = {
    ...TECH_INDEX_STAFF_SUMMARY_DEFAULT_VALUES,
    ...TECH_INDEX_PATENT_DEFAULT_VALUES,
    ...TECH_INDEX_RECORD_DEFAULT_VALUES,
}

// 투자모형 [핵심 기술 인력 현황] 은 시안 안내대로 대표자 제외 3명까지다(KTRS-FM 은 2명).
const INVESTMENT_MODEL_MAX_STAFF_COUNT = 3

// 기업 투자모형 2단계의 탭 구성 — Figma "투자모형_2단계_기업·기술정보 입력_기업정보".
// 여섯 탭이고 순서도 시안 그대로다(KTRS-FM 다섯 개·Tech-Index 여섯 개와 항목이 다르다).
//
// 여섯 탭 모두 시안이 확인되어 채워져 있다. 같은 이름의 탭이 다른 모형에 있어도 항목이 다르면 모형
// 전용 조각으로 두고, 같으면 그 조각을 그대로 쓴다(Tech-Index 창업용을 채울 때와 같은 기준).
//   기업정보 — 확인됨. KTRS-FM·Tech-Index 와 달리 [기업 담당자 정보] 구획이 없고 필수(*)가 넷뿐이라
//     모형 전용 조각(investment-model-company-info-form)으로 둔다.
//   대표자 역량 및 경력사항 — 확인됨. 경력 카드·행추가·총 경력 연수·입력 도움말은 KTRS-FM 과 같은
//     CareerForm 이고, 앞에 붙는 [대표자 역량] 구획만 이 모형의 칸(최종학력(취득학위)·전공·일치여부·
//     기술자격증)이라 모형 전용 조각으로 둔다.
//   기업 기타 정보 — 확인됨. 구획 순서는 KTRS-FM 과 비슷하지만 칸이 달라 모형 전용 조각으로 둔다.
//   핵심 기술 인력 현황 — 확인됨. 카드·행추가는 KTRS-FM 과 같은 TechStaffForm 이고, 이 모형 시안에는
//     [구분] 칸이 없고 동업종 종사경력이 [년·개월] 두 칸이라 그 두 모양을 옵션으로 켠다(최대 3명).
//   경영진 역량 및 구성 — 확인됨. 칸·인원(5명)·전문분야 중복 제한이 Tech-Index 창업용과 같아 그 조각
//     (tech-index-management-form)을 그대로 쓰고, 시안대로 부제만 짧은 문장으로 바꾼다.
//   재무정보 — 확인됨. Tech-Index 의 3개년 계정 묶음과 달리 당기·전기 금액 다섯 칸뿐이라 모형 전용
//     조각으로 둔다. 필수를 두지 않고 처음 값도 넣지 않는 것까지 Tech-Index 재무정보 탭과 같다
//     (그래야 0 을 그대로 적어도 [작성완료] 가 된다). 여섯 탭이 모두 채워져 [작업 중] 표시는 걷어냈다.
const INVESTMENT_MODEL_FORM_TABS: readonly FormTabItem[] = [
    {value: 'company', title: '기업정보', content: <InvestmentModelCompanyInfoForm />},
    {
        value: 'ceo',
        title: '대표자 역량 및 경력사항',
        content: <CareerForm title="대표자 역량 및 경력사항" leading={<InvestmentModelRepresentativeCapability />} />,
    },
    {value: 'etc', title: '기업 기타 정보', content: <InvestmentModelCompanyEtcForm />},
    {
        value: 'staff',
        title: '핵심 기술 인력 현황',
        content: (
            <TechStaffForm
                subtitle="대표자 제외 최대 3명 입력"
                maxCount={INVESTMENT_MODEL_MAX_STAFF_COUNT}
                showCategory={false}
                showIndustryCareerMonth
            />
        ),
    },
    {
        value: 'management',
        title: '경영진 역량 및 구성',
        content: <TechIndexManagementForm subtitle="대표자 제외 최대 5명 / 전문분야 중복 선택 불가" />,
    },
    {value: 'finance', title: '재무정보', content: <InvestmentModelFinanceForm />},
]

// 투자모형 탭이 화면을 열 때 이미 들고 있어야 하는 값 — 기업 기타 정보의 수량 칸 0 이다.
// "해당 사항 없음" 의 답이 빈칸이 아니라 0 인 칸들이라 처음부터 0 이 들어 있어야 한다.
const INVESTMENT_MODEL_DEFAULT_VALUES: Record<string, string> = {
    ...INVESTMENT_MODEL_COMPANY_ETC_DEFAULT_VALUES,
}

// 기관 개별평가 투자모형 2단계의 탭 구성 — 탭 이름·순서는 기업 투자모형과 같고(여섯 개),
// 기업정보 탭만 기관용이다(ORG_TECH_INDEX_GENERAL_FORM_TABS 가 하는 것과 같은 치환).
// 기관은 평가 대상 기업의 정보를 직접 입력하고 기업형태에 따라 칸이 갈리며, 이 모형 시안에는
// [기업 담당자 정보] 구획과 [기업 자가진단 결과보기] 버튼이 없어 그 두 곳을 끈다.
//
// 나머지 다섯 탭은 기업 투자모형 것을 그대로 쓴다 — 묻는 것이 평가 대상 기업의 사정과 사람이라,
// 누가 대신 적느냐(기업·기관)에 따라 달라지지 않는다. 인원 제한(기술 인력 3명 · 경영진 5명)과
// 재무정보의 필수·기본값 없음까지 같다. 그래서 화면이 들고 있어야 하는 값도 기업 쪽과 같은
// INVESTMENT_MODEL_DEFAULT_VALUES 를 그대로 쓴다.
const ORG_INVESTMENT_MODEL_FORM_TABS: readonly FormTabItem[] = INVESTMENT_MODEL_FORM_TABS.map((tab) =>
    tab.value === 'company'
        ? {...tab, content: <OrgCompanyInfoForm showManagerInfo={false} showSelfDiagnosisResult={false} />}
        : tab,
)

export {
    INVESTMENT_MODEL_DEFAULT_VALUES,
    INVESTMENT_MODEL_FORM_TABS,
    ORG_INVESTMENT_MODEL_FORM_TABS,
    ORG_SELF_DIAGNOSIS_FORM_TABS,
    ORG_TECH_INDEX_GENERAL_FORM_TABS,
    ORG_TECH_INDEX_STARTUP_FORM_TABS,
    SELF_DIAGNOSIS_FORM_TABS,
    TECH_INDEX_GENERAL_DEFAULT_VALUES,
    TECH_INDEX_GENERAL_FORM_TABS,
    TECH_INDEX_STARTUP_DEFAULT_VALUES,
    TECH_INDEX_STARTUP_FORM_TABS,
}
