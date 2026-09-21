import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {GradeTrendChart} from '@/components/custom/grade-trend-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '등급 추이 차트 (GradeTrendChart)'}

const GRADE_SCALE = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C'] as const

const USAGE_CODE = `const GRADE_SCALE = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C']

<GradeTrendChart
  ariaLabel="기술다양성 — 동일 특허분야 평균 추이와 평가대상 등급"
  seriesLabel="동일 특허분야 평균"
  scale={GRADE_SCALE}
  color="var(--ds-chart-1)"
  data={[
    {label: "’25년\\n3분기", grade: 'BB'},
    {label: "’25년\\n4분기", grade: 'BB'},
    {label: "’26년\\n1분기", grade: 'BBB'},
    {label: "’26년\\n2분기", grade: 'BBB'},
  ]}
  target={{grade: 'BB'}}
/>`

const PROPS_ITEMS = [
    [
        'GradeTrendChart',
        'data',
        '꺾은선으로 그릴 비교 기준(예: 동일 특허분야 평균)의 시점별 등급입니다.',
        '-',
        'GradeTrendPoint[]',
    ],
    [
        'GradeTrendChart',
        'target',
        '기준과 견주는 주인공(평가대상)입니다. 선과 별개의 채운 점으로 그 시점 자리에 섭니다.',
        '-',
        '{grade; label?; index?}',
    ],
    ['GradeTrendChart', 'seriesLabel', '꺾은선의 이름입니다. 숨김 표의 열 이름으로 쓰입니다.', "'평균'", 'string'],
    [
        'GradeTrendChart',
        'scale',
        '세로축 등급 눈금입니다. 높은 등급부터 낮은 등급 순으로 줍니다.',
        '-',
        'readonly string[]',
    ],
    [
        'GradeTrendTarget',
        'grade / label / index',
        '주인공 등급 · 점 아래 이름(기본 평가대상) · 설 자리(기본 마지막 시점)입니다.',
        "- / '평가대상' / 마지막",
        'string / string / number',
    ],
    ['GradeTrendChart', 'color', '꺾은선과 꼭짓점의 색입니다. 차트 토큰을 씁니다.', "'var(--ds-chart-1)'", 'string'],
    [
        'GradeTrendChart',
        'animate',
        '처음 그릴 때의 움직임입니다. 한 번 그린 뒤에는 창 폭이 바뀌어도 다시 그리지 않습니다. 인쇄용 문서에서는 끕니다.',
        'true',
        'boolean',
    ],
    [
        'GradeTrendChart',
        'isLoading',
        '값을 불러오는 중입니다. 같은 높이의 스켈레톤을 대신 보입니다. 새로고침 직후(하이드레이션 전)에는 넘기지 않아도 스켈레톤이 자동으로 보입니다.',
        'false',
        'boolean',
    ],
    [
        'GradeTrendChart',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'등급 추이를 불러오는 중입니다.'",
        'string',
    ],
    ['GradeTrendChart', 'ariaLabel', '차트의 이름입니다. 같은 내용이 숨김 표로도 제공됩니다.', '-', 'string'],
    ['GradeTrendPoint', 'label', '가로축 이름입니다. 줄을 바꿀 자리는 \\n 으로 나눕니다.', '-', 'string'],
    ['GradeTrendPoint', 'grade', 'scale 안에 있는 등급 값입니다.', '-', 'string'],
] as const

const DEMO_DATA = [
    {label: '’25년\n3분기', grade: 'BB'},
    {label: '’25년\n4분기', grade: 'BB'},
    {label: '’26년\n1분기', grade: 'BBB'},
    {label: '’26년\n2분기', grade: 'BBB'},
]

const EDGE_RULES = [
    '평가대상이 아래 두 등급(CC · C)이면 "등급 / 평가대상" 이름표를 점 위로 올립니다 — 점 아래에 두면 가로축 분기 이름과 겹칩니다.',
    '평균 점이 가장 높은 등급(AAA)이면 등급 글자를 점 아래로 내립니다 — 점 위에 두면 격자 밖으로 나가 잘립니다.',
    '평가대상과 평균 점이 같은 분기 · 같은 등급이면 평가대상을 앞에 그리고, 겹친 평균 점과 그 등급 글자는 감춥니다.',
    '눈금에 없는 등급(빈 값 · 오타)은 그 점만 그리지 않습니다.',
] as const

const EDGE_CASES = [
    {
        title: '모두 C',
        description: '평균 · 평가대상이 모두 C — 평가대상 이름표가 점 위로 올라가고, 겹친 평균 점은 감춥니다.',
        lineGrade: 'C',
        targetGrade: 'C',
        color: 'var(--ds-chart-1)',
    },
    {
        title: '모두 AAA',
        description:
            '평균 · 평가대상이 모두 AAA — 평균 등급 글자가 점 아래로 내려가고, 평가대상 이름표는 그대로 아래에 섭니다.',
        lineGrade: 'AAA',
        targetGrade: 'AAA',
        color: 'var(--ds-mint-700)',
    },
    {
        title: '평균 AAA · 평가대상 C',
        description: '양 끝으로 벌어진 경우 — 평균 등급은 점 아래, 평가대상 이름표는 점 위에 섭니다.',
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
            '같은 분기에서 평가대상(BBB)이 평균(BB)보다 한두 칸 위 — 평가대상 이름표는 점 위로, 평균 등급 글자는 점 아래로 비켜 섭니다.',
        data: toTrend(['BB', 'BB', 'BB', 'BB']),
        target: 'BBB',
    },
    {
        title: '평가대상이 평균 바로 아래',
        description: '시안의 기본 배치 — 평가대상 이름표는 점 아래, 평균 등급 글자는 점 위에 섭니다.',
        data: toTrend(['BB', 'BB', 'BBB', 'BBB']),
        target: 'BB',
    },
    {
        title: '평균 C · 평가대상 CC',
        description:
            '아래가 가로축에 막히고 바로 아래에 평균 점이 붙은 경우 — 평가대상 이름표는 위로 두고, 두 점 사이에 끼는 평균 등급 글자(C)는 감춥니다.',
        data: toTrend(['C', 'C', 'C', 'C']),
        target: 'CC',
    },
    {
        title: '빈 값이 섞인 경우',
        description: '눈금에 없는 등급(빈 값 · 오타)이 온 분기는 점을 그리지 않고 선도 그 자리에서 끊깁니다.',
        data: toTrend(['BBB', '', 'A', 'A']),
        target: 'A',
    },
    {
        title: '분기가 6개인 경우',
        description: '격자 칸 수는 받은 분기 수를 따릅니다. 칸이 좁아지므로 분기는 4~6개를 권장합니다.',
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
        description: '분기 자료가 비어 있으면 빈 격자 대신 "표시할 등급 정보가 없습니다." 문구를 둡니다.',
        data: [],
        target: undefined,
    },
] as const

const LOADING_CODE = `const {data, isLoading} = usePatentGrade(patentNumber)

<GradeTrendChart
  ariaLabel="기술다양성 — 동일 특허분야 평균 추이와 평가대상 등급"
  scale={GRADE_SCALE}
  data={data?.peerTrend ?? []}
  target={data ? {grade: data.targetGrade} : undefined}
  isLoading={isLoading}
/>`

const EDGE_CODE = `// 끝 등급도 받은 값을 그대로 넣는다 — 이름표 위치는 컴포넌트가 정한다.
<GradeTrendChart
  ariaLabel="기술다양성 — 동일 특허분야 평균 추이와 평가대상 등급"
  scale={GRADE_SCALE}
  data={[
    {label: '’25년\\n3분기', grade: 'C'},
    {label: '’25년\\n4분기', grade: 'C'},
    {label: '’26년\\n1분기', grade: 'C'},
    {label: '’26년\\n2분기', grade: 'C'},
  ]}
  target={{grade: 'C'}}
/>`

const GradeTrendChartGuidePage = () => (
    <GuidePageShell
        title="등급 추이 차트 (GradeTrendChart)"
        description="값이 숫자가 아니라 등급(AAA~C)인 꺾은선입니다. 꺾은선은 비교 기준(동일 특허분야 평균)이고, 채운 점 하나가 그 기준과 견주는 주인공(평가대상)입니다."
    >
        <BaseCard>
            <section aria-labelledby="gtc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="gtc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        등급 목록(scale)의 자리를 그대로 눈금으로 씁니다. 꺾은선의 꼭짓점은 속이 빈 원이고 위에 등급이
                        붙습니다. <code className="font-mono">target</code>은 선과 별개의 값이라 선에 잇지 않고, 그 시점
                        자리에 진하게 채운 점과 &quot;등급 평가대상&quot; 이름표로 섭니다. 평가대상이 평균 점과 같은
                        분기·같은 등급이면 평가대상이 앞에 그려지고 겹친 평균 점은 감춥니다. 눈금에 없는 등급은 그리지
                        않으므로 받은 값을 그대로 넣으면 됩니다. 값은 차트 아래 숨김 표로도 제공되어 화면 낭독기로 읽을
                        수 있습니다.
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
            <section aria-labelledby="gtc-color" className="flex flex-col gap-4">
                <div>
                    <h2 id="gtc-color" className="typo-h4-bold">
                        색 (Color)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        여러 장을 나란히 둘 때는 항목마다 다른 차트 토큰을 줍니다. 평가대상 점은 선 색과 무관하게 같은
                        강조색을 씁니다.
                    </p>
                </div>
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
                        data={[
                            {label: '’25년\n3분기', grade: 'BBB'},
                            {label: '’25년\n4분기', grade: 'A'},
                            {label: '’26년\n1분기', grade: 'BBB'},
                            {label: '’26년\n2분기', grade: 'A'},
                        ]}
                    />
                    <GradeTrendChart
                        ariaLabel="가치창출가능성 등급 추이"
                        scale={GRADE_SCALE}
                        color="var(--ds-purple-500)"
                        target={{grade: 'BBB'}}
                        data={[
                            {label: '’25년\n3분기', grade: 'CCC'},
                            {label: '’25년\n4분기', grade: 'CCC'},
                            {label: '’26년\n1분기', grade: 'CCC'},
                            {label: '’26년\n2분기', grade: 'CCC'},
                        ]}
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="gtc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값을 불러오는 동안 <code className="font-mono">isLoading</code>을 주면 같은 높이(288)의
                        스켈레톤을 보입니다. 세로축 등급 · 점선 격자 · 꺾은선과 평가대상 점 · 두 줄 분기 이름의 짜임이
                        실제 차트와 같아 불러온 뒤 자리가 흔들리지 않습니다. 스켈레톤은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;grade-trend&quot;</code>이며 화면
                        낭독기에는 <code className="font-mono">loadingLabel</code>을 읽어 줍니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground mt-2">
                        스켈레톤이 보이는 경우는 두 가지입니다. ① 데이터를 기다릴 때 — 프론트가{' '}
                        <code className="font-mono">isLoading</code>을 넘기는 동안. ② 새로고침 직후 — 데이터가 이미
                        있어도 차트가 브라우저에서 칸의 폭을 재기 전(하이드레이션 전)에는 그릴 수 없어 빈 칸이 되므로,
                        컴포넌트가 화면이 붙을 때까지 같은 스켈레톤을 스스로 보입니다. ②는 따로 넘길 값이 없고, 두 경우
                        모두 높이가 같아 차트로 바뀔 때 자리가 흔들리지 않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <GradeTrendChart
                            ariaLabel="기술다양성 등급 추이"
                            scale={GRADE_SCALE}
                            data={DEMO_DATA}
                            target={{grade: 'BB'}}
                            isLoading
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <GradeTrendChart
                            ariaLabel="기술다양성 등급 추이"
                            scale={GRADE_SCALE}
                            data={DEMO_DATA}
                            target={{grade: 'BB'}}
                        />
                    </div>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                <p className="typo-body-l-regular text-muted-foreground">
                    처음 그릴 때만 선이 그어지는 움직임을 보이고, 그 뒤에는 창 폭이 바뀌어도 다시 그리지 않습니다.
                    인쇄용 문서처럼 움직임이 필요 없으면 <code className="font-mono">animate={'{false}'}</code>를
                    줍니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-edge" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="gtc-edge" className="typo-h4-bold">
                        끝 등급 (Edge)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값이 눈금의 맨 아래(C)나 맨 위(AAA)에 붙으면 이름표가 가로축 이름이나 격자 밖과 부딪칩니다.
                        컴포넌트가 자리를 스스로 옮기므로 받은 값을 그대로 넣으면 됩니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                        {EDGE_RULES.map((rule) => (
                            <li key={rule} className="flex">
                                <ListMarker type="unordered" />
                                <span className="min-w-0">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-3">
                    {EDGE_CASES.map((edgeCase) => (
                        <li key={edgeCase.title} className="flex flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{edgeCase.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{edgeCase.description}</p>
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
                <CodeBlock code={EDGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-special" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="gtc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        끝 등급 밖에도 값의 조합에 따라 이름표가 부딪치거나 칸이 달라지는 경우입니다. 모두 컴포넌트가
                        처리하므로 받은 값을 그대로 넣으면 됩니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-3">
                    {SPECIAL_CASES.map((specialCase) => (
                        <li key={specialCase.title} className="flex flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{specialCase.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{specialCase.description}</p>
                            <GradeTrendChart
                                ariaLabel={specialCase.title}
                                scale={GRADE_SCALE}
                                data={[...specialCase.data]}
                                target={specialCase.target ? {grade: specialCase.target} : undefined}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gtc-props" className="flex flex-col gap-4">
                <h2 id="gtc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GradeTrendChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeTrendChartGuidePage
