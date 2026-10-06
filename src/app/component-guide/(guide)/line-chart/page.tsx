// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {cn} from '@/lib/utils'
import {LineChart, type LineChartItem, type LineChartSeries} from '@/components/custom/line-chart'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '선 그래프 (LineChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

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
  showTooltip={false}
  ariaLabel="분기별 종업원수 추이"
/>`

const COLUMNS_USAGE_CODE = `<LineChart
  appearance="columns"
  showTooltip={false}
  ariaLabel="연도별 주요재무비율"
  unit="%"
  valueFractionDigits={2}
  data={data}     // [{id: '2022년', label: '2022년', values: {operatingMargin: 7.84, …}}, …]
  series={series} // [{key: 'operatingMargin', label: '영업이익률', color: 'var(--raw-navy-500)'}, …]
/>`

const DEFAULT_USAGE_CODE = `<LineChart
  data={data}
  series={series}
  unit="명"
  yAxisStep={10}
  ariaLabel="분기별 종업원수 추이"
/>`

const DATA_CODE = `// API 응답을 LineChartItem 으로 바꾼다. series 의 key 와 values 의 키가 같아야 한다.
const data: LineChartItem[] = employeesFromApi.map((item) => ({
  id: item.baseYearQuarter, // 고유 값. 예: '2025-09'
  label: item.label,        // 가로축 이름. 예: '25.09월'
  values: {employees: item.count},
}))`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

{isLoading ? (
  <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
) : (
  <LineChart appearance="cells" … />
)}`

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'line',
        cells: [
            '기간별 숫자 값',
            <code key="component">LineChart</code>,
            '숫자 값이 시간에 따라 변하는 흐름입니다. 선이 여러 개여도 됩니다.',
        ],
    },
    {
        key: 'trend',
        cells: [
            '기간별 등급(AAA~C)과 평가대상 하나',
            <Link
                key="component"
                href="/component-guide/grade-trend-chart"
                className="text-primary-strong underline underline-offset-4"
            >
                GradeTrendChart
            </Link>,
            '세로축이 숫자가 아니라 등급 눈금이고, 선과 다른 값의 평가대상 점을 함께 둡니다.',
        ],
    },
    {
        key: 'history',
        cells: [
            '평가 시점별 등급 이력',
            <Link
                key="component"
                href="/component-guide/grade-history-chart"
                className="text-primary-strong underline underline-offset-4"
            >
                GradeHistoryChart
            </Link>,
            '시점마다 등급 글자가 든 원을 찍어 이력을 보여 줍니다.',
        ],
    },
] as const

const SPECIAL_CASES = [
    {title: '급등 · 급락', description: '값 글자가 선과 겹치지 않고 점 가까이에 붙습니다.', data: SPIKE_DATA},
    {title: '모두 같은 값', description: '값 폭이 0 이면 수평선을 세로 가운데에 그립니다.', data: FLAT_DATA},
    {title: '점 하나', description: '점과 세로 점선이 가운데에 하나만 놓입니다.', data: SINGLE_DATA},
    {
        title: '0 · 음수',
        description: '가장 작은 값 아래에 여백이 남아 면과 점이 바닥선에 붙지 않습니다.',
        data: ZERO_NEGATIVE_DATA,
    },
    {
        title: '긴 숫자',
        description: '값 글자가 길면 “123.5만”처럼 줄여 적습니다. 숨김 표에는 원래 값이 들어갑니다.',
        data: LONG_NUMBER_DATA,
    },
    {
        title: '점이 많을 때 (24개)',
        description: '항목 이름이 겹치면 처음과 끝만 남기고 건너뜁니다. 세로 점선과 값은 모든 점에 남습니다.',
        data: MANY_POINTS_DATA,
    },
] as const

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
        title: '음수와 양수가 섞일 때',
        description: '0 을 기준으로 위아래에 걸쳐도 값 폭 전체가 높이의 80% 안에 놓입니다.',
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
        description: '두 선이 같은 점을 지나면 나중 선의 점이 위에 그려집니다. 정확한 값은 별도 표로 함께 제공합니다.',
        chart: toColumnsChart([
            ['a', '영업이익률', [8, 10, 12]],
            ['b', '부채비율', [8, 12, 12]],
            ['c', '매출채권회전율', [14, 10, 6]],
        ]),
    },
    {
        title: '한 값만 매우 클 때',
        description: '가장 큰 값 기준으로 범위가 정해져 나머지 선은 아래로 모입니다.',
        chart: toColumnsChart([
            ['a', '총자산증가율', [11.2, 267.61, 13.25]],
            ['b', '영업이익률', [7.84, 8.52, 8.39]],
            ['c', '매출액증가율', [9.35, 13.6, 13.38]],
        ]),
    },
    {
        title: '모두 같은 값 · 항목 하나',
        description: '값 폭이 0 이면 가운데 수평선, 항목이 하나면 칸 하나의 가운데에 점만 놓입니다.',
        chart: toColumnsChart(
            [
                ['a', '영업이익률', [10]],
                ['b', '부채비율', [10]],
            ],
            ['2024년'],
        ),
    },
    {
        title: '항목이 많을 때 (8개)',
        description: '칸 최소 폭(80px)을 지키고, 모자라면 그래프만 가로로 스크롤됩니다.',
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
        description: '범례는 여러 줄로 접히고 이름은 잘리지 않습니다.',
        chart: toColumnsChart([
            ['a', '영업활동 현금흐름과 순이익 차이', [910, 2370, 1160]],
            ['b', '재무활동후 현금흐름(차입금 상환 포함)', [-420, 860, -310]],
            ['c', '순현금변화', [120, 1350, 550]],
        ]),
    },
] as const

const PROPS_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const PROPS_ITEMS = [
    ['LineChart', 'data', '기간별 고유 id · 표시명과 series key 에 대응하는 값입니다.', '-', 'LineChartItem[]'],
    ['LineChart', 'series', '선마다 key · 표시명 · 색입니다. 색은 토큰 변수를 씁니다.', '-', 'LineChartSeries[]'],
    ['LineChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    [
        'LineChart',
        'appearance',
        "틀 모양입니다. 'default' 는 y축 · 가로 점선 눈금 · 아래 범례, 'cells' 는 점마다 세로 점선과 바닥선만 둔 카드형, 'columns' 는 항목 칸 가운데에 점을 세우는 여러 선 겹침형입니다.",
        "'default'",
        "'default' | 'cells' | 'columns'",
    ],
    ['LineChart', 'variant', "선만('line') 또는 선 아래 면을 채운 모양('area')입니다.", "'line'", "'line' | 'area'"],
    ['LineChart', 'curveType', '점 사이를 직선 또는 곡선으로 잇습니다.', "'linear'", "'linear' | 'monotone'"],
    ['LineChart', 'strokeDasharray', "선을 점선으로 그립니다. 예: '4 4'", 'undefined', 'string'],
    [
        'LineChart',
        'showValueLabels',
        '점에 값 글자를 적습니다. cells · columns 에서 선이 여러 개면 같은 시점의 가장 아래 선은 점 아래, 가장 위 선은 점 위에 적어 겹침을 피합니다.',
        'false',
        'boolean',
    ],
    ['LineChart', 'showTooltip', '값 위에 올렸을 때의 말풍선과 강조 점입니다.', 'true', 'boolean'],
    ['LineChart', 'showLegend', '범례 표시 여부입니다.', 'true', 'boolean'],
    ['LineChart', 'animate', '그리는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    [
        'LineChart',
        'unit',
        '툴팁과 숨김 표 머리글에 붙는 단위입니다. default 모양은 차트 왼쪽 위에도 표시합니다.',
        'undefined',
        'string',
    ],
    ['LineChart', 'valueFractionDigits', '값의 소수 자릿수입니다. 0~6 으로 맞춥니다.', '0', 'number'],
    ['LineChart', 'showAxes', "축과 눈금선 표시 여부입니다('default' 전용).", 'true', 'boolean'],
    ['LineChart', 'yAxisDomain', "y축 범위입니다('default' 전용).", '데이터 범위', '[number, number]'],
    ['LineChart', 'yAxisStep', "y축 눈금 간격입니다('default' 전용).", 'undefined', 'number'],
    ['LineChart', 'axisValueSuffix', "y축 눈금 숫자 뒤에 붙는 기호입니다('default' 전용).", "''", 'string'],
    [
        'LineChart',
        'legendPlacement',
        "columns 범례 자리입니다. 'top-end' 는 그래프 위 오른쪽입니다.",
        "'bottom'",
        "'bottom' | 'top-end'",
    ],
    [
        'LineChart',
        'plotHeight',
        'columns 그릴 자리 높이(px)입니다. 항목 이름 자리(26)는 따로 더해집니다.',
        '200',
        '140 | 170 | 180 | 200',
    ],
] as const

const PROPS_ROWS = PROPS_ITEMS.map(([, name, note, defaultValue, type]) => ({
    key: name,
    cells: [
        <code key="prop">{name}</code>,
        <code key="type">{type}</code>,
        <code key="default">{defaultValue}</code>,
        note,
    ],
}))

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const FRAME_CLASS = 'border-subtle-3 bg-card rounded-sm border p-6'

const LineChartGuidePage = () => (
    <GuidePageShell
        title="선 그래프 (LineChart)"
        description="기간에 따라 값이 바뀌는 흐름을 점과 선(필요하면 면)으로 보여 주는 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="lc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 의 <code>values</code> 키가 <code>series</code> 의 <code>key</code> 와 같아야
                        합니다. 틀 모양은 <code>appearance</code> 로 고릅니다.
                    </p>
                </div>
                <div className={FRAME_CLASS}>
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
            <section aria-labelledby="lc-appearance" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-appearance" className="typo-h4-bold">
                        틀 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>appearance</code> 세 가지와 각 모양의 로딩 스켈레톤입니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">default</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            y축과 가로 점선 눈금, 아래 범례가 있습니다. 값은 말풍선으로 읽습니다.
                        </p>
                        <div className={FRAME_CLASS}>
                            <LineChart
                                data={EMPLOYEE_DATA}
                                series={EMPLOYEE_SERIES}
                                unit="명"
                                yAxisStep={10}
                                ariaLabel="분기별 종업원수 추이"
                            />
                        </div>
                        <CodeBlock code={DEFAULT_USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">cells</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            점마다 세로 점선과 바닥선만 두고 y축은 숨깁니다. 양 끝 점은 가장자리에서 24px 안쪽에 서고,
                            값 글자는 점 위에 적습니다. 좁은 화면에서는 그래프 폭(576px)을 지키고 가로로 스크롤됩니다.
                            로딩에는 <code>ChartSkeleton type=&quot;cells-line&quot;</code> 를 같은 자리에 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <ChartSkeleton type="cells-line" label="분기별 종업원수를 불러오는 중입니다." />
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
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">columns</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            항목마다 칸을 나누고 점을 칸 가운데에 세워 여러 선을 겹쳐 보입니다. 범례는 사각 견본이고, 값
                            글자는 쓰지 않고 별도 표로 읽게 합니다. 칸 최소 폭은 80px 입니다. 로딩에는{' '}
                            <code>ChartSkeleton type=&quot;columns-line&quot;</code> 를 씁니다.
                        </p>
                        <div className={cn(FRAME_CLASS, 'max-w-150')}>
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
                        <div className="max-w-150">
                            <ChartSkeleton type="columns-line" label="주요재무비율을 불러오는 중입니다." />
                        </div>
                        <CodeBlock code={COLUMNS_USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-special" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-special" className="typo-h4-bold">
                        특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값의 범위 · 개수 · 길이가 달라도 컴포넌트가 처리하므로 받은 값을 그대로 넘기면 됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">cells</h3>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
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
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">columns</h3>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {COLUMNS_SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        API 의 기간별 값을 <code>LineChartItem</code> 으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        세로축의 값이 숫자인지 등급인지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="LineChart · GradeTrendChart · GradeHistoryChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        차트 값을 글로도 제공하므로 사용처는 의미 있는 <code>ariaLabel</code> 만 넘기면 됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 붙입니다[5.1.1].
                    </li>
                    <li>
                        같은 값을 담은 숨김 표(<code>caption</code> · <code>th scope</code>)가 함께 렌더링되어 화면
                        낭독기가 값을 읽습니다[7.3.2]. 줄여 적은 값 글자도 숨김 표에는 원래 값이 들어갑니다.
                    </li>
                    <li>
                        선 색만으로 계열을 구분하지 않도록 범례 텍스트를 함께 두고, columns 는 값을 별도 표로
                        제공합니다[5.3.1].
                    </li>
                    <li>
                        <code>animate</code> 로 움직임을 끌 수 있습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="lc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>series</code> · <code>ariaLabel</code> 이 필수입니다. 나머지
                        <code> div</code> 속성은 루트 요소에 전달됩니다.
                    </p>
                </div>
                <Table caption="LineChart Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} size="md" />
                <div className="flex flex-col gap-3">
                    <h3 className="typo-title-m-bold text-foreground">데이터 타입</h3>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                        <li>
                            <code>LineChartItem</code>:{' '}
                            <code>{'{id: string; label: string; values: Record<string, number>}'}</code>
                        </li>
                        <li>
                            <code>LineChartSeries</code>: <code>{'{key: string; label: string; color: string}'}</code>
                        </li>
                    </ul>
                </div>
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LineChartGuidePage
