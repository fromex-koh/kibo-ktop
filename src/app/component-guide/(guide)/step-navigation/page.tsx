// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {StepNavigation} from '@/components/composite/step-navigation'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '스텝 내비게이션 (StepNavigation)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {StepNavigation} from '@/components/composite/step-navigation'

<StepNavigation
  appearance="plain"
  prev={{children: '이전', onClick: goPrev}}
  next={{children: '다음', onClick: goNext}}
/>

<StepNavigation next={{children: '다음', onClick: goNext}} />

<StepNavigation
  prev={{children: '메인으로 이동', onClick: goMain}}
  next={{children: '결과조회', onClick: goResult}}
/>`

// 데모 케이스 — [id, 제목, 설명, StepNavigation props]
const CASES = [
    {
        id: 'mid',
        title: '중간 단계 (plain)',
        desc: '페이지 배경 위에 이전·다음 버튼만 표시합니다.',
        appearance: 'plain',
        prev: {children: '이전'},
        next: {children: '다음'},
    },
    {
        id: 'first',
        title: '첫 단계 (이전 없음)',
        desc: 'prev 를 생략하면 다음 버튼 하나만 가운데에 남습니다.',
        appearance: 'bar',
        prev: undefined,
        next: {children: '다음'},
    },
    {
        id: 'last',
        title: '마지막 단계 (메인으로 이동 / 결과조회)',
        desc: '라벨만 바꿔 마무리 단계를 표현합니다.',
        appearance: 'bar',
        prev: {children: '메인으로 이동'},
        next: {children: '결과조회'},
    },
    {
        id: 'disabled',
        title: '다음 비활성 (입력 미완료)',
        desc: '검증이 끝나기 전에는 next 에 disabled 를 넘깁니다.',
        appearance: 'bar',
        prev: {children: '이전'},
        next: {children: '다음', disabled: true},
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'step-navigation',
        cells: [
            '단계형 화면 끝의 이전 · 다음',
            <code key="c">StepNavigation</code>,
            '본문 끝에 붙는 일반 블록입니다. bar · plain 외형과 md 미만 세로 쌓기를 제공합니다.',
        ],
    },
    {
        key: 'action-bar',
        cells: [
            '왼쪽 · 오른쪽에 나눈 일반 버튼 배치',
            <Link key="c" href="/component-guide/action-bar" className={LINK_CLASS}>
                ActionBar
            </Link>,
            '배경 · 여백 없이 정렬만 합니다. 목록/수정/저장처럼 구역을 나눌 때 씁니다.',
        ],
    },
    {
        key: 'step-progress',
        cells: [
            '현재 단계 표시',
            <Link key="c" href="/component-guide/step-progress" className={LINK_CLASS}>
                StepProgress
            </Link>,
            '이동 버튼이 아니라 진행 상태 표시입니다. 보통 StepHeader 안에서 함께 씁니다.',
        ],
    },
] as const

const APPEARANCE_COLUMNS = [
    {key: 'appearance', header: 'appearance', align: 'start', rowHeader: true},
    {key: 'surface', header: '배경', align: 'start', wrap: true},
    {key: 'spacing', header: '버튼 위·아래 여백', align: 'start'},
] as const

const APPEARANCE_ROWS = [
    {
        key: 'bar',
        cells: [<code key="appearance">bar</code>, '반투명 배경(bg-cta-surface)과 상단 구분선', 'py-6 (위 · 아래 24)'],
    },
    {
        key: 'plain',
        cells: [<code key="appearance">plain</code>, '투명(부모 화면의 배경)', 'pt-10 · pb-15 (위 40 · 아래 60)'],
    },
]

const PROPS_ITEMS = [
    [
        'StepNavigation',
        'appearance',
        'bar 는 반투명 배경과 상단 구분선이 있는 바, plain 은 부모 배경 위에 버튼만 표시합니다.',
        "'bar'",
        "'bar' | 'plain'",
    ],
    [
        'StepNavigation',
        'prev',
        '이전 버튼입니다(기본 variant tertiary · size xl). children 에 라벨을 넣고 onClick·disabled 등 Button 속성을 넘깁니다. 생략하면 표시하지 않습니다.',
        '-',
        'ComponentProps<typeof Button>',
    ],
    [
        'StepNavigation',
        'next',
        '다음 버튼입니다(기본 variant default · size xl). Button 속성을 넘깁니다. 생략하면 표시하지 않습니다.',
        '-',
        'ComponentProps<typeof Button>',
    ],
    ['StepNavigation', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
] as const

// 데모 영역 — 실제 배치 그대로, 본문 콘텐츠 아래에 내비게이션이 일반 블록으로 붙는다(고정·플로팅 아님).
// 콘텐츠는 장식(aria-hidden)이다.
const DemoStage = ({children}: {children: ReactNode}) => (
    <div className="border-border flex flex-col overflow-hidden rounded-md border">
        <div aria-hidden="true" className="text-foreground-subtle typo-body-l-regular flex flex-col gap-1 px-6 py-6">
            <p>단계 본문 콘텐츠가 여기까지 이어지고…</p>
            <p>단계 내비게이션은 그 아래에 그대로 붙습니다.</p>
        </div>
        {children}
    </div>
)

const StepNavigationGuidePage = () => (
    <GuidePageShell
        title="스텝 내비게이션 (StepNavigation)"
        description="단계형 화면의 본문 끝에서 이전·다음 버튼을 가운데 한 묶음으로 배치합니다."
    >
        <BaseCard>
            <section aria-labelledby="sn-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sn-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>prev</code> · <code>next</code> 에 Button props 를 넘겨 버튼을 만듭니다. 본문 마지막에
                        일반 블록으로 두고 <code>sticky</code> · <code>fixed</code> 로 띄우지 않습니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>variant</code> · <code>size</code> · <code>asChild</code> 등은 <code>prev</code> ·{' '}
                        <code>next</code> 에 넘긴 값으로 바꿉니다. 기본은 prev 가 tertiary, next 가 default 이고 size 는
                        둘 다 xl 입니다.
                    </li>
                    <li>
                        <code>md</code> 미만에서는 버튼이 전체 폭으로 세로로 쌓이고, <code>md</code> 이상에서는{' '}
                        <code>gap-4</code> 간격으로 가운데에 나란히 놓입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sn-cases" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sn-cases" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        버튼 라벨 · 유무 · 활성 상태와 외형을 바꿔 단계별 상황을 표현합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    {CASES.map((c) => (
                        <div key={c.id} className="flex flex-col gap-4 py-8 last:pb-0">
                            <h3 className="typo-title-m-bold text-foreground">{c.title}</h3>
                            <p className="typo-body-l-regular text-label-foreground">{c.desc}</p>
                            <DemoStage>
                                <StepNavigation appearance={c.appearance} prev={c.prev} next={c.next} />
                            </DemoStage>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sn-appearance" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sn-appearance" className="typo-h4-bold">
                        외형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>appearance</code> 로 배경과 여백을 고릅니다.
                    </p>
                </div>
                <Table
                    caption="appearance 값별 배경과 여백"
                    columns={APPEARANCE_COLUMNS}
                    rows={APPEARANCE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sn-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sn-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="StepNavigation · ActionBar · StepProgress 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sn-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sn-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        컴포넌트는 배치만 담당하므로 접근성은 넘기는 버튼이 책임집니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        버튼 라벨은 이동 결과가 드러나는 글자로 씁니다(예: &quot;다음&quot;,
                        &quot;결과조회&quot;)[6.4.3].
                    </li>
                    <li>
                        입력이 끝나기 전에는 <code>next</code> 에 <code>disabled</code> 를 넘기고, 사유는 화면의 안내
                        문구로 따로 전합니다[7.4.2].
                    </li>
                    <li>
                        <code>prev</code> 가 먼저, <code>next</code> 가 나중인 DOM 순서가 Tab 순서이며 <code>md</code>{' '}
                        미만 세로 쌓기에서도 같습니다[7.3.1].
                    </li>
                    <li>
                        버튼은 <code>Button</code> 이라 키보드 조작과 포커스 표시가 그대로 적용됩니다[6.1.1][6.1.2].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sn-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="sn-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="StepNavigation Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepNavigationGuidePage
