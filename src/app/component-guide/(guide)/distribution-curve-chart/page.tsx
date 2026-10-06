// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DistributionCurveChartSkeleton} from '@/components/composite/distribution-curve-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {DistributionCurveChart, type DistributionCurveChartProps} from '@/components/custom/distribution-curve-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '분포 곡선 (DistributionCurveChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

type CaseProps = Pick<
    DistributionCurveChartProps,
    'mean' | 'standardDeviation' | 'value' | 'markerLabel' | 'min' | 'max' | 'tickStep'
>

const REPORT_CASE: CaseProps = {mean: 50.5, standardDeviation: 21.5, value: 73.8, markerLabel: '상위 2.2%'}

const USAGE_CODE = `import {DistributionCurveChart} from '@/components/custom/distribution-curve-chart'

<DistributionCurveChart
  ariaLabel="Tech-Index 표준분포와 신청기업 위치 — 상위 2.2%"
  mean={50.5}
  standardDeviation={21.5}
  value={73.8}
  markerLabel="상위 2.2%"
/>`

const PLAIN_CODE = `<DistributionCurveChart
  variant="plain"
  animate={false}
  ariaLabel="전체 중소기업 Tech-Index 분포와 신청기업의 자리"
  mean={50.5}
  standardDeviation={18}
  value={73.7}
  markerLabel="상위 2.2%"
  yTicks={[4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]}
  yAxisLabel="상대빈도수"
  xAxisLabel="Tech-Index"
  legendLabel="전체 (평균 50.5점)"
  heightClassName="h-61.5"
/>`

const LOADING_CODE = `import {DistributionCurveChartSkeleton} from '@/components/composite/distribution-curve-chart-skeleton'

// isLoading 을 넘기면 차트 자신이 스켈레톤을 보인다. 차트와 따로 자리를 잡을 때는 스켈레톤을 직접 둔다.
<DistributionCurveChart ariaLabel="…" mean={mean} standardDeviation={deviation} isLoading={isLoading} />
<DistributionCurveChartSkeleton label="Tech-Index 표준정보를 불러오는 중입니다." />`

const DATA_CODE = `// 분포(평균 · 표준편차)와 조회 기업 점수 · 순위 문구를 그대로 넘긴다.
// 순위 문구는 화면이 계산하지 않고 백엔드가 준 값(예: '상위 2.2%')을 쓴다.
<DistributionCurveChart
  ariaLabel={\`Tech-Index 표준분포와 신청기업 위치 — \${standard.percentileLabel}\`}
  mean={standard.mean}
  standardDeviation={standard.standardDeviation}
  value={techIndex.score}
  markerLabel={standard.percentileLabel}
/>`

const SPECIAL_CASES: readonly {title: string; description: string; chart: CaseProps}[] = [
    {
        title: '평균보다 낮은 점수',
        description: '글자는 점 아래에 놓입니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 38.2, markerLabel: '하위 24.6%'},
    },
    {
        title: '분포 꼬리',
        description: '점 아래에 글자 자리가 없으면 글자를 점 위로 올립니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 94.5, markerLabel: '상위 0.8%'},
    },
    {
        title: '0점',
        description: '글자를 왼쪽 끝에 붙여 칸 밖으로 나가지 않게 합니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 0, markerLabel: '하위 0.3%'},
    },
    {
        title: '100점',
        description: '글자를 오른쪽 끝에 붙입니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 100, markerLabel: '상위 0.3%'},
    },
    {
        title: '범위를 벗어난 점수',
        description: '범위 끝(0 · 100)으로 맞춰 점을 찍습니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 124, markerLabel: '상위 0.3%'},
    },
    {
        title: '긴 점 글자',
        description: '글자가 칸 끝을 넘으면 그 끝 쪽에 붙입니다.',
        chart: {mean: 50.5, standardDeviation: 18, value: 88, markerLabel: '상위 2.2% (동일업종 3위)'},
    },
    {
        title: '표준편차가 작을 때 (뾰족한 분포)',
        description: '꼭대기는 늘 칸 높이의 92% 에 닿고, 평균에서 먼 점의 글자는 위로 올라갑니다.',
        chart: {mean: 50.5, standardDeviation: 5, value: 62, markerLabel: '상위 1.1%'},
    },
    {
        title: '표준편차가 클 때 (평평한 분포)',
        description: '범위 안의 가장 높은 곳을 92% 로 맞춰 곡선이 납작하게 눕지 않습니다.',
        chart: {mean: 50.5, standardDeviation: 60, value: 73.8, markerLabel: '상위 35.2%'},
    },
    {
        title: '평균이 한쪽으로 치우칠 때',
        description: '보이는 범위의 가장 높은 곳을 92% 로 맞춥니다.',
        chart: {mean: 92, standardDeviation: 12, value: 73.8, markerLabel: '하위 6.5%'},
    },
    {
        title: '점수 없음',
        description: '점수가 없으면 점 · 글자 없이 분포만 그립니다.',
        chart: {mean: 50.5, standardDeviation: 18},
    },
    {
        title: '표준편차 0',
        description: '가로 범위의 5% 로 맞춰 곡선이 선 한 줄로 사라지지 않게 합니다.',
        chart: {mean: 50.5, standardDeviation: 0, value: 50.5, markerLabel: '상위 50.0%'},
    },
    {
        title: '눈금 간격이 너무 좁을 때',
        description: '칸이 20 개를 넘지 않게 간격을 넓힙니다(tickStep 1 → 5).',
        chart: {...REPORT_CASE, tickStep: 1},
    },
] as const

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'curve',
        cells: [
            '평균 · 표준편차로 그리는 점수 분포와 조회 대상 위치',
            <code key="component">DistributionCurveChart</code>,
            '곡선은 두 값으로 계산해 그립니다. 실제 표본 분포를 그리지 않습니다.',
        ],
    },
    {
        key: 'grade',
        cells: [
            '등급별 비율 곡선과 같은 칸의 표',
            <Link key="component" href="/component-guide/grade-distribution-chart" className={LINK_CLASS}>
                GradeDistributionChart
            </Link>,
            '곡선과 등급 · 백분율 · 누적비율 표를 한 격자에 맞춰 그리고 평가대상 등급 칸을 강조합니다.',
        ],
    },
] as const

const PROPS_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

type PropRow = readonly [name: string, note: string, defaultValue: string, type: string]

const toRows = (items: readonly PropRow[]) =>
    items.map(([name, note, defaultValue, type]) => ({
        key: name,
        cells: [
            <code key="prop">{name}</code>,
            <code key="type">{type}</code>,
            <code key="default">{defaultValue}</code>,
            note,
        ],
    }))

const DATA_ROWS = toRows([
    ['ariaLabel', '차트 이름입니다. 숨김 문단과 함께 값을 전달합니다.', '-', 'string'],
    ['mean', '분포 평균입니다.', '-', 'number'],
    ['standardDeviation', '분포 표준편차입니다. 0 이하 · 숫자가 아니면 가로 범위의 5% 로 맞춥니다.', '-', 'number'],
    ['value', '조회 대상 점수입니다. 없으면 점을 찍지 않고, 범위를 벗어나면 끝으로 맞춥니다.', 'undefined', 'number'],
    ['markerLabel', '점 글자입니다. 예: 상위 2.2%', 'undefined', 'string'],
    ['min · max', '가로 범위입니다.', '0 · 100', 'number'],
    ['tickStep', '가로 눈금 간격입니다. 칸이 20개를 넘지 않게 넓혀집니다.', '10', 'number'],
])

const FRAME_ROWS = toRows([
    ['variant', "'plain' 은 세로 점선만 두고 점 글자를 늘 점 아래에 붙입니다.", "'cells'", "'cells' | 'plain'"],
    ['color', '곡선 · 점 색입니다. 토큰 변수를 씁니다.', "'var(--raw-blue-500)'", 'string'],
    ['heightClassName', '칸 높이 클래스입니다. 가로 눈금 글자 자리를 포함합니다.', "'h-49'", 'string'],
    [
        'yTicks',
        '세로 눈금 숫자입니다. 큰 값부터 넣으며, 주면 곡선도 이 눈금 위에서 읽히게 그립니다.',
        'undefined',
        'readonly number[]',
    ],
    ['peakValue', 'yTicks 를 줄 때 곡선 꼭대기가 가리키는 값입니다.', '첫 눈금보다 반 칸 아래', 'number'],
    ['yAxisLabel', '세로 눈금 위 이름입니다. 예: 상대빈도수', 'undefined', 'string'],
    ['xAxisLabel', '가로 눈금 아래 가운데 이름입니다. 예: Tech-Index', 'undefined', 'string'],
    ['legendLabel', '오른쪽 위 범례입니다. 곡선과 같은 색 견본이 앞에 놓입니다.', 'undefined', 'string'],
])

const STATE_ROWS = toRows([
    ['animate', '곡선이 그려지는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['isLoading', '스켈레톤을 대신 보입니다. 하이드레이션 전에는 자동으로 보입니다.', 'false', 'boolean'],
    ['loadingLabel', '불러오는 중에 화면 낭독기가 읽을 문구입니다.', "'그래프를 불러오는 중입니다.'", 'string'],
])

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const DistributionCurveChartGuidePage = () => (
    <GuidePageShell
        title="분포 곡선 (DistributionCurveChart)"
        description="점수 분포를 종 모양 곡선으로 그리고, 조회 대상 점수 자리에 점과 순위 글자를 찍습니다."
    >
        <BaseCard>
            <section aria-labelledby="dcc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>mean</code> · <code>standardDeviation</code> 으로 곡선을 그리고 <code>value</code> 자리에
                        점과 <code>markerLabel</code> 을 찍습니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <DistributionCurveChart ariaLabel="Tech-Index 표준분포와 신청기업 위치" {...REPORT_CASE} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-variants" className="typo-h4-bold">
                        칸 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>variant</code> 로 칸 모양을 고릅니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">cells (기본)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            바닥과 양 끝은 실선, 눈금 사이는 점선입니다. 점 글자는 기본이 점 아래이고 곡선이나 바닥에
                            닿으면 점 위로 올라갑니다. 칸 상자 아래에 가로 눈금 숫자가 놓이며 처음과 마지막 숫자는 칸
                            끝에 붙습니다.
                        </p>
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">plain</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            세로 점선만 남기고 점 글자를 늘 점 아래에 둡니다. <code>yTicks</code> 와 축 이름 · 범례를
                            함께 쓰는 인쇄용 모양입니다.
                        </p>
                        <DistributionCurveChart
                            animate={false}
                            ariaLabel="전체 중소기업 Tech-Index 분포와 신청기업의 자리"
                            mean={50.5}
                            standardDeviation={18}
                            value={73.7}
                            markerLabel="상위 2.2%"
                            variant="plain"
                            yTicks={[4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]}
                            yAxisLabel="상대빈도수"
                            xAxisLabel="Tech-Index"
                            legendLabel="전체 (평균 50.5점)"
                            heightClassName="h-61.5"
                        />
                        <CodeBlock code={PLAIN_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-states" className="typo-h4-bold">
                        상태와 특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        받은 값을 그대로 넘기면 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 이거나 하이드레이션 전이면 스켈레톤이 보입니다. 칸 상자 · 곡선 면 ·
                            눈금 자리가 같아 자리가 흔들리지 않습니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <DistributionCurveChartSkeleton label="Tech-Index 표준정보를 불러오는 중입니다." />
                            <DistributionCurveChart ariaLabel="Tech-Index 표준분포와 신청기업 위치" {...REPORT_CASE} />
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">특이한 값</h3>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <DistributionCurveChart ariaLabel={item.title} {...item.chart} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        분포 값과 조회 대상 점수 · 순위 문구를 그대로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        점수 분포인지 등급별 비율인지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="DistributionCurveChart · GradeDistributionChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용처는 순위가 드러나는 <code>ariaLabel</code> 을 넘깁니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 붙입니다[5.1.1].
                    </li>
                    <li>
                        표 대신 숨김 문단이 평균 · 점수 · 점 글자(<code>markerLabel</code>)를 읽어 줍니다[5.1.1].
                    </li>
                    <li>순위는 점 위치뿐 아니라 점 글자로도 전달됩니다[5.3.1].</li>
                    <li>
                        <code>animate</code> 로 움직임을 끌 수 있습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dcc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dcc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ariaLabel</code> · <code>mean</code> · <code>standardDeviation</code> 이 필수입니다.
                        나머지 <code>div</code> 속성은 루트 요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">데이터</h3>
                        <Table
                            caption="DistributionCurveChart 데이터 Props"
                            columns={PROPS_COLUMNS}
                            rows={DATA_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">틀과 축</h3>
                        <Table
                            caption="DistributionCurveChart 틀 Props"
                            columns={PROPS_COLUMNS}
                            rows={FRAME_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">동작과 상태</h3>
                        <Table
                            caption="DistributionCurveChart 상태 Props"
                            columns={PROPS_COLUMNS}
                            rows={STATE_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">DistributionCurveChartSkeleton</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>label</code>(<code>string</code>, 기본 “그래프를 불러오는 중입니다.”)은 화면 낭독기가
                            읽을 문구입니다.
                        </p>
                    </div>
                </div>
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DistributionCurveChartGuidePage
