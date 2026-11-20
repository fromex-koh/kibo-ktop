import type {EvaluationModel} from '@/content/service/evaluation-model-selection'

// 플랫폼 소개 > 기술평가 화면의 문구 · 모형별 상세 내용 — 시안 "기술평가_KTRS-FM (신속표준모형)" ·
// "기술평가_혁신성장지수 (Tech-Index)" · "기술평가_개방형 투자모형"과, 결과정보 · 기대효과 · 활용분야는 시안
// "case > 아코디언"의 모형별 펼친 내용. 탭(카드) 내용(약칭 · 제목 · 설명 · 그림)은 평가모형 선택과 같은
// EVALUATION_MODELS 를 쓴다.
//
// 시안에서 옮기지 않은 줄 — Tech-Index · 투자모형의 세 번째 소개 줄(KTRS-FM 의 입력정보 문장, 시안에서 숨김).
// Tech-Index 결과정보 '개별기업 평가정보'의 '기술보증기금법 제28조 …' 줄은 시안에 보이므로 그대로 둔다 —
// 다른 화면(개인정보 처리 안내)의 문구와 같아 원고 확인이 필요하다.

const PLATFORM_TECHNOLOGY_EVALUATION = {
    title: '기술평가',
    /** 화면 제목 아래 안내 — 줄마다 새 줄로 놓인다(시안). */
    headingLines: ['모형별 탭을 선택하면', '상세 내용을 확인할 수 있어요.'],
    /** 탭 목록의 이름(화면 낭독기). */
    tabListLabel: '평가모형',
} as const

/** 아코디언 본문 묶음 — 소제목(heading)이 있으면 그 아래에 점 목록이 온다(Tech-Index). */
type ModelSectionGroup = {heading?: string; items: readonly string[]}

/** 아코디언 항목 — 결과정보 · 기대효과 · 활용분야(세 모형 같은 순서). */
type ModelSectionKey = 'results' | 'effect' | 'usage'

type ModelDetail = {
    title: string
    summary: readonly string[]
    sections: Record<ModelSectionKey, readonly ModelSectionGroup[]>
}

const MODEL_DETAILS: Record<EvaluationModel['id'], ModelDetail> = {
    'ktrs-fm': {
        title: 'KTRS-FM (신속표준모형)',
        summary: [
            '창업초기기업(3년)과 신속보증 지원평가에 최적화된 AI기반 평가모형으로, 자가진단을 통한 기술사업 평가등급 제공',
            '간단한 체크리스트 입력으로 신속/정확하게 기술사업 평가등급 및 (소액)보증 가능여부 등을 확인',
            '입력정보 : 경영주역량, 기술성, 시장성, 사업성을 평가할 수 있는 기업 정량 정보(동업종 경력, 기술인력, 지식재산권 실적 등) 및 25개 내외 체크리스트 문항',
        ],
        sections: {
            results: [
                {
                    items: [
                        '기술사업 평가등급',
                        '기술사업 성장등급',
                        '기술사업 위험등급',
                        '(소액) 보증 가능 여부, 피어그룹 비교자료 등',
                    ],
                },
            ],
            effect: [
                {
                    items: [
                        '창업 초기, 영세·소기업의 신속·소액 지원 가능',
                        '평가·보증 절차 간소화 및 실시간 등급 산출로 소액 지원 시간 단축',
                    ],
                },
            ],
            usage: [
                {
                    items: [
                        '고객·은행이 KTRS-FM을 통해 신속·정확하게 기술사업 평가등급 및 보증 가능 여부 등을 확인',
                        '자가진단 기술평가를 통해 기술사업 성장가능성과 위험가능성을 평가하고, 이를 기반으로 기업의 자기 주도 혁신성장 기대',
                    ],
                },
            ],
        },
    },
    'tech-index': {
        title: '혁신성장지수 (Tech-Index)',
        summary: [
            '중소기업의 혁신성장역량을 의미하는 객관적인 지수(0~100점)로서, 기업이 보유한 기술혁신역량과 미래성장가능성 정보 제공',
            '입력정보 : 기업 정량정보 및 재무정보 (기술개발·지식재산권 실적, 급여, 개발비 등)',
        ],
        sections: {
            results: [
                {
                    heading: '개별기업 평가정보',
                    items: [
                        '지수 정보, 4대 혁신역량(인프라, 투입, 활동, 성과) 부문 점수',
                        '14개 세부지표(내부 혁신역량) 단계의 중소기업 평균 대비 수준',
                        '기술보증기금법 제28조제1항제6호 ‘기술평가’에 의한 업무 수행',
                    ],
                },
                {
                    heading: '사업참가 기업집단 정보',
                    items: [
                        '지수 및 4대 혁신역량 부문 기업집단 점수 분포',
                        '기업집단 비교정보, 지원 사업 부문별 집단비교정보 등',
                    ],
                },
            ],
            effect: [
                {
                    heading: '공공기관의 효과적인 정책사업 지원',
                    items: ['중기부의 “중소기업 혁신역량 데이터를 통한 정책 지원 분석” 등에 Tech-Index 활용'],
                },
            ],
            usage: [
                {
                    items: [
                        '데이터 기반의 기업 선별기준을 제공하여 공공기관의 기업 지원 타당성·실효성 확보',
                        '개별기업 단위의 평가로 지원사업의 기업 필터링, 선정기업의 성과관리, 유형별 기업집단 연구 및 정책 분석에 활용',
                    ],
                },
            ],
        },
    },
    'investment-model': {
        title: '개방형 투자모형',
        summary: [
            '전문가·인공신경망의 융합 알고리즘을 기반으로 한 기술력 평가모형 및 투자회수모형을 결합하여 투자용 평가등급을 산출하여 제공',
            '입력정보 : 기술평가표, 기업특성지표, 기업규모지표',
        ],
        sections: {
            results: [{items: ['기술평가표', '기업특성지표', '기업규모지표']}],
            effect: [
                {
                    items: [
                        '신뢰성 있는 비재무 기반 기술평가정보 제공을 통해 크레딧 정보 위주의 기존 신용정보업계의 패러다임 전환',
                        '효과적 혁신기업 선별 및 투자촉진으로 민간투자 활성화',
                        '고도화된 심층 평가정보 및 정보에 대한 해석자료 제공으로 고객 만족도 제고',
                    ],
                },
            ],
            usage: [{items: ['VC 수요에 맞는 스타트업의 기술·평가정보 제공으로 정보활용 및 투자기관-기업간 정보유통']}],
        },
    },
}

/** KTRS-FM 구조도 — 평가 항목수 막대 한 줄. */
type KtrsFmItemCount = {model: string; target: string; count: number; isHighlighted?: boolean}

/** KTRS-FM 구조도 — 실시간 등급산출(예시) 칸 하나. tone 은 칸 머리 · 바탕 · 등급 글자색. */
type KtrsFmGradeSample = {label: string; grade: string; tone: 'primary' | 'purple' | 'neutral'}

/**
 * KTRS-FM 구조도 — 예상 평가 시간 원 하나. arcDegrees 는 12시부터 시계 방향으로 칠한 호의 각도(둥근 끝 포함)다.
 * 시안 값을 그대로 옮긴다 — 30분은 반 바퀴(180°)지만 5분은 분 비율(30°)보다 길게(44°) 그려져 있다.
 */
type KtrsFmEvaluationTime = {model: string; minutes: number; arcDegrees: number; isHighlighted?: boolean}

// KTRS-FM 모형 구조도 — 시안 "기술평가_KTRS-FM (신속표준모형)"의 구조도 영역(PC 1200 × 1604)을 글 · 도형으로 옮긴 것.
// 그림이 아니라 글이라 화면 낭독기가 그대로 읽고, 모바일에서도 글자가 줄지 않는다.
const KTRS_FM_DIAGRAM = {
    model: 'KTRS-FM',
    descriptionLines: [
        '기보 대표 모형인 KTRS*의 근간을 계승하는 대외 개방용 AI기반 모형',
        '*KTRS (Kibo Technology rating system)',
    ],
    itemSelection: {
        title: '최적의 핵심 평가항목 선정',
        description: '기보 17년간의 평가 데이터를 활용 최소의 평가항목으로 최적의 평가 시스템 구축',
        countLabel: '평가 항목수',
        counts: [
            {model: 'KTRS', target: '모든 기업', count: 31},
            {model: 'KTRS-SM', target: '창업 기업(7년)', count: 21},
            {model: 'KTRS-FM', target: '창업 초기기업(3년)\n/신속지원 필요기업', count: 10, isHighlighted: true},
        ] satisfies readonly KtrsFmItemCount[],
        countUnit: '개',
    },
    customerFriendly: {
        title: '고객 친화적 평가모형 개발',
        description: '고객(기업)이 직접 투입하는 소액보증용 신속 기술평가 모형 구축',
        optimizationLabel: 'UI 최적화',
        checklistLabel: '10개 소항목 체크리스트',
        companyInfo: {title: '기업정보', items: ['업종코드', '기술/지식재산권 수', '대표자 학력', '기술인력 정보']},
        selectionItems: {
            title: '선택항목 (약 20개)',
            items: ['선택항목 1 (ex. 동사 보유 특허...)', '선택항목 2 (ex. 경영주는 창업한 경험이...)', '...'],
        },
        gradeLabel: '실시간 등급산출(예시)',
        grades: [
            {label: '기술사업평가등급', grade: 'AA', tone: 'primary'},
            {label: '성장등급', grade: 'AAA', tone: 'purple'},
            {label: '위험등급', grade: 'B+', tone: 'neutral'},
        ] satisfies readonly KtrsFmGradeSample[],
    },
    evaluationTime: {
        title: '예상 평가 시간',
        times: [
            {model: 'KTRS', minutes: 30, arcDegrees: 180},
            {model: 'KTRS-FM', minutes: 5, arcDegrees: 44, isHighlighted: true},
        ] satisfies readonly KtrsFmEvaluationTime[],
        minuteUnit: '분',
        notes: ['체크리스트로 등급 & 보증 가능여부 간편 확인', '평가/보증절차 간소화 소액지원 시간단축'],
    },
} as const

// Tech-Index 모형 구조도 — 시안 "기술평가_혁신성장지수 (Tech-Index)"의 구조도 영역(PC 1200 × 692)을 글 · 도형으로 옮긴 것.
// 혁신성장 역량지표 → 두 평가 방식(기술사업평가등급 · 인공지능) → 4대 부문 → 혁신성장역량지수 순서로 흐른다.
const TECH_INDEX_DIAGRAM = {
    indicators: '혁신성장 역량지표 (14개)',
    methods: [
        {title: '기술사업평가등급', basis: '평가지표 기반'},
        {title: '인공지능', basis: '고성장 및 지속성장성 고려'},
    ],
    sectors: ['인프라', '투입', '활동', '성과'],
    result: '혁신성장역량지수',
    notes: [
        '객관적 빅데이터에 기반한 모형방식의 지수 산출 구조로 통계지수로서의 신뢰성 강화',
        '객관적 데이터 기반의 신속한 기업선별 기준을 제시하고, 기업 혁신활동 분석 및 시계열 추적관리, 산업군별 분석 등 다양한 기능 제공',
    ],
} as const

// 개방형 투자모형 구조도 — 시안 "기술평가_개방형 투자모형"의 구조도 영역(PC 1200 × 412)을 글 · 도형으로 옮긴 것.
// 두 모형(기술사업성장모형 · 투자 회수모형)을 결합평가한다. tone 은 모형 머리 색.
const INVESTMENT_MODEL_DIAGRAM = {
    combineLabel: '결합평가',
    inputLabel: '투입지표',
    outcomeBadge: '종속변수',
    models: [
        {
            title: '기술사업성장모형',
            tone: 'navy',
            inputBadge: '공통지표',
            inputs: ['경영역량', '기술성', '시장성', '사업성'],
            outcome: '고성장 여부',
        },
        {
            title: '투자 회수모형',
            tone: 'primary',
            inputBadge: '특성화지표',
            inputs: ['인프라', '투입', '활동', '성과'],
            outcome: 'EXIT 여부',
        },
    ],
} as const

/** 아코디언 제목 — 세 모형이 같다. */
const MODEL_DETAIL_SECTION_TITLES: Record<ModelSectionKey, string> = {
    results: '결과정보',
    effect: '기대효과',
    usage: '활용분야',
}

/** 아코디언 순서 — 자동 전환도 이 순서로 넘어간다. */
const MODEL_DETAIL_SECTION_KEYS: readonly ModelSectionKey[] = ['results', 'effect', 'usage']

export {
    INVESTMENT_MODEL_DIAGRAM,
    KTRS_FM_DIAGRAM,
    MODEL_DETAIL_SECTION_KEYS,
    MODEL_DETAIL_SECTION_TITLES,
    MODEL_DETAILS,
    PLATFORM_TECHNOLOGY_EVALUATION,
    TECH_INDEX_DIAGRAM,
}
export type {KtrsFmEvaluationTime, KtrsFmGradeSample, KtrsFmItemCount, ModelDetail, ModelSectionGroup, ModelSectionKey}
