// 가격정책 화면(PricingPolicy)의 문구 · 이용권 데이터. 화면 구조(카드 · 비교표 · 안내 상자)는 컴포넌트가 갖는다.
// 짜임: 1뎁스 탭 [기술평가] · [K-BIGx 보고서] → 회원유형 탭 [기업회원] · [기관회원]. 기업 · 기관 화면이 같은 내용이다.
//
// [프론트엔드 연동] 이용권(목록 · 가격 · 건수)을 API 로 받게 되면
//   1. 받은 값을 PricingPlan[] 모양으로 맞춰 PricingPolicy 의 plans 로 넘긴다(없으면 아래 PAID_PLANS 를 쓴다).
//   2. 이용권 카드 · 플랜별 비교표(이용 요금 · 조회 건수 · 이용 기간 칸)는 그 값에서 만들어지므로 따로 고치지 않는다.
//   3. 결제하기 화면(pricing/payment)도 PAID_PLANS · findPlan 을 쓰므로 같은 값으로 바꾼다.
// 나머지 문구(설명 · 안내 상자 · 비교표의 고정 행)는 정책 문구라 이 파일에서 고친다.

type PricingPlan = {
    id: 'minimum' | 'basic' | 'standard' | 'premium'
    name: string
    /** 등급 동전 그림 — 결제·이용 내역(paid-service-history)과 같은 에셋이다. */
    image: string
    /** 원 단위 금액(부가세 포함). 화면에서 천 단위 쉼표를 붙인다. */
    price: number
    period: string
    /** 조회 가능 건수 — 카드에는 "조회 N건", 결제하기의 제공횟수에는 "N건"으로 쓴다. */
    quota: number
}

// ── 회원유형 탭 ──
// 기업 화면은 [기업회원], 기관 화면은 [기관회원]이 처음 열린다(페이지가 defaultMember 로 넘긴다).
const PRICING_MEMBERS = [
    {value: 'corp', label: '기업회원'},
    {value: 'org', label: '기관회원'},
] as const
type PricingMember = (typeof PRICING_MEMBERS)[number]['value']

// 회원유형 탭 위 구획 제목 — 설명은 고른 탭(1뎁스 · 회원유형)에 따라 바뀐다.
const MEMBER_SECTION_TITLE = '회원 별 서비스 안내'

// 카드 머리의 무료 · 유료 표시 — free 파랑 · paid 보라 배지.
type PricingTone = 'free' | 'paid'
const PRICING_TONE_LABEL: Record<PricingTone, string> = {free: '무료', paid: '유료'}

// 핵심 안내(카드 안 옅은 파란 상자) — 굵은 제목 + 보조 설명.
type PricingHighlight = {title: string; description?: string}

// ── [기술평가] 탭 ──
// 회원 카드 — 이름 · 회원 구분 · 무료/유료 · 핵심 안내 · 이용 가능한 평가모형. 가격 · 결제는 없다.
type TechServiceCard = {
    id: 'self-diagnosis' | 'individual' | 'bulk'
    name: string
    nameDetail: string
    tone: PricingTone
    highlight: PricingHighlight
    models: readonly string[]
}
const TECH_EVALUATION_MODELS = ['KTRS-FM', '투자모형', 'Tech-Index(일반)', 'Tech-Index(창업)'] as const
// 카드 아래 평가모형 줄의 이름표.
const TECH_MODEL_LABEL = '평가모형'

type InfoGuide = {title: string; items: readonly string[]}

// 회원유형별 — 제목 아래 설명 · 카드 · (있으면) 아래 안내 상자.
const TECH_PRICING: Record<PricingMember, {description: string; cards: readonly TechServiceCard[]; guide?: InfoGuide}> =
    {
        corp: {
            description: '기업은 평가모형별로 월 1회 기술평가 자가진단 서비스를 무료로 이용할 수 있습니다.',
            cards: [
                {
                    id: 'self-diagnosis',
                    name: '기술평가 (자가진단)',
                    nameDetail: '기업회원 (본인 기업 조회)',
                    tone: 'free',
                    highlight: {title: '평가모형 별 월 1회 제공', description: '이용권 불필요'},
                    models: TECH_EVALUATION_MODELS,
                },
            ],
        },
        org: {
            description: '기관은 별도의 협약을 통해 타기업 대상 개별평가 및 일괄평가 서비스를 이용할 수 있습니다.',
            cards: [
                {
                    id: 'individual',
                    name: '개별평가',
                    nameDetail: '기관회원 (타 기업 조회)',
                    tone: 'paid',
                    highlight: {title: '협약 체결 후 이용'},
                    models: TECH_EVALUATION_MODELS,
                },
                {
                    id: 'bulk',
                    name: '일괄평가',
                    nameDetail: '기관회원 (타 기업 조회)',
                    tone: 'paid',
                    highlight: {title: '협약 체결 후 이용'},
                    // 일괄평가는 Tech-Index 두 모형만 된다.
                    models: ['Tech-Index(일반)', 'Tech-Index(창업)'],
                },
            ],
            guide: {
                title: '기관 이용 안내',
                items: [
                    '기관은 기술보증기금과 협약 체결 후 이용할 수 있습니다.',
                    '자세한 사항은 아래로 문의하여 주시기 바랍니다.',
                    '담당부서: 기술평가부, 담당자: 051-606-7398',
                ],
            },
        },
    }

// ── [K-BIGx 보고서] 탭 ──
const KBIGX_DESCRIPTION: Record<PricingMember, string> = {
    corp: '다른 기업의 보고서 조회는 유료로 제공됩니다. 필요한 조회 건수에 따라 선택하실 수 있습니다. (부가세 포함)',
    org: '기관은 기술보증기금과 계약 체결 후 이용하실 수 있습니다.',
}

// 기업회원 첫 카드 — 본인 기업 조회는 무료다(구매 없음).
const SELF_LOOKUP_PLAN = {
    name: '자사조회',
    description: '(본인 기업 조회)',
    priceLabel: '무료',
    highlight: {title: '횟수 무제한', description: '이용권 불필요'},
} as const

// 이용권 카드 문구 — 금액 위 설명 · 금액 아래 설명 · 핵심 안내 상자. 이용권 값에서 만든다.
const PAID_PLAN_LIST_LABEL = '이용권'
const PAID_PLAN_DESCRIPTION = '다른 기업 보고서 조회'
const paidPlanNote = (plan: PricingPlan) => `${plan.period} · 부가세 포함`
const paidPlanHighlight = (plan: PricingPlan): PricingHighlight => ({
    title: `조회 ${plan.quota}건`,
    description: `이용 기간 ${plan.period}`,
})

const PAID_PLANS: readonly PricingPlan[] = [
    {
        id: 'minimum',
        name: '1회권',
        image: '/images/ticket-grade/ticket-grade-minimum.webp',
        price: 22000,
        period: '1개월',
        quota: 1,
    },
    {
        id: 'basic',
        name: '베이직',
        image: '/images/ticket-grade/ticket-grade-basic.webp',
        price: 330000,
        period: '1개월',
        quota: 20,
    },
    {
        id: 'standard',
        name: '스탠다드',
        image: '/images/ticket-grade/ticket-grade-standard.webp',
        price: 550000,
        period: '1개월',
        quota: 50,
    },
    {
        id: 'premium',
        name: '프리미엄',
        image: '/images/ticket-grade/ticket-grade-premium.webp',
        price: 1100000,
        period: '1개월',
        quota: 200,
    },
]

// ── 플랜별 비교표 ──
const PLAN_COMPARISON = {
    title: '플랜별 비교',
    description: '기업회원 기준 플랜별 이용 조건을 한눈에 비교해 보세요.',
    rowHeader: '비교 항목',
} as const

// 칸 값 — 글자 · INCLUDED(제공: 파란 체크) · NONE(해당 없음: 줄표). PlanComparisonTable 의 칸 값과 같은 모양이다.
type PlanComparisonValue = string | {status: 'included' | 'none'}
const INCLUDED = {status: 'included'} as const
const NONE = {status: 'none'} as const
const WON_FORMATTER = new Intl.NumberFormat('ko-KR')

// 행 — 순서대로 그린다. self 는 자사조회 열, paid 는 이용권 열(모든 이용권이 같으면 값, 이용권마다 다르면 함수).
// isHighlighted 행은 옅은 파란 면으로 강조된다.
const PLAN_COMPARISON_ROWS: readonly {
    label: string
    isHighlighted?: boolean
    self: PlanComparisonValue
    paid: PlanComparisonValue | ((plan: PricingPlan) => PlanComparisonValue)
}[] = [
    {label: '이용 요금', isHighlighted: true, self: '무료', paid: (plan) => `₩${WON_FORMATTER.format(plan.price)}`},
    {label: '조회 건수', isHighlighted: true, self: '횟수 무제한', paid: (plan) => `${plan.quota}건`},
    {label: '조회 대상', self: '본인 기업', paid: '다른 기업'},
    {label: '이용권', self: '불필요', paid: '구매 필요'},
    {label: '이용 기간', self: NONE, paid: (plan) => plan.period},
    {label: '부가세', self: NONE, paid: '포함'},
    {label: '이용권 복수 보유', self: NONE, paid: INCLUDED},
    {label: '7일 내 미사용 시 환불', self: NONE, paid: INCLUDED},
]

// 비교표의 열(자사조회 + 이용권) · 행을 이용권 목록으로 만든다 — PlanComparisonTable 에 그대로 넘긴다.
const buildPlanComparison = (plans: readonly PricingPlan[]) => ({
    columns: [
        {id: 'self', name: SELF_LOOKUP_PLAN.name, description: PRICING_TONE_LABEL.free},
        ...plans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            description: PRICING_TONE_LABEL.paid,
            iconSrc: plan.image,
        })),
    ],
    rows: PLAN_COMPARISON_ROWS.map((row) => ({
        label: row.label,
        isHighlighted: row.isHighlighted,
        cells: [row.self, ...plans.map((plan) => (typeof row.paid === 'function' ? row.paid(plan) : row.paid))],
    })),
})

const USAGE_GUIDE: InfoGuide = {
    title: '이용 안내',
    items: [
        '이용기간은 이용권 개시일로부터 1개월이며, 사용 여부와 관계없이 경과합니다.',
        '만료 시 잔여 횟수는 소멸되며 이월되지 않습니다.',
        '이용권을 여러 개 보유하실 수 있으며, 먼저 구매한 이용권부터 순서대로 사용됩니다.',
        '결제일로부터 7일 이내이며 미사용인 경우에 한하여 환불이 가능합니다.',
        '타사 조회 시 일부 정보(단기연체·공공체납 등)는 제공 대상이 아닙니다.',
    ],
} as const

// 기관회원 카드 — 금액 대신 계약 안내를 크게 보인다.
const KBIGX_PARTNER_CARD = {
    name: 'K-BIGx 보고서',
    label: '파트너(기관)',
    title: '계약 체결 후 이용',
} as const

const PARTNER_GUIDE: InfoGuide = {
    title: '파트너(기관) 이용 안내',
    items: [
        '기관은 기술보증기금과 계약 체결 후 이용하실 수 있습니다.',
        '자세한 사항은 아래 담당자에게 문의하여 주시기 바랍니다.',
        '담당자 연락처 : 051-606-7596 / kbigx@kibo.or.kr',
    ],
} as const

// ── 1뎁스 탭 ──
// ?tab=kbigx 로 들어오면 [K-BIGx 보고서] 탭이 열린 채로 보인다(이용권 구매 안내 모달의 [구매하기] 등). 없으면 [기술평가].
const PRICING_TAB_QUERY_KEY = 'tab'
const PRICING_VIEWS = [
    {value: 'tech', label: '기술평가'},
    {value: 'kbigx', label: 'K-BIGx 보고서'},
] as const
type PricingView = (typeof PRICING_VIEWS)[number]['value']
const isPricingView = (value: unknown): value is PricingView => PRICING_VIEWS.some((view) => view.value === value)

// 결제하기로 넘길 때 고른 이용권을 싣는 주소 값(?plan=). 모르는 값이면 시안의 기본 이용권(프리미엄)을 보여 준다.
const PLAN_QUERY_KEY = 'plan'
const DEFAULT_PAYMENT_PLAN_ID: PricingPlan['id'] = 'premium'

const findPlan = (id: unknown): PricingPlan | undefined => PAID_PLANS.find((plan) => plan.id === id)

export {
    buildPlanComparison,
    DEFAULT_PAYMENT_PLAN_ID,
    findPlan,
    isPricingView,
    KBIGX_DESCRIPTION,
    KBIGX_PARTNER_CARD,
    MEMBER_SECTION_TITLE,
    PAID_PLAN_DESCRIPTION,
    PAID_PLAN_LIST_LABEL,
    PAID_PLANS,
    paidPlanHighlight,
    paidPlanNote,
    PARTNER_GUIDE,
    PLAN_COMPARISON,
    PLAN_QUERY_KEY,
    PRICING_MEMBERS,
    PRICING_TAB_QUERY_KEY,
    PRICING_TONE_LABEL,
    PRICING_VIEWS,
    SELF_LOOKUP_PLAN,
    TECH_MODEL_LABEL,
    TECH_PRICING,
    USAGE_GUIDE,
}
export type {InfoGuide, PricingMember, PricingPlan, PricingTone, PricingView, TechServiceCard}
