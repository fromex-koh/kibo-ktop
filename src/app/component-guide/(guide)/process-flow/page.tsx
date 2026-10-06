// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ProcessFlow, type ProcessFlowStep} from '@/components/custom/process-flow'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '프로세스 흐름도 (ProcessFlow)'}

const REPORT_STEPS: ProcessFlowStep[] = [
    {id: 'extract', label: '전체 국내특허\n평가지표추출'},
    {id: 'compose', label: '학습대상\n특허구성'},
    {id: 'train', label: '평가모형\n학습'},
    {id: 'validate', label: '평가모형\n검증'},
    {id: 'done', label: '특허평가모형\n완료'},
]

const USAGE_CODE = `import {ProcessFlow} from '@/components/custom/process-flow'

<ProcessFlow
  ariaLabel="특허평가프로세스 — 평가모형 구축 순서"
  steps={[
    {id: 'extract', label: '전체 국내특허\\n평가지표추출'},
    {id: 'compose', label: '학습대상\\n특허구성'},
    // …
  ]}
/>`

const SPECIAL_CASES: readonly {title: string; description: string; steps: ProcessFlowStep[]}[] = [
    {
        title: '단계가 셋일 때',
        description: '앞에서부터 진한 색 세 가지를 씁니다.',
        steps: REPORT_STEPS.slice(0, 3),
    },
    {
        title: '단계가 여섯을 넘을 때',
        description: '다섯 가지 색이 모자라면 마지막 색(blue.500)을 이어 씁니다.',
        steps: [...REPORT_STEPS, {id: 'extra-1', label: '추가 단계\n여섯'}, {id: 'extra-2', label: '추가 단계\n일곱'}],
    },
    {
        title: '세 줄짜리 이름',
        description: 'label 의 줄바꿈(\\n)대로 글자만 여러 줄로 서고 원 크기는 같습니다.',
        steps: [
            {id: 'a', label: '투입변수를\n특허평가모형에\n적용'},
            {id: 'b', label: '평가등급\n산출'},
        ],
    },
]

const PROPS_ITEMS = [
    ['ProcessFlow', 'steps', '단계 목록입니다. 넣은 순서대로 원이 서고 화살표가 이어집니다.', '-', 'ProcessFlowStep[]'],
    ['ProcessFlow', 'ariaLabel', '흐름도 전체의 이름입니다. 무엇의 순서인지 알립니다.', '-', 'string'],
    [
        'ProcessFlow',
        'className · ol props',
        '네이티브 ol 속성을 전달합니다. children 은 받지 않습니다.',
        'undefined',
        "ComponentPropsWithoutRef<'ol'>",
    ],
    ['ProcessFlowStep', 'id', '단계 식별자입니다. key 로 쓰이므로 고유해야 합니다.', '-', 'string'],
    ['ProcessFlowStep', 'label', '단계 이름입니다. 줄바꿈(\\n)이 그대로 여러 줄로 섭니다.', '-', 'string'],
] as const

const ProcessFlowGuidePage = () => (
    <GuidePageShell
        title="프로세스 흐름도 (ProcessFlow)"
        description="둥근 단계 여럿을 화살표로 이어 순서를 보여 줍니다. 앞 단계일수록 진한 파랑입니다."
    >
        <BaseCard>
            <section aria-labelledby="pf-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pf-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>steps</code> 배열 순서대로 원과 화살표가 이어집니다. 단계를 더하거나 빼도 코드는
                        그대로입니다. 인쇄용 보고서 참고자료 쪽에서 씁니다.
                    </p>
                </div>
                <div className="min-w-0 overflow-x-auto">
                    <ProcessFlow ariaLabel="특허평가프로세스 — 평가모형 구축 순서" steps={REPORT_STEPS} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pf-variants" className="typo-h4-bold">
                        단계 수와 글자 줄 수
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        단계는 지름이 고정된 원이고, 색은 blue.900 에서 blue.500 까지 다섯 단계로 바뀝니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    {SPECIAL_CASES.map((item) => (
                        <div key={item.title} className="flex min-w-0 flex-col gap-4 py-8 last:pb-0">
                            <h3 className="typo-title-m-bold text-foreground">{item.title}</h3>
                            <p className="typo-body-l-regular text-label-foreground">{item.description}</p>
                            <div className="min-w-0 overflow-x-auto">
                                <ProcessFlow ariaLabel={item.title} steps={item.steps} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pf-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용처는 <code>ariaLabel</code> 만 알맞게 넘기면 됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>ol</code> 목록으로 그려 단계 수와 순서가 스크린리더에 전해집니다. 첫 단계에는 &quot;n단계
                        중&quot; 안내가 붙고 화살표는 읽지 않습니다[8.2.1].
                    </li>
                    <li>색은 순서를 거드는 장식입니다. 순서는 글과 화살표로 전합니다[5.3.1].</li>
                    <li>
                        흐름도가 한 화면에 둘 이상이면 서로 다른 <code>ariaLabel</code> 을 줍니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pf-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>steps</code> 와 <code>ariaLabel</code> 이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ProcessFlow Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ProcessFlowGuidePage
