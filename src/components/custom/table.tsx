import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 테이블(Table) — 컴포넌트 가이드 등 "문서 화면 전용" 데이터 표. Figma "이용권 이력 표" 반영.
// ⚠️ 이 표 스타일은 컴포넌트 가이드 페이지 문서용이며, 실제 프로젝트 화면에는 사용하지 않는다.
//    (프로젝트 화면에 쓰는 표는 별도로 정의한다.) ui/table 은 shadcn 셸이고, 이 컴포넌트는 가이드 문서 전용의
//    데이터 주도(columns·rows) 표다 — props-table 와 같은 계열.
//
// 공통 구조: 헤더 = bg-background(옅은 회색) · foreground(gray.900), 본문 = label-foreground(gray.700),
// 셀 기본 가운데 정렬, 헤더·행 사이 옅은 구분선(subtle-3). size=md(기본)는 헤더·본문 16px와 px-4 py-3,
// size=sm은 색상 가이드 표 기준인 헤더 14px·본문 12px와 px-3 py-2를 쓴다. 셀은 ReactNode 라 배지·버튼 등도
// 그대로 넣는다. 전부 기존 토큰이라 커스텀 색이 없다([PB-04]).
//
// 스타일 분기(variant): 표 외곽 등 변형별로 달라지는 부분만 아래 TABLE_VARIANT_OVERRIDES 에 슬롯 단위로 둔다.
//   - line(현재 유일): 표 상·하단 굵은 진한 라인(border-foreground 2px) + 라운드 없음(Figma).
// 추후 다른 표 스타일이 생기면 TableVariant 에 키를 추가하고, 달라지는 슬롯만 오버라이드에 채우면 된다(나머지는 공통값).
//
// 접근성: 표 이름은 <caption>(sr-only)으로, 열 제목은 <th scope="col"> 로 준다([7.3.2]). 셀 정렬은 열 정의의 align 을 따른다.

type TableAlign = 'start' | 'center' | 'end'

const ALIGN_CLASS: Record<TableAlign, string> = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right',
}

// 표 스타일 변형. 현재는 line 하나뿐이며, 추후 스타일이 늘면 키를 추가한다.
type TableVariant = 'line'
type TableSize = 'sm' | 'md'

// 표의 스타일 슬롯 — 변형에 따라 달라질 수 있는 부분.
type TableSlots = {
    // 스크롤 컨테이너(외곽 테두리·라운드).
    container: string
    // 헤더 행(배경·헤더 아래 구분선).
    headerRow: string
    // 헤더 셀(색·타이포).
    th: string
    // 본문 행(행 사이 구분선).
    bodyRow: string
    // 본문 셀(색·타이포).
    td: string
}

// 모든 변형이 공유하는 기본 슬롯값. 변형은 아래에서 달라지는 슬롯만 덮어쓴다.
const SHARED_SLOTS: TableSlots = {
    container: '',
    headerRow: 'bg-background border-subtle-3 border-b',
    th: 'text-foreground',
    bodyRow: 'border-subtle-3 border-b last:border-b-0',
    td: 'text-label-foreground',
}

// 변형별 오버라이드 — 지정한 슬롯만 SHARED_SLOTS 를 대체한다.
const TABLE_VARIANT_OVERRIDES: Record<TableVariant, Partial<TableSlots>> = {
    // 상·하단 굵은 진한 라인 + 라운드 없음(Figma 데이터 표 기본).
    line: {container: 'border-foreground border-y-2'},
}

const TABLE_SIZE_SLOTS: Record<TableSize, Pick<TableSlots, 'th' | 'td'>> = {
    sm: {
        th: 'typo-body-l-medium px-3 py-2',
        td: 'typo-caption-regular px-3 py-2',
    },
    md: {
        th: 'typo-body-xl-medium px-4 py-3',
        td: 'typo-body-xl-regular px-4 py-3',
    },
}

type TableColumn = {
    // 열 식별 키(React key·셀 매칭용).
    key: string
    // 열 제목.
    header: ReactNode
    // 이 열(헤더·본문 셀) 정렬. 기본 center(Figma).
    align?: TableAlign
    // 셀 줄바꿈 허용 여부. 기본 false(한 줄 고정 — 데이터가 짧은 표). 긴 설명 열엔 true 를 줘 줄바꿈시킨다.
    wrap?: boolean
    // 이 열의 본문 셀을 행 머리글(<th scope="row">)로 렌더할지. 토큰 이름 등 행을 대표하는 열에 준다([7.3.2]).
    rowHeader?: boolean
}

type TableRowData = {
    // 행 식별 키(React key).
    key: string
    // 열 순서대로의 셀. 문자열·배지·버튼 등 ReactNode.
    cells: readonly ReactNode[]
}

type TableProps = {
    // 표의 접근 가능한 이름(sr-only caption).
    caption: string
    columns: readonly TableColumn[]
    rows: readonly TableRowData[]
    // 표 스타일 변형. 현재 line 하나(상·하단 굵은 라인). 추후 스타일이 늘면 확장한다.
    variant?: TableVariant
    // 표의 밀도. md가 기존 기본 크기이며, sm은 색상 가이드 표의 타이포 크기를 따른다.
    size?: TableSize
    className?: string
}

const Table = ({caption, columns, rows, variant = 'line', size = 'md', className}: TableProps) => {
    const slots = {...SHARED_SLOTS, ...TABLE_VARIANT_OVERRIDES[variant]}
    const sizeSlots = TABLE_SIZE_SLOTS[size]

    return (
        <div className={cn('overflow-x-auto', slots.container, className)}>
            <table className="w-full">
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr className={slots.headerRow}>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={cn(
                                    slots.th,
                                    sizeSlots.th,
                                    ALIGN_CLASS[col.align ?? 'center'],
                                    col.wrap ? 'whitespace-normal' : 'whitespace-nowrap',
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.key} className={slots.bodyRow}>
                            {row.cells.map((cell, ci) => {
                                const col = columns[ci]
                                const cellClass = cn(
                                    slots.td,
                                    sizeSlots.td,
                                    ALIGN_CLASS[col?.align ?? 'center'],
                                    col?.wrap ? 'whitespace-normal' : 'whitespace-nowrap',
                                )
                                // 행 머리글 열은 <th scope="row">(그 외는 <td>). 스타일은 동일.
                                return col?.rowHeader ? (
                                    <th key={col.key} scope="row" className={cellClass}>
                                        {cell}
                                    </th>
                                ) : (
                                    <td key={col?.key ?? String(ci)} className={cellClass}>
                                        {cell}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {Table}
export type {TableColumn, TableRowData, TableProps, TableAlign, TableVariant, TableSize}
