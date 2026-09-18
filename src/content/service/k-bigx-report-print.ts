// 보고서 출력 모달(KbigxReportPrintDialog)의 문구 · 목업 — 시안 "K-BIGx 보고서_보고서 출력"(40007590:12084) 그대로다.
//
// [프론트엔드 연동] 기업명·조회기준일은 출력할 보고서의 값으로, 처음 선택 항목은 사용자 설정으로 바꿔 넘긴다.

const REPORT_PRINT_TITLE = '보고서 출력'
const REPORT_PRINT_ALL = '전체선택'

// 출력할 수 있는 보고서 구성 항목 — id 는 출력 요청에 넘길 키다.
const REPORT_PRINT_SECTIONS = [
    {id: 'briefing', label: '진단브리핑'},
    {id: 'company', label: '기업현황'},
    {id: 'innovation', label: '기술혁신정보'},
    {id: 'tech-index', label: 'Tech-Index'},
    {id: 'credit-finance', label: '신용/재무정보'},
    {id: 'activity', label: '활동성정보'},
] as const

type ReportPrintSectionId = (typeof REPORT_PRINT_SECTIONS)[number]['id']

// ── 목업(API 연결 시 삭제) ──
const MOCK_REPORT_PRINT_SUMMARY: readonly {label: string; value: string}[] = [
    {label: '기업명', value: '프롬엑스테크'},
    {label: '조회기준일', value: '2026-05-22'},
]
// 시안의 처음 상태 — 진단브리핑 · 기업현황이 골라져 있다.
const MOCK_REPORT_PRINT_DEFAULT_SELECTED: readonly ReportPrintSectionId[] = ['briefing', 'company']
// ── 목업 끝 ──

export {
    MOCK_REPORT_PRINT_DEFAULT_SELECTED,
    MOCK_REPORT_PRINT_SUMMARY,
    REPORT_PRINT_ALL,
    REPORT_PRINT_SECTIONS,
    REPORT_PRINT_TITLE,
}
export type {ReportPrintSectionId}
