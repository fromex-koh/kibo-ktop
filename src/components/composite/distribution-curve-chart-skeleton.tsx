import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// DistributionCurveChart 와 같은 짜임 — 높이 162 칸 상자(위 선 없음 · 바닥 · 양 끝 실선 · 눈금 사이 점선 10칸) 안에 종 모양 면 →
// 눈금 숫자 자리(34, 11개). 전체 196 으로 실제와 같다.

type DistributionCurveChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
}

const CELL_COUNT = 10
// 종 모양 — 가로 0~100 · 세로 0(위)~100(아래) 좌표. 꼭대기는 칸 높이의 92%(위에서 8).
const CURVE_PATH = 'M0,100 C25,100 32,8 50,8 C68,8 75,100 100,100 Z'

const skeletonPartClassName = chartSkeletonPartVariants()

const DistributionCurveChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    className,
    ...props
}: DistributionCurveChartSkeletonProps) => (
    <div {...props} role="status" className={cn('w-full min-w-0 animate-pulse', className)}>
        <span className="sr-only">{label}</span>
        <div aria-hidden="true">
            <div className="border-subtle-3 relative h-40.5 border-x border-b">
                <div className="divide-subtle-3 grid h-full grid-cols-10 divide-x divide-dashed">
                    {Array.from({length: CELL_COUNT}, (_, index) => (
                        <span key={index} />
                    ))}
                </div>
                {/* 곡선 면은 칸 흐름과 별개로 상자 전체를 덮는 장식이다. */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="fill-muted absolute inset-0 size-full">
                    <path d={CURVE_PATH} />
                </svg>
            </div>
            <div className="flex h-8.5 justify-between pt-2">
                {Array.from({length: CELL_COUNT + 1}, (_, index) => (
                    <span key={index} className={cn(skeletonPartClassName, 'h-3 w-4 rounded-sm')} />
                ))}
            </div>
        </div>
    </div>
)

export {DistributionCurveChartSkeleton}
export type {DistributionCurveChartSkeletonProps}
