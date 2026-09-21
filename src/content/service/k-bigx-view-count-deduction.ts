// 조회횟수 차감안내 모달(KbigxViewCountDeductionDialog)의 문구 · 목업 — 시안 "K-BIGx 보고서_K-BIGx 보고서 결제"
// (40007590:14087) 그대로다.
//
// [프론트엔드 연동] 기업명 · 이용중인 플랜 · 잔여 이용권 · 월 조회한도는 조회 대상과 보유 이용권 값으로 바꿔 넘긴다.

const VIEW_COUNT_DEDUCTION_TITLE = 'K-BIGx 보고서 조회'
const VIEW_COUNT_DEDUCTION_QUESTION = 'K-BIGx 보고서를 생성하시겠습니까?'
const VIEW_COUNT_DEDUCTION_NOTICE = '조회 시 이용권 1회가 차감됩니다.'
const VIEW_COUNT_DEDUCTION_PASS_TITLE = '이용권 현황'

// ── 목업(API 연결 시 삭제) ──
const MOCK_VIEW_COUNT_DEDUCTION = {
    companyName: '프롬엑스테크',
    planName: 'BASIC 요금제',
    remainingCount: 12,
    monthlyLimit: 60,
} as const
// ── 목업 끝 ──

export {
    MOCK_VIEW_COUNT_DEDUCTION,
    VIEW_COUNT_DEDUCTION_NOTICE,
    VIEW_COUNT_DEDUCTION_PASS_TITLE,
    VIEW_COUNT_DEDUCTION_QUESTION,
    VIEW_COUNT_DEDUCTION_TITLE,
}
