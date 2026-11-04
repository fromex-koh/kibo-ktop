// 기업혁신성장 보고서 생성 모달(KbigxReportCreateDialog)의 문구 · 목업.
//
// [프론트엔드 연동] 기업명 · 특허 정보는 조회 화면에서 고른 기업 · 특허 값으로 넘긴다(아래 MOCK_* 는 report-create 확인 화면용).

type ReportCreatePatent = readonly {label: string; value: string}[]

const REPORT_CREATE_TITLE = '기업혁신성장 보고서 생성'

const REPORT_CREATE_PATENT_TITLE = '특허 정보'

const REPORT_CREATE_PAID_NOTICE = {
    title: '유료 서비스 안내',
    items: [
        'K-BIGx 보고서 서비스는 유료서비스로 이용권에서 차감됩니다.',
        '단, 본인 기업 조회일 경우 무료로 제공됩니다.',
    ],
} as const

// 특허수가 없는 기업의 기본 안내 — notice 를 넘기지 않을 때 특허 정보 상자 대신 보인다.
// 차감 여부는 케이스마다 달라, 조회 화면은 getInnovationGrowthReportNotice 로 notice 를 넘긴다(둘째 줄이 케이스별로 바뀜).
const REPORT_CREATE_NO_PATENT_NOTICE = {
    title: '보유 특허 정보가 확인되지 않습니다',
    items: ['기술혁신정보를 제외한 보고서가 생성됩니다.', '보고서를 생성하실 경우 이용횟수는 차감되지 않습니다.'],
} as const

// ── 목업(API 연결 시 삭제) ──
const MOCK_REPORT_CREATE_COMPANY = '프롬엑스테크'

const MOCK_REPORT_CREATE_PATENT: ReportCreatePatent = [
    {label: '특허명', value: '에너지 최적화 예측 플랫폼'},
    {label: '출원번호', value: '10-2022-0077777'},
    {label: '특허출원일자', value: '2024-03-11'},
    {label: '특허정보일자', value: '2024-03-11'},
    {label: '소분류명', value: '에너지 플랫폼'},
    {label: '소분류코드', value: 'EG00111'},
]
// ── 목업 끝 ──

export {
    MOCK_REPORT_CREATE_COMPANY,
    MOCK_REPORT_CREATE_PATENT,
    REPORT_CREATE_NO_PATENT_NOTICE,
    REPORT_CREATE_PAID_NOTICE,
    REPORT_CREATE_PATENT_TITLE,
    REPORT_CREATE_TITLE,
}
export type {ReportCreatePatent}
