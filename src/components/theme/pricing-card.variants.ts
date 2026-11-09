import {cva, type VariantProps} from 'class-variance-authority'

// 가격 카드(PricingCard) 스타일. 카드 · 머리 · 금액 · 핵심 안내 · 평가모형 줄 · 버튼 영역의 모양을 둔다.

// 카드 — 흰 면 · 옅은 테두리(gray.100) · 반경 16.
// size: md 는 이용권 카드처럼 여러 장이 한 줄에 놓이는 좁은 카드(여백 20 · 구역 사이 16),
// lg 는 넓은 안내 카드(여백 32 · 머리와 본문 사이 28 — 모바일은 24 · 24 로 줄인다).
// elevated: 한 장만 가운데 놓이는 카드에 옅은 그림자(shadow-1 — 화면 안 카드 공통, 다크에서는 거의 안 보임).
// shadow-md 로 바꾸지 않는다 — 메뉴 · 팝오버용이라 다크에서 흰 빛 번짐이 되어 이 카드만 떠 보인다.
// interactive: 구매 버튼이 있는 이용권 카드 — 카드에 마우스를 올리거나 카드 안 버튼에 키보드 포커스가 가면
// 파란 테두리 · 옅은 파란 면이 된다. 특정 카드를 늘 강조하지 않는다.
export const pricingCardVariants = cva('bg-card border-subtle-3 flex flex-col rounded-lg border', {
    variants: {
        size: {md: 'gap-4 p-5', lg: 'gap-6 p-6 md:gap-7 md:p-8'},
        elevated: {true: 'shadow-1', false: ''},
        interactive: {
            true: 'group/pricing-card hover:border-primary hover:bg-primary-subtle has-[:focus-visible]:border-primary has-[:focus-visible]:bg-primary-subtle transition-colors motion-reduce:transition-none',
            false: '',
        },
    },
    defaultVariants: {size: 'md', elevated: false, interactive: false},
})
export type PricingCardVariantProps = VariantProps<typeof pricingCardVariants>

// 카드 이름 — md 18 · lg 20 Bold.
export const pricingCardTitleClassName = {md: 'typo-title-m-bold', lg: 'typo-title-l-bold'} as const

// 핵심 안내 상자 — 옅은 파란 면 · 반경 8 · 여백 12.
// interactive 카드가 강조되면(옅은 파란 면) 같은 색 상자가 묻히지 않게 상자를 흰 면(card)으로 바꾼다.
// group/pricing-card 는 interactive 카드에만 붙어, 다른 카드의 상자 · 버튼은 반응하지 않는다.
// stack: 굵은 제목 아래 설명 줄, inline: 굵은 제목 뒤에 설명이 이어진다, emphasis: 작은 이름표 아래 큰 글자(28 Bold).
export const pricingCardHighlightVariants = cva(
    'bg-primary-subtle flex rounded-sm p-3 transition-colors group-hover/pricing-card:bg-card group-has-[:focus-visible]/pricing-card:bg-card motion-reduce:transition-none',
    {
        variants: {
            layout: {
                stack: 'flex-col gap-0.5',
                inline: 'flex-wrap items-baseline gap-x-1',
                emphasis: 'flex-col gap-2',
            },
        },
        defaultVariants: {layout: 'stack'},
    },
)
export type PricingCardHighlightVariantProps = VariantProps<typeof pricingCardHighlightVariants>

// [구매하기] 같은 카드 아래 버튼 — 프로젝트 버튼(secondary · md)에 폭만 채운다.
// PROJECT-STYLE: 시안은 높이 44 · 16 Bold 지만 차이가 작아 다른 화면과 같은 버튼 규격(48 · Medium)을 쓴다.
// interactive 카드가 강조되면 채운 파란 버튼(default 와 같은 색)이 되고, 버튼 자체 hover · 눌림도 default 색을 따른다.
export const pricingCardButtonClassName =
    'w-full group-hover/pricing-card:border-primary group-hover/pricing-card:bg-primary group-hover/pricing-card:text-primary-foreground group-has-[:focus-visible]/pricing-card:border-primary group-has-[:focus-visible]/pricing-card:bg-primary group-has-[:focus-visible]/pricing-card:text-primary-foreground interactive:hover:bg-primary-hover interactive:hover:text-primary-foreground interactive:active:bg-primary-pressed interactive:active:text-primary-foreground'
