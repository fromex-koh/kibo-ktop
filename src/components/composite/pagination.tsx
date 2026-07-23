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
// 페이지 수가 많으면 앞뒤 경계(boundary)와 현재 주변(sibling)만 남기고 나머지는 생략(…)한다.

const range = (start: number, end: number) => Array.from({length: Math.max(end - start + 1, 0)}, (_, i) => start + i)

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

// MUI usePagination 과 같은 방식 — 경계 boundaryCount, 현재 주변 siblingCount 만 노출하고 나머지는 생략.
const buildPageItems = (page: number, total: number, siblingCount: number, boundaryCount: number): PageItem[] => {
    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2
    if (total <= totalPageNumbers) return range(1, total)

    const startPages = range(1, boundaryCount)
    const endPages = range(total - boundaryCount + 1, total)

    const siblingsStart = Math.max(
        Math.min(page - siblingCount, total - boundaryCount - siblingCount * 2 - 1),
        boundaryCount + 2,
    )
    const siblingsEnd = Math.min(Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2), endPages[0] - 2)

    const items: PageItem[] = [
        ...startPages,
        siblingsStart > boundaryCount + 2 ? 'ellipsis-left' : boundaryCount + 1,
        ...range(siblingsStart, siblingsEnd),
        siblingsEnd < total - boundaryCount - 1 ? 'ellipsis-right' : total - boundaryCount,
        ...endPages,
    ]
    // 경계와 생략 자리표시자가 같은 페이지로 겹칠 때 중복 제거.
    return items.filter((item, index) => item !== items[index - 1])
}

type PaginationProps = {
    page: number
    total: number
    onPageChange: (page: number) => void
    siblingCount?: number
    boundaryCount?: number
    prevLabel?: string
    nextLabel?: string
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
    'aria-label': ariaLabel = '페이지 이동',
    className,
}: PaginationProps) => {
    const items = buildPageItems(page, total, siblingCount, boundaryCount)
    const goTo = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), total)
        if (clamped !== page) onPageChange(clamped)
    }

    return (
        <PaginationRoot aria-label={ariaLabel} className={className}>
            <PaginationContent className="gap-2">
                <PaginationItem>
                    <button
                        type="button"
                        onClick={() => goTo(page - 1)}
                        disabled={page <= 1}
                        aria-label="이전 페이지"
                        className={paginationNavClassName}
                    >
                        <ChevronLeft aria-hidden="true" className="size-icon-md" />
                        {prevLabel}
                    </button>
                </PaginationItem>

                {items.map((item, index) =>
                    item === 'ellipsis-left' || item === 'ellipsis-right' ? (
                        <PaginationItem key={`${item}-${index}`}>
                            <PaginationEllipsis className={paginationEllipsisClassName} />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <button
                                type="button"
                                onClick={() => goTo(item)}
                                aria-label={`${item} 페이지`}
                                aria-current={item === page ? 'page' : undefined}
                                className={paginationItemClassName}
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
                        className={cn(paginationNavClassName, 'flex-row-reverse')}
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
