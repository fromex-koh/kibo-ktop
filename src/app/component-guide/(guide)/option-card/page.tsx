// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {OptionCard} from '@/components/composite/option-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '옵션 카드 (OptionCard)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const MODEL_OPTIONS = [
    {
        badge: 'KTRS-FM',
        title: '신속표준모형',
        description: [
            '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
            '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
        ],
        illustration: '/images/option-card/shield-certificate.webp',
    },
    {
        badge: 'Tech-Index',
        title: '혁신성장역량지수(일반/창업)',
        description: [
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다.',
            '보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        ],
        illustration: '/images/option-card/lightbulb-magnifier.webp',
    },
] as const

const USAGE_CODE = `import {OptionCard} from '@/components/composite/option-card'

const models = [
  {
    href: '/self-diagnosis/customer-consent',
    badge: 'KTRS-FM',
    title: '신속표준모형',
    description: [
      '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
      '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
    ],
    illustration: '/images/option-card/shield-certificate.webp',
  },
]

<section aria-labelledby="evaluation-models-title">
  <h2 id="evaluation-models-title" className="sr-only">평가모형 목록</h2>
  <div className="grid gap-6 md:grid-cols-2">
    {models.map((model) => (
      <OptionCard
        key={model.title}
        href={model.href}
        badge={model.badge}
        title={model.title}
        description={<>{model.description[0]}<br />{model.description[1]}</>}
        illustration={
          <Image
            src={model.illustration}
            alt=""
            draggable={false}
            width={148}
            height={100}
            style={{width: 148, height: 100}}
          />
        }
      />
    ))}
  </div>
</section>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'option-card',
        cells: [
            '누르면 다른 화면으로 이동',
            <code key="component">OptionCard</code>,
            '카드 전체가 링크입니다. 값을 고르는 용도가 아닙니다.',
        ],
    },
    {
        key: 'radio-card',
        cells: [
            '큰 카드 중 하나를 골라 값으로 제출',
            <Link key="component" href="/component-guide/radio-card" className={LINK_CLASS}>
                RadioCard
            </Link>,
            '배지 · 일러스트를 담는 큰 라디오입니다. 누르면 이동하지 않고 값만 고릅니다.',
        ],
    },
    {
        key: 'radio-chip',
        cells: [
            '제목 + 설명 한두 줄 중 하나를 골라 값으로 제출',
            <Link key="component" href="/component-guide/radio-chip" className={LINK_CLASS}>
                RadioChip
            </Link>,
            '글만 담는 낮은 라디오 상자입니다. 배지 · 일러스트가 없습니다.',
        ],
    },
    {
        key: 'selectable-card',
        cells: [
            '라디오 · 체크박스가 보이는 선택 카드',
            <Link key="component" href="/component-guide/selectable-card" className={LINK_CLASS}>
                SelectableCard
            </Link>,
            '컨트롤과 라벨 · 뱃지를 한 카드로 묶습니다. 여러 개 고르기(체크박스)도 됩니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['OptionCard', 'href', '카드 전체가 이동하는 링크 경로입니다.', '-', 'string'],
    ['OptionCard', 'title', '카드 제목입니다. heading 이 아니라 링크 텍스트로 렌더링됩니다.', '-', 'ReactNode'],
    [
        'OptionCard',
        'badge',
        '제목 위 배지입니다. 문자열은 기본 Badge(solid · info · pill · sm)로 표시하고, 요소는 그대로 표시합니다.',
        '-',
        'ReactNode',
    ],
    ['OptionCard', 'subtitle', '제목 아래 보조 제목입니다.', '-', 'ReactNode'],
    ['OptionCard', 'description', '카드 설명입니다. 줄바꿈이 필요하면 요소로 전달합니다.', '-', 'ReactNode'],
    [
        'OptionCard',
        'illustration',
        '일러스트 영역입니다. md 이상에서는 제목 오른쪽, md 미만에서는 제목 아래에 놓입니다.',
        '-',
        'ReactNode',
    ],
    [
        'OptionCard',
        'Link 속성',
        'className 등 next/link 속성을 전달합니다.',
        '-',
        "Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'title'>",
    ],
] as const

const OptionCardGuidePage = () => (
    <GuidePageShell
        title="옵션 카드 (OptionCard)"
        description="평가모형처럼 여러 선택지 중 하나의 다음 화면으로 이동할 때 사용하는 링크 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="option-card-preview" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="option-card-preview" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>href</code>와 <code>title</code>은 필수이고 배지·보조 제목·설명·일러스트는 선택입니다.
                        카드는 놓인 칸의 폭과 높이를 채우므로 사용처에서 그리드로 배치합니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {MODEL_OPTIONS.map((model) => (
                        <OptionCard
                            key={model.title}
                            href="#option-card-props"
                            badge={model.badge}
                            title={model.title}
                            description={
                                <>
                                    {model.description[0]}
                                    <br />
                                    {model.description[1]}
                                </>
                            }
                            illustration={
                                <Image
                                    src={model.illustration}
                                    alt=""
                                    draggable={false}
                                    width={148}
                                    height={100}
                                    style={{width: 148, height: 100}}
                                />
                            }
                        />
                    ))}
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="option-card-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="option-card-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이동하는 카드인지 값을 고르는 카드인지로 나눕니다.
                    </p>
                </div>
                <Table
                    caption="OptionCard · RadioCard · RadioChip · SelectableCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="option-card-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="option-card-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        링크 마크업과 포커스 표시는 컴포넌트가 처리합니다. 목록 제목과 일러스트 alt 는 사용처 몫입니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        카드 전체가 하나의 <code>next/link</code>이고 화살표는 <code>aria-hidden</code> 장식입니다
                        [6.4.3]. 제목 · 보조 제목 · 설명이 모두 링크 텍스트가 됩니다.
                    </li>
                    <li>제목은 heading 이 아닙니다. 사용처가 상위 section 의 heading 으로 목록을 묶습니다[6.4.2].</li>
                    <li>카드 안에 버튼이나 다른 링크를 넣지 않습니다[8.1.1].</li>
                    <li>
                        장식용 일러스트에는 빈 <code>alt</code>를 줍니다[5.1.1].
                    </li>
                    <li>키보드 포커스는 파란 테두리와 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section id="option-card-props" aria-labelledby="option-card-props-title" className="flex flex-col gap-6">
                <h2 id="option-card-props-title" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="OptionCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OptionCardGuidePage
