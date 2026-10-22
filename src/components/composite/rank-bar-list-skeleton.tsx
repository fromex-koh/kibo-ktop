import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// RankBarList 와 같은 짜임의 스켈레톤 — 제목 줄 + 값 줄(이름 · 막대 · 값 자리)을 같은 배치로 그린다.
// 줄 높이는 실제 목록과 같은 글자 행간(h-lh) + 여백 + 선 두께(투명)라, 실제 목록에 넘긴 클래스를 같게 넘기면
// 불러온 뒤 높이가 같다. 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의
// 자동 인쇄가 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type RankBarListSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
    /** 값 줄 수(기본 12 — 10건 · 평균 · 조회기업). */
    rowCount?: number
    /** 평균 줄 자리(0 부터) — 위 선 두께만큼 줄이 높다. 기본 rowCount − 2(평균 뒤 조회기업). 조회기업이 없으면 rowCount − 1. */
    averageRowIndex?: number
    // 아래 클래스는 실제 목록(RankBarList)에 넘긴 것과 같게 넘긴다 — 주면 기본값을 대신한다.
    /** 글자 크기(줄 높이) · 위 선 두께. 기본 typo-body-l-regular border-t-2. */
    listClassName?: string
    /** 제목 줄. 기본 typo-body-xl-bold px-3.5 py-2.5. */
    titleClassName?: string
    /** 값 줄 여백 · 아래 선 두께. 기본 py-2 border-b. */
    rowClassName?: string
    /** 평균 줄 위 선 두께(두께 클래스만 — 예: kbx-border-t-regular). 기본 border-t-2. */
    averageRowClassName?: string
    /** 이름 칸 폭 · 왼쪽 여백. 기본 w-40 pl-3.5. */
    nameClassName?: string
    /** 막대 높이. 기본 h-4. */
    barClassName?: string
    /** 값 칸 폭. 기본 w-18. */
    valueClassName?: string
}

// 막대 자리 길이 — 순위 목록처럼 위에서 아래로 짧아진다.
const BAR_WIDTHS = ['w-11/12', 'w-5/6', 'w-3/4', 'w-2/3', 'w-3/5', 'w-1/2', 'w-2/5', 'w-1/3', 'w-1/4', 'w-1/5'] as const

const RankBarListSkeleton = ({
    label = '목록을 불러오는 중입니다.',
    rowCount = 12,
    averageRowIndex,
    listClassName,
    titleClassName,
    rowClassName,
    averageRowClassName,
    nameClassName,
    barClassName,
    valueClassName,
    className,
    ...props
}: RankBarListSkeletonProps) => (
    <div
        {...props}
        role="status"
        data-slot="chart-skeleton"
        className={cn(
            'flex min-w-0 animate-pulse flex-col',
            listClassName ?? 'typo-body-l-regular border-t-2',
            'border-transparent',
            className,
        )}
    >
        <span className="sr-only">{label}</span>
        <div aria-hidden="true" className={cn(titleClassName ?? 'typo-body-xl-bold px-3.5 py-2.5', 'bg-muted')}>
            <span className="block h-lh" />
        </div>
        <ul aria-hidden="true">
            {Array.from({length: rowCount}, (_, index) => [
                // 평균 줄 위 선 자리 — 두께만 남긴 빈 줄(선 두께 클래스만 받는다. 색 클래스와 한 칸에 섞으면 두께가 지워진다).
                index === (averageRowIndex ?? rowCount - 2) ? (
                    <li
                        key={`average-${index}`}
                        className={cn('border-transparent', averageRowClassName ?? 'border-t-2')}
                    />
                ) : null,
                <li
                    key={index}
                    className={cn('flex items-center gap-3.5', rowClassName ?? 'border-b py-2', 'border-transparent')}
                >
                    <span className={cn('flex h-lh shrink-0 items-center', nameClassName ?? 'w-40 pl-3.5')}>
                        <span className="bg-muted h-4 w-3/4 rounded-sm" />
                    </span>
                    <span className="flex min-w-0 flex-1">
                        <span
                            className={cn('bg-muted', barClassName ?? 'h-4', BAR_WIDTHS[index % BAR_WIDTHS.length])}
                        />
                    </span>
                    <span className={cn('flex shrink-0 justify-end', valueClassName ?? 'w-18')}>
                        <span className="bg-muted h-4 w-3/4 rounded-sm" />
                    </span>
                </li>,
            ])}
        </ul>
    </div>
)

export {RankBarListSkeleton}
export type {RankBarListSkeletonProps}
