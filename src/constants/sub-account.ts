// 기관 마이페이지 — 하위계정 현황.
//
// 협약 정보(매칭 사업·사업기간·이용서비스)와 계정 수 요약이 먼저 오고, 그 아래에 하위계정 카드가 놓인다.
// 카드마다 [⋮] 메뉴로 수정·비밀번호 초기화·상태 변경·삭제를 고른다.

/**
 * 이 화면이 다루는 서비스 이름 — 협약 정보의 [이용서비스] 와 상세정보 모달의 이용건수가 같은 값을 쓴다.
 * 화면에 그대로 나오는 글자이므로 코드가 아니라 이름 그대로 둔다(시안).
 */
export const SUB_ACCOUNT_SERVICES = ['K-BIGx', 'KTRS-FM', 'Tech-Index', '창업용 Tech-Index', '투자모형'] as const

export type SubAccountService = (typeof SUB_ACCOUNT_SERVICES)[number]

/**
 * 하위계정 현황 화면의 네 가지 케이스 — 협약 여부(협약·비협약)와 기술평가부 여부에 따라 갈린다.
 * 협약을 맺지 않았으면 매칭 사업·사업기간이 없어 이용서비스만 남는다.
 *   · 기술평가부가 아니면 K-BIGx 보고서만 쓴다.
 *   · 기술평가부이면 평가 모형을 쓰고, 협약을 맺으면 그중 KTRS-FM·투자모형만 열린다.
 * 화면정의서에서는 한 행(하위 계정 현황)이라 퍼블리싱 인덱스에서도 같은 IA 행으로 묶는다.
 */
export const SUB_ACCOUNT_AGREEMENT_CASES = {
    'tech-non-partner': {
        label: '[기술평가부] 비협약 은행/기관',
        isPartner: false,
        services: ['KTRS-FM', 'Tech-Index', '창업용 Tech-Index', '투자모형'],
    },
    'tech-partner': {label: '[기술평가부] 협약 은행/기관', isPartner: true, services: ['KTRS-FM', '투자모형']},
    'k-bigx-non-partner': {label: '[K-BIGx] 비협약 은행/기관', isPartner: false, services: ['K-BIGx']},
    'k-bigx-partner': {label: '[K-BIGx] 협약 은행/기관', isPartner: true, services: ['K-BIGx']},
} as const satisfies Record<string, {label: string; isPartner: boolean; services: readonly SubAccountService[]}>

export type SubAccountAgreementCase = keyof typeof SUB_ACCOUNT_AGREEMENT_CASES

/** 계정 상태 — 목록 필터와 카드 배지가 같은 값을 쓴다. */
export const SUB_ACCOUNT_STATUS = {
    active: {label: '사용', color: 'info'},
    suspended: {label: '사용정지', color: 'neutral'},
} as const satisfies Record<string, {label: string; color: string}>

export type SubAccountStatus = keyof typeof SUB_ACCOUNT_STATUS

/**
 * [상태 변경] 이 향하는 상태 — 사용 ↔ 사용정지 둘뿐이라 지금 상태의 반대다.
 * 메뉴 이름("사용정지로 변경")과 확인 모달의 물음이 같은 값을 쓴다.
 */
export const nextSubAccountStatus = (status: SubAccountStatus): SubAccountStatus =>
    status === 'active' ? 'suspended' : 'active'

/**
 * 상태 이름 뒤에 붙는 조사 — 받침이 있는 "사용" 은 "으로", 없는 "사용정지" 는 "로" 다.
 * 메뉴 이름("사용정지로 변경")과 확인 모달의 물음이 같은 값을 쓴다.
 */
export const SUB_ACCOUNT_STATUS_PARTICLE = {
    active: '으로',
    suspended: '로',
} as const satisfies Record<SubAccountStatus, string>

/**
 * 하위계정 관련 작업이 끝났을 때 띄우는 완료 토스트 — 목록 화면과 토스트 단독 화면이 같은 말을 쓴다.
 * id 는 같은 토스트가 겹쳐 쌓이지 않게 하는 식별자다(연달아 부르면 앞의 것을 대체한다).
 * 삭제는 여기 없다 — 지운 카드가 목록에서 사라지는 것이 그 자체로 결과를 알린다(화면정의서에도 토스트가 없다).
 */
export const SUB_ACCOUNT_TOAST = {
    create: {id: 'sub-account-create', message: '하위계정이 등록되었습니다.'},
    passwordReset: {id: 'sub-account-password-reset', message: '비밀번호가 초기화되었습니다.'},
    // 상태 변경만 문구가 결과에 따라 달라진다 — 무엇이 바뀌었는지가 아니라 "무엇으로" 바뀌었는지가
    // 토스트만 보고도 읽혀야 한다("사용정지로 변경되었습니다."). 바뀐 뒤의 상태를 넘긴다.
    statusChange: {
        id: 'sub-account-status-change',
        message: (status: SubAccountStatus) =>
            `계정 상태가 ${SUB_ACCOUNT_STATUS[status].label}${SUB_ACCOUNT_STATUS_PARTICLE[status]} 변경되었습니다.`,
    },
} as const

/** [⋮] 의 상태 변경 메뉴 이름 — 지금 상태가 아니라 바뀔 상태를 담는다(시안 "사용정지로 변경"). */
export const subAccountStatusChangeLabel = (status: SubAccountStatus) => {
    const next = nextSubAccountStatus(status)

    return `${SUB_ACCOUNT_STATUS[next].label}${SUB_ACCOUNT_STATUS_PARTICLE[next]} 변경`
}

/**
 * 상태 필터의 고를 수 있는 값 — 사용·사용정지 둘뿐이다.
 * 아무것도 고르지 않은 상태가 곧 전체이고, 그때 칸에 보이는 글자가 아래 SUB_ACCOUNT_STATUS_PLACEHOLDER 다.
 */
export const SUB_ACCOUNT_STATUS_FILTERS = [
    {value: 'active', label: '사용'},
    {value: 'suspended', label: '사용정지'},
] as const

/** 상태를 고르지 않았을 때 칸에 보이는 글자(시안) — 이 상태가 전체 조회다. [초기화] 로 이 자리로 돌아온다. */
export const SUB_ACCOUNT_STATUS_PLACEHOLDER = '전체 상태'

/** 검색 대상 — 맨 앞이 기본값이고, 고른 값이 검색어 칸의 안내 글("계정 ID 입력")이 된다. */
export const SUB_ACCOUNT_SEARCH_TARGETS = [
    {value: 'accountId', label: '계정 ID'},
    {value: 'managerName', label: '담당자'},
    {value: 'organization', label: '소속'},
] as const

/**
 * 정렬 — 시안의 [보고서 출력순 정렬] 한 줄이고, 누를 때마다 오름차순 → 내림차순 → 기본으로 돌아간다.
 * 기본은 받은 순서 그대로다(정렬하지 않음).
 */
export const SUB_ACCOUNT_SORT_LABEL = '보고서 출력순 정렬'

export const SUB_ACCOUNT_SORT_ORDERS = ['none', 'asc', 'desc'] as const

export type SubAccountSortOrder = (typeof SUB_ACCOUNT_SORT_ORDERS)[number]

/** 지금 어느 순서인지 — 버튼 이름에 붙여 눌러 보지 않고도 알 수 있게 한다[6.4.3]. */
export const SUB_ACCOUNT_SORT_ORDER_LABEL = {
    none: '기본 순서',
    asc: '적은 순',
    desc: '많은 순',
} as const satisfies Record<SubAccountSortOrder, string>

/** 다음에 눌렀을 때 갈 순서. */
export const nextSubAccountSortOrder = (order: SubAccountSortOrder): SubAccountSortOrder =>
    SUB_ACCOUNT_SORT_ORDERS[(SUB_ACCOUNT_SORT_ORDERS.indexOf(order) + 1) % SUB_ACCOUNT_SORT_ORDERS.length]

/** [⋮] 메뉴에서 고를 수 있는 일 — 가는 화면은 화면(page)이 정한다. */
export type SubAccountMenuAction = 'edit' | 'password-reset' | 'status-change' | 'delete'

/** 협약 정보 — 이 기관이 맺은 협약 한 건. */
export type SubAccountAgreement = {
    /** 매칭 사업 이름. 비협약 기관은 맺은 사업이 없어 이 값도 없다(사업기간과 함께 줄이 빠진다). */
    projectName?: string
    /** 사업기간(YYYY-MM-DD ~ YYYY-MM-DD). 비협약 기관은 없다. */
    period?: string
    /** 이용서비스 — 케이스별로 노출 내용이 다르다(SUB_ACCOUNT_AGREEMENT_CASES). 받은 목록을 그대로 이어 붙인다. */
    services: readonly SubAccountService[]
}

/** 계정 수 요약 한 칸. */
export type SubAccountSummary = {
    /** 시안 아이콘 — 전체 하위 계정·사용 계정·이용횟수 순으로 다르다. */
    icon: 'total' | 'active' | 'usage'
    label: string
    count: number
}

/** 서비스별 배분 이용건수 한 칸 — 케이스별로 노출 내용이 다르다(시안 주석). 받은 것만 그린다. */
export type SubAccountServiceUsage = {
    /** 서비스 이름(KTRS-FM 평가 · 혁신성장지수 평가 (Tech-Index) 등). */
    service: string
    count: number
}

/** 접속 일시 내역 한 건. */
export type SubAccountAccessLog = {
    id: string
    accessedAt: string
    ip: string
}

/** 활동 내역 한 건. */
export type SubAccountActivityLog = {
    id: string
    actedAt: string
    /** 활동 구분(평가 신청 등). */
    category: string
    /** 활동 내용 — 무엇을 했는지 한 줄. */
    detail: string
    /** 처리 결과(성공·실패). */
    result: string
}

/** [상세정보] 모달이 보여 주는 것 — 카드에 없는 값과 두 갈래 내역이다. */
export type SubAccountDetail = {
    /** 계정 생성일(YYYY-MM-DD). */
    createdAt: string
    memo: string
    serviceUsages: readonly SubAccountServiceUsage[]
    accessLogs: readonly SubAccountAccessLog[]
    activityLogs: readonly SubAccountActivityLog[]
}

/** 상세정보 모달의 내역 갈래 — 맨 앞이 처음 열렸을 때 고른 값이다(시안). */
export const SUB_ACCOUNT_DETAIL_TABS = [
    {value: 'access', label: '접속 일시 내역'},
    {value: 'activity', label: '활동 내역'},
] as const

export type SubAccountDetailTab = (typeof SUB_ACCOUNT_DETAIL_TABS)[number]['value']

/** 하위계정 한 건 = 카드 한 장. */
export type SubAccountItem = {
    id: string
    /** 지점명 등 계정 이름. */
    name: string
    status: SubAccountStatus
    /** 로그인에 쓰는 계정 ID. */
    accountId: string
    managerName: string
    /** 담당자 이메일 — 비밀번호 초기화 확인 모달이 임시 비밀번호를 보낼 곳으로 보여 준다. */
    email: string
    /** 보고서 출력 횟수. 정렬 기준이기도 하다. */
    reportCount: number
    /** [상세정보] 가 여는 모달이 보여 주는 값. */
    detail: SubAccountDetail
}

/** 한 페이지에 보여 줄 카드 수 — 2건이라 목록이 짧아도 페이지 이동을 확인할 수 있다. */
export const SUB_ACCOUNT_PAGE_SIZE = 2
