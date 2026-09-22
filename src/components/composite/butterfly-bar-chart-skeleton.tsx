import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// ButterflyBarChart 와 같은 짜임 — 머리 줄(양쪽 제목 · 가운데 칸 쪽에 붙음) → 16 → 높이 24 막대 줄(줄 사이 16).
// 가운데 칸 폭 120 에 항목 이름 자리, 쪽마다 바깥 값 글자 자리 48 을 남긴다. 막대 길이는 들쭉날쭉한 고정 비율로 둔다.

type ButterflyBarChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    rows?: number
}

const skeletonPartClassName = chartSkeletonPartVariants()
const LEFT_BAR_WIDTHS = ['w-full', 'w-2/5', 'w-1/4', 'w-1/3', 'w-1/5'] as const
const RIGHT_BAR_WIDTHS = ['w-2/5', 'w-full', 'w-1/3', 'w-4/5', 'w-1/2'] as const
const DEFAULT_ROWS = 5

const rowClassName = 'grid grid-cols-[minmax(0,1fr)_--spacing(30)_minmax(0,1fr)] items-center'

const ButterflyBarChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    rows = DEFAULT_ROWS,
    className,
    ...props
}: ButterflyBarChartSkeletonProps) => (
    <div {...props} role="status" className={cn('w-full min-w-0 animate-pulse', className)}>
        <span className="sr-only">{label}</span>
        <div className="flex flex-col gap-4" aria-hidden="true">
            <div className={rowClassName}>
                <span className="flex justify-end">
                    <span className={cn(skeletonPartClassName, 'h-5 w-16')} />
                </span>
                <span />
                <span className={cn(skeletonPartClassName, 'h-5 w-16')} />
            </div>
            {Array.from({length: rows}, (_, index) => (
                <div key={index} className={rowClassName}>
                    <span className="flex justify-end pl-12">
                        <span
                            className={cn(
                                skeletonPartClassName,
                                'h-6 rounded-none',
                                LEFT_BAR_WIDTHS[index % LEFT_BAR_WIDTHS.length],
                            )}
                        />
                    </span>
                    <span className="flex justify-center px-5">
                        <span className={cn(skeletonPartClassName, 'h-4 w-16')} />
                    </span>
                    <span className="flex pr-12">
                        <span
                            className={cn(
                                skeletonPartClassName,
                                'h-6 rounded-none',
                                RIGHT_BAR_WIDTHS[index % RIGHT_BAR_WIDTHS.length],
                            )}
                        />
                    </span>
                </div>
            ))}
        </div>
    </div>
)

export {ButterflyBarChartSkeleton}
export type {ButterflyBarChartSkeletonProps}
