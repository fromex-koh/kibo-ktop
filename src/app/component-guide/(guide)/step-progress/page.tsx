// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {StepProgress} from '@/components/composite/step-progress'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '스텝 진행바 (StepProgress)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {StepProgress} from '@/components/composite/step-progress'

const STEPS = [
  '고객 정보 활용 동의',
  '기업·기술정보 입력',
  '체크리스트 입력',
  '제출 완료',
]

<StepProgress steps={STEPS} current={2} />`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'progress',
        cells: [
            '진행바만 필요',
            <code key="c">StepProgress</code>,
            '현재/전체 수, 현재 · 다음 단계 제목, 진행바를 한 줄 묶음으로 보여 줍니다.',
        ],
    },
    {
        key: 'header',
        cells: [
            '단계 제목 · 설명과 함께 표시',
            <Link key="c" href="/component-guide/step-header" className={LINK_CLASS}>
                StepHeader
            </Link>,
            'StepProgress 를 포함해 제목 · 설명 · 진행바 배치(xl 반응형)까지 처리합니다.',
        ],
    },
    {
        key: 'navigation',
        cells: [
            '단계 사이를 이동하는 버튼',
            <Link key="c" href="/component-guide/step-navigation" className={LINK_CLASS}>
                StepNavigation
            </Link>,
            '진행 상태 표시가 아니라 이전 · 다음 이동 버튼입니다.',
        ],
    },
] as const

const PROGRESS_COLUMNS = [
    {key: 'current', header: 'current', align: 'start', rowHeader: true},
    {key: 'preview', header: '미리보기', align: 'start'},
] as const

const PROGRESS_ROWS = SELF_DIAGNOSIS_STEPS.map((step, index) => ({
    key: step,
    cells: [
        <span key="current" className="text-primary font-mono">
            {index + 1}
        </span>,
        <StepProgress key="preview" steps={SELF_DIAGNOSIS_STEPS} current={index + 1} className="max-w-147" />,
    ],
}))

const PROPS_ITEMS = [
    ['StepProgress', 'steps', '단계 제목 목록입니다. 배열 길이가 전체 단계 수가 됩니다.', '-', 'readonly string[]'],
    [
        'StepProgress',
        'current',
        '현재 단계입니다(1부터). 범위를 벗어나면 첫 단계 또는 마지막 단계로 맞춥니다.',
        '-',
        'number',
    ],
    ['StepProgress', 'className', '폭·여백을 덧붙입니다. 기본은 부모 폭을 채웁니다.', '-', 'string'],
    ['StepProgress', 'div 속성', 'children 을 제외한 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
] as const

const StepProgressGuidePage = () => (
    <GuidePageShell
        title="스텝 진행바 (StepProgress)"
        description="다단계 흐름에서 현재 단계와 전체 단계 수, 현재·다음 단계 제목을 한 줄 바로 보여줍니다."
    >
        <BaseCard>
            <section aria-labelledby="sp-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sp-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>steps</code> 에 단계 제목 배열을, <code>current</code> 에 현재 단계 번호(1부터)를
                        넘깁니다. 전체 단계 수는 배열 길이입니다.
                    </p>
                </div>
                <StepProgress steps={SELF_DIAGNOSIS_STEPS} current={2} className="max-w-147" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sp-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sp-variants" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>current</code> 다음 항목의 제목이 오른쪽에 다음 단계로 표시됩니다. 마지막 단계에서는
                        표시되지 않습니다.
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
            <section aria-labelledby="sp-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sp-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="StepProgress · StepHeader · StepNavigation 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sp-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sp-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        바는 <code>role=&quot;progressbar&quot;</code>(<code>aria-valuemin</code> ·{' '}
                        <code>aria-valuemax</code> · <code>aria-valuenow</code>)로 렌더링되고, 스크린리더는 &quot;4단계
                        중 2단계 · 기업·기술정보 입력&quot; 형태로 읽습니다[8.2.1].
                    </li>
                    <li>바 안의 점 · 채움 · 체크 표시는 장식이라 스크린리더가 읽지 않습니다[5.1.1].</li>
                    <li>
                        현재 단계는 &quot;2 / 4&quot; 숫자와 제목 글자로도 전해 색에만 의존하지 않습니다[5.3.1]. 현재
                        번호는 대비를 위해 <code>text-primary-strong</code> 을 씁니다[5.3.3].
                    </li>
                    <li>
                        <code>steps</code> 의 제목은 서로 겹치지 않게 넘깁니다(목록의 key 로도 쓰입니다).
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sp-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sp-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="StepProgress Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepProgressGuidePage
