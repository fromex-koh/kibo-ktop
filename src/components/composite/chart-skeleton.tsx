import {ARC_GAUGE_SIZES, arcGaugeTrackPath} from '@/components/custom/arc-gauge-shape'
import {RANK_PYRAMID_TIER_PATHS, RANK_PYRAMID_VIEW_BOX} from '@/components/custom/rank-pyramid-chart'
import {cn} from '@/lib/utils'
import {
    chartSkeletonNetworkGraphicVariants,
    chartSkeletonNetworkLayoutClassName,
    chartSkeletonPartVariants,
    chartSkeletonVariants,
} from '@/components/theme/chart-skeleton.variants'

type ChartSkeletonType =
    | 'bar'
    | 'cells-column'
    | 'cells-line'
    | 'circle-radar'
    | 'columns-line'
    | 'donut'
    | 'gauge'
    | 'grade-trend'
    | 'grouped-column'
    | 'line'
    | 'matrix'
    | 'network'
    | 'overlay-column'
    | 'radar'
    | 'rank-pyramid'
    | 'score-gauge'
    | 'triangle-radar'
    | 'word-cloud'
type ChartSkeletonNetworkLegend = 'company-relationship' | 'supply-network'

type ChartSkeletonProps = Omit<React.ComponentProps<'div'>, 'children'> & {
    type: ChartSkeletonType
    legend?: ChartSkeletonNetworkLegend
    label?: string
}

const skeletonPartClassName = chartSkeletonPartVariants()

// PercentageDonutChart 와 같은 짜임 — 지름 260 도넛(구멍 40%) · 간격 60 · 16 사각 칩 범례 8줄(간격 16).
// 좁은 폭에서는 범례가 도넛 아래로 내려간다. 링은 viewBox 100 기준 반지름 20~50(중심 35 · 굵기 30)이다.
const DONUT_SKELETON_LEGEND_COUNT = 8

// 실제 도넛처럼 칸 폭 384~511 에서는 도넛 208 · 간격 24 로 줄어 범례가 옆에 남는다(384 미만 · 512 이상은 260 · 60).
const DonutChartSkeleton = () => (
    <div className="@container h-full min-h-0">
        <div className="flex h-full min-h-0 flex-wrap items-center justify-center gap-x-15 gap-y-6 @sm:gap-x-6 @lg:gap-x-15">
            <div className="aspect-square w-full max-w-65 shrink-0 @sm:max-w-52 @lg:max-w-65">
                <svg viewBox="0 0 100 100" className="text-muted size-full" aria-hidden="true">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="30" />
                </svg>
            </div>
            <div className="flex max-w-max min-w-0 flex-1 basis-40 flex-col gap-4" aria-hidden="true">
                {Array.from({length: DONUT_SKELETON_LEGEND_COUNT}, (_, index) => (
                    <div key={index} className="typo-body-l-regular flex h-lh min-w-0 items-center gap-2">
                        <div className={cn(skeletonPartClassName, 'size-4 shrink-0 rounded-none')} />
                        <div className={cn(skeletonPartClassName, 'h-4 min-w-0', index % 2 === 0 ? 'w-43' : 'w-36')} />
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// ScoreGauge 와 같은 짜임 — ArcGauge(lg · 지름 320 · 굵기 46 · 위 208) 원호와 가운데 점수 · 상태 · 보조 줄.
const ScoreGaugeSkeleton = () => (
    <div className="mx-auto grid w-full max-w-80" aria-hidden="true">
        <svg viewBox="0 0 320 208" className="text-muted col-start-1 row-start-1 h-auto w-full">
            <path
                d={arcGaugeTrackPath('lg')}
                fill="none"
                stroke="currentColor"
                strokeWidth={ARC_GAUGE_SIZES.lg.stroke}
                strokeLinecap="round"
            />
        </svg>
        <div className="col-start-1 row-start-1 flex flex-col items-center justify-end gap-2 pb-3">
            <div className={cn(skeletonPartClassName, 'h-12 w-28')} />
            <div className={cn(skeletonPartClassName, 'h-6 w-12')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-32')} />
        </div>
    </div>
)

// RankPyramidChart 와 같은 짜임 — 왼쪽 글자 묶음(제목 · 상위 % · 집단 이름)과 4단 피라미드(폭 258 · 높이 220 · 한 삼각형 윤곽).
const RankPyramidSkeleton = () => (
    <div className="flex flex-wrap items-start gap-x-2 gap-y-4 pl-5" aria-hidden="true">
        <div className="flex shrink-0 flex-col gap-2 pt-8">
            <div className={cn(skeletonPartClassName, 'h-4 w-20')} />
            <div className={cn(skeletonPartClassName, 'h-10 w-32')} />
            <div className={cn(skeletonPartClassName, 'mt-1 h-4 w-36')} />
        </div>
        {/* 실제 차트와 같은 단 경로(모서리 둥글림 포함)를 그대로 쓴다. */}
        <svg viewBox={RANK_PYRAMID_VIEW_BOX} className="text-muted h-auto w-full max-w-80 min-w-0 flex-1 basis-60">
            {RANK_PYRAMID_TIER_PATHS.map((path) => (
                <path key={path} d={path} fill="currentColor" />
            ))}
        </svg>
    </div>
)

// SemicircleRatingGauge 와 같은 짜임 — ArcGauge(md · 지름 260 · 굵기 37 · 위 172) 원호, 가운데 등급 · 설명 줄,
// 아래 16 간격으로 날짜 목록 두 줄(간격 12).
const GaugeChartSkeleton = () => (
    <div className="mx-auto flex w-full flex-col gap-4" aria-hidden="true">
        <div className="mx-auto grid w-full max-w-65">
            <svg viewBox="0 0 260 172" className="text-muted col-start-1 row-start-1 h-auto w-full">
                <path
                    d={arcGaugeTrackPath('md')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={ARC_GAUGE_SIZES.md.stroke}
                    strokeLinecap="round"
                />
            </svg>
            <div className="col-start-1 row-start-1 flex flex-col items-center justify-end gap-2 pb-3">
                <div className={cn(skeletonPartClassName, 'h-12 w-12')} />
                <div className={cn(skeletonPartClassName, 'h-5 w-20')} />
            </div>
        </div>
        <div className="flex flex-col gap-3">
            {Array.from({length: 2}, (_, index) => (
                <div key={index} className="flex h-6 items-center justify-between gap-4">
                    <div className={cn(skeletonPartClassName, 'h-4 w-16')} />
                    <div className={cn(skeletonPartClassName, 'h-4 w-24')} />
                </div>
            ))}
        </div>
    </div>
)

// RatingMatrix 와 같은 짜임 — 항목 칸 100(모바일 80) + 등급 5칸, 머리 줄(37 = 줄 높이 21 + 위아래 8) · 항목 줄 5개(40),
// 줄마다 아래 선, 항목마다 한 칸에 지름 24 원.
const MATRIX_SKELETON_RATED_COLUMNS = [1, 2, 3, 4, 0] as const
const matrixSkeletonRowClassName =
    'border-subtle-3 grid grid-cols-[--spacing(20)_repeat(5,minmax(0,1fr))] items-center border-b md:grid-cols-[--spacing(25)_repeat(5,minmax(0,1fr))]'

const MatrixChartSkeleton = () => (
    <div className="w-full" aria-hidden="true">
        <div className={cn(matrixSkeletonRowClassName, 'typo-body-l-medium py-2')}>
            <span className="h-lh" />
            {Array.from({length: 5}, (_, index) => (
                <span key={index} className="flex h-lh items-center justify-center">
                    <span className={cn(skeletonPartClassName, 'h-4 w-6')} />
                </span>
            ))}
        </div>
        {MATRIX_SKELETON_RATED_COLUMNS.map((column, row) => (
            <div key={row} className={cn(matrixSkeletonRowClassName, 'py-2')}>
                <span className="flex justify-center">
                    <span className={cn(skeletonPartClassName, 'h-4 w-16 max-w-full')} />
                </span>
                {Array.from({length: 5}, (_, index) => (
                    <span key={index} className="flex h-6 justify-center">
                        {index === column ? (
                            <span className={cn(skeletonPartClassName, 'size-6 rounded-full')} />
                        ) : null}
                    </span>
                ))}
            </div>
        ))}
    </div>
)

const RadarChartSkeleton = () => (
    <div className="flex h-full min-h-0 items-center justify-center">
        <div className="relative aspect-square w-64 max-w-full sm:w-80 lg:w-96" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="text-muted size-full p-8">
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="50,8 86,29 86,71 50,92 14,71 14,29" />
                    <polygon points="50,24 72,37 72,63 50,76 28,63 28,37" />
                    <path d="M50 50V8M50 50 86 29M50 50 86 71M50 50V92M50 50 14 71M50 50 14 29" />
                </g>
                <polygon points="50,20 75,35 68,68 50,78 25,65 30,38" fill="currentColor" opacity="0.6" />
            </svg>
            <div className={cn(skeletonPartClassName, 'absolute top-5 left-1/2 h-3 w-14 -translate-x-1/2')} />
            <div className={cn(skeletonPartClassName, 'absolute top-1/4 right-2 h-3 w-12')} />
            <div className={cn(skeletonPartClassName, 'absolute right-2 bottom-1/4 h-3 w-16')} />
            <div className={cn(skeletonPartClassName, 'absolute bottom-5 left-1/2 h-3 w-14 -translate-x-1/2')} />
            <div className={cn(skeletonPartClassName, 'absolute bottom-1/4 left-2 h-3 w-12')} />
            <div className={cn(skeletonPartClassName, 'absolute top-1/4 left-2 h-3 w-16')} />
        </div>
    </div>
)

// 동심원 레이더(ComparisonRadarChart gridType="circle") — K-BIGx 보고서 부문별 비교와 같은 짜임이다.
// 칸 334×248 · 가운데 반지름 96 원 4고리 · 다섯 축 선 · 가운데 면 · 축 이름 다섯(위 · 오른쪽 · 오른쪽 아래 · 왼쪽 아래 · 왼쪽).
const CircleRadarChartSkeleton = () => (
    <div className="flex h-full min-h-0 items-center justify-center" aria-hidden="true">
        <div className="relative h-full w-full max-w-84">
            <svg viewBox="0 0 334 248" className="text-muted block size-full">
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="167" cy="134" r="96" />
                    <circle cx="167" cy="134" r="72" />
                    <circle cx="167" cy="134" r="48" />
                    <circle cx="167" cy="134" r="24" />
                    <path d="M167 134V38M167 134 258 104M167 134 223 212M167 134 111 212M167 134 76 104" />
                </g>
                <polygon points="167,60 231,113 212,196 122,196 103,113" fill="currentColor" opacity="0.6" />
            </svg>
            <div className={cn(skeletonPartClassName, 'absolute top-2 left-1/2 h-3 w-18 -translate-x-1/2')} />
            <div className={cn(skeletonPartClassName, 'absolute top-24 right-0 h-3 w-15')} />
            <div className={cn(skeletonPartClassName, 'absolute right-4 bottom-2 h-3 w-18')} />
            <div className={cn(skeletonPartClassName, 'absolute bottom-2 left-4 h-3 w-18')} />
            <div className={cn(skeletonPartClassName, 'absolute top-24 left-0 h-3 w-12')} />
        </div>
    </div>
)

// 세 축 레이더(ComparisonRadarChart 에 축이 셋일 때) — 특허 등급조회 '특허 평가등급' 레이더와 같은 짜임이다.
// 오른쪽 위 범례 두 개(16 견본 + 이름) · 고리 4겹 삼각 격자와 가운데서 뻗는 축 선 · 평균 면과 평가대상 면 · 꼭짓점 점 셋 ·
// 축 이름 셋(위 가운데 · 왼쪽 아래 꼭짓점의 왼쪽 · 오른쪽 아래 꼭짓점의 오른쪽).
// 삼각형은 실제 레이더 크기를 따른다 — PC(md 이상) 폭 192 × 높이 166, 좁은 화면 폭 104.
const TriangleRadarChartSkeleton = () => (
    <div className="flex h-full min-h-0 flex-col gap-4" aria-hidden="true">
        <div className="flex justify-end gap-6">
            <div className="flex items-center gap-2">
                <div className={cn(skeletonPartClassName, 'size-4 rounded-none')} />
                <div className={cn(skeletonPartClassName, 'h-3 w-16')} />
            </div>
            <div className="flex items-center gap-2">
                <div className={cn(skeletonPartClassName, 'size-4 rounded-none')} />
                <div className={cn(skeletonPartClassName, 'h-3 w-24')} />
            </div>
        </div>
        <div className="flex min-h-0 flex-1 items-end justify-center pb-4">
            <div className="relative w-26 md:w-48">
                <svg viewBox="0 0 192 166" className="text-muted block h-auto w-full">
                    <g fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="96,1 191,165 1,165" />
                        <polygon points="96,29 167,151 25,151" />
                        <polygon points="96,56 143,137 49,137" />
                        <polygon points="96,84 120,124 72,124" />
                        <path d="M96 111V1M96 111 191 165M96 111 1 165" />
                    </g>
                    <polygon points="96,40 150,141 42,141" fill="currentColor" opacity="0.4" />
                    <polygon points="96,62 168,151 36,146" fill="currentColor" opacity="0.7" />
                    <g fill="currentColor">
                        <circle cx="96" cy="62" r="5" />
                        <circle cx="168" cy="151" r="5" />
                        <circle cx="36" cy="146" r="5" />
                    </g>
                </svg>
                <div
                    className={cn(
                        skeletonPartClassName,
                        'absolute bottom-full left-1/2 mb-2 h-3 w-16 -translate-x-1/2',
                    )}
                />
                <div
                    className={cn(skeletonPartClassName, 'absolute right-full bottom-0 mr-2 h-3 w-16 translate-y-1/2')}
                />
                <div
                    className={cn(skeletonPartClassName, 'absolute bottom-0 left-full ml-2 h-3 w-20 translate-y-1/2')}
                />
            </div>
        </div>
    </div>
)

const ChartGridSkeleton = ({children}: {children: React.ReactNode}) => (
    <div className="flex h-full min-w-0 flex-col gap-3 sm:gap-4" aria-hidden="true">
        <div className="flex min-h-0 flex-1 gap-2 sm:gap-3">
            <div className="flex w-8 shrink-0 flex-col justify-between py-1 sm:w-12">
                {Array.from({length: 5}, (_, index) => (
                    <div key={index} className={cn(skeletonPartClassName, 'h-3 w-6 sm:w-8')} />
                ))}
            </div>
            <div className="border-muted relative min-w-0 flex-1 border-b border-l">
                {Array.from({length: 4}, (_, index) => (
                    <div
                        key={index}
                        className="border-muted absolute inset-x-0 border-t"
                        style={{top: `${index * 25}%`}}
                    />
                ))}
                {children}
            </div>
        </div>
        <div className="flex justify-center gap-2 sm:gap-6">
            <div className={cn(skeletonPartClassName, 'h-4 w-14 sm:w-20')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-14 sm:w-20')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-14 sm:w-20')} />
        </div>
    </div>
)

// GroupedColumnChart variant="cells"(K-BIGx 보고서 최근 3개년 재무 현황)와 같은 짜임 —
// 오른쪽 위 범례 3개(16 견본 + 이름) → 간격 24 → 항목 6칸 테두리 상자(높이 240) 안에 칸마다 막대 3개(두께 12 · 간격 20)
// → 칸 아래 항목 이름 자리(32). 전체 높이가 실제 그래프(21 + 24 + 272)와 같아 불러온 뒤 자리가 흔들리지 않는다.
// 좁은 화면에서는 실제 그래프처럼 폭 576 을 지키고 넘치는 부분은 가린다(실제는 가로 스크롤).
const GROUPED_COLUMN_SKELETON_BARS = [
    [48, 70, 78],
    [22, 21, 22],
    [27, 50, 56],
    [68, 75, 76],
    [5, 3, 4],
    [4, 3, 2],
] as const
const GROUPED_COLUMN_SKELETON_LEGEND_COUNT = 3

const GroupedColumnChartSkeleton = () => (
    <div className="flex flex-col gap-6" aria-hidden="true">
        <div className="typo-body-l-regular flex flex-wrap justify-end gap-x-6 gap-y-2">
            {Array.from({length: GROUPED_COLUMN_SKELETON_LEGEND_COUNT}, (_, index) => (
                <div key={index} className="flex h-lh items-center gap-2">
                    <div className={cn(skeletonPartClassName, 'size-4 rounded-none')} />
                    <div className={cn(skeletonPartClassName, 'h-3 w-11')} />
                </div>
            ))}
        </div>
        <div className="overflow-hidden">
            <div className="min-w-144">
                {/* 위 선 없이 바닥 · 양 끝은 실선, 항목 사이는 점선(실제 그래프와 같다). */}
                <div className="border-subtle-3 divide-subtle-3 grid h-60 grid-cols-6 divide-x divide-dashed border-x border-b">
                    {GROUPED_COLUMN_SKELETON_BARS.map((heights, index) => (
                        <div key={index} className="flex items-end justify-center gap-5">
                            {heights.map((height, barIndex) => (
                                <div
                                    key={barIndex}
                                    className={cn(skeletonPartClassName, 'w-3 rounded-t-full rounded-b-none')}
                                    style={{height: `${height}%`}}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="grid h-8 grid-cols-6 pt-2">
                    {GROUPED_COLUMN_SKELETON_BARS.map((_, index) => (
                        <div key={index} className="flex justify-center">
                            <div className={cn(skeletonPartClassName, 'h-3 w-10')} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

// OverlayColumnChart 와 같은 짜임 — 오른쪽 위 범례 3개 → 8 → 높이 200 칸 상자(위 선 없음 · 바닥 · 양 끝 실선 · 사이 점선) 안에
// 칸마다 넓고 옅은 기준 막대(96) + 그 앞 좁은 막대 둘(24) → 항목 이름 자리(28).
const OVERLAY_COLUMN_SKELETON_BARS = [
    {base: 70, series: [30, 40]},
    {base: 76, series: [34, 44]},
    {base: 78, series: [36, 46]},
] as const

const OverlayColumnChartSkeleton = () => (
    <div className="flex flex-col gap-2" aria-hidden="true">
        <div className="typo-body-l-regular flex flex-wrap justify-end gap-x-6 gap-y-2">
            {OVERLAY_COLUMN_SKELETON_BARS.map((_, index) => (
                <div key={index} className="flex h-lh items-center gap-2">
                    <div className={cn(skeletonPartClassName, 'size-4 rounded-none')} />
                    <div className={cn(skeletonPartClassName, 'h-3 w-11')} />
                </div>
            ))}
        </div>
        <div className="border-subtle-3 divide-subtle-3 grid h-50 grid-cols-3 divide-x divide-dashed border-x border-b">
            {OVERLAY_COLUMN_SKELETON_BARS.map((bar, index) => (
                <div key={index} className="flex items-end justify-center">
                    {/* 기준 막대(옅게) 안에 앞 막대 둘을 세운다 — 실제처럼 겹친 모양. */}
                    <div
                        className={cn(
                            skeletonPartClassName,
                            'flex w-24 items-end justify-center gap-4 rounded-t-sm rounded-b-none opacity-50',
                        )}
                        style={{height: `${bar.base}%`}}
                    >
                        {bar.series.map((height, seriesIndex) => (
                            <div
                                key={seriesIndex}
                                className={cn(skeletonPartClassName, 'w-6 rounded-t-sm rounded-b-none')}
                                style={{height: `${(height / bar.base) * 100}%`}}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="grid h-6.5 grid-cols-3 pt-2">
            {OVERLAY_COLUMN_SKELETON_BARS.map((_, index) => (
                <div key={index} className="flex justify-center">
                    <div className={cn(skeletonPartClassName, 'h-3 w-10')} />
                </div>
            ))}
        </div>
    </div>
)

// LineChart appearance="columns" 와 같은 짜임 — 높이 200 칸 상자(바닥 · 양 끝 실선 · 사이 점선)에 칸 가운데를 잇는 선 셋
// → 항목 이름 자리(28) → 8 → 아래 범례(16 견본 + 이름, 줄바꿈).
const COLUMNS_LINE_SKELETON_LINES = ['17,20 50,14 83,20', '17,45 50,38 83,52', '17,78 50,88 83,72'] as const
const COLUMNS_LINE_SKELETON_LEGEND_COUNT = 5

const ColumnsLineChartSkeleton = () => (
    <div className="flex flex-col gap-2" aria-hidden="true">
        <div>
            <div className="border-subtle-3 divide-subtle-3 relative grid h-50 grid-cols-3 divide-x divide-dashed border-x border-b">
                {Array.from({length: 3}, (_, index) => (
                    <div key={index} />
                ))}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="text-muted absolute inset-0 size-full">
                    {COLUMNS_LINE_SKELETON_LINES.map((points) => (
                        <polyline
                            key={points}
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
            </div>
            <div className="grid h-6.5 grid-cols-3 pt-2">
                {Array.from({length: 3}, (_, index) => (
                    <div key={index} className="flex justify-center">
                        <div className={cn(skeletonPartClassName, 'h-3 w-10')} />
                    </div>
                ))}
            </div>
        </div>
        <div className="typo-body-l-regular flex flex-wrap gap-x-6 gap-y-2">
            {Array.from({length: COLUMNS_LINE_SKELETON_LEGEND_COUNT}, (_, index) => (
                <div key={index} className="flex h-lh items-center gap-2">
                    <div className={cn(skeletonPartClassName, 'size-4 rounded-none')} />
                    <div className={cn(skeletonPartClassName, 'h-3', index % 2 === 0 ? 'w-16' : 'w-20')} />
                </div>
            ))}
        </div>
    </div>
)

// ColumnChart variant="cells"(K-BIGx 보고서 인당 매출액)와 같은 짜임 — 높이 200 칸 상자(위 선 없음 · 바닥 · 양 끝 실선 ·
// 항목 사이 점선) 안에 칸마다 가운데 막대(두께 48 · 위 모서리 둥근) → 칸 아래 항목 이름 자리(26). 전체 226 로 실제와 같다.
const CELLS_COLUMN_SKELETON_BARS = [76, 73, 78] as const

const CellsColumnChartSkeleton = () => (
    <div aria-hidden="true">
        <div className="border-subtle-3 divide-subtle-3 grid h-50 grid-cols-3 divide-x divide-dashed border-x border-b">
            {CELLS_COLUMN_SKELETON_BARS.map((height, index) => (
                <div key={index} className="flex items-end justify-center">
                    <div
                        className={cn(skeletonPartClassName, 'w-12 rounded-t-sm rounded-b-none')}
                        style={{height: `${height}%`}}
                    />
                </div>
            ))}
        </div>
        <div className="grid h-6.5 grid-cols-3 pt-2">
            {CELLS_COLUMN_SKELETON_BARS.map((_, index) => (
                <div key={index} className="flex justify-center">
                    <div className={cn(skeletonPartClassName, 'h-3 w-10')} />
                </div>
            ))}
        </div>
    </div>
)

// LineChart appearance="cells"(K-BIGx 보고서 분기별 종업원수)와 같은 짜임 — 높이 200 자리에 점마다 세로 점선 · 바닥 실선,
// 양 끝 점은 가장자리에서 24 안쪽 → 가운데를 지나는 선과 아래로 옅어지는 면 → 항목 이름 자리(26). 전체 226.
// 좁은 화면에서는 실제 그래프처럼 폭 576 을 지키고 넘치는 부분은 가린다(실제는 가로 스크롤).
const CELLS_LINE_SKELETON_POINTS = [58, 73, 73, 99, 104, 104, 149, 131, 182, 173, 160] as const
const CELLS_LINE_SKELETON_VIEW_HEIGHT = 200

const CellsLineChartSkeleton = () => {
    const lastIndex = CELLS_LINE_SKELETON_POINTS.length - 1
    // 가로는 0~100 으로 두고(늘여 그림) 양 끝 점을 가장자리 안쪽에 둔다 — 세로 점선 자리(px-6)와 같은 비율은 아니지만
    // 선은 흐름만 보이는 자리라 충분하다.
    const points = CELLS_LINE_SKELETON_POINTS.map((y, index) => `${3 + (94 * index) / lastIndex},${y}`).join(' ')

    return (
        <div className="overflow-hidden" aria-hidden="true">
            <div className="min-w-144">
                <div className="border-subtle-3 relative h-50 border-b">
                    <div className="absolute inset-0 flex justify-between px-6">
                        {CELLS_LINE_SKELETON_POINTS.map((_, index) => (
                            <div key={index} className="border-subtle-3 h-full border-l border-dashed" />
                        ))}
                    </div>
                    <svg
                        viewBox={`0 0 100 ${CELLS_LINE_SKELETON_VIEW_HEIGHT}`}
                        preserveAspectRatio="none"
                        className="text-muted absolute inset-0 size-full"
                    >
                        <polygon
                            points={`3,${CELLS_LINE_SKELETON_VIEW_HEIGHT} ${points} 97,${CELLS_LINE_SKELETON_VIEW_HEIGHT}`}
                            fill="currentColor"
                            opacity="0.5"
                        />
                        <polyline
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
                <div className="flex h-6.5 justify-between px-2 pt-2">
                    {CELLS_LINE_SKELETON_POINTS.map((_, index) => (
                        <div key={index} className={cn(skeletonPartClassName, 'h-3 w-10')} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const BarChartSkeleton = () => (
    <ChartGridSkeleton>
        <div className="absolute inset-0 flex items-end justify-around gap-1 px-1 sm:gap-2 sm:px-4 lg:gap-3 lg:px-6">
            {[58, 82, 68, 46, 72, 88, 62, 76].map((height, index) => (
                <div
                    key={index}
                    className={cn(chartSkeletonPartVariants({shape: 'top'}), 'w-3 sm:w-6 lg:w-8')}
                    style={{height: `${height}%`}}
                />
            ))}
        </div>
    </ChartGridSkeleton>
)

const LineChartSkeleton = () => (
    <ChartGridSkeleton>
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="text-muted pointer-events-none absolute inset-0 size-full"
            aria-hidden="true"
        >
            <polyline
                points="2,72 20,55 40,66 60,32 80,42 98,18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
        {[
            [2, 72],
            [20, 55],
            [40, 66],
            [60, 32],
            [80, 42],
            [98, 18],
        ].map(([left, top]) => (
            <span
                key={`${left}-${top}`}
                className={cn(
                    chartSkeletonPartVariants({shape: 'circle'}),
                    'absolute size-2 -translate-x-1/2 -translate-y-1/2 sm:size-3',
                )}
                style={{left: `${left}%`, top: `${top}%`}}
            />
        ))}
    </ChartGridSkeleton>
)

// 등급 추이(GradeTrendChart) — 세로축 등급 9단 · 4칸 × 8칸 점선 격자 · 꺾은선과 평가대상 점 · 두 줄 분기 이름.
// 실제 차트와 같은 높이(h-72)와 격자 짜임을 두어 불러온 뒤 자리가 흔들리지 않게 한다.
const GRADE_TREND_SKELETON_POINTS = [
    [12.5, 62.5],
    [37.5, 62.5],
    [62.5, 50],
    [87.5, 50],
] as const
// 평가대상 점 — 마지막 분기에서 꺾은선보다 한 칸 아래에 선다(기술다양성 계열 자리).
const GRADE_TREND_SKELETON_TARGET = [87.5, 62.5] as const

const GradeTrendChartSkeleton = () => (
    <div className="flex h-full min-w-0 flex-col gap-3" aria-hidden="true">
        <div className="flex min-h-0 flex-1 gap-2">
            <div className="flex w-6 shrink-0 flex-col justify-between">
                {Array.from({length: 9}, (_, index) => (
                    <div key={index} className={cn(skeletonPartClassName, 'h-2.5 w-5')} />
                ))}
            </div>
            <div className="border-muted relative grid min-w-0 flex-1 grid-cols-4 grid-rows-8 border">
                {Array.from({length: 32}, (_, index) => (
                    <div
                        key={index}
                        className={cn(
                            'border-muted border-dashed',
                            index % 4 !== 3 && 'border-r',
                            index < 28 && 'border-b',
                        )}
                    />
                ))}
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="text-muted pointer-events-none absolute inset-0 size-full"
                >
                    <polyline
                        points={GRADE_TREND_SKELETON_POINTS.map(([x, y]) => `${x},${y}`).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
                {/* 점은 SVG 가 아니라 원형 칸으로 둔다 — 늘어나는 SVG 좌표(preserveAspectRatio="none") 안에서는
                    원이 격자 비율대로 찌그러져 타원이 된다. 선 스켈레톤(LineChartSkeleton)과 같은 방식이다. */}
                {[...GRADE_TREND_SKELETON_POINTS, GRADE_TREND_SKELETON_TARGET].map(([left, top], index) => (
                    <span
                        key={`${left}-${top}`}
                        className={cn(
                            chartSkeletonPartVariants({shape: 'circle'}),
                            'absolute size-3 -translate-x-1/2 -translate-y-1/2',
                            index === GRADE_TREND_SKELETON_POINTS.length && 'opacity-60',
                        )}
                        style={{left: `${left}%`, top: `${top}%`}}
                    />
                ))}
            </div>
        </div>
        <div className="ms-8 grid grid-cols-4 justify-items-center">
            {Array.from({length: 4}, (_, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                    <div className={cn(skeletonPartClassName, 'h-3 w-8')} />
                    <div className={cn(skeletonPartClassName, 'h-3 w-6')} />
                </div>
            ))}
        </div>
    </div>
)

// WordCloud 와 같은 짜임 — 영역을 가로로 넓게 채우고, 가운데 가장 큰 단어(높이의 약 1/3)를 중간 · 작은 단어가 둘러싼다.
// 줄 높이 합이 약 190 이라 R&D 이슈 카드(216)에도 잘리지 않고 들어간다.
const WORD_CLOUD_SKELETON_ROWS = [
    ['h-4 w-10 sm:w-16', 'h-4 w-8 sm:w-12'],
    ['h-8 w-16 sm:h-10 sm:w-32', 'h-8 w-16 sm:h-10 sm:w-28', 'h-10 w-18 sm:h-12 sm:w-28'],
    ['h-5 w-10 sm:h-6 sm:w-14', 'h-12 w-32 sm:h-14 sm:w-60', 'h-5 w-10 sm:h-6 sm:w-14'],
    ['h-5 w-10 sm:h-6 sm:w-12', 'h-8 w-24 sm:h-10 sm:w-44', 'h-8 w-14 sm:h-10 sm:w-24'],
    ['h-4 w-10 sm:w-12', 'h-4 w-8 sm:w-10', 'h-4 w-12 sm:w-16'],
] as const

const WordCloudSkeleton = () => (
    <div className="flex h-full items-center justify-center overflow-hidden" aria-hidden="true">
        <div className="flex w-full flex-col items-center gap-2">
            {WORD_CLOUD_SKELETON_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex max-w-full items-center justify-center gap-2 sm:gap-3">
                    {row.map((sizeClassName, index) => (
                        <div
                            key={index}
                            className={cn(chartSkeletonPartVariants({shape: 'small'}), 'min-w-0 shrink', sizeClassName)}
                        />
                    ))}
                </div>
            ))}
        </div>
    </div>
)

const CompanyRelationshipLegendSkeleton = () => (
    <aside className="grid min-w-0 gap-8 sm:grid-cols-2" aria-hidden="true">
        <div className="flex flex-col gap-3">
            <div className={cn(skeletonPartClassName, 'h-5 w-20')} />
            <div className="flex flex-col gap-2">
                {Array.from({length: 10}, (_, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={cn(skeletonPartClassName, 'h-5 w-8 shrink-0')} />
                        <div className={cn(skeletonPartClassName, 'h-4', index % 3 === 0 ? 'w-24' : 'w-20')} />
                    </div>
                ))}
            </div>
        </div>
        <div className="flex flex-col gap-3">
            <div className={cn(skeletonPartClassName, 'h-5 w-16')} />
            <div className="flex flex-col gap-2">
                {Array.from({length: 8}, (_, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={cn(skeletonPartClassName, 'size-3 shrink-0 rounded-full')} />
                        <div className={cn(skeletonPartClassName, 'h-4', index === 7 ? 'w-24' : 'w-14')} />
                    </div>
                ))}
            </div>
        </div>
        <div className="border-border flex gap-3 rounded-md border border-dashed p-3 sm:col-span-2 sm:gap-6 lg:col-span-1 xl:col-span-2">
            <div className={cn(skeletonPartClassName, 'h-4 w-24 sm:w-28')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-20 sm:w-24')} />
        </div>
    </aside>
)

const SupplyNetworkLegendSkeleton = () => (
    <aside className="flex flex-col gap-6" aria-hidden="true">
        <div className="flex flex-col gap-3">
            <div className={cn(skeletonPartClassName, 'h-5 w-20')} />
            {Array.from({length: 4}, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <div className={cn(skeletonPartClassName, 'size-3 shrink-0 rounded-full')} />
                    <div className={cn(skeletonPartClassName, 'h-4 w-12')} />
                    <div className={cn(skeletonPartClassName, 'ml-auto h-4 w-6')} />
                </div>
            ))}
        </div>
        <div className="border-border flex flex-col gap-3 rounded-md border border-dashed p-3">
            <div className={cn(skeletonPartClassName, 'h-4 w-32')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-28')} />
        </div>
        <div className="bg-muted/50 flex flex-col gap-3 rounded-xl p-4">
            <div className={cn(skeletonPartClassName, 'h-5 w-20')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-full')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-4/5')} />
        </div>
    </aside>
)

const NetworkGraphicSkeleton = ({className}: {className?: string}) => (
    <div
        aria-hidden="true"
        className={cn(
            'bg-muted/30 flex h-full w-full min-w-0 items-center justify-center overflow-hidden rounded-lg p-3 sm:p-5',
            className,
        )}
    >
        <div className="flex size-full min-h-0 min-w-0 items-center justify-center">
            <svg
                viewBox="0 0 100 100"
                className="text-muted aspect-square size-auto max-h-full max-w-full"
                data-slot="skeleton-part"
            >
                <g fill="currentColor" stroke="currentColor" strokeWidth="1.75" vectorEffect="non-scaling-stroke">
                    <g fill="none">
                        <path d="M50 50 50 10" />
                        <path d="M50 50 81.273259 25.060408" />
                        <path d="M50 50 88.997117 58.900837" />
                        <path d="M50 50 67.35535 86.038755" />
                        <path d="M50 50 32.64465 86.038755" />
                        <path d="M50 50 11.002883 58.900837" />
                        <path d="M50 50 18.726741 25.060408" />
                    </g>
                    <circle cx="50" cy="50" r="8.25" stroke="none" />
                    <circle cx="50" cy="10" r="5.75" stroke="none" />
                    <circle cx="81.273259" cy="25.060408" r="5.75" stroke="none" />
                    <circle cx="88.997117" cy="58.900837" r="5.75" stroke="none" />
                    <circle cx="67.35535" cy="86.038755" r="5.75" stroke="none" />
                    <circle cx="32.64465" cy="86.038755" r="5.75" stroke="none" />
                    <circle cx="11.002883" cy="58.900837" r="5.75" stroke="none" />
                    <circle cx="18.726741" cy="25.060408" r="5.75" stroke="none" />
                </g>
            </svg>
        </div>
    </div>
)

const NetworkChartSkeleton = ({legend}: {legend?: ChartSkeletonNetworkLegend}) => {
    if (!legend) return <NetworkGraphicSkeleton />

    return (
        <div className={chartSkeletonNetworkLayoutClassName}>
            {legend === 'company-relationship' ? (
                <CompanyRelationshipLegendSkeleton />
            ) : (
                <SupplyNetworkLegendSkeleton />
            )}
            <NetworkGraphicSkeleton className={chartSkeletonNetworkGraphicVariants({legend})} />
        </div>
    )
}

const renderChartSkeleton = (type: ChartSkeletonType, legend?: ChartSkeletonNetworkLegend) => {
    switch (type) {
        case 'bar':
            return <BarChartSkeleton />
        case 'donut':
            return <DonutChartSkeleton />
        case 'gauge':
            return <GaugeChartSkeleton />
        case 'overlay-column':
            return <OverlayColumnChartSkeleton />
        case 'columns-line':
            return <ColumnsLineChartSkeleton />
        case 'cells-column':
            return <CellsColumnChartSkeleton />
        case 'cells-line':
            return <CellsLineChartSkeleton />
        case 'grouped-column':
            return <GroupedColumnChartSkeleton />
        case 'grade-trend':
            return <GradeTrendChartSkeleton />
        case 'line':
            return <LineChartSkeleton />
        case 'matrix':
            return <MatrixChartSkeleton />
        case 'network':
            return <NetworkChartSkeleton legend={legend} />
        case 'triangle-radar':
            return <TriangleRadarChartSkeleton />
        case 'radar':
            return <RadarChartSkeleton />
        case 'circle-radar':
            return <CircleRadarChartSkeleton />
        case 'rank-pyramid':
            return <RankPyramidSkeleton />
        case 'score-gauge':
            return <ScoreGaugeSkeleton />
        case 'word-cloud':
            return <WordCloudSkeleton />
    }
}

function ChartSkeleton({className, type, legend, label, ...props}: ChartSkeletonProps) {
    const statusLabel = label ?? '차트 데이터를 불러오는 중입니다.'
    return (
        <div
            {...props}
            role="status"
            aria-live="polite"
            data-slot="chart-skeleton"
            data-type={type}
            data-legend={legend}
            className={cn(chartSkeletonVariants({type, legend}), className)}
        >
            {renderChartSkeleton(type, legend)}
            <span className="sr-only">{statusLabel}</span>
        </div>
    )
}

export {ChartSkeleton}
export type {ChartSkeletonNetworkLegend, ChartSkeletonProps, ChartSkeletonType}
