import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {Step, Stepper, type StepState} from '@/components/composite/stepper'

export const metadata: Metadata = {title: '스테퍼 (Stepper)'}

const USAGE_CODE = `{/* count(전체 단계) · current(현재 단계, 1부터) 로 상태 자동 계산 */}
<Stepper
  count={5}
  current={2}
  aria-label="5단계 중 2단계 진행"
/>

{/* 개별 원을 직접 조합할 수도 있다 */}
<Step state="ongoing" aria-current="step">2</Step>`

// 상태 케이스 — [state, 라벨, 설명]
const STATES: {state: StepState; label: string; desc: string}[] = [
    {
        state: 'completion',
        label: '완료 (completion)',
        desc: 'bg-surface + stepper-accent(grape.900) 테두리·숫자.',
    },
    {
        state: 'ongoing',
        label: '진행중 (ongoing)',
        desc: 'stepper-accent(grape.900) 채움 + primary-foreground 숫자·하단 표식.',
    },
    {
        state: 'before',
        label: '예정 (before)',
        desc: 'bg-surface + stepper-inactive(gray.200) 테두리·숫자.',
    },
]

type PropItem = {
    component: 'Stepper' | 'Step'
    name: string
    type: string
    defaultValue: string
    required: boolean
    description: string
    rowSpan?: number
}

const PROPS_ITEMS: readonly PropItem[] = [
    {
        component: 'Stepper',
        rowSpan: 4,
        name: 'count',
        type: 'number',
        defaultValue: '-',
        required: true,
        description: '전체 단계 수. 해당 개수만큼 ol 내부에 li를 생성합니다.',
    },
    {
        component: 'Stepper',
        name: 'current',
        type: 'number',
        defaultValue: '-',
        required: true,
        description: '현재 진행 단계(1부터). 앞=완료·같음=진행중·뒤=예정으로 자동 계산합니다.',
    },
    {
        component: 'Stepper',
        name: 'className',
        type: 'string',
        defaultValue: '-',
        required: false,
        description: 'Stepper의 ol에 추가할 클래스입니다.',
    },
    {
        component: 'Stepper',
        name: 'ol props',
        type: "Omit<ComponentPropsWithoutRef<'ol'>, 'children'>",
        defaultValue: '-',
        required: false,
        description: 'aria-label 등 네이티브 ol 속성을 전달합니다.',
    },
    {
        component: 'Step',
        rowSpan: 4,
        name: 'state',
        type: "'completion' | 'ongoing' | 'before'",
        defaultValue: "'before'",
        required: false,
        description: '개별 단계의 시각·스크린리더 상태입니다.',
    },
    {
        component: 'Step',
        name: 'children',
        type: 'ReactNode',
        defaultValue: '-',
        required: true,
        description: '단계 원 내부에 표시할 번호 또는 내용입니다.',
    },
    {
        component: 'Step',
        name: 'className',
        type: 'string',
        defaultValue: '-',
        required: false,
        description: '개별 Step의 바깥 span에 추가할 클래스입니다.',
    },
    {
        component: 'Step',
        name: 'span props',
        type: "Omit<ComponentPropsWithoutRef<'span'>, 'children'>",
        defaultValue: '-',
        required: false,
        description: 'aria-current 등 네이티브 span 속성을 전달합니다.',
    },
]

// 스테퍼 — 단계 인디케이터(custom, shadcn 프리미티브 없음). count·current 로 상태를 자동 계산한다.
const StepperGuidePage = () => (
    <GuidePageShell
        title="스테퍼 (Stepper)"
        description="다단계 흐름의 진행 상황을 번호 원으로 보여주는 인디케이터입니다. 완료·진행중·예정 세 상태로 구분합니다."
    >
        <BaseCard>
            <section aria-labelledby="stepper-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="stepper-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">단계 원 하나의 세 가지 상태입니다.</p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <div className="flex flex-wrap gap-10">
                        {STATES.map(({state, label, desc}) => (
                            <div key={state} className="flex flex-col items-center gap-2 text-center">
                                <Step state={state} aria-current={state === 'ongoing' ? 'step' : undefined}>
                                    1
                                </Step>
                                <span className="typo-body-l-medium text-foreground font-mono">{label}</span>
                                <span className="typo-caption-regular text-muted-foreground max-w-40">{desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="stepper-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="stepper-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">count</code>·<code className="font-mono">current</code> 로 상태를
                        자동 계산합니다. 아래는 5단계에서 현재 단계를 1·3·5로 둔 예시입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <div className="flex flex-col gap-6">
                        {[1, 3, 5].map((current) => (
                            <div key={current} className="flex items-center gap-4">
                                <span className="typo-caption-regular text-muted-foreground w-24 shrink-0">
                                    current={current}
                                </span>
                                <Stepper count={5} current={current} aria-label={`5단계 중 ${current}단계 진행`} />
                            </div>
                        ))}
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="stepper-accessibility" className="flex flex-col gap-4">
                <div>
                    <h2 id="stepper-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Stepper는 순서 있는 목록으로 단계를 전달하고 현재 단계와 상태를 보조 기술에 함께 제공합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                    <li>
                        <code>Stepper</code>는 <code>ol &gt; li</code> 구조로 렌더링되며, 사용처에서 흐름을 설명하는{' '}
                        <code>aria-label</code>을 전달합니다.
                    </li>
                    <li>
                        <code>current</code>와 같은 단계에는 <code>aria-current=&quot;step&quot;</code>이 자동
                        적용됩니다.
                    </li>
                    <li>각 Step은 완료·진행 중·예정 상태를 화면 낭독기용 텍스트로 번호 앞에 제공합니다.</li>
                    <li>진행 중 단계 아래의 삼각형 SVG는 장식이므로 접근성 트리에서 제외됩니다.</li>
                    <li>
                        <code>Step</code>을 단독 사용하면 진행 중 상태에 <code>aria-current=&quot;step&quot;</code>을
                        직접 전달합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="stepper-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="stepper-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Stepper·Step 에 넘기는 속성입니다.</p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Stepper와 Step Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Component
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Type
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(
                                ({component, name, type, defaultValue, required, description, rowSpan}) => (
                                    <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                                        {rowSpan ? (
                                            <th
                                                scope="rowgroup"
                                                rowSpan={rowSpan}
                                                className="typo-body-l-medium border-border border-r px-4 py-3 text-left align-top font-mono"
                                            >
                                                {component}
                                            </th>
                                        ) : null}
                                        <th
                                            scope="row"
                                            className="typo-body-l-regular text-primary px-4 py-3 text-left font-mono"
                                        >
                                            {name}
                                            {required ? (
                                                <>
                                                    <span aria-hidden="true" className="text-destructive">
                                                        *
                                                    </span>
                                                    <span className="sr-only"> (필수)</span>
                                                </>
                                            ) : null}
                                        </th>
                                        <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                            {type}
                                        </td>
                                        <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                            {defaultValue}
                                        </td>
                                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                            {description}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepperGuidePage
