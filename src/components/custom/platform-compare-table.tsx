import type {ReactNode} from 'react'
import Link from 'next/link'
import {
    platformCompareActionVariants,
    platformCompareBadgeVariants,
    platformCompareDotVariants,
    platformCompareHeadVariants,
    platformCompareNameVariants,
    platformCompareRowVariants,
} from '@/components/theme/platform-compare-table.variants'
import type {EvaluationModelTone} from '@/content/service/evaluation-model-selection'
import type {ModelCompareRow} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// 평가모형 비교표 — 모형마다 한 줄(머리 칸 = 그림 · 모형 이름 · 부제), 칸은 평가 목적 · 주요 평가 관점 · 제공 유형 · 평가 신청.
//   · 둥근 16(PC 표 전체 · 1280 미만 줄 카드), 칸 여백 20 · 22(1280 미만 12 · 20), 칸 사이 · 줄 사이 옅은 선(platform-panel-border).
//   · PC(1280↑): 표. 머리 줄은 서비스 채움색(--platform-tone-fill, 화면 <main> 이 정한다 · 없으면 platform-accent) · 흰 글자 · 가운데.
//     모형 머리 칸은 모형 옅은 면, 칸 사이 세로선, 칸 값은 세로 가운데. 줄에 마우스를 올리면 칸이 모형 옅은 면 55% 로 물든다.
//   · 1280 미만: 줄마다 카드(모형 색 35% 테두리)로 쌓는다. 머리 줄은 숨기고(sr-only) 칸 위에 칸 이름을 보여 준다 —
//     카드로 쌓으면 브라우저가 표 구조를 읽지 않으므로 칸 이름은 보이는 글로 둔다.
//   · 모형 색(파랑 · 민트 · 주황) — 이름 · 목록 점 · 제공 유형 배지 · 평가 신청 링크 테두리. 색은 꾸밈이고 이름이 글로 함께 있다[5.3.1].
//   · 표 이름은 caption(sr-only)[7.3.2]. 스타일은 theme/platform-compare-table.variants.ts.
// 쓰는 곳: custom/platform-technology-evaluation.tsx.

type PlatformCompareRow = ModelCompareRow & {
    tone: EvaluationModelTone
    /** 머리 칸 그림(next/image, alt=""). */
    image?: ReactNode
    /** 평가 신청 링크 주소. 글은 actionLabel. */
    href: string
}

type PlatformCompareColumns = {model: string; goal: string; view: string; type: string; action: string}

// 칸 — 1280 미만은 카드 안 한 칸(위 칸 이름 + 내용), PC 는 표 칸(사이 세로선).
const CELL_CLASS =
    'border-platform-panel-border block px-5 py-3 max-xl:border-t xl:table-cell xl:border-l xl:px-5.5 xl:py-5 xl:align-middle'

// 칸 이름 — 1280 미만에서만 보인다(머리 줄 대신).
const ColLabel = ({children}: {children: string}) => (
    <span className="typo-body-m-bold text-foreground-subtle mb-1 block xl:hidden">{children}</span>
)

// 점 목록 — 점은 모형 색.
const DotList = ({items, tone}: {items: readonly string[]; tone: EvaluationModelTone}) => (
    <ul className="flex flex-col gap-1">
        {items.map((text) => (
            <li key={text} className={cn('flex gap-1.5 break-keep', platformCompareDotVariants({tone}))}>
                {text}
            </li>
        ))}
    </ul>
)

const PlatformCompareTable = ({
    rows,
    columns,
    caption,
    className,
}: {
    rows: readonly PlatformCompareRow[]
    columns: PlatformCompareColumns
    caption: string
    className?: string
}) => (
    <div
        className={cn(
            'xl:bg-platform-panel xl:border-platform-panel-border xl:overflow-hidden xl:rounded-lg xl:border',
            className,
        )}
    >
        <table className="typo-body-xl-regular text-label-foreground block w-full border-collapse xl:table xl:table-fixed">
            <caption className="sr-only">{caption}</caption>
            {/* 칸 폭(시안) — 모형 140 · 관점 27% · 유형 16% · 신청 14%, 평가 목적은 남은 폭 전부. 열 비율이라 grid 구조 예외(SC-01). */}
            <colgroup className="max-xl:hidden">
                <col className="w-35" />
                <col />
                <col className="w-[27%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
            </colgroup>
            <thead className="max-xl:sr-only">
                <tr className="typo-body-xl-bold bg-[var(--platform-tone-fill,var(--color-platform-accent))] text-white">
                    {[columns.model, columns.goal, columns.view, columns.type, columns.action].map((column) => (
                        <th key={column} scope="col" className="px-5.5 py-5 text-center">
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="flex flex-col gap-3.5 xl:table-row-group">
                {rows.map((row) => {
                    const [firstType, ...restTypes] = row.types
                    return (
                        <tr
                            key={row.modelId}
                            className={cn(
                                'max-xl:bg-platform-panel border-platform-panel-border block overflow-hidden max-xl:rounded-lg max-xl:border xl:table-row xl:border-t',
                                platformCompareRowVariants({tone: row.tone}),
                            )}
                        >
                            <th
                                scope="row"
                                className={cn(
                                    'flex items-center gap-3 px-5 py-4 text-left xl:table-cell xl:px-5.5 xl:py-5 xl:align-middle',
                                    platformCompareHeadVariants({tone: row.tone}),
                                )}
                            >
                                {row.image ? (
                                    <span aria-hidden="true" className="block h-11 w-13 shrink-0 xl:mb-2.5">
                                        {row.image}
                                    </span>
                                ) : null}
                                <span className="typo-title-m-bold block">
                                    <span className={cn('block', platformCompareNameVariants({tone: row.tone}))}>
                                        {row.name}
                                    </span>
                                    <span className="typo-body-m-bold text-foreground-subtle mt-0.5 block">
                                        {row.subtitle}
                                    </span>
                                </span>
                            </th>
                            <td className={CELL_CLASS}>
                                <ColLabel>{columns.goal}</ColLabel>
                                <span className="break-keep">{row.goal}</span>
                            </td>
                            <td className={CELL_CLASS}>
                                <ColLabel>{columns.view}</ColLabel>
                                <DotList items={row.views} tone={row.tone} />
                            </td>
                            <td className={CELL_CLASS}>
                                <ColLabel>{columns.type}</ColLabel>
                                {/* 배지 아래 첫 줄은 점 없이, 그다음 줄부터 점 목록. */}
                                <span className="flex flex-col items-start gap-1.5">
                                    <b className={platformCompareBadgeVariants({tone: row.tone})}>{row.typeBadge}</b>
                                    {firstType ? <span className="break-keep">{firstType}</span> : null}
                                    {restTypes.length ? <DotList items={restTypes} tone={row.tone} /> : null}
                                </span>
                            </td>
                            <td className={CELL_CLASS}>
                                <ColLabel>{columns.action}</ColLabel>
                                <Link href={row.href} className={platformCompareActionVariants({tone: row.tone})}>
                                    {row.actionLabel}
                                </Link>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
)

export {PlatformCompareTable}
export type {PlatformCompareColumns, PlatformCompareRow}
