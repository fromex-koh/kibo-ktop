// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Skeleton} from '@/components/ui/skeleton'

export const metadata: Metadata = {title: '스켈레톤 (Skeleton)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const BASIC_CODE = `import {Skeleton} from '@/components/ui/skeleton'

<Skeleton className="h-6 w-48" />`

const CHART_LOADING_CODE = `// 차트를 그리는 중 — 차트 문서의 로딩 섹션대로 쓴다. 차트마다 둘 중 하나다.
<ComparisonRadarChart data={data} isLoading={isLoading} />  // isLoading 을 받는 차트
{isLoading ? <ValueColumnChartSkeleton /> : <ValueColumnChart data={data} />}  // 전용 스켈레톤이 있는 차트

// 차트 자체를 아직 그리지 않는 자리 — 데이터가 오기 전 보고서 구획 등
import {ChartSkeleton} from '@/components/composite/chart-skeleton'

<ChartSkeleton type="overlay-column" label="재무상태를 불러오는 중입니다." />`

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
        key: 'chart',
        cells: [
            '차트를 그리는 중',
            <span key="component">
                <code>isLoading</code> 또는 <code>…ChartSkeleton</code>
            </span>,
            '차트마다 isLoading 을 받거나 전용 스켈레톤 컴포넌트를 둡니다. 어느 쪽인지와 모양은 각 차트 문서의 로딩 섹션에서 봅니다.',
        ],
    },
    {
        key: 'chart-skeleton',
        cells: [
            '차트를 아직 그리지 않는 자리',
            <code key="component">ChartSkeleton</code>,
            '데이터가 오기 전에 차트 컴포넌트 없이 자리만 잡을 때 직접 씁니다. 모양은 type 으로 고릅니다.',
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
        title="스켈레톤 (Skeleton)"
        description="로딩 중 자리를 잡는 플레이스홀더입니다. 단순 영역은 Skeleton, 차트는 각 차트 문서의 로딩 방법을 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="skeleton-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                    <h2 id="skeleton-choice" className="typo-h4-bold">
                        무엇을 쓸까
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        스켈레톤 대신 안내 문구로 기다림을 알리려면{' '}
                        <Link href="/component-guide/loading-state" className={LINK_CLASS}>
                            LoadingState
                        </Link>{' '}
                        를 씁니다.
                    </p>
                </div>
                <Table caption="스켈레톤 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="skeleton-chart" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="skeleton-chart" className="typo-h4-bold">
                        차트 로딩
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        차트 스켈레톤은 축 · 범례 · 보조 정보 자리까지 실제 차트 모양대로 비워 둡니다. 차트마다{' '}
                        <code>isLoading</code> 을 받거나 전용 스켈레톤(<code>ValueColumnChartSkeleton</code> 등)을 두며,
                        쓰는 법과 모양은 각 차트 문서의 로딩 섹션에서 보여 줍니다(예:{' '}
                        <Link href="/component-guide/value-column-chart" className={LINK_CLASS}>
                            ValueColumnChart
                        </Link>
                        ). 차트 컴포넌트를 아직 그리지 않는 자리만 <code>ChartSkeleton</code> 을 직접 쓰고, 그 차트와
                        같은 <code>type</code> 을 고릅니다.
                    </p>
                </div>
                <div className="bg-card border-border min-w-0 overflow-hidden rounded-xl border p-4 sm:p-6">
                    <ChartSkeleton type="overlay-column" label="재무상태를 불러오는 중입니다." />
                </div>
                <CodeBlock code={CHART_LOADING_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="skeleton-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
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
