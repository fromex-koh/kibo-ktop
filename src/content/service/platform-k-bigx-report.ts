import type {PlatformIntroUserType} from '@/content/service/platform-intro'

// 플랫폼 소개 > K-BIGx 보고서 화면 원고 — 기업 · 기관 /platform/k-bigx-report 가 함께 쓴다(components/custom/platform-k-bigx-report.tsx).
// 문구를 고칠 때는 이 파일만 바꾼다. 화면 구성(위 → 아래):
//   화면 제목 → 히어로(글 | 보고서 표지 + 반원 게이지) → 섹션 이동 탭 → 서비스 소개(카드 3) → 분석 기능(아이콘 패널 4)
//   → 보고서 미리보기(항목 메뉴 | 캡처 · 주요 제공 정보) → 분석 구조(도식 + 제공정보 · 기대효과 · 활용분야)
//   → 이용 절차(4단계 + 이용 안내) → 마무리 배너.
// 설명이 문자열 배열이면 배열 한 칸 = 한 줄(화면이 <br> 로 잇는다). 줄을 바꾸려면 배열을 나누거나 합친다.
//   분석 기능(PLATFORM_K_BIGX_FUNCTIONS) 설명만 PC(1280↑)에서 끊고, 그보다 좁은 화면은 칸 폭대로 이어 흐른다.

const PLATFORM_K_BIGX_TITLE = 'K-BIGx 보고서'

const PLATFORM_K_BIGX_HERO = {
    /** 제목 첫 줄(본문색). 둘째 줄 = title + 강조 낱말(titleEmphasis, 서비스 강조색 — 플랫폼 소개의 'K-TOP'처럼 서비스 이름). */
    titleTop: '기술에 대한',
    /** 첫 줄 끝 — 좁은 폭에서도 끊지 않는 묶음. */
    titleTopKeep: '혁신 인사이트',
    title: 'AI 기반 기업혁신성장 보고서',
    titleEmphasis: 'K-BIGx',
    lead: ['AI가 기업의 기술력·재무현황을 통합 분석하여,', '신뢰할 수 있는 의사결정 근거를 제공합니다.'],
    previewActionLabel: '보고서 미리보기',
    startActionLabel: 'K-BIGx 보고서 조회',
    loginNote: '로그인 후 이용할 수 있습니다.',
    /** 오른쪽 보고서 표지(PC 1024↑). */
    cover: {
        brand: 'K-BIGx',
        title: '기업혁신성장 보고서',
        contents: [
            '01 진단브리핑',
            '02 기업현황',
            '03 기술혁신정보',
            '04 Tech-Index',
            '05 신용/재무정보',
            '06 활동성정보',
        ],
        publisher: '기술보증기금',
        label: 'K-BIGx 기업혁신성장 보고서 표지',
    },
} as const

// 섹션 이동 탭 — id 는 각 section 의 id 와 같다.
const PLATFORM_K_BIGX_SECTIONS = [
    {id: 'features', label: '서비스 소개'},
    {id: 'functions', label: '분석 기능'},
    {id: 'preview', label: '보고서 미리보기'},
    {id: 'analysis', label: '분석 구조'},
    {id: 'process', label: '이용 절차'},
] as const

const PLATFORM_K_BIGX_FEATURES = {
    title: 'K-BIGx 서비스 소개',
    description: [
        'K-BIGx는 기업의 재무·비재무정보와 함께 기술정보를 체계적으로 수집·분석하여',
        '투자자·금융기관·기업이 활용할 수 있는 분석 보고서를 제공하는 서비스입니다.',
    ],
    items: [
        {
            id: 'ai-report',
            title: 'AI 기반의 맞춤형 보고서',
            description: [
                '기업의 기술·재무현황, 기술역량을 분석하여,',
                '기술혁신의 판단 근거를 맞춤형으로 제공합니다.',
            ],
        },
        {
            id: 'sme-target',
            title: '기술기업 대상',
            description: ['원하는 기업 및 특허를 검색하여', '맞춤형으로 보고서를 조회할 수 있습니다.'],
        },
        {
            id: 'difference',
            title: 'K-BIGx 차별점',
            description: ['기업정보의 기준을 업종에서 기술로!', 'AI를 통해 맞춤형 기술혁신정보를 제공합니다.'],
        },
    ],
} as const

const PLATFORM_K_BIGX_FUNCTIONS = {
    title: 'K-BIGx가 제공하는 분석 기능을 소개합니다',
    items: [
        {
            id: 'ai-analysis-report',
            title: 'AI 기반 종합 분석 보고서',
            description: [
                'AI 기반의 기술정보에',
                '재무정보와 활동성정보 등이 결합된',
                '종합 분석 보고서를 제공합니다.',
            ],
        },
        {
            id: 'peer-comparison',
            title: '기술분야 비교 분석',
            description: ['동일 기술분야 기업과의 비교로', '기업의 기술경쟁력을', '한 눈에 파악할 수 있습니다.'],
        },
        {
            id: 'industry-trend',
            title: '기술 동향 정보',
            description: [
                '우수특허, 개발이슈,',
                '기술분야별 발전정보와 같은',
                '기술 동향 정보를',
                '기업 맞춤형으로 제공합니다.',
            ],
        },
        {
            id: 'insight',
            title: '인사이트 제공',
            description: [
                '고성장 기업정보, R&D 전문기관,',
                '정부 R&D 사업정보 등을 통해',
                '기업에 기술혁신 인사이트를 제공합니다.',
            ],
        },
    ],
} as const

// 보고서 미리보기 — 항목마다 캡처(라이트 · 다크, 화면이 id 로 고른다) · 설명 · 주요 제공 정보.
const PLATFORM_K_BIGX_PREVIEW = {
    title: 'K-BIGx 보고서를 미리 확인해 보세요',
    listLabel: '보고서 항목',
    reportName: 'K-BIGx 기업혁신성장 보고서',
    infoTitle: '주요 제공 정보',
    sampleBadge: '샘플 화면',
    scrollCaption: '스크롤하여 전체 보기',
    sampleNote: '기업명·인명·수치는 예시 데이터입니다.',
    sections: [
        {
            id: 'briefing',
            name: '진단브리핑',
            description: '보고서 전체의 핵심 결과를 한 페이지로 요약해 보여줍니다.',
            info: [
                {title: '기업 정보', description: '기업 기본정보 요약'},
                {
                    title: '기술혁신정보',
                    description: '기업 보유기술 · 관련 기업 및 특허현황 · R&D 이슈 · 정부 R&D사업 접수현황',
                },
                {title: '혁신성장역량지수', description: 'Tech-Index 요약'},
                {
                    title: '신용/재무 · 활동성',
                    description: '기업신용등급 · 재무비율진단 · 최근 3개년 재무 현황 · 종업원수 · 인당 매출액',
                },
            ],
        },
        {
            id: 'company',
            name: '기업현황',
            description: '기업개요',
            info: [
                {title: '개요 · 경영진 및 주주현황', description: '기업개요, 경영진 현황, 주주 현황'},
                {title: '관계기업 · 특허 및 인증현황', description: '관계기업 현황, 특허·인증 보유 현황'},
                {title: '재무현황', description: '재무상태 · 손익현황 · 주요재무비율 · 현금흐름'},
                {title: '거래처현황', description: '매출처 · 매입처'},
            ],
        },
        {
            id: 'innovation',
            name: '기술혁신정보',
            description: '기술혁신정보(기업 또는 기술분야별)',
            info: [
                {
                    title: '사업실적 우수기업',
                    description:
                        'Peer Group(기술분류 내 매출액 규모)별 사업실적(매출액, 영업이익률) 우수기업, 고성장기업(매출액)',
                },
                {
                    title: '우수특허 · R&D',
                    description:
                        '기술분류 내 우수특허(피인용 횟수, 피인용 지수), 최다 특허 보유 기업, 경쟁기업군, 이머징 기술, R&D 이슈, 정부 R&D 과제 및 R&D 전문기관 현황',
                },
                {title: '보유기술 · 특허기술 분석', description: '기술·특허 보유현황, 분석특허'},
            ],
        },
        {
            id: 'tech-index',
            name: 'Tech-Index',
            description: '기업 혁신성장지수(Tech-Index) 정보',
            info: [
                {title: '혁신성장역량지수', description: 'Tech-Index 점수와 표준정보 비교, 기업 유형별 비교'},
                {title: '4대 혁신역량 점수', description: '인프라 · 투입 · 활동 · 성과'},
                {title: '세부지표별 상대비교분석', description: '역량·투자 지표, 특허·기술 지표'},
                {title: '지수설명', description: '지수의 구성과 해석 안내'},
            ],
        },
        {
            id: 'credit',
            name: '신용/재무정보',
            description: '기업 재무정보',
            info: [
                {title: '기업 재무정보', description: '최근 3개년 재무정보, 기업신용등급'},
                {title: '재무비율진단', description: '성장성 · 수익성 · 안정성 · 활동성'},
                {title: '차입금 분석', description: '차입금 변동현황 · 기관별 비중 · 신용/담보 비중'},
            ],
        },
        {
            id: 'activity',
            name: '활동성정보',
            description: '기업 활동성(동태) 정보',
            info: [
                {title: '자동이체 정보', description: '통신비, 보험 등 자동이체 정상 출금 금액(횟수)'},
                {title: '요금납부 정보', description: '전기/수도/가스 요금납부 정보 등'},
                {
                    title: '인적자원 · 에너지 사용 현황',
                    description: '분기별 종업원수 · 인당 매출액 · 전기 · 가스 사용량',
                },
            ],
        },
        {
            id: 'reference',
            name: '참고자료',
            description: '보고서에 쓰인 등급의 정의',
            info: [{title: '등급정의', description: '신용등급 · 현금흐름등급의 정의'}],
        },
    ],
} as const

const PLATFORM_K_BIGX_ANALYSIS = {
    title: 'K-BIGx 분석 구조',
    diagram: {
        label: 'K-BIGx 분석 구조 개념도',
        startLines: ['신청기업', '(보유기술)'],
        databases: [
            {title: '기업정보DB', items: ['기업개요정보', '신용/재무정보', '활동성(동태)정보']},
            {title: 'Tech-Index DB', items: ['혁신성장역량지수(점수)', '혁신성장역량지수 비교정보']},
        ],
        sources: {patent: '특허(기술)정보', company: '기업정보', llm: 'LLM'},
        techDatabase: {
            title: '기술혁신정보 DB',
            classes: ['기술분류 A', '기술분류 B', '...'],
            description: '우수기업·우수특허·R&D사업정보·R&D이슈 …',
        },
        noteLines: ['LLM 기반의 특허분석 결과를 기반으로', '기술분류 및 기술 맞춤형 혁신정보 데이터 베이스 구축'],
        result: {
            /** 이름 — 줄이 바뀌면 titleLead 뒤에서만 바뀐다('K-' 붙임표 뒤에서 끊기지 않게 titleKeep 은 한 덩어리). */
            titleLead: '기업 맞춤형',
            titleKeep: 'K-BIGx 보고서',
            tagsLabel: '보고서 제공 정보',
            tags: ['기업정보', '기술혁신정보', '혁신성장역량지수', '신용/재무정보', '활동성정보'],
        },
    },
    outcome: {
        title: 'K-BIGx 보고서 제공정보 · 기대효과 · 활용분야',
        results: {
            title: '제공정보',
            items: [
                {text: '기업개요'},
                {
                    text: '기술혁신정보(기술분야별)',
                    subItems: [
                        '경쟁기업 사업실적(매출액, 영업이익률), 성장률 우수기업',
                        '우수특허, 이머징 기술, R&D 전문기관, R&D 이슈 및 정부 R&D 사업 현황',
                    ],
                },
                {text: '기업 혁신성장역량지수(Tech-Index)'},
                {
                    text: '신용/재무정보',
                    subItems: ['기업신용등급, 현금흐름등급, 기업신용정보', '차입금 분석, 재무비율 진단'],
                },
                {text: '활동성정보', subItems: ['인적자원 현황, 에너지 사용 현황(전기, 가스)']},
            ],
        },
        /** 글 묶음 — description(한 문단) 또는 rows(대상별 한 줄: '대상: 내용'). */
        notes: [
            {
                title: '기대효과',
                description:
                    'AI 기반 기업·기술정보 분석을 통해 기업의 기술경쟁력 강화와 데이터 기반 성장 의사결정을 지원',
            },
            {
                title: '활용분야',
                rows: [
                    {label: '기업', text: '보유기술분석, 성장전략 수립, 마케팅 등'},
                    {label: '지원기관', text: '기업발굴, 지원사업 성과분석 등'},
                ],
            },
        ],
    },
} as const

const PLATFORM_K_BIGX_PROCESS = {
    title: '기업 조회부터 보고서 확인까지 4단계로 진행됩니다',
    steps: [
        {title: '기업정보 입력', description: '기업명 또는 사업자등록번호로 분석 대상을 검색합니다.'},
        {title: '기술선택', description: '조회된 기업의 특허 목록 중에서 분석 대상 기술을 선택합니다.'},
        {title: '기술정보분석', description: '수집된 데이터를 표준화된 분석으로 종합 처리합니다.'},
        {title: '보고서 확인', description: '분석 결과를 PDF 형태의 보고서로 열람 및 다운로드합니다.'},
    ],
    /** 아래 안내 — 가운데 '가격정책'(pricingLinkLabel)은 가격정책 화면 링크. */
    notice: {
        before: '보고서 조회는 로그인 후 이용할 수 있으며, 이용권 및 이용 요금은 ',
        pricingLinkLabel: '가격정책',
        after: '에서 확인할 수 있습니다.',
    },
} as const

const PLATFORM_K_BIGX_CTA = {
    title: '기업의 혁신성장 정보를 K-BIGx에서 확인하세요',
    description: '기업명 또는 사업자등록번호로 검색해 보고서를 조회할 수 있습니다. (로그인 필요)',
    actionLabel: 'K-BIGx 보고서 조회',
} as const

// 이동 주소 — 기업혁신성장 보고서 조회.
const PLATFORM_K_BIGX_ROUTES: Record<PlatformIntroUserType, string> = {
    corp: '/corp/k-bigx-report/innovation-growth-report',
    org: '/org/k-bigx-report/innovation-growth-report',
}

export {
    PLATFORM_K_BIGX_ANALYSIS,
    PLATFORM_K_BIGX_CTA,
    PLATFORM_K_BIGX_FEATURES,
    PLATFORM_K_BIGX_FUNCTIONS,
    PLATFORM_K_BIGX_HERO,
    PLATFORM_K_BIGX_PREVIEW,
    PLATFORM_K_BIGX_PROCESS,
    PLATFORM_K_BIGX_ROUTES,
    PLATFORM_K_BIGX_SECTIONS,
    PLATFORM_K_BIGX_TITLE,
}
