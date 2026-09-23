import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

// K-BIGx 기업혁신성장 보고서의 탭 화면(진단브리핑 · 기업현황 …)이 함께 쓰는 조각 — 구획 제목 · 카드 · 수치 상자 · 표 · 등급 뱃지.
// 서버 · 클라이언트 어디서나 쓸 수 있게 'use client' 없이 둔다(상태 · 이벤트가 없다).

// 구획 제목 줄 — 20 Bold 제목 · 16 Medium 보조(업종) · 오른쪽 14 Regular 날짜. 보조 · 날짜는 제목 높이의 세로 가운데.
// 보조 · 날짜는 구획마다 있을 때만 넘긴다(기업 정보는 제목만 · 기술혁신정보는 보조까지).
// 보조가 길면 제목 옆에 남은 폭에서 어절 단위로 접히고, 그래도 모자라면 제목 아래 줄로 내려간다.
const SectionTitle = ({title, aside, date, id}: {title: string; aside?: string; date?: string; id: string}) => (
    <div className="flex break-after-avoid flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h3
            id={id}
            className="typo-title-l-bold text-foreground flex min-w-0 flex-wrap items-center gap-x-2 break-keep"
        >
            {title}
            {aside ? (
                <span className="typo-body-xl-medium text-label-foreground min-w-0 wrap-anywhere">{aside}</span>
            ) : null}
        </h3>
        {date ? <p className="typo-body-l-regular text-foreground-subtle shrink-0">{date}</p> : null}
    </div>
)

// 흰 카드 — 테두리 gray.100 · 반경 8 · 여백 24. 제목(16 Bold)과 오른쪽 보조 문구(14 Regular).
const Card = ({
    title,
    aside,
    description,
    className,
    children,
}: {
    /** 없으면 제목 줄에 보조 문구만 오른쪽에 둔다(혁신성장역량지수 점수 카드). */
    title?: string
    aside?: ReactNode
    /** 제목 아래 설명 한 줄(14 Regular, 간격 8). */
    description?: ReactNode
    className?: string
    children: ReactNode
}) => (
    <section
        className={cn(
            'border-subtle-3 bg-card @container flex min-w-0 break-inside-avoid flex-col gap-6 rounded-sm border p-6',
            className,
        )}
    >
        {/* 제목도 보조 문구도 없으면 제목 줄을 두지 않는다 — 빈 줄과 간격(24)이 내용을 아래로 밀지 않게. */}
        {title || aside ? (
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    {title ? <h4 className="typo-body-xl-bold text-foreground break-keep">{title}</h4> : null}
                    {aside ? (
                        <div className="typo-body-l-regular text-foreground-subtle ms-auto shrink-0 text-end">
                            {aside}
                        </div>
                    ) : null}
                </div>
                {description ? <div className="typo-body-l-regular text-foreground-subtle">{description}</div> : null}
            </div>
        ) : null}
        {children}
    </section>
)

// 수치 상자 — 옅은 회색 면(gray.10) · 반경 8 · 여백 16/20 · 이름 14(아이콘 16 · 간격 8) 바로 아래 큰 숫자 20 Bold + 단위 16.
// 이름 줄과 숫자 줄 사이 간격은 없다.
// 상자 묶음은 카드 안쪽 폭이 384(@sm) 미만이면 1열로 쌓는다 — 화면 폭이 아니라 카드 폭 기준이라, 태블릿처럼 카드가
// 둘씩 놓여 좁아질 때도 2열로 끼지 않는다(2열이면 상자 폭이 135 안팎이라 이름 · 숫자가 한 글자씩 접힌다).
// labelClassName — 이름 줄 글자를 바꿀 때(정부 R&D 부처명은 13 · gray.500).
const StatBox = ({
    label,
    value,
    unit,
    icon,
    labelClassName = 'typo-body-l-regular text-label-foreground',
    valueClassName = 'text-foreground',
    className,
}: {
    label: string
    value: string
    /** 없으면(값이 '-' 일 때 등) 단위를 그리지 않는다. */
    unit?: string
    icon?: ReactNode
    labelClassName?: string
    /** 값 글자색 — 기본 foreground. 없는 상태(미인증 등)는 흐린 색을 넘긴다. */
    valueClassName?: string
    /** 상자 면 — 기본은 카드 안의 옅은 회색. 카드 없이 문서 바탕에 바로 놓일 때는 bg-card 를 넘긴다. */
    className?: string
}) => (
    // 이름 · 값 한 쌍이라 dl 로 적는다 — 값만 있는 문단(굵은 20)은 검사 도구가 제목으로 오인한다(WAVE '가능한 제목').
    <dl className={cn('bg-surface-subtle flex flex-col rounded-sm px-5 py-4', className)}>
        <dt className={cn('flex items-center gap-2', labelClassName)}>
            {icon}
            {/* 이름이 길면 어절 단위로 접히고, 띄어쓰기 없는 긴 이름은 칸 안에서 끊는다. 아이콘은 이름 옆 세로 가운데. */}
            <span className="min-w-0 wrap-anywhere break-keep">{label}</span>
        </dt>
        <dd className="m-0 text-end">
            <span className={cn('typo-title-l-bold', valueClassName)}>{value}</span>
            {unit ? <span className="typo-body-xl-regular text-label-foreground ms-1">{unit}</span> : null}
        </dd>
    </dl>
)

// 소제목 묶음(경영진 현황 · 우수특허 …) — 카드 없이 문서 바탕에 놓이는 표 · 그래프 위 제목 줄. 16 Bold 제목 · 오른쪽 14 Regular 보조
// (단위 · 기준일), 필요하면 아래 설명 한 줄(14 Regular, 간격 8). 제목 줄과 내용 사이 간격은 8.
const SubBlock = ({
    title,
    aside,
    description,
    titleClassName = 'typo-body-xl-bold',
    status,
    children,
}: {
    title: string
    /** 제목 바로 옆 상태 글(14 Regular · gray.500, 간격 4) — 기업신용정보 표의 '해당없음' 등. */
    status?: string
    aside?: ReactNode
    description?: ReactNode
    /** 제목 글자 — 한 단계 아래 소제목(예: 접수중과제)은 'typo-body-l-medium'. */
    titleClassName?: string
    children: ReactNode
}) => (
    <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4 className={cn(titleClassName, 'text-foreground')}>
                    {title}
                    {status ? <span className="typo-body-l-regular text-foreground-subtle ms-1">{status}</span> : null}
                </h4>
                {aside ? <p className="typo-body-l-regular text-foreground-subtle">{aside}</p> : null}
            </div>
            {description ? <div className="typo-body-l-regular text-foreground-subtle">{description}</div> : null}
        </div>
        {children}
    </div>
)

// 안내 상자 — 옅은 남색 면(navy.100) · 테두리 navy.200 · 반경 8 · 여백 16/20 · 16 Regular(navy.600).
const NoticeBox = ({children, className}: {children: ReactNode; className?: string}) => (
    <div
        className={cn(
            'border-navy-200 bg-navy-100 text-navy-600 typo-body-xl-regular rounded-sm border px-5 py-4 break-keep',
            className,
        )}
    >
        {children}
    </div>
)

// 표 아래 주석(* …) — 12 Regular, 표와 간격 8.
const TableNote = ({children}: {children: ReactNode}) => (
    <p className="typo-caption-regular text-foreground-subtle break-keep">{children}</p>
)

// 보고서 표 — 맨 위 선 gray.600 · 줄마다 아래 선(gray.100) · 머리 줄은 옅은 파란 면에 14 Bold · 값 칸은 흰 면에 14 Regular(gray.700) 가운데 정렬.
// 줄 높이는 칸 여백 12 + 글자 21(뱃지가 있는 줄은 뱃지 높이만큼 늘어난다).
// 두 단 머리 — 열에 group 을 주면 같은 group 이 이어진 열 위에 묶음 칸(예: 매출비중)을 한 줄 더 두고, 나머지 열은 두 줄을 합친다.
// 묶음 칸과 그 아래 칸에는 세로선(gray.100)을 두어 묶음 범위를 보인다 — 머리에만 있고 값 줄에는 없다.
// 좁은 화면에서는 열이 찌그러지지 않게 표 상자 안에서 가로로 넘긴다(minWidthClassName).
type ReportTableColumn = {
    key: string
    /** 머리 칸 글. 비공개 열은 PrivateCell 로 감싸 넘길 수 있다. */
    label: ReactNode
    /** 두 단 머리의 묶음 이름 — 같은 값이 이어진 열끼리 묶인다. */
    group?: string
    /** 열 폭(예: 'w-55'). 없으면 남은 폭을 다른 열과 똑같이 나눈다. */
    widthClassName?: string
    /** 값 칸 정렬 — 긴 글(특허명 · 공고명)은 'start'(왼쪽). 머리 칸은 늘 가운데다. */
    align?: 'center' | 'start'
    /**
     * 값을 한 줄로 유지 — 칸 폭에 거의 꽉 차는 값(접수기간 · 공고명 등)이 여백 때문에 두 줄로 접혀 줄이 높아지지 않게,
     * 좌우 여백을 4 로 줄이고 줄바꿈을 막는다. 칸보다 긴 값이 들어올 수 있는 열에는 쓰지 않는다.
     */
    isNoWrap?: boolean
    /** 줄 이름 열 — 값 칸 대신 줄 머리(th scope=row)로 그리고 머리 줄과 같은 옅은 파랑 면 · 14 Medium(gray.900)으로 적는다(예: 기관별 비중의 구분). */
    isRowHeader?: boolean
}

// 합계 줄 칸 — 머리 줄과 같은 파란 면 · 굵은 글자. colSpan 으로 앞 칸을 합칠 수 있다(예: No + 기관명 → '합계').
type ReportTableFooterCell = {
    key: string
    content: ReactNode
    colSpan?: number
}

type ReportTableRow = {
    id: string
    cells: Record<string, ReactNode>
}

// 줄 높이 45(글자 줄 21 + 위 12 · 아래 11 + 아래 선 1) — 위아래 여백을 12 · 11 로 나눠 선까지 합친 한 줄이 45 가 되게 한다.
const REPORT_TABLE_CELL_CLASS_NAME = 'border-subtle-3 border-b px-2 pt-3 pb-2.75 text-center md:px-4'
const REPORT_TABLE_HEAD_CLASS_NAME = cn(
    REPORT_TABLE_CELL_CLASS_NAME,
    'bg-primary-subtle typo-body-l-bold text-foreground whitespace-nowrap',
)

const ReportTable = ({
    caption,
    columns,
    rows,
    footerCells,
    minWidthClassName = 'min-w-120',
    emptyText,
    className,
}: {
    /** 화면 낭독기용 표 이름(단위 포함 권장). */
    caption: string
    columns: ReportTableColumn[]
    rows: ReportTableRow[]
    /** 합계 줄. 없으면 그리지 않는다. */
    footerCells?: ReportTableFooterCell[]
    /** 좁은 화면에서 지킬 표 최소 폭 — 이보다 좁으면 표 상자 안에서 가로로 넘긴다. */
    minWidthClassName?: string
    /** 줄이 없을 때 모든 열을 합친 한 줄에 적을 문구(예: 해당사항 없음). 없으면 빈 몸통을 둔다. */
    emptyText?: string
    className?: string
}) => {
    const hasGroup = columns.some((column) => column.group)
    // 두 단 머리의 윗줄 — 묶이지 않은 열은 두 줄을 합치고(rowSpan 2), 묶인 열은 처음 열에서 한 칸으로 합친다(colSpan).
    const topRow = columns.flatMap((column, index) => {
        if (!column.group) return [{key: column.key, label: column.label, colSpan: 1, rowSpan: hasGroup ? 2 : 1}]
        if (columns[index - 1]?.group === column.group) return []
        const span = columns.slice(index).findIndex((next) => next.group !== column.group)
        return [
            {
                key: `group-${column.group}`,
                label: column.group,
                colSpan: span === -1 ? columns.length - index : span,
                rowSpan: 1,
            },
        ]
    })
    const groupedColumns = columns.filter((column) => column.group)

    return (
        <div className={cn('border-t-foreground-subtle overflow-x-auto border-t contain-inline-size', className)}>
            <table className={cn('w-full table-fixed border-collapse', minWidthClassName)}>
                <caption className="sr-only">{caption}</caption>
                {columns.some((column) => column.widthClassName) ? (
                    <colgroup>
                        {columns.map((column) => (
                            <col key={column.key} className={column.widthClassName} />
                        ))}
                    </colgroup>
                ) : null}
                <thead>
                    <tr>
                        {topRow.map((cell) => (
                            <th
                                key={cell.key}
                                scope={cell.colSpan > 1 ? 'colgroup' : 'col'}
                                colSpan={cell.colSpan}
                                rowSpan={cell.rowSpan}
                                // 묶음 칸은 양옆에 세로선을 둔다 — 아래 연도 칸들과 함께 묶음 범위가 보이게(값 줄에는 세로선이 없다).
                                className={cn(REPORT_TABLE_HEAD_CLASS_NAME, cell.colSpan > 1 && 'border-x')}
                            >
                                {cell.label}
                            </th>
                        ))}
                    </tr>
                    {hasGroup ? (
                        <tr>
                            {groupedColumns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    // 묶음 아래 칸끼리는 세로선으로 나눈다.
                                    className={cn(REPORT_TABLE_HEAD_CLASS_NAME, 'typo-body-l-medium border-x')}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    ) : null}
                </thead>
                <tbody>
                    {!rows.length && emptyText ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={cn(
                                    REPORT_TABLE_CELL_CLASS_NAME,
                                    'bg-card typo-body-l-regular text-label-foreground',
                                )}
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : null}
                    {rows.map((row) => (
                        <tr key={row.id}>
                            {columns.map((column) => {
                                const cellClassName = cn(
                                    REPORT_TABLE_CELL_CLASS_NAME,
                                    // 값 칸은 흰 면 — 카드 밖(문서 바탕 회색) 위에 놓여도 표가 흰 바탕으로 보이게.
                                    'break-keep tabular-nums',
                                    column.isRowHeader
                                        ? 'bg-primary-subtle typo-body-l-medium text-foreground'
                                        : 'bg-card typo-body-l-regular text-label-foreground',
                                    column.align === 'start' && 'text-start',
                                    column.isNoWrap && 'px-1 whitespace-nowrap md:px-1',
                                )
                                return column.isRowHeader ? (
                                    <th key={column.key} scope="row" className={cellClassName}>
                                        {row.cells[column.key]}
                                    </th>
                                ) : (
                                    <td key={column.key} className={cellClassName}>
                                        {row.cells[column.key]}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
                {footerCells ? (
                    <tfoot>
                        <tr>
                            {footerCells.map((cell) => (
                                <td key={cell.key} colSpan={cell.colSpan} className={REPORT_TABLE_HEAD_CLASS_NAME}>
                                    {cell.content}
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                ) : null}
            </table>
        </div>
    )
}

// 신용등급 뱃지 — 옅은 남색 면(navy.100) · 테두리 navy.200 · 반경 8 · 높이 28 · 13 Bold(navy.600).
const GradeBadge = ({grade}: {grade: string}) => (
    <span className="border-navy-200 bg-navy-100 text-navy-600 typo-body-m-bold inline-flex h-7 items-center rounded-sm border px-3">
        {grade}
    </span>
)

export {Card, GradeBadge, NoticeBox, ReportTable, SectionTitle, StatBox, SubBlock, TableNote}
export type {ReportTableColumn, ReportTableFooterCell, ReportTableRow}
