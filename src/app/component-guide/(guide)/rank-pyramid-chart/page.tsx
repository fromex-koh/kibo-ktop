// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {RankPyramidChart} from '@/components/custom/rank-pyramid-chart'

export const metadata: Metadata = {title: '순위 피라미드 (RankPyramidChart)'}

const GROUP_LABEL = '그 외 기타 전자부품 제조업'

const USAGE_CODE = `import {RankPyramidChart} from '@/components/custom/rank-pyramid-chart'

<RankPyramidChart
  percentile={25}
  groupLabel="그 외 기타 전자부품 제조업"
  ariaLabel="동일업종(그 외 기타 전자부품 제조업) 기준 상위 25%"
/>`

const SHAPE_RULES = [
    '폭 258 · 높이 220 의 4단 피라미드입니다(0~25 · 25~50 · 50~75 · 75~100%, 단 사이 4). 모든 단의 옆변이 한 직선(기울기 0.589) 위에 놓이고, 꼭짓점은 반경 12 · 밑변 양 끝은 반경 10 으로 크게 둥글리며 가운데 모서리는 각집니다.',
    '왕관은 최상위 표시라 현재 구간과 무관하게 늘 맨 위 단에 있습니다. 맨 위 단이 현재 구간이면 흰 왕관(crown.webp), 아니면 보라 왕관(crown-purple.webp)을 20×18 로 씁니다.',
    'percentile 이 속한 현재 구간은 보라 면(purple.500)으로만 표시하고 그 위 구간 글자는 흰색이 됩니다.',
    '맨 위 단은 왕관이 구간 글자 자리를 차지하므로, 오른쪽으로 지시선 · 점 · 구간 이름(0~25%, purple.600)을 빼 적습니다. 현재 구간과 무관하게 늘 맨 위 단에서만 나갑니다.',
    '나머지 단은 옅은 보라 면(purple.50)에 구간 글자 12(gray.700)를 둡니다.',
    '왼쪽 글자 묶음은 제목 14 Bold · 상위 % 32 Bold · 집단 이름 14 Regular 입니다. 폭이 좁으면 피라미드가 아래로 내려갑니다.',
] as const

// 네 구간을 모두 보인다. 경계값(25 · 50 · 75)은 위 구간에 속한다 — 상위 25% 는 0~25%, 상위 50% 는 25~50%.
const CASES = [
    {title: '0~25% 구간 (상위 10%)', percentile: 10},
    {title: '25~50% 구간 (상위 40%)', percentile: 40},
    {title: '50~75% 구간 (상위 60%)', percentile: 60},
    {title: '75~100% 구간 (상위 90%)', percentile: 90},
] as const

const BOUNDARY_RULES = [
    '경계값은 위 구간에 속합니다 — 상위 25% 는 0~25%, 상위 50% 는 25~50%, 상위 75% 는 50~75% 입니다.',
    '0 보다 작거나 100 보다 큰 값은 0 · 100 으로 맞춥니다(상위 0% 는 0~25%, 상위 100% 는 75~100%).',
] as const

const PROPS_ITEMS = [
    ['RankPyramidChart', 'percentile', '상위 %(0~100)입니다. 이 값이 속한 단이 강조됩니다.', '-', 'number'],
    ['RankPyramidChart', 'title', '글자 묶음 제목입니다.', "'동일업종 기준'", 'string'],
    ['RankPyramidChart', 'groupLabel', '비교 집단 이름입니다.', '-', 'string'],
    ['RankPyramidChart', 'ariaLabel', '집단과 상위 % 를 한 문장으로 읽어 줍니다.', '-', 'string'],
    [
        'RankPyramidChart',
        'className · div props',
        '바깥 여백 등 네이티브 div 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
] as const

const DATA_CODE = `// [프론트엔드 연동] 상위 %(0~100)와 비교 집단 이름을 그대로 넘긴다 — 강조할 단(4단 중 하나)은 컴포넌트가 정한다.
<RankPyramidChart
  percentile={techIndex.industryPercentile} // 예: 25 → 상위 25%
  groupLabel={techIndex.industryLabel} // 예: 그 외 기타 전자부품 제조업
  ariaLabel={\`동일업종(\${techIndex.industryLabel}) 기준 상위 \${techIndex.industryPercentile}%\`}
/>`

const RankPyramidChartGuidePage = () => (
    <GuidePageShell
        title="순위 피라미드 (RankPyramidChart)"
        description="동일 집단 안에서의 상위 % 를 4단 피라미드로 보여 주는 차트입니다. 현재 구간은 보라 면으로 표시하고, 왕관이 있는 맨 위 단의 구간 이름은 지시선으로 밖에 적습니다."
    >
        <BaseCard>
            <section aria-labelledby="rp-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="rp-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 혁신성장역량지수 오른쪽 카드와 같은 구성입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-147 rounded-sm border p-6">
                    <RankPyramidChart
                        percentile={25}
                        groupLabel={GROUP_LABEL}
                        ariaLabel={`동일업종(${GROUP_LABEL}) 기준 상위 25%`}
                        className="pl-5"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="rp-shape" className="typo-h4-bold">
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
            <section aria-labelledby="rp-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="rp-cases" className="typo-h4-bold">
                        구간별 강조 (Cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        percentile 에 따라 보라 면 단만 바뀝니다. 왕관과 맨 위 단의 지시선은 늘 같은 자리에 있습니다.
                        받은 값을 그대로 넣으면 됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                    {BOUNDARY_RULES.map((rule) => (
                        <li key={rule} className="flex">
                            <ListMarker type="unordered" />
                            <span className="min-w-0">{rule}</span>
                        </li>
                    ))}
                </ul>
                <ul className="grid list-none gap-6 md:grid-cols-2">
                    {CASES.map((item) => (
                        <li key={item.title} className="flex flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <RankPyramidChart
                                percentile={item.percentile}
                                groupLabel={GROUP_LABEL}
                                ariaLabel={`동일업종 기준 상위 ${item.percentile}%`}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="rp-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;rank-pyramid&quot;</code>를 같은 자리에
                        둡니다. 글자 묶음과 실제 차트와 같은 단 경로(모서리 포함)를 써서 불러온 뒤 자리가 흔들리지
                        않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="rank-pyramid" label="동일업종 순위를 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <RankPyramidChart
                            percentile={25}
                            groupLabel={GROUP_LABEL}
                            ariaLabel={`동일업종(${GROUP_LABEL}) 기준 상위 25%`}
                            className="pl-5"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="rp-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        상위 %(0~100)와 비교 집단 이름을 그대로 넘깁니다. 강조할 단은 컴포넌트가 정합니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="RankPyramidChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-props" className="flex flex-col gap-4">
                <h2 id="rp-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="RankPyramidChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RankPyramidChartGuidePage
