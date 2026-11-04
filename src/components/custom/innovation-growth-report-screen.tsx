import {
    InnovationGrowthReportLookup,
    type InnovationGrowthReportLookupProps,
} from '@/components/custom/innovation-growth-report-lookup'
import {KbigxReportFrame} from '@/components/custom/k-bigx-report-sections'
import {
    INNOVATION_GROWTH_SCREEN_TITLE,
    findMockInnovationGrowthCompanies,
    findMockInnovationGrowthPatentResults,
    findMockInnovationGrowthPatents,
} from '@/content/service/innovation-growth-report'
import {innovationReportPath} from '@/content/service/k-bigx-innovation-report'
import type {UserType} from '@/constants/header-navigation'
import {CORP_PREVIEW_USER, ORG_PREVIEW_USER} from '@/constants/preview-user'

// 기업혁신성장보고서 조회 화면 — 기업의 조회 화면과 케이스별 결과 화면이 함께 쓴다.
// 기관은 대량정보조회와 탭으로 합쳐져 있어 OrgKbigxReportScreen 이 getInnovationGrowthInitialResult 로 같은 케이스를 받는다.
//
// 케이스(preview)                주소(innovation-growth-report/ 아래)        화면
//   search                     (page.tsx)                                검색 전
//   company                    search-result/company                     기업 검색 결과
//   company-not-found          search-result/company/not-found           기업 검색 결과 없음
//   patent                     search-result/patent                      특허 검색 결과
//   patent-not-found           search-result/patent/not-found            특허 검색 결과 없음
//   company-selected           search-result/company/selected            타사조회 · 특허 있음 · 재무정보 있음
//   company-patent-no-finance  search-result/company/patent-no-finance   타사조회 · 특허 있음 · 재무정보 없음
//   company-no-patent          search-result/company/no-patent           타사조회 · 특허 없음 · 재무정보 있음
//   company-individual         search-result/company/individual          타사조회 · 개인기업(사업자번호 표시 · 특허 미제공) · 재무정보 있음
//   company-blocked            search-result/company/blocked             타사조회 · 특허 없음 · 재무정보 없음(기업 생성불가 · 기관 차감 없음)
//   company-self               search-result/company/self                자사조회(기업명 = 헤더의 로그인 이름)
// 케이스 화면은 실제로 검색해 고른 상태로 시작한다 — 검색 칸에는 고른 기업명, 기업 목록은 그 검색 결과이고,
// 특허 목록이 있으면(company-selected · company-patent-no-finance · patent) 첫 특허까지 고른다.
// 차감 결과는 회원 유형에 따라 다르다 — getInnovationGrowthReportCase 참고.
//
// [프론트엔드 연동] 실제 서비스는 조회 화면(search) 하나면 된다 — 검색하면 같은 자리에서 결과로 바뀐다.
// 결과 화면은 케이스 확인용 주소다. 필요 없으면 search-result 폴더와 preview · 아래 목업을 지운다.

type InnovationGrowthReportPreview =
    | 'search'
    | 'company'
    | 'company-selected'
    | 'company-patent-no-finance'
    | 'company-no-patent'
    | 'company-individual'
    | 'company-blocked'
    | 'company-self'
    | 'company-not-found'
    | 'patent'
    | 'patent-not-found'

// [퍼블리싱 확인용] 목업 — 케이스마다 검색 칸에 넣어 둘 검색어와 고를 기업.
const MOCK_COMPANY_KEYWORD = '테크'
const MOCK_COMPANY_NOT_FOUND_KEYWORD = '없는기업'
const MOCK_PATENT_KEYWORD = '예측'
const MOCK_PATENT_NOT_FOUND_KEYWORD = '없는특허'
const MOCK_COMPANY_WITH_PATENTS_ID = 'c-1'
const MOCK_COMPANY_PATENT_NO_FINANCE_ID = 'c-30'
const MOCK_COMPANY_WITHOUT_PATENTS_ID = 'c-4'
const MOCK_COMPANY_INDIVIDUAL_ID = 'i-1'
const MOCK_COMPANY_BLOCKED_ID = 'c-8'
const MOCK_COMPANY_SELF_ID = 'c-9'
// 자사조회 화면의 기업명 — 헤더에 보이는 로그인 회원 이름과 맞춰 자사임이 바로 보이게 한다.
const MOCK_SELF_COMPANY_NAME = {corp: CORP_PREVIEW_USER.name, org: ORG_PREVIEW_USER.name}

// 목록 첫 줄에 보이는 특허 — 조회 화면의 기본 정렬(최신순)과 같은 기준으로 고른다.
const findFirstListedPatentId = (patents: readonly {id: string; applicationDate: string}[]) =>
    patents.toSorted((a, b) => b.applicationDate.localeCompare(a.applicationDate))[0]?.id

const selectMockCompany = (companyId: string) => {
    const companyName = findMockInnovationGrowthCompanies('').find((item) => item.id === companyId)?.name ?? ''
    const patents = findMockInnovationGrowthPatents(companyId)

    return {
        type: 'company' as const,
        keyword: companyName,
        companies: findMockInnovationGrowthCompanies(companyName),
        selection: {companyId, patents},
        patentId: findFirstListedPatentId(patents),
    }
}

const getInnovationGrowthInitialResult = (
    preview: InnovationGrowthReportPreview,
    userType: UserType,
): InnovationGrowthReportLookupProps['initialResult'] => {
    switch (preview) {
        case 'company':
            return {
                type: 'company',
                keyword: MOCK_COMPANY_KEYWORD,
                companies: findMockInnovationGrowthCompanies(MOCK_COMPANY_KEYWORD),
            }
        case 'company-selected':
            return selectMockCompany(MOCK_COMPANY_WITH_PATENTS_ID)
        case 'company-patent-no-finance':
            return selectMockCompany(MOCK_COMPANY_PATENT_NO_FINANCE_ID)
        case 'company-no-patent':
            return selectMockCompany(MOCK_COMPANY_WITHOUT_PATENTS_ID)
        case 'company-individual':
            return selectMockCompany(MOCK_COMPANY_INDIVIDUAL_ID)
        case 'company-blocked':
            return selectMockCompany(MOCK_COMPANY_BLOCKED_ID)
        case 'company-self': {
            const result = selectMockCompany(MOCK_COMPANY_SELF_ID)
            return {
                ...result,
                keyword: MOCK_SELF_COMPANY_NAME[userType],
                companies: result.companies.map((company) =>
                    company.id === MOCK_COMPANY_SELF_ID
                        ? {...company, name: MOCK_SELF_COMPANY_NAME[userType]}
                        : company,
                ),
            }
        }
        case 'company-not-found':
            return {
                type: 'company',
                keyword: MOCK_COMPANY_NOT_FOUND_KEYWORD,
                companies: findMockInnovationGrowthCompanies(MOCK_COMPANY_NOT_FOUND_KEYWORD),
            }
        case 'patent': {
            const patents = findMockInnovationGrowthPatentResults(MOCK_PATENT_KEYWORD)
            return {
                type: 'patent',
                keyword: MOCK_PATENT_KEYWORD,
                patents,
                patentId: findFirstListedPatentId(patents),
            }
        }
        case 'patent-not-found':
            return {
                type: 'patent',
                keyword: MOCK_PATENT_NOT_FOUND_KEYWORD,
                patents: findMockInnovationGrowthPatentResults(MOCK_PATENT_NOT_FOUND_KEYWORD),
            }
        default:
            return undefined
    }
}

type InnovationGrowthReportScreenProps = {
    userType: UserType
    /** 처음 보여 줄 케이스. 기본은 검색 전(조회 화면)이다. */
    preview?: InnovationGrowthReportPreview
}

const InnovationGrowthReportScreen = ({userType, preview = 'search'}: InnovationGrowthReportScreenProps) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1 overflow-x-clip">
        <KbigxReportFrame
            title={INNOVATION_GROWTH_SCREEN_TITLE}
            homeHref={`/${userType}/home`}
            moreHref={`/${userType}/platform/k-bigx-report`}
        >
            <InnovationGrowthReportLookup
                initialResult={getInnovationGrowthInitialResult(preview, userType)}
                userType={userType}
                reportHref={innovationReportPath(userType)}
            />
        </KbigxReportFrame>
    </main>
)

export {getInnovationGrowthInitialResult, InnovationGrowthReportScreen}
export type {InnovationGrowthReportPreview, InnovationGrowthReportScreenProps}
