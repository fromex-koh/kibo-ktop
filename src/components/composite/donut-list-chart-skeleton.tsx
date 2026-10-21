import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// DonutListChart 와 같은 짜임의 스켈레톤 — 도넛 고리 + 옆 목록 줄(색 칸 · 이름 · 값 자리)을 같은 배치로 그린다.
// 도넛 크기 · 목록 폭 · 줄 여백은 실제 차트에 넘긴 것과 같은 클래스를 넘기면 불러온 뒤 자리가 흔들리지 않는다.
// 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가
// 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type DonutListChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 목록 줄 수(기본 8 — 7개 분류 + 기타). */
    rowCount?: number
    /** 도넛 크기(w-*). 실제 차트의 donutClassName 과 같게. 기본 w-60. */
    donutClassName?: string
    // 아래 클래스는 실제 차트(DonutListChart)에 넘긴 것과 같게 넘긴다 — 주면 기본값을 대신한다.
    /** 목록 상자 글자 크기(줄 높이) · 폭. 기본 typo-body-l-regular. */
    listClassName?: string
    /** 목록 한 줄 여백 · 구분선(구분선은 투명하게 두께만 쓴다). 기본 py-2.5 border-b. */
    rowClassName?: string
    /** 마지막 줄 여백. 기본 py-1.5. */
    lastRowClassName?: string
    /** 도넛 아래 글 자리 — 실제 차트에 donutCaption 을 줄 때 켠다. 묶음 폭은 donutBoxClassName 으로 같게 넘긴다. */
    hasDonutCaption?: boolean
    donutBoxClassName?: string
}

// 실제 차트(donut-list-chart.tsx)와 같은 도넛 치수(viewBox 300).
const SIZE = 300
const CENTER = SIZE / 2
// 고리 — 바깥 150 · 안쪽 83.3 의 가운데 반지름과 두께.
const RING_RADIUS = 116.65
const RING_WIDTH = 66.7
// 이름 자리 폭(목록 폭 대비) — 줄마다 조금씩 다르게 돌려 쓴다.
const NAME_WIDTHS = ['w-1/3', 'w-1/4', 'w-1/5', 'w-1/4', 'w-1/6', 'w-1/5', 'w-1/6', 'w-1/12'] as const

const DonutListChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    rowCount = 8,
    donutClassName,
    listClassName,
    rowClassName,
    lastRowClassName,
    hasDonutCaption = false,
    donutBoxClassName,
    className,
    ...props
}: DonutListChartSkeletonProps) => {
    const donut = (
        <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden="true"
            className={cn('text-muted block w-60 shrink-0', donutClassName)}
        >
            <circle
                cx={CENTER}
                cy={CENTER}
                r={RING_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={RING_WIDTH}
            />
        </svg>
    )

    return (
        <div
            {...props}
            role="status"
            data-slot="chart-skeleton"
            className={cn('flex w-full animate-pulse items-center gap-15', className)}
        >
            <span className="sr-only">{label}</span>
            {hasDonutCaption ? (
                <div className={cn('flex shrink-0 flex-col items-center gap-3', donutBoxClassName)}>
                    {donut}
                    {/* 아래 글 한 줄 자리(typo-body-m 높이). */}
                    <span aria-hidden="true" className="bg-muted h-5 w-24 rounded-sm" />
                </div>
            ) : (
                donut
            )}
            {/* 줄 높이 = 실제 차트와 같은 글자 행간(h-lh) + 여백 + 구분선 두께(투명) — 불러온 뒤 목록 높이가 같다. */}
            <ul
                aria-hidden="true"
                className={cn('flex min-w-0 flex-1 flex-col', listClassName ?? 'typo-body-l-regular')}
            >
                {Array.from({length: rowCount}, (_, index) => (
                    <li
                        key={index}
                        className={cn(
                            'box-content flex h-lh items-center gap-2.5 border-transparent',
                            index === rowCount - 1
                                ? (lastRowClassName ?? 'py-1.5')
                                : (rowClassName ?? 'border-b py-2.5'),
                        )}
                    >
                        <span className="bg-muted size-3 shrink-0" />
                        <span className={cn('bg-muted h-4 rounded-sm', NAME_WIDTHS[index % NAME_WIDTHS.length])} />
                        <span className="bg-muted ml-auto h-4 w-20 rounded-sm" />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {DonutListChartSkeleton}
export type {DonutListChartSkeletonProps}
