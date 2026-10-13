// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice} from '@/components/custom/license-notice'
import {PercentageDonutChart, type PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import {DONUT_COLOR_RAMPS, donutColorsFor} from '@/components/custom/percentage-donut-colors'
import PropsTable from '@/components/custom/props-table'
import {DonutDistributionDemo} from './percentage-donut-chart-demo'

export const metadata: Metadata = {title: '기업 보유기술 도넛 (PercentageDonutChart)'}

// 비중이 큰 분류부터 진한 색에서 옅은 색 순으로 칠한 8분류 예시.
const REPORT_DATA: PercentageDonutItem[] = [
    {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24},
    {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7},
    {id: 't3', label: 'IoT 플랫폼', percentage: 10, count: 5},
    {id: 't4', label: '네트워크 보안', percentage: 8, count: 4},
    {id: 't5', label: '위성 통신', percentage: 6, count: 3},
    {id: 't6', label: '광통신 부품', percentage: 5, count: 2},
    {id: 't7', label: '전파 계측', percentage: 4, count: 2},
    {id: 't8', label: '기타', percentage: 3, count: 1},
].map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]}))

// 건수 없이 금액을 범례에 적는 예(비중은 금액 합계 대비).
const COLLATERAL_DATA: PercentageDonutItem[] = [
    {id: 'real-estate', label: '부동산', percentage: 23, valueLabel: '2,000', color: 'var(--ds-donut-2)'},
    {id: 'special-mortgage', label: '특수저당', percentage: 44.3, valueLabel: '3,862', color: 'var(--ds-donut-4)'},
    {id: 'guarantee', label: '보증', percentage: 32.7, valueLabel: '2,850', color: 'var(--ds-donut-6)'},
]
// 툴팁 예 — 범례에는 비중만 적는다(툴팁은 분류명만).
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

// 비중이 큰 분류부터 넘기면 12시에서 시계 방향으로 이어집니다.
<PercentageDonutChart
  ariaLabel="기업 보유기술 소분류별 비중과 건수"
  data={[
    {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24, color: donutColorsFor(8)[0]},
    {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7, color: donutColorsFor(8)[1]},
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

// 도넛 아래 이름 · 그리는 움직임 끄기
<PercentageDonutChart data={data} caption="중분류 기준 · 기업수 비중" animate={false} ariaLabel="…" />`

// 항목 수별 색 단계 — 비중 내림차순 데이터에 donutColorsFor(항목 수) 를 차례로 입힌다(2 ~ 8개).
const RAMP_CASES = Object.keys(DONUT_COLOR_RAMPS)
    .map(Number)
    .map((count) => ({
        count,
        colors: DONUT_COLOR_RAMPS[count],
        data: Array.from({length: count}, (_, index) => ({
            id: `item-${index + 1}`,
            label: `분류 ${index + 1}`,
            percentage: Math.round(100 / count),
            count: count - index,
            color: DONUT_COLOR_RAMPS[count][index],
        })),
    }))

const RAMP_CODE = `import {donutColorsFor} from '@/components/custom/percentage-donut-colors'

// 비중 내림차순으로 정렬한 뒤 항목 수에 맞는 색 단계를 차례로 입힙니다 — 첫 항목이 가장 진한 색.
const data = sorted.map((item, index, items) => ({...item, color: donutColorsFor(items.length)[index]}))`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

<ChartSkeleton type="donut" label="기업 보유기술을 불러오는 중입니다." />`

const PROPS_ITEMS = [
    ['PercentageDonutChart', 'data', '분류 목록입니다. 비중이 큰 분류부터 넘깁니다.', '-', 'PercentageDonutItem[]'],
    ['PercentageDonutChart', 'ariaLabel', '도넛이 비교하는 분류 기준과 데이터 범위를 설명합니다.', '-', 'string'],
    [
        'PercentageDonutChart',
        'showTooltip',
        '조각 위에 올렸을 때 그 조각의 분류명(범례 이름)만 보이는 툴팁입니다. 상자 폭은 이름 글자만큼입니다. 비중 · 값은 범례로 읽습니다.',
        'true',
        'boolean',
    ],
    [
        'PercentageDonutChart',
        'animate',
        '그리는 움직임입니다. 안 주면 문서 설정을 따르고(접근성 항목 참고), 인쇄용 문서처럼 즉시 찍혀야 하면 끕니다.',
        '문서 설정',
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
        'className · div props',
        '바깥 div 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
    ['PercentageDonutItem', 'id', '분류의 고유 값입니다. 조각 색 변수 이름에도 쓰입니다.', '-', 'string'],
    ['PercentageDonutItem', 'label', '범례와 툴팁에 보이는 분류명입니다. 툴팁에는 이 이름만 보입니다.', '-', 'string'],
    ['PercentageDonutItem', 'percentage', '비중(%)입니다. 조각 크기를 정합니다.', '-', 'number'],
    ['PercentageDonutItem', 'color', '조각과 범례 칩의 색(토큰 변수)입니다.', '-', 'string'],
    ['PercentageDonutItem', 'count', '건수입니다. 범례에 \u2018비중%·건수개\u2019로 보입니다.', 'undefined', 'number'],
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
                        도넛은 12시에서 시계 방향으로 <code>data</code> 순서대로 이어지며, 도넛 위에는 라벨이 없고
                        비중은 범례로 읽고, 조각에 올리면 툴팁이 분류명만 보입니다. 색은 항목마다 <code>color</code> 로
                        넘깁니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-147 rounded-sm border p-6">
                    <PercentageDonutChart data={REPORT_DATA} ariaLabel="기업 보유기술 소분류별 비중과 건수" />
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
                        <h3 className="typo-title-m-bold text-foreground">범례 값 · 툴팁</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>valueLabel</code> 로 금액 같은 값을 적습니다. 비중은 도넛 위에 적지 않고, 조각에
                            마우스를 올리면 툴팁(기본 켬)이 그 조각의 분류명(범례 이름)만 보입니다 — 비중 · 값은 범례에
                            있어 툴팁에 다시 적지 않습니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">범례 값 바꾸기 (valueLabel)</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <PercentageDonutChart data={COLLATERAL_DATA} ariaLabel="담보 종류별 금액" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">툴팁 (조각에 올렸을 때)</p>
                                <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                    <PercentageDonutChart data={COLLATERAL_PERCENT_DATA} ariaLabel="담보 종류별 비중" />
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
                        <h3 className="typo-title-m-bold text-foreground">항목 수별 색 단계</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            색은 항목 수(2 ~ 8개)에 따라 정해진 단계를 쓰고, 비중이 큰 항목부터 진한 색을 받습니다. 첫
                            항목은 12시 오른쪽 조각입니다. 9개 이상은 색이 반복되므로 8개까지만 보입니다.
                        </p>
                        <p className="typo-body-l-regular text-label-foreground">
                            색은 시맨틱 토큰 <code>donut-1</code> ~ <code>donut-8</code>(진한 순)이고 단계마다 이 중 몇
                            개를 고릅니다. 다크 모드에서는 navy · blue 의 밝은 단계로 바뀌어 어두운 카드 위에서도 조각이
                            구분됩니다. 색을 직접 적어야 하면 <code>var(--ds-donut-&lt;n&gt;)</code> 를 씁니다.
                        </p>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {RAMP_CASES.map((item) => (
                                <li key={item.count} className="flex flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{item.count}개</p>
                                    <ul className="flex list-none gap-1" aria-label={`${item.count}개 색 단계`}>
                                        {item.colors.map((color) => (
                                            <li
                                                key={color}
                                                className="border-subtle-3 size-4 rounded-xs border"
                                                style={{backgroundColor: color}}
                                                title={color}
                                            />
                                        ))}
                                    </ul>
                                    <div className="border-subtle-3 bg-card rounded-sm border p-6">
                                        <PercentageDonutChart
                                            data={item.data}
                                            ariaLabel={`${item.count}개 항목 색 단계`}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <CodeBlock code={RAMP_CODE} language="tsx" copyLabel="색 단계 코드 복사" />
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
                    <li>
                        움직임은 0.6초(<code>CHART_ANIMATION_MS</code> · custom/chart-reveal.tsx)이고,{' '}
                        <code>animate</code> 를 안 주면 문서 설정을 따릅니다 — K-BIGx 보고서처럼{' '}
                        <code>ChartRevealProvider</code> 안에서는 차트가 화면에 절반 이상 보일 때 한 번 움직이고 동작
                        줄이기 설정이면 움직이지 않으며, 그 밖에서는 그려질 때 바로 움직입니다[6.3.1].
                    </li>
                    <li>
                        recharts 의 키보드 탐색 층(<code>accessibilityLayer</code>)은 끕니다 — 값은 숨김 표가 읽어 주고,{' '}
                        <code>role=&quot;img&quot;</code> 안에 <code>tabindex</code> 가 들어가는 마크업 경고를
                        피합니다(접근성 검사 예외사항 참고)[8.1.1].
                    </li>
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
