// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {NestedColumnChartSkeleton} from '@/components/composite/nested-column-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {
    NestedColumnChart,
    type NestedColumnItem,
    type NestedColumnSeries,
} from '@/components/custom/nested-column-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '겹친 막대 (NestedColumnChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'
const YEARS = ['2022년', '2023년', '2024년'] as const

const BALANCE_BASE: NestedColumnSeries = {key: 'assets', label: '총자산', color: 'var(--ds-gray-200)'}
const BALANCE_SERIES: NestedColumnSeries[] = [
    {key: 'debt', label: '부채총계', color: 'var(--ds-blue-400)'},
    {key: 'equity', label: '자본총계', color: 'var(--ds-navy-500)'},
]
const INCOME_BASE: NestedColumnSeries = {key: 'sales', label: '매출액', color: 'var(--ds-gray-200)'}
const INCOME_SERIES: NestedColumnSeries[] = [
    {key: 'operating', label: '영업이익', color: 'var(--ds-blue-400)'},
    {key: 'net', label: '당기순이익', color: 'var(--ds-navy-500)'},
]

// 연도별 값 줄(기준, 구성…) → 차트 데이터.
const toData = (
    keys: readonly string[],
    rows: readonly (readonly (number | undefined)[])[],
    labels: readonly string[] = YEARS,
): NestedColumnItem[] =>
    labels.map((label, index) => ({
        id: label,
        label,
        values: Object.fromEntries(keys.map((key, keyIndex) => [key, rows[keyIndex][index]])),
    }))

const BALANCE_KEYS = ['assets', 'debt', 'equity'] as const
const INCOME_KEYS = ['sales', 'operating', 'net'] as const

// 템플릿 데이터(단위: 백만원).
const BALANCE_DATA = toData(BALANCE_KEYS, [
    [10000, 16761, 18981],
    [4200, 7300, 8100],
    [5800, 9461, 10881],
])
const INCOME_DATA = toData(INCOME_KEYS, [
    [12500, 14200, 16100],
    [980, 1210, 1350],
    [610, -240, 820],
])
// 3. 엣지 케이스.
const DEEP_LOSS_DATA = toData(INCOME_KEYS, [
    [12500, 9800, 16100],
    [980, -3200, 1350],
    [610, -4800, 820],
])
const EXTREME_LOSS_DATA = toData(INCOME_KEYS, [
    [12500, 9800, 16100],
    [-8000, -12500, -6000],
    [-12000, -15000, -9000],
])
const IMPAIRED_DATA = toData(BALANCE_KEYS, [
    [6000, 5200, 9800],
    [8000, 9700, 8600],
    [-2000, -4500, 1200],
])
const SMALL_DATA = toData(INCOME_KEYS, [
    [12500, 14200, 16100],
    [0, 12, 45],
    [0, 0, 8],
])
const MISSING_DATA = toData(BALANCE_KEYS, [
    [undefined, 16761, 18981],
    [undefined, 7300, 8100],
    [undefined, 9461, 10881],
])
const FIVE_YEARS = ['2020년', '2021년', '2022년', '2023년', '2024년'] as const
const FIVE_YEAR_DATA = toData(
    BALANCE_KEYS,
    [
        [7200, 8400, 10000, 16761, 18981],
        [3100, 3600, 4200, 7300, 8100],
        [4100, 4800, 5800, 9461, 10881],
    ],
    FIVE_YEARS,
)
const THREE_SERIES: NestedColumnSeries[] = [
    {key: 'current', label: '유동부채', color: 'var(--ds-blue-300)'},
    {key: 'fixed', label: '비유동부채', color: 'var(--ds-blue-500)'},
    {key: 'equity', label: '자본총계', color: 'var(--ds-navy-500)'},
]
const THREE_SERIES_DATA = toData(
    ['assets', 'current', 'fixed', 'equity'],
    [
        [10000, 16761, 18981],
        [2600, 4100, 4500],
        [1600, 3200, 3600],
        [5800, 9461, 10881],
    ],
)

const EDGE_CASES = [
    {
        key: 'deep-loss',
        title: '적자가 클 때',
        description:
            '음수가 바닥선 아래 자리(4)보다 깊으면 가장 큰 양수 ~ 가장 큰 음수를 그림 영역 안에 비례로 담고 0 선을 올립니다. 값 글자는 막대 아래에 적습니다.',
        data: DEEP_LOSS_DATA,
        base: INCOME_BASE,
        series: INCOME_SERIES,
    },
    {
        key: 'extreme-loss',
        title: '적자가 매출보다 클 때',
        description:
            '영업이익 · 당기순이익이 모두 음수이고 매출보다 커도, 0 선을 위로 올려 막대 · 글자가 그림 안에 들어옵니다.',
        data: EXTREME_LOSS_DATA,
        base: INCOME_BASE,
        series: INCOME_SERIES,
    },
    {
        key: 'impaired',
        title: '자본잠식(자본총계 음수)',
        description: '부채가 자산보다 커 자본총계가 음수여도 같은 규칙으로 0 선 아래에 그립니다.',
        data: IMPAIRED_DATA,
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
    },
    {
        key: 'small',
        title: '0 · 아주 작은 값',
        description: '0 은 막대 없이 값 글자만, 아주 작은 값은 최소 높이 4 로 세워 보이게 합니다.',
        data: SMALL_DATA,
        base: INCOME_BASE,
        series: INCOME_SERIES,
    },
    {
        key: 'missing',
        title: '값 없음',
        description: '값이 없는 연도(undefined)는 막대 · 글자를 비웁니다. 연도 이름 · 점선은 그대로입니다.',
        data: MISSING_DATA,
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
    },
    {
        key: 'five-years',
        title: '항목이 다섯(5개년)',
        description: '항목 칸이 좁아져도 기준 막대 폭(108)은 그대로입니다. 칸 폭 112 까지 들어갑니다.',
        data: FIVE_YEAR_DATA,
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
    },
    {
        key: 'three-series',
        title: '구성 막대 셋',
        description:
            '기준 막대 안에 들지 않으면 구성 막대 폭을 줄이고(30 → 21.3, 사이 6), 이웃 값 글자가 겹치면 값 글자를 줄입니다.',
        data: THREE_SERIES_DATA,
        base: BALANCE_BASE,
        series: THREE_SERIES,
    },
] as const

const USAGE_CODE = `import {NestedColumnChart} from '@/components/custom/nested-column-chart'

<NestedColumnChart
  ariaLabel="연도별 재무상태 — 총자산 안의 부채총계 · 자본총계"
  base={{key: 'assets', label: '총자산', color: 'var(--ds-gray-200)'}}
  series={[
    {key: 'debt', label: '부채총계', color: 'var(--ds-blue-400)'},
    {key: 'equity', label: '자본총계', color: 'var(--ds-navy-500)'},
  ]}
  data={[
    {id: '2022', label: '2022년', values: {assets: 10000, debt: 4200, equity: 5800}},
    // …
  ]}
/>`

const LOADING_CODE = `import {NestedColumnChartSkeleton} from '@/components/composite/nested-column-chart-skeleton'

{isLoading ? (
  <NestedColumnChartSkeleton groupCount={3} seriesCount={2} label="재무상태를 불러오는 중입니다." />
) : (
  <NestedColumnChart data={balance} base={assets} series={parts} ariaLabel="연도별 재무상태" />
)}`

const PRINT_CODE = `// K-BIGx 인쇄본 — 표 → 범례(오른쪽) → 그래프, 간격 16(kbigx-print-company.tsx).
<KbxLegend density="compact" items={[{label: '총자산', swatchClassName: 'bg-kbx-chart-neutral'}, …]} />
<NestedColumnChart
  data={…}
  base={{key, label, color: 'var(--kbx-color-chart-neutral)'}}
  series={[{…, color: 'var(--kbx-color-blue-light)'}, {…, color: 'var(--kbx-color-navy)'}]}
  colors={{
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-border)',
    value: 'var(--kbx-color-label)',
    category: 'var(--kbx-color-foreground)',
  }}
  ariaLabel="연도별 재무상태 — 총자산 안의 부채총계 · 자본총계"
/>`

const PROPS_ITEMS = [
    [
        'NestedColumnChart',
        'data',
        '항목 목록입니다. values 는 계열 key → 값(기준 · 구성 모두).',
        '-',
        'readonly NestedColumnItem[]',
    ],
    ['NestedColumnChart', 'base', '기준 막대(넓은 막대) 계열입니다.', '-', 'NestedColumnSeries'],
    ['NestedColumnChart', 'series', '기준 막대 안에 겹칠 구성 막대 계열입니다.', '-', 'readonly NestedColumnSeries[]'],
    ['NestedColumnChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    [
        'NestedColumnChart',
        'colors',
        '선 · 글자 색(baseline · divider · value · category)입니다. 넘기지 않으면 웹 시맨틱 색입니다.',
        '웹 시맨틱 색',
        'Partial<NestedColumnColors>',
    ],
    ['NestedColumnChart', 'formatValue', '값 글자 형식입니다.', '천 단위 쉼표', '(value: number) => string'],
    ['NestedColumnSeries', 'key · label · color', '계열 식별자 · 이름 · 막대 색입니다.', '-', 'string'],
    ['NestedColumnItem', 'id · label', '항목 식별자와 이름(막대 아래 글자)입니다.', '-', 'string'],
    [
        'NestedColumnItem',
        'values',
        '계열 key → 값입니다. 음수도 그립니다.',
        '-',
        'Readonly<Record<string, number | undefined>>',
    ],
    [
        'NestedColumnChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    ['NestedColumnChartSkeleton', 'groupCount · seriesCount', '항목 수 · 구성 막대 수입니다.', '3 · 2', 'number'],
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

const NestedColumnChartGuidePage = () => (
    <GuidePageShell
        title="겹친 막대 (NestedColumnChart)"
        description="항목마다 넓은 기준 막대 안에 구성 막대를 겹쳐 세우고 막대마다 값을 바로 적는 차트입니다. 세로축 없이 값 글자로 읽습니다. K-BIGx 보고서 인쇄본 기업현황의 재무상태 · 손익현황 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="ncc-basic" className="flex flex-col gap-6">
                <SectionHeading id="ncc-basic" title="1. 기본 사용">
                    그림 폭 560 기준으로 그리고, 칸 폭에 맞춰 같은 비율로 줄어듭니다. 세로축 · 툴팁이 있는 웹 화면용은{' '}
                    <Link href="/component-guide/overlay-column-chart" className={LINK_CLASS}>
                        OverlayColumnChart
                    </Link>
                    입니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="재무상태" description="총자산(기준) 안에 부채총계 · 자본총계를 겹칩니다.">
                        <NestedColumnChart
                            data={BALANCE_DATA}
                            base={BALANCE_BASE}
                            series={BALANCE_SERIES}
                            ariaLabel="재무상태 예시"
                        />
                    </Example>
                    <Example title="손익현황" description="음수(2023년 당기순이익 -240)는 바닥선 아래로 내립니다.">
                        <NestedColumnChart
                            data={INCOME_DATA}
                            base={INCOME_BASE}
                            series={INCOME_SERIES}
                            ariaLabel="손익현황 예시"
                        />
                    </Example>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ncc-rule" className="flex flex-col gap-6">
                <SectionHeading id="ncc-rule" title="2. 짜임 · 크기 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>바닥선(0 선)은 y 300, 가장 큰 값의 막대 끝은 바닥선 위 246.4 입니다.</li>
                    <li>
                        기준 막대는 폭 108 · 칸 가운데, 구성 막대는 폭 30 · 기준 막대 안 양끝에서 16 안쪽부터 같은
                        간격입니다. 모서리 둥글림 8.
                    </li>
                    <li>
                        값 글자는 기준 막대 9 위(17px), 구성 막대 7 위(15.5px), 음수는 막대 18 아래입니다. 항목 이름은 y
                        348(19px)입니다.
                    </li>
                    <li>
                        범례는 그리지 않습니다 — 사용처가 그래프 위에 둡니다(인쇄본은 KbxLegend
                        density=&quot;compact&quot;).
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ncc-edge" className="flex flex-col gap-6">
                <SectionHeading id="ncc-edge" title="3. 엣지 케이스">
                    데이터에 따라 막대 · 글자가 그림 밖으로 나가거나 서로 겹치지 않도록 자동으로 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <NestedColumnChart
                                data={item.data}
                                base={item.base}
                                series={item.series}
                                ariaLabel={`${item.title} 예시`}
                            />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ncc-loading" className="flex flex-col gap-6">
                <SectionHeading id="ncc-loading" title="4. 불러오는 중 (NestedColumnChartSkeleton)">
                    차트와 같은 그림 범위(560 × 354)에 바닥선 · 기준 막대 · 구성 막대 · 글자 자리를 그립니다. 인쇄본은
                    데이터를 받은 뒤 서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <NestedColumnChartSkeleton label="재무상태를 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <NestedColumnChart
                            data={BALANCE_DATA}
                            base={BALANCE_BASE}
                            series={BALANCE_SERIES}
                            ariaLabel="불러온 뒤 예시"
                        />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ncc-print" className="flex flex-col gap-6">
                <SectionHeading id="ncc-print" title="5. K-BIGx 인쇄본에서">
                    재무현황 칸(폭 556) 안에서 표 → 범례 → 그래프 순서로 16 간격입니다. 확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=company"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 기업현황
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ncc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="ncc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 항목마다 기준
                        · 구성 값을 화면에 보이지 않는 목록으로도 읽어 줍니다[5.1.1].
                    </li>
                    <li>값을 글자로 적어 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ncc-props" className="flex flex-col gap-6">
                <SectionHeading id="ncc-props" title="7. Props API">
                    <code>data</code> · <code>base</code> · <code>series</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="NestedColumnChart · NestedColumnChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default NestedColumnChartGuidePage
