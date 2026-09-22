// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {LineChart, type LineChartItem, type LineChartSeries} from '@/components/custom/line-chart'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '선 그래프 (LineChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

// K-BIGx 기업혁신성장 보고서 "분기별 종업원수" 카드와 같은 계열 · 값 · 색이다.
const EMPLOYEE_SERIES: LineChartSeries[] = [{key: 'employees', label: '종업원수', color: 'var(--raw-purple-600)'}]

const toItems = (entries: readonly (readonly [string, number])[]): LineChartItem[] =>
    entries.map(([label, value]) => ({id: label, label, values: {employees: value}}))

const EMPLOYEE_DATA = toItems([
    ['23.03월', 39],
    ['23.06월', 37],
    ['23.09월', 37],
    ['23.12월', 35],
    ['24.03월', 34],
    ['24.06월', 34],
    ['24.09월', 31],
    ['24.12월', 33],
    ['25.03월', 27],
    ['25.06월', 28],
    ['25.09월', 25],
])

// 특이 케이스 — 급등 · 급락(값 글자가 선과 겹치는지) · 모두 같은 값 · 점 하나 · 0 · 음수 · 긴 숫자 · 점이 많을 때.
const SPIKE_DATA = toItems([
    ['23.03월', 12],
    ['23.06월', 95],
    ['23.09월', 8],
    ['23.12월', 88],
    ['24.03월', 15],
    ['24.06월', 90],
])
const FLAT_DATA = toItems([
    ['23.03월', 30],
    ['23.06월', 30],
    ['23.09월', 30],
    ['23.12월', 30],
])
const SINGLE_DATA = toItems([['25.09월', 25]])
const ZERO_NEGATIVE_DATA = toItems([
    ['23.03월', 12],
    ['23.06월', 4],
    ['23.09월', 0],
    ['23.12월', -6],
    ['24.03월', -2],
    ['24.06월', 5],
])
const LONG_NUMBER_DATA = toItems([
    ['2021년', 1234567],
    ['2022년', 1523456],
    ['2023년', 1398765],
    ['2024년', 1876543],
])
const MANY_POINTS_DATA = toItems(
    Array.from({length: 24}, (_, index) => {
        const year = 20 + Math.floor(index / 4)
        const month = ((index % 4) + 1) * 3
        return [`${year}.${String(month).padStart(2, '0')}월`, 40 - index + (index % 3) * 2] as const
    }),
)

const USAGE_CODE = `import {LineChart, type LineChartSeries} from '@/components/custom/line-chart'

const series: LineChartSeries[] = [{key: 'employees', label: '종업원수', color: 'var(--raw-purple-600)'}]

<LineChart
  appearance="cells"
  variant="area"
  data={data}
  series={series}
  showLegend={false}
  showValueLabels
  showTooltip={false} // 값이 점 위에 모두 적혀 있어 말풍선은 끈다
  ariaLabel="분기별 종업원수 추이"
/>`

const DATA_CODE = `// [프론트엔드 연동] API 의 분기별 값을 LineChartItem 으로 바꾼다. series 의 key 와 values 의 키가 같아야 한다.
const data: LineChartItem[] = employeesFromApi.map((item) => ({
  id: item.baseYearQuarter,      // 예: '2025-09'
  label: item.label,             // 예: '25.09월'
  values: {employees: item.count},
}))`

const SHAPE_RULES = [
    "appearance='cells'(보고서): 높이 200 자리에 점마다 세로 점선 · 바닥 실선(gray.100)만 두고 y축 · 가로 눈금은 없습니다.",
    '양 끝 점은 가장자리에서 24 안쪽에 서고, 점 사이는 똑같이 나눕니다.',
    '선 두께 2 · 점 지름 12(흰 면 + 계열 색 테두리) · 면은 위 16% 에서 바닥 0% 로 옅어지는 계열 색입니다(variant="area").',
    '값은 점 바로 위 11 Regular(gray.600), 항목 이름은 바닥 아래 8 에 12 Regular(gray.700)입니다.',
    '가장 큰 값은 위에서 29%, 가장 작은 값은 위에서 80% 에 섭니다 — 위 · 아래에 값 글자와 면 자리가 늘 남습니다.',
    '좁은 화면에서는 점 사이가 좁아 값이 겹치지 않게 그래프 폭 576 을 지키고 그래프만 가로로 넘깁니다.',
] as const

const PROPS_ITEMS = [
    ['LineChart', 'data', '기간별 고유 id · 표시명과 series key 에 대응하는 값입니다.', '-', 'LineChartItem[]'],
    ['LineChart', 'series', '선마다 key · 표시명 · 색입니다.', '-', 'LineChartSeries[]'],
    [
        'LineChart',
        'appearance',
        "'cells' 는 분기별 종업원수 모양(점마다 세로 점선 · 바닥 실선 · 흰 점 · 옅어지는 면), 'columns' 는 주요재무비율 · 현금흐름 모양(항목 칸 가운데 점 · 여러 선 · 아래 사각 범례), 'default' 는 y축 · 가로 점선 눈금 · 아래 범례입니다.",
        "'default'",
        "'default' | 'cells' | 'columns'",
    ],
    [
        'LineChart',
        'legendPlacement',
        "columns 범례 자리 — 'bottom'(그래프 아래 왼쪽) 또는 'top-end'(그래프 위 오른쪽, 표 옆 카드)입니다.",
        "'bottom'",
        "'bottom' | 'top-end'",
    ],
    [
        'LineChart',
        'plotHeight',
        'columns 그릴 자리 높이(px)입니다. 200 · 180(신용/담보 비중) · 170(재무비율진단) · 140(에너지 사용량). 항목 이름 자리 26 은 같습니다.',
        '200',
        '140 | 170 | 180 | 200',
    ],
    ['LineChart', 'variant', "선만('line') 또는 선 아래 면을 채운 모양('area')입니다.", "'line'", "'line' | 'area'"],
    [
        'LineChart',
        'showValueLabels',
        '점에 값을 표시합니다. cells · columns 에서 선이 둘 이상이면 같은 시점에서 가장 아래 선의 값은 점 아래, 가장 위 선의 값은 점 위에 적어 서로 부딪히지 않습니다.',
        'false',
        'boolean',
    ],
    ['LineChart', 'showTooltip', '값 위에 올렸을 때 뜨는 말풍선입니다. 보고서에서는 끕니다.', 'true', 'boolean'],
    ['LineChart', 'showLegend', '아래 범례 표시 여부입니다.', 'true', 'boolean'],
    ['LineChart', 'curveType', '점 사이를 직선 또는 완만한 곡선으로 잇습니다.', "'linear'", "'linear' | 'monotone'"],
    ['LineChart', 'strokeDasharray', "선을 점선으로 그립니다(예: '4 4').", 'undefined', 'string'],
    [
        'LineChart',
        'unit · valueFractionDigits',
        '툴팁 · 숨김 표의 단위와 소수 자릿수입니다.',
        'undefined · 0',
        'string · number',
    ],
    [
        'LineChart',
        'yAxisDomain · yAxisStep · axisValueSuffix · showAxes',
        "y축 범위 · 눈금 간격 · 눈금 단위 기호 · 축 표시입니다('default' 전용. 'cells' 는 범위를 스스로 정합니다).",
        "데이터 범위 · undefined · '' · true",
        '[number, number] · number · string · boolean',
    ],
    ['LineChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
] as const

const SPECIAL_CASES = [
    {
        title: '급등 · 급락',
        description: '값 글자는 늘 점 바로 위에 붙습니다. 가장 큰 값도 위 29% 자리가 남아 칸 밖으로 나가지 않습니다.',
        data: SPIKE_DATA,
    },
    {title: '모두 같은 값', description: '폭이 0 이면 값을 세로 가운데에 두고 수평선으로 그립니다.', data: FLAT_DATA},
    {title: '점 하나', description: '점 하나를 가운데에 세우고 세로 점선도 하나만 긋습니다.', data: SINGLE_DATA},
    {
        title: '0 · 음수',
        description: '0 이나 음수가 있어도 가장 작은 값 아래 20% 가 남아 면과 점이 바닥선에 붙지 않습니다.',
        data: ZERO_NEGATIVE_DATA,
    },
    {
        title: '긴 숫자',
        description:
            '7자 이상 값은 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다. 화면 낭독기는 숨김 표의 원래 값을 읽습니다.',
        data: LONG_NUMBER_DATA,
    },
    {
        title: '점이 많을 때 (24개)',
        description:
            '항목 이름이 겹치면 처음 · 끝을 남기고 사이 이름을 건너뜁니다. 세로 점선과 값은 모든 점에 남습니다.',
        data: MANY_POINTS_DATA,
    },
] as const

// ── 칸형 여러 선(appearance="columns") — K-BIGx 보고서 기업현황 "주요재무비율 · 현금흐름" 카드 ──
const PALETTE = [
    'var(--raw-navy-500)',
    'var(--raw-blue-500)',
    'var(--raw-purple-500)',
    'var(--raw-mint-700)',
    'var(--raw-orange-500)',
] as const
const RATIO_ROWS = [
    ['operatingMargin', '영업이익률', [7.84, 8.52, 8.39]],
    ['debtRatio', '부채비율', [72.41, 77.16, 74.44]],
    ['receivablesTurnover', '매출채권회전율', [5.12, 4.87, 5.33]],
    ['salesGrowth', '매출액증가율', [9.35, 13.6, 13.38]],
    ['assetGrowth', '총자산증가율', [11.2, 67.61, 13.25]],
] as const
const YEARS = ['2022년', '2023년', '2024년'] as const

type ColumnsRow = readonly [string, string, readonly number[]]
const toColumnsChart = (rows: readonly ColumnsRow[], years: readonly string[] = YEARS) => ({
    series: rows.map(([key, label], index) => ({key, label, color: PALETTE[index % PALETTE.length]})),
    data: years.map((year, yearIndex) => ({
        id: year,
        label: year,
        values: Object.fromEntries(rows.map(([key, , values]) => [key, values[yearIndex] ?? 0])),
    })),
})

const RATIO_CHART = toColumnsChart(RATIO_ROWS)
const COLUMNS_SPECIAL_CASES = [
    {
        title: '음수 · 양수가 섞일 때 (현금흐름)',
        description:
            '0 을 기준으로 위 · 아래로 나뉘어도 값 폭 전체가 높이의 80% 에 맞춰지고 위 · 아래 10% 가 남아 점이 칸 끝에 붙지 않습니다.',
        chart: toColumnsChart([
            ['operating', '영업활동후 현금흐름', [1520, 2130, 1980]],
            ['financing', '재무활동후 현금흐름', [-420, 860, -310]],
            ['investing', '투자활동후 현금흐름', [-980, -1640, -1120]],
            ['netChange', '순현금변화', [120, 1350, 550]],
            ['gap', '영업활동 현금흐름과 순이익 차이', [910, 2370, 1160]],
        ]),
    },
    {
        title: '같은 값에서 겹치는 선',
        description:
            '두 선이 같은 점을 지나면 나중 선의 점이 위에 그려집니다. 색만으로 구분되지 않게 전체 값은 위 표와 숨김 표에 함께 둡니다.',
        chart: toColumnsChart([
            ['a', '영업이익률', [8, 10, 12]],
            ['b', '부채비율', [8, 12, 12]],
            ['c', '매출채권회전율', [14, 10, 6]],
        ]),
    },
    {
        title: '한 값만 매우 클 때',
        description:
            '가장 큰 값 기준으로 범위가 정해져 나머지 선은 아래로 모입니다(모양이 깨지지는 않음). 정확한 값은 위 표로 읽습니다.',
        chart: toColumnsChart([
            ['a', '총자산증가율', [11.2, 267.61, 13.25]],
            ['b', '영업이익률', [7.84, 8.52, 8.39]],
            ['c', '매출액증가율', [9.35, 13.6, 13.38]],
        ]),
    },
    {
        title: '모두 같은 값 · 항목 하나',
        description: '값 폭이 0 이면 가운데에 수평선으로, 항목(연도)이 하나면 칸 하나 가운데에 점만 섭니다.',
        chart: toColumnsChart(
            [
                ['a', '영업이익률', [10]],
                ['b', '부채비율', [10]],
            ],
            ['2024년'],
        ),
    },
    {
        title: '연도가 많을 때 (8개)',
        description:
            '칸 폭 80 × 항목 수를 최소 폭으로 지켜 점 · 항목 이름이 겹치지 않고, 모자라면 그래프만 가로로 넘깁니다.',
        chart: toColumnsChart(
            [
                ['a', '영업이익률', [6, 7, 7.5, 8, 7.8, 8.5, 8.4, 9]],
                ['b', '매출액증가율', [4, 6, 9, 12, 10, 13, 13.4, 11]],
            ],
            ['2017년', '2018년', '2019년', '2020년', '2021년', '2022년', '2023년', '2024년'],
        ),
    },
    {
        title: '긴 범례 이름',
        description: '범례는 여러 줄로 접히고(간격 가로 24 · 세로 8), 이름은 줄 안에서 자르지 않습니다.',
        chart: toColumnsChart([
            ['a', '영업활동 현금흐름과 순이익 차이', [910, 2370, 1160]],
            ['b', '재무활동후 현금흐름(차입금 상환 포함)', [-420, 860, -310]],
            ['c', '순현금변화', [120, 1350, 550]],
        ]),
    },
] as const

const COLUMNS_USAGE_CODE = `<LineChart
  appearance="columns"
  showTooltip={false}
  ariaLabel="연도별 주요재무비율"
  unit="%"
  valueFractionDigits={2}
  data={data}     // [{id: '2022년', label: '2022년', values: {operatingMargin: 7.84, …}}, …]
  series={series} // [{key: 'operatingMargin', label: '영업이익률', color: 'var(--raw-navy-500)'}, …]
/>`

const COLUMNS_SHAPE_RULES = [
    '높이 200 칸 상자 — 위 선 없이 바닥 · 양 끝 실선, 항목 사이 점선(gray.100). 점은 각 칸 가운데에 섭니다.',
    '선 두께 2 · 점 지름 12(흰 면 + 계열 색 테두리). 값 글자와 면은 없습니다 — 값은 카드의 표로 읽습니다.',
    '값 폭(최솟값~최댓값)이 높이의 80% 를 쓰고 위 · 아래 10% 씩 비웁니다.',
    '범례는 그래프 아래 8 에 16 사각 견본 + 14 Regular, 가로 24 · 세로 8 간격으로 왼쪽부터 접힙니다.',
    '색은 행 순서대로 navy.500 · blue.500 · purple.500 · mint.700 · orange.500 입니다.',
] as const

const LineChartGuidePage = () => (
    <GuidePageShell
        title="선 그래프 (LineChart)"
        description="기간에 따라 값이 바뀌는 흐름을 점과 선(필요하면 면)으로 보여 주는 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="lc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="lc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 분기별 종업원수 카드(appearance=&quot;cells&quot;)입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                    <LineChart
                        appearance="cells"
                        variant="area"
                        data={EMPLOYEE_DATA}
                        series={EMPLOYEE_SERIES}
                        showLegend={false}
                        showValueLabels
                        showTooltip={false}
                        ariaLabel="분기별 종업원수 추이"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="lc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="lc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="lc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값의 범위 · 개수 · 길이가 달라 값 글자나 선이 칸 밖으로 나가거나 겹칠 수 있는 경우입니다
                        (appearance=&quot;cells&quot;). 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <LineChart
                                appearance="cells"
                                variant="area"
                                data={[...item.data]}
                                series={EMPLOYEE_SERIES}
                                showLegend={false}
                                showValueLabels
                                showTooltip={false}
                                ariaLabel={item.title}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="lc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;cells-line&quot;</code>를 같은 자리에
                        둡니다. 세로 점선 · 바닥선 · 선과 면 · 항목 이름 자리와 전체 높이(226)가 실제 그래프와 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <LineChart
                            appearance="cells"
                            variant="area"
                            data={EMPLOYEE_DATA}
                            series={EMPLOYEE_SERIES}
                            showLegend={false}
                            showValueLabels
                            showTooltip={false}
                            ariaLabel="분기별 종업원수 추이"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-columns" className="flex flex-col gap-4">
                <div>
                    <h2 id="lc-columns" className="typo-h4-bold">
                        칸형 여러 선 (appearance=&quot;columns&quot;)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 보고서 기업현황 탭의 주요재무비율 · 현금흐름 카드 그래프입니다. 같은 LineChart 의 모양
                        옵션이라 이 문서에 함께 둡니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-150 rounded-sm border p-6">
                    <LineChart
                        appearance="columns"
                        showTooltip={false}
                        ariaLabel="연도별 주요재무비율"
                        unit="%"
                        valueFractionDigits={2}
                        data={RATIO_CHART.data}
                        series={RATIO_CHART.series}
                    />
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                    {COLUMNS_SHAPE_RULES.map((rule) => (
                        <li key={rule} className="flex">
                            <ListMarker type="unordered" />
                            <span className="min-w-0">{rule}</span>
                        </li>
                    ))}
                </ul>
                <CodeBlock code={COLUMNS_USAGE_CODE} language="tsx" copyLabel="복사" />
                <h3 className="typo-body-xl-bold">특이 케이스</h3>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {COLUMNS_SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h4 className="typo-body-l-bold">{item.title}</h4>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <LineChart
                                appearance="columns"
                                showTooltip={false}
                                ariaLabel={item.title}
                                data={item.chart.data}
                                series={item.chart.series}
                            />
                        </li>
                    ))}
                </ul>
                <h3 className="typo-body-xl-bold">로딩</h3>
                <p className="typo-body-m-regular text-muted-foreground">
                    데이터를 기다리는 동안은{' '}
                    <code className="font-mono">ChartSkeleton type=&quot;columns-line&quot;</code>를 둡니다 — 칸 상자 ·
                    선 · 항목 이름 · 아래 범례 자리가 같습니다.
                </p>
                <div className="max-w-150">
                    <ChartSkeleton type="columns-line" label="주요재무비율을 불러오는 중입니다." />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="lc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 기간별 값을 LineChartItem 으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="LineChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-props" className="flex flex-col gap-4">
                <h2 id="lc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="LineChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LineChartGuidePage
