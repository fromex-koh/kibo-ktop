import {cn} from '@/lib/utils'
import {
    chartSkeletonNetworkGraphicVariants,
    chartSkeletonNetworkLayoutClassName,
    chartSkeletonPartVariants,
    chartSkeletonVariants,
} from '@/components/theme/chart-skeleton.variants'

type ChartSkeletonType =
    'bar' | 'benchmark' | 'donut' | 'gauge' | 'line' | 'matrix' | 'network' | 'radar' | 'word-cloud'
type ChartSkeletonNetworkLegend = 'company-relationship' | 'supply-network'

type ChartSkeletonProps = Omit<React.ComponentProps<'div'>, 'children'> & {
    type: ChartSkeletonType
    legend?: ChartSkeletonNetworkLegend
    label?: string
}

const skeletonPartClassName = chartSkeletonPartVariants()
const matrixSkeletonRatedCellIndexes = new Set([8, 16, 21, 28, 33, 37])

const DonutChartSkeleton = () => (
    <div className="grid h-full min-h-0 items-center gap-6 lg:grid-cols-2">
        <div className="mx-auto aspect-square w-full max-w-80">
            <svg viewBox="0 0 100 100" className="text-muted size-full" aria-hidden="true">
                <circle cx="50" cy="50" r="23.5" fill="none" stroke="currentColor" strokeWidth="9" />
            </svg>
        </div>
        <div className="flex flex-col gap-3" aria-hidden="true">
            {Array.from({length: 5}, (_, index) => (
                <div key={index} className="flex min-w-0 items-center gap-2">
                    <div className={cn(skeletonPartClassName, 'size-2.5 rounded-full')} />
                    <div
                        className={cn(
                            skeletonPartClassName,
                            'h-4 min-w-0',
                            index % 2 === 0 ? 'w-24 sm:w-32' : 'w-20 sm:w-24',
                        )}
                    />
                    <div className={cn(skeletonPartClassName, 'ml-auto h-4 w-12 sm:w-16')} />
                </div>
            ))}
        </div>
    </div>
)

const BenchmarkChartSkeleton = () => (
    <div className="grid h-full min-h-0 items-center gap-8 lg:grid-cols-3">
        <div className="relative mx-auto aspect-square w-56 max-w-full">
            <svg
                viewBox="0 0 100 100"
                className="text-muted absolute inset-0 m-auto size-48 max-h-full max-w-full"
                aria-hidden="true"
            >
                <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="13" />
            </svg>
            <div
                className="absolute inset-0 m-auto flex size-28 flex-col items-center justify-center gap-2"
                aria-hidden="true"
            >
                <div className={cn(skeletonPartClassName, 'h-3 w-16 max-w-full')} />
                <div className={cn(skeletonPartClassName, 'h-9 w-20 max-w-full')} />
                <div className={cn(skeletonPartClassName, 'h-4 w-12 max-w-full')} />
            </div>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2" aria-hidden="true">
            <div className="bg-muted/50 border-muted flex flex-col gap-3 rounded-r-xl border-l-4 px-5 py-4">
                <div className={cn(skeletonPartClassName, 'h-4 w-full')} />
                <div className={cn(skeletonPartClassName, 'h-4 w-4/5')} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-4">
                    <div className={cn(skeletonPartClassName, 'h-4 w-32 sm:w-48')} />
                    <div className={cn(skeletonPartClassName, 'h-6 w-14 sm:w-20')} />
                </div>
                <div className={cn(skeletonPartClassName, 'h-3 w-full rounded-full')} />
                <div className="flex justify-between">
                    {Array.from({length: 5}, (_, index) => (
                        <div key={index} className={cn(skeletonPartClassName, 'h-3 w-8')} />
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const GaugeChartSkeleton = () => (
    <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center">
        <div className="relative h-52 w-88 max-w-full" aria-hidden="true">
            <svg viewBox="0 0 352 208" className="text-muted size-full overflow-visible">
                <path
                    d="M80 137 A96 96 0 0 1 272 137"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="22"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-x-0 top-18 flex flex-col items-center gap-1">
                <div className={cn(skeletonPartClassName, 'h-11 w-18')} />
                <div className={cn(skeletonPartClassName, 'h-4 w-24')} />
            </div>
        </div>
        <div className="-mt-8 grid grid-cols-2 gap-x-2 gap-y-2" aria-hidden="true">
            <div className={cn(skeletonPartClassName, 'h-4 w-14')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-24')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-14')} />
            <div className={cn(skeletonPartClassName, 'h-4 w-24')} />
        </div>
    </div>
)

const MatrixChartSkeleton = () => (
    <div className="flex h-full w-full min-w-0 items-center overflow-hidden" aria-hidden="true">
        <div className="bg-muted mx-auto grid w-full max-w-152 grid-cols-6 gap-px overflow-hidden rounded-lg p-px">
            {Array.from({length: 42}, (_, index) => (
                <div
                    key={index}
                    className={cn(
                        'bg-background flex h-11 min-w-0 items-center justify-center',
                        index === 0 && 'rounded-tl-md',
                        index === 5 && 'rounded-tr-md',
                        index === 36 && 'rounded-bl-md',
                        index === 41 && 'rounded-br-md',
                    )}
                >
                    {index < 6 || index % 6 === 0 ? (
                        <div
                            className={cn(
                                skeletonPartClassName,
                                'max-w-full',
                                index % 6 === 0 ? 'h-4 w-20' : 'h-4 w-10',
                            )}
                        />
                    ) : matrixSkeletonRatedCellIndexes.has(index) ? (
                        <div className={cn(skeletonPartClassName, 'size-6 rounded-full')} />
                    ) : null}
                </div>
            ))}
        </div>
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

const WordCloudSkeleton = () => (
    <div className="flex h-full items-center justify-center overflow-hidden p-3 sm:p-6" aria-hidden="true">
        <div className="flex w-full max-w-136 flex-col items-center gap-2 sm:gap-3">
            <div className="flex items-end justify-center gap-2 sm:gap-3">
                <div className={cn(chartSkeletonPartVariants({shape: 'small'}), 'h-4 w-12 sm:h-5 sm:w-20')} />
                <div className={cn(chartSkeletonPartVariants({shape: 'small'}), 'h-5 w-16 sm:h-6 sm:w-24')} />
                <div className={cn(chartSkeletonPartVariants({shape: 'small'}), 'h-4 w-10 sm:h-5 sm:w-16')} />
            </div>
            <div className="flex items-end justify-center gap-2 sm:gap-3">
                <div className={cn(chartSkeletonPartVariants(), 'h-8 w-18 sm:h-11 sm:w-28')} />
                <div className={cn(chartSkeletonPartVariants(), 'h-12 w-28 sm:h-18 sm:w-44')} />
                <div className={cn(chartSkeletonPartVariants(), 'h-9 w-20 sm:h-13 sm:w-32')} />
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className={cn(chartSkeletonPartVariants(), 'h-9 w-20 sm:h-13 sm:w-32')} />
                <div className={cn(chartSkeletonPartVariants({shape: 'large'}), 'h-14 w-36 sm:h-22 sm:w-56')} />
                <div className={cn(chartSkeletonPartVariants(), 'h-8 w-16 sm:h-11 sm:w-24')} />
            </div>
            <div className="flex items-start justify-center gap-2 sm:gap-3">
                <div className={cn(chartSkeletonPartVariants(), 'h-8 w-16 sm:h-11 sm:w-24')} />
                <div className={cn(chartSkeletonPartVariants(), 'h-10 w-28 sm:h-15 sm:w-44')} />
                <div className={cn(chartSkeletonPartVariants(), 'h-9 w-20 sm:h-13 sm:w-32')} />
            </div>
            <div className="flex items-start justify-center gap-2 sm:gap-3">
                <div className={cn(chartSkeletonPartVariants({shape: 'small'}), 'h-5 w-14 sm:h-6 sm:w-20')} />
                <div className={cn(chartSkeletonPartVariants({shape: 'small'}), 'h-4 w-10 sm:h-5 sm:w-16')} />
                <div className={cn(chartSkeletonPartVariants({shape: 'small'}), 'h-5 w-18 sm:h-6 sm:w-28')} />
            </div>
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
        case 'benchmark':
            return <BenchmarkChartSkeleton />
        case 'donut':
            return <DonutChartSkeleton />
        case 'gauge':
            return <GaugeChartSkeleton />
        case 'line':
            return <LineChartSkeleton />
        case 'matrix':
            return <MatrixChartSkeleton />
        case 'network':
            return <NetworkChartSkeleton legend={legend} />
        case 'radar':
            return <RadarChartSkeleton />
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
