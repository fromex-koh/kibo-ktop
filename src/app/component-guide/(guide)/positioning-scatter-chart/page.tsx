// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import {PositioningScatterChart, type PositioningScatterPoint} from '@/components/custom/positioning-scatter-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '포지셔닝 산점도 (PositioningScatterChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

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

const DATA_CODE = `// [프론트엔드 연동] 점 하나는 {id, x, y} 입니다 — 당사 점에만 isPrimary 를 줍니다.
// 값의 범위가 0~100 이 아니면 xDomain · yDomain 으로 알려 주면 되고, 미리 환산하지 않아도 됩니다.
<PositioningScatterChart
  ariaLabel={\`\${report.positioning.title}\`}
  points={report.positioning.points}
  yAxisLabel="성장성"
  xAxisLabel="밸류업"
  threshold={50}
/>`

const SHAPE_RULES = [
    '상자 테두리는 좌 · 우 · 아래만 있고(위는 열려 있습니다) 높이는 heightClassName 으로 정합니다(기본 h-72). 값의 범위는 xDomain · yDomain 이며 기본은 0~100 입니다.',
    '기준선(기본은 범위의 한가운데)에서 가로 · 세로 점선이 갈리고, 당사 점이 선 분면이 옅은 보라로 칠해집니다(당사 값이 없으면 오른쪽 위).',
    '당사 점은 지름 16(purple.600)이고 그 바로 아래 2 에 12 Bold 이름표(purple.900)가 붙습니다. 나머지 점은 지름 12 의 navy.200 입니다.',
    '당사 점은 맨 위에 그려 다른 점에 가리지 않습니다.',
    '축 이름은 상자 왼쪽 위(세로축)와 오른쪽 아래(가로축)에 글자로 둡니다.',
    'recharts 의 ScatterChart 로 그립니다 — 축은 자리 계산에만 쓰고, 음영 · 기준선 · 점 · 이름표는 한 겹(Customized)에서 순서대로 그려 점이 음영에 가리지 않게 합니다.',
    '눈금 · 축선 · 말풍선은 두지 않습니다. 값이 몇인지는 표가 따로 알리고 여기서는 자리만 봅니다.',
] as const

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

// 값이 어떻게 들어와도 그림이 깨지지 않는지 한자리에서 본다.
const EDGE_CASES = [
    {
        id: 'corner',
        title: '네 귀퉁이',
        description: '0 과 100 에 붙은 점도 상자 안에 그려집니다 — 반지름만큼 걸쳐 잘리지 않습니다.',
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
        description: '음수나 100 을 넘는 값이 와도 끝으로 맞춥니다(−20 · 140 을 넣은 모습).',
        points: [
            {id: 'applicant', x: 140, y: 140, isPrimary: true},
            {id: 'peer-1', x: -20, y: -20},
            {id: 'peer-2', x: 50, y: 50},
        ],
    },
    {
        id: 'overlap',
        title: '점이 겹칠 때',
        description: '같은 자리에 여러 점이 와도 당사 점이 맨 위에 그려져 가려지지 않습니다.',
        points: [
            {id: 'applicant', x: 60, y: 60, isPrimary: true},
            {id: 'peer-1', x: 60, y: 60},
            {id: 'peer-2', x: 61, y: 59},
            {id: 'peer-3', x: 59, y: 61},
        ],
    },
    {
        id: 'quadrant-left-bottom',
        title: '음영이 따라가는 자리 · 왼쪽 아래',
        description: '옅게 칠하는 구역은 당사 점이 선 분면입니다 — 두 값이 모두 기준선 아래면 왼쪽 아래가 칠해집니다.',
        points: [
            {id: 'applicant', x: 24, y: 22, isPrimary: true},
            {id: 'peer-1', x: 62, y: 58},
            {id: 'peer-2', x: 48, y: 44},
        ],
    },
    {
        id: 'quadrant-right-bottom',
        title: '음영이 따라가는 자리 · 오른쪽 아래',
        description: '같은 규칙으로, 가로축만 기준선을 넘으면 오른쪽 아래가 칠해집니다(오른쪽 위 고정이 아닙니다).',
        points: [
            {id: 'applicant', x: 82, y: 26, isPrimary: true},
            {id: 'peer-1', x: 38, y: 64},
            {id: 'peer-2', x: 56, y: 48},
        ],
    },
    {
        id: 'peers-only',
        title: '당사 점이 없을 때',
        description: '당사 값이 없으면 이름표도 함께 사라지고 표본 점만 남습니다.',
        points: [
            {id: 'peer-1', x: 32, y: 48},
            {id: 'peer-2', x: 55, y: 62},
            {id: 'peer-3', x: 71, y: 38},
        ],
    },
    {
        id: 'long-label',
        title: '이름표가 길 때',
        description:
            "이름표 문구는 primaryLabel 로 바꿉니다(기본 '당사'). 길어져도 줄바꿈 없이 한 줄로 서고, 점을 가운데에 둔 채 양옆으로 늘어나다 상자 끝에 닿으면 안쪽으로 당겨 붙습니다.",
        primaryLabel: '당사(스타트업A)',
        points: [
            {id: 'applicant', x: 50, y: 70, isPrimary: true},
            {id: 'peer-1', x: 30, y: 40},
            {id: 'peer-2', x: 68, y: 52},
        ],
    },
] as const

const PROPS_ITEMS = [
    ['PositioningScatterChart', 'ariaLabel', '화면 낭독기가 읽을 그림 이름입니다.', '-', 'string'],
    [
        'PositioningScatterChart',
        'points',
        '점 목록입니다(id · x · y · isPrimary). x · y 는 0~100 입니다.',
        '-',
        'PositioningScatterPoint[]',
    ],
    ['PositioningScatterChart', 'yAxisLabel', '세로축 이름입니다(왼쪽 위).', '-', 'string'],
    ['PositioningScatterChart', 'xAxisLabel', '가로축 이름입니다(오른쪽 아래).', '-', 'string'],
    ['PositioningScatterChart', 'primaryLabel', '당사 점 아래 이름표입니다.', "'당사'", 'string'],
    [
        'PositioningScatterChart',
        'xDomain · yDomain',
        '값의 범위입니다. 점수가 아닌 값(금액 · 증감률)을 그대로 넘길 때 바꿉니다.',
        '[0, 100]',
        '[number, number]',
    ],
    [
        'PositioningScatterChart',
        'threshold',
        '기준선 자리입니다. 주지 않으면 범위의 한가운데입니다.',
        '범위의 가운데',
        'number',
    ],
    ['PositioningScatterChart', 'heightClassName', '칸 높이 유틸리티입니다.', "'h-72'", 'string'],
    ['PositioningScatterChart', 'isLoading', '불러오는 중이면 스켈레톤을 보입니다.', 'false', 'boolean'],
    [
        'PositioningScatterChart',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'포지셔닝 그래프를 불러오는 중입니다.'",
        'string',
    ],
] as const

// 리포트에서 쓰는 폭 그대로 보여 준다 — 문서 폭(w-report 794)에서 좌우 여백(px-10)을 뺀 자리다.
// 가이드 화면이 넓어도 실제 크기로 읽히도록 상자를 그 폭에 맞춘다.
const chartBoxClassName = 'w-report px-10'

const PositioningScatterChartGuidePage = () => (
    <GuidePageShell
        title="포지셔닝 산점도 (PositioningScatterChart)"
        description="가로 · 세로 두 축 위에 당사와 견줄 기업들을 점으로 흩어 놓고, 두 축이 모두 높은 구역을 옅게 칠합니다. 투자모형 심층분석 리포트에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="psc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="psc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        투자모형 심층분석의 성장·밸류업포지셔닝입니다.
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
            <section aria-labelledby="psc-shape" className="flex flex-col gap-4">
                <h2 id="psc-shape" className="typo-h4-bold">
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-threshold" className="flex flex-col gap-4">
                <div>
                    <h2 id="psc-threshold" className="typo-h4-bold">
                        기준선 (Threshold)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기준선을 옮기면 칠해지는 구역도 함께 움직입니다. 아래는 70 으로 둔 모습입니다.
                    </p>
                </div>
                <div className={chartBoxClassName}>
                    <PositioningScatterChart
                        ariaLabel="기준선을 70 으로 둔 포지셔닝"
                        points={SAMPLE_POINTS}
                        yAxisLabel="성장성"
                        xAxisLabel="밸류업"
                        threshold={70}
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="psc-cases" className="typo-h4-bold">
                        값에 따른 모습 (Cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        응답 값이 한쪽으로 쏠리거나 범위를 벗어나도 그림이 깨지지 않는지 확인하는 자리입니다.
                    </p>
                </div>
                <ul className="flex flex-col gap-6">
                    {EDGE_CASES.map((item) => (
                        <li key={item.id} className="flex flex-col gap-2">
                            <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
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
            <section aria-labelledby="psc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="psc-loading" className="typo-h4-bold">
                        불러오는 중 (Loading)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        isLoading 을 주면 같은 자리에 스켈레톤이 대신 섭니다.
                    </p>
                </div>
                <div className={chartBoxClassName}>
                    <PositioningScatterChart
                        ariaLabel="성장·밸류업포지셔닝"
                        points={SAMPLE_POINTS}
                        yAxisLabel="성장성"
                        xAxisLabel="밸류업"
                        isLoading
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-data" className="flex flex-col gap-4">
                <h2 id="psc-data" className="typo-h4-bold">
                    데이터 연결 (Data)
                </h2>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="PositioningScatterChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="psc-props" className="flex flex-col gap-4">
                <h2 id="psc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="PositioningScatterChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PositioningScatterChartGuidePage
