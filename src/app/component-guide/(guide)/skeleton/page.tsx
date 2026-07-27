import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton, type ChartSkeletonType} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Skeleton} from '@/components/ui/skeleton'

export const metadata: Metadata = {title: '스켈레톤 (Skeleton · ChartSkeleton)'}

const BASIC_CODE = `import {Skeleton} from '@/components/ui/skeleton';

export default function TextLoading() {
  return <Skeleton className="h-6 w-48" />;
}`

const COMPANY_NETWORK_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton';

export default function CompanyRelationshipLoading() {
  return (
    <ChartSkeleton
      type="network"
      legend="company-relationship"
      label="연계기업 네트워크를 불러오는 중입니다."
    />
  );
}`

const SUPPLY_NETWORK_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton';

export default function SupplyNetworkLoading() {
  return (
    <ChartSkeleton
      type="network"
      legend="supply-network"
      label="공급망 네트워크를 불러오는 중입니다."
    />
  );
}`

const CHART_TYPES_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton';

<ChartSkeleton type="donut" label="기업 보유기술을 불러오는 중입니다." />
<ChartSkeleton type="benchmark" label="혁신성장역량지수를 불러오는 중입니다." />
<ChartSkeleton type="gauge" label="기업신용등급을 불러오는 중입니다." />
<ChartSkeleton type="matrix" label="경영지표 등급을 불러오는 중입니다." />
<ChartSkeleton type="radar" label="부문별 비교를 불러오는 중입니다." />
<ChartSkeleton type="bar" label="재무 현황을 불러오는 중입니다." />
<ChartSkeleton type="line" label="추이 비교를 불러오는 중입니다." />
<ChartSkeleton type="word-cloud" label="R&D 이슈를 불러오는 중입니다." />`

const CHART_SKELETON_EXAMPLES: Array<{
    type: ChartSkeletonType
    title: string
    description: string
    label: string
}> = [
    {
        type: 'donut',
        title: '기업 보유기술 (PercentageDonutChart)',
        description: '도넛·외부 라벨 영역과 기술 분류 범례를 함께 대체합니다.',
        label: '기업 보유기술을 불러오는 중입니다.',
    },
    {
        type: 'benchmark',
        title: '혁신성장역량지수 (ScoreBenchmarkChart)',
        description: '점수 링·평가 요약·동일업종 벤치마크 진행률을 함께 대체합니다.',
        label: '혁신성장역량지수를 불러오는 중입니다.',
    },
    {
        type: 'gauge',
        title: '기업신용등급 (SemicircleRatingGauge)',
        description: '반원형 등급 게이지와 중앙 등급 설명을 대체합니다.',
        label: '기업신용등급을 불러오는 중입니다.',
    },
    {
        type: 'matrix',
        title: '기업 경영지표 등급 (RatingMatrix)',
        description: '평가지표 행과 등급 열로 구성된 매트릭스 표를 대체합니다.',
        label: '기업 경영지표 등급을 불러오는 중입니다.',
    },
    {
        type: 'radar',
        title: '부문별 비교 (ComparisonRadarChart)',
        description: '방사형 축·비교 면·조회기업과 업종평균 범례를 함께 대체합니다.',
        label: '부문별 비교를 불러오는 중입니다.',
    },
    {
        type: 'bar',
        title: '막대형 차트 공통',
        description: 'GroupedColumnChart·재무상태표·손익계산서·ColumnChart·인당 매출액에 동일하게 사용합니다.',
        label: '막대형 재무 차트를 불러오는 중입니다.',
    },
    {
        type: 'line',
        title: '추이 차트 공통',
        description: 'LineChart·현금흐름 추이·분기별 종업원 수의 선형·영역형 차트에 동일하게 사용합니다.',
        label: '추이 차트를 불러오는 중입니다.',
    },
    {
        type: 'word-cloud',
        title: 'R&D 이슈 워드클라우드 (WordCloud)',
        description: '중요도에 따라 크기가 다른 키워드 배치 영역을 대체합니다.',
        label: 'R&D 이슈 워드클라우드를 불러오는 중입니다.',
    },
]

const PROPS_ITEMS = [
    [
        'Skeleton',
        'className · div props',
        'shadcn 기본 플레이스홀더의 크기와 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    [
        'ChartSkeleton',
        'type',
        '실제 차트 구조와 맞는 스켈레톤 유형을 선택합니다.',
        '-',
        "'network' | 'donut' | 'benchmark' | 'gauge' | 'matrix' | 'radar' | 'bar' | 'line' | 'word-cloud'",
    ],
    [
        'ChartSkeleton',
        'legend',
        '네트워크 차트와 함께 표시할 API 기반 범례 구조를 선택합니다.',
        'undefined',
        "'company-relationship' | 'supply-network'",
    ],
    [
        'ChartSkeleton',
        'label',
        '차트 로딩 상태를 스크린리더에 전달합니다.',
        '차트 데이터를 불러오는 중입니다.',
        'string',
    ],
    [
        'ChartSkeleton',
        'className · div props',
        '크기·배치 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

const SkeletonGuidePage = () => (
    <GuidePageShell
        title="스켈레톤 (Skeleton · ChartSkeleton)"
        description="shadcn 기본 플레이스홀더인 Skeleton과 차트 로딩 구조를 제공하는 composite ChartSkeleton을 함께 안내합니다."
    >
        <BaseCard>
            <section aria-labelledby="skeleton-architecture" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="skeleton-architecture" className="typo-h4-bold">
                        레이어 및 API
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        기본 primitive와 프로젝트 확장 컴포넌트의 책임을 분리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle list-disc space-y-2 pl-5">
                    <li>Skeleton은 ui의 shadcn 원본을 유지하며 단순 플레이스홀더에 사용합니다.</li>
                    <li>ChartSkeleton은 composite에서 차트 구조·로딩 상태·접근성 문구를 조합합니다.</li>
                    <li>차트 모양은 Skeleton의 variant가 아니라 ChartSkeleton의 type으로 선택합니다.</li>
                    <li>유형별 크기·반응형·도형 스타일은 theme/chart-skeleton.variants.ts에서 관리합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-basic" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="skeleton-basic" className="typo-h4-bold">
                        Primitive · Skeleton
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        텍스트와 이미지 등 단순한 콘텐츠 영역은 크기를 className으로 지정합니다.
                    </p>
                </div>
                <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-6">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="기본 Skeleton 사용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-chart-types" className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h2 id="skeleton-chart-types" className="typo-h4-bold">
                        Composite · ChartSkeleton Types
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        실제 차트의 축·범례·보조 정보를 포함하며 화면 너비에 따라 크기와 배치가 조정됩니다. 유사한
                        차트는 같은 type을 공유합니다.
                    </p>
                </div>

                <div className="grid min-w-0 gap-6">
                    {CHART_SKELETON_EXAMPLES.map((example) => (
                        <section
                            key={example.type}
                            aria-labelledby={`skeleton-chart-${example.type}`}
                            className="flex min-w-0 flex-col gap-3"
                        >
                            <div className="flex flex-col gap-1">
                                <h3 id={`skeleton-chart-${example.type}`} className="typo-body-xl-bold">
                                    {example.title}
                                </h3>
                                <p className="typo-body-l-regular text-foreground-subtle">{example.description}</p>
                            </div>
                            <div className="bg-card border-border min-w-0 overflow-hidden rounded-xl border p-4 sm:p-6">
                                <ChartSkeleton type={example.type} label={example.label} />
                            </div>
                        </section>
                    ))}
                </div>

                <CodeBlock
                    code={CHART_TYPES_CODE}
                    language="tsx"
                    copyLabel="차트 타입별 ChartSkeleton 사용 코드 복사"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-network" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="skeleton-network" className="typo-h4-bold">
                        Composite · ChartSkeleton Network
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        실제 네트워크 영역과 같은 구조로 범례와 차트를 함께 대체합니다.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="typo-body-xl-bold">연계기업 네트워크 (CompanyRelationshipGraph)</h3>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            연계유형·EW등급 범례와 네트워크 그래프를 함께 표시합니다.
                        </p>
                    </div>
                    <div className="bg-card border-border overflow-hidden rounded-xl border p-4">
                        <ChartSkeleton
                            type="network"
                            legend="company-relationship"
                            label="연계기업 네트워크를 불러오는 중입니다."
                        />
                    </div>
                    <CodeBlock
                        code={COMPANY_NETWORK_CODE}
                        language="tsx"
                        copyLabel="연계기업 Network Skeleton 사용 코드 복사"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="typo-body-xl-bold">산업별 공급망 분포 (NetworkGraph)</h3>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            상태 범례·연결선 안내·읽는 방법과 네트워크 그래프를 함께 표시합니다.
                        </p>
                    </div>
                    <div className="bg-card border-border overflow-hidden rounded-xl border p-4">
                        <ChartSkeleton
                            type="network"
                            legend="supply-network"
                            label="공급망 네트워크를 불러오는 중입니다."
                        />
                    </div>
                    <CodeBlock
                        code={SUPPLY_NETWORK_CODE}
                        language="tsx"
                        copyLabel="공급망 Network Skeleton 사용 코드 복사"
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-usage" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="skeleton-usage" className="typo-h4-bold">
                        적용 기준
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        로딩이 끝나면 같은 영역의 실제 콘텐츠 또는 차트로 교체합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle list-disc space-y-2 pl-5">
                    <li>단순 플레이스홀더는 shadcn 원본 Skeleton을 사용합니다.</li>
                    <li>차트 로딩 구조는 composite ChartSkeleton과 실제 구조에 맞는 type을 사용합니다.</li>
                    <li>범례 데이터도 같은 API에서 가져오면 용도에 맞는 legend를 함께 지정합니다.</li>
                    <li>차트 도형과 범례는 기본 반응형을 사용하며, RatingMatrix는 작은 화면에서 표시 열을 줄입니다.</li>
                    <li>label에는 데이터나 업무 대상을 포함한 로딩 문구를 작성합니다.</li>
                    <li>장식용 도형은 보조기기에 숨기고 로딩 상태만 전달합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-props" className="flex flex-col gap-4">
                <h2 id="skeleton-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="Skeleton과 ChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SkeletonGuidePage
