// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {GradeHistoryChartSkeleton} from '@/components/composite/grade-history-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeHistoryChart, type GradeHistoryItem} from '@/components/custom/grade-history-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {Table} from '@/components/custom/table'
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'

export const metadata: Metadata = {title: '등급 이력 (GradeHistoryChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

type Row = readonly [label: string, grade: string]

// 높이(value)는 CRI 등급표의 채움 비율로 정한다.
const toItems = (rows: readonly Row[]): GradeHistoryItem[] =>
    rows.map(([label, grade], index) => {
        const item = findCriGrade(grade)
        return {id: `${index}-${label}`, label, grade, value: item ? criGradePercentage(item) : 0}
    })

const REPORT_DATA = toItems([
    ['23.09월', 'A-'],
    ['24.11월', 'BBB+'],
    ['25.10월', 'AA0'],
])

const SPECIAL_CASES: readonly {title: string; description: string; data: GradeHistoryItem[]}[] = [
    {
        title: '등급이 모두 같을 때',
        description: '원이 가운데 높이에 나란히 섭니다.',
        data: toItems([
            ['23.09월', 'A0'],
            ['24.11월', 'A0'],
            ['25.10월', 'A0'],
        ]),
    },
    {
        title: '한 단계 차이',
        description: '값 차이가 작아도 원 높이가 들쭉날쭉 튀지 않습니다.',
        data: toItems([
            ['23.09월', 'A+'],
            ['24.11월', 'A0'],
            ['25.10월', 'A+'],
        ]),
    },
    {
        title: '가장 높은 · 낮은 등급',
        description: '가장 높은(AAA+) 등급과 낮은(D) 등급이 함께 있어도 원이 잘리지 않습니다.',
        data: toItems([
            ['23.09월', 'AAA+'],
            ['24.11월', 'D'],
            ['25.10월', 'BB0'],
        ]),
    },
    {
        title: '등급표에 없는 등급 (잘못된 자료)',
        description: '높이는 0(맨 아래)이고 원 안에는 받은 등급을 그대로 적습니다.',
        data: toItems([
            ['23.09월', 'A-'],
            ['24.11월', 'XX'],
            ['25.10월', 'AA0'],
        ]),
    },
    {
        title: '긴 등급 이름',
        description: '4자(BBB+ · CCC-)까지는 원 안에 들어갑니다.',
        data: toItems([
            ['23.09월', 'CCC-'],
            ['24.11월', 'NR'],
            ['25.10월', 'BBB+'],
        ]),
    },
    {
        title: '시점 하나',
        description: '가운데에 원 하나만 놓이고 선과 면은 그리지 않습니다.',
        data: toItems([['25.10월', 'AA0']]),
    },
    {
        title: '시점이 많을 때 (10개)',
        description: '원 사이가 72px 보다 좁아지면 그래프만 가로로 스크롤됩니다.',
        data: toItems(
            Array.from({length: 10}, (_, index): Row => [
                `${String(16 + index)}.12월`,
                ['A-', 'BBB+', 'A0', 'A+', 'BBB0', 'A-', 'AA-', 'A0', 'BBB+', 'AA0'][index] ?? 'A0',
            ]),
        ),
    },
    {
        title: '이력 없음',
        description: '빈 목록이면 원 없이 바닥선만 그립니다.',
        data: [],
    },
]

const USAGE_CODE = `import {GradeHistoryChart} from '@/components/custom/grade-history-chart'

<GradeHistoryChart
  ariaLabel="기업신용등급 이전평가이력"
  data={[
    {id: '2023-09-03', label: '23.09월', grade: 'A-', value: 66.7},
    {id: '2024-11-04', label: '24.11월', grade: 'BBB+', value: 62.5},
    {id: '2025-10-15', label: '25.10월', grade: 'AA0', value: 83.3},
  ]}
/>`

const DATA_CODE = `// 평가 이력을 시간순(오래된 것부터)으로 바꾼다. value 는 CRI 등급표의 채움 비율이다.
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

const LOADING_CODE = `import {GradeHistoryChartSkeleton} from '@/components/composite/grade-history-chart-skeleton'

{isLoading ? <GradeHistoryChartSkeleton label="이전평가이력을 불러오는 중입니다." /> : <GradeHistoryChart … />}`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'history',
        cells: [
            '평가 시점별 등급 이력',
            <code key="component">GradeHistoryChart</code>,
            '시점마다 등급 글자가 든 원을 찍고 선으로 잇습니다. 등급이 높을수록 원이 위에 섭니다.',
        ],
    },
    {
        key: 'trend',
        cells: [
            '분기별 등급 눈금 위의 추이와 평가대상',
            <Link key="component" href="/component-guide/grade-trend-chart" className={LINK_CLASS}>
                GradeTrendChart
            </Link>,
            '세로축에 등급 눈금이 있고 선과 다른 값의 평가대상 점을 함께 둡니다.',
        ],
    },
    {
        key: 'line',
        cells: [
            '기간별 숫자 값',
            <Link key="component" href="/component-guide/line-chart" className={LINK_CLASS}>
                LineChart
            </Link>,
            '숫자 값의 흐름은 선 그래프를 씁니다.',
        ],
    },
] as const

const PROPS_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const PROPS_ITEMS = [
    ['data', '시점별 id · 이름 · 등급 · 높이입니다. 시간순으로 넘깁니다.', '-', 'GradeHistoryItem[]'],
    ['ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['color', '원과 선 색입니다. 토큰 변수를 씁니다.', "'var(--raw-blue-500)'", 'string'],
    ['animate', '그려지는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
] as const

const PROPS_ROWS = PROPS_ITEMS.map(([name, note, defaultValue, type]) => ({
    key: name,
    cells: [
        <code key="prop">{name}</code>,
        <code key="type">{type}</code>,
        <code key="default">{defaultValue}</code>,
        note,
    ],
}))

const ITEM_COLUMNS = [
    {key: 'field', header: 'GradeHistoryItem', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const ITEM_ROWS = (
    [
        ['id', 'string', '고유 값입니다.'],
        ['label', 'string', '시점 이름입니다. 예: 23.09월'],
        ['grade', 'string', '원 안에 적을 등급입니다. 예: BBB+'],
        ['value', 'number', '원 높이(0~100)입니다. 클수록 위에 놓이며 범위를 벗어나면 0 · 100 으로 맞춥니다.'],
    ] as const
).map(([name, type, note]) => ({
    key: name,
    cells: [<code key="field">{name}</code>, <code key="type">{type}</code>, note],
}))

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const GradeHistoryChartGuidePage = () => (
    <GuidePageShell
        title="등급 이력 (GradeHistoryChart)"
        description="평가 시점마다 등급을 큰 원으로 찍고 선으로 이어, 등급이 오르내린 흐름을 보입니다."
    >
        <BaseCard>
            <section aria-labelledby="ghc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ghc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        데이터는 시간순으로 넘깁니다. 시점이 많아 원 사이가 72px 보다 좁아지면 그래프만 가로로
                        스크롤됩니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <GradeHistoryChart ariaLabel="기업신용등급 이전평가이력" data={REPORT_DATA} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ghc-states" className="typo-h4-bold">
                        상태와 특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        로딩과 값의 조합에 따른 표시입니다. 모두 컴포넌트가 처리하므로 받은 값을 그대로 넘기면 됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 차트에는 <code>isLoading</code> 이 없습니다. 기다리는 동안{' '}
                            <code>GradeHistoryChartSkeleton</code> 을 같은 자리에 둡니다. 높이가 같아 자리가 흔들리지
                            않습니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <GradeHistoryChartSkeleton label="이전평가이력을 불러오는 중입니다." />
                            <GradeHistoryChart ariaLabel="기업신용등급 이전평가이력" data={REPORT_DATA} />
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
                                    <GradeHistoryChart ariaLabel={item.title} data={item.data} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ghc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        평가 이력을 시간순으로 바꾸고, 원 높이는 CRI 등급표의 채움 비율로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ghc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급을 어떤 틀로 보여 줄지에 따라 고릅니다.
                    </p>
                </div>
                <Table
                    caption="GradeHistoryChart · GradeTrendChart · LineChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ghc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용처는 의미 있는 <code>ariaLabel</code> 만 넘기면 됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 붙입니다[5.1.1].
                    </li>
                    <li>
                        시점과 등급을 담은 숨김 표(<code>caption</code> · <code>th scope</code>)가 함께 렌더링되어 화면
                        낭독기가 값을 읽습니다[7.3.2].
                    </li>
                    <li>등급은 원 높이뿐 아니라 원 안의 글자로도 전달되어 색에만 의존하지 않습니다[5.3.1].</li>
                    <li>
                        <code>animate</code> 로 움직임을 끌 수 있습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ghc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ghc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>ariaLabel</code> 이 필수입니다. 나머지 <code>div</code> 속성은 루트
                        요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeHistoryChart</h3>
                        <Table
                            caption="GradeHistoryChart Props 목록"
                            columns={PROPS_COLUMNS}
                            rows={PROPS_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeHistoryItem</h3>
                        <Table caption="GradeHistoryItem 필드 목록" columns={ITEM_COLUMNS} rows={ITEM_ROWS} size="md" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeHistoryChartSkeleton</h3>
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

export default GradeHistoryChartGuidePage
