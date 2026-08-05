'use client'

import {ChevronLeft, ChevronRight} from 'lucide-react'
import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from '@/components/ui/pagination'
import {
    paginationEllipsisClassName,
    paginationItemClassName,
    paginationNavClassName,
} from '@/components/theme/pagination.variants'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: Figma pagination 시안. shadcn ui/pagination 의 구조(nav·ul·li)를 쓰고,
// 페이지 이동은 URL 이 아닌 상태(onPageChange)로 처리하므로 컨트롤은 button 으로 렌더한다.
// 페이지 수가 많으면 앞뒤 경계(boundary)와 현재 주변(sibling)을 기준으로 페이지 영역을 구성한다.
// PC 기본 페이지 영역은 번호·말줄임표를 최대 10개까지 노출하며, 이전·다음 버튼을 포함하면 최대 12개다.

const range = (start: number, end: number) => Array.from({length: Math.max(end - start + 1, 0)}, (_, i) => start + i)

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

// 경계(boundary)·현재 주변(sibling)을 기준으로 페이지 영역을 만들고, maxVisibleItems를 넘지 않도록 확장한다.
// maxVisibleItems에는 페이지 번호와 말줄임표만 포함하며 이전·다음 버튼은 포함하지 않는다.
const buildPageItems = (
    page: number,
    total: number,
    siblingCount: number,
    boundaryCount: number,
    maxVisibleItems: number,
): PageItem[] => {
    if (total <= 0) return []

    const maxItems = Math.max(Math.floor(maxVisibleItems), boundaryCount * 2 + 1)
    if (total <= maxItems) return range(1, total)

    const startPages = range(1, boundaryCount)
    const endPages = range(total - boundaryCount + 1, total)
    const firstMiddlePage = boundaryCount + 1
    const lastMiddlePage = total - boundaryCount
    const oneSidedWindowSize = Math.max(maxItems - boundaryCount * 2 - 1, 1)
    const centerWindowSize = Math.max(maxItems - boundaryCount * 2 - 2, 1)

    let windowStart: number
    let windowSize: number

    // 처음·끝 페이지에 가까우면 말줄임표 하나만 사용해 페이지 영역을 최대한 채운다.
    if (page <= firstMiddlePage + oneSidedWindowSize - 1) {
        windowStart = firstMiddlePage
        windowSize = oneSidedWindowSize
    } else if (page >= lastMiddlePage - oneSidedWindowSize + 1) {
        windowSize = oneSidedWindowSize
        windowStart = lastMiddlePage - windowSize + 1
    } else {
        // 중앙 구간은 말줄임표 두 개를 남기고, siblingCount를 중심으로 남은 슬롯을 양옆에 확장한다.
        windowSize = centerWindowSize
        const requestedWindowSize = siblingCount * 2 + 1
        const extraWindowSize = Math.max(windowSize - requestedWindowSize, 0)
        const requestedStart = page - siblingCount - Math.floor(extraWindowSize / 2)
        const latestStart = lastMiddlePage - windowSize + 1
        windowStart = Math.min(Math.max(requestedStart, firstMiddlePage), latestStart)
    }

    const windowEnd = Math.min(windowStart + windowSize - 1, lastMiddlePage)
    const items: PageItem[] = [
        ...startPages,
        ...(windowStart > firstMiddlePage ? ['ellipsis-left' as const] : []),
        ...range(windowStart, windowEnd),
        ...(windowEnd < lastMiddlePage ? ['ellipsis-right' as const] : []),
        ...endPages,
    ]

    return items
}

type PaginationProps = {
    page: number
    total: number
    onPageChange: (page: number) => void
    siblingCount?: number
    boundaryCount?: number
    prevLabel?: string
    nextLabel?: string
    maxVisibleItems?: number
    compact?: boolean
    'aria-label'?: string
    className?: string
}

const Pagination = ({
    page,
    total,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    prevLabel = '이전',
    nextLabel = '다음',
    maxVisibleItems = 10,
    compact = false,
    'aria-label': ariaLabel = '페이지 이동',
    className,
}: PaginationProps) => {
    const items = buildPageItems(page, total, siblingCount, boundaryCount, maxVisibleItems)
    const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), total)
        if (clamped !== page) onPageChange(clamped)
    }

    return (
        <PaginationRoot aria-label={ariaLabel} className={className}>
            <PaginationContent className={cn('gap-2', compact && 'gap-1')}>
                <PaginationItem>
                    <button
                        type="button"
                        onClick={() => goTo(page - 1)}
                        disabled={page <= 1}
                        aria-label="이전 페이지"
                        className={cn(paginationNavClassName, compact && 'size-8 justify-center gap-0 p-0')}
                    >
                        <ChevronLeft aria-hidden="true" className="size-icon-md" />
                        {prevLabel}
                    </button>
                </PaginationItem>

                {items.map((item, index) =>
                    item === 'ellipsis-left' || item === 'ellipsis-right' ? (
                        <PaginationItem key={`${item}-${index}`}>
                            <PaginationEllipsis className={cn(paginationEllipsisClassName, compact && 'size-8')} />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <button
                                type="button"
                                onClick={() => goTo(item)}
                                aria-label={`${item} 페이지`}
                                aria-current={item === page ? 'page' : undefined}
                                className={cn(paginationItemClassName, compact && 'size-8')}
                            >
                                {item}
                            </button>
                        </PaginationItem>
                    ),
                )}

                <PaginationItem>
                    <button
                        type="button"
                        onClick={() => goTo(page + 1)}
                        disabled={page >= total}
                        aria-label="다음 페이지"
                        className={cn(
                            paginationNavClassName,
                            'flex-row-reverse',
                            compact && 'size-8 justify-center gap-0 p-0',
                        )}
                    >
                        <ChevronRight aria-hidden="true" className="size-icon-md" />
                        {nextLabel}
                    </button>
                </PaginationItem>
            </PaginationContent>
        </PaginationRoot>
    )
}

export {Pagination}
export type {PaginationProps}
