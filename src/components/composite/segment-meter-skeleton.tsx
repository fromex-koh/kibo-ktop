import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// SegmentMeter 와 같은 짜임 — 칸 12×16 · 간격 4 · 모서리 2 를 전체 단계 수만큼 한 줄로 둔다. 채움 여부는 모르므로 모든 칸을
// 같은 회색으로 칠한다. 모양만 그리는 조각이라 aria-hidden 이다 — 불러오는 중 안내(role="status")는 감싸는 쪽에서 둔다.

type SegmentMeterSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 칸 수(기본 10). SegmentMeter 의 total 과 같게 둔다. */
    total?: number
}

const DEFAULT_TOTAL = 10
const MAX_TOTAL = 20

const skeletonPartClassName = chartSkeletonPartVariants()

const SegmentMeterSkeleton = ({total = DEFAULT_TOTAL, className, ...props}: SegmentMeterSkeletonProps) => {
    const safeTotal = Number.isFinite(total) ? Math.min(MAX_TOTAL, Math.max(1, Math.round(total))) : DEFAULT_TOTAL
    return (
        <div {...props} aria-hidden="true" className={cn('flex animate-pulse flex-wrap gap-1', className)}>
            {Array.from({length: safeTotal}, (_, index) => (
                <span key={index} className={cn(skeletonPartClassName, 'rounded-3xs h-4 w-3 shrink-0')} />
            ))}
        </div>
    )
}

export {SegmentMeterSkeleton}
export type {SegmentMeterSkeletonProps}
