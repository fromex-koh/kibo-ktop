'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {Pagination} from '@/components/composite/pagination'
import {SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

// 화면별 검사 기록의 목록 틀 — 표 위에 지금 조건의 화면 수와 필터 select, 표 아래에 페이지네이션을 둔다
// (게시판 목록과 같은 배치). 표는 서버에서 전체 행을 그대로 그리고, 여기서는 조건·페이지에 들지 않는
// 행에 hidden 만 건다 — 번호는 원래 순번을 유지해 증적의 번호가 필터에 따라 바뀌지 않는다.
const PAGE_SIZE = 10

const RECORD_FILTERS = [
    {value: 'all', label: '전체'},
    {value: 'issue', label: '오류·경고 있음'},
    {value: 'clean', label: '오류·경고 없음'},
] as const

type RecordFilterValue = (typeof RECORD_FILTERS)[number]['value']

const isRecordFilterValue = (value: string): value is RecordFilterValue =>
    RECORD_FILTERS.some((filter) => filter.value === value)

const matchesFilter = (hasIssue: boolean, filter: RecordFilterValue) =>
    filter === 'all' || (filter === 'issue' ? hasIssue : !hasIssue)

type RecordFilterProps = {
    /** 스크린리더용 이름 — 한 페이지에 목록이 여럿이라 검사 도구·이용자 구분을 넣어 구분한다. */
    label: string
    /** 표의 행 순서대로, 그 화면에 오류·경고가 있는지. */
    rows: readonly boolean[]
    children: ReactNode
}

const RecordFilter = ({label, rows, children}: RecordFilterProps) => {
    const [filter, setFilter] = useState<RecordFilterValue>('all')
    const [page, setPage] = useState(1)
    const tableRef = useRef<HTMLDivElement>(null)

    // 지금 조건에 드는 행의 순번(표 안 위치)과, 그중 이번 페이지에 보일 행.
    const matchedRowIndexes = rows.flatMap((hasIssue, index) => (matchesFilter(hasIssue, filter) ? [index] : []))
    const totalPages = Math.max(Math.ceil(matchedRowIndexes.length / PAGE_SIZE), 1)
    const pageStart = (page - 1) * PAGE_SIZE
    const visibleRowKey = matchedRowIndexes.slice(pageStart, pageStart + PAGE_SIZE).join(',')

    useEffect(() => {
        const visibleRowIndexes = new Set(visibleRowKey ? visibleRowKey.split(',').map(Number) : [])
        tableRef.current?.querySelectorAll<HTMLTableRowElement>('tbody > tr').forEach((row, index) => {
            row.hidden = !visibleRowIndexes.has(index)
        })
        // 첫 페이지만 보이게 하던 초기 CSS 규칙을 끈다 — 이후로는 위의 hidden 이 보일 행을 정한다.
        tableRef.current?.setAttribute('data-ready', 'true')
    }, [visibleRowKey])

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* 건수 표기는 서비스 화면 목록(총 N건)과 같은 타이포를 쓴다 — 숫자만 파랗게. */}
                <p className="typo-body-xl-regular text-foreground" aria-live="polite">
                    화면 <strong className="typo-body-xl-bold text-primary">{matchedRowIndexes.length}</strong>개
                </p>
                <SelectField
                    value={filter}
                    onValueChange={(value) => {
                        if (!isRecordFilterValue(value)) return
                        setFilter(value)
                        setPage(1)
                    }}
                >
                    <SelectTrigger size="md" aria-label={`${label} 필터`} className="min-w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {RECORD_FILTERS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectField>
            </div>
            {/* 스크립트가 붙기 전에는 첫 페이지 분량만 보이게 해, 전체 행이 잠깐 펼쳐졌다 접히지 않게 한다. */}
            <div ref={tableRef} className="[&:not([data-ready])_tbody>tr:nth-child(n+11)]:hidden">
                {children}
            </div>
            <Pagination
                page={page}
                total={totalPages}
                onPageChange={setPage}
                aria-label={`${label} 페이지 이동`}
                className="pt-2"
            />
        </div>
    )
}

export default RecordFilter
