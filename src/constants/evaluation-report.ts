import type {EvaluationModel} from '@/constants/evaluation-result'

// 평가결과 리포트(자가진단 결과) — 새 창으로 여는 인쇄용 문서의 고정값과 자료 모양.
//
// Figma "[KTRS-FM · 개별평가 · 심층분석]". 한 장짜리 문서가 아니라 세 개의 문서(자가진단 평가결과 ·
// 기술평가서 · 기술사업평가 세부내역)가 이어 붙은 형태다.
//
// 이 파일에는 응답이 바뀌어도 그대로인 값(등급 눈금·수준 범례·TRL 단계·평점 등급)만 둔다.
// 기업마다 달라지는 값은 content/service/evaluation-report.ts 가 준다.

// 문서 머리에 붙는 꼬리표 — 어떤 모형의 어떤 결과인지 한 줄로 알린다.
// 같은 문서라도 어느 목록에서 어느 버튼으로 열었는지에 따라 뒷말이 갈리므로(기업은 [자가진단 결과],
// 기관은 [개별평가 일반 결과]·[개별평가 심층 결과]), 화면이 모형과 함께 그 종류를 넘긴다.
const EVALUATION_REPORT_MODEL_NAMES: Record<EvaluationModel, string> = {
    'ktrs-fm': 'KTRS-FM',
    'tech-index': 'Tech-Index',
    'startup-tech-index': '창업용 Tech-Index',
    'investment-model': '개방형투자용평가모형평가',
}

/** 리포트를 연 자리 — 기업 평가결과 조회의 자가진단 결과, 기관 평가결과 조회의 일반분석·심층분석. */
type EvaluationReportKind = 'self-diagnosis' | 'general' | 'deep'

const EVALUATION_REPORT_KIND_NAMES: Record<EvaluationReportKind, string> = {
    'self-diagnosis': '자가진단 결과',
    general: '개별평가 · 일반분석',
    deep: '개별평가 · 심층분석',
}

// 개방형투자용평가모형평가는 자가진단·일반분석·심층분석으로 나누지 않고 '일반 평가' 하나다(시안).
const INVESTMENT_MODEL_REPORT_LABEL = '[개방형투자용평가모형평가 · 일반 평가]'

const getEvaluationReportLabel = (model: EvaluationModel, kind: EvaluationReportKind): string =>
    model === 'investment-model'
        ? INVESTMENT_MODEL_REPORT_LABEL
        : `[${EVALUATION_REPORT_MODEL_NAMES[model]} · ${EVALUATION_REPORT_KIND_NAMES[kind]}]`

/** 문서 폭에 맞춘 새 창 크기. 높이는 화면보다 클 수 없어 열 때 다시 줄인다(new-window-link). */
const EVALUATION_REPORT_WINDOW_WIDTH = 595
const EVALUATION_REPORT_WINDOW_HEIGHT = 900

// 등급 눈금 — 세 줄 모두 왼쪽이 가장 높은 등급이다. 받은 등급이 몇 번째 칸인지만 응답이 정한다.
const TECH_BUSINESS_GRADE_STEPS = ['AAA~AA', 'A⁺~A', 'BBB⁺~BBB', 'BB⁺~BB', 'B⁺~B', 'CCC~CC', 'C~D'] as const
const TECH_BUSINESS_GROWTH_STEPS = ['G1~G2', 'G3~G4', 'G5~G6', 'G7~G8', 'G9~G10', 'G11~G12', 'G13~G14'] as const
const TECH_BUSINESS_RISK_STEPS = ['R1~R2', 'R3~R4', 'R5~R6', 'R7~R8', 'R9~R10', 'R11~R12', 'R13~R14'] as const

// 눈금 아래 범례 — 칸의 자리가 뜻하는 수준을 색과 말로 함께 알린다[5.3.1].
const EVALUATION_LEVEL_STEPS = ['매우높음', '높음', '다소높음', '보통', '다소낮음', '낮음', '매우낮음'] as const

// 범례 칸 색 — 왼쪽(높음)이 진하고 오른쪽(낮음)이 옅다(시안). 일곱 단계를 나타낼 시맨틱 토큰이 없어
// 팔레트 단계를 쓴다[PB-05]. 옅은 세 칸은 흰 글자가 읽히지 않아 글자색을 뒤집는다[5.3.3].
const EVALUATION_LEVEL_STEP_CLASSNAMES = [
    'bg-navy-600 text-primary-foreground',
    'bg-blue-800 text-primary-foreground',
    'bg-blue-600 text-primary-foreground',
    'bg-primary text-primary-foreground',
    'bg-blue-300 text-foreground',
    'bg-blue-200 text-foreground',
    'bg-blue-100 text-foreground',
] as const

// 보증가능등급은 일정 등급(CCC) 이하에서는 내보내지 않는다. 그 경계 칸과, 시안이 그 규칙을 적어 둔
// 문구다 — 규칙(isGuaranteeGradeVisible)과 문구를 한자리에 두어 한쪽만 바뀌는 일을 막는다.
const GUARANTEE_GRADE_LIMIT_STEP = 'CCC~CC'
const GUARANTEE_GRADE_RULE_NOTE = '[보증가능등급] 문구는 일정 등급(CCC) 이하에서는 미노출'
const isGuaranteeGradeVisible = (gradeStepIndex: number): boolean =>
    gradeStepIndex < TECH_BUSINESS_GRADE_STEPS.indexOf(GUARANTEE_GRADE_LIMIT_STEP)

// 기술성숙도(TRL) — 9단계를 다섯 묶음으로 나눠 보여 준다. 단계 이름의 줄바꿈은 시안 그대로다.
type TrlStageGroup = {label: string; steps: readonly {step: number; label: string}[]}

const TRL_STAGE_GROUPS: readonly TrlStageGroup[] = [
    {
        label: '기초연구',
        steps: [
            {step: 1, label: '기초실험'},
            {step: 2, label: '개념정립'},
        ],
    },
    {
        label: '실험',
        steps: [
            {step: 3, label: '기본성능\n검증'},
            {step: 4, label: '핵심성능\n검증'},
        ],
    },
    {
        label: '시제품',
        steps: [
            {step: 5, label: '시제품\n제작'},
            {step: 6, label: '시제품\n성능평가'},
        ],
    },
    {
        label: '실용화',
        steps: [
            {step: 7, label: '시제품\n신뢰성\n평가'},
            {step: 8, label: '시제품\n인증'},
        ],
    },
    {label: '양산', steps: [{step: 9, label: '사업화'}]},
]

const TRL_STEPS = TRL_STAGE_GROUPS.flatMap((group) => group.steps)

// 기술사업 평점 세부내역의 판정 — 우수(A)에서 취약(E)까지 다섯 칸 중 하나에 표시가 선다.
const EVALUATION_RATINGS = [
    {code: 'A', label: '우수'},
    {code: 'B', label: '양호'},
    {code: 'C', label: '보통'},
    {code: 'D', label: '미흡'},
    {code: 'E', label: '취약'},
] as const

type EvaluationRatingCode = (typeof EVALUATION_RATINGS)[number]['code']

// ── 응답으로 받을 자료 모양 ────────────────────────────────────────────────────────
// [프론트엔드 연동] 조회 API 의 응답을 아래 모양으로 맞춰 주면 화면은 그대로 그린다.

/** 이름과 값 한 줄짜리 표(평가기업·평가의견). */
type EvaluationReportRow = {label: string; value: string}

/** 100점 만점 점수 한 줄(평가부문별 점수·기업 대표 5대 역량·기술사업 평점). */
type EvaluationReportScore = {label: string; score: number}

/** 개수 한 줄(동사 기술인력 현황·동사 보유 지식재산권). unit 은 '명'·'건'. */
type EvaluationReportCount = {label: string; count: number; unit: string}

/** 유사업종·유사기술 대비 동사수준 — 항목마다 신청기업 값과 비교집단의 Max·평균·Min 을 나란히 둔다. */
type EvaluationReportBenchmarkColumn = {
    label: string
    /** 신청기업 값의 소수 자릿수. 년·명·백만원은 1, 개수는 0 이다(시안). */
    fractionDigits: number
}

type EvaluationReportBenchmark = {
    id: string
    title: string
    /** 비교집단 이름 — 표 왼쪽 머리와 범례에 함께 쓴다('유사업종'·'유사기술'). */
    comparisonLabel: string
    /** 무엇과 견주었는지 알리는 표 아래 한 줄. */
    note: string
    columns: readonly EvaluationReportBenchmarkColumn[]
    applicant: readonly number[]
    maximum: readonly number[]
    average: readonly number[]
    minimum: readonly number[]
}

/** 동업종 시장규모 — 연도별 국내시장 규모(억원). */
type EvaluationReportMarketSize = {
    rowLabel: string
    unit: string
    years: readonly {year: string; value: number}[]
}

/** 기술사업평가 세부내역 — 대항목 아래 소항목마다 판정이 하나씩 선다. */
type EvaluationReportDetailGroup = {
    label: string
    items: readonly {label: string; rating: EvaluationRatingCode}[]
}

type EvaluationReport = {
    /** 문서 제목 옆 꼬리표. 모형·평가 종류가 바뀌면 이 말도 바뀐다. */
    label: string
    grade: {
        /** 화면에 크게 서는 등급 값(예: 'BBB⁺~BBB'). */
        value: string
        /** 위 세 눈금에서 각각 몇 번째 칸인지(0부터). */
        gradeStepIndex: number
        growthStepIndex: number
        riskStepIndex: number
    }
    company: readonly EvaluationReportRow[]
    opinion: readonly EvaluationReportRow[]
    gradeDescriptions: readonly string[]
    disclaimer: string
    sectionScores: readonly EvaluationReportScore[]
    competencies: readonly EvaluationReportScore[]
    /**
     * 현재 기술성숙도 단계(1~9). TRL 그래프가 받는 값은 이것 하나다 — 곡선·점의 높이는 자리가 정해진
     * 그림이라 단계별 값이 따로 없다.
     */
    trlStep: number
    engineers: readonly EvaluationReportCount[]
    intellectualProperties: readonly EvaluationReportCount[]
    benchmarks: readonly EvaluationReportBenchmark[]
    marketSize: EvaluationReportMarketSize
    totalScore: EvaluationReportScore
    detailGroups: readonly EvaluationReportDetailGroup[]
}

export {
    EVALUATION_LEVEL_STEP_CLASSNAMES,
    EVALUATION_LEVEL_STEPS,
    EVALUATION_RATINGS,
    EVALUATION_REPORT_WINDOW_HEIGHT,
    EVALUATION_REPORT_WINDOW_WIDTH,
    getEvaluationReportLabel,
    GUARANTEE_GRADE_LIMIT_STEP,
    GUARANTEE_GRADE_RULE_NOTE,
    isGuaranteeGradeVisible,
    TECH_BUSINESS_GRADE_STEPS,
    TECH_BUSINESS_GROWTH_STEPS,
    TECH_BUSINESS_RISK_STEPS,
    TRL_STAGE_GROUPS,
    TRL_STEPS,
}
export type {
    EvaluationRatingCode,
    EvaluationReportKind,
    EvaluationReport,
    EvaluationReportBenchmark,
    EvaluationReportBenchmarkColumn,
    EvaluationReportCount,
    EvaluationReportDetailGroup,
    EvaluationReportMarketSize,
    EvaluationReportRow,
    EvaluationReportScore,
    TrlStageGroup,
}
