// 마이페이지 — K-BIGx 보고서 이력(기업·기관).
//
// 카드 한 장이 보고서 한 건이고, 케이스는 조회 대상(자가조회·타사조회)과 이용권 차감(여·부) 두 축으로
// 갈린다(시안 케이스 시트). 기관 화면은 보고서 유형(기업혁신성장·대량정보조회)이 한 축 더 붙고, 상세에
// 조회 기관이 더해진다(시안 "기관 - K-BIGx 보고서 이력" 조회결과 case).

/**
 * 조회 대상 — 상세 줄의 [조회유형] 값이다. 우리 회사를 봤는지 다른 회사를 봤는지가 갈린다.
 * 시안은 값마다 색이 다르다(자가조회 파랑 · 타사조회 보라).
 */
export const K_BIGX_REPORT_INQUIRY_TYPE = {
    own: {label: '자가조회', className: 'text-blue-600'},
    other: {label: '타사조회', className: 'text-purple-600'},
} as const satisfies Record<string, {label: string; className: string}>

export type KBigxReportInquiryType = keyof typeof K_BIGX_REPORT_INQUIRY_TYPE

/** 조회 필터의 [조회유형] 셀렉트 — 고르지 않은 상태가 전체 조회이고, 그때 칸에 보이는 글자가 아래 값이다. */
export const K_BIGX_REPORT_INQUIRY_TYPE_FILTERS = [
    {value: 'own', label: K_BIGX_REPORT_INQUIRY_TYPE.own.label},
    {value: 'other', label: K_BIGX_REPORT_INQUIRY_TYPE.other.label},
] as const

export const K_BIGX_REPORT_INQUIRY_TYPE_PLACEHOLDER = '조회유형'

/** 기관 조회 필터의 셀렉트가 아무것도 고르지 않았을 때 보이는 글자(시안) — 이 상태가 전체 조회다. */
export const K_BIGX_REPORT_FILTER_ALL_PLACEHOLDER = '전체'

/**
 * 기관 조회 필터의 [검색어] 대상 — 맨 앞이 기본값이고, 고른 값이 검색어 칸의 안내 글("기업명 입력")이 된다.
 * 기업명·조회 기관 둘로 찾는다.
 */
export const K_BIGX_REPORT_SEARCH_TARGETS = [
    {value: 'companyName', label: '기업명'},
    {value: 'inquiryOrganization', label: '조회 기관'},
] as const

/** 카드 버튼이 하는 일 — 기업 카드·기업혁신성장은 보고서를 파일로 받는다(보고서 다운로드). 가는 주소는 content 가 정한다. */
export const K_BIGX_REPORT_ACTION = {
    download: '보고서 다운로드',
} as const

export type KBigxReportAction = keyof typeof K_BIGX_REPORT_ACTION

/** 대량정보조회 결과 파일 — 시안은 엑셀 결과와 HTML 압축파일을 같은 비중의 버튼으로 제공한다. */
export const K_BIGX_BULK_REPORT_ACTION = {
    excel: '엑셀 결과',
    htmlArchive: 'HTML 압축파일',
} as const

export type KBigxBulkReportAction = keyof typeof K_BIGX_BULK_REPORT_ACTION

/**
 * 보고서 유형 — 기관 카드의 기업명 위 배지다(시안). 유형에 따라 버튼이 갈린다.
 * 기업혁신성장은 [보고서 다운로드] 하나이고, 대량정보조회는 한 번에 여러 기업을 본 결과라
 * 결과 파일 두 가지(K_BIGX_BULK_REPORT_ACTION)를 받는다.
 * 배지 색은 공용 Badge 의 outline 색을 그대로 쓴다(기업혁신성장 info · 대량정보조회 보라).
 */
export const K_BIGX_REPORT_TYPE = {
    'innovation-growth': {label: '기업혁신성장', color: 'info'},
    'bulk-info': {label: '대량정보조회', color: 'secondary-purple'},
} as const satisfies Record<string, {label: string; color: 'info' | 'secondary-purple'}>

export type KBigxReportType = keyof typeof K_BIGX_REPORT_TYPE

/** 기관 조회 필터의 [보고서 유형] 셀렉트 — 고르지 않은 상태가 전체 조회다. 이름은 카드 배지와 같은 값을 쓴다. */
export const K_BIGX_REPORT_TYPE_FILTERS = [
    {value: 'innovation-growth', label: K_BIGX_REPORT_TYPE['innovation-growth'].label},
    {value: 'bulk-info', label: K_BIGX_REPORT_TYPE['bulk-info'].label},
] as const

/** 카드 한 장이 담는 값 — 시안의 항목 그대로다. */
export type KBigxReportHistoryItem = {
    id: string
    companyName: string
    /** 이용권이 깎였는지. 카드 오른쪽 상자에 여/부 한 글자로 선다(시안). */
    isTicketDeducted: boolean
    inquiryType: KBigxReportInquiryType
    /** 조회일시(YYYY-MM-DD). */
    inquiredAt: string
    patentName: string
    /** 보고서 유형 — 기관 화면에만 있다. 없으면(기업) 배지를 그리지 않고 버튼은 [보고서 다운로드] 다. */
    reportType?: KBigxReportType
    /** 조회 기관(누가 조회했는지) — 기관 화면에만 있다. 없으면 상세의 그 칸을 그리지 않는다. */
    inquiryOrganization?: string
}

/** 한 페이지에 보여 줄 카드 수 — 2건이라 목록이 짧아도 페이지 이동을 확인할 수 있다(다른 목록 화면과 같다). */
export const K_BIGX_REPORT_HISTORY_PAGE_SIZE = 2

/** 이용권 상자의 아래 글자와, 그 위에 서는 한 글자(시안: 차감했으면 여 · 아니면 부). */
export const TICKET_DEDUCTION_LABEL = '이용권차감'
export const TICKET_DEDUCTION_MARK = {deducted: '여', notDeducted: '부'} as const
