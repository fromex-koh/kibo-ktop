// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
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
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '묶음 세로 막대 (GroupedColumnChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

// K-BIGx 기업혁신성장 보고서 "최근 3개년 재무 현황" 카드와 같은 계열 · 값 · 색이다.
const REPORT_SERIES: GroupedColumnSeries[] = [
    {key: '2022', label: '2022년', color: 'var(--raw-navy-500)'},
    {key: '2023', label: '2023년', color: 'var(--raw-blue-500)'},
    {key: '2024', label: '2024년', color: 'var(--raw-purple-500)'},
]

const REPORT_CODE = `import {GroupedColumnChart, type GroupedColumnItem, type GroupedColumnSeries} from '@/components/custom/grouped-column-chart'

// 오래된 해부터 navy.500 · blue.500 · purple.500
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
  showTooltip={false} // 값이 막대 위에 모두 적혀 있어 말풍선은 끈다
  ariaLabel="최근 3개년 재무 현황 항목별 연도 비교"
/>`

const DATA_CODE = `// [프론트엔드 연동] API 의 연도 목록 · 항목별 값 배열을 series · data 로 바꾼다.
// series 의 key 와 data.values 의 키가 같아야 막대가 그려진다.
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

const SHAPE_RULES = [
    "variant='cells'(보고서): 높이 240 칸 상자에 바닥선 · 양 끝 세로선은 실선, 항목 사이 세로선은 점선(gray.100)이고 위 선 · y축 · 가로 눈금선은 없습니다.",
    '막대는 두께 12 · 막대 사이 20 · 위 끝 반원(반경 6)이고 칸 가운데에 모입니다. 가장 큰 막대가 칸 높이의 78% 에 닿아 위에 값 자리가 남습니다.',
    '값은 막대 위 4 에 11 Regular(gray.600), 항목 이름은 칸 아래 8 에 12 Regular(gray.700)입니다.',
    '범례는 그래프 오른쪽 위 16 사각 견본 + 14 Regular(간격 24)입니다.',
    "값 글자는 막대가 자라는 쪽 끝에 붙습니다 — 양수는 위, 음수는 아래. 음수가 있으면 0 기준선을 긋고 위 · 아래에 값 자리를 반씩 남깁니다. 7자 이상 숫자는 '123.5만'처럼 줄입니다.",
    '값이 모두 막대 위에 적혀 있어 보고서에서는 hover 말풍선을 끕니다(showTooltip={false}).',
    '좁은 화면(640 미만)에서는 막대 묶음이 겹치지 않게 그래프 폭 576 을 지키고 그래프만 가로로 넘깁니다. 범례는 제자리에 남습니다.',
    "variant='default': y축 · 점선 눈금 · 둥근 막대입니다(재무상태표 · 손익계산서 배리에이션).",
] as const

// 값 글자 엣지 케이스 — 칸 맨 위(가장 큰 값) · 맨 아래(0 · 아주 작은 값) · 음수 · 긴 숫자.
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

const PROPS_ITEMS = [
    [
        'GroupedColumnChart',
        'data',
        '항목별 고유 id · 표시명과 series key 에 대응하는 값입니다.',
        '-',
        'GroupedColumnItem[]',
    ],
    ['GroupedColumnChart', 'series', '묶음으로 비교할 계열의 key · 표시명 · 색입니다.', '-', 'GroupedColumnSeries[]'],
    [
        'GroupedColumnChart',
        'variant',
        "'cells' 는 보고서 카드 모양(점선 칸 · 두께 12 위가 둥근 막대 · 오른쪽 위 사각 범례), 'default' 는 y축 · 점선 눈금 · 아래 원형 범례입니다.",
        "'default'",
        "'default' | 'cells'",
    ],
    ['GroupedColumnChart', 'showValueLabels', '막대 위에 값을 표시합니다.', 'false', 'boolean'],
    ['GroupedColumnChart', 'showLegend', '범례 표시 여부입니다.', 'true', 'boolean'],
    ['GroupedColumnChart', 'unit', '툴팁 · 숨김 표의 숫자 뒤 단위입니다.', 'undefined', 'string'],
    ['GroupedColumnChart', 'valueFractionDigits', '툴팁 · 막대 값 · 숨김 표의 소수 자릿수입니다.', '0', 'number'],
    ['GroupedColumnChart', 'yAxisStep', "y축 눈금 간격입니다('default'). 생략하면 자동입니다.", 'undefined', 'number'],
    [
        'GroupedColumnChart',
        'showAxes · showTrack',
        "축 · 눈금선 표시와 막대 뒤 옅은 기둥입니다('default').",
        'true · false',
        'boolean',
    ],
    [
        'GroupedColumnChart',
        'barGap · barRadius · maxBarSize',
        "막대 사이 · 위 모서리 반경 · 최대 두께입니다('default'. 'cells' 는 20 · 6 · 12 고정).",
        '4 · 4 · 32',
        'number',
    ],
    ['GroupedColumnChart', 'showTooltip', '값 위에 올렸을 때 뜨는 말풍선입니다.', 'true', 'boolean'],
    ['GroupedColumnChart', 'animate', '막대가 자라는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['GroupedColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
] as const

const GROUPED_COLUMN_VARIATION_CODE = `import {
  GroupedColumnChart,
  type GroupedColumnItem,
  type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart';

// X축을 연도, 묶음 계열을 재무 항목으로 구성한 배리에이션입니다.
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

const GroupedColumnChartGuidePage = () => (
    <GuidePageShell
        title="묶음 세로 막대 (GroupedColumnChart)"
        description="항목마다 여러 기간 · 대상의 값을 나란히 세워 증감과 규모를 비교하는 막대 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="gcc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="gcc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 최근 3개년 재무 현황 카드 그래프(variant=&quot;cells&quot;)입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card rounded-sm border p-6">
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="gcc-shape" className="typo-h4-bold">
                        모양 (Shape)
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                        {SHAPE_RULES.map((rule) => (
                            <li key={rule} className="flex">
                                <ListMarker type="unordered" />
                                <span className="min-w-0">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-variation" className="flex flex-col gap-4">
                <div>
                    <h2 id="gcc-variation" className="typo-h4-bold">
                        배리에이션 (variant=&quot;default&quot;)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        y축 · 점선 눈금이 필요한 화면에서 씁니다. X축과 series 구성을 바꾸면 재무상태표 · 손익계산서
                        형태로 확장됩니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-body-xl-bold">재무상태표</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
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
                            copyLabel="GroupedColumnChart 재무상태표 코드 복사"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-body-xl-bold">손익계산서</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
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
                            copyLabel="GroupedColumnChart 손익계산서 코드 복사"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="gcc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값 범위 · 항목 수 · 계열 수 · 폭이 달라 모양이 흔들릴 수 있는
                        경우입니다(variant=&quot;cells&quot;).
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">칸 맨 위 (가장 큰 값)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            가장 큰 막대는 칸 높이의 78% 까지만 자라 위에 값 자리(약 53)가 늘 남습니다. 모든 값이 같아도
                            글자가 칸 테두리에 닿지 않습니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={TOP_EDGE_DATA}
                            series={REPORT_SERIES}
                            showValueLabels
                            ariaLabel="칸 맨 위"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">칸 맨 아래 (0 · 아주 작은 값)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            0 은 막대 없이 바닥선 바로 위에 “0” 만 남고, 아주 작은 값은 1px 남짓한 막대 위에 값이
                            붙습니다. 값이 모두 0 이어도 칸은 그대로입니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={BOTTOM_EDGE_DATA}
                            series={REPORT_SERIES}
                            showValueLabels
                            ariaLabel="칸 맨 아래"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">음수 (적자)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            0 기준선(gray.600)을 긋고 음수 막대는 아래로 자랍니다. 값 글자는 막대가 자라는 쪽 끝(아래)에
                            붙고, 위 · 아래에 값 자리를 반씩 남겨 칸 밖으로 나가지 않습니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={NEGATIVE_DATA}
                            series={REPORT_SERIES}
                            showValueLabels
                            ariaLabel="음수"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">모두 음수 · 0</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            양수가 없어도 0 기준선 위에 값 자리가 남아 0 의 글자가 잘리지 않습니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={ALL_NEGATIVE_DATA}
                            series={REPORT_SERIES}
                            showValueLabels
                            ariaLabel="모두 음수"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">긴 숫자</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            막대 자리(32)에 7자 이상은 들어가지 않아 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다. 화면
                            낭독기는 숨김 표의 원래 값을 읽습니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={LONG_NUMBER_DATA}
                            series={REPORT_SERIES}
                            showValueLabels
                            ariaLabel="긴 숫자"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">항목 2개 · 계열 2개</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            칸이 넓어져도 막대 두께(12)와 간격(20)은 그대로이고 칸 가운데에 모입니다.
                        </p>
                        <GroupedColumnChart
                            variant="cells"
                            showTooltip={false}
                            data={FEW_ITEMS_DATA}
                            series={TWO_SERIES}
                            showValueLabels
                            ariaLabel="항목 2개 · 계열 2개"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">좁은 폭 (320)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            그래프 폭 576 을 지키고 그래프만 가로로 넘깁니다. 범례는 제자리에서 줄바꿈됩니다.
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
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="gcc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;grouped-column&quot;</code>를 같은 자리에
                        둡니다. 범례 · 테두리 칸(240) · 막대(두께 12 · 간격 20) · 항목 이름 자리의 짜임과 전체 높이가
                        실제 그래프와 같아 불러온 뒤 자리가 흔들리지 않습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="grouped-column" label="최근 3개년 재무 현황을 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="gcc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 연도 목록과 항목별 값 배열을 series · data 로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="GroupedColumnChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gcc-props" className="flex flex-col gap-4">
                <h2 id="gcc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GroupedColumnChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GroupedColumnChartGuidePage
