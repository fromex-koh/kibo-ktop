// 플랫폼 소개(오픈 플랫폼 소개) 화면 원고 — 기업 · 기관 /platform 이 함께 쓴다(components/custom/platform-intro.tsx).
// 문구를 고칠 때는 이 파일만 바꾼다. 화면 구성(위 → 아래):
//   화면 제목 → 히어로 → 섹션 이동 탭 → 핵심 가치(카드 3 + 지표 3) → 질문으로 알아보는 K-TOP(질문 탭 6)
//   → 주요 서비스(카드 4) → 이용 대상(패널 3) → 이용 흐름(3단계) → 마무리 배너.

type PlatformIntroUserType = 'corp' | 'org'

const PLATFORM_INTRO_TITLE = '오픈 플랫폼 소개'

const PLATFORM_HERO = {
    eyebrow: 'Korea Technology-rating Open Platform · 기술평가의 정점(TOP)에 서 있는 플랫폼',
    title: '개방형 기술평가 플랫폼',
    titleEmphasis: 'K-TOP',
    tagline: '빠르고 간편하게 하나의 플랫폼에서',
    description:
        'K-TOP은 기술보증기금의 기술평가 노하우와 축적된 빅데이터를 바탕으로 기업의 혁신성장역량 평가, 기술사업성 평가를 통한 신속자금지원, 기술의 원천기술 평가를 제공하는 누구나 사용 가능한 개방형 기술평가 플랫폼입니다.',
    actionLabel: '주요 서비스 살펴보기',
} as const

// 섹션 이동 탭 — id 는 각 section 의 id 와 같다.
const PLATFORM_SECTIONS = [
    {id: 'value', label: '핵심 가치'},
    {id: 'about', label: 'K-TOP 알아보기'},
    {id: 'services', label: '주요 서비스'},
    {id: 'audience', label: '이용 대상'},
    {id: 'flow', label: '이용 흐름'},
] as const

type PlatformSectionId = (typeof PLATFORM_SECTIONS)[number]['id']

// 핵심 가치 — 카드 그림(image)은 화면 파일이 키로 고른다(platform-intro.tsx 의 VALUE_IMAGES).
const PLATFORM_VALUE = {
    title: ['기술평가 전문성과 데이터로', '기업의 혁신성장을 지원합니다'],
    items: [
        {
            id: 'expertise',
            title: '기술평가 전문성',
            description: '기술보증기금의 축적된 기술평가 경험과 노하우를 바탕으로 기업의 기술역량을 분석합니다.',
        },
        {
            id: 'data',
            title: '데이터 기반 분석',
            description:
                '기술평가 및 기업 관련 데이터를 활용하여 기업의 다양한 역량과 성장 가능성을 파악할 수 있도록 지원합니다.',
        },
        {
            id: 'open',
            title: '개방형 서비스',
            description: '기업과 금융·투자기관, 공공기관 등 다양한 이용자가 목적에 맞는 서비스를 활용할 수 있습니다.',
        },
    ],
    // 정량 지표 — value 가 숫자면 0부터 올라간다(PlatformStats). 숫자가 아니면(AI) 그대로 보인다.
    stats: [
        {label: '기술평가 업력', value: '25', unit: '년', description: '기보 기술평가 업력'},
        {label: '기술평가 데이터', value: '86', unit: '만 건', description: '기술평가 빅데이터'},
        {label: '평가모형', value: 'AI', unit: '모델', description: '전문 기술평가 인력의 축적된 노하우'},
    ],
} as const

// 질문으로 알아보는 K-TOP — 질문을 고르면 아래 답변 칸이 바뀐다.
const PLATFORM_QUESTIONS = {
    title: '질문으로 알아보는 K-TOP',
    description: '궁금한 질문을 선택하면 아래에서 답변을 확인할 수 있습니다.',
    items: [
        {
            id: 'what',
            question: 'K-TOP은 어떤 플랫폼인가요?',
            answers: [
                '기술보증기금의 빅데이터와 AI를 활용해 기술평가정보를 생성하는 플랫폼입니다.',
                '기업과 유관기관 등 누구나 활용할 수 있는 기술평가 포털입니다.',
            ],
        },
        {
            id: 'why',
            question: '왜 만들어졌나요?',
            answers: [
                '데이터 개방 정책에 부합하는 플랫폼으로 만들어졌습니다.',
                '기업의 혁신과 성장을 위한 평가를 지원합니다.',
                '민간 주도 혁신 생태계를 활성화하는 허브 역할을 합니다.',
            ],
        },
        {
            id: 'made-of',
            question: '무엇으로 만들어졌나요?',
            answers: [
                '기술보증기금이 25년간 축적한 86만 건의 기술평가 빅데이터를 바탕으로 합니다.',
                '전문 기술평가 인력이 쌓아 온 노하우를 담았습니다.',
                '평가 목적에 맞게 최적화된 AI 모델을 활용합니다.',
            ],
        },
        {
            id: 'who',
            question: '누가 활용하나요?',
            answers: [
                '기업과 은행 등 민간금융기관, 민간투자기관이 활용합니다.',
                '정부와 공공기관, R&D 혁신지원기관도 활용합니다.',
                '공공연구원과 민간평가기관 등에서도 활용할 수 있습니다.',
            ],
        },
        {
            id: 'open',
            question: '무엇을 개방하나요?',
            answers: [
                '혁신성장기업을 선별하는 테크인덱스(Tech-Index)를 개방합니다.',
                '신속한 기술금융 지원을 위한 KTRS-FM 모형을 개방합니다.',
                '기술 기반 혁신을 유도하는 원천기술 평가모델을 개방합니다.',
            ],
        },
        {
            id: 'how',
            question: '어떻게 활용하나요?',
            answers: [
                '혁신기업을 선별하고 모니터링하며 성과를 관리하는 데 활용할 수 있습니다.',
                '고성장이 예상되는 기업을 미리 선별해 지원할 수 있습니다.',
                '기업은 자가진단을 통해 성장의 발판을 마련할 수 있습니다.',
            ],
        },
    ],
} as const

// 주요 서비스 — segment 는 같은 메뉴(플랫폼 소개)의 서비스별 소개 화면 경로다. 탄소중립도 소개 화면으로 간다.
type PlatformServiceKind = 'tech' | 'patent' | 'bigx' | 'carbon'

const PLATFORM_SERVICES = {
    title: 'K-TOP에서 제공하는 서비스를 확인하세요',
    description: '평가부터 기업분석, 탄소중립 진단까지 목적에 맞는 서비스를 제공합니다.',
    items: [
        {
            kind: 'tech',
            name: '기술평가',
            description: '기업의 기술사업화 역량과 혁신성장 가능성을 평가하는 서비스',
            chipsLabel: '주요 평가모형',
            chips: ['KTRS-FM', 'Tech-Index', '투자모형'],
            linkLabel: '기술평가 알아보기',
            segment: 'technology-evaluation',
        },
        {
            kind: 'patent',
            name: '특허평가',
            description: '특허의 가치 실현 가능성을 분석하고 평가등급을 확인하는 서비스',
            chipsLabel: '주요 기능',
            chips: ['KPAS', '특허 등급조회', '결과보고서'],
            linkLabel: '특허평가 알아보기',
            segment: 'patent-evaluation',
        },
        {
            kind: 'bigx',
            name: 'K-BIGx 보고서',
            description: '기업의 기술·재무·혁신정보를 분석하여 맞춤형 보고서를 제공하는 서비스',
            chipsLabel: '주요 기능',
            chips: ['기업혁신성장 보고서', '기술혁신정보', 'PDF 다운로드'],
            linkLabel: 'K-BIGx 알아보기',
            segment: 'k-bigx-report',
        },
        {
            kind: 'carbon',
            name: '탄소중립',
            description: '탄소배출 및 감축계획 진단과 K-택소노미 적합성 판단을 지원하는 서비스',
            chipsLabel: '주요 서비스',
            chips: ['탄소중립 선도중소기업확인', '개방형 K-택소노미'],
            linkLabel: '탄소중립 알아보기',
            segment: 'carbon-neutrality',
        },
    ],
} as const satisfies {
    title: string
    description: string
    items: readonly {
        kind: PlatformServiceKind
        name: string
        description: string
        chipsLabel: string
        chips: readonly string[]
        linkLabel: string
        segment: string
    }[]
}

// 이용 대상 — 패널 3장. icon 은 화면 파일이 키로 고른다.
const PLATFORM_AUDIENCE = {
    title: '기술혁신 지원을 위한 개방형 기술평가 플랫폼 이용대상',
    description:
        '기보는 25년간의 노하우가 집약된 개방형 기술평가 플랫폼을 제공함으로써, 이곳에서 다양한 참여자가 새로운 가치를 창출하고, 그로부터 민간 주도형 기술평가 혁신 생태계가 번영하기를 기대하며 상생과 협력의 꿈을 꿉니다.',
    lead: 'K-TOP, 누가 사용하나요?',
    items: [
        {
            id: 'company',
            title: '중소벤처기업',
            subtitle: '자가진단·기업혁신',
            description: '기업은 자가진단과 전문가 평가를 통해 기술역량을 확인할 수 있습니다.',
            users: [{name: '중소기업고객', uses: '기업수준 파악 · 자기주도 혁신'}],
        },
        {
            id: 'finance',
            title: '금융·기관',
            subtitle: '기업선별·지원',
            description: '조건에 맞는 기업 검색부터 지원 대상 선정까지, 데이터 기반 의사결정을 지원합니다.',
            users: [
                {name: '금융·투자기관', uses: '기술금융 신속지원 · 지원·투자 대상 발굴 · 우대지원 기준 선정'},
                {name: '혁신(R&D) 지원기관', uses: 'R&D 대상기업 선정 · 성과분석·사후관리 · 수준별 기업 지원'},
            ],
        },
        {
            id: 'public',
            title: '정부·연구기관',
            subtitle: '정책 연구·활용',
            description: '중소기업 현황 분석부터 정책 수립·효과 분석까지, 정책 연구에 필요한 근거 데이터를 제공합니다.',
            users: [
                {name: '정부부처', uses: '성장·고용 등 정책연구 · R&D 효과분석 · 중소기업 현황 분석'},
                {name: '공공연구소', uses: '정책목표 설정 · 정책수립 및 점검 · 제도 개선 및 기획'},
                {name: '대학 산학연', uses: '학술분석 · 기초연구 활용'},
            ],
        },
    ],
} as const

const PLATFORM_FLOW = {
    title: ['필요한 서비스를 선택하고', '평가·분석 정보를 확인하세요'],
    description: '서비스별 세부 신청 절차는 각 서비스 소개 화면에서 확인할 수 있습니다.',
    steps: [
        {
            title: '서비스 선택',
            description: '이용 목적에 맞는 서비스를 확인합니다.',
            tagsLabel: '선택할 수 있는 서비스',
            tags: ['기술평가', '특허평가', 'K-BIGx 보고서', '탄소중립'],
        },
        {title: '정보 입력 및 조회', description: '각 서비스에서 필요한 정보를 입력하거나 대상을 검색합니다.'},
        {title: '결과 확인 및 활용', description: '평가 결과 또는 분석정보를 확인하고 활용합니다.'},
    ],
} as const

const PLATFORM_CTA = {
    title: 'K-TOP의 주요 서비스를 확인해 보세요',
    description: '기술평가 · 특허평가 · K-BIGx 보고서 · 탄소중립',
    actionLabel: '서비스 살펴보기',
} as const

const platformServiceHref = (userType: PlatformIntroUserType, segment: string) => `/${userType}/platform/${segment}`

export {
    PLATFORM_AUDIENCE,
    PLATFORM_CTA,
    PLATFORM_FLOW,
    PLATFORM_HERO,
    PLATFORM_INTRO_TITLE,
    PLATFORM_QUESTIONS,
    PLATFORM_SECTIONS,
    PLATFORM_SERVICES,
    PLATFORM_VALUE,
    platformServiceHref,
}
export type {PlatformIntroUserType, PlatformSectionId, PlatformServiceKind}
