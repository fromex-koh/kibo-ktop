// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {RadioCardDemo} from './radio-card-demo'

export const metadata: Metadata = {title: '라디오 카드 (RadioCard)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {RadioCard, RadioCardGroup} from '@/components/composite/radio-card'

const [model, setModel] = useState('')

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
<StepNavigation appearance="plain" next={{type: 'submit', disabled: !model, children: '다음'}} />`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'radio-card',
        cells: [
            '큰 카드 중 하나를 골라 값으로 제출',
            <code key="component">RadioCard</code>,
            '배지 · 일러스트를 담는 큰 라디오입니다. 누르면 이동하지 않고 값만 고릅니다.',
        ],
    },
    {
        key: 'option-card',
        cells: [
            '누르면 다른 화면으로 이동',
            <Link key="component" href="/component-guide/option-card" className={LINK_CLASS}>
                OptionCard
            </Link>,
            '카드 전체가 링크입니다. 값을 고르는 용도가 아닙니다.',
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
    [
        'RadioCardGroup',
        'value · defaultValue · onValueChange',
        '고른 값과 변경 콜백입니다(제어 · 비제어).',
        '-',
        'string · (value: string) => void',
    ],
    ['RadioCardGroup', 'name · required', '폼 제출에 쓰는 이름과 필수 여부입니다.', '-', 'string · boolean'],
    ['RadioCardGroup', 'disabled', '묶음 전체를 비활성으로 만듭니다.', '-', 'boolean'],
    [
        'RadioCardGroup',
        'aria-labelledby · aria-label',
        '묶음의 이름입니다. 화면에 안내 문장이 있으면 그 id 를 잇습니다.',
        '-',
        'string',
    ],
    ['RadioCardGroup', 'className', '묶음에 추가할 클래스입니다.', '-', 'string'],
    ['RadioCard', 'value', '이 카드가 가진 값입니다. 필수입니다.', '-', 'string'],
    ['RadioCard', 'title', '카드 제목입니다. 필수이며 라디오의 이름이 됩니다.', '-', 'ReactNode'],
    [
        'RadioCard',
        'badge',
        '제목 위 배지입니다. 문자열은 기본 Badge(solid · info · pill · sm)로 표시하고, 요소는 그대로 표시합니다.',
        '-',
        'ReactNode',
    ],
    ['RadioCard', 'description', '제목 아래 설명입니다. 줄바꿈이 필요하면 요소로 넘깁니다.', '-', 'ReactNode'],
    ['RadioCard', 'illustration', '제목 오른쪽 일러스트 자리입니다.', '-', 'ReactNode'],
    ['RadioCard', 'disabled', '이 카드만 비활성으로 만듭니다.', '-', 'boolean'],
    ['RadioCard', 'className', '카드에 추가할 클래스입니다.', '-', 'string'],
] as const

const RadioCardGuidePage = () => (
    <GuidePageShell
        title="라디오 카드 (RadioCard)"
        description="배지 · 제목 · 설명 · 일러스트를 담은 카드 중 하나를 고르는 입력입니다."
    >
        <BaseCard>
            <section aria-labelledby="radio-card-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-card-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>RadioCardGroup</code> 안에 <code>RadioCard</code>를 넣고, 카드마다 <code>value</code>와{' '}
                        <code>title</code>을 줍니다. 묶음에는 <code>aria-labelledby</code> 또는 <code>aria-label</code>
                        로 이름을 붙입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <p id="radio-card-usage-label" className="typo-body-l-medium text-foreground">
                        Tech-Index 평가모형을 선택해 주세요.
                    </p>
                    <RadioCardDemo labelledBy="radio-card-usage-label" />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>카드는 한 줄에 하나씩 놓이고, xl(1280px)부터 두 장씩 나란히 놓입니다.</li>
                    <li>
                        <code>name</code>을 주면 고른 <code>value</code>가 그 이름으로 폼에 제출됩니다.
                    </li>
                    <li>
                        필수값이면 고르기 전까지 다음 버튼을 <code>disabled</code>로 둡니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-card-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-card-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이동하는 카드인지 값을 고르는 카드인지, 담는 내용이 얼마나 큰지로 나눕니다.
                    </p>
                </div>
                <Table
                    caption="RadioCard · OptionCard · RadioChip · SelectableCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-card-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-card-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        라디오 동작은 컴포넌트가 처리합니다. 그룹 이름과 안에 넣는 마크업은 사용처 몫입니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        Radix RadioGroup 이 <code>role=&quot;radio&quot;</code>, 선택 상태 전달, 화살표 키 이동, 묶음 안
                        Tab 한 번을 처리합니다[6.1.1].
                    </li>
                    <li>
                        묶음에 <code>aria-labelledby</code> 또는 <code>aria-label</code>로 이름을 붙입니다[7.4.1].
                    </li>
                    <li>
                        카드는 <code>button</code>으로 렌더링되므로 <code>title</code> · <code>description</code>에{' '}
                        <code>p</code> · <code>div</code>를 넣지 않고 <code>span</code> · <code>br</code>을 씁니다
                        [8.1.1].
                    </li>
                    <li>
                        선택은 테두리 두께가 아니라 색과 면으로 표시하고, 호버와 같은 강조를 씁니다. 장식용 일러스트에는
                        빈 <code>alt</code>를 줍니다[5.1.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-card-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-card-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        표에 없는 속성은 Radix RadioGroup 의 Root · Item 으로 그대로 전달됩니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RadioCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadioCardGuidePage
