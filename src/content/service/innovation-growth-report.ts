// K-BIGx 보고서 · 기업혁신성장 조회 화면(corp-k-bigx-report-innovation-growth-report)의 문구 · 목업.
//
// [프론트엔드 연동] 문구(INNOVATION_GROWTH_*)는 그대로 쓰고, 아래 목업 함수만 API 로 바꾼다.
//   · searchInnovationGrowthCompanies(검색어) → 기업 검색 API — '기업 검색'의 검색된 기업 목록
//   · getInnovationGrowthPatents(기업 id)     → 특허 목록 API — 기업 카드를 고를 때 부른다
//   · searchInnovationGrowthPatents(검색어)   → 특허 검색 API — '특허 검색'이면 기업 목록 없이 특허 목록이 바로 나온다
// 화면이 받는 모양은 아래 타입(InnovationGrowthCompany · InnovationGrowthPatent)이다.

type InnovationGrowthPatent = {
    id: string
    name: string
    applicationNumber: string
    applicationDate: string
    infoDate: string
    subCategoryName: string
    subCategoryCode: string
}

/** 특허 검색 결과의 특허 — 보고서 생성 모달에 넘길 소유 기업 이름이 함께 온다. */
type InnovationGrowthPatentResult = InnovationGrowthPatent & {companyName: string}

type InnovationGrowthCompany = {
    id: string
    name: string
    /** 법인번호 — 화면에 보이는 형식 그대로(하이픈 포함). */
    corporateNumber: string
    /** 사업자번호 — 검색에만 쓰고 화면에는 보이지 않는다. */
    businessNumber: string
    /** 보유 특허 수 — 기업 카드의 '특허수'. 0 이면 특허 목록 자리에 빈 상태가 선다. */
    patentCount: number
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
        placeholder: '출원번호 또는 특허명으로 검색할 수 있습니다.',
    },
] as const

type InnovationGrowthSearchType = (typeof INNOVATION_GROWTH_SEARCH_TYPES)[number]['value']

const isInnovationGrowthSearchType = (value: string): value is InnovationGrowthSearchType =>
    INNOVATION_GROWTH_SEARCH_TYPES.some((type) => type.value === value)

const INNOVATION_GROWTH_SEARCH_EMPTY_ERROR = '검색어를 입력해주세요.'
// 형식 오류 — 고른 기준 이름(label)을 받아 기준별 문구를 돌려준다(기업 검색은 시안 문구).
const INNOVATION_GROWTH_SEARCH_INVALID_ERRORS: Record<string, string> = {
    '기업 검색': '올바른 사업자 번호가 아닙니다',
    '특허 검색': '올바른 출원번호가 아닙니다',
}
const getInnovationGrowthInvalidError = (label: string) =>
    INNOVATION_GROWTH_SEARCH_INVALID_ERRORS[label] ?? '검색어 형식이 올바르지 않습니다.'

// 검색 카드 아래 한 줄 안내와 [기업정보 제공법적 근거].
const INNOVATION_GROWTH_SEARCH_SCOPE = '25년 8월까지 등록된 특허만 검색 가능합니다.'
const INNOVATION_GROWTH_LEGAL_BASIS_LABEL = '기업정보 제공법적 근거'

const INNOVATION_GROWTH_COMPANY_LIST_TITLE = '검색된 기업 목록'
const INNOVATION_GROWTH_PATENT_LIST_TITLE = '특허 목록'
const INNOVATION_GROWTH_NOT_FOUND = '검색된 기업이 없습니다.'
const INNOVATION_GROWTH_PATENT_NOT_FOUND = '검색된 특허가 없습니다.'
const INNOVATION_GROWTH_NO_PATENT = '특허 정보가 없습니다.'
const INNOVATION_GROWTH_SEARCHING = '기업을 검색하고 있습니다.'
const INNOVATION_GROWTH_PATENT_LOADING = '특허 정보를 불러오고 있습니다.'

// 카드의 항목 이름 — 값은 기업 · 특허 데이터에서 온다.
const COMPANY_FIELD_LABELS = {name: '기업명', corporateNumber: '법인번호', patentCount: '특허수'} as const
const PATENT_FIELD_LABELS = {
    name: '특허명',
    applicationNumber: '출원번호',
    applicationDate: '특허출원일자',
    infoDate: '특허정보일자',
    subCategoryName: '소분류명',
    subCategoryCode: '소분류코드',
} as const

const INNOVATION_GROWTH_PATENT_NOTES = [
    '특허 정보는 2024년 12월 기준이며, 이후 출원 등록된 특허는 반영되지 않을 수 있습니다.',
    '개인 사업자는 특허 정보가 제공되지 않습니다.',
] as const

// 이용횟수 안내 — 보고서 출력 전에 무엇이 생성되고 몇 회 차감되는지 알린다.
const INNOVATION_GROWTH_USAGE = {
    title: '보고서를 생성하실 경우 이용횟수가 차감됩니다.',
    description: '기술혁신정보를 포함한 전체 보고서가 생성됩니다.',
    rows: [
        {label: '기술혁신정보', value: '포함', isHighlighted: true},
        {label: '이용횟수', value: '1회차감', isHighlighted: false},
    ],
} as const

// 특허가 없는 기업을 고르면 — 기술혁신정보를 뺀 보고서라 이용횟수가 차감되지 않는다(보고서 생성 모달의 특허수 없음과 같은 규칙).
const INNOVATION_GROWTH_USAGE_NO_PATENT = {
    title: '보고서를 생성하실 경우 이용횟수가 차감되지 않습니다.',
    description: '보유 특허 정보가 확인되지 않아, 기술혁신정보를 제외한 보고서가 생성됩니다.',
    rows: [
        {label: '기술혁신정보', value: '제외', isHighlighted: false},
        {label: '이용횟수', value: '차감되지 않음', isHighlighted: true},
    ],
} as const

const INNOVATION_GROWTH_PRINT_LABEL = 'K-BIGx 보고서 출력'

// ── 목업(API 연결 시 삭제) ──
const MOCK_DELAY_MS = 800

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
]

// '그린카본테크'는 특허가 없는 기업이다 — 고르면 특허 목록 자리에 빈 상태가 선다.
const MOCK_INNOVATION_GROWTH_COMPANIES: readonly InnovationGrowthCompany[] = [
    {
        id: 'c-1',
        name: '프롬엑스테크',
        corporateNumber: '110111-1234567',
        businessNumber: '123-45-67890',
        patentCount: 2,
    },
    {
        id: 'c-2',
        name: '네오에너지솔루션',
        corporateNumber: '10-2024-0001234',
        businessNumber: '234-56-78901',
        patentCount: 2,
    },
    {id: 'c-3', name: '메디AI랩', corporateNumber: '10-2024-0001234', businessNumber: '345-67-89012', patentCount: 2},
    {
        id: 'c-4',
        name: '그린카본테크',
        corporateNumber: '10-2024-0001234',
        businessNumber: '456-78-90123',
        patentCount: 0,
    },
]

const toDigits = (value: string) => value.replace(/\D/g, '')
const wait = () => new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS))

// 기업의 목업 특허 — 특허수가 0 인 기업은 빈 목록이다. 조회 화면이 처음 골라 둔 기업의 특허를 미리 넣을 때도 쓴다.
const findMockInnovationGrowthPatents = (companyId: string): readonly InnovationGrowthPatent[] => {
    const company = MOCK_INNOVATION_GROWTH_COMPANIES.find((item) => item.id === companyId)
    return company?.patentCount ? MOCK_PATENTS.slice(0, company.patentCount) : []
}

// 특허 목록(목업) — 고른 기업의 특허.
const getInnovationGrowthPatents = async (companyId: string): Promise<readonly InnovationGrowthPatent[]> => {
    await wait()
    return findMockInnovationGrowthPatents(companyId)
}

// 기업 검색(목업) — 번호는 숫자만 견주어(하이픈 무시) 같은 기업을, 기업명은 이름에 검색어가 들어간 기업을 모두 찾는다.
const searchInnovationGrowthCompanies = async (query: string): Promise<readonly InnovationGrowthCompany[]> => {
    await wait()
    return findMockInnovationGrowthCompanies(query)
}

// 특허 검색(목업) — 출원번호는 숫자만 견주고(하이픈 무시), 특허명은 검색어가 들어간 특허를 찾는다.
// 목업은 특허가 있는 기업이 모두 같은 특허를 가지므로 기업마다 특허 id 를 따로 붙인다.
// 특허 검색 목업의 동기 판정 — 결과 화면이 처음 보여 줄 목록을 만들 때도 쓴다.
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
            .map((patent) => ({...patent, id: `${company.id}-${patent.id}`, companyName: company.name})),
    )
}

const searchInnovationGrowthPatents = async (query: string): Promise<readonly InnovationGrowthPatentResult[]> => {
    await wait()
    return findMockInnovationGrowthPatentResults(query)
}

// 기업 검색 목업의 동기 판정 — 결과 화면이 처음 보여 줄 목록을 만들 때도 쓴다.
const findMockInnovationGrowthCompanies = (query: string): readonly InnovationGrowthCompany[] => {
    const keyword = query.trim()
    const digits = toDigits(keyword)
    const isNumberSearch = /^[\d\s-]+$/.test(keyword)

    return MOCK_INNOVATION_GROWTH_COMPANIES.filter((company) =>
        isNumberSearch
            ? toDigits(company.corporateNumber) === digits || toDigits(company.businessNumber) === digits
            : company.name.includes(keyword),
    )
}
// ── 목업 끝 ──

export {
    findMockInnovationGrowthCompanies,
    findMockInnovationGrowthPatentResults,
    findMockInnovationGrowthPatents,
    COMPANY_FIELD_LABELS,
    getInnovationGrowthInvalidError,
    getInnovationGrowthPatents,
    INNOVATION_GROWTH_COMPANY_LIST_TITLE,
    INNOVATION_GROWTH_INTRO,
    INNOVATION_GROWTH_LEGAL_BASIS_LABEL,
    INNOVATION_GROWTH_NO_PATENT,
    INNOVATION_GROWTH_NOT_FOUND,
    INNOVATION_GROWTH_PATENT_LIST_TITLE,
    INNOVATION_GROWTH_PATENT_LOADING,
    INNOVATION_GROWTH_PATENT_NOT_FOUND,
    INNOVATION_GROWTH_PATENT_NOTES,
    INNOVATION_GROWTH_PRINT_LABEL,
    INNOVATION_GROWTH_SEARCH_EMPTY_ERROR,
    INNOVATION_GROWTH_SEARCH_SCOPE,
    INNOVATION_GROWTH_SEARCH_TYPES,
    INNOVATION_GROWTH_SEARCHING,
    INNOVATION_GROWTH_USAGE,
    INNOVATION_GROWTH_USAGE_NO_PATENT,
    isInnovationGrowthSearchType,
    MOCK_INNOVATION_GROWTH_COMPANIES,
    PATENT_FIELD_LABELS,
    searchInnovationGrowthCompanies,
    searchInnovationGrowthPatents,
}
export type {InnovationGrowthCompany, InnovationGrowthPatent, InnovationGrowthPatentResult, InnovationGrowthSearchType}
