// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import {
    OverlayColumnChart,
    type OverlayColumnItem,
    type OverlayColumnSeries,
} from '@/components/custom/overlay-column-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '겹친 막대 (OverlayColumnChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

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

// K-BIGx 보고서 기업현황 "재무상태 · 손익현황" 카드와 같은 값이다.
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

// 칸 맨 위 — 기준 · 세부가 모두 최댓값(값 글자 두 줄이 위 여백에 쌓인다). 칸 맨 아래 — 음수가 가장 깊을 때.
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

// 특이 케이스 — 세부 값이 기준에 가깝거나 넘을 때(값 글자 겹침) · 음수 · 모두 0 · 긴 숫자 · 항목이 많을 때 · 항목 하나.
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
  data={data} // [{id: '2022년', label: '2022년', values: {totalAssets, liabilities, equity}}, …]
  base={{key: 'totalAssets', label: '총자산', color: 'var(--raw-gray-100)'}}
  series={[
    {key: 'liabilities', label: '부채총계', color: 'var(--raw-blue-500)'},
    {key: 'equity', label: '자본총계', color: 'var(--raw-purple-500)'},
  ]}
/>`

const DATA_CODE = `// [프론트엔드 연동] 연도별 재무 행을 항목(연도)마다 key 별 값으로 바꾼다.
// values 의 키는 base · series 의 key 와 같아야 막대가 그려진다.
const data = years.map((year, index) => ({
  id: year,
  label: year,
  values: Object.fromEntries(rows.map((row) => [row.key, row.values[index] ?? 0])),
}))`

const SHAPE_RULES = [
    '오른쪽 위 16 사각 견본 범례(기준 → 세부 순) 아래 8 에 높이 200 칸 상자가 옵니다. 위 선 없이 바닥 · 양 끝은 실선, 항목 사이는 점선(gray.100)입니다.',
    '기준 막대는 폭 96 · 위 모서리 8 로 옅게 깔리고, 세부 막대는 폭 24 · 사이 18 · 위 모서리 4 로 그 앞 가운데에 섭니다.',
    '가장 큰 값이 칸 높이의 78% 에 닿아 위에 값 자리가 남습니다. 값은 막대 끝에서 4 에 11 Regular(gray.600)입니다.',
    '두 겹은 x축을 둘(기준 · 세부) 두어 그립니다 — 항목 순서가 같아 칸 가운데가 일치합니다.',
] as const

const PROPS_ITEMS = [
    ['OverlayColumnChart', 'data', '항목(연도)별 id · 이름 · key 별 값입니다.', '-', 'OverlayColumnItem[]'],
    [
        'OverlayColumnChart',
        'base',
        '뒤에 깔리는 기준 값(넓고 옅은 막대)의 key · 이름 · 색입니다.',
        '-',
        'OverlayColumnSeries',
    ],
    [
        'OverlayColumnChart',
        'series',
        '앞에 서는 세부 값(좁은 막대)들 — 순서대로 왼쪽부터입니다.',
        '-',
        'OverlayColumnSeries[]',
    ],
    ['OverlayColumnChart', 'showLegend', '오른쪽 위 범례 표시 여부입니다.', 'true', 'boolean'],
    ['OverlayColumnChart', 'valueFractionDigits', '값 글자 · 숨김 표의 소수 자릿수입니다.', '0', 'number'],
    ['OverlayColumnChart', 'unit', '숨김 표 머리의 단위입니다(화면 단위는 카드 머리에 둡니다).', 'undefined', 'string'],
    ['OverlayColumnChart', 'animate', '막대가 자라는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['OverlayColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
] as const

const SPECIAL_CASES = [
    {
        title: '칸 맨 위 (y축 최댓값)',
        description:
            '가장 큰 값은 칸 높이의 78% 까지만 자라 위에 약 44 의 값 자리가 늘 남습니다. 기준 · 세부가 모두 최댓값이면 세부 값 글자 위에 기준 값 글자가 한 줄 더 쌓이고, 그래도 칸 위 끝 밖으로는 나가지 않게 막습니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: TOP_EDGE_DATA,
    },
    {
        title: '칸 맨 아래 (y축 최솟값 · 가장 깊은 음수)',
        description:
            '음수가 있으면 0 기준선 위 · 아래로 남는 자리를 반씩 나눕니다. 가장 깊은 음수 막대 아래에도 약 22 의 자리가 남아 값 글자(막대 아래 끝에 붙음)가 칸 바닥 밖으로 나가지 않습니다.',
        base: INCOME_BASE,
        series: INCOME_SERIES,
        data: BOTTOM_EDGE_DATA,
    },
    {
        title: '세부 값이 기준에 가깝거나 넘을 때',
        description:
            '부채가 자산에 가깝거나 넘으면(자본잠식) 세부 막대가 기준 막대만큼 · 그보다 높아집니다. 기준 값 글자는 가장 높은 세부 값 글자 위로 올라가 겹치지 않고, 세부 막대 위에 얹히지 않습니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: CROWDED_DATA,
    },
    {
        title: '음수 (영업손실 · 순손실)',
        description:
            '0 기준선을 긋고 음수 막대는 아래로 자랍니다. 값 글자는 막대 아래 끝에 붙고, 위 · 아래에 값 자리를 반씩 남겨 칸 밖으로 나가지 않습니다.',
        base: INCOME_BASE,
        series: INCOME_SERIES,
        data: LOSS_DATA,
    },
    {
        title: '모두 0 · 작은 값',
        description:
            '0 은 막대 없이 바닥선 위에 값만 남습니다. 같은 높이의 기준 값 글자는 세부 값 글자 위로 올라가 겹치지 않습니다.',
        base: INCOME_BASE,
        series: INCOME_SERIES,
        data: ZERO_DATA,
    },
    {
        title: '긴 숫자',
        description:
            '7자 이상 값은 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다. 화면 낭독기는 숨김 표의 원래 값을 읽습니다.',
        base: BALANCE_BASE,
        series: BALANCE_SERIES,
        data: LONG_NUMBER_DATA,
    },
    {
        title: '항목이 많을 때 (7개)',
        description:
            '칸 폭 120 × 항목 수를 최소 폭으로 지켜 기준 막대가 옆 칸과 겹치지 않고, 모자라면 그래프만 가로로 넘깁니다.',
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
        description="항목마다 기준 값(예: 총자산)을 넓고 옅은 막대로 깔고 그 앞에 세부 값(예: 부채 · 자본)을 좁은 막대로 세워 한 칸에서 견줍니다."
    >
        <BaseCard>
            <section aria-labelledby="occ-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="occ-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 기업현황 탭의 재무상태 · 손익현황 카드 그래프입니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-3 rounded-sm border p-6">
                        <h3 className="typo-body-xl-bold">재무상태</h3>
                        <OverlayColumnChart
                            ariaLabel="연도별 재무상태 — 총자산 대비 부채총계 · 자본총계"
                            unit="백만원"
                            data={BALANCE_DATA}
                            base={BALANCE_BASE}
                            series={BALANCE_SERIES}
                        />
                    </div>
                    <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-3 rounded-sm border p-6">
                        <h3 className="typo-body-xl-bold">손익현황 (음수 포함)</h3>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="occ-shape" className="typo-h4-bold">
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
            <section aria-labelledby="occ-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="occ-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값 글자가 겹치거나 막대가 칸을 넘어 모양이 깨질 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <OverlayColumnChart
                                ariaLabel={item.title}
                                data={[...item.data]}
                                base={item.base}
                                series={[...item.series]}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="occ-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;overlay-column&quot;</code>를 같은 자리에
                        둡니다. 범례 · 칸 상자 · 겹친 막대 · 항목 이름 자리의 짜임이 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="overlay-column" label="재무상태를 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <OverlayColumnChart
                            ariaLabel="연도별 재무상태"
                            data={BALANCE_DATA}
                            base={BALANCE_BASE}
                            series={BALANCE_SERIES}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="occ-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        연도별 재무 행을 항목(연도)마다 key 별 값으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="OverlayColumnChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="occ-props" className="flex flex-col gap-4">
                <h2 id="occ-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="OverlayColumnChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default OverlayColumnChartGuidePage
