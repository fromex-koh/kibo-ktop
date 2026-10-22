import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// InsideLabelPieChart 와 같은 짜임의 스켈레톤 — 같은 그림 범위(viewBox 230)에 꽉 찬 원 자리만 그린다.
// 크기는 실제 차트와 같은 className(w-*)을 넘기면 불러온 뒤 자리가 흔들리지 않는다. 색은 다른 차트 스켈레톤과 같은 muted 면이다.
// data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type InsideLabelPieChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
}

// 실제 차트(inside-label-pie-chart.tsx)와 같은 치수.
const SIZE = 230
const CENTER = SIZE / 2
const RADIUS = 100

const InsideLabelPieChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    className,
    ...props
}: InsideLabelPieChartSkeletonProps) => (
    <div {...props} role="status" data-slot="chart-skeleton" className={cn('w-full min-w-0 animate-pulse', className)}>
        <span className="sr-only">{label}</span>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="text-muted block h-auto w-full" aria-hidden="true">
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="currentColor" />
        </svg>
    </div>
)

export {InsideLabelPieChartSkeleton}
export type {InsideLabelPieChartSkeletonProps}
