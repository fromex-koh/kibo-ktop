// 기술평가 단계형 화면에서 공통으로 사용하는 단계명.
export const SELF_DIAGNOSIS_STEPS = [
    '고객 정보 활용 동의',
    '기업·기술정보 입력',
    '체크리스트 입력',
    '제출 완료',
] as const

// Tech-Index(혁신성장지수) 단계명 — 체크리스트 입력 단계가 없어 3단계다(시안 진행바 "1 / 3").
export const TECH_INDEX_STEPS = ['고객 정보 활용 동의', '기업·기술정보 입력', '제출 완료'] as const

// 기관 개별평가 Tech-Index 단계명 — 기업 흐름과 달리 첨부서류를 받는 [평가 신청하기] 단계가 하나 더 있다
// (화면정의서 (1)~(5): 동의 → 입력 → 평가 신청 → 최종 확인 → 완료. 최종 확인은 검토 화면이라 진행바에는
// 넣지 않는다 — KTRS-FM 이 체크리스트까지만 바에 두는 것과 같은 기준).
export const ORG_TECH_INDEX_STEPS = ['고객 정보 활용 동의', '기업·기술정보 입력', '평가 신청하기', '제출 완료'] as const

// 기관 개별평가 투자모형 단계명 — 체크리스트 입력과 평가 신청하기가 모두 있어 다섯 단계다
// (시안 "투자모형_1단계_고객정보활용동의" 진행바 "1 / 5"). 제출 전 최종 확인은 검토 화면이라 넣지 않는다
// (기관 Tech-Index 와 같은 기준).
export const ORG_INVESTMENT_MODEL_STEPS = [
    '고객정보활용동의',
    '기업·기술정보 입력',
    '체크리스트 입력',
    '평가 신청하기',
    '제출 완료',
] as const

// 기관 일괄평가 단계명 — 1단계에서 평가모형과 진행할 업무를 고르고, 2단계에서 표준엑셀·동의서를 올린다
// (시안 "[일괄평가] 2단계_대량정보 조회 신청" 진행바 "2 / 3"). 대량정보 조회·일괄평가 진행 두 갈래가 같은 단계를 쓴다.
export const BATCH_EVALUATION_STEPS = ['평가모형 선택', '표준엑셀·동의서 업로드', '신청완료'] as const

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
// 카드 상태에서 계산한 출원 특허 합계의 제출 필드.
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
    ...Object.fromEntries(
        TECH_INDEX_PATENT_CARD_COUNT_FIELDS.map((name) => [
            techIndexPatentField(PATENT_FIRST_CARD_ID, name),
            TECH_INDEX_PATENT_COUNT_DEFAULT,
        ]),
    ),
}

// 투자모형 [기업 기타 정보] 탭의 수량 칸 — 화면(investment-model-company-etc-form)과 탭 구성
// (self-diagnosis-form-tabs)이 함께 봐야 해서 여기 둔다. 화면은 'use client' 파일이고 탭 구성은 서버
// 모듈이라, 서버 모듈이 'use client' 파일의 값을 가져오면 실제 객체가 아니라 클라이언트 참조가 넘어와
// 값이 비어 버린다(위 인원 요약과 같은 이유).
//
// "해당 사항 없음" 의 답은 빈칸이 아니라 0 이다 — 카드 안내도 "해당사항이 없을 경우 0으로 입력" 이다.
export const INVESTMENT_MODEL_COUNT_DEFAULT = '0'

// 지식재산권 — 권리별 건수. 시안의 3열 배치 순서 그대로이며, 마지막 두 칸은 이름이 길어 2열로 내려온다.
export const INVESTMENT_MODEL_IP_FIELDS = [
    {id: 'ipPatentRegistered', label: '등록특허권'},
    {id: 'ipUtilityModel', label: '실용신안권'},
    {id: 'ipSemiconductorLayout', label: '반도체배치설계권'},
    {id: 'ipPlantVariety', label: '품종보호권'},
    {id: 'ipDesign', label: '디자인권'},
    {id: 'ipTrademark', label: '상표권'},
    {id: 'ipTradeSecret', label: '영업비밀'},
    {id: 'ipTechEscrow', label: '기술임치증'},
    {id: 'ipCopyrightProgram', label: '저작권(컴퓨터프로그램)'},
] as const

export const INVESTMENT_MODEL_IP_WIDE_FIELDS = [
    {id: 'ipCopyrightGeneral', label: '저작권(일반)·저작인접권'},
    {id: 'ipDatabaseProducer', label: '데이터베이스제작자권리'},
] as const

export const INVESTMENT_MODEL_TECH_STAFF_FIELD = 'techStaffCount'
export const INVESTMENT_MODEL_EMPLOYEE_COUNT_FIELD = 'employeeCount'
export const INVESTMENT_MODEL_EMPLOYEE_COUNT_LAST_YEAR_FIELD = 'employeeCountLastYear'

// 화면이 열릴 때부터 0 이 들어 있어야 하는 칸 — 위 UnitField 를 쓰는 칸과 같아야 한다.
const INVESTMENT_MODEL_COUNT_FIELD_IDS = [
    INVESTMENT_MODEL_TECH_STAFF_FIELD,
    ...INVESTMENT_MODEL_IP_FIELDS.map((field) => field.id),
    ...INVESTMENT_MODEL_IP_WIDE_FIELDS.map((field) => field.id),
    'salesLastYear',
    'salesThisYear',
    'salesPartnerCount',
    INVESTMENT_MODEL_EMPLOYEE_COUNT_FIELD,
    INVESTMENT_MODEL_EMPLOYEE_COUNT_LAST_YEAR_FIELD,
] as const

export const INVESTMENT_MODEL_COMPANY_ETC_DEFAULT_VALUES: Record<string, string> = Object.fromEntries(
    INVESTMENT_MODEL_COUNT_FIELD_IDS.map((id) => [id, INVESTMENT_MODEL_COUNT_DEFAULT]),
)

// 투자모형 [재무정보] 탭의 금액 칸 — 화면(investment-model-finance-form)과 탭 구성이 함께 봐야 해서
// 여기 둔다(위 기업 기타 정보 기본값과 같은 이유). 시안 배치대로 1줄 2칸 · 2줄 3칸으로 나눠 적는다.
export const INVESTMENT_MODEL_FINANCE_ROW1_FIELDS = [
    {id: 'currentSales', label: '당기 매출액'},
    {id: 'currentOperatingProfit', label: '당기 영업이익'},
] as const

export const INVESTMENT_MODEL_FINANCE_ROW2_FIELDS = [
    {id: 'currentNetProfit', label: '당기 순이익'},
    {id: 'currentTotalEquity', label: '당기 자본총계'},
    {id: 'previousNetProfit', label: '전기 순이익'},
] as const

// 업종코드로 갈리는 체크리스트(투자모형·KTRS-FM) — 화면(기업정보 탭)과 이동 경로(2단계 page)가 같은
// 기준을 봐야 해서 여기 둔다. 두 곳 모두 'use client' 파일이 아니어야 값이 그대로 전달된다(위 기본값들과 같은 이유).
//
// 판별 기준은 한국표준산업분류(KSIC) 대분류 C(제조업) = 중분류 10~34 다. 업종코드 조회에서 고른 값의
// 앞 두 자리가 이 범위면 제조, 아니면 서비스 체크리스트로 간다.
// 실제 연동에서 응답이 제조·서비스 구분을 직접 준다면 이 함수 대신 그 값을 쓰면 된다.
export const SELECTED_INDUSTRY_CODE_FIELD = 'industryCode'

const MANUFACTURING_MAJOR_CODE_MIN = 10
const MANUFACTURING_MAJOR_CODE_MAX = 34

export const isManufacturingIndustryCode = (code: string) => {
    const majorCode = Number(code.slice(0, 2))

    return (
        Number.isInteger(majorCode) &&
        majorCode >= MANUFACTURING_MAJOR_CODE_MIN &&
        majorCode <= MANUFACTURING_MAJOR_CODE_MAX
    )
}
