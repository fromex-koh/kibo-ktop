import Image from 'next/image'
import Link from 'next/link'
import {Check, CircleAlert} from 'lucide-react'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {PaymentUnavailableDialog} from '@/components/composite/payment-unavailable-dialog'
import {ListMarker} from '@/components/custom/list-marker'
import PricingTabs from '@/components/custom/pricing-tabs'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {
    FREE_SERVICE,
    NO_DEDUCTION_NOTICE,
    PAID_PLANS,
    PAID_SERVICE,
    PARTNER_GUIDE,
    PLAN_QUERY_KEY,
    TECH_MEMBER_PLANS,
    TECH_MEMBER_SERVICE,
    TECH_ORG_GUIDE,
    USAGE_GUIDE,
    type PricingPlan,
    type PricingView,
    type TechMemberPlan,
} from '@/content/service/pricing'
import {cn} from '@/lib/utils'

// 가격정책 — 시안 "SB-FOTA-CM4-0001_가격정책_기술평가 · _K-BIGx 보고서". 기업·기관이 같은 화면이다.
// 1뎁스 탭(PricingTabs) 아래에 [기술평가](회원 별 서비스 안내 · 기관 이용 안내) · [K-BIGx 보고서](무료 · 유료 서비스 · 이용 안내).
// 문구·이용권은 content/service/pricing.ts 에 있고, 이 파일은 짜임(카드·안내 상자)만 갖는다.
//
// 간격(시안): 탭과 본문 40 · 구획 사이 40 · 구획 제목과 설명 4 · 설명과 카드 24 · 카드 사이 24 ·
// 카드와 아래 안내 16 · 안내 상자 사이 24.

const PRICE_FORMATTER = new Intl.NumberFormat('ko-KR')
// 원화 표시 그림 — 라이트는 검정, 다크는 흰색 한 장만 보인다(헤더·푸터 로고와 같은 --logo-on-* 전환).
const WON_ICON_LIGHT_SRC = '/images/pricing/icon-won-light.webp'
const WON_ICON_DARK_SRC = '/images/pricing/icon-won-dark.webp'

// 흰 카드 — 반경 16 · 테두리 gray.100 · 여백 32.
const cardClassName = 'bg-card border-subtle-3 rounded-lg border p-8'

// 구획 제목(24 Bold)과 설명(16 · gray.500).
const SectionHeading = ({id, title, description}: {id: string; title: string; description: string}) => (
    <div className="flex flex-col gap-1">
        <h2 id={id} className="typo-h4-bold text-foreground">
            {title}
        </h2>
        <p className="typo-body-xl-regular text-foreground-subtle break-keep">{description}</p>
    </div>
)

// 혜택 한 줄 — 체크 아이콘 + 글.
const Feature = ({
    children,
    iconClassName,
    className,
}: {
    children: string
    iconClassName: string
    className: string
}) => (
    <li className={cn('text-label-foreground flex items-center gap-1', className)}>
        <Check aria-hidden="true" className={cn('shrink-0', iconClassName)} />
        {children}
    </li>
)

// 유료 이용권 카드 — 평소에는 흰 카드 + 회색 [구매하기](secondary).
// 카드에 마우스를 올리거나 카드 안 버튼에 키보드 포커스가 가면 옅은 파란 면 · 파란 테두리, [구매하기]는 채운 파란 버튼이 된다.
// 특정 이용권을 늘 강조하지 않는다 — 네 카드 모두 같은 규칙이다.
const planCardClassName =
    'group/plan transition-colors hover:border-primary hover:bg-primary-subtle has-[:focus-visible]:border-primary has-[:focus-visible]:bg-primary-subtle'
// [구매하기] — 카드 hover · 포커스 때 채운 버튼(default)과 같은 색. 버튼 자체 hover · 눌림도 default 색을 따른다.
const planButtonClassName =
    'w-full group-hover/plan:border-primary group-hover/plan:bg-primary group-hover/plan:text-primary-foreground group-has-[:focus-visible]/plan:border-primary group-has-[:focus-visible]/plan:bg-primary group-has-[:focus-visible]/plan:text-primary-foreground interactive:hover:bg-primary-hover interactive:hover:text-primary-foreground interactive:active:bg-primary-pressed interactive:active:text-primary-foreground'
const PlanCard = ({
    plan,
    paymentHref,
    isPurchaseUnavailable,
}: {
    plan: PricingPlan
    paymentHref?: string
    isPurchaseUnavailable?: boolean
}) => {
    const titleId = `pricing-plan-${plan.id}`

    return (
        <li
            aria-labelledby={titleId}
            className={cn(
                cardClassName,
                // 시안 — 아래 여백만 24 다(위 32).
                'flex flex-col gap-6 pb-6',
                planCardClassName,
            )}
        >
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    {/* 이름이 바로 옆에 있어 동전 그림은 꾸밈이다. */}
                    <Image src={plan.image} alt="" width={32} height={32} className="size-8 shrink-0" />
                    <h3 id={titleId} className="typo-title-l-bold text-foreground">
                        {plan.name}
                    </h3>
                </div>
                <div className="flex flex-col gap-4">
                    {/* 금액 — 원화 표시는 시안처럼 아이콘 자리(32)의 그림이고 숫자와 4 떨어진다. lucide 에 원화 아이콘이
                        없어 이미지를 쓴다. 그림은 꾸밈이라 비워 두고, 읽기에는 숫자 뒤 "원"을 붙인다. */}
                    <p className="flex flex-wrap items-center gap-x-1">
                        <Image
                            src={WON_ICON_LIGHT_SRC}
                            alt=""
                            width={32}
                            height={32}
                            className="[display:var(--logo-on-light)] size-8 shrink-0"
                        />
                        <Image
                            src={WON_ICON_DARK_SRC}
                            alt=""
                            width={32}
                            height={32}
                            className="[display:var(--logo-on-dark)] size-8 shrink-0"
                        />
                        <span className="typo-h2-bold text-foreground">
                            {PRICE_FORMATTER.format(plan.price)}
                            <span className="sr-only">원</span>
                        </span>
                        <span className="typo-body-l-regular text-foreground-subtle">{plan.period}</span>
                    </p>
                    <ul>
                        <Feature iconClassName="text-primary size-4" className="typo-body-l-medium">
                            {`조회 ${plan.quota}건`}
                        </Feature>
                    </ul>
                </div>
            </div>
            {isPurchaseUnavailable ? (
                // 기관회원은 이용권을 직접 구매할 수 없다 — 결제 화면으로 가지 않고 결제 불가 안내 모달을 연다.
                <PaymentUnavailableDialog>
                    <Button type="button" variant="secondary" size="sm" className={planButtonClassName}>
                        구매하기
                        <span className="sr-only"> ({plan.name})</span>
                    </Button>
                </PaymentUnavailableDialog>
            ) : (
                // 고른 이용권을 결제 화면에 ?plan= 으로 넘긴다.
                <Button asChild variant="secondary" size="sm" className={planButtonClassName}>
                    <Link href={paymentHref ? `${paymentHref}?${PLAN_QUERY_KEY}=${plan.id}` : '#'}>
                        구매하기
                        <span className="sr-only"> ({plan.name})</span>
                    </Link>
                </Button>
            )}
        </li>
    )
}

// ── [기술평가] 탭 ──

// 회원 카드 배지 색 — 무료(기업) 파랑 · 유료(기관) 보라. 머리 배지는 테두리, 이용 서비스는 채움, 평가모형은 옅은 면.
const MEMBER_BADGE_COLOR = {free: 'info', paid: 'secondary-purple'} as const

// 회원 카드 — 머리(배지 · 이름 · 오른쪽 혜택) → 구분선 → 이용 서비스 · 평가모형 줄(이름표 100 + 배지들).
// 좁은 화면에서는 혜택이 이름 아래로, 배지는 다음 줄로 내려간다.
const TechMemberCard = ({plan}: {plan: TechMemberPlan}) => {
    const titleId = `pricing-tech-${plan.id}`
    const color = MEMBER_BADGE_COLOR[plan.tone]
    return (
        <li aria-labelledby={titleId} className={cn(cardClassName, 'flex flex-col gap-4')}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" color={color} shape="round" size="sm">
                        {plan.badge}
                    </Badge>
                    <h3 id={titleId} className="flex flex-wrap items-baseline gap-x-1">
                        <span className="typo-title-l-bold text-foreground">{plan.name}</span>
                        <span className="typo-body-xl-regular text-foreground">{plan.nameDetail}</span>
                    </h3>
                </div>
                {plan.features.length ? (
                    <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {plan.features.map((feature) => (
                            <Feature key={feature} iconClassName="text-success size-5" className="typo-body-xl-medium">
                                {feature}
                            </Feature>
                        ))}
                    </ul>
                ) : null}
            </div>
            <Separator />
            <dl className="flex flex-col gap-4">
                {plan.rows.map((row) => (
                    <div key={row.label} className="flex items-start">
                        {/* 이름표 칸 100 — 배지(높이 28)와 글자 가운데를 맞춘다. */}
                        <dt className="typo-body-l-regular text-foreground-subtle w-25 shrink-0 py-1">{row.label}</dt>
                        <dd className="m-0 flex min-w-0 flex-wrap gap-2">
                            {row.items.map((item) => (
                                <Badge
                                    key={item}
                                    variant={row.kind === 'service' ? 'solid' : 'solid-pastel'}
                                    color={color}
                                    shape="round"
                                    size="sm"
                                >
                                    {item}
                                </Badge>
                            ))}
                        </dd>
                    </div>
                ))}
            </dl>
        </li>
    )
}

const TechPricing = () => (
    <div className="flex flex-col gap-10">
        <section aria-labelledby="pricing-tech-member-title" className="flex flex-col gap-6">
            <SectionHeading
                id="pricing-tech-member-title"
                title={TECH_MEMBER_SERVICE.title}
                description={TECH_MEMBER_SERVICE.description}
            />
            <ul className="flex list-none flex-col gap-6">
                {TECH_MEMBER_PLANS.map((plan) => (
                    <TechMemberCard key={plan.id} plan={plan} />
                ))}
            </ul>
        </section>
        <InfoBox variant="outline" title={TECH_ORG_GUIDE.title} headingLevel={2}>
            {TECH_ORG_GUIDE.items.map((item) => (
                <InfoBoxItem key={item}>{item}</InfoBoxItem>
            ))}
        </InfoBox>
    </div>
)

type PricingPolicyProps = {
    /** [구매하기]가 향할 결제 화면(기업). */
    paymentHref?: string
    /** 구매할 수 없는 회원(기관) — [구매하기]가 결제 화면 대신 결제 불가 안내 모달을 연다. */
    isPurchaseUnavailable?: boolean
    /** 처음 열 탭 — 페이지의 ?tab= 값. 없으면 [기술평가]. */
    defaultView?: PricingView
}

// ── [K-BIGx 보고서] 탭 — 무료 · 유료 서비스 · 이용 안내 ──
const KbigxPricing = ({paymentHref, isPurchaseUnavailable}: Omit<PricingPolicyProps, 'defaultView'>) => (
    <div className="flex flex-col gap-10">
        <section aria-labelledby="pricing-free-title" className="flex flex-col gap-6">
            <SectionHeading id="pricing-free-title" title={FREE_SERVICE.title} description={FREE_SERVICE.description} />
            {/* 무료 서비스 카드 — 이름은 왼쪽, 혜택은 오른쪽. 좁은 화면에서는 혜택이 이름 아래로 내려간다. */}
            <div className={cn(cardClassName, 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between')}>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" color="info" shape="round" size="sm">
                        {FREE_SERVICE.badge}
                    </Badge>
                    <h3 className="flex flex-wrap items-baseline gap-x-1">
                        <span className="typo-title-l-bold text-foreground">{FREE_SERVICE.name}</span>
                        <span className="typo-body-xl-regular text-foreground">{FREE_SERVICE.nameDetail}</span>
                    </h3>
                </div>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                    {FREE_SERVICE.features.map((feature) => (
                        <Feature key={feature} iconClassName="text-success size-5" className="typo-body-xl-medium">
                            {feature}
                        </Feature>
                    ))}
                </ul>
            </div>
        </section>

        <section aria-labelledby="pricing-paid-title" className="flex flex-col gap-6">
            <SectionHeading id="pricing-paid-title" title={PAID_SERVICE.title} description={PAID_SERVICE.description} />
            <div className="flex flex-col gap-4">
                {/* 이용권 카드 — PC 4열 · 태블릿 2열 · 모바일 1열. */}
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {PAID_PLANS.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            paymentHref={paymentHref}
                            isPurchaseUnavailable={isPurchaseUnavailable}
                        />
                    ))}
                </ul>
                {/* 차감 예외 안내 — 채운 알림 아이콘(16) + 14 Bold 제목, 작은 점 목록(14). 아이콘은 EmptyState 와 같은
                    방법으로 lucide 원을 채운다. */}
                <div className="flex flex-col gap-2">
                    <p className="typo-body-l-bold text-foreground flex items-center gap-2">
                        <CircleAlert
                            aria-hidden="true"
                            className="text-foreground [&>line]:stroke-card size-4 shrink-0 [&>circle]:fill-current"
                        />
                        {NO_DEDUCTION_NOTICE.title}
                    </p>
                    <ul className="typo-body-l-regular text-foreground flex list-none flex-col gap-1">
                        {NO_DEDUCTION_NOTICE.items.map((item) => (
                            <li key={item} className="flex">
                                <ListMarker type="unordered-small" />
                                <span className="min-w-0 break-keep">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* 이용 안내 상자 — InfoBox outline(흰 면 · 테두리 · 반경 16 · 여백 40·32)과 같은 규격이다. */}
        <div className="flex flex-col gap-6">
            {[USAGE_GUIDE, PARTNER_GUIDE].map((guide) => (
                <InfoBox key={guide.title} variant="outline" title={guide.title} headingLevel={2}>
                    {guide.items.map((item) => (
                        <InfoBoxItem key={item}>{item}</InfoBoxItem>
                    ))}
                </InfoBox>
            ))}
        </div>
    </div>
)

const PricingPolicy = ({paymentHref, isPurchaseUnavailable, defaultView}: PricingPolicyProps) => (
    <PricingTabs
        defaultView={defaultView}
        views={{
            tech: <TechPricing />,
            kbigx: <KbigxPricing paymentHref={paymentHref} isPurchaseUnavailable={isPurchaseUnavailable} />,
        }}
    />
)

export default PricingPolicy
