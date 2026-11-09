import Image from 'next/image'
import {CircleCheck, Minus} from 'lucide-react'
import {cn} from '@/lib/utils'

// 플랜 비교표(PlanComparisonTable) — 이용권(플랜)을 열로, 비교 항목을 행으로 놓고 조건을 견주는 표.
// 예: 가격정책 [K-BIGx 보고서] · 기업회원의 "플랜별 비교"(열 · 행은 pricing.ts 의 buildPlanComparison 이 만든다).
//
// 칸 값: 글자 · {status: 'included'}(제공 — 파란 체크) · {status: 'none'}(해당 없음 — 줄표).
// isHighlighted 행은 옅은 파란 면 · 파란 항목 이름이다. 값은 오른쪽 정렬.
//
// 좁은 화면: 칸 좌우 여백이 20 → 12(1280 미만)로 줄고, 그래도 넘치면 표만 가로로 스크롤한다(항목 이름 열은 왼쪽 고정).
// 스크롤 상자의 두 클래스는 지우지 않는다 — 없으면 모바일 페이지 전체에 가로 스크롤이 생긴다.
//   · contain-inline-size — 표의 최소 폭이 바깥 레이아웃을 넓히지 않게 한다.
//   · relative — 칸 안 sr-only 글자(position:absolute)가 스크롤 상자 밖으로 빠지지 않게 한다.
//
// 접근성: caption(sr-only) · th scope=col/row[7.3.2], 체크는 "제공"을 sr-only 로 읽힌다[5.3.1],
// 스크롤 상자는 탭 순서에 넣어 키보드로 민다[6.1.1].

type PlanComparisonColumn = {
    id: string
    name: string
    /** 이름 아래 작은 글자. 예: 무료 · 유료 */
    description?: string
    /** 이름 앞 그림(20) — 꾸밈이다. */
    iconSrc?: string
}
type PlanComparisonCell = string | {status: 'included' | 'none'}
type PlanComparisonRow = {
    label: string
    /** 옅은 파란 면으로 강조하는 행. */
    isHighlighted?: boolean
    /** columns 와 같은 순서의 칸 값. */
    cells: readonly PlanComparisonCell[]
}

type PlanComparisonTableProps = {
    /** 표 이름 — 화면에는 숨기고 스크린리더와 스크롤 상자 이름으로 쓴다. */
    caption: string
    /** 항목 이름 열의 제목. 예: 비교 항목 */
    rowHeader: string
    columns: readonly PlanComparisonColumn[]
    rows: readonly PlanComparisonRow[]
    className?: string
}

const NONE_LABEL = '해당 없음'
const INCLUDED_LABEL = '제공'

const CellValue = ({cell}: {cell: PlanComparisonCell}) => {
    if (typeof cell === 'string') return cell
    if (cell.status === 'none') {
        return (
            <span className="typo-body-l-regular text-foreground-subtle inline-flex items-center gap-1 align-middle">
                <Minus aria-hidden="true" className="size-icon-md" />
                {NONE_LABEL}
            </span>
        )
    }
    return (
        <span className="inline-flex align-middle">
            {/* 채운 파란 원 + 흰 체크 — 원의 선과 체크를 흰색(primary-foreground)으로, 면을 primary 로 칠한다. */}
            <CircleCheck aria-hidden="true" className="fill-primary text-primary-foreground size-icon-md" />
            <span className="sr-only">{INCLUDED_LABEL}</span>
        </span>
    )
}

const PlanComparisonTable = ({caption, rowHeader, columns, rows, className}: PlanComparisonTableProps) => (
    <div
        role="region"
        aria-label={caption}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 스크롤 상자의 키보드 접근
        tabIndex={0}
        className={cn(
            'bg-card border-subtle-3 outline-ring focus-visible:outline-ring relative overflow-x-auto rounded-lg border contain-inline-size focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
            className,
        )}
    >
        <table className="w-full border-collapse whitespace-nowrap">
            <caption className="sr-only">{caption}</caption>
            <thead>
                <tr className="border-subtle-3 border-b">
                    {/* 항목 이름 열은 넓게(1/5), 나머지 열은 같은 폭으로 나눈다. */}
                    <th
                        scope="col"
                        className="bg-card typo-body-xl-bold text-foreground sticky left-0 w-1/5 px-3 py-4 text-left xl:px-5"
                    >
                        {rowHeader}
                    </th>
                    {columns.map((column) => (
                        <th key={column.id} scope="col" className="h-20 px-3 py-4 text-right align-middle xl:px-5">
                            <span className="flex flex-col items-end gap-0.5">
                                <span className="typo-body-xl-bold text-foreground inline-flex items-center gap-2">
                                    {column.iconSrc ? (
                                        <Image
                                            src={column.iconSrc}
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="size-icon-md shrink-0"
                                        />
                                    ) : null}
                                    {column.name}
                                </span>
                                {column.description ? (
                                    <span className="typo-body-l-regular text-foreground-subtle">
                                        {column.description}
                                    </span>
                                ) : null}
                            </span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr
                        key={row.label}
                        className={cn(
                            'border-subtle-3 typo-body-l-medium border-b last:border-b-0',
                            row.isHighlighted ? 'bg-primary-subtle' : 'bg-card',
                        )}
                    >
                        {/* sticky 칸은 가로 스크롤 때 뒤 칸이 비치지 않게 행과 같은 면을 다시 깐다. */}
                        <th
                            scope="row"
                            className={cn(
                                'typo-body-l-medium sticky left-0 h-12 px-3 text-left xl:px-5',
                                row.isHighlighted ? 'bg-primary-subtle text-primary-strong' : 'bg-card text-foreground',
                            )}
                        >
                            {row.label}
                        </th>
                        {row.cells.map((cell, index) => (
                            <td
                                key={columns[index]?.id ?? index}
                                className="text-label-foreground h-12 px-3 text-right align-middle xl:px-5"
                            >
                                <CellValue cell={cell} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

export {PlanComparisonTable}
export type {PlanComparisonCell, PlanComparisonColumn, PlanComparisonRow, PlanComparisonTableProps}
