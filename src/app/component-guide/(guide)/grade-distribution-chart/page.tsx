// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeDistributionChart, type GradeDistributionPoint} from '@/components/custom/grade-distribution-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '등급 분포 곡선 (GradeDistributionChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const REPORT_CASE: GradeDistributionPoint[] = [
    {grade: 'AAA', percent: 4, cumulative: 4},
    {grade: 'AA', percent: 7, cumulative: 11},
    {grade: 'A', percent: 12, cumulative: 23},
    {grade: 'BBB', percent: 17, cumulative: 40},
    {grade: 'BB', percent: 20, cumulative: 60},
    {grade: 'B', percent: 17, cumulative: 77},
    {grade: 'CCC', percent: 12, cumulative: 89},
    {grade: 'CC', percent: 7, cumulative: 96},
    {grade: 'C', percent: 4, cumulative: 100},
]

const SPECIAL_CASES: readonly {title: string; description: string; data: GradeDistributionPoint[]; grade?: string}[] = [
    {
        title: '가장 높은 등급',
        description: '강조 칸이 왼쪽 끝에 놓입니다.',
        data: REPORT_CASE,
        grade: 'AAA',
    },
    {
        title: '가장 낮은 등급',
        description: '강조 칸이 오른쪽 끝에 놓입니다.',
        data: REPORT_CASE,
        grade: 'C',
    },
    {
        title: '등급이 없을 때',
        description: 'activeGrade 가 없거나 목록에 없으면 아무 칸도 강조하지 않습니다.',
        data: REPORT_CASE,
    },
    {
        title: '한쪽으로 치우친 분포',
        description: '곡선은 넣은 값을 그대로 잇고 종 모양으로 보정하지 않습니다.',
        data: [
            {grade: 'AAA', percent: 28, cumulative: 28},
            {grade: 'AA', percent: 22, cumulative: 50},
            {grade: 'A', percent: 16, cumulative: 66},
            {grade: 'BBB', percent: 12, cumulative: 78},
            {grade: 'BB', percent: 9, cumulative: 87},
            {grade: 'B', percent: 6, cumulative: 93},
            {grade: 'CCC', percent: 4, cumulative: 97},
            {grade: 'CC', percent: 2, cumulative: 99},
            {grade: 'C', percent: 1, cumulative: 100},
        ],
        grade: 'AA',
    },
    {
        title: '등급 수가 다를 때',
        description: '칸 수는 data 의 길이를 따르므로 곡선과 표가 함께 맞춰집니다.',
        data: [
            {grade: 'A', percent: 20, cumulative: 20},
            {grade: 'B', percent: 35, cumulative: 55},
            {grade: 'C', percent: 30, cumulative: 85},
            {grade: 'D', percent: 15, cumulative: 100},
        ],
        grade: 'B',
    },
] as const

const USAGE_CODE = `import {GradeDistributionChart} from '@/components/custom/grade-distribution-chart'

<GradeDistributionChart
  ariaLabel="기술다양성 등급 분포 — 평가대상 등급 AA"
  data={distribution}
  activeGrade="AA"
/>`

const DATA_CODE = `// 등급 순서(높은 등급 → 낮은 등급) 그대로 넣는다.
// percent 는 곡선의 높이이고 cumulative 는 표의 마지막 줄 값이다. 누적 계산은 화면이 하지 않는다.
const distribution = [
  {grade: 'AAA', percent: 4, cumulative: 4},
  {grade: 'AA', percent: 7, cumulative: 11},
  // …
]

<GradeDistributionChart
  ariaLabel={\`\${metricLabel} 등급 분포 — 평가대상 등급 \${detail.grade}\`}
  data={detail.distribution}
  activeGrade={detail.grade}
/>`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'grade',
        cells: [
            '등급별 비율과 누적비율, 평가대상 등급 강조',
            <code key="component">GradeDistributionChart</code>,
            '곡선과 표를 같은 격자에 맞춰 그립니다. 곡선만 따로 쓸 수 없습니다.',
        ],
    },
    {
        key: 'curve',
        cells: [
            '평균 · 표준편차 기반 점수 분포',
            <Link key="component" href="/component-guide/distribution-curve-chart" className={LINK_CLASS}>
                DistributionCurveChart
            </Link>,
            '점수 축 위에 조회 대상 점과 순위 글자를 찍습니다.',
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

const PROPS_ROWS = toRows([
    ['data', '등급 · 비율 · 누적비율 목록입니다. 넣은 순서대로 칸이 생깁니다.', '-', 'GradeDistributionPoint[]'],
    ['ariaLabel', '곡선 그림의 이름입니다.', '-', 'string'],
    [
        'activeGrade',
        '평가대상 등급입니다. 그 칸을 곡선부터 표까지 강조합니다. 목록에 없으면 강조하지 않습니다.',
        'undefined',
        'string',
    ],
    ['gradeRowLabel', '표 첫 줄 이름입니다.', "'등급'", 'string'],
    ['percentRowLabel', '표 둘째 줄 이름입니다.', "'백분율(%)'", 'string'],
    ['cumulativeRowLabel', '표 셋째 줄 이름입니다.', "'누적비율(%)'", 'string'],
])

const FIELD_ROWS = (
    [
        ['grade', 'string', '등급 이름입니다.'],
        ['percent', 'number', '등급 비율(%)입니다. 곡선의 높이이며 표의 둘째 줄에 적힙니다.'],
        ['cumulative', 'number', '누적비율(%)입니다. 표의 셋째 줄에 적힙니다.'],
    ] as const
).map(([name, type, note]) => ({
    key: name,
    cells: [<code key="field">{name}</code>, <code key="type">{type}</code>, note],
}))

const FIELD_COLUMNS = [
    {key: 'field', header: 'GradeDistributionPoint', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const GradeDistributionChartGuidePage = () => (
    <GuidePageShell
        title="등급 분포 곡선 (GradeDistributionChart)"
        description="등급별 비율을 곡선으로 그리고 같은 칸에 맞춘 표(등급 · 백분율 · 누적비율)를 붙입니다. 평가대상 등급 칸은 곡선부터 표까지 이어 강조합니다."
    >
        <BaseCard>
            <section aria-labelledby="gdc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gdc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        곡선과 표가 같은 격자(왼쪽 이름 칸과 등급 수만큼의 같은 폭 칸)를 써서 등급 위치가 어긋나지
                        않습니다. 곡선에는 축과 눈금이 없고 값은 표가 보여 줍니다.
                    </p>
                </div>
                <GradeDistributionChart
                    ariaLabel="기술다양성 등급 분포 — 평가대상 등급 AA"
                    data={REPORT_CASE}
                    activeGrade="AA"
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gdc-states" className="typo-h4-bold">
                        상태와 특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        강조 칸의 자리와 값의 모양에 따른 표시입니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> prop 은 없습니다. 곡선은 브라우저가 크기를 잰 뒤에 그려지므로 그
                            전에는 <code>ChartSkeleton type=&quot;grade-distribution&quot;</code> 이 곡선 자리를 채우고,
                            표는 글자라 그대로 보입니다.
                        </p>
                        <ChartSkeleton type="grade-distribution" label="등급 분포를 불러오는 중입니다." />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">특이한 값</h3>
                        <ul className="flex list-none flex-col gap-8">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <GradeDistributionChart
                                        ariaLabel={item.title}
                                        data={item.data}
                                        activeGrade={item.grade}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gdc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급 · 비율 · 누적비율을 받은 그대로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gdc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급별 비율 표가 필요한지, 점수 분포인지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="GradeDistributionChart · DistributionCurveChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gdc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        곡선은 그림이고, 값은 아래 표 글자로 전달됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        곡선은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 붙입니다. 평가대상
                        등급이 드러나게 작성합니다[5.1.1].
                    </li>
                    <li>
                        표는 <code>table</code> 요소가 아니라 CSS 격자로 그린 글자 칸이라 별도 숨김 표나{' '}
                        <code>th scope</code> 는 없습니다[7.3.2].
                    </li>
                    <li>강조 칸은 색과 함께 글자 굵기를 바꿔 색에만 의존하지 않습니다[5.3.1].</li>
                    <li>곡선은 움직임 없이 그려집니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gdc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>ariaLabel</code> 이 필수입니다. 나머지 <code>div</code> 속성은 루트
                        요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeDistributionChart</h3>
                        <Table
                            caption="GradeDistributionChart Props 목록"
                            columns={PROPS_COLUMNS}
                            rows={PROPS_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeDistributionPoint</h3>
                        <Table
                            caption="GradeDistributionPoint 필드 목록"
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

export default GradeDistributionChartGuidePage
