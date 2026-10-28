'use client'

import {TruncatedText} from '@/components/composite/truncated-text'
import {useChartAnimation} from '@/components/custom/chart-reveal'
import {useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef} from 'react'
import {Star} from 'lucide-react'
import {cn} from '@/lib/utils'

// 양쪽 순위 막대(DivergingRankChart) — 가운데 선을 두고 서로 다른 두 순위 목록을 좌우로 펼친다.
// K-BIGx 기업혁신성장 보고서 "성장률 우수기업" 카드(왼쪽 100억원 이하 · 오른쪽 100억원 초과)에서 쓴다.
// 두 목록은 짝이 아니다 — 행 수 · 순서 · 최댓값이 각자 따로다(같은 줄의 왼쪽 · 오른쪽 기업은 무관).
//
// 짜임: 오른쪽 위 별 범례(★ 고성장 기업, 14 Regular) → 16 → 두 목록 제목(14 Bold, 왼쪽은 가운데 쪽 정렬)
//   → 16 → 행(높이 24 · 사이 16). 두 목록 사이 24.
//   막대는 가운데에서 바깥으로 자란다(rank-bar-* — 왼쪽 navy.500 · 오른쪽 blue.500 · 평균 purple.600 · 대상 기업 success.500).
//   보고서에서는 막대가 다 자란 뒤 막대 밖 글자(이름 · 값 · 별)가 나타난다(animate-chart-label).
//   기업 이름은 막대 안 가운데 쪽 끝에서 8(11 Medium · 흰색), 값은 막대 바깥 끝에서 4(11 Regular · foreground-subtle).
//   고성장 기업은 값 바깥에 16 별(rank-bar-highlight)을 둔다 — 색만으로 알리지 않도록 숨김 표에 "고성장 기업" 열이 있다.
//
// 막대 길이 = 값 / 그 목록의 최댓값 × (칸 폭 − 값 자리 60). 값 자리를 늘 남겨 가장 긴 막대의 값 글자도 칸 안에 들어온다.
// 값 글자가 값 자리보다 길면(긴 숫자) 막대가 줄어들어 값 글자는 칸 밖으로 나가지 않는다.
//
// 특이 케이스:
//   - 이름이 막대보다 길면 이름을 막대 밖(막대와 값 사이, label-foreground)으로 뺀다. 막대 폭은 화면 폭에 따라 달라서
//     그릴 때 · 크기가 바뀔 때마다 글자 폭을 재어 정한다. 밖으로 뺀 이름도 자리가 모자라면 말줄임(…)하고 title 에 전체 이름을 둔다.
//   - 0 · 음수는 막대를 그리지 않고(길이 0) 값만 "-3.2%" 처럼 적는다. 막대를 반대쪽으로 뻗으면 옆 목록을 침범하고
//     두 목록의 방향 뜻이 섞여서다. 이름은 막대가 없으니 밖으로 나간다.
//   - 한쪽 목록이 비면 그 칸에 "자료가 없습니다" 를 적는다.
//
// [프론트엔드 연동] 행 순서는 받은 그대로 그린다(정렬하지 않는다) — 순위 정렬 · 평균 · 대상 기업 행 위치는 API 순서를 따른다.
//   평균 행은 tone: 'average', 조회 기업 행은 tone: 'subject', 고성장 기업은 isHighlighted: true 로 넘긴다.

type DivergingRankTone = 'default' | 'average' | 'subject'

type DivergingRankItem = {
    id: string
    name: string
    value: number
    tone?: DivergingRankTone
    /** 고성장 기업 등 별 표시 대상. */
    isHighlighted?: boolean
}

type DivergingRankSide = {
    title: string
    items: DivergingRankItem[]
}

type DivergingRankChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /** 가운데에서 왼쪽으로 자라는 목록. */
    left: DivergingRankSide
    /** 가운데에서 오른쪽으로 자라는 목록. */
    right: DivergingRankSide
    /** 값 뒤에 붙는 단위 글자. */
    valueSuffix?: string
    valueFractionDigits?: number
    /** 별 범례 글자. 별 표시 행이 하나도 없으면 범례를 그리지 않는다. */
    highlightLabel?: string
    /**
     * 차트 위 별 범례. 카드 제목 줄 오른쪽에 범례를 두는 화면(보고서)에서는 끄고 DivergingRankLegend 를 그 자리에 둔다
     * — 켜 두면 차트 위에 범례 줄(21 + 간격 16)이 하나 더 생긴다.
     */
    showLegend?: boolean
    /** 목록이 비었을 때 칸에 적는 글자. */
    emptyText?: string
    /**
     * 별 표시 행(isHighlighted)의 값 글자 모양(예: 'typo-micro-bold' — 고성장 % 를 굵게). 값 글자의 typo-* 를 이 값으로 바꾼다.
     * 주지 않으면 다른 행과 같은 모양이다 — 이 값을 넘기는 화면만 바뀐다(인쇄본 RankBarList 의 같은 이름 옵션과 같은 뜻).
     */
    highlightValueClassName?: string
}

type Direction = 'left' | 'right'

// 값 자리 — 별(16) + 4 + 값 글자(약 34) + 막대와의 간격 4 를 합친 60(= --spacing(15)).
const VALUE_RESERVE = 'calc(var(--spacing) * 15)'
// 막대 안 이름의 좌우 여백 합(8 + 8).
const NAME_INSET_PX = 16
const MAX_FRACTION_DIGITS = 6

const DEFAULT_BAR_CLASS_NAME: Record<Direction, string> = {
    left: 'bg-rank-bar-left',
    right: 'bg-rank-bar-right',
}
// 평균 · 조회 기업 막대 — 막대 안 이름이 11px 흰 글자라 본문 대비 4.5:1 을 넘는 색만 쓴다[5.3.3]
// (purple.600 5.25:1 · success.500 4.57:1).
// 막대 · 고성장 별 색은 시맨틱 토큰 rank-bar-*(tokens.json)로, 라이트 · 다크 모두 같은 색이다 — 막대 안 흰 글자 대비를
// 다크에서도 지키기 위해서다(원시 팔레트 유틸리티는 다크에서 밝은 단계로 뒤집혀 흰 글자가 묻힌다).
const TONE_BAR_CLASS_NAME: Record<Exclude<DivergingRankTone, 'default'>, string> = {
    average: 'bg-rank-bar-average',
    subject: 'bg-rank-bar-subject',
}
const TONE_SR_TEXT: Record<DivergingRankTone, string> = {
    default: '',
    average: ' (평균)',
    subject: ' (조회 기업)',
}

const barClassName = (direction: Direction, tone: DivergingRankTone = 'default') =>
    tone === 'default' ? DEFAULT_BAR_CLASS_NAME[direction] : TONE_BAR_CLASS_NAME[tone]

// 줄 안 요소 사이 간격(gap-1 = 4).
const ROW_GAP_PX = 4

// 막대 밖 남은 폭 — 줄 폭에서 막대 · 값 · 별(밖 이름은 빼고)과 그 사이 간격을 뺀 폭. 밖 이름까지 들어가면 간격이 하나 는다.
const outsideRoom = (bar: HTMLElement) => {
    const row = bar.parentElement
    if (!row) return 0
    const others = Array.from(row.children).filter(
        (child) => child !== bar && !(child instanceof HTMLElement && child.dataset.outsideName !== undefined),
    )
    const othersWidth = others.reduce((sum, child) => sum + child.getBoundingClientRect().width, 0)
    return (
        row.getBoundingClientRect().width -
        bar.getBoundingClientRect().width -
        othersWidth -
        (others.length + 1) * ROW_GAP_PX
    )
}

// 이름을 막대 밖으로 옮길 막대 — 막대 안에 들어가지 않고, 막대 밖 남은 폭에는 다 들어갈 때만 옮긴다.
// 밖에도 다 들어가지 않으면(막대가 줄을 거의 다 차지하는 1위 등) 막대 안에 둔 채 한 줄 말줄임 + 툴팁 — 막대 길이는 줄이지 않는다
// (막대가 줄면 값 순서와 막대 길이 순서가 어긋난다).
const measureOverflowIds = (container: HTMLElement, context: CanvasRenderingContext2D) => {
    const bars = Array.from(container.querySelectorAll<HTMLElement>('[data-bar-id]'))
    return bars
        .filter((bar) => {
            const name = bar.dataset.barName ?? ''
            const style = window.getComputedStyle(bar)
            context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
            const nameWidth = context.measureText(name).width
            const isInsideFit = nameWidth + NAME_INSET_PX <= bar.getBoundingClientRect().width
            return !isInsideFit && nameWidth <= outsideRoom(bar)
        })
        .map((bar) => bar.dataset.barId ?? '')
}

const useOutsideNameIds = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [outsideIds, setOutsideIds] = useState<string[]>([])
    useLayoutEffect(() => {
        const container = containerRef.current
        const context = document.createElement('canvas').getContext('2d')
        if (!container || !context) return
        const update = () => {
            const nextIds = measureOverflowIds(container, context)
            setOutsideIds((previous) => (previous.join('|') === nextIds.join('|') ? previous : nextIds))
        }
        update()
        const observer = new ResizeObserver(update)
        observer.observe(container)
        // 웹 글꼴이 늦게 들어오면 글자 폭이 바뀌므로 한 번 더 잰다.
        void document.fonts.ready.then(update)
        return () => observer.disconnect()
    })
    return {containerRef, outsideIds}
}

// 별 범례 — 차트 위(기본) 또는 카드 제목 줄 등 다른 자리에 따로 둘 때 쓴다(그때는 차트의 showLegend 를 끈다).
const DivergingRankLegend = ({label = '고성장 기업', className}: {label?: string; className?: string}) => (
    // 글자는 기준선(items-baseline), 별은 세로 가운데(self-center) — 카드 제목 줄(items-baseline)이 이 범례의 글자 기준선에
    // 맞춰 서도록 한다(별이 먼저 오면 별 아래 끝이 기준선이 되어 제목 줄이 2 높아진다).
    <p className={cn('typo-body-l-regular text-foreground-subtle flex items-baseline gap-1', className)}>
        <Star
            className="fill-rank-bar-highlight text-rank-bar-highlight size-4 shrink-0 self-center"
            aria-hidden="true"
        />
        {label}
    </p>
)

const DivergingRankChart = ({
    ariaLabel,
    left,
    right,
    valueSuffix = '%',
    valueFractionDigits = 1,
    highlightLabel = '고성장 기업',
    showLegend = true,
    emptyText = '자료가 없습니다.',
    highlightValueClassName,
    className,
    ...props
}: DivergingRankChartProps) => {
    const fractionDigits = Math.min(MAX_FRACTION_DIGITS, Math.max(0, valueFractionDigits))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const formatValue = (value: number) => `${valueFormatter.format(value)}${valueSuffix}`
    const {containerRef, outsideIds} = useOutsideNameIds()
    const hasHighlight = [...left.items, ...right.items].some((item) => item.isHighlighted)
    const sides = [
        {direction: 'left', side: left},
        {direction: 'right', side: right},
    ] as const satisfies readonly {direction: Direction; side: DivergingRankSide}[]

    const animate = useChartAnimation()
    // 막대 밖 글자(이름 · 값 · 별)는 막대가 다 자란 뒤 나타난다(보이기 전에는 막대와 함께 숨는다 — data-chart-reveal).
    const labelRevealClassName = animate ? 'motion-safe:animate-chart-label' : undefined
    const renderRow = (direction: Direction, item: DivergingRankItem, maximumValue: number) => {
        const ratio = maximumValue > 0 ? Math.max(0, item.value) / maximumValue : 0
        const barKey = `${direction}-${item.id}`
        const isNameOutside = ratio === 0 || outsideIds.includes(barKey)
        const isLeft = direction === 'left'
        const bar = (
            <div
                key="bar"
                data-chart-reveal=""
                data-bar-id={barKey}
                data-bar-name={item.name}
                // 막대는 줄지 않는다(shrink-0) — 막대 길이가 곧 값이다. 자리가 모자라면 밖 이름이 줄어든다.
                className={cn(
                    'typo-micro-medium flex h-full min-w-0 shrink-0 items-center overflow-hidden px-2 text-white',
                    isLeft && 'justify-end',
                    barClassName(direction, item.tone),
                    // 막대는 가운데 축에서 바깥으로 자란다.
                    animate &&
                        (isLeft ? 'motion-safe:animate-chart-wipe-left' : 'motion-safe:animate-chart-wipe-right'),
                )}
                style={{width: `calc((100% - ${VALUE_RESERVE}) * ${ratio})`}}
            >
                {/* 이름 — 막대 안 · 밖 모두 한 줄 말줄임. 잘렸을 때만 마우스 올리기 · 탭으로 전체 이름을 툴팁으로 본다.
                    그래프(role="img") 안이라 Tab 초점은 두지 않는다 — 전체 이름은 아래 숨김 표가 읽어 준다. */}
                {isNameOutside ? null : (
                    <TruncatedText lines={1} isFocusable={false} className="min-w-0">
                        {item.name}
                    </TruncatedText>
                )}
            </div>
        )
        const outsideName = isNameOutside ? (
            <span
                key="name"
                data-chart-reveal=""
                data-outside-name=""
                // 감싼 상자도 한 줄 · 넘침 숨김(truncate)이라야 줄 안 폭이 모자랄 때 막대가 아니라 이름이 줄어든다.
                className={cn('typo-micro-medium text-label-foreground min-w-0 truncate', labelRevealClassName)}
            >
                <TruncatedText lines={1} isFocusable={false}>
                    {item.name}
                </TruncatedText>
            </span>
        ) : null
        const value = (
            <span
                key="value"
                data-chart-reveal=""
                className={cn(
                    item.isHighlighted && highlightValueClassName ? highlightValueClassName : 'typo-micro-regular',
                    'text-foreground-subtle shrink-0 whitespace-nowrap tabular-nums',
                    labelRevealClassName,
                )}
            >
                {formatValue(item.value)}
            </span>
        )
        const star = item.isHighlighted ? (
            <Star
                key="star"
                data-chart-reveal=""
                className={cn('fill-rank-bar-highlight text-rank-bar-highlight size-4 shrink-0', labelRevealClassName)}
            />
        ) : null
        // 가운데 → 바깥 순서(막대 · 밖 이름 · 값 · 별)를 왼쪽 목록에서는 DOM 에서 뒤집어 놓는다 —
        // flex-row-reverse 로 화면만 뒤집지 않아 DOM 순서와 보이는 순서가 같다[7.3.1].
        const parts = [bar, outsideName, value, star]
        return (
            <li key={item.id} className={cn('flex h-6 min-w-0 items-center gap-1', isLeft && 'justify-end')}>
                {isLeft ? [...parts].reverse() : parts}
            </li>
        )
    }

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            {hasHighlight && showLegend ? <DivergingRankLegend label={highlightLabel} className="justify-end" /> : null}
            <div ref={containerRef} role="img" aria-label={ariaLabel} className="grid grid-cols-2 gap-x-6 gap-y-4">
                {sides.map(({direction, side}) => (
                    <p
                        key={`${direction}-title`}
                        className={cn(
                            'typo-body-l-bold text-label-foreground min-w-0 truncate',
                            direction === 'left' && 'text-end',
                        )}
                    >
                        {side.title}
                    </p>
                ))}
                {sides.map(({direction, side}) => {
                    const maximumValue = Math.max(0, ...side.items.map((item) => item.value))
                    if (!side.items.length) {
                        return (
                            <p
                                key={`${direction}-list`}
                                className={cn(
                                    'typo-body-m-regular text-foreground-subtle min-w-0 py-6',
                                    direction === 'left' ? 'text-end' : 'text-start',
                                )}
                            >
                                {emptyText}
                            </p>
                        )
                    }
                    return (
                        <ul key={`${direction}-list`} className="flex min-w-0 flex-col gap-4">
                            {side.items.map((item) => renderRow(direction, item, maximumValue))}
                        </ul>
                    )
                })}
            </div>
            {/* 감추는 상자를 따로 둔다 — 표에 직접 sr-only 를 걸면 표가 제 폭만큼 자리를 차지해 문서가 가로로 넓어진다. */}
            <div className="sr-only">
                {sides.map(({direction, side}) => (
                    <table key={direction}>
                        <caption>{`${ariaLabel} — ${side.title}`}</caption>
                        <thead>
                            <tr>
                                <th scope="col">기업명</th>
                                <th scope="col">값</th>
                                {hasHighlight ? <th scope="col">{highlightLabel}</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {side.items.length ? (
                                side.items.map((item) => (
                                    <tr key={item.id}>
                                        <th scope="row">
                                            {item.name}
                                            {TONE_SR_TEXT[item.tone ?? 'default']}
                                        </th>
                                        <td>{formatValue(item.value)}</td>
                                        {hasHighlight ? <td>{item.isHighlighted ? highlightLabel : '-'}</td> : null}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={hasHighlight ? 3 : 2}>{emptyText}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ))}
            </div>
        </div>
    )
}

export {DivergingRankChart, DivergingRankLegend}
export type {DivergingRankChartProps, DivergingRankItem, DivergingRankSide, DivergingRankTone}
