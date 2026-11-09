// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {
    PricingCard,
    PricingCardAction,
    PricingCardHeader,
    PricingCardHighlight,
    PricingCardMeta,
    PricingCardPrice,
} from '@/components/composite/pricing-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {pricingCardButtonClassName} from '@/components/theme/pricing-card.variants'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '가격 카드 (PricingCard)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const PLAN_CODE = `import {
  PricingCard, PricingCardAction, PricingCardHeader, PricingCardHighlight, PricingCardPrice,
} from '@/components/composite/pricing-card'
import {pricingCardButtonClassName} from '@/components/theme/pricing-card.variants'

<PricingCard interactive>
  <PricingCardHeader
    title="베이직"
    iconSrc="/images/ticket-grade/ticket-grade-basic.webp"
    badge={<Badge variant="solid-pastel" color="secondary-purple" shape="round" size="sm">유료</Badge>}
  />
  <PricingCardPrice label="다른 기업 보고서 조회" amount={330000} note="1개월 · 부가세 포함" />
  <PricingCardHighlight title="조회 20건" description="이용 기간 1개월" />
  <PricingCardAction>
    <Button variant="secondary" size="md" className={pricingCardButtonClassName}>구매하기</Button>
  </PricingCardAction>
</PricingCard>`

const SERVICE_CODE = `<PricingCard size="lg" elevated>
  <PricingCardHeader title="기술평가 (자가진단)" detail="기업회원 (본인 기업 조회)" badge={…} size="lg" />
  <div className="flex flex-col gap-3">
    <PricingCardHighlight layout="inline" title="평가모형 별 월 1회 제공" description="이용권 불필요" />
    <PricingCardMeta label="평가모형">
      <Badge variant="solid-pastel" color="info" shape="round" size="sm">KTRS-FM</Badge>
      …
    </PricingCardMeta>
  </div>
</PricingCard>`

const SUBGRID_CODE = `{/* 한 줄에 놓인 카드끼리 금액 · 안내 · 버튼 높이를 맞춘다 — 카드 네 구역을 목록의 행에 얹는다(한 줄에 한 장인 모바일은 끈다). */}
<ul className="grid gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-5">
  <PricingCard asChild className="md:row-span-4 md:grid md:grid-rows-subgrid">
    <li>…머리 · 금액 · 안내 · 버튼…</li>
  </PricingCard>
</ul>`

const PROPS_ITEMS = [
    [
        'PricingCard',
        'size',
        'md 는 여러 장이 한 줄에 놓이는 좁은 카드(여백 20), lg 는 넓은 카드(여백 32).',
        "'md'",
        "'md' | 'lg'",
    ],
    [
        'PricingCard',
        'elevated',
        '한 장만 가운데 놓일 때 옅은 그림자(shadow-1)를 줍니다. 다크에서는 그림자 대신 카드 면 · 테두리로 구분됩니다.',
        'false',
        'boolean',
    ],
    [
        'PricingCard',
        'interactive',
        '구매 버튼이 있는 카드 — 마우스를 올리거나 안의 버튼에 포커스가 가면 파란 테두리 · 옅은 파란 면이 되고, 안내 상자는 흰 면, 버튼은 채운 파란 버튼이 됩니다.',
        'false',
        'boolean',
    ],
    ['PricingCard', 'asChild', '자식 요소(예: li)에 카드 스타일을 씌웁니다.', 'false', 'boolean'],
    [
        'PricingCardHeader',
        'title · titleId',
        '카드 이름과 그 id(카드 aria-labelledby 연결용)입니다.',
        '-',
        'ReactNode · string',
    ],
    ['PricingCardHeader', 'detail', '이름 옆 보조 설명(14 · 회색)입니다.', 'undefined', 'ReactNode'],
    ['PricingCardHeader', 'iconSrc', '이름 앞 그림(24, 꾸밈)입니다.', 'undefined', 'string'],
    ['PricingCardHeader', 'badge', '오른쪽 끝 배지입니다.', 'undefined', 'ReactNode'],
    ['PricingCardHeader', 'size', '이름 크기 — md 18 · lg 20.', "'md'", "'md' | 'lg'"],
    ['PricingCardHeader', 'headingLevel', '이름의 헤딩 단계입니다.', '3', '2 | 3 | 4'],
    ['PricingCardPrice', 'amount', '숫자면 원화 표시 + 천 단위 쉼표, 글자면 그대로 보입니다.', '-', 'number | string'],
    ['PricingCardPrice', 'label · note', '금액 위 · 아래 설명입니다.', 'undefined', 'ReactNode'],
    [
        'PricingCardHighlight',
        'layout',
        'stack(제목 아래 설명) · inline(제목 뒤 설명) · emphasis(작은 이름표 아래 큰 글자).',
        "'stack'",
        "'stack' | 'inline' | 'emphasis'",
    ],
    [
        'PricingCardHighlight',
        'title · description · label',
        '안내 글입니다. label 은 emphasis 에서만 씁니다.',
        '-',
        'ReactNode',
    ],
    ['PricingCardMeta', 'label · children', '이름표와 값(배지 등)입니다. dl/dt/dd 로 그립니다.', '-', 'ReactNode'],
    [
        'PricingCardAction',
        'children',
        '아래 버튼입니다. 버튼에 pricingCardButtonClassName 을 줍니다.',
        '-',
        'ReactNode',
    ],
] as const

const PlanCardDemo = () => (
    <PricingCard interactive className="max-w-xs">
        <PricingCardHeader
            title="베이직"
            iconSrc="/images/ticket-grade/ticket-grade-basic.webp"
            badge={
                <Badge variant="solid-pastel" color="secondary-purple" shape="round" size="sm">
                    유료
                </Badge>
            }
        />
        <PricingCardPrice label="다른 기업 보고서 조회" amount={330000} note="1개월 · 부가세 포함" />
        <PricingCardHighlight title="조회 20건" description="이용 기간 1개월" />
        <PricingCardAction>
            <Button type="button" variant="secondary" size="md" className={pricingCardButtonClassName}>
                구매하기
            </Button>
        </PricingCardAction>
    </PricingCard>
)

const PricingCardGuidePage = () => (
    <GuidePageShell
        title="가격 카드 (PricingCard)"
        description="서비스 · 이용권 하나를 소개하는 카드입니다. 머리 · 금액 · 핵심 안내 · 이름표 줄 · 버튼 구역을 골라 쌓습니다."
    >
        <BaseCard>
            <section aria-labelledby="pricing-card-plan" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pricing-card-plan" className="typo-h4-bold">
                        이용권 카드 (size md)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/pricing?tab=kbigx" className={LINK_CLASS}>
                            가격정책 &gt; K-BIGx 보고서
                        </Link>
                        (기업회원). 버튼은 프로젝트 버튼 규격(secondary · md)을 그대로 씁니다. 카드에 마우스를 올리면
                        강조(interactive)가 보입니다.
                    </p>
                </div>
                <PlanCardDemo />
                <CodeBlock code={PLAN_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="pricing-card-service" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pricing-card-service" className="typo-h4-bold">
                        서비스 카드 (size lg)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        가격 없이 이용 조건과 평가모형을 보여 줍니다. 한 장만 가운데 놓일 때는 <code>elevated</code> 로
                        그림자를 줍니다. 모바일에서는 여백이 24 로 줄고 이름표가 배지 위로 올라갑니다.
                    </p>
                </div>
                <PricingCard size="lg" elevated className="max-w-modal">
                    <PricingCardHeader
                        title="기술평가 (자가진단)"
                        detail="기업회원 (본인 기업 조회)"
                        size="lg"
                        badge={
                            <Badge variant="solid-pastel" color="info" shape="round" size="sm">
                                무료
                            </Badge>
                        }
                    />
                    <div className="flex flex-col gap-3">
                        <PricingCardHighlight
                            layout="inline"
                            title="평가모형 별 월 1회 제공"
                            description="이용권 불필요"
                        />
                        <PricingCardMeta label="평가모형">
                            {['KTRS-FM', '투자모형', 'Tech-Index(일반)', 'Tech-Index(창업)'].map((model) => (
                                <Badge key={model} variant="solid-pastel" color="info" shape="round" size="sm">
                                    {model}
                                </Badge>
                            ))}
                        </PricingCardMeta>
                    </div>
                </PricingCard>
                <CodeBlock code={SERVICE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="pricing-card-emphasis" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pricing-card-emphasis" className="typo-h4-bold">
                        큰 안내 (Highlight emphasis)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        금액 대신 이용 조건을 크게 보일 때 씁니다(가격정책 K-BIGx 보고서 · 기관회원).
                    </p>
                </div>
                <PricingCard size="lg" elevated className="max-w-modal gap-4 md:gap-4">
                    <PricingCardHeader
                        title="K-BIGx 보고서"
                        size="lg"
                        badge={
                            <Badge variant="solid-pastel" color="secondary-purple" shape="round" size="sm">
                                유료
                            </Badge>
                        }
                    />
                    <PricingCardHighlight layout="emphasis" label="파트너(기관)" title="계약 체결 후 이용" />
                </PricingCard>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="pricing-card-grid" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pricing-card-grid" className="typo-h4-bold">
                        여러 장 나란히 놓기
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        카드마다 금액 · 안내 줄 수가 달라도 같은 줄의 구역 높이가 맞도록 목록에서{' '}
                        <code>grid-rows-subgrid</code> 를 씁니다. 버튼이 없는 카드도 안내 상자가 같은 높이에 놓입니다.
                    </p>
                </div>
                <CodeBlock code={SUBGRID_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="pricing-card-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pricing-card-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        이름은 실제 헤딩(기본 h3)입니다. 목록에 놓을 때는 카드에 aria-labelledby 로 이름을
                        잇습니다[6.4.2].
                    </li>
                    <li>
                        원화 표시 · 등급 그림은 꾸밈이라 alt 를 비우고, 금액 뒤에 &ldquo;원&rdquo;을 sr-only 로
                        읽힙니다[5.1.1].
                    </li>
                    <li>
                        같은 이름의 버튼이 여러 개면 버튼 안에 이용권 이름을 sr-only 로 붙입니다(예: 구매하기
                        (베이직))[6.4.3].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="pricing-card-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pricing-card-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PricingCard 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PricingCardGuidePage
