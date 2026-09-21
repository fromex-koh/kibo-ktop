import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {GradeRadarChart, type GradeRadarItem} from '@/components/custom/grade-radar-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '등급 레이더 차트 (GradeRadarChart)'}

const TARGET_LABEL = '평가대상특허'
const PEER_LABEL = '동일 특허분야 평균'

const DEMO_DATA: GradeRadarItem[] = [
    {id: 'diversity', label: '기술다양성', targetScore: 58, peerScore: 72},
    {id: 'market', label: '시장확장성', targetScore: 66, peerScore: 78},
    {id: 'value', label: '가치창출가능성', targetScore: 74, peerScore: 70},
]

const withScores = (targetScore: number, peerScore?: number): GradeRadarItem[] =>
    DEMO_DATA.map((item) => ({...item, targetScore, peerScore}))

const USAGE_CODE = `// 받은 점수(0~100)를 그대로 넣는다 — 모양 설정은 컴포넌트가 갖고 있다.
<GradeRadarChart
  ariaLabel="특허 평가등급 — 평가대상특허와 동일 특허분야 평균 비교"
  targetLabel="평가대상특허"
  peerLabel="동일 특허분야 평균"
  data={[
    {id: 'diversity', label: '기술다양성', targetScore: 58, peerScore: 72},
    {id: 'market', label: '시장확장성', targetScore: 66, peerScore: 78},
    {id: 'value', label: '가치창출가능성', targetScore: 74, peerScore: 70},
  ]}
/>`

const LOADING_CODE = `const {data, isLoading} = usePatentGrade(patentNumber)

<GradeRadarChart
  ariaLabel="특허 평가등급 — 평가대상특허와 동일 특허분야 평균 비교"
  targetLabel="평가대상특허"
  peerLabel="동일 특허분야 평균"
  data={data?.radar ?? []}
  isLoading={isLoading}
  loadingLabel="특허 평가등급을 불러오는 중입니다."
/>`

const COMPOSITION_RULES = [
    '평가대상은 초록(mint.700) 실선과 속 빈 점(흰 면 · 초록 테두리 8px)입니다.',
    '비교 기준은 점선 테두리(success.200)와 옅은 면이며 점을 두지 않습니다 — 배경처럼 깔립니다.',
    '범례 견본도 같은 모양입니다 — 평가대상은 채운 칸, 비교 기준은 옅은 면에 점선 테두리입니다.',
    '축은 반시계 방향입니다 — 첫 항목이 위, 두 번째가 왼쪽 아래, 세 번째가 오른쪽 아래에 섭니다.',
    '격자는 고리 4겹(25 · 50 · 75 · 100)과 가운데서 뻗는 축 선이며 옅은 회색(gray.100)입니다.',
] as const

const SIZE_RULES = [
    'PC(md 이상) 차트 높이 224 · 삼각형 폭 192 × 높이 166 — 시안(차트 222 · 삼각형 192 × 166)과 같습니다.',
    '좁은 화면은 차트 높이 176 이고, 축 이름이 잘리지 않도록 반지름이 스스로 줄어듭니다(360 폭까지 가로 스크롤 없음).',
    '처음 한 번만 펼쳐지는 움직임을 보이고, 창 폭이 바뀌어도 다시 펼치지 않습니다.',
] as const

const EDGE_CASES = [
    {
        title: '모두 0',
        description: '두 계열이 가운데 한 점으로 모입니다. 축 이름과 격자는 그대로 남습니다.',
        data: withScores(0, 0),
    },
    {
        title: '모두 100',
        description: '꼭짓점이 바깥 고리에 닿습니다. 축 이름은 고리 밖에 놓입니다.',
        data: withScores(100, 100),
    },
    {
        title: '평가대상 100 · 비교 기준 0',
        description:
            '양 끝으로 벌어진 경우 — 평가대상 삼각형만 바깥 고리까지 펼쳐지고 비교 기준 면은 가운데에 모입니다.',
        data: withScores(100, 0),
    },
] as const

const SPECIAL_CASES = [
    {
        title: '평가대상 = 비교 기준',
        description: '두 계열이 겹치면 평가대상(실선 · 점)이 앞에 그려져 늘 보입니다.',
        data: DEMO_DATA.map((item) => ({...item, peerScore: item.targetScore})),
    },
    {
        title: '비교 기준이 없는 경우',
        description: 'peerScore 를 비우면 비교 기준 계열과 그 범례를 그리지 않고 평가대상만 보입니다.',
        data: DEMO_DATA.map((item) => ({id: item.id, label: item.label, targetScore: item.targetScore})),
    },
    {
        title: '범위를 벗어난 값',
        description: '0 보다 작거나 100 보다 큰 값은 0 · 100 으로 맞춰 격자 밖으로 나가지 않습니다(예: -20 · 130).',
        data: [
            {id: 'diversity', label: '기술다양성', targetScore: 130, peerScore: 72},
            {id: 'market', label: '시장확장성', targetScore: -20, peerScore: 78},
            {id: 'value', label: '가치창출가능성', targetScore: 74, peerScore: 70},
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'GradeRadarChart',
        'data',
        '축마다 한 항목입니다. 시안은 세 축(기술다양성 · 시장확장성 · 가치창출가능성)입니다.',
        '-',
        'GradeRadarItem[]',
    ],
    ['GradeRadarChart', 'targetLabel', '평가대상 계열의 이름입니다(범례 · 숨김 표).', "'평가대상'", 'string'],
    ['GradeRadarChart', 'peerLabel', '비교 기준 계열의 이름입니다.', "'비교 기준'", 'string'],
    [
        'GradeRadarChart',
        'animate',
        '처음 펼쳐질 때의 움직임입니다. 한 번 그린 뒤에는 창 폭이 바뀌어도 다시 펼치지 않습니다. 인쇄용 문서에서는 끕니다.',
        'true',
        'boolean',
    ],
    [
        'GradeRadarChart',
        'isLoading',
        '값을 불러오는 중입니다. 같은 높이의 삼각 레이더 스켈레톤을 대신 보입니다. 새로고침 직후(하이드레이션 전)에는 넘기지 않아도 스켈레톤이 자동으로 보입니다.',
        'false',
        'boolean',
    ],
    [
        'GradeRadarChart',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'등급 레이더를 불러오는 중입니다.'",
        'string',
    ],
    ['GradeRadarChart', 'ariaLabel', '차트의 이름입니다. 같은 내용이 숨김 표로도 제공됩니다.', '-', 'string'],
    ['GradeRadarItem', 'id / label', '항목 키와 축 이름입니다.', '-', 'string / string'],
    [
        'GradeRadarItem',
        'targetScore',
        '평가대상 점수(0~100)입니다. 범위를 벗어나면 0 · 100 으로 맞춥니다.',
        '-',
        'number',
    ],
    [
        'GradeRadarItem',
        'peerScore',
        '비교 기준 점수(0~100)입니다. 모든 항목에서 비우면 비교 계열을 그리지 않습니다.',
        '-',
        'number',
    ],
] as const

type CaseListProps = {
    cases: readonly {title: string; description: string; data: readonly GradeRadarItem[]}[]
}

const CaseList = ({cases}: CaseListProps) => (
    <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-3">
        {cases.map((radarCase) => (
            <li key={radarCase.title} className="flex min-w-0 flex-col gap-2">
                <h3 className="typo-body-xl-bold">{radarCase.title}</h3>
                <p className="typo-body-m-regular text-muted-foreground">{radarCase.description}</p>
                <GradeRadarChart
                    ariaLabel={`등급 레이더 — ${radarCase.title}`}
                    targetLabel={TARGET_LABEL}
                    peerLabel={PEER_LABEL}
                    data={[...radarCase.data]}
                />
            </li>
        ))}
    </ul>
)

const RuleList = ({rules}: {rules: readonly string[]}) => (
    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
        {rules.map((rule) => (
            <li key={rule} className="flex">
                <ListMarker type="unordered" />
                <span className="min-w-0">{rule}</span>
            </li>
        ))}
    </ul>
)

const GradeRadarChartGuidePage = () => (
    <GuidePageShell
        title="등급 레이더 차트 (GradeRadarChart)"
        description="평가대상과 비교 기준(동일 특허분야 평균)의 항목별 점수를 세 축 삼각형으로 겹쳐 봅니다. 모양 설정은 컴포넌트가 갖고 있어 받은 점수만 넣으면 됩니다."
    >
        <BaseCard>
            <section aria-labelledby="grc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="grc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        특허 등급조회 &apos;특허 평가등급&apos;의 오른쪽 차트입니다.{' '}
                        <code className="font-mono">targetScore</code>는 평가대상,{' '}
                        <code className="font-mono">peerScore</code>는 비교 기준 점수(0~100)입니다. 값은 차트 아래 숨김
                        표로도 제공되어 화면 낭독기로 읽을 수 있습니다.
                    </p>
                </div>
                <div className="max-w-122">
                    <GradeRadarChart
                        ariaLabel="특허 평가등급 — 평가대상특허와 동일 특허분야 평균 비교"
                        targetLabel={TARGET_LABEL}
                        peerLabel={PEER_LABEL}
                        data={DEMO_DATA}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-composition" className="flex flex-col gap-4">
                <h2 id="grc-composition" className="typo-h4-bold">
                    구성 · 크기 (Composition)
                </h2>
                <RuleList rules={COMPOSITION_RULES} />
                <RuleList rules={SIZE_RULES} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="grc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값을 불러오는 동안 <code className="font-mono">isLoading</code>을 주면 같은 높이(PC 272 · 좁은
                        화면 208)의 스켈레톤을 보입니다. 범례 두 개 · 고리 4겹 삼각 격자 · 두 계열 면과 꼭짓점 · 축 이름
                        세 자리의 짜임이 실제 차트와 같아 불러온 뒤 자리가 흔들리지 않습니다. 스켈레톤은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;triangle-radar&quot;</code>이며 화면
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <GradeRadarChart
                            ariaLabel="특허 평가등급"
                            targetLabel={TARGET_LABEL}
                            peerLabel={PEER_LABEL}
                            data={DEMO_DATA}
                            isLoading
                            loadingLabel="특허 평가등급을 불러오는 중입니다."
                        />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <GradeRadarChart
                            ariaLabel="특허 평가등급"
                            targetLabel={TARGET_LABEL}
                            peerLabel={PEER_LABEL}
                            data={DEMO_DATA}
                        />
                    </div>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-edge" className="flex flex-col gap-4">
                <div>
                    <h2 id="grc-edge" className="typo-h4-bold">
                        끝 값 (Edge)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        점수가 0 이나 100 에 붙어도 축 이름 · 격자 · 범례의 자리는 바뀌지 않습니다. 받은 값을 그대로
                        넣으면 됩니다.
                    </p>
                </div>
                <CaseList cases={EDGE_CASES} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="grc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값의 조합에 따라 계열이 겹치거나 빠지는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <CaseList cases={SPECIAL_CASES} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-props" className="flex flex-col gap-4">
                <h2 id="grc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GradeRadarChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeRadarChartGuidePage
