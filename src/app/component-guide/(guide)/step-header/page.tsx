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

{/* 같은 1단계 내용을 두 시안으로 비교한다 — 우측 진행 표시만 다르다. */}
<StepHeader
  variant="stepper"
  title="고객 정보 활용 동의"
  steps={STEPS}
  current={1}
  description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
/>

<StepHeader
  variant="progress"
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

const VARIANT_COLUMNS = [
    {key: 'variant', header: 'variant', align: 'start', rowHeader: true},
    {key: 'indicator', header: '우측 진행 표시', align: 'start', wrap: true},
    {key: 'source', header: 'Figma', align: 'start'},
] as const

const VARIANT_ROWS = [
    {
        key: 'stepper',
        cells: [
            <span key="k" className="text-primary font-mono">
                stepper
            </span>,
            '제목 옆에 번호 원(Stepper), 우측 상단에 다음 단계 라벨. 기본값입니다.',
            '1depth',
        ],
    },
    {
        key: 'progress',
        cells: [
            <span key="k" className="text-primary font-mono">
                progress
            </span>,
            '우측에 진행바(StepProgress). 현재/전체·현재 단계·다음 단계가 진행바 안에 함께 표시되어 별도 라벨을 두지 않습니다.',
            '타이틀 + step',
        ],
    },
]

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
            '단계 제목 목록. 전체 단계 수는 이 배열 길이를 단일 소스로 씁니다. stepper 는 길이만, progress 는 현재·다음 단계 제목까지 사용합니다.',
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
        key: 'variant',
        cells: [
            <span key="k" className="text-primary font-mono">
                variant
            </span>,
            '우측 진행 표시 형태. 시안이 확정되면 한쪽만 남깁니다.',
            <span key="t" className="font-mono">
                &apos;stepper&apos; | &apos;progress&apos;
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
        key: 'nextLabel',
        cells: [
            <span key="k" className="text-primary font-mono">
                nextLabel
            </span>,
            'stepper 의 우측 다음 단계 라벨(선택). 기본은 steps[current] 이고, "2단계. …"처럼 접두어가 붙은 화면 문구를 그대로 쓰고 싶을 때만 넘깁니다. progress 는 무시합니다.',
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

// 스텝 헤더 — 제목·설명은 두 시안이 같고 우측 진행 표시만 다르다. 확정 전까지 variant 로 함께 유지한다.
const StepHeaderGuidePage = () => (
    <GuidePageShell
        title="스텝 헤더 (StepHeader)"
        description="다단계(마법사) 플로우 한 단계의 최상단 헤더입니다. 단계 제목·설명과 진행 표시를 한 묶음으로 제공하며, 진행 표시는 번호 원(stepper)과 진행바(progress) 두 시안을 함께 지원합니다."
    >
        <BaseCard>
            <section aria-labelledby="sh-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">steps</code> 배열과 <code className="font-mono">current</code> 로
                        전체 단계 수·현재 위치·다음 단계가 모두 정해집니다. 아래는 같은 1단계 내용을{' '}
                        <code className="font-mono">variant</code> 만 바꿔 비교한 예시입니다.
                    </p>
                </div>
                <div className="bg-background border-subtle-3 flex flex-col gap-8 rounded-md border p-6">
                    {/* 같은 1단계(Figma "타이틀 + step" 1단계 영역) 내용을 두 시안으로 나란히 비교한다. */}
                    <StepHeader
                        variant="stepper"
                        title="고객 정보 활용 동의"
                        steps={SELF_DIAGNOSIS_STEPS}
                        current={1}
                        description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
                    />
                    <StepHeader
                        variant="progress"
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
            <section aria-labelledby="sh-variant" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-variant" className="typo-h4-bold">
                        Variant
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목·설명·데이터 계약은 두 시안이 같고 우측 진행 표시만 다릅니다. 확정되면 한쪽 분기와 해당
                        인디케이터 컴포넌트(<code className="font-mono">Stepper</code> 또는{' '}
                        <code className="font-mono">StepProgress</code>)를 함께 정리합니다.
                    </p>
                </div>
                <Table size="md" caption="StepHeader variant 비교" columns={VARIANT_COLUMNS} rows={VARIANT_ROWS} />
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
                        단계는 다음 단계가 없어 우측 라벨(stepper)과 다음 단계 문구(progress)가 사라집니다. 제목·설명은
                        Figma 자가진단 화면 헤더 문구입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-body-l-medium text-foreground font-mono">variant=&quot;stepper&quot;</h3>
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
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-body-l-medium text-foreground font-mono">variant=&quot;progress&quot;</h3>
                        <div className="bg-background border-subtle-3 flex flex-col gap-8 rounded-md border p-6">
                            {STEP_CASES.map((step) => (
                                <StepHeader
                                    key={step.current}
                                    variant="progress"
                                    title={step.title}
                                    steps={SELF_DIAGNOSIS_STEPS}
                                    current={step.current}
                                    description={step.description}
                                />
                            ))}
                        </div>
                    </div>
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
