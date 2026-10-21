import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 두 값 막대 표(DualBarTable) — 항목마다 두 값(예: 기업수 · 특허수)을 가로 막대 + 숫자로 나란히 적는 표.
// K-BIGx 보고서 인쇄본 기술혁신정보 "매출 규모별 기업 및 특허 현황".
// (가운데 축에서 좌우로 뻗는 웹 화면용 막대는 ButterflyBarChart.)
//
// 짜임(템플릿 기준)
//   표 = 위 굵은 선 · 머리 줄(옅은 면) · 줄마다 아래 옅은 선. 첫 칸은 항목 이름(굵게), 다음 두 칸은 [막대 | 숫자].
//   막대 = 열마다 가장 큰 값이 막대 칸 폭의 78% — 숫자와 막대 끝 사이에 여백을 남긴다. 나머지는 그 값에 비례한다.
// 데이터에 따라
//   · 값이 0 이면 막대를 그리지 않고 숫자 0 만 적는다. 열의 값이 모두 0 이면 막대가 없다.
//   · 음수는 0 으로 보고 막대를 그리지 않는다(숫자는 받은 그대로 적는다).
//   · 항목이 없으면 emptyText 한 줄만 보인다.
// 표(table)라 화면 낭독기가 칸 이름과 값을 그대로 읽는다. 막대는 숫자를 보조하는 꾸밈이라 숨긴다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다.
//
// [프론트엔드 연동] data 는 화면에 그릴 순서(예: 매출 규모 작은 순)로 넘긴다. 막대 색은 열 color(CSS 색 값)로,
//   글자 · 선 모양은 className 들로 넘긴다(웹 화면은 시맨틱 클래스 기본값, 인쇄본은 kbx 클래스).

type DualBarTableColumn = {
    /** 머리 칸 이름(예: '기업수'). */
    title: string
    /** 막대 색(CSS 색 값). */
    color: string
}

type DualBarTableItem = {
    id: string
    label: ReactNode
    /** 왼쪽 · 오른쪽 열 값. */
    left: number
    right: number
}

type DualBarTableProps = {
    /** 표 이름(화면에 보이지 않는 caption)[7.3.2]. */
    caption: string
    /** 첫 열 머리 이름(예: '매출 규모'). */
    categoryTitle: string
    left: DualBarTableColumn
    right: DualBarTableColumn
    data: readonly DualBarTableItem[]
    /** 항목이 없을 때 문구. */
    emptyText?: string
    className?: string
    // 아래 클래스는 주면 기본값을 대신한다(섞지 않는다 — 인쇄본 kbx 클래스와 웹 기본 클래스가 겹치지 않게).
    /** 표 글자 크기 · 색 · 위 선. 기본 typo-body-l-regular text-foreground border-t-2 border-primary. */
    tableClassName?: string
    /** 머리 칸 바탕 · 글자 · 위아래 여백. 기본 bg-muted text-primary font-bold py-2.5. */
    headClassName?: string
    /** 값 줄 위아래 여백 · 아래 선. 기본 py-2 border-b border-subtle-3. */
    rowClassName?: string
    /** 이름 열 폭(w-*). 기본 w-40. */
    labelWidthClassName?: string
    /** 이름 칸 왼쪽 여백 · 굵기. 기본 pl-3.5 font-bold. */
    labelClassName?: string
    /** 막대 높이(h-*). 기본 h-4. */
    barClassName?: string
    /** 숫자 칸 폭(w-*). 기본 w-20. */
    valueClassName?: string
}

// 가장 큰 값의 막대 길이(막대 칸 폭 대비) — 숫자와 막대 끝 사이 여백.
const BAR_MAX_RATIO = 0.78
const PERCENT = 100

const numberFormat = new Intl.NumberFormat('ko-KR')

// 값 → 막대 길이(%) — 열의 가장 큰 값 기준. 0 이하는 0.
const barPercent = (value: number, max: number) => (max > 0 && value > 0 ? (value / max) * BAR_MAX_RATIO * PERCENT : 0)

const DualBarTable = ({
    caption,
    categoryTitle,
    left,
    right,
    data,
    emptyText = '표시할 데이터가 없습니다.',
    className,
    tableClassName,
    headClassName,
    rowClassName,
    labelWidthClassName,
    labelClassName,
    barClassName,
    valueClassName,
}: DualBarTableProps) => {
    const maxLeft = Math.max(0, ...data.map((item) => item.left))
    const maxRight = Math.max(0, ...data.map((item) => item.right))
    const headCell = cn('text-center', headClassName ?? 'bg-muted text-primary py-2.5 font-bold')
    const rowCell = rowClassName ?? 'border-subtle-3 border-b py-2'
    // 값 칸 왼쪽 여백 = 열 사이 간격(32).
    const valueCell = (value: number, percent: number, color: string) => (
        <td className={cn(rowCell, 'pl-8')}>
            <div className="flex items-center gap-2.5">
                <svg aria-hidden="true" className={cn('block min-w-0 flex-1', barClassName ?? 'h-4')}>
                    {percent > 0 ? <rect width={`${percent}%`} height="100%" fill={color} /> : null}
                </svg>
                <span className={cn('shrink-0 text-right', valueClassName ?? 'w-20')}>
                    {numberFormat.format(value)}
                </span>
            </div>
        </td>
    )

    return (
        <table
            className={cn(
                'w-full table-fixed border-collapse',
                tableClassName ?? 'typo-body-l-regular text-foreground border-primary border-t-2',
                className,
            )}
        >
            <caption className="sr-only">{caption}</caption>
            <colgroup>
                <col className={labelWidthClassName ?? 'w-40'} />
                <col />
                <col />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col" className={headCell}>
                        {categoryTitle}
                    </th>
                    {/* 머리 이름은 값 칸 가운데(왼쪽 여백 32 를 뺀 자리)에 놓인다. */}
                    <th scope="col" className={cn(headCell, 'pl-8')}>
                        {left.title}
                    </th>
                    <th scope="col" className={cn(headCell, 'pl-8')}>
                        {right.title}
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.length ? (
                    data.map((item) => (
                        <tr key={item.id}>
                            <th
                                scope="row"
                                className={cn(rowCell, 'text-left break-keep', labelClassName ?? 'pl-3.5 font-bold')}
                            >
                                {item.label}
                            </th>
                            {valueCell(item.left, barPercent(item.left, maxLeft), left.color)}
                            {valueCell(item.right, barPercent(item.right, maxRight), right.color)}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className={cn(rowCell, 'text-foreground-subtle py-10 text-center')}>
                            {emptyText}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export {DualBarTable}
export type {DualBarTableColumn, DualBarTableItem, DualBarTableProps}
