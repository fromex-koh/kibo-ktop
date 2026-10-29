// 플랫폼 소개(오픈 플랫폼 소개) 화면 원고 — 기업 · 기관 /platform 이 함께 쓴다(components/custom/platform-intro.tsx).
// 문구를 고칠 때는 이 파일만 바꾼다. 화면 구성: 대표 사진(제목 · 소개) → K-TOP 플랫폼 개요(카드 6장) → 기술혁신 지원(활용 주체별 표)
// → 소개 배너 → 서비스 바로가기.

type PlatformIntroUserType = 'corp' | 'org'

// 상단 등장 연출 1단계의 옛 제목 · 영문 설명 — 연출 중에만 보이고 대표 사진이 제자리에 오면 사라진다.
const PLATFORM_INTRO_OPENING = {
    title: '개방형 기술평가 플랫폼',
    brand: 'K-TOP',
    description: 'Korea Technology-rating Open Platform · 기술평가의 정점(TOP)에 서 있는 플랫폼',
} as const

// 상단 — 대표 사진 위 제목 · 소개. 소개는 항목마다 새 줄에서 시작한다(시안의 줄바꿈 자리).
const PLATFORM_INTRO_TITLE = '빠르고 간편하게 하나의 플랫폼에서'
const PLATFORM_INTRO_DESCRIPTIONS = [
    'K-TOP은 기술보증기금의 기술평가 노하우와 축적된 빅데이터를 바탕으로',
    '기업의 혁신성장역량 평가, 기술사업성 평가를 통한 신속자금지원, 기술의 원천기술 평가를 제공하는 누구나 사용 가능한 개방형 기술평가 플랫폼입니다.',
] as const

// K-TOP 플랫폼 개요 — 카드 6장. 고른 카드(처음에는 01)는 옅은 파랑 면 + 설명 목록, 나머지는 파랑 면 + 그림이다.
// 제목의 줄바꿈(\n)은 시안 그대로다 — 카드 폭(384)에서 두 줄로 나뉘는 제목만 넣는다.
// 설명이 비면 고른 카드도 그림을 보여 준다.
type PlatformOverviewItem = {
    id: string
    title: string
    descriptions: readonly string[]
}

const PLATFORM_OVERVIEW_TITLE = 'K-TOP 플랫폼 개요'
const PLATFORM_OVERVIEW_ITEMS: readonly PlatformOverviewItem[] = [
    {
        id: 'what',
        title: 'K-TOP은\n어떤 플랫폼인가요?',
        descriptions: ['기보 빅데이터와 AI로 기술평가정보 생성', '누구나 활용하는 기술평가포털 (기업 및 유관기관 등)'],
    },
    {
        id: 'why',
        title: '왜 만들어졌나요?',
        descriptions: [
            '데이터 개방 정책에 부합하는 플랫폼',
            '기업의 혁신·성장을 위한 평가 지원',
            '민간주도 혁신 생태계 활성화의 허브',
        ],
    },
    {
        id: 'made-of',
        title: '무엇으로\n만들어졌나요?',
        descriptions: [
            '기보 25년·86만건 기술평가 빅데이터',
            '전문 기술평가 인력의 축적된 노하우',
            '평가 목적에 최적화된 AI 모델',
        ],
    },
    {
        id: 'who',
        title: '누가 활용하나요?',
        descriptions: [
            '기업, 은행 등 민간금융, 민간투자기관',
            '정부, 공공기관, R&D 혁신지원기관',
            '공공연구원, 민간평가기관 등',
        ],
    },
    {
        id: 'open',
        title: '무엇을\n개방하나요?',
        descriptions: [
            '혁신성장기업 선별을 위한 테크인덱스',
            '신속 기술금융지원을 위한 KTRS-FM 모형',
            '기술기반 혁신을 유도하는 원천기술 평가모델',
        ],
    },
    {
        id: 'how',
        title: '어떻게\n활용하나요?',
        descriptions: [
            '혁신기업 선별, 모니터링, 성과관리',
            '고성장 예상기업 사전선별 및 지원',
            '자가진단을 통한 기업성장의 발판',
        ],
    },
]

// 기술혁신 지원 — 활용 분야(묶음) › 활용 주체 › 활용 내용.
type PlatformUsageGroup = {
    title: string
    users: readonly {name: string; uses: readonly string[]}[]
}

// 제목은 PC 에서 두 줄([0] / [1]), 태블릿 · 모바일은 칸 폭에서 세 줄로 나뉜다. 설명은 PC 'lead middle / tail',
// 태블릿 · 모바일 'lead / middle+tail(붙여 씀)' 으로 나뉜다(시안의 줄바꿈 · 붙여 쓰기 그대로).
// 줄바꿈 단위 — 모바일 · 태블릿은 [0] / [1 2] / [3] 세 줄, PC 는 [0 1] / [2 3] 두 줄(시안).
const PLATFORM_USAGE_TITLE = ['기술혁신 지원을', '위한', '개방형', '기술평가 플랫폼'] as const
const PLATFORM_USAGE_DESCRIPTION = {
    lead: '개방형 네트워크 형성으로 상생',
    middle: '기술평가',
    tail: '생태계를 창조합니다.',
} as const
const PLATFORM_USAGE_GROUPS: readonly PlatformUsageGroup[] = [
    {
        title: '자가진단·기업혁신',
        users: [{name: '중소기업고객', uses: ['기업수준 파악', '자기주도 혁신']}],
    },
    {
        title: '기업선별·지원',
        users: [
            {name: '금융·투자기관', uses: ['기술금융 신속지원', '지원·투자 대상 발굴', '우대지원 기준 선정']},
            {name: '혁신(R&D) 지원기관', uses: ['R&D 대상기업 선정', '성과분석·사후관리', '수준별 기업 지원']},
        ],
    },
    {
        title: '정책 연구·활용',
        users: [
            {name: '정부부처', uses: ['성장·고용 등 정책연구', 'R&D 효과분석', '중소기업 현황 분석']},
            {name: '공공연구소', uses: ['정책목표 설정', '정책수립 및 점검', '제도 개선 및 기획']},
            {name: '대학 산학연', uses: ['학술분석', '기초연구 활용']},
        ],
    },
]

const PLATFORM_BANNER_LINES = [
    '기보는 25년간의 노하우가 집약된 개방형 기술평가 플랫폼을 제공함으로써,',
    '이곳에서 다양한 참여자가 새로운 가치를 창출하고,',
    '그로부터 민간 주도형 기술평가 혁신 생태계가 번영하기를 기대하며 상생과 협력의 꿈을 꿉니다.',
] as const

// 서비스 바로가기 — 같은 메뉴(플랫폼 소개)의 서비스별 소개 화면으로 간다.
const PLATFORM_SHORTCUTS = [
    {label: '기술평가', segment: 'technology-evaluation'},
    {label: '특허평가', segment: 'patent-evaluation'},
    {label: 'K-BIGx 보고서', segment: 'k-bigx-report'},
] as const

const platformShortcutHref = (userType: PlatformIntroUserType, segment: string) => `/${userType}/platform/${segment}`

export {
    PLATFORM_BANNER_LINES,
    PLATFORM_INTRO_DESCRIPTIONS,
    PLATFORM_INTRO_OPENING,
    PLATFORM_INTRO_TITLE,
    PLATFORM_OVERVIEW_ITEMS,
    PLATFORM_OVERVIEW_TITLE,
    PLATFORM_SHORTCUTS,
    PLATFORM_USAGE_DESCRIPTION,
    PLATFORM_USAGE_GROUPS,
    PLATFORM_USAGE_TITLE,
    platformShortcutHref,
}
export type {PlatformIntroUserType, PlatformOverviewItem, PlatformUsageGroup}
