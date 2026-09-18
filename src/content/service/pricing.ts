// 가격정책 화면(PricingPolicy)의 문구·이용권 데이터 — 시안 "SB-FOTA-CM4-0001_가격 정책"(40007578:164043) 그대로다.
//
// [프론트엔드 연동] 이용권 목록·가격을 API 에서 받게 되면 PAID_PLANS 를 같은 모양(PricingPlan[])으로 바꿔 넣는다.
// 화면 구조(카드·안내 상자)는 컴포넌트가 갖는다.

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
    /** 강조 카드(시안 "스탠다드") — 옅은 파란 면·파란 테두리·채운 [구매하기]. */
    isRecommended?: boolean
}

const FREE_SERVICE = {
    title: '무료 서비스',
    description: '기술보증기금은 기업의 정보 접근성을 높이기 위해 아래 서비스를 무료로 제공합니다.',
    badge: '무료',
    name: '자가조회',
    nameDetail: '(본인 기업 조회)',
    features: ['횟수 무제한', '이용권 불필요'],
} as const

const PAID_SERVICE = {
    title: '유료 서비스',
    description:
        '다른 기업의 보고서 조회는 유료로 제공됩니다. 필요한 조회 건수에 따라 선택하실 수 있습니다. (부가세포함)',
} as const

const PAID_PLANS: readonly PricingPlan[] = [
    {
        id: 'minimum',
        name: '1회권',
        image: '/images/ticket-grade/ticket-grade-minimum.webp',
        price: 11000,
        period: '1개월',
        quota: 1,
    },
    {
        id: 'basic',
        name: '베이직',
        image: '/images/ticket-grade/ticket-grade-basic.webp',
        price: 110000,
        period: '1개월',
        quota: 30,
    },
    {
        id: 'standard',
        name: '스탠다드',
        image: '/images/ticket-grade/ticket-grade-standard.webp',
        price: 330000,
        period: '1개월',
        quota: 100,
        isRecommended: true,
    },
    {
        id: 'premium',
        name: '프리미엄',
        image: '/images/ticket-grade/ticket-grade-premium.webp',
        price: 1100000,
        period: '1개월',
        quota: 500,
    },
]

// 이용권 카드 아래 안내.
const NO_DEDUCTION_NOTICE = {
    title: '다음의 경우에는 이용 횟수가 차감되지 않습니다.',
    items: ['자가 조회(본인 기업 조회)하는 경우', '기술혁신성장정보가 제공되지 않는 경우'],
} as const

const USAGE_GUIDE = {
    title: '이용 안내',
    items: [
        '이용기간은 이용권 개시일로부터 1개월이며, 사용 여부와 관계없이 경과합니다.',
        '만료 시 잔여 횟수는 소멸되며 이월되지 않습니다.',
        '이용권을 여러 개 보유하실 수 있으며, 먼저 구매한 이용권부터 순서대로 사용됩니다.',
        '결제일로부터 7일 이내이며 미사용인 경우에 한하여 환불이 가능합니다.',
    ],
} as const

const PARTNER_GUIDE = {
    title: '파트너(기관) 이용 안내',
    items: [
        '기관은 기술보증기금과 계약 체결 후 이용하실 수 있습니다.',
        '자세한 사항은 아래 담당자에게 문의하여 주시기 바랍니다.',
        '담당자 연락처 : 051-606-7596 / 메일주소 추후 확정',
    ],
} as const

// 결제하기로 넘길 때 고른 이용권을 싣는 주소 값(?plan=). 모르는 값이면 시안의 기본 이용권(프리미엄)을 보여 준다.
const PLAN_QUERY_KEY = 'plan'
const DEFAULT_PAYMENT_PLAN_ID: PricingPlan['id'] = 'premium'

const findPlan = (id: unknown): PricingPlan | undefined => PAID_PLANS.find((plan) => plan.id === id)

export {
    DEFAULT_PAYMENT_PLAN_ID,
    findPlan,
    FREE_SERVICE,
    NO_DEDUCTION_NOTICE,
    PAID_PLANS,
    PAID_SERVICE,
    PARTNER_GUIDE,
    PLAN_QUERY_KEY,
    USAGE_GUIDE,
}
export type {PricingPlan}
