// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {GradeRadarChart, type GradeRadarItem} from '@/components/custom/grade-radar-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'

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

const EDGE_CASES = [
    {
        title: '모두 0',
        description: '두 계열이 가운데 한 점으로 모입니다.',
        data: withScores(0, 0),
    },
    {
        title: '모두 100',
        description: '꼭짓점이 바깥 고리에 닿습니다.',
        data: withScores(100, 100),
    },
    {
        title: '평가대상 100 · 비교 기준 0',
        description: '평가대상 삼각형만 바깥 고리까지 펼쳐지고 비교 기준 면은 가운데에 모입니다.',
        data: withScores(100, 0),
    },
] as const

const SPECIAL_CASES = [
    {
        title: '평가대상 = 비교 기준',
        description: '두 계열이 겹쳐도 평가대상이 앞에 그려져 보입니다.',
        data: DEMO_DATA.map((item) => ({...item, peerScore: item.targetScore})),
    },
    {
        title: '비교 기준이 없는 경우',
        description: 'peerScore 를 모두 비우면 비교 계열과 범례를 그리지 않습니다.',
        data: DEMO_DATA.map((item) => ({id: item.id, label: item.label, targetScore: item.targetScore})),
    },
    {
        title: '범위를 벗어난 값',
        description: '0 미만 · 100 초과 값은 0 · 100 으로 맞춥니다(예: -20 · 130).',
        data: [
            {id: 'diversity', label: '기술다양성', targetScore: 130, peerScore: 72},
            {id: 'market', label: '시장확장성', targetScore: -20, peerScore: 78},
            {id: 'value', label: '가치창출가능성', targetScore: 74, peerScore: 70},
        ],
    },
] as const

const USAGE_CODE = `import {GradeRadarChart} from '@/components/custom/grade-radar-chart'

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

const DATA_CODE = `// 축(지표)마다 평가대상 · 비교 기준 점수(0~100)를 한 항목으로 바꾼다.
// 비교 기준이 없으면 peerScore 를 비운다.
const data = indicators.map((indicator) => ({
  id: indicator.code,
  label: indicator.name, // 예: 기술다양성
  targetScore: indicator.score,
  peerScore: indicator.averageScore ?? undefined,
}))

<GradeRadarChart ariaLabel="특허 등급 지표" data={data} isLoading={isLoading} />`

const LOADING_CODE = `<GradeRadarChart
  ariaLabel="특허 평가등급"
  data={data ?? []}
  isLoading={isLoading}
  loadingLabel="특허 평가등급을 불러오는 중입니다."
/>`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'grade-radar',
        cells: [
            '세 축 점수를 평가대상과 비교 기준으로 견줌',
            <code key="component">GradeRadarChart</code>,
            '축은 반시계 방향 삼각형으로 고정되고 모양 설정이 내장되어 있어 점수만 넘깁니다.',
        ],
    },
    {
        key: 'comparison-radar',
        cells: [
            '축 수 · 색 · 격자 · 크기를 직접 정해야 함',
            <Link key="component" href="/component-guide/comparison-radar-chart" className={LINK_CLASS}>
                ComparisonRadarChart
            </Link>,
            'GradeRadarChart 가 내부에서 쓰는 기반 컴포넌트입니다. 축이 셋이 아니거나 모양을 바꿔야 할 때 씁니다.',
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
    ['data', '축마다 한 항목입니다. 축이 세 개인 삼각형을 전제로 설계되었습니다.', '-', 'GradeRadarItem[]'],
    ['ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['targetLabel', '평가대상 계열의 이름입니다. 범례와 숨김 표에 쓰입니다.', "'평가대상'", 'string'],
    ['peerLabel', '비교 기준 계열의 이름입니다.', "'비교 기준'", 'string'],
    ['animate', '처음 펼쳐질 때의 움직임입니다. 한 번 그린 뒤에는 다시 펼치지 않습니다.', 'true', 'boolean'],
    ['showTooltip', '값 위에 올렸을 때의 말풍선과 꼭짓점 강조입니다.', 'true', 'boolean'],
    ['isLoading', '스켈레톤을 대신 보입니다.', 'false', 'boolean'],
    ['loadingLabel', '불러오는 중에 화면 낭독기가 읽을 문구입니다.', "'등급 레이더를 불러오는 중입니다.'", 'string'],
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
    {key: 'field', header: 'GradeRadarItem', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const ITEM_ROWS = (
    [
        ['id', 'string', '고유 값입니다.'],
        ['label', 'string', '축 이름입니다.'],
        ['targetScore', 'number', '평가대상 점수(0~100)입니다. 범위를 벗어나면 0 · 100 으로 맞춥니다.'],
        [
            'peerScore',
            'number | undefined',
            '비교 기준 점수(0~100)입니다. 모든 항목에서 비우면 비교 계열을 그리지 않습니다.',
        ],
    ] as const
).map(([name, type, note]) => ({
    key: name,
    cells: [<code key="field">{name}</code>, <code key="type">{type}</code>, note],
}))

type CaseListProps = {
    cases: readonly {title: string; description: string; data: readonly GradeRadarItem[]}[]
}

const CaseList = ({cases}: CaseListProps) => (
    <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-3">
        {cases.map((radarCase) => (
            <li key={radarCase.title} className="flex min-w-0 flex-col gap-2">
                <h4 className="typo-body-l-bold text-foreground">{radarCase.title}</h4>
                <p className="typo-body-m-regular text-label-foreground">{radarCase.description}</p>
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

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const GradeRadarChartGuidePage = () => (
    <GuidePageShell
        title="등급 레이더 차트 (GradeRadarChart)"
        description="평가대상과 비교 기준의 항목별 점수를 세 축 삼각형으로 겹쳐 봅니다. 모양은 컴포넌트에 내장되어 점수만 넘기면 됩니다."
    >
        <BaseCard>
            <section aria-labelledby="grc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="grc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>targetScore</code> 는 평가대상, <code>peerScore</code> 는 비교 기준 점수(0~100)입니다. 첫
                        항목이 위, 두 번째가 왼쪽 아래, 세 번째가 오른쪽 아래에 놓입니다. 평가대상은 실선과 속 빈 점,
                        비교 기준은 점선 테두리와 옅은 면입니다.
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
            <section aria-labelledby="grc-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="grc-states" className="typo-h4-bold">
                        상태와 특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        로딩과 값의 조합에 따른 표시입니다. 받은 값을 그대로 넘기면 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 이면 같은 높이의 삼각 레이더 스켈레톤을 보입니다. 새로고침 직후
                            차트가 폭을 재기 전에도 같은 스켈레톤이 자동으로 보이므로 따로 넘길 값은 없습니다.
                        </p>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <GradeRadarChart
                                ariaLabel="특허 평가등급"
                                targetLabel={TARGET_LABEL}
                                peerLabel={PEER_LABEL}
                                data={DEMO_DATA}
                                isLoading
                                loadingLabel="특허 평가등급을 불러오는 중입니다."
                            />
                            <GradeRadarChart
                                ariaLabel="특허 평가등급"
                                targetLabel={TARGET_LABEL}
                                peerLabel={PEER_LABEL}
                                data={DEMO_DATA}
                            />
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">끝 값</h3>
                        <CaseList cases={EDGE_CASES} />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">계열이 겹치거나 빠질 때</h3>
                        <CaseList cases={SPECIAL_CASES} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="grc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        축(지표)마다 평가대상 점수와 비교 기준 점수를 한 항목으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="grc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이 컴포넌트는 <code>ComparisonRadarChart</code> 에 등급 레이더용 모양을 입힌 것입니다.
                    </p>
                </div>
                <Table
                    caption="GradeRadarChart · ComparisonRadarChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="grc-a11y" className="typo-h4-bold">
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
                        축별 점수를 담은 숨김 표(<code>caption</code> · <code>th scope</code>)가 함께 렌더링되어 화면
                        낭독기가 값을 읽습니다[7.3.2].
                    </li>
                    <li>
                        두 계열은 색뿐 아니라 실선과 점선 · 속 빈 점으로도 구분하고 범례 텍스트를 함께 둡니다[5.3.1].
                    </li>
                    <li>
                        <code>animate</code> 로 움직임을 끌 수 있습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="grc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="grc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>ariaLabel</code> 이 필수입니다. 나머지 <code>div</code> 속성은 루트
                        요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeRadarChart</h3>
                        <Table
                            caption="GradeRadarChart Props 목록"
                            columns={PROPS_COLUMNS}
                            rows={PROPS_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">GradeRadarItem</h3>
                        <Table caption="GradeRadarItem 필드 목록" columns={ITEM_COLUMNS} rows={ITEM_ROWS} size="md" />
                    </div>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeRadarChartGuidePage
