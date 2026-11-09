// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {SegmentedTabsList, SegmentedTabsTrigger} from '@/components/composite/segmented-tabs'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Tabs, TabsContent} from '@/components/ui/tabs'

export const metadata: Metadata = {title: '세그먼트 탭 (SegmentedTabs)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const USAGE_CODE = `import {SegmentedTabsList, SegmentedTabsTrigger} from '@/components/composite/segmented-tabs'
import {Tabs, TabsContent} from '@/components/ui/tabs'

<Tabs defaultValue="corp" className="gap-10">
  <SegmentedTabsList aria-label="회원유형" className="self-center">
    <SegmentedTabsTrigger value="corp">기업회원</SegmentedTabsTrigger>
    <SegmentedTabsTrigger value="org">기관회원</SegmentedTabsTrigger>
  </SegmentedTabsList>
  <TabsContent value="corp">…</TabsContent>
  <TabsContent value="org">…</TabsContent>
</Tabs>`

const PROPS_ITEMS = [
    [
        'SegmentedTabsList',
        'aria-label',
        '탭 목록의 이름입니다. 화면에 보이는 제목이 없으면 꼭 줍니다.',
        'undefined',
        'string',
    ],
    [
        'SegmentedTabsList',
        'className · TabsList props',
        '목록에 전달합니다. variant 는 받지 않습니다(plain 고정).',
        'undefined',
        "Omit<ComponentProps<typeof TabsList>, 'variant'>",
    ],
    ['SegmentedTabsTrigger', 'value', '연결할 TabsContent 의 value 입니다.', '-', 'string'],
    [
        'SegmentedTabsTrigger',
        'className · TabsTrigger props',
        '칸에 전달합니다.',
        'undefined',
        'ComponentProps<typeof TabsTrigger>',
    ],
] as const

const DemoPanel = ({children}: {children: string}) => (
    <p className="typo-body-l-regular text-label-foreground bg-background rounded-sm p-4 text-center">{children}</p>
)

const SegmentedTabsGuidePage = () => (
    <GuidePageShell
        title="세그먼트 탭 (SegmentedTabs)"
        description="회색 트랙 안에 같은 폭의 칸이 나란히 놓이고, 고른 칸만 흰 면 · 파란 굵은 글자가 되는 탭입니다. 고른 칸에 따라 아래 내용이 바뀝니다."
    >
        <BaseCard>
            <section aria-labelledby="segmented-tabs-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="segmented-tabs-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        ui/tabs 의 Tabs · TabsContent 를 그대로 쓰고 목록과 칸만 바꿉니다. 실제 화면 —{' '}
                        <Link href="/corp/pricing" className={LINK_CLASS}>
                            가격정책
                        </Link>
                        의 회원유형 탭(기업회원 · 기관회원).
                    </p>
                </div>
                <Tabs defaultValue="corp" className="gap-6">
                    <SegmentedTabsList aria-label="회원유형 예시" className="self-center">
                        <SegmentedTabsTrigger value="corp">기업회원</SegmentedTabsTrigger>
                        <SegmentedTabsTrigger value="org">기관회원</SegmentedTabsTrigger>
                    </SegmentedTabsList>
                    <TabsContent value="corp">
                        <DemoPanel>기업회원 내용</DemoPanel>
                    </TabsContent>
                    <TabsContent value="org">
                        <DemoPanel>기관회원 내용</DemoPanel>
                    </TabsContent>
                </Tabs>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="segmented-tabs-spec" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="segmented-tabs-spec" className="typo-h4-bold">
                        규격
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        트랙: <code>bg-segmented-track</code> · 반경 8(<code>rounded-sm</code>) · 안쪽 여백 4 · 칸 사이
                        4.
                    </li>
                    <li>
                        칸: 높이 40(<code>h-control-h-sm</code>) · 최소 폭 120(<code>min-w-30</code>) · 반경 8 · 글자
                        16(<code>typo-body-xl-medium</code>)이 칸 가운데에 놓입니다.
                    </li>
                    <li>
                        고른 칸: 흰 면(<code>bg-segmented-active</code>) · <code>text-primary-strong</code> · Bold.
                        고르지 않은 칸: <code>text-foreground-subtle</code>, 마우스를 올리면{' '}
                        <code>text-foreground</code>.
                    </li>
                    <li>
                        칸이 늘어나도 트랙은 내용 폭만큼만 차지합니다. 가운데 놓으려면 목록에 self-center 를 줍니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="segmented-tabs-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="segmented-tabs-choice" className="typo-h4-bold">
                        비슷한 컴포넌트와 고르는 기준
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        아래 내용(패널)이 바뀌면 SegmentedTabs, 값만 고르면(필터 · 폼 값){' '}
                        <Link href="/component-guide/segmented-control" className={LINK_CLASS}>
                            SegmentedControl
                        </Link>
                        을 씁니다 — 모양은 비슷해도 역할(tab · radio)이 다릅니다.
                    </li>
                    <li>
                        페이지 1뎁스 구분은{' '}
                        <Link href="/component-guide/tabs" className={LINK_CLASS}>
                            Tabs(underline)
                        </Link>
                        를 씁니다. SegmentedTabs 는 그 아래에서 같은 내용을 대상별로 나눠 볼 때 씁니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="segmented-tabs-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="segmented-tabs-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        Radix Tabs 가 role(tablist · tab · tabpanel) · aria-selected · 방향키 이동을 맡습니다[8.2.1].
                    </li>
                    <li>고른 칸은 면 색과 굵기를 함께 바꿔 색만으로 구분하지 않습니다[5.3.1].</li>
                    <li>키보드 포커스는 칸 둘레에 outline 으로 보입니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="segmented-tabs-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="segmented-tabs-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SegmentedTabs 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SegmentedTabsGuidePage
