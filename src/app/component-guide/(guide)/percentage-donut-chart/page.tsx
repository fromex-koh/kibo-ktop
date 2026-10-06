// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice} from '@/components/custom/license-notice'
import {PercentageDonutChart, type PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import PropsTable from '@/components/custom/props-table'
import {DonutDistributionDemo} from './percentage-donut-chart-demo'

export const metadata: Metadata = {title: '기업 보유기술 도넛 (PercentageDonutChart)'}

// 비중이 큰 분류부터 진한 색에서 옅은 색 순으로 칠한 8분류 예시.
const REPORT_DATA: PercentageDonutItem[] = [
    {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24, color: 'var(--raw-navy-700)'},
    {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7, color: 'var(--raw-navy-500)'},
    {id: 't3', label: 'IoT 플랫폼', percentage: 10, count: 5, color: 'var(--raw-blue-700)'},
    {id: 't4', label: '네트워크 보안', percentage: 8, count: 4, color: 'var(--raw-blue-500)'},
    {id: 't5', label: '위성 통신', percentage: 6, count: 3, color: 'var(--raw-blue-400)'},
    {id: 't6', label: '광통신 부품', percentage: 5, count: 2, color: 'var(--raw-blue-300)'},
    {id: 't7', label: '전파 계측', percentage: 4, count: 2, color: 'var(--raw-blue-200)'},
    {id: 't8', label: '기타', percentage: 3, count: 1, color: 'var(--raw-blue-50)'},
]

// 건수 없이 금액을 범례에 적는 예(비중은 금액 합계 대비).
const COLLATERAL_DATA: PercentageDonutItem[] = [
    {id: 'real-estate', label: '부동산', percentage: 23, valueLabel: '2,000', color: 'var(--raw-navy-500)'},
    {id: 'special-mortgage', label: '특수저당', percentage: 44.3, valueLabel: '3,862', color: 'var(--raw-blue-500)'},
    {id: 'guarantee', label: '보증', percentage: 32.7, valueLabel: '2,850', color: 'var(--raw-blue-300)'},
]
// 강조 글자 예 — 범례에는 비중만 적는다.
const COLLATERAL_PERCENT_DATA: PercentageDonutItem[] = COLLATERAL_DATA.map((item) => ({
    ...item,
    valueLabel: `${item.percentage}%`,
}))

const LONG_LABEL_DATA: PercentageDonutItem[] = REPORT_DATA.map((item, index) =>
    index === 0
        ? {...item, label: '무선 통신·네트워크 및 차세대 이동통신 기반 초고속 전송 기술'}
        : index === 1
          ? {...item, label: '이동통신서비스플랫폼운영기술고도화'}
          : item,
)

const USAGE_CODE = `import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'

// 비중이 큰 분류부터 넘기면 12시에서 반시계 방향으로 이어집니다.
<PercentageDonutChart
  showTooltip={false} // 비중 · 건수가 범례에 모두 적혀 있어 말풍선은 끕니다
  ariaLabel="기업 보유기술 소분류별 비중과 건수"
  data={[
    {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24, color: 'var(--raw-navy-700)'},
    {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7, color: 'var(--raw-navy-500)'},
    // …
  ]}
/>`

const DATA_CODE = `import {
  PercentageDonutChart,
  type PercentageDonutItem,
} from '@/components/custom/percentage-donut-chart'

// API 의 분류별 비중 · 건수를 PercentageDonutItem 모양으로 바꿔 넘깁니다.
const toChartData = (apiData: ApiTechnologyHolding[]): PercentageDonutItem[] =>
  apiData.map((item) => ({
    id: item.categoryCode,
    label: item.categoryName,
    percentage: item.ratio,
    count: item.patentCount,
    color: item.semanticColor, // 예: 'var(--ds-chart-2)'
  }))

<PercentageDonutChart
  data={toChartData(technologyHoldingsFromApi)}
  ariaLabel="소분류 기준 기업 보유기술 비중과 건수"
/>`

const OPTION_CODE = `// 범례 값을 바꿉니다 — 항목의 valueLabel 이 '비중%·건수개' 를 대신합니다.
<PercentageDonutChart data={[{id: 'real-estate', label: '부동산', percentage: 23, valueLabel: '2,000', color: '…'}]} ariaLabel="…" />

// 가장 큰 조각의 비중을 도넛 바깥에 적습니다.
<PercentageDonutChart data={data} calloutId="special-mortgage" ariaLabel="…" />

// 도넛 아래 이름 · 그리는 움직임 끄기
<PercentageDonutChart data={data} caption="중분류 기준 · 기업수 비중" animate={false} ariaLabel="…" />`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

<ChartSkeleton type="donut" label="기업 보유기술을 불러오는 중입니다." />`

const PROPS_ITEMS = [
    ['PercentageDonutChart', 'data', '분류 목록입니다. 비중이 큰 분류부터 넘깁니다.', '-', 'PercentageDonutItem[]'],
    ['PercentageDonutChart', 'ariaLabel', '도넛이 비교하는 분류 기준과 데이터 범위를 설명합니다.', '-', 'string'],
    [
        'PercentageDonutChart',
        'showTooltip',
        '조각 위에 올렸을 때 뜨는 말풍선입니다. 비중 · 건수가 범례에 모두 적혀 있으면 끕니다.',
        'true',
        'boolean',
    ],
    [
        'PercentageDonutChart',
        'animate',
        '그리는 움직임입니다. 인쇄용 문서처럼 그린 즉시 찍혀야 하면 끕니다.',
        'true',
        'boolean',
    ],
    [
        'PercentageDonutChart',
        'caption',
        '도넛 아래 이름입니다. 도넛이 둘 이상 나란히 놓여 무엇의 비중인지 밝혀야 할 때 씁니다.',
        'undefined',
        'string',
    ],
    [
        'PercentageDonutChart',
        'calloutId',
        '조각 바깥에 비중(%)을 굵게 적을 항목의 id 입니다. 비중이 0 이하면 적지 않습니다.',
        'undefined',
        'string',
    ],
    [
        'PercentageDonutChart',
        'className · div props',
        '바깥 div 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
    ['PercentageDonutItem', 'id', '분류의 고유 값입니다. 조각 색 변수 이름에도 쓰입니다.', '-', 'string'],
    ['PercentageDonutItem', 'label', '범례와 툴팁에 보이는 분류명입니다.', '-', 'string'],
    ['PercentageDonutItem', 'percentage', '비중(%)입니다. 조각 크기를 정합니다.', '-', 'number'],
    ['PercentageDonutItem', 'color', '조각과 범례 칩의 색(토큰 변수)입니다.', '-', 'string'],
    [
        'PercentageDonutItem',
        'count',
        '건수입니다. 범례에 \u2018비중%·건수개\u2019로, 말풍선에 비중과 함께 보입니다.',
        'undefined',
        'number',
    ],
    [
        'PercentageDonutItem',
        'valueLabel',
        '범례 이름 옆 굵은 값입니다. 없으면 \u2018비중%·건수개\u2019(건수가 없으면 \u2018비중%\u2019)입니다.',
        'undefined',
        'string',
    ],
] as const

const PercentageDonutChartGuidePage = () => (
    <GuidePageShell
        title="기업 보유기술 도넛 (PercentageDonutChart)"
        description="분류별 비중을 도넛과 범례로 함께 보여 주는 차트입니다."
    >
        <BaseCard>
            <section aria-labelledby="pdc-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pdc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        도넛은 12시에서 반시계 방향으로 <code>data</code> 순서대로 이어지며, 도넛 위에는 라벨이 없고
                        비중은 범례와 툴팁으로 읽습니다. 색은 항목마다 <code>color</code> 로 넘깁니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-147 rounded-sm border p-6">
                    <PercentageDonutChart
                        data={REPORT_DATA}
                        showTooltip={false}
                        ariaLabel="기업 보유기술 소분류별 비중과 건수"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pdc-variants" className="typo-h4-bold">
                        변형과 상태 예시
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">범례 값 · 강조 · 툴팁</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>valueLabel</code> 로 금액 같은 값을 적고, <code>calloutId</code> 로 가장 큰 조각의
                            비중을 바깥에 적습니다. 툴팁(기본 켬)은 조각 위에서 분류명과 비중 · 건수를 보입니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">범례 값 바꾸기 (valueLabel)</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <PercentageDonutChart data={COLLATERAL_DATA} ariaLabel="담보 종류별 금액" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">조각 바깥 강조 (calloutId)</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <PercentageDonutChart
                                        data={COLLATERAL_PERCENT_DATA}
                                        calloutId="special-mortgage"
                                        ariaLabel="담보 종류별 비중 — 가장 큰 조각 강조"
                                    />
                                </div>
                            </div>
                        </div>
                        <CodeBlock code={OPTION_CODE} language="tsx" copyLabel="옵션 코드 복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">배치와 폭</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            도넛과 범례는 나란히 가운데 정렬됩니다. 분류명이 길면 어절 단위로 접히고, 남은 폭이 좁아지면
                            범례가 도넛 아래로 내려갑니다. 컨테이너 폭이 384~511 이면 도넛을 줄여 범례를 옆에 둡니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">분류명이 긴 경우</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <PercentageDonutChart
                                        data={LONG_LABEL_DATA}
                                        ariaLabel="분류명이 긴 기업 보유기술"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">좁은 폭 (범례가 아래로)</p>
                                <div className="border-subtle-3 bg-card max-w-80 rounded-sm border p-6">
                                    <PercentageDonutChart data={REPORT_DATA} ariaLabel="좁은 폭의 기업 보유기술" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">분포</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            비중 분포가 달라도 같은 틀에서 조각 크기만 바뀝니다.
                        </p>
                        <div className="bg-surface border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                            <DonutDistributionDemo />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (ChartSkeleton)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            로딩 prop 이 없어 같은 자리에 스켈레톤을 둡니다. 도넛 · 범례 8줄의 짜임이 같아 불러온 뒤
                            자리가 흔들리지 않습니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러오는 중</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <ChartSkeleton type="donut" label="기업 보유기술을 불러오는 중입니다." />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러온 뒤</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <PercentageDonutChart
                                        data={REPORT_DATA}
                                        ariaLabel="기업 보유기술 소분류별 비중과 건수"
                                    />
                                </div>
                            </div>
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pdc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        도넛은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 읽히므로 비교 기준과
                        범위를 적습니다[5.1.1].
                    </li>
                    <li>
                        분류별 비중 · 값은 화면에 보이지 않는 목록으로도 제공되어, 도넛 대체 텍스트의 표 대용으로
                        읽힙니다[5.1.1].
                    </li>
                    <li>범례에 분류명과 값이 글자로 있어 색만으로 분류를 구분하지 않습니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="pdc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PercentageDonutChart Props 목록" />
                <LicenseNotice
                    libraries={[{name: 'Recharts', href: 'https://github.com/recharts/recharts/blob/main/LICENSE'}]}
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PercentageDonutChartGuidePage
