// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {PositioningScatterChart, type PositioningScatterPoint} from '@/components/custom/positioning-scatter-chart'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '포지셔닝 산점도 (PositioningScatterChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const SAMPLE_POINTS: readonly PositioningScatterPoint[] = [
    {id: 'applicant', x: 78, y: 82, isPrimary: true},
    {id: 'peer-1', x: 26, y: 62},
    {id: 'peer-2', x: 41, y: 70},
    {id: 'peer-3', x: 47, y: 55},
    {id: 'peer-4', x: 43, y: 45},
    {id: 'peer-5', x: 29, y: 36},
    {id: 'peer-6', x: 22, y: 30},
    {id: 'peer-7', x: 35, y: 33},
    {id: 'peer-8', x: 50, y: 32},
    {id: 'peer-9', x: 54, y: 24},
    {id: 'peer-10', x: 57, y: 37},
    {id: 'peer-11', x: 62, y: 28},
    {id: 'peer-12', x: 66, y: 43},
    {id: 'peer-13', x: 69, y: 47},
    {id: 'peer-14', x: 58, y: 60},
]

const EDGE_CASES = [
    {
        id: 'corner',
        title: '네 귀퉁이',
        description: '0 과 100 에 붙은 점도 반지름만큼 안쪽으로 당겨져 잘리지 않습니다.',
        points: [
            {id: 'applicant', x: 100, y: 100, isPrimary: true},
            {id: 'peer-1', x: 0, y: 0},
            {id: 'peer-2', x: 0, y: 100},
            {id: 'peer-3', x: 100, y: 0},
        ],
    },
    {
        id: 'out-of-range',
        title: '범위 밖 값',
        description: '범위를 벗어난 값(−20 · 140)은 끝으로 맞춥니다.',
        points: [
            {id: 'applicant', x: 140, y: 140, isPrimary: true},
            {id: 'peer-1', x: -20, y: -20},
            {id: 'peer-2', x: 50, y: 50},
        ],
    },
    {
        id: 'overlap',
        title: '점이 겹칠 때',
        description: '당사 점이 맨 위에 그려져 가려지지 않습니다.',
        points: [
            {id: 'applicant', x: 60, y: 60, isPrimary: true},
            {id: 'peer-1', x: 60, y: 60},
            {id: 'peer-2', x: 61, y: 59},
            {id: 'peer-3', x: 59, y: 61},
        ],
    },
    {
        id: 'quadrant-left-bottom',
        title: '음영 자리 · 왼쪽 아래',
        description: '칠해지는 구역은 당사 점이 선 분면입니다. 두 값이 모두 기준선 아래면 왼쪽 아래가 칠해집니다.',
        points: [
            {id: 'applicant', x: 24, y: 22, isPrimary: true},
            {id: 'peer-1', x: 62, y: 58},
            {id: 'peer-2', x: 48, y: 44},
        ],
    },
    {
        id: 'quadrant-right-bottom',
        title: '음영 자리 · 오른쪽 아래',
        description: '가로축만 기준선을 넘으면 오른쪽 아래가 칠해집니다.',
        points: [
            {id: 'applicant', x: 82, y: 26, isPrimary: true},
            {id: 'peer-1', x: 38, y: 64},
            {id: 'peer-2', x: 56, y: 48},
        ],
    },
    {
        id: 'peers-only',
        title: '당사 점이 없을 때',
        description: '이름표 없이 표본 점만 그리고, 오른쪽 위 분면을 칠합니다.',
        points: [
            {id: 'peer-1', x: 32, y: 48},
            {id: 'peer-2', x: 55, y: 62},
            {id: 'peer-3', x: 71, y: 38},
        ],
    },
    {
        id: 'long-label',
        title: '이름표가 길 때',
        description: '이름표는 한 줄로 서고, 상자 끝에 닿으면 안쪽으로 당겨 붙습니다. 문구는 primaryLabel 로 바꿉니다.',
        primaryLabel: '당사(스타트업A)',
        points: [
            {id: 'applicant', x: 50, y: 70, isPrimary: true},
            {id: 'peer-1', x: 30, y: 40},
            {id: 'peer-2', x: 68, y: 52},
        ],
    },
] as const

const USAGE_CODE = `import {PositioningScatterChart} from '@/components/custom/positioning-scatter-chart'

<PositioningScatterChart
  ariaLabel="성장성과 밸류업 자리에서 본 당사와 표본 기업들"
  points={[
    {id: 'applicant', x: 78, y: 82, isPrimary: true},
    {id: 'peer-1', x: 41, y: 70},
    {id: 'peer-2', x: 29, y: 36},
  ]}
  yAxisLabel="성장성"
  xAxisLabel="밸류업"
/>`

const THRESHOLD_CODE = `<PositioningScatterChart
  ariaLabel="기준선을 70 으로 둔 포지셔닝"
  points={points}
  yAxisLabel="성장성"
  xAxisLabel="밸류업"
  threshold={70}
/>`

const DATA_CODE = `// 점 하나는 {id, x, y} 이고, 당사 점에만 isPrimary 를 준다.
// 값 범위가 0~100 이 아니면 xDomain · yDomain 으로 알려 주며 미리 환산하지 않아도 된다.
<PositioningScatterChart
  ariaLabel={report.positioning.title}
  points={report.positioning.points}
  yAxisLabel="성장성"
  xAxisLabel="밸류업"
  threshold={50}
/>`

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

const PROPS_ROWS = toRows([
    ['points', '점 목록입니다. 당사 점은 하나만 둡니다.', '-', 'readonly PositioningScatterPoint[]'],
    ['ariaLabel', '그림 이름입니다. 화면 낭독기가 읽습니다.', '-', 'string'],
    ['yAxisLabel', '세로축 이름입니다. 상자 왼쪽 위에 글자로 놓입니다.', '-', 'string'],
    ['xAxisLabel', '가로축 이름입니다. 상자 오른쪽 아래에 글자로 놓입니다.', '-', 'string'],
    ['primaryLabel', '당사 점 아래 이름표입니다.', "'당사'", 'string'],
    [
        'xDomain · yDomain',
        '값의 범위입니다. 점수가 아닌 값(금액 · 증감률)을 그대로 넘길 때 바꿉니다.',
        '[0, 100]',
        '[number, number]',
    ],
    ['threshold', '기준선 자리입니다. 두 축에 같은 값이 적용됩니다.', '각 범위의 가운데', 'number'],
    ['heightClassName', '칸 높이 클래스입니다.', "'h-70'", 'string'],
    ['isLoading', '스켈레톤을 대신 보입니다. 하이드레이션 전에는 자동으로 보입니다.', 'false', 'boolean'],
    [
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 문구입니다.',
        "'포지셔닝 그래프를 불러오는 중입니다.'",
        'string',
    ],
])

const FIELD_COLUMNS = [
    {key: 'field', header: 'PositioningScatterPoint', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const FIELD_ROWS = (
    [
        ['id', 'string', '점을 구분하는 고유 값입니다.'],
        ['x', 'number', '가로축 값입니다. 범위를 벗어나면 끝으로 맞춥니다.'],
        ['y', 'number', '세로축 값입니다. 범위를 벗어나면 끝으로 맞춥니다.'],
        ['isPrimary', 'boolean | undefined', '당사 점입니다. 진한 색에 크기가 크고 이름표가 붙습니다.'],
    ] as const
).map(([name, type, note]) => ({
    key: name,
    cells: [<code key="field">{name}</code>, <code key="type">{type}</code>, note],
}))

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

// 리포트 폭 그대로 보여 준다. 문서 폭(w-report 794)에서 좌우 여백(px-10)을 뺀 자리다.
const chartBoxClassName = 'w-report px-10'

const PositioningScatterChartGuidePage = () => (
    <GuidePageShell
        title="포지셔닝 산점도 (PositioningScatterChart)"
        description="가로 · 세로 두 축 위에 당사와 견줄 기업들을 점으로 흩어 놓고, 당사 점이 선 분면을 옅게 칠합니다."
    >
        <BaseCard>
            <section aria-labelledby="psc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="psc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        점은 <code>{'{id, x, y}'}</code> 이고 당사 점에만 <code>isPrimary</code> 를 줍니다. 눈금 · 축선
                        · 말풍선은 없고 점의 자리만 보여 줍니다. 상자는 좌 · 우 · 아래 테두리만 있습니다.
                    </p>
                </div>
                <div className={chartBoxClassName}>
                    <PositioningScatterChart
                        ariaLabel="성장성과 밸류업 자리에서 본 당사와 표본 기업들"
                        points={SAMPLE_POINTS}
                        yAxisLabel="성장성"
                        xAxisLabel="밸류업"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="psc-variants" className="typo-h4-bold">
                        기준선과 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        기준선 점선이 두 축을 나누고, 당사 점이 선 분면이 옅은 보라로 칠해집니다. 당사 값이 없으면
                        오른쪽 위 분면을 칠합니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">기준선</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>threshold</code> 를 옮기면 칠해지는 구역도 함께 움직입니다. 아래는 70 입니다.
                        </p>
                        <div className={chartBoxClassName}>
                            <PositioningScatterChart
                                ariaLabel="기준선을 70 으로 둔 포지셔닝"
                                points={SAMPLE_POINTS}
                                yAxisLabel="성장성"
                                xAxisLabel="밸류업"
                                threshold={70}
                            />
                        </div>
                        <CodeBlock code={THRESHOLD_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 이면 같은 자리에 스켈레톤이 대신 놓입니다.
                        </p>
                        <div className={chartBoxClassName}>
                            <PositioningScatterChart
                                ariaLabel="성장·밸류업포지셔닝"
                                points={SAMPLE_POINTS}
                                yAxisLabel="성장성"
                                xAxisLabel="밸류업"
                                isLoading
                            />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-cases" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="psc-cases" className="typo-h4-bold">
                        특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값이 한쪽으로 쏠리거나 범위를 벗어나도 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="flex list-none flex-col gap-6">
                    {EDGE_CASES.map((item) => (
                        <li key={item.id} className="flex flex-col gap-2">
                            <h3 className="typo-title-m-bold text-foreground">{item.title}</h3>
                            <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                            <div className={chartBoxClassName}>
                                <PositioningScatterChart
                                    ariaLabel={item.title}
                                    points={item.points}
                                    yAxisLabel="성장성"
                                    xAxisLabel="밸류업"
                                    {...('primaryLabel' in item ? {primaryLabel: item.primaryLabel} : {})}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="psc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        API 의 값을 그대로 넘기고 범위만 <code>xDomain</code> · <code>yDomain</code> 으로 알려 줍니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="psc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이 컴포넌트는 점의 자리만 그리므로 정확한 값은 사용처가 글자나 표로 함께 제공해야 합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        차트는 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 붙입니다. 당사의
                        위치를 말로 전하도록 작성합니다[5.1.1].
                    </li>
                    <li>숨김 표는 내장되어 있지 않습니다. 점의 값을 표나 글로 따로 제공합니다[5.1.1][7.3.2].</li>
                    <li>당사 점은 색뿐 아니라 크기와 이름표로도 구분됩니다[5.3.1].</li>
                    <li>
                        축 이름은 SVG 밖 글자(<code>figure</code> · <code>figcaption</code>)로 놓입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="psc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ariaLabel</code> · <code>points</code> · <code>yAxisLabel</code> · <code>xAxisLabel</code>{' '}
                        이 필수입니다. 나머지 <code>figure</code> 속성은 루트 요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">PositioningScatterChart</h3>
                        <Table
                            caption="PositioningScatterChart Props 목록"
                            columns={PROPS_COLUMNS}
                            rows={PROPS_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">PositioningScatterPoint</h3>
                        <Table
                            caption="PositioningScatterPoint 필드 목록"
                            columns={FIELD_COLUMNS}
                            rows={FIELD_ROWS}
                            size="md"
                        />
                    </div>
                </div>
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PositioningScatterChartGuidePage
