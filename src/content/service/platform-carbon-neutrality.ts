import {CARBON_NEUTRAL_HOME_URL} from '@/constants/header-navigation'

// 플랫폼 소개 > 탄소중립 화면 원고 — 기업 · 기관 /platform/carbon-neutrality 가 함께 쓴다(components/custom/platform-carbon-neutrality.tsx).
// 문구를 고칠 때는 이 파일만 바꾼다. 화면 구성(위 → 아래):
//   화면 제목 → 히어로(글 | 서비스 카드 2장) → 서비스 토글 + 섹션 탭(한 줄 고정 바)
//   → 서비스 소개(카드 3) → 주요 기능(아이콘 패널 3) → 이용 절차(선도중소기업확인 5단계 | K-택소노미 기능 3)  ← 토글로 고른 서비스
//   → 이용 대상(두 서비스 공통 6) → 마무리 배너(진단 시작하기 두 개).
// 외부 탄소중립 플랫폼으로 가는 버튼은 모두 이동 확인 모달을 거쳐 새 탭으로 연다.

type CarbonServiceKey = 'leading-sme' | 'taxonomy'

const PLATFORM_CARBON_TITLE = '탄소중립'

// 외부 사이트 이동 확인 모달 — 모든 버튼이 같은 문구(둘 다 탄소중립 플랫폼 안의 화면).
const PLATFORM_CARBON_MOVE_DIALOG = {
    title: '탄소중립 플랫폼 이동',
    siteName: '탄소중립 플랫폼',
    question: '페이지로 이동하시겠습니까?',
} as const

const PLATFORM_CARBON_HERO = {
    eyebrow: 'CARBON NEUTRALITY',
    /** 제목 — 첫 줄(PC 에서 줄을 바꾼다) · 둘째 줄 + 강조 낱말. '…까지,' 묶음은 좁은 폭에서도 끊지 않는다. */
    titleTop: '탄소감축에서부터',
    titleTopKeep: 'K-택소노미까지,',
    title: '한 번으로 끝내는',
    titleEmphasis: '탄소중립 플랫폼',
    lead: '기업의 탄소중립 경영혁신과 녹색경제활동을 지원하며 지속가능한 성장을 뒷받침합니다.',
    subLead:
        'K-TOP 탄소중립 플랫폼은 기업의 탄소배출 현황을 진단하여 감축계획 수립에 도움을 주고, 한국형 녹색분류체계 적합성 판단을 지원합니다. 정부의 탄소중립 정책에 대응하고 녹색경영 역량을 강화하세요.',
    actionLabel: '서비스 이용하기',
    actionHref: CARBON_NEUTRAL_HOME_URL,
    note: '탄소중립 플랫폼(외부 사이트)에서 이용할 수 있습니다.',
    /** 오른쪽 서비스 카드(PC 1024↑). 아이콘은 화면이 key 로 고른다. */
    cards: [
        {
            key: 'leading-sme',
            title: '탄소중립 선도중소기업확인',
            tags: ['배출량 진단', '감축계획 수립', '탄소중립 수준 진단'],
        },
        {key: 'taxonomy', title: '개방형 K-택소노미', tags: ['키워드 검색', '자가진단', '전문평가']},
    ],
    cardsLabel:
        '탄소중립 서비스 2종: 탄소중립 선도중소기업확인 플랫폼(배출량 진단, 감축계획 수립, 탄소중립 수준 진단)과 개방형 K-택소노미 플랫폼(키워드 검색, 자가진단, 전문평가)',
} as const

// 서비스 토글 — value 는 서비스 key.
const PLATFORM_CARBON_SWITCH = {
    label: '탄소중립 서비스',
    options: [
        {value: 'leading-sme', label: '탄소중립 선도중소기업확인'},
        {value: 'taxonomy', label: '개방형 K-택소노미'},
    ],
} as const

// 섹션 이동 탭 — id 는 각 section 의 id 와 같다.
const PLATFORM_CARBON_SECTIONS = [
    {id: 'intro', label: '서비스 소개'},
    {id: 'features', label: '주요 기능'},
    {id: 'process', label: '이용 절차'},
    {id: 'audience', label: '이용 대상'},
] as const

// 서비스별 내용 — 서비스 소개(카드 3) · 주요 기능(패널 3) · 이용 절차. 그림 · 아이콘은 화면이 id 로 고른다.
const PLATFORM_CARBON_SERVICES = {
    'leading-sme': {
        intro: {
            title: '탄소중립 선도중소기업확인 플랫폼',
            description: '중소기업의 탄소배출량 산정부터 감축계획 수립, 탄소중립 수준 진단까지 지원합니다.',
            cards: [
                {
                    id: 'service',
                    title: '탄소중립 선도중소기업확인',
                    description:
                        '중소기업의 탄소감축계획 수립과 탄소중립 경영혁신수준 진단을 통해 탄소중립 선도기업으로의 도약을 지원합니다.',
                },
                {
                    id: 'target',
                    title: '중소기업에서 활용 가능',
                    description:
                        '사업장 온실가스 배출 관리를 통해 탄소중립 계획수립이 필요한 중소기업에서 활용 가능합니다.',
                },
                {
                    id: 'difference',
                    title: '선도중소기업확인 차별점',
                    bullets: [
                        '복잡하고 어려운 탄소배출량 산출을 에너지사용량 자료만으로 쉽게 산출해 드립니다.',
                        '감축 방법론을 제공하여 기업의 탄소감축활동에 따른 예상 감축량을 확인할 수 있습니다.',
                        '간단한 진단표 작성을 통해 기업의 탄소중립 경영혁신 수준을 파악할 수 있습니다.',
                    ],
                },
            ],
        },
        features: {
            eyebrow: '탄소중립 선도중소기업확인',
            title: '중소기업의 탄소중립 실현에 필요한 분석 기능을 제공합니다',
            items: [
                {
                    id: 'emission-diagnosis',
                    title: '배출량 진단',
                    description:
                        '기업의 에너지사용량 등 활동자료 입력을 통해 Scope 1‧2‧3 온실가스 배출량을 산정해 드립니다.',
                },
                {
                    id: 'reduction-plan',
                    title: '감축계획 수립',
                    description: '기업의 탄소감축 활동에 따른 예상 감축량 산정을 통해 감축계획 수립에 도움을 줍니다.',
                },
                {
                    id: 'level-diagnosis',
                    title: '탄소중립 수준 진단',
                    description:
                        '기업의 현재 상황과 감축 목표 등을 통해 기업의 탄소감축 역량과 수준을 파악할 수 있습니다.',
                },
            ],
        },
        process: {
            title: '기업의 탄소중립 역량 진단이 5단계로 완료됩니다',
            steps: [
                {title: '기업정보 입력', description: '기업 정보 및 현황 자료를 입력합니다.'},
                {title: '배출량 산정', description: '탄소배출 관련 활동자료를 입력합니다.'},
                {title: '감축잠재량 산정', description: '감축방법론에 따른 상세 자료를 입력합니다.'},
                {title: '감축목표 설정', description: '목표 감축율을 자가 설정합니다.'},
                {title: '평가지표 작성', description: '감축역량 및 수준 진단을 위한 평가지표를 작성합니다.'},
            ],
        },
    },
    taxonomy: {
        intro: {
            title: '개방형 K-택소노미 플랫폼',
            description: '기업의 경제활동이 녹색경제활동에 해당하는지 누구나 직접 확인할 수 있습니다.',
            cards: [
                {
                    id: 'service',
                    title: '개방형 K-택소노미',
                    description:
                        '기업의 경제활동이 K-택소노미 가이드라인에 부합하는지 쉽고 빠르게 확인하고, 녹색금융에 대한 접근성을 높입니다.',
                },
                {
                    id: 'target',
                    title: '국민 누구나 활용 가능',
                    description: 'K-택소노미에서 정하는 녹색경제활동 판단이 필요한 국민 누구나 활용 가능합니다.',
                },
                {
                    id: 'difference',
                    title: '개방형 K-택소노미 차별점',
                    bullets: [
                        '키워드 검색, 질의응답을 통한 자가진단만으로 녹색경제활동을 직접 판단할 수 있습니다.',
                        '전문평가기관을 위한 심층평가 기능까지 원스톱 지원합니다.',
                    ],
                },
            ],
        },
        features: {
            eyebrow: '개방형 K-택소노미',
            title: '택소노미 적합성 판단을 위한 모든 과정을 하나의 플랫폼에서 지원합니다',
            items: [
                {
                    id: 'keyword-search',
                    title: '키워드 검색',
                    description: '제품, 업종코드 등 관련 키워드를 입력하시면, 적합한 녹색경제활동을 추천해 드립니다.',
                },
                {
                    id: 'self-diagnosis',
                    title: '자가진단',
                    description: '간단한 질의응답 과정을 통해 보다 정확한 녹색경제활동을 진단해 드립니다.',
                },
                {
                    id: 'expert-evaluation',
                    title: '전문평가',
                    description:
                        '택소노미 적합성 평가를 전문적으로 수행하는 외부검토기관을 위한 전문가용 기능을 제공합니다.',
                },
            ],
        },
        process: {
            title: '이용 목적에 따라 각각의 기능을 활용할 수 있습니다',
            items: [
                {
                    id: 'keyword-search',
                    title: '키워드 검색',
                    description: '생산 제품, 도입 시설, 업종코드 등 기업활동과 관련된 키워드 검색',
                },
                {
                    id: 'self-diagnosis',
                    title: '자가진단',
                    description: '기업에 해당하는 환경 목표 선택 후 질문 사항 체크',
                },
                {
                    id: 'expert-evaluation',
                    title: '전문평가',
                    description: '전문평가자격을 보유한 외부검토기관은 평가 수행 후 보고서 출력',
                },
            ],
        },
    },
} as const

const PLATFORM_CARBON_AUDIENCE = {
    title: '이런 기업에 적합합니다',
    description: 'K-TOP 탄소중립 플랫폼은 대한민국 탄소중립과 녹색경제활동 확산을 위해 설계되었습니다.',
    items: [
        {id: 'green-finance', label: '녹색금융 수혜기업'},
        {id: 'financial-institution', label: '녹색여신‧녹색채권 취급 금융기관'},
        {id: 'cbam', label: 'CBAM 대응 기업'},
        {id: 'supply-chain', label: '공급망(Scope3) 소속 제조기업'},
        {id: 'esg', label: 'ESG 공시기업'},
        {id: 'reviewer', label: '택소노미 평가 외부검토기관'},
    ],
} as const

const PLATFORM_CARBON_CTA = {
    title: '탄소중립 플랫폼에서 진단을 시작하세요',
    actions: [
        {
            id: 'carbon-reduction',
            label: '탄소중립 진단 시작하기',
            href: 'https://www.kibo.or.kr/carbon/carbon-reduction/guide',
        },
        {id: 'k-taxonomy', label: 'K-택소노미 진단 시작하기', href: 'https://www.kibo.or.kr/carbon/k-taxonomy/guide'},
    ],
} as const

export {
    PLATFORM_CARBON_AUDIENCE,
    PLATFORM_CARBON_CTA,
    PLATFORM_CARBON_HERO,
    PLATFORM_CARBON_MOVE_DIALOG,
    PLATFORM_CARBON_SECTIONS,
    PLATFORM_CARBON_SERVICES,
    PLATFORM_CARBON_SWITCH,
    PLATFORM_CARBON_TITLE,
}
export type {CarbonServiceKey}
