// 보고서 재조회 안내 모달(KbigxReportRecheckDialog)의 문구.

const REPORT_RECHECK_TITLE = '보고서 재조회 안내'
const REPORT_RECHECK_HEADLINE = '금일 조회한 보고서가 있습니다.'
const REPORT_RECHECK_DESCRIPTION = [
    '금일 동일한 보고서를 조회한 이력이 있습니다.',
    "기존 보고서는 '보고서 이력 조회' 화면에서 다시 확인할 수 있습니다.",
] as const
// 차감 안내 — 앞말 + 굵게 보일 부분.
const REPORT_RECHECK_NOTICE = {lead: '신규 보고서 생성 시', emphasis: '이용권이 차감됩니다.'} as const
const REPORT_RECHECK_CONFIRM_LABEL = '조회하기'

// [퍼블리싱 확인용] 모달 단독 화면(report-recheck)의 바닥 설명 — 서비스 화면에는 쓰지 않는다.
const REPORT_RECHECK_FLOW = [
    {label: '노출 시점', value: '조회 화면 [보고서 생성] 버튼 선택 시 ([기업혁신성장 보고서 생성] 팝업 대신 노출)'},
    {label: '노출 조건', value: '동일 이용자가 금일 이미 조회한 기업을 동일한 선택 특허 조건으로 다시 조회하는 경우'},
    {label: '버튼 구성', value: '[취소] 팝업 닫기 · [조회하기] 신규 보고서 조회 진행'},
    {label: '적용 범위', value: 'FO 보고서 조회 화면 · 대량정보조회 제외'},
] as const

export {
    REPORT_RECHECK_CONFIRM_LABEL,
    REPORT_RECHECK_DESCRIPTION,
    REPORT_RECHECK_FLOW,
    REPORT_RECHECK_HEADLINE,
    REPORT_RECHECK_NOTICE,
    REPORT_RECHECK_TITLE,
}
