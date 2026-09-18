import Image from 'next/image'
import Link from 'next/link'
import {Check, CircleAlert} from 'lucide-react'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {ListMarker} from '@/components/custom/list-marker'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    FREE_SERVICE,
    NO_DEDUCTION_NOTICE,
    PAID_PLANS,
    PAID_SERVICE,
    PARTNER_GUIDE,
    PLAN_QUERY_KEY,
    USAGE_GUIDE,
    type PricingPlan,
} from '@/content/service/pricing'
import {cn} from '@/lib/utils'

// 가격정책 — 시안 "SB-FOTA-CM4-0001_가격 정책"(40007578:164043). 기업·기관이 같은 화면이다.
// 문구·이용권은 content/service/pricing.ts 에 있고, 이 파일은 짜임(카드·안내 상자)만 갖는다.
//
// 간격(시안): 구획(무료 · 유료 · 이용 안내) 사이 40 · 구획 제목과 설명 4 · 설명과 카드 24 · 카드 사이 24 ·
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

// 유료 이용권 카드. 강조 카드(스탠다드)는 옅은 파란 면·파란 테두리이고 [구매하기]가 채운 버튼이다.
const PlanCard = ({plan, paymentHref}: {plan: PricingPlan; paymentHref?: string}) => {
    const titleId = `pricing-plan-${plan.id}`

    return (
        <li
            aria-labelledby={titleId}
            className={cn(
                cardClassName,
                // 시안 — 아래 여백만 24 다(위 32).
                'flex flex-col gap-6 pb-6',
                plan.isRecommended && 'bg-primary-subtle border-primary',
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
            {/* 고른 이용권을 결제 화면에 ?plan= 으로 넘긴다. */}
            <Button asChild variant={plan.isRecommended ? 'default' : 'secondary'} size="sm" className="w-full">
                <Link href={paymentHref ? `${paymentHref}?${PLAN_QUERY_KEY}=${plan.id}` : '#'}>
                    구매하기
                    <span className="sr-only"> ({plan.name})</span>
                </Link>
            </Button>
        </li>
    )
}

type PricingPolicyProps = {
    /** [구매하기]가 향할 결제 화면. 결제 화면이 없는 서비스(기관)는 주지 않는다 — 버튼이 제자리(#)를 가리킨다. */
    paymentHref?: string
}

const PricingPolicy = ({paymentHref}: PricingPolicyProps) => (
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
                        <PlanCard key={plan.id} plan={plan} paymentHref={paymentHref} />
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

export default PricingPolicy
