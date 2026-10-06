// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton, type ChartSkeletonType} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
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
<ChartSkeleton type="score-gauge" label="혁신성장역량지수를 불러오는 중입니다." />
<ChartSkeleton type="score-ring" label="지수 점수를 불러오는 중입니다." />
<ChartSkeleton type="grade-arc" label="등급을 불러오는 중입니다." className="w-grade-gauge-md" />
<ChartSkeleton type="rank-pyramid" label="동일업종 순위를 불러오는 중입니다." />
<ChartSkeleton type="gauge" label="기업신용등급을 불러오는 중입니다." />
<ChartSkeleton type="matrix" label="재무비율진단을 불러오는 중입니다." />
<ChartSkeleton type="radar" label="부문별 비교를 불러오는 중입니다." />
<ChartSkeleton type="bar" label="재무 현황을 불러오는 중입니다." />
<ChartSkeleton type="line" label="추이 비교를 불러오는 중입니다." />
<ChartSkeleton type="word-cloud" label="R&D 이슈를 불러오는 중입니다." />`

const CHART_SKELETON_EXAMPLES: Array<{
    type: ChartSkeletonType
    title: string
    description: string
    label: string
    // 실제 차트가 폭을 스스로 정하는 경우(고정 폭 게이지)만 그 폭을 그대로 넘긴다.
    className?: string
}> = [
    {
        type: 'donut',
        title: '기업 보유기술 (PercentageDonutChart)',
        description: '도넛 링과 사각 칩 범례 8줄을 같은 배치(간격 60 · 좁은 폭에서는 아래로)로 대체합니다.',
        label: '기업 보유기술을 불러오는 중입니다.',
    },
    {
        type: 'score-gauge',
        title: '혁신성장역량지수 점수 (ScoreGauge)',
        description: '지름 320 원호와 가운데 점수 · 상태 · 보조 줄을 같은 높이로 대체합니다.',
        label: '혁신성장역량지수를 불러오는 중입니다.',
    },
    {
        type: 'grade-arc',
        title: '투자용 등급 (GradeArcGauge)',
        description:
            '위가 열린 반원 하나와 그 아래 이름 자리를 잡습니다. 폭은 실제 게이지(md)와 같게 className 으로 넘깁니다.',
        label: '등급을 불러오는 중입니다.',
        className: 'w-grade-gauge-md',
    },
    {
        type: 'score-ring',
        title: 'Tech-Index 지수 (ScoreRing)',
        description: '지름 160 원 하나와 가운데 이름 · 점수 · 등급 세 줄의 자리를 잡습니다.',
        label: '지수 점수를 불러오는 중입니다.',
    },
    {
        type: 'rank-pyramid',
        title: '동일업종 순위 (RankPyramidChart)',
        description: '왼쪽 글자 묶음과 4단 피라미드를 같은 배치로 대체합니다.',
        label: '동일업종 순위를 불러오는 중입니다.',
    },
    {
        type: 'gauge',
        title: '기업신용등급 (SemicircleRatingGauge)',
        description: '지름 260 원호(실제 게이지와 같은 경로)와 가운데 등급 · 설명, 아래 날짜 목록 두 줄을 대체합니다.',
        label: '기업신용등급을 불러오는 중입니다.',
    },
    {
        type: 'matrix',
        title: '재무비율진단 (RatingMatrix)',
        description: '머리 줄 · 항목 줄 5개와 항목마다 한 칸의 원(24)을 같은 높이로 대체합니다.',
        label: '재무비율진단을 불러오는 중입니다.',
    },
    {
        type: 'radar',
        title: '다각형 레이더 (ComparisonRadarChart)',
        description: '방사형 축·비교 면·조회기업과 업종평균 범례를 함께 대체합니다.',
        label: '레이더 차트를 불러오는 중입니다.',
    },
    {
        type: 'circle-radar',
        title: '부문별 비교 (ComparisonRadarChart · 동심원)',
        description: '동심원 4고리 · 다섯 축 선 · 가운데 면 · 축 이름 다섯을 대체합니다(칸 높이 248).',
        label: '부문별 비교를 불러오는 중입니다.',
    },
    {
        type: 'pentagon-radar',
        title: '다섯 축 오각 레이더 (ComparisonRadarChart · 인쇄용 리포트)',
        description:
            '오각 격자 4겹 · 다섯 축 선 · 가운데 면 · 축 이름 다섯을 대체합니다. 인쇄용 리포트의 레이더는 크기가 정해져 있어 같은 자리에 같은 크기로 섭니다.',
        label: '기업 대표 5대 역량 환산 점수를 불러오는 중입니다.',
    },
    {
        type: 'overlay-column',
        title: '재무상태 · 손익현황 (OverlayColumnChart)',
        description: '범례 · 칸 상자 · 옅은 기준 막대와 그 앞 막대 둘 · 항목 이름 자리를 대체합니다.',
        label: '재무상태를 불러오는 중입니다.',
    },
    {
        type: 'columns-line',
        title: '주요재무비율 · 현금흐름 (LineChart · columns)',
        description: '칸 상자 · 칸 가운데를 잇는 선 · 항목 이름 자리 · 아래 범례를 대체합니다.',
        label: '주요재무비율을 불러오는 중입니다.',
    },
    {
        type: 'cells-line',
        title: '분기별 종업원수 (LineChart · cells)',
        description: '점마다 세로 점선 · 바닥선 · 선과 옅은 면 · 항목 이름 자리를 대체합니다.',
        label: '분기별 종업원수를 불러오는 중입니다.',
    },
    {
        type: 'cells-column',
        title: '인당 매출액 (ColumnChart · cells)',
        description: '점선 칸 상자 · 칸마다 막대 하나 · 항목 이름 자리를 대체합니다.',
        label: '인당 매출액을 불러오는 중입니다.',
    },
    {
        type: 'grade-distribution',
        title: '등급 분포 곡선 (GradeDistributionChart)',
        description: '곡선 자리(높이 144)를 종 모양 면으로 대체합니다. 아래 표는 글자라 그대로 그려집니다.',
        label: '등급 분포를 불러오는 중입니다.',
    },
    {
        type: 'plain-column',
        title: '영향요인 비교 (ColumnChart · plain)',
        description: '칸 상자 · 두께 24 막대 셋 · 두 줄짜리 항목 이름 자리를 대체합니다.',
        label: '영향요인 값을 불러오는 중입니다.',
    },
    {
        type: 'grouped-column',
        title: '최근 3개년 재무 현황 (GroupedColumnChart · cells)',
        description: '오른쪽 위 범례 · 항목 6칸 테두리 상자 · 칸마다 막대 3개 · 항목 이름 자리를 대체합니다.',
        label: '최근 3개년 재무 현황을 불러오는 중입니다.',
    },
    {
        type: 'triangle-radar',
        title: '세 축 레이더 (ComparisonRadarChart · 축 3개)',
        description: '범례 두 개 · 고리 4겹 삼각 격자 · 두 계열 면 · 위와 아래 양쪽 축 이름을 대체합니다.',
        label: '특허 평가등급을 불러오는 중입니다.',
    },
    {
        type: 'grade-trend',
        title: '등급 추이 (GradeTrendChart)',
        description: '세로축 등급 9단 · 4칸 × 8칸 점선 격자 · 꺾은선과 평가대상 점 · 두 줄 분기 이름을 대체합니다.',
        label: '등급 추이를 불러오는 중입니다.',
    },
    {
        type: 'positioning-scatter',
        title: '포지셔닝 산점도 (positioning-scatter)',
        description: '산점도 상자를 실제 그림과 같은 비율로 대체합니다.',
        label: '포지셔닝 맵을 불러오는 중입니다.',
    },
    {
        type: 'bar',
        title: '막대형 차트 공통 (bar)',
        description: '막대형 차트 전반에 쓰는 공통 유형입니다.',
        label: '막대형 재무 차트를 불러오는 중입니다.',
    },
    {
        type: 'line',
        title: '추이 차트 공통 (line)',
        description: '선형·영역형 추이 차트 전반에 쓰는 공통 유형입니다.',
        label: '추이 차트를 불러오는 중입니다.',
    },
    {
        type: 'word-cloud',
        title: 'R&D 이슈 워드클라우드 (WordCloud)',
        description: '중요도에 따라 크기가 다른 키워드 배치 영역을 대체합니다.',
        label: 'R&D 이슈 워드클라우드를 불러오는 중입니다.',
    },
]

const TYPE_UNION = [
    'network',
    'donut',
    'score-gauge',
    'score-ring',
    'grade-arc',
    'rank-pyramid',
    'gauge',
    'grade-distribution',
    'grade-trend',
    'grouped-column',
    'cells-line',
    'cells-column',
    'plain-column',
    'overlay-column',
    'columns-line',
    'matrix',
    'radar',
    'circle-radar',
    'triangle-radar',
    'pentagon-radar',
    'positioning-scatter',
    'bar',
    'line',
    'word-cloud',
]
    .map((type) => `'${type}'`)
    .join(' | ')

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'skeleton',
        cells: [
            '텍스트 · 이미지 같은 단순한 영역',
            <code key="component">Skeleton</code>,
            '크기를 className 으로 지정하는 shadcn 원본 플레이스홀더입니다. 로딩 안내 문구는 없습니다.',
        ],
    },
    {
        key: 'chart-skeleton',
        cells: [
            '차트 · 네트워크 · 표 영역',
            <code key="component">ChartSkeleton</code>,
            '실제 차트와 같은 구조로 자리를 잡고 로딩 상태를 스크린리더에 알립니다. 모양은 type 으로 고릅니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'Skeleton',
        'className · div props',
        '크기와 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    ['ChartSkeleton', 'type', '실제 차트 구조에 맞는 스켈레톤 유형입니다.', '-', TYPE_UNION],
    [
        'ChartSkeleton',
        'legend',
        'network 유형에서 함께 그릴 범례 구조입니다.',
        'undefined',
        "'company-relationship' | 'supply-network'",
    ],
    [
        'ChartSkeleton',
        'label',
        '로딩 상태를 스크린리더에 전하는 문구입니다.',
        '차트 데이터를 불러오는 중입니다.',
        'string',
    ],
    [
        'ChartSkeleton',
        'className · div props',
        '크기·배치와 네이티브 div 속성을 전달합니다. children 은 받지 않습니다.',
        'undefined',
        "Omit<ComponentProps<'div'>, 'children'>",
    ],
] as const

const SkeletonGuidePage = () => (
    <GuidePageShell
        title="스켈레톤 (Skeleton · ChartSkeleton)"
        description="로딩 중 자리를 잡는 플레이스홀더입니다. 단순 영역은 Skeleton, 차트 영역은 ChartSkeleton 을 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="skeleton-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="skeleton-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>Skeleton</code> 은 pulse 애니메이션이 붙은 빈 상자입니다. 크기와 모양은{' '}
                        <code>className</code> 으로 지정합니다. 로딩이 끝나면 같은 자리의 실제 콘텐츠로 교체합니다.
                    </p>
                </div>
                <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-6">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="skeleton-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        차트 모양은 <code>Skeleton</code> 의 variant 가 아니라 <code>ChartSkeleton</code> 의{' '}
                        <code>type</code> 으로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="Skeleton · ChartSkeleton 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-chart-types" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="skeleton-chart-types" className="typo-h4-bold">
                        차트 유형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 차트의 축·범례·보조 정보 자리를 잡고 화면 폭에 따라 크기와 배치가 바뀝니다. 비슷한 차트는
                        같은 <code>type</code> 을 공유하며, 유형별 스타일은 <code>chart-skeleton.variants.ts</code> 에서
                        관리합니다.
                    </p>
                </div>
                <CodeBlock code={CHART_TYPES_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    {CHART_SKELETON_EXAMPLES.map((example) => (
                        <div key={example.type} className="flex min-w-0 flex-col gap-4 py-8 last:pb-0">
                            <div className="flex flex-col gap-2">
                                <h3 className="typo-title-m-bold text-foreground">{example.title}</h3>
                                <p className="typo-body-l-regular text-label-foreground">{example.description}</p>
                            </div>
                            <div className="bg-card border-border min-w-0 overflow-hidden rounded-xl border p-4 sm:p-6">
                                <ChartSkeleton
                                    type={example.type}
                                    label={example.label}
                                    className={example.className}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-network" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="skeleton-network" className="typo-h4-bold">
                        네트워크 (legend)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>type=&quot;network&quot;</code> 에 <code>legend</code> 를 주면 범례까지 함께 대체합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">
                            연계기업 네트워크 (legend=&quot;company-relationship&quot;)
                        </h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            연계유형 · EW등급 범례와 그래프를 함께 대체합니다.
                        </p>
                        <div className="bg-card border-border overflow-hidden rounded-xl border p-4">
                            <ChartSkeleton
                                type="network"
                                legend="company-relationship"
                                label="연계기업 네트워크를 불러오는 중입니다."
                            />
                        </div>
                        <CodeBlock code={COMPANY_NETWORK_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">
                            공급망 네트워크 (legend=&quot;supply-network&quot;)
                        </h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            상태 범례 · 연결선 안내 · 읽는 방법과 그래프를 함께 대체합니다.
                        </p>
                        <div className="bg-card border-border overflow-hidden rounded-xl border p-4">
                            <ChartSkeleton
                                type="network"
                                legend="supply-network"
                                label="공급망 네트워크를 불러오는 중입니다."
                            />
                        </div>
                        <CodeBlock code={SUPPLY_NETWORK_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="skeleton-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ChartSkeleton</code> 은 로딩 상태 전달을 처리합니다. 사용처는 <code>label</code> 만 알맞게
                        씁니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>role=&quot;status&quot;</code> · <code>aria-live=&quot;polite&quot;</code> 영역에{' '}
                        <code>label</code> 문구를 스크린리더 전용으로 넣어 로딩을 알립니다[8.2.1].
                    </li>
                    <li>
                        장식 도형은 <code>aria-hidden</code> 으로 숨깁니다.
                    </li>
                    <li>
                        <code>label</code> 에는 &quot;재무비율진단을 불러오는 중입니다.&quot;처럼 대상을 포함합니다.
                        생략하면 &quot;차트 데이터를 불러오는 중입니다.&quot;가 쓰입니다.
                    </li>
                    <li>
                        <code>Skeleton</code> 은 안내 문구가 없으므로 단독으로 쓸 때는 주변 영역에{' '}
                        <code>aria-busy</code> 등으로 로딩을 알립니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="skeleton-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>ChartSkeleton</code> 은 <code>type</code> 만 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Skeleton · ChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SkeletonGuidePage
