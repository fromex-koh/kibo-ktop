import type {RatingMatrixRow} from '@/components/custom/rating-matrix'
import type {PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import type {ScoreGaugeTone} from '@/components/custom/score-gauge'
import type {RatingGaugeDetail} from '@/components/custom/semicircle-rating-gauge'
import type {WordCloudItem} from '@/components/custom/word-cloud'
import type {Viewport} from 'next'

// K-BIGx 기업혁신성장 보고서 — 보고서 한 건의 데이터 모양(타입) · 문구 · 목업 · 조회 함수를 모은 파일.
// 화면: corp/org-k-bigx-report-innovation-growth-report-diagnostic-briefing(한 페이지 · 탭은 ?tab=).
//
// 보고서는 새 창으로 열리는 문서 한 장이고, 탭(진단브리핑 · 기업현황 · 기술혁신정보 · Tech-Index · 신용/재무정보 · 활동성정보)은
// 모두 이 한 건의 데이터(InnovationGrowthReport)를 나눠 그린다. 목업(MOCK_INNOVATION_GROWTH_REPORT)도 보고서 한 건이며,
// 지금은 어느 reportId 로 열어도 이 한 건을 돌려준다.
//
// ┌─ [프론트엔드 연동] 체크리스트 — 화면(components/custom/innovation-growth-report-*.tsx)은 고치지 않는다 ──────────────
// │ 1. getInnovationGrowthReport(reportId) 의 목업 반환을 보고서 조회 API 호출로 바꾼다(파일 아래 '목업' 구역).
// │    응답은 InnovationGrowthReport 타입 모양으로 맞춘다 — 없으면 null 을 돌려주면 화면이 404 로 처리한다.
// │ 2. 응답에 viewerCase(열람 케이스)를 넣는다 — self · partner-corp · partner-person. 로그인 사용자와 조회 대상 기업의
// │    관계로 백엔드가 정한다. 케이스별 가림 범위는 INNOVATION_CREDIT_VISIBILITY 에 정의돼 있다.
// │ 3. 케이스에서 제공하지 않는 값은 응답에서 뺀다(빈 배열 · 빈 칸) — 화면은 그 자리를 자리 표시 값으로 가린다.
// │    실제 값을 내려 주면 가려도 페이지 데이터에 남아 개발자 도구로 읽힌다. 뺄 범위는 redactForViewerCase 가 참고 구현이다.
// │ 4. [퍼블리싱 확인용] 코드를 지운다.
// │    - withPreviewCase · redactForViewerCase 함수(이 파일)와 그 호출(components/custom/innovation-growth-report-page.tsx).
// │    - 목업 구역 전체(MOCK_DELAY_MS · TECHNOLOGY_COLORS · MOCK_INNOVATION_GROWTH_REPORT).
// │ 5. 문구(INNOVATION_REPORT_*) · 점수 구간(TECH_INDEX_GRADES) · 케이스 정의는 그대로 쓴다.
// │ 참고: 점수에 따른 상태 · 색 · 칸 수, 비율, 합계 같은 파생 값은 화면이 계산한다 — 원래 값만 내려 준다.
// │       기술혁신정보 표의 최대 10건 · '기타' 묶음 규칙은 innovation-growth-report-tech.tsx 의 [프론트엔드 연동 · 최대 10건] 주석 참고.
// └────────────────────────────────────────────────────────────────────────────────────────────────────────────────

// 새 창 크기 — 내용 폭 1200(콘텐츠 상한)에 양 여백을 더한 창으로 연다.
// 화면보다 넓으면 NewWindowLink 가 화면 크기까지 줄인다.
const INNOVATION_REPORT_WINDOW_WIDTH = 1440
const INNOVATION_REPORT_WINDOW_HEIGHT = 900
const INNOVATION_REPORT_WINDOW_NAME = 'k-bigx-innovation-report'
// 보고서 id 를 싣는 쿼리 이름 — 보고서 문서는 …/diagnostic-briefing?reportId=<id> 로 연다.
const INNOVATION_REPORT_ID_QUERY = 'reportId'

// R&D 이슈 워드클라우드 순서 팔레트(범례 1st~5th) — 단어를 중요도순으로 이 다섯 색에 돌아가며 칠한다.
// 보고서는 라이트 고정이라 palette 변수를 그대로 쓴다.
const INNOVATION_ISSUE_COLORS = [
    'var(--raw-blue-500)',
    'var(--raw-mint-700)',
    'var(--raw-orange-500)',
    'var(--raw-purple-500)',
    'var(--raw-blue-800)',
] as const

const INNOVATION_REPORT_BADGE = 'K-BIGx - 기업혁신성장 보고서'
const INNOVATION_REPORT_PRINT_LABEL = '보고서 출력'
// 모바일(768 미만)에서 [보고서 출력] 대신 보이는 버튼 — 누르면 PC 화면(모든 탭)을 새 창으로 연다.
const INNOVATION_REPORT_MORE_LABEL = '더보기'

// 쿼리
//   ?from=use — [이용권 사용]을 거쳐 열렸다는 표시. 그때만 차감 알림을 띄운다.
//   ?view=pc  — PC 화면으로 보기. 모바일 [더보기]가 여는 새 창이다. 휴대폰 브라우저는 새 창 크기(window.open)를 무시하고
//               기기 폭 그대로 여므로, 창 크기가 아니라 뷰포트 폭(<meta name="viewport" content="width=1280">)을 PC 폭으로
//               선언한다 — 브라우저가 1280 폭으로 그린 뒤 화면에 맞게 축소해 보여 주고, 사용자는 두 손가락으로 확대 · 축소한다.
const INNOVATION_REPORT_CREATED_QUERY = 'from'
const INNOVATION_REPORT_CREATED_QUERY_VALUE = 'use'
const INNOVATION_REPORT_VIEW_QUERY = 'view'
const INNOVATION_REPORT_PC_VIEW = 'pc'
// PC 화면 폭 — xl(1280) 레이아웃이 그대로 적용되는 폭(콘텐츠 1200 + 양 여백 40).
const INNOVATION_REPORT_PC_VIEWPORT_WIDTH = 1280

type SearchParams = Record<string, string | string[] | undefined>

// 보고서 화면의 뷰포트 — ?view=pc 면 PC 폭으로 고정한다. 그 밖에는 기본(기기 폭)을 따른다.
// page.tsx 의 generateViewport 에서 부른다(corp · org 공통).
const getInnovationReportViewport = async (searchParams: Promise<SearchParams>): Promise<Viewport> => {
    const params = await searchParams
    return params[INNOVATION_REPORT_VIEW_QUERY] === INNOVATION_REPORT_PC_VIEW
        ? // 처음 배율(initial-scale)은 비워 둔다 — 기본값 1 이 남으면 1280 폭의 왼쪽 일부만 확대된 채 열린다. 비우면 브라우저가
          // 화면 폭에 맞게 전체를 축소해 보여 주고, 사용자는 두 손가락으로 확대 · 축소한다.
          {width: INNOVATION_REPORT_PC_VIEWPORT_WIDTH, initialScale: undefined}
        : {}
}
// [이용권 사용] 뒤 새 창이 열리며 보이는 알림.
const INNOVATION_REPORT_CREATED_TOAST = '이용권이 차감되어 보고서를 생성하였습니다.'

// 보고서 구성 항목(탭). 첫 항목(진단브리핑)이 기본이고, 주소의 ?tab=<id> 로 다른 탭을 연다.
const INNOVATION_REPORT_SECTIONS = [
    {id: 'briefing', label: '진단브리핑'},
    {id: 'company', label: '기업현황'},
    {id: 'innovation', label: '기술혁신정보'},
    {id: 'tech-index', label: 'Tech-Index'},
    {id: 'credit-finance', label: '신용/재무정보'},
    {id: 'activity', label: '활동성정보'},
] as const

type InnovationReportSectionId = (typeof INNOVATION_REPORT_SECTIONS)[number]['id']

// 보고서 페이지 주소 — 탭은 한 페이지 안에서 ?tab= 으로 바뀐다(대표 주소 = 진단브리핑).
type InnovationReportUserType = 'corp' | 'org'
const innovationReportPath = (userType: InnovationReportUserType) =>
    `/${userType}/k-bigx-report/innovation-growth-report/diagnostic-briefing`

// 탭 쿼리 이름 — 보고서 주소의 ?tab=<id> 로 연다(없으면 진단브리핑).
const INNOVATION_REPORT_TAB_QUERY = 'tab'
// 보고서 열람 케이스 — 신용/재무정보 탭에서 케이스마다 제공되지 않는 항목을 비공개(PrivateContent)로 가린다.
// 근거: 260921 신용재무정보 기관별 노출 여부_FN.xlsx.
// [프론트엔드 연동] 케이스는 보고서 데이터(report.viewerCase)로 내려 준다 — 로그인 사용자 · 조회 대상 관계로 백엔드가 정한다.
// 화면은 이 값만 읽으므로 고칠 필요가 없다. 미노출 항목의 실제 값은 API 가 내려 주지 않는다(화면은 자리 표시 값으로 가린다).
// [퍼블리싱 확인용] 주소의 ?case=<id> 가 있으면 viewerCase 를 덮어써 케이스를 바꿔 본다(withPreviewCase) — 연동 후 지운다.
//   self           ① 자기기업 / 금융기관 — 전 항목 노출
//   partner-corp   ② 타기업 · 협약기관(법인) — 단기연체 · 상거래연체 · 공공체납의 연체금액 열, 차입금 현황 카드 3개 미노출
//   partner-person ③ 타기업 · 협약기관(개인) — 법인등기 · 당좌거래정지 · 단기연체 · 상거래연체 · 공공체납 표 전체, 차입금 현황 카드 3개 미노출
const INNOVATION_REPORT_CASE_QUERY = 'case'
const INNOVATION_REPORT_CASES = ['self', 'partner-corp', 'partner-person'] as const
type InnovationReportCase = (typeof INNOVATION_REPORT_CASES)[number]
const isInnovationReportCase = (value: unknown): value is InnovationReportCase =>
    INNOVATION_REPORT_CASES.some((item) => item === value)

// 케이스별 신용/재무정보 미노출 범위.
type InnovationCreditVisibility = {
    /** 표 전체를 가릴 기업신용정보 표 id. */
    hiddenInfoTables: readonly string[]
    /** 연체금액 열만 가릴 기업신용정보 표 id. */
    hiddenAmountTables: readonly string[]
    /** 차입금 현황(기관별 비중 · 신용/담보 비중 · 담보 현황) 카드를 가린다. */
    isBorrowingStatusHidden: boolean
}
const OVERDUE_INFO_TABLES = ['short-overdue', 'trade-overdue', 'public-arrears'] as const
const INNOVATION_CREDIT_VISIBILITY: Record<InnovationReportCase, InnovationCreditVisibility> = {
    self: {hiddenInfoTables: [], hiddenAmountTables: [], isBorrowingStatusHidden: false},
    'partner-corp': {hiddenInfoTables: [], hiddenAmountTables: OVERDUE_INFO_TABLES, isBorrowingStatusHidden: true},
    'partner-person': {
        hiddenInfoTables: ['registry', 'suspension', ...OVERDUE_INFO_TABLES],
        hiddenAmountTables: [],
        isBorrowingStatusHidden: true,
    },
}

// 탭 id 인지 — 주소의 ?tab= 값이 보고서 구성 항목(INNOVATION_REPORT_SECTIONS)에 있는지 본다.
const isReportTab = (value: string): value is InnovationReportSectionId =>
    INNOVATION_REPORT_SECTIONS.some((section) => section.id === value)

type LabelValue = {label: string; value: string}

// 신용/재무정보 탭 데이터.
// 기업신용정보 표 하나 — 제목 옆 상태(예: 부가가치세 일반과세자 · 해당없음)와 열 · 줄. 줄이 없으면 '해당사항 없음'.
type InnovationCreditInfoTable = {
    id: string
    title: string
    status: string
    columns: readonly string[]
    rows: readonly (readonly string[])[]
}
// 재무비율진단 한 묶음(성장성 · 수익성 · 안정성 · 활동성) — 점수(0~100)로 상태 · 칸 수를 정한다(Tech-Index 와 같은 구간).
type InnovationFinancialRatioGroup = {
    id: string
    title: string
    score: number
    rows: readonly {key: string; label: string; values: readonly number[]; comparison: string}[]
}
// 차입금 현황 한 칸 — 금액(백만원) · 비중(%). 없으면 null(화면에 '-').
type InnovationBorrowingCell = {amount: number; ratio: number} | null
type InnovationBorrowingRow = {key: string; label: string; cells: readonly InnovationBorrowingCell[]}
type InnovationCreditDetail = {
    /** 기업신용등급 요약 상자 — 줄바꿈 자리마다 한 줄. */
    ratingSummary: readonly string[]
    /** 이전평가이력 — 시간순. 등급은 CRI 코드. chartLabel 은 그래프 아래 시점(예: 23.09월). */
    ratingHistory: readonly {date: string; chartLabel: string; grade: string}[]
    cashFlow: {
        /** 현재 현금흐름등급(CR-1 ~ CR-6). */
        grade: string
        history: readonly {year: string; grade: string}[]
        summary: string
    }
    creditInfo: readonly InnovationCreditInfoTable[]
    ratioYears: readonly string[]
    ratios: readonly InnovationFinancialRatioGroup[]
    /** 차입금 변동률(%) — 월별. */
    borrowingTrend: readonly {label: string; value: number}[]
    borrowings: {
        years: readonly string[]
        groups: readonly {
            key: string
            label: string
            rows: readonly InnovationBorrowingRow[]
            subtotal: InnovationBorrowingRow
        }[]
        total: InnovationBorrowingRow
    }
    borrowingChanges: {
        years: readonly string[]
        rows: readonly {key: string; label: string; values: readonly number[]}[]
    }
    institutions: {
        years: readonly string[]
        rows: readonly {key: string; label: string; values: readonly (number | null)[]}[]
        /** 도넛 — 최근 연도 비중(%). */
        share: readonly {id: string; label: string; percentage: number; color: string}[]
    }
    /** 신용/담보 비중(%) — 시점별 두 값과, 막대에 쓸 최근 값. */
    creditCollateral: {
        points: readonly {label: string; credit: number; collateral: number}[]
        current: {credit: number; collateral: number}
    }
    /** 담보 현황(백만원). */
    collaterals: readonly {id: string; label: string; amount: number; color: string}[]
}

// Tech-Index 탭 데이터 — 점수 구간표 · 표준분포 비교 · 기업 유형별 비교 · 4대 혁신역량 · 세부지표.
// 값의 범위는 0~100 점이다. isSubject 는 조회 기업(신청기업) 항목이다 — 막대 색을 달리한다.
type InnovationTechIndexScoreItem = {id: string; label: string; value: number; isSubject?: boolean}
type InnovationTechIndexCapability = {
    id: string
    /** 역량 이름(인프라 · 투입 · 활동 · 성과). */
    label: string
    /** 신청기업 점수 · 전체기업 점수(0~100). 상태 · 단계는 신청기업 점수로 화면이 정한다(getTechIndexGrade · getTechIndexLevel). */
    score: number
    average: number
}

// Tech-Index 점수 구간 — 점수표 · 4대 혁신역량 상태(뱃지 · 막대 색)의 단일 소스. max 이하이면 그 구간이다(20.5 는 미흡).
const TECH_INDEX_GRADES = [
    {range: '0-20', max: 20, label: '취약', summaryLabel: '취약함', tone: 'weak'},
    {range: '21-40', max: 40, label: '미흡', summaryLabel: '미흡함', tone: 'poor'},
    {range: '41-60', max: 60, label: '보통', summaryLabel: '보통', tone: 'normal'},
    {range: '61-80', max: 80, label: '양호', summaryLabel: '양호함', tone: 'good'},
    {range: '81-100', max: 100, label: '우수', summaryLabel: '우수함', tone: 'excellent'},
] as const satisfies readonly {
    range: string
    max: number
    label: string
    /** 요약 문장 끝말(진단브리핑 '…73.8점으로 양호함'). */
    summaryLabel: string
    tone: ScoreGaugeTone
}[]
type TechIndexGrade = (typeof TECH_INDEX_GRADES)[number]

// 점수 → 구간. 숫자가 아니거나 0 미만이면 가장 낮은 구간, 100 초과면 가장 높은 구간.
const getTechIndexGrade = (score: number): TechIndexGrade =>
    TECH_INDEX_GRADES.find((grade) => Number.isFinite(score) && score <= grade.max) ??
    (Number.isFinite(score) && score > 0 ? TECH_INDEX_GRADES[TECH_INDEX_GRADES.length - 1] : TECH_INDEX_GRADES[0])

// 점수 → 10단계 칸 수. 10점마다 한 칸이며 내림한다(63.7 → 6) — 도달하지 않은 칸을 채우지 않는다.
const TECH_INDEX_LEVEL_STEP = 10
const TECH_INDEX_LEVEL_COUNT = 10
const getTechIndexLevel = (score: number) =>
    Number.isFinite(score)
        ? Math.min(TECH_INDEX_LEVEL_COUNT, Math.max(0, Math.floor(score / TECH_INDEX_LEVEL_STEP)))
        : 0
type InnovationTechIndexDetail = {
    /** 기술보증기금 Tech-Index 표준분포(평균 · 표준편차)와 조회 기업의 순위 문구(예: 상위 2.2%). */
    standard: {
        mean: number
        standardDeviation: number
        percentileLabel: string
        summary: readonly {text: string; isStrong?: boolean; isLineBreak?: boolean}[]
    }
    companyTypes: readonly InnovationTechIndexScoreItem[]
    descriptions: readonly string[]
    capabilities: readonly InnovationTechIndexCapability[]
    /** 기업 유형별 4대 혁신역량 — 역량마다 유형별 점수. */
    capabilityByType: readonly {id: string; label: string; items: readonly InnovationTechIndexScoreItem[]}[]
    /** 세부지표별 상대비교 — 지표 묶음마다 축(지표)별 신청기업 · 전체평균 점수. */
    indicators: readonly {
        id: string
        title: string
        items: readonly {label: string; company: number; average: number}[]
    }[]
}

// 관련 기업 및 특허현황의 수치 종류 — 총 기업수 · 총 특허수 · 고성장 기업수 · 고성장 기업 특허수.
type InnovationStatId = 'companies' | 'patents' | 'high-growth-companies' | 'high-growth-patents'

type InnovationGrowthReport = {
    /** 보고서 제목(대표 기술 · 제품명) · 기업명 · 발급일. */
    title: string
    companyName: string
    issuedAt: string
    /** 보고서 생성일자 · 조회일 전일자 · 기준일자 — 구획마다 오른쪽 위에 붙는 날짜.
     *  lookupBaseDate(조회일 전일자)는 현재 화면에 표시하지 않는다(필드만 유지). */
    createdAt: string
    lookupBaseDate: string
    /** 기업의 소분류(업종) 이름 — 구획 제목 옆 보조 문구. */
    subCategoryName: string
    company: {rows: readonly LabelValue[]}
    innovation: {
        technologies: readonly PercentageDonutItem[]
        /** 관련 기업 · 특허 수치 4개. id 로 화면이 아이콘을 고른다(문서의 INNOVATION_STAT_ICONS). */
        stats: readonly {id: InnovationStatId; label: string; value: number; unit: string}[]
        averages: readonly {label: string; value: string; unit: string}[]
        issues: readonly WordCloudItem[]
        /** 정부 R&D사업 부처별 접수 건수(상위 4개). 건수가 없으면 value 를 null 로 — 화면이 '-' 로 표시한다. */
        rnd: readonly {label: string; value: number | null; unit: string}[]
        rndNote: string
    }
    /** 혁신성장역량지수 — 점수 게이지(ScoreGauge) · 동일업종 순위 피라미드(RankPyramidChart) · 요약 문장. */
    techIndex: {
        /** 0~100 점수. 상태(색 · 이름)는 화면이 점수 구간(getTechIndexGrade)으로 정한다. */
        score: number
        /** 동일업종 기준 상위 %(예: 25)와 업종 이름. */
        industryPercentile: number
        industryLabel: string
        /** 점수 카드 오른쪽 위 안내. */
        scoreNote: string
    }
    creditFinance: {
        /** 기업신용등급 — CRI 등급 코드와 날짜 목록. 등급명 · 게이지 채움 비율은 화면이 CRI 등급표(cri-grades)에서 찾는다. */
        rating: {grade: string; details: readonly RatingGaugeDetail[]}
        /** 재무비율진단 — 항목마다 다섯 단계 중 하나(weak 취약 · poor 미흡 · normal 보통 · good 양호 · excellent 우수). */
        ratios: readonly RatingMatrixRow[]
        comparison: readonly {label: string; company: number; industry: number}[]
        years: readonly string[]
        statements: readonly {label: string; values: readonly number[]}[]
    }
    activity: {
        employees: readonly {label: string; value: number}[]
        salesPerEmployee: readonly {label: string; value: number}[]
    }
    /** 기업현황 탭. */
    companyStatus: InnovationCompanyStatus
    /** 기술혁신정보 탭. */
    techInnovation: InnovationTechDetail
    /** 활동성정보 탭 — 분기별 종업원수 · 인당 매출액 그래프는 activity(진단브리핑과 같은 값)를 함께 쓴다. */
    activityDetail: InnovationActivityDetail
    /** Tech-Index 탭 — 점수 · 상태는 techIndex(진단브리핑과 같은 값)를 함께 쓴다. */
    techIndexDetail: InnovationTechIndexDetail
    /** 신용/재무정보 탭 — 기업신용등급 게이지는 creditFinance.rating(진단브리핑과 같은 값)을 함께 쓴다. */
    creditDetail: InnovationCreditDetail
    /** 열람 케이스 — 신용/재무정보 탭의 비공개 범위를 정한다(INNOVATION_CREDIT_VISIBILITY). */
    viewerCase: InnovationReportCase
}

// 기업현황 탭 데이터 — 개요 · 경영진/주주 · 관계기업 · 특허/인증 · 재무(재무상태 · 손익 · 주요재무비율 · 현금흐름) · 거래처.
// 재무 행(values)은 years 와 같은 순서 · 같은 길이다.
type InnovationFinanceRow = {key: string; label: string; values: readonly number[]}
type InnovationTradePartner = {
    name: string
    /** 연도별 거래 비중(%) — years 와 같은 순서. */
    shares: readonly number[]
    /** 신용등급(CRI 코드). 없으면 빈 문자열 → '-' 로 보인다. */
    grade: string
    baseYear: string
}
type InnovationCompanyStatus = {
    overview: readonly LabelValue[]
    executives: readonly {role: string; name: string; birthDate: string}[]
    shareholders: readonly {name: string; shares: number; ratio: number; relation: string}[]
    affiliates: readonly {
        name: string
        ceo: string
        industry: string
        fiscalYear: string
        totalAssets: number
        sales: number
    }[]
    /** 특허 · 실용신안 · 디자인 · 상표권 건수. */
    intellectualProperty: readonly {id: InnovationIpId; label: string; count: number}[]
    /** 벤처 · 이노비즈 · 메인비즈 · 연구소 인증 여부. */
    certifications: readonly {id: InnovationCertificationId; label: string; isCertified: boolean}[]
    finance: {
        years: readonly string[]
        /** 재무상태 — 첫 행(총자산)이 그래프의 기준 막대, 나머지가 앞 막대다. */
        balance: readonly InnovationFinanceRow[]
        /** 손익현황 — 첫 행(매출액)이 기준 막대. */
        income: readonly InnovationFinanceRow[]
        ratios: readonly InnovationFinanceRow[]
        cashFlows: readonly InnovationFinanceRow[]
    }
    customers: readonly InnovationTradePartner[]
    suppliers: readonly InnovationTradePartner[]
}
type InnovationIpId = 'patent' | 'utility-model' | 'design' | 'trademark'

// 활동성정보 탭 데이터 — 인적자원(연도별) · 에너지 사용량(전기 · 가스, 사업장별 연도 값).
type InnovationEnergyRow = {key: string; label: string; values: readonly number[]}
type InnovationActivityDetail = {
    humanResources: readonly {
        year: string
        employees: number
        /** 전년 대비 증감 인원 · 증감률(%). 음수면 감소. */
        change: number
        changeRate: number
        hires: number
        leavers: number
        /** 인당 매출액(천원). */
        salesPerEmployee: number
    }[]
    energy: {
        years: readonly string[]
        electricity: readonly InnovationEnergyRow[]
        gas: readonly InnovationEnergyRow[]
    }
}

// 기술혁신정보 탭 데이터 — 안내 문구 · 보유기술(분류 도넛 둘 · 특허 표) · 특허기술 분석 · 기업/특허 현황(매출 규모별 · 비중 도넛 둘)
// · 경쟁기업 사업실적 · 성장률 우수기업 · 우수특허 · 이머징 기술 · R&D 이슈 · R&D 전문기관 · 정부 R&D 사업.
type InnovationPatentRow = {
    title: string
    applicationNumber: string
    registrationNumber: string
    applicationDate: string
    registrationDate: string
    applicant: string
    rightHolder: string
}
type InnovationRndProject = {
    ministry: string
    title: string
    period: string
    agency: string
    manager: string
}
type InnovationInstitute = {name: string; patentCount: number; ratio: number}
type InnovationRankItem = {
    id: string
    name: string
    /** 성장률(%). */
    value: number
    /** 고성장 기업 표시(★). */
    isHighGrowth?: boolean
    /** 강조 줄 — 평균 · 조회기업. */
    tone?: 'average' | 'subject'
}
type InnovationTechDetail = {
    /** 탭 맨 위 안내 문구. */
    notice: string
    holdings: {
        description: string
        /** 중분류 · 소분류 기준 보유기술 비중. */
        middleCategory: readonly PercentageDonutItem[]
        smallCategory: readonly PercentageDonutItem[]
        /** 특허 보유현황(최대 10개 · 출원일 최근순). */
        patents: readonly (InnovationPatentRow & {field: string})[]
    }
    analysis: {
        patentTitle: string
        patentNumber: string
        /** 특허 개요 — 줄마다 목록 한 항목. */
        summary: readonly string[]
        field: {name: string; path: string; description: string}
        /** 판단 근거 — 줄마다 목록 한 항목. */
        reasons: readonly string[]
    }
    marketScale: {
        /** 매출 규모 구간별 기업수(개) · 특허수(건). */
        rows: readonly {id: string; label: string; companies: number; patents: number}[]
        companyShare: readonly PercentageDonutItem[]
        patentShare: readonly PercentageDonutItem[]
    }
    /** 경쟁기업 사업실적 — 막대(매출액) + 선(성장률). tone 이 조회기업 · 평균을 가른다. */
    competitors: readonly {
        id: string
        label: string
        sales: number
        growthRate: number | null
        tone?: 'subject' | 'average'
    }[]
    /** 성장률 우수기업 — 매출 100억원 이하 · 초과 두 목록. */
    growthLeaders: {
        small: {title: string; items: readonly InnovationRankItem[]}
        large: {title: string; items: readonly InnovationRankItem[]}
    }
    /** 우수특허 — 피인용 횟수 · 지수. */
    excellentPatents: readonly (InnovationPatentRow & {citations: number; citationIndex: number})[]
    emergingTech: {
        periods: readonly string[]
        rows: readonly {field: string; counts: readonly number[]; growthRate: number; share: number}[]
    }
    rndInstitutes: {
        government: {share: number; rows: readonly InnovationInstitute[]; total: {patentCount: number; ratio: number}}
        academia: {share: number; rows: readonly InnovationInstitute[]; total: {patentCount: number; ratio: number}}
    }
    governmentRnd: {
        baseDate: string
        open: readonly InnovationRndProject[]
        upcoming: readonly InnovationRndProject[]
    }
}
type InnovationCertificationId = 'venture' | 'innobiz' | 'mainbiz' | 'research-lab'

// ── [퍼블리싱 전용] 목업(API 연결 시 삭제) ──
const MOCK_DELAY_MS = 300

// [퍼블리싱 전용] 목업 도넛 색 — 기업 보유기술 도넛 8단계(navy.700 → blue.50). 보고서는 라이트 고정이라 palette 변수를 그대로 쓴다.
const TECHNOLOGY_COLORS = [
    'var(--raw-navy-700)',
    'var(--raw-navy-500)',
    'var(--raw-blue-700)',
    'var(--raw-blue-500)',
    'var(--raw-blue-400)',
    'var(--raw-blue-300)',
    'var(--raw-blue-200)',
    'var(--raw-blue-50)',
]

const MOCK_INNOVATION_GROWTH_REPORT: InnovationGrowthReport = {
    title: 'AI 기반 의료 영상 분석 시스템',
    companyName: '프롬엑스테크',
    issuedAt: '2026-05-25',
    createdAt: '2025-12-04',
    lookupBaseDate: '2025-12-03',
    subCategoryName: '무선 · 이동통신 서비스',
    company: {
        rows: [
            {label: '기업명', value: '프롬엑스테크'},
            {label: '대표자', value: '홍길동'},
            {label: '기업유형/형태', value: '유가증권시장/법인기업'},
            {label: '표준산업분류', value: '(C26299) 그 외 기타 전자부품 제조업'},
            {label: '대표기술분야', value: '-'},
            {label: '주요제품', value: '5G통신 및 IoT 관련 서비스'},
        ],
    },
    innovation: {
        technologies: [
            {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24},
            {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7},
            {id: 't3', label: 'IoT 플랫폼', percentage: 10, count: 5},
            {id: 't4', label: '네트워크 보안', percentage: 8, count: 4},
            {id: 't5', label: '위성 통신', percentage: 6, count: 3},
            {id: 't6', label: '광통신 부품', percentage: 5, count: 2},
            {id: 't7', label: '전파 계측', percentage: 4, count: 2},
            {id: 't8', label: '기타', percentage: 3, count: 1},
        ].map((item, index) => ({...item, color: TECHNOLOGY_COLORS[index]})),
        stats: [
            {id: 'companies', label: '총 기업수', value: 83960, unit: '개'},
            {id: 'patents', label: '총 특허수', value: 135230, unit: '건'},
            {id: 'high-growth-companies', label: '고성장 기업수', value: 243, unit: '개'},
            {id: 'high-growth-patents', label: '고성장 기업 특허수', value: 582, unit: '건'},
        ],
        averages: [
            {label: '기업당 평균 특허수', value: '1.6', unit: '건'},
            {label: '고성장 기업당 평균 특허수', value: '2.4', unit: '건'},
            {label: '조회기업 특허수', value: '5', unit: '건'},
        ],
        issues: [
            {text: '인공지능', weight: 40},
            {text: '이미지', weight: 30},
            {text: '기술', weight: 28},
            {text: '학습', weight: 28},
            {text: '신경망', weight: 22},
            {text: '모델', weight: 22},
            {text: '이공', weight: 20},
            {text: '인식', weight: 18},
            {text: '지능', weight: 18},
            {text: '예측', weight: 14},
            {text: '분류', weight: 12},
            {text: '분석', weight: 12},
            {text: '기반', weight: 12},
            {text: '서비스', weight: 10},
            {text: '활용', weight: 10},
            {text: '영상', weight: 9},
            {text: '성능', weight: 8},
            {text: '네트워크', weight: 8},
        ],
        rnd: [
            {label: '중소벤처기업부', value: 5, unit: '건'},
            {label: '과학기술정보통신부', value: 3, unit: '건'},
            {label: '산업통상부', value: 1, unit: '건'},
            {label: '보건복지부', value: 2, unit: '건'},
        ],
        rndNote:
            '* 상위 4개만 있으므로 상세 내용은 ‘기술혁신 > 정부 R&D 사업’ 페이지 참조 해주세요. (정보가 없을 경우 ‘-’ 표시)',
    },
    techIndex: {
        score: 73.8,
        industryPercentile: 25,
        industryLabel: '그 외 기타 전자부품 제조업',
        scoreNote: '* 기술신용평가 이력이 없는 경우에는 산출 불가',
    },
    creditFinance: {
        rating: {
            // 목업 CRI 코드 — '우량 등급'으로 표시된다(AA+ · AA0 · AA- 중 가운데).
            grade: 'AA0',
            details: [
                {label: '평가일자', value: '2022-06-15'},
                {label: '결산일자', value: '2024-08-04'},
            ],
        },
        ratios: [
            {id: 'sales-growth', label: '매출액증가율', rating: 'poor'},
            {id: 'operating-margin', label: '영업이익율', rating: 'normal'},
            {id: 'equity-ratio', label: '자기자본비율', rating: 'good'},
            {id: 'asset-turnover', label: '총자본회전율', rating: 'excellent'},
            {id: 'cash-flow', label: '현금흐름', rating: 'weak'},
        ],
        comparison: [
            {label: '매출액증가율', company: 80, industry: 60},
            {label: '영업이익율', company: 65, industry: 55},
            {label: '자기자본비율', company: 70, industry: 60},
            {label: '총자본회전율', company: 55, industry: 50},
            {label: '현금흐름', company: 60, industry: 45},
        ],
        years: ['2022년', '2023년', '2024년'],
        statements: [
            {label: '총자산', values: [11826, 17168, 18768]},
            {label: '자본총계', values: [5332, 5130, 5191]},
            {label: '부채총계', values: [6494, 12038, 13577]},
            {label: '매출액', values: [16329, 18115, 18243]},
            {label: '영업이익', values: [1042, 497, 821]},
            {label: '순이익', values: [821, 466, 60]},
        ],
    },
    activity: {
        employees: [
            {label: '23.03월', value: 39},
            {label: '23.06월', value: 37},
            {label: '23.09월', value: 37},
            {label: '23.12월', value: 35},
            {label: '24.03월', value: 34},
            {label: '24.06월', value: 34},
            {label: '24.09월', value: 31},
            {label: '24.12월', value: 33},
            {label: '25.03월', value: 27},
            {label: '25.06월', value: 28},
            {label: '25.09월', value: 25},
        ],
        salesPerEmployee: [
            {label: '2022년', value: 456.1},
            {label: '2023년', value: 452.9},
            {label: '2024년', value: 466.5},
        ],
    },
    techInnovation: {
        notice: '기술혁신정보는 국내 등록특허에 대한 AI 분석 결과에 기반하고 있습니다. 기술보증기금은 AI를 통해 귀사가 보유하고 있는 특허를 분석하여 ‘국가과학기술표준분류체계’에 따른 기술분야로 분류하고, 분류된 기술분야를 기준으로 다양한 기술혁신정보를 맞춤형으로 제공하고 있습니다. 기술혁신정보의 내용은 AI 기반으로 자동 생성된 것으로, AI 특성상 분석 결과 등에 일부 오류 또는 불완전한 정보가 포함될 수 있음을 유의하여 주시기 바랍니다.',
        holdings: {
            description:
                '기술 보유현황은 귀사의 특허(기술)를 AI로 분석하고, 분석결과에 따라 보유 기술을 국가과학기술표준분류체계(중분류, 소분류)로 분류한 것입니다.',
            middleCategory: [
                {id: 'm1', label: '무선 통신·네트워크', percentage: 55, count: 24},
                {id: 'm2', label: '정보 보호', percentage: 12, count: 5},
                {id: 'm3', label: '컴퓨팅 시스템', percentage: 9, count: 4},
                {id: 'm4', label: '소프트웨어', percentage: 7, count: 3},
                {id: 'm5', label: '반도체 소자', percentage: 6, count: 3},
                {id: 'm6', label: '전자 부품', percentage: 5, count: 2},
                {id: 'm7', label: '광 · 전파', percentage: 4, count: 2},
                {id: 'm8', label: '기타', percentage: 2, count: 1},
            ].map((item, index) => ({...item, color: TECHNOLOGY_COLORS[index]})),
            smallCategory: [
                {id: 's1', label: '무선·이동통신 서비스', percentage: 50, count: 22},
                {id: 's2', label: '이동통신 네트워크', percentage: 14, count: 6},
                {id: 's3', label: 'IoT 플랫폼', percentage: 10, count: 4},
                {id: 's4', label: '네트워크 보안', percentage: 8, count: 4},
                {id: 's5', label: '위성 통신', percentage: 6, count: 3},
                {id: 's6', label: '광통신 부품', percentage: 5, count: 2},
                {id: 's7', label: '전파 계측', percentage: 4, count: 2},
                {id: 's8', label: '기타', percentage: 3, count: 1},
            ].map((item, index) => ({...item, color: TECHNOLOGY_COLORS[index]})),
            patents: [
                [
                    '무선 통신 시스템에서 데이터 및 제어 정보 송수신 방법',
                    '10-2023-0184164',
                    '10-2712345',
                    '한국기업(주)',
                    '무선·이동통신 서비스',
                ],
                [
                    '차세대 네트워크에서 인공지능 기반 트래픽 관리 시스템',
                    '10-2023-0184165',
                    '10-2712346',
                    '글로벌테크(주)',
                    '네트워크 관리 및 최적화',
                ],
                [
                    '스마트 시티를 위한 IoT 디바이스 간 자동 통신 프로토콜',
                    '10-2023-0184166',
                    '10-2712347',
                    '에코시티솔루션즈',
                    '스마트 시티 인프라',
                ],
                [
                    '블록체인 기술을 활용한 분산형 무선 네트워크 보안 시스템',
                    '10-2023-0184167',
                    '10-2712348',
                    '세이프네트워크(주)',
                    '네트워크 보안',
                ],
                [
                    '저전력 광대역 무선통신을 위한 신호 처리 장치 및 방법',
                    '10-2023-0184168',
                    '10-2712349',
                    '그린커넥트(주)',
                    '저전력 통신 기술',
                ],
                [
                    '5G 무선통신에서 다중 안테나 시스템을 이용한 데이터 전송 방법',
                    '10-2023-0184169',
                    '10-2712350',
                    '넥스트무브(주)',
                    '무선 통신 하드웨어',
                ],
                [
                    '클라우드 기반 무선 네트워크 서비스 관리 및 제어 시스템',
                    '10-2023-0184170',
                    '10-2712351',
                    '클라우드넷코리아',
                    '클라우드 서비스',
                ],
                [
                    '무선 센서 네트워크를 위한 에너지 효율적 데이터 전송 알고리즘',
                    '10-2024-0184171',
                    '10-2712352',
                    '에너지센서(주)',
                    '무선 센서 네트워크',
                ],
                [
                    '인공지능 기반 무선 통신 신호 이상 탐지 및 대응 시스템',
                    '10-2024-0184172',
                    '10-2712353',
                    '인텔리콤(주)',
                    '인공지능 및 통신 보안',
                ],
                [
                    '차량용 무선 통신 모듈 및 이를 이용한 통신 시스템',
                    '10-2024-0184173',
                    '10-2712354',
                    '오토커넥트(주)',
                    '자동차 통신 기술',
                ],
            ].map(([title, applicationNumber, registrationNumber, company, field]) => ({
                title,
                applicationNumber,
                registrationNumber,
                applicationDate: '2025-12-04',
                registrationDate: '2024-08-12',
                applicant: company,
                rightHolder: company,
                field,
            })),
        },
        analysis: {
            patentTitle: '무선 통신 시스템에서 데이터 및 제어 정보 송수신 방법 및 장치',
            patentNumber: '10-2023-0184164',
            summary: [
                '본 개시는 4G시스템 이후 보다 높은 데이터 전송률을 지원하기 위한 5G 통신 시스템을 IoT 기술과 융합하는 통신 기법 및 그 시스템에 관한 것이다. 본 개시는 5G통신 기술 및 IoT 관련 기술을 기반으로 지능형 서비스에 적용될 수 있다.',
            ],
            field: {
                name: '무선·이동통신 서비스',
                path: '(기술분야) 정보/통신 – 무선 통신·네트워크 – 무선·이동통신 서비스',
                description:
                    '무선·이동통신 환경에서 다양한 서비스 제공을 위해 이동통신 네트워크상의 망 장비 및 관련 서비스 제공 관련 기술 요소를 통칭',
            },
            reasons: [
                '발명은 5G 무선 통신 시스템에서 상·하향 송수신을 제어 정보로 중단/재개하는 프로토콜·단말/기지국 동작 방법에 관한 것으로 RNA/단말의 전송 제어 메커니즘에 초점이 있다. IoT는 적용 분야로 언급될 뿐 핵심 기술을 이동통신망의 서비스 제공을 위한 제어 절차이므로 무선·이동통신 서비스가 가장 적합하다.',
            ],
        },
        marketScale: {
            rows: [
                {id: 'under-1b', label: '10억원 이하', companies: 13547, patents: 3547},
                {id: 'under-3b', label: '30억원 이하', companies: 5678, patents: 8536},
                {id: 'under-10b', label: '100억원 이하', companies: 1532, patents: 2987},
                {id: 'under-30b', label: '300억원 이하', companies: 2657, patents: 6578},
                {id: 'over-30b', label: '300억원 초과', companies: 800, patents: 3957},
            ],
            companyShare: [
                {id: 'c1', label: '10억원 이하', percentage: 56, count: 13547},
                {id: 'c2', label: '30억원 이하', percentage: 24, count: 5678},
                {id: 'c3', label: '300억원 이하', percentage: 11, count: 2657},
                {id: 'c4', label: '100억원 이하', percentage: 6, count: 1532},
                {id: 'c5', label: '300억원 초과', percentage: 3, count: 800},
            ].map((item, index) => ({...item, color: TECHNOLOGY_COLORS[index]})),
            patentShare: [
                {id: 'p1', label: '30억원 이하', percentage: 33, count: 8536},
                {id: 'p2', label: '300억원 이하', percentage: 26, count: 6578},
                {id: 'p3', label: '300억원 초과', percentage: 16, count: 3957},
                {id: 'p4', label: '10억원 이하', percentage: 14, count: 3547},
                {id: 'p5', label: '100억원 이하', percentage: 11, count: 2987},
            ].map((item, index) => ({...item, color: TECHNOLOGY_COLORS[index]})),
        },
        competitors: [
            {id: 'c1', label: '기업1', sales: 32.8, growthRate: 2.3},
            {id: 'c2', label: '기업2', sales: 32.7, growthRate: -1.2},
            {id: 'c3', label: '기업3', sales: 32.6, growthRate: 0.8},
            {id: 'c4', label: '기업4', sales: 32.5, growthRate: 7.4},
            {id: 'c5', label: '기업5', sales: 32.4, growthRate: 2.7},
            {id: 'subject', label: '조회기업', sales: 32.3, growthRate: 5.2, tone: 'subject'},
            {id: 'c6', label: '기업6', sales: 32.2, growthRate: 0.5},
            {id: 'c7', label: '기업7', sales: 32.1, growthRate: 3.6},
            {id: 'c8', label: '기업8', sales: 31.9, growthRate: 3.1},
            {id: 'c9', label: '기업9', sales: 31.5, growthRate: -2.3},
            {id: 'c10', label: '기업10', sales: 31.2, growthRate: -0.2},
            {id: 'average', label: '평균', sales: 32.2, growthRate: 2.1, tone: 'average'},
        ],
        growthLeaders: {
            small: {
                title: '100억원 이하',
                items: [
                    {id: 's1', name: '(주)이음', value: 23.5, isHighGrowth: true},
                    {id: 's2', name: '(주)새론', value: 21.5, isHighGrowth: true},
                    {id: 's3', name: '(주)아라', value: 17.2},
                    {id: 's4', name: '(주)누리', value: 16.8},
                    {id: 's5', name: '(주)가나다', value: 15.2},
                    {id: 's6', name: '(주)파랑', value: 14.2},
                    {id: 's7', name: '(주)다솜', value: 9.8},
                    {id: 's8', name: '(주)푸름', value: 7.9},
                    {id: 's9', name: '(주)온누리', value: 7.5},
                    {id: 's10', name: '(주)해오름', value: 6.8},
                    {id: 's-average', name: '평균', value: 4.5, tone: 'average'},
                    {id: 's-subject', name: '프롬엑스테크', value: 8.2, tone: 'subject'},
                ],
            },
            large: {
                title: '100억원 초과',
                items: [
                    {id: 'l1', name: '(주)비상', value: 18.8},
                    {id: 'l2', name: '(주)하늘', value: 17.6},
                    {id: 'l3', name: '(주)드림', value: 15.1},
                    {id: 'l4', name: '(주)온새미로', value: 12.8},
                    {id: 'l5', name: '(주)가나다', value: 10.9},
                    {id: 'l6', name: '(주)솔빛', value: 9.5},
                    {id: 'l7', name: '(주)바른', value: 8.2},
                    {id: 'l8', name: '(주)초롱', value: 6.1},
                    {id: 'l9', name: '(주)미래', value: 5.4},
                    {id: 'l10', name: '(주)별빛', value: 4.8},
                    {id: 'l-average', name: '평균', value: 2.5, tone: 'average'},
                ],
            },
        },
        excellentPatents: [
            ['탈부착 가능한 턴시그널 램프 모듈', '10-2023-0184164', '10-2712345', '한국기업(주)', 6, 2.5],
            ['자율 주행 차량용 고성능 레이더 센서', '10-2023-0198745', '10-2712356', '스마트모빌리티(주)', 8, 3.1],
            ['무선 충전 지원 스마트폰 케이스', '10-2023-0201123', '10-2712399', '글로벌테크(주)', 4, 1.8],
            ['친환경 바이오 플라스틱 제조공정', '10-2023-0210567', '10-2712408', '에코솔루션(주)', 12, 4.2],
            ['스마트 홈용 음성 인식 모듈', '10-2023-0223456', '10-2712450', '네오테크(주)', 7, 2.9],
            ['고효율 태양광 패널 접합 기술', '10-2023-0236789', '10-2712489', '그린에너지(주)', 9, 3.5],
            ['웨어러블 건강 모니터링 센서', '10-2024-0001234', '10-2712501', '헬스테크(주)', 5, 2.0],
            ['자동차용 내비게이션 소프트웨어', '10-2024-0012345', '10-2712550', '모빌리티소프트(주)', 11, 3.8],
            ['인공지능 기반 영상 분석 시스템', '10-2024-0023456', '10-2712600', '비전테크(주)', 10, 3.3],
            ['차세대 무선 통신 모듈 설계', '10-2024-0034567', '10-2712650', '텔레콤솔루션(주)', 6, 2.7],
        ].map(([title, applicationNumber, registrationNumber, company, citations, citationIndex]) => ({
            title: String(title),
            applicationNumber: String(applicationNumber),
            registrationNumber: String(registrationNumber),
            applicationDate: '2025-12-04',
            registrationDate: '2024-08-12',
            applicant: String(company),
            rightHolder: String(company),
            citations: Number(citations),
            citationIndex: Number(citationIndex),
        })),
        emergingTech: {
            periods: ['2015~2016년', '2017~2018년', '2019~2020년', '2021~2022년', '2023~2024년'],
            rows: [
                {field: '프로그래밍 언어/자연어 처리', counts: [30, 50, 52, 79, 171], growthRate: 54.5, share: 2.7},
                {field: '머신러닝/컴퓨터 비전', counts: [45, 60, 48, 72, 165], growthRate: 57.8, share: 3.1},
                {field: '데이터베이스/빅데이터 분석', counts: [25, 40, 55, 68, 150], growthRate: 50.0, share: 2.4},
                {field: '웹 개발/프론트엔드', counts: [35, 48, 46, 80, 178], growthRate: 53.9, share: 2.8},
                {field: '클라우드 컴퓨팅/네트워크', counts: [40, 42, 50, 75, 160], growthRate: 52.3, share: 2.5},
                {field: '모바일 앱 개발', counts: [28, 55, 53, 77, 170], growthRate: 54.7, share: 2.9},
                {field: '사물인터넷/임베디드 시스템', counts: [22, 35, 49, 65, 140], growthRate: 47.6, share: 2.2},
                {field: '인공지능/로보틱스', counts: [50, 62, 54, 82, 185], growthRate: 59.7, share: 3.3},
                {field: '보안/암호화 기술', counts: [33, 45, 51, 70, 160], growthRate: 51.9, share: 2.6},
                {field: '게임 개발/그래픽스', counts: [38, 50, 47, 78, 165], growthRate: 53.2, share: 2.7},
                {field: '기타', counts: [27, 43, 44, 67, 140], growthRate: 48.5, share: 2.3},
            ],
        },
        rndInstitutes: {
            government: {
                share: 56.6,
                rows: [
                    {name: '한국전자통신연구소', patentCount: 500, ratio: 16.7},
                    {name: '삼성전자', patentCount: 1200, ratio: 40.0},
                    {name: 'LG화학', patentCount: 900, ratio: 30.0},
                    {name: '현대자동차', patentCount: 1100, ratio: 37.0},
                    {name: '네이버', patentCount: 850, ratio: 28.3},
                    {name: '카카오', patentCount: 700, ratio: 23.3},
                    {name: '포스코', patentCount: 650, ratio: 21.7},
                    {name: 'SK하이닉스', patentCount: 1150, ratio: 38.3},
                    {name: '대한항공', patentCount: 500, ratio: 16.7},
                    {name: 'KT', patentCount: 480, ratio: 16.0},
                    {name: '기타 연구소', patentCount: 520, ratio: 17.3},
                ],
                total: {patentCount: 3000, ratio: 100},
            },
            academia: {
                share: 43.4,
                rows: [
                    {name: '서울대학교', patentCount: 300, ratio: 13.0},
                    {name: 'KAIST', patentCount: 800, ratio: 35.0},
                    {name: '연세대학교', patentCount: 500, ratio: 22.0},
                    {name: '성균관대학교', patentCount: 450, ratio: 19.5},
                    {name: '고려대학교', patentCount: 600, ratio: 26.0},
                    {name: '한양대학교', patentCount: 400, ratio: 17.0},
                    {name: '이화여자대학교', patentCount: 350, ratio: 15.0},
                    {name: '한국과학기술원', patentCount: 750, ratio: 32.5},
                    {name: '중앙대학교', patentCount: 300, ratio: 13.0},
                    {name: '경희대학교', patentCount: 320, ratio: 13.5},
                    {name: '기타 산학협력단', patentCount: 280, ratio: 12.0},
                ],
                total: {patentCount: 2300, ratio: 100},
            },
        },
        governmentRnd: {
            baseDate: '2025-12-04',
            open: [
                [
                    '중소벤처기업부',
                    '2025년도 로봇산업기술개발사업 신규지원 대상과제 공고',
                    '한국산업기획평가원',
                    '김범수 (02-280-0423)',
                ],
                [
                    '과학기술정보통신부',
                    '인공지능 융합기술 연구개발 지원사업 공고',
                    '한국과학기술정보연구원',
                    '이수진 (031-210-4567)',
                ],
                [
                    '산업통상자원부',
                    '스마트 제조 혁신기술 개발사업 신규과제 모집',
                    '한국산업기술진흥원',
                    '박지훈 (055-789-1234)',
                ],
                ['환경부', '친환경 에너지 기술개발 지원사업 공고', '한국환경산업기술원', '정미영 (044-321-9876)'],
                ['교육부', '디지털 교육 콘텐츠 개발 지원사업 공고', '한국교육학술정보원', '한승우 (02-3668-4321)'],
            ].map(([ministry, title, agency, manager]) => ({
                ministry,
                title,
                period: '2025-11-20 ~ 2025-11-26',
                agency,
                manager,
            })),
            upcoming: [
                [
                    '중소벤처기업부',
                    '2025년도 로봇산업기술개발사업 신규지원 대상과제 공고',
                    '한국산업기획평가원',
                    '김범수 (02-280-0423)',
                ],
                [
                    '과학기술정보통신부',
                    '인공지능 융합기술 연구개발 지원사업 공고',
                    '한국과학기술정보연구원',
                    '이수진 (031-210-4567)',
                ],
                [
                    '산업통상자원부',
                    '스마트 제조 혁신기술 개발사업 신규과제 모집',
                    '한국산업기술진흥원',
                    '박지훈 (055-789-1234)',
                ],
                ['환경부', '친환경 에너지 기술개발 지원사업 공고', '한국환경산업기술원', '정미영 (044-321-9876)'],
                ['교육부', '디지털 교육 콘텐츠 개발 지원사업 공고', '한국교육학술정보원', '한승우 (02-3668-4321)'],
                ['문화체육관광부', '문화콘텐츠 융복합 기술개발 지원사업', '한국콘텐츠진흥원', '윤지혜 (02-3456-7890)'],
                [
                    '농림축산식품부',
                    '스마트 농업 기술 혁신사업 공고',
                    '농림수산식품기술기획평가원',
                    '김태훈 (031-555-1234)',
                ],
                ['보건복지부', '의료기기 혁신기술 연구개발 지원사업', '한국보건산업진흥원', '박은영 (02-2071-1234)'],
                ['국토교통부', '스마트 도시 및 교통기술 개발사업', '국토교통과학기술진흥원', '이재훈 (044-201-5678)'],
                [
                    '중소벤처기업부',
                    '스타트업 혁신성장 지원사업 신규과제 공고',
                    '중소벤처기업진흥공단',
                    '최민지 (02-3459-8765)',
                ],
            ].map(([ministry, title, agency, manager]) => ({
                ministry,
                title,
                period: '2025-11-20 ~ 2025-11-26',
                agency,
                manager,
            })),
        },
    },
    viewerCase: 'self',
    creditDetail: {
        ratingSummary: [
            '현재시점에서 채무상환 능력에 대한 당면 문제는 없으나,',
            '장래의 경제여건 및 시장환경 변화에 따라 안정성 면에서는 불안한 요소가 있음',
        ],
        ratingHistory: [
            {date: '2023-09-03', chartLabel: '23.09월', grade: 'A-'},
            {date: '2024-11-04', chartLabel: '24.11월', grade: 'BBB+'},
            {date: '2025-10-15', chartLabel: '25.10월', grade: 'AA0'},
        ],
        cashFlow: {
            grade: 'CR-4',
            history: [
                {year: '2022년', grade: 'CR-3'},
                {year: '2023년', grade: 'CR-4'},
                {year: '2024년', grade: 'CR-5'},
            ],
            summary:
                '현금흐름 창출능력이 보통이상이나 장래 경제 여건 및 환경악화에 따라 다소나마 현금흐름 저하 가능성이 존재함',
        },
        creditInfo: [
            {
                id: 'closure',
                title: '휴폐업정보',
                status: '부가가치세 일반과세자',
                columns: ['사업자등록번호', '휴폐업 상태', '휴폐업일자', '조회일자'],
                rows: [['123-45-67890', '부가가치세 일반과세자', '-', '2023-11-06']],
            },
            {
                id: 'registry',
                title: '법인등기정보',
                status: '정상',
                columns: ['법인등록번호', '법인등기상태', '외부감사여부', '결산월'],
                rows: [['123456-1234567', '정상', '여', '12월']],
            },
            {
                id: 'suspension',
                title: '당좌거래정지정보',
                status: '해당없음',
                columns: ['발생일자', '종료일자', '취소일자'],
                rows: [],
            },
            {
                id: 'short-overdue',
                title: '단기연체정보',
                status: '해제',
                columns: ['발생일자', '해제일자', '연체금액', '등록기관', '조회기준일자'],
                rows: [['2023-11-06', '2024-11-06', '1,200,000', '부산은행', '2023-12-06']],
            },
            {
                id: 'trade-overdue',
                title: '상거래연체정보',
                status: '해당없음',
                columns: ['등록정보', '등록사유', '발생일자', '해제일자', '연체금액', '등록기관'],
                rows: [],
            },
            {
                id: 'public-arrears',
                title: '공공체납정보',
                status: '해당없음',
                columns: ['등록정보', '등록사유', '발생일자', '해제일자', '연체금액', '등록기관'],
                rows: [],
            },
        ],
        ratioYears: ['2022년', '2023년', '2024년'],
        ratios: [
            {
                id: 'growth',
                title: '성장성',
                score: 50.5,
                rows: [
                    {key: 'growth-0', label: '매출액증가율', values: [7.15, 5.84, 7.42], comparison: '보통'},
                    {key: 'growth-1', label: '총자산증가율', values: [12.36, 13.1, 12.52], comparison: '양호'},
                    {key: 'growth-2', label: '순이익증가율', values: [15.02, 10.74, 16.37], comparison: '취약'},
                    {key: 'growth-3', label: '영업이익증가율', values: [3.2, 4.1, 2.85], comparison: '취약'},
                ],
            },
            {
                id: 'profitability',
                title: '수익성',
                score: 37.1,
                rows: [
                    {key: 'profitability-0', label: '영업이익률', values: [7.15, 5.84, 7.42], comparison: '보통'},
                    {key: 'profitability-1', label: '당기순이익률', values: [12.36, 13.1, 12.52], comparison: '양호'},
                    {
                        key: 'profitability-2',
                        label: '자기자본이익률',
                        values: [15.02, 10.74, 16.37],
                        comparison: '취약',
                    },
                    {
                        key: 'profitability-3',
                        label: '총자본영업이익률',
                        values: [7.15, 16.74, 6.37],
                        comparison: '취약',
                    },
                ],
            },
            {
                id: 'stability',
                title: '안정성',
                score: 88.2,
                rows: [
                    {key: 'stability-0', label: '부채비율', values: [7.15, 5.84, 7.42], comparison: '보통'},
                    {key: 'stability-1', label: '이자보상비율', values: [12.36, 13.1, 12.52], comparison: '양호'},
                    {key: 'stability-2', label: '차입금의존도', values: [15.02, 10.74, 16.37], comparison: '취약'},
                    {key: 'stability-3', label: '자기자본비율', values: [3.2, 4.1, 2.85], comparison: '취약'},
                ],
            },
            {
                id: 'activity',
                title: '활동성',
                score: 73.7,
                rows: [
                    {key: 'activity-0', label: '매출채권회전율', values: [7.15, 5.84, 7.42], comparison: '보통'},
                    {key: 'activity-1', label: '재고자산회전율', values: [12.36, 13.1, 12.52], comparison: '양호'},
                    {key: 'activity-2', label: '순운전자본회전율', values: [15.02, 10.74, 16.37], comparison: '취약'},
                    {key: 'activity-3', label: '총자본회전율', values: [3.2, 4.1, 2.85], comparison: '취약'},
                ],
            },
        ],
        borrowingTrend: [
            {label: '24.11월', value: 39},
            {label: '24.12월', value: 37},
            {label: '25.01월', value: 37},
            {label: '25.02월', value: 35},
            {label: '25.03월', value: 34},
            {label: '25.04월', value: 34},
            {label: '25.05월', value: 31},
            {label: '25.06월', value: 33},
            {label: '25.07월', value: 27},
            {label: '25.08월', value: 28},
            {label: '25.09월', value: 25},
            {label: '25.10월', value: 25},
        ],
        borrowings: {
            years: ['2022년', '2023년', '2024년'],
            groups: [
                {
                    key: 'short',
                    label: '단기',
                    rows: [
                        {key: 'short-loan', label: '단기차입금', cells: [null, null, {amount: 6081, ratio: 100.0}]},
                        {key: 'foreign-short', label: '외화단기차입금', cells: [null, null, null]},
                        {key: 'current-long', label: '유동성장기부채', cells: [null, null, null]},
                        {key: 'current-foreign', label: '유동성외화장기차입금', cells: [null, null, null]},
                    ],
                    subtotal: {key: 'short-subtotal', label: '소계', cells: [null, null, {amount: 6081, ratio: 100.0}]},
                },
                {
                    key: 'long',
                    label: '장기',
                    rows: [
                        {key: 'bond', label: '사채', cells: [null, null, {amount: 6081, ratio: 100.0}]},
                        {
                            key: 'long-loan',
                            label: '장기차입금',
                            cells: [{amount: 4500, ratio: 100.0}, {amount: 4690, ratio: 100.0}, null],
                        },
                        {key: 'foreign-long', label: '외화장기차입금', cells: [null, null, null]},
                    ],
                    subtotal: {
                        key: 'long-subtotal',
                        label: '소계',
                        cells: [{amount: 4500, ratio: 100.0}, {amount: 4690, ratio: 100.0}, null],
                    },
                },
            ],
            total: {
                key: 'total',
                label: '차입금 합계',
                cells: [
                    {amount: 4500, ratio: 100.0},
                    {amount: 4690, ratio: 100.0},
                    {amount: 6081, ratio: 100.0},
                ],
            },
        },
        borrowingChanges: {
            years: ['2022년', '2023년', '2024년'],
            rows: [
                {key: 'amount', label: '차입금(백만원)', values: [7.15, 16.74, 6.37]},
                {key: 'to-sales', label: '차입금/매출액(%)', values: [7.15, 16.74, 6.37]},
                {key: 'repayment', label: '차입금상환계수', values: [7.15, 16.74, 6.37]},
                {key: 'change', label: '총차입금변동률', values: [7.15, 16.74, 6.37]},
            ],
        },
        institutions: {
            years: ['2022년', '2023년', '2024년'],
            rows: [
                {key: 'bank', label: '은행업권', values: [50.5, 60.5, 76.0]},
                {key: 'mutual', label: '상호금융업권', values: [9.3, 10.0, 18.3]},
                {key: 'savings', label: '저축은행업권', values: [10.0, 9.5, null]},
                {key: 'card', label: '카드/캐피탈업권', values: [20.0, 10.0, 5.6]},
                {key: 'lending', label: '대부업권', values: [10.0, 10.0, null]},
            ],
            share: [
                {id: 'bank', label: '은행업권', percentage: 76, color: 'var(--raw-navy-500)'},
                {id: 'mutual', label: '상호금융업권', percentage: 18.4, color: 'var(--raw-blue-500)'},
                {id: 'card', label: '카드/캐피탈업권', percentage: 5.6, color: 'var(--raw-blue-300)'},
            ],
        },
        creditCollateral: {
            points: [
                {label: '22.12월', credit: 30, collateral: 70},
                {label: '23.12월', credit: 40, collateral: 60},
                {label: '24.12월', credit: 43.8, collateral: 56.2},
            ],
            current: {credit: 43.8, collateral: 56.2},
        },
        collaterals: [
            {id: 'real-estate', label: '부동산', amount: 2000, color: 'var(--raw-navy-500)'},
            {id: 'special-mortgage', label: '특수저당', amount: 3862, color: 'var(--raw-blue-500)'},
            {id: 'guarantee', label: '보증', amount: 2850, color: 'var(--raw-blue-300)'},
        ],
    },
    techIndexDetail: {
        standard: {
            mean: 50.5,
            standardDeviation: 21.5,
            percentileLabel: '상위 2.2%',
            summary: [
                {text: '프롬엑스테크는 기술보증기금의 Tech-Index 표준정보 분포와 비교시'},
                {text: '', isLineBreak: true},
                {text: '상위 2.2%', isStrong: true},
                {text: ' 수준에 해당합니다.'},
            ],
        },
        companyTypes: [
            {id: 'subject', label: '신청기업', value: 73.7, isSubject: true},
            {id: 'all', label: '전체기업', value: 50.5},
            {id: 'startup', label: '창업', value: 46},
            {id: 'non-startup', label: '비창업', value: 55.1},
            {id: 'venture', label: '벤처', value: 52.2},
            {id: 'innobiz', label: '이노비즈', value: 58.7},
        ],
        descriptions: [
            'Tech-Index는 현재의 기술역량과 미래성장의 잠재력 수준을 측정하는 AI평가모형 기반의 복합지수입니다.',
            'Tech-Index는 현재 기업의 내재적 기술혁신역량을 나타내는 지수(Index)이면서 동시에 미래성장성을 예측해 볼 수 있는 확률적인 점수를 의미합니다.',
            'Tech-Index는 ‘기업성장의 선순환 구조’ 이론에 착안하여 기업성장과 관련한 인프라, 투입, 활동, 성과의 4대 혁신역량으로 구성되어 있으며, 혁신역량은 이를 대표하는 14개 투입지표로 구성되어 있습니다.',
        ],
        capabilities: [
            {id: 'infra', label: '인프라', score: 63.7, average: 37.5},
            {id: 'input', label: '투입', score: 88.2, average: 55.6},
            {id: 'activity', label: '활동', score: 53.4, average: 11.3},
            {id: 'output', label: '성과', score: 37.1, average: 13.5},
        ],
        capabilityByType: [
            {
                id: 'infra',
                label: '인프라',
                items: [
                    {id: 'subject', label: '신청기업', value: 73.7, isSubject: true},
                    {id: 'startup', label: '창업', value: 50.5},
                    {id: 'non-startup', label: '비창업', value: 46},
                    {id: 'venture', label: '벤처', value: 55.1},
                    {id: 'innobiz', label: '이노비즈', value: 52.2},
                ],
            },
            {
                id: 'input',
                label: '투입',
                items: [
                    {id: 'subject', label: '신청기업', value: 73.7, isSubject: true},
                    {id: 'startup', label: '창업', value: 50.5},
                    {id: 'non-startup', label: '비창업', value: 46},
                    {id: 'venture', label: '벤처', value: 55.1},
                    {id: 'innobiz', label: '이노비즈', value: 52.2},
                ],
            },
            {
                id: 'activity',
                label: '활동',
                items: [
                    {id: 'subject', label: '신청기업', value: 73.7, isSubject: true},
                    {id: 'startup', label: '창업', value: 50.5},
                    {id: 'non-startup', label: '비창업', value: 46},
                    {id: 'venture', label: '벤처', value: 55.1},
                    {id: 'innobiz', label: '이노비즈', value: 52.2},
                ],
            },
            {
                id: 'output',
                label: '성과',
                items: [
                    {id: 'subject', label: '신청기업', value: 73.7, isSubject: true},
                    {id: 'startup', label: '창업', value: 50.5},
                    {id: 'non-startup', label: '비창업', value: 46},
                    {id: 'venture', label: '벤처', value: 55.1},
                    {id: 'innobiz', label: '이노비즈', value: 52.2},
                ],
            },
        ],
        indicators: [
            {
                id: 'capability-investment',
                title: '역량·투자 지표',
                items: [
                    {label: '기술인력역량', company: 94.3, average: 43},
                    {label: '무형자산', company: 85.8, average: 43},
                    {label: '인적자산투자', company: 64.7, average: 43},
                    {label: '고객자산투자', company: 80, average: 43},
                    {label: '혁신자산투자', company: 75, average: 43},
                    {label: '대표자역량', company: 80.6, average: 43},
                ],
            },
            {
                id: 'patent-technology',
                title: '특허·기술 지표',
                items: [
                    {label: '기술개발상용화', company: 80, average: 43},
                    {label: '특허등록', company: 66.7, average: 43},
                    {label: '특허출원', company: 87.1, average: 43},
                    {label: '특허청구항', company: 88.9, average: 43},
                    {label: '기술활용상용화', company: 62.9, average: 43},
                    {label: '피인용특허', company: 64.6, average: 43},
                    {label: '기술개발', company: 70, average: 43},
                    {label: '기술인증', company: 84.9, average: 43},
                ],
            },
        ],
    },
    activityDetail: {
        humanResources: [
            {year: '2022년', employees: 42, change: 1, changeRate: 3.5, hires: 2, leavers: 4, salesPerEmployee: 456.1},
            {
                year: '2023년',
                employees: 41,
                change: -1,
                changeRate: -3.5,
                hires: 2,
                leavers: 4,
                salesPerEmployee: 452.9,
            },
            {
                year: '2024년',
                employees: 40,
                change: -1,
                changeRate: -3.5,
                hires: 2,
                leavers: 4,
                salesPerEmployee: 466.5,
            },
        ],
        energy: {
            years: ['2023년', '2024년', '2025년'],
            electricity: [
                {key: 'headquarters', label: '본사', values: [7.15, 5.84, 7.42]},
                {key: 'factory', label: '공장', values: [12.36, 13.1, 12.52]},
                {key: 'etc', label: '기타', values: [15.02, 10.74, 16.37]},
            ],
            gas: [
                {key: 'headquarters', label: '본사', values: [4.12, 3.26, 4.35]},
                {key: 'factory', label: '공장', values: [9.8, 10.42, 9.91]},
                {key: 'etc', label: '기타', values: [11.64, 8.2, 12.48]},
            ],
        },
    },
    companyStatus: {
        overview: [
            {label: '기업명', value: '프롬엑스테크'},
            {label: '대표자', value: '홍길동'},
            {label: '법인등록번호', value: '110111-1234567'},
            {label: '사업자등록번호', value: '123-45-67890'},
            {label: '설립일', value: '2010년 03월 15일'},
            {label: '종업원수', value: '33명'},
            {label: '기업유형/형태', value: '유가증권시장/법인기업'},
            {label: '기업규모', value: '중소기업'},
            {label: '주소', value: '(48400) 부산광역시 남구 문현금융로 33'},
            {label: '표준산업분류', value: '(C26299) 그 외 기타 전자부품 제조업'},
            {label: '대표기술분야', value: '무선·이동통신 서비스'},
            {label: '주요제품', value: '5G통신 및 IoT 관련 서비스'},
        ],
        executives: [
            {role: '대표이사', name: '홍길동', birthDate: '71.02.03'},
            {role: '사내이사', name: '김이사', birthDate: '74.05.12'},
            {role: '감사', name: '이감사', birthDate: '69.11.28'},
            {role: '사외이사', name: '박이사', birthDate: '77.08.09'},
        ],
        shareholders: [
            {name: '홍길동', shares: 10000, ratio: 40, relation: '본인'},
            {name: '김이사', shares: 7500, ratio: 30, relation: '가족'},
            {name: '이감사', shares: 5000, ratio: 20, relation: '친척'},
            {name: '박이사', shares: 2500, ratio: 10, relation: '타인'},
        ],
        affiliates: [
            {
                name: '(주)한국상사',
                ceo: '이대표',
                industry: '도매 및 소매업',
                fiscalYear: '2024',
                totalAssets: 10755,
                sales: 232,
            },
            {
                name: '(주)서울테크',
                ceo: '김상현',
                industry: '전자제품 제조업',
                fiscalYear: '2023',
                totalAssets: 18920,
                sales: 475,
            },
            {
                name: '(주)그린에너지',
                ceo: '박민지',
                industry: '신재생에너지 개발',
                fiscalYear: '2024',
                totalAssets: 7850,
                sales: 180,
            },
        ],
        intellectualProperty: [
            {id: 'patent', label: '특허', count: 1106},
            {id: 'utility-model', label: '실용신안', count: 334},
            {id: 'design', label: '디자인', count: 545},
            {id: 'trademark', label: '상표권', count: 58},
        ],
        certifications: [
            {id: 'venture', label: '벤처', isCertified: true},
            {id: 'innobiz', label: '이노비즈', isCertified: true},
            {id: 'mainbiz', label: '메인비즈', isCertified: false},
            {id: 'research-lab', label: '연구소', isCertified: true},
        ],
        finance: {
            years: ['2022년', '2023년', '2024년'],
            balance: [
                {key: 'total-assets', label: '총자산', values: [10000, 16761, 18981]},
                {key: 'liabilities', label: '부채총계', values: [4200, 7300, 8100]},
                {key: 'equity', label: '자본총계', values: [5800, 9461, 10881]},
            ],
            income: [
                {key: 'sales', label: '매출액', values: [12500, 14200, 16100]},
                {key: 'operating-profit', label: '영업이익', values: [980, 1210, 1350]},
                {key: 'net-income', label: '당기순이익', values: [610, -240, 820]},
            ],
            ratios: [
                {key: 'operating-margin', label: '영업이익률', values: [7.84, 8.52, 8.39]},
                {key: 'debt-ratio', label: '부채비율', values: [72.41, 77.16, 74.44]},
                {key: 'receivables-turnover', label: '매출채권회전율', values: [5.12, 4.87, 5.33]},
                {key: 'sales-growth', label: '매출액증가율', values: [9.35, 13.6, 13.38]},
                {key: 'asset-growth', label: '총자산증가율', values: [11.2, 67.61, 13.25]},
            ],
            cashFlows: [
                {key: 'operating', label: '영업활동후 현금흐름', values: [1520, 2130, 1980]},
                {key: 'financing', label: '재무활동후 현금흐름', values: [-420, 860, -310]},
                {key: 'investing', label: '투자활동후 현금흐름', values: [-980, -1640, -1120]},
                {key: 'net-change', label: '순현금변화', values: [120, 1350, 550]},
                {key: 'cash-vs-income', label: '영업활동 현금흐름과 순이익 차이', values: [910, 2370, 1160]},
            ],
        },
        customers: [
            {name: '○○기업(주)', shares: [55.11, 56.12, 56.12], grade: 'BBB+', baseYear: '2024'},
            {name: '△△테크(주)', shares: [52.34, 53.45, 53.45], grade: 'A0', baseYear: '2023'},
            {name: '◇◇솔루션', shares: [58.22, 59.33, 59.33], grade: 'BBB0', baseYear: '2025'},
            {name: '□□산업(주)', shares: [41.05, 43.2, 44.9], grade: 'B-', baseYear: '2025'},
            {name: '☆☆네트웍스', shares: [12.4, 11.87, 10.02], grade: 'CCC0', baseYear: '2025'},
        ],
        suppliers: [
            {name: '○○부품(주)', shares: [35.11, 36.12, 36.12], grade: 'BBB+', baseYear: '2024'},
            {name: '△△소재(주)', shares: [22.34, 23.45, 26.12], grade: 'A0', baseYear: '2023'},
            {name: '◇◇전자', shares: [18.22, 19.33, 16.12], grade: 'BBB0', baseYear: '2025'},
            {name: '□□물산', shares: [9.4, 8.7, 8.1], grade: 'B-', baseYear: '2025'},
            {name: '☆☆로지스', shares: [5.02, 4.8, 4.35], grade: '', baseYear: '2025'},
        ],
    },
}

// [퍼블리싱 전용] 보고서 조회(목업) — 어느 보고서 id 로 열어도 같은 목업을 돌려준다.
// [프론트엔드 연동] reportId 로 보고서를 조회하는 API 로 바꾼다. 없는 보고서면 null 을 돌려주면 화면이 404(notFound)로 넘긴다.
//   받는 동안은 라우트의 loading.tsx(InnovationGrowthReportDocumentSkeleton)가 같은 틀을 보여 준다 — MOCK_DELAY_MS 로 미리 볼 수 있다.
const getInnovationGrowthReport = async (reportId?: string): Promise<InnovationGrowthReport | null> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
    // 목업: 빈 id(?reportId=)만 없는 보고서로 본다 — 404 흐름을 미리 확인하는 용도.
    if (reportId === '') return null
    return MOCK_INNOVATION_GROWTH_REPORT
}

// [퍼블리싱 확인용] 주소의 ?case= 로 열람 케이스를 덮어써 본다. 값이 케이스가 아니면 받은 그대로 둔다. 연동 후 이 함수와 호출을 지운다.
const withPreviewCase = (report: InnovationGrowthReport, previewCase: unknown): InnovationGrowthReport =>
    isInnovationReportCase(previewCase) ? redactForViewerCase({...report, viewerCase: previewCase}) : report

// [퍼블리싱 확인용] 케이스에서 제공하지 않는 값을 목업에서 뺀다 — 실서비스에서 백엔드가 하는 일을 흉내 낸다.
// 화면은 가린 자리에 자리 표시 값을 그리므로, 여기서 뺀 값은 페이지 데이터(DOM · RSC 페이로드)에 남지 않는다.
const redactForViewerCase = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const visibility = INNOVATION_CREDIT_VISIBILITY[report.viewerCase]
    const {creditDetail} = report
    return {
        ...report,
        creditDetail: {
            ...creditDetail,
            creditInfo: creditDetail.creditInfo.map((table) => {
                if (visibility.hiddenInfoTables.includes(table.id)) return {...table, rows: []}
                if (!visibility.hiddenAmountTables.includes(table.id)) return table
                const amountIndex = table.columns.indexOf('연체금액')
                return {
                    ...table,
                    rows: table.rows.map((row) => row.map((value, index) => (index === amountIndex ? '' : value))),
                }
            }),
            ...(visibility.isBorrowingStatusHidden
                ? {
                      institutions: {years: [], rows: [], share: []},
                      creditCollateral: {points: [], current: {credit: 0, collateral: 0}},
                      collaterals: [],
                  }
                : {}),
        },
    }
}
// ── 목업 끝 ──

export {
    getInnovationGrowthReport,
    innovationReportPath,
    withPreviewCase,
    INNOVATION_CREDIT_VISIBILITY,
    INNOVATION_REPORT_CASE_QUERY,
    INNOVATION_REPORT_CASES,
    getTechIndexGrade,
    getTechIndexLevel,
    TECH_INDEX_GRADES,
    TECH_INDEX_LEVEL_COUNT,
    getInnovationReportViewport,
    isReportTab,
    INNOVATION_REPORT_BADGE,
    INNOVATION_REPORT_TAB_QUERY,
    INNOVATION_REPORT_CREATED_QUERY,
    INNOVATION_REPORT_CREATED_QUERY_VALUE,
    INNOVATION_REPORT_MORE_LABEL,
    INNOVATION_REPORT_PC_VIEW,
    INNOVATION_REPORT_VIEW_QUERY,
    INNOVATION_ISSUE_COLORS,
    INNOVATION_REPORT_ID_QUERY,
    INNOVATION_REPORT_CREATED_TOAST,
    INNOVATION_REPORT_PRINT_LABEL,
    INNOVATION_REPORT_SECTIONS,
    INNOVATION_REPORT_WINDOW_HEIGHT,
    INNOVATION_REPORT_WINDOW_NAME,
    INNOVATION_REPORT_WINDOW_WIDTH,
    MOCK_INNOVATION_GROWTH_REPORT,
}
export type {
    InnovationReportUserType,
    InnovationCreditVisibility,
    InnovationReportCase,
    InnovationCertificationId,
    InnovationCompanyStatus,
    InnovationFinanceRow,
    InnovationGrowthReport,
    InnovationActivityDetail,
    InnovationEnergyRow,
    InnovationInstitute,
    InnovationIpId,
    InnovationRankItem,
    InnovationCreditDetail,
    InnovationCreditInfoTable,
    InnovationFinancialRatioGroup,
    InnovationBorrowingCell,
    InnovationBorrowingRow,
    InnovationTechDetail,
    InnovationTechIndexCapability,
    InnovationTechIndexDetail,
    InnovationTechIndexScoreItem,
    InnovationReportSectionId,
    InnovationStatId,
    InnovationTradePartner,
}
