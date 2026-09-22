// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {GradeHistoryChartSkeleton} from '@/components/composite/grade-history-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeHistoryChart, type GradeHistoryItem} from '@/components/custom/grade-history-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'

export const metadata: Metadata = {title: '등급 이력 (GradeHistoryChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

type Row = readonly [label: string, grade: string]

// CRI 등급표의 채움 비율로 높이를 정한다 — 보고서와 같은 방식.
const toItems = (rows: readonly Row[]): GradeHistoryItem[] =>
    rows.map(([label, grade], index) => {
        const item = findCriGrade(grade)
        return {id: `${index}-${label}`, label, grade, value: item ? criGradePercentage(item) : 0}
    })

// K-BIGx 보고서 "이전평가이력" 카드와 같은 값이다.
const REPORT_DATA = toItems([
    ['23.09월', 'A-'],
    ['24.11월', 'BBB+'],
    ['25.10월', 'AA0'],
])

const USAGE_CODE = `import {GradeHistoryChart} from '@/components/custom/grade-history-chart'

<GradeHistoryChart
  ariaLabel="기업신용등급 이전평가이력"
  data={[
    {id: '2023-09-03', label: '23.09월', grade: 'A-', value: 66.7},
    {id: '2024-11-04', label: '24.11월', grade: 'BBB+', value: 62.5},
    {id: '2025-10-15', label: '25.10월', grade: 'AA0', value: 83.3},
  ]}
/>`

const DATA_CODE = `// [프론트엔드 연동] 평가 이력을 시간순(오래된 것부터)으로 바꾼다. 높이(value)는 CRI 등급표의 채움 비율이다.
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'

const data = history.map((item) => {
  const grade = findCriGrade(item.grade)
  return {
    id: item.evaluatedAt,
    label: item.monthLabel, // 예: 23.09월
    grade: item.grade,
    value: grade ? criGradePercentage(grade) : 0,
  }
})`

const SHAPE_RULES = [
    '높이 160 그릴 자리(바닥선 실선 · 점마다 세로 점선 gray.100) 아래 8 에 시점 이름(12 Regular)이 옵니다. 전체 높이 186 입니다.',
    '등급은 지름 60 원(blue.500) 안에 14 Bold 흰 글자로 적고, 원끼리 선 1.5 로 잇습니다. 선 아래는 위에서 아래로 옅어지는 면입니다.',
    '원 높이는 value(0~100)로 정합니다. 가장 높은 원 중심은 위에서 52, 가장 낮은 원 중심은 바닥에서 50 에 섭니다.',
    '양 끝 원은 원 사이 간격의 0.59 배만큼 안쪽에 섭니다(카드 538 · 시점 셋이면 100). 원 사이가 72 보다 좁아지면 그래프만 가로로 넘깁니다.',
    '그림은 role="img" 이름으로 읽고, 숨김 표가 시점 · 등급을 읽어 줍니다.',
] as const

const PROPS_ITEMS = [
    [
        'GradeHistoryChart',
        'data',
        '시점별 id · 이름 · 등급 · 높이(0~100)입니다. 시간순으로 넘깁니다.',
        '-',
        'GradeHistoryItem[]',
    ],
    ['GradeHistoryChart', 'color', '원 · 선 색(토큰 변수)입니다.', "'var(--raw-blue-500)'", 'string'],
    ['GradeHistoryChart', 'animate', '그려지는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['GradeHistoryChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로 쓰입니다.', '-', 'string'],
    ['GradeHistoryChartSkeleton', 'label', '불러오는 중 안내 문구(화면 낭독기용)입니다.', "'그래프를 …'", 'string'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; data: GradeHistoryItem[]}[] = [
    {
        title: '등급이 모두 같을 때',
        description: '값 폭이 0 이라도 최소 폭 10 으로 눈금을 잡아 원이 가운데 높이에 나란히 섭니다.',
        data: toItems([
            ['23.09월', 'A0'],
            ['24.11월', 'A0'],
            ['25.10월', 'A0'],
        ]),
    },
    {
        title: '한 단계 차이',
        description: '값 차이가 작아도(10 미만) 최소 폭 10 으로 잡아 한 단계 차이가 칸 전체 높이로 튀지 않습니다.',
        data: toItems([
            ['23.09월', 'A+'],
            ['24.11월', 'A0'],
            ['25.10월', 'A+'],
        ]),
    },
    {
        title: '가장 높은 · 낮은 등급',
        description: '최우량(AAA+)과 최하위(D)가 함께 있어도 원이 그릴 자리 위 · 아래로 잘리지 않습니다.',
        data: toItems([
            ['23.09월', 'AAA+'],
            ['24.11월', 'D'],
            ['25.10월', 'BB0'],
        ]),
    },
    {
        title: '등급표에 없는 등급 (잘못된 자료)',
        description: '높이를 0(맨 아래)으로 두고 원 안에는 받은 등급을 그대로 적어 잘못된 자료가 드러나게 합니다.',
        data: toItems([
            ['23.09월', 'A-'],
            ['24.11월', 'XX'],
            ['25.10월', 'AA0'],
        ]),
    },
    {
        title: '긴 등급 이름',
        description: '4자(BBB+ · CCC-)까지는 원 안에 들어갑니다. NR · R 처럼 짧은 이름은 가운데에 섭니다.',
        data: toItems([
            ['23.09월', 'CCC-'],
            ['24.11월', 'NR'],
            ['25.10월', 'BBB+'],
        ]),
    },
    {
        title: '시점 하나',
        description: '시점이 하나면 가운데에 원 하나만 섭니다. 선 · 면은 그리지 않습니다.',
        data: toItems([['25.10월', 'AA0']]),
    },
    {
        title: '시점이 많을 때 (10개)',
        description: '원 사이가 72 보다 좁아지면 원끼리 겹치지 않게 그래프만 가로로 넘깁니다.',
        data: toItems(
            Array.from({length: 10}, (_, index): Row => [
                `${String(16 + index)}.12월`,
                ['A-', 'BBB+', 'A0', 'A+', 'BBB0', 'A-', 'AA-', 'A0', 'BBB+', 'AA0'][index] ?? 'A0',
            ]),
        ),
    },
    {
        title: '이력 없음',
        description: '빈 목록이면 원 없이 바닥선만 그립니다. 숨김 표도 비어 있습니다.',
        data: [],
    },
]

const GradeHistoryChartGuidePage = () => (
    <GuidePageShell
        title="등급 이력 (GradeHistoryChart)"
        description="평가 시점마다 등급을 큰 원으로 찍고 선으로 이어, 등급이 오르내린 흐름을 보입니다."
    >
        <BaseCard>
            <section aria-labelledby="ghc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="ghc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 신용/재무정보 탭의 이전평가이력 카드 그래프입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <h3 className="typo-body-xl-bold">이전평가이력</h3>
                    <GradeHistoryChart ariaLabel="기업신용등급 이전평가이력" data={REPORT_DATA} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="ghc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="ghc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="ghc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        원이 잘리거나 겹치고, 높이가 들쭉날쭉 튈 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <GradeHistoryChart ariaLabel={item.title} data={item.data} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="ghc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">GradeHistoryChartSkeleton</code>을 같은
                        자리에 둡니다. 바닥선 · 세로 점선 · 원 자리 · 시점 이름 자리와 높이(186)가 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <GradeHistoryChartSkeleton label="이전평가이력을 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <GradeHistoryChart ariaLabel="기업신용등급 이전평가이력" data={REPORT_DATA} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="ghc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가 이력을 시간순으로 바꾸고, 높이는 CRI 등급표의 채움 비율로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="GradeHistoryChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-props" className="flex flex-col gap-4">
                <h2 id="ghc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GradeHistoryChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeHistoryChartGuidePage
