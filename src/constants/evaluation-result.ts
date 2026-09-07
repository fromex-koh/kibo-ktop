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

// 평가 모형 — 목록의 모형 코드이자 모형 탭의 값이다. 결과 한 건의 model 이 이 중 하나이고,
// 고른 탭과 같은 값을 가진 건만 목록에 남는다.
export const EVALUATION_MODELS = ['ktrs-fm', 'tech-index', 'startup-tech-index', 'investment-model'] as const

export type EvaluationModel = (typeof EVALUATION_MODELS)[number]

// 결과값의 단위 — 등급으로 매기는 모형(KTRS-FM·투자모형)과 점수로 매기는 모형(Tech-Index 계열)이
// 다르다(시안 "평가결과 조회 case"). 값이 아니라 모형이 정하는 성질이라 모형 표에 둔다.
export type EvaluationGradeUnit = '등급' | '점'

export type EvaluationModelTab = {
    value: EvaluationModel
    label: string
    unit: EvaluationGradeUnit
}

// 모형 탭 — 시안은 [전체] 없이 네 모형만 둔다. 화면에 보이는 글자(label)와 결과값 단위는 여기 한 곳에서만
// 정하고, 결과 카드의 제목·단위도 이 표에서 찾아 쓴다 — 응답이 주는 것은 코드(model)와 값(grade)뿐이다.
export const EVALUATION_MODEL_TABS: readonly EvaluationModelTab[] = [
    {value: 'ktrs-fm', label: 'KTRS-FM', unit: '등급'},
    {value: 'tech-index', label: 'Tech-Index', unit: '점'},
    {value: 'startup-tech-index', label: '창업용 Tech-Index', unit: '점'},
    {value: 'investment-model', label: '투자모형', unit: '등급'},
]

// 결과 카드의 버튼 한 개 — 이미 마친 동작은 눌러도 할 일이 없어 잠긴다(시안: "은행전송, 보증신청 완료 시
// 버튼 비활성화"). 잠긴 버튼은 링크가 아니라 button 으로 그려 키보드로도 눌리지 않게 한다.
export type EvaluationResultAction = {
    label: string
    href: string
    done?: boolean
    /** 화면으로 가지 않고 모달을 여는 버튼이면 그 모달의 이름. 목록이 이 값을 보고 트리거로 감싼다. */
    opens?: 'guarantee-recommendation' | 'guarantee-history'
}

// 결과 한 건 = 카드 한 장. 평가결과 조회 응답을 이 모양으로 맞추면 화면은 그대로 그린다.
export type EvaluationResultItem = {
    id: string
    /** 평가 모형 코드 — 모형 탭 값과 같다(EVALUATION_MODELS). 모형 이름은 탭 표에서 찾아 보여 준다. */
    model: EvaluationModel
    /** 결과값 — 모형에 따라 등급(AA·B+)이거나 점수(6.6)다. 뒤에 붙는 단위는 모형 표가 정한다. */
    grade: string
    /** 평가일(YYYY-MM-DD). */
    evaluatedAt: string
    actions: readonly EvaluationResultAction[]
}

// 진행상태 — 목록의 상태 글자와 같은 값이다.
export const EVALUATION_STATUS_FILTERS: readonly EvaluationSelectOption[] = [
    {value: 'all', label: '진행상태'},
    {value: 'evaluated', label: '평가완료'},
    {value: 'analyzed', label: '분석완료'},
    {value: 'inProgress', label: '진행중'},
]

// ── 기관 평가결과 조회 ──────────────────────────────────────────────────────────
// 기업 화면과 같은 모형 탭을 쓰되, 기관은 그 아래 평가 방식(2depth)을 한 번 더 고르고 결과 카드에
// 어느 기업의 어떤 평가인지가 함께 나온다(시안 "마이페이지_평가결과 조회 (…)").

// 2depth — 평가 방식. Tech-Index 계열에서만 나온다(시안: KTRS-FM·투자모형 2depth 미노출).
export const ORG_EVALUATION_TYPES = [
    {value: 'individual', label: '개별평가'},
    {value: 'batch', label: '일괄평가'},
    {value: 'bulk-info', label: '대량정보조회'},
] as const

export type OrgEvaluationType = (typeof ORG_EVALUATION_TYPES)[number]['value']

/** 2depth 를 보여 주는 모형 — 나머지 모형의 결과는 모두 개별평가다. */
export const ORG_EVALUATION_TYPE_MODELS: readonly EvaluationModel[] = ['tech-index', 'startup-tech-index']

// 조회 필터의 검색 대상 — 결과 카드에 나오는 값 중 찾을 수 있는 것들이다(시안).
export const ORG_EVALUATION_SEARCH_TARGETS = [
    {value: 'companyName', label: '기업명'},
    {value: 'requestedBy', label: '조회 기관'},
] as const

/** 보증추천을 마친 건의 버튼 이름 — 입력이 끝나면 [보증추천] 이 이 이름으로 바뀐다(시안 주석). */
export const GUARANTEE_HISTORY_LABEL = '보증이력'

// 신청 건의 진행 상태 — 일괄평가·대량정보조회는 신청해 두고 처리를 기다리는 일이라 상태가 붙는다(시안).
export const ORG_EVALUATION_REQUEST_STATUS = {
    rejected: {label: '반려', color: 'error'},
    pending: {label: '승인대기중', color: 'secondary-purple'},
    approved: {label: '승인완료', color: 'info'},
} as const satisfies Record<string, {label: string; color: string}>

export type OrgEvaluationRequestStatus = keyof typeof ORG_EVALUATION_REQUEST_STATUS

// 결과 한 건 = 카드 한 장. 평가 방식에 따라 카드에 담기는 것이 다르다(시안 "평가결과 조회 case").
//
//   개별평가 — 기업 한 곳의 평가 결과다. 등급·점수와 그 기업 정보가 나오고, 결과를 여는 버튼이 붙는다.
//   일괄평가·대량정보조회 — 여러 기업을 한 번에 올린 신청 건이다. 진행 상태와 기업 수, 신청 정보가
//     나오고 버튼은 상태가 정한다(아래 ORG_EVALUATION_REQUEST_ACTIONS).
//
// 두 모양을 evaluationType 으로 가른다 — 'individual' 이면 앞의 것, 아니면 뒤의 것이다.
export type OrgIndividualEvaluationItem = {
    id: string
    model: EvaluationModel
    evaluationType: 'individual'
    /** 결과값 — 모형에 따라 등급(AA)이거나 점수(86.6)다. 단위는 모형 표가 정한다. */
    grade: string
    evaluatedAt: string
    companyName: string
    /** 기업 사업자번호 — 받은 표기를 그대로 보여 준다. */
    businessNumber: string
    /** 조회 기관 — 이 평가를 조회한 기관·지점이다. */
    requestedBy: string
    actions: readonly EvaluationResultAction[]
}

export type OrgEvaluationRequestItem = {
    id: string
    model: EvaluationModel
    evaluationType: Exclude<OrgEvaluationType, 'individual'>
    status: OrgEvaluationRequestStatus
    /**
     * 접수취소를 누를 수 있는지. 상태만으로 정해지지 않아 응답이 알려 준다 — 시안에는 같은 반려 건이라도
     * 취소가 열려 있는 카드와 잠긴 카드가 함께 있다(취소 기한·처리 단계에 따라 갈린다).
     * 넘기지 않으면 승인대기중일 때만 누를 수 있다.
     */
    canCancel?: boolean
    /** 한 신청에 올린 기업 수 — 카드 오른쪽에 "N 개 기업" 으로 나온다. */
    companyCount: number
    requestedAt: string
    /** 처리일 — 승인·반려된 뒤에 생기므로 승인대기중에는 없다. */
    processedAt?: string
    /** 사업/과제명 — 신청을 묶은 이름이다. */
    projectName: string
    requestedBy: string
}

export type OrgEvaluationHistoryItem = OrgIndividualEvaluationItem | OrgEvaluationRequestItem

// 신청 건의 버튼 — 어떤 버튼이 서는지는 상태가 정한다(시안). done 은 "지금은 누를 수 없음" 이다.
//   반려      : 고쳐서 다시 올릴 수 있다.
//   승인대기중 : 아직 처리 전이라 결과 파일이 없다.
//   승인완료   : 결과 파일을 내려받을 수 있다.
// 접수취소만은 상태가 아니라 건마다 다르므로(canCancel) 아래에서 따로 얹는다.
// 화면이 여는 주소는 아직 정해지지 않아 비워 둔다 — 연동 시 이 표의 href 만 채우면 된다.
const NOT_READY_PATH = '#'

const CANCEL_ACTION_LABEL = '접수취소'

const ORG_EVALUATION_REQUEST_REST_ACTIONS: Record<OrgEvaluationRequestStatus, readonly EvaluationResultAction[]> = {
    rejected: [{label: '재등록', href: NOT_READY_PATH}],
    pending: [
        {label: '엑셀결과', href: NOT_READY_PATH, done: true},
        {label: 'HTML 압축파일', href: NOT_READY_PATH, done: true},
    ],
    approved: [
        {label: '엑셀결과', href: NOT_READY_PATH},
        {label: 'HTML 압축파일', href: NOT_READY_PATH},
    ],
}

/** 신청 한 건이 갖는 버튼 — 맨 앞이 [접수취소]이고 그 잠김 여부만 건마다 다르다. */
export const getOrgEvaluationRequestActions = (
    status: OrgEvaluationRequestStatus,
    canCancel: boolean = status === 'pending',
): readonly EvaluationResultAction[] => [
    {label: CANCEL_ACTION_LABEL, href: NOT_READY_PATH, done: !canCancel},
    ...ORG_EVALUATION_REQUEST_REST_ACTIONS[status],
]

// 보증추천 모달의 칸 이름 — 모달(클라이언트)과 그 값을 채워 주는 화면·데이터(서버)가 함께 본다.
// 'use client' 파일에 두면 서버에서 import 할 때 실제 값이 아니라 참조가 넘어와 키가 깨진다.
export const GUARANTEE_RECOMMENDATION_FIELD = {
    companyName: 'guaranteeCompanyName',
    businessNumber: 'guaranteeBusinessNumber',
    industryCode: 'guaranteeIndustryCode',
    managerName: 'guaranteeManagerName',
    managerTel: 'guaranteeManagerTel',
    managerEmail: 'guaranteeManagerEmail',
    managerPosition: 'guaranteeManagerPosition',
    address: 'guaranteeAddress',
    addressDetail: 'guaranteeAddressDetail',
    companyTel: 'guaranteeCompanyTel',
    branch: 'guaranteeBranch',
    loanWorking: 'guaranteeLoanWorking',
    loanFacility: 'guaranteeLoanFacility',
    otherGuarantee: 'guaranteeOtherGuarantee',
    bankManagerName: 'guaranteeBankManagerName',
    bankManagerTel: 'guaranteeBankManagerTel',
    bankManagerPosition: 'guaranteeBankManagerPosition',
    bankName: 'guaranteeBankName',
    bankBranch: 'guaranteeBankBranch',
} as const
