// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import {ProcessFlow, type ProcessFlowStep} from '@/components/custom/process-flow'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '프로세스 흐름도 (ProcessFlow)'}

// 특허평가 결과 보고서(인쇄용) 참고자료 쪽과 같은 단계다.
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

const DATA_CODE = `// [프론트엔드 연동] 단계를 더하거나 빼면 원과 화살표가 그만큼 따라갑니다.
// label 의 줄바꿈(\\n)은 그대로 여러 줄로 섭니다 — 원 안에서 글자를 끊을 자리를 직접 정합니다.
<ProcessFlow ariaLabel={\`\${title} — \${flow.description}\`} steps={flow.steps} />`

const SHAPE_RULES = [
    '단계는 지름 160 원이고 글자는 18 Bold 흰색입니다. 원 사이에는 24 화살표를 두고 좌우로 24 씩 띄웁니다.',
    '색은 blue.900 → 800 → 700 → 600 → 500 으로 앞 단계일수록 진합니다. 여섯 번째부터는 마지막 색(blue.500)을 이어 씁니다.',
    '색은 순서를 거드는 장식입니다 — 순서 자체는 글과 화살표가 전합니다[5.3.1].',
    '목록(ol)으로 그려 단계 수와 순서가 화면 낭독기에도 전해집니다. 화살표는 장식이라 읽지 않습니다.',
    '전체 이름(ariaLabel)은 무엇의 순서인지 알립니다 — 흐름도가 둘 이상이면 서로 다른 이름을 줍니다.',
] as const

const PROPS_ITEMS = [
    ['ProcessFlow', 'steps', '단계 목록입니다. 넣은 순서대로 원이 서고 화살표가 이어집니다.', '-', 'ProcessFlowStep[]'],
    ['ProcessFlow', 'ariaLabel', '흐름도 전체의 이름입니다.', '-', 'string'],
    ['ProcessFlowStep', 'label', '단계 이름입니다. 줄바꿈(\\n)이 그대로 여러 줄로 섭니다.', '-', 'string'],
    ['ProcessFlowStep', 'id', '단계 식별자입니다.', '-', 'string'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; steps: ProcessFlowStep[]}[] = [
    {
        title: '단계가 셋일 때',
        description: '색은 앞에서부터 차례로 쓰므로 진한 쪽 세 가지가 나옵니다.',
        steps: REPORT_STEPS.slice(0, 3),
    },
    {
        title: '단계가 여섯을 넘을 때',
        description: '여섯 번째부터는 마지막 색(blue.500)을 이어 씁니다 — 색이 모자라 순서가 끊기지 않습니다.',
        steps: [...REPORT_STEPS, {id: 'extra-1', label: '추가 단계\n여섯'}, {id: 'extra-2', label: '추가 단계\n일곱'}],
    },
    {
        title: '세 줄짜리 이름',
        description: '원 크기는 그대로고 글자만 여러 줄로 섭니다.',
        steps: [
            {id: 'a', label: '투입변수를\n특허평가모형에\n적용'},
            {id: 'b', label: '평가등급\n산출'},
        ],
    },
] as const

const ProcessFlowGuidePage = () => (
    <GuidePageShell
        title="프로세스 흐름도 (ProcessFlow)"
        description="둥근 단계 여럿을 화살표로 이어 순서를 보여 줍니다. 앞 단계일수록 진한 파랑입니다."
    >
        <BaseCard>
            <section aria-labelledby="pf-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="pf-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        특허평가 결과 보고서(인쇄용) 참고자료 쪽의 특허평가프로세스입니다.
                    </p>
                </div>
                <div className="min-w-0 overflow-x-auto">
                    <ProcessFlow ariaLabel="특허평가프로세스 — 평가모형 구축 순서" steps={REPORT_STEPS} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="pf-shape" className="typo-h4-bold">
                        모양 (Shape)
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                        {SHAPE_RULES.map((rule) => (
                            <li key={rule} className="flex">
                                <ListMarker type="unordered" />
                                <span className="min-w-0">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="pf-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        단계 수와 글자 줄 수가 달라지는 경우입니다.
                    </p>
                </div>
                <ul className="flex list-none flex-col gap-8">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <div className="min-w-0 overflow-x-auto">
                                <ProcessFlow ariaLabel={item.title} steps={item.steps} />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="pf-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">단계 목록을 그대로 넘깁니다.</p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ProcessFlow 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pf-props" className="flex flex-col gap-4">
                <h2 id="pf-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ProcessFlow 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ProcessFlowGuidePage
