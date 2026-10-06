// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ComboBarLineChartSkeleton} from '@/components/composite/combo-bar-line-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {ComboBarLineChart, type ComboBarLineItem, type ComboBarTone} from '@/components/custom/combo-bar-line-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '막대 + 선 (ComboBarLineChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

type Row = readonly [label: string, value: number, lineValue: number | null, tone?: ComboBarTone]

const toItems = (rows: readonly Row[]): ComboBarLineItem[] =>
    rows.map(([label, value, lineValue, tone]) => ({id: label, label, value, lineValue, tone}))

const COMPETITOR_DATA = toItems([
    ['기업1', 32.8, 2.3],
    ['기업2', 32.7, -1.2],
    ['기업3', 32.6, 0.8],
    ['기업4', 32.5, 7.4],
    ['기업5', 32.4, 2.7],
    ['조회기업', 32.3, 5.2, 'highlight'],
    ['기업6', 32.2, 0.5],
    ['기업7', 32.1, 3.6],
    ['기업8', 31.9, 3.1],
    ['기업9', 31.5, -2.3],
    ['기업10', 31.2, -0.2],
    ['평균', 32.2, 2.1, 'average'],
])

const OUTSIDE_BAR_DATA = toItems([
    ['기업1', 120, 4.2],
    ['기업2', 18, 6.1],
    ['조회기업', 9, 8.8, 'highlight'],
    ['기업3', 95, -1.4],
    ['평균', 60, 4.4, 'average'],
])
const NEAR_TOP_DATA = toItems([
    ['기업1', 40.0, -3.0],
    ['기업2', 20.0, 12.0],
    ['조회기업', 21.0, 11.5, 'highlight'],
    ['기업3', 35.0, 0.0],
    ['평균', 29.0, 5.1, 'average'],
])
const NEGATIVE_LINE_DATA = toItems([
    ['기업1', 58.2, -8.4],
    ['기업2', 54.1, -12.6],
    ['조회기업', 60.3, -3.1, 'highlight'],
    ['기업3', 51.7, -15.2],
    ['평균', 56.1, -9.8, 'average'],
])
const EQUAL_BAR_DATA = toItems([
    ['기업1', 25.0, 1.2],
    ['기업2', 25.0, 3.4],
    ['조회기업', 25.0, 2.2, 'highlight'],
    ['기업3', 25.0, -0.6],
    ['평균', 25.0, 1.6, 'average'],
])
const MISSING_LINE_DATA = toItems([
    ['기업1', 32.8, 2.3],
    ['기업2', 32.1, null],
    ['조회기업', 32.5, 4.1, 'highlight'],
    ['기업3', 31.6, 1.8],
    ['기업4', 31.9, null],
    ['평균', 32.2, 2.7, 'average'],
])
const LONG_LABEL_DATA = toItems([
    ['주식회사 가나다라테크놀로지', 1234567.8, 12.5],
    ['마바사 바이오', 987654.3, -4.1],
    ['조회기업', 1100000.0, 6.3, 'highlight'],
    ['평균', 1107407.4, 4.9, 'average'],
])
const MANY_ITEMS_DATA = toItems(
    Array.from({length: 20}, (_, index): Row => [
        `기업${index + 1}`,
        30 + ((index * 7) % 11) / 4,
        ((index * 5) % 13) - 4,
    ]),
)
const OUTLIER_DATA = toItems([
    ['기업1', 100, 2.3],
    ['기업2', 32.7, -1.2],
    ['기업3', 32.6, 0.8],
    ['기업4', 32.5, 7.4],
    ['기업5', 32.4, 2.7],
    ['조회기업', 32.3, 5.2, 'highlight'],
    ['기업6', 32.1, 3.6],
    ['평균', 42.1, 2.9, 'average'],
])
const SINGLE_DATA = toItems([['조회기업', 32.3, 5.2, 'highlight']])

const USAGE_CODE = `import {ComboBarLineChart} from '@/components/custom/combo-bar-line-chart'

<ComboBarLineChart
  ariaLabel="경쟁기업 사업실적 — 매출액과 증가율"
  barLabel="매출액"
  barUnit="백만원"
  lineLabel="증가율"
  lineUnit="%"
  data={[
    {id: 'c1', label: '기업1', value: 32.8, lineValue: 2.3},
    {id: 'c2', label: '기업2', value: 32.7, lineValue: -1.2},
    {id: 'c3', label: '기업3', value: 32.6, lineValue: 0.8},
    {id: 'c4', label: '기업4', value: 32.5, lineValue: 7.4},
    {id: 'c5', label: '기업5', value: 32.4, lineValue: 2.7},
    {id: 'me', label: '조회기업', value: 32.3, lineValue: 5.2, tone: 'highlight'},
    {id: 'c6', label: '기업6', value: 32.2, lineValue: 0.5},
    {id: 'c7', label: '기업7', value: 32.1, lineValue: 3.6},
    {id: 'c8', label: '기업8', value: 31.9, lineValue: 3.1},
    {id: 'c9', label: '기업9', value: 31.5, lineValue: -2.3},
    {id: 'c10', label: '기업10', value: 31.2, lineValue: -0.2},
    {id: 'avg', label: '평균', value: 32.2, lineValue: 2.1, tone: 'average'},
  ]}
/>`

const DATA_CODE = `// 화면 순서대로 넘긴다. 선 값이 없으면 null — 점을 비우고 선을 끊는다(0 으로 채우지 않는다).
const data = rows.map((row) => ({
  id: row.companyId,
  label: row.isTarget ? '조회기업' : row.companyName,
  value: row.sales,
  lineValue: row.growthRate ?? null,
  tone: row.isTarget ? 'highlight' : undefined,
}))
data.push({id: 'average', label: '평균', value: average.sales, lineValue: average.growthRate ?? null, tone: 'average'})`

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
] as const

const CHOICE_ROWS = [
    {key: 'combo', cells: ['항목마다 막대 하나와 단위가 다른 선 값 하나', <code key="c">ComboBarLineChart</code>]},
    {
        key: 'column',
        cells: [
            '항목마다 값 하나',
            <Link key="c" href="/component-guide/column-chart" className={LINK_CLASS}>
                ColumnChart
            </Link>,
        ],
    },
    {
        key: 'grouped',
        cells: [
            '항목마다 같은 단위의 여러 계열',
            <Link key="c" href="/component-guide/grouped-column-chart" className={LINK_CLASS}>
                GroupedColumnChart
            </Link>,
        ],
    },
] as const

const PROPS_ITEMS = [
    ['ComboBarLineChart', 'data', '항목 목록입니다. 화면 순서 그대로 넘깁니다.', '-', 'ComboBarLineItem[]'],
    ['ComboBarLineChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['ComboBarLineChart', 'barLabel', '막대 값 이름입니다. 숨김 표 머리에 쓰입니다.', '-', 'string'],
    ['ComboBarLineChart', 'lineLabel', '선 값 이름입니다. 숨김 표 머리에 쓰입니다.', '-', 'string'],
    ['ComboBarLineChart', 'barUnit', '숨김 표 머리의 막대 단위입니다.', '-', 'string'],
    ['ComboBarLineChart', 'lineUnit', '숨김 표 머리의 선 단위입니다.', '-', 'string'],
    [
        'ComboBarLineChart',
        'baseline',
        '막대 세로 범위의 아래 끝입니다. 주지 않으면 잘린 축 규칙을 따르고, 0 이면 0 부터 그립니다.',
        '-',
        'number',
    ],
    ['ComboBarLineChart', 'valueFractionDigits', '막대 값의 소수 자릿수입니다.', '1', 'number'],
    ['ComboBarLineChart', 'lineFractionDigits', '선 값의 소수 자릿수입니다.', '1', 'number'],
    [
        'ComboBarLineChart',
        'maxValueRatio',
        '가장 큰 막대가 닿는 칸 높이 비율입니다. 0.78~0.9 로 맞춥니다.',
        '0.78',
        'number',
    ],
    ['ComboBarLineChart', 'animate', '막대 · 선이 자라는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['ComboBarLineChart', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['ComboBarLineItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['ComboBarLineItem', 'label', '항목 이름입니다.', '-', 'string'],
    ['ComboBarLineItem', 'value', '막대 값입니다.', '-', 'number'],
    ['ComboBarLineItem', 'lineValue', '선 값입니다. 없으면 null — 점을 비우고 선을 끊습니다.', '-', 'number | null'],
    [
        'ComboBarLineItem',
        'tone',
        '막대 색 역할입니다. highlight 는 조회기업, average 는 평균입니다.',
        "'default'",
        "'default' | 'highlight' | 'average'",
    ],
] as const

type SpecialCase = {
    title: string
    description: string
    data: ComboBarLineItem[]
    baseline?: number
}

const BAR_EXTREME_DATA = toItems([
    ['기업1', 58.4, 2.1],
    ['기업2', 41.2, 1.4],
    ['기업3', 12.6, 3.0],
    ['조회기업', 35.0, 2.6, 'highlight'],
    ['기업4', 58.4, 1.8],
    ['평균', 41.1, 2.2, 'average'],
])
const LINE_EXTREME_DATA = toItems([
    ['기업1', 32.8, 25.0],
    ['기업2', 32.1, -18.0],
    ['기업3', 31.4, 2.4],
    ['조회기업', 32.3, 25.0, 'highlight'],
    ['기업4', 31.2, -18.0],
    ['평균', 32.0, 3.3, 'average'],
])
const BOTH_EXTREME_DATA = toItems([
    ['기업1', 58.4, 25.0],
    ['기업2', 12.6, -18.0],
    ['기업3', 40.2, 4.1],
    ['조회기업', 12.6, 25.0, 'highlight'],
    ['기업4', 58.4, -18.0],
    ['평균', 36.4, 7.6, 'average'],
])

const SPECIAL_CASES: readonly SpecialCase[] = [
    {
        title: '막대 최댓값 · 최솟값',
        description:
            '가장 큰 막대는 칸 높이의 78% 까지만 자라 위에 값 자리가 남고, 가장 작은 막대도 30% 높이는 남습니다.',
        data: BAR_EXTREME_DATA,
    },
    {
        title: '선 최댓값 · 최솟값',
        description: '선은 칸 아래쪽 8%~50% 띠 안에만 그려 막대 값 글자까지 올라가지 않습니다.',
        data: LINE_EXTREME_DATA,
    },
    {
        title: '막대 · 선 극값이 한 항목에 겹칠 때',
        description:
            '선 값 글자는 막대 안이면 흰 글자, 막대 밖이면 짙은 글자로 바뀌고 막대 값 글자와 겹치지 않게 자리를 옮깁니다.',
        data: BOTH_EXTREME_DATA,
    },
    {
        title: '선 점이 막대 밖에 놓일 때',
        description: '글자 상자가 막대 안에 들어가지 않으면 짙은 글자로 바꿉니다. 점은 어느 바탕에서도 보입니다.',
        data: OUTSIDE_BAR_DATA,
        baseline: 0,
    },
    {
        title: '한 막대만 크게 튈 때',
        description: '선 점 · 글자가 막대 끝 위로 올라오면 막대 값 글자를 그 위로 밀어 올립니다.',
        data: OUTLIER_DATA,
    },
    {
        title: '선 값 글자가 막대 끝에 닿을 때',
        description: '점 위 글자가 막대 끝을 넘으면 점 아래로 내립니다.',
        data: NEAR_TOP_DATA,
    },
    {
        title: '선 값이 모두 음수',
        description: '선은 막대와 다른 눈금이라 같은 띠 안에 그립니다. 0 선은 긋지 않습니다.',
        data: NEGATIVE_LINE_DATA,
    },
    {
        title: '막대 값이 모두 같을 때',
        description: '잘린 축 대신 0 부터 그려 모든 막대를 78% 높이로 세웁니다.',
        data: EQUAL_BAR_DATA,
    },
    {
        title: '선 값이 없을 때',
        description: '값이 null 인 항목은 점 · 글자를 비우고 선을 끊습니다. 숨김 표에는 “값 없음”으로 적힙니다.',
        data: MISSING_LINE_DATA,
    },
    {
        title: '긴 항목 이름 · 긴 숫자',
        description:
            '7자 이상 값은 “123.5만”처럼 줄입니다. 항목 이름은 6자까지 적고 줄임표(…)로 자르며 전체 이름은 title · 숨김 표에 남습니다.',
        data: LONG_LABEL_DATA,
    },
    {
        title: '항목이 많을 때',
        description: '칸 폭 80 × 항목 수를 최소 폭으로 지키고, 모자라면 그래프만 가로로 넘깁니다.',
        data: MANY_ITEMS_DATA,
    },
    {
        title: '항목 하나',
        description: '칸 하나가 전체 폭을 쓰고 막대는 가운데에 섭니다.',
        data: SINGLE_DATA,
    },
]

const ComboBarLineChartGuidePage = () => (
    <GuidePageShell
        title="막대 + 선 (ComboBarLineChart)"
        description="항목마다 막대(예: 매출액)를 세우고 다른 단위의 값(예: 증가율)을 선으로 이어 한 칸에서 함께 봅니다."
    >
        <BaseCard>
            <section aria-labelledby="cblc-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cblc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        막대(<code>value</code>)와 선(<code>lineValue</code>)은 세로 눈금을 따로 씁니다. 조회기업은{' '}
                        <code>tone=&quot;highlight&quot;</code>, 평균은 <code>tone=&quot;average&quot;</code> 로 막대
                        색을 바꿉니다. 단위는 카드 머리에 둡니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="typo-title-m-bold text-foreground">경쟁기업 사업실적</h3>
                        <p className="typo-body-m-regular text-foreground-subtle">단위 : 백만원</p>
                    </div>
                    <ComboBarLineChart
                        ariaLabel="경쟁기업 사업실적 — 매출액과 증가율"
                        barLabel="매출액"
                        barUnit="백만원"
                        lineLabel="증가율"
                        lineUnit="%"
                        data={COMPETITOR_DATA}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cblc-variants" className="typo-h4-bold">
                        변형과 상태
                    </h2>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">막대 세로 범위</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            기본은 잘린 축입니다. 값이 모두 양수이고 서로 다르면 가장 작은 값이 칸 높이의 30%, 가장 큰
                            값이 78% 에 오도록 아래 끝을 올려 작은 차이도 드러냅니다. 막대 높이가 값에 비례하지 않으므로
                            값 글자를 늘 함께 적습니다. <code>baseline={'{0}'}</code> 을 주면 0 부터 그립니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <div className="flex min-w-0 flex-col gap-2">
                                <h4 className="typo-body-l-bold text-foreground">기본 (잘린 축)</h4>
                                <ComboBarLineChart
                                    ariaLabel="잘린 축"
                                    barLabel="매출액"
                                    lineLabel="증가율"
                                    data={COMPETITOR_DATA.slice(0, 6)}
                                />
                            </div>
                            <div className="flex min-w-0 flex-col gap-2">
                                <h4 className="typo-body-l-bold text-foreground">baseline=0</h4>
                                <ComboBarLineChart
                                    ariaLabel="0 부터 그리기"
                                    barLabel="매출액"
                                    lineLabel="증가율"
                                    data={COMPETITOR_DATA.slice(0, 6)}
                                    baseline={0}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">특이 값</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            값 글자가 겹치거나 막대 높이가 무너질 수 있는 경우는 컴포넌트가 처리합니다.
                        </p>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <ComboBarLineChart
                                        ariaLabel={item.title}
                                        barLabel="매출액"
                                        lineLabel="증가율"
                                        data={item.data}
                                        baseline={item.baseline}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 컴포넌트에는 <code>isLoading</code> 이 없습니다. 값을 기다리는 동안 같은 자리에{' '}
                            <code>ComboBarLineChartSkeleton</code> 을 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <div role="status" aria-live="polite" className="animate-pulse">
                                <ComboBarLineChartSkeleton />
                                <span className="sr-only">경쟁기업 사업실적을 불러오는 중입니다.</span>
                            </div>
                            <ComboBarLineChart
                                ariaLabel="경쟁기업 사업실적"
                                barLabel="매출액"
                                lineLabel="증가율"
                                data={COMPETITOR_DATA.slice(0, 6)}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cblc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="막대 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cblc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 같은 값이
                        숨김 표(<code>caption</code> · <code>th scope</code>)로 들어 있습니다. 표 머리는{' '}
                        <code>barLabel</code> · <code>lineLabel</code> 과 단위로 만들어지고, 선 값이 없으면 “값
                        없음”으로 읽힙니다[5.1.1].
                    </li>
                    <li>
                        막대와 선 값은 모두 글자로 적혀 있어 색이나 높이만으로 전하지 않습니다. 조회기업 · 평균은 색과
                        함께 항목 이름으로 구분합니다[5.3.1].
                    </li>
                    <li>말풍선은 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="cblc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>ariaLabel</code> · <code>barLabel</code> · <code>lineLabel</code> 이
                        필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ComboBarLineChart Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComboBarLineChartGuidePage
