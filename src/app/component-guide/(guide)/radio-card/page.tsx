import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {RadioCardDemo} from './radio-card-demo'

export const metadata: Metadata = {title: '라디오 카드 (RadioCard)'}

const USAGE_CODE = `const [model, setModel] = useState('')

<p id="evaluation-models-title">Tech-Index 평가모형을 선택해 주세요.</p>

<RadioCardGroup
  name="evaluationModel"
  value={model}
  onValueChange={setModel}
  required
  aria-labelledby="evaluation-models-title"
>
  {models.map((item) => (
    <RadioCard
      key={item.value}
      value={item.value}
      badge={item.badge}
      title={item.title}
      description={<>{item.description[0]}<br />{item.description[1]}</>}
      illustration={<Image src={item.illustration} alt="" width={148} height={100} style={{width: 148, height: 100}} />}
    />
  ))}
</RadioCardGroup>

{/* 필수값이면 고르기 전까지 다음 버튼을 잠근다 */}
<StepNavigation appearance="plain" next={{type: 'submit', disabled: !model, children: '신청'}} />`

const PROPS_ITEMS = [
    [
        'RadioCardGroup',
        'value · onValueChange · name',
        '고른 값과 그 변경을 받습니다. name 을 주면 폼 제출에 그 이름으로 실립니다.',
        '—',
        'RadioGroup props',
    ],
    [
        'RadioCardGroup',
        'aria-labelledby · aria-label',
        '무엇을 고르는 묶음인지 이름을 줍니다. 화면에 제목 문장이 있으면 그 id 를 잇습니다.',
        '—',
        'string',
    ],
    ['RadioCard', 'value', '이 카드가 가진 값입니다.', '—', 'string'],
    ['RadioCard', 'title', '카드 제목입니다. 라디오의 접근 이름이 됩니다.', '—', 'ReactNode'],
    [
        'RadioCard',
        'badge',
        '상단 분류 배지입니다. 문자열은 기본 Badge(solid·info·pill·sm)로 표시합니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'RadioCard',
        'description',
        '카드 설명입니다. 문장별 줄바꿈이 필요하면 ReactNode로 전달합니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'RadioCard',
        'illustration',
        '우측 일러스트 슬롯입니다. 장식 이미지는 빈 alt를 사용합니다.',
        'undefined',
        'ReactNode',
    ],
    ['RadioCard', 'disabled · className', '비활성 여부와 추가 클래스입니다.', 'undefined', 'RadioGroupItem props'],
] as const

const RadioCardGuidePage = () => (
    <GuidePageShell
        title="라디오 카드 (RadioCard)"
        description="여러 선택지 중 하나를 고르는 큰 카드입니다. 겉모습은 옵션 카드(OptionCard)와 같지만 누르면 이동하지 않고 값을 고릅니다."
    >
        <BaseCard>
            <section aria-labelledby="radio-card-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="radio-card-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p id="radio-card-preview-hint" className="typo-body-l-regular text-muted-foreground">
                        평가모형 선택 화면의 실제 카드 구성입니다. 고른 카드만 파란 테두리와 옅은 파란 면으로 남고,
                        화살표 키로도 옮겨 고를 수 있습니다.
                    </p>
                </div>
                <RadioCardDemo labelledBy="radio-card-preview-hint" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-card-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="radio-card-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        고른 값은 화면이 들고 있다가 다음 버튼을 열어 주는 데 씁니다. 카드가 곧 다음 화면으로 가는
                        링크라면 이 컴포넌트가 아니라 <code className="font-mono">OptionCard</code>를 씁니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="radio-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        나머지 속성은 Radix RadioGroup 의 Root · Item 으로 그대로 전달됩니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RadioCard Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-card-accessibility" className="flex flex-col gap-3">
                <h2 id="radio-card-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>
                        하나만 고르는 묶음이라 Radix RadioGroup 을 씁니다 — 화살표 키 이동, 그룹 안에서 탭 한 번, 선택
                        상태 전달을 모두 담당합니다([6.1.1] · [8.2.1]).
                    </li>
                    <li>묶음에는 이름이 필요합니다 — 화면의 안내 문장 id 를 aria-labelledby 로 잇습니다([7.4.1]).</li>
                    <li>카드 제목이 라디오의 이름이 되므로 제목만으로 무엇을 고르는지 알 수 있어야 합니다.</li>
                    <li>
                        선택은 색만으로 구분되지 않습니다 — 테두리와 면이 함께 바뀌고, 상태는 보조기기에 그대로
                        전달됩니다([5.3.1]).
                    </li>
                    <li>
                        카드 안은 모두 <code className="font-mono">span</code> 입니다 — 카드가{' '}
                        <code className="font-mono">button</code> 이라 그 안에 <code className="font-mono">p</code>·
                        <code className="font-mono">div</code> 를 넣을 수 없습니다([8.1.1]).
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadioCardGuidePage
