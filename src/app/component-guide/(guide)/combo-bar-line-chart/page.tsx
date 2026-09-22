// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ComboBarLineChartSkeleton} from '@/components/composite/combo-bar-line-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {ComboBarLineChart, type ComboBarLineItem, type ComboBarTone} from '@/components/custom/combo-bar-line-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '막대 + 선 (ComboBarLineChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

type Row = readonly [label: string, value: number, lineValue: number | null, tone?: ComboBarTone]

const toItems = (rows: readonly Row[]): ComboBarLineItem[] =>
    rows.map(([label, value, lineValue, tone]) => ({id: label, label, value, lineValue, tone}))

// K-BIGx 보고서 "경쟁기업 사업실적" 카드와 같은 값이다(막대 = 매출액 · 선 = 증가율).
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

// 특이 케이스 데이터.
// 선 점이 막대 밖 — 0 부터 그려 막대가 아주 낮으면 점 · 글자가 막대 위 흰 바탕에 놓인다.
const OUTSIDE_BAR_DATA = toItems([
    ['기업1', 120, 4.2],
    ['기업2', 18, 6.1],
    ['조회기업', 9, 8.8, 'highlight'],
    ['기업3', 95, -1.4],
    ['평균', 60, 4.4, 'average'],
])
// 선 값 글자가 막대 끝(막대 값 글자)에 닿을 때 — 가장 작은 막대(30%) 위로 선이 가장 높은 50% 까지 오른다.
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
// 한 막대만 크게 튈 때 — 나머지 막대가 낮아져 선 점 · 선 값 글자가 막대 끝 위로 올라온다.
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
const ZERO_BASED_DATA = COMPETITOR_DATA

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

const DATA_CODE = `// [프론트엔드 연동] 경쟁기업 행을 화면 순서대로 바꾼다 — 조회기업은 tone 'highlight', 평균은 'average'.
// 증가율이 없으면 null 로 두면 점을 비우고 선을 끊는다(0 으로 채우지 않는다).
const data = rows.map((row) => ({
  id: row.companyId,
  label: row.isTarget ? '조회기업' : row.companyName,
  value: row.sales,
  lineValue: row.growthRate ?? null,
  tone: row.isTarget ? 'highlight' : undefined,
}))
data.push({id: 'average', label: '평균', value: average.sales, lineValue: average.growthRate ?? null, tone: 'average'})`

const SHAPE_RULES = [
    '높이 200 칸 상자(위 선 없음 · 바닥 · 양 끝 실선, 항목 사이 점선 gray.100) 아래 8 에 항목 이름(12 Regular)이 옵니다.',
    '막대는 폭 48 · 위 모서리 6 으로 칸 가운데에 섭니다. 색은 기본 blue.500, 조회기업 mint.700, 평균 purple.500 입니다.',
    '막대 값은 막대 끝 위 4 에 11 Regular(gray.600)로 적습니다. 가장 큰 값은 칸 높이의 78% 까지만 자라 위에 값 자리가 남습니다.',
    '막대는 잘린 축을 씁니다 — 값이 모두 양수면 가장 작은 값이 30%, 가장 큰 값이 78% 높이가 되게 아래 끝을 올립니다(0 아래로는 내리지 않음). baseline={0} 이면 0 부터 그립니다.',
    '선은 막대와 다른 눈금으로 칸 아래쪽 8%~50% 띠 안에 그립니다. 굵기 1.5 blue.500, 점은 지름 12(흰 채움 · 테두리 2)입니다.',
    '선 값은 점 위 3 에 11 Regular 로, 막대 안이면 흰 글자로 적습니다.',
] as const

const PROPS_ITEMS = [
    [
        'ComboBarLineChart',
        'data',
        '항목별 id · 이름 · 막대 값(value) · 선 값(lineValue, 없으면 null) · 막대 색 역할(tone)입니다.',
        '-',
        'ComboBarLineItem[]',
    ],
    ['ComboBarLineChart', 'barLabel', '막대 값 이름입니다(숨김 표 머리).', '-', 'string'],
    ['ComboBarLineChart', 'lineLabel', '선 값 이름입니다(숨김 표 머리).', '-', 'string'],
    ['ComboBarLineChart', 'barUnit', '숨김 표 머리의 막대 단위입니다.', 'undefined', 'string'],
    ['ComboBarLineChart', 'lineUnit', '숨김 표 머리의 선 단위입니다.', 'undefined', 'string'],
    [
        'ComboBarLineChart',
        'baseline',
        '막대 세로 범위의 아래 끝입니다. 주지 않으면 잘린 축 규칙, 0 이면 0 부터 그립니다.',
        'undefined',
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
    ['ComboBarLineChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    [
        'ComboBarLineItem',
        'tone',
        '막대 색 역할 — default(파랑) · highlight(조회기업) · average(평균)입니다.',
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

// 막대 최댓값 · 최솟값 — 가장 긴 막대(칸 78%)와 가장 짧은 막대(잘린 축 30%)의 값 글자 자리.
const BAR_EXTREME_DATA = toItems([
    ['기업1', 58.4, 2.1],
    ['기업2', 41.2, 1.4],
    ['기업3', 12.6, 3.0],
    ['조회기업', 35.0, 2.6, 'highlight'],
    ['기업4', 58.4, 1.8],
    ['평균', 41.1, 2.2, 'average'],
])
// 선 최댓값 · 최솟값 — 선 띠의 위 끝(칸 50%) · 아래 끝(칸 8%)에 선 점이 닿을 때.
const LINE_EXTREME_DATA = toItems([
    ['기업1', 32.8, 25.0],
    ['기업2', 32.1, -18.0],
    ['기업3', 31.4, 2.4],
    ['조회기업', 32.3, 25.0, 'highlight'],
    ['기업4', 31.2, -18.0],
    ['평균', 32.0, 3.3, 'average'],
])
// 막대 · 선 극값이 한 항목에 겹칠 때 — 가장 긴 막대에 선 최댓값, 가장 짧은 막대에 선 최솟값.
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
            '가장 큰 막대는 칸 높이의 78% 까지만 자라 위에 약 44 의 값 자리가 남고, 같은 최댓값이 여럿이어도 모두 같은 높이로 섭니다. 잘린 축에서 가장 작은 막대도 30% 높이(60)는 남아 막대가 사라지지 않고, 그 값 글자는 막대 위 4 에 적힙니다.',
        data: BAR_EXTREME_DATA,
    },
    {
        title: '선 최댓값 · 최솟값',
        description:
            '선은 칸 아래쪽 8%~50% 띠 안에만 그려, 최댓값 점도 막대 값 글자 자리(막대 위)까지 올라가지 않습니다. 최솟값 점(8%)은 아래 글자 자리가 칸 바닥 밖이라 점 위에 적고, 최댓값 점은 막대 안이면 흰 글자, 막대보다 높으면 짙은 글자로 적습니다. 막대 값 글자와 겹치면 점 아래로 내립니다.',
        data: LINE_EXTREME_DATA,
    },
    {
        title: '막대 · 선 극값이 한 항목에 겹칠 때',
        description:
            '가장 긴 막대에 선 최댓값이 오면 선 값은 막대 안(흰 글자)에 들어가고, 가장 짧은 막대(30%)에 선 최댓값이 오면 점이 막대 위로 나가 짙은 글자로 바뀝니다. 가장 짧은 막대에 선 최솟값이 오면 점 위 글자가 막대 안에 들어갑니다. 어느 경우에도 선 값과 막대 값 글자가 겹치거나 칸 밖으로 나가지 않습니다.',
        data: BOTH_EXTREME_DATA,
    },
    {
        title: '선 점이 막대 밖에 놓일 때',
        description:
            '흰 글자는 흰 바탕에서 보이지 않으므로, 글자 상자가 막대 안에 들어가지 않으면 짙은 글자(gray.600)로 바꿉니다. 점은 흰 채움 · 파란 테두리라 어느 바탕에서도 보입니다.',
        data: OUTSIDE_BAR_DATA,
        baseline: 0,
    },
    {
        title: '한 막대만 크게 튈 때',
        description:
            '가장 큰 막대가 눈금을 끌어올려 다른 막대가 낮아지면 선 점 · 선 값 글자가 막대 끝 위로 올라와 막대 값 글자를 가릴 수 있습니다. 그때는 막대 값 글자를 점 · 선 글자 위로 밀어 올립니다.',
        data: OUTLIER_DATA,
    },
    {
        title: '선 값 글자가 막대 끝에 닿을 때',
        description:
            '점 위 글자가 막대 끝을 넘으면 점 아래(막대 안)로 내려 흰 글자로 적습니다. 막대 밖에 적어야 하고 막대 값 글자와 세로로 겹치면 점 아래로 내립니다.',
        data: NEAR_TOP_DATA,
    },
    {
        title: '선 값이 모두 음수',
        description:
            '선은 막대와 다른 눈금이라 음수여도 막대 바닥 아래로 내려가지 않고 같은 띠(8%~50%) 안에 그립니다. 0 선은 긋지 않으며 값 글자로 부호를 읽습니다.',
        data: NEGATIVE_LINE_DATA,
    },
    {
        title: '막대 값이 모두 같을 때',
        description:
            '잘린 축은 차이가 0 이면 높이가 0 으로 무너지므로, 이때는 0 부터 그려 모든 막대를 78% 높이로 세웁니다.',
        data: EQUAL_BAR_DATA,
    },
    {
        title: '0 부터 그리기 (baseline={0})',
        description:
            '값 차이를 실제 비율로 보여야 하면 baseline={0} 을 줍니다. 차이가 작은 값은 막대 높이가 거의 같아집니다.',
        data: ZERO_BASED_DATA,
        baseline: 0,
    },
    {
        title: '선 값이 없을 때',
        description:
            'lineValue 가 null 인 항목은 점 · 글자를 비우고 선도 끊습니다. 화면 낭독기는 “값 없음”을 읽습니다.',
        data: MISSING_LINE_DATA,
    },
    {
        title: '긴 항목 이름 · 긴 숫자',
        description:
            '7자 이상 값은 “123.5만”처럼 줄여 옆 값과 겹치지 않게 합니다. 항목 이름은 최소 칸 폭(80)에 들어가는 6자까지 적고 줄임표(…)로 자르며, 전체 이름은 title · 숨김 표에 남습니다.',
        data: LONG_LABEL_DATA,
    },
    {
        title: '항목이 많을 때 (20개)',
        description:
            '칸 폭 80 × 항목 수를 최소 폭으로 지켜 막대 · 값 글자가 겹치지 않고, 모자라면 그래프만 가로로 넘깁니다.',
        data: MANY_ITEMS_DATA,
    },
    {
        title: '항목 하나',
        description:
            '칸 하나가 전체 폭을 쓰고 막대는 가운데에 섭니다. 막대 값이 하나라 0 부터 78% 높이, 선 점은 띠 가운데(29%)입니다.',
        data: SINGLE_DATA,
    },
]

const ComboBarLineChartGuidePage = () => (
    <GuidePageShell
        title="막대 + 선 (ComboBarLineChart)"
        description="항목마다 막대(예: 매출액)를 세우고 그 안에 다른 단위의 값(예: 증가율)을 선으로 이어 한 칸에서 함께 봅니다."
    >
        <BaseCard>
            <section aria-labelledby="cblc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="cblc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 경쟁기업 사업실적 카드 그래프입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="typo-body-xl-bold">경쟁기업 사업실적</h3>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="cblc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="cblc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="cblc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값 글자가 사라지거나 겹치고, 막대 높이가 무너질 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="cblc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">ComboBarLineChartSkeleton</code>을 같은
                        자리에 둡니다. 칸 상자 · 막대 · 선 · 항목 이름 자리의 짜임과 높이(226)가 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <div role="status" aria-live="polite" className="animate-pulse">
                            <ComboBarLineChartSkeleton />
                            <span className="sr-only">경쟁기업 사업실적을 불러오는 중입니다.</span>
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <ComboBarLineChart
                            ariaLabel="경쟁기업 사업실적"
                            barLabel="매출액"
                            lineLabel="증가율"
                            data={COMPETITOR_DATA.slice(0, 6)}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="cblc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        경쟁기업 행을 화면 순서대로 항목 목록으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ComboBarLineChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cblc-props" className="flex flex-col gap-4">
                <h2 id="cblc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ComboBarLineChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComboBarLineChartGuidePage
