import {getEvaluationReportLabel, type EvaluationReport, type EvaluationReportKind} from '@/constants/evaluation-report'
import type {EvaluationModel} from '@/constants/evaluation-result'

// 평가결과 리포트(자가진단 결과) 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getEvaluationReport(모형, 연 자리) 하나만 부른다 — 목업을 실제 조회 API 로
// 바꿀 때 고칠 파일은 여기뿐이고 리포트 화면·조각 컴포넌트는 건드리지 않는다.
//   1) MOCK_EVALUATION_REPORT 를 지우고
//   2) getEvaluationReport 안에서 조회 API 를 부른 뒤
//   3) 응답을 EvaluationReport(= 문서 한 벌) 모양으로 맞춰 돌려준다.
// 어느 평가 건인지는 아직 인자가 없다 — 연동 시 평가 id 를 받는 인자를 덧붙이고, 화면이 주소의 조회
// 문자열에서 읽어 넘기면 된다(지금은 같은 모형이면 어떤 건으로 들어와도 같은 문서를 보여 준다).
//
// 모형은 네 가지다(KTRS-FM · Tech-Index · 창업용 Tech-Index · 개방형투자용평가모형평가). 시안이 확정된
// 것은 KTRS-FM 한 건뿐이라, 나머지 세 모형은 같은 문서에 모형별 꼬리표만 바꿔 두었다 — 각 모형의 시안이
// 나오면 MOCK_EVALUATION_REPORT 를 모형별 값으로 나누면 된다.
//
// 값의 뜻과 단위는 constants/evaluation-report.ts 의 타입 주석에 적혀 있다. 등급 눈금·수준 범례·
// TRL 단계·평점 등급처럼 기업이 달라져도 그대로인 값은 응답이 아니라 그 파일이 들고 있다.

const MOCK_EVALUATION_REPORT: Omit<EvaluationReport, 'label'> = {
    // BBB⁺~BBB 는 평가등급 눈금의 세 번째 칸이다. 성장등급은 G3~G4(두 번째), 위험등급은 R13~R14(일곱 번째).
    grade: {value: 'BBB⁺~BBB', gradeStepIndex: 2, growthStepIndex: 1, riskStepIndex: 6},
    company: [
        {label: '회사명', value: '㈜테크놀로지'},
        {label: '대표자', value: '홍길동'},
        {label: '법인(주민)번호', value: '110111-1234567'},
        {label: '사업자번호', value: '123-45-67890'},
        {label: '설립일자', value: '2020-04-27'},
        {label: '주소', value: '(08500) 서울특별시 금천구 가산디지털1로 168'},
    ],
    opinion: [
        {label: '평가기술', value: '고효율 에너지 저장 시스템 및 지능형 제어 기술'},
        {
            label: '기술요약',
            value: '배터리 관리 시스템(BMS)과 전력변환 기술을 결합하여 에너지 효율을 개선하는 기술로, 관련 특허를 다수 보유하고 있음.',
        },
        {
            label: '종합의견',
            value: '신청기업은 최상위 수준의 기술사업 역량을 확보하고 있으며, 기술의 사업화 과정에서 발생 가능한 사업화 위험을 종합적으로 반영하여 최종 기술사업평가등급은 AA 등급으로 평가되었습니다.',
        },
        {label: '평가기준일', value: '2026-05-15'},
    ],
    gradeDescriptions: [
        '기술사업평가등급: 기술사업의 성장과 사업화위험 관점에서 기술성과 사업타당성을 종합평가하여 산출한 등급 (AAA–D)',
        '기술사업성장등급: 기술사업의 성장 관점에서 기술성·시장성·사업성 등을 평가하여 산출한 등급 (G1–G14)',
        '기술사업위험등급: 기술사업의 사업화위험 관점에서 기술성·시장성·사업성 등을 평가하여 산출한 등급 (R1–R14)',
    ],
    disclaimer:
        '본 자료는 어떠한 경우에도 당 기금의 서면동의 없이 무단전재·복사·배포될 수 없습니다. 또한 본 자료에 수록된 내용은 당 기금이 신뢰할 만한 자료 및 정보로부터 얻어진 것이나 그 정확성이나 완전성을 보장할 수 없으므로 고객의 판단과 책임하에 최종 의사결정을 하시기 바랍니다. 따라서 어떠한 경우에도 본 자료는 고객의 의사결정에 대한 법적 책임소재의 증빙자료로 사용될 수 없습니다.',
    sectionScores: [
        {label: '경영주 역량', score: 78.0},
        {label: '기술성', score: 89.0},
        {label: '시장·사업성', score: 96.0},
    ],
    // 표에 적히는 차례 그대로 둔다. 레이더 차트는 이 차례를 꼭짓점에 그대로 얹는다(맨 위가 마지막 항목).
    competencies: [
        {label: '혁신성', score: 92.3},
        {label: '원천성', score: 85.0},
        {label: '생산성', score: 85.5},
        {label: '수익성', score: 92.3},
        {label: '지속가능성', score: 64.0},
    ],
    // 기술성숙도(TRL) — 응답이 주는 값은 "지금 몇 단계인가" 하나뿐이다(1~9).
    // 곡선과 아홉 개의 점은 자리가 정해진 그림이라 단계마다 꽂히는 값이 없다 — 이 숫자 하나로
    // 그 자리의 점이 채워지고, 아래 표의 같은 칸(단계·내용)이 강조된다.
    trlStep: 8,
    // 학력 구분 네 칸(시안 "동사 기술인력 현황"). 왼쪽 위에서 오른쪽으로 읽는 차례 그대로다.
    engineers: [
        {label: '박사/기술사/기능장', count: 2, unit: '명'},
        {label: '석사/학사/기사', count: 2, unit: '명'},
        {label: '전문학사/산업기사/기능사', count: 18, unit: '명'},
        {label: '고졸이하', count: 2, unit: '명'},
    ],
    intellectualProperties: [
        {label: '특허등록', count: 2, unit: '건'},
        {label: '특허출원', count: 10, unit: '건'},
        {label: '품종보호권', count: 0, unit: '건'},
        {label: '실용신안등록', count: 1, unit: '건'},
        {label: '실용신안출원', count: 9, unit: '건'},
        {label: '기타', count: 4, unit: '건'},
    ],
    benchmarks: [
        {
            id: 'similar-industry',
            title: '유사업종 기업 대비 동사수준',
            comparisonLabel: '유사업종',
            note: '* 비교대상 업종 : (S1) S/W개발구축',
            columns: [
                {label: '대표자 경력\n(년)', fractionDigits: 1},
                {label: '기술인력 수\n(명)', fractionDigits: 1},
                {label: '종업원 수\n(명)', fractionDigits: 0},
                {label: '특허등록 수\n(개)', fractionDigits: 0},
                {label: '기술개발\n실적(개)', fractionDigits: 0},
                {label: '대표인력\n경력(년)', fractionDigits: 1},
                {label: '매출액\n(백만원)', fractionDigits: 1},
            ],
            applicant: [16.3, 18.0, 40, 0, 0, 20.0, 9602.0],
            maximum: [33.0, 11.0, 43.0, 6.0, 4.0, 30.5, 9653.0],
            average: [10.5, 5.5, 5.5, 0.5, 0.9, 9.7, 792.0],
            minimum: [3.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        },
        {
            id: 'similar-technology',
            title: '유사기술 대비 동사수준',
            comparisonLabel: '유사기술',
            note: '* 비교대상 기술 : (G) 물리학',
            columns: [
                {label: '대표자 경력\n(년)', fractionDigits: 1},
                {label: '기술인력 수\n(명)', fractionDigits: 1},
                {label: '종업원 수\n(명)', fractionDigits: 0},
                {label: '특허등록 수\n(개)', fractionDigits: 0},
                {label: '기술개발\n실적(개)', fractionDigits: 0},
                {label: '대표인력\n경력(년)', fractionDigits: 1},
                {label: '매출액\n(백만원)', fractionDigits: 1},
            ],
            applicant: [16.3, 18.0, 40, 0, 0, 20.0, 9602.0],
            maximum: [33.0, 11.0, 43.0, 6.0, 4.0, 30.5, 9653.0],
            average: [10.5, 5.5, 5.5, 0.5, 0.9, 9.7, 792.0],
            minimum: [3.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        },
    ],
    marketSize: {
        rowLabel: '국내시장',
        unit: '억원',
        years: [
            {year: '2020', value: 165948},
            {year: '2021', value: 192509},
            {year: '2022', value: 256320},
            {year: '2023', value: 255131},
            {year: '2024', value: 2009},
        ],
    },
    totalScore: {label: '기술사업 평점', score: 87.8},
    detailGroups: [
        {
            label: '1. 경영주 역량',
            items: [
                {label: '1.1 기술역량수준', rating: 'A'},
                {label: '1.2 기술창업역량', rating: 'B'},
            ],
        },
        {
            label: '2. 기술성',
            items: [
                {label: '2.1 기술디자인인력', rating: 'A'},
                {label: '2.2 기술개발 및 지식재산권', rating: 'A'},
                {label: '2.3 기술의 차별성', rating: 'A'},
            ],
        },
        {
            label: '3. 시장사업성',
            items: [
                {label: '3.1 동사 시장 규모 및 성장성', rating: 'A'},
                {label: '3.2 자금조달능력', rating: 'A'},
                {label: '3.3 생산역량', rating: 'A'},
                {label: '3.4 판매처의 다양성 및 안정성', rating: 'B'},
                {label: '3.5 수익창출역량', rating: 'A'},
            ],
        },
    ],
}

// kind 는 리포트를 연 자리다 — 기업 [자가진단 결과]('self-diagnosis')와 기관 [개별평가 일반 결과]
// ('general')는 자가진단 평가결과 한 벌, 기관 [개별평가 심층 결과]('deep')는 거기에 기술평가서와
// 세부내역이 더 붙는다. 문서 꼬리표도 이 값에 따라 갈린다.
const getEvaluationReport = async (model: EvaluationModel, kind: EvaluationReportKind): Promise<EvaluationReport> => ({
    ...MOCK_EVALUATION_REPORT,
    label: getEvaluationReportLabel(model, kind),
})

export {getEvaluationReport}
