'use client'

import {useState, type ReactNode} from 'react'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {Badge} from '@/components/ui/badge'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/lib/utils'

export type PaidServiceUsageHistoryItem = {
    id: string
    usedAt: string
    companyName: string
    patentName: string
    reportType: string
    inquiryType: '자사조회' | '타사조회'
    deduction: number
    remaining: number
}

export type PaidServiceUsageHistoryPass = {
    grade: string
    remaining: number
}

export type PaidServiceUsageHistoryDialogProps = {
    children?: ReactNode
    pass: PaidServiceUsageHistoryPass
    defaultOpen?: boolean
    items?: readonly PaidServiceUsageHistoryItem[]
    totalPages?: number
    pageSize?: number
    onPageChange?: (page: number) => void
}

const headCellClassName =
    'bg-primary-subtle border-subtle-3 border-t-foreground-subtle typo-body-l-bold text-foreground sticky top-0 z-10 border-0 border-y px-4 py-3 text-center'
const cellClassName = 'border-subtle-3 typo-body-l-regular text-foreground border-0 border-b px-4 py-3 text-center'

const PaidServiceUsageHistoryDialog = ({
    children,
    pass,
    defaultOpen,
    items = [],
    totalPages,
    pageSize = 10,
    onPageChange,
}: PaidServiceUsageHistoryDialogProps) => {
    const [page, setPage] = useState(1)
    const isMobile = useIsMobile()
    const isServerPaginated = totalPages !== undefined
    const resolvedPageSize = Math.max(1, pageSize)
    const resolvedTotalPages = totalPages ?? Math.max(1, Math.ceil(items.length / resolvedPageSize))
    const visibleItems = isServerPaginated ? items : items.slice((page - 1) * resolvedPageSize, page * resolvedPageSize)
    const changePage = (next: number) => {
        setPage(next)
        onPageChange?.(next)
    }

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent
                aria-describedby={undefined}
                className={items.length === 0 ? 'grid-rows-none' : undefined}
                style={{maxWidth: 792}}
            >
                <DialogHeader className={items.length === 0 ? 'pb-10' : undefined}>
                    <DialogTitle>이용내역</DialogTitle>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="typo-caption-medium text-foreground-subtle">K-BIGx 보고서 이용권</p>
                            <h3 className="typo-h4-bold text-foreground">{pass.grade}</h3>
                        </div>
                        <p className="typo-title-m-regular text-foreground">
                            현재 잔여 이용권 <strong className="typo-title-l-bold">{pass.remaining}</strong>건
                        </p>
                    </div>
                    {items.length === 0 ? (
                        <EmptyState title="이용내역이 없습니다." className="min-h-0 px-0 py-10" />
                    ) : null}
                </DialogHeader>
                {items.length > 0 ? (
                    <div className={cn(dialogBodyClassName, 'gap-10 pb-10')}>
                        <>
                            <div className="min-h-0 flex-1 overflow-auto">
                                <table className="w-full min-w-5xl table-fixed border-separate border-spacing-0">
                                    <caption className="sr-only">K-BIGx 보고서 이용권 사용 내역</caption>
                                    <colgroup>
                                        <col className="w-1/8" />
                                        <col className="w-1/6" />
                                        <col className="w-7/24" />
                                        <col className="w-1/8" />
                                        <col className="w-1/10" />
                                        <col className="w-1/10" />
                                        <col className="w-1/10" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col" className={headCellClassName}>
                                                날짜
                                            </th>
                                            <th scope="col" className={headCellClassName}>
                                                기업명
                                            </th>
                                            <th scope="col" className={headCellClassName}>
                                                특허명
                                            </th>
                                            <th scope="col" className={headCellClassName}>
                                                보고서 유형
                                            </th>
                                            <th scope="col" className={headCellClassName}>
                                                조회유형
                                            </th>
                                            <th scope="col" className={headCellClassName}>
                                                차감
                                            </th>
                                            <th scope="col" className={headCellClassName}>
                                                잔여
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className={cellClassName}>{item.usedAt}</td>
                                                <td className={cellClassName}>{item.companyName}</td>
                                                <td className={cn(cellClassName, 'text-left')}>{item.patentName}</td>
                                                <td className={cellClassName}>
                                                    <Badge variant="outline" color="info" shape="round" size="sm">
                                                        {item.reportType}
                                                    </Badge>
                                                </td>
                                                <td
                                                    className={cn(
                                                        cellClassName,
                                                        item.inquiryType === '타사조회'
                                                            ? 'text-purple-600'
                                                            : 'text-primary-strong',
                                                    )}
                                                >
                                                    {item.inquiryType}
                                                </td>
                                                <td className={cellClassName}>{item.deduction}</td>
                                                <td className={cellClassName}>{item.remaining}건</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {resolvedTotalPages > 1 ? (
                                <Pagination
                                    page={page}
                                    total={resolvedTotalPages}
                                    onPageChange={changePage}
                                    siblingCount={isMobile ? 0 : 1}
                                    prevLabel={isMobile ? '' : '이전'}
                                    nextLabel={isMobile ? '' : '다음'}
                                    maxVisibleItems={isMobile ? 5 : 10}
                                    compact={isMobile}
                                    aria-label="이용내역 페이지 이동"
                                    className="justify-center"
                                />
                            ) : null}
                        </>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

export {PaidServiceUsageHistoryDialog}
