import type {ReactNode} from 'react'
import {Star} from 'lucide-react'
import {cn} from '@/lib/utils'

// 순위 막대 목록(RankBarList) — 제목 아래 항목마다 [이름 | 가로 막대 | 값] 한 줄씩, 끝에 평균 · 조회기업 줄을 둔다.
// K-BIGx 보고서 인쇄본 기술혁신정보 "성장률 우수기업"(매출 100억원 이하 · 초과 두 목록을 나란히).
// (두 목록을 가운데 축에서 좌우로 펼치는 웹 화면용은 DivergingRankChart.)
//
// 짜임(템플릿 기준)
//   위 굵은 선 → 제목 줄(옅은 면) → 값 줄(이름 170 · 막대 · 값 72, 사이 14 · 아래 옅은 선).
//   막대 길이 = 값 ÷ max. 두 목록을 나란히 둘 때는 같은 max 를 넘겨 길이를 견줄 수 있게 한다(rankBarScaleMax).
//   평균 줄 = 위 짙은 선 · 옅은 굵은 글자 · 평균 막대 색. 조회기업 줄 = 옅은 면 · 남색 가장 굵은 글자 · 조회기업 막대 색.
//   강조 항목(isHighlighted — 고성장 기업) = 이름 뒤 별 · 값 굵게.
// 데이터에 따라
//   · 0 이하 값은 막대 없이 값만 적는다. max 를 넘는 값은 막대를 끝까지 채운다.
//   · 이름이 길면 이름 칸 안에서 줄을 바꾼다(줄이 높아진 만큼 행이 높아진다). 띄어쓰기 없는 긴 이름도 칸 안에서 끊는다.
//     renderName 으로 이름 글자를 바꿔 그릴 수 있다(인쇄본은 길면 글자를 줄여 2줄 높이에 맞춘다).
//   · 항목이 없으면 제목 아래 emptyText 한 줄만 보인다.
// 받은 순서대로 그린다(정렬하지 않는다). 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다.
//
// [프론트엔드 연동] items 는 순위 순 → 평균 · 조회기업 순으로 넘긴다. 막대 색은 colors(CSS 색 값)로,
//   글자 · 선 모양은 className 들로 넘긴다(웹 화면은 시맨틱 클래스 기본값, 인쇄본은 kbx 클래스).

type RankBarTone = 'default' | 'average' | 'subject'

type RankBarItem = {
    id: string
    name: string
    value: number
    tone?: RankBarTone
    /** 강조 항목(이름 뒤 별 · 값 굵게) — 예: 고성장 기업. */
    isHighlighted?: boolean
}

type RankBarColors = {
    bar: string
    averageBar: string
    subjectBar: string
    /** 막대 바탕(막대 칸 전체 길이) — 없으면 바탕을 그리지 않는다(기업 유형별 4대 혁신역량 비교는 옅은 면). */
    track?: string
}

type RankBarListProps = {
    title: string
    /** 제목 태그 — 문서의 제목 단계에 맞춘다(기본 h5: 인쇄본 소제목 h4 아래). */
    titleAs?: 'h3' | 'h4' | 'h5' | 'h6'
    items: readonly RankBarItem[]
    /** 막대 끝 값 — 나란히 놓는 목록과 같게 넘긴다. 없으면 이 목록의 rankBarScaleMax. */
    max?: number
    /** 막대 색(CSS 색 값). 넘기지 않은 항목은 웹 화면 색을 쓴다. */
    colors?: Partial<RankBarColors>
    /** 값 글자 형식(기본: '23.5%'). */
    formatValue?: (value: number) => string
    /** 강조 별의 이름(화면 낭독기용). */
    highlightLabel?: string
    emptyText?: string
    /** 빈 줄 모양(여백 · 바탕 · 글자). 기본 text-foreground-subtle py-10 text-center. 인쇄본은 차트 빈 상태(KbxChartEmpty)와 같게. */
    emptyClassName?: string
    className?: string
    // 아래 클래스는 주면 기본값을 대신한다(섞지 않는다 — 인쇄본 kbx 클래스와 웹 기본 클래스가 겹치지 않게).
    /** 위 선 · 글자 크기 · 색. 기본 typo-body-l-regular text-foreground border-t-2 border-primary. */
    listClassName?: string
    /** 제목 줄. 기본 bg-muted text-primary typo-body-xl-bold px-3.5 py-2.5. */
    titleClassName?: string
    /** 값 줄 여백 · 아래 선. 기본 py-2 border-b border-subtle-3. */
    rowClassName?: string
    /** 평균 줄(값 줄 클래스에 더한다). 기본 border-t-2 border-t-foreground text-foreground-subtle font-bold. */
    averageRowClassName?: string
    /** 조회기업 줄(값 줄 클래스에 더한다). 기본 bg-muted text-primary font-extrabold. */
    subjectRowClassName?: string
    /** 이름 칸 폭 · 왼쪽 여백. 기본 w-40 pl-3.5. */
    nameClassName?: string
    /** 막대 높이. 기본 h-4. */
    barClassName?: string
    /** 값 칸 폭. 기본 w-18. */
    valueClassName?: string
    /** 강조 값 굵기. 기본 font-bold. */
    highlightValueClassName?: string
    /** 강조 별 크기 · 색. 기본 size-5 text-warning fill-current. */
    highlightIconClassName?: string
    /** 이름 글자 그리기 — 없으면 이름을 그대로 적는다. */
    renderName?: (name: string) => ReactNode
}

const DEFAULT_COLORS: RankBarColors = {
    bar: 'var(--ds-navy-500)',
    averageBar: 'var(--ds-purple-600)',
    subjectBar: 'var(--ds-success-500)',
}

const PERCENT = 100
const TEN = 10
// 막대 끝 값 단계 — 1 · 2 · 2.5 · 5 · 10 × 자릿수(23.5 → 25).
const NICE_STEPS = [1, 2, 2.5, 5, 10] as const

// 막대 끝 값 — 가장 큰 값을 1 · 2 · 2.5 · 5 · 10 × 자릿수로 올린다(23.5 → 25 · 18.8 → 20). 0 이하뿐이면 1.
const rankBarScaleMax = (...lists: readonly (readonly RankBarItem[])[]) => {
    const max = Math.max(0, ...lists.flat().map((item) => item.value))
    if (max <= 0) return 1
    const magnitude = TEN ** Math.floor(Math.log10(max))
    return (NICE_STEPS.find((step) => step * magnitude >= max) ?? TEN) * magnitude
}

const RankBarList = ({
    title,
    titleAs: Title = 'h5',
    items,
    max,
    colors,
    formatValue = (value) => `${value}%`,
    highlightLabel = '강조',
    emptyText = '표시할 데이터가 없습니다.',
    emptyClassName,
    className,
    listClassName,
    titleClassName,
    rowClassName,
    averageRowClassName,
    subjectRowClassName,
    nameClassName,
    barClassName,
    valueClassName,
    highlightValueClassName,
    highlightIconClassName,
    renderName,
}: RankBarListProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const scaleMax = max ?? rankBarScaleMax(items)

    return (
        <div
            className={cn(
                'flex min-w-0 flex-col',
                listClassName ?? 'typo-body-l-regular text-foreground border-primary border-t-2',
                className,
            )}
        >
            <Title className={titleClassName ?? 'bg-muted text-primary typo-body-xl-bold px-3.5 py-2.5'}>{title}</Title>
            {items.length ? (
                <ol>
                    {items.map((item) => {
                        const tone = item.tone ?? 'default'
                        const percent = item.value > 0 ? Math.min(1, item.value / scaleMax) * PERCENT : 0
                        const fill =
                            tone === 'subject' ? color.subjectBar : tone === 'average' ? color.averageBar : color.bar

                        return (
                            <li
                                key={item.id}
                                className={cn(
                                    'flex items-center gap-3.5',
                                    rowClassName ?? 'border-subtle-3 border-b py-2',
                                    tone === 'average' &&
                                        (averageRowClassName ??
                                            'border-t-foreground text-foreground-subtle border-t-2 font-bold'),
                                    tone === 'subject' &&
                                        (subjectRowClassName ?? 'bg-muted text-primary font-extrabold'),
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex shrink-0 items-center gap-2 break-keep',
                                        nameClassName ?? 'w-40 pl-3.5',
                                    )}
                                >
                                    <span className="min-w-0 wrap-anywhere">
                                        {renderName ? renderName(item.name) : item.name}
                                    </span>
                                    {item.isHighlighted ? (
                                        <>
                                            <Star
                                                aria-hidden="true"
                                                className={cn(
                                                    'shrink-0',
                                                    highlightIconClassName ?? 'text-warning size-5 fill-current',
                                                )}
                                            />
                                            <span className="sr-only">({highlightLabel})</span>
                                        </>
                                    ) : null}
                                </span>
                                <svg aria-hidden="true" className={cn('block min-w-0 flex-1', barClassName ?? 'h-4')}>
                                    {color.track ? <rect width="100%" height="100%" fill={color.track} /> : null}
                                    {percent > 0 ? <rect width={`${percent}%`} height="100%" fill={fill} /> : null}
                                </svg>
                                <span
                                    className={cn(
                                        'shrink-0 text-right',
                                        valueClassName ?? 'w-18',
                                        item.isHighlighted && (highlightValueClassName ?? 'font-bold'),
                                    )}
                                >
                                    {formatValue(item.value)}
                                </span>
                            </li>
                        )
                    })}
                </ol>
            ) : (
                <p className={emptyClassName ?? 'text-foreground-subtle py-10 text-center'}>{emptyText}</p>
            )}
        </div>
    )
}

export {RankBarList, rankBarScaleMax}
export type {RankBarColors, RankBarItem, RankBarListProps, RankBarTone}
