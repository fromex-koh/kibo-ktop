// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '차트 등장 (ChartReveal)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {ChartReveal, ChartRevealProvider} from '@/components/custom/chart-reveal'

{/* 1. 문서를 감싼다 — 'reveal' 이면 스크롤해서 보일 때 움직이고, 'off' 면 움직임 없이 바로 그린다. */}
<ChartRevealProvider mode="reveal">
  {/* 2. 카드를 감싼다 — 나란한 카드를 동시에 움직이려면 같은 group 을 준다. */}
  <ChartReveal group="row-1">
    <Card title="기관별 비중">…차트…</Card>
  </ChartReveal>
  <ChartReveal group="row-1">
    <Card title="신용/담보 비중">…차트…</Card>
  </ChartReveal>
</ChartRevealProvider>`

const CHART_CODE = `'use client'
import {useChartAnimation} from '@/components/custom/chart-reveal'

// 3. 차트는 animate 기본값을 이 훅으로 읽는다. Provider 가 없는 화면(가이드 등)에서는 true 라 바로 움직인다.
const MyChart = ({animate}: {animate?: boolean}) => {
  const defaultAnimate = useChartAnimation()
  const isAnimated = animate ?? defaultAnimate
  // 움직이는 요소에는 data-chart-reveal 을 달고, isAnimated 일 때만 motion-safe:animate-chart-* 를 붙인다.
  …
}`

const PRINT_CODE = `// K-BIGx 인쇄본 — 종이에는 움직임이 없으므로 'off' 로 감싸 모든 차트를 바로 그린다(kbigx-print-document.tsx).
<ChartRevealProvider mode="off">
  {pages.map((page) => …)}
</ChartRevealProvider>`

const MODE_COLUMNS = [
    {key: 'mode', header: 'mode', align: 'start', rowHeader: true},
    {key: 'how', header: '동작', align: 'start', wrap: true},
    {key: 'where', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const MODE_ROWS = [
    {
        key: 'reveal',
        cells: [
            <code key="m">&apos;reveal&apos;</code>,
            '카드 안 첫 차트가 화면에 절반 이상 보이면 한 번 움직입니다. 같은 순간에 보인 카드는 문서 순서로 0.12초 간격, 같은 group 은 동시에 시작합니다.',
            'K-BIGx 웹 보고서 — 처음 보는 탭',
        ],
    },
    {
        key: 'off',
        cells: [
            <code key="m">&apos;off&apos;</code>,
            '움직임 없이 바로 그립니다.',
            'K-BIGx 웹 보고서 — 다시 들어간 탭 · K-BIGx 인쇄본',
        ],
    },
    {
        key: 'none',
        cells: ['Provider 없음', '차트가 처음 그려질 때 바로 움직입니다(기존 동작).', '가이드 · 그 밖의 화면'],
    },
] as const

const PROPS_ITEMS = [
    [
        'ChartRevealProvider',
        'mode',
        "'reveal' 은 보일 때 움직임, 'off' 는 움직임 없이 바로 그림입니다.",
        '-',
        "'reveal' | 'off'",
    ],
    [
        'ChartRevealProvider',
        'scope',
        '본문이 통째로 바뀌는 단위(예: 탭 id)입니다. 바뀌면 등장 순서를 처음부터 셉니다.',
        'undefined',
        'string',
    ],
    ['ChartRevealProvider', 'children', '감쌀 문서입니다.', '-', 'ReactNode'],
    [
        'ChartReveal',
        'group',
        '묶음 이름입니다. 같은 이름의 카드는 차례를 기다리지 않고 동시에 움직입니다.',
        'undefined',
        'string',
    ],
    [
        'ChartReveal',
        'children',
        '감쌀 카드입니다. 감싼 자리는 display: contents 라 레이아웃에 끼지 않습니다.',
        '-',
        'ReactNode',
    ],
    [
        'useChartAnimation',
        '()',
        '차트의 animate 기본값입니다. Provider 없음 true · off false · reveal 은 보인 뒤 true.',
        '-',
        'boolean',
    ],
] as const

const ChartRevealGuidePage = () => (
    <GuidePageShell
        title="차트 등장 (ChartReveal)"
        description="보고서 차트를 스크롤해서 보일 때 카드 단위로 하나씩 움직이게 하는 장치입니다. 움직임을 끄면 모든 차트를 바로 그립니다."
    >
        <BaseCard>
            <section aria-labelledby="chart-reveal-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-reveal-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        문서를 <code>ChartRevealProvider</code> 로, 카드를 <code>ChartReveal</code> 로 감쌉니다. K-BIGx
                        보고서 카드(<code>Card</code>)는 이미 <code>ChartReveal</code> 로 감싸져 있어{' '}
                        <code>revealGroup</code> 만 넘기면 됩니다. 실제 동작은{' '}
                        <Link
                            href="/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK_CLASS}
                        >
                            K-BIGx 보고서
                            <span className="sr-only"> (새 창)</span>
                        </Link>
                        에서 스크롤하며 확인합니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-reveal-mode" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-reveal-mode" className="typo-h4-bold">
                        mode
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        탭처럼 본문을 갈아 끼우는 화면은 탭에 들어갈 때 mode 를 정하고, 머무는 동안 바꾸지 않습니다.
                    </p>
                </div>
                <Table caption="ChartRevealProvider mode" columns={MODE_COLUMNS} rows={MODE_ROWS} size="md" />
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-reveal-chart" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-reveal-chart" className="typo-h4-bold">
                        차트 쪽에서 할 일
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        recharts 차트(<code>data-slot=&quot;chart&quot;</code>)는 따로 할 일이 없습니다. 직접 그린
                        차트는 움직이는 요소에 <code>data-chart-reveal</code> 을 달고 animate 기본값을{' '}
                        <code>useChartAnimation()</code> 으로 읽습니다.
                    </p>
                </div>
                <CodeBlock code={CHART_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-reveal-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-reveal-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>동작 줄이기 설정(prefers-reduced-motion)이면 움직임 없이 그대로 보입니다[6.3.1].</li>
                    <li>
                        보이기 전에는 차트 요소만 숨기고 표 · 글은 그대로 보입니다 — 내용을 읽는 데 기다릴 필요가
                        없습니다.
                    </li>
                    <li>
                        움직임 전체 규칙은{' '}
                        <Link href="/component-guide/motion" className={LINK_CLASS}>
                            모션 (Motion)
                        </Link>{' '}
                        가이드를 봅니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-reveal-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-reveal-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ChartReveal Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ChartRevealGuidePage
