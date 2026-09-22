// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import {PercentageDonutChart, type PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import PropsTable from '@/components/custom/props-table'
import {DonutDistributionDemo} from './percentage-donut-chart-demo'

export const metadata: Metadata = {title: '기업 보유기술 도넛 (PercentageDonutChart)'}

// K-BIGx 기업혁신성장 보고서 "기업 보유기술" 카드와 같은 분류 · 색(navy.700 → blue.50 8단계)이다.
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

// 분류명이 긴 경우 — 어절 단위로 접히고 '비중%·건수개'는 한 덩어리로 남는다.
// 건수 없이 금액을 범례에 적는 예 — 신용/재무정보 탭 "담보 현황" 카드와 같은 값(비중은 금액 합계 대비).
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

// 비중이 큰 분류부터 넘긴다 — 12시에서 반시계 방향으로 이어진다.
<PercentageDonutChart
  showTooltip={false} // 비중 · 건수가 범례에 모두 적혀 있어 말풍선은 끈다
  ariaLabel="기업 보유기술 소분류별 비중과 건수"
  data={[
    {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24, color: 'var(--raw-navy-700)'},
    {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7, color: 'var(--raw-navy-500)'},
    // …
  ]}
/>`

const TECHNOLOGY_HOLDINGS_CODE = `import {
  PercentageDonutChart,
  type PercentageDonutItem,
} from '@/components/custom/percentage-donut-chart';

type ApiTechnologyHolding = {
  categoryCode: string;
  categoryName: string;
  ratio: number;
  patentCount: number;
  semanticColor: string;
};

// 예: API에서 받은 기술 분류별 보유 현황
const technologyHoldingsFromApi: ApiTechnologyHolding[] = [
  {
    categoryCode: 'wireless-service',
    categoryName: '무선·이동통신 서비스',
    ratio: 30,
    patentCount: 13,
    semanticColor: 'var(--ds-chart-2)',
  },
  {
    categoryCode: 'wireless-system',
    categoryName: '무선·이동통신 시스템',
    ratio: 25,
    patentCount: 11,
    semanticColor: 'var(--ds-chart-4)',
  },
  {
    categoryCode: 'iot-service',
    categoryName: '사물인터넷 응용서비스',
    ratio: 15,
    patentCount: 6,
    semanticColor: 'var(--ds-chart-1)',
  },
  {
    categoryCode: 'platform',
    categoryName: '정보통신 융합 플랫폼',
    ratio: 10,
    patentCount: 4,
    semanticColor: 'var(--ds-chart-3)',
  },
  {
    categoryCode: 'other',
    categoryName: '기타',
    ratio: 20,
    patentCount: 9,
    semanticColor: 'var(--ds-chart-5)',
  },
];

// API의 기술 분류별 건수와 비중을 이 구조로 변환합니다.
const toChartData = (apiData: ApiTechnologyHolding[]): PercentageDonutItem[] =>
  apiData.map((item) => ({
    id: item.categoryCode,
    label: item.categoryName,
    percentage: item.ratio,
    count: item.patentCount,
    color: item.semanticColor,
  }));

export default function TechnologyHoldingsSection() {
  return (
    <PercentageDonutChart
      data={toChartData(technologyHoldingsFromApi)}
      ariaLabel="소분류 기준 기업 보유기술 비중과 건수"
    />
  );
}`

const LAYOUT_RULES = [
    '도넛은 지름 260(구멍 40%)이고 12시에서 반시계 방향으로 이어집니다. 도넛 위에는 라벨이 없고 비중은 범례와 툴팁으로 읽습니다.',
    '범례는 16 사각 칩 · 분류명 14 Regular · 굵은 \u2018비중%·건수개\u2019이며, 항목 간격 16 · 도넛과 간격 60 으로 가운데 정렬됩니다.',
    '분류명이 길면 남은 폭 안에서 어절 단위로 접히고(붙여 쓴 긴 말은 칸 안에서 끊습니다), 칩은 첫 줄 옆에 남습니다.',
    '남은 폭이 160 보다 좁아지면 범례가 도넛 아래로 내려갑니다. 폭이 260 보다 좁으면 도넛도 함께 줄어듭니다.',
    '차트 폭이 384~511 인 칸(1024 화면의 2열 카드 등)에서는 도넛 208 · 간격 24 로 줄여 범례를 옆에 둡니다 — 범례가 아래로 내려가 카드가 길어지면 옆 카드 아래가 비기 때문입니다.',
] as const

const PROPS_ITEMS = [
    [
        'PercentageDonutChart',
        'data',
        '분류별 고유 id · 이름 · 비중(%) · 건수(선택) · 색입니다. 비중이 큰 분류부터 넘깁니다.',
        '-',
        'PercentageDonutItem[]',
    ],
    ['PercentageDonutChart', 'ariaLabel', '도넛이 비교하는 분류 기준과 데이터 범위를 설명합니다.', '-', 'string'],
    [
        'PercentageDonutItem',
        'valueLabel',
        "범례 이름 옆 굵은 값입니다. 없으면 '비중%·건수개'(건수가 없으면 '비중%'). 금액 등 다른 값을 적을 때 넘깁니다(담보 현황 '2,000').",
        'undefined',
        'string',
    ],
    [
        'PercentageDonutChart',
        'calloutId',
        '조각 바깥에 비중(%)을 굵게 적을 항목 id 입니다. 조각 가운데 각도 바깥에 짧은 이끌림 선과 함께 붙습니다.',
        'undefined',
        'string',
    ],
    [
        'PercentageDonutChart',
        'showTooltip',
        '조각 위에 올렸을 때 뜨는 말풍선입니다. 비중 · 건수가 범례에 모두 적혀 있는 보고서에서는 끕니다.',
        'true',
        'boolean',
    ],
    [
        'PercentageDonutChart',
        'className · div props',
        '바깥 여백 등 네이티브 div 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
    ['PercentageDonutItem', 'id', '분류의 고유 값입니다. 조각 색 변수 이름에도 쓰입니다.', '-', 'string'],
    ['PercentageDonutItem', 'label', '범례와 툴팁에 보이는 분류명입니다.', '-', 'string'],
    [
        'PercentageDonutItem',
        'percentage / count',
        '비중(%)과 건수입니다. 범례에 \u2018비중%·건수개\u2019로 보입니다.',
        '-',
        'number / number',
    ],
    [
        'PercentageDonutItem',
        'color',
        '조각과 범례 칩의 색입니다. 토큰 변수(var(--raw-*) · var(--ds-chart-*))를 씁니다.',
        '-',
        'string',
    ],
] as const

const PercentageDonutChartGuidePage = () => (
    <GuidePageShell
        title="기업 보유기술 도넛 (PercentageDonutChart)"
        description="분류별 비중을 도넛과 범례로 함께 보여 주는 차트입니다. 도넛은 비중의 크기를, 범례는 분류명과 '비중%·건수개'를 읽게 합니다."
    >
        <BaseCard>
            <section aria-labelledby="pdc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="pdc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 기업 보유기술 카드와 같은 구성입니다(8분류 · navy.700 → blue.50).
                        조각에 마우스를 올리면 분류명과 비중 · 건수를 툴팁으로 보여 주고, 전체 수치는 화면 낭독기용 숨김
                        목록으로도 제공됩니다.
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-layout" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="pdc-layout" className="typo-h4-bold">
                        배치 (Layout)
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                        {LAYOUT_RULES.map((rule) => (
                            <li key={rule} className="flex">
                                <ListMarker type="unordered" />
                                <span className="min-w-0">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">분류명이 긴 경우</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
                            <PercentageDonutChart data={LONG_LABEL_DATA} ariaLabel="분류명이 긴 기업 보유기술" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">범례 값 바꾸기 (항목 valueLabel · 금액)</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
                            <PercentageDonutChart data={COLLATERAL_DATA} ariaLabel="담보 종류별 금액" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">조각 바깥 강조 글자 (calloutId)</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
                            <PercentageDonutChart
                                data={COLLATERAL_PERCENT_DATA}
                                calloutId="special-mortgage"
                                ariaLabel="담보 종류별 비중 — 가장 큰 조각 강조"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">좁은 폭(범례가 아래로)</h3>
                        <div className="border-subtle-3 bg-card max-w-80 rounded-sm border p-6">
                            <PercentageDonutChart data={REPORT_DATA} ariaLabel="좁은 폭의 기업 보유기술" />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-distribution" className="flex flex-col gap-4">
                <div>
                    <h2 id="pdc-distribution" className="typo-h4-bold">
                        분포 (Distribution)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비중 분포가 달라도 같은 틀 안에서 조각 크기만 바뀝니다. 버튼으로 분포를 바꿔 봅니다.
                    </p>
                </div>
                <div className="bg-surface border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <DonutDistributionDemo />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="pdc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">ChartSkeleton type=&quot;donut&quot;</code>
                        을 같은 자리에 둡니다. 도넛 260 · 간격 60 · 사각 칩 범례 8줄의 짜임이 실제 차트와 같아 불러온 뒤
                        자리가 흔들리지 않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
                            <ChartSkeleton type="donut" label="기업 보유기술을 불러오는 중입니다." />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <div className="border-subtle-3 bg-card rounded-sm border p-6">
                            <PercentageDonutChart data={REPORT_DATA} ariaLabel="기업 보유기술 소분류별 비중과 건수" />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="pdc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 분류별 비중 · 건수를 PercentageDonutItem 모양으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock
                    code={TECHNOLOGY_HOLDINGS_CODE}
                    language="tsx"
                    copyLabel="PercentageDonutChart 데이터 연결 코드 복사"
                />
                <LicenseNotice
                    libraries={[{name: 'Recharts', href: 'https://github.com/recharts/recharts/blob/main/LICENSE'}]}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pdc-props" className="flex flex-col gap-4">
                <h2 id="pdc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="PercentageDonutChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PercentageDonutChartGuidePage
