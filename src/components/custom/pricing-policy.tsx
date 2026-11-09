import Link from 'next/link'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {PaymentUnavailableDialog} from '@/components/composite/payment-unavailable-dialog'
import {
    PricingCard,
    PricingCardAction,
    PricingCardHeader,
    PricingCardHighlight,
    PricingCardMeta,
    PricingCardPrice,
} from '@/components/composite/pricing-card'
import {PlanComparisonTable} from '@/components/custom/plan-comparison-table'
import PricingMemberTabs from '@/components/custom/pricing-member-tabs'
import PricingTabs from '@/components/custom/pricing-tabs'
import {pricingCardButtonClassName} from '@/components/theme/pricing-card.variants'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    buildPlanComparison,
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
    PRICING_TONE_LABEL,
    SELF_LOOKUP_PLAN,
    TECH_MODEL_LABEL,
    TECH_PRICING,
    USAGE_GUIDE,
    type InfoGuide,
    type PricingMember,
    type PricingPlan,
    type PricingTone,
    type PricingView,
    type TechServiceCard,
} from '@/content/service/pricing'
import {cn} from '@/lib/utils'

// 가격정책 본문 — 1뎁스 탭(PricingTabs) → 구획 제목 + 회원유형 탭(PricingMemberTabs) → 고른 회원의 카드 · 비교표 · 안내 상자.
// 기업 · 기관 화면이 같은 컴포넌트를 쓰고 props 만 다르다. 문구 · 이용권은 content/service/pricing.ts 에 있다.
//
// [프론트엔드 연동]
//   · plans — 이용권 목록. API 로 받으면 넘긴다(없으면 PAID_PLANS). 카드와 비교표가 함께 바뀐다.
//   · paymentHref — [구매하기]가 결제 화면으로 간다(?plan=이용권 id). 기업 화면.
//   · isPurchaseUnavailable — [구매하기]가 결제 대신 결제 불가 안내 모달을 연다. 기관 화면.
//   · defaultView · defaultMember — 처음 열 1뎁스 탭(?tab=) · 회원유형(화면의 회원유형).
//
// 반응형: 이용권 카드 PC 5열 · 태블릿 3열 · 모바일 1열, 기관 기술평가 카드 태블릿부터 2열.
// 한 장만 놓이는 카드(기업 기술평가 · 기관 K-BIGx)는 가운데 폭 588(max-w-modal)이다.

// 무료 · 유료 배지 색 — 무료 파랑 · 유료 보라. 평가모형 배지도 카드의 색을 따른다.
const TONE_BADGE_COLOR = {free: 'info', paid: 'secondary-purple'} as const satisfies Record<PricingTone, string>

const ToneBadge = ({tone}: {tone: PricingTone}) => (
    <Badge variant="solid-pastel" color={TONE_BADGE_COLOR[tone]} shape="round" size="sm">
        {PRICING_TONE_LABEL[tone]}
    </Badge>
)

// 한 장만 가운데 놓이는 카드의 폭 — 넓은 화면에서 588, 좁으면 화면 폭.
const singleCardClassName = 'mx-auto w-full max-w-modal'

type PurchaseProps = {
    /** [구매하기]가 향할 결제 화면(기업). */
    paymentHref?: string
    /** 구매할 수 없는 회원(기관) — [구매하기]가 결제 화면 대신 결제 불가 안내 모달을 연다. */
    isPurchaseUnavailable?: boolean
}

type PricingPolicyProps = PurchaseProps & {
    /** 이용권 목록 — API 로 받으면 넘긴다. 없으면 pricing.ts 의 PAID_PLANS. */
    plans?: readonly PricingPlan[]
    /** 처음 열 1뎁스 탭 — 페이지의 ?tab= 값. 없으면 [기술평가]. */
    defaultView?: PricingView
    /** 처음 고를 회원유형 — 기업 화면 corp · 기관 화면 org. */
    defaultMember: PricingMember
}

// ── [기술평가] 탭 ──

// 서비스 카드 — 머리(이름 · 회원 구분 · 무료/유료) → 핵심 안내 → 평가모형 배지.
// 한 장(기업)은 이름 20 · 그림자, 두 장(기관)은 이름 18 · 그림자 없음.
const TechServiceCardItem = ({card, isSingle}: {card: TechServiceCard; isSingle: boolean}) => {
    const titleId = `pricing-tech-${card.id}`
    return (
        <PricingCard asChild size="lg" elevated={isSingle}>
            <li aria-labelledby={titleId}>
                <PricingCardHeader
                    title={card.name}
                    titleId={titleId}
                    detail={card.nameDetail}
                    badge={<ToneBadge tone={card.tone} />}
                    size={isSingle ? 'lg' : 'md'}
                />
                <div className="flex flex-col gap-3">
                    <PricingCardHighlight
                        layout="inline"
                        title={card.highlight.title}
                        description={card.highlight.description}
                    />
                    <PricingCardMeta label={TECH_MODEL_LABEL}>
                        {card.models.map((model) => (
                            <Badge
                                key={model}
                                variant="solid-pastel"
                                color={TONE_BADGE_COLOR[card.tone]}
                                shape="round"
                                size="sm"
                            >
                                {model}
                            </Badge>
                        ))}
                    </PricingCardMeta>
                </div>
            </li>
        </PricingCard>
    )
}

const TechMemberPanel = ({member}: {member: PricingMember}) => {
    const {cards, guide} = TECH_PRICING[member]
    const isSingle = cards.length === 1
    return (
        <div className="flex flex-col gap-10">
            <ul
                aria-label={`${MEMBER_SECTION_TITLE} 카드`}
                className={cn('grid list-none gap-4', isSingle ? singleCardClassName : 'md:grid-cols-2')}
            >
                {cards.map((card) => (
                    <TechServiceCardItem key={card.id} card={card} isSingle={isSingle} />
                ))}
            </ul>
            {guide ? <GuideBox guide={guide} /> : null}
        </div>
    )
}

// ── [K-BIGx 보고서] 탭 ──

// [구매하기] — 기업은 결제 화면으로(?plan=), 기관은 결제 불가 안내 모달을 연다.
const PurchaseButton = ({plan, paymentHref, isPurchaseUnavailable}: PurchaseProps & {plan: PricingPlan}) => {
    // 같은 이름의 버튼이 넷이라 이용권 이름을 sr-only 로 붙인다.
    const label = (
        <>
            구매하기
            <span className="sr-only"> ({plan.name})</span>
        </>
    )
    if (isPurchaseUnavailable) {
        return (
            <PaymentUnavailableDialog>
                <Button type="button" variant="secondary" size="md" className={pricingCardButtonClassName}>
                    {label}
                </Button>
            </PaymentUnavailableDialog>
        )
    }
    return (
        <Button asChild variant="secondary" size="md" className={pricingCardButtonClassName}>
            <Link href={paymentHref ? `${paymentHref}?${PLAN_QUERY_KEY}=${plan.id}` : '#'}>{label}</Link>
        </Button>
    )
}

// 이용권 카드의 네 구역(머리 · 금액 · 핵심 안내 · 버튼)을 목록의 행에 얹어(subgrid) 한 줄의 카드끼리 높이를 맞춘다.
// 버튼이 없는 자사조회 카드도 안내 상자가 같은 높이에 놓인다. 한 줄에 한 장인 모바일은 맞출 필요가 없어 끈다.
const planCardClassName = 'md:row-span-4 md:grid md:grid-rows-subgrid'

const KbigxCorpPanel = ({
    plans,
    paymentHref,
    isPurchaseUnavailable,
}: PurchaseProps & {plans: readonly PricingPlan[]}) => {
    const comparison = buildPlanComparison(plans)
    return (
        <div className="flex flex-col gap-10">
            {/* 이용권 카드 — PC 5열 · 태블릿 3열 · 모바일 1열. */}
            <ul
                aria-label={PAID_PLAN_LIST_LABEL}
                className="grid list-none gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-5"
            >
                <PricingCard asChild className={planCardClassName}>
                    <li aria-labelledby="pricing-plan-self">
                        <PricingCardHeader
                            title={SELF_LOOKUP_PLAN.name}
                            titleId="pricing-plan-self"
                            badge={<ToneBadge tone="free" />}
                        />
                        <PricingCardPrice label={SELF_LOOKUP_PLAN.description} amount={SELF_LOOKUP_PLAN.priceLabel} />
                        <PricingCardHighlight
                            title={SELF_LOOKUP_PLAN.highlight.title}
                            description={SELF_LOOKUP_PLAN.highlight.description}
                        />
                    </li>
                </PricingCard>
                {plans.map((plan) => {
                    const titleId = `pricing-plan-${plan.id}`
                    return (
                        <PricingCard key={plan.id} asChild interactive className={planCardClassName}>
                            <li aria-labelledby={titleId}>
                                <PricingCardHeader
                                    title={plan.name}
                                    titleId={titleId}
                                    iconSrc={plan.image}
                                    badge={<ToneBadge tone="paid" />}
                                />
                                <PricingCardPrice
                                    label={PAID_PLAN_DESCRIPTION}
                                    amount={plan.price}
                                    note={paidPlanNote(plan)}
                                />
                                <PricingCardHighlight {...paidPlanHighlight(plan)} />
                                <PricingCardAction>
                                    <PurchaseButton
                                        plan={plan}
                                        paymentHref={paymentHref}
                                        isPurchaseUnavailable={isPurchaseUnavailable}
                                    />
                                </PricingCardAction>
                            </li>
                        </PricingCard>
                    )
                })}
            </ul>

            <section aria-labelledby="pricing-comparison-title" className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center break-keep">
                    <h3 id="pricing-comparison-title" className="typo-h2-bold text-foreground">
                        {PLAN_COMPARISON.title}
                    </h3>
                    <p className="typo-body-xl-regular text-foreground-subtle">{PLAN_COMPARISON.description}</p>
                </div>
                <PlanComparisonTable
                    caption={PLAN_COMPARISON.title}
                    rowHeader={PLAN_COMPARISON.rowHeader}
                    columns={comparison.columns}
                    rows={comparison.rows}
                />
            </section>

            <GuideBox guide={USAGE_GUIDE} />
        </div>
    )
}

// 기관회원 — 금액 대신 계약 안내를 크게 보이는 카드 한 장. 머리와 안내 사이는 16(다른 lg 카드 28보다 좁다).
const KbigxOrgPanel = () => (
    <div className="flex flex-col gap-10">
        <PricingCard size="lg" elevated className={cn(singleCardClassName, 'gap-4 md:gap-4')}>
            <PricingCardHeader title={KBIGX_PARTNER_CARD.name} badge={<ToneBadge tone="paid" />} size="lg" />
            <PricingCardHighlight layout="emphasis" label={KBIGX_PARTNER_CARD.label} title={KBIGX_PARTNER_CARD.title} />
        </PricingCard>
        <GuideBox guide={PARTNER_GUIDE} />
    </div>
)

// 안내 상자 — InfoBox outline(흰 면 · 테두리 · 반경 16 · 여백 40·32). 카드와 같은 단계라 h3 이다.
// 모바일에서 낱말 중간이 끊기지 않게 break-keep 을 준다.
const GuideBox = ({guide}: {guide: InfoGuide}) => (
    <InfoBox variant="outline" title={guide.title} headingLevel={3} className="break-keep">
        {guide.items.map((item) => (
            <InfoBoxItem key={item}>{item}</InfoBoxItem>
        ))}
    </InfoBox>
)

const PricingPolicy = ({
    plans = PAID_PLANS,
    paymentHref,
    isPurchaseUnavailable,
    defaultView,
    defaultMember,
}: PricingPolicyProps) => (
    <PricingTabs
        defaultView={defaultView}
        views={{
            tech: (
                <PricingMemberTabs
                    idPrefix="pricing-tech"
                    title={MEMBER_SECTION_TITLE}
                    descriptions={{corp: TECH_PRICING.corp.description, org: TECH_PRICING.org.description}}
                    defaultMember={defaultMember}
                    panels={{corp: <TechMemberPanel member="corp" />, org: <TechMemberPanel member="org" />}}
                />
            ),
            kbigx: (
                <PricingMemberTabs
                    idPrefix="pricing-kbigx"
                    title={MEMBER_SECTION_TITLE}
                    descriptions={KBIGX_DESCRIPTION}
                    defaultMember={defaultMember}
                    panels={{
                        corp: (
                            <KbigxCorpPanel
                                plans={plans}
                                paymentHref={paymentHref}
                                isPurchaseUnavailable={isPurchaseUnavailable}
                            />
                        ),
                        org: <KbigxOrgPanel />,
                    }}
                />
            ),
        }}
    />
)

export default PricingPolicy
