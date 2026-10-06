// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {
    OverlayColumnChart,
    type OverlayColumnItem,
    type OverlayColumnSeries,
} from '@/components/custom/overlay-column-chart'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '겹친 막대 (OverlayColumnChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const BASE_COLOR = 'var(--raw-gray-100)'
const SERIES_COLORS = ['var(--raw-blue-500)', 'var(--raw-purple-500)'] as const

const BALANCE_BASE: OverlayColumnSeries = {key: 'totalAssets', label: '총자산', color: BASE_COLOR}
const BALANCE_SERIES: OverlayColumnSeries[] = [
    {key: 'liabilities', label: '부채총계', color: SERIES_COLORS[0]},
    {key: 'equity', label: '자본총계', color: SERIES_COLORS[1]},
]
const INCOME_BASE: OverlayColumnSeries = {key: 'sales', label: '매출액', color: BASE_COLOR}
const INCOME_SERIES: OverlayColumnSeries[] = [
    {key: 'operatingProfit', label: '영업이익', color: SERIES_COLORS[0]},
    {key: 'netIncome', label: '당기순이익', color: SERIES_COLORS[1]},
]

const toItems = (rows: readonly (readonly [string, Record<string, number>])[]): OverlayColumnItem[] =>
    rows.map(([label, values]) => ({id: label, label, values}))

const BALANCE_DATA = toItems([
    ['2022년', {totalAssets: 10000, liabilities: 4200, equity: 5800}],
    ['2023년', {totalAssets: 16761, liabilities: 7300, equity: 9461}],
    ['2024년', {totalAssets: 18981, liabilities: 8100, equity: 10881}],
])
const INCOME_DATA = toItems([
    ['2022년', {sales: 12500, operatingProfit: 980, netIncome: 610}],
    ['2023년', {sales: 14200, operatingProfit: 1210, netIncome: -240}],
    ['2024년', {sales: 16100, operatingProfit: 1350, netIncome: 820}],
])

const TOP_EDGE_DATA = toItems([
    ['2022년', {totalAssets: 18981, liabilities: 18981, equity: 18981}],
    ['2023년', {totalAssets: 18981, liabilities: 18000, equity: 17500}],
    ['2024년', {totalAssets: 18981, liabilities: 9000, equity: 9981}],
])
const BOTTOM_EDGE_DATA = toItems([
    ['2022년', {sales: 5000, operatingProfit: -5000, netIncome: -5000}],
    ['2023년', {sales: 4200, operatingProfit: -4800, netIncome: -3900}],
    ['2024년', {sales: 5000, operatingProfit: 300, netIncome: -5000}],
])

const CROWDED_DATA = toItems([
    ['2022년', {totalAssets: 10000, liabilities: 9800, equity: 200}],
    ['2023년', {totalAssets: 9000, liabilities: 11200, equity: -2200}],
    ['2024년', {totalAssets: 12000, liabilities: 12000, equity: 12000}],
])
const LOSS_DATA = toItems([
    ['2022년', {sales: 12500, operatingProfit: -1800, netIncome: -2600}],
    ['2023년', {sales: 9800, operatingProfit: -3200, netIncome: -4100}],
    ['2024년', {sales: 14100, operatingProfit: 420, netIncome: -180}],
])
const ZERO_DATA = toItems([
    ['2022년', {sales: 0, operatingProfit: 0, netIncome: 0}],
    ['2023년', {sales: 0, operatingProfit: 0, netIncome: 0}],
    ['2024년', {sales: 5200, operatingProfit: 0, netIncome: 30}],
])
const LONG_NUMBER_DATA = toItems([
    ['2022년', {totalAssets: 1234567, liabilities: 623456, equity: 611111}],
    ['2023년', {totalAssets: 1523456, liabilities: 723456, equity: 800000}],
    ['2024년', {totalAssets: 1876543, liabilities: 876543, equity: 1000000}],
])
const MANY_ITEMS_DATA = toItems(
    Array.from({length: 7}, (_, index) => {
        const totalAssets = 8000 + index * 1500
        return [
            `${2018 + index}년`,
            {totalAssets, liabilities: Math.round(totalAssets * 0.42), equity: Math.round(totalAssets * 0.58)},
        ] as const
    }),
)
const SINGLE_DATA = toItems([['2024년', {totalAssets: 18981, liabilities: 8100, equity: 10881}]])

const USAGE_CODE = `import {OverlayColumnChart} from '@/components/custom/overlay-column-chart'

<OverlayColumnChart
  ariaLabel="연도별 재무상태 — 총자산 대비 부채총계 · 자본총계"
  unit="백만원"
  data={data}
  base={{key: 'totalAssets', label: '총자산', color: 'var(--raw-gray-100)'}}
  series={[
    {key: 'liabilities', label: '부채총계', color: 'var(--raw-blue-500)'},
    {key: 'equity', label: '자본총계', color: 'var(--raw-purple-500)'},
  ]}
/>`

const DATA_CODE = `// 항목(연도)마다 key 별 값으로 바꿔 넘긴다.
// values 의 키는 base · series 의 key 와 같아야 막대가 그려진다.
const data = years.map((year, index) => ({
  id: year,
  label: year,
  values: Object.fromEntries(rows.map((row) => [row.key, row.values[index] ?? 0])),
}))`

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
] as const

const CHOICE_ROWS = [
    {key: 'overlay', cells: ['기준 값 안의 세부 값을 한 칸에 겹쳐서', <code key="c">OverlayColumnChart</code>]},
    {
        key: 'grouped',
        cells: [
            '항목마다 여러 계열을 나란히',
            <Link key="c" href="/component-guide/grouped-column-chart" className={LINK_CLASS}>
                GroupedColumnChart
            </Link>,
        ],
    },
    {
        key: 'column',
        cells: [
            '항목마다 값 하나',
            <Link key="c" href="/component-guide/column-chart" className={LINK_CLASS}>
                ColumnChart
            </Link>,
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'OverlayColumnChart',
        'data',
        '항목(연도 등) 목록입니다. 항목마다 고유한 id · 이름 · key 별 값이 필요합니다.',
        '-',
        'OverlayColumnItem[]',
    ],
    ['OverlayColumnChart', 'base', '뒤에 깔리는 기준 값(넓고 옅은 막대)입니다.', '-', 'OverlayColumnSeries'],
    [
        'OverlayColumnChart',
        'series',
        '앞에 서는 세부 값(좁은 막대) 목록입니다. 왼쪽부터 순서대로 섭니다.',
        '-',
        'OverlayColumnSeries[]',
    ],
    ['OverlayColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['OverlayColumnChart', 'showLegend', '오른쪽 위 범례입니다.', 'true', 'boolean'],
    [
        'OverlayColumnChart',
        'valueFractionDigits',
        '값 글자 · 숨김 표의 소수 자릿수입니다. 0~6 으로 맞춥니다.',
        '0',
        'number',
    ],
    ['OverlayColumnChart', 'unit', '숨김 표 머리의 단위입니다. 화면 단위는 카드 머리에 둡니다.', '-', 'string'],
    ['OverlayColumnChart', 'animate', '막대가 자라는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['OverlayColumnChart', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['OverlayColumnSeries', 'key', 'data 의 values 키와 같아야 막대가 그려집니다.', '-', 'string'],
    ['OverlayColumnSeries', 'label', '범례 · 숨김 표에 쓰는 이름입니다.', '-', 'string'],
    ['OverlayColumnSeries', 'color', '막대 색입니다.', '-', 'string'],
    ['OverlayColumnItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['OverlayColumnItem', 'label', '칸 아래 항목 이름입니다.', '-', 'string'],
    ['OverlayColumnItem', 'values', 'key 별 값입니다.', '-', 'Record<string, number>'],
] as const

const SPECIAL_CASES = [
    {
        title: '모두 최댓값',
        description:
            '기준 · 세부가 모두 최댓값이면 세부 값 글자 위에 기준 값 글자가 한 줄 더 쌓이며, 칸 위 끝 밖으로 나가지 않습니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: TOP_EDGE_DATA,
    },
    {
        title: '가장 깊은 음수',
        description: '가장 깊은 음수 막대 아래에도 값 글자 자리가 남아 칸 바닥 밖으로 나가지 않습니다.',
        base: INCOME_BASE,
        series: INCOME_SERIES,
        data: BOTTOM_EDGE_DATA,
    },
    {
        title: '세부 값이 기준에 가깝거나 넘을 때',
        description:
            '세부 막대가 기준과 비슷하거나 더 높으면 기준 값 글자가 가장 높은 세부 값 글자 위로 올라가 겹치지 않습니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: CROWDED_DATA,
    },
    {
        title: '음수',
        description: '0 기준선을 긋고 음수 막대는 아래로 자랍니다. 값 글자는 막대 아래 끝에 붙습니다.',
        base: INCOME_BASE,
        series: INCOME_SERIES,
        data: LOSS_DATA,
    },
    {
        title: '모두 0 · 작은 값',
        description: '0 은 막대 없이 값만 남고, 같은 높이의 기준 값 글자는 세부 값 글자 위로 올라갑니다.',
        base: INCOME_BASE,
        series: INCOME_SERIES,
        data: ZERO_DATA,
    },
    {
        title: '긴 숫자',
        description: '7자 이상 값은 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: LONG_NUMBER_DATA,
    },
    {
        title: '항목이 많을 때',
        description: '칸 폭 120 × 항목 수를 최소 폭으로 지키고, 모자라면 그래프만 가로로 넘깁니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: MANY_ITEMS_DATA,
    },
    {
        title: '항목 하나',
        description: '칸 하나가 전체 폭을 쓰고 막대 묶음은 가운데에 섭니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: SINGLE_DATA,
    },
] as const

const OverlayColumnChartGuidePage = () => (
    <GuidePageShell
        title="겹친 막대 (OverlayColumnChart)"
        description="기준 값(예: 총자산)을 넓고 옅은 막대로 깔고 그 앞에 세부 값(예: 부채 · 자본)을 좁은 막대로 세워 한 칸에서 견줍니다."
    >
        <BaseCard>
            <section aria-labelledby="occ-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="occ-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 의 <code>values</code> 키는 <code>base</code> · <code>series</code> 의{' '}
                        <code>key</code> 와 같아야 막대가 그려집니다. 단위는 카드 머리에 둡니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6">
                        <h3 className="typo-title-m-bold text-foreground">재무상태</h3>
                        <OverlayColumnChart
                            ariaLabel="연도별 재무상태 — 총자산 대비 부채총계 · 자본총계"
                            unit="백만원"
                            data={BALANCE_DATA}
                            base={BALANCE_BASE}
                            series={BALANCE_SERIES}
                        />
                    </div>
                    <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6">
                        <h3 className="typo-title-m-bold text-foreground">손익현황</h3>
                        <OverlayColumnChart
                            ariaLabel="연도별 손익현황 — 매출액 대비 영업이익 · 당기순이익"
                            unit="백만원"
                            data={INCOME_DATA}
                            base={INCOME_BASE}
                            series={INCOME_SERIES}
                        />
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="occ-variants" className="typo-h4-bold">
                        상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값 글자가 겹치거나 막대가 칸을 넘을 수 있는 경우는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">특이 값</h3>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <OverlayColumnChart
                                        ariaLabel={item.title}
                                        data={[...item.data]}
                                        base={item.base}
                                        series={[...item.series]}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 컴포넌트에는 <code>isLoading</code> 이 없습니다. 값을 기다리는 동안 같은 자리에{' '}
                            <code>ChartSkeleton type=&quot;overlay-column&quot;</code> 을 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <ChartSkeleton type="overlay-column" label="재무상태를 불러오는 중입니다." />
                            <OverlayColumnChart
                                ariaLabel="연도별 재무상태"
                                data={BALANCE_DATA}
                                base={BALANCE_BASE}
                                series={BALANCE_SERIES}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="occ-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="막대 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="occ-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 같은 값이
                        숨김 표(<code>caption</code> · <code>th scope</code>)로 들어 있어 화면 낭독기가 표로 읽습니다.
                        긴 숫자를 줄여 적어도 표에는 원래 값이 있습니다[5.1.1].
                    </li>
                    <li>
                        값은 막대마다 글자로 적혀 있고, 막대는 범례 이름으로 구분합니다. 색만으로 전하지
                        않습니다[5.3.1].
                    </li>
                    <li>말풍선은 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="occ-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>base</code> · <code>series</code> · <code>ariaLabel</code> 이
                        필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="OverlayColumnChart Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OverlayColumnChartGuidePage
