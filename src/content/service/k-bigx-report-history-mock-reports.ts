import type {PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import {donutColorsFor} from '@/components/custom/percentage-donut-colors'
import type {KBigxReportHistoryItem} from '@/constants/k-bigx-report-history'
import type {InnovationGrowthReport, InnovationRankItem} from '@/content/service/k-bigx-innovation-report'
import {getKBigxReportHistory} from '@/content/service/k-bigx-report-history'
import {getOrgKBigxReportHistory} from '@/content/service/org-k-bigx-report-history'

// [퍼블리싱 전용 · API 연결 시 삭제] 마이페이지 K-BIGx 보고서 이력 카드별 보고서 목업.
//   지울 것: 이 파일 + k-bigx-innovation-report.ts 의 import 1줄 · getInnovationGrowthReport 안 호출 2줄.
//   프론트엔드 연동에는 이 파일의 내용이 필요 없다 — 실제로는 보고서 API 가 reportId 마다 그 보고서를 내려 준다.
//
// 하는 일: 이력 카드의 id 로 열면 기본 목업(프롬엑스테크 한 건) 위에 그 카드 · 기업 값을 덮어써 카드마다 다른 보고서를 만든다.
// 기본 목업은 바꾸지 않으므로 웹 보고서는 이전과 같다.
//   · 카드 값 → 기업명 · 제목(특허명) · 발급일 · 조회기준일(조회일시)
//   · 기업별 프로필(MOCK_HISTORY_COMPANY_PROFILES, 기업명으로 찾음) → 기업 개요 · 분야 · 특허 · 점수 · 등급 · 금액 배율 · 인원
//   · 그 밖의 값(문구 · 날짜 · 업종 평균 · 경쟁사 · 거래처 · R&D 기관 · 정부 과제 · viewerCase)은 기본 목업 그대로
// 값은 모두 지어낸 예시다(등록번호 · 주소 포함). 프로필이 없는 기업은 카드 값만 바뀐다.

type ReportLabelValue = InnovationGrowthReport['company']['rows'][number]

const MOCK_HISTORY_COMPANY_NAME_LABEL = '기업명'
const MOCK_HISTORY_REPRESENTATIVE_LABEL = '대표자'

// 보유기술 도넛(세부분야) — 기업마다 분야 이름 7개(비중 큰 순) + '기타'. 비중 · 건수는 아래 세 분포를 돌려 쓴다.
// 셋 다 기본 목업과 같은 보유 특허 48건 기준이다.
const MOCK_HISTORY_TECH_OTHER_LABEL = '기타'
const MOCK_HISTORY_TECH_SHARES = [
    [
        {percentage: 50, count: 24},
        {percentage: 15, count: 7},
        {percentage: 11, count: 5},
        {percentage: 8, count: 4},
        {percentage: 6, count: 3},
        {percentage: 4, count: 2},
        {percentage: 4, count: 2},
        {percentage: 2, count: 1},
    ],
    [
        {percentage: 44, count: 21},
        {percentage: 19, count: 9},
        {percentage: 13, count: 6},
        {percentage: 10, count: 5},
        {percentage: 6, count: 3},
        {percentage: 4, count: 2},
        {percentage: 2, count: 1},
        {percentage: 2, count: 1},
    ],
    [
        {percentage: 38, count: 18},
        {percentage: 21, count: 10},
        {percentage: 15, count: 7},
        {percentage: 10, count: 5},
        {percentage: 8, count: 4},
        {percentage: 4, count: 2},
        {percentage: 2, count: 1},
        {percentage: 2, count: 1},
    ],
] as const
// R&D 이슈 워드클라우드 — 기업마다 단어 18개를 중요도 높은 순으로 두고, 중요도는 목업과 같은 값을 순서대로 붙인다.
const MOCK_HISTORY_ISSUE_WEIGHTS = [40, 30, 28, 28, 22, 22, 20, 18, 18, 14, 12, 12, 12, 10, 10, 9, 8, 8] as const

// 숫자 장(진단브리핑 숫자 · Tech-Index · 신용/재무정보 · 활동성정보 · 기업현황 재무)의 기업별 값.
type MockHistoryMetrics = {
    /** 혁신성장역량지수(Tech-Index) 점수 — 지표별 점수는 기본 목업과의 차이만큼 같이 움직인다. */
    techIndexScore: number
    /** 동일업종 기준 상위 %. */
    industryPercentile: number
    /** Tech-Index 표준정보 분포에서의 위치(예: '상위 1.6%'). */
    standardPercentileLabel: string
    /** 4대 혁신역량 점수 — 인프라 · 투입 · 활동 · 성과 순. */
    capabilityScores: readonly number[]
    /** 현재 CRI 등급과 그 앞 두 번의 등급(오래된 순). */
    creditGrade: string
    creditGradeHistory: readonly string[]
    /** 현금흐름등급과 지난 등급 — history 는 기본 목업 순서(24.11 · 23.09 · 22.09)와 같다. */
    cashFlowGrade: string
    cashFlowGradeHistory: readonly string[]
    /** 재무비율진단 5항목 단계 — 매출액증가율 · 영업이익률 · 자기자본비율 · 총자본회전율 · 현금흐름 순. */
    ratioRatings: readonly InnovationGrowthReport['creditFinance']['ratios'][number]['rating'][]
    /** 금액(백만원) 배율 — 기본 목업 금액에 곱한다(재무제표 · 기업현황 재무 · 차입금 · 담보). */
    financeScale: number
}

type MockHistoryCompanyProfile = {
    metrics: MockHistoryMetrics
    /** 기술분야 대분류 — 특허 분석의 기술분야 경로 맨 앞. */
    largeCategory: string
    /** 기술혁신정보 중분류 도넛의 분야 이름 7개(비중 큰 순) — '기타' 를 붙여 8조각. */
    middleCategories: readonly string[]
    /** 보유 특허 9건(출원일 최근순) — 맨 앞에 카드의 특허명이 붙어 10건이 된다. */
    patents: readonly string[]
    /** 이머징 기술 — 세부분야(technologies) 7개 뒤에 붙는 3개. 합쳐 10줄 + '기타'. */
    emergingTech: readonly string[]
    /** 진단브리핑 보유기술 도넛의 분야 이름 7개(비중 큰 순) — '기타' 는 붙여서 8조각이 된다. */
    technologies: readonly string[]
    /** R&D 이슈 단어 18개(중요도 높은 순) — 진단브리핑 · 기술혁신정보 R&D 이슈 워드클라우드 공용. */
    issues: readonly string[]
    /** 기술혁신정보 제목 옆 분야 태그(report.subCategoryName). */
    subCategoryName: string
    /** 기업 개요 줄 — 항목명이 company.rows · companyStatus.overview 의 label 과 같은 줄을 바꾼다. */
    rows: Readonly<Record<string, string>>
}

// 기업명으로 찾는다 — 기업 · 기관 이력에 같은 기업이 있으면 같은 값이 나온다. 없는 기업은 목업 그대로(카드 값만 바뀜).
const MOCK_HISTORY_COMPANY_PROFILES: Readonly<Record<string, MockHistoryCompanyProfile>> = {
    '㈜테크놀로지': {
        metrics: {
            techIndexScore: 78.4,
            industryPercentile: 18,
            standardPercentileLabel: '상위 1.6%',
            capabilityScores: [70.2, 85.1, 62.8, 48.3],
            creditGrade: 'A-',
            creditGradeHistory: ['BBB0', 'BBB+'],
            cashFlowGrade: 'CF3',
            cashFlowGradeHistory: ['CF3', 'CF4', 'CF4'],
            ratioRatings: ['good', 'good', 'normal', 'excellent', 'good'],
            financeScale: 1.4,
        },
        largeCategory: '정보/통신',
        middleCategories: [
            '소프트웨어',
            '정보 처리',
            '인공지능',
            '데이터 관리',
            '정보 보호',
            '컴퓨팅 시스템',
            '네트워크',
        ],
        patents: [
            '시계열 데이터의 이상치를 탐지하는 기계학습 기반 분석 장치',
            '분산 저장된 빅데이터의 실시간 집계 처리 시스템 및 방법',
            '사용자 행동 로그를 이용한 개인화 추천 모델 학습 방법',
            '클라우드 환경에서 분석 작업을 자동으로 배치하는 스케줄링 시스템',
            '대시보드 시각화를 위한 데이터 요약 및 차트 자동 생성 장치',
            '데이터 접근 권한을 세분화하여 관리하는 보안 플랫폼',
            '정형 · 비정형 데이터를 통합하고 품질을 검증하여 기계학습용 학습 데이터셋을 자동으로 구축하는 데이터 파이프라인 시스템 및 그 방법',
            '예측 모델의 성능 저하를 감지하여 재학습을 수행하는 모델 운영 시스템',
            '자연어 질의를 데이터베이스 질의문으로 변환하는 분석 보조 장치',
        ],
        emergingTech: ['설명 가능한 AI', '데이터 거버넌스', '실시간 스트림 처리'],
        technologies: [
            '데이터 분석·AI',
            '빅데이터 플랫폼',
            '머신러닝 모델',
            '클라우드 서비스',
            '데이터 시각화',
            '정보 보안',
            '추천 시스템',
        ],
        issues: [
            '데이터',
            '분석',
            '인공지능',
            '예측',
            '학습',
            '모델',
            '시각화',
            '플랫폼',
            '빅데이터',
            '알고리즘',
            '클라우드',
            '처리',
            '실시간',
            '최적화',
            '서비스',
            '추천',
            '보안',
            '자동화',
        ],
        subCategoryName: '인공지능 · 데이터 분석',
        rows: {
            대표자: '김민준',
            법인등록번호: '110111-2345678',
            사업자등록번호: '214-86-12345',
            설립일: '2012년 04월 02일',
            종업원수: '48명',
            '기업유형/형태': '코스닥시장/법인기업',
            기업규모: '중소기업',
            주소: '(06236) 서울특별시 강남구 테헤란로 000',
            표준산업분류: '(J62010) 컴퓨터 프로그래밍 서비스업',
            대표기술분야: '인공지능',
            주요제품: 'AI 데이터 분석 솔루션',
        },
    },
    '스마트산업㈜': {
        metrics: {
            techIndexScore: 66.2,
            industryPercentile: 34,
            standardPercentileLabel: '상위 8.4%',
            capabilityScores: [58.4, 72.3, 49.6, 31.2],
            creditGrade: 'BBB-',
            creditGradeHistory: ['BBB0', 'BBB0'],
            cashFlowGrade: 'CF4',
            cashFlowGradeHistory: ['CF4', 'CF5', 'CF5'],
            ratioRatings: ['normal', 'poor', 'normal', 'good', 'normal'],
            financeScale: 0.8,
        },
        largeCategory: '전기/전자',
        middleCategories: [
            '계측 · 제어',
            '무선 통신',
            '전력 · 전기기기',
            '임베디드 소프트웨어',
            '센서',
            '전자 부품',
            '산업 자동화',
        ],
        patents: [
            '저전력 무선 센서 노드의 전원 관리 장치 및 방법',
            '산업 설비 상태를 원격으로 감시하는 IoT 게이트웨이',
            '다수 제어 장치 간 시간 동기화를 위한 통신 프로토콜',
            '전력 사용량 패턴을 학습하여 부하를 제어하는 스마트 분전반',
            '스마트폰 앱과 연동되는 가전 기기 통합 제어 시스템',
            '무선 통신 장애 시 제어 명령을 자동으로 재전송하는 방법',
            '공장 자동화 라인의 센서 데이터를 수집하여 이상 상태를 판별하고 작업자에게 알리는 모니터링 장치 및 그 방법',
            '펌웨어를 무선으로 갱신하는 임베디드 제어 모듈',
            '복수의 IoT 기기를 하나의 장면으로 묶어 실행하는 연동 제어 방법',
        ],
        emergingTech: ['디지털 트윈', '엣지 컴퓨팅', '저전력 광역 통신'],
        technologies: [
            'IoT 제어·센서',
            '무선 통신 모듈',
            '산업 자동화',
            '임베디드 시스템',
            '전력 제어',
            '원격 모니터링',
            '스마트 홈',
        ],
        issues: [
            '사물인터넷',
            '센서',
            '제어',
            '통신',
            '모듈',
            '무선',
            '연동',
            '자동화',
            '장치',
            '모니터링',
            '전력',
            '네트워크',
            '원격',
            '신호',
            '게이트웨이',
            '저전력',
            '임베디드',
            '데이터',
        ],
        subCategoryName: '사물인터넷 · 제어',
        rows: {
            대표자: '이서연',
            법인등록번호: '134811-3456789',
            사업자등록번호: '135-81-23456',
            설립일: '2015년 09월 21일',
            종업원수: '27명',
            '기업유형/형태': '외부감사대상/법인기업',
            기업규모: '중소기업',
            주소: '(16229) 경기도 수원시 영통구 광교로 000',
            표준산업분류: '(C28909) 그 외 기타 전기장비 제조업',
            대표기술분야: '사물인터넷',
            주요제품: 'IoT 연동 제어 장치',
        },
    },
    '㈜바이오랩': {
        metrics: {
            techIndexScore: 81.2,
            industryPercentile: 12,
            standardPercentileLabel: '상위 1.1%',
            capabilityScores: [74.5, 90.4, 66.1, 52.7],
            creditGrade: 'BBB+',
            creditGradeHistory: ['BBB-', 'BBB0'],
            cashFlowGrade: 'CF3',
            cashFlowGradeHistory: ['CF3', 'CF4', 'CF4'],
            ratioRatings: ['excellent', 'normal', 'good', 'normal', 'good'],
            financeScale: 1.1,
        },
        largeCategory: '보건의료',
        middleCategories: [
            '진단 · 검사 기술',
            '의료 기기',
            '바이오 소재',
            '분자 생물',
            '의료 정보',
            '진단 영상',
            '임상 검사',
        ],
        patents: [
            '항원 · 항체 반응을 이용한 신속 감염병 진단 키트',
            '혈액 내 바이오마커를 정량 측정하는 전기화학 센서',
            '형광 신호를 증폭하는 진단용 나노 구조체',
            '현장 검사용 휴대형 분자 진단 장치',
            '진단 결과를 스마트폰으로 판독하는 영상 분석 방법',
            '다중 질환 표지자를 한 번에 검출하는 미세유체 칩',
            '타액 시료에서 바이러스 유전자를 추출하고 증폭하여 감염 여부를 판정하는 등온 증폭 진단 키트 및 그 제조 방법',
            '진단 시약의 상온 보관 안정성을 높이는 동결건조 조성물',
            '체외 진단 장비의 검사 데이터를 관리하는 클라우드 시스템',
        ],
        emergingTech: ['액체 생검', '디지털 병리', '현장 진단(POCT)'],
        technologies: [
            '체외 진단',
            '바이오 센서',
            '분자 진단',
            '의료 기기',
            '진단 시약',
            '바이오 소재',
            '헬스케어 데이터',
        ],
        issues: [
            '진단',
            '바이오',
            '센서',
            '키트',
            '검출',
            '항체',
            '분자',
            '시약',
            '감염',
            '혈액',
            '신속',
            '정밀',
            '마커',
            '측정',
            '질환',
            '의료',
            '형광',
            '단백질',
        ],
        subCategoryName: '체외 진단 · 바이오 센서',
        rows: {
            대표자: '박지훈',
            법인등록번호: '160111-4567890',
            사업자등록번호: '305-86-34567',
            설립일: '2016년 02월 11일',
            종업원수: '35명',
            '기업유형/형태': '코넥스시장/법인기업',
            기업규모: '중소기업',
            주소: '(34141) 대전광역시 유성구 대학로 000',
            표준산업분류: '(C27199) 그 외 기타 의료용 기기 제조업',
            대표기술분야: '바이오 진단',
            주요제품: '바이오 센서 진단 키트',
        },
    },
    딥마인드테크: {
        metrics: {
            techIndexScore: 71.5,
            industryPercentile: 27,
            standardPercentileLabel: '상위 3.4%',
            capabilityScores: [61.0, 86.7, 58.2, 30.4],
            creditGrade: 'BB+',
            creditGradeHistory: ['BB0', 'BB+'],
            cashFlowGrade: 'CF5',
            cashFlowGradeHistory: ['CF5', 'CF5', 'CF6'],
            ratioRatings: ['excellent', 'weak', 'poor', 'normal', 'poor'],
            financeScale: 0.5,
        },
        largeCategory: '정보/통신',
        middleCategories: [
            '인공지능',
            '영상 처리',
            '소프트웨어',
            '컴퓨팅 시스템',
            '반도체 설계',
            '데이터 관리',
            '로봇',
        ],
        patents: [
            '경량화된 합성곱 신경망을 이용한 실시간 객체 검출 장치',
            '학습 데이터의 라벨 오류를 자동으로 찾아내는 방법',
            '저조도 영상의 화질을 개선하는 딥러닝 기반 전처리 방법',
            '엣지 기기에서 추론 속도를 높이는 신경망 양자화 장치',
            '다중 카메라 영상을 정합하여 3차원 객체를 인식하는 시스템',
            '소량의 데이터로 새 분류 항목을 학습하는 퓨샷 학습 방법',
            '차량 주변 영상에서 보행자와 차량의 이동 경로를 예측하여 충돌 위험을 판단하고 운전자에게 알리는 자율주행 인식 시스템',
            '이미지 분류 모델의 판단 근거를 시각화하는 설명 장치',
            '합성 데이터를 생성하여 학습 데이터를 늘리는 방법',
        ],
        emergingTech: ['생성형 AI', '멀티모달 인식', '온디바이스 AI'],
        technologies: [
            '컴퓨터 비전',
            '딥러닝 모델',
            '이미지 처리',
            '영상 인식',
            '엣지 AI',
            '데이터 라벨링',
            '자율주행 인식',
        ],
        issues: [
            '이미지',
            '딥러닝',
            '신경망',
            '분류',
            '인식',
            '학습',
            '객체',
            '검출',
            '영상',
            '모델',
            '합성곱',
            '특징',
            '정확도',
            '추론',
            '경량화',
            '데이터셋',
            '엣지',
            '비전',
        ],
        subCategoryName: '컴퓨터 비전 · 딥러닝',
        rows: {
            대표자: '최유진',
            법인등록번호: '131111-5678901',
            사업자등록번호: '220-87-45678',
            설립일: '2019년 07월 01일',
            종업원수: '19명',
            '기업유형/형태': '일반/법인기업',
            기업규모: '중소기업',
            주소: '(13487) 경기도 성남시 분당구 판교역로 000',
            표준산업분류: '(J58221) 시스템 소프트웨어 개발 및 공급업',
            대표기술분야: '컴퓨터 비전',
            주요제품: '이미지 분류 AI 엔진',
        },
    },
    '나노헬스㈜': {
        metrics: {
            techIndexScore: 84.6,
            industryPercentile: 8,
            standardPercentileLabel: '상위 0.7%',
            capabilityScores: [80.1, 91.8, 70.4, 61.9],
            creditGrade: 'A0',
            creditGradeHistory: ['A-', 'A-'],
            cashFlowGrade: 'CF2',
            cashFlowGradeHistory: ['CF2', 'CF3', 'CF3'],
            ratioRatings: ['good', 'excellent', 'good', 'normal', 'excellent'],
            financeScale: 2.3,
        },
        largeCategory: '보건의료',
        middleCategories: [
            '의약품 개발',
            '나노 소재',
            '고분자 소재',
            '바이오 의약',
            '약물 분석',
            '의약 제형',
            '생체 재료',
        ],
        patents: [
            '표적 세포에 선택적으로 결합하는 리간드 수식 나노입자',
            '약물의 방출 속도를 조절하는 생분해성 고분자 캡슐',
            '지질 나노입자를 이용한 유전자 치료제 전달 조성물',
            '경구 흡수율을 높이는 난용성 약물 제형',
            '항암제의 독성을 낮추는 리포좀 봉입 방법',
            '나노입자의 크기 분포를 균일하게 제조하는 미세유체 공정',
            '피부 투과를 촉진하는 마이크로니들 패치와 그 표면에 코팅된 약물 나노입자의 방출 특성을 제어하는 경피 전달 시스템',
            '체내 약물 농도를 실시간으로 측정하는 분석 방법',
            '나노 제형의 장기 보관 안정성을 확보하는 동결 보호 조성물',
        ],
        emergingTech: ['mRNA 전달체', '항체-약물 접합체', '표적 단백질 분해'],
        technologies: ['약물전달', '나노 소재', '제형 기술', '바이오 의약', '표적 치료', '고분자 소재', '의약 분석'],
        issues: [
            '나노입자',
            '약물',
            '전달',
            '표적',
            '제형',
            '방출',
            '고분자',
            '리포좀',
            '생체',
            '흡수',
            '항암',
            '안정성',
            '캡슐',
            '투과',
            '치료',
            '독성',
            '지질',
            '효율',
        ],
        subCategoryName: '약물전달 · 나노 소재',
        rows: {
            대표자: '정하늘',
            법인등록번호: '150111-6789012',
            사업자등록번호: '312-81-56789',
            설립일: '2013년 11월 18일',
            종업원수: '62명',
            '기업유형/형태': '코스닥시장/법인기업',
            기업규모: '중소기업',
            주소: '(28160) 충청북도 청주시 흥덕구 오송읍 오송생명로 000',
            표준산업분류: '(C21210) 완제 의약품 제조업',
            대표기술분야: '약물전달',
            주요제품: '나노입자 약물전달 플랫폼',
        },
    },
    '케이에이아이㈜': {
        metrics: {
            techIndexScore: 69.3,
            industryPercentile: 30,
            standardPercentileLabel: '상위 4.9%',
            capabilityScores: [60.3, 79.8, 55.0, 36.6],
            creditGrade: 'BBB-',
            creditGradeHistory: ['BB+', 'BBB-'],
            cashFlowGrade: 'CF4',
            cashFlowGradeHistory: ['CF4', 'CF4', 'CF5'],
            ratioRatings: ['good', 'normal', 'normal', 'good', 'normal'],
            financeScale: 0.7,
        },
        largeCategory: '정보/통신',
        middleCategories: [
            '인공지능',
            '음성 · 언어 처리',
            '정보 검색',
            '소프트웨어',
            '데이터 관리',
            '정보 보호',
            '컴퓨팅 시스템',
        ],
        patents: [
            '문서의 문맥 임베딩을 이용한 자동 분류 장치',
            '질의 의도를 파악하여 답변 문단을 찾는 검색 방법',
            '긴 문서를 핵심 문장 중심으로 요약하는 시스템',
            '개체명 인식을 이용한 계약서 주요 항목 추출 방법',
            '고객 상담 내용에서 감성을 분석하는 장치',
            '전문 용어 사전을 반영하여 번역 품질을 높이는 방법',
            '사내 문서와 외부 지식 그래프를 연결하여 사용자 질의에 근거 문서와 함께 답변을 생성하는 대화형 검색 시스템 및 그 방법',
            '음성 통화 내용을 문자로 변환하여 업무 유형을 분류하는 방법',
            '개인정보가 포함된 문장을 찾아 가리는 비식별 처리 장치',
        ],
        emergingTech: ['대규모 언어 모델', '검색 증강 생성', '지식 그래프 추론'],
        technologies: ['자연어처리', '언어 모델', '문서 분류', '검색 엔진', '음성 인식', '지식 그래프', '챗봇'],
        issues: [
            '자연어',
            '문서',
            '분류',
            '언어',
            '모델',
            '텍스트',
            '임베딩',
            '검색',
            '요약',
            '의미',
            '토큰',
            '질의',
            '학습',
            '개체명',
            '감성',
            '추출',
            '번역',
            '대화',
        ],
        subCategoryName: '자연어처리 · 언어 모델',
        rows: {
            대표자: '강도윤',
            법인등록번호: '110111-7890123',
            사업자등록번호: '106-86-67890',
            설립일: '2018년 05월 14일',
            종업원수: '23명',
            '기업유형/형태': '일반/법인기업',
            기업규모: '중소기업',
            주소: '(04524) 서울특별시 중구 세종대로 000',
            표준산업분류: '(J58221) 시스템 소프트웨어 개발 및 공급업',
            대표기술분야: '자연어처리',
            주요제품: '문서 분류 AI 솔루션',
        },
    },
    스페이스테크: {
        metrics: {
            techIndexScore: 63.8,
            industryPercentile: 41,
            standardPercentileLabel: '상위 11.2%',
            capabilityScores: [55.2, 83.9, 47.7, 25.8],
            creditGrade: 'BB0',
            creditGradeHistory: ['BB-', 'BB0'],
            cashFlowGrade: 'CF5',
            cashFlowGradeHistory: ['CF5', 'CF6', 'CF6'],
            ratioRatings: ['excellent', 'weak', 'weak', 'poor', 'weak'],
            financeScale: 0.4,
        },
        largeCategory: '우주 · 항공',
        middleCategories: ['위성 시스템', '원격 탐사', '공간정보', '영상 처리', '위성 통신', '항법', '기상 · 대기'],
        patents: [
            '위성 영상에서 지표 변화를 탐지하는 시계열 분석 방법',
            '광학 · 레이더 위성 영상을 정합하는 처리 장치',
            '소형 위성의 자세를 제어하는 반작용 휠 구동 방법',
            '위성 데이터를 수신하여 자동 보정하는 지상국 시스템',
            '구름 영역을 제거하여 지표 영상을 복원하는 방법',
            '위성 기반 위치 정보를 보정하는 정밀 항법 장치',
            '다수의 저궤도 위성으로부터 수집한 영상을 시간 순서로 정렬하여 재난 피해 지역의 범위와 규모를 산출하는 분석 플랫폼',
            '공간정보와 기상 데이터를 결합하여 작황을 예측하는 시스템',
            '위성 영상의 해상도를 높이는 초해상화 방법',
        ],
        emergingTech: ['초소형 군집 위성', '위성 인터넷', 'SAR 영상 분석'],
        technologies: ['위성 데이터', '공간정보', '원격 탐사', '영상 분석', '위성 통신', '항법 시스템', '기상 정보'],
        issues: [
            '위성',
            '영상',
            '공간정보',
            '원격탐사',
            '궤도',
            '지도',
            '해상도',
            '관측',
            '데이터',
            '분석',
            '지구',
            '센서',
            '좌표',
            '변화탐지',
            '기상',
            '항법',
            '수신',
            '플랫폼',
        ],
        subCategoryName: '위성 · 공간정보',
        rows: {
            대표자: '윤서준',
            법인등록번호: '160111-8901234',
            사업자등록번호: '314-86-78901',
            설립일: '2020년 03월 09일',
            종업원수: '15명',
            '기업유형/형태': '일반/법인기업',
            기업규모: '중소기업',
            주소: '(34051) 대전광역시 유성구 엑스포로 000',
            표준산업분류: '(M70113) 기타 공학 연구개발업',
            대표기술분야: '위성 데이터',
            주요제품: '위성 데이터 분석 플랫폼',
        },
    },
    '㈜디지털팜': {
        metrics: {
            techIndexScore: 74.9,
            industryPercentile: 22,
            standardPercentileLabel: '상위 2.8%',
            capabilityScores: [66.8, 80.2, 60.9, 42.4],
            creditGrade: 'BBB0',
            creditGradeHistory: ['BBB-', 'BBB0'],
            cashFlowGrade: 'CF4',
            cashFlowGradeHistory: ['CF3', 'CF4', 'CF4'],
            ratioRatings: ['normal', 'normal', 'good', 'good', 'normal'],
            financeScale: 1.0,
        },
        largeCategory: '농림수산식품',
        middleCategories: [
            '스마트 농업',
            '환경 제어',
            '생육 정보',
            '농업 기계',
            '농업 데이터',
            '시설 원예',
            '유통 · 물류',
        ],
        patents: [
            '온실 내부 온습도를 작물 생육 단계에 맞춰 제어하는 장치',
            '작물 영상으로 생육 상태를 판별하는 모니터링 시스템',
            '토양 수분을 측정하여 자동으로 관수하는 방법',
            '양액 농도를 실시간으로 조절하는 수경재배 장치',
            '병해충 발생을 예측하여 방제 시기를 알리는 서비스',
            '수확 로봇의 과실 위치를 인식하는 방법',
            '여러 농가의 환경 · 생육 데이터를 모아 최적 재배 조건을 학습하고 각 농가의 제어 장치에 자동으로 적용하는 통합 관제 플랫폼',
            '농산물 출하량을 예측하는 유통 데이터 분석 장치',
            '원격으로 다수의 온실 설비를 제어하는 모바일 시스템',
        ],
        emergingTech: ['수직 농장', '농업용 자율주행', '탄소 저감 재배'],
        technologies: ['스마트팜', '농업 ICT', '환경 제어', '생육 모니터링', '자동 관수', '농업 로봇', '유통 데이터'],
        issues: [
            '스마트팜',
            '작물',
            '생육',
            '환경',
            '제어',
            '센서',
            '온실',
            '재배',
            '관수',
            '모니터링',
            '데이터',
            '농업',
            '수확량',
            '양액',
            '자동화',
            '원격',
            '병해충',
            '예측',
        ],
        subCategoryName: '스마트팜 · 농업 ICT',
        rows: {
            대표자: '임하은',
            법인등록번호: '200111-9012345',
            사업자등록번호: '409-81-89012',
            설립일: '2017년 08월 23일',
            종업원수: '41명',
            '기업유형/형태': '외부감사대상/법인기업',
            기업규모: '중소기업',
            주소: '(61008) 광주광역시 북구 첨단과기로 000',
            표준산업분류: '(J62021) 컴퓨터시스템 통합 자문 및 구축 서비스업',
            대표기술분야: '스마트팜',
            주요제품: '스마트팜 통합 관제 솔루션',
        },
    },
}

const pick = (list: readonly string[], index: number) => list[index] ?? ''

// 우수특허(같은 분야 다른 기업의 특허) 제목 — 기업마다 쓰지 않고 세부분야(t) · 중분류(m) 이름을 넣어 만든다. 12건(10건 + '기타').
// 4번째는 두 줄을 넘는 제목 — 화면이 두 줄에서 말줄임하는지 본다.
const MOCK_HISTORY_EXCELLENT_PATENT_TITLES: readonly ((t: readonly string[], m: readonly string[]) => string)[] = [
    (t) => `${pick(t, 0)} 성능 향상 장치 및 방법`,
    (t) => `${pick(t, 1)} 기반 ${pick(t, 0)} 시스템`,
    (t) => `${pick(t, 2)} 공정 제어 방법`,
    (t, m) =>
        `${pick(t, 0)} 데이터와 ${pick(t, 1)} 정보를 결합하여 결과를 예측하고 사용자에게 알리는 ${pick(m, 0)} 분야 통합 분석 시스템 및 그 방법`,
    (t) => `${pick(t, 3)} 모듈 및 이를 포함하는 장치`,
    (t) => `${pick(t, 4)} 신뢰성 평가 방법`,
    (t) => `${pick(t, 5)} 자동화 시스템`,
    (t) => `${pick(t, 6)} 관리 플랫폼`,
    (t, m) => `${pick(m, 1)} 분야 ${pick(t, 0)} 품질 관리 장치`,
    (t) => `${pick(t, 1)} 성능 시험 장치`,
    (t, m) => `${pick(m, 2)} 기반 ${pick(t, 2)} 장치`,
    (t) => `${pick(t, 3)} 데이터 처리 방법`,
]

// 중분류 도넛 — 기본 목업의 비중 · 건수를 그대로 두고 이름만 바꾼다(맨 뒤 '기타' 는 그대로).
const relabelDonut = (items: readonly PercentageDonutItem[], labels: readonly string[]): PercentageDonutItem[] =>
    items.map((item, index) => ({...item, label: labels[index] ?? item.label}))

const roundTo1 = (value: number) => Math.round(value * 10) / 10
const SCORE_MIN = 0
const SCORE_MAX = 100
const clampScore = (value: number) => Math.min(SCORE_MAX, Math.max(SCORE_MIN, roundTo1(value)))
// '33명' → 33. 숫자가 없으면 null.
const toCount = (text?: string) => {
    const count = Number.parseInt(text?.replace(/[^0-9]/g, '') ?? '', 10)
    return Number.isNaN(count) ? null : count
}
// 금액 배율 — 값이 없는 칸(NaN)은 그대로 둔다.
const scaleAmount = (value: number, scale: number) => (Number.isNaN(value) ? value : Math.round(value * scale))
const scaleRows = <T extends {values: readonly number[]}>(rows: readonly T[], scale: number): T[] =>
    rows.map((row) => ({...row, values: row.values.map((value) => scaleAmount(value, scale))}))
const scaleCell = <T extends {amount: number} | null>(cell: T, scale: number): T =>
    cell ? {...cell, amount: scaleAmount(cell.amount, scale)} : cell

// 숫자 장 — 점수 · 등급 · 금액 · 인원을 그 기업 값으로 바꾼다. 문구 · 날짜 · 업종 평균은 기본 목업 그대로다.
const withMockHistoryMetrics = (
    report: InnovationGrowthReport,
    profile: MockHistoryCompanyProfile,
): Partial<InnovationGrowthReport> => {
    const {metrics} = profile
    const scale = metrics.financeScale
    const scoreShift = metrics.techIndexScore - report.techIndex.score
    // 인원 배율 — 개요의 종업원수(목업 → 기업) 비율로 종업원 그래프 · 인력 표를 늘리고 줄인다. 인당 매출은 금액 배율 ÷ 인원 배율.
    const baseEmployees = toCount(report.companyStatus.overview.find((row) => row.label === '종업원수')?.value)
    const employees = toCount(profile.rows['종업원수'])
    const headcountScale = baseEmployees && employees ? employees / baseEmployees : 1
    const scaleHeadcount = (value: number) => Math.max(0, Math.round(value * headcountScale))
    const perEmployeeScale = scale / headcountScale
    const industryLabel = profile.rows['표준산업분류']?.replace(/^\([^)]*\)\s*/, '') ?? report.techIndex.industryLabel
    const capabilityScore = (index: number, fallback: number) => metrics.capabilityScores[index] ?? fallback
    const credit = report.creditDetail
    const ratingHistory = credit.ratingHistory.map((row, index, rows) => ({
        ...row,
        grade: index === rows.length - 1 ? metrics.creditGrade : (metrics.creditGradeHistory[index] ?? row.grade),
    }))
    // 휴폐업정보 · 법인등기정보 표의 번호를 기업 개요와 맞춘다(첫 칸).
    const identityByInfoId: Readonly<Record<string, string | undefined>> = {
        closure: profile.rows['사업자등록번호'],
        registry: profile.rows['법인등록번호'],
    }
    const {standard} = report.techIndexDetail

    return {
        techIndex: {
            ...report.techIndex,
            score: metrics.techIndexScore,
            industryPercentile: metrics.industryPercentile,
            industryLabel,
        },
        creditFinance: {
            ...report.creditFinance,
            rating: {...report.creditFinance.rating, grade: metrics.creditGrade},
            ratios: report.creditFinance.ratios.map((row, index) => ({
                ...row,
                rating: metrics.ratioRatings[index] ?? row.rating,
            })),
            statements: scaleRows(report.creditFinance.statements, scale),
        },
        activity: {
            employees: report.activity.employees.map((point) => ({...point, value: scaleHeadcount(point.value)})),
            salesPerEmployee: report.activity.salesPerEmployee.map((point) => ({
                ...point,
                value: roundTo1(point.value * perEmployeeScale),
            })),
        },
        activityDetail: {
            ...report.activityDetail,
            humanResources: report.activityDetail.humanResources.map((row) => ({
                ...row,
                employees: scaleHeadcount(row.employees),
                change: Math.round(row.change * headcountScale),
                hires: scaleHeadcount(row.hires),
                leavers: scaleHeadcount(row.leavers),
                salesPerEmployee: roundTo1(row.salesPerEmployee * perEmployeeScale),
            })),
        },
        techIndexDetail: {
            ...report.techIndexDetail,
            standard: {
                ...standard,
                percentileLabel: metrics.standardPercentileLabel,
                summary: standard.summary.map((part) =>
                    part.isStrong ? {...part, text: metrics.standardPercentileLabel} : part,
                ),
            },
            companyTypes: report.techIndexDetail.companyTypes.map((item) =>
                item.isSubject ? {...item, value: metrics.techIndexScore} : item,
            ),
            capabilities: report.techIndexDetail.capabilities.map((item, index) => ({
                ...item,
                score: capabilityScore(index, item.score),
            })),
            capabilityByType: report.techIndexDetail.capabilityByType.map((group, index) => ({
                ...group,
                items: group.items.map((item) =>
                    item.isSubject ? {...item, value: capabilityScore(index, item.value)} : item,
                ),
            })),
            indicators: report.techIndexDetail.indicators.map((group) => ({
                ...group,
                items: group.items.map((item) => ({...item, company: clampScore(item.company + scoreShift)})),
            })),
        },
        creditDetail: {
            ...credit,
            ratingHistory,
            cashFlow: {
                ...credit.cashFlow,
                grade: metrics.cashFlowGrade,
                history: credit.cashFlow.history.map((row, index) => ({
                    ...row,
                    grade: metrics.cashFlowGradeHistory[index] ?? row.grade,
                })),
            },
            creditInfo: credit.creditInfo.map((info) => {
                const identity = identityByInfoId[info.id]
                return identity
                    ? {...info, rows: info.rows.map((row) => row.map((cell, index) => (index === 0 ? identity : cell)))}
                    : info
            }),
            borrowings: {
                ...credit.borrowings,
                groups: credit.borrowings.groups.map((group) => ({
                    ...group,
                    rows: group.rows.map((row) => ({...row, cells: row.cells.map((cell) => scaleCell(cell, scale))})),
                    subtotal: {...group.subtotal, cells: group.subtotal.cells.map((cell) => scaleCell(cell, scale))},
                })),
                total: {
                    ...credit.borrowings.total,
                    cells: credit.borrowings.total.cells.map((cell) => scaleCell(cell, scale)),
                },
            },
            collaterals: credit.collaterals.map((item) => ({...item, amount: scaleAmount(item.amount, scale)})),
        },
    }
}

const findMockHistoryCard = async (reportId?: string): Promise<KBigxReportHistoryItem | undefined> => {
    if (!reportId) return undefined
    const [corpCards, orgCards] = await Promise.all([getKBigxReportHistory(), getOrgKBigxReportHistory()])
    return [...corpCards, ...orgCards].find((card) => card.id === reportId)
}

const toMockHistoryTechnologies = (labels: readonly string[], shareIndex: number): PercentageDonutItem[] => {
    const shares = MOCK_HISTORY_TECH_SHARES[shareIndex % MOCK_HISTORY_TECH_SHARES.length]
    const items = [...labels, MOCK_HISTORY_TECH_OTHER_LABEL]
    const colors = donutColorsFor(items.length)
    return items.map((label, index) => ({
        id: `t${index + 1}`,
        label,
        percentage: shares[index]?.percentage ?? 0,
        count: shares[index]?.count ?? 0,
        color: colors[index] ?? '',
    }))
}

// 기술혁신정보 — 보유기술 도넛 2개 · 보유 특허 · 특허 분석 · 우수특허 · 이머징 기술을 그 기업 값으로 바꾼다.
// 번호 · 날짜 · 피인용 · 이머징 건수 같은 숫자는 기본 목업 그대로다.
const withMockHistoryTechInnovation = (
    tech: InnovationGrowthReport['techInnovation'],
    profile: MockHistoryCompanyProfile,
    card: KBigxReportHistoryItem,
    profileIndex: number,
): Partial<InnovationGrowthReport['techInnovation']> => {
    const name = card.companyName
    const fields = profile.technologies
    const patentTitles = [card.patentName, ...profile.patents]
    const [firstPatent] = tech.holdings.patents
    const mainField = pick(fields, 0)
    const mainProduct = profile.rows['주요제품'] ?? mainField
    const emergingFields = [...fields, ...profile.emergingTech]

    return {
        holdings: {
            ...tech.holdings,
            middleCategory: relabelDonut(tech.holdings.middleCategory, profile.middleCategories),
            // 세부분야 도넛은 진단브리핑 보유기술 도넛과 같은 값이다(둘 다 세부분야 기준).
            smallCategory: toMockHistoryTechnologies(fields, profileIndex),
            patents: tech.holdings.patents.map((patent, index) => ({
                ...patent,
                title: patentTitles[index] ?? patent.title,
                applicant: name,
                rightHolder: name,
                field: pick(fields, index % fields.length),
            })),
        },
        // 특허 분석 — 카드의 특허(보유 특허 첫 줄)를 분석한 것으로 둔다. 문장은 분야 이름을 넣은 틀이다.
        analysis: {
            ...tech.analysis,
            patentTitle: card.patentName,
            patentNumber: firstPatent?.applicationNumber ?? tech.analysis.patentNumber,
            summary: [
                `본 개시는 ${card.patentName}에 관한 것이다. ${mainField} 분야의 핵심 과정을 자동화하고 정확도를 높여 ${mainProduct} 등 관련 제품 · 서비스에 적용될 수 있다.`,
            ],
            field: {
                name: mainField,
                path: `(기술분야) ${profile.largeCategory} – ${pick(profile.middleCategories, 0)} – ${mainField}`,
                description: `${mainField} 분야의 제품 · 서비스 제공을 위한 장비 · 소재 · 소프트웨어 관련 기술 요소를 통칭`,
            },
            reasons: [
                `발명의 핵심 구성이 ${mainField} 기술 요소에 있고, ${pick(fields, 1)} 등은 적용 분야로 언급될 뿐이므로 ${mainField} 분야가 가장 적합하다.`,
            ],
        },
        excellentPatents: tech.excellentPatents.map((patent, index) => ({
            ...patent,
            title: MOCK_HISTORY_EXCELLENT_PATENT_TITLES[index]?.(fields, profile.middleCategories) ?? patent.title,
        })),
        // 이머징 기술 — 맨 끝 '기타' 줄은 그대로 둔다.
        emergingTech: {
            ...tech.emergingTech,
            rows: tech.emergingTech.rows.map((row, index, rows) =>
                index === rows.length - 1 ? row : {...row, field: emergingFields[index] ?? row.field},
            ),
        },
    }
}

const withMockHistoryCard = (report: InnovationGrowthReport, card: KBigxReportHistoryItem): InnovationGrowthReport => {
    const name = card.companyName
    const profile = MOCK_HISTORY_COMPANY_PROFILES[name]
    const profileIndex = Object.keys(MOCK_HISTORY_COMPANY_PROFILES).indexOf(name)
    const profileRows: Readonly<Record<string, string>> = {
        ...profile?.rows,
        [MOCK_HISTORY_COMPANY_NAME_LABEL]: name,
    }
    const replaceRow = (row: ReportLabelValue): ReportLabelValue => ({
        ...row,
        value: profileRows[row.label] ?? row.value,
    })
    const replaceSubject = (item: InnovationRankItem): InnovationRankItem =>
        item.tone === 'subject' ? {...item, name} : item
    // 대표자 — 목업의 대표자 이름이 쓰인 경영진 · 주주 줄도 같은 사람으로 바꾼다.
    const mockRepresentative = report.company.rows.find((row) => row.label === MOCK_HISTORY_REPRESENTATIVE_LABEL)?.value
    const representative = profileRows[MOCK_HISTORY_REPRESENTATIVE_LABEL] ?? mockRepresentative
    const replacePerson = <T extends {name: string}>(person: T): T =>
        person.name === mockRepresentative && representative ? {...person, name: representative} : person
    const {growthLeaders} = report.techInnovation

    // 숫자 장을 먼저 바꾼 뒤 그 위에 이름 · 개요 등을 덮는다(techIndexDetail · companyStatus 는 아래에서 이 결과를 이어받는다).
    const measured: InnovationGrowthReport = profile ? {...report, ...withMockHistoryMetrics(report, profile)} : report
    const financeScale = profile?.metrics.financeScale ?? 1
    const {finance} = measured.companyStatus
    const {standard} = measured.techIndexDetail

    return {
        ...measured,
        title: card.patentName,
        companyName: name,
        issuedAt: card.inquiredAt,
        lookupBaseDate: card.inquiredAt,
        subCategoryName: profile?.subCategoryName ?? report.subCategoryName,
        innovation: profile
            ? {
                  ...report.innovation,
                  technologies: toMockHistoryTechnologies(profile.technologies, profileIndex),
                  issues: profile.issues.map((text, index) => ({
                      text,
                      weight:
                          MOCK_HISTORY_ISSUE_WEIGHTS[index] ??
                          MOCK_HISTORY_ISSUE_WEIGHTS[MOCK_HISTORY_ISSUE_WEIGHTS.length - 1],
                  })),
              }
            : report.innovation,
        company: {rows: report.company.rows.map(replaceRow)},
        companyStatus: {
            ...measured.companyStatus,
            overview: measured.companyStatus.overview.map(replaceRow),
            finance: {
                ...finance,
                balance: scaleRows(finance.balance, financeScale),
                income: scaleRows(finance.income, financeScale),
                cashFlows: scaleRows(finance.cashFlows, financeScale),
            },
            executives: report.companyStatus.executives.map(replacePerson),
            shareholders: report.companyStatus.shareholders.map(replacePerson),
        },
        techIndexDetail: {
            ...measured.techIndexDetail,
            standard: {
                ...standard,
                summary: standard.summary.map((part) => ({...part, text: part.text.replace(report.companyName, name)})),
            },
        },
        techInnovation: {
            ...report.techInnovation,
            ...(profile ? withMockHistoryTechInnovation(report.techInnovation, profile, card, profileIndex) : {}),
            growthLeaders: {
                small: {...growthLeaders.small, items: growthLeaders.small.items.map(replaceSubject)},
                large: {...growthLeaders.large, items: growthLeaders.large.items.map(replaceSubject)},
            },
        },
    }
}

export {findMockHistoryCard, withMockHistoryCard}
