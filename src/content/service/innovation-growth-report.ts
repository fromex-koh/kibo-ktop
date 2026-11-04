// K-BIGx 보고서 · 기업혁신성장 조회 화면(기업 · 기관 공통)의 문구 · 목업.
//
// [프론트엔드 연동] 문구(INNOVATION_GROWTH_*)는 그대로 쓰고, 아래 목업 함수만 API 로 바꾼다.
//   · searchInnovationGrowthCompanies(검색어) → 기업 검색 API — '기업 검색'의 검색된 기업 목록
//   · getInnovationGrowthCompanyPage(쪽)      → 기업 목록 쪽 이동
//   · getInnovationGrowthPatentPage(쪽)       → 특허 목록 쪽 이동
//   · getInnovationGrowthPatents(기업 id)     → 특허 목록 API — 기업 카드를 고를 때 부른다
//   · searchInnovationGrowthPatents(검색어)   → 특허 검색 API — '특허 검색'이면 기업 목록 없이 특허 목록이 바로 나온다
// 화면이 받는 모양은 아래 타입이다. 차감 판정에 쓰는 값도 API 가 줘야 한다.
//   · 기업: representativeName · isIndividual(개인기업이면 사업자번호, 법인이면 법인번호를 보인다) · patentCount · hasFinance · isSelf
//   · 특허 검색 결과: companyName · isSelfCompany
// 대표자명 · 사업자번호 · 법인번호는 화면에서 가린다(src/lib/mask.ts). 서버가 가린 값을 주면
// innovation-growth-report-lookup.tsx 의 maskPersonName 과 아래 getInnovationGrowthCompanyNumber 의 mask* 호출을 뺀다.

import type {UserType} from '@/constants/header-navigation'
import {REPORT_CREATE_NO_PATENT_NOTICE} from '@/content/service/k-bigx-report-create'
import {maskBusinessNumber, maskCorporateNumber} from '@/lib/mask'

type InnovationGrowthPatent = {
    id: string
    name: string
    applicationNumber: string
    applicationDate: string
    infoDate: string
    subCategoryName: string
    subCategoryCode: string
}

/** 특허 검색 결과의 특허 — 보고서 생성 모달 · 하단 바에 보일 보유 기업 이름과, 차감 판정에 쓸 자사 여부가 함께 온다. */
type InnovationGrowthPatentResult = InnovationGrowthPatent & {companyName: string; isSelfCompany?: boolean}

type InnovationGrowthCompany = {
    id: string
    name: string
    /** 대표자명 — 기업 카드에 두 번째 글자를 가려 보인다(maskPersonName). */
    representativeName: string
    /** 개인기업 여부 — 개인기업은 법인번호가 없어 카드 · 선택한 기업에 사업자번호를 보인다. */
    isIndividual?: boolean
    /** 법인번호 — 법인기업만 있다. 화면에 보이는 형식 그대로(하이픈 포함). */
    corporateNumber?: string
    /** 사업자번호 — 개인기업은 화면에 보이고, 법인기업은 검색에만 쓴다. 하이픈 포함. */
    businessNumber: string
    /** 보유 특허 수 — 기업 카드의 '특허수'. 0 이면 특허 목록 자리에 빈 상태가 선다. */
    patentCount: number
    /** 재무정보 보유 여부 — 이용횟수 차감 판정에 쓴다. */
    hasFinance: boolean
    /** 로그인한 기업 · 기관 자신인지(자사조회). */
    isSelf?: boolean
}

const INNOVATION_GROWTH_INTRO = {
    eyebrow: 'KIBO-Business Innovation Growth with AI',
    title: '어떤 기술분야가 궁금하세요?',
    descriptions: [
        'K-BIGx AI가 기술·시장·특허 데이터를 분석해 드립니다.',
        'AI 기반 기술혁신정보로 빠르게 변화하는 기술시장 정보와 기업의 차별화된 비금융서비스를 제공합니다.',
    ],
    moreLabel: '자세히보기',
} as const

// 검색 기준 — 셀렉트의 옵션은 '기업 검색' · '특허 검색' 두 가지다.
//   · 기업 검색: 사업자번호(10자리) · 법인번호(13자리) · 기업명
//   · 특허 검색: 출원번호(13자리) · 특허명 — 기업 목록 없이 특허 목록이 바로 나온다
// 숫자와 하이픈만 넣었는데 자릿수가 맞지 않으면 번호를 잘못 넣은 것으로 본다(하이픈은 있어도 없어도 된다).
// 글자가 하나라도 섞이면 이름 검색이라 형식을 따지지 않는다.
const COMPANY_SEARCH_PATTERN = /^(\d{3}-?\d{2}-?\d{5}|\d{6}-?\d{7}|(?![\d\s-]+$).+)$/
const PATENT_SEARCH_PATTERN = /^(\d{2}-?\d{4}-?\d{7}|(?![\d\s-]+$).+)$/

// 특허 검색 칸과 특허 목록 안 검색 칸(기업을 골라 본 목록 · 특허 검색 결과)이 함께 쓴다.
const INNOVATION_GROWTH_PATENT_PLACEHOLDER = '출원번호 또는 특허명으로 검색할 수 있습니다.'

const INNOVATION_GROWTH_SEARCH_TYPES = [
    {
        value: 'company',
        label: '기업 검색',
        pattern: COMPANY_SEARCH_PATTERN,
        placeholder: '사업자번호와 법인번호 또는 기업명으로 검색할 수 있습니다.',
    },
    {
        value: 'patent',
        label: '특허 검색',
        pattern: PATENT_SEARCH_PATTERN,
        placeholder: INNOVATION_GROWTH_PATENT_PLACEHOLDER,
    },
] as const

type InnovationGrowthSearchType = (typeof INNOVATION_GROWTH_SEARCH_TYPES)[number]['value']

const isInnovationGrowthSearchType = (value: string): value is InnovationGrowthSearchType =>
    INNOVATION_GROWTH_SEARCH_TYPES.some((type) => type.value === value)

const INNOVATION_GROWTH_SEARCH_EMPTY_ERROR = '검색어를 입력해주세요.'
// 형식 오류 — SelectSearchForm 이 고른 기준 이름(label)을 넘기므로 label 로 찾는다.
const INNOVATION_GROWTH_SEARCH_INVALID_ERRORS: Record<string, string> = {
    [INNOVATION_GROWTH_SEARCH_TYPES[0].label]: '올바른 사업자번호 또는 법인번호가 아닙니다',
    [INNOVATION_GROWTH_SEARCH_TYPES[1].label]: '올바른 출원번호가 아닙니다',
}
const getInnovationGrowthInvalidError = (label: string) =>
    INNOVATION_GROWTH_SEARCH_INVALID_ERRORS[label] ?? '검색어 형식이 올바르지 않습니다.'

// 검색 카드 아래 한 줄 안내와 [기업정보 제공법적 근거].
const INNOVATION_GROWTH_SEARCH_SCOPE = '25년 8월까지 등록된 특허만 검색 가능합니다.'
const INNOVATION_GROWTH_LEGAL_BASIS_LABEL = '기업정보 제공법적 근거'

const INNOVATION_GROWTH_COMPANY_LIST_TITLE = '검색된 기업 목록'
const INNOVATION_GROWTH_PATENT_LIST_TITLE = '특허 목록'
const INNOVATION_GROWTH_PATENT_RESULT_TITLE = '검색된 특허 목록'
const INNOVATION_GROWTH_COMPANY_HELPER = '특허를 확인할 기업을 선택해 주세요.'
// 기업명 뒤에 이어지는 글 — 기업명은 화면에서 폭을 넘으면 말줄임된다.
const INNOVATION_GROWTH_COMPANY_SELECTED_HELPER_SUFFIX = '의 특허 목록이 아래에 표시됩니다.'
const INNOVATION_GROWTH_PATENT_HELPER = '보고서에 반영할 특허 1건을 선택해 주세요.'

// 하단 바의 고른 항목 이름.
const INNOVATION_GROWTH_SELECTION_LABELS = {company: '기업', patent: '특허'} as const

// 고른 항목이 지금 쪽에 없을 때 그 쪽으로 돌아가는 버튼.
const INNOVATION_GROWTH_SHOW_SELECTED_COMPANY = (page: number) => `선택한 기업 보기(${page}쪽)`
const INNOVATION_GROWTH_SHOW_SELECTED_PATENT = (page: number) => `선택한 특허 보기(${page}쪽)`

// 선택한 기업 요약.
const INNOVATION_GROWTH_SELECTED_COMPANY = {
    title: '선택한 기업',
    showList: '기업 목록 보기',
    selfLookup: '자사조회',
    selfBadge: '자사',
} as const

// 안내 · 빈 상태 — 제목(title)과 그 아래 한 줄(description).
const INNOVATION_GROWTH_RETRY_GUIDE = '입력하신 정보를 다시 확인하여 검색하여주세요.'
const INNOVATION_GROWTH_CHOOSE_COMPANY = {
    title: '먼저 기업을 선택해 주세요.',
    description: '선택한 기업의 특허 목록이 여기에 표시됩니다.',
} as const
const INNOVATION_GROWTH_NOT_FOUND = {
    title: '조회된 기업정보가 없습니다.',
    description: INNOVATION_GROWTH_RETRY_GUIDE,
} as const
const INNOVATION_GROWTH_PATENT_NOT_FOUND = {
    title: '조회된 특허가 없습니다.',
    description: INNOVATION_GROWTH_RETRY_GUIDE,
} as const
const INNOVATION_GROWTH_PATENT_FILTER_EMPTY = {
    title: '검색된 특허가 없습니다.',
    description: '다른 검색어로 검색해 주세요.',
} as const
const INNOVATION_GROWTH_NO_PATENT = '특허 정보가 없습니다.'
const INNOVATION_GROWTH_NO_PATENT_GUIDE = '특허 선택 없이 [보고서 생성]으로 진행할 수 있습니다.'
const INNOVATION_GROWTH_SEARCHING = '검색하고 있습니다.'
const INNOVATION_GROWTH_COMPANY_PAGE_LOADING = '기업 목록을 불러오고 있습니다.'
const INNOVATION_GROWTH_PATENT_LOADING = '특허 정보를 불러오고 있습니다.'
const INNOVATION_GROWTH_PATENT_PAGE_LOADING = '특허 목록을 불러오고 있습니다.'

// 특허 목록 안 검색 · 정렬.
const INNOVATION_GROWTH_PATENT_FILTER_LABEL = '선택한 기업 내 특허 검색'
// 특허 검색 결과 목록 안 검색 — 검색된 특허 안에서 다시 좁힌다.
const INNOVATION_GROWTH_PATENT_RESULT_FILTER_LABEL = '검색된 특허 내 검색'
const INNOVATION_GROWTH_PATENT_FILTER_BUTTON_LABEL = '목록에서 검색'
const INNOVATION_GROWTH_PATENT_SORT_LABEL = '특허 정렬'
const INNOVATION_GROWTH_PATENT_SORTS = [
    {value: 'new', label: '최신순'},
    {value: 'old', label: '과거순'},
] as const
type InnovationGrowthPatentSort = (typeof INNOVATION_GROWTH_PATENT_SORTS)[number]['value']
const isInnovationGrowthPatentSort = (value: string): value is InnovationGrowthPatentSort =>
    INNOVATION_GROWTH_PATENT_SORTS.some((sort) => sort.value === value)
const INNOVATION_GROWTH_DEFAULT_PATENT_SORT: InnovationGrowthPatentSort = 'new'
// 특허출원일자 기준 — 최신순은 늦은 날짜부터, 과거순은 이른 날짜부터.
const compareInnovationGrowthPatents =
    (sort: InnovationGrowthPatentSort) => (a: {applicationDate: string}, b: {applicationDate: string}) =>
        sort === 'new'
            ? b.applicationDate.localeCompare(a.applicationDate)
            : a.applicationDate.localeCompare(b.applicationDate)

// 목록 건수 · 페이지 넘김 문구.
const INNOVATION_GROWTH_COUNT_UNIT = '건'
const INNOVATION_GROWTH_PAGINATION = {
    prev: '이전',
    next: '다음',
    companyLabel: '검색된 기업 목록 페이지',
    patentLabel: '특허 목록 페이지',
} as const
// 특허 목록 아래 건수 줄 — 목록 안 검색 중이면 '검색 결과', 아니면 '전체'.
const INNOVATION_GROWTH_PATENT_RANGE_LABEL = {filtered: '검색 결과', all: '전체'} as const

// 카드의 항목 이름 — 값은 기업 · 특허 데이터에서 온다.
const COMPANY_FIELD_LABELS = {
    name: '기업명',
    representativeName: '대표자명',
    corporateNumber: '법인번호',
    businessNumber: '사업자번호',
    patentCount: '특허수',
    patent: '특허',
} as const
// 기업 번호(화면 표시용) — 법인기업은 법인번호, 개인기업은 사업자번호를 보인다(기업 카드 · 선택한 기업 요약).
// 사업자번호는 끝 4자리(123-45-6****), 법인번호는 끝 7자리(110111-*******)를 가린다. 검색은 가리기 전 값으로 한다.
const getInnovationGrowthCompanyNumber = (company: InnovationGrowthCompany) =>
    company.isIndividual || !company.corporateNumber
        ? {label: COMPANY_FIELD_LABELS.businessNumber, value: maskBusinessNumber(company.businessNumber)}
        : {label: COMPANY_FIELD_LABELS.corporateNumber, value: maskCorporateNumber(company.corporateNumber)}

const PATENT_FIELD_LABELS = {
    name: '특허명',
    companyName: '보유 기업',
    applicationNumber: '출원번호',
    applicationDate: '특허출원일자',
    infoDate: '특허정보일자',
    subCategoryName: '소분류명',
    subCategoryCode: '소분류코드',
} as const

const INNOVATION_GROWTH_PATENT_NOTES = [
    '특허 정보는 제공 기준일에 따라 실제 보유 현황과 차이가 있을 수 있습니다.',
    '개인사업자는 특허 정보가 제공되지 않습니다.',
] as const

// 이용횟수 차감 케이스.
//   charged   기업 회원의 타사조회, 재무정보 또는 특허가 있음 — 1회 차감
//   blocked   기업 회원의 타사조회, 재무정보 · 특허가 모두 없음 — 보고서를 만들 수 없음
//   free-self 기업 회원의 자사조회 — 재무정보 · 특허가 없어도 만들 수 있고 차감 없음
//   free-org  기관 회원 — 모든 케이스(자사조회 · 재무정보 · 특허가 모두 없는 기업 포함) 차감 없이 만들 수 있음
// [프론트엔드 연동] 화면 안내용 판정이다 — 실제 차감 · 생성 가능 여부는 서버에서도 같은 규칙으로 확인한다.
type InnovationGrowthReportCase = 'charged' | 'blocked' | 'free-self' | 'free-org'

const getInnovationGrowthReportCase = ({
    userType,
    isSelf = false,
    hasFinance,
    hasPatent,
}: {
    userType: UserType
    isSelf?: boolean
    hasFinance: boolean
    hasPatent: boolean
}): InnovationGrowthReportCase => {
    if (userType === 'org') return 'free-org'
    if (isSelf) return 'free-self'
    if (!hasFinance && !hasPatent) return 'blocked'
    return 'charged'
}

// 하단 고정 바의 안내.
const INNOVATION_GROWTH_CASE_COPY: Record<InnovationGrowthReportCase, {note: string}> = {
    charged: {note: '보고서를 생성하실 경우 이용횟수 1회가 차감됩니다.'},
    blocked: {note: '재무정보와 특허 정보가 모두 확인되지 않아 보고서를 생성할 수 없습니다.'},
    'free-self': {note: '자사조회는 이용횟수 차감 없이 보고서가 생성됩니다.'},
    'free-org': {note: '기관회원은 이용권 차감 없이 보고서가 생성됩니다.'},
}

// 보고서 생성 모달의 안내 상자 문구.
const INNOVATION_GROWTH_NOTICE = {usageTitle: '이용횟수 안내', chargedUsage: '이용횟수 1회가 차감됩니다.'} as const

// 보고서 생성 모달의 안내 상자 — 특허가 있는 차감은 모달 기본 안내(유료 서비스 안내)를 그대로 쓴다.
// 특허가 없으면 모달의 특허 없음 안내(기술혁신정보 제외)에 차감 여부를 덧붙인다.
const getInnovationGrowthReportNotice = (reportCase: InnovationGrowthReportCase, hasPatent: boolean) => {
    if (reportCase === 'charged' && hasPatent) return undefined
    const usage =
        reportCase === 'charged' ? INNOVATION_GROWTH_NOTICE.chargedUsage : INNOVATION_GROWTH_CASE_COPY[reportCase].note
    if (hasPatent) return {title: INNOVATION_GROWTH_NOTICE.usageTitle, items: [usage]}
    return {title: REPORT_CREATE_NO_PATENT_NOTICE.title, items: [REPORT_CREATE_NO_PATENT_NOTICE.items[0], usage]}
}

// 아직 고르지 않았을 때의 안내.
const INNOVATION_GROWTH_ACTION_IDLE = '기업과 특허를 선택하면 보고서를 생성할 수 있습니다.'
const INNOVATION_GROWTH_ACTION_PATENT_IDLE = '특허를 선택하면 보고서를 생성할 수 있습니다.'
const INNOVATION_GROWTH_GENERATE_LABEL = '보고서 생성'
// 화면 제목 · 브레드크럼 — 기업 조회 화면과 기관 탭 화면이 함께 쓴다.
const INNOVATION_GROWTH_SCREEN_TITLE = '기업혁신성장'

// ── [퍼블리싱 전용] 목업(API 연결 시 삭제) — MOCK_* · 목업 함수 · findMock*(케이스 화면 innovation-growth-report-screen.tsx 가 씀)는
//    search-result 케이스 화면과 함께 지운다 ──
const MOCK_DELAY_MS = 800

const MOCK_EXTRA_PATENT_COUNT = 18
const MOCK_EXTRA_PATENT_NAMES = [
    '배터리 잔존 수명 추정 방법',
    '탄소 배출량 관리 시스템',
    '디지털 트윈 시뮬레이션 장치',
] as const

const MOCK_PATENTS: readonly InnovationGrowthPatent[] = [
    {
        id: 'p-1',
        name: '에너지 최적화 예측 플랫폼',
        applicationNumber: '10-2022-0077777',
        applicationDate: '2022-06-15',
        infoDate: '2024-08-04',
        subCategoryName: '에너지 플랫폼',
        subCategoryCode: 'EG00111',
    },
    {
        id: 'p-2',
        name: '스마트 제조 공정 예측 시스템',
        applicationNumber: '10-2022-0077777',
        applicationDate: '2022-06-15',
        infoDate: '2024-08-04',
        subCategoryName: '에너지 플랫폼',
        subCategoryCode: 'EG00111',
    },
    // 특허 목록이 10건을 넘을 때의 페이지 넘김을 확인하려고 둔 특허들 — 프롬엑스테크(23건)가 세 쪽(10 + 10 + 3)이 된다.
    {
        id: 'p-3',
        name: '태양광 발전량 예측 모델 학습 장치',
        applicationNumber: '10-2023-0012345',
        applicationDate: '2023-02-20',
        infoDate: '2024-09-12',
        subCategoryName: '에너지 플랫폼',
        subCategoryCode: 'EG00111',
    },
    {
        id: 'p-4',
        name: '설비 이상 징후 감지 방법',
        applicationNumber: '10-2023-0045678',
        applicationDate: '2023-05-08',
        infoDate: '2024-10-02',
        subCategoryName: '스마트 제조',
        subCategoryCode: 'MF00210',
    },
    {
        id: 'p-5',
        name: '전력 수요 반응 자동 제어 시스템',
        applicationNumber: '10-2024-0003456',
        applicationDate: '2024-01-15',
        infoDate: '2024-11-20',
        subCategoryName: '에너지 플랫폼',
        subCategoryCode: 'EG00112',
    },
    ...Array.from({length: MOCK_EXTRA_PATENT_COUNT}, (_, index) => ({
        id: `p-${index + 6}`,
        name: `${MOCK_EXTRA_PATENT_NAMES[index % MOCK_EXTRA_PATENT_NAMES.length]} ${index + 1}`,
        applicationNumber: `10-2021-${String(1000 + index * 37).padStart(7, '0')}`,
        applicationDate: `2021-${String(12 - (index % 12)).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`,
        infoDate: '2025-08-31',
        subCategoryName: index % 2 ? '스마트 제조' : '에너지 플랫폼',
        subCategoryCode: index % 2 ? 'MF00210' : 'EG00111',
    })),
]

// 케이스 확인용 기업.
//   프롬엑스테크 — 타사조회 · 특허 있음 → 차감
//   그린카본테크 — 타사조회 · 재무정보만 있음 → 차감(특허 없이 생성)
//   한빛로보틱스 — 타사조회 · 특허만 있음 → 차감
//   에코퓨처테크 — 타사조회 · 재무 · 특허 모두 없음 → 생성불가(기관은 차감 없이 생성)
//   한국미래기술 — 자사조회 · 재무 · 특허 모두 없음 → 차감 없이 생성
//   한결정밀테크 — 개인기업(사업자번호 표시) · 재무정보만 있음(개인사업자는 특허 정보 미제공) → 차감(특허 없이 생성)
// 기관 회원은 모든 케이스가 '차감 없음'(생성 가능)이다.
const MOCK_EXTRA_COMPANY_COUNT = 20

// 목업 대표자명 — 순서대로 돌려 쓴다.
const MOCK_REPRESENTATIVE_NAMES = [
    '김민수',
    '이서연',
    '박지훈',
    '최수아',
    '정우진',
    '강하늘',
    '조은비',
    '윤도현',
] as const
const mockRepresentativeName = (index: number) => MOCK_REPRESENTATIVE_NAMES[index % MOCK_REPRESENTATIVE_NAMES.length]

// 대표자명도 길이 · 띄어쓰기 · 공동대표 표기를 섞어 카드가 줄을 바꾸는지 본다.
const MOCK_EDGE_CASE_COMPANIES: readonly InnovationGrowthCompany[] = [
    {name: '주식회사 프롬엑스테크놀로지', representativeName: '남궁민수', patentCount: 999},
    {name: '주식회사프롬엑스테크놀로지스', representativeName: '김민수 외 2명', patentCount: 999},
    {
        name: '주식회사 글로벌 인공지능 에너지 솔루션 테크놀로지스',
        representativeName: '알렉산더크리스토퍼존슨',
        patentCount: 128,
    },
    {
        name: '주식회사글로벌인공지능에너지솔루션테크놀로지스인터내셔널',
        representativeName: 'Christopher Alexander Johnson',
        patentCount: 999,
    },
    {name: 'GLOBALARTIFICIALINTELLIGENCEENERGYSOLUTIONS테크', representativeName: '제갈공명선우', patentCount: 100},
].map((company, index) => ({
    ...company,
    id: `e-${index + 1}`,
    corporateNumber: `110111-${String(8000000 + index * 127)}`,
    businessNumber: `321-11-${String(20000 + index)}`,
    hasFinance: true,
}))

// [엣지 케이스 확인용] 페이지 수가 많은 검색 결과 — 이 낱말로 기업을 검색하면 그만큼 나온다(129쪽 · 1,281쪽).
const MOCK_BULK_COMPANY_KEYWORDS: Readonly<Record<string, number>> = {페이징100: 1290, 페이징1000: 12810}

const MOCK_INNOVATION_GROWTH_COMPANIES: readonly InnovationGrowthCompany[] = [
    {
        id: 'c-1',
        name: '프롬엑스테크',
        representativeName: '김민수',
        corporateNumber: '110111-1234567',
        businessNumber: '123-45-67890',
        patentCount: 23,
        hasFinance: true,
    },
    // [엣지 케이스 확인용] 회사명 길이 · 띄어쓰기 · 특허 수 3자리 — '테크'로 검색하면 첫 쪽에 나온다.
    ...MOCK_EDGE_CASE_COMPANIES,
    // 개인기업 — 법인번호가 없어 사업자번호를 보인다. 개인사업자는 특허 정보가 제공되지 않아 특허 0건(재무정보 있음 → 차감).
    {
        id: 'i-1',
        name: '한결정밀테크',
        representativeName: '홍성민',
        isIndividual: true,
        businessNumber: '214-07-35861',
        patentCount: 0,
        hasFinance: true,
    },
    {
        id: 'c-2',
        name: '네오에너지솔루션',
        representativeName: '박지훈',
        corporateNumber: '110111-0234561',
        businessNumber: '234-56-78901',
        patentCount: 2,
        hasFinance: true,
    },
    {
        id: 'c-3',
        name: '메디AI랩',
        representativeName: '최수아',
        corporateNumber: '110111-0345672',
        businessNumber: '345-67-89012',
        patentCount: 2,
        hasFinance: true,
    },
    {
        id: 'c-4',
        name: '그린카본테크',
        representativeName: '정우진',
        corporateNumber: '110111-0456783',
        businessNumber: '456-78-90123',
        patentCount: 0,
        hasFinance: true,
    },
    {
        id: 'c-8',
        name: '에코퓨처테크',
        representativeName: '강하늘',
        corporateNumber: '110111-5678901',
        businessNumber: '890-12-34567',
        patentCount: 0,
        hasFinance: false,
    },
    {
        id: 'c-9',
        name: '한국미래기술',
        representativeName: '조은비',
        corporateNumber: '110111-6789012',
        businessNumber: '901-23-45678',
        patentCount: 0,
        hasFinance: false,
        isSelf: true,
    },
    {
        id: 'c-30',
        name: '한빛로보틱스',
        representativeName: '윤도현',
        corporateNumber: '110111-7890123',
        businessNumber: '012-34-56789',
        patentCount: 2,
        hasFinance: false,
    },
    // 페이지 넘김을 확인하려고 둔 기업들 — '테크'로 검색하면 30건 · 세 쪽(10 + 10 + 10)이 된다.
    ...Array.from({length: MOCK_EXTRA_COMPANY_COUNT}, (_, index) => ({
        id: `c-${index + 10}`,
        name: `이노센스테크 ${index + 1}`,
        representativeName: mockRepresentativeName(index),
        corporateNumber: `110111-${String(7000000 + index * 127)}`,
        businessNumber: `123-11-${String(10000 + index)}`,
        patentCount: (index % 2) + 1,
        hasFinance: true,
    })),
    {
        id: 'c-5',
        name: '스마트팩토리랩',
        representativeName: '이서연',
        corporateNumber: '110111-2345678',
        businessNumber: '567-89-01234',
        patentCount: 2,
        hasFinance: true,
    },
    {
        id: 'c-6',
        name: '바이오넥스트',
        representativeName: '박지훈',
        corporateNumber: '110111-3456789',
        businessNumber: '678-90-12345',
        patentCount: 1,
        hasFinance: true,
    },
    {
        id: 'c-7',
        name: '퀀텀소프트테크',
        representativeName: '최수아',
        corporateNumber: '110111-4567890',
        businessNumber: '789-01-23456',
        patentCount: 2,
        hasFinance: true,
    },
]

const toDigits = (value: string) => value.replace(/\D/g, '')
const wait = () => new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS))

// 기업의 목업 특허 — 특허수가 0 인 기업은 빈 목록이다. 조회 화면이 처음 골라 둔 기업의 특허를 미리 넣을 때도 쓴다.
const findMockInnovationGrowthPatents = (companyId: string): readonly InnovationGrowthPatent[] => {
    const company = MOCK_INNOVATION_GROWTH_COMPANIES.find((item) => item.id === companyId)
    if (!company?.patentCount) return []
    if (company.patentCount <= MOCK_PATENTS.length) return MOCK_PATENTS.slice(0, company.patentCount)
    // [엣지 케이스 확인용] 특허가 많은 기업 — 건수만큼 만들고, 첫 특허에는 긴 특허명 · 소분류명을 둔다.
    return Array.from({length: company.patentCount}, (_, index) => ({
        id: `${company.id}-p-${index + 1}`,
        name:
            index === 0
                ? '인공지능 기반 분산형 에너지 자원의 통합 관리 플랫폼을 이용한 실시간 산업 데이터 분석 및 설비 고장 예측과 탄소 배출량 저감을 위한 최적 제어 시스템과 그 방법'
                : `${MOCK_EXTRA_PATENT_NAMES[index % MOCK_EXTRA_PATENT_NAMES.length]} ${index + 1}`,
        applicationNumber: `10-2020-${String(2000 + index * 37).padStart(7, '0')}`,
        applicationDate: `2020-${String(12 - (index % 12)).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
        infoDate: '2025-08-31',
        subCategoryName:
            index === 0 ? '인공지능 기반 에너지 플랫폼 및 스마트 제조 융합 소프트웨어 서비스' : '에너지 플랫폼',
        subCategoryCode: 'EG00111',
    }))
}

// 기업 목록 쪽 이동(목업) — 지금은 받은 목록을 화면에서 나누므로 기다리기만 한다.
// [프론트엔드 연동] 쪽 단위 API 면 page(· 검색어)를 받아 그 쪽 목록과 전체 건수를 돌려주고,
// 화면의 slice · Math.ceil(length / LIST_PAGE_SIZE) 를 그 값으로 바꾼다. 목업은 받은 쪽 번호만 돌려준다.
const getInnovationGrowthCompanyPage = async (page: number) => {
    await wait()
    return page
}

// 특허 목록 쪽 이동(목업) — 기업 목록 쪽 이동과 같다. 쪽 단위 API 면 목록 안 검색어 · 정렬도 함께 넘긴다.
const getInnovationGrowthPatentPage = async (page: number) => {
    await wait()
    return page
}

// 특허 목록(목업) — 고른 기업의 특허.
const getInnovationGrowthPatents = async (companyId: string): Promise<readonly InnovationGrowthPatent[]> => {
    await wait()
    return findMockInnovationGrowthPatents(companyId)
}

// 기업 검색 목업의 동기 판정 — 결과 화면이 처음 보여 줄 목록을 만들 때도 쓴다.
const findMockInnovationGrowthCompanies = (query: string): readonly InnovationGrowthCompany[] => {
    const keyword = query.trim()
    const digits = toDigits(keyword)
    const isNumberSearch = /^[\d\s-]+$/.test(keyword)
    const bulkCount = MOCK_BULK_COMPANY_KEYWORDS[keyword]

    if (bulkCount) {
        return Array.from({length: bulkCount}, (_, index) => ({
            id: `b-${index + 1}`,
            name: `페이징 확인 기업 ${index + 1}`,
            representativeName: mockRepresentativeName(index),
            corporateNumber: `110111-${String(1000000 + index)}`,
            businessNumber: `456-11-${String(10000 + index)}`,
            patentCount: 1,
            hasFinance: true,
        }))
    }

    return MOCK_INNOVATION_GROWTH_COMPANIES.filter((company) =>
        isNumberSearch
            ? toDigits(company.corporateNumber ?? '') === digits || toDigits(company.businessNumber) === digits
            : company.name.includes(keyword),
    )
}
// 기업 검색(목업) — 번호는 숫자만 견주어(하이픈 무시) 같은 기업을, 기업명은 이름에 검색어가 들어간 기업을 모두 찾는다.
const searchInnovationGrowthCompanies = async (query: string): Promise<readonly InnovationGrowthCompany[]> => {
    await wait()
    return findMockInnovationGrowthCompanies(query)
}

// 특허 검색 목업의 판정 — 출원번호는 숫자만 견주고(하이픈 무시), 특허명은 검색어가 들어간 특허를 찾는다.
// 기업들이 같은 목업 특허를 함께 쓰므로 같은 출원번호가 여러 건 나오고, id 는 기업마다 따로 붙인다.
// 결과 화면이 처음 보여 줄 목록을 만들 때도 쓴다.
const findMockInnovationGrowthPatentResults = (query: string): readonly InnovationGrowthPatentResult[] => {
    const keyword = query.trim()
    const isNumberSearch = /^[\d\s-]+$/.test(keyword)

    return MOCK_INNOVATION_GROWTH_COMPANIES.flatMap((company) =>
        findMockInnovationGrowthPatents(company.id)
            .filter((patent) =>
                isNumberSearch
                    ? toDigits(patent.applicationNumber) === toDigits(keyword)
                    : patent.name.includes(keyword),
            )
            .map((patent) => ({
                ...patent,
                id: `${company.id}-${patent.id}`,
                companyName: company.name,
                isSelfCompany: company.isSelf,
            })),
    )
}

const searchInnovationGrowthPatents = async (query: string): Promise<readonly InnovationGrowthPatentResult[]> => {
    await wait()
    return findMockInnovationGrowthPatentResults(query)
}

// ── 목업 끝 ──

export {
    findMockInnovationGrowthCompanies,
    findMockInnovationGrowthPatentResults,
    findMockInnovationGrowthPatents,
    COMPANY_FIELD_LABELS,
    compareInnovationGrowthPatents,
    getInnovationGrowthCompanyNumber,
    getInnovationGrowthCompanyPage,
    getInnovationGrowthInvalidError,
    getInnovationGrowthPatentPage,
    getInnovationGrowthPatents,
    getInnovationGrowthReportCase,
    getInnovationGrowthReportNotice,
    INNOVATION_GROWTH_ACTION_IDLE,
    INNOVATION_GROWTH_COUNT_UNIT,
    INNOVATION_GROWTH_DEFAULT_PATENT_SORT,
    INNOVATION_GROWTH_PAGINATION,
    INNOVATION_GROWTH_PATENT_RANGE_LABEL,
    INNOVATION_GROWTH_SCREEN_TITLE,
    INNOVATION_GROWTH_ACTION_PATENT_IDLE,
    INNOVATION_GROWTH_CASE_COPY,
    INNOVATION_GROWTH_CHOOSE_COMPANY,
    INNOVATION_GROWTH_COMPANY_HELPER,
    INNOVATION_GROWTH_COMPANY_LIST_TITLE,
    INNOVATION_GROWTH_COMPANY_PAGE_LOADING,
    INNOVATION_GROWTH_COMPANY_SELECTED_HELPER_SUFFIX,
    INNOVATION_GROWTH_GENERATE_LABEL,
    INNOVATION_GROWTH_INTRO,
    INNOVATION_GROWTH_LEGAL_BASIS_LABEL,
    INNOVATION_GROWTH_NO_PATENT,
    INNOVATION_GROWTH_NO_PATENT_GUIDE,
    INNOVATION_GROWTH_NOT_FOUND,
    INNOVATION_GROWTH_PATENT_FILTER_EMPTY,
    INNOVATION_GROWTH_PATENT_FILTER_BUTTON_LABEL,
    INNOVATION_GROWTH_PATENT_FILTER_LABEL,
    INNOVATION_GROWTH_PATENT_HELPER,
    INNOVATION_GROWTH_PATENT_LIST_TITLE,
    INNOVATION_GROWTH_PATENT_LOADING,
    INNOVATION_GROWTH_PATENT_NOT_FOUND,
    INNOVATION_GROWTH_PATENT_PAGE_LOADING,
    INNOVATION_GROWTH_PATENT_NOTES,
    INNOVATION_GROWTH_PATENT_PLACEHOLDER,
    INNOVATION_GROWTH_PATENT_RESULT_FILTER_LABEL,
    INNOVATION_GROWTH_PATENT_RESULT_TITLE,
    INNOVATION_GROWTH_PATENT_SORT_LABEL,
    INNOVATION_GROWTH_PATENT_SORTS,
    INNOVATION_GROWTH_SEARCH_EMPTY_ERROR,
    INNOVATION_GROWTH_SEARCH_SCOPE,
    INNOVATION_GROWTH_SEARCH_TYPES,
    INNOVATION_GROWTH_SEARCHING,
    INNOVATION_GROWTH_SELECTED_COMPANY,
    INNOVATION_GROWTH_SELECTION_LABELS,
    INNOVATION_GROWTH_SHOW_SELECTED_COMPANY,
    INNOVATION_GROWTH_SHOW_SELECTED_PATENT,
    isInnovationGrowthPatentSort,
    isInnovationGrowthSearchType,
    PATENT_FIELD_LABELS,
    searchInnovationGrowthCompanies,
    searchInnovationGrowthPatents,
}
export type {
    InnovationGrowthCompany,
    InnovationGrowthPatent,
    InnovationGrowthPatentResult,
    InnovationGrowthPatentSort,
    InnovationGrowthReportCase,
    InnovationGrowthSearchType,
}
