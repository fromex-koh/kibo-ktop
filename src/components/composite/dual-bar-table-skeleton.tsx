import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// DualBarTable 과 같은 짜임의 스켈레톤 — 같은 표(머리 줄 + 값 줄)에 이름 · 막대 · 숫자 자리를 회색으로 그린다.
// 줄 높이는 실제 표와 같은 글자 행간(h-lh) + 여백이라, 실제 표에 넘긴 클래스를 같게 넘기면 불러온 뒤 자리가 흔들리지 않는다.
// 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가
// 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type DualBarTableSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 값 줄 수(기본 5 — 매출 규모 5구간). */
    rowCount?: number
    // 아래 클래스는 실제 표(DualBarTable)에 넘긴 것과 같게 넘긴다 — 주면 기본값을 대신한다.
    /** 표 글자 크기(줄 높이) · 위 선. 기본 typo-body-l-regular border-t-2 border-primary(선 색은 투명하게 두께만). */
    tableClassName?: string
    /** 머리 줄 위아래 여백. 기본 py-2.5. */
    headClassName?: string
    /** 값 줄 위아래 여백 · 아래 선(투명하게 두께만). 기본 py-2 border-b. */
    rowClassName?: string
    /** 이름 열 폭(w-*). 기본 w-40. */
    labelWidthClassName?: string
    /** 막대 높이(h-*). 기본 h-4. */
    barClassName?: string
    /** 숫자 칸 폭(w-*). 기본 w-20. */
    valueClassName?: string
}

// 막대 자리 길이 — 줄마다 조금씩 다르게 돌려 쓴다.
const BAR_WIDTHS = ['w-3/4', 'w-1/3', 'w-1/6', 'w-1/4', 'w-1/12'] as const

const DualBarTableSkeleton = ({
    label = '표를 불러오는 중입니다.',
    rowCount = 5,
    tableClassName,
    headClassName,
    rowClassName,
    labelWidthClassName,
    barClassName,
    valueClassName,
    className,
    ...props
}: DualBarTableSkeletonProps) => {
    // 선 색은 투명 — 두께만 남겨 줄 높이를 맞춘다(넘겨받은 선 색보다 뒤에 둔다).
    const rowCell = cn(rowClassName ?? 'border-b py-2', 'border-transparent')
    const valueCell = (index: number) => (
        <td className={cn(rowCell, 'pl-8')}>
            <div className="flex h-lh items-center gap-2.5">
                <div className="flex min-w-0 flex-1">
                    <span className={cn('bg-muted', barClassName ?? 'h-4', BAR_WIDTHS[index % BAR_WIDTHS.length])} />
                </div>
                <div className={cn('flex shrink-0 justify-end', valueClassName ?? 'w-20')}>
                    <span className="bg-muted h-4 w-3/4 rounded-sm" />
                </div>
            </div>
        </td>
    )

    return (
        <div {...props} role="status" data-slot="chart-skeleton" className={cn('w-full animate-pulse', className)}>
            <span className="sr-only">{label}</span>
            <table
                aria-hidden="true"
                className={cn(
                    'w-full table-fixed border-collapse',
                    tableClassName ?? 'typo-body-l-regular border-t-2',
                    'border-transparent',
                )}
            >
                <colgroup>
                    <col className={labelWidthClassName ?? 'w-40'} />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr className="bg-muted">
                        {[0, 1, 2].map((index) => (
                            <th key={index} className={cn(headClassName ?? 'py-2.5', index && 'pl-8')}>
                                <span className="block h-lh" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({length: rowCount}, (_, index) => (
                        <tr key={index}>
                            <th className={rowCell}>
                                <div className="flex h-lh items-center pl-3.5">
                                    <span className="bg-muted h-4 w-2/3 rounded-sm" />
                                </div>
                            </th>
                            {valueCell(index)}
                            {valueCell(index + 2)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {DualBarTableSkeleton}
export type {DualBarTableSkeletonProps}
