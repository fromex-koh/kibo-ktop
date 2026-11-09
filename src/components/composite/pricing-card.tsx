import Image from 'next/image'
import type {ComponentProps, ReactNode} from 'react'
import {Slot} from 'radix-ui'
import {
    pricingCardHighlightVariants,
    pricingCardTitleClassName,
    pricingCardVariants,
    type PricingCardHighlightVariantProps,
    type PricingCardVariantProps,
} from '@/components/theme/pricing-card.variants'
import {cn} from '@/lib/utils'

// 가격 카드(PricingCard) — 서비스 · 이용권 하나를 소개하는 카드. 가격정책 화면의 이용권 카드 · 회원 서비스 카드에 쓴다.
// 구역을 골라 쌓는 합성(compound) 컴포넌트다 — 필요한 구역만 넣는다.
//
//   <PricingCard>                         카드(asChild 로 <li> 등에 씌울 수 있다)
//     <PricingCardHeader … />             아이콘 · 이름 · 보조 설명 · 오른쪽 배지(무료/유료)
//     <PricingCardPrice … />              금액(원화 표시) · 위아래 설명
//     <PricingCardHighlight … />          옅은 파란 상자의 핵심 안내
//     <PricingCardMeta label="평가모형">   이름표 + 배지 목록
//     <PricingCardAction>                 아래 버튼
//
// 구매 버튼이 있는 카드는 interactive 를 주고 버튼에 pricingCardButtonClassName 을 준다 — hover · 포커스 때 카드와 버튼이 함께 강조된다.
// 여러 장을 한 줄에 놓을 때 구역 높이를 맞추려면 목록에서 grid-rows-subgrid 를 쓴다(pricing-policy 의 이용권 카드 참고).

type PricingCardProps = ComponentProps<'div'> & PricingCardVariantProps & {asChild?: boolean}

const PricingCard = ({size, elevated, interactive, asChild = false, className, ...props}: PricingCardProps) => {
    const Comp = asChild ? Slot.Root : 'div'
    return (
        <Comp
            data-slot="pricing-card"
            className={cn(pricingCardVariants({size, elevated, interactive}), className)}
            {...props}
        />
    )
}

type PricingCardHeaderProps = {
    /** 카드 이름. 목록의 카드라면 id 를 주고 카드에 aria-labelledby 로 잇는다. */
    title: ReactNode
    titleId?: string
    /** 이름 오른쪽 보조 설명(14 · 회색). 예: 기업회원 (본인 기업 조회) */
    detail?: ReactNode
    /** 이름 앞 그림(24) — 이름이 바로 옆에 있어 꾸밈으로 둔다. */
    iconSrc?: string
    /** 오른쪽 끝 배지(무료 · 유료 등). */
    badge?: ReactNode
    /** 이름 크기 — md 18 · lg 20. */
    size?: keyof typeof pricingCardTitleClassName
    /** 이름의 헤딩 단계. 기본 3(페이지 h1 → 구획 h2 → 카드 h3). */
    headingLevel?: 2 | 3 | 4
    className?: string
}

// 머리 — 이름(+보조 설명)은 왼쪽, 배지는 오른쪽. 좁으면 보조 설명이 이름 아래 줄로 내려간다.
const PricingCardHeader = ({
    title,
    titleId,
    detail,
    iconSrc,
    badge,
    size = 'md',
    headingLevel = 3,
    className,
}: PricingCardHeaderProps) => {
    const Heading = `h${headingLevel}` as const
    return (
        <div data-slot="pricing-card-header" className={cn('flex items-start justify-between gap-3', className)}>
            <div className="flex min-w-0 flex-wrap items-center gap-x-2">
                {iconSrc ? (
                    <Image src={iconSrc} alt="" width={24} height={24} className="size-icon-lg shrink-0" />
                ) : null}
                <Heading id={titleId} className={cn(pricingCardTitleClassName[size], 'text-foreground')}>
                    {title}
                </Heading>
                {detail ? <p className="typo-body-l-regular text-foreground-subtle">{detail}</p> : null}
            </div>
            {badge ? <div className="flex shrink-0">{badge}</div> : null}
        </div>
    )
}

const PRICE_FORMATTER = new Intl.NumberFormat('ko-KR')
// 원화 표시 그림 — 라이트는 검정, 다크는 흰색 한 장만 보인다(헤더·푸터 로고와 같은 --logo-on-* 전환).
// lucide 에 원화 아이콘이 없어 그림을 쓴다.
const WON_ICON_LIGHT_SRC = '/images/pricing/icon-won-light.webp'
const WON_ICON_DARK_SRC = '/images/pricing/icon-won-dark.webp'

type PricingCardPriceProps = {
    /** 금액(원). 숫자면 천 단위 쉼표와 원화 표시를 붙이고, 글자(예: 무료)면 그대로 보인다. */
    amount: number | string
    /** 금액 위 설명. 예: 다른 기업 보고서 조회 */
    label?: ReactNode
    /** 금액 아래 설명. 예: 1개월 · 부가세 포함 */
    note?: ReactNode
    className?: string
}

// 금액 — 원화 표시(24)와 숫자(28 Bold)가 4 떨어진다. 그림은 꾸밈이라 비우고, 읽기에는 숫자 뒤 "원"을 붙인다.
const PricingCardPrice = ({amount, label, note, className}: PricingCardPriceProps) => (
    <div data-slot="pricing-card-price" className={cn('flex flex-col gap-0.5', className)}>
        {label ? <p className="typo-body-l-regular text-foreground-subtle">{label}</p> : null}
        {/* 큰 굵은 금액을 <p> 로 두면 WAVE 가 "Possible heading" 으로 잡아 div 로 둔다 — 제목이 아니라 값이다. */}
        <div className="flex flex-wrap items-center gap-x-1">
            {typeof amount === 'number' ? (
                <>
                    <Image
                        src={WON_ICON_LIGHT_SRC}
                        alt=""
                        width={24}
                        height={24}
                        className="size-icon-lg [display:var(--logo-on-light)] shrink-0"
                    />
                    <Image
                        src={WON_ICON_DARK_SRC}
                        alt=""
                        width={24}
                        height={24}
                        className="size-icon-lg [display:var(--logo-on-dark)] shrink-0"
                    />
                    <span className="typo-h2-bold text-foreground">
                        {PRICE_FORMATTER.format(amount)}
                        <span className="sr-only">원</span>
                    </span>
                </>
            ) : (
                <span className="typo-h2-bold text-foreground">{amount}</span>
            )}
        </div>
        {note ? <p className="typo-body-l-regular text-foreground-subtle">{note}</p> : null}
    </div>
)

type PricingCardHighlightProps = PricingCardHighlightVariantProps & {
    /** 굵은 안내. emphasis 에서는 큰 글자(28 Bold)가 된다. */
    title: ReactNode
    /** 보조 설명 — stack 은 다음 줄, inline 은 같은 줄에 잇는다. */
    description?: ReactNode
    /** emphasis 에서 큰 글자 위 작은 이름표. 예: 파트너(기관) */
    label?: ReactNode
    className?: string
}

// 핵심 안내 상자 — 이용 건수 · 제공 조건처럼 카드에서 가장 먼저 읽혀야 할 한두 줄.
const PricingCardHighlight = ({layout = 'stack', title, description, label, className}: PricingCardHighlightProps) => (
    <div data-slot="pricing-card-highlight" className={cn(pricingCardHighlightVariants({layout}), className)}>
        {layout === 'emphasis' ? (
            <>
                {label ? <p className="typo-body-l-regular text-foreground-subtle">{label}</p> : null}
                {/* 큰 글자(28 Bold)도 값이라 div 로 둔다(WAVE "Possible heading" 방지). */}
                <div className="typo-h2-bold text-foreground">{title}</div>
            </>
        ) : (
            <>
                <p className="typo-body-l-bold text-foreground">{title}</p>
                {description ? <p className="typo-body-l-regular text-label-foreground">{description}</p> : null}
            </>
        )}
    </div>
)

// 이름표 + 값 목록 한 줄(dl · dt · dd) — 태블릿부터 이름표 칸 96 옆에 값(배지 등)이 늘어서고, 넘치면 다음 줄로 간다.
// 모바일은 이름표가 값 위로 올라간다. 칸 96 은 588 폭 카드에 평가모형 배지 네 개가 한 줄에 드는 폭이다.
const PricingCardMeta = ({label, children, className}: {label: ReactNode; children: ReactNode; className?: string}) => (
    <dl data-slot="pricing-card-meta" className={cn('flex flex-col gap-2 md:flex-row md:items-start', className)}>
        {/* 태블릿부터 배지(높이 28)와 글자 가운데를 맞춘다. */}
        <dt className="typo-body-l-regular text-foreground-subtle shrink-0 md:w-24 md:py-1">{label}</dt>
        <dd className="m-0 flex min-w-0 flex-wrap gap-2">{children}</dd>
    </dl>
)

// 아래 버튼 영역 — 버튼이 카드 폭을 채운다(버튼에 pricingCardButtonClassName).
const PricingCardAction = ({className, ...props}: ComponentProps<'div'>) => (
    <div data-slot="pricing-card-action" className={cn('flex', className)} {...props} />
)

export {PricingCard, PricingCardAction, PricingCardHeader, PricingCardHighlight, PricingCardMeta, PricingCardPrice}
export type {PricingCardHeaderProps, PricingCardHighlightProps, PricingCardPriceProps, PricingCardProps}
