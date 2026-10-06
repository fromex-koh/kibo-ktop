// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {ColumnChart, type ColumnChartItem} from '@/components/custom/column-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '세로 막대 (ColumnChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const REPORT_COLOR = 'var(--raw-blue-500)'

const toItems = (entries: readonly (readonly [string, number])[]): ColumnChartItem[] =>
    entries.map(([label, value]) => ({id: label, label, value}))

const REPORT_DATA = toItems([
    ['2022년', 456.1],
    ['2023년', 452.9],
    ['2024년', 466.5],
])

const TOP_EDGE_DATA = toItems([
    ['2022년', 466.5],
    ['2023년', 466.5],
    ['2024년', 466.5],
])
const BOTTOM_EDGE_DATA = toItems([
    ['2022년', 0],
    ['2023년', 0.4],
    ['2024년', 466.5],
])
const NEGATIVE_DATA = toItems([
    ['2022년', 120.5],
    ['2023년', -84.2],
    ['2024년', 36.8],
])
const LONG_NUMBER_DATA = toItems([
    ['2022년', 1234567.8],
    ['2023년', 987654.3],
    ['2024년', 1500000],
])
const MANY_ITEMS_DATA = toItems([
    ['2017년', 312.4],
    ['2018년', 338.9],
    ['2019년', 355.1],
    ['2020년', 401.7],
    ['2021년', 428.3],
    ['2022년', 456.1],
    ['2023년', 452.9],
    ['2024년', 466.5],
])
const SINGLE_DATA = toItems([['2024년', 466.5]])

const USAGE_CODE = `import {ColumnChart} from '@/components/custom/column-chart'

<ColumnChart
  variant="cells"
  data={data}
  color="var(--raw-blue-500)"
  barWidth={48}
  valueFractionDigits={1}
  showTooltip={false}
  ariaLabel="연도별 인당 매출액"
/>`

const DATA_CODE = `// API 값을 ColumnChartItem 으로 바꿔 넘긴다. id 는 항목마다 고유해야 한다.
const data: ColumnChartItem[] = salesPerEmployeeFromApi.map((item) => ({
  id: String(item.year),
  label: \`\${item.year}년\`,
  value: item.amount,
}))`

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
            'y축 · 점선 눈금 · 위 모서리가 둥근 막대, 막대 위 값. 단위 글자를 그림 안에 둡니다.',
            '화면 안의 일반 그래프',
        ],
    },
    {
        key: 'cells',
        cells: [
            <code key="v">cells</code>,
            '칸 상자(바닥 · 양 끝 실선, 항목 사이 점선)에 막대와 값. y축 · 눈금 · 단위 글자가 없습니다.',
            '보고서 카드. 단위는 카드 머리에 둡니다.',
        ],
    },
    {
        key: 'plain',
        cells: [
            <code key="v">plain</code>,
            "'cells' 와 같은 칸에 막대만 세우고 항목 이름은 그림 밖 글자로 둡니다. 값 글자는 끄고 쓰며, 이름의 줄바꿈(\\n)이 두 줄로 섭니다.",
            '인쇄용 보고서의 항목 비교',
        ],
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
] as const

const CHOICE_ROWS = [
    {
        key: 'column',
        cells: ['항목마다 값 하나', <code key="c">ColumnChart</code>],
    },
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
        key: 'overlay',
        cells: [
            '같은 항목의 두 값을 겹쳐서',
            <Link key="c" href="/component-guide/overlay-column-chart" className={LINK_CLASS}>
                OverlayColumnChart
            </Link>,
        ],
    },
    {
        key: 'peer',
        cells: [
            '평가 대상과 동종 집단 비교',
            <Link key="c" href="/component-guide/peer-column-chart" className={LINK_CLASS}>
                PeerColumnChart
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
        'ColumnChart',
        'data',
        '항목 목록입니다. 항목마다 고유한 id · 표시명 · 값이 필요합니다.',
        '-',
        'ColumnChartItem[]',
    ],
    ['ColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['ColumnChart', 'variant', '모양입니다.', "'default'", "'default' | 'cells' | 'plain'"],
    ['ColumnChart', 'color', '막대 색입니다. 항목의 color 가 우선합니다.', "'var(--ds-chart-1)'", 'string'],
    [
        'ColumnChart',
        'barWidth',
        '막대 두께(px)입니다. 16~120 으로 맞춥니다. cells · plain 은 칸이 좁으면 더 가늘어집니다.',
        '56',
        'number',
    ],
    ['ColumnChart', 'showValueLabels', "막대 위 값입니다. 'plain' 은 보통 끕니다.", 'true', 'boolean'],
    [
        'ColumnChart',
        'showTooltip',
        '막대에 올렸을 때 뜨는 말풍선입니다. 값이 모두 적혀 있으면 끕니다.',
        'true',
        'boolean',
    ],
    ['ColumnChart', 'animate', '그리는 움직임입니다. 인쇄용 문서처럼 즉시 찍혀야 하면 끕니다.', 'true', 'boolean'],
    [
        'ColumnChart',
        'valueFractionDigits',
        '값 · 말풍선 · 숨김 표의 소수 자릿수입니다. 0~6 으로 맞춥니다.',
        '0',
        'number',
    ],
    [
        'ColumnChart',
        'unit',
        '단위입니다. \'default\' 는 그림 위 "단위: …" 글자, 말풍선 · 숨김 표 머리에도 붙습니다.',
        '-',
        'string',
    ],
    ['ColumnChart', 'yAxisStep', "y축 눈금 간격입니다. 'default' 에서만 쓰입니다.", '-', 'number'],
    [
        'ColumnChart',
        'scaleMax',
        "'cells' · 'plain' 의 눈금 기준 최댓값입니다. 여러 카드를 같은 눈금으로 견줄 때 씁니다.",
        '-',
        'number',
    ],
    [
        'ColumnChart',
        'maxValueRatio',
        "'cells' · 'plain' 에서 가장 큰 값이 닿는 칸 높이 비율입니다. 0.78~0.9 로 맞춥니다.",
        '0.78',
        'number',
    ],
    [
        'ColumnChart',
        'isLoading',
        '값을 불러오는 중입니다. 같은 자리 · 높이의 스켈레톤을 대신 보입니다.',
        'false',
        'boolean',
    ],
    [
        'ColumnChart',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    ['ColumnChart', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['ColumnChartItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['ColumnChartItem', 'label', '항목 이름입니다.', '-', 'string'],
    ['ColumnChartItem', 'value', '값입니다.', '-', 'number'],
    ['ColumnChartItem', 'color', '이 막대만의 색입니다.', '-', 'string'],
] as const

const SPECIAL_CASES = [
    {
        title: '모두 같은 최댓값',
        description: '가장 큰 막대도 칸 높이의 일부까지만 자라 값 글자 자리가 남습니다.',
        data: TOP_EDGE_DATA,
    },
    {
        title: '0 · 아주 작은 값',
        description: '0 은 막대 없이 값만, 아주 작은 값은 얇은 막대 위에 값이 붙습니다.',
        data: BOTTOM_EDGE_DATA,
    },
    {title: '음수', description: '0 기준선을 긋고 음수 막대는 아래로 자랍니다.', data: NEGATIVE_DATA},
    {title: '긴 숫자', description: '7자 이상 값은 “123.5만”처럼 줄여 겹치지 않게 합니다.', data: LONG_NUMBER_DATA},
    {title: '항목이 많을 때', description: '칸이 좁아지면 막대가 칸 폭의 80% 로 가늘어집니다.', data: MANY_ITEMS_DATA},
    {title: '항목 하나', description: '칸 하나가 전체 폭을 쓰고 막대는 가운데에 섭니다.', data: SINGLE_DATA},
] as const

const PLAIN_DATA = [
    {id: 'ipcGroup', label: 'IPC 그룹', value: 456.1, color: 'var(--raw-navy-500)'},
    {id: 'top40', label: '그룹 내\n상위40%', value: 452.9, color: 'var(--raw-blue-500)'},
    {id: 'target', label: '평가대상\n특허', value: 466.5, color: 'var(--raw-purple-500)'},
]

const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const ColumnChartGuidePage = () => (
    <GuidePageShell
        title="세로 막대 (ColumnChart)"
        description="한 가지 값을 항목별 막대 하나씩으로 견주는 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="cc-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 와 <code>ariaLabel</code> 이 필수입니다. 아래는 보고서 카드 모양(
                        <code>variant=&quot;cells&quot;</code>)입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-96 rounded-sm border p-6">
                    <ColumnChart
                        variant="cells"
                        data={REPORT_DATA}
                        color={REPORT_COLOR}
                        barWidth={48}
                        valueFractionDigits={1}
                        showTooltip={false}
                        ariaLabel="연도별 인당 매출액"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cc-variants" className="typo-h4-bold">
                        변형과 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모양은 <code>variant</code> 로 고르고, 값이 달라 흔들릴 수 있는 경우는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">variant</h3>
                        <Table
                            caption="ColumnChart variant 비교"
                            columns={VARIANT_COLUMNS}
                            rows={VARIANT_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">특이 값 (cells)</h3>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <ColumnChart
                                        variant="cells"
                                        data={[...item.data]}
                                        color={REPORT_COLOR}
                                        barWidth={48}
                                        valueFractionDigits={1}
                                        showTooltip={false}
                                        ariaLabel={item.title}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩 — cells</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 을 켜면 같은 자리에 <code>ChartSkeleton</code> 이 서고, 서버 렌더링
                            동안에도 스켈레톤이 보입니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ChartSkeleton type="cells-column" label="인당 매출액을 불러오는 중입니다." />
                            <ColumnChart
                                variant="cells"
                                data={REPORT_DATA}
                                color={REPORT_COLOR}
                                barWidth={48}
                                valueFractionDigits={1}
                                showTooltip={false}
                                ariaLabel="연도별 인당 매출액"
                            />
                        </div>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩 — plain</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ColumnChart
                                variant="plain"
                                isLoading
                                loadingLabel="영향요인 값을 불러오는 중입니다."
                                ariaLabel="영향요인 비교"
                                data={PLAIN_DATA}
                            />
                            <ColumnChart
                                variant="plain"
                                showTooltip={false}
                                showValueLabels={false}
                                barWidth={24}
                                ariaLabel="영향요인 비교 — IPC 그룹 · 그룹 내 상위40% · 평가대상 특허"
                                data={PLAIN_DATA}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="세로 막대 계열 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 같은 값이
                        숨김 표(<code>caption</code> · <code>th scope</code>)로 함께 들어 있어 화면 낭독기가 표로
                        읽습니다[5.1.1].
                    </li>
                    <li>
                        값이 말풍선에만 있지 않도록 막대 위 값(<code>showValueLabels</code>)을 유지합니다. 말풍선은
                        마우스 보조입니다.
                    </li>
                    <li>막대 색만으로 항목을 구분하지 않고 항목 이름을 함께 둡니다[5.3.1].</li>
                    <li>
                        불러오는 중에는 <code>loadingLabel</code> 이 읽힙니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 와 <code>ariaLabel</code> 만 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ColumnChart Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ColumnChartGuidePage
