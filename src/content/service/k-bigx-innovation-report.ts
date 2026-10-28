import type {RatingMatrixRow} from '@/components/custom/rating-matrix'
import type {PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import {donutColorsFor} from '@/components/custom/percentage-donut-colors'
import type {ScoreGaugeTone} from '@/components/custom/score-gauge'
import type {RatingGaugeDetail} from '@/components/custom/semicircle-rating-gauge'
import type {WordCloudItem} from '@/components/custom/word-cloud'
import type {Viewport} from 'next'
// [퍼블리싱 전용] 마이페이지 이력 카드별 보고서 목업 — API 연결 시 이 import 와 파일을 함께 지운다.
import {findMockHistoryCard, withMockHistoryCard} from '@/content/service/k-bigx-report-history-mock-reports'

// K-BIGx 기업혁신성장 보고서 — 보고서 한 건의 데이터 모양(타입) · 문구 · 목업 · 조회 함수를 모은 파일.
// 화면: corp/org-k-bigx-report-innovation-growth-report-diagnostic-briefing(한 페이지 · 탭은 ?tab=).
//
// 보고서는 새 창으로 열리는 문서 한 장이고, 탭(진단브리핑 · 기업현황 · 기술혁신정보 · Tech-Index · 신용/재무정보 · 활동성정보)은
// 모두 이 한 건의 데이터(InnovationGrowthReport)를 나눠 그린다. 목업(MOCK_INNOVATION_GROWTH_REPORT)도 보고서 한 건이며,
// 지금은 이 한 건을 돌려준다(마이페이지 이력 카드의 id 로 열 때만 카드별 목업 — k-bigx-report-history-mock-reports.ts).
//
// ┌─ [프론트엔드 연동] 체크리스트 — 화면(components/custom/innovation-growth-report-*.tsx)은 고치지 않는다 ──────────────
// │ 1. getInnovationGrowthReport(reportId) 의 목업 반환을 보고서 조회 API 호출로 바꾼다(파일 아래 '목업' 구역).
// │    응답은 InnovationGrowthReport 타입 모양으로 맞춘다 — 없으면 null 을 돌려주면 화면이 404 로 처리한다.
// │ 2. 응답에 viewerCase(열람 케이스)를 넣는다 — self · partner-corp · partner-person. 로그인 사용자와 조회 대상 기업의
// │    관계로 백엔드가 정한다. 케이스별 가림 범위는 INNOVATION_CREDIT_VISIBILITY 에 정의돼 있다.
// │ 3. 케이스에서 제공하지 않는 값은 응답에서 뺀다(빈 배열 · 빈 칸) — 화면은 그 자리를 자리 표시 값으로 가린다.
// │    실제 값을 내려 주면 가려도 페이지 데이터에 남아 개발자 도구로 읽힌다. 뺄 범위는 redactForViewerCase 가 참고 구현이다.
// │ 4. [퍼블리싱 확인용] 코드를 지운다.
// │    - withPreviewCase · withPreviewCaseSample · redactForViewerCase 함수(이 파일)와 그 호출(components/custom/innovation-growth-report-page.tsx · kbigx-print-page.tsx).
// │    - ?empty= 미리보기: withPreviewEmpty 와 그 아래 withPreview* · PREVIEW_* 함수 · 상수, INNOVATION_REPORT_EMPTY_QUERY 와
// │      미리보기 값 상수(INNOVATION_REPORT_EMPTY_* · *_LONG_TEXT · *_MIXED 등), 호출(위 두 페이지 파일).
// │      모두 '[퍼블리싱 확인용]' 표식이 붙어 있다 — 이 표식으로 검색해 남김없이 지운다.
// │    - 목업 구역 전체(MOCK_DELAY_MS · MOCK_INNOVATION_GROWTH_REPORT)와 이력 카드별 목업
// │      (k-bigx-report-history-mock-reports.ts 파일 · 맨 위 import · getInnovationGrowthReport 안 호출).
// │ 5. 문구(INNOVATION_REPORT_*) · 점수 구간(TECH_INDEX_GRADES) · 케이스 정의는 그대로 쓴다.
// │ 참고: 점수에 따른 상태 · 색 · 칸 수, 비율, 합계 같은 파생 값은 화면이 계산한다 — 원래 값만 내려 준다.
// │       기업현황(경영진 · 주주 · 관계기업) · 기술혁신정보 표는 노출 건수 제한이 있다 — 최대 10줄, 또는 10건 + '기타' 1줄 = 최대 11줄.
// │       목록은 자르지 말고 그대로 보낸다(이머징 기술만 API 가 '기타' 줄을 만든다).
// │       표별 규칙은 '[프론트엔드 연동 · 최대' 로 검색 — innovation-growth-report-tech.tsx 의 [표 노출 건수 규칙] 표.
// │       순서가 정해진 목록은 '[프론트엔드 연동 · 정렬]' 로 검색한다(화면이 정렬하는 목록과 받은 순서대로 그리는 목록이 섞여 있다).
// └────────────────────────────────────────────────────────────────────────────────────────────────────────────────

// 새 창 크기 — 내용 폭 1200(콘텐츠 상한)에 양 여백을 더한 창으로 연다.
// 화면보다 넓으면 NewWindowLink 가 화면 크기까지 줄인다.
const INNOVATION_REPORT_WINDOW_WIDTH = 1440
const INNOVATION_REPORT_WINDOW_HEIGHT = 900
const INNOVATION_REPORT_WINDOW_NAME = 'k-bigx-innovation-report'
// 보고서 id 를 싣는 쿼리 이름 — 보고서 문서는 …/diagnostic-briefing?reportId=<id> 로 연다.
const INNOVATION_REPORT_ID_QUERY = 'reportId'

// R&D 이슈 워드클라우드 순서 색(범례 1st~5th) — 단어를 중요도순으로 이 다섯 색에 돌아가며 칠한다.
// 보고서는 화면 테마(다크 포함)를 따르므로 테마에 맞춰 바뀌는 --ds-* 를 쓴다 — 계열 색 report-series-*, 다섯째는 단계 스케일.
const INNOVATION_ISSUE_COLORS = [
    'var(--ds-report-series-2)',
    'var(--ds-report-series-4)',
    'var(--ds-report-series-5)',
    'var(--ds-report-series-3)',
    'var(--ds-blue-800)',
] as const
// 정부 R&D사업 접수현황 칸 — 늘 4칸 이상(웹 보고서 진단브리핑 · 인쇄본 진단브리핑 공용). 받은 부처가 4곳보다 적거나 없으면
// 빠진 부처명을 이 순서대로 채우고 건수는 비운다(null — 화면이 '-' 로 적는다). 받은 부처가 4곳을 넘으면 모두 그린다.
// 부처는 이름(label)으로 맞춘다 — API 부처명이 이 문구와 다르면 같은 부처가 두 번 나온다.
const RND_SLOT_COUNT = 4
const RND_MINISTRIES = ['중소벤처기업부', '과학기술정보통신부', '산업통상부', '보건복지부'] as const
const RND_UNIT = '건'
const toRndSlots = (rnd: InnovationGrowthReport['innovation']['rnd']) =>
    [
        ...rnd,
        ...RND_MINISTRIES.filter((label) => !rnd.some((item) => item.label === label)).map((label) => ({
            label,
            value: null,
            unit: RND_UNIT,
        })),
    ].slice(0, Math.max(RND_SLOT_COUNT, rnd.length))
// 기업현황 재무 표 줄 — 표마다 고정(웹 보고서 기업현황 탭 · 인쇄본 기업현황 장 공용). 받은 finance.* 에서 같은 key 로 찾고,
// 받지 못한 줄도 이름은 두고 값은 비운다('-'). 이 목록에 없는 key 로 온 줄은 그리지 않는다.
// [프론트엔드 연동] API 의 재무 줄 key 는 아래 key 와 같아야 한다.
const FINANCE_ROW_LABELS = {
    balance: [
        {key: 'total-assets', label: '총자산'},
        {key: 'liabilities', label: '부채총계'},
        {key: 'equity', label: '자본총계'},
    ],
    income: [
        {key: 'sales', label: '매출액'},
        {key: 'operating-profit', label: '영업이익'},
        {key: 'net-income', label: '당기순이익'},
    ],
    ratios: [
        {key: 'operating-margin', label: '영업이익률'},
        {key: 'debt-ratio', label: '부채비율'},
        {key: 'receivables-turnover', label: '매출채권회전율'},
        {key: 'sales-growth', label: '매출액증가율'},
        {key: 'asset-growth', label: '총자산증가율'},
    ],
    cashFlows: [
        {key: 'operating', label: '영업활동후 현금흐름'},
        {key: 'financing', label: '재무활동후 현금흐름'},
        {key: 'investing', label: '투자활동후 현금흐름'},
        {key: 'net-change', label: '순현금변화'},
        {key: 'cash-vs-income', label: '영업활동 현금흐름과 순이익 차이'},
    ],
} as const
type FinanceRowLabels = (typeof FINANCE_ROW_LABELS)[keyof typeof FINANCE_ROW_LABELS]
// 고정 줄 순서로 맞춘다 — 받지 못한 줄은 값 없는 줄(values: [])로 채운다.
const toFixedFinanceRows = (labels: FinanceRowLabels, rows: readonly InnovationFinanceRow[]): InnovationFinanceRow[] =>
    labels.map((item) => rows.find((row) => row.key === item.key) ?? {key: item.key, label: item.label, values: []})

// R&D 이슈 워드클라우드 아래 안내 — 웹 보고서 진단브리핑 · 인쇄본 진단브리핑이 함께 쓴다.
const INNOVATION_ISSUE_NOTE = '* 글자 크기는 키워드 중요도에 비례합니다.'
// 매출 규모별 기업 및 특허 현황 — 5행 고정(웹 보고서 · 인쇄본 공용). 받은 rows 에서 같은 label 로 찾고, 없는 행 · 값은
// 숫자 아님(NaN)으로 두어 화면이 '-' 로 적는다(0 은 0). 데이터가 하나도 없어도 5행을 모두 '-' 로 보인다.
const MARKET_SCALE_LABELS = ['10억원 이하', '30억원 이하', '100억원 이하', '300억원 이하', '300억원 초과'] as const
const toMarketScaleRows = (rows: InnovationTechDetail['marketScale']['rows']) =>
    MARKET_SCALE_LABELS.map((label) => {
        const row = rows.find((item) => item.label === label)
        return {
            id: row?.id ?? label,
            label,
            companies: row?.companies ?? Number.NaN,
            patents: row?.patents ?? Number.NaN,
        }
    })

// 웹 보고서 · 인쇄본(PDF 템플릿)이 함께 쓰는 표 · 막대 모양 값 — 한쪽만 바꾸면 웹과 PDF 의 줄 수 · 눈금이 어긋난다.
// 점수 만점 — 혁신성장역량지수 탭의 점수 막대 · 레이더 공통 눈금.
const INNOVATION_REPORT_SCORE_MAX = 100
// 등급 이력(기업신용등급 · 현금흐름등급) — 그래프 · 표 모두 최근 3건, 표는 늘 3줄(모자라면 '-' 줄).
const INNOVATION_REPORT_GRADE_HISTORY_COUNT = 3
// 최근 재무 표 — 연도를 하나도 받지 못하면 연도 열을 3칸('-' 머리)으로 둔다.
const INNOVATION_REPORT_FINANCE_FALLBACK_YEAR_COUNT = 3
// 이머징 기술 — 기간을 받지 못했을 때의 기간 칸 수(2년 단위 · 최근 10년).
const INNOVATION_REPORT_EMERGING_EMPTY_PERIOD_COUNT = 5

const INNOVATION_REPORT_BADGE = 'K-BIGx - 기업혁신성장 보고서'
const INNOVATION_REPORT_PRINT_LABEL = '보고서 다운로드'
// 모바일(768 미만)에서 [보고서 다운로드] 대신 보이는 버튼 — 누르면 PC 화면(모든 탭)을 새 창으로 연다.
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
// title 은 탭 본문 제목 띠에 적는 긴 이름 — 없으면 label 을 그대로 쓴다.
const INNOVATION_REPORT_SECTIONS = [
    {id: 'briefing', label: '진단브리핑'},
    {id: 'company', label: '기업현황'},
    {id: 'innovation', label: '기술혁신정보'},
    {id: 'tech-index', label: 'Tech-Index', title: 'Tech-Index (혁신성장 역량지수)'},
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
// 보고서 열람 케이스 — 신용/재무정보 탭에서 케이스마다 제공되지 않는 항목을 비공개로 가린다(기업신용정보 표는 값 줄을 '비공개' 한 줄,
// 차입금 현황 카드는 흐림(PrivateContent)).
// 근거: 260921 신용재무정보 기관별 노출 여부_FN.xlsx.
// [프론트엔드 연동] 케이스는 보고서 데이터(report.viewerCase)로 내려 준다 — 로그인 사용자 · 조회 대상 관계로 백엔드가 정한다.
// 화면은 이 값만 읽으므로 고칠 필요가 없다. 미노출 항목의 실제 값은 API 가 내려 주지 않는다 — 기업신용정보 표는 rows 를 빈 배열로,
// status 는 그대로 보낸다(status 가 '해당없음' 이면 가리지 않고 '해당사항 없음' 으로 보인다).
// [퍼블리싱 확인용] 주소의 ?case=<id> 가 있으면 viewerCase 를 덮어써 케이스를 바꿔 본다(withPreviewCase) — 연동 후 지운다.
//   self           ① 자기기업 / 금융기관 — 전 항목 노출
//   partner-corp   ② 타기업 · 협약기관(법인) — 단기연체 · 상거래연체 · 공공체납 표, 차입금 현황 카드 3개 미노출
//   partner-person ③ 타기업 · 협약기관(개인) — 법인등기 · 당좌거래정지 · 단기연체 · 상거래연체 · 공공체납 표, 차입금 현황 카드 3개 미노출
const INNOVATION_REPORT_CASE_QUERY = 'case'
// [퍼블리싱 확인용] ?empty=briefing — 진단브리핑에 쓰는 값을 모두 비워 빈 데이터 화면('-' · 빈 상태)을 본다. 연동 후 지운다.
const INNOVATION_REPORT_EMPTY_QUERY = 'empty'
const INNOVATION_REPORT_EMPTY_BRIEFING = 'briefing'
// ?empty=briefing-partial — 값이 있는 칸과 빈 칸을 섞어 일부만 빈 화면('-' 가 섞인 표 · 그래프)을 본다.
const INNOVATION_REPORT_EMPTY_BRIEFING_PARTIAL = 'briefing-partial'
// ?empty=company — 기업현황 탭에 쓰는 값을 모두 비운다(개요 줄 이름만 두고 값 · 표 · 그래프 데이터는 없음).
const INNOVATION_REPORT_EMPTY_COMPANY = 'company'
// ?empty=company-partial — 기업현황 탭에서 값이 있는 칸과 빈 칸을 섞어 본다.
const INNOVATION_REPORT_EMPTY_COMPANY_PARTIAL = 'company-partial'
// ?empty=company-overview-long · company-overview-short — PDF 템플릿 기업현황 첫 쪽에서 개요 글 길이에 따라
// 경영진 · 주주(기준 5행) · 관계기업(기준 3행) 행 수가 줄고 느는 모습을 본다(경영진 · 주주는 10건을 받아 채운 행이 보인다).
const INNOVATION_REPORT_COMPANY_OVERVIEW_LONG = 'company-overview-long'
const INNOVATION_REPORT_COMPANY_OVERVIEW_SHORT = 'company-overview-short'
// ?empty=company-edge · company-edge-short — 같은 첫 쪽의 경계 사례(경영진 1건 · 주주 10건 · 관계기업 10건 · 칸마다 아주 긴 글 · 큰 숫자).
//   edge 는 개요를 길게, edge-short 는 짧게 둔다 — 쪽이 넘치지 않는지(빨간 점선 표시) 본다.
const INNOVATION_REPORT_COMPANY_EDGE = 'company-edge'
const INNOVATION_REPORT_COMPANY_EDGE_SHORT = 'company-edge-short'
// ?empty=company-affiliates-many — 관계기업 25건(웹 최대 10줄 · PDF 템플릿 첫 쪽 기준 3줄을 넘는 경우).
const INNOVATION_REPORT_COMPANY_AFFILIATES_MANY = 'company-affiliates-many'
// ?empty=company-affiliates-one — 관계기업 1건(나머지 줄이 어떻게 보이는지).
const INNOVATION_REPORT_COMPANY_AFFILIATES_ONE = 'company-affiliates-one'
// ?empty=company-one-each — 경영진 · 주주 · 관계기업이 각각 1건.
const INNOVATION_REPORT_COMPANY_ONE_EACH = 'company-one-each'
// ?empty=tech-index — Tech-Index 탭에 쓰는 값을 모두 비운다(점수 · 평가일자 · 표준분포 · 유형별 · 4대 역량 · 부문별 지표).
const INNOVATION_REPORT_EMPTY_TECH_INDEX = 'tech-index'
// ?empty=tech-index-long-text — Tech-Index 의 글 칸(기업명 — 점수 문장 · 표준정보 요약 문장)을 길게 바꾼다.
//   기업 유형 · 4대 역량 · 투입지표 이름은 고정값이라 그대로 둔다.
const INNOVATION_REPORT_TECH_INDEX_LONG_TEXT = 'tech-index-long-text'
// ?empty=tech-index-mixed — Tech-Index 에서 긴 기업명 · 빈 값 · 일부만 받은 목록을 섞는다.
const INNOVATION_REPORT_TECH_INDEX_MIXED = 'tech-index-mixed'
// ?empty=company-long-text — 기업현황 개요 · 경영진 및 주주 · 관계기업 · 매출처 · 매입처의 글 칸(숫자 · 일자 · 형식이 정해진 칸 제외)을 길게 바꾼다.
//   태블릿 등 좁은 화면에서 긴 이름이 칸 안에서 어떻게 보이는지 본다. 줄 수 · 숫자 · 일자는 기본 목업 그대로.
const INNOVATION_REPORT_COMPANY_LONG_TEXT = 'company-long-text'
// ?empty=company-mixed — 기업현황에서 글 길이(아주 긴 · 적절한 · 짧은)와 빈 값 · 건수를 칸마다 섞어 한 화면에 본다.
//   숫자 · 연도 칸은 company-partial 규칙으로 일부만 비우고, 글 칸 · 건수는 withPreviewCompanyMixed 가 정한다.
const INNOVATION_REPORT_COMPANY_MIXED = 'company-mixed'
// ?empty=tech-long-text — 기술혁신정보 특허기술 분석 · 경쟁기업 · 성장률 우수기업 이름 · 기술 보유현황 도넛 범례(긴 · 중간 · 짧은 이름 섞음) · 특허 보유현황 · 우수특허 · 이머징 기술 · R&D 전문기관 · 정부 R&D 사업 표의 글 칸을 길게 바꾼다
//   (숫자 · 일자 · 번호 제외). 줄 수는 기본 목업 그대로.
const INNOVATION_REPORT_TECH_LONG_TEXT = 'tech-long-text'
// ?empty=tech — 기술혁신정보 탭에 쓰는 값을 모두 비운다(안내 문구 · 고정 줄 이름 · 구간 이름 · 소제목은 두고 값 · 목록은 없음).
const INNOVATION_REPORT_EMPTY_TECH = 'tech'
// ?empty=tech-mixed — 기술혁신정보에서 글 길이(아주 긴 · 적절한 · 짧은) · 빈 값 · 건수(0건 · 몇 건 · 넘침)를 구획마다 섞는다.
const INNOVATION_REPORT_TECH_MIXED = 'tech-mixed'
// ?empty=tech-mixed-2 — tech-mixed 와 반대로 섞은 경우(0건 · 많은 건수 · 빈 값 자리를 바꿔 둔다).
const INNOVATION_REPORT_TECH_MIXED_2 = 'tech-mixed-2'
// ?empty=briefing-long-text — 진단브리핑의 글 칸(날짜 · 숫자 · 고정 라벨 제외)을 길게 — 보고서 제목 · 기업명 · 세부분야명 ·
//   기업 정보 값 · 보유기술 범례 · R&D 이슈 키워드 · 동일업종명. 웹 보고서 · PDF 템플릿 공용.
//   정부 R&D 접수현황의 부처명은 고정값이라 바꾸지 않는다.
const INNOVATION_REPORT_BRIEFING_LONG_TEXT = 'briefing-long-text'
// ?empty=briefing-mixed — 진단브리핑에서 글 길이(아주 긴 · 적절한 · 짧은)와 빈 값을 칸마다 섞어 한 화면에 본다.
//   글 칸은 칸마다 길이를 정해 두고(withPreviewBriefingMixed), 숫자 · 일자 칸은 일부만 비운다(briefing-partial 과 같은 규칙).
const INNOVATION_REPORT_BRIEFING_MIXED = 'briefing-mixed'
// ?empty=header — 보고서 머리(웹 보고서 맨 위) · PDF 템플릿 표지에 쓰는 값만 비운다 — 보고서 제목 · 기업명 · 발급일 · 대표자.
const INNOVATION_REPORT_EMPTY_HEADER = 'header'
// ?empty=header-long-text — 머리 · 표지의 글 값을 길게 — 보고서 제목 · 기업명 · 대표자(발급일은 날짜라 그대로).
const INNOVATION_REPORT_HEADER_LONG_TEXT = 'header-long-text'
// ?empty=header-mixed · header-mixed-2 — 머리 · 표지 값의 길이(아주 긴 · 적절한 · 짧은)와 빈 값을 칸마다 섞는다.
//   header-mixed   — 제목 아주 긴 · 기업명 짧은 · 대표자 빈 값 · 발급일 있음
//   header-mixed-2 — 제목 짧은 · 기업명 아주 긴 · 대표자 적절한 · 발급일 빈 값
const INNOVATION_REPORT_HEADER_MIXED = 'header-mixed'
const INNOVATION_REPORT_HEADER_MIXED_2 = 'header-mixed-2'
// ?empty=activity — 활동성정보 탭에 쓰는 값을 모두 비운다(인적자원 · 분기 그래프 · 에너지 표 · 그래프 데이터 없음).
const INNOVATION_REPORT_EMPTY_ACTIVITY = 'activity'
// ?empty=activity-partial — 활동성정보 탭에서 값이 있는 칸과 빈 칸을 섞어 본다.
const INNOVATION_REPORT_EMPTY_ACTIVITY_PARTIAL = 'activity-partial'
// ?empty=activity-long-text — 활동성정보 탭의 숫자를 크게 — 인적자원 표 · 분기 그래프 · 에너지 사용량(가장 넓은 칸 · 축 글자 확인).
//   항목 이름(연도 · 본사/공장/기타)은 고정이라 그대로. 분기 그래프는 진단브리핑과 같은 값이라 진단브리핑도 함께 바뀐다.
const INNOVATION_REPORT_ACTIVITY_LONG_TEXT = 'activity-long-text'
// ?empty=activity-mixed — 활동성정보에서 빈 값 · 일부 값 · 큰 값을 영역마다 섞어 한 화면에 본다(withPreviewActivityMixed).
const INNOVATION_REPORT_ACTIVITY_MIXED = 'activity-mixed'
// ?empty=activity-change — 인적자원 현황 전년대비 증감(율)을 해마다 번갈아 — 증가(▲ 빨강) · 감소(▼ 파랑) · 변동 없음(기호 없음).
const INNOVATION_REPORT_ACTIVITY_CHANGE = 'activity-change'
// ?empty=credit — 신용/재무정보 탭에 쓰는 값을 모두 비운다(등급 · 이력 · 기업신용정보 값 · 재무비율 · 차입금 · 담보 데이터 없음).
const INNOVATION_REPORT_EMPTY_CREDIT = 'credit'
// ?empty=credit-partial — 신용/재무정보 탭에서 값이 있는 칸과 빈 칸을 섞어 본다.
const INNOVATION_REPORT_EMPTY_CREDIT_PARTIAL = 'credit-partial'
// ?empty=credit-long-text — 신용/재무정보 탭의 긴 값 — 차입금 · 담보 금액(큰 수). 기업신용정보 표 값 · 상태는 정해진 명사라 그대로,
//   등급 코드 · 일자 · 고정 항목명(재무비율 · 기관 · 담보 종류)도 그대로 둔다. 웹 보고서 · PDF 템플릿 공용.
const INNOVATION_REPORT_CREDIT_LONG_TEXT = 'credit-long-text'
// ?empty=credit-info-long-text — 기업신용정보 표 값 · 상태가 칸 폭을 넘는 경우(대개 짧은 정해진 명사라 드물다) — 한 줄 말줄임 확인용.
//   상태 · 사유 · 기관 · 정보 · 여부 열은 긴 글, 금액 열은 큰 수. 일자 · 번호 열은 그대로. 웹 보고서 · PDF 템플릿 공용.
const INNOVATION_REPORT_CREDIT_INFO_LONG_TEXT = 'credit-info-long-text'
// ?empty=credit-mixed — 신용/재무정보에서 빈 값 · 일부 값 · 긴 값을 영역마다 섞어 한 화면에 본다(withPreviewCreditMixed).
const INNOVATION_REPORT_CREDIT_MIXED = 'credit-mixed'
const INNOVATION_REPORT_CASES = ['self', 'partner-corp', 'partner-person'] as const
type InnovationReportCase = (typeof INNOVATION_REPORT_CASES)[number]
const isInnovationReportCase = (value: unknown): value is InnovationReportCase =>
    INNOVATION_REPORT_CASES.some((item) => item === value)

// 케이스별 신용/재무정보 미노출 범위.
type InnovationCreditVisibility = {
    /** 가릴 기업신용정보 표 id — 표 머리만 남기고 값 줄을 '비공개' 한 줄로, 제목 옆 상태는 뺀다. */
    hiddenInfoTables: readonly string[]
    /** 차입금 현황(기관별 비중 · 신용/담보 비중 · 담보 현황) 카드를 가린다. */
    isBorrowingStatusHidden: boolean
}
const OVERDUE_INFO_TABLES = ['short-overdue', 'trade-overdue', 'public-arrears'] as const
const INNOVATION_CREDIT_VISIBILITY: Record<InnovationReportCase, InnovationCreditVisibility> = {
    self: {hiddenInfoTables: [], isBorrowingStatusHidden: false},
    'partner-corp': {hiddenInfoTables: OVERDUE_INFO_TABLES, isBorrowingStatusHidden: true},
    'partner-person': {
        hiddenInfoTables: ['registry', 'suspension', ...OVERDUE_INFO_TABLES],
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
    /**
     * 값 줄. [프론트엔드 연동] 웹 보고서는 받은 줄을 모두 그리고, 인쇄본(PDF 템플릿)은 표마다 첫 줄만 그린다
     * (kbigx-print-credit.tsx 의 CREDIT_INFO_ROW_LIMIT — 쪽 높이 어림이 표마다 값 한 줄 기준이다).
     */
    rows: readonly (readonly string[])[]
}
// 재무비율진단 한 묶음(성장성 · 수익성 · 안정성 · 활동성) — 표 · 선 그래프가 같은 줄을 쓴다. unit 은 표 위 '단위: …' 글자.
type InnovationFinancialRatioGroup = {
    id: string
    title: string
    unit: string
    rows: readonly {key: string; label: string; values: readonly number[]; comparison: string}[]
}
// 차입금 현황 한 칸 — 금액(백만원) · 비중(%). 없으면 null(화면에 '-').
type InnovationBorrowingCell = {amount: number; ratio: number} | null
type InnovationBorrowingRow = {key: string; label: string; cells: readonly InnovationBorrowingCell[]}
type InnovationCreditDetail = {
    /**
     * 이전평가이력. 등급은 CRI 코드, chartLabel 은 그래프 아래 시점(예: 23.09월).
     * [프론트엔드 연동 · 정렬] 그래프는 받은 순서대로 그리므로 시간순(오래된 것부터)으로 보낸다.
     * 아래 표는 화면이 평가일자 최신순으로 정렬하고 가장 최근(현재 등급 — 게이지)을 뺀다(기획: 최신순으로 정렬).
     */
    ratingHistory: readonly {date: string; chartLabel: string; grade: string}[]
    cashFlow: {
        /**
         * 현재 현금흐름등급(CF1 ~ CF6). 등급 이름(배지) · 정의(설명 상자)는 화면이 현금흐름등급표(cash-flow-grades.ts —
         * 참고자료 등급 정의와 같은 표)에서 코드로 찾는다. 표에 없는 코드면 배지 · 설명 상자를 숨긴다.
         */
        grade: string
        /**
         * 현재 현금흐름등급의 결산일자 — 인쇄본의 진단브리핑 현금흐름등급 박스 · 신용/재무정보 현금흐름등급(등급 코드 아래)에 보인다.
         * 평가일자는 보이지 않으므로 넣지 않는다(기업신용등급은 평가일자 · 결산일자 둘 다). 값이 비면 '-'.
         */
        details: readonly RatingGaugeDetail[]
        /**
         * 현금흐름등급 평가이력. date 는 결산일자(표 열 이름 '결산일자'), chartLabel 은 인쇄본 평가이력 그래프 아래 시점(예: 24.11월).
         * [프론트엔드 연동 · 정렬] 화면이 date 로 정렬해 그리므로(표는 최신순, 그래프는 시간순) 보내는 순서는 상관없다.
         */
        history: readonly {date: string; chartLabel: string; grade: string}[]
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
        /** 도넛 — 최근 연도 비중(%). color 는 도넛 조각 색(percentage-donut-colors.ts 의 고정 색 --raw-*, 비중 큰 순으로 진한 색). */
        share: readonly {id: string; label: string; percentage: number; color: string}[]
    }
    /** 신용/담보 비중(%) — 시점별 두 값과, 막대에 쓸 최근 값. */
    creditCollateral: {
        points: readonly {label: string; credit: number; collateral: number}[]
        current: {credit: number; collateral: number}
    }
    /** 담보 현황(백만원) — 도넛으로 그린다. color 는 share 와 같은 고정 색(--raw-*). */
    collaterals: readonly {id: string; label: string; amount: number; color: string}[]
    /** 담보 현황 기준 연도(예: 2024년) — 인쇄본 도넛 아래 '2024년 기준'. 기관별 비중 도넛은 institutions.years 의 마지막 연도를 쓴다. */
    collateralYear: string
}

// Tech-Index 탭 데이터 — 지수설명 · 표준분포 비교 · 기업 유형별 비교 · 4대 혁신역량 · 세부지표(점수 게이지는 techIndex 를 쓴다).
// 값의 범위는 0~100 점이다. isSubject 는 조회 기업(신청기업) 항목이다 — 막대 색을 달리한다.
type InnovationTechIndexScoreItem = {id: string; label: string; value: number; isSubject?: boolean}
type InnovationTechIndexCapability = {
    id: string
    /** 역량 이름(인프라 · 투입 · 활동 · 성과). */
    label: string
    /** 신청기업 점수 · 전체기업 점수(0~100). */
    score: number
    average: number
}

// Tech-Index 점수 구간 — 점수 게이지의 상태 이름 · 색과 요약 문장 끝말(진단브리핑)의 단일 소스. max 이하이면 그 구간이다(20.5 는 미흡).
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
    /** 혁신성장역량지수 부문별 지표 비교 — 지표 묶음마다 축(지표)별 신청기업 · 전체평균 점수. */
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
    /** 보고서 생성일자 — 진단브리핑 정부 R&D사업 접수현황의 '기준일자'로 보인다. */
    createdAt: string
    /** 조회일 전일자 — 현재 화면에 표시하지 않는다(필드만 유지). */
    lookupBaseDate: string
    /** 기업의 소분류(업종) 이름 — 구획 제목 옆 보조 문구. */
    subCategoryName: string
    company: {rows: readonly LabelValue[]}
    innovation: {
        /** 기업 보유기술 도넛. [프론트엔드 연동 · 정렬] 비중 큰 순으로 보낸다 — 12시부터 시계 방향, 첫 조각이 가장 진한 색. */
        technologies: readonly PercentageDonutItem[]
        /**
         * 관련 기업 · 특허 수치 4개. id 로 화면이 아이콘을 고른다(문서의 INNOVATION_STAT_ICONS).
         * [프론트엔드 연동] 실제 0건은 0, 값을 받지 못한 경우는 null 로 보낸다 — 화면이 '-'(단위 없음)로 구분해 적는다.
         */
        stats: readonly {id: InnovationStatId; label: string; value: number | null; unit: string}[]
        /** 평균 특허수 줄 — value 는 화면이 그대로 적는 글자(예: '1.6'). 값이 없으면 null(또는 빈 글자) — 화면이 '-' 로 적는다. */
        averages: readonly {label: string; value: string | null; unit: string}[]
        /**
         * R&D 이슈 키워드(워드클라우드 — 진단브리핑 R&D 이슈 카드 · 기술혁신정보 탭 맞춤형 기술정보-R&D 공용).
         * [프론트엔드 연동 · 정렬] 중요도(weight) 높은 순으로 보낸다 — 색이 목록 순서대로 칠해진다.
         * text 는 중복 없이, weight 는 양수. 개수 제한 없음 — 받은 키워드를 모두 그린다.
         */
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
        /** 지수의 바탕인 기술신용평가(TCB) 평가일자 — 게이지 아래에 '평가일자 · YYYY-MM-DD' 로 보인다. */
        evaluationDate: string
    }
    creditFinance: {
        /** 기업신용등급 — CRI 등급 코드와 날짜 목록. 등급명 · 게이지 채움 비율은 화면이 CRI 등급표(cri-grades)에서 찾는다. */
        rating: {grade: string; details: readonly RatingGaugeDetail[]}
        /**
         * 재무비율진단 — 항목마다 다섯 단계 중 하나(weak 취약 · poor 미흡 · normal 보통 · good 양호 · excellent 우수).
         * [프론트엔드 연동] 5항목 고정(매출액증가율 · 영업이익률 · 자기자본비율 · 총자본회전율 · 현금흐름 — 부문별 비교 축과 같다).
         * 인쇄본은 이 다섯 지표 이름을 고정 문구로 늘 그리고 label 로 값을 찾는다 — 없는 지표는 단계 칸에 '-'.
         */
        ratios: readonly RatingMatrixRow[]
        comparison: readonly {label: string; company: number; industry: number}[]
        years: readonly string[]
        /**
         * 최근 3개년 재무 현황 — values 는 years 와 같은 순서(백만원). 0 은 '0' 으로 적고, 값이 없으면(숫자 아님 · 연도 칸 없음) 화면이 '-' 로 적는다.
         * [프론트엔드 연동] 6항목 고정(총자산 · 자본총계 · 부채총계 · 매출액 · 영업이익 · 순이익). 인쇄본은 이 여섯 이름을
         * 고정 문구로 늘 그리고 label 로 값을 찾는다 — 없는 항목 · 없는 연도 값은 '-'.
         */
        statements: readonly {label: string; values: readonly number[]}[]
    }
    activity: {
        /** 분기별 종업원수(명) — 오래된 → 최신. label 은 '25.09월' 형식. */
        employees: readonly {label: string; value: number}[]
        /** 연도별 인당 매출액(천원) — 화면이 정수로 반올림해 적는다. label 은 '2024년' 형식. */
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
    /** 신용등급 평가일자(YYYY-MM-DD). */
    evaluationDate: string
}
type InnovationCompanyStatus = {
    overview: readonly LabelValue[]
    /**
     * 경영진 현황 — 목록 수는 기업마다 다르다(가변).
     * [프론트엔드 연동] 웹 보고서는 늘 5줄(앞에서부터 5건, 모자라면 '-' 줄 · 0건이면 빈 상태 — COMPANY_TABLE_ROWS),
     * 인쇄본은 쪽 높이에 맞춰 최대 10행을 그린다. 목록은 자르지 않고 그대로 보낸다.
     */
    executives: readonly {role: string; name: string; birthDate: string}[]
    /**
     * 주주 현황 — 지분율 높은 순으로 보낸다.
     * [프론트엔드 연동] 웹 보고서는 늘 5줄(앞에서부터 5건, 모자라면 '-' 줄 · 0건이면 빈 상태 — COMPANY_TABLE_ROWS),
     * 인쇄본은 쪽 높이에 맞춰 최대 10행을 그린다. 목록은 자르지 않고 그대로 보낸다.
     */
    shareholders: readonly {name: string; shares: number; ratio: number; relation: string}[]
    /**
     * 관계기업 현황. [프론트엔드 연동 · 최대 10건] 웹 보고서는 앞에서부터 10건만 그린다(11번째부터 안 보임).
     * 인쇄본(PDF 템플릿)은 기업현황 첫 쪽에 기본 3줄(모자라면 '-' 줄)을 그리고, 개요 글이 길면 1줄까지 줄인다
     * (k-bigx-print-report.ts 의 COMPANY_AFFILIATE_ROWS · getKbigxCompanyFirstPageLayout). 목록은 자르지 않고 그대로 보낸다.
     */
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
        /** 인당 매출액(천원) — 화면이 정수로 반올림해 적는다. */
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
        /**
         * 특허 보유현황.
         * [프론트엔드 연동 · 정렬] 출원일 최근순으로 보낸다 — 화면은 받은 순서대로 그린다.
         * [프론트엔드 연동 · 최대 10건] 화면이 앞에서부터 10건만 그린다(11번째부터 안 보임).
         */
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
        /** 기업수 · 특허수 비중 도넛. [프론트엔드 연동 · 정렬] 매출 규모 순(10억원 이하 → 300억원 초과)으로 보낸다 — 비중순이 아니다. */
        companyShare: readonly PercentageDonutItem[]
        patentShare: readonly PercentageDonutItem[]
    }
    /**
     * 경쟁기업 사업실적 — 막대(sales: 매출액, 백만원) + 선(growthRate: 화면에서는 '영업이익률(%)'로 표시 — 필드명과 다르다).
     * tone 이 조회기업 · 평균을 가른다. 화면은 받은 순서대로 그린다. growthRate 가 null 이면 그 점을 비우고 선도 끊는다.
     */
    competitors: readonly {
        id: string
        label: string
        sales: number
        growthRate: number | null
        tone?: 'subject' | 'average'
    }[]
    /**
     * 성장률 우수기업 — 매출 100억원 이하 · 초과 두 목록. 화면은 정렬하지 않고 받은 순서대로 그린다
     * (목업: 성장률 높은 순 10건 뒤에 평균 · 조회기업 줄).
     */
    growthLeaders: {
        small: {title: string; items: readonly InnovationRankItem[]}
        large: {title: string; items: readonly InnovationRankItem[]}
    }
    /**
     * 우수특허 — 피인용 횟수 · 지수.
     * [프론트엔드 연동 · 정렬] 화면이 피인용 지수 높은 순으로 정렬한다 — 보내는 순서는 상관없다.
     * [프론트엔드 연동 · 최대 10건 + 기타 = 최대 11줄] 전체를 그대로 보낸다 — 화면이 정렬 뒤 10건까지 두고 나머지를 11번째 줄
     * '기타' 하나로 합친다(피인용 횟수는 합, 나머지 칸은 '-').
     */
    excellentPatents: readonly (InnovationPatentRow & {citations: number; citationIndex: number})[]
    /**
     * 이머징 기술 — 기술분야별 등록건수 · 증가율 · 비중.
     * [프론트엔드 연동 · 최대 10건 + 기타 = 최대 11줄] 10건까지 보내고, 나머지는 '기타' 한 줄로 합쳐 11번째에 넣는다 —
     * 합치는 일은 API 쪽에서 한다(화면은 받은 줄을 그대로 그린다).
     * 기타 줄의 counts · share 는 합, growthRate 는 합친 등록건수로 다시 계산한 값을 넣는다(분야별 증가율을 더하거나 평균 내지 않는다).
     */
    emergingTech: {
        periods: readonly string[]
        rows: readonly {field: string; counts: readonly number[]; growthRate: number; share: number}[]
    }
    /**
     * R&D 전문기관 현황 — 정부출연연구소 · 산학협력단.
     * [프론트엔드 연동 · 최대 10건 + 기타 = 최대 11줄] rows 는 그대로 보낸다 — 화면이 쪽마다 10건까지 두고 나머지를 11번째 줄
     * '기타 연구소' · '기타 산학협력단' 하나로 합친다(특허보유수 · 비중 합).
     * total 은 합치기 전 전체 합계를 넣는다(화면이 그대로 마지막 줄에 적는다).
     */
    rndInstitutes: {
        government: {share: number; rows: readonly InnovationInstitute[]; total: {patentCount: number; ratio: number}}
        academia: {share: number; rows: readonly InnovationInstitute[]; total: {patentCount: number; ratio: number}}
    }
    /**
     * 정부 R&D 사업 현황 — 접수중과제(open) · 접수기간 도래 과제(upcoming).
     * [프론트엔드 연동 · 최대 10건] 화면이 표마다 앞에서부터 10건만 그린다(11번째부터 안 보임).
     */
    governmentRnd: {
        baseDate: string
        open: readonly InnovationRndProject[]
        upcoming: readonly InnovationRndProject[]
    }
}
type InnovationCertificationId = 'venture' | 'innobiz' | 'mainbiz' | 'research-lab'

// ── [퍼블리싱 전용] 목업(API 연결 시 삭제) ──
const MOCK_DELAY_MS = 300

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
        // [프론트엔드 연동 · 정렬] 비중 큰 순 — 12시부터 시계 방향으로 이어지고 첫 조각이 가장 진한 색(기획: 진한 색부터 시계 방향).
        technologies: [
            {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24},
            {id: 't2', label: '이동통신 서비스', percentage: 15, count: 7},
            {id: 't3', label: 'IoT 플랫폼', percentage: 11, count: 5},
            {id: 't4', label: '네트워크 보안', percentage: 8, count: 4},
            {id: 't5', label: '위성 통신', percentage: 6, count: 3},
            {id: 't6', label: '광통신 부품', percentage: 4, count: 2},
            {id: 't7', label: '전파 계측', percentage: 4, count: 2},
            {id: 't8', label: '기타', percentage: 2, count: 1},
        ].map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]})),
        stats: [
            {id: 'companies', label: '총 기업수', value: 83960, unit: '개'},
            {id: 'patents', label: '총 특허수', value: 135230, unit: '건'},
            {id: 'high-growth-companies', label: '고성장 기업수', value: 243, unit: '개'},
            {id: 'high-growth-patents', label: '고성장 기업 특허수', value: 582, unit: '건'},
        ],
        averages: [
            {label: '기업당 평균 특허수', value: '1.6', unit: '건'},
            {label: '고성장 기업당 평균 특허수', value: '2.4', unit: '건'},
            {label: '조회기업 특허수', value: '48', unit: '건'},
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
        rndNote: '* 상위 4개만 있으므로 상세 내용은 ‘기술혁신 > 정부 R&D 사업’ 페이지 참조 해주세요.',
    },
    techIndex: {
        score: 73.8,
        industryPercentile: 25,
        industryLabel: '그 외 기타 전자부품 제조업',
        scoreNote: '* 기술신용평가 이력이 없는 경우에는 산출 불가',
        // 기업신용등급 카드의 평가일자와 같은 날(같은 TCB 평가).
        evaluationDate: '2022-06-15',
    },
    creditFinance: {
        rating: {
            // 목업 CRI 코드 — '양호'로 표시된다(BBB+ · BBB0 · BBB- 중 가운데).
            grade: 'BBB0',
            details: [
                {label: '평가일자', value: '2022-06-15'},
                {label: '결산일자', value: '2024-08-04'},
            ],
        },
        ratios: [
            {id: 'sales-growth', label: '매출액증가율', rating: 'poor'},
            {id: 'operating-margin', label: '영업이익률', rating: 'normal'},
            {id: 'equity-ratio', label: '자기자본비율', rating: 'good'},
            {id: 'asset-turnover', label: '총자본회전율', rating: 'excellent'},
            {id: 'cash-flow', label: '현금흐름', rating: 'weak'},
        ],
        comparison: [
            {label: '매출액증가율', company: 80, industry: 60},
            {label: '영업이익률', company: 65, industry: 55},
            {label: '자기자본비율', company: 70, industry: 60},
            {label: '총자본회전율', company: 55, industry: 50},
            {label: '현금흐름', company: 60, industry: 45},
        ],
        years: ['2022년', '2023년', '2024년'],
        statements: [
            {label: '총자산', values: [12450, 13690, 15020]},
            {label: '자본총계', values: [7210, 8170, 9180]},
            {label: '부채총계', values: [5240, 5520, 5840]},
            {label: '매출액', values: [16330, 18120, 19870]},
            {label: '영업이익', values: [1280, 1450, 1530]},
            {label: '순이익', values: [820, 960, 1010]},
        ],
    },
    activity: {
        employees: [
            {label: '23.03월', value: 43},
            {label: '23.06월', value: 42},
            {label: '23.09월', value: 42},
            {label: '23.12월', value: 41},
            {label: '24.03월', value: 41},
            {label: '24.06월', value: 40},
            {label: '24.09월', value: 40},
            {label: '24.12월', value: 40},
            {label: '25.03월', value: 39},
            {label: '25.06월', value: 40},
            {label: '25.09월', value: 40},
        ],
        salesPerEmployee: [
            {label: '2022년', value: 388810},
            {label: '2023년', value: 441951},
            {label: '2024년', value: 496750},
        ],
    },
    techInnovation: {
        notice: '기술혁신정보는 국내 등록특허에 대한 AI 분석 결과에 기반하고 있습니다. 기술보증기금은 AI를 통해 귀사가 보유하고 있는 특허를 분석하여 ‘국가과학기술표준분류체계’에 따른 기술분야로 분류하고, 분류된 기술분야를 기준으로 다양한 기술혁신정보를 맞춤형으로 제공하고 있습니다. 기술혁신정보의 내용은 AI 기반으로 자동 생성된 것으로, AI 특성상 분석 결과 등에 일부 오류 또는 불완전한 정보가 포함될 수 있음을 유의하여 주시기 바랍니다.',
        holdings: {
            description:
                '기술 보유현황은 귀사의 특허(기술)를 AI로 분석하고, 분석결과에 따라 보유 기술을 국가과학기술표준분류체계(중분류, 세부분야)로 분류한 것입니다.',
            middleCategory: [
                {id: 'm1', label: '무선 통신·네트워크', percentage: 52, count: 25},
                {id: 'm2', label: '정보 보호', percentage: 15, count: 7},
                {id: 'm3', label: '컴퓨팅 시스템', percentage: 11, count: 5},
                {id: 'm4', label: '소프트웨어', percentage: 8, count: 4},
                {id: 'm5', label: '반도체 소자', percentage: 6, count: 3},
                {id: 'm6', label: '전자 부품', percentage: 4, count: 2},
                {id: 'm7', label: '광 · 전파', percentage: 2, count: 1},
                {id: 'm8', label: '기타', percentage: 2, count: 1},
            ].map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]})),
            smallCategory: [
                {id: 's1', label: '무선·이동통신 서비스', percentage: 50, count: 24},
                {id: 's2', label: '이동통신 네트워크', percentage: 15, count: 7},
                {id: 's3', label: 'IoT 플랫폼', percentage: 11, count: 5},
                {id: 's4', label: '네트워크 보안', percentage: 8, count: 4},
                {id: 's5', label: '위성 통신', percentage: 6, count: 3},
                {id: 's6', label: '광통신 부품', percentage: 4, count: 2},
                {id: 's7', label: '전파 계측', percentage: 4, count: 2},
                {id: 's8', label: '기타', percentage: 2, count: 1},
            ].map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]})),
            // [프론트엔드 연동 · 최대 10건] 특허 보유현황 — 목업은 최대치 10건(출원일 최근순).
            patents: [
                [
                    '무선 통신 시스템에서 데이터 및 제어 정보 송수신 방법',
                    '10-2023-0184164',
                    '10-2712345',
                    '한국기업(주)',
                    '무선·이동통신 서비스',
                ],
                [
                    // [퍼블리싱 확인용] 두 줄을 넘는 특허명 — 화면이 두 줄까지 보이고 말줄임(…) 한다(서버 처리 불필요).
                    '차세대 이동통신 네트워크 환경에서 인공지능 기반 트래픽 예측 모델을 이용하여 기지국 간 부하를 분산하고 전송 품질을 유지하는 트래픽 관리 시스템 및 방법',
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
                    '5G 무선통신 시스템에서 다중 입출력 안테나 배열과 빔포밍 가중치 갱신을 이용하여 셀 경계 단말의 데이터 전송률을 높이는 방법 및 그 장치',
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
            // [프론트엔드 연동 · 정렬] 두 도넛은 비중순이 아니라 매출 규모 순(10억원 이하 → 30억원 → 100억원 → 300억원 이하 → 300억원 초과)으로
            // 보낸다(기획: 금액순 배치). 색은 순서대로 진한 것부터 입힌다.
            companyShare: [
                {id: 'c1', label: '10억원 이하', percentage: 56, count: 13547},
                {id: 'c2', label: '30억원 이하', percentage: 24, count: 5678},
                {id: 'c3', label: '100억원 이하', percentage: 6, count: 1532},
                {id: 'c4', label: '300억원 이하', percentage: 11, count: 2657},
                {id: 'c5', label: '300억원 초과', percentage: 3, count: 800},
            ].map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]})),
            patentShare: [
                {id: 'p1', label: '10억원 이하', percentage: 14, count: 3547},
                {id: 'p2', label: '30억원 이하', percentage: 33, count: 8536},
                {id: 'p3', label: '100억원 이하', percentage: 11, count: 2987},
                {id: 'p4', label: '300억원 이하', percentage: 26, count: 6578},
                {id: 'p5', label: '300억원 초과', percentage: 16, count: 3957},
            ].map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]})),
        },
        competitors: [
            {id: 'c1', label: '(주)비상', sales: 32.8, growthRate: 2.3},
            {id: 'c2', label: '(주)이음', sales: 32.7, growthRate: -1.2},
            {id: 'c3', label: '(주)하늘', sales: 32.6, growthRate: 0.8},
            {id: 'c4', label: '(주)새론', sales: 32.5, growthRate: 7.4},
            {id: 'c5', label: '(주)드림', sales: 32.4, growthRate: 2.7},
            {id: 'subject', label: '조회기업', sales: 32.3, growthRate: 5.2, tone: 'subject'},
            {id: 'c6', label: '(주)아라', sales: 32.2, growthRate: 0.5},
            {id: 'c7', label: '(주)온새미로', sales: 32.1, growthRate: 3.6},
            {id: 'c8', label: '(주)누리', sales: 31.9, growthRate: 3.1},
            {id: 'c9', label: '(주)솔빛', sales: 31.5, growthRate: -2.3},
            {id: 'c10', label: '(주)바른', sales: 31.2, growthRate: -0.2},
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
        // [프론트엔드 연동 · 최대 10건 + 기타 = 최대 11줄] 우수특허 — 목업은 12건을 보내 화면이 10건 + '기타' 1줄로 합치는 최대치를 보여 준다.
        // [프론트엔드 연동 · 정렬] 화면이 피인용 지수 높은 순으로 정렬하므로 보내는 순서는 상관없다(목업도 섞어 둠).
        excellentPatents: [
            ['탈부착 가능한 턴시그널 램프 모듈', '10-2023-0184164', '10-2712345', '한국기업(주)', 6, 2.5],
            ['자율 주행 차량용 고성능 레이더 센서', '10-2023-0198745', '10-2712356', '스마트모빌리티(주)', 8, 3.1],
            ['무선 충전 지원 스마트폰 케이스', '10-2023-0201123', '10-2712399', '글로벌테크(주)', 4, 1.8],
            // [퍼블리싱 확인용] 두 줄을 넘는 특허명 — 화면이 두 줄까지 보이고 말줄임(…) 한다(서버 처리 불필요).
            [
                '식물성 원료를 이용한 친환경 생분해성 바이오 플라스틱 조성물과 그 제조공정 및 이를 적용한 일회용 포장재의 성형 방법',
                '10-2023-0210567',
                '10-2712408',
                '에코솔루션(주)',
                12,
                4.2,
            ],
            ['스마트 홈용 음성 인식 모듈', '10-2023-0223456', '10-2712450', '네오테크(주)', 7, 2.9],
            ['고효율 태양광 패널 접합 기술', '10-2023-0236789', '10-2712489', '그린에너지(주)', 9, 3.5],
            ['웨어러블 건강 모니터링 센서', '10-2024-0001234', '10-2712501', '헬스테크(주)', 5, 2.0],
            ['자동차용 내비게이션 소프트웨어', '10-2024-0012345', '10-2712550', '모빌리티소프트(주)', 11, 3.8],
            [
                '딥러닝 기반 객체 인식 모델을 이용하여 다중 카메라 영상에서 이상 행동을 실시간으로 탐지하고 관제 요원에게 알리는 인공지능 영상 분석 시스템',
                '10-2024-0023456',
                '10-2712600',
                '비전테크(주)',
                10,
                3.3,
            ],
            ['차세대 무선 통신 모듈 설계', '10-2024-0034567', '10-2712650', '텔레콤솔루션(주)', 6, 2.7],
            ['저전력 블루투스 센서 노드 설계', '10-2024-0045678', '10-2712700', '센서랩(주)', 3, 1.4],
            ['스마트 팩토리용 설비 예지보전 알고리즘', '10-2024-0056789', '10-2712750', '팩토리에이아이(주)', 2, 1.1],
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
        // [프론트엔드 연동 · 최대 10건 + 기타 = 최대 11줄] 이머징 기술 — API 가 '기타' 줄까지 만들어 보낸다. 목업은 최대치 11줄.
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
        // [프론트엔드 연동 · 최대 10건 + 기타 = 최대 11줄] R&D 전문기관 현황 — 목업은 쪽마다 12건을 보내 화면이 10건 + '기타 …' 1줄로
        // 합치는 최대치를 보여 준다.
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
                    {name: '한국기계연구원', patentCount: 300, ratio: 10.0},
                    {name: '한국화학연구원', patentCount: 220, ratio: 7.3},
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
                    {name: '부산대학교', patentCount: 150, ratio: 6.5},
                    {name: '경북대학교', patentCount: 130, ratio: 5.5},
                ],
                total: {patentCount: 2300, ratio: 100},
            },
        },
        governmentRnd: {
            baseDate: '2025-12-04',
            // [프론트엔드 연동 · 최대 10건] 접수중과제 · 접수기간 도래 과제 — 목업은 두 표 모두 최대치 10건.
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
                ['문화체육관광부', '문화콘텐츠 융복합 기술개발 지원사업', '한국콘텐츠진흥원', '윤지혜 (02-3456-7890)'],
                [
                    '해양수산부',
                    '해양 장비 국산화 기술개발 지원사업 공고',
                    '해양수산과학기술진흥원',
                    '강도현 (02-3460-4021)',
                ],
                [
                    '보건복지부',
                    '디지털 헬스케어 기기 개발 지원사업 공고',
                    '한국보건산업진흥원',
                    '서지연 (043-713-8456)',
                ],
                [
                    '국토교통부',
                    '건설 자동화 기술 개발사업 신규과제 모집',
                    '국토교통과학기술진흥원',
                    '임하늘 (031-389-6512)',
                ],
                [
                    '중소벤처기업부',
                    '창업성장기술개발사업 디딤돌 과제 공고',
                    '중소기업기술정보진흥원',
                    '오세훈 (042-388-0115)',
                ],
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
        // [프론트엔드 연동 · 정렬] 시간순(오래된 것부터) — 그래프 순서. 표는 화면이 최신순으로 정렬한다.
        // 마지막(가장 최근) 등급 = 현재 등급(creditFinance.rating.grade)과 같아야 한다 — 표는 이 줄을 빼고 그린다.
        ratingHistory: [
            {date: '2023-09-03', chartLabel: '23.09월', grade: 'A-'},
            {date: '2024-11-04', chartLabel: '24.11월', grade: 'BBB+'},
            {date: '2025-10-15', chartLabel: '25.10월', grade: 'BBB0'},
        ],
        cashFlow: {
            grade: 'CF6',
            details: [{label: '결산일자', value: '2024-08-04'}],
            // [프론트엔드 연동 · 정렬] 순서 상관없음 — 화면이 평가일자 최신순으로 정렬한다.
            history: [
                {date: '2024-11-04', chartLabel: '24.11월', grade: 'CF3'},
                {date: '2023-09-03', chartLabel: '23.09월', grade: 'CF4'},
                {date: '2022-09-03', chartLabel: '22.09월', grade: 'CF5'},
            ],
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
                // [케이스 확인용 값] 비공개 열람 케이스(?case=)에서 가림이 보이도록 넣은 행 — 연동 후 API 값으로 바뀐다.
                status: '정지',
                columns: ['발생일자', '종료일자', '취소일자'],
                rows: [['2023-03-15', '2023-09-15', '-']],
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
                // [케이스 확인용 값] 비공개 열람 케이스(?case=)에서 가림이 보이도록 넣은 행 — 연동 후 API 값으로 바뀐다.
                status: '등록',
                columns: ['등록정보', '등록사유', '발생일자', '해제일자', '연체금액', '등록기관'],
                rows: [['등록', '대금 미지급', '2024-02-10', '-', '3,500,000', '한국신용정보원']],
            },
            {
                id: 'public-arrears',
                title: '공공체납정보',
                // [케이스 확인용 값] 비공개 열람 케이스(?case=)에서 가림이 보이도록 넣은 행 — 연동 후 API 값으로 바뀐다.
                status: '등록',
                columns: ['등록정보', '등록사유', '발생일자', '해제일자', '연체금액', '등록기관'],
                rows: [['등록', '국세 체납', '2024-05-20', '-', '850,000', '국세청']],
            },
        ],
        ratioYears: ['2022년', '2023년', '2024년'],
        ratios: [
            {
                id: 'growth',
                title: '성장성',
                unit: '%',
                rows: [
                    {key: 'growth-0', label: '매출액증가율', values: [9.38, 10.96, 9.66], comparison: '보통'},
                    {key: 'growth-1', label: '총자산증가율', values: [11.16, 9.96, 9.72], comparison: '양호'},
                    {key: 'growth-2', label: '순이익증가율', values: [12.33, 17.07, 5.21], comparison: '취약'},
                    {key: 'growth-3', label: '영업이익증가율', values: [7.56, 13.28, 5.52], comparison: '취약'},
                ],
            },
            {
                id: 'profitability',
                title: '수익성',
                unit: '%',
                rows: [
                    {key: 'profitability-0', label: '영업이익률', values: [7.84, 8.0, 7.7], comparison: '보통'},
                    {key: 'profitability-1', label: '당기순이익률', values: [5.02, 5.3, 5.08], comparison: '양호'},
                    {
                        key: 'profitability-2',
                        label: '자기자본이익률',
                        values: [11.37, 11.75, 11.0],
                        comparison: '취약',
                    },
                    {
                        key: 'profitability-3',
                        label: '총자본영업이익률',
                        values: [10.28, 10.59, 10.19],
                        comparison: '취약',
                    },
                ],
            },
            {
                id: 'stability',
                title: '안정성',
                unit: '%, 배',
                rows: [
                    {key: 'stability-0', label: '자기자본비율', values: [57.91, 59.68, 61.12], comparison: '취약'},
                    {key: 'stability-1', label: '부채비율', values: [72.68, 67.56, 63.62], comparison: '보통'},
                    {key: 'stability-2', label: '이자보상비율 (배)', values: [8.0, 8.53, 8.5], comparison: '양호'},
                    {key: 'stability-3', label: '차입금의존도', values: [25.7, 24.47, 23.44], comparison: '취약'},
                ],
            },
            {
                id: 'activity',
                title: '활동성',
                unit: '회',
                rows: [
                    {key: 'activity-0', label: '총자본회전율', values: [1.31, 1.32, 1.32], comparison: '취약'},
                    {key: 'activity-1', label: '매출채권회전율', values: [5.1, 5.21, 5.33], comparison: '보통'},
                    {key: 'activity-2', label: '재고자산회전율', values: [11.26, 11.92, 12.34], comparison: '양호'},
                    {key: 'activity-3', label: '순운전자본회전율', values: [6.05, 6.25, 6.31], comparison: '취약'},
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
                        {
                            key: 'short-loan',
                            label: '단기차입금',
                            cells: [
                                {amount: 1200, ratio: 37.5},
                                {amount: 1250, ratio: 37.31},
                                {amount: 1320, ratio: 37.5},
                            ],
                        },
                        {key: 'current-long', label: '유동성장기부채', cells: [null, null, null]},
                        {key: 'short-bond', label: '단기사채', cells: [null, null, null]},
                        {key: 'securitized', label: '유동화채무', cells: [null, null, null]},
                    ],
                    subtotal: {
                        key: 'short-subtotal',
                        label: '소계',
                        cells: [
                            {amount: 1200, ratio: 37.5},
                            {amount: 1250, ratio: 37.31},
                            {amount: 1320, ratio: 37.5},
                        ],
                    },
                },
                {
                    key: 'long',
                    label: '장기',
                    rows: [
                        {
                            key: 'long-loan',
                            label: '장기차입금',
                            cells: [
                                {amount: 2000, ratio: 62.5},
                                {amount: 2100, ratio: 62.69},
                                {amount: 2200, ratio: 62.5},
                            ],
                        },
                        {key: 'long-bond', label: '장기사채', cells: [null, null, null]},
                    ],
                    subtotal: {
                        key: 'long-subtotal',
                        label: '소계',
                        cells: [
                            {amount: 2000, ratio: 62.5},
                            {amount: 2100, ratio: 62.69},
                            {amount: 2200, ratio: 62.5},
                        ],
                    },
                },
            ],
            total: {
                key: 'total',
                label: '차입금 합계',
                cells: [
                    {amount: 3200, ratio: 100.0},
                    {amount: 3350, ratio: 100.0},
                    {amount: 3520, ratio: 100.0},
                ],
            },
        },
        borrowingChanges: {
            years: ['2022년', '2023년', '2024년'],
            rows: [
                {key: 'amount', label: '차입금(백만원)', values: [3200, 3350, 3520]},
                {key: 'to-sales', label: '차입금/매출액(%)', values: [19.6, 18.49, 17.72]},
                {key: 'repayment', label: '차입금상환계수', values: [0.48, 0.64, 0.56]},
                {key: 'change', label: '총차입금변동률(%)', values: [4.92, 4.69, 5.07]},
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
                {id: 'bank', label: '은행업권', percentage: 76, color: 'var(--ds-donut-2)'},
                {id: 'mutual', label: '상호금융업권', percentage: 18.4, color: 'var(--ds-donut-4)'},
                {id: 'card', label: '카드/캐피탈업권', percentage: 5.6, color: 'var(--ds-donut-6)'},
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
            {id: 'real-estate', label: '부동산', amount: 2000, color: 'var(--ds-donut-2)'},
            {id: 'special-mortgage', label: '특수저당', amount: 3862, color: 'var(--ds-donut-4)'},
            {id: 'guarantee', label: '보증', amount: 2850, color: 'var(--ds-donut-6)'},
        ],
        collateralYear: '2024년',
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
                title: '인프라·투입 부문',
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
                title: '활동·성과 부문',
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
            {
                year: '2022년',
                employees: 42,
                change: 1,
                changeRate: 2.44,
                hires: 5,
                leavers: 4,
                salesPerEmployee: 388810,
            },
            {
                year: '2023년',
                employees: 41,
                change: -1,
                changeRate: -2.38,
                hires: 3,
                leavers: 4,
                salesPerEmployee: 441951,
            },
            {
                year: '2024년',
                employees: 40,
                change: -1,
                changeRate: -2.44,
                hires: 3,
                leavers: 4,
                salesPerEmployee: 496750,
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
            {label: '종업원수', value: '40명'},
            {label: '기업유형/형태', value: '유가증권시장/법인기업'},
            {label: '기업규모', value: '중소기업'},
            {label: '주소', value: '(48400) 부산광역시 남구 문현금융로 33'},
            {label: '표준산업분류', value: '(C26299) 그 외 기타 전자부품 제조업'},
            {label: '대표기술분야', value: '무선·이동통신 서비스'},
            {label: '주요제품', value: '5G통신 및 IoT 관련 서비스'},
        ],
        // 경영진 현황 — 목업은 4건. 실제 연동 시 웹 5줄 · 인쇄본 최대 10행(타입 주석 참고).
        executives: [
            {role: '대표이사', name: '홍길동', birthDate: '71.02.03'},
            {role: '사내이사', name: '김이사', birthDate: '74.05.12'},
            {role: '감사', name: '이감사', birthDate: '69.11.28'},
            {role: '사외이사', name: '박이사', birthDate: '77.08.09'},
        ],
        // 주주 현황 — 목업은 컨펌 화면이 깔끔하게 보이도록 4건만 둔다. 실제 연동 시 웹 5줄 · 인쇄본 최대 10행(타입 주석 참고).
        shareholders: [
            {name: '홍길동', shares: 10000, ratio: 25, relation: '본인'},
            {name: '김이사', shares: 6000, ratio: 15, relation: '가족'},
            {name: '이감사', shares: 4800, ratio: 12, relation: '친척'},
            {name: '박이사', shares: 4000, ratio: 10, relation: '타인'},
        ],
        // [프론트엔드 연동 · 최대 10건] 기획: 관계기업 현황 목록은 10개까지만 보인다 — 화면이 앞에서부터 10건만 그린다(COMPANY_LIST_LIMIT).
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
            {
                name: '(주)네오로직스',
                ceo: '최준호',
                industry: '소프트웨어 개발',
                fiscalYear: '2024',
                totalAssets: 5420,
                sales: 310,
            },
            {
                name: '(주)한빛물류',
                ceo: '정은지',
                industry: '운수 및 창고업',
                fiscalYear: '2023',
                totalAssets: 12300,
                sales: 640,
            },
            {
                name: '(주)블루오션',
                ceo: '강민수',
                industry: '해양 장비 제조업',
                fiscalYear: '2024',
                totalAssets: 9870,
                sales: 295,
            },
            {
                name: '(주)스마트팜',
                ceo: '조하늘',
                industry: '농업 기술 서비스',
                fiscalYear: '2023',
                totalAssets: 4310,
                sales: 150,
            },
            {
                name: '(주)바이오셀',
                ceo: '윤서연',
                industry: '생명공학 연구',
                fiscalYear: '2024',
                totalAssets: 15600,
                sales: 420,
            },
            {
                name: '(주)미래건설',
                ceo: '임도현',
                industry: '종합 건설업',
                fiscalYear: '2024',
                totalAssets: 22100,
                sales: 980,
            },
            {
                name: '(주)퍼스트모빌리티',
                ceo: '한지우',
                industry: '자동차 부품 제조업',
                fiscalYear: '2023',
                totalAssets: 8750,
                sales: 365,
            },
        ],
        intellectualProperty: [
            {id: 'patent', label: '특허', count: 48},
            {id: 'utility-model', label: '실용신안', count: 6},
            {id: 'design', label: '디자인', count: 9},
            {id: 'trademark', label: '상표권', count: 14},
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
                {key: 'total-assets', label: '총자산', values: [12450, 13690, 15020]},
                {key: 'liabilities', label: '부채총계', values: [5240, 5520, 5840]},
                {key: 'equity', label: '자본총계', values: [7210, 8170, 9180]},
            ],
            income: [
                {key: 'sales', label: '매출액', values: [16330, 18120, 19870]},
                {key: 'operating-profit', label: '영업이익', values: [1280, 1450, 1530]},
                {key: 'net-income', label: '당기순이익', values: [820, 960, 1010]},
            ],
            ratios: [
                {key: 'operating-margin', label: '영업이익률', values: [7.84, 8.0, 7.7]},
                {key: 'debt-ratio', label: '부채비율', values: [72.68, 67.56, 63.62]},
                {key: 'receivables-turnover', label: '매출채권회전율', values: [5.1, 5.21, 5.33]},
                {key: 'sales-growth', label: '매출액증가율', values: [9.38, 10.96, 9.66]},
                {key: 'asset-growth', label: '총자산증가율', values: [11.16, 9.96, 9.72]},
            ],
            cashFlows: [
                {key: 'operating', label: '영업활동후 현금흐름', values: [1520, 2130, 1980]},
                {key: 'financing', label: '재무활동후 현금흐름', values: [-420, 860, -310]},
                {key: 'investing', label: '투자활동후 현금흐름', values: [-980, -1640, -1120]},
                {key: 'net-change', label: '순현금변화', values: [120, 1350, 550]},
                {key: 'cash-vs-income', label: '영업활동 현금흐름과 순이익 차이', values: [700, 1170, 970]},
            ],
        },
        customers: [
            {name: '○○기업(주)', shares: [55.11, 56.12, 56.12], grade: 'BBB+', evaluationDate: '2024-01-02'},
            {name: '△△테크(주)', shares: [52.34, 53.45, 53.45], grade: 'A0', evaluationDate: '2023-01-02'},
            {name: '◇◇솔루션', shares: [58.22, 59.33, 59.33], grade: 'BBB0', evaluationDate: '2025-01-02'},
            {name: '□□산업(주)', shares: [41.05, 43.2, 44.9], grade: 'B-', evaluationDate: '2025-01-02'},
            {name: '☆☆네트웍스', shares: [12.4, 11.87, 10.02], grade: 'CCC0', evaluationDate: '2025-01-02'},
            {name: '▽▽전자(주)', shares: [9.85, 9.4, 9.12], grade: 'BB+', evaluationDate: '2024-06-10'},
            {name: '◎◎시스템', shares: [8.3, 8.95, 8.47], grade: 'BBB-', evaluationDate: '2024-09-02'},
            {name: '◁◁정밀(주)', shares: [6.72, 6.1, 6.85], grade: 'BB0', evaluationDate: '2025-01-02'},
            {name: '▷▷에너지', shares: [5.4, 5.88, 5.21], grade: 'A-', evaluationDate: '2024-03-15'},
            {name: '◆◆물산(주)', shares: [3.15, 3.62, 3.94], grade: 'B+', evaluationDate: '2025-01-02'},
        ],
        suppliers: [
            {name: '○○부품(주)', shares: [35.11, 36.12, 36.12], grade: 'BBB+', evaluationDate: '2024-01-02'},
            {name: '△△소재(주)', shares: [22.34, 23.45, 26.12], grade: 'A0', evaluationDate: '2023-01-02'},
            {name: '◇◇전자', shares: [18.22, 19.33, 16.12], grade: 'BBB0', evaluationDate: '2025-01-02'},
            {name: '□□물산', shares: [9.4, 8.7, 8.1], grade: 'B-', evaluationDate: '2025-01-02'},
            {name: '☆☆로지스', shares: [5.02, 4.8, 4.35], grade: '', evaluationDate: '2025-01-02'},
            {name: '▽▽케미칼', shares: [3.88, 3.65, 3.92], grade: 'BB+', evaluationDate: '2024-06-10'},
            {name: '◎◎금속(주)', shares: [3.2, 3.41, 3.18], grade: 'BBB-', evaluationDate: '2024-09-02'},
            {name: '◁◁기계', shares: [2.75, 2.9, 3.04], grade: 'BB0', evaluationDate: '2025-01-02'},
            {name: '▷▷포장(주)', shares: [2.1, 2.32, 2.27], grade: 'A-', evaluationDate: '2024-03-15'},
            {name: '◆◆상사', shares: [1.45, 1.38, 1.52], grade: '', evaluationDate: '2025-01-02'},
        ],
    },
}

// 기준년도 — 늘 3개년. 받은 연도 중 가장 최근 연도에서 거슬러 3개년(받은 연도가 없으면 fallbackYears 의 마지막 3개).
// 인적자원 현황 · 에너지 사용 현황이 쓴다 — 받지 못한 연도는 화면 · 인쇄본이 값을 '-' 로 적는다.
// [프론트엔드 연동] 연도는 '2024년' 처럼 숫자 + '년' 으로 보낸다.
const RECENT_YEAR_COUNT = 3
// 연도 글자의 숫자 — '2024년' · '2024' 모두 2024. 같은 연도인지 견줄 때 쓴다.
const yearNumber = (year: string) => Number.parseInt(year, 10)
const isSameYear = (a: string, b: string) => yearNumber(a) === yearNumber(b)
const getRecentYears = (years: readonly string[], fallbackYears: readonly string[] = []): string[] => {
    const latest = Math.max(...years.map(yearNumber).filter(Number.isFinite))
    return Number.isFinite(latest)
        ? Array.from({length: RECENT_YEAR_COUNT}, (_, index) => `${latest - (RECENT_YEAR_COUNT - 1 - index)}년`)
        : fallbackYears.slice(-RECENT_YEAR_COUNT)
}

// 인적자원 현황 — 기준년도 3개년 줄. 받지 못한 연도는 row 가 null 이다.
type HumanResourceRow = InnovationActivityDetail['humanResources'][number]
const getHumanResourceYearRows = (
    rows: readonly HumanResourceRow[],
    fallbackYears: readonly string[],
): {year: string; row: HumanResourceRow | null}[] =>
    getRecentYears(
        rows.map((row) => row.year),
        fallbackYears,
    ).map((year) => ({year, row: rows.find((row) => isSameYear(row.year, year)) ?? null}))

// 재무비율 묶음 — 묶음 4개 · 묶음마다 지표 4개 고정(웹 보고서 · PDF 템플릿 공용). 받은 데이터는 묶음 id · 지표 label 로 찾아 넣고,
// 없는 지표 · 값 · 업종평균 대비는 '-'. 연도는 늘 최근 3개년(getRecentYears). 단위는 받은 unit 이 없을 때만 spec.unit.
// [프론트엔드 연동] 묶음 id 와 지표 label 은 아래 문자열과 정확히 같게 보낸다(다르면 그 줄이 '-').
type RatioGroupSpec = {id: string; title: string; unit: string; labels: readonly string[]}
const RATIO_GROUP_SPECS: readonly RatioGroupSpec[] = [
    {
        id: 'growth',
        title: '성장성',
        unit: '%',
        labels: ['매출액증가율', '총자산증가율', '순이익증가율', '영업이익증가율'],
    },
    {
        id: 'profitability',
        title: '수익성',
        unit: '%',
        labels: ['영업이익률', '당기순이익률', '자기자본이익률', '총자본영업이익률'],
    },
    {
        id: 'stability',
        title: '안정성',
        unit: '%, 배',
        labels: ['자기자본비율', '부채비율', '이자보상비율 (배)', '차입금의존도'],
    },
    {
        id: 'activity',
        title: '활동성',
        unit: '회',
        labels: ['총자본회전율', '매출채권회전율', '재고자산회전율', '순운전자본회전율'],
    },
]
// 차입금 변동현황 줄 — 4줄 고정(웹 · PDF 공용). 받은 줄을 label 로 찾으므로 API 도 이 문자열 그대로 보낸다. 없는 줄 · 연도는 '-'.
const BORROWING_CHANGE_LABELS = ['차입금(백만원)', '차입금/매출액(%)', '차입금상환계수', '총차입금변동률(%)'] as const
// 기관별 비중 표 줄 — 업권 5개 고정(웹 · PDF 공용). 받은 줄을 label 로 찾으므로 API 도 이 문자열 그대로 보낸다. 없는 업권 · 연도는 '-'.
const INSTITUTION_LABELS = ['은행업권', '상호금융업권', '저축은행업권', '카드/캐피탈업권', '대부업권'] as const
// 담보 현황 종류 — 3개 고정(웹 · PDF 공용). 받은 값을 label 로 찾으므로 API 도 이 문자열 그대로 보낸다. 없는 종류는 범례에 '-'.
const COLLATERAL_LABELS = ['부동산', '특수저당', '보증'] as const
// 차입금 현황 줄 — 묶음 · 항목 고정(웹 · PDF 공용). 받은 묶음은 key, 항목은 label 로 찾아 넣고, 없는 묶음 · 항목 · 칸은 '-'.
// [프론트엔드 연동] 묶음 key 와 항목 label 은 아래 문자열과 정확히 같게 보낸다(다르면 그 줄이 '-').
const BORROWING_GROUP_SPECS = [
    {key: 'short', label: '단기', rows: ['단기차입금', '유동성장기부채', '단기사채', '유동화채무']},
    {key: 'long', label: '장기', rows: ['장기차입금', '장기사채']},
] as const
const BORROWING_SUBTOTAL_LABEL = '소계'
const BORROWING_TOTAL_LABEL = '차입금 합계'
// 받은 차입금 현황을 고정 묶음 · 항목 줄로 다시 맞춘다 — 받지 못한 줄은 칸 없이(cells: []) 두어 화면이 '-' 로 적는다.
const toFixedBorrowings = (borrowings: InnovationCreditDetail['borrowings']): InnovationCreditDetail['borrowings'] => ({
    ...borrowings,
    groups: BORROWING_GROUP_SPECS.map((spec) => {
        const group = borrowings.groups.find((item) => item.key === spec.key)
        return {
            key: spec.key,
            label: spec.label,
            rows: spec.rows.map(
                (label, index) =>
                    group?.rows.find((row) => row.label === label) ?? {key: `${spec.key}-${index}`, label, cells: []},
            ),
            subtotal: group?.subtotal ?? {key: `${spec.key}-subtotal`, label: BORROWING_SUBTOTAL_LABEL, cells: []},
        }
    }),
    total: {...borrowings.total, label: borrowings.total.label || BORROWING_TOTAL_LABEL},
})
// 연도별 값 찾기 — years(최근 3개년) 순서로 받은 값(receivedYears 순서)을 다시 맞춘다. 받지 못한 연도 · 숫자 아님은 undefined.
const pickYearValue = (
    values: readonly (number | null | undefined)[] | undefined,
    receivedYears: readonly string[],
    year: string,
): number | undefined => {
    const index = receivedYears.findIndex((received) => isSameYear(received, year))
    const value = index < 0 ? undefined : values?.[index]
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

// 에너지 사용량 구분 — 표는 늘 본사 · 공장 · 기타 세 줄(+ 합계)이다. 웹 보고서 · PDF 템플릿 공용.
// [프론트엔드 연동] 구분 이름(label)은 정확히 '본사' · '공장' · '기타' 로 보낸다. 다른 이름의 줄은 그리지 않는다.
const ENERGY_CATEGORIES = ['본사', '공장', '기타'] as const
// 받은 에너지 줄을 본사 · 공장 · 기타 순으로 골라 values 를 years(최근 3개년) 순서로 다시 맞춘다 — 받지 못한 연도 · 값은 NaN.
// 받지 않은 구분은 결과에 없다(그래프 계열 · 범례에서 빠지고, 표는 ENERGY_CATEGORIES 로 '-' 줄을 채운다).
const toEnergyYearRows = (
    rows: readonly InnovationEnergyRow[],
    receivedYears: readonly string[],
    years: readonly string[],
): InnovationEnergyRow[] =>
    ENERGY_CATEGORIES.flatMap((category) => rows.filter((row) => row.label === category)).map((row) => ({
        ...row,
        values: years.map((year) => {
            const index = receivedYears.findIndex((received) => isSameYear(received, year))
            return index < 0 ? Number.NaN : (row.values[index] ?? Number.NaN)
        }),
    }))

// 우수특허 표 줄 — 웹 보고서 · PDF 템플릿 공용. 피인용 지수 높은 순으로 limit 건 + 나머지는 '기타' 줄 하나(피인용 횟수 합).
// 정렬은 화면이 한다(받은 순서와 무관). 피인용 지수가 숫자가 아니면(값 없음) 맨 뒤로,
// '기타' 합은 숫자인 값만 더한다(하나도 없으면 NaN → 칸에 '-').
const citationRank = (value: number) => (Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY)
const toExcellentPatentRows = (patents: InnovationTechDetail['excellentPatents'], limit: number) => {
    const sorted = [...patents].sort((a, b) => citationRank(b.citationIndex) - citationRank(a.citationIndex) || 0)
    const rest = sorted.slice(limit)
    const restCitations = rest.map((patent) => patent.citations).filter(Number.isFinite)
    return {
        patents: sorted.slice(0, limit),
        /** '기타' 줄 피인용 횟수 합. limit 건을 넘을 때만 값이 있고, 넘지 않으면 null(기타 줄 없음). */
        otherCitations: rest.length
            ? restCitations.length
                ? restCitations.reduce((sum, value) => sum + value, 0)
                : Number.NaN
            : null,
    }
}

// 4대 혁신역량 — 받은 역량이 없어도 네 카드는 늘 이 순서 · 이름으로 그린다.
// [프론트엔드 연동] capabilities 의 id 는 infra · input · activity · output 으로 보낸다. 다른 id 의 역량은 그리지 않는다.
const TECH_INDEX_CAPABILITIES = [
    {id: 'infra', label: '인프라'},
    {id: 'input', label: '투입'},
    {id: 'activity', label: '활동'},
    {id: 'output', label: '성과'},
] as const

// 혁신성장역량지수 부문별 지표 비교 카드 제목 — 받은 지표가 없어도 두 카드는 늘 이 제목으로 그린다.
// [프론트엔드 연동] indicators 의 title 은 정확히 '인프라·투입 부문' · '활동·성과 부문' 으로 보낸다. 다른 제목의 묶음은 그리지 않는다.
const TECH_INDEX_INDICATOR_TITLES = ['인프라·투입 부문', '활동·성과 부문'] as const
// Tech-Index 표준정보 비교 — 분포 평균 · 표준편차를 받지 못해도 곡선 모양은 남긴다(웹 보고서 · PDF 템플릿 공용).
// 그때만 쓰는 모양용 값(점수 0~100 가운데 종 모양) — 화면에 숫자로 보이지 않는다(전체 평균은 '-').
const TECH_INDEX_FALLBACK_STANDARD = {mean: 50, standardDeviation: 15} as const

// [퍼블리싱 전용] 보고서 조회(목업) — 목업 한 건을 돌려주고, 이력 카드의 id 면 그 카드 값으로 바꾼다(withMockHistoryCard).
// [프론트엔드 연동] reportId 로 보고서를 조회하는 API 로 바꾼다. 없는 보고서면 null 을 돌려주면 화면이 404(notFound)로 넘긴다.
//   받는 동안은 라우트의 loading.tsx(InnovationGrowthReportDocumentSkeleton)가 같은 틀을 보여 준다 — MOCK_DELAY_MS 로 미리 볼 수 있다.
const getInnovationGrowthReport = async (reportId?: string): Promise<InnovationGrowthReport | null> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
    // 목업: 빈 id(?reportId=)만 없는 보고서로 본다 — 404 흐름을 미리 확인하는 용도.
    if (reportId === '') return null
    const historyCard = await findMockHistoryCard(reportId)
    return historyCard ? withMockHistoryCard(MOCK_INNOVATION_GROWTH_REPORT, historyCard) : MOCK_INNOVATION_GROWTH_REPORT
}

// [퍼블리싱 확인용] 주소의 ?case= 로 열람 케이스를 덮어써 본다. 값이 케이스가 아니면 받은 그대로 둔다. 연동 후 이 함수와 호출을 지운다.
const withPreviewCase = (report: InnovationGrowthReport, previewCase: unknown): InnovationGrowthReport =>
    isInnovationReportCase(previewCase)
        ? withPreviewCaseSample(redactForViewerCase({...report, viewerCase: previewCase}))
        : report

// [퍼블리싱 확인용] ?empty=<모드> 로 데이터를 비우거나(빈 값) · 길게(긴 글) · 섞어(여러 경우) 본다 — 모든 탭 · 장 공용 진입점.
// 모드별 동작은 아래 withPreview* 함수 · 위 INNOVATION_REPORT_EMPTY_* 상수 주석을 본다. 표 줄 이름 · 부처명 같은 틀은 두고 값만
// 바꾼다 — 실제 API 가 보내는 모양을 흉내 낸다. 연동 후 이 함수와 호출을 지운다.
const withPreviewEmpty = (report: InnovationGrowthReport, emptyParam: unknown): InnovationGrowthReport => {
    if (emptyParam === INNOVATION_REPORT_EMPTY_BRIEFING_PARTIAL) return withPreviewPartialBriefing(report)
    if (emptyParam === INNOVATION_REPORT_EMPTY_COMPANY) return withPreviewEmptyCompany(report)
    if (emptyParam === INNOVATION_REPORT_EMPTY_COMPANY_PARTIAL) return withPreviewPartialCompany(report)
    if (emptyParam === INNOVATION_REPORT_COMPANY_OVERVIEW_LONG) return withPreviewCompanyOverview(report, 'long')
    if (emptyParam === INNOVATION_REPORT_COMPANY_OVERVIEW_SHORT) return withPreviewCompanyOverview(report, 'short')
    if (emptyParam === INNOVATION_REPORT_COMPANY_EDGE) return withPreviewCompanyEdge(report, 'long')
    if (emptyParam === INNOVATION_REPORT_COMPANY_EDGE_SHORT) return withPreviewCompanyEdge(report, 'short')
    if (emptyParam === INNOVATION_REPORT_COMPANY_AFFILIATES_MANY) return withPreviewManyAffiliates(report)
    if (emptyParam === INNOVATION_REPORT_COMPANY_LONG_TEXT) return withPreviewCompanyLongText(report)
    if (emptyParam === INNOVATION_REPORT_COMPANY_MIXED) return withPreviewCompanyMixed(report)
    if (emptyParam === INNOVATION_REPORT_TECH_LONG_TEXT) return withPreviewTechLongText(report)
    if (emptyParam === INNOVATION_REPORT_EMPTY_TECH) return withPreviewEmptyTech(report)
    if (emptyParam === INNOVATION_REPORT_TECH_MIXED) return withPreviewTechMixed(report)
    if (emptyParam === INNOVATION_REPORT_TECH_MIXED_2) return withPreviewTechMixed2(report)
    if (emptyParam === INNOVATION_REPORT_BRIEFING_LONG_TEXT) return withPreviewBriefingLongText(report)
    if (emptyParam === INNOVATION_REPORT_BRIEFING_MIXED) return withPreviewBriefingMixed(report)
    if (emptyParam === INNOVATION_REPORT_HEADER_MIXED || emptyParam === INNOVATION_REPORT_HEADER_MIXED_2) {
        const isFirst = emptyParam === INNOVATION_REPORT_HEADER_MIXED
        const representative = isFirst ? '' : '김철수, 이영희(공동대표)'
        return {
            ...report,
            title: isFirst
                ? '인공지능 기반 의료 영상 분석 및 실시간 원격 판독 지원을 위한 차세대 멀티모달 진단 보조 시스템과 클라우드 연동 플랫폼'
                : 'AI 영상 분석',
            companyName: isFirst
                ? '(주)에이아이'
                : '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스',
            issuedAt: isFirst ? report.issuedAt : '',
            company: {
                rows: report.company.rows.map((row) =>
                    row.label === '대표자' ? {...row, value: representative} : row,
                ),
            },
        }
    }
    if (emptyParam === INNOVATION_REPORT_HEADER_LONG_TEXT) {
        return {
            ...report,
            title: '인공지능 기반 의료 영상 분석 및 실시간 원격 판독 지원을 위한 차세대 멀티모달 진단 보조 시스템과 클라우드 연동 플랫폼',
            companyName: '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스',
            company: {
                rows: report.company.rows.map((row) =>
                    row.label === '대표자'
                        ? {...row, value: '남궁독고선우황보제갈, 알렉산더 크리스토퍼 김(공동대표)'}
                        : row,
                ),
            },
        }
    }
    if (emptyParam === INNOVATION_REPORT_EMPTY_HEADER) {
        return {
            ...report,
            title: '',
            companyName: '',
            issuedAt: '',
            // 표지의 대표자는 기업 정보 표의 '대표자' 줄에서 가져온다.
            company: {rows: report.company.rows.map((row) => (row.label === '대표자' ? {...row, value: ''} : row))},
        }
    }
    if (emptyParam === INNOVATION_REPORT_EMPTY_TECH_INDEX) return withPreviewEmptyTechIndex(report)
    if (emptyParam === INNOVATION_REPORT_TECH_INDEX_MIXED) return withPreviewTechIndexMixed(report)
    if (emptyParam === INNOVATION_REPORT_TECH_INDEX_LONG_TEXT) {
        const longName = '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스'
        const standard = report.techIndexDetail.standard
        return {
            ...report,
            companyName: longName,
            techIndexDetail: {
                ...report.techIndexDetail,
                standard: {
                    ...standard,
                    // 요약 문장 첫 조각의 기업명도 같은 이름으로 바꾼다(PDF 템플릿은 문장 속 기업명만 말줄임한다).
                    summary: standard.summary.map((part) => ({
                        ...part,
                        text: part.text.replace(report.companyName, longName),
                    })),
                },
            },
        }
    }
    if (emptyParam === INNOVATION_REPORT_COMPANY_ONE_EACH) {
        const status = report.companyStatus
        return {
            ...report,
            companyStatus: {
                ...status,
                executives: status.executives.slice(0, 1),
                shareholders: status.shareholders.slice(0, 1),
                affiliates: status.affiliates.slice(0, 1),
            },
        }
    }
    if (emptyParam === INNOVATION_REPORT_COMPANY_AFFILIATES_ONE) {
        return {
            ...report,
            companyStatus: {...report.companyStatus, affiliates: report.companyStatus.affiliates.slice(0, 1)},
        }
    }
    if (emptyParam === INNOVATION_REPORT_EMPTY_ACTIVITY) return withPreviewEmptyActivity(report)
    if (emptyParam === INNOVATION_REPORT_EMPTY_ACTIVITY_PARTIAL) return withPreviewPartialActivity(report)
    if (emptyParam === INNOVATION_REPORT_ACTIVITY_LONG_TEXT) return withPreviewActivityLongText(report)
    if (emptyParam === INNOVATION_REPORT_ACTIVITY_MIXED) return withPreviewActivityMixed(report)
    if (emptyParam === INNOVATION_REPORT_ACTIVITY_CHANGE) return withPreviewActivityChange(report)
    if (emptyParam === INNOVATION_REPORT_EMPTY_CREDIT) return withPreviewEmptyCredit(report)
    if (emptyParam === INNOVATION_REPORT_EMPTY_CREDIT_PARTIAL) return withPreviewPartialCredit(report)
    if (emptyParam === INNOVATION_REPORT_CREDIT_LONG_TEXT) return withPreviewCreditLongText(report)
    if (emptyParam === INNOVATION_REPORT_CREDIT_INFO_LONG_TEXT) return withPreviewCreditInfoLongText(report)
    if (emptyParam === INNOVATION_REPORT_CREDIT_MIXED) return withPreviewCreditMixed(report)
    if (emptyParam !== INNOVATION_REPORT_EMPTY_BRIEFING) return report
    const clearDetails = (details: readonly RatingGaugeDetail[]) => details.map((detail) => ({...detail, value: ''}))
    return {
        ...report,
        createdAt: '',
        subCategoryName: '',
        company: {rows: report.company.rows.map((row) => ({...row, value: ''}))},
        innovation: {
            ...report.innovation,
            technologies: [],
            stats: report.innovation.stats.map((stat) => ({...stat, value: null})),
            averages: report.innovation.averages.map((row) => ({...row, value: null})),
            issues: [],
            rnd: [],
        },
        techIndex: {
            ...report.techIndex,
            score: Number.NaN,
            industryPercentile: Number.NaN,
            industryLabel: '',
            evaluationDate: '',
        },
        creditFinance: {
            ...report.creditFinance,
            rating: {grade: '', details: clearDetails(report.creditFinance.rating.details)},
            ratios: [],
            comparison: [],
            years: [],
            statements: [],
        },
        creditDetail: {
            ...report.creditDetail,
            cashFlow: {
                ...report.creditDetail.cashFlow,
                grade: '',
                details: clearDetails(report.creditDetail.cashFlow.details),
            },
        },
        activity: {employees: [], salesPerEmployee: []},
    }
}

// [퍼블리싱 확인용] ?empty=company — 기업현황 탭 데이터를 모두 비운다(웹 보고서 기업현황 탭 · 인쇄본 기업현황 장 공용).
// 개요는 줄 이름만 두고 값을 비우고, 목록 · 건수 · 인증 · 재무 · 거래처는 받은 것이 없는 상태로 둔다.
const withPreviewEmptyCompany = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    companyStatus: {
        ...report.companyStatus,
        overview: report.companyStatus.overview.map((row) => ({...row, value: ''})),
        executives: [],
        shareholders: [],
        affiliates: [],
        intellectualProperty: [],
        certifications: [],
        finance: {years: [], balance: [], income: [], ratios: [], cashFlows: []},
        customers: [],
        suppliers: [],
    },
})

// [퍼블리싱 확인용] ?empty=company-overview-long · -short — 기업현황 첫 쪽 행 수 확인용(PDF 템플릿).
//   long: 길이가 변하는 개요 값(기업명 · 대표자 · 주소 · 대표기술분야 · 주요제품)을 두 줄 넘게 → 표 행이 줄어든다.
//   short: 개요 값을 모두 짧게 → 쪽에 남는 자리만큼 표 행이 늘어난다.
//   두 경우 모두 경영진 · 주주를 10건 받아, 늘어난 행에도 실제 값이 보이게 한다. 웹 보고서는 늘 5행이다.
const PREVIEW_PEOPLE_COUNT = 10
const PREVIEW_LONG_OVERVIEW: Record<string, string> = {
    기업명: '주식회사 프롬엑스테크놀로지 인공지능 의료영상 분석 연구개발 및 클라우드 서비스 사업본부',
    대표자: '홍길동, 김공동대표, 이공동대표, 박공동대표, 최공동대표, 정공동대표, 강공동대표',
    주소: '부산광역시 남구 문현금융로 33 부산국제금융센터 기술보증기금 본점 63층 6301호 (문현동) 인공지능 의료영상 연구소',
    대표기술분야: '인공지능 기반 의료영상 판독 보조 소프트웨어 및 클라우드 기반 영상 데이터 관리 플랫폼 개발',
    주요제품:
        'AI 흉부 X-ray 판독 보조 솔루션, 클라우드 PACS 연동 모듈, 의료영상 비식별화 도구, 판독 리포트 자동 생성기',
}
const withPreviewCompanyOverview = (report: InnovationGrowthReport, kind: 'long' | 'short'): InnovationGrowthReport => {
    const status = report.companyStatus
    return {
        ...report,
        companyStatus: {
            ...status,
            overview: status.overview.map((row) =>
                kind === 'long'
                    ? {...row, value: PREVIEW_LONG_OVERVIEW[row.label] ?? row.value}
                    : {...row, value: row.value.slice(0, 6)},
            ),
            executives: Array.from({length: PREVIEW_PEOPLE_COUNT}, (_, index) => ({
                role: index === 0 ? '대표이사' : '사내이사',
                name: `임원${index + 1}`,
                birthDate: `7${index}.01.01`,
            })),
            shareholders: Array.from({length: PREVIEW_PEOPLE_COUNT}, (_, index) => ({
                name: `주주${index + 1}`,
                shares: 1000 * (PREVIEW_PEOPLE_COUNT - index),
                ratio: PREVIEW_PEOPLE_COUNT - index,
                relation: index === 0 ? '본인' : '타인',
            })),
        },
    }
}

// [퍼블리싱 확인용] ?empty=company-edge · -edge-short — 기업현황 첫 쪽 경계 사례(PDF 템플릿 · 웹 공용).
//   경영진 1건 vs 주주 10건(두 표 행 수가 같은지) · 관계기업 10건 · 칸마다 아주 긴 글(한 줄 말줄임) · 아주 큰 숫자.
const PREVIEW_LONG_CELL = '아주 긴 이름이 들어와 칸 폭을 넘는 경우를 확인하기 위한 퍼블리싱 확인용 문구입니다'
const withPreviewCompanyEdge = (report: InnovationGrowthReport, kind: 'long' | 'short'): InnovationGrowthReport => {
    const base = withPreviewCompanyOverview(report, kind)
    const status = base.companyStatus
    return {
        ...base,
        companyStatus: {
            ...status,
            executives: [{role: PREVIEW_LONG_CELL, name: PREVIEW_LONG_CELL, birthDate: '1971.02.03'}],
            shareholders: status.shareholders.map((row, index) => ({
                ...row,
                name: index === 0 ? PREVIEW_LONG_CELL : row.name,
                shares: index === 0 ? 1234567890123 : row.shares,
                ratio: index === 0 ? 100 : row.ratio,
                relation: index === 0 ? PREVIEW_LONG_CELL : row.relation,
            })),
            affiliates: Array.from({length: PREVIEW_PEOPLE_COUNT}, (_, index) => ({
                name: index === 0 ? PREVIEW_LONG_CELL : `(주)관계기업${index + 1}`,
                ceo: index === 0 ? PREVIEW_LONG_CELL : `대표${index + 1}`,
                industry: index === 0 ? PREVIEW_LONG_CELL : '전자부품 제조업',
                fiscalYear: '2024',
                totalAssets: index === 0 ? 987654321098 : 10000 + index,
                sales: index === 0 ? 123456789012 : 200 + index,
            })),
        },
    }
}

// [퍼블리싱 확인용] ?empty=company-long-text — 글 칸만 길게(숫자 · 일자 · 신용등급 코드는 그대로). 실제로 들어올 법한
//   긴 이름 몇 가지를 줄마다 돌려 쓴다(길이가 서로 달라 줄마다 줄바꿈 · 말줄임 모양을 비교할 수 있다).
const PREVIEW_LONG_COMPANY_NAMES = [
    '주식회사 한국첨단바이오메디컬헬스케어솔루션',
    '(주)글로벌스마트모빌리티앤에너지테크놀로지스',
    '에이치엔티인터내셔널코리아유한회사',
] as const
const PREVIEW_LONG_PERSON_NAMES = ['남궁독고선우황보제갈', '알렉산더 크리스토퍼 김', '이수현(Lee Soo Hyun)'] as const
const PREVIEW_LONG_ROLES = [
    '대표이사 겸 최고기술책임자(CTO) 및 연구개발본부 총괄 부사장',
    '사내이사 · 경영지원본부장',
    '비상근 사외이사(감사위원장)',
    '이사',
] as const
const PREVIEW_LONG_RELATIONS = [
    '최대주주의 특수관계인(친인척) 및 그 배우자의 직계존비속',
    '계열회사 임원 및 그 배우자',
    '본인',
] as const
// 주주명 — 사람과 법인이 섞여 들어온다((주) 표기 · 띄어 쓴 '(주) ' 표기 포함).
const PREVIEW_LONG_SHAREHOLDER_NAMES = [
    '(주) 한국벤처캐피탈파트너스제일호투자조합',
    '알렉산더 크리스토퍼 김',
    '(주)글로벌스마트모빌리티앤에너지테크놀로지스',
    '남궁독고선우황보제갈',
] as const
const PREVIEW_LONG_INDUSTRIES = [
    '그 외 기타 전자부품 제조업 및 관련 소프트웨어 개발·공급업',
    '의료용 기기 제조업',
    '전기, 가스, 증기 및 공기 조절 공급업 중 신재생에너지 발전업',
] as const
const pickPreview = <T>(items: readonly T[], index: number): T => items[index % items.length] ?? items[0]
const PREVIEW_LONG_OVERVIEW_EXTRA: Record<string, string> = {
    '기업유형/형태': '코스닥시장 상장법인 / 벤처기업 · 이노비즈 · 메인비즈 인증 중소기업(법인기업)',
    기업규모: '중소기업(중소기업기본법 시행령 별표 1 기준 소기업 · 벤처기업 확인 기업)',
    표준산업분류:
        '(C26299) 그 외 기타 전자부품 제조업 및 관련 소프트웨어 개발·공급업, 의료용 영상 진단 보조기기 제조업',
}
const withPreviewCompanyLongText = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const status = report.companyStatus
    const toLongPartner = (partner: InnovationTradePartner, index: number) => ({
        ...partner,
        name: pickPreview(PREVIEW_LONG_COMPANY_NAMES, index),
    })
    return {
        ...report,
        companyStatus: {
            ...status,
            // 개요 — 글 칸만 길게(법인등록번호 · 사업자등록번호 · 설립일 · 종업원수처럼 형식이 정해진 칸은 그대로).
            overview: status.overview.map((row) => ({
                ...row,
                value: PREVIEW_LONG_OVERVIEW[row.label] ?? PREVIEW_LONG_OVERVIEW_EXTRA[row.label] ?? row.value,
            })),
            executives: status.executives.map((row, index) => ({
                ...row,
                role: pickPreview(PREVIEW_LONG_ROLES, index),
                name: pickPreview(PREVIEW_LONG_PERSON_NAMES, index),
            })),
            shareholders: status.shareholders.map((row, index) => ({
                ...row,
                name: pickPreview(PREVIEW_LONG_SHAREHOLDER_NAMES, index),
                relation: pickPreview(PREVIEW_LONG_RELATIONS, index),
            })),
            affiliates: status.affiliates.map((row, index) => ({
                ...row,
                name: pickPreview(PREVIEW_LONG_COMPANY_NAMES, index),
                ceo: pickPreview(PREVIEW_LONG_PERSON_NAMES, index),
                industry: pickPreview(PREVIEW_LONG_INDUSTRIES, index),
            })),
            customers: status.customers.map(toLongPartner),
            suppliers: status.suppliers.map((partner, index) => toLongPartner(partner, index + 1)),
        },
    }
}

// [퍼블리싱 확인용] ?empty=briefing-long-text — 진단브리핑 기업 정보 표 값만 길게(줄 이름 · 줄 수는 그대로).
const PREVIEW_LONG_COMPANY_INFO: Record<string, string> = {
    기업명: '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스',
    대표자: '남궁독고선우황보제갈, 알렉산더 크리스토퍼 김(공동대표)',
    '기업유형/형태': '코스닥시장 상장법인 / 벤처기업 · 이노비즈 · 메인비즈 인증 중소기업(법인기업)',
    표준산업분류:
        '(C26299) 그 외 기타 전자부품 제조업 및 관련 소프트웨어 개발·공급업, 의료용 영상 진단 보조기기 제조업',
    대표기술분야:
        '무선·이동통신 서비스 및 차세대 네트워크 인프라 구축 기술 중 초저지연 5G 코어망 가상화와 위성통신 연계 기술',
    주요제품:
        '5G 통신 및 IoT 관련 서비스, AI 기반 의료 영상 분석 시스템, 스마트 헬스케어 웨어러블 디바이스 및 클라우드 플랫폼',
}
// 기업 보유기술 범례 — 긴 이름 · 중간 · 짧은 이름을 섞는다(조각 순서 · 비중 · 건수 · 색은 그대로, '기타'는 그대로).
const PREVIEW_MIXED_TECH_LABELS = [
    '무선·이동통신 서비스 및 차세대 네트워크 인프라 구축 기술',
    'IoT',
    '인공지능 기반 의료 영상 분석',
    '5G',
    '스마트 헬스케어 웨어러블 디바이스 및 클라우드 연동 플랫폼',
    '광통신 부품',
    '초저지연위성통신연계코어망가상화기술',
] as const
const toMixedDonutLabels = (items: readonly PercentageDonutItem[], offset: number) =>
    items.map((item, index) => ({
        ...item,
        label: item.label === '기타' ? item.label : pickPreview(PREVIEW_MIXED_TECH_LABELS, index + offset),
    }))
// R&D 이슈 키워드 — 긴 · 중간 · 짧은 말을 섞는다(크기 순서 · 개수는 그대로, 원래 목업 키워드와 겹치지 않게).
const PREVIEW_LONG_ISSUES = [
    '초저지연영상전송',
    '인공지능',
    '의료영상분할알고리즘',
    'AI',
    '멀티모달 학습',
    '디지털헬스케어플랫폼',
    '5G',
    '연합학습기반개인정보보호',
] as const
const withPreviewBriefingLongText = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    // 머리(보고서 제목 · 기업명) — 웹 보고서 머리 · PDF 템플릿 표지에 같이 쓰인다.
    title: '인공지능 기반 의료 영상 분석 및 실시간 원격 판독 지원을 위한 차세대 멀티모달 진단 보조 시스템',
    companyName: '주식회사 한국첨단바이오메디컬헬스케어솔루션',
    // 기술혁신정보 구획 제목 옆 세부분야명.
    subCategoryName: '무선·이동통신 서비스 및 차세대 네트워크 인프라 구축 기술 중 초저지연 5G 코어망 가상화',
    innovation: {
        ...report.innovation,
        technologies: toMixedDonutLabels(report.innovation.technologies, 0),
        // 앞에서부터 목록 개수만큼만 바꾼다 — 키워드는 겹치면 안 된다(워드클라우드가 키워드를 키로 쓴다).
        issues: report.innovation.issues.map((issue, index) => ({
            ...issue,
            text: PREVIEW_LONG_ISSUES[index] ?? issue.text,
        })),
    },
    // 혁신성장역량지수 카드의 동일업종명.
    techIndex: {
        ...report.techIndex,
        industryLabel:
            '그 외 기타 전자부품 제조업 및 관련 소프트웨어 개발·공급업(의료용 영상 진단 보조기기 포함), 스마트 헬스케어 웨어러블 디바이스 및 클라우드 기반 원격 판독 플랫폼 서비스업',
    },
    company: {
        rows: report.company.rows.map((row) => ({...row, value: PREVIEW_LONG_COMPANY_INFO[row.label] ?? row.value})),
    },
})

// [퍼블리싱 확인용] ?empty=briefing-mixed — 칸마다 길이를 섞는다(아주 긴 · 적절한 · 짧은 · 빈 값). 숫자 · 일자는 briefing-partial 규칙으로
//   일부만 비운 뒤, 글 칸을 아래 값으로 덮는다(기업 정보는 빈 줄도 여기서 정한다).
const PREVIEW_MIXED_COMPANY_INFO: Record<string, string> = {
    기업명: '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스', // 아주 긴
    대표자: '김철수', // 짧은
    '기업유형/형태': '', // 빈 값
    표준산업분류: '(C26299) 그 외 기타 전자부품 제조업', // 적절한
    대표기술분야:
        '무선·이동통신 서비스 및 차세대 네트워크 인프라 구축 기술 중 초저지연 5G 코어망 가상화와 위성통신 연계 기술', // 아주 긴
    주요제품: 'AI 영상 분석', // 짧은
}
const PREVIEW_MIXED_TECH_LABELS_BY_LENGTH = [
    '스마트 헬스케어 웨어러블 디바이스 및 클라우드 연동 플랫폼', // 아주 긴
    'IoT', // 짧은
    '인공지능 기반 의료 영상 분석', // 적절한
    '5G', // 짧은
    '초저지연위성통신연계코어망가상화기술', // 띄어쓰기 없는 아주 긴
    '광통신 부품', // 적절한
    'AI', // 짧은
] as const
const PREVIEW_MIXED_ISSUES = ['연합학습기반개인정보보호', 'AI', '멀티모달 학습', '5G'] as const
const withPreviewBriefingMixed = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const partial = withPreviewPartialBriefing(report)
    return {
        ...partial,
        title: '인공지능 기반 의료 영상 분석 및 실시간 원격 판독 지원을 위한 차세대 멀티모달 진단 보조 시스템', // 아주 긴
        companyName: '(주)에이아이', // 짧은
        subCategoryName: '무선 · 이동통신 서비스', // 적절한
        company: {
            rows: report.company.rows.map((row) => ({
                ...row,
                value: PREVIEW_MIXED_COMPANY_INFO[row.label] ?? row.value,
            })),
        },
        innovation: {
            ...partial.innovation,
            technologies: partial.innovation.technologies.map((item, index) => ({
                ...item,
                label: item.label === '기타' ? item.label : pickPreview(PREVIEW_MIXED_TECH_LABELS_BY_LENGTH, index),
            })),
            // 앞 4개만 바꾼다(키워드는 겹치면 안 된다).
            issues: partial.innovation.issues.map((issue, index) => ({
                ...issue,
                text: PREVIEW_MIXED_ISSUES[index] ?? issue.text,
            })),
        },
        // 동일업종명은 아주 긴 값(웹 한 줄 · PDF 두 줄 말줄임 확인), 순위 · 평가일자는 partial 규칙으로 비어 있다.
        techIndex: {
            ...partial.techIndex,
            industryLabel:
                '그 외 기타 전자부품 제조업 및 관련 소프트웨어 개발·공급업(의료용 영상 진단 보조기기 포함), 스마트 헬스케어 웨어러블 디바이스 및 클라우드 기반 원격 판독 플랫폼 서비스업',
        },
    }
}

// [퍼블리싱 확인용] ?empty=tech-long-text — 기술혁신정보 표의 글 칸만 길게(번호 · 일자 · 숫자는 그대로). 줄마다 길이를 돌려 쓴다.
const PREVIEW_LONG_PATENT_TITLES = [
    '차세대무선통신네트워크환경에서인공지능기반트래픽예측모델을이용한기지국간부하분산및전송품질유지시스템',
    '식물성 원료를 이용한 친환경 생분해성 바이오 플라스틱 조성물과 그 제조공정 및 이를 적용한 일회용 포장재의 성형 방법',
    '무선 충전 지원 스마트폰 케이스',
] as const
const PREVIEW_LONG_HOLDERS = [
    '(주)글로벌스마트모빌리티앤에너지테크놀로지스',
    '(주) 한국벤처캐피탈파트너스제일호투자조합',
    '한국전자통신연구원',
] as const
const PREVIEW_LONG_FIELDS = [
    '무선·이동통신 서비스 및 차세대 네트워크 인프라 구축 기술 중 초저지연 5G 코어망 가상화와 위성통신 연계 기술',
    '바이오 플라스틱',
    '인공지능 기반 영상 분석 · 의료 영상 진단 보조 소프트웨어',
] as const
const PREVIEW_LONG_INSTITUTES = [
    '한국과학기술연구원 차세대반도체융합연구단 및 첨단소재부품기술연구센터 공동 산학협력단 바이오헬스케어 융합연구본부 분원',
    '(주)삼성전자종합기술원',
    'KAIST',
] as const
const PREVIEW_LONG_RND_TITLES = [
    '2026년도 산업기술혁신사업(소재부품기술개발) 신규지원 대상과제 공고 — 첨단 바이오 플라스틱 소재 상용화 기술개발',
    '2026년 중소기업 기술혁신개발사업 시장확대형 시행계획 공고',
    'AI 바우처 지원사업',
] as const
const PREVIEW_LONG_AGENCIES = [
    ['과학기술정보통신부', '정보통신기획평가원(IITP) 디지털혁신본부'],
    ['산업통상자원부', '한국산업기술기획평가원'],
    ['중소벤처기업부', ''],
] as const
const PREVIEW_LONG_MANAGERS = ['홍길동 책임연구원(042-860-1234)', '김철수', '이영희 선임'] as const
const withPreviewTechLongText = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const tech = report.techInnovation
    const toLongPatent = <P extends InnovationPatentRow>(patent: P, index: number): P => ({
        ...patent,
        title: pickPreview(PREVIEW_LONG_PATENT_TITLES, index),
        applicant: pickPreview(PREVIEW_LONG_HOLDERS, index),
        rightHolder: pickPreview(PREVIEW_LONG_HOLDERS, index + 1),
    })
    const toLongInstitutes = (rows: readonly InnovationInstitute[], offset: number) =>
        rows.map((row, index) => ({...row, name: pickPreview(PREVIEW_LONG_INSTITUTES, index + offset)}))
    const toLongProjects = (projects: readonly InnovationRndProject[]) =>
        projects.map((project, index) => {
            const [ministry, agency] = pickPreview(PREVIEW_LONG_AGENCIES, index)
            return {
                ...project,
                ministry,
                agency,
                title: pickPreview(PREVIEW_LONG_RND_TITLES, index),
                manager: pickPreview(PREVIEW_LONG_MANAGERS, index),
            }
        })
    // 경쟁기업 · 성장률 우수기업 이름 — 조회기업 · 평균 줄은 고정 이름이라 그대로 둔다.
    const isFixedName = (name: string) => name === '평균' || name === report.companyName || name === '조회기업'
    return {
        ...report,
        techInnovation: {
            ...tech,
            // 특허기술 분석 — 분석특허명 · 개요 · 기술분야(경로 · 설명) · 판단 근거.
            analysis: {
                ...tech.analysis,
                patentTitle: PREVIEW_LONG_PATENT_TITLES[1],
                summary: [
                    ...tech.analysis.summary,
                    '본 발명은 차세대 무선 통신 환경에서 인공지능 기반 트래픽 예측 모델을 이용하여 기지국 간 부하를 분산하고 전송 품질을 유지하는 방법에 관한 것으로, 초저지연 · 초고신뢰 통신이 필요한 원격 의료 · 자율 주행 · 스마트 팩토리 등 다양한 산업 분야에 적용될 수 있으며 위성 통신망과의 연계를 통해 음영 지역까지 서비스 범위를 넓힐 수 있다.',
                ],
                field: {
                    name: '초저지연 5G 코어망 가상화 및 위성통신 연계 서비스',
                    path: '(기술분야) 정보/통신 – 무선 통신·네트워크 및 차세대 이동통신 인프라 – 초저지연 5G 코어망 가상화 및 위성통신 연계 서비스',
                    description:
                        '무선·이동통신 환경에서 다양한 서비스 제공을 위해 이동통신 네트워크상의 망 장비 및 관련 서비스 제공 관련 기술 요소를 통칭하며, 코어망 가상화 · 네트워크 슬라이싱 · 위성-지상 통합망 연계 기술을 포함한다',
                },
                reasons: [
                    ...tech.analysis.reasons,
                    'IoT · 클라우드는 적용 분야로 언급될 뿐 청구항의 핵심 구성은 이동통신망의 서비스 제공을 위한 제어 절차와 기지국 간 협력 전송 방식이므로, 무선 통신 장비보다는 무선·이동통신 서비스 분류가 더 적합하다.',
                ],
            },
            competitors: tech.competitors.map((item, index) =>
                item.tone ? item : {...item, label: pickPreview(PREVIEW_LONG_COMPANY_NAMES, index)},
            ),
            growthLeaders: {
                small: {
                    ...tech.growthLeaders.small,
                    items: tech.growthLeaders.small.items.map((item, index) =>
                        isFixedName(item.name) ? item : {...item, name: pickPreview(PREVIEW_LONG_COMPANY_NAMES, index)},
                    ),
                },
                large: {
                    ...tech.growthLeaders.large,
                    items: tech.growthLeaders.large.items.map((item, index) =>
                        isFixedName(item.name)
                            ? item
                            : {...item, name: pickPreview(PREVIEW_LONG_COMPANY_NAMES, index + 1)},
                    ),
                },
            },
            holdings: {
                ...tech.holdings,
                // 기술 보유현황 도넛 범례(중분류 · 세부분야) — 긴 · 중간 · 짧은 이름을 섞는다('기타'는 그대로).
                middleCategory: toMixedDonutLabels(tech.holdings.middleCategory, 0),
                smallCategory: toMixedDonutLabels(tech.holdings.smallCategory, 1),
                patents: tech.holdings.patents.map((patent, index) => ({
                    ...toLongPatent(patent, index),
                    field: pickPreview(PREVIEW_LONG_FIELDS, index),
                })),
            },
            excellentPatents: tech.excellentPatents.map(toLongPatent),
            emergingTech: {
                ...tech.emergingTech,
                rows: tech.emergingTech.rows.map((row, index) => ({
                    ...row,
                    // API 가 만드는 '기타' 줄 이름은 그대로 둔다.
                    field: row.field === '기타' ? row.field : pickPreview(PREVIEW_LONG_FIELDS, index),
                })),
            },
            rndInstitutes: {
                government: {
                    ...tech.rndInstitutes.government,
                    rows: toLongInstitutes(tech.rndInstitutes.government.rows, 0),
                },
                academia: {...tech.rndInstitutes.academia, rows: toLongInstitutes(tech.rndInstitutes.academia.rows, 1)},
            },
            governmentRnd: {
                ...tech.governmentRnd,
                open: toLongProjects(tech.governmentRnd.open),
                upcoming: toLongProjects(tech.governmentRnd.upcoming),
            },
        },
    }
}

// [퍼블리싱 확인용] ?empty=tech — 기술혁신정보 탭 데이터를 모두 비운다(웹 보고서 기술혁신정보 탭 · PDF 템플릿 기술혁신정보 장 공용).
//   매출 규모 구간 · 성장률 우수기업 구간 이름처럼 고정된 이름은 두고 값만 비운다. R&D 이슈 키워드도 비운다(진단브리핑과 공용 데이터).
const withPreviewEmptyTech = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const tech = report.techInnovation
    const emptyInstitutes = {share: Number.NaN, rows: [], total: {patentCount: Number.NaN, ratio: Number.NaN}}
    return {
        ...report,
        innovation: {...report.innovation, issues: []},
        techInnovation: {
            ...tech,
            holdings: {...tech.holdings, middleCategory: [], smallCategory: [], patents: []},
            analysis: {
                patentTitle: '',
                patentNumber: '',
                summary: [],
                field: {name: '', path: '', description: ''},
                reasons: [],
            },
            marketScale: {
                rows: tech.marketScale.rows.map((row) => ({...row, companies: Number.NaN, patents: Number.NaN})),
                companyShare: [],
                patentShare: [],
            },
            competitors: [],
            growthLeaders: {
                small: {...tech.growthLeaders.small, items: []},
                large: {...tech.growthLeaders.large, items: []},
            },
            excellentPatents: [],
            emergingTech: {periods: [], rows: []},
            rndInstitutes: {government: emptyInstitutes, academia: emptyInstitutes},
            governmentRnd: {baseDate: '', open: [], upcoming: []},
        },
    }
}

// [퍼블리싱 확인용] ?empty=tech-mixed — 긴 글 모드(tech-long-text) 위에 구획마다 다른 경우를 얹는다.
//   보유기술: 중분류 도넛 긴 · 짧은 이름 섞음 / 세부분야 도넛 0건 / 특허 3건(일부 칸 빈 값)
//   특허기술 분석: 특허명 아주 긴 · 특허 개요 빈 값 · 판단 근거 긴 문단
//   기업 · 특허 현황: 일부 구간 값 빈 값 · 특허수 비중 도넛 0건
//   경쟁기업: 5건(이름 긴 · 짧은 · 빈 값, 영업이익률 일부 없음) / 성장률 우수기업: 100억원 이하 4건 · 초과 0건
//   우수특허: 12건(기타 줄, 일부 피인용 · 출원인 빈 값) / 이머징 기술: 4줄(일부 등록건수 빈 값, 기타 없음)
//   R&D 전문기관: 정부출연연구소 12곳(기타) · 산학협력단 0곳 / 정부 R&D: 접수중 3건(일부 칸 빈 값) · 접수기간 도래 0건
const withPreviewTechMixed = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const long = withPreviewTechLongText(report)
    const tech = long.techInnovation
    return {
        ...long,
        techInnovation: {
            ...tech,
            holdings: {
                ...tech.holdings,
                smallCategory: [],
                patents: tech.holdings.patents
                    .slice(0, 3)
                    .map((patent, index) =>
                        index === 1 ? {...patent, field: '', rightHolder: '', registrationDate: ''} : patent,
                    ),
            },
            analysis: {...tech.analysis, summary: [], field: {...tech.analysis.field, name: '5G'}},
            marketScale: {
                ...tech.marketScale,
                rows: tech.marketScale.rows.map((row, index) =>
                    index % 2 === 1
                        ? {...row, companies: Number.NaN}
                        : index === 4
                          ? {...row, patents: Number.NaN}
                          : row,
                ),
                patentShare: [],
            },
            competitors: [
                ...tech.competitors.slice(0, 2),
                {id: 'mixed-short', label: '(주)이음', sales: 31.9, growthRate: null},
                {id: 'mixed-empty', label: '', sales: 30.5, growthRate: 1.2},
                ...tech.competitors.filter((item) => item.tone),
            ],
            growthLeaders: {
                small: {...tech.growthLeaders.small, items: tech.growthLeaders.small.items.slice(0, 4)},
                large: {...tech.growthLeaders.large, items: []},
            },
            excellentPatents: tech.excellentPatents.map((patent, index) =>
                index === 2
                    ? {...patent, citations: Number.NaN, citationIndex: Number.NaN}
                    : index === 4
                      ? {...patent, applicant: '', title: 'AI'}
                      : patent,
            ),
            emergingTech: {
                ...tech.emergingTech,
                rows: tech.emergingTech.rows
                    .filter((row) => row.field !== '기타')
                    .slice(0, 4)
                    .map((row, index) =>
                        index === 2
                            ? {
                                  ...row,
                                  field: 'IoT',
                                  counts: row.counts.map((count, i) => (i === 1 ? Number.NaN : count)),
                              }
                            : row,
                    ),
            },
            rndInstitutes: {
                ...tech.rndInstitutes,
                academia: {share: Number.NaN, rows: [], total: {patentCount: Number.NaN, ratio: Number.NaN}},
            },
            governmentRnd: {
                ...tech.governmentRnd,
                open: tech.governmentRnd.open
                    .slice(0, 3)
                    .map((project, index) => (index === 1 ? {...project, manager: '', period: ''} : project)),
                upcoming: [],
            },
        },
    }
}

// [퍼블리싱 확인용] ?empty=tech-mixed-2 — tech-mixed 와 0건 · 많은 건수 · 빈 값 자리를 바꿔 섞는다.
//   보유기술: 중분류 도넛 0건 / 세부분야 도넛 긴 이름 / 특허 10건(1건 특허명 짧은 · 1건 출원인 빈 값)
//   특허기술 분석: 특허명 짧은 · 특허 개요 긴 문단 · 기술분야 경로 빈 값(소분류만) · 설명 빈 값 · 판단 근거 빈 값
//   기업 · 특허 현황: 한 구간 전체 빈 값 · 기업수 비중 도넛 0건
//   경쟁기업: 0건 / 성장률 우수기업: 100억원 이하 0건 · 초과 11건(1위 이름 아주 긴)
//   우수특허: 5건(기타 없음, 1건 권리자 빈 값) / 이머징 기술: 11줄(기타 포함, 1줄 증가율 · 비중 빈 값)
//   R&D 이슈: 키워드 3개 / R&D 전문기관: 정부출연연구소 0곳 · 산학협력단 12곳(기타) / 정부 R&D: 접수중 0건 · 접수기간 도래 5건
const withPreviewTechMixed2 = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const long = withPreviewTechLongText(report)
    const tech = long.techInnovation
    const largeItems = tech.growthLeaders.large.items
    return {
        ...long,
        innovation: {...long.innovation, issues: long.innovation.issues.slice(0, 3)},
        techInnovation: {
            ...tech,
            holdings: {
                ...tech.holdings,
                middleCategory: [],
                patents: tech.holdings.patents.map((patent, index) =>
                    index === 0 ? {...patent, title: 'AI 진단'} : index === 3 ? {...patent, applicant: ''} : patent,
                ),
            },
            analysis: {
                ...tech.analysis,
                patentTitle: 'AI 진단 보조 장치',
                field: {...tech.analysis.field, path: '', description: ''},
                reasons: [],
            },
            marketScale: {
                ...tech.marketScale,
                rows: tech.marketScale.rows.map((row, index) =>
                    index === 2 ? {...row, companies: Number.NaN, patents: Number.NaN} : row,
                ),
                companyShare: [],
            },
            competitors: [],
            growthLeaders: {
                small: {...tech.growthLeaders.small, items: []},
                large: {
                    ...tech.growthLeaders.large,
                    items: largeItems.map((item, index) =>
                        index === 0
                            ? {
                                  ...item,
                                  name: '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스',
                              }
                            : item,
                    ),
                },
            },
            excellentPatents: tech.excellentPatents
                .slice(0, 5)
                .map((patent, index) => (index === 1 ? {...patent, rightHolder: ''} : patent)),
            emergingTech: {
                ...tech.emergingTech,
                rows: tech.emergingTech.rows.map((row, index) =>
                    index === 3 ? {...row, growthRate: Number.NaN, share: Number.NaN} : row,
                ),
            },
            rndInstitutes: {
                ...tech.rndInstitutes,
                government: {share: Number.NaN, rows: [], total: {patentCount: Number.NaN, ratio: Number.NaN}},
            },
            governmentRnd: {
                ...tech.governmentRnd,
                open: [],
                upcoming: tech.governmentRnd.upcoming
                    .slice(0, 5)
                    .map((project, index) =>
                        index === 2 ? {...project, ministry: '', agency: '', title: ''} : project,
                    ),
            },
        },
    }
}

// [퍼블리싱 확인용] ?empty=tech-index-mixed — 긴 기업명(점수 · 요약 문장) 위에 구획마다 다른 경우를 섞는다.
//   점수 있음 · 평가일자 빈 값 / 표준정보 있음 / 기업 유형별: 4유형만, 1유형 점수 빈 값
//   4대 혁신역량: 인프라 · 성과만 받음(성과는 전체기업 점수 빈 값) / 유형별 4대 역량: 활동 없음, 투입 1유형 빈 값
//   부문별 지표: 인프라·투입 부문만 받음(지표 1개 신청기업 점수 빈 값)
const withPreviewTechIndexMixed = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const longName = '주식회사 한국첨단바이오메디컬헬스케어솔루션앤글로벌스마트모빌리티에너지테크놀로지스'
    const detail = report.techIndexDetail
    return {
        ...report,
        companyName: longName,
        techIndex: {...report.techIndex, evaluationDate: ''},
        techIndexDetail: {
            ...detail,
            standard: {
                ...detail.standard,
                summary: detail.standard.summary.map((part) => ({
                    ...part,
                    text: part.text.replace(report.companyName, longName),
                })),
            },
            companyTypes: detail.companyTypes
                .slice(0, 4)
                .map((item, index) => (index === 2 ? {...item, value: Number.NaN} : item)),
            capabilities: detail.capabilities
                .filter((item) => item.id === 'infra' || item.id === 'output')
                .map((item) => (item.id === 'output' ? {...item, average: Number.NaN} : item)),
            capabilityByType: detail.capabilityByType
                .filter((item) => item.id !== 'activity')
                .map((item) =>
                    item.id === 'input'
                        ? {
                              ...item,
                              items: item.items.map((row, index) => (index === 2 ? {...row, value: Number.NaN} : row)),
                          }
                        : item,
                ),
            indicators: detail.indicators
                .filter((item) => item.title === '인프라·투입 부문')
                .map((item) => ({
                    ...item,
                    items: item.items.map((row, index) => (index === 1 ? {...row, company: Number.NaN} : row)),
                })),
        },
    }
}

// [퍼블리싱 확인용] ?empty=company-affiliates-many — 관계기업 25건. 웹은 앞 10건, PDF 템플릿은 첫 쪽에 들어가는 만큼만 그린다.
const PREVIEW_AFFILIATE_COUNT = 25
const withPreviewManyAffiliates = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    companyStatus: {
        ...report.companyStatus,
        affiliates: Array.from({length: PREVIEW_AFFILIATE_COUNT}, (_, index) => ({
            name: `(주)관계기업${index + 1}`,
            ceo: `대표${index + 1}`,
            industry: '전자부품 제조업',
            fiscalYear: '2024',
            totalAssets: 10000 + index,
            sales: 200 + index,
        })),
    },
})

// [퍼블리싱 확인용] ?empty=tech-index — Tech-Index 탭 데이터를 모두 비운다(웹 보고서 Tech-Index 탭 · PDF 템플릿 Tech-Index 장 공용).
//   점수는 숫자 아님(NaN), 날짜 · 순위 문구는 빈 문자열, 목록은 받은 것이 없는 상태.
const withPreviewEmptyTechIndex = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    techIndex: {...report.techIndex, score: Number.NaN, evaluationDate: ''},
    techIndexDetail: {
        ...report.techIndexDetail,
        standard: {mean: Number.NaN, standardDeviation: Number.NaN, percentileLabel: '', summary: []},
        companyTypes: [],
        capabilities: [],
        capabilityByType: [],
        indicators: [],
    },
})

// [퍼블리싱 확인용] ?empty=company-partial — 기업현황 탭에서 항목마다 홀수 번째 값만 비운다(일부 빈 칸).
//   개요 · 경영진 · 주주 · 관계기업 · 거래처는 홀수 번째 줄의 칸 일부를, 재무 표는 홀수 번째 줄의 가운데 해를 비운다.
//   특허 · 인증은 앞의 2개만 받은 경우(나머지는 '-'), 손익현황은 마지막 줄이 오지 않고 2023년 값이 모두 없는 경우를 함께 본다.
const PARTIAL_KEEP_COUNT = 2
const clearMiddleYear = (values: readonly number[]) => values.map((value, index) => (index === 1 ? Number.NaN : value))
const clearOddRowsMiddleYear = (rows: readonly InnovationFinanceRow[]) =>
    rows.map((row, index) => (isOddIndex(index) ? {...row, values: clearMiddleYear(row.values)} : row))
const withPreviewPartialCompany = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const status = report.companyStatus
    return {
        ...report,
        companyStatus: {
            ...status,
            overview: status.overview.map((row, index) => (isOddIndex(index) ? {...row, value: ''} : row)),
            executives: status.executives.map((row, index) => (isOddIndex(index) ? {...row, birthDate: ''} : row)),
            shareholders: status.shareholders.map((row, index) =>
                isOddIndex(index) ? {...row, shares: Number.NaN, relation: ''} : row,
            ),
            affiliates: status.affiliates.map((row, index) =>
                isOddIndex(index) ? {...row, ceo: '', totalAssets: Number.NaN} : row,
            ),
            intellectualProperty: status.intellectualProperty.slice(0, PARTIAL_KEEP_COUNT),
            certifications: status.certifications.slice(0, PARTIAL_KEEP_COUNT),
            finance: {
                ...status.finance,
                balance: clearOddRowsMiddleYear(status.finance.balance),
                // 손익현황은 2023년을 모든 줄에서 비워 '막대가 모두 없는 해(가운데 '-' 하나)'도 본다.
                income: status.finance.income
                    .map((row) => ({...row, values: clearMiddleYear(row.values)}))
                    .slice(0, -1),
                ratios: clearOddRowsMiddleYear(status.finance.ratios),
                cashFlows: clearOddRowsMiddleYear(status.finance.cashFlows),
            },
            customers: status.customers.map((row, index) =>
                isOddIndex(index) ? {...row, grade: '', shares: clearMiddleYear(row.shares)} : row,
            ),
            suppliers: status.suppliers.map((row, index) =>
                isOddIndex(index) ? {...row, evaluationDate: '', shares: clearMiddleYear(row.shares)} : row,
            ),
        },
    }
}

// [퍼블리싱 확인용] ?empty=company-mixed — 칸마다 아주 긴 · 적절한 · 짧은 · 빈 값을 섞고, 표 건수도 섞는다
//   (경영진 3건 · 주주 4건 · 관계기업 6건 · 매출처 4건 · 매입처 0건). 숫자 · 연도는 company-partial 규칙.
const PREVIEW_MIXED_OVERVIEW: Record<string, string> = {
    기업명: '주식회사 프롬엑스테크놀로지 인공지능 의료영상 분석 연구개발 및 클라우드 서비스 사업본부', // 아주 긴
    대표자: '김철수', // 짧은
    법인등록번호: '', // 빈 값
    종업원수: '', // 빈 값
    '기업유형/형태': '유가증권시장/법인기업', // 적절한
    기업규모: '', // 빈 값
    주소: '부산광역시 남구 문현금융로 33 부산국제금융센터 기술보증기금 본점 63층 6301호 (문현동) 인공지능 의료영상 연구소', // 아주 긴
    표준산업분류: '(C26299) 그 외 기타 전자부품 제조업', // 적절한
    대표기술분야: '5G', // 짧은
    주요제품:
        'AI 흉부 X-ray 판독 보조 솔루션, 클라우드 PACS 연동 모듈, 의료영상 비식별화 도구, 판독 리포트 자동 생성기', // 아주 긴
}
const withPreviewCompanyMixed = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const partial = withPreviewPartialCompany(report)
    const status = partial.companyStatus
    return {
        ...partial,
        companyStatus: {
            ...status,
            overview: report.companyStatus.overview.map((row) => ({
                ...row,
                value: PREVIEW_MIXED_OVERVIEW[row.label] ?? row.value,
            })),
            executives: [
                {
                    role: '대표이사 겸 최고기술책임자(CTO) 및 연구개발본부 총괄 부사장',
                    name: '홍길동',
                    birthDate: '71.02.03',
                },
                {role: '이사', name: '', birthDate: ''},
                {role: '사내이사 · 경영지원본부장', name: '남궁독고선우황보제갈', birthDate: '69.11.28'},
            ],
            shareholders: [
                {
                    name: '(주) 한국벤처캐피탈파트너스제일호투자조합',
                    shares: 10000,
                    ratio: 25,
                    relation: '최대주주의 특수관계인(친인척) 및 그 배우자의 직계존비속',
                },
                {name: '홍길동', shares: 6000, ratio: 15, relation: '본인'},
                {name: '', shares: Number.NaN, ratio: Number.NaN, relation: ''},
                {name: '알렉산더 크리스토퍼 김', shares: 4000, ratio: 10, relation: '계열회사 임원'},
            ],
            affiliates: [
                {
                    name: '주식회사 한국첨단바이오메디컬헬스케어솔루션',
                    ceo: '김철수',
                    industry: '그 외 기타 전자부품 제조업 및 관련 소프트웨어 개발·공급업',
                    fiscalYear: '2024',
                    totalAssets: 18920,
                    sales: 475,
                },
                {
                    name: '(주)이음',
                    ceo: '',
                    industry: '의료용 기기 제조업',
                    fiscalYear: '2023',
                    totalAssets: Number.NaN,
                    sales: 180,
                },
                {
                    name: '',
                    ceo: '남궁독고선우황보제갈',
                    industry: '',
                    fiscalYear: '',
                    totalAssets: 5420,
                    sales: Number.NaN,
                },
                {
                    name: '에이치엔티인터내셔널코리아유한회사',
                    ceo: '이수현(Lee Soo Hyun)',
                    industry: '전자부품',
                    fiscalYear: '2024',
                    totalAssets: 12300,
                    sales: 640,
                },
                {
                    name: '(주)바른',
                    ceo: '박',
                    industry: '전기, 가스, 증기 및 공기 조절 공급업 중 신재생에너지 발전업',
                    fiscalYear: '2023',
                    totalAssets: 9870,
                    sales: 295,
                },
                {
                    name: '(주)글로벌스마트모빌리티앤에너지테크놀로지스',
                    ceo: '최영희',
                    industry: 'IT',
                    fiscalYear: '2024',
                    totalAssets: 0,
                    sales: 0,
                },
            ],
            customers: status.customers.slice(0, 4).map((row, index) => ({
                ...row,
                name: ['(주)글로벌스마트모빌리티앤에너지테크놀로지스', '(주)이음', '', '삼성전자'][index] ?? row.name,
            })),
            suppliers: [],
        },
    }
}

// [퍼블리싱 확인용] ?empty=activity — 활동성정보 탭 데이터를 모두 비운다(웹 보고서 활동성정보 탭 · 인쇄본 활동성정보 장 공용).
const withPreviewEmptyActivity = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    activity: {employees: [], salesPerEmployee: []},
    activityDetail: {humanResources: [], energy: {years: [], electricity: [], gas: []}},
})

// [퍼블리싱 확인용] ?empty=activity-long-text — 활동성정보 숫자를 모두 큰 값으로(빈 칸 없이 가장 넓은 경우).
//   종업원수 · 입사 · 퇴사는 십만 명대, 증감은 큰 음수, 인당 매출액은 백만 천원대, 에너지는 억 kWh대.
const PREVIEW_LARGE_PEOPLE = 123456
const PREVIEW_LARGE_CHANGE = -12345
const PREVIEW_LARGE_CHANGE_RATE = -123.4
const PREVIEW_LARGE_SALES_PER_EMPLOYEE = 1234567.8
const PREVIEW_LARGE_ENERGY = 123456789.12
const withPreviewActivityLongText = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const {humanResources, energy} = report.activityDetail
    const toLargeEnergy = (rows: readonly InnovationEnergyRow[]) =>
        rows.map((row) => ({...row, values: row.values.map(() => PREVIEW_LARGE_ENERGY)}))
    return {
        ...report,
        activity: {
            employees: report.activity.employees.map((item) => ({...item, value: PREVIEW_LARGE_PEOPLE})),
            salesPerEmployee: report.activity.salesPerEmployee.map((item) => ({
                ...item,
                value: PREVIEW_LARGE_SALES_PER_EMPLOYEE,
            })),
        },
        activityDetail: {
            humanResources: humanResources.map((row) => ({
                ...row,
                employees: PREVIEW_LARGE_PEOPLE,
                change: PREVIEW_LARGE_CHANGE,
                changeRate: PREVIEW_LARGE_CHANGE_RATE,
                hires: PREVIEW_LARGE_PEOPLE,
                leavers: PREVIEW_LARGE_PEOPLE,
                salesPerEmployee: PREVIEW_LARGE_SALES_PER_EMPLOYEE,
            })),
            energy: {...energy, electricity: toLargeEnergy(energy.electricity), gas: toLargeEnergy(energy.gas)},
        },
    }
}

// [퍼블리싱 확인용] ?empty=activity-change — 전년대비 증감(율)을 해마다 증가 · 감소 · 변동 없음 순으로 둔다(색 · 기호 확인).
//   종업원수는 증감과 맞게 40 → 45 → 42 → 42 로 이어진다(첫 해의 전년은 40명).
const PREVIEW_CHANGE_ROWS = [
    {employees: 45, change: 5, changeRate: 12.5},
    {employees: 42, change: -3, changeRate: -6.7},
    {employees: 42, change: 0, changeRate: 0},
] as const
const withPreviewActivityChange = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    activityDetail: {
        ...report.activityDetail,
        humanResources: report.activityDetail.humanResources.map((row, index) => ({
            ...row,
            ...PREVIEW_CHANGE_ROWS[index % PREVIEW_CHANGE_ROWS.length],
        })),
    },
})

// [퍼블리싱 확인용] ?empty=activity-mixed — 활동성정보 영역마다 다른 케이스를 섞는다.
//   인적자원 현황 — 첫 해는 받지 못함('-' 줄) · 둘째 해는 큰 값 · 셋째 해는 증감 · 입사 · 퇴사만 빈 값
//   분기별 종업원수 — 앞 절반만 받음(뒤 분기는 빈 값) · 마지막 받은 분기는 큰 값,  인당 매출액 — 가운데 해만 빈 값
//   전기 사용량 — 본사 큰 값 · 공장 가운데 해 빈 값 · 기타 받지 못함,  가스 사용량 — 하나도 받지 못함(그래프 빈 상태)
const withPreviewActivityMixed = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const {humanResources, energy} = report.activityDetail
    const employees = report.activity.employees
    const half = Math.ceil(employees.length / 2)
    return {
        ...report,
        activity: {
            employees: employees.map((item, index) => {
                if (index >= half) return {...item, value: Number.NaN}
                return index === half - 1 ? {...item, value: PREVIEW_LARGE_PEOPLE} : item
            }),
            salesPerEmployee: report.activity.salesPerEmployee.map((item, index) =>
                index === 1 ? {...item, value: Number.NaN} : item,
            ),
        },
        activityDetail: {
            humanResources: humanResources.flatMap((row, index) => {
                if (index === 0) return []
                if (index === 1)
                    return [
                        {
                            ...row,
                            employees: PREVIEW_LARGE_PEOPLE,
                            change: PREVIEW_LARGE_CHANGE,
                            changeRate: PREVIEW_LARGE_CHANGE_RATE,
                            hires: PREVIEW_LARGE_PEOPLE,
                            leavers: PREVIEW_LARGE_PEOPLE,
                            salesPerEmployee: PREVIEW_LARGE_SALES_PER_EMPLOYEE,
                        },
                    ]
                return [{...row, change: Number.NaN, changeRate: Number.NaN, hires: Number.NaN, leavers: Number.NaN}]
            }),
            energy: {
                ...energy,
                electricity: energy.electricity.flatMap((row, index) => {
                    if (index === 0) return [{...row, values: row.values.map(() => PREVIEW_LARGE_ENERGY)}]
                    if (index === 1) return [{...row, values: clearMiddleYear(row.values)}]
                    return []
                }),
                gas: [],
            },
        },
    }
}

// [퍼블리싱 확인용] ?empty=activity-partial — 활동성정보 탭에서 일부 값만 비운다.
//   인적자원 표는 홀수 번째 해의 입사 · 퇴사 · 인당 매출액을, 분기 그래프는 진단브리핑 부분 비움과 같은 자리를 비운다.
//   전기는 홀수 번째 구분(공장)의 가운데 해를, 가스는 가운데 해(2024년)를 모든 구분에서 비워 '합계도 없는 해'를 함께 본다.
const withPreviewPartialActivity = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const {humanResources, energy} = report.activityDetail
    return {
        ...report,
        activity: {
            employees: report.activity.employees.map((item, index) =>
                index % 4 === 3 ? {...item, value: Number.NaN} : item,
            ),
            salesPerEmployee: report.activity.salesPerEmployee.map((item, index) =>
                isOddIndex(index) ? {...item, value: Number.NaN} : item,
            ),
        },
        activityDetail: {
            humanResources: humanResources.map((row, index) =>
                isOddIndex(index)
                    ? {...row, hires: Number.NaN, leavers: Number.NaN, salesPerEmployee: Number.NaN}
                    : row,
            ),
            energy: {
                ...energy,
                electricity: energy.electricity.map((row, index) =>
                    isOddIndex(index) ? {...row, values: clearMiddleYear(row.values)} : row,
                ),
                gas: energy.gas.map((row) => ({...row, values: clearMiddleYear(row.values)})),
            },
        },
    }
}

// [퍼블리싱 확인용] ?empty=credit — 신용/재무정보 탭 데이터를 모두 비운다(웹 보고서 신용/재무정보 탭 · 인쇄본 신용/재무정보 장 공용).
// 등급 코드 · 날짜는 빈 문자열, 목록은 받은 것이 없는 상태. 기업신용정보 표는 틀(제목 · 머리 · 상태)을 두고 값 줄만 비운다.
const withPreviewEmptyCredit = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const detail = report.creditDetail
    const clearDetails = (details: readonly RatingGaugeDetail[]) => details.map((item) => ({...item, value: ''}))
    return {
        ...report,
        creditFinance: {
            ...report.creditFinance,
            rating: {grade: '', details: clearDetails(report.creditFinance.rating.details)},
        },
        creditDetail: {
            ...detail,
            ratingHistory: [],
            cashFlow: {grade: '', details: clearDetails(detail.cashFlow.details), history: []},
            creditInfo: detail.creditInfo.map((table) => ({...table, status: '', rows: []})),
            ratioYears: [],
            ratios: detail.ratios.map((group) => ({...group, rows: []})),
            borrowingTrend: [],
            borrowings: {
                years: [],
                groups: [],
                total: {...detail.borrowings.total, cells: []},
            },
            borrowingChanges: {years: [], rows: []},
            institutions: {years: [], rows: [], share: []},
            creditCollateral: {points: [], current: {credit: Number.NaN, collateral: Number.NaN}},
            collaterals: [],
            collateralYear: '',
        },
    }
}

// [퍼블리싱 확인용] ?empty=credit-long-text — 신용/재무정보 탭의 긴 값(금액)을 본다.
//   차입금 현황은 고정 줄 · 연도 칸을 빠짐없이 큰 금액(조 단위 백만원) · 비중 100.0 으로 채운다 — 빈 칸('-') 없이 가장 넓은 경우.
//   담보 현황 금액도 큰 수로. 기업신용정보 표 값 · 상태는 정해진 명사(코드값)로 들어오므로 그대로 둔다. 등급 코드 · 일자 · 고정 항목명도 그대로.
const PREVIEW_LARGE_AMOUNT_SCALE = 100000
const PREVIEW_FULL_BORROWING_CELL: InnovationBorrowingCell = {amount: 123456789012, ratio: 100}
const withPreviewCreditLongText = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const detail = report.creditDetail
    const fixed = toFixedBorrowings(detail.borrowings)
    const fillRow = (row: InnovationBorrowingRow): InnovationBorrowingRow => ({
        ...row,
        cells: fixed.years.map(() => PREVIEW_FULL_BORROWING_CELL),
    })
    return {
        ...report,
        creditDetail: {
            ...detail,
            borrowings: {
                ...fixed,
                groups: fixed.groups.map((group) => ({
                    ...group,
                    rows: group.rows.map(fillRow),
                    subtotal: fillRow(group.subtotal),
                })),
                total: fillRow(fixed.total),
            },
            collaterals: detail.collaterals.map((item) => ({
                ...item,
                amount: item.amount * PREVIEW_LARGE_AMOUNT_SCALE,
            })),
        },
    }
}

// [퍼블리싱 확인용] ?empty=credit-info-long-text — 기업신용정보 표마다 칸 폭을 넘는 값 한 줄 · 긴 상태 문구.
//   원래 행이 없는 표(해당없음)도 한 줄을 넣는다 — 일자 · 번호 칸은 받은 값(없으면 예시 일자).
const PREVIEW_LONG_CREDIT_STATUS = '부가가치세 간이과세자(휴업 후 재개업 · 사업장 소재지 이전 신고 처리 중)'
const PREVIEW_LONG_CREDIT_CELL = '퍼블리싱 확인용으로 넣은 아주 긴 글이 칸 폭을 넘는 경우'
const PREVIEW_LONG_CREDIT_AMOUNT = '123,456,789,012,345'
const PREVIEW_SAMPLE_DATE = '2024-01-01'
const PREVIEW_LONG_TEXT_COLUMN = /(상태|사유|기관|정보|여부)$/
const PREVIEW_AMOUNT_COLUMN = /금액$/
const withPreviewCreditInfoLongText = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const toLongCell = (column: string, value: string) => {
        if (PREVIEW_AMOUNT_COLUMN.test(column)) return PREVIEW_LONG_CREDIT_AMOUNT
        return PREVIEW_LONG_TEXT_COLUMN.test(column) ? PREVIEW_LONG_CREDIT_CELL : value
    }
    return {
        ...report,
        creditDetail: {
            ...report.creditDetail,
            creditInfo: report.creditDetail.creditInfo.map((table) => ({
                ...table,
                status: PREVIEW_LONG_CREDIT_STATUS,
                rows: [
                    table.columns.map((column, index) =>
                        toLongCell(column, table.rows[0]?.[index] || PREVIEW_SAMPLE_DATE),
                    ),
                ],
            })),
        },
    }
}

// [퍼블리싱 확인용] ?empty=credit-mixed — 신용/재무정보 영역마다 다른 케이스를 섞는다.
//   기업신용등급   — 등급 있음 · 평가일자 빈 값 · 이력 1건(나머지 '-' 줄)
//   현금흐름등급   — 등급 · 결산일자 · 이력 모두 없음
//   기업신용정보   — 표마다 다르게: 긴 글 · 행 없음(상태 없음) · 그대로 · 큰 금액 · 일부 칸 빈 값 · 해당없음
//   재무비율진단   — 성장성 그대로 · 수익성 행 없음 · 안정성 가운데 해 빈 값 · 활동성 업종평균 대비만 빈 값
//   차입금 변동률  — 홀수 번째 달 빈 값,  차입금 현황 — 단기 큰 금액 · 장기 가운데 해 빈 칸,  변동현황 — 행 없음
//   기관별 비중    — 표 그대로 · 도넛 없음,  신용/담보 — 추이 없음 · 최근 비중만,  담보 — 1건 · 큰 금액
const withPreviewCreditMixed = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const detail = report.creditDetail
    const clearCell = (cells: readonly string[], index: number) => cells.map((value, i) => (i === index ? '' : value))
    const creditInfoCases: Record<number, (table: InnovationCreditInfoTable) => InnovationCreditInfoTable> = {
        0: (table) => ({
            ...table,
            rows: table.rows.map((row) =>
                row.map((value, index) =>
                    PREVIEW_LONG_TEXT_COLUMN.test(table.columns[index] ?? '') ? PREVIEW_LONG_CREDIT_CELL : value,
                ),
            ),
        }),
        1: (table) => ({...table, status: '', rows: []}),
        3: (table) => ({
            ...table,
            rows: table.rows.map((row) =>
                row.map((value, index) =>
                    PREVIEW_AMOUNT_COLUMN.test(table.columns[index] ?? '') ? PREVIEW_LONG_CREDIT_AMOUNT : value,
                ),
            ),
        }),
        4: (table) => ({...table, rows: table.rows.map((row) => clearCell(clearCell(row, 1), row.length - 1))}),
        5: (table) => ({...table, status: '해당없음', rows: []}),
    }
    const scaleCell = (cell: InnovationBorrowingCell): InnovationBorrowingCell =>
        cell ? {...cell, amount: cell.amount * PREVIEW_LARGE_AMOUNT_SCALE} : cell
    const clearMiddleCell = (row: InnovationBorrowingRow): InnovationBorrowingRow => ({
        ...row,
        cells: row.cells.map((cell, index) => (index === 1 ? null : cell)),
    })
    const scaleRow = (row: InnovationBorrowingRow): InnovationBorrowingRow => ({
        ...row,
        cells: row.cells.map(scaleCell),
    })
    const [shortTerm, ...otherGroups] = detail.borrowings.groups
    return {
        ...report,
        creditFinance: {
            ...report.creditFinance,
            rating: {
                ...report.creditFinance.rating,
                details: report.creditFinance.rating.details.map((item, index) =>
                    index ? item : {...item, value: ''},
                ),
            },
        },
        creditDetail: {
            ...detail,
            ratingHistory: detail.ratingHistory.slice(-1),
            cashFlow: {
                grade: '',
                details: detail.cashFlow.details.map((item) => ({...item, value: ''})),
                history: [],
            },
            creditInfo: detail.creditInfo.map((table, index) => creditInfoCases[index]?.(table) ?? table),
            ratios: detail.ratios.map((group, groupIndex) => {
                if (groupIndex === 1) return {...group, rows: []}
                if (groupIndex === 2)
                    return {...group, rows: group.rows.map((row) => ({...row, values: clearMiddleYear(row.values)}))}
                if (groupIndex === 3) return {...group, rows: group.rows.map((row) => ({...row, comparison: ''}))}
                return group
            }),
            borrowingTrend: detail.borrowingTrend.map((item, index) =>
                isOddIndex(index) ? {...item, value: Number.NaN} : item,
            ),
            borrowings: {
                ...detail.borrowings,
                groups: [
                    ...(shortTerm
                        ? [{...shortTerm, rows: shortTerm.rows.map(scaleRow), subtotal: scaleRow(shortTerm.subtotal)}]
                        : []),
                    ...otherGroups.map((group) => ({
                        ...group,
                        rows: group.rows.map(clearMiddleCell),
                        subtotal: clearMiddleCell(group.subtotal),
                    })),
                ],
                total: scaleRow(detail.borrowings.total),
            },
            borrowingChanges: {...detail.borrowingChanges, rows: []},
            institutions: {...detail.institutions, share: []},
            creditCollateral: {...detail.creditCollateral, points: []},
            collaterals: detail.collaterals
                .slice(0, 1)
                .map((item) => ({...item, amount: item.amount * PREVIEW_LARGE_AMOUNT_SCALE})),
        },
    }
}

// [퍼블리싱 확인용] ?empty=credit-partial — 신용/재무정보 탭에서 일부 값만 비운다.
//   이력은 1건만(나머지 '-' 줄), 기업신용정보는 홀수 번째 표의 홀수 번째 칸, 재무비율 · 차입금 · 기관별은 홀수 번째 줄의 가운데 해,
//   차입금 변동률 · 신용/담보는 홀수 번째 점, 담보는 앞의 2개만 받은 경우를 본다.
const withPreviewPartialCredit = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const detail = report.creditDetail
    const clearMiddleCell = (row: InnovationBorrowingRow): InnovationBorrowingRow => ({
        ...row,
        cells: row.cells.map((cell, index) => (index === 1 ? null : cell)),
    })
    return {
        ...report,
        creditDetail: {
            ...detail,
            ratingHistory: detail.ratingHistory.slice(-1),
            cashFlow: {...detail.cashFlow, history: detail.cashFlow.history.slice(-1)},
            creditInfo: detail.creditInfo.map((table, tableIndex) =>
                isOddIndex(tableIndex)
                    ? {
                          ...table,
                          rows: table.rows.map((row) => row.map((value, index) => (isOddIndex(index) ? '' : value))),
                      }
                    : table,
            ),
            ratios: detail.ratios.map((group) => ({
                ...group,
                rows: group.rows.map((row, index) =>
                    isOddIndex(index) ? {...row, values: clearMiddleYear(row.values), comparison: ''} : row,
                ),
            })),
            borrowingTrend: detail.borrowingTrend.map((item, index) =>
                isOddIndex(index) ? {...item, value: Number.NaN} : item,
            ),
            borrowings: {
                ...detail.borrowings,
                groups: detail.borrowings.groups.map((group) => ({
                    ...group,
                    rows: group.rows.map((row, index) => (isOddIndex(index) ? clearMiddleCell(row) : row)),
                })),
            },
            borrowingChanges: {
                ...detail.borrowingChanges,
                rows: detail.borrowingChanges.rows.map((row, index) =>
                    isOddIndex(index) ? {...row, values: clearMiddleYear(row.values)} : row,
                ),
            },
            institutions: {
                ...detail.institutions,
                rows: detail.institutions.rows.map((row, index) =>
                    isOddIndex(index) ? {...row, values: row.values.map((value, i) => (i === 1 ? null : value))} : row,
                ),
            },
            creditCollateral: {
                ...detail.creditCollateral,
                points: detail.creditCollateral.points.map((point, index) =>
                    isOddIndex(index) ? {...point, credit: Number.NaN, collateral: Number.NaN} : point,
                ),
            },
            collaterals: detail.collaterals.slice(0, PARTIAL_KEEP_COUNT),
        },
    }
}

// [퍼블리싱 확인용] ?empty=briefing-partial — 항목마다 짝수 번째(0 · 2 · 4 …)는 두고 홀수 번째 값만 비운다(일부 빈 칸).
// 그래프 · 등급처럼 한 값뿐인 항목은 섞어 둔다 — 점수는 있고 순위 · 평가일자는 없음, 기업신용등급은 있고 현금흐름등급은 없음.
const isOddIndex = (index: number) => index % 2 === 1
const withPreviewPartialBriefing = (report: InnovationGrowthReport): InnovationGrowthReport => ({
    ...report,
    company: {rows: report.company.rows.map((row, index) => (isOddIndex(index) ? {...row, value: ''} : row))},
    innovation: {
        ...report.innovation,
        stats: report.innovation.stats.map((stat, index) => (isOddIndex(index) ? {...stat, value: null} : stat)),
        averages: report.innovation.averages.map((row, index) => (isOddIndex(index) ? {...row, value: null} : row)),
        // 부처는 2곳만 받은 경우 — 나머지 두 칸은 빠진 부처명 · '-' 로 채워진다.
        rnd: report.innovation.rnd.slice(0, 2),
    },
    techIndex: {...report.techIndex, industryPercentile: Number.NaN, evaluationDate: ''},
    creditFinance: {
        ...report.creditFinance,
        rating: {
            ...report.creditFinance.rating,
            details: report.creditFinance.rating.details.map((detail, index) =>
                isOddIndex(index) ? {...detail, value: ''} : detail,
            ),
        },
        ratios: report.creditFinance.ratios.map((row, index) => (isOddIndex(index) ? {...row, rating: null} : row)),
        comparison: report.creditFinance.comparison.map((row, index) =>
            isOddIndex(index) ? {...row, company: Number.NaN} : row,
        ),
        statements: report.creditFinance.statements.map((row, index) =>
            isOddIndex(index)
                ? {...row, values: row.values.map((value, valueIndex) => (valueIndex === 1 ? Number.NaN : value))}
                : row,
        ),
    },
    creditDetail: {...report.creditDetail, cashFlow: {...report.creditDetail.cashFlow, grade: ''}},
    activity: {
        employees: report.activity.employees.map((item, index) =>
            index % 4 === 3 ? {...item, value: Number.NaN} : item,
        ),
        salesPerEmployee: report.activity.salesPerEmployee.map((item, index) =>
            isOddIndex(index) ? {...item, value: Number.NaN} : item,
        ),
    },
})

// [퍼블리싱 확인용] 케이스별 확인 화면의 기업신용정보 표 상태 — 케이스마다 보여 줄 모양을 고정한다(목업 값만 바꾼다).
//   partner-corp: 당좌거래정지정보를 '해당없음'(배지 [해당없음] + '해당사항 없음' 줄)으로 둬 비공개 표와 나란히 본다.
//   partner-person: 법인등기정보를 '해당없음' 으로 둬 같은 방식으로 본다.
const PREVIEW_CASE_NONE_TABLES: Partial<Record<InnovationReportCase, readonly string[]>> = {
    'partner-corp': ['suspension'],
    'partner-person': ['registry'],
}
const withPreviewCaseSample = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const noneTables = PREVIEW_CASE_NONE_TABLES[report.viewerCase] ?? []
    return {
        ...report,
        creditDetail: {
            ...report.creditDetail,
            creditInfo: report.creditDetail.creditInfo.map((table) =>
                noneTables.includes(table.id) ? {...table, status: '해당없음', rows: []} : table,
            ),
        },
    }
}

// [퍼블리싱 확인용] 케이스에서 제공하지 않는 값을 목업에서 뺀다 — 실서비스에서 백엔드가 하는 일을 흉내 낸다.
// 화면은 가린 자리에 자리 표시 값을 그리므로, 여기서 뺀 값은 페이지 데이터(DOM · RSC 페이로드)에 남지 않는다.
const redactForViewerCase = (report: InnovationGrowthReport): InnovationGrowthReport => {
    const visibility = INNOVATION_CREDIT_VISIBILITY[report.viewerCase]
    const {creditDetail} = report
    return {
        ...report,
        creditDetail: {
            ...creditDetail,
            creditInfo: creditDetail.creditInfo.map((table) =>
                visibility.hiddenInfoTables.includes(table.id) ? {...table, rows: []} : table,
            ),
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
    INNOVATION_REPORT_SCORE_MAX,
    INNOVATION_REPORT_GRADE_HISTORY_COUNT,
    INNOVATION_REPORT_FINANCE_FALLBACK_YEAR_COUNT,
    INNOVATION_REPORT_EMERGING_EMPTY_PERIOD_COUNT,
    toMarketScaleRows,
    getHumanResourceYearRows,
    ENERGY_CATEGORIES,
    TECH_INDEX_CAPABILITIES,
    toExcellentPatentRows,
    TECH_INDEX_FALLBACK_STANDARD,
    TECH_INDEX_INDICATOR_TITLES,
    toEnergyYearRows,
    RATIO_GROUP_SPECS,
    BORROWING_CHANGE_LABELS,
    INSTITUTION_LABELS,
    COLLATERAL_LABELS,
    toFixedBorrowings,
    pickYearValue,
    getRecentYears,
    isSameYear,
    getInnovationGrowthReport,
    innovationReportPath,
    withPreviewCase,
    withPreviewEmpty,
    toFixedFinanceRows,
    FINANCE_ROW_LABELS,
    toRndSlots,
    INNOVATION_REPORT_EMPTY_QUERY,
    INNOVATION_CREDIT_VISIBILITY,
    INNOVATION_REPORT_CASE_QUERY,
    INNOVATION_REPORT_CASES,
    getTechIndexGrade,
    TECH_INDEX_GRADES,
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
    INNOVATION_ISSUE_NOTE,
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
    FinanceRowLabels,
    RatioGroupSpec,
}
