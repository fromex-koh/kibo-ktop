import type {EvaluationModel} from '@/content/service/evaluation-model-selection'
import type {PlatformIntroUserType} from '@/content/service/platform-intro'

// 플랫폼 소개 > 기술평가 화면 원고 — 기업 · 기관 /platform/technology-evaluation 이 함께 쓴다
// (components/custom/platform-technology-evaluation.tsx). 문구를 고칠 때는 이 파일만 바꾼다. 화면 구성(위 → 아래):
//   화면 제목 → 히어로(글 | 모형 카드 3장) → 섹션 이동 탭 → 핵심 특징(카드 3) → 평가모형(탭 3 — 소개 · 구조도 · 결과 카드 3)
//   → 모형 비교(표) → 평가 결과(보고서 미리보기) → 이용 절차(4단계) → 마무리 배너.
// 모형 구조도 3종의 문구 · 수치는 아래 *_DIAGRAM 이다(custom/*-structure-diagram.tsx).

type PlatformTechModelId = EvaluationModel['id']

const PLATFORM_TECH_TITLE = '기술평가'

const PLATFORM_TECH_HERO = {
    eyebrow: 'TECHNOLOGY EVALUATION',
    title: '기업의 기술력과 성장 가능성을 확인하는',
    titleEmphasis: '기술평가',
    lead: '기업의 기술사업화 역량과 혁신성장 가능성을 평가하여 기업의 기술역량을 객관적으로 파악할 수 있도록 지원합니다.',
    modelsActionLabel: '평가모형 알아보기',
    startActionLabel: '기술평가 시작하기',
    loginNote: '로그인 후 이용할 수 있습니다.',
    /** 오른쪽 모형 카드 3장(PC 1024↑) — 목록 이름(낭독기). */
    cardsLabel: '제공하는 평가모형',
    cards: [
        {
            id: 'ktrs-fm',
            label: 'KTRS-FM',
            title: '기술사업 평가등급',
            description: '등급형 결과 · 성장·위험등급 함께 제공',
        },
        {
            id: 'tech-index',
            label: 'Tech-Index',
            title: '혁신성장역량지수',
            description: '0~100점 지수 · 4대 혁신역량 부문 점수',
        },
        {
            id: 'investment-model',
            label: '투자모형',
            title: '투자용 평가등급',
            description: '기술력 평가모형 + 투자회수모형 결합',
        },
    ] satisfies readonly {id: PlatformTechModelId; label: string; title: string; description: string}[],
} as const

// 섹션 이동 탭 — id 는 각 section 의 id 와 같다.
const PLATFORM_TECH_SECTIONS = [
    {id: 'features', label: '핵심 특징'},
    {id: 'models', label: '평가모형'},
    {id: 'compare', label: '모형 비교'},
    {id: 'report', label: '평가 결과'},
    {id: 'process', label: '이용 절차'},
] as const

const PLATFORM_TECH_FEATURES = {
    title: '기업의 다양한 기술역량을 평가합니다',
    items: [
        {
            id: 'capability',
            title: '기술역량 분석',
            description: '기업이 보유한 기술의 경쟁력과 경영주역량·기술인력·지식재산권 등 관련 역량을 평가합니다.',
        },
        {
            id: 'commercialization',
            title: '사업화 가능성 검토',
            description: '기술의 시장성·사업성을 함께 살펴 사업화 및 성장 가능성을 분석합니다.',
        },
        {
            id: 'models',
            title: '목적별 평가모형',
            description:
                '신속 기술금융, 혁신성장역량 진단, 투자 검토 등 이용 목적에 맞는 평가모형을 선택할 수 있습니다.',
        },
    ],
} as const

/** 소개 목록 한 줄 — label 이 있으면 굵은 머리말(예: 입력정보 :) 뒤에 text 가 이어진다. */
type ModelSummaryLine = {label?: string; text: string}

/** 결과 카드 묶음 — 소제목(heading)이 있으면 그 아래에 점 목록이 온다(Tech-Index 결과정보). */
type ModelOutcomeGroup = {heading?: string; items: readonly string[]}

/** 결과 카드 — 결과정보 · 기대효과 · 활용분야(세 모형 같은 순서). */
type ModelOutcome = {title: string; groups: readonly ModelOutcomeGroup[]}

type ModelDetail = {
    /** 탭 이름. */
    tabLabel: string
    title: string
    lead: string
    chips: readonly string[]
    summary: readonly ModelSummaryLine[]
    outcomes: readonly ModelOutcome[]
}

const PLATFORM_TECH_MODELS = {
    title: '평가 목적에 맞는 모형을 선택하세요',
    /** 탭 위 안내 — 화면에는 보이지 않고 낭독기만 읽는다(제목 단계 h2 → h4 건너뜀 방지). */
    tabsHeading: '모형별 탭을 선택하면 상세 내용을 확인할 수 있어요',
    description: 'KTRS-FM · Tech-Index · 투자모형 3가지 평가모형을 제공합니다.',
    tabListLabel: '평가모형 상세',
    chipsLabel: '주요 키워드',
} as const

const MODEL_DETAILS: Record<PlatformTechModelId, ModelDetail> = {
    'ktrs-fm': {
        tabLabel: 'KTRS-FM',
        title: 'KTRS-FM (신속표준모형)',
        lead: '기술사업화 역량 및 재무적 안정성을 종합적으로 평가하는 표준 기술금융 모형입니다. 기업의 기술력, 사업성, 경영능력을 정량·정성 지표로 분석합니다.',
        chips: ['기술력', '사업성', '경영능력'],
        summary: [
            {
                text: '창업초기기업(3년)과 신속보증 지원평가에 최적화된 AI기반 평가모형으로, 자가진단을 통한 기술사업 평가등급 제공',
            },
            {text: '간단한 체크리스트 입력으로 신속/정확하게 기술사업 평가등급 및 (소액)보증 가능여부 등을 확인'},
            {
                label: '입력정보',
                text: '경영주역량, 기술성, 시장성, 사업성을 평가할 수 있는 기업 정량 정보(동업종 경력, 기술인력, 지식재산권 실적 등) 및 25개 내외 체크리스트 문항',
            },
        ],
        outcomes: [
            {
                title: '결과정보',
                groups: [
                    {
                        items: [
                            '기술사업 평가등급',
                            '기술사업 성장등급',
                            '기술사업 위험등급',
                            '(소액) 보증 가능 여부, 피어그룹 비교자료 등',
                        ],
                    },
                ],
            },
            {
                title: '기대효과',
                groups: [
                    {
                        items: [
                            '창업 초기, 영세·소기업의 신속·소액 지원 가능',
                            '평가·보증 절차 간소화 및 실시간 등급 산출로 소액 지원 시간 단축',
                        ],
                    },
                ],
            },
            {
                title: '활용분야',
                groups: [
                    {
                        items: [
                            '고객·은행이 KTRS-FM을 통해 신속·정확하게 기술사업 평가등급 및 보증 가능 여부 등을 확인',
                            '자가진단 기술평가를 통해 기술사업 성장가능성과 위험가능성을 평가하고, 이를 기반으로 기업의 자기 주도 혁신성장 기대',
                        ],
                    },
                ],
            },
        ],
    },
    'tech-index': {
        tabLabel: 'Tech-Index',
        title: '혁신성장지수 (Tech-Index)',
        lead: '혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다. Tech-Index는 일반 · 창업용 두 종류의 평가모형을 제공합니다.',
        chips: ['미래 성장 가능성', '지수형', '일반 · 창업'],
        summary: [
            {
                text: '중소기업의 혁신성장역량을 의미하는 객관적인 지수(0~100점)로서, 기업이 보유한 기술혁신역량과 미래성장가능성 정보 제공',
            },
            {label: '입력정보', text: '기업 정량정보 및 재무정보 (기술개발·지식재산권 실적, 급여, 개발비 등)'},
            {label: '제공 유형', text: 'Tech-Index(일반) · 창업 Tech-Index — 평가 시작 시 선택'},
        ],
        outcomes: [
            {
                title: '결과정보',
                groups: [
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
            },
            {
                title: '기대효과',
                groups: [
                    {
                        items: [
                            '공공기관의 효과적인 정책사업 지원',
                            '중기부의 “중소기업 혁신역량 데이터를 통한 정책 지원 분석” 등에 Tech-Index 활용',
                        ],
                    },
                ],
            },
            {
                title: '활용분야',
                groups: [
                    {
                        items: [
                            '데이터 기반의 기업 선별기준을 제공하여 공공기관의 기업 지원 타당성·실효성 확보',
                            '개별기업 단위의 평가로 지원사업의 기업 필터링, 선정기업의 성과관리, 유형별 기업집단 연구 및 정책 분석에 활용',
                        ],
                    },
                ],
            },
        ],
    },
    'investment-model': {
        tabLabel: '투자모형',
        title: '개방형 투자모형',
        lead: '투자 적합성 및 사업화 가능성을 중점으로 분석하는 투자 특화 평가 모형입니다. 기업의 투자 가치를 종합적으로 검토합니다.',
        chips: ['투자 적합성', '사업화 가능성', '기업 투자 가치'],
        summary: [
            {
                text: '전문가·인공신경망의 융합 알고리즘을 기반으로 한 기술사업성장모형 및 밸류업모형을 결합하여 투자용 평가등급을 산출하여 제공',
            },
            {
                label: '입력정보',
                text: '팀역량, 사업경쟁력, 실행역량 등을 평가할 수 있는 기업 정량정보 및 체크리스트 문항',
            },
        ],
        outcomes: [
            {title: '결과정보', groups: [{items: ['최종등급', '기술사업성장등급', '밸류업등급']}]},
            {
                title: '기대효과',
                groups: [
                    {
                        items: [
                            '신뢰성 있는 비재무 기반 기술평가정보 제공을 통해 크레딧 정보 위주의 기존 신용정보업계의 패러다임 전환',
                            '효과적 혁신기업 선별 및 투자촉진으로 민간투자 활성화',
                            '고도화된 심층 평가정보 및 정보에 대한 해석자료 제공으로 고객 만족도 제고',
                        ],
                    },
                ],
            },
            {
                title: '활용분야',
                groups: [
                    {items: ['VC 수요에 맞는 스타트업의 기술·평가정보 제공으로 정보활용 및 투자기관-기업간 정보유통']},
                ],
            },
        ],
    },
}

/** 비교표 한 줄 — 제공 유형은 굵은 배지(typeBadge) 아래에 설명이 온다. */
type ModelCompareRow = {
    modelId: PlatformTechModelId
    name: string
    subtitle: string
    goal: string
    views: readonly string[]
    typeBadge: string
    types: readonly string[]
    actionLabel: string
}

const PLATFORM_TECH_COMPARE = {
    title: '평가모형별 특징을 비교해 보세요',
    caption: '평가모형별 평가 목적, 주요 평가 관점, 제공 유형, 평가 신청 비교표',
    columns: {model: '평가모형', goal: '평가 목적', view: '주요 평가 관점', type: '제공 유형', action: '평가 신청'},
    rows: [
        {
            modelId: 'ktrs-fm',
            name: 'KTRS-FM',
            subtitle: '신속표준모형',
            goal: '창업초기기업(3년)과 신속보증 지원평가에 최적화된 모형으로, 기술사업 평가등급과 (소액)보증 가능 여부를 빠르게 확인할 수 있습니다.',
            views: ['경영주역량 · 기술성 · 시장성 · 사업성', '기업 정량정보 + 25개 내외 체크리스트'],
            typeBadge: '등급형',
            types: ['평가·성장·위험등급', '자가진단(기업) / 개별평가(기관)'],
            actionLabel: 'KTRS-FM 시작',
        },
        {
            modelId: 'tech-index',
            name: 'Tech-Index',
            subtitle: '혁신성장역량지수',
            goal: '중소기업의 혁신성장역량을 객관적인 지수로 측정하여, 기업 선별과 성과관리, 정책 분석에 활용할 수 있습니다.',
            views: ['4대 혁신역량(인프라·투입·활동·성과)', '14개 세부지표 · 기업 정량·재무정보'],
            typeBadge: '지수형',
            types: ['0~100점', '일반 · 창업 2종'],
            actionLabel: 'Tech-Index 시작',
        },
        {
            modelId: 'investment-model',
            name: '투자모형',
            subtitle: '개방형 투자모형',
            goal: '기술사업성장모형과 밸류업모형을 결합하여 투자용 평가등급을 산출합니다.',
            views: [
                '팀역량 · 사업경쟁력 · 실행역량',
                '공통지표 + 성장특화지표 · 투자특화지표',
                '전문가모형 + 인공신경망모형',
            ],
            typeBadge: '등급형',
            types: ['최종 · 기술사업성장 · 밸류업등급'],
            actionLabel: '투자모형 시작',
        },
    ] satisfies readonly ModelCompareRow[],
} as const

/** 보고서 구성 한 줄 — 제목 · 설명. */
type ReportItem = {title: string; description: string}

type ReportType = 'general' | 'deep'

const PLATFORM_TECH_REPORT = {
    title: '기술평가 결과를 보고서로 확인할 수 있습니다',
    description: '평가가 완료되면 마이페이지 > 평가결과 조회에서 일반·심층 보고서를 확인할 수 있습니다.',
    modelListLabel: '보고서 평가모형',
    typeLabel: '보고서 유형',
    types: [
        {id: 'general', label: '일반보고서', note: '보고서에서 확인할 수 있는 주요 정보입니다.'},
        {id: 'deep', label: '심층보고서', note: '일반보고서 내용에 기술평가서가 더해집니다.'},
    ] satisfies readonly {id: ReportType; label: string; note: string}[],
    sampleBadge: '샘플 화면',
    scrollCaption: '스크롤하여 전체 보기',
    /** 그림 설명 끝에 붙는 안내(예시 데이터). */
    sampleNote: '기업명·인명·번호는 예시 데이터입니다.',
    models: {
        'ktrs-fm': {
            name: 'KTRS-FM',
            resultTitle: '자가진단 평가결과',
            general: [
                {title: '기술사업평가등급', description: '기술사업평가 · 성장 · 위험등급 구간표에 해당 등급 표시'},
                {title: '평가기업 · 평가의견', description: '기업 기본정보, 평가기술 · 기술요약 · 종합의견'},
                {title: '등급설명 · 유의사항', description: '등급의 의미와 보고서 이용 시 유의사항'},
            ],
            deep: [
                {
                    title: '기술평가서 — 평가 점수',
                    description: '평가부문별 점수, 기업 대표 5대 역량 환산 점수, 기술성숙도(TRL)',
                },
                {title: '기술평가서 — 인력 · 지식재산', description: '동사 기술인력 현황, 보유 지식재산권'},
                {title: '기술평가서 — 동사 수준', description: '유사업종 · 유사기술 대비 동사수준, 동업종 시장규모'},
                {title: '기술사업평가 세부내역', description: '기술사업 평점'},
            ],
        },
        'tech-index': {
            name: 'Tech-Index',
            resultTitle: '혁신성장역량 평가결과',
            general: [
                {title: 'Tech-Index 지수정보', description: '0~100점 지수와 구간'},
                {title: '4대 혁신역량 점수', description: '인프라 · 투입 · 활동 · 성과'},
                {title: '평가기업 · 지수설명 · 유의사항', description: '기업 기본정보와 지수의 구성·해석 안내'},
            ],
            deep: [
                {
                    title: '기술평가서 — 지수 분석',
                    description: 'Tech-Index 지수정보, 4대 혁신역량 비교, 세부지표별 상대비교분석',
                },
                {
                    title: '기술평가서 — 그룹 비교',
                    description: '기업 유형별 Tech-Index · 4대 혁신역량 비교, 산업 구분별 · 지역별 Peer Group 비교',
                },
            ],
        },
        'investment-model': {
            name: '투자모형',
            resultTitle: '투자용 평가결과',
            general: [
                {title: '투자용 평가결과', description: '성장등급 · 최종등급 · 밸류업등급'},
                {title: '평가기업', description: '기업 기본정보'},
                {title: '등급설명 · 유의사항', description: '등급의 의미와 보고서 이용 시 유의사항'},
            ],
            deep: [
                {title: '기술평가서 — 포지셔닝', description: '성장 · 밸류업 포지셔닝'},
                {title: '기술평가서 — Peer Group', description: 'PEER GROUP(업종) 세부항목 비교 · 재무지표 비교'},
                {title: '투자용 기술평가등급 체계', description: '등급 체계 안내'},
            ],
        },
    } satisfies Record<
        PlatformTechModelId,
        {name: string; resultTitle: string; general: readonly ReportItem[]; deep: readonly ReportItem[]}
    >,
} as const

const PLATFORM_TECH_PROCESS = {
    title: '기술평가 신청부터 결과 확인까지',
    steps: [
        {title: '평가모형 선택', tags: ['KTRS-FM', 'Tech-Index', '투자모형'], tagsLabel: '선택할 수 있는 평가모형'},
        {
            title: '이용 동의 및 기업·기술정보 입력',
            description: '고객정보활용 동의 후 기업정보와 기술정보를 입력합니다.',
        },
        {title: '평가모형별 필수 입력 및 제출', description: '체크리스트를 입력하고 제출합니다.'},
        {title: '평가 결과 확인', description: '평가결과 조회에서 결과와 보고서를 확인합니다.'},
    ],
} as const

const PLATFORM_TECH_CTA = {
    title: '기업에 필요한 기술평가를 시작해 보세요',
    description: {
        corp: '평가모형을 선택하면 신청 화면으로 이동합니다. (로그인 필요)',
        org: '기관회원은 개별평가 메뉴에서 평가모형을 선택해 진행합니다. (로그인 필요)',
    } satisfies Record<PlatformIntroUserType, string>,
    actionLabel: '기술평가 시작하기',
} as const

// 이동 주소 — '기술평가 시작하기'는 메인 홈과 같은 곳으로 간다(기업: 평가모형 선택 · 기관: 개별평가 Tech-Index 선택).
const PLATFORM_TECH_ROUTES: Record<
    PlatformIntroUserType,
    {start: string; models: Record<PlatformTechModelId, string>}
> = {
    corp: {
        start: '/corp/home/technology-evaluation-model-selection',
        models: {
            'ktrs-fm': '/corp/technology-evaluation/ktrs-fm/customer-consent',
            'tech-index': '/corp/technology-evaluation/tech-index/selection',
            'investment-model': '/corp/technology-evaluation/investment-model/customer-consent',
        },
    },
    org: {
        start: '/org/individual-evaluation/tech-index/selection',
        models: {
            'ktrs-fm': '/org/individual-evaluation/verification-progress',
            'tech-index': '/org/individual-evaluation/tech-index/selection',
            'investment-model': '/org/individual-evaluation/investment-model/customer-consent',
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

// KTRS-FM 모형 구조도 — 계승 문구 상자 → 두 칸(핵심 평가항목 선정 | 고객 친화적 평가모형) → 두 상자(실시간 등급산출 | 예상 평가 시간).
const KTRS_FM_DIAGRAM = {
    lineage: {
        title: '기보 대표 모형인 KTRS*의 근간을 계승하는 대외 개방용 AI기반 모형',
        note: '*KTRS (Kibo Technology rating system)',
    },
    itemSelection: {
        title: '최적의 핵심 평가항목 선정',
        description: '기보 17년간의 평가 데이터를 활용해 최소의 평가항목으로 최적의 평가 시스템 구축',
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
        groups: [
            {title: '기업정보', items: ['업종코드', '기술/지식재산권 수', '대표자 경력', '기술인력 정보']},
            {
                title: '선택항목 (약 20개)',
                items: ['선택항목 1 (ex. 동사 보유 특허...)', '선택항목 2 (ex. 경영주는 창업한 경험이...)'],
                /** 목록 끝 점선 칸(…) — 낭독기는 moreLabel 을 읽는다. */
                moreLabel: '그 외 선택항목',
            },
        ],
    },
    grade: {
        title: '실시간 등급산출(예시)',
        grades: [
            {label: '기술사업\n평가등급', grade: 'AA', tone: 'primary'},
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
    },
} as const

// Tech-Index 모형 구조도 — 흐름 카드(혁신성장 역량지표 → 4대 혁신역량 → 혁신성장역량지수) | 설명 2줄.
const TECH_INDEX_DIAGRAM = {
    label: '혁신성장 역량지표 14개를 인프라·투입·활동·성과 4대 혁신역량을 거쳐 혁신성장역량지수를 산출하는 개념도',
    indicators: '혁신성장 역량지표 (14개)',
    sectors: ['인프라', '투입', '활동', '성과'],
    result: '혁신성장역량지수',
    notes: [
        '객관적 빅데이터에 기반한 모형방식의 지수 산출 구조로 통계지수로서의 신뢰성 강화',
        '객관적 데이터 기반의 신속한 기업선별 기준을 제시하고, 기업 혁신활동 분석 및 시계열 추적관리, 산업군별 분석 등 다양한 기능 제공',
    ],
} as const

// 개방형 투자모형 구조도 — 두 모형(기술사업성장모형 · 밸류업모형) 카드를 결합평가로 잇는다.
// 카드 = 투입 지표 2칸(공통 · 특화) → 두 모형 2칸(전문가 · 인공신경망) → 평점. tone 은 카드 색.
const INVESTMENT_MODEL_DIAGRAM = {
    caption: '투자용 평가모형의 체계 구성도',
    label: '기술사업성장모형: 공통지표와 성장특화지표를 전문가모형과 인공신경망모형에 함께 투입해 성장투자평점을 산출. 밸류업모형: 공통지표와 투자특화지표를 전문가모형과 인공신경망모형에 함께 투입해 밸류업투자평점을 산출. 두 모형을 결합평가.',
    combineLabel: '결합평가',
    models: [
        {
            title: '기술사업성장모형',
            tone: 'growth',
            inputs: ['공통지표', '성장특화지표'],
            methods: ['전문가모형', '인공신경망모형'],
            outcome: '성장투자평점',
        },
        {
            title: '밸류업모형',
            tone: 'value',
            inputs: ['공통지표', '투자특화지표'],
            methods: ['전문가모형', '인공신경망모형'],
            outcome: '밸류업투자평점',
        },
    ],
} as const

export {
    INVESTMENT_MODEL_DIAGRAM,
    KTRS_FM_DIAGRAM,
    MODEL_DETAILS,
    PLATFORM_TECH_COMPARE,
    PLATFORM_TECH_CTA,
    PLATFORM_TECH_FEATURES,
    PLATFORM_TECH_HERO,
    PLATFORM_TECH_MODELS,
    PLATFORM_TECH_PROCESS,
    PLATFORM_TECH_REPORT,
    PLATFORM_TECH_ROUTES,
    PLATFORM_TECH_SECTIONS,
    PLATFORM_TECH_TITLE,
    TECH_INDEX_DIAGRAM,
}
export type {
    KtrsFmEvaluationTime,
    KtrsFmGradeSample,
    KtrsFmItemCount,
    ModelCompareRow,
    ModelDetail,
    ModelOutcome,
    ModelOutcomeGroup,
    ModelSummaryLine,
    PlatformTechModelId,
    ReportItem,
    ReportType,
}
