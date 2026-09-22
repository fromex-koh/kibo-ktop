import {
    InnovationGrowthReportLookup,
    type InnovationGrowthReportLookupProps,
} from '@/components/custom/innovation-growth-report-lookup'
import {KbigxReportIntro} from '@/components/custom/k-bigx-report-sections'
import {
    findMockInnovationGrowthCompanies,
    findMockInnovationGrowthPatentResults,
    findMockInnovationGrowthPatents,
} from '@/content/service/innovation-growth-report'
import {innovationReportPath} from '@/content/service/k-bigx-innovation-report'

// 기업혁신성장보고서 조회 화면 한 장 — 기업 · 기관의 조회 화면과 케이스별 결과 화면이 모두 이 컴포넌트를 쓴다.
// 화면마다 다른 것은 사용자 유형(홈 · [자세히보기] 주소)과 처음 보여 줄 케이스(preview)뿐이다.
//
// 케이스(preview)와 주소 — innovation-growth-report/ 아래
//   search            (조회 화면 page.tsx)              검색 전 — 검색 칸 아래에 아무것도 없다
//   company           search-result/company            기업 검색 결과 — 기업 목록, 아직 고르지 않음
//   company-selected  search-result/company/selected   기업을 고름(특허 있음) — 특허 목록 · 이용횟수 1회 차감
//   company-no-patent search-result/company/no-patent  기업을 고름(특허 없음) — 특허 빈 상태 · 차감되지 않음
//   company-not-found search-result/company/not-found  기업 검색 결과 없음 — 기업 목록 빈 상태
//   patent            search-result/patent             특허 검색 결과 — 특허 목록(기업명 포함)
//   patent-not-found  search-result/patent/not-found   특허 검색 결과 없음 — 특허 목록 빈 상태
// 어느 화면에서든 다시 검색 · 초기화하면 같은 동작을 한다(결과 화면은 처음 상태만 다르다).
//
// [프론트엔드 연동] 실제 서비스는 조회 화면(search) 하나로 충분하다 — 검색하면 같은 자리에서 결과로 바뀐다.
// 결과 화면들은 케이스를 보여 주려는 퍼블리싱용 주소이므로, 따로 두지 않는다면 search-result 폴더를 지운다.

type InnovationGrowthReportPreview =
    | 'search'
    | 'company'
    | 'company-selected'
    | 'company-no-patent'
    | 'company-not-found'
    | 'patent'
    | 'patent-not-found'

// [퍼블리싱 확인용] 목업 — 케이스마다 검색 칸에 넣어 둘 검색어와 고를 기업.
const MOCK_COMPANY_KEYWORD = ''
const MOCK_COMPANY_NOT_FOUND_KEYWORD = '없는기업'
const MOCK_PATENT_KEYWORD = '예측'
const MOCK_PATENT_NOT_FOUND_KEYWORD = '없는특허'
const MOCK_COMPANY_WITH_PATENTS_ID = 'c-1'
const MOCK_COMPANY_WITHOUT_PATENTS_ID = 'c-4'

const selectMockCompany = (companyId: string) => ({
    type: 'company' as const,
    keyword: MOCK_COMPANY_KEYWORD,
    companies: findMockInnovationGrowthCompanies(MOCK_COMPANY_KEYWORD),
    selection: {companyId, patents: findMockInnovationGrowthPatents(companyId)},
})

const getInitialResult = (
    preview: InnovationGrowthReportPreview,
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
        case 'company-no-patent':
            return selectMockCompany(MOCK_COMPANY_WITHOUT_PATENTS_ID)
        case 'company-not-found':
            return {
                type: 'company',
                keyword: MOCK_COMPANY_NOT_FOUND_KEYWORD,
                companies: findMockInnovationGrowthCompanies(MOCK_COMPANY_NOT_FOUND_KEYWORD),
            }
        case 'patent':
            return {
                type: 'patent',
                keyword: MOCK_PATENT_KEYWORD,
                patents: findMockInnovationGrowthPatentResults(MOCK_PATENT_KEYWORD),
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
    userType: 'corp' | 'org'
    /** 처음 보여 줄 케이스. 기본은 검색 전(조회 화면)이다. */
    preview?: InnovationGrowthReportPreview
}

const InnovationGrowthReportScreen = ({userType, preview = 'search'}: InnovationGrowthReportScreenProps) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <InnovationGrowthReportLookup
            initialResult={getInitialResult(preview)}
            reportHref={innovationReportPath(userType)}
            intro={
                <KbigxReportIntro
                    title="기업혁신성장"
                    homeHref={`/${userType}/home`}
                    moreHref={`/${userType}/platform/k-bigx-report`}
                />
            }
        />
    </main>
)

export {InnovationGrowthReportScreen}
export type {InnovationGrowthReportPreview, InnovationGrowthReportScreenProps}
