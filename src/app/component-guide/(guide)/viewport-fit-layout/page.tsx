// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ViewportFitLayout} from '@/components/composite/viewport-fit-layout'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'
import LayoutChoiceTable from '../sub-page-layout/layout-choice-table'

export const metadata: Metadata = {title: '뷰포트 맞춤 레이아웃 (ViewportFitLayout)'}

const USAGE_CODE = `import Header from '@/components/composite/header'
import SkipNav from '@/components/composite/skip-nav'
import {StepNavigation} from '@/components/composite/step-navigation'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {ViewportFitLayout} from '@/components/composite/viewport-fit-layout'

<ViewportFitLayout
  header={
    <>
      <SkipNav links={[{href: '#main', label: '본문 바로가기'}]} />
      <Header overlay={false} />
    </>
  }
  footer={
    <StepNavigation
      prev={{children: '메인으로 이동'}}
      next={{children: '결과조회'}}
    />
  }
  mainProps={{id: 'main', tabIndex: -1}}
>
  <PageTitleBar title="제출 완료" />
  <CompletionHero />
  <InfoBox />
  <CompletionActions />
</ViewportFitLayout>`

const PROPS_ITEMS = [
    ['ViewportFitLayout', 'header', '본문 위에 둘 Header 입니다. SkipNav 도 여기에 함께 넣습니다.', '-', 'ReactNode'],
    ['ViewportFitLayout', 'footer', '본문 아래에 둘 StepNavigation 같은 하단 액션 영역입니다.', '-', 'ReactNode'],
    [
        'ViewportFitLayout',
        'contentAs',
        '본문 요소입니다. 이미 main 안에 넣을 때만 div 를 씁니다.',
        "'main'",
        "'main' | 'div'",
    ],
    [
        'ViewportFitLayout',
        'mainProps',
        '본문 요소에 넘길 id · tabIndex · aria-* · className 입니다.',
        '-',
        "ComponentPropsWithoutRef<'main'>",
    ],
    ['ViewportFitLayout', 'children', '본문에 세로로 쌓을 제목 · 상태 · 안내 · 액션입니다.', '-', 'ReactNode'],
    [
        'ViewportFitLayout',
        'className · div 속성',
        '최상위 div 에 그대로 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'div'>",
    ],
] as const

const BEHAVIOR_COLUMNS = [
    {key: 'condition', header: '조건', align: 'start', rowHeader: true},
    {key: 'result', header: '동작', align: 'start', wrap: true},
] as const

const BEHAVIORS = [
    {
        condition: '콘텐츠가 화면 높이 안에 들어옴',
        result: 'Header · 본문 · 하단 액션을 스크롤 없이 한 화면에 배치합니다.',
    },
    {
        condition: '화면 높이가 낮아짐',
        result: '본문 간격 · 패딩과 장식 크기가 아래 범위 안에서 줄어듭니다.',
    },
    {
        condition: '콘텐츠가 화면 높이를 넘음',
        result: '콘텐츠를 자르거나 축소하지 않고 문서 스크롤로 바뀝니다.',
    },
] as const

const DENSITY_COLUMNS = [
    {key: 'target', header: '대상', align: 'start', rowHeader: true},
    {key: 'min', header: '최소', align: 'start'},
    {key: 'fluid', header: '중간값', align: 'start'},
    {key: 'max', header: '최대', align: 'start'},
] as const

const DENSITY_ROWS = [
    {key: 'gap', cells: ['본문 요소 사이 간격', '24px', '3dvh', '60px']},
    {key: 'pt', cells: ['본문 위 패딩', '16px', '2dvh', '40px']},
    {key: 'pb', cells: ['본문 아래 패딩', '24px', '3.5dvh', '100px']},
    {
        key: 'decorative',
        cells: [<code key="target">--viewport-fit-decorative-size</code>, '96px', '14dvh', '150px'],
    },
] as const

const ViewportFitLayoutGuidePage = () => (
    <GuidePageShell
        title="뷰포트 맞춤 레이아웃 (ViewportFitLayout)"
        description="완료 · 결과 · 안내처럼 한 화면에서 끝나야 하는 페이지의 Header · 본문 · 하단 액션을 배치하는 레이아웃입니다."
    >
        <BaseCard>
            <section aria-labelledby="viewport-fit-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="viewport-fit-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">header</code>와{' '}
                        <code className="text-foreground font-mono">footer</code>에 상 · 하단 영역을 넘기고, 본문은
                        children 으로 넣습니다. 본문 요소는 기본이{' '}
                        <code className="text-foreground font-mono">main</code>이며{' '}
                        <code className="text-foreground font-mono">mainProps</code>로{' '}
                        <code className="text-foreground font-mono">id</code> ·{' '}
                        <code className="text-foreground font-mono">tabIndex</code>를 줍니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="ViewportFitLayout 사용 코드 복사" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        가이드 화면 안에 넣기 위해 높이를 고정하고{' '}
                        <code className="text-foreground font-mono">contentAs=&quot;div&quot;</code>를 썼습니다. 실제
                        화면은{' '}
                        <Link
                            href="/component-guide/self-diagnosis/complete"
                            className="text-primary-strong underline underline-offset-4"
                        >
                            자가진단 제출 완료
                        </Link>
                        에서 확인합니다.
                    </p>
                    <ViewportFitLayout
                        className="border-border h-96 min-h-0 overflow-auto rounded-md border"
                        contentAs="div"
                        header={
                            <div className="bg-card border-border flex items-center border-b px-6 py-3">
                                <span className="typo-body-l-medium">Header slot</span>
                            </div>
                        }
                        footer={
                            <div className="bg-cta-surface border-border flex justify-between border-t px-6 py-3">
                                <Button variant="tertiary" size="sm">
                                    이전
                                </Button>
                                <Button size="sm">결과 확인</Button>
                            </div>
                        }
                        mainProps={{className: 'px-6'}}
                    >
                        <div>
                            <p className="typo-title-l-bold">Page title</p>
                            <p className="typo-body-l-regular text-foreground-subtle">완료 화면의 제목 영역</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <span
                                aria-hidden="true"
                                className="bg-primary outline-primary-subtle size-12 rounded-full outline-8"
                            />
                            <p className="typo-title-l-bold mt-3">작업이 완료되었습니다.</p>
                        </div>
                        <div className="bg-card border-border rounded-md border px-4 py-3">
                            <p className="typo-body-l-regular text-foreground-subtle">
                                안내 콘텐츠와 후속 행동을 본문 슬롯에 배치합니다.
                            </p>
                        </div>
                    </ViewportFitLayout>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-behavior" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="viewport-fit-behavior" className="typo-h4-bold">
                        높이에 따른 동작
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        최소 높이가 화면 높이(<code className="text-foreground font-mono">100dvh</code>)이며, 콘텐츠가
                        그보다 길면 스크롤됩니다.
                    </p>
                </div>
                <Table
                    caption="ViewportFitLayout 높이 조건별 동작"
                    columns={BEHAVIOR_COLUMNS}
                    rows={BEHAVIORS.map((row) => ({key: row.condition, cells: [row.condition, row.result]}))}
                    size="md"
                />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">간격과 장식 크기</h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면 높이에 비례해 최소와 최대 사이에서 정해집니다. 레이아웃 안의{' '}
                        <code className="text-foreground font-mono">ActionCheck</code>는{' '}
                        <code className="text-foreground font-mono">--viewport-fit-decorative-size</code>를 따라 크기가
                        정해집니다.
                    </p>
                    <Table
                        caption="ViewportFitLayout 간격과 장식 크기 범위"
                        columns={DENSITY_COLUMNS}
                        rows={DENSITY_ROWS}
                        size="md"
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="viewport-fit-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        정보량이 정해져 있고 한 화면에서 끝나야 하는 화면에만 씁니다. 긴 폼 · 목록 · 검색 결과처럼 본문
                        길이가 달라지는 화면은 SubPageLayout 을 씁니다.
                    </p>
                </div>
                <LayoutChoiceTable />
                <p className="typo-body-l-regular text-label-foreground">
                    <code>overflow-hidden</code>이나 <code>scale()</code>로 콘텐츠를 한 화면에 억지로 맞추지 않습니다.
                    본문 요소가 <code>main</code>이므로 children 안에 <code>main</code>을 다시 넣지 않습니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="viewport-fit-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        SubPageLayout 과 달리 SkipNav 를 그리지 않으므로 사용처가 챙깁니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        본문 요소는 <code>main</code>이며 <code>mainProps</code>로 <code>id=&quot;main&quot;</code> ·{' '}
                        <code>tabIndex=&#123;-1&#125;</code>을 주고, <code>header</code> 슬롯 앞쪽에 SkipNav 를 둡니다
                        [6.4.1].
                    </li>
                    <li>
                        <code>h1</code>은 <code>PageTitleBar</code>로 하나만 두고 <code>metadata.title</code>을
                        지정합니다[6.4.2].
                    </li>
                    <li>
                        콘텐츠가 넘치면 잘리지 않고 문서 스크롤로 바뀌므로 낮은 화면에서도 모든 내용에 접근할 수
                        있습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-props" className="flex flex-col gap-6">
                <h2 id="viewport-fit-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ViewportFitLayout Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ViewportFitLayoutGuidePage
