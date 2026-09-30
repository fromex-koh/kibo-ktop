import {getEvaluationReportLabel, type EvaluationReportKind} from '@/constants/evaluation-report'
import type {ReportTableRow} from '@/components/custom/report-document'

// 투자모형 일반분석 리포트 — 새 창으로 여는 인쇄용 문서(A4 한 장)의 값과 문구.
// 화면: 기업 /corp/mypage/evaluation-results/general-analysis/investment-model
//       기관 /org/mypage/evaluation-history/general-analysis/investment-model
//
// [프론트엔드 연동] 문서에 나오는 값과 문구는 모두 이 파일에 있다 — 화면 파일을 열지 않고 여기서 고친다.
// 바꾸는 자리: 아래 '목업(API 연결 시 교체)' 구역. 조회 API 를 붙일 때는 목업 대신 응답을 같은
// 모양(InvestmentModelReport)으로 맞춰 getInvestmentModelReport 가 돌려주게 하면 화면은 그대로 그린다.

/** 등급 구간 묶음 — 표 머리의 '우수 · 양호 · 보통 · 미흡 · 매우 낮음'. span 은 그 묶음이 차지하는 칸 수다. */
type InvestmentGradeBand = {label: string; span: number}

/**
 * 등급 줄 하나 — 이 배열 하나가 게이지와 표를 함께 만든다(표는 이 차례대로, 게이지는 강조가 가운데).
 * grades 는 좋은 등급부터 차례로 넣고, stepIndex 는 그중 받은 등급의 자리(0부터)다.
 */
type InvestmentGradeRow = {
    id: string
    /** 표 왼쪽 이름(최종 · 성장 · 밸류업). */
    label: string
    /** 게이지 아래 이름(최종등급 · 성장등급 · 밸류업등급). */
    gaugeLabel: string
    grades: readonly string[]
    stepIndex: number
    /** 강조할 줄. 게이지에서 가운데에 크게 선다 — 한 줄에만 준다(최종등급). */
    isPrimary?: boolean
}

type InvestmentModelReport = {
    /** 문서 제목 옆 꼬리표. */
    label: string
    /**
     * 등급 줄 셋. 표는 이 차례대로 그리고, 게이지는 isPrimary 인 줄을 가운데 크게 둔다.
     * 줄을 더하거나 빼면 표와 게이지가 함께 따라간다.
     */
    rows: readonly InvestmentGradeRow[]
    bands: readonly InvestmentGradeBand[]
    /**
     * 게이지 아래 요약 문장. 별 두 개(**…**)로 감싼 부분이 굵게 선다.
     * [프론트엔드 연동] 기업명·등급이 들어가는 문장이라 조각내지 않고 한 덩어리로 받는다.
     * 두 줄까지는 A4 한 장에 들어간다 — 세 줄이 되면 다음 장이 생기므로 기업명이 길어질 때 확인한다.
     */
    summary: string
    company: readonly ReportTableRow[]
    gradeDescriptions: readonly string[]
    /** 유의사항. 굵은 글자 없이 한 덩어리로 그린다. */
    disclaimer: string
}

const INVESTMENT_MODEL_DOCUMENT_TITLE = '투자용 평가결과'
const INVESTMENT_MODEL_SECTION_TITLE = '투자용 평가결과'

// 등급 구간 — 14 단계를 다섯 묶음으로 나눈다. 묶음의 칸 수 합이 등급 수와 같아야 표가 어긋나지 않는다.
const INVESTMENT_GRADE_BANDS: readonly InvestmentGradeBand[] = [
    {label: '우수', span: 2},
    {label: '양호', span: 4},
    {label: '보통', span: 4},
    {label: '미흡', span: 2},
    {label: '매우 낮음', span: 2},
]

// 등급 이름 — 앞자리(TI · G · V)만 다르고 1~14 로 같다. 줄마다 그대로 적어 두어 화면에서 본 등급이
// 어느 줄에서 오는지 바로 찾을 수 있게 한다.
const FINAL_GRADES = [
    'TI1',
    'TI2',
    'TI3',
    'TI4',
    'TI5',
    'TI6',
    'TI7',
    'TI8',
    'TI9',
    'TI10',
    'TI11',
    'TI12',
    'TI13',
    'TI14',
] as const
const GROWTH_GRADES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14'] as const
const VALUEUP_GRADES = [
    'V1',
    'V2',
    'V3',
    'V4',
    'V5',
    'V6',
    'V7',
    'V8',
    'V9',
    'V10',
    'V11',
    'V12',
    'V13',
    'V14',
] as const

// ── 목업(API 연결 시 교체) ────────────────────────────────────────────────────────

const MOCK_INVESTMENT_MODEL_REPORT: Omit<InvestmentModelReport, 'label'> = {
    rows: [
        {id: 'final', label: '최종', gaugeLabel: '최종등급', grades: FINAL_GRADES, stepIndex: 2, isPrimary: true},
        {id: 'growth', label: '성장', gaugeLabel: '성장등급', grades: GROWTH_GRADES, stepIndex: 2},
        {id: 'valueup', label: '밸류업', gaugeLabel: '밸류업등급', grades: VALUEUP_GRADES, stepIndex: 2},
    ],
    bands: INVESTMENT_GRADE_BANDS,
    summary: '신청기업 **스타트업A**에 대하여 투자용평가를 수행한 결과, **TI3등급**으로 평가되었습니다.',
    company: [
        {label: '회사명', value: '㈜테크놀로지'},
        {label: '대표자', value: '홍길동'},
        {label: '법인(주민)번호', value: '100000-*******'},
        {label: '사업자번호', value: '123-45-67890'},
        {label: '설립일자', value: '2020-04-27'},
        {label: '주소', value: '(08500) 서울특별시 금천구 가산디지털1로 168'},
    ],
    gradeDescriptions: [
        '투자용평가등급: 기업의 성장과 밸류업 관점에서 기술성, 사업타당성, 기업가치 도약가능성 등을 종합평가하여 산출한 등급(TI1~TI14)',
        '성장투자등급: 기술사업의 성장 관점에서 기술성, 시장성, 사업성 등을 평가하여 산출한 등급(G1~G14)',
        '밸류업등급: 기업의 밸류업 관점에서 가치 도약가능성 등 평가하여 산출한 등급(V1~V14)',
    ],
    disclaimer:
        '본 자료는 어떠한 경우에도 당 기금의 서면동의 없이 무단전재, 복사, 배포될 수 없습니다. 또한 본 자료에 수록된 내용은 당 기금이 신뢰할 만한 자료 및 정보로부터 얻어진 것이나 그 정확성이나 완전성을 보장할 수 없으므로 고객의 판단과 책임하에 최종 의사결정을 하시기 바랍니다. 따라서 어떠한 경우에도 본 자료는 고객의 의사 결정에 대한 법적 책임소재의 증빙자료로 사용될 수 없습니다.',
}

// [프론트엔드 연동] 투자모형 리포트 조회 API 로 바꾼다 — 화면(page.tsx)은 이 함수만 부른다.
// 문서 꼬리표도 여기서 만든다 — 기업과 기관이 같은 문서를 다른 메뉴에서 열어 앞말만 갈린다:
//   기업 'tech-general' → [투자모형 · 기술평가 · 일반분석]
//   기관 'general'      → [투자모형 · 개별평가 · 일반분석]
const getInvestmentModelReport = async (
    kind: EvaluationReportKind = 'tech-general',
): Promise<InvestmentModelReport> => ({
    ...MOCK_INVESTMENT_MODEL_REPORT,
    label: getEvaluationReportLabel('investment-model', kind),
})

export {
    getInvestmentModelReport,
    INVESTMENT_GRADE_BANDS,
    INVESTMENT_MODEL_DOCUMENT_TITLE,
    INVESTMENT_MODEL_SECTION_TITLE,
}
export type {InvestmentGradeBand, InvestmentGradeRow, InvestmentModelReport}
