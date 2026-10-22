import type {InnovationGrowthReport} from '@/content/service/k-bigx-innovation-report'

// 인쇄 출력물 선택 모달(KbigxPrintOutputSelectionDialog)의 문구 · 항목 · 목업.
//
// [프론트엔드 연동]
//   · 웹 보고서(기업 · 기관)는 요약을 toPrintOutputSummary(report) 로 만들고, [출력하기]는 고른 항목으로 인쇄본을 새 탭에서 인쇄한다
//     (연결: components/custom/innovation-growth-report-document.tsx, 주소: k-bigx-print-report.ts 의 getKbigxPrintHref).
//   · 항목 id 는 인쇄본 주소의 ?sections= 값이자 인쇄본의 장 이름표다 — 항목을 더하면 k-bigx-print-report.ts 의 SECTION_PAGES 도 더한다.
//   · 아래 MOCK_* 는 모달 단독 확인 화면(print-output-selection)용이다.

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

// 출력 대상 요약 — 보고서의 기업명 · 조회기준일. 웹 보고서의 모달이 쓴다(조회 API 로 바꾸면 따라 바뀐다).
const toPrintOutputSummary = (
    report: Pick<InnovationGrowthReport, 'companyName' | 'lookupBaseDate'>,
): readonly {label: string; value: string}[] => [
    {label: '기업명', value: report.companyName},
    {label: '조회기준일', value: report.lookupBaseDate},
]

// ── [퍼블리싱 전용] 목업(API 연결 시 삭제) ──
const MOCK_PRINT_OUTPUT_SELECTION_SUMMARY: readonly {label: string; value: string}[] = [
    {label: '기업명', value: '프롬엑스테크'},
    {label: '조회기준일', value: '2026-05-22'},
]
// 열 때 골라 둘 항목 예시(defaultSelected) — 진단브리핑 · 기업현황.
const MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED: readonly PrintOutputSectionId[] = ['briefing', 'company']
// ── 목업 끝 ──

export {
    MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED,
    MOCK_PRINT_OUTPUT_SELECTION_SUMMARY,
    PRINT_OUTPUT_SELECTION_ALL,
    PRINT_OUTPUT_SELECTION_SECTIONS,
    PRINT_OUTPUT_SELECTION_TITLE,
    toPrintOutputSummary,
}
export type {PrintOutputSectionId}
