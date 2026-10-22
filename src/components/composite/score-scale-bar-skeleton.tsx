import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// ScoreScaleBar 와 같은 짜임의 스켈레톤 — 배경 띠 자리 + 아래 눈금 숫자 자리를 회색으로 그린다.
// 띠 높이(trackClassName) · 눈금 글자(tickClassName)를 실제 막대에 넘긴 것과 같게 넘기면 불러온 뒤 높이가 같다.
// 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가
// 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type ScoreScaleBarSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 눈금 숫자 수(기본 5 — 0 · 25 · 50 · 75 · 100). 0 이면 눈금 줄을 그리지 않는다. */
    tickCount?: number
    // 아래 클래스는 실제 막대(ScoreScaleBar)에 넘긴 것과 같게 넘긴다 — 주면 기본값을 대신한다.
    /** 배경 띠 높이. 기본 h-4. 색은 muted 로 덮는다. */
    trackClassName?: string
    /** 눈금 글자(줄 높이). 기본 typo-body-m-medium. */
    tickClassName?: string
}

const DEFAULT_TICK_COUNT = 5

const ScoreScaleBarSkeleton = ({
    label = '점수를 불러오는 중입니다.',
    tickCount = DEFAULT_TICK_COUNT,
    trackClassName,
    tickClassName,
    className,
    ...props
}: ScoreScaleBarSkeletonProps) => (
    <div
        {...props}
        role="status"
        data-slot="chart-skeleton"
        className={cn('flex animate-pulse flex-col gap-2', className)}
    >
        <span className="sr-only">{label}</span>
        {/* 띠 색은 넘겨받은 색보다 뒤에 둔 muted 로 덮는다. */}
        <div aria-hidden="true" className={cn('h-4', trackClassName, 'bg-muted')} />
        {tickCount ? (
            <div aria-hidden="true" className={cn('flex justify-between', tickClassName ?? 'typo-body-m-medium')}>
                {Array.from({length: tickCount}, (_, index) => (
                    <span key={index} className="flex h-lh items-center">
                        <span className="bg-muted block h-3 w-6 rounded-sm" />
                    </span>
                ))}
            </div>
        ) : null}
    </div>
)

export {ScoreScaleBarSkeleton}
export type {ScoreScaleBarSkeletonProps}
