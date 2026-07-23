'use client'

import {useState} from 'react'
import {Pagination} from '@/components/composite/pagination'

// 기본 데모 — 9페이지가 모두 보이는 시안 구성. siblingCount=2 면 9페이지까지는 생략 없이 노출된다.
export const PaginationBasicDemo = () => {
    const [page, setPage] = useState(1)
    return (
        <div className="flex flex-col items-center gap-3">
            <Pagination page={page} total={9} onPageChange={setPage} siblingCount={2} />
            <p className="typo-body-l-regular text-muted-foreground">현재 {page} 페이지</p>
        </div>
    )
}

// 페이지가 많을 때 — 경계·현재 주변만 남기고 나머지는 생략(…).
export const PaginationEllipsisDemo = () => {
    const [page, setPage] = useState(8)
    return (
        <div className="flex flex-col items-center gap-3">
            <Pagination page={page} total={24} onPageChange={setPage} />
            <p className="typo-body-l-regular text-muted-foreground">현재 {page} / 24 페이지</p>
        </div>
    )
}
