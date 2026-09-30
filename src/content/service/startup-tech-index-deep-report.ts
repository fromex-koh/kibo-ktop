import {getEvaluationReportLabel, type EvaluationReportKind} from '@/constants/evaluation-report'
import {getStartupTechIndexReport} from '@/content/service/startup-tech-index-report'
import type {TechIndexDeepReport} from '@/content/service/tech-index-deep-report'
import type {TechIndexReport} from '@/content/service/tech-index-report'

// 창업용 Tech-Index 심층분석(A4 세 장)의 값.
// 화면: 기관 /org/mypage/evaluation-history/deep-analysis/startup-tech-index
//
// [프론트엔드 연동] 화면은 아래 getStartupTechIndexDeepScreen 하나만 부르고, 이 함수가 세 장의 값을 한 번에
// 돌려준다. 조회 API 를 붙일 때는 이 함수 안에서 1쪽·2·3쪽 값을 각각 실제 응답으로 바꾸면 되고,
// 화면 파일(page.tsx)과 그리는 컴포넌트는 고치지 않는다.
//
// 1쪽 값은 일반분석과 같은 문서라 startup-tech-index-report.ts 가 관리한다(여기서 가져다 합친다).
// 문서 모양은 일반 Tech-Index 심층분석과 같고(TechIndexDeepReport), 창업용만 다른 것은 두 가지다 —
// 세부지표 레이더의 축 이름, 산업 구분 이름(업종 설명이 괄호로 붙는다).

// ── 목업(API 연결 시 교체) ────────────────────────────────────────────────────────
// 값은 항목마다 그대로 적는다 — 반복문이나 공용 상수로 줄이면 화면에서 본 숫자를 코드에서 찾기 어렵다.

const MOCK_STARTUP_TECH_INDEX_DEEP_REPORT: Omit<TechIndexDeepReport, 'label'> = {
    distribution: {
        mean: 50.5,
        standardDeviation: 18,
        value: 73.7,
        markerLabel: '상위 2.2%',
        legendLabel: '전체 (평균 50.5점)',
        yTicks: [4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5],
    },
    distributionSummary:
        '신청기업 **테스트**의 Tech-Index는 73.7점으로,\n기술보증기금의 전체 중소기업 Tech-Index 표준정보 분포와 비교시 **상위 2.2% 이내** 수준에 해당합니다.',
    competencyComparisons: [
        {label: '인프라', applicant: 63.7, average: 37.5},
        {label: '투입', applicant: 88.2, average: 41.3},
        {label: '활동', applicant: 53.4, average: 35.8},
        {label: '성과', applicant: 37.1, average: 33.2},
    ],
    // 창업용은 축이 다르다 — 왼쪽 일곱(자산 · 역량), 오른쪽 여섯(기술 · 특허).
    detailRadars: [
        {
            id: 'asset',
            axes: [
                {label: '무형자산', applicant: 74, average: 40},
                {label: '인적자산투자', applicant: 70, average: 38},
                {label: '고객자산투자', applicant: 66, average: 37},
                {label: '혁신자산투자', applicant: 80, average: 41},
                {label: '기술인력역량', applicant: 78, average: 42},
                {label: '경영진역량', applicant: 72, average: 39},
                {label: '대표자역량', applicant: 75, average: 40},
            ],
        },
        {
            id: 'patent',
            axes: [
                {label: '기술개발상용화', applicant: 80, average: 43},
                {label: '특허출원', applicant: 82, average: 44},
                {label: '기술인증', applicant: 77, average: 42},
                {label: '기술활용상용화', applicant: 66, average: 38},
                {label: '특허등록', applicant: 74, average: 41},
                {label: '기술개발', applicant: 72, average: 40},
            ],
        },
    ],
    companyTypeScores: [
        {id: 'applicant', label: '신청기업', value: 63.7, isApplicant: true},
        {id: 'all', label: '전체기업', value: 37.5},
        {id: 'startup', label: '창업', value: 34.2},
        {id: 'non-startup', label: '비창업', value: 39.6},
        {id: 'venture', label: '벤처', value: 45.1},
        {id: 'innobiz', label: '이노비즈', value: 43.8},
    ],
    competencyTypeCharts: [
        {
            id: 'infra',
            title: '인프라',
            items: [
                {id: 'applicant', label: '신청기업', value: 63.7, isApplicant: true},
                {id: 'startup', label: '창업', value: 35.4},
                {id: 'non-startup', label: '비창업', value: 40.2},
                {id: 'venture', label: '벤처', value: 46.8},
                {id: 'innobiz', label: '이노비즈', value: 44.1},
            ],
        },
        {
            id: 'input',
            title: '투입',
            items: [
                {id: 'applicant', label: '신청기업', value: 88.2, isApplicant: true},
                {id: 'startup', label: '창업', value: 38.9},
                {id: 'non-startup', label: '비창업', value: 42.5},
                {id: 'venture', label: '벤처', value: 49.3},
                {id: 'innobiz', label: '이노비즈', value: 47.6},
            ],
        },
        {
            id: 'activity',
            title: '활동',
            items: [
                {id: 'applicant', label: '신청기업', value: 53.4, isApplicant: true},
                {id: 'startup', label: '창업', value: 32.7},
                {id: 'non-startup', label: '비창업', value: 36.4},
                {id: 'venture', label: '벤처', value: 42.9},
                {id: 'innobiz', label: '이노비즈', value: 41.2},
            ],
        },
        {
            id: 'outcome',
            title: '성과',
            items: [
                {id: 'applicant', label: '신청기업', value: 37.1, isApplicant: true},
                {id: 'startup', label: '창업', value: 29.8},
                {id: 'non-startup', label: '비창업', value: 33.5},
                {id: 'venture', label: '벤처', value: 38.7},
                {id: 'innobiz', label: '이노비즈', value: 36.9},
            ],
        },
    ],
    // 창업용은 산업 구분 이름에 업종 설명이 괄호로 붙어 두 줄로 선다.
    industryPeers: [
        {id: 'applicant', label: '신청기업\nS1', value: 63.7, isApplicant: true},
        {id: 'M1', label: 'M1\n(금속)', value: 41.5},
        {id: 'M2', label: 'M2\n(기계)', value: 38.2},
        {id: 'M3', label: 'M3\n(전기전자)', value: 44.7},
        {id: 'M4', label: 'M4\n(화학섬유)', value: 36.9},
        {id: 'M5', label: 'M5\n(환경바이오)', value: 39.8},
        {id: 'M6', label: 'M6\n(기타제조)', value: 35.1},
        {id: 'S1', label: 'S1(SW\n개발구축)', value: 46.3},
        {id: 'S2', label: 'S2\n(IT서비스)', value: 42.8},
        {id: 'S3', label: 'S3(엔지\n니어링서비스)', value: 37.4},
        {id: 'S4', label: 'S4\n(기타서비스)', value: 34.6},
    ],
    regionPeers: [
        {id: 'applicant', label: '신청기업\n(서울)', value: 63.7, isApplicant: true},
        {id: '서울', label: '서울', value: 46.2},
        {id: '경기', label: '경기', value: 44.8},
        {id: '충남', label: '충남', value: 38.1},
        {id: '대전', label: '대전', value: 42.6},
        {id: '인천', label: '인천', value: 39.4},
        {id: '부산', label: '부산', value: 37.9},
        {id: '경남', label: '경남', value: 36.5},
        {id: '강원', label: '강원', value: 33.2},
        {id: '대구', label: '대구', value: 38.7},
        {id: '충북', label: '충북', value: 37.1},
        {id: '세종', label: '세종', value: 41.3},
        {id: '울산', label: '울산', value: 35.8},
        {id: '경북', label: '경북', value: 34.9},
        {id: '광주', label: '광주', value: 36.8},
        {id: '전북', label: '전북', value: 33.6},
        {id: '제주', label: '제주', value: 31.4},
        {id: '전남', label: '전남', value: 32.7},
    ],
}

/** 화면 한 벌 — 1쪽(혁신성장역량 평가결과)과 2·3쪽(기술평가서) 값이다. */
type StartupTechIndexDeepScreen = {report: TechIndexReport; deepReport: TechIndexDeepReport}

// [프론트엔드 연동] 창업용 Tech-Index 심층분석 조회 API 로 바꾼다 — 화면은 이 함수 하나만 부른다.
const getStartupTechIndexDeepScreen = async (
    kind: EvaluationReportKind = 'deep',
): Promise<StartupTechIndexDeepScreen> => ({
    report: await getStartupTechIndexReport(kind),
    deepReport: {...MOCK_STARTUP_TECH_INDEX_DEEP_REPORT, label: getEvaluationReportLabel('startup-tech-index', kind)},
})

export {getStartupTechIndexDeepScreen}
export type {StartupTechIndexDeepScreen}
