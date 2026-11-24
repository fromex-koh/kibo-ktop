import type {ComponentProps} from 'react'

import {Skeleton} from '@/components/ui/skeleton'
import {cn} from '@/lib/utils'

// 항목별 막대 표 — 열마다 평가항목 하나, 줄은 위에서부터 '평가항목 · 항목별 비교(막대) · 신청기업 · PEER 평균'.
// 사용처: investment-model-deep-report.tsx(PEER GROUP(업종) 세부항목비교)
//
// 항목마다 단위와 크기가 달라 막대 칸마다 눈금을 따로 둔다(가로 구분선 없이 숫자만).
// 막대 높이는 그 칸의 마지막 눈금(가장 큰 값)을 100% 로 잡는다.

type PeerItemBarColumn = {
    id: string
    /** 항목 이름 — 머리 칸 첫 줄. */
    label: string
    /** 단위 — 머리 칸 둘째 줄에 괄호로 적는다(예: '년' → '(년)'). */
    unit: string
    /** 눈금 — 0 부터 오름차순. 마지막 값이 막대 칸의 꼭대기다. */
    ticks: readonly number[]
    applicant: number
    average: number
    /** 최소 소수 자릿수 — 1 이면 82 를 82.0 으로 적는다. 소수는 최대 한 자리, 눈금은 정수로 적는다. */
    fractionDigits: number
}

type PeerItemBarTableProps = Omit<ComponentProps<'table'>, 'children'> & {
    /** 표 이름 — 화면에는 숨기고 읽어 준다[7.3.2]. */
    caption: string
    columns: readonly PeerItemBarColumn[]
    applicantLabel?: string
    averageLabel?: string
    /** 값을 불러오는 중. 막대 칸과 수치 칸에 스켈레톤이 선다. */
    isLoading?: boolean
}

// 표 수치의 소수는 한 자리까지다(시안 — 3.2 · 82.0 · 1,850).
const MAX_FRACTION_DIGITS = 1

const formatNumber = (value: number, fractionDigits = 0) =>
    value.toLocaleString('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: Math.max(fractionDigits, MAX_FRACTION_DIGITS),
    })

// 막대 높이 · 눈금 자리(%) — 꼭대기 눈금을 넘는 값은 칸 위로 삐져나가지 않게 100% 에서 멈춘다.
const toPercent = (value: number, max: number) => `${Math.min(Math.max(value / max, 0), 1) * 100}%`

// 칸 테두리는 사방에 긋는다 — 표 맨 위의 진한 선은 tableClassName 처럼 표 위에 얹는다.
const cellClassName = 'border-subtle-3 border'
// 항목 칸은 폭이 좁아(시안 약 80) 좌우 여백 없이 글자를 놓고, 넘치면 낱말 단위로 줄을 바꾼다.
const headCellClassName = cn(
    cellClassName,
    'bg-primary-subtle text-foreground typo-caption-bold px-0 py-2 text-center break-keep',
)
const valueCellClassName = cn(cellClassName, 'typo-caption-regular text-label-foreground px-1 py-2 text-center')

const BarCell = ({column}: {column: PeerItemBarColumn}) => {
    const max = column.ticks.at(-1) ?? 1

    return (
        // 막대는 칸 바닥선에 붙고, 꼭대기 눈금 글자가 칸 위 테두리에 닿지 않도록 위를 16 띄운다.
        <div className="flex h-32 pt-4 pl-0.75">
            {/* 눈금 — 글자를 한 자리에 겹쳐 쌓고 값 높이만큼 올린다. 같은 칸에 겹치므로 가장 긴 숫자가 폭을 정하고
                모두 오른쪽 끝을 맞춘다. 글자 가운데가 눈금 높이에 오고, 0 만 바닥선 위에 앉힌다. */}
            <ul aria-hidden="true" className="typo-micro-regular text-label-foreground grid shrink-0 text-right">
                {column.ticks.map((tick) => (
                    <li
                        key={tick}
                        className={cn('relative col-start-1 row-start-1 self-end', tick > 0 && 'translate-y-1/2')}
                        style={{bottom: toPercent(tick, max)}}
                    >
                        {formatNumber(tick)}
                    </li>
                ))}
            </ul>
            {/* 숫자와 막대 사이 — 10 이고, 칸이 좁으면 4 까지 줄어든다. */}
            <span aria-hidden="true" className="w-2.5 min-w-1 shrink" />
            {/* 수치는 아래 두 줄이 글자로 읽어 주므로 막대는 그림으로만 둔다. */}
            <div aria-hidden="true" className="flex h-full shrink-0 items-end gap-1.5">
                <span className="bg-primary w-3" style={{height: toPercent(column.applicant, max)}} />
                <span className="bg-navy-200 w-3" style={{height: toPercent(column.average, max)}} />
            </div>
        </div>
    )
}

const PeerItemBarTable = ({
    caption,
    columns,
    applicantLabel = '신청기업',
    averageLabel = 'PEER 평균',
    isLoading = false,
    className,
    ...props
}: PeerItemBarTableProps) => (
    <table
        {...props}
        className={cn(
            // 맨 위 진한 가로줄은 칸 테두리와 겹치지 않게 표 위에 얹은 선이다(report-document 의 표와 같은 방식).
            'before:bg-foreground-subtle relative w-full table-fixed border-collapse before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[""]',
            className,
        )}
    >
        <caption className="sr-only">{caption}</caption>
        <colgroup>
            {/* 줄 이름 칸 68(시안) — 나머지는 항목 수만큼 고르게 나눈다. */}
            <col className="w-17" />
            {columns.map((column) => (
                <col key={column.id} />
            ))}
        </colgroup>
        <thead>
            <tr>
                <th scope="col" className={headCellClassName}>
                    평가항목
                </th>
                {columns.map((column) => (
                    <th key={column.id} scope="col" className={headCellClassName}>
                        {column.label}
                        <br />({column.unit})
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row" className={headCellClassName}>
                    항목별 비교
                </th>
                {columns.map((column) => (
                    <td key={column.id} className={cn(cellClassName, 'bg-card p-0 align-bottom')}>
                        {isLoading ? <Skeleton className="m-2 h-28" /> : <BarCell column={column} />}
                    </td>
                ))}
            </tr>
            {[
                {key: 'applicant', label: applicantLabel},
                {key: 'average', label: averageLabel},
            ].map((row) => (
                <tr key={row.key}>
                    <th scope="row" className={headCellClassName}>
                        {row.label}
                    </th>
                    {columns.map((column) => (
                        <td key={column.id} className={cn(valueCellClassName, 'bg-card')}>
                            {isLoading ? (
                                <Skeleton className="mx-auto h-4 w-8" />
                            ) : (
                                formatNumber(
                                    row.key === 'applicant' ? column.applicant : column.average,
                                    column.fractionDigits,
                                )
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)

export {PeerItemBarTable}
export type {PeerItemBarColumn, PeerItemBarTableProps}
