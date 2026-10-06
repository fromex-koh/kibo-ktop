// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeTrendChart} from '@/components/custom/grade-trend-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '등급 추이 차트 (GradeTrendChart)'}

const GRADE_SCALE = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C'] as const

const DEMO_DATA = [
    {label: '’25년\n3분기', grade: 'BB'},
    {label: '’25년\n4분기', grade: 'BB'},
    {label: '’26년\n1분기', grade: 'BBB'},
    {label: '’26년\n2분기', grade: 'BBB'},
]

const EDGE_CASES = [
    {
        title: '모두 C',
        description: '평가대상 이름표가 점 위로 올라가고 겹친 평균 점은 감춥니다.',
        lineGrade: 'C',
        targetGrade: 'C',
        color: 'var(--ds-chart-1)',
    },
    {
        title: '모두 AAA',
        description: '평균 등급 글자가 점 아래로 내려가고 평가대상 이름표는 아래에 놓입니다.',
        lineGrade: 'AAA',
        targetGrade: 'AAA',
        color: 'var(--ds-mint-700)',
    },
    {
        title: '평균 AAA · 평가대상 C',
        description: '평균 등급은 점 아래, 평가대상 이름표는 점 위에 놓입니다.',
        lineGrade: 'AAA',
        targetGrade: 'C',
        color: 'var(--ds-purple-500)',
    },
] as const

const QUARTERS = ['’25년\n3분기', '’25년\n4분기', '’26년\n1분기', '’26년\n2분기'] as const
const toTrend = (grades: readonly string[]) => grades.map((grade, index) => ({label: QUARTERS[index] ?? '', grade}))

const SPECIAL_CASES = [
    {
        title: '평가대상이 평균 바로 위',
        description:
            '평가대상(BBB)이 평균(BB)보다 한두 칸 위면 평가대상 이름표는 점 위로, 평균 등급 글자는 점 아래로 비켜 섭니다.',
        data: toTrend(['BB', 'BB', 'BB', 'BB']),
        target: 'BBB',
    },
    {
        title: '평가대상이 평균 바로 아래',
        description: '기본 배치입니다. 평가대상 이름표는 점 아래, 평균 등급 글자는 점 위에 놓입니다.',
        data: toTrend(['BB', 'BB', 'BBB', 'BBB']),
        target: 'BB',
    },
    {
        title: '평균 C · 평가대상 CC',
        description: '평가대상 이름표는 위로 두고, 두 점 사이에 끼는 평균 등급 글자(C)는 감춥니다.',
        data: toTrend(['C', 'C', 'C', 'C']),
        target: 'CC',
    },
    {
        title: '빈 값이 섞인 경우',
        description: '눈금에 없는 등급(빈 값 · 오타)이 온 분기는 점을 그리지 않습니다.',
        data: toTrend(['BBB', '', 'A', 'A']),
        target: 'A',
    },
    {
        title: '분기가 6개인 경우',
        description: '격자 칸 수는 받은 분기 수를 따릅니다. 칸이 좁아지므로 4~6개를 권장합니다.',
        data: [
            {label: '’25년\n1분기', grade: 'BB'},
            {label: '’25년\n2분기', grade: 'BB'},
            {label: '’25년\n3분기', grade: 'BBB'},
            {label: '’25년\n4분기', grade: 'BBB'},
            {label: '’26년\n1분기', grade: 'A'},
            {label: '’26년\n2분기', grade: 'BBB'},
        ],
        target: 'BB',
    },
    {
        title: '받은 값이 없는 경우',
        description: '빈 격자 대신 “표시할 등급 정보가 없습니다.” 문구를 둡니다.',
        data: [],
        target: undefined,
    },
] as const

const USAGE_CODE = `import {GradeTrendChart} from '@/components/custom/grade-trend-chart'

const GRADE_SCALE = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C']

<GradeTrendChart
  ariaLabel="기술다양성 — 동일 특허분야 평균 추이와 평가대상 등급"
  seriesLabel="동일 특허분야 평균"
  scale={GRADE_SCALE}
  data={[
    {label: "’25년\\n3분기", grade: 'BB'},
    {label: "’25년\\n4분기", grade: 'BB'},
    {label: "’26년\\n1분기", grade: 'BBB'},
    {label: "’26년\\n2분기", grade: 'BBB'},
  ]}
  target={{grade: 'BB'}}
/>`

const LOADING_CODE = `const {data, isLoading} = usePatentGrade(patentNumber)

<GradeTrendChart
  ariaLabel="기술다양성 — 동일 특허분야 평균 추이와 평가대상 등급"
  scale={GRADE_SCALE}
  data={data?.peerTrend ?? []}
  target={data ? {grade: data.targetGrade} : undefined}
  isLoading={isLoading}
  loadingLabel="등급 추이를 불러오는 중입니다."
/>`

const DATA_CODE = `// 비교 기준의 분기별 등급을 시간순(오래된 것부터)으로 바꾼다.
// 등급은 scale 에 있는 값이어야 한다. 없는 값이 오면 그 점은 그리지 않는다.
const data = averageHistory.map((item) => ({
  label: \`’\${item.year.slice(2)}년\\n\${item.quarter}분기\`, // 두 줄 이름은 \\n 으로 나눈다
  grade: item.grade,
}))

<GradeTrendChart
  ariaLabel={\`\${indicatorName} — 동일 특허분야 평균 추이와 평가대상 등급\`}
  seriesLabel="동일 특허분야 평균"
  scale={GRADE_SCALE}
  data={data}
  target={{grade: patent.grade, label: '평가대상'}} // 선과 다른 값. 마지막 시점 자리에 선다
/>`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'trend',
        cells: [
            '분기별 등급 추이와 평가대상 하나',
            <code key="component">GradeTrendChart</code>,
            '세로축이 등급 눈금이고, 선과 다른 값의 평가대상 점을 함께 둡니다.',
        ],
    },
    {
        key: 'history',
        cells: [
            '평가 시점별 등급 이력',
            <Link key="component" href="/component-guide/grade-history-chart" className={LINK_CLASS}>
                GradeHistoryChart
            </Link>,
            '시점마다 등급 글자가 든 원을 찍어 이력을 보여 줍니다.',
        ],
    },
    {
        key: 'line',
        cells: [
            '기간별 숫자 값',
            <Link key="component" href="/component-guide/line-chart" className={LINK_CLASS}>
                LineChart
            </Link>,
            '값이 등급이 아니라 숫자면 선 그래프를 씁니다.',
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
    ['data', '비교 기준의 시점별 등급입니다. 꺾은선으로 그립니다.', '-', 'GradeTrendPoint[]'],
    ['scale', '세로축 등급 눈금입니다. 높은 등급부터 낮은 등급 순으로 줍니다.', '-', 'readonly string[]'],
    ['ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['seriesLabel', '꺾은선 이름입니다. 숨김 표의 열 이름으로 쓰입니다.', "'평균'", 'string'],
    ['color', '꺾은선과 꼭짓점 색입니다. 차트 토큰을 씁니다.', "'var(--ds-chart-1)'", 'string'],
    ['target', '기준과 견주는 주인공(평가대상)입니다. 없으면 꺾은선만 그립니다.', 'undefined', 'GradeTrendTarget'],
    ['animate', '처음 그릴 때의 움직임입니다. 한 번 그린 뒤에는 다시 그리지 않습니다.', 'true', 'boolean'],
    ['isLoading', '스켈레톤을 대신 보입니다. 하이드레이션 전에는 자동으로 보입니다.', 'false', 'boolean'],
    ['loadingLabel', '불러오는 중에 화면 낭독기가 읽을 문구입니다.', "'등급 추이를 불러오는 중입니다.'", 'string'],
])

const FIELD_COLUMNS = [
    {key: 'field', header: '필드', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const toFieldRows = (items: readonly (readonly [string, string, string])[]) =>
    items.map(([name, type, note]) => ({
        key: name,
        cells: [<code key="field">{name}</code>, <code key="type">{type}</code>, note],
    }))

const POINT_ROWS = toFieldRows([
    ['label', 'string', "가로축 이름입니다. 줄을 바꿀 자리는 \\n 으로 나눕니다. 예: '’26년\\n2분기'"],
    ['grade', 'string', 'scale 안에 있는 등급 값입니다. 없는 값이면 그 점은 그리지 않습니다.'],
])

const TARGET_ROWS = toFieldRows([
    ['grade', 'string', '주인공의 등급입니다. 선과 다른 값일 수 있습니다.'],
    ['label', "string (기본 '평가대상')", '점 아래에 등급과 함께 붙는 이름입니다.'],
    ['index', 'number (기본 마지막 시점)', '주인공이 설 시점 자리입니다. 0부터 셉니다.'],
])

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const CASE_NAME_CLASS = 'typo-body-l-bold text-foreground'
const CASE_NOTE_CLASS = 'typo-body-m-regular text-label-foreground'

const GradeTrendChartGuidePage = () => (
    <GuidePageShell
        title="등급 추이 차트 (GradeTrendChart)"
        description="값이 숫자가 아니라 등급(AAA~C)인 꺾은선입니다. 꺾은선은 비교 기준이고, 채운 점 하나가 그 기준과 견주는 평가대상입니다."
    >
        <BaseCard>
            <section aria-labelledby="gtc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>scale</code> 의 순서가 세로축 눈금입니다. <code>target</code> 은 선과 이어지지 않고 그
                        시점 자리에 채운 점과 이름표로 놓입니다. 평가대상이 평균 점과 같은 시점 · 같은 등급이면
                        평가대상이 앞에 그려지고 겹친 평균 점은 감춥니다.
                    </p>
                </div>
                <div className="max-w-100">
                    <GradeTrendChart
                        ariaLabel="기술다양성 등급 추이"
                        scale={GRADE_SCALE}
                        color="var(--ds-chart-1)"
                        data={DEMO_DATA}
                        target={{grade: 'BB'}}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-variants" className="typo-h4-bold">
                        색과 로딩
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        선 색은 <code>color</code> 로 정합니다. 평가대상 점은 선 색과 무관하게 같은 강조색을 씁니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">색</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            여러 장을 나란히 둘 때는 항목마다 다른 차트 토큰을 줍니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-3">
                            <GradeTrendChart
                                ariaLabel="기술다양성 등급 추이"
                                scale={GRADE_SCALE}
                                color="var(--ds-chart-1)"
                                data={DEMO_DATA}
                                target={{grade: 'BB'}}
                            />
                            <GradeTrendChart
                                ariaLabel="시장확장성 등급 추이"
                                scale={GRADE_SCALE}
                                color="var(--ds-mint-700)"
                                target={{grade: 'A'}}
                                data={toTrend(['BBB', 'A', 'BBB', 'A'])}
                            />
                            <GradeTrendChart
                                ariaLabel="가치창출가능성 등급 추이"
                                scale={GRADE_SCALE}
                                color="var(--ds-purple-500)"
                                target={{grade: 'BBB'}}
                                data={toTrend(['CCC', 'CCC', 'CCC', 'CCC'])}
                            />
                        </div>
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 이거나 하이드레이션 전이면 같은 높이(288px)의 스켈레톤이 보입니다.
                            불러온 뒤 자리가 흔들리지 않습니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ChartSkeleton type="grade-trend" label="등급 추이를 불러오는 중입니다." />
                            <GradeTrendChart
                                ariaLabel="기술다양성 등급 추이"
                                scale={GRADE_SCALE}
                                data={DEMO_DATA}
                                target={{grade: 'BB'}}
                            />
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-edge" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-edge" className="typo-h4-bold">
                        끝 등급과 특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이름표가 가로축 이름이나 격자 밖과 부딪치는 자리는 컴포넌트가 스스로 옮깁니다. 받은 값을 그대로
                        넘기면 됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">끝 등급</h3>
                        <ul className="grid list-none gap-6 md:grid-cols-3">
                            {EDGE_CASES.map((edgeCase) => (
                                <li key={edgeCase.title} className="flex flex-col gap-2">
                                    <h4 className={CASE_NAME_CLASS}>{edgeCase.title}</h4>
                                    <p className={CASE_NOTE_CLASS}>{edgeCase.description}</p>
                                    <GradeTrendChart
                                        ariaLabel={edgeCase.title}
                                        scale={GRADE_SCALE}
                                        color={edgeCase.color}
                                        data={DEMO_DATA.map((point) => ({...point, grade: edgeCase.lineGrade}))}
                                        target={{grade: edgeCase.targetGrade}}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">특이한 값</h3>
                        <ul className="grid list-none gap-6 md:grid-cols-3">
                            {SPECIAL_CASES.map((specialCase) => (
                                <li key={specialCase.title} className="flex flex-col gap-2">
                                    <h4 className={CASE_NAME_CLASS}>{specialCase.title}</h4>
                                    <p className={CASE_NOTE_CLASS}>{specialCase.description}</p>
                                    <GradeTrendChart
                                        ariaLabel={specialCase.title}
                                        scale={GRADE_SCALE}
                                        data={[...specialCase.data]}
                                        target={specialCase.target ? {grade: specialCase.target} : undefined}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        분기별 등급 목록은 시간순으로 바꾸고, 평가대상 등급은 <code>target</code> 으로 따로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        세로축의 값이 등급인지 숫자인지, 시점별 이력인지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="GradeTrendChart · GradeHistoryChart · LineChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-a11y" className="typo-h4-bold">
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
                        시점별 평균 등급과 평가대상 등급을 담은 숨김 표(<code>caption</code> · <code>th scope</code>
                        )가 함께 렌더링되어 화면 낭독기가 값을 읽습니다[7.3.2].
                    </li>
                    <li>등급은 점 위치뿐 아니라 점 옆 글자로도 전달됩니다[5.3.1].</li>
                    <li>
                        <code>animate</code> 로 움직임을 끌 수 있습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gtc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>scale</code> · <code>ariaLabel</code> 이 필수입니다. 나머지{' '}
                        <code>div</code> 속성은 루트 요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeTrendChart</h3>
                        <Table
                            caption="GradeTrendChart Props 목록"
                            columns={PROPS_COLUMNS}
                            rows={PROPS_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeTrendPoint</h3>
                        <Table
                            caption="GradeTrendPoint 필드 목록"
                            columns={FIELD_COLUMNS}
                            rows={POINT_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeTrendTarget</h3>
                        <Table
                            caption="GradeTrendTarget 필드 목록"
                            columns={FIELD_COLUMNS}
                            rows={TARGET_ROWS}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeTrendChartGuidePage
