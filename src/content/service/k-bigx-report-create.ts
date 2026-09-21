// 기업혁신성장 보고서 생성 모달(KbigxReportCreateDialog)의 문구 · 목업 — 시안
// "K-BIGx 보고서_기업혁신성장 보고서 생성"(40007590:14037) 그대로다.
//
// [프론트엔드 연동] 기업명·특허 정보는 보고서 검색 결과에서 고른 행의 값으로 바꿔 넘긴다(아래는 시안 목업).

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

// 특허수가 없는 기업 — 시안 "…_기업혁신성장 보고서 생성_특허수가 없는 기업"(40007590:13996).
// 특허 정보 상자 대신 이 안내만 보인다(유료 안내도 대신한다 — 이용횟수가 차감되지 않는다).
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
