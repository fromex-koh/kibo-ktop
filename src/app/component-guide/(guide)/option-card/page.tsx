import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import {OptionCard} from '@/components/composite/option-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '옵션 카드 (OptionCard)'}

const MODEL_OPTIONS = [
    {
        badge: 'KTRS-FM',
        title: '신속표준모형',
        description: [
            '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
            '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
        ],
        illustration: '/images/option-card/growth-index.webp',
    },
    {
        badge: 'Tech-Index',
        title: '혁신성장역량지수(일반/창업)',
        description: [
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다.',
            '보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        ],
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

const USAGE_CODE = `const models = [
  {
    href: '/self-diagnosis/customer-consent',
    badge: 'KTRS-FM',
    title: '신속표준모형',
    description: [
      '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
      '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
    ],
    illustration: '/images/option-card/growth-index.webp',
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

const PROPS_ITEMS = [
    ['OptionCard', 'href', '카드 전체가 이동하는 링크 경로입니다.', '-', 'string'],
    ['OptionCard', 'title', '링크의 주 제목입니다. 별도의 heading은 사용처에서 제공합니다.', '-', 'ReactNode'],
    [
        'OptionCard',
        'badge',
        '상단 분류 배지입니다. 문자열은 기본 Badge(solid·info·pill·sm)로 표시합니다.',
        'undefined',
        'ReactNode',
    ],
    ['OptionCard', 'subtitle', '제목 아래에 필요한 경우 표시하는 보조 제목입니다.', 'undefined', 'ReactNode'],
    [
        'OptionCard',
        'description',
        '카드 설명입니다. 문장별 줄바꿈이 필요하면 ReactNode로 전달합니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'OptionCard',
        'illustration',
        '우측 일러스트 슬롯입니다. 장식 이미지는 빈 alt를 사용합니다.',
        'undefined',
        'ReactNode',
    ],
    ['OptionCard', 'className · Link props', '카드 스타일과 next/link 속성을 전달합니다.', 'undefined', 'LinkProps'],
] as const

const OptionCardGuidePage = () => (
    <GuidePageShell
        title="옵션 카드 (OptionCard)"
        description="평가모형처럼 여러 선택지 중 하나의 다음 화면으로 이동할 때 사용하는 링크 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="option-card-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="option-card-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가모형 선택 화면의 실제 카드 구성입니다. 카드 전체가 링크이며 hover·키보드 포커스 시 테두리,
                        배경과 화살표가 함께 강조됩니다.
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="option-card-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="option-card-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        목록의 제목은 사용처에서 제공하고 카드는 반응형 그리드로 배치합니다. 설명의 문장 단위 줄바꿈과
                        장식 이미지의 빈 <code className="font-mono">alt</code>도 사용처에서 결정합니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section id="option-card-props" aria-labelledby="option-card-props-title" className="flex flex-col gap-4">
                <div>
                    <h2 id="option-card-props-title" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        실제 평가모형 화면은 <code className="font-mono">href</code> ·{' '}
                        <code className="font-mono">badge</code> · <code className="font-mono">title</code> ·{' '}
                        <code className="font-mono">description</code> · <code className="font-mono">illustration</code>
                        을 사용합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="OptionCard Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="option-card-accessibility" className="flex flex-col gap-3">
                <h2 id="option-card-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>카드 전체가 하나의 링크이므로 내부에 버튼이나 별도 링크를 중첩하지 않습니다.</li>
                    <li>카드 제목은 링크 텍스트이며, 목록의 heading은 상위 section에서 제공합니다.</li>
                    <li>내용을 반복하는 일러스트는 장식 이미지로 처리해 빈 alt를 사용합니다.</li>
                    <li>기본 포커스 스타일을 제거하지 않으며 카드의 목적이 제목과 설명만으로 구분되어야 합니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OptionCardGuidePage
