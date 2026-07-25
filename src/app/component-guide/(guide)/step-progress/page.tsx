import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {StepProgress} from '@/components/composite/step-progress'

export const metadata: Metadata = {title: '스텝 진행바 (StepProgress)'}

const STEPS = ['고객 정보 활용 동의', '기업·기술정보 입력', '체크리스트 입력', '제출 전 최종 확인', '제출 완료']

const USAGE_CODE = `const STEPS = [
  '고객 정보 활용 동의',
  '기업·기술정보 입력',
  '체크리스트 입력',
  '제출 전 최종 확인',
  '제출 완료',
]

<StepProgress steps={STEPS} current={2} />`

const PROGRESS_COLUMNS = [
    {key: 'current', header: 'current', align: 'start', rowHeader: true},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

const PROGRESS_ROWS = STEPS.map((step, index) => ({
    key: step,
    cells: [
        <span key="current" className="text-primary font-mono">
            {index + 1}
        </span>,
        <StepProgress key="preview" steps={STEPS} current={index + 1} className="max-w-147" />,
    ],
}))

const PROPS_COLUMNS = [
    {key: 'name', header: 'Name', align: 'start', rowHeader: true},
    {key: 'description', header: 'Description', align: 'start', wrap: true},
    {key: 'type', header: 'Type', align: 'start'},
] as const

const PROPS_ROWS = [
    {
        key: 'steps',
        cells: [
            <span key="name" className="text-primary font-mono">
                steps
            </span>,
            '단계 제목 목록입니다. 전체 단계 수는 이 배열의 길이를 단일 소스로 사용하며, 현재 단계 다음 항목이 우측 미리보기 라벨이 됩니다.',
            <span key="type" className="font-mono">
                readonly string[]
            </span>,
        ],
    },
    {
        key: 'current',
        cells: [
            <span key="name" className="text-primary font-mono">
                current
            </span>,
            '현재 진행 단계(1부터). 범위를 벗어나면 처음·마지막 단계로 보정합니다.',
            <span key="type" className="font-mono">
                number
            </span>,
        ],
    },
    {
        key: 'className',
        cells: [
            <span key="name" className="text-primary font-mono">
                className
            </span>,
            '추가 클래스명으로 폭·여백을 확장합니다. 기본은 부모 폭을 가득 채웁니다.',
            <span key="type" className="font-mono">
                string
            </span>,
        ],
    },
]

// 스텝 진행바 — StepHeader(번호 원)와 같은 역할의 대안 시안. 시안 확정 전까지 둘을 나란히 둔다.
const StepProgressGuidePage = () => (
    <GuidePageShell
        title="스텝 진행바 (StepProgress)"
        description="다단계 흐름의 진행률을 한 줄 바로 보여주는 인디케이터입니다. 현재/전체 단계와 현재·다음 단계 제목을 함께 제공합니다."
    >
        <BaseCard>
            <section aria-labelledby="sp-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sp-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">steps</code> 배열과 <code className="font-mono">current</code> 만
                        넘기면 전체 단계 수·현재 제목·다음 제목·채움 비율이 모두 계산됩니다.
                    </p>
                </div>
                <StepProgress steps={STEPS} current={2} className="max-w-147" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sp-progress" className="flex flex-col gap-4">
                <div>
                    <h2 id="sp-progress" className="typo-h4-bold">
                        진행 단계
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        채움은 첫 단계에서 원형으로 시작해 마지막 단계에서 도착 링까지 이어집니다. 마지막 단계에는 다음
                        단계 미리보기가 표시되지 않습니다.
                    </p>
                </div>
                <Table
                    size="md"
                    caption="current 값별 스텝 진행바 미리보기"
                    columns={PROGRESS_COLUMNS}
                    rows={PROGRESS_ROWS}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sp-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="sp-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        트랙은 <code className="font-mono">role=&quot;progressbar&quot;</code> 로 현재 단계를 값으로
                        전달하고(<code className="font-mono">aria-valuenow</code>·
                        <code className="font-mono">aria-valuemax</code>),{' '}
                        <code className="font-mono">aria-valuetext</code> 에 &quot;5단계 중 2단계 · 기업·기술정보
                        입력&quot; 형태의 문장을 넣어 숫자만으로 읽히지 않게 합니다. 점·채움·노브는 장식이라{' '}
                        <code className="font-mono">aria-hidden</code> 입니다. 단계 제목은 화면에도 그대로 보이므로 색
                        외의 단서가 함께 제공됩니다[5.3.1].
                    </p>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sp-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sp-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">StepProgress 에서 사용하는 속성입니다.</p>
                </div>
                <Table size="md" caption="StepProgress Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepProgressGuidePage
