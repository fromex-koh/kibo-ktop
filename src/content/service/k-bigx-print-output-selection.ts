// 인쇄 출력물 선택 모달(KbigxPrintOutputSelectionDialog)의 문구 · 목업.
// 출력할 보고서 구성 항목을 고르는 화면으로, 화면정의서의 "인쇄 출력물 선택"에 해당한다
// (실제 출력은 이 화면에서 고른 항목으로 이어지는 다음 단계다).
//
// [프론트엔드 연동] MOCK_PRINT_OUTPUT_SELECTION_SUMMARY(기업명·조회기준일)는 출력할 보고서의 값으로,
// MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED(처음 선택 항목)는 사용자 설정으로 바꿔 모달의 summary · defaultSelected 에 넘긴다.

const PRINT_OUTPUT_SELECTION_TITLE = '인쇄 출력물 선택'
const PRINT_OUTPUT_SELECTION_ALL = '전체선택'

// 출력할 수 있는 보고서 구성 항목 — id 는 출력 요청에 넘길 키다.
const PRINT_OUTPUT_SELECTION_SECTIONS = [
    {id: 'briefing', label: '진단브리핑'},
    {id: 'company', label: '기업현황'},
    {id: 'innovation', label: '기술혁신정보'},
    {id: 'tech-index', label: 'Tech-Index'},
    {id: 'credit-finance', label: '신용/재무정보'},
    {id: 'activity', label: '활동성정보'},
] as const

type PrintOutputSectionId = (typeof PRINT_OUTPUT_SELECTION_SECTIONS)[number]['id']

// ── [퍼블리싱 전용] 목업(API 연결 시 삭제) ──
const MOCK_PRINT_OUTPUT_SELECTION_SUMMARY: readonly {label: string; value: string}[] = [
    {label: '기업명', value: '프롬엑스테크'},
    {label: '조회기준일', value: '2026-05-22'},
]
// 처음 상태 예시 — 진단브리핑 · 기업현황이 골라져 있다.
const MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED: readonly PrintOutputSectionId[] = ['briefing', 'company']
// ── 목업 끝 ──

export {
    MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED,
    MOCK_PRINT_OUTPUT_SELECTION_SUMMARY,
    PRINT_OUTPUT_SELECTION_ALL,
    PRINT_OUTPUT_SELECTION_SECTIONS,
    PRINT_OUTPUT_SELECTION_TITLE,
}
export type {PrintOutputSectionId}
