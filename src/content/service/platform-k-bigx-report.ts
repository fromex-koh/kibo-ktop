import type {RollingAccordionGroup} from '@/components/composite/rolling-accordion'

// 플랫폼 소개 > K-BIGx 보고서 화면의 문구 — 시안 "K-BIGx 보고서". 기업 · 기관 화면이 함께 쓴다.
//
// 시안에서 확인이 필요한 문구 — 활용분야 본문이 기대효과와 같은 문장이다(시안 그대로 옮김, 원고 확인 필요).

const PLATFORM_K_BIGX_REPORT = {
    title: 'K-BIGx 보고서',
    hero: {
        /** 큰 제목 — 둘째 줄은 강조색. */
        titleLines: ['기술과 재무, 혁신 인사이트', 'K-BIGx AI 분석 보고서'],
        lead: 'AI가 기업의 기술력·재무현황을 통합 분석하여, 신뢰할 수 있는 의사결정 근거를 제공합니다.',
        descriptionLines: [
            'K-BIGx는 기업의 재무·비재무정보와 함께 기술 데이터를 체계적으로 수집·분석하여',
            '투자자, 금융기관, 기업이 활용할 수 있는 표준화된 분석 보고서를 제공하는 서비스입니다.',
        ],
        cards: [
            {
                image: 'hero-ai-report',
                title: 'AI 기반의 맞춤형 보고서',
                description:
                    '기업의 기술·재무현황·혁신역량을 통합적으로 분석하여, 기술혁신의 판단 근거가 되는 맞춤형 보고서를 제공합니다.',
            },
            {
                image: 'hero-sme-target',
                title: '중소·벤처기업 대상',
                description: '중소·벤처기업을 대상으로 하며, 기업 또는 특허 검색을 통해 보고서를 조회할 수 있습니다.',
            },
            {
                /** 기존 선택 카드 그림(option-card/clipboard-check-chart)을 함께 쓴다. */
                image: 'clipboard-check-chart',
                title: 'K-BIGx 차별점',
                description:
                    '기업 정보(특허, 재무 등)를 자동 수집하고, 이를 AI로 분석하여 신뢰성 높은 보고서를 맞춤형으로 제공합니다.',
            },
        ],
    },
    features: {
        title: 'K-BIGx가 제공하는 분석 기능을 소개합니다.',
        items: [
            {
                icon: 'ai-analysis-report',
                title: 'AI 기반 종합 분석 보고서',
                description: '기업의 기술력, 재무현황, 혁신지수를 표준화된 기준으로 통합 분석합니다.',
            },
            {
                icon: 'peer-comparison',
                title: '동종업계 비교 분석',
                description: '동일 기술분야 기업과의 비교를 통해 상대적 위치와 경쟁력을 파악할 수 있습니다.',
            },
            {
                icon: 'industry-trend',
                title: '산업 동향 정보',
                description:
                    '기업의 기술분야에 대한 R&D 사업정보 및 개발이슈, 유사 기술분야에 대한 성장 정보를 제공합니다.',
            },
            {
                icon: 'insight',
                title: '인사이트 제공',
                description: '기업의 기술정보와 재무정보를 다각도로 분석하여 기술혁신의 인사이트를 제공합니다.',
            },
        ],
    },
    /** 보고서 생성 흐름도 — 신청기업 → 두 DB → (특허정보 + 기업정보) + LLM → 기술혁신정보 DB → 보고서. */
    flow: {
        applicantLines: ['신청기업', '(보유기술)'],
        databases: [
            {title: '기업정보DB', items: ['기업개요정보', '신용/재무정보', '활동성(동태)정보']},
            {title: 'Tech-Index DB', items: ['혁신성장역량지수(점수)', '혁신성장역량지수 비교정보']},
        ],
        sources: [
            {icon: 'patent-info', label: '특허정보'},
            {icon: 'company-info', label: '기업정보'},
        ],
        llm: {icon: 'llm', label: 'LLM'},
        innovationDb: {
            title: '기술혁신정보 DB',
            categories: ['기술분류 A', '기술분류 B', '...'],
            note: '우수기업·우수특허·R&D사업정보·R&D이슈 …',
        },
        buildLines: ['LLM 기반의 특허분석 결과를 기반으로', '기술분류 및 기술 맞춤형 혁신정보 데이터 베이스 구축'],
        report: {
            title: '기업 맞춤형 BIGx 보고서',
            description: '기업정보, 혁신성장역량지수 정보, 기술혁신정보, 신용/재무정보. 활동성정보',
        },
    },
    procedure: {
        title: '기업 조회부터 보고서 확인까지 4단계로 진행됩니다.',
        steps: [
            {title: '기업정보 입력', description: '기업명 또는 사업자등록번호로 분석 대상을 검색합니다.'},
            {title: '기술조회', description: '조회된 기업의 특허 목록 중에서 분석 대상 기술을 선택합니다.'},
            {title: '기술정보분석', description: '수집된 데이터를 표준화된 분석으로 종합 처리합니다.'},
            {title: '보고서 확인', description: '분석 결과를 PDF 형태의 보고서로 열람 및 다운로드 합니다.'},
        ],
    },
} as const

/** 아래 묶음(RollingAccordion) — 결과정보 · 기대효과 · 활용분야. */
const K_BIGX_REPORT_SECTIONS: readonly {
    value: 'results' | 'effect' | 'usage'
    title: string
    groups: readonly RollingAccordionGroup[]
}[] = [
    {
        value: 'results',
        title: '결과정보',
        groups: [
            {heading: '기업개요'},
            {heading: '기업 혁신성장지수(Tech-Index) 정보'},
            {
                heading: '기술혁신정보(기업 또는 기술분야별)',
                items: [
                    'Peer Group(기술분류 내 매출액 규모)별 사업실적(매출액, 영업이익률) 우수기업, 고성장기업(매출액)',
                    '기술분류 내 우수특허(피인용 횟수, 피인용 지수), 최다 특허 보유 기업, 경쟁기업군, 이머징 기술, R&D 이슈, 정부 R&D 과제 및 R&D 전문기관 현황',
                ],
            },
            {heading: '기업 재무정보', items: ['최근 3개년 재무정보, 기업신용등급']},
            {
                heading: '기업 활동성(동태) 정보',
                items: ['통신비, 보험 등 자동이체 정상 출금 금액(횟수)', '전기/수도/가스 요금납부 정보 등'],
            },
        ],
    },
    {
        value: 'effect',
        title: '기대효과',
        groups: [
            {
                text: '신용/재무정보 중심의 보편화된 정보제공에서 벗어나 중소·벤처기업이 보유하고 있는 기술 중심의 차별화된 기술혁신정보를 제공합니다.',
            },
        ],
    },
    {
        value: 'usage',
        title: '활용분야',
        groups: [
            {
                text: '신용/재무정보 중심의 보편화된 정보제공에서 벗어나 중소·벤처기업이 보유하고 있는 기술 중심의 차별화된 기술혁신정보를 제공합니다.',
            },
        ],
    },
]

export {K_BIGX_REPORT_SECTIONS, PLATFORM_K_BIGX_REPORT}
