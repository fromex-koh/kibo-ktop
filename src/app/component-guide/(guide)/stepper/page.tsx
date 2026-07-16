import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {Step, Stepper, type StepState} from '@/components/composite/stepper'

export const metadata: Metadata = {title: '스테퍼 (Stepper)'}

const USAGE_CODE = `{/* count(전체 단계) · current(현재 단계, 1부터) 로 상태 자동 계산 */}
<Stepper count={5} current={2} />

{/* 개별 원을 직접 조합할 수도 있다 */}
<Step state="completion">1</Step>`

// 상태 케이스 — [state, 라벨, 설명]
const STATES: {state: StepState; label: string; desc: string}[] = [
    {state: 'completion', label: '완료 (completion)', desc: '지나온 단계. 흰 배경 + grape 테두리·숫자.'},
    {state: 'ongoing', label: '진행중 (ongoing)', desc: '현재 단계. grape 채움 + 흰 숫자.'},
    {state: 'before', label: '예정 (before)', desc: '남은 단계. 흰 배경 + 회색 테두리·숫자.'},
]

const PROPS_ITEMS = [
    ['Stepper.count', '전체 단계 수.', 'number'],
    ['Stepper.current', '현재 진행 단계(1부터). 앞=완료·같음=진행중·뒤=예정으로 자동 계산.', 'number'],
    ['Step.state', '개별 원 상태(직접 조합 시).', "'completion' | 'ongoing' | 'before'"],
] as const

// 스테퍼 — 단계 인디케이터(custom, shadcn 프리미티브 없음). count·current 로 상태를 자동 계산한다.
const StepperGuidePage = () => (
    <GuidePageShell
        title="스테퍼 (Stepper)"
        description="다단계 흐름의 진행 상황을 번호 원으로 보여주는 인디케이터입니다. 완료·진행중·예정 세 상태로 구분합니다."
    >
        <section aria-labelledby="stepper-state" className="flex flex-col gap-4">
            <div>
                <h2 id="stepper-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">단계 원 하나의 세 가지 상태입니다.</p>
            </div>
            <BaseCard>
                <div className="flex flex-wrap gap-10">
                    {STATES.map(({state, label, desc}) => (
                        <div key={state} className="flex flex-col items-center gap-2 text-center">
                            <Step state={state}>1</Step>
                            <span className="typo-body-l-medium text-foreground font-mono">{label}</span>
                            <span className="typo-caption-regular text-muted-foreground max-w-40">{desc}</span>
                        </div>
                    ))}
                </div>
            </BaseCard>
        </section>

        <section aria-labelledby="stepper-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="stepper-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">count</code>·<code className="font-mono">current</code> 로 상태를 자동
                    계산합니다. 아래는 5단계에서 현재 단계를 1·3·5로 둔 예시입니다.
                </p>
            </div>
            <BaseCard>
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
            </BaseCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="stepper-props" className="flex flex-col gap-4">
            <div>
                <h2 id="stepper-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Stepper·Step 에 넘기는 속성입니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default StepperGuidePage
