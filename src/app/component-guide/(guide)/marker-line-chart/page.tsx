// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {MarkerLineChartSkeleton} from '@/components/composite/marker-line-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {
    MarkerLineChart,
    MarkerLineLegend,
    type MarkerLineItem,
    type MarkerLineSeries,
} from '@/components/custom/marker-line-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '표식 꺾은선 (MarkerLineChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'
const LEGEND_CLASS = 'typo-body-m-regular text-foreground-subtle'
const SERIES_COLORS = [
    'var(--ds-report-series-1)',
    'var(--ds-report-series-2)',
    'var(--ds-report-series-3)',
    'var(--ds-report-series-4)',
    'var(--ds-report-series-5)',
] as const
const YEARS = ['2022년', '2023년', '2024년'] as const

const toSeries = (labels: readonly string[]): MarkerLineSeries[] =>
    labels.map((label, index) => ({key: `s${index}`, label, color: SERIES_COLORS[index % SERIES_COLORS.length]}))

// 계열별 값 줄 → 차트 데이터.
const toData = (
    rows: readonly (readonly (number | undefined)[])[],
    labels: readonly string[] = YEARS,
): MarkerLineItem[] =>
    labels.map((label, index) => ({
        id: label,
        label,
        values: Object.fromEntries(rows.map((row, rowIndex) => [`s${rowIndex}`, row[index]])),
    }))

// 템플릿 데이터.
const RATIO_SERIES = toSeries(['영업이익률', '부채비율', '매출채권회전율', '매출액증가율', '총자산증가율'])
const RATIO_DATA = toData([
    [7.84, 8.52, 8.39],
    [72.41, 77.16, 74.44],
    [5.12, 4.87, 5.33],
    [9.35, 13.6, 13.38],
    [11.2, 67.61, 13.25],
])
// 한 줄 전체 폭(1168) — 신용/재무정보 재무비율진단(성장성).
const WIDE_SERIES = toSeries(['매출액증가율', '총자산증가율', '순이익증가율', '영업이익증가율'])
const WIDE_DATA = toData([
    [7.15, 5.84, 7.42],
    [12.36, 13.1, 12.52],
    [15.02, 10.74, 16.37],
    [3.2, 4.1, 2.85],
])
const CASH_SERIES = toSeries([
    '영업활동후 현금흐름',
    '재무활동후 현금흐름',
    '투자활동후 현금흐름',
    '순현금변화',
    '영업활동 현금흐름과 순이익 차이',
])
const CASH_DATA = toData([
    [1520, 2130, 1980],
    [-420, 860, -310],
    [-980, -1640, -1120],
    [120, 1350, 550],
    [910, 2370, 1160],
])
// 3. 엣지 케이스.
const TWO_SERIES = toSeries(['영업이익률', '부채비율'])
const TWO_DATA = toData([
    [7.84, 8.52, 8.39],
    [72.41, 77.16, 74.44],
])
const MISSING_DATA = toData([
    [7.84, undefined, 8.39],
    [72.41, 77.16, 74.44],
    [undefined, 4.87, 5.33],
])
const MISSING_SERIES = toSeries(['영업이익률', '부채비율', '매출채권회전율'])
const FIVE_YEARS = ['2020년', '2021년', '2022년', '2023년', '2024년'] as const
const FIVE_YEAR_DATA = toData(
    [
        [6.1, 7.2, 7.84, 8.52, 8.39],
        [64.3, 68.9, 72.41, 77.16, 74.44],
        [4.6, 4.9, 5.12, 4.87, 5.33],
    ],
    FIVE_YEARS,
)
const SIX_SERIES = toSeries(['계열 1', '계열 2', '계열 3', '계열 4', '계열 5', '계열 6'])
const SIX_DATA = toData([
    [12, 18, 15],
    [28, 34, 31],
    [44, 40, 48],
    [58, 63, 61],
    [72, 70, 78],
    [86, 92, 89],
])

const EDGE_CASES = [
    {
        key: 'two',
        title: '계열 둘',
        description: '계열 수만큼 앞에서부터 모양을 씁니다(실선 + 빈 원, 점선 + 채운 원).',
        data: TWO_DATA,
        series: TWO_SERIES,
    },
    {
        key: 'missing',
        title: '값 없음',
        description: '값이 없는 점(undefined)은 그 계열의 선을 끊고 점을 그리지 않습니다.',
        data: MISSING_DATA,
        series: MISSING_SERIES,
    },
    {
        key: 'five-years',
        title: '항목이 다섯(5개년)',
        description: '점은 항목 칸 가운데에 놓고, 칸 사이에 점선을 긋습니다.',
        data: FIVE_YEAR_DATA,
        series: MISSING_SERIES,
    },
    {
        key: 'six',
        title: '계열이 다섯을 넘을 때',
        description: '모양은 처음부터 다시 씁니다(6번째 = 실선 + 빈 원). 색을 계열마다 다르게 넘겨 구분합니다.',
        data: SIX_DATA,
        series: SIX_SERIES.map((line, index) => (index === 5 ? {...line, color: 'var(--ds-gray-500)'} : line)),
    },
] as const

const USAGE_CODE = `import {MarkerLineChart, MarkerLineLegend} from '@/components/custom/marker-line-chart'

const series = [
  {key: 'operating', label: '영업이익률', color: 'var(--ds-report-series-1)'},
  {key: 'debt', label: '부채비율', color: 'var(--ds-report-series-2)'},
  // … 순서대로 선 · 점 모양이 바뀝니다
]

<MarkerLineChart ariaLabel="연도별 주요재무비율 추이" series={series} data={ratios} />
<MarkerLineLegend series={series} className="typo-body-m-regular text-foreground-subtle" />`

const LOADING_CODE = `import {MarkerLineChartSkeleton} from '@/components/composite/marker-line-chart-skeleton'

{isLoading ? (
  <MarkerLineChartSkeleton groupCount={3} seriesCount={5} label="주요재무비율을 불러오는 중입니다." />
) : (
  <MarkerLineChart data={ratios} series={series} ariaLabel="연도별 주요재무비율 추이" />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 표 → 그래프 → 범례(가운데), 간격 16(kbigx-print-company.tsx).
<MarkerLineChart
  data={…}
  series={rows.map((row, index) => ({key: row.key, label: row.label, color: MARKER_SERIES_COLORS[index]}))}
  colors={{
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-border)',
    category: 'var(--kbx-color-foreground)',
    dotFill: 'var(--kbx-color-paper)',
  }}
  ariaLabel="연도별 주요재무비율 추이"
/>
<MarkerLineLegend series={series} dotFill="var(--kbx-color-paper)" className="kbx-text-16 text-kbx-foreground-subtle" />`

const STYLE_ROWS = [
    ['1', '실선', '빈 원(반지름 7 · 테두리 3)'],
    ['2', '점선 2 7(둥근 끝)', '채운 원(반지름 8)'],
    ['3', '일점쇄선 14 6 3 6', '네모(14)'],
    ['4', '파선 9 7', '마름모(반 대각선 9)'],
    ['5', '실선', '세모(높이 16)'],
] as const

const PROPS_ITEMS = [
    ['MarkerLineChart', 'data', '항목(기간) 목록입니다. values 는 계열 key → 값.', '-', 'readonly MarkerLineItem[]'],
    [
        'MarkerLineChart',
        'series',
        '계열 목록입니다. 순서대로 선 · 점 모양이 바뀝니다.',
        '-',
        'readonly MarkerLineSeries[]',
    ],
    ['MarkerLineChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    [
        'MarkerLineChart',
        'colors',
        '선 · 글자 색(baseline · divider · category · dotFill)입니다. 넘기지 않으면 웹 시맨틱 색입니다.',
        '웹 시맨틱 색',
        'Partial<MarkerLineColors>',
    ],
    ['MarkerLineChart', 'formatValue', '숨김 목록의 값 형식입니다.', '천 단위 쉼표', '(value: number) => string'],
    [
        'MarkerLineChart',
        'width',
        '그림 폭(SVG 좌표)입니다. 한 줄 전체 폭 그래프는 1168 — 높이 · 글자 · 점 크기는 그대로입니다.',
        '560',
        'number',
    ],
    [
        'MarkerLineChart',
        'height',
        '그림 높이(SVG 좌표)입니다. 바닥선 = 높이 − 40, 항목 이름 = 높이 − 10 — 그림 영역만 줄거나 늘어납니다.',
        '300',
        'number',
    ],
    [
        'MarkerLineLegend',
        'series',
        '그래프와 같은 계열 목록입니다(같은 순서 · 모양).',
        '-',
        'readonly MarkerLineSeries[]',
    ],
    ['MarkerLineLegend', 'dotFill', '빈 원 견본의 안쪽 면 색입니다.', "'var(--ds-card)'", 'string'],
    ['MarkerLineLegend', 'className', '글자 크기 · 색 등입니다.', 'undefined', 'string'],
    [
        'MarkerLineChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    ['MarkerLineChartSkeleton', 'groupCount · seriesCount', '항목 수 · 계열 수입니다.', '3 · 3', 'number'],
    ['MarkerLineChartSkeleton', 'width', '실제 차트와 같은 그림 폭입니다.', '560', 'number'],
    ['MarkerLineChartSkeleton', 'height', '실제 차트와 같은 그림 높이입니다.', '300', 'number'],
] as const

const Example = ({title, description, children}: {title: string; description: string; children: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <p className="typo-body-xl-bold text-foreground">{title}</p>
        <p className="typo-body-m-regular text-foreground-subtle break-keep">{description}</p>
        <div className="border-subtle-3 bg-card flex flex-col gap-4 rounded-sm border p-6">{children}</div>
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

const MarkerLineChartGuidePage = () => (
    <GuidePageShell
        title="표식 꺾은선 (MarkerLineChart)"
        description="여러 계열의 추이를 계열마다 다른 선 모양과 점 모양으로 그리는 차트입니다. 색만으로 구분하지 않습니다. K-BIGx 보고서 PDF 템플릿 기업현황의 주요재무비율 · 현금흐름, 신용/재무정보의 재무비율진단, 활동성정보의 에너지 사용량 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="mlc-basic" className="flex flex-col gap-6">
                <SectionHeading id="mlc-basic" title="1. 기본 사용">
                    그림 폭 560 기준으로 그리고, 범례(MarkerLineLegend)는 그래프 아래에 따로 둡니다. 세로축 · 툴팁이
                    있는 웹 화면용 선 그래프는{' '}
                    <Link href="/component-guide/line-chart" className={LINK_CLASS}>
                        LineChart
                    </Link>
                    입니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="주요재무비율" description="모두 0 이상 — 0 ~ 80(77.16 을 10 단위로 올림).">
                        <MarkerLineChart data={RATIO_DATA} series={RATIO_SERIES} ariaLabel="주요재무비율 예시" />
                        <MarkerLineLegend series={RATIO_SERIES} className={LEGEND_CLASS} />
                    </Example>
                    <Example title="현금흐름" description="음수가 있으면 작은 끝을 내려 0 선 아래까지 그립니다.">
                        <MarkerLineChart data={CASH_DATA} series={CASH_SERIES} ariaLabel="현금흐름 예시" />
                        <MarkerLineLegend series={CASH_SERIES} className={LEGEND_CLASS} />
                    </Example>
                </div>
                <Example
                    title="한 줄 전체 폭 (width 1168)"
                    description="신용/재무정보 재무비율진단. 폭만 넓어지고 높이 300 · 글자 · 점 크기는 같습니다."
                >
                    <MarkerLineChart
                        width={1168}
                        data={WIDE_DATA}
                        series={WIDE_SERIES}
                        ariaLabel="성장성 재무비율 예시"
                    />
                    <MarkerLineLegend series={WIDE_SERIES} className={LEGEND_CLASS} />
                </Example>
                <Example
                    title="낮은 그림 (width 1168 · height 240)"
                    description="활동성정보 에너지 사용량. 바닥선 y 200 · 항목 이름 y 230 으로 그림 영역만 줄어듭니다."
                >
                    <MarkerLineChart
                        width={1168}
                        height={240}
                        data={WIDE_DATA}
                        series={WIDE_SERIES.slice(0, 3)}
                        ariaLabel="전기 사용량 예시"
                    />
                    <MarkerLineLegend series={WIDE_SERIES.slice(0, 3)} className={LEGEND_CLASS} />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mlc-rule" className="flex flex-col gap-6">
                <SectionHeading id="mlc-rule" title="2. 짜임 · 계열 모양" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        점은 항목 칸 가운데, 칸 사이 세로 점선(y 16 ~ 260), 바닥선 y 260, 항목 이름 y 290(19px)입니다.
                    </li>
                    <li>
                        값 범위 — 모두 0 이상이면 0 ~ 큰 끝을 윗자리 단위로 올림(77.16 → 80). 음수가 있으면 작은 끝은
                        윗자리 단위로 내리고 큰 끝은 그 1/5 단위로 올립니다(-1,640 ~ 2,370 → -2,000 ~ 2,400).
                    </li>
                    <li>값 글자는 적지 않습니다 — 값은 함께 두는 표와 숨김 목록으로 읽습니다.</li>
                </ul>
                <div className="overflow-x-auto">
                    <table className="typo-body-m-regular text-foreground w-full">
                        <caption className="sr-only">계열 순서별 선 · 점 모양</caption>
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-start">
                                    순서
                                </th>
                                <th scope="col" className="px-4 py-3 text-start">
                                    선
                                </th>
                                <th scope="col" className="px-4 py-3 text-start">
                                    점
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {STYLE_ROWS.map(([order, line, marker]) => (
                                <tr key={order} className="border-border border-b">
                                    <th scope="row" className="px-4 py-3 text-start font-normal">
                                        {order}
                                    </th>
                                    <td className="px-4 py-3">{line}</td>
                                    <td className="px-4 py-3">{marker}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mlc-edge" className="flex flex-col gap-6">
                <SectionHeading id="mlc-edge" title="3. 엣지 케이스">
                    계열 수 · 항목 수 · 값 없음에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <MarkerLineChart data={item.data} series={item.series} ariaLabel={`${item.title} 예시`} />
                            <MarkerLineLegend series={item.series} className={LEGEND_CLASS} />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mlc-loading" className="flex flex-col gap-6">
                <SectionHeading id="mlc-loading" title="4. 불러오는 중 (MarkerLineChartSkeleton)">
                    차트와 같은 그림 범위(560 × 300)에 바닥선 · 선 · 점 · 항목 이름 자리를 그립니다. PDF 템플릿은
                    데이터를 받은 뒤 서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <MarkerLineChartSkeleton seriesCount={5} label="주요재무비율을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <MarkerLineChart data={RATIO_DATA} series={RATIO_SERIES} ariaLabel="불러온 뒤 예시" />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mlc-print" className="flex flex-col gap-6">
                <SectionHeading id="mlc-print" title="5. K-BIGx PDF 템플릿에서">
                    기업현황 재무현황 칸(폭 556) 안에서 표 → 그래프 → 범례 순서로 16 간격입니다. 신용/재무정보
                    재무비율진단은 <code>width={'{1168}'}</code> 로 표 아래 30 · 범례는 그래프 아래 10 입니다. 확인
                    화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=company"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 기업현황
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mlc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="mlc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 계열마다
                        기간별 값을 화면에 보이지 않는 목록으로도 읽어 줍니다[5.1.1].
                    </li>
                    <li>계열을 색 · 선 모양 · 점 모양 세 가지로 구분해 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>범례 견본 그림은 꾸밈이라 낭독하지 않습니다(aria-hidden). 계열 이름은 글자로 읽습니다.</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mlc-props" className="flex flex-col gap-6">
                <SectionHeading id="mlc-props" title="7. Props API">
                    <code>data</code> · <code>series</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable
                    items={PROPS_ITEMS}
                    caption="MarkerLineChart · MarkerLineLegend · MarkerLineChartSkeleton Props 목록"
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MarkerLineChartGuidePage
