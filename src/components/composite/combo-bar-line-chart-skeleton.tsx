import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// ComboBarLineChart 와 같은 짜임 — 높이 200 칸 상자(위 선 없음 · 바닥 · 양 끝 실선 · 항목 사이 점선) 안에 칸마다 가운데 막대
// (폭 48 · 위 모서리 둥근)와 칸 아래쪽 절반을 지나는 선 → 항목 이름 자리(26). 전체 226 로 실제와 같다.
// 좁은 화면에서는 실제처럼 칸 폭 96 × 6 을 지키고 넘치는 부분은 가린다(실제는 가로 스크롤).
// 모양만 그리는 조각이라 aria-hidden 이다 — 불러오는 중 안내(role="status")는 감싸는 쪽에서 둔다.
const COMBO_SKELETON_BARS = [76, 72, 66, 60, 54, 70] as const
// 선 점 높이(칸 위 끝에서 %) — 막대 안쪽 아래 절반을 지난다.
const COMBO_SKELETON_LINE = [74, 80, 62, 70, 86, 72] as const
const COMBO_SKELETON_MIN_WIDTH = 'min-w-144'

const skeletonPartClassName = chartSkeletonPartVariants()

const ComboBarLineChartSkeleton = ({className}: {className?: string}) => {
    const count = COMBO_SKELETON_BARS.length
    const points = COMBO_SKELETON_LINE.map((y, index) => `${((index + 0.5) * 100) / count},${y}`).join(' ')

    return (
        <div className={cn('w-full overflow-hidden', className)} aria-hidden="true">
            <div className={COMBO_SKELETON_MIN_WIDTH}>
                <div className="border-subtle-3 divide-subtle-3 relative grid h-50 grid-cols-6 divide-x divide-dashed border-x border-b">
                    {COMBO_SKELETON_BARS.map((height, index) => (
                        <div key={index} className="flex items-end justify-center">
                            <div
                                className={cn(skeletonPartClassName, 'w-12 rounded-t-sm rounded-b-none')}
                                style={{height: `${height}%`}}
                            />
                        </div>
                    ))}
                    {/* 선은 막대 위에 겹쳐 그리는 장식이라 칸 흐름과 별개로 상자 전체를 덮는다. */}
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="text-card absolute inset-0 size-full"
                    >
                        <polyline
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
                <div className="grid h-6.5 grid-cols-6 pt-2">
                    {COMBO_SKELETON_BARS.map((_, index) => (
                        <div key={index} className="flex justify-center">
                            <div className={cn(skeletonPartClassName, 'h-3 w-10')} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export {ComboBarLineChartSkeleton}
