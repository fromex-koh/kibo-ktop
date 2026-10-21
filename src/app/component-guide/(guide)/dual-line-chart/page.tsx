// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DualLineChartSkeleton} from '@/components/composite/dual-line-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {DualLineChart, type DualLineItem, type DualLineSeries} from '@/components/custom/dual-line-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '두 계열 꺾은선 (DualLineChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'
const SERIES: readonly [DualLineSeries, DualLineSeries] = [
    {key: 'credit', label: '신용', color: 'var(--ds-report-series-1)'},
    {key: 'collateral', label: '담보', color: 'var(--ds-report-series-4)'},
]

// 시점 + 신용 · 담보 → 차트 데이터.
const toData = (rows: readonly (readonly [string, number | undefined, number | undefined])[]): DualLineItem[] =>
    rows.map(([label, credit, collateral]) => ({id: label, label, values: {credit, collateral}}))

// 템플릿 데이터(단위: %).
const STANDARD_DATA = toData([
    ['22.12월', 30, 70],
    ['23.12월', 40, 60],
    ['24.12월', 43.8, 56.2],
])
// 엣지 케이스.
const CROSS_DATA = toData([
    ['22.12월', 30, 70],
    ['23.12월', 52, 48],
    ['24.12월', 64.5, 35.5],
])
const SAME_DATA = toData([
    ['22.12월', 50, 50],
    ['23.12월', 50, 50],
    ['24.12월', 50, 50],
])
const MISSING_DATA = toData([
    ['21.12월', 25, 75],
    ['22.12월', 30, undefined],
    ['23.12월', 40, 60],
    ['24.12월', 43.8, 56.2],
])
const SINGLE_DATA = toData([['24.12월', 43.8, 56.2]])

const EDGE_CASES = [
    {
        key: 'cross',
        title: '두 선이 엇갈릴 때',
        description: '항목마다 큰 값의 글자는 점 위, 작은 값의 글자는 점 아래 — 글자가 두 선 사이로 들어가지 않습니다.',
        data: CROSS_DATA,
    },
    {
        key: 'same',
        title: '값이 모두 같을 때',
        description: '두 선을 가운데(y 145)에 겹쳐 두고, 첫 계열 글자는 아래 · 둘째 계열 글자는 위에 둡니다.',
        data: SAME_DATA,
    },
    {
        key: 'missing',
        title: '값 없음',
        description: '값이 없는 점에서 그 계열의 선을 끊고 점 · 글자를 그리지 않습니다.',
        data: MISSING_DATA,
    },
    {key: 'single', title: '시점이 하나', description: '점만 칸 가운데에 두고 선은 긋지 않습니다.', data: SINGLE_DATA},
] as const

const USAGE_CODE = `import {DualLineChart} from '@/components/custom/dual-line-chart'

<DualLineChart
  ariaLabel="신용/담보 비중 추이"
  series={[
    {key: 'credit', label: '신용', color: 'var(--ds-report-series-1)'},
    {key: 'collateral', label: '담보', color: 'var(--ds-report-series-4)'},
  ]}
  data={points.map((point) => ({
    id: point.label,
    label: point.label,
    values: {credit: point.credit, collateral: point.collateral},
  }))}
/>`

const LOADING_CODE = `import {DualLineChartSkeleton} from '@/components/composite/dual-line-chart-skeleton'

{isLoading ? (
  <DualLineChartSkeleton groupCount={3} label="신용/담보 비중을 불러오는 중입니다." />
) : (
  <DualLineChart data={points} series={series} ariaLabel="신용/담보 비중 추이" />
)}`

const PRINT_CODE = `// K-BIGx 인쇄본 — 계열 · 선 · 글자 색을 kbx 토큰으로 넘깁니다(kbigx-print-credit.tsx).
<DualLineChart
  data={points}
  series={[
    {key: 'credit', label: '신용', color: 'var(--kbx-color-navy)'},
    {key: 'collateral', label: '담보', color: 'var(--kbx-color-mint)'},
  ]}
  colors={{
    divider: 'var(--kbx-color-chart-grid)',
    baseline: 'var(--kbx-color-chart-line-subtle)',
    category: 'var(--kbx-color-foreground)',
    value: 'var(--kbx-color-label)',
    dotFill: 'var(--kbx-color-paper)',
  }}
  legendClassName="kbx-text-18 text-kbx-label"
  ariaLabel="신용/담보 비중 추이"
/>`

const PROPS_ITEMS = [
    ['DualLineChart', 'data', '시점 목록입니다. 시간 순서대로 넘깁니다.', '-', 'readonly DualLineItem[]'],
    [
        'DualLineChart',
        'series',
        '두 계열입니다 — 순서대로 실선 · 빈 원, 파선 · 마름모.',
        '-',
        'readonly [DualLineSeries, DualLineSeries]',
    ],
    ['DualLineChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    [
        'DualLineChart',
        'colors',
        '선 · 글자 색(divider · baseline · category · value · dotFill)입니다. 넘기지 않으면 웹 시맨틱 색입니다.',
        '웹 시맨틱 색',
        'Partial<DualLineColors>',
    ],
    [
        'DualLineChart',
        'formatValue',
        '값 글자 형식입니다.',
        '소수 첫째 자리까지(56.2 · 70)',
        '(value: number) => string',
    ],
    [
        'DualLineChart',
        'legendClassName',
        '범례 글자 크기 · 색입니다.',
        "'typo-body-m-regular text-foreground-subtle'",
        'string',
    ],
    ['DualLineSeries', 'key · label · color', '계열 key(values 의 key) · 범례 이름 · 선 색입니다.', '-', 'string'],
    [
        'DualLineItem',
        'values',
        '계열 key → 값입니다. 없으면 그 계열의 선을 끊습니다.',
        '-',
        'Record<string, number | undefined>',
    ],
    [
        'DualLineChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    ['DualLineChartSkeleton', 'groupCount', '시점 수입니다.', '3', 'number'],
] as const

const Example = ({title, description, children}: {title: string; description: string; children: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <p className="typo-body-xl-bold text-foreground">{title}</p>
        <p className="typo-body-m-regular text-foreground-subtle break-keep">{description}</p>
        <div className="border-subtle-3 bg-card rounded-sm border p-6">{children}</div>
    </div>
)

const SectionHeading = ({id, title, children}: {id: string; title: string; children?: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        {children ? <p className="typo-body-l-regular text-label-foreground">{children}</p> : null}
    </div>
)

const DualLineChartGuidePage = () => (
    <GuidePageShell
        title="두 계열 꺾은선 (DualLineChart)"
        description="두 값의 추이를 두 선으로 그리고 점마다 값을 바로 적는 차트입니다. 첫 계열은 실선 + 빈 원, 둘째 계열은 파선 + 마름모라 색 없이도 구분됩니다. K-BIGx 보고서 인쇄본 신용/재무정보의 신용/담보 비중 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="dlc-basic" className="flex flex-col gap-6">
                <SectionHeading id="dlc-basic" title="1. 기본 사용">
                    그림 560 × 290 기준으로 그리고 범례는 그래프 아래 가운데에 함께 둡니다. 계열이 셋 이상이고 값 글자가
                    없는 추이는{' '}
                    <Link href="/component-guide/marker-line-chart" className={LINK_CLASS}>
                        MarkerLineChart
                    </Link>
                    , 한 계열 + 면은{' '}
                    <Link href="/component-guide/value-line-chart" className={LINK_CLASS}>
                        ValueLineChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example title="템플릿 데이터" description="신용 30 → 43.8, 담보 70 → 56.2(단위: %).">
                    <DualLineChart
                        data={STANDARD_DATA}
                        series={SERIES}
                        ariaLabel="신용/담보 비중 예시"
                        className="max-w-140"
                    />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-rule" className="flex flex-col gap-6">
                <SectionHeading id="dlc-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>점은 항목 칸 가운데, 칸 사이 세로 점선(y 20 ~ 250), 바닥선 y 250, 항목 이름 y 280(19px).</li>
                    <li>
                        두 계열을 합친 값 가운데 가장 큰 값이 y 83, 가장 작은 값이 y 207 — 그 사이는 값에
                        비례합니다(세로축 없음).
                    </li>
                    <li>
                        첫 계열 = 실선 · 빈 원(반지름 8) · 값 글자 계열 색 굵게. 둘째 계열 = 파선(9 7) · 마름모(반지름
                        10) · 값 글자 옅은 글자 색.
                    </li>
                    <li>값 글자는 항목마다 큰 값이 점 18 위, 작은 값이 점 32 아래입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-edge" className="flex flex-col gap-6">
                <SectionHeading id="dlc-edge" title="3. 엣지 케이스" />
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <DualLineChart data={item.data} series={SERIES} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-loading" className="flex flex-col gap-6">
                <SectionHeading id="dlc-loading" title="4. 불러오는 중 (DualLineChartSkeleton)">
                    차트와 같은 그림 범위(560 × 290)에 바닥선 · 두 선 · 점 · 값 글자 · 항목 이름 자리를, 아래에 범례
                    자리를 그립니다. 인쇄본은 서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <DualLineChartSkeleton label="신용/담보 비중을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <DualLineChart data={STANDARD_DATA} series={SERIES} ariaLabel="불러온 뒤 예시" />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-print" className="flex flex-col gap-6">
                <SectionHeading id="dlc-print" title="5. K-BIGx 인쇄본에서">
                    차입금 현황 신용/담보 비중 소블록의 왼쪽 반(폭 556)에 두고, 오른쪽 반에는 최근 비중을
                    InsideLabelPieChart 원형으로 둡니다. 확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=credit-finance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 신용/재무정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="dlc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 계열마다 값을
                        화면에 보이지 않는 목록으로도 읽어 줍니다[5.1.1].
                    </li>
                    <li>선 모양 · 점 모양 · 값 글자로 구분해 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>범례 견본은 꾸밈이라 숨기고, 이름 글자만 읽힙니다.</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-props" className="flex flex-col gap-6">
                <SectionHeading id="dlc-props" title="7. Props API">
                    <code>data</code> · <code>series</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="DualLineChart · DualLineChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DualLineChartGuidePage
