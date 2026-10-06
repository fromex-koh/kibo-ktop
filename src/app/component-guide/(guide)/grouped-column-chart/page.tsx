// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {
    GroupedColumnChart,
    type GroupedColumnItem,
    type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '묶음 세로 막대 (GroupedColumnChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const REPORT_SERIES: GroupedColumnSeries[] = [
    {key: '2022', label: '2022년', color: 'var(--raw-navy-500)'},
    {key: '2023', label: '2023년', color: 'var(--raw-blue-500)'},
    {key: '2024', label: '2024년', color: 'var(--raw-purple-500)'},
]

const REPORT_CODE = `import {GroupedColumnChart, type GroupedColumnItem, type GroupedColumnSeries} from '@/components/custom/grouped-column-chart'

const series: GroupedColumnSeries[] = [
  {key: '2022', label: '2022년', color: 'var(--raw-navy-500)'},
  {key: '2023', label: '2023년', color: 'var(--raw-blue-500)'},
  {key: '2024', label: '2024년', color: 'var(--raw-purple-500)'},
]

<GroupedColumnChart
  variant="cells"
  data={data}
  series={series}
  showValueLabels
  showTooltip={false}
  ariaLabel="최근 3개년 재무 현황 항목별 연도 비교"
/>`

const DATA_CODE = `// series 의 key 와 data.values 의 키가 같아야 막대가 그려진다.
const series = financial.years.map((year, index) => ({
  key: year,
  label: year,
  color: STATEMENT_YEAR_COLORS[index % STATEMENT_YEAR_COLORS.length],
}))
const data = financial.statements.map((row) => ({
  id: row.code,
  label: row.label,
  values: Object.fromEntries(financial.years.map((year, index) => [year, row.values[index]])),
}))`

const TOP_EDGE_DATA: GroupedColumnItem[] = [
    {id: 'max', label: '최댓값', values: {'2022': 18768, '2023': 18768, '2024': 18768}},
    {id: 'near', label: '근접값', values: {'2022': 18500, '2023': 18700, '2024': 18768}},
    {id: 'mid', label: '중간값', values: {'2022': 9000, '2023': 12000, '2024': 15000}},
]

const BOTTOM_EDGE_DATA: GroupedColumnItem[] = [
    {id: 'zero', label: '0 값', values: {'2022': 0, '2023': 0, '2024': 0}},
    {id: 'tiny', label: '아주 작은 값', values: {'2022': 3, '2023': 12, '2024': 7}},
    {id: 'big', label: '큰 값', values: {'2022': 16329, '2023': 18115, '2024': 18243}},
]

const NEGATIVE_DATA: GroupedColumnItem[] = [
    {id: 'sales', label: '매출액', values: {'2022': 16329, '2023': 18115, '2024': 18243}},
    {id: 'operating-profit', label: '영업이익', values: {'2022': 1042, '2023': -497, '2024': 821}},
    {id: 'net-income', label: '순이익', values: {'2022': -821, '2023': -4660, '2024': 60}},
]

const ALL_NEGATIVE_DATA: GroupedColumnItem[] = [
    {id: 'operating-profit', label: '영업이익', values: {'2022': -1042, '2023': -497, '2024': -821}},
    {id: 'net-income', label: '순이익', values: {'2022': -821, '2023': -466, '2024': 0}},
]

const LONG_NUMBER_DATA: GroupedColumnItem[] = [
    {id: 'assets', label: '총자산', values: {'2022': 1234567, '2023': 987654, '2024': 1500000}},
    {id: 'sales', label: '매출액', values: {'2022': 876543, '2023': 1023456, '2024': 1198765}},
]

const FEW_ITEMS_DATA: GroupedColumnItem[] = [
    {id: 'assets', label: '총자산', values: {'2022': 11826, '2023': 17168, '2024': 18768}},
    {id: 'sales', label: '매출액', values: {'2022': 16329, '2023': 18115, '2024': 18243}},
]

const TWO_SERIES: GroupedColumnSeries[] = REPORT_SERIES.slice(1)

const GROUPED_COLUMN_VARIATION_CODE = `import {
  GroupedColumnChart,
  type GroupedColumnItem,
  type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart';

const series: GroupedColumnSeries[] = [
  { key: 'assets', label: '총자산', color: 'var(--ds-chart-4)' },
  { key: 'liabilities', label: '부채', color: 'var(--ds-chart-3)' },
  { key: 'equity', label: '자본', color: 'var(--ds-chart-2)' },
];

const data: GroupedColumnItem[] = [
  { id: '2022', label: '2022', values: { assets: 286.4, liabilities: 138.2, equity: 148.2 } },
  { id: '2023', label: '2023', values: { assets: 305.2, liabilities: 141.8, equity: 163.4 } },
  { id: '2024', label: '2024', values: { assets: 324.8, liabilities: 142.6, equity: 182.2 } },
];

export default function BalanceSheetChart() {
  return (
    <GroupedColumnChart
      data={data}
      series={series}
      showValueLabels
      showLegend={false}
      valueFractionDigits={1}
      unit="억원"
      yAxisStep={50}
      ariaLabel="2022년부터 2024년까지 총자산·부채·자본 비교"
    />
  );
}`

const GROUPED_COLUMN_INCOME_CODE = `import {
  GroupedColumnChart,
  type GroupedColumnItem,
  type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart';

const series: GroupedColumnSeries[] = [
  { key: 'sales', label: '매출', color: 'var(--ds-chart-4)' },
  { key: 'operatingProfit', label: '영업이익', color: 'var(--ds-chart-1)' },
  { key: 'netIncome', label: '순이익', color: 'var(--ds-chart-3)' },
];

const data: GroupedColumnItem[] = [
  { id: '2022', label: '2022', values: { sales: 221.6, operatingProfit: 28.4, netIncome: 20.8 } },
  { id: '2023', label: '2023', values: { sales: 244.8, operatingProfit: 34.1, netIncome: 24.6 } },
  { id: '2024', label: '2024', values: { sales: 267.4, operatingProfit: 38.2, netIncome: 28.6 } },
];

export default function IncomeStatementChart() {
  return (
    <GroupedColumnChart
      data={data}
      series={series}
      showValueLabels
      showLegend={false}
      valueFractionDigits={1}
      unit="억원"
      yAxisStep={50}
      ariaLabel="2022년부터 2024년까지 매출·영업이익·순이익 비교"
    />
  );
}`

const GROUPED_COLUMN_DATA: GroupedColumnItem[] = [
    {id: 'assets', label: '총자산', values: {'2022': 11826, '2023': 17168, '2024': 18768}},
    {id: 'equity', label: '자본총계', values: {'2022': 5332, '2023': 5130, '2024': 5191}},
    {id: 'liabilities', label: '부채총계', values: {'2022': 6494, '2023': 12038, '2024': 13577}},
    {id: 'sales', label: '매출액', values: {'2022': 16329, '2023': 18115, '2024': 18243}},
    {id: 'operating-profit', label: '영업이익', values: {'2022': 1042, '2023': 497, '2024': 821}},
    {id: 'net-income', label: '순이익', values: {'2022': 821, '2023': 466, '2024': 60}},
]

const BALANCE_SHEET_SERIES: GroupedColumnSeries[] = [
    {key: 'assets', label: '총자산', color: 'var(--ds-chart-4)'},
    {key: 'liabilities', label: '부채', color: 'var(--ds-chart-3)'},
    {key: 'equity', label: '자본', color: 'var(--ds-chart-2)'},
]

const BALANCE_SHEET_DATA: GroupedColumnItem[] = [
    {id: '2022', label: '2022', values: {assets: 286.4, liabilities: 138.2, equity: 148.2}},
    {id: '2023', label: '2023', values: {assets: 305.2, liabilities: 141.8, equity: 163.4}},
    {id: '2024', label: '2024', values: {assets: 324.8, liabilities: 142.6, equity: 182.2}},
]

const INCOME_STATEMENT_SERIES: GroupedColumnSeries[] = [
    {key: 'sales', label: '매출', color: 'var(--ds-chart-4)'},
    {key: 'operatingProfit', label: '영업이익', color: 'var(--ds-chart-1)'},
    {key: 'netIncome', label: '순이익', color: 'var(--ds-chart-3)'},
]

const INCOME_STATEMENT_DATA: GroupedColumnItem[] = [
    {id: '2022', label: '2022', values: {sales: 221.6, operatingProfit: 28.4, netIncome: 20.8}},
    {id: '2023', label: '2023', values: {sales: 244.8, operatingProfit: 34.1, netIncome: 24.6}},
    {id: '2024', label: '2024', values: {sales: 267.4, operatingProfit: 38.2, netIncome: 28.6}},
]

const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const CARD = 'border-subtle-3 bg-card rounded-sm border p-6'

const VARIANT_COLUMNS = [
    {key: 'variant', header: 'variant', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const VARIANT_ROWS = [
    {
        key: 'default',
        cells: [
            <code key="v">default</code>,
            'y축 · 점선 눈금 · 둥근 막대 · 아래 범례. 막대 두께 · 간격 · 모서리를 props 로 바꿉니다.',
            '화면 안의 일반 그래프',
        ],
    },
    {
        key: 'cells',
        cells: [
            <code key="v">cells</code>,
            '항목마다 테두리 칸을 두고 가운데에 두께 12 · 간격 20 의 막대를 세웁니다. y축이 없고 범례는 오른쪽 위입니다.',
            '보고서 카드',
        ],
    },
] as const

const CELLS_CASES = [
    {
        title: '모두 같은 최댓값',
        description: '가장 큰 막대도 칸 높이의 일부까지만 자라 값 글자가 칸 테두리에 닿지 않습니다.',
        data: TOP_EDGE_DATA,
        series: REPORT_SERIES,
    },
    {
        title: '0 · 아주 작은 값',
        description: '0 은 막대 없이 값만, 아주 작은 값은 얇은 막대 위에 값이 붙습니다.',
        data: BOTTOM_EDGE_DATA,
        series: REPORT_SERIES,
    },
    {
        title: '음수',
        description: '0 기준선을 긋고 음수 막대는 아래로 자랍니다. 값 글자는 막대가 자라는 쪽 끝에 붙습니다.',
        data: NEGATIVE_DATA,
        series: REPORT_SERIES,
    },
    {
        title: '모두 음수 · 0',
        description: '양수가 없어도 0 기준선 위에 값 자리가 남아 글자가 잘리지 않습니다.',
        data: ALL_NEGATIVE_DATA,
        series: REPORT_SERIES,
    },
    {
        title: '긴 숫자',
        description: '7자 이상 값은 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다.',
        data: LONG_NUMBER_DATA,
        series: REPORT_SERIES,
    },
    {
        title: '항목 2개 · 계열 2개',
        description: '칸이 넓어져도 막대 두께와 간격은 그대로이고 칸 가운데에 모입니다.',
        data: FEW_ITEMS_DATA,
        series: TWO_SERIES,
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
] as const

const CHOICE_ROWS = [
    {
        key: 'column',
        cells: [
            '항목마다 값 하나',
            <Link key="c" href="/component-guide/column-chart" className={LINK_CLASS}>
                ColumnChart
            </Link>,
        ],
    },
    {key: 'grouped', cells: ['항목마다 여러 계열을 나란히', <code key="c">GroupedColumnChart</code>]},
    {
        key: 'overlay',
        cells: [
            '같은 항목의 두 값을 겹쳐서',
            <Link key="c" href="/component-guide/overlay-column-chart" className={LINK_CLASS}>
                OverlayColumnChart
            </Link>,
        ],
    },
    {
        key: 'combo',
        cells: [
            '막대와 선을 한 그림에',
            <Link key="c" href="/component-guide/combo-bar-line-chart" className={LINK_CLASS}>
                ComboBarLineChart
            </Link>,
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'GroupedColumnChart',
        'data',
        '항목 목록입니다. 항목마다 고유한 id · 표시명 · 계열별 값이 필요합니다.',
        '-',
        'GroupedColumnItem[]',
    ],
    ['GroupedColumnChart', 'series', '묶음으로 비교할 계열 목록입니다.', '-', 'GroupedColumnSeries[]'],
    ['GroupedColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['GroupedColumnChart', 'variant', '모양입니다.', "'default'", "'default' | 'cells'"],
    ['GroupedColumnChart', 'showValueLabels', '막대 위 값입니다.', 'false', 'boolean'],
    ['GroupedColumnChart', 'showLegend', '범례 표시 여부입니다.', 'true', 'boolean'],
    [
        'GroupedColumnChart',
        'showTooltip',
        '막대에 올렸을 때 뜨는 말풍선입니다. 끄면 hover 강조도 함께 사라집니다.',
        'true',
        'boolean',
    ],
    ['GroupedColumnChart', 'animate', '막대가 자라는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['GroupedColumnChart', 'unit', '단위입니다. 그림 위 "단위: …" 글자와 말풍선 · 숨김 표에 붙습니다.', '-', 'string'],
    [
        'GroupedColumnChart',
        'valueFractionDigits',
        '값 · 말풍선 · 숨김 표의 소수 자릿수입니다. 0~6 으로 맞춥니다.',
        '0',
        'number',
    ],
    ['GroupedColumnChart', 'yAxisStep', "y축 눈금 간격입니다. 'default' 에서만 쓰입니다.", '-', 'number'],
    [
        'GroupedColumnChart',
        'showAxes',
        "축 · 눈금선입니다. 표가 항목 이름과 값을 따로 보여 줄 때 끕니다. 'default' 전용입니다.",
        'true',
        'boolean',
    ],
    [
        'GroupedColumnChart',
        'showTrack',
        '막대 뒤에 최댓값까지 옅은 기둥을 깔아 눈금 없이 높이를 견주게 합니다.',
        'false',
        'boolean',
    ],
    [
        'GroupedColumnChart',
        'barGap',
        "한 묶음 안 막대 사이 간격(px)입니다. 'cells' 는 20 으로 고정됩니다.",
        '4',
        'number',
    ],
    ['GroupedColumnChart', 'barRadius', "막대 위 모서리 반경(px)입니다. 'cells' 는 6 으로 고정됩니다.", '4', 'number'],
    [
        'GroupedColumnChart',
        'maxBarSize',
        "막대 최대 두께(px)입니다. 열이 좁은 표 안에서 줄입니다. 'cells' 는 12 로 고정됩니다.",
        '32',
        'number',
    ],
    ['GroupedColumnChart', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['GroupedColumnSeries', 'key', 'data 의 values 키와 같아야 막대가 그려집니다.', '-', 'string'],
    ['GroupedColumnSeries', 'label', '범례 · 말풍선에 보이는 이름입니다.', '-', 'string'],
    ['GroupedColumnSeries', 'color', '막대 색입니다.', '-', 'string'],
    ['GroupedColumnItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['GroupedColumnItem', 'label', '항목 이름입니다.', '-', 'string'],
    ['GroupedColumnItem', 'values', '계열 key 별 값입니다.', '-', 'Record<string, number>'],
] as const

const GroupedColumnChartGuidePage = () => (
    <GuidePageShell
        title="묶음 세로 막대 (GroupedColumnChart)"
        description="항목마다 여러 기간 · 대상의 값을 나란히 세워 증감과 규모를 비교하는 막대 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="gcc-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="gcc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>series</code> 의 <code>key</code> 와 <code>data</code> 의 <code>values</code> 키를
                        맞춥니다. 아래는 보고서 카드 모양(<code>variant=&quot;cells&quot;</code>)입니다.
                    </p>
                </div>
                <div className={CARD}>
                    <GroupedColumnChart
                        variant="cells"
                        showTooltip={false}
                        data={GROUPED_COLUMN_DATA}
                        series={REPORT_SERIES}
                        showValueLabels
                        ariaLabel="최근 3개년 재무 현황 항목별 연도 비교"
                    />
                </div>
                <CodeBlock code={REPORT_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="gcc-variants" className="typo-h4-bold">
                        변형과 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모양은 <code>variant</code> 로 고릅니다.
                    </p>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">variant</h3>
                        <Table
                            caption="GroupedColumnChart variant 비교"
                            columns={VARIANT_COLUMNS}
                            rows={VARIANT_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">default — 재무상태표 · 손익계산서</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            X축과 <code>series</code> 구성을 바꿔 여러 재무 표로 씁니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <div className="flex min-w-0 flex-col gap-4">
                                <h4 className="typo-body-l-bold text-foreground">재무상태표</h4>
                                <div className={CARD}>
                                    <GroupedColumnChart
                                        data={BALANCE_SHEET_DATA}
                                        series={BALANCE_SHEET_SERIES}
                                        showValueLabels
                                        showLegend={false}
                                        valueFractionDigits={1}
                                        unit="억원"
                                        yAxisStep={50}
                                        ariaLabel="2022년부터 2024년까지 총자산·부채·자본 비교"
                                    />
                                </div>
                                <CodeBlock
                                    code={GROUPED_COLUMN_VARIATION_CODE}
                                    language="tsx"
                                    copyLabel="재무상태표 코드 복사"
                                />
                            </div>
                            <div className="flex min-w-0 flex-col gap-4">
                                <h4 className="typo-body-l-bold text-foreground">손익계산서</h4>
                                <div className={CARD}>
                                    <GroupedColumnChart
                                        data={INCOME_STATEMENT_DATA}
                                        series={INCOME_STATEMENT_SERIES}
                                        showValueLabels
                                        showLegend={false}
                                        valueFractionDigits={1}
                                        unit="억원"
                                        yAxisStep={50}
                                        ariaLabel="2022년부터 2024년까지 매출·영업이익·순이익 비교"
                                    />
                                </div>
                                <CodeBlock
                                    code={GROUPED_COLUMN_INCOME_CODE}
                                    language="tsx"
                                    copyLabel="손익계산서 코드 복사"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">특이 값 (cells)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            값 범위 · 항목 수 · 계열 수가 달라도 컴포넌트가 처리합니다.
                        </p>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {CELLS_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <GroupedColumnChart
                                        variant="cells"
                                        showTooltip={false}
                                        data={[...item.data]}
                                        series={[...item.series]}
                                        showValueLabels
                                        ariaLabel={item.title}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">좁은 폭 (cells)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            그래프는 최소 폭(576)을 지키고 그래프만 가로로 넘깁니다. 범례는 제자리에서 줄바꿈됩니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={GROUPED_COLUMN_DATA}
                            series={REPORT_SERIES}
                            showValueLabels
                            ariaLabel="좁은 폭"
                            className="max-w-80"
                        />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 컴포넌트에는 <code>isLoading</code> 이 없습니다. 값을 기다리는 동안 같은 자리에{' '}
                            <code>ChartSkeleton type=&quot;grouped-column&quot;</code> 을 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <ChartSkeleton type="grouped-column" label="최근 3개년 재무 현황을 불러오는 중입니다." />
                            <GroupedColumnChart
                                variant="cells"
                                showTooltip={false}
                                data={GROUPED_COLUMN_DATA}
                                series={REPORT_SERIES}
                                showValueLabels
                                ariaLabel="최근 3개년 재무 현황 항목별 연도 비교"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="gcc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="막대 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="gcc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 같은 값이
                        숨김 표(<code>caption</code> · <code>th scope</code>)로 들어 있어 화면 낭독기가 표로
                        읽습니다[5.1.1].
                    </li>
                    <li>
                        값이 말풍선에만 있지 않도록 <code>showValueLabels</code> 를 켭니다. 말풍선은 마우스 보조입니다.
                    </li>
                    <li>계열은 색과 함께 범례 이름으로 구분합니다[5.3.1]. 범례를 끄면 다른 곳에 이름을 둡니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="gcc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>series</code> · <code>ariaLabel</code> 이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="GroupedColumnChart Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GroupedColumnChartGuidePage
