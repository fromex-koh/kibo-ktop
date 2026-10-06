// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {StepHeader, StepHeaderCompact} from '@/components/composite/step-header'
import {SELF_DIAGNOSIS_STEPS} from '@/constants/technology-evaluation'

export const metadata: Metadata = {title: '스텝 헤더 (StepHeader)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {StepHeader} from '@/components/composite/step-header'

const STEPS = [
  '고객 정보 활용 동의',
  '기업·기술정보 입력',
  '체크리스트 입력',
  '제출 완료',
]

<StepHeader
  title="고객 정보 활용 동의"
  steps={STEPS}
  current={1}
  description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해 주세요."
/>`

const STEP_CASES = [
    {
        current: 1,
        title: '고객 정보 활용 동의',
        description: '자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해 주세요.',
    },
    {current: 2, title: '기업·기술정보 입력', description: '평가에 필요한 기업 및 기술 정보를 입력해 주세요.'},
    {
        current: 3,
        title: '체크리스트 입력',
        description: '평가 항목별 체크리스트를 작성해 주세요. 해당사항에 맞게 선택해 주십시오.',
    },
    {current: 4, title: '제출 완료', description: '자가진단 제출이 완료되었습니다.'},
] as const

const COMPACT_CODE = `import {StepHeaderCompact} from '@/components/composite/step-header'

<StepHeaderCompact
  title="기업·기술정보 입력"
  steps={STEPS}
  current={2}
/>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'step-header',
        cells: [
            '단계형 화면의 단계 제목 + 진행바',
            <code key="c">StepHeader</code>,
            'h2 제목, 설명, 진행바를 한 묶음으로 제공합니다. 화면 제목(h1) 아래에 둡니다.',
        ],
    },
    {
        key: 'compact',
        cells: [
            '좁은 화면 상단에 고정되는 단계 표시',
            <code key="c">StepHeaderCompact</code>,
            '현재/전체 수와 제목만 보여 줍니다. h1 이므로 같은 폭에서 PageTitleBar 를 감추는 화면에서만 씁니다.',
        ],
    },
    {
        key: 'progress',
        cells: [
            '진행바만 필요',
            <Link key="c" href="/component-guide/step-progress" className={LINK_CLASS}>
                StepProgress
            </Link>,
            'StepHeader 가 내부에서 쓰는 진행바입니다. 제목 · 설명이 따로 있을 때 단독으로 씁니다.',
        ],
    },
    {
        key: 'section-header',
        cells: [
            '단계 구분이 없는 섹션 제목',
            <Link key="c" href="/component-guide/section-header" className={LINK_CLASS}>
                SectionHeader
            </Link>,
            '진행 상태가 없는 일반 섹션에는 SectionHeader 를 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['StepHeader', 'title', '단계 제목입니다. h2 로 렌더링됩니다.', '-', 'ReactNode'],
    ['StepHeader', 'steps', '전체 단계 제목 목록입니다.', '-', 'readonly string[]'],
    ['StepHeader', 'current', '현재 단계 번호입니다(1부터).', '-', 'number'],
    ['StepHeader', 'description', '제목 아래 설명입니다.', '-', 'ReactNode'],
    ['StepHeader', 'header 속성', 'className 등 header 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'header'>"],
    ['StepHeaderCompact', 'title', '단계 제목입니다. h1 으로 렌더링됩니다.', '-', 'ReactNode'],
    ['StepHeaderCompact', 'steps', '전체 단계 제목 목록입니다.', '-', 'readonly string[]'],
    ['StepHeaderCompact', 'current', '현재 단계 번호입니다(1부터).', '-', 'number'],
    [
        'StepHeaderCompact',
        'header 속성',
        'className 등 header 속성을 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'header'>",
    ],
] as const

const StepHeaderGuidePage = () => (
    <GuidePageShell
        title="스텝 헤더 (StepHeader)"
        description="다단계 화면의 단계 제목·설명과 진행바를 한 묶음으로 보여 주는 헤더입니다."
    >
        <BaseCard>
            <section aria-labelledby="sth-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sth-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>steps</code> 에 전체 단계 제목을, <code>current</code> 에 현재 단계 번호(1부터)를
                        넘깁니다. 진행바는 xl 미만에서 제목 아래에, xl 부터 제목 오른쪽에 놓입니다.
                    </p>
                </div>
                <div className="bg-background border-subtle-3 flex flex-col gap-8 rounded-md border p-6">
                    <StepHeader
                        title="고객 정보 활용 동의"
                        steps={SELF_DIAGNOSIS_STEPS}
                        current={1}
                        description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해 주세요."
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sth-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sth-variants" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">진행 단계</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>current</code> 에 따라 진행바와 현재 · 다음 단계 제목이 바뀝니다. 마지막 단계에서는
                            다음 단계 제목이 나오지 않습니다.
                        </p>
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
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">축약형</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>StepHeaderCompact</code> 는 진행바와 설명 없이 현재/전체 단계 수와 제목만 보여 줍니다.{' '}
                            <code>description</code> 은 받지 않습니다.
                        </p>
                        <div className="bg-background border-subtle-3 flex flex-col gap-8 rounded-md border p-6">
                            <StepHeaderCompact title="기업·기술정보 입력" steps={SELF_DIAGNOSIS_STEPS} current={2} />
                        </div>
                        <CodeBlock code={COMPACT_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sth-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sth-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">화면 폭과 진행바 필요 여부로 고릅니다.</p>
                </div>
                <Table
                    caption="StepHeader · StepProgress · SectionHeader 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sth-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sth-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>header</code> 안에 제목이 <code>h2</code> 로 렌더링됩니다. 화면 제목(h1) 아래에 두어 헤딩
                        레벨을 건너뛰지 않습니다[6.4.2].
                    </li>
                    <li>
                        <code>StepHeaderCompact</code> 는 제목이 <code>h1</code> 입니다. 같은 화면에 다른 h1 이 보이지
                        않을 때만 씁니다[6.4.2].
                    </li>
                    <li>
                        진행바는 <code>role=&quot;progressbar&quot;</code> 로 &quot;4단계 중 1단계 · 단계 제목&quot;처럼
                        읽히고, 현재 단계는 숫자로도 표시해 색에만 의존하지 않습니다[5.3.1][8.2.1].
                    </li>
                    <li>
                        <code>steps</code> 의 제목은 서로 겹치지 않게 넘깁니다(목록의 key 로도 쓰입니다).
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sth-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sth-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="StepHeader Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepHeaderGuidePage
