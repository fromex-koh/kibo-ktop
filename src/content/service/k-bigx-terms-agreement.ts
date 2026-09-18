// K-BIGx 보고서 이용약관 동의 모달(KbigxTermsAgreementDialog)의 문구 — 시안
// "K-BIGx 보고서_K-BIGx 보고서 이용약관 동의"(40007590:12048) 그대로다.

const TERMS_AGREEMENT_TITLE = 'K-BIGx 보고서 이용약관 동의'

const TERMS_AGREEMENT_NOTICE = '최초 K-BIGx 서비스 이용 시 약관에 대한 동의가 필요합니다.'

const TERMS_AGREEMENT_ALL = '이용약관 전체 동의'

// 개별 동의 항목 — id 는 동의 값을 저장할 때의 키다. [프론트엔드 연동] 동의 결과는 이 키로 넘긴다.
const TERMS_AGREEMENT_ITEMS = [
    {id: 'terms', label: 'K-BIGx 이용약관 동의 (필수)', isRequired: true},
    {id: 'marketing', label: '마케팅 알림 수신 동의 (선택)', isRequired: false},
] as const

type TermsAgreementItemId = (typeof TERMS_AGREEMENT_ITEMS)[number]['id']

export {TERMS_AGREEMENT_ALL, TERMS_AGREEMENT_ITEMS, TERMS_AGREEMENT_NOTICE, TERMS_AGREEMENT_TITLE}
export type {TermsAgreementItemId}
