// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {RankPyramidChart} from '@/components/custom/rank-pyramid-chart'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '순위 피라미드 (RankPyramidChart)'}

const GROUP_LABEL = '그 외 기타 전자부품 제조업'

const USAGE_CODE = `import {RankPyramidChart} from '@/components/custom/rank-pyramid-chart'

<RankPyramidChart
  percentile={25}
  groupLabel="그 외 기타 전자부품 제조업"
  ariaLabel="동일업종(그 외 기타 전자부품 제조업) 기준 상위 25%"
/>`

const DATA_CODE = `// 상위 %(0~100)와 비교 집단 이름을 그대로 넘긴다. 강조할 단은 컴포넌트가 정한다.
<RankPyramidChart
  percentile={techIndex.industryPercentile} // 예: 25 → 상위 25%
  groupLabel={techIndex.industryLabel} // 예: 그 외 기타 전자부품 제조업
  ariaLabel={\`동일업종(\${techIndex.industryLabel}) 기준 상위 \${techIndex.industryPercentile}%\`}
/>`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

{isLoading ? (
  <ChartSkeleton type="rank-pyramid" label="동일업종 순위를 불러오는 중입니다." />
) : (
  <RankPyramidChart percentile={percentile} groupLabel={groupLabel} ariaLabel="…" />
)}`

// 네 구간을 모두 보인다.
const CASES = [
    {title: '0~25% 구간 (상위 10%)', percentile: 10},
    {title: '25~50% 구간 (상위 40%)', percentile: 40},
    {title: '50~75% 구간 (상위 60%)', percentile: 60},
    {title: '75~100% 구간 (상위 90%)', percentile: 90},
] as const

const PROPS_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const PROPS_ROWS = (
    [
        [
            'percentile',
            '상위 %(0~100)입니다. 이 값이 속한 단이 강조됩니다. 범위를 벗어나면 0 · 100 으로 맞춥니다.',
            '-',
            'number',
        ],
        ['groupLabel', '비교 집단 이름입니다. 왼쪽 글자 묶음에 적힙니다.', '-', 'string'],
        ['ariaLabel', '집단과 상위 % 를 한 문장으로 읽어 줍니다.', '-', 'string'],
        ['title', '왼쪽 글자 묶음의 제목입니다.', "'동일업종 기준'", 'string'],
    ] as const
).map(([name, note, defaultValue, type]) => ({
    key: name,
    cells: [
        <code key="prop">{name}</code>,
        <code key="type">{type}</code>,
        <code key="default">{defaultValue}</code>,
        note,
    ],
}))

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const RankPyramidChartGuidePage = () => (
    <GuidePageShell
        title="순위 피라미드 (RankPyramidChart)"
        description="동일 집단 안에서의 상위 % 를 4단 피라미드로 보여 줍니다. 현재 구간은 보라 면으로 표시합니다."
    >
        <BaseCard>
            <section aria-labelledby="rp-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rp-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        왼쪽에 제목 · 상위 % · 집단 이름이 놓이고 오른쪽에 피라미드가 놓입니다. 폭이 좁으면 피라미드가
                        아래로 내려가며 폭에 맞춰 줄어듭니다. 맨 위 단에는 구간 글자 대신 왕관이 있어, 구간
                        이름(0~25%)은 지시선으로 밖에 적습니다.
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
            <section aria-labelledby="rp-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rp-states" className="typo-h4-bold">
                        구간과 로딩
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>percentile</code> 에 따라 보라 면 단만 바뀌고, 왕관과 지시선은 늘 맨 위 단에 있습니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">구간별 강조</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            경계값은 위 구간에 속합니다. 상위 25% 는 0~25%, 50% 는 25~50%, 75% 는 50~75% 입니다. 현재
                            구간이 맨 위 단이면 흰 왕관, 아니면 보라 왕관을 씁니다.
                        </p>
                        <ul className="grid list-none gap-6 md:grid-cols-2">
                            {CASES.map((item) => (
                                <li key={item.title} className="flex flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <RankPyramidChart
                                        percentile={item.percentile}
                                        groupLabel={GROUP_LABEL}
                                        ariaLabel={`동일업종 기준 상위 ${item.percentile}%`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 차트에는 <code>isLoading</code> 이 없습니다. 기다리는 동안{' '}
                            <code>ChartSkeleton type=&quot;rank-pyramid&quot;</code> 를 같은 자리에 둡니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ChartSkeleton type="rank-pyramid" label="동일업종 순위를 불러오는 중입니다." />
                            <RankPyramidChart
                                percentile={25}
                                groupLabel={GROUP_LABEL}
                                ariaLabel={`동일업종(${GROUP_LABEL}) 기준 상위 25%`}
                                className="pl-5"
                            />
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rp-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        상위 %(0~100)와 비교 집단 이름을 그대로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rp-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용처는 집단과 상위 % 가 드러나는 <code>ariaLabel</code> 을 넘깁니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        전체가 <code>role=&quot;img&quot;</code> 이고 안의 글자와 도형은 <code>aria-hidden</code> 이라{' '}
                        <code>ariaLabel</code> 만 읽힙니다[5.1.1].
                    </li>
                    <li>현재 구간은 보라 면뿐 아니라 왼쪽 “상위 N%” 글자로도 전달됩니다[5.3.1].</li>
                    <li>움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rp-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="rp-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>percentile</code> · <code>groupLabel</code> · <code>ariaLabel</code> 이 필수입니다. 나머지{' '}
                        <code>div</code> 속성은 루트 요소에 전달됩니다.
                    </p>
                </div>
                <Table caption="RankPyramidChart Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RankPyramidChartGuidePage
