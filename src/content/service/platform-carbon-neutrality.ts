import type {ProcedureStep} from '@/components/custom/procedure-steps'
import type {RollingAccordionGroup} from '@/components/composite/rolling-accordion'
import {CARBON_NEUTRAL_HOME_URL} from '@/constants/header-navigation'

// 플랫폼 소개 > 탄소중립 화면의 문구 — 시안 "탄소중립_선도기업" · "탄소중립_택소노미". 기업 · 기관 화면이 함께 쓴다.
// 히어로 · '이런 기업에 적합합니다' · 바로가기는 두 플랫폼이 같고, 히어로 카드 · 분석 기능 · 아래 묶음은 고른 플랫폼에 따라 바뀐다.

type CarbonPlatformKey = 'leading-sme' | 'taxonomy'

/** 그림 · 아이콘 이름 — 화면 컴포넌트가 이름으로 그림 파일을 고른다. */
type CarbonHeroCard = {
    title: string
    description?: string
    bullets?: readonly string[]
    image: 'clipboard-check-chart' | 'hero-leading-sme' | 'hero-sme-use' | 'hero-taxonomy' | 'hero-public-use'
}
type CarbonFeature = {
    title: string
    description: string
    icon:
        | 'level-diagnosis'
        | 'expert-evaluation'
        | 'emission-diagnosis'
        | 'reduction-plan'
        | 'keyword-search'
        | 'self-diagnosis'
}

type CarbonPlatform = {
    key: CarbonPlatformKey
    /** 전환 탭 이름. */
    label: string
    cards: readonly CarbonHeroCard[]
    featuresTitle: string
    features: readonly CarbonFeature[]
    /** 아래 묶음 — 선도중소기업확인은 단계 절차, 택소노미는 기능 아코디언. */
    detail:
        | {kind: 'steps'; title: string; steps: readonly ProcedureStep[]}
        | {
              kind: 'accordion'
              title: string
              items: readonly {value: string; title: string; groups: readonly RollingAccordionGroup[]}[]
          }
    /** 바로가기 이름(진단 시작하기). */
    startLabel: string
    /** 바로가기 주소(외부 탄소중립 플랫폼 · 새 탭). */
    startHref: string
}

const PLATFORM_CARBON_NEUTRALITY = {
    title: '탄소중립',
    hero: {
        titleLines: ['탄소감축에서부터 K-택소노미까지,', '한 번으로 끝내는 탄소중립 플랫폼'],
        lead: '기업의 탄소중립 경영혁신과 녹색경제활동을 지원하며 지속가능한 성장을 뒷받침 합니다.',
        descriptionLines: [
            'K-TOP 탄소중립 플랫폼은 기업의 탄소배출 현황을 진단하여 감축계획 수립에 도움을 주고,',
            '한국형 녹색분류체계 적합성 판단을 지원합니다. 정부의 탄소중립 정책에 대응하고 녹색경영 역량을 강화하세요.',
        ],
        tabListLabel: '탄소중립 플랫폼',
    },
    target: {
        title: '이런 기업에 적합합니다',
        description: 'K-TOP 탄소중립 플랫폼은 대한민국 탄소중립과 녹색경제활동 확산을 위해 설계되었습니다.',
        items: [
            '녹색금융 수혜기업',
            '녹색여신‧녹색채권 취급 금융기관',
            'CBAM 대응 기업',
            '공급망(Scope3) 소속 제조기업',
            'ESG 공시기업',
            '택소노미 평가 외부검토기관',
        ],
    },
} as const

const CARBON_PLATFORMS: readonly CarbonPlatform[] = [
    {
        key: 'leading-sme',
        label: '탄소중립 선도중소기업확인 플랫폼',
        cards: [
            {
                title: '탄소중립 선도중소기업확인',
                image: 'hero-leading-sme',
                description:
                    '중소기업의 탄소감축계획 수립과 탄소중립 경영혁신수준 진단을 통해 탄소중립 선도기업으로의 도약을 지원합니다.',
            },
            {
                title: '중소기업에서 활용 가능',
                image: 'hero-sme-use',
                description:
                    '사업장 온실가스 배출 관리를 통해 탄소중립 계획수립이 필요한 중소기업에서 활용 가능합니다.',
            },
            {
                title: '선도중소기업확인 차별점',
                image: 'clipboard-check-chart',
                bullets: [
                    '복잡하고 어려운 탄소배출량 산출을 에너지사용량 자료만으로 쉽게 산출해 드립니다.',
                    '감축 방법론을 제공하여 기업의 탄소감축활동에 따른 예상 감축량을 확인할 수 있습니다.',
                    '간단한 진단표 작성을 통해 기업의 탄소중립 경영혁신 수준을 파악할 수 있습니다.',
                ],
            },
        ],
        featuresTitle: '중소기업의 탄소중립 실현에 필요한 분석 기능을 제공합니다.',
        features: [
            {
                title: '배출량 진단',
                icon: 'emission-diagnosis',
                description:
                    '기업의 에너지사용량 등 활동자료 입력을 통해 Scope 1‧2‧3 온실가스 배출량을 산정해 드립니다.',
            },
            {
                title: '감축계획 수립',
                icon: 'reduction-plan',
                description: '기업의 탄소감축 활동에 따른 예상 감축량 산정을 통해 감축계획 수립에 도움을 줍니다.',
            },
            {
                title: '탄소중립 수준 진단',
                icon: 'level-diagnosis',
                description: '기업의 현재 상황과 감축 목표 등을 통해 기업의 탄소감축 역량과 수준을 파악할 수 있습니다.',
            },
        ],
        detail: {
            kind: 'steps',
            title: '기업의 탄소중립 역량 진단이 5단계로 완료됩니다.',
            steps: [
                {title: '기업정보 입력', description: '기업 정보 및 현황 자료를 입력합니다.'},
                {title: '배출량 산정', description: '탄소배출 관련 활동자료를 입력합니다.'},
                {title: '감축잠재량 산정', description: '감축방법론에 따른 상세 자료를 입력합니다.'},
                {title: '감축목표 설정', description: '목표 감축율 자가 설정합니다.'},
                {title: '평가지표 작성', description: '감축역량 및 수준 진단을 위한 평가지표를 작성합니다.'},
            ],
        },
        startLabel: '탄소중립 진단 시작하기',
        startHref: CARBON_NEUTRAL_HOME_URL,
    },
    {
        key: 'taxonomy',
        label: '개방형 K-택소노미 플랫폼',
        cards: [
            {
                title: '개방형 K-택소노미',
                image: 'hero-taxonomy',
                description:
                    '기업의 경제활동이 K-택소노미 가이드라인에 부합하는지 쉽고 빠르게 확인하고, 녹색금융에 대한 접근성을 높입니다.',
            },
            {
                title: '국민 누구나 활용 가능',
                image: 'hero-public-use',
                description: 'K-택소노미에서 정하는 녹색경제활동 판단이 필요한 국민 누구나 활용 가능합니다.',
            },
            {
                title: '개방형 K-택소노미 차별점',
                image: 'clipboard-check-chart',
                bullets: [
                    '키워드 검색, 질의응답을 통한 자가진단만으로 녹색경제활동을 직접 판단할 수 있습니다.',
                    '전문평가기관을 위한 심층평가 기능까지 원스톱 지원합니다.',
                ],
            },
        ],
        featuresTitle: '택소노미 적합성 판단을 위한 모든 과정을 하나의 플랫폼에서 지원합니다.',
        features: [
            {
                title: '키워드 검색',
                icon: 'keyword-search',
                description: '제품, 업종코드 등 관련 키워드를 입력하시면, 적합한 녹색경제활동을 추천해 드립니다.',
            },
            {
                title: '자가진단',
                icon: 'self-diagnosis',
                description: '간단한 질의응답 과정을 통해 보다 정확한 녹색경제활동을 진단해 드립니다.',
            },
            {
                title: '전문평가',
                icon: 'expert-evaluation',
                description:
                    '택소노미 적합성 평가를 전문적으로 수행하는 외부검토기관을 위한 전문가용 기능을 제공합니다.',
            },
        ],
        detail: {
            kind: 'accordion',
            title: '이용 목적에 따라 각각의 기능을 활용할 수 있습니다.',
            items: [
                {
                    value: 'keyword',
                    title: '키워드 검색',
                    groups: [{text: '생산 제품, 도입 시설, 업종코드 등 기업활동과 관련된 키워드 검색'}],
                },
                {
                    value: 'self-diagnosis',
                    title: '자가진단',
                    groups: [{text: '기업에 해당하는 환경 목표 선택 후 질문 사항 체크'}],
                },
                {
                    value: 'expert',
                    title: '전문평가',
                    groups: [{text: '전문평가자격을 보유한 외부검토기관은 평가 수행 후 보고서 출력'}],
                },
            ],
        },
        startLabel: 'K-택소노미 진단 시작하기',
        // 택소노미 진단 주소를 아직 받지 못해 탄소중립 플랫폼 홈에 구분 표시(#k-taxonomy)를 붙여 둔다 — 같은 주소의 링크가
        // 나란히 있으면 WAVE 가 '중복 링크(Redundant link)'로 본다. 실제 주소를 받으면 바꾼다.
        startHref: `${CARBON_NEUTRAL_HOME_URL}#k-taxonomy`,
    },
]

export {CARBON_PLATFORMS, PLATFORM_CARBON_NEUTRALITY}
export type {CarbonFeature, CarbonHeroCard, CarbonPlatform, CarbonPlatformKey}
