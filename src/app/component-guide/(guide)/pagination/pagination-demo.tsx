'use client'

import {useState} from 'react'
import {Pagination} from '@/components/composite/pagination'

// 기본 데모 — 9페이지가 모두 보인다(maxVisibleItems 기본 10 이하).
export const PaginationBasicDemo = () => {
    const [page, setPage] = useState(1)
    return (
        <div className="flex flex-col items-center gap-3">
            <Pagination page={page} total={9} onPageChange={setPage} siblingCount={2} />
            <p className="typo-body-l-regular text-label-foreground">현재 {page} 페이지</p>
        </div>
    )
}

// 페이지가 많을 때 — 경계·현재 주변만 남기고 나머지는 생략(…).
export const PaginationEllipsisDemo = () => {
    const [page, setPage] = useState(8)
    return (
        <div className="flex flex-col items-center gap-3">
            <Pagination page={page} total={24} onPageChange={setPage} />
            <p className="typo-body-l-regular text-label-foreground">현재 {page} / 24 페이지</p>
        </div>
    )
}

// 좁은 화면(모바일 칸 폭 288) — 페이지가 아주 많아도 한 줄을 지키는지 본다. 조회 화면 목록과 같은 설정이다.
export const PaginationCompactEdgeDemo = ({total, initialPage}: {total: number; initialPage: number}) => {
    const [page, setPage] = useState(initialPage)
    return (
        <div className="border-subtle-3 flex w-full max-w-72 flex-col items-center gap-3 rounded-md border py-4">
            <Pagination
                page={page}
                total={total}
                onPageChange={setPage}
                siblingCount={0}
                maxVisibleItems={5}
                prevLabel=""
                nextLabel=""
                compact
                aria-label={`${total}쪽 예시 페이지`}
            />
            <p className="typo-body-m-regular text-label-foreground">
                {page} / {total.toLocaleString()} 페이지
            </p>
        </div>
    )
}
