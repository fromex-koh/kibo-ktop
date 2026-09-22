import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// DivergingRankChart 와 같은 짜임 — 오른쪽 위 별 범례 → 16 → 두 목록 제목(왼쪽은 가운데 쪽 정렬) → 16
// → 행(높이 24 · 사이 16). 막대는 가운데에서 바깥으로 줄어드는 길이로 놓고, 바깥 끝에 값 자리를 둔다. 두 목록 사이 24.
// 로딩 상태는 role="status" + 숨김 글자로 알리고, 모양 자리는 aria-hidden 으로 감춘다.

type DivergingRankChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    label?: string
}

const skeletonPartClassName = chartSkeletonPartVariants()

// 막대 길이(칸 폭 − 값 자리에 대한 %) — 순위 목록처럼 위에서 아래로 줄어든다.
const DIVERGING_RANK_SKELETON_BARS = [100, 90, 80, 72, 64, 56, 48, 40, 32, 24] as const
// 값 자리 60(= --spacing(15)) — 실제 차트와 같은 값 자리를 남긴다.
const VALUE_RESERVE = 'calc(var(--spacing) * 15)'

const SkeletonList = ({isLeft}: {isLeft: boolean}) => (
    <div className="flex min-w-0 flex-col gap-4">
        {DIVERGING_RANK_SKELETON_BARS.map((width, index) => (
            <div key={index} className={cn('flex h-6 items-center gap-1', isLeft && 'justify-end')}>
                {isLeft ? <div className={cn(skeletonPartClassName, 'h-3 w-8 shrink-0')} /> : null}
                <div
                    className={cn(skeletonPartClassName, 'h-full rounded-none')}
                    style={{width: `calc((100% - ${VALUE_RESERVE}) * ${width / 100})`}}
                />
                {isLeft ? null : <div className={cn(skeletonPartClassName, 'h-3 w-8 shrink-0')} />}
            </div>
        ))}
    </div>
)

const DivergingRankChartSkeleton = ({className, label, ...props}: DivergingRankChartSkeletonProps) => (
    <div
        {...props}
        role="status"
        aria-live="polite"
        data-slot="chart-skeleton"
        data-type="diverging-rank"
        className={cn('flex w-full min-w-0 animate-pulse flex-col gap-4', className)}
    >
        <div className="flex flex-col gap-4" aria-hidden="true">
            <div className="typo-body-l-regular flex h-lh items-center justify-end gap-1">
                <div className={cn(skeletonPartClassName, 'size-4 rounded-none')} />
                <div className={cn(skeletonPartClassName, 'h-3 w-16')} />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="typo-body-l-bold flex h-lh items-center justify-end">
                    <div className={cn(skeletonPartClassName, 'h-4 w-20')} />
                </div>
                <div className="typo-body-l-bold flex h-lh items-center">
                    <div className={cn(skeletonPartClassName, 'h-4 w-20')} />
                </div>
                <SkeletonList isLeft />
                <SkeletonList isLeft={false} />
            </div>
        </div>
        <span className="sr-only">{label ?? '차트 데이터를 불러오는 중입니다.'}</span>
    </div>
)

export {DivergingRankChartSkeleton}
export type {DivergingRankChartSkeletonProps}
