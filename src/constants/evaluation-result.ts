// 평가결과 조회 — 목록과 화면이 함께 쓰는 값.
//
// 서버 컴포넌트(화면)와 클라이언트 컴포넌트(목록)가 같은 표를 봐야 하므로 'use client' 파일이 아니라
// 이 자리에 둔다 — 클라이언트 파일의 상수를 서버에서 import 하면 실제 값이 아니라 빈 참조가 넘어온다.

// 진행 상태 — 색은 시안 실측이다(평가완료 status-evaluated · 분석완료 purple.600 · 진행중 green.800).
// 평가완료의 파랑은 팔레트 밖 값이라 common 앵커(status-blue)에 두고 시맨틱으로 이었다.
// 상태를 색만으로 전달하지 않고 글자를 함께 둔다[5.3.1]. 배지가 아니라 글자만 놓는 자리라
// 배경 없이 글자 색으로만 구분한다(시안).
export const EVALUATION_RESULT_STATUS = {
    evaluated: {label: '평가완료', className: 'text-status-evaluated'},
    analyzed: {label: '분석완료', className: 'text-purple-600'},
    inProgress: {label: '진행중', className: 'text-green-800'},
} as const

export type EvaluationResultStatus = keyof typeof EVALUATION_RESULT_STATUS

// 분석 버튼 — 모형에 따라 둘 다 나오기도 하고 하나만 나오기도 한다(투자모형은 일반분석만).
// 아이콘은 컴포넌트(함수)라 서버에서 넘길 수 없어 목록 쪽에서 붙인다 — 여기는 종류만 정한다.
export const ANALYSIS_KINDS = ['general', 'deep'] as const

export type AnalysisKind = (typeof ANALYSIS_KINDS)[number]

// 조회기간 빠른 선택 — 조회 필터의 기간 프리셋.
export const EVALUATION_PERIOD_PRESETS = [
    {value: 'today', label: '오늘'},
    {value: '1month', label: '1개월'},
    {value: '3months', label: '3개월'},
    {value: 'all', label: '전체'},
] as const

export const DEFAULT_EVALUATION_PERIOD = 'all'

export type EvaluationSelectOption = {value: string; label: string}

// 평가 모형 — [전체] 자리의 선택지. 목록의 모형 이름과 같은 글자를 쓴다.
export const EVALUATION_MODEL_FILTERS: readonly EvaluationSelectOption[] = [
    {value: 'all', label: '전체'},
    {value: 'ktrs-fm', label: 'KTRS-FM'},
    {value: 'tech-index', label: 'Tech-Index'},
    {value: 'startup-tech-index', label: '창업용 Tech-Index'},
    {value: 'investment-model', label: '투자모형'},
]

// 진행상태 — 목록의 상태 글자와 같은 값이다.
export const EVALUATION_STATUS_FILTERS: readonly EvaluationSelectOption[] = [
    {value: 'all', label: '진행상태'},
    {value: 'evaluated', label: '평가완료'},
    {value: 'analyzed', label: '분석완료'},
    {value: 'inProgress', label: '진행중'},
]
