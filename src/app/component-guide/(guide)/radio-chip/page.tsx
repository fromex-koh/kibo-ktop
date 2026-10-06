// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {RadioChipDemo} from './radio-chip-demo'

export const metadata: Metadata = {title: '라디오 칩 (RadioChip)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {RadioChip, RadioChipGroup} from '@/components/composite/radio-chip'

const [task, setTask] = useState('')

<h2 id="next-tasks-title" className="typo-title-l-bold">진행할 업무 선택</h2>

<RadioChipGroup
  name="nextTask"
  value={task}
  onValueChange={setTask}
  required
  aria-labelledby="next-tasks-title"
>
  {tasks.map((item) => (
    <RadioChip
      key={item.value}
      value={item.value}
      title={item.title}
      description={item.description.map((sentence) => (
        <span key={sentence} className="block">{sentence}</span>
      ))}
    />
  ))}
</RadioChipGroup>`

const PROPS_ITEMS = [
    [
        'RadioChipGroup',
        'value · defaultValue · onValueChange',
        '고른 값과 변경 콜백입니다(제어 · 비제어).',
        '-',
        'string · (value: string) => void',
    ],
    ['RadioChipGroup', 'name · required', '폼 제출에 쓰는 이름과 필수 여부입니다.', '-', 'string · boolean'],
    ['RadioChipGroup', 'disabled', '묶음 전체를 비활성으로 만듭니다.', '-', 'boolean'],
    [
        'RadioChipGroup',
        'aria-labelledby · aria-label',
        '묶음의 이름입니다. 화면에 구획 제목이 있으면 그 id 를 잇습니다.',
        '-',
        'string',
    ],
    ['RadioChipGroup', 'className', '묶음에 추가할 클래스입니다.', '-', 'string'],
    ['RadioChip', 'value', '이 칩이 가진 값입니다. 필수입니다.', '-', 'string'],
    ['RadioChip', 'title', '칩 제목입니다. 필수이며 라디오의 이름이 됩니다.', '-', 'ReactNode'],
    ['RadioChip', 'description', '제목 아래 설명입니다. 줄바꿈이 필요하면 요소로 넘깁니다.', '-', 'ReactNode'],
    ['RadioChip', 'disabled', '이 칩만 비활성으로 만듭니다.', '-', 'boolean'],
    ['RadioChip', 'className', '칩에 추가할 클래스입니다.', '-', 'string'],
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'radio-chip',
        cells: [
            '제목 + 설명 한두 줄 중 하나를 골라 값으로 제출',
            <code key="component">RadioChip</code>,
            '글만 담는 낮은 라디오 상자입니다. 배지 · 일러스트가 없습니다.',
        ],
    },
    {
        key: 'chip',
        cells: [
            '한 줄짜리 값 하나를 고르는 작은 칩',
            <Link key="component" href="/component-guide/chip" className={LINK_CLASS}>
                Chip
            </Link>,
            'ChipRadio · ChipCheckbox 등 작은 선택 칩입니다.',
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

const RadioChipGuidePage = () => (
    <GuidePageShell
        title="라디오 칩 (RadioChip)"
        description="제목과 설명을 가운데 정렬로 담은 상자 중 하나를 고르는 입력입니다."
    >
        <BaseCard>
            <section aria-labelledby="radio-chip-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-chip-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>RadioChipGroup</code> 안에 <code>RadioChip</code>을 넣고, 칩마다 <code>value</code>와{' '}
                        <code>title</code>을 줍니다. 묶음에는 <code>aria-labelledby</code> 또는 <code>aria-label</code>
                        로 이름을 붙입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 id="radio-chip-usage-label" className="typo-title-m-bold text-foreground">
                        진행할 업무 선택
                    </h3>
                    <RadioChipDemo labelledBy="radio-chip-usage-label" />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        칩은 한 줄에 하나씩 놓이고, md(768px)부터 두 개씩 나란히 놓입니다. 나란한 칩은 설명이 가장 긴
                        칩의 높이에 맞춰집니다.
                    </li>
                    <li>
                        <code>name</code>을 주면 고른 <code>value</code>가 그 이름으로 폼에 제출됩니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-choose" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-chip-choose" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        하나만 고르는 선택지는 담는 내용에 따라 나눠 씁니다.
                    </p>
                </div>
                <Table
                    caption="RadioChip · Chip · RadioCard · SelectableCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-chip-accessibility" className="typo-h4-bold">
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
                        칩은 <code>button</code>으로 렌더링되므로 <code>title</code> · <code>description</code>에{' '}
                        <code>p</code> · <code>div</code>를 넣지 않고 <code>span</code>을 씁니다[8.1.1].
                    </li>
                    <li>선택은 테두리 색 · 면 · 제목 굵기로 함께 표시해 색에만 의존하지 않습니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-chip-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        표에 없는 속성은 Radix RadioGroup 의 Root · Item 으로 그대로 전달됩니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RadioChip Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadioChipGuidePage
