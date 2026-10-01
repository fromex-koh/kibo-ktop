import {getEvaluationReportLabel, type EvaluationReportKind} from '@/constants/evaluation-report'
import {getInvestmentModelReport, type InvestmentModelReport} from '@/content/service/investment-model-report'
import type {PeerColumnItem} from '@/components/custom/peer-column-chart'
import type {PositioningScatterPoint} from '@/components/custom/positioning-scatter-chart'
import type {TechIndexComparison} from '@/content/service/tech-index-deep-report'

// 투자모형 심층분석(A4 세 장)의 값.
// 화면: 기관 /org/mypage/evaluation-history/deep-analysis/investment-model
//
// [프론트엔드 연동] 화면은 아래 getInvestmentModelDeepScreen 하나만 부르고, 이 함수가 세 장의 값을 한 번에
// 돌려준다. 조회 API 를 붙일 때는 이 함수 안에서 1쪽·2·3쪽 값을 각각 실제 응답으로 바꾸면 되고,
// 화면 파일(page.tsx)과 그리는 컴포넌트는 고치지 않는다.
//
// 1쪽 값은 일반분석과 같은 문서라 investment-model-report.ts 가 관리한다(여기서 가져다 합친다).

/** 등급 체계 표의 한 줄 — 평가등급과 그 뜻. */
type InvestmentGradeDefinition = {grade: string; definition: string}

type InvestmentModelDeepReport = {
    /** 문서 제목 옆 꼬리표. */
    label: string
    /** 성장·밸류업 포지셔닝 — 당사 한 점과 표본 기업들의 자리(0~100). */
    positioning: {
        points: readonly PositioningScatterPoint[]
        /** 범례에 적는 표본 수 설명(예: '피어 그룹 중 표본 14개사'). */
        peerLegendLabel: string
    }
    /** PEER GROUP(업종) 세부항목비교 — 레이더 둘(왼쪽 역량 · 오른쪽 사업). */
    detailRadars: readonly {id: string; axes: readonly TechIndexComparison[]}[]
    /** PEER GROUP(업종) 재무지표비교 — 당사와 피어 평균을 견주는 막대 넷. */
    financialComparisons: readonly PeerColumnItem[]
    /** 투자용 기술평가등급 체계 — TI1~TI14 의 뜻. */
    gradeDefinitions: readonly InvestmentGradeDefinition[]
}

const INVESTMENT_MODEL_DEEP_DOCUMENT_TITLE = '기술평가서'

// ── 목업(API 연결 시 교체) ────────────────────────────────────────────────────────
// 값은 항목마다 그대로 적는다 — 반복문이나 공용 상수로 줄이면 화면에서 본 숫자를 코드에서 찾기 어렵다.

const MOCK_INVESTMENT_MODEL_DEEP_REPORT: Omit<InvestmentModelDeepReport, 'label'> = {
    positioning: {
        peerLegendLabel: '피어 그룹 중 표본 14개사',
        points: [
            {id: 'applicant', x: 78, y: 82, isPrimary: true},
            {id: 'peer-1', x: 26, y: 62},
            {id: 'peer-2', x: 41, y: 70},
            {id: 'peer-3', x: 47, y: 55},
            {id: 'peer-4', x: 43, y: 45},
            {id: 'peer-5', x: 29, y: 36},
            {id: 'peer-6', x: 22, y: 30},
            {id: 'peer-7', x: 35, y: 33},
            {id: 'peer-8', x: 50, y: 32},
            {id: 'peer-9', x: 54, y: 24},
            {id: 'peer-10', x: 57, y: 37},
            {id: 'peer-11', x: 62, y: 28},
            {id: 'peer-12', x: 66, y: 43},
            {id: 'peer-13', x: 69, y: 47},
            {id: 'peer-14', x: 58, y: 60},
        ],
    },
    detailRadars: [
        {
            id: 'capability',
            axes: [
                {label: '동업종 경험수준', applicant: 78, average: 42},
                {label: '목표시장', applicant: 74, average: 40},
                {label: '기술우위성', applicant: 82, average: 43},
                {label: '기술지식수준', applicant: 76, average: 41},
                {label: '기술(디자인)인력수준', applicant: 70, average: 39},
                {label: '지식재산권', applicant: 66, average: 38},
                {label: '고용성장', applicant: 72, average: 40},
                {label: '경영진', applicant: 75, average: 41},
            ],
        },
        {
            id: 'business',
            axes: [
                {label: '생산 및 품질관리', applicant: 80, average: 43},
                {label: '수익창출역량', applicant: 77, average: 42},
                {label: '사업모델', applicant: 83, average: 44},
                {label: '기술사업계획', applicant: 79, average: 42},
                {label: '투자위험요소', applicant: 68, average: 38},
                {label: '외부자금 조달', applicant: 64, average: 37},
                {label: '판매처 확보', applicant: 71, average: 39},
                {label: '시장경쟁수준', applicant: 74, average: 40},
            ],
        },
    ],
    financialComparisons: [
        {id: 'return-on-equity', label: '총자본순이익율', value: 63.7, comparisonValue: 37.5, isApplicant: true},
        {id: 'operating-margin', label: '매출액영업이익률', value: 58.2, comparisonValue: 35.1, isApplicant: true},
        {id: 'net-income-growth', label: '순이익증가율', value: 66.4, comparisonValue: 39.8, isApplicant: true},
        {id: 'net-margin', label: '매출액순이익률', value: 61.9, comparisonValue: 36.7, isApplicant: true},
    ],
    gradeDefinitions: [
        {
            grade: 'TI1 (AAA)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 매우 높아 장기적으로 성장이 확실시되고, 밸류 업어 가능성이 매우 높음',
        },
        {
            grade: 'TI2 (AA)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 매우 높아 장기적으로 성장할 가능성이 매우 높고, 밸류업 가능성이 높음',
        },
        {
            grade: 'TI3 (A+)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 높아 장기적으로 성장할 가능성이 높고, 밸류업가능성이 높음',
        },
        {
            grade: 'TI4 (A)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 높아 장기적으로 성장할 가능성이 다소 높고, 밸류업 가능성이 높음',
        },
        {
            grade: 'TI5 (BBB+)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 다소 높아 장기적으로 성장할 가능성이 일반수준보다 약간 높고, 밸류업 가능성이 다소 높음',
        },
        {
            grade: 'TI6 (BBB)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 다소 높아 장기적으로 성장할 가능성이 보통이고, 밸류업 가능성이 다소 높음',
        },
        {
            grade: 'TI7 (BB+)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준으로 중기적으로는 성장세 유지\n할 가능성이 매우 높고, 밸류업 가능성이 보통임',
        },
        {
            grade: 'TI8 (BB)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준으로 중기적으로는 성장세 유지\n할 가능성이 높고, 밸류업 가능성이 보통임',
        },
        {
            grade: 'TI9 (B+)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준으로 당분간 성장세 유지할 것으\n로 예상되고, 투자회수 가능성이 다소 낮음',
        },
        {
            grade: 'TI10 (B)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준으로 당분간 성장세 유지할 가능성이 보통이고, 밸류업 가능성이 다소 낮음',
        },
        {
            grade: 'TI11 (CCC)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준보다 낮아 장기 성장 가능성은 다소 낮고, 밸류업 가능성이 다소 의문시 됨',
        },
        {
            grade: 'TI12 (CC)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준보다 낮아 장기 성장 가능성은 상당히 낮고, 밸류업 가능성이 의문시 됨',
        },
        {
            grade: 'TI13 (C)',
            definition:
                '기술력 기반의 미래 성장 가능성 수준이 일반 수준보다 매우 낮아 장기적으로 성장\n가능성은 매우 낮고, 밸류업 가능성이 매우 낮음',
        },
        {grade: 'TI14 (D)', definition: '기 사고 발생상태'},
    ],
}

/** 화면 한 벌 — 1쪽(투자용 평가결과)과 2·3쪽(기술평가서) 값이다. */
type InvestmentModelDeepScreen = {report: InvestmentModelReport; deepReport: InvestmentModelDeepReport}

// [프론트엔드 연동] 투자모형 심층분석 조회 API 로 바꾼다 — 화면은 이 함수 하나만 부른다.
const getInvestmentModelDeepScreen = async (
    kind: EvaluationReportKind = 'deep',
): Promise<InvestmentModelDeepScreen> => ({
    report: await getInvestmentModelReport(kind),
    deepReport: {...MOCK_INVESTMENT_MODEL_DEEP_REPORT, label: getEvaluationReportLabel('investment-model', kind)},
})

export {getInvestmentModelDeepScreen, INVESTMENT_MODEL_DEEP_DOCUMENT_TITLE}
export type {InvestmentGradeDefinition, InvestmentModelDeepReport, InvestmentModelDeepScreen}
