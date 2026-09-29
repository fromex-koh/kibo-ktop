// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeDistributionChart, type GradeDistributionPoint} from '@/components/custom/grade-distribution-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '등급 분포 곡선 (GradeDistributionChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

// 특허평가 결과 보고서(인쇄용)의 기술다양성 쪽과 같은 값이다.
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

const USAGE_CODE = `import {GradeDistributionChart} from '@/components/custom/grade-distribution-chart'

<GradeDistributionChart
  ariaLabel="기술다양성 등급 분포 — 평가대상 등급 AA"
  data={distribution}
  activeGrade="AA"
/>`

const DATA_CODE = `// [프론트엔드 연동] 등급 순서(높은 등급 → 낮은 등급) 그대로 넣습니다.
// percent 가 곡선의 높이, cumulative 는 표의 마지막 줄 값입니다. 합을 맞추는 계산은 화면이 하지 않습니다.
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

const SHAPE_RULES = [
    '왼쪽 이름 칸(최대 160)과 등급 수만큼의 같은 폭 칸으로 이루어진 격자입니다. 곡선과 표가 같은 칸을 써서 등급 위치가 어긋나지 않습니다.',
    '곡선은 높이 144 자리에 그립니다. 축 · 눈금은 두지 않습니다 — 값은 아래 표가 보여 줍니다. 선 1(primary) 아래를 위에서 아래로 옅어지는 면으로 채웁니다.',
    '표는 등급 · 백분율(%) · 누적비율(%) 세 줄이며 줄 높이는 45 입니다. 첫 줄 위는 굵은 선(gray.500), 나머지 칸은 아래 선(gray.100)입니다.',
    '평가대상 등급(activeGrade)의 칸은 곡선 줄부터 마지막 줄까지 옅은 면(blue.50)으로 이어 강조합니다.',
    '강조 칸의 글자는 색과 함께 굵기를 바꿉니다 — 색만으로 알리지 않습니다[5.3.1].',
    '그림은 role="img" 이름으로 읽고, 값은 표가 글자로 읽힙니다.',
] as const

const PROPS_ITEMS = [
    [
        'GradeDistributionChart',
        'data',
        '등급 · 비율 · 누적비율 목록입니다. 넣은 순서대로 칸이 생깁니다.',
        '-',
        'GradeDistributionPoint[]',
    ],
    [
        'GradeDistributionChart',
        'activeGrade',
        '평가대상 등급입니다. 그 칸을 곡선부터 표까지 강조합니다.',
        '-',
        'string',
    ],
    ['GradeDistributionChart', 'gradeRowLabel', '표 첫 줄의 이름입니다.', "'등급'", 'string'],
    ['GradeDistributionChart', 'percentRowLabel', '표 둘째 줄의 이름입니다.', "'백분율(%)'", 'string'],
    ['GradeDistributionChart', 'cumulativeRowLabel', '표 셋째 줄의 이름입니다.', "'누적비율(%)'", 'string'],
    ['GradeDistributionChart', 'ariaLabel', '차트 이름입니다.', '-', 'string'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; data: GradeDistributionPoint[]; grade?: string}[] = [
    {
        title: '가장 높은 등급',
        description: '강조 칸이 왼쪽 끝에 섭니다. 표 이름 칸과 붙지 않습니다.',
        data: REPORT_CASE,
        grade: 'AAA',
    },
    {
        title: '가장 낮은 등급',
        description: '강조 칸이 오른쪽 끝에 섭니다.',
        data: REPORT_CASE,
        grade: 'C',
    },
    {
        title: '등급이 없을 때',
        description: 'activeGrade 가 없거나 목록에 없는 값이면 아무 칸도 강조하지 않습니다.',
        data: REPORT_CASE,
    },
    {
        title: '한쪽으로 치우친 분포',
        description: '곡선은 넣은 값을 그대로 잇습니다 — 종 모양을 억지로 만들지 않습니다.',
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
        description: '칸 수는 data 의 길이를 따릅니다 — 등급 체계가 바뀌어도 표와 곡선이 함께 맞습니다.',
        data: [
            {grade: 'A', percent: 20, cumulative: 20},
            {grade: 'B', percent: 35, cumulative: 55},
            {grade: 'C', percent: 30, cumulative: 85},
            {grade: 'D', percent: 15, cumulative: 100},
        ],
        grade: 'B',
    },
] as const

const GradeDistributionChartGuidePage = () => (
    <GuidePageShell
        title="등급 분포 곡선 (GradeDistributionChart)"
        description="등급별 비율을 곡선으로 그리고 같은 칸에 맞춘 표(등급 · 백분율 · 누적비율)를 붙입니다. 평가대상 등급의 칸은 곡선부터 표까지 이어 강조합니다."
    >
        <BaseCard>
            <section aria-labelledby="gdc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="gdc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        특허평가 결과 보고서(인쇄용)의 항목별 쪽에서 쓰는 그래프입니다.
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
            <section aria-labelledby="gdc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="gdc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="gdc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="gdc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        강조 칸의 자리와 값의 모양이 달라지는 경우입니다.
                    </p>
                </div>
                <ul className="flex list-none flex-col gap-8">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <GradeDistributionChart ariaLabel={item.title} data={item.data} activeGrade={item.grade} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="gdc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        곡선은 브라우저가 크기를 잰 뒤에 그려집니다. 그 사이에는{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;grade-distribution&quot;</code>이 같은
                        자리(높이 144)를 종 모양 면으로 채웁니다. 아래 표는 글자라 그대로 보입니다 — 쓰는 쪽에서 따로 할
                        일은 없습니다.
                    </p>
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                    <h3 className="typo-body-xl-bold">불러오는 중</h3>
                    <ChartSkeleton type="grade-distribution" label="등급 분포를 불러오는 중입니다." />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="gdc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        등급 · 비율 · 누적비율을 받은 그대로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="GradeDistributionChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gdc-props" className="flex flex-col gap-4">
                <h2 id="gdc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GradeDistributionChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeDistributionChartGuidePage
