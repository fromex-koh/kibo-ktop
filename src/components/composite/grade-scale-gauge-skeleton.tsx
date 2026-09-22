import type {ComponentPropsWithoutRef} from 'react'
import {ARC_GAUGE_SIZES, arcGaugeTrackPath} from '@/components/custom/arc-gauge-shape'
import {cn} from '@/lib/utils'
import {chartSkeletonPartVariants} from '@/components/theme/chart-skeleton.variants'

// GradeScaleGauge 와 같은 짜임 — 원호(지름 260 · 위 172) 가운데 등급 · 설명 자리 → 16 → 등급 칸 줄(높이 32, 칸 수만큼 똑같이
// 나눔 · 간격 8) → 8 → 척도 줄(26). 칸 색은 모르므로 모두 같은 회색이다.

type GradeScaleGaugeSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 등급 칸 수(기본 6). GradeScaleGauge 의 grades 수와 같게 둔다. */
    count?: number
}

const DEFAULT_COUNT = 6
const MAX_COUNT = 12

const skeletonPartClassName = chartSkeletonPartVariants()

const GradeScaleGaugeSkeleton = ({
    label = '등급을 불러오는 중입니다.',
    count = DEFAULT_COUNT,
    className,
    ...props
}: GradeScaleGaugeSkeletonProps) => {
    const safeCount = Number.isFinite(count) ? Math.min(MAX_COUNT, Math.max(1, Math.round(count))) : DEFAULT_COUNT
    const gridStyle = {gridTemplateColumns: `repeat(${safeCount}, minmax(0, 1fr))`}
    return (
        <div {...props} role="status" className={cn('flex w-full min-w-0 animate-pulse flex-col gap-4', className)}>
            <span className="sr-only">{label}</span>
            <div className="mx-auto grid w-full max-w-65" aria-hidden="true">
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
                    <div className={cn(skeletonPartClassName, 'h-10 w-24')} />
                    <div className={cn(skeletonPartClassName, 'h-5 w-16')} />
                </div>
            </div>
            <div className="flex flex-col gap-2" aria-hidden="true">
                <div className="grid gap-2" style={gridStyle}>
                    {Array.from({length: safeCount}, (_, index) => (
                        <span key={index} className={cn(skeletonPartClassName, 'h-8 rounded-sm')} />
                    ))}
                </div>
                <div className="grid h-6.5 gap-2" style={gridStyle}>
                    <span className="flex items-center justify-center">
                        <span className={cn(skeletonPartClassName, 'h-3 w-8')} />
                    </span>
                    {safeCount > 2 ? <span className="bg-accent-subtle" style={{gridColumn: '2 / -2'}} /> : null}
                    {safeCount > 1 ? (
                        <span className="flex items-center justify-center">
                            <span className={cn(skeletonPartClassName, 'h-3 w-8')} />
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export {GradeScaleGaugeSkeleton}
export type {GradeScaleGaugeSkeletonProps}
