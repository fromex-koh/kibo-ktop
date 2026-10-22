import {useId} from 'react'
import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 제목 · 상세 표(TitleDetailTable) — 한 건을 두 줄로 보이는 목록 표. 특허 목록처럼 제목이 길고 상세 값이 여럿일 때 쓴다.
//   1줄: 제목(특허명 등)이 표 전체 폭을 쓴다.
//   2줄: 앞 칸을 비워 들여 쓴 뒤 상세 값(출원번호 · 출원일 …)을 열마다 놓는다.
// '항목: 값' 쌍 하나씩이면 InfoTable, 여러 건 × 여러 열이면 이 표를 쓴다.
//
// 짜임: 머리글(옅은 파란 면 · 14 Bold) 두 줄 + 건마다 두 줄(카드 면 · 14 Regular). 색 · 줄 높이는 InfoTable 과 같다.
// 선: 위 진한 선 1(foreground-subtle) · 바깥 테두리 · 건 사이 선 · 둘째 줄의 위 선과 칸 사이 세로선(subtle-3).
//   둘째 줄 앞 칸은 위 선이 없어 윗줄(제목)과 이어진다 — 상세 값이 제목에 딸린 줄로 읽힌다.
// 긴 값: 한글은 어절 단위로 접고(break-keep), 띄어쓰기 없는 긴 영문 · 숫자는 칸 안에서 끊는다(wrap-anywhere).
// 빈 값: 칸을 비워 둔다 — 줄 높이 · 선은 그대로 유지된다.
// 접근성: 표 이름은 caption(sr-only), 열 머리는 th scope="col". 한 건은 tbody 하나(두 줄)이고 값 칸은 headers 로
//   제목 · 열 머리와 잇는다[7.3.2]. 들여 쓴 빈 칸은 읽을 내용이 없어 aria-hidden.

type TitleDetailTableColumn = {
    /** 열 식별 키 — rows 의 details 키와 맞춘다. */
    key: string
    /** 둘째 머리 줄의 열 이름. */
    label: ReactNode
}

type TitleDetailTableRow = {
    /** 건 식별 키(React key). */
    key: string
    /** 첫 줄 제목 값. */
    title: ReactNode
    /** 둘째 줄 상세 값 — columns 의 key 로 찾는다. 없으면 빈 칸. */
    details: Readonly<Record<string, ReactNode>>
}

type TitleDetailTableProps = {
    /** 표 이름(화면에는 숨김 · 스크린리더가 읽는다). */
    caption: string
    /** 첫 머리 줄의 제목 열 이름(예: 특허명). */
    titleLabel: ReactNode
    columns: readonly TitleDetailTableColumn[]
    rows: readonly TitleDetailTableRow[]
    className?: string
}

// 칸 여백 · 줄 높이 45 — InfoTable · 보고서 표와 같다.
const cellClassName = 'px-4 pt-3 pb-2.75 text-start wrap-anywhere break-keep'
const titleCellClassName = cn(cellClassName, 'border-subtle-3 border-t')
const detailCellClassName = cn(cellClassName, 'border-subtle-3 border-t border-l')
// 둘째 줄 앞의 들여 쓴 칸 — 좁은 화면에서는 상세 칸에 폭을 더 준다.
const indentCellClassName = cn(cellClassName, 'w-10 md:w-28 xl:w-40')

const TitleDetailTable = ({caption, titleLabel, columns, rows, className}: TitleDetailTableProps) => {
    const idPrefix = useId()
    const titleHeaderId = `${idPrefix}-title`
    const columnHeaderId = (key: string) => `${idPrefix}-${key}`
    const fullSpan = columns.length + 1

    return (
        <table
            data-slot="title-detail-table"
            className={cn('border-subtle-3 w-full border-collapse border-x border-b', className)}
        >
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-primary-subtle typo-body-l-bold text-foreground">
                <tr>
                    <th
                        id={titleHeaderId}
                        scope="col"
                        colSpan={fullSpan}
                        className={cn(cellClassName, 'border-t-foreground-subtle border-t')}
                    >
                        {titleLabel}
                    </th>
                </tr>
                <tr>
                    <td aria-hidden="true" className={indentCellClassName} />
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            id={columnHeaderId(column.key)}
                            scope="col"
                            className={detailCellClassName}
                        >
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>
            {rows.map((row) => (
                <tbody key={row.key} className="bg-card typo-body-l-regular text-label-foreground">
                    <tr>
                        <td headers={titleHeaderId} colSpan={fullSpan} className={titleCellClassName}>
                            {row.title}
                        </td>
                    </tr>
                    <tr>
                        <td aria-hidden="true" className={indentCellClassName} />
                        {columns.map((column) => (
                            <td
                                key={column.key}
                                headers={`${titleHeaderId} ${columnHeaderId(column.key)}`}
                                className={detailCellClassName}
                            >
                                {row.details[column.key]}
                            </td>
                        ))}
                    </tr>
                </tbody>
            ))}
        </table>
    )
}

export {TitleDetailTable}
export type {TitleDetailTableColumn, TitleDetailTableProps, TitleDetailTableRow}
