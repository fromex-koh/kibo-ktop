import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {StepHeader} from '@/components/composite/step-header'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/self-diagnosis'

export const metadata: Metadata = {title: '스텝 헤더 (StepHeader)'}

const USAGE_CODE = `const STEPS = [
  '고객 정보 활용 동의',
  '기업·기술정보 입력',
  '체크리스트 입력',
  '제출 완료',
]

<StepHeader
  title="고객 정보 활용 동의"
  steps={STEPS}
  current={1}
  description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
/>`

// 단계별 케이스 — 제목·설명은 Figma 자가진단 화면 헤더 문구를 그대로 쓴다.
// (4단계 제출 완료 화면은 실제 데모에서 StepHeader를 사용하지 않아 안내용 문구를 넣었다.)
const STEP_CASES = [
    {
        current: 1,
        title: '고객 정보 활용 동의',
        description: '자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요.',
    },
    {current: 2, title: '기업·기술정보 입력', description: '평가에 필요한 기업 및 기술 정보를 입력해주세요.'},
    {
        current: 3,
        title: '체크리스트 입력',
        description: '평가 항목별 체크리스트를 작성해주세요. 해당사항에 맞게 선택해 주십시오.',
    },
    {current: 4, title: '제출 완료', description: '자가진단 제출이 완료되었습니다.'},
] as const

const PROPS_COLUMNS = [
    {key: 'name', header: 'Name', align: 'start', rowHeader: true},
    {key: 'description', header: 'Description', align: 'start', wrap: true},
    {key: 'type', header: 'Type', align: 'start'},
] as const

const PROPS_ROWS = [
    {
        key: 'title',
        cells: [
            <span key="k" className="text-primary font-mono">
                title
            </span>,
            '단계 제목. 화면 제목(PageTitleBar 등) 아래 오는 섹션 제목이라 h2 로 렌더됩니다. 크기는 시안대로 typo-h1-bold 입니다.',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'steps',
        cells: [
            <span key="k" className="text-primary font-mono">
                steps
            </span>,
            '단계 제목 목록. 전체 단계 수와 현재·다음 단계 제목은 이 배열을 단일 소스로 사용합니다.',
            <span key="t" className="font-mono">
                readonly string[]
            </span>,
        ],
    },
    {
        key: 'current',
        cells: [
            <span key="k" className="text-primary font-mono">
                current
            </span>,
            '현재 단계(1부터).',
            <span key="t" className="font-mono">
                number
            </span>,
        ],
    },
    {
        key: 'description',
        cells: [
            <span key="k" className="text-primary font-mono">
                description
            </span>,
            '제목 아래 보조 설명(선택).',
            <span key="t" className="font-mono">
                ReactNode
            </span>,
        ],
    },
    {
        key: 'className',
        cells: [
            <span key="k" className="text-primary font-mono">
                className
            </span>,
            '추가 클래스명으로 스타일 확장.',
            <span key="t" className="font-mono">
                string
            </span>,
        ],
    },
]

// 스텝 헤더 — 단계 제목·설명과 StepProgress를 한 묶음으로 제공한다.
const StepHeaderGuidePage = () => (
    <GuidePageShell
        title="스텝 헤더 (StepHeader)"
        description="다단계 플로우의 제목·설명과 진행바를 한 묶음으로 제공하는 단계 헤더입니다."
    >
        <BaseCard>
            <section aria-labelledby="sh-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">steps</code> 배열과 <code className="font-mono">current</code> 로
                        전체 단계 수·현재 위치·다음 단계가 모두 정해집니다.
                    </p>
                </div>
                <div className="bg-background border-subtle-3 flex flex-col gap-8 rounded-md border p-6">
                    <StepHeader
                        title="고객 정보 활용 동의"
                        steps={SELF_DIAGNOSIS_STEPS}
                        current={1}
                        description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-progress" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-progress" className="typo-h4-bold">
                        진행 단계
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">current</code> 에 따라 완료·진행중·예정이 자동 계산됩니다. 마지막
                        단계는 다음 단계가 없어 다음 단계 문구가 사라집니다. 제목·설명은 Figma 자가진단 화면 헤더
                        문구입니다.
                    </p>
                </div>
                <div className="bg-background border-subtle-3 flex flex-col gap-8 rounded-md border p-6">
                    {STEP_CASES.map((step) => (
                        <StepHeader
                            key={step.current}
                            title={step.title}
                            steps={SELF_DIAGNOSIS_STEPS}
                            current={step.current}
                            description={step.description}
                        />
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">StepHeader 에 넘기는 속성입니다.</p>
                </div>
                <Table size="md" caption="StepHeader Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepHeaderGuidePage
