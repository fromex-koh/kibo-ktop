import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// GradeHistoryChart 와 같은 짜임 — 높이 160 그릴 자리(바닥선 · 점마다 세로 점선) 안에 지름 60 원 셋(높이는 들쭉날쭉한 고정 비율)
// → 시점 이름 자리(26). 전체 186 으로 실제와 같다. 원은 양 끝이 원 사이 간격의 0.59 배 안쪽에 선다(3 시점 기준 자리).

type GradeHistoryChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
}

// 원 가운데 가로 위치(%) · 세로 위치(그릴 자리 위에서 px) — 실제 3 시점 배치와 같다.
const DOTS = [
    {left: 'left-[18.6%]', top: 'top-12.5'},
    {left: 'left-1/2', top: 'top-20'},
    {left: 'left-[81.4%]', top: 'top-5.5'},
] as const

const skeletonPartClassName = chartSkeletonPartVariants()

const GradeHistoryChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    className,
    ...props
}: GradeHistoryChartSkeletonProps) => (
    <div {...props} role="status" className={cn('w-full min-w-0 animate-pulse', className)}>
        <span className="sr-only">{label}</span>
        <div aria-hidden="true">
            <div className="border-subtle-3 relative h-40 border-b">
                {DOTS.map((dot) => (
                    <span
                        key={dot.left}
                        className={cn(
                            'border-subtle-3 absolute inset-y-0 -translate-x-1/2 border-l border-dashed',
                            dot.left,
                        )}
                    />
                ))}
                {DOTS.map((dot) => (
                    <span
                        key={`${dot.left}-dot`}
                        className={cn(
                            skeletonPartClassName,
                            'absolute size-15 -translate-x-1/2 rounded-full',
                            dot.left,
                            dot.top,
                        )}
                    />
                ))}
            </div>
            <div className="relative h-6.5">
                {DOTS.map((dot) => (
                    <span
                        key={`${dot.left}-label`}
                        className={cn(skeletonPartClassName, 'absolute top-2 h-3 w-10 -translate-x-1/2', dot.left)}
                    />
                ))}
            </div>
        </div>
    </div>
)

export {GradeHistoryChartSkeleton}
export type {GradeHistoryChartSkeletonProps}
