// 기술평가 단계형 화면에서 공통으로 사용하는 단계명.
export const SELF_DIAGNOSIS_STEPS = [
    '고객 정보 활용 동의',
    '기업·기술정보 입력',
    '체크리스트 입력',
    '제출 완료',
] as const

// Tech-Index(혁신성장지수) 단계명 — 체크리스트 입력 단계가 없어 3단계다(시안 진행바 "1 / 3").
export const TECH_INDEX_STEPS = ['고객 정보 활용 동의', '기업·기술정보 입력', '제출 완료'] as const

// Tech-Index [기술 인력 현황] 탭 맨 위 인원 요약의 값 이름과 처음 값.
//
// 화면(tech-index-staff-summary)과 탭 구성(self-diagnosis-form-tabs)이 함께 봐야 해서 여기 둔다.
// 화면은 'use client' 파일이고 탭 구성은 서버 모듈인데, 서버 모듈이 'use client' 파일의 값을 가져오면
// 실제 객체가 아니라 클라이언트 참조가 넘어와 값이 비어 버린다(컴포넌트는 그렇게 넘겨도 정상이다).
// 어느 쪽에도 속하지 않는 이 파일에 두면 양쪽이 같은 값을 본다.
//
// "해당 사항 없음" 의 답은 빈칸이 아니라 0 이다 — 빈칸으로 제출되면 받는 쪽이 "" 를 숫자로 다시 해석해야 한다.
export const TECH_INDEX_STAFF_COUNT_DEFAULT = '0'
export const TECH_INDEX_RESEARCH_STAFF_FIELD = 'researchStaffCount'
export const TECH_INDEX_PRODUCTION_STAFF_FIELD = 'productionStaffCount'
export const TECH_INDEX_TOTAL_STAFF_FIELD = 'totalStaffCount'

// 총 칸은 앞 두 칸을 더해 그리므로 두지 않는다(0 + 0 = 0 이 저절로 나온다).
export const TECH_INDEX_STAFF_SUMMARY_DEFAULT_VALUES: Record<string, string> = {
    [TECH_INDEX_RESEARCH_STAFF_FIELD]: TECH_INDEX_STAFF_COUNT_DEFAULT,
    [TECH_INDEX_PRODUCTION_STAFF_FIELD]: TECH_INDEX_STAFF_COUNT_DEFAULT,
}

// Tech-Index [기술실적 및 인증실적] 탭의 수량 칸 — 위 인원 요약과 같은 이유로 여기 둔다.
// 네 칸 모두 사람이 적고, "해당 사항 없음" 의 답은 빈칸이 아니라 0 이다.
export const TECH_INDEX_RECORD_COUNT_DEFAULT = '0'
export const TECH_INDEX_RECORD_FIELDS = [
    'techDevelopmentCount',
    'techUtilizationCommercializationCount',
    'techDevelopmentCommercializationCount',
    'techCertificationCount',
] as const

export const TECH_INDEX_RECORD_DEFAULT_VALUES: Record<string, string> = Object.fromEntries(
    TECH_INDEX_RECORD_FIELDS.map((name) => [name, TECH_INDEX_RECORD_COUNT_DEFAULT]),
)

// Tech-Index [특허 보유현황] 탭의 수량 칸 — 위 인원 요약과 같은 이유로 여기 둔다.
// 합계 칸(읽기 전용)은 카드 값을 더해 그리므로 여기 두지 않는다 — 카드가 0 이면 합계도 0 이 된다.
export const TECH_INDEX_PATENT_COUNT_DEFAULT = '0'
// 사람이 적는 유일한 합계 칸.
export const TECH_INDEX_PATENT_APPLIED_FIELD = 'appliedPatentCount'
// 카드마다 [특허정보 조회] 로 채워지는 수량 칸(카드 번호를 뺀 이름). 조회 전에도 0 으로 보인다.
export const TECH_INDEX_PATENT_CARD_COUNT_FIELDS = [
    'claimCount',
    'registrationDays',
    'citingCount',
    'citedCount',
    'ipcCount',
] as const
// 카드 값 이름 — 화면과 처음 값이 같은 규칙으로 만든다.
export const techIndexPatentField = (cardId: number, name: string) => `patent-${cardId}-${name}`
// 처음 화면에 있는 카드 번호. useRepeatCards 의 initialCount 기본값(1)과 같다.
const PATENT_FIRST_CARD_ID = 1

export const TECH_INDEX_PATENT_DEFAULT_VALUES: Record<string, string> = {
    [TECH_INDEX_PATENT_APPLIED_FIELD]: TECH_INDEX_PATENT_COUNT_DEFAULT,
    ...Object.fromEntries(
        TECH_INDEX_PATENT_CARD_COUNT_FIELDS.map((name) => [
            techIndexPatentField(PATENT_FIRST_CARD_ID, name),
            TECH_INDEX_PATENT_COUNT_DEFAULT,
        ]),
    ),
}
