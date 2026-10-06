// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {ArrowLeft, ArrowRight} from 'lucide-react'
import {ActionBar, ActionBarCenter, ActionBarEnd, ActionBarStart} from '@/components/composite/action-bar'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '액션 바 (ActionBar)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const START_END_CODE = `import {ActionBar, ActionBarCenter, ActionBarEnd, ActionBarStart} from '@/components/composite/action-bar'

{/* 한 ActionBar 안의 버튼은 모두 같은 size 로 통일한다(여기선 md) */}
<ActionBar>
  <ActionBarStart>
    <Button variant="tertiary" size="md">목록</Button>
  </ActionBarStart>
  <ActionBarEnd>
    <Button variant="secondary" size="md">수정</Button>
    <Button size="md">저장</Button>
  </ActionBarEnd>
</ActionBar>`

const CENTER_CODE = `<ActionBar>
  <ActionBarCenter>
    <Button variant="secondary" size="xl">
      <ArrowLeft aria-hidden="true" />
      이전
    </Button>
    <Button size="xl">
      다음
      <ArrowRight aria-hidden="true" />
    </Button>
  </ActionBarCenter>
</ActionBar>`

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    ['ActionBar', '전체를 감싸는 루트입니다. 구역 사이 간격은 gap-x-4 입니다.'],
    ['ActionBarStart', '왼쪽 구역입니다. 예: 목록.'],
    ['ActionBarCenter', '가운데 구역입니다. 다른 구역이 있든 없든 가운데에 옵니다. 예: 이전/다음.'],
    ['ActionBarEnd', '오른쪽 구역입니다. 예: 수정/저장.'],
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'action-bar',
        cells: [
            '버튼을 왼쪽 · 가운데 · 오른쪽에 나눠 배치',
            <code key="c">ActionBar</code>,
            '배경 · 구분선 없이 정렬만 담당합니다. 양쪽 구역이 1fr 이라 가운데 구역이 항상 중앙에 옵니다.',
        ],
    },
    {
        key: 'step-navigation',
        cells: [
            '단계형 화면 끝의 이전 · 다음',
            <Link key="c" href="/component-guide/step-navigation" className={LINK_CLASS}>
                StepNavigation
            </Link>,
            'ActionBarCenter 위에 배경 · 여백 · 반응형(md 미만 세로 쌓기)을 더한 컴포넌트입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['ActionBar', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
    ['ActionBarStart', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
    ['ActionBarCenter', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
    ['ActionBarEnd', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
] as const

const ActionBarGuidePage = () => (
    <GuidePageShell
        title="액션 바 (ActionBar)"
        description="버튼을 왼쪽·가운데·오른쪽 세 구역 중 필요한 곳에 배치하는 레이아웃 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="ab-start-end" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ab-start-end" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ActionBarStart</code> 와 <code>ActionBarEnd</code> 를 넣으면 버튼이 왼쪽 끝과 오른쪽 끝에
                        붙습니다. 한 구역에 버튼을 여러 개 넣으면 <code>gap-2</code> 간격으로 나란히 놓입니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <ActionBar>
                        <ActionBarStart>
                            <Button variant="tertiary" size="md">
                                목록
                            </Button>
                        </ActionBarStart>
                        <ActionBarEnd>
                            <Button variant="secondary" size="md">
                                수정
                            </Button>
                            <Button size="md">저장</Button>
                        </ActionBarEnd>
                    </ActionBar>
                </div>
                <CodeBlock code={START_END_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ab-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ab-variants" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">가운데 배치</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이전/다음처럼 두 버튼을 가운데에 한 묶음으로 둘 때는 <code>ActionBarCenter</code> 만
                            넣습니다. Start · End 가 없어도 가운데에 옵니다.
                        </p>
                        <div className="border-border rounded-xl border p-6">
                            <ActionBar>
                                <ActionBarCenter>
                                    <Button variant="secondary" size="xl">
                                        <ArrowLeft aria-hidden="true" />
                                        이전
                                    </Button>
                                    <Button size="xl">
                                        다음
                                        <ArrowRight aria-hidden="true" />
                                    </Button>
                                </ActionBarCenter>
                            </ActionBar>
                        </div>
                        <CodeBlock code={CENTER_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ab-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ab-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="ActionBar · StepNavigation 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ab-composition" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ab-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">쓰지 않는 구역은 생략합니다.</p>
                </div>
                <Table
                    caption="액션 바 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map(([name, description]) => ({
                        key: name,
                        cells: [<code key="name">{name}</code>, description],
                    }))}
                    size="md"
                />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ab-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ab-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        컴포넌트는 배치만 담당하므로 접근성은 안에 넣는 버튼이 책임집니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>DOM 순서가 곧 읽기 · Tab 순서입니다. Start → Center → End 순으로 작성합니다[7.3.1].</li>
                    <li>
                        아이콘이 들어간 버튼도 글자 이름을 함께 두고 아이콘에는{' '}
                        <code>aria-hidden=&quot;true&quot;</code> 를 줍니다[5.1.1].
                    </li>
                    <li>
                        구역 안 버튼 간격은 <code>gap-2</code> 라 인접 컨트롤이 겹치지 않습니다[6.1.3].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="ab-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="ab-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">모든 컴포넌트가 div 속성만 받습니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ActionBar 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ActionBarGuidePage
