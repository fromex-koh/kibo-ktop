// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {ColumnChart, type ColumnChartItem} from '@/components/custom/column-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '세로 막대 (ColumnChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const REPORT_COLOR = 'var(--raw-blue-500)'

const toItems = (entries: readonly (readonly [string, number])[]): ColumnChartItem[] =>
    entries.map(([label, value]) => ({id: label, label, value}))

// K-BIGx 기업혁신성장 보고서 "인당 매출액" 카드와 같은 값이다.
const REPORT_DATA = toItems([
    ['2022년', 456.1],
    ['2023년', 452.9],
    ['2024년', 466.5],
])

// 특이 케이스 — 칸 맨 위(모두 같은 최댓값) · 맨 아래(0 · 아주 작은 값) · 음수 · 긴 숫자 · 항목이 많을 때 · 항목 하나.
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
  showTooltip={false} // 값이 막대 위에 모두 적혀 있어 말풍선은 끈다
  ariaLabel="연도별 인당 매출액"
/>`

const DATA_CODE = `// [프론트엔드 연동] API 의 연도별 값을 ColumnChartItem 으로 바꾼다. 단위(백만원)는 카드 머리에 둔다.
const data: ColumnChartItem[] = salesPerEmployeeFromApi.map((item) => ({
  id: String(item.year),
  label: \`\${item.year}년\`,
  value: item.amount,
}))`

const SHAPE_RULES = [
    "variant='cells'(보고서): 높이 200 칸 상자에 바닥선 · 양 끝 세로선은 실선, 항목 사이 세로선은 점선(gray.100)이고 위 선 · y축 · 가로 눈금은 없습니다.",
    '막대는 칸 가운데에 두께 48(barWidth) · 위 모서리 반경 8 입니다. 항목이 많아 칸이 좁아지면 칸 폭의 80% 까지 가늘어져 옆 막대와 붙지 않습니다.',
    '가장 큰 막대가 칸 높이의 78% 에 닿아 위에 값 자리가 늘 남습니다.',
    '값은 막대 위 4 에 11 Regular(gray.600), 항목 이름은 바닥 아래 8 에 12 Regular(gray.700)입니다. 단위는 카드 머리(“단위 : 백만원”)에 둡니다.',
    "variant='default': y축 · 점선 눈금 · 위 모서리 12 막대 · 차트 안 단위 글자가 있는 기본형입니다.",
] as const

const PROPS_ITEMS = [
    ['ColumnChart', 'data', '항목별 고유 id · 표시명 · 값(선택: 막대마다 color)입니다.', '-', 'ColumnChartItem[]'],
    [
        'ColumnChart',
        'variant',
        "'cells' 는 보고서 카드 모양(점선 칸 · 위 모서리 8 막대 · y축 없음), 'default' 는 y축 · 점선 눈금 · 위 모서리 12 막대입니다.",
        "'default'",
        "'default' | 'cells'",
    ],
    ['ColumnChart', 'color', '막대 색입니다(항목의 color 가 우선).', "'var(--ds-chart-1)'", 'string'],
    [
        'ColumnChart',
        'barWidth',
        "막대 두께(px)입니다. 16~120 으로 맞춥니다. 'cells' 에서는 칸이 좁으면 이보다 가늘어집니다.",
        '56',
        'number',
    ],
    ['ColumnChart', 'showValueLabels', '막대 위에 값을 표시합니다.', 'true', 'boolean'],
    ['ColumnChart', 'showTooltip', '막대 위에 올렸을 때 뜨는 말풍선입니다. 보고서에서는 끕니다.', 'true', 'boolean'],
    ['ColumnChart', 'valueFractionDigits', '값 · 툴팁 · 숨김 표의 소수 자릿수입니다.', '0', 'number'],
    [
        'ColumnChart',
        'scaleMax',
        'cells: 눈금 기준 최댓값(예: 점수 100)입니다. 여러 카드를 같은 눈금으로 견줄 때 씁니다.',
        '-',
        'number',
    ],
    [
        'ColumnChart',
        'maxValueRatio',
        'cells: 가장 큰 값(또는 scaleMax)이 닿는 칸 높이 비율입니다. 0.78~0.9 로 맞춥니다.',
        '0.78',
        'number',
    ],
    [
        'ColumnChart',
        'unit · yAxisStep',
        "차트 안 단위 글자 · 툴팁 단위와 y축 눈금 간격입니다('default' 전용).",
        'undefined',
        'string · number',
    ],
    ['ColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
] as const

const SPECIAL_CASES = [
    {
        title: '칸 맨 위 (모두 같은 최댓값)',
        description:
            '가장 큰 막대는 칸 높이의 78% 까지만 자라 위에 값 자리가 남습니다. 글자가 칸 위로 나가지 않습니다.',
        data: TOP_EDGE_DATA,
    },
    {
        title: '칸 맨 아래 (0 · 아주 작은 값)',
        description: '0 은 막대 없이 바닥선 바로 위에 값만 남고, 아주 작은 값은 얇은 막대 위에 값이 붙습니다.',
        data: BOTTOM_EDGE_DATA,
    },
    {
        title: '음수',
        description:
            '0 기준선을 긋고 음수 막대는 아래로 자랍니다. 값 글자는 막대 아래 끝에 붙고 위 · 아래에 값 자리를 반씩 남깁니다.',
        data: NEGATIVE_DATA,
    },
    {
        title: '긴 숫자',
        description:
            '7자 이상 값은 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다. 화면 낭독기는 숨김 표의 원래 값을 읽습니다.',
        data: LONG_NUMBER_DATA,
    },
    {
        title: '항목이 많을 때 (8개)',
        description: '칸이 48 보다 좁아지면 막대가 칸 폭의 80% 로 가늘어져 서로 붙지 않습니다.',
        data: MANY_ITEMS_DATA,
    },
    {title: '항목 하나', description: '칸 하나가 전체 폭을 쓰고 막대는 가운데에 섭니다.', data: SINGLE_DATA},
] as const

const ColumnChartGuidePage = () => (
    <GuidePageShell
        title="세로 막대 (ColumnChart)"
        description="한 가지 값을 기간 · 항목별 막대 하나씩으로 견주는 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="cc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="cc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 인당 매출액 카드(variant=&quot;cells&quot;)입니다.
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="cc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="cc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="cc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        막대가 칸 맨 위 · 맨 아래에 닿을 때의 값 글자 자리, 음수 · 긴 숫자 · 항목 수가 달라 모양이
                        흔들릴 수 있는 경우입니다(variant=&quot;cells&quot;). 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="cc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;cells-column&quot;</code>를 같은 자리에
                        둡니다. 점선 칸 · 막대 · 항목 이름 자리와 전체 높이(226)가 실제 그래프와 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="cells-column" label="인당 매출액을 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="cc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 연도별 값을 ColumnChartItem 으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ColumnChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-props" className="flex flex-col gap-4">
                <h2 id="cc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ColumnChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ColumnChartGuidePage
