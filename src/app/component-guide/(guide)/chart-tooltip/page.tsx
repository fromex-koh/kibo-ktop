// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {
    ChartTooltipBox,
    ChartTooltipDescription,
    ChartTooltipRow,
    ChartTooltipTitle,
} from '@/components/composite/chart-tooltip-parts'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '차트 툴팁 (ChartTooltip)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const RECHARTS_CODE = `import {ChartTooltip, ChartTooltipContent} from '@/components/ui/chart'
import {ChartTooltipRow} from '@/components/composite/chart-tooltip-parts'
import {chartTooltipClassName, chartTooltipTitleClassName} from '@/components/theme/chart-tooltip.variants'

<ChartTooltip
  cursor={false}
  content={
    <ChartTooltipContent
      className={chartTooltipClassName}
      labelClassName={chartTooltipTitleClassName}
      hideIndicator
      formatter={(value, name) => (
        <ChartTooltipRow
          color={config[String(name)]?.color}
          name={config[String(name)]?.label}
          value={\`\${valueFormatter.format(Number(value))} 억원\`}
        />
      )}
    />
  }
/>`

const BOX_CODE = `import {
  ChartTooltipBox,
  ChartTooltipDescription,
  ChartTooltipTitle,
} from '@/components/composite/chart-tooltip-parts'

{/* 위치는 사용처가 정합니다 — 가리키는 점의 좌표를 style 로, 띄우는 방향을 className 으로 줍니다. */}
{tooltip ? (
  <ChartTooltipBox
    className="absolute z-10 -translate-x-1/2 -translate-y-full"
    style={{left: tooltip.x, top: tooltip.y}}
  >
    <ChartTooltipTitle>{tooltip.text}</ChartTooltipTitle>
    <ChartTooltipDescription>중요도 {tooltip.weight}</ChartTooltipDescription>
  </ChartTooltipBox>
) : null}`

const PART_COLUMNS = [
    {key: 'part', header: '부품', align: 'start', rowHeader: true},
    {key: 'role', header: '하는 일', align: 'start', wrap: true},
] as const

const PART_ROWS = [
    {
        key: 'title',
        cells: [<code key="p">ChartTooltipTitle</code>, '툴팁 제목입니다(14 Bold).'],
    },
    {
        key: 'description',
        cells: [<code key="p">ChartTooltipDescription</code>, '제목 아래 보조 설명입니다(13 Regular · 보조 색).'],
    },
    {
        key: 'row',
        cells: [
            <code key="p">ChartTooltipRow</code>,
            '계열 한 줄입니다. 색 점 · 이름(왼쪽) ↔ 값(오른쪽). 이름이 없으면 점과 값만 둡니다.',
        ],
    },
    {
        key: 'box',
        cells: [
            <code key="p">ChartTooltipBox</code>,
            '직접 그리는 차트용 툴팁 면입니다. Recharts 차트는 이 면 대신 ChartTooltipContent 에 chartTooltipClassName 을 줍니다.',
        ],
    },
] as const

const USED_COLUMNS = [
    {key: 'how', header: '방식', align: 'start', rowHeader: true},
    {key: 'charts', header: '차트', align: 'start', wrap: true},
] as const

const USED_ROWS = [
    {
        key: 'recharts',
        cells: [
            'ChartTooltipContent + 부품',
            <span key="c">
                <Link href="/component-guide/column-chart" className={LINK_CLASS}>
                    ColumnChart
                </Link>{' '}
                ·{' '}
                <Link href="/component-guide/grouped-column-chart" className={LINK_CLASS}>
                    GroupedColumnChart
                </Link>{' '}
                ·{' '}
                <Link href="/component-guide/line-chart" className={LINK_CLASS}>
                    LineChart
                </Link>{' '}
                ·{' '}
                <Link href="/component-guide/percentage-donut-chart" className={LINK_CLASS}>
                    PercentageDonutChart
                </Link>{' '}
                ·{' '}
                <Link href="/component-guide/comparison-radar-chart" className={LINK_CLASS}>
                    ComparisonRadarChart
                </Link>
            </span>,
        ],
    },
    {
        key: 'box',
        cells: [
            'ChartTooltipBox',
            <span key="c">
                <Link href="/component-guide/word-cloud" className={LINK_CLASS}>
                    WordCloud
                </Link>{' '}
                ·{' '}
                <Link href="/component-guide/network-graph" className={LINK_CLASS}>
                    NetworkGraph
                </Link>{' '}
                · CompanyRelationshipGraph
            </span>,
        ],
    },
] as const

const PROPS_ITEMS = [
    ['ChartTooltipTitle', 'children', '제목 글자입니다.', '-', 'ReactNode'],
    ['ChartTooltipDescription', 'children', '설명 글자입니다.', '-', 'ReactNode'],
    ['ChartTooltipRow', 'color', '앞 점의 색(토큰 변수)입니다. 없으면 점을 두지 않습니다.', '-', 'string'],
    ['ChartTooltipRow', 'name', '계열 이름입니다. 없으면 점과 값만 둡니다.', '-', 'ReactNode'],
    ['ChartTooltipRow', 'value', '값입니다. 단위까지 붙여 넘깁니다.', '-', 'ReactNode'],
    [
        'ChartTooltipBox',
        'className',
        '위치(absolute · translate) · 최대 폭 등을 더합니다. 면 모양은 바꾸지 않습니다.',
        '-',
        'string',
    ],
    ['ChartTooltipBox', 'style', '가리키는 자리의 좌표(left · top)를 넘깁니다.', '-', 'CSSProperties'],
    ['ChartTooltipBox', 'children', '안에 둘 제목 · 설명 · 줄입니다.', '-', 'ReactNode'],
] as const

const ChartTooltipGuidePage = () => (
    <GuidePageShell
        title="차트 툴팁 (ChartTooltip)"
        description="모든 차트가 같은 모양의 툴팁을 쓰도록 툴팁 면과 안쪽 줄(제목 · 설명 · 계열 줄)을 모은 부품입니다."
    >
        <BaseCard>
            <section aria-labelledby="chart-tooltip-preview" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-tooltip-preview" className="typo-h4-bold">
                        모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        카드 면 · 옅은 테두리 · 둥근 모서리 8 · 그림자 xl 입니다. 폭은 글자만큼이고 글자는 접지
                        않습니다. 스타일은 <code>theme/chart-tooltip.variants.ts</code> 한 곳에서 정합니다.
                    </p>
                </div>
                <div className="bg-surface flex flex-wrap items-start gap-6 rounded-md p-6">
                    <ChartTooltipBox>
                        <ChartTooltipTitle>2024년</ChartTooltipTitle>
                        <ChartTooltipRow color="var(--ds-chart-1)" name="매출액" value="1,240 억원" />
                        <ChartTooltipRow color="var(--ds-chart-2)" name="영업이익" value="86 억원" />
                    </ChartTooltipBox>
                    <ChartTooltipBox>
                        <ChartTooltipTitle>인공지능</ChartTooltipTitle>
                        <ChartTooltipDescription>중요도 0.82</ChartTooltipDescription>
                    </ChartTooltipBox>
                    <ChartTooltipBox>
                        <ChartTooltipTitle>2분기</ChartTooltipTitle>
                        <ChartTooltipRow color="var(--ds-chart-1)" value="128 명" />
                    </ChartTooltipBox>
                </div>
                <Table caption="차트 툴팁 부품" columns={PART_COLUMNS} rows={PART_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-tooltip-recharts" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-tooltip-recharts" className="typo-h4-bold">
                        Recharts 차트
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ChartTooltipContent</code>(ui/chart 순정 셸)에 면 · 제목 클래스를 주고,{' '}
                        <code>formatter</code> 에서 <code>ChartTooltipRow</code> 를 돌려줍니다. 계열 점을 줄 안에서
                        그리므로 <code>hideIndicator</code> 를 줍니다.
                    </p>
                </div>
                <CodeBlock code={RECHARTS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-tooltip-box" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-tooltip-box" className="typo-h4-bold">
                        직접 그리는 차트
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        캔버스 · SVG 로 직접 그리는 차트는 <code>ChartTooltipBox</code> 로 같은 면을 깔고 위치만
                        넘깁니다. 면은 마우스를 막지 않습니다(pointer-events-none).
                    </p>
                </div>
                <CodeBlock code={BOX_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-tooltip-used" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-tooltip-used" className="typo-h4-bold">
                        쓰는 차트
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        툴팁을 바꾸면 아래 차트가 함께 바뀝니다. 새 차트도 같은 부품을 씁니다.
                    </p>
                </div>
                <Table caption="차트 툴팁을 쓰는 차트" columns={USED_COLUMNS} rows={USED_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-tooltip-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-tooltip-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        툴팁은 마우스를 올렸을 때만 보이는 보조 정보입니다. 같은 값을 차트의 숨김 표(sr-only)나
                        목록으로도 제공합니다[5.1.1].
                    </li>
                    <li>
                        계열 점은 장식이라 읽지 않고(<code>aria-hidden</code>), 이름 글자가 계열을 알립니다 — 색만으로
                        구분하지 않습니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-tooltip-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="chart-tooltip-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="차트 툴팁 부품 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ChartTooltipGuidePage
