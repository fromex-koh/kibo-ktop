import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {RadioChipDemo} from './radio-chip-demo'

export const metadata: Metadata = {title: '라디오 칩 (RadioChip)'}

const USAGE_CODE = `const [task, setTask] = useState('')

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
        'value · onValueChange · name',
        '고른 값과 그 변경을 받습니다. name 을 주면 폼 제출에 그 이름으로 실립니다.',
        '—',
        'RadioGroup props',
    ],
    [
        'RadioChipGroup',
        'aria-labelledby · aria-label',
        '무엇을 고르는 묶음인지 이름을 줍니다. 화면에 구획 제목이 있으면 그 id 를 잇습니다.',
        '—',
        'string',
    ],
    ['RadioChip', 'value', '이 칩이 가진 값입니다.', '—', 'string'],
    ['RadioChip', 'title', '칩 제목입니다. 라디오의 접근 이름이 됩니다.', '—', 'ReactNode'],
    [
        'RadioChip',
        'description',
        '제목 아래 설명입니다. 문장별 줄바꿈이 필요하면 ReactNode로 전달합니다.',
        'undefined',
        'ReactNode',
    ],
    ['RadioChip', 'disabled · className', '비활성 여부와 추가 클래스입니다.', 'undefined', 'RadioGroupItem props'],
] as const

const RadioChipGuidePage = () => (
    <GuidePageShell
        title="라디오 칩 (RadioChip)"
        description="제목과 설명을 가운데 정렬로 담은 낮은 선택 상자입니다. 하나만 고를 수 있고, 고른 칩만 파란 테두리와 파란 글자로 남습니다."
    >
        <BaseCard>
            <section aria-labelledby="radio-chip-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="radio-chip-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p id="radio-chip-preview-hint" className="typo-body-l-regular text-muted-foreground">
                        일괄평가 화면의 &quot;진행할 업무 선택&quot; 구성입니다. 화살표 키로도 옮겨 고를 수 있습니다.
                    </p>
                </div>
                <RadioChipDemo labelledBy="radio-chip-preview-hint" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="radio-chip-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        칩 높이는 고정값이 아니라 묶음이 맞추므로, 설명이 여러 줄인 칩이 나란한 칩의 높이를 정합니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="radio-chip-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        나머지 속성은 Radix RadioGroup 의 Root · Item 으로 그대로 전달됩니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RadioChip Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-choose" className="flex flex-col gap-3">
                <h2 id="radio-chip-choose" className="typo-h4-bold">
                    어떤 컴포넌트를 쓸까
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>
                        <strong className="text-foreground">RadioChip</strong> — 제목 + 설명 한두 줄이 붙는 큰 선택지.
                        글만 놓이고 높이가 낮습니다.
                    </li>
                    <li>
                        <strong className="text-foreground">Chip(ChipRadio)</strong> — 한 줄짜리 값 하나를 고르는 작은
                        칩입니다.
                    </li>
                    <li>
                        <strong className="text-foreground">RadioCard</strong> — 배지·일러스트까지 담는 큰 카드입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-chip-accessibility" className="flex flex-col gap-3">
                <h2 id="radio-chip-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>
                        하나만 고르는 묶음이라 Radix RadioGroup 을 씁니다 — 화살표 키 이동, 그룹 안에서 탭 한 번, 선택
                        상태 전달을 모두 담당합니다([6.1.1] · [8.2.1]).
                    </li>
                    <li>묶음에는 이름이 필요합니다 — 구획 제목의 id 를 aria-labelledby 로 잇습니다([7.4.1]).</li>
                    <li>선택은 색만으로 구분되지 않습니다 — 테두리와 제목 굵기가 함께 바뀝니다([5.3.1]).</li>
                    <li>
                        칩 안은 모두 <code className="font-mono">span</code> 입니다 — 칩이{' '}
                        <code className="font-mono">button</code> 이라 그 안에 <code className="font-mono">p</code>·
                        <code className="font-mono">div</code> 를 넣을 수 없습니다([8.1.1]).
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadioChipGuidePage
