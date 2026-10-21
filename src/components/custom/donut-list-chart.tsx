import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 도넛 + 항목 목록(DonutListChart) — 분류별 비중을 도넛으로 그리고, 옆에 '색 칸 · 이름 · 비중 · 건수' 줄 목록을 둔다.
// K-BIGx 보고서 인쇄본 기술혁신정보 "기술 보유현황(중분류 · 세부분야 기준)" 그래프.
// (화면 폭에 따라 범례가 아래로 내려가는 웹 화면용 도넛은 PercentageDonutChart, 지시선 라벨 원형은 CalloutPieChart.)
//
// 짜임(템플릿 기준)
//   도넛 = 바깥 반지름 150 · 안쪽 83.3(viewBox 300) · 12시에서 시계 방향 · 조각 사이 흰 선 3. 크기는 사용처 className(w-*)로,
//   고리 두께 · 선 두께는 ring 으로 바꾼다(기업 · 특허 현황 비중 도넛은 더 가는 고리).
//   donutCaption 을 주면 도넛 바로 아래 가운데에 짧은 글(예: 2024년 기준)을 둔다 — 도넛 · 글 묶음 폭은 donutBoxClassName.
//   목록 = 도넛 옆 세로 가운데. 줄마다 색 칸(12) · 이름 · 값('비중% · 건수개', 오른쪽 정렬)과 아래 구분선. 첫 줄 이름은 굵게
//   (가장 큰 분류), 마지막 줄(기타)은 구분선 없이 위아래 여백을 줄인다.
// 데이터에 따라
//   · 비중이 0 이하인 항목은 도넛에 그리지 않고 목록에만 남긴다(0% 로 적는다).
//   · 비중 합이 100 이 아니어도 합 기준으로 원을 채운다. 글자는 받은 비중을 그대로 적는다.
//   · 항목이 하나면 원 전체가 한 조각이다. 항목이 없으면 emptyText 만 보인다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 목록이 곧 값이라 숨김 목록을 따로 두지 않는다.
//
// [프론트엔드 연동] data 는 비중 내림차순으로 넘긴다. 조각 색은 항목 color(CSS 변수)로, 글자 · 선 모양은 className 들로 넘긴다
//   (웹 화면은 시맨틱 클래스 기본값, 인쇄본은 kbx 클래스).

type DonutListItem = {
    id: string
    label: string
    /** 비중(%) — 적힌 그대로 보인다. */
    percentage: number
    /** 건수 — '비중% · 건수개' 로 적는다. 없으면 비중만. */
    count?: number
    /** 값 칸 글자 — 주면 '비중% · 건수' 대신 이 글자를 적는다(예: 값이 없는 고정 항목의 '-'). */
    valueText?: string
    /** 조각 · 색 칸 색(CSS 색 값). */
    color: string
}

type DonutListChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly DonutListItem[]
    /** 도넛 그림 이름(화면 낭독기용). 목록은 표처럼 그대로 읽힌다. */
    ariaLabel: string
    /** 건수 단위(기본 '개'). */
    countUnit?: string
    /** 조각 사이 선 색(바탕색과 같게). */
    gapColor?: string
    /** 그릴 항목이 없을 때 문구. */
    emptyText?: string
    /** 빈 상태 모양(여백 · 바탕 · 글자). 기본 text-foreground-subtle py-10 text-center. 인쇄본은 차트 빈 상태(KbxChartEmpty)와 같게. */
    emptyClassName?: string
    /** 도넛 크기(w-*) 등. 기본 w-60. */
    donutClassName?: string
    // 아래 클래스는 주면 기본값을 대신한다(섞지 않는다 — 인쇄본 kbx 클래스와 웹 기본 클래스가 겹치지 않게).
    /** 목록 상자 글자 크기 · 색 · 폭. 기본 typo-body-l-regular text-foreground. */
    listClassName?: string
    /** 목록 한 줄의 위아래 여백 · 구분선. 기본 py-2.5 border-b border-subtle-3. */
    rowClassName?: string
    /** 마지막 줄 위아래 여백. 기본 py-1.5. */
    lastRowClassName?: string
    /** 첫 줄(가장 큰 분류) 이름 굵기. 기본 font-bold. 빈 문자열이면 굵게 하지 않는다. */
    highlightClassName?: string
    /** 이름 글자 색 등. 없으면 목록 글자를 따른다. */
    labelClassName?: string
    /** 값('비중% · 건수') 글자 굵기 · 색. 없으면 목록 글자를 따른다. */
    valueClassName?: string
    /** 건수(' · 건수개') 부분만 다른 굵기 · 색으로 — 예: 비중은 굵게, 건수는 옅게. 없으면 값과 같다. */
    countClassName?: string
    /** 색 칸 크기(size-*). 기본 size-3. */
    swatchClassName?: string
    /** 색 칸 테두리 색(CSS 색 값) — 옅은 색 칸이 바탕과 섞이지 않게. 없으면 테두리 없음. */
    swatchStroke?: string
    /**
     * 고리 치수(viewBox 300 기준) — 바깥 · 안쪽 반지름과 조각 사이 선 두께. 기본 150 · 83.3 · 3.
     * 도넛을 작게 그리면 선이 얇아 보이므로 크기에 맞춰 키운다(예: 172px 도넛에 화면 2.5px 선 = 4.36).
     */
    ring?: {outer: number; inner: number; gap: number}
    /** 도넛 아래 가운데 짧은 글(예: 2024년 기준). 없으면 도넛만. */
    donutCaption?: ReactNode
    /** 도넛 · 아래 글 묶음의 폭 · 정렬(예: w-1/2). donutCaption 이 있을 때만 쓴다. */
    donutBoxClassName?: string
    /** 도넛 아래 글 크기 · 색. 기본 typo-body-m-regular text-foreground-subtle. */
    captionClassName?: string
    /** 목록 바로 위 글(예: 단위) — 목록과 한 묶음으로 움직인다(묶음 세로 정렬은 className 의 items-*). 없으면 목록만. */
    listHeader?: ReactNode
}

// 도넛 치수(viewBox 300 기준).
const SIZE = 300
const CENTER = SIZE / 2
const DEFAULT_RING = {outer: 150, inner: 83.3, gap: 3} as const
const FULL_TURN = 360
const HALF_TURN = 180
const PERCENT = 100

const round = (value: number) => Math.round(value * 10) / 10
type Ring = NonNullable<DonutListChartProps['ring']>

const pointAt = (radius: number, degree: number) => ({
    x: CENTER + radius * Math.sin((degree * Math.PI) / HALF_TURN),
    y: CENTER - radius * Math.cos((degree * Math.PI) / HALF_TURN),
})

// 도넛 조각 — 바깥 호 → 안쪽 호(거꾸로). 한 바퀴면 반 바퀴 둘로 그린다(호 하나로는 시작 · 끝이 같아 그려지지 않는다).
const slicePath = (ring: Ring, start: number, end: number): string => {
    if (end - start >= FULL_TURN) {
        const middle = start + HALF_TURN
        return `${slicePath(ring, start, middle)} ${slicePath(ring, middle, start + FULL_TURN)}`
    }
    const isLarge = end - start > HALF_TURN ? 1 : 0
    const outerStart = pointAt(ring.outer, start)
    const outerEnd = pointAt(ring.outer, end)
    const innerEnd = pointAt(ring.inner, end)
    const innerStart = pointAt(ring.inner, start)
    return [
        `M${round(outerStart.x)},${round(outerStart.y)}`,
        `A${ring.outer},${ring.outer} 0 ${isLarge} 1 ${round(outerEnd.x)},${round(outerEnd.y)}`,
        `L${round(innerEnd.x)},${round(innerEnd.y)}`,
        `A${ring.inner},${ring.inner} 0 ${isLarge} 0 ${round(innerStart.x)},${round(innerStart.y)}`,
        'Z',
    ].join(' ')
}

// 색 칸(viewBox 12)과 테두리 두께.
const SWATCH_SIZE = 12
const SWATCH_STROKE = 1

const countFormat = new Intl.NumberFormat('ko-KR')

const DonutListChart = ({
    data,
    ariaLabel,
    countUnit = '개',
    gapColor = 'var(--ds-card)',
    emptyText = '표시할 데이터가 없습니다.',
    emptyClassName,
    donutClassName,
    listClassName,
    rowClassName,
    lastRowClassName,
    highlightClassName,
    labelClassName,
    valueClassName,
    countClassName,
    swatchClassName,
    swatchStroke,
    ring = DEFAULT_RING,
    donutCaption,
    donutBoxClassName,
    captionClassName,
    listHeader,
    className,
    ...props
}: DonutListChartProps) => {
    if (!data.length) {
        return (
            <div {...props} className={cn('w-full', className)}>
                <p className={emptyClassName ?? 'text-foreground-subtle py-10 text-center'}>{emptyText}</p>
            </div>
        )
    }

    const visible = data.filter((item) => item.percentage > 0)
    const total = visible.reduce((sum, item) => sum + item.percentage, 0) || PERCENT
    const slices = visible.reduce<{item: DonutListItem; start: number; end: number}[]>((acc, item) => {
        const start = acc.at(-1)?.end ?? 0
        return [...acc, {item, start, end: start + (item.percentage / total) * FULL_TURN}]
    }, [])
    const countText = (count: number) => ` · ${countFormat.format(count)}${countUnit}`
    const donut = (
        <svg
            role="img"
            aria-label={ariaLabel}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className={cn('block w-60 shrink-0', donutClassName)}
        >
            {slices.map((slice) => (
                <path
                    key={slice.item.id}
                    d={slicePath(ring, slice.start, slice.end)}
                    fill={slice.item.color}
                    stroke={gapColor}
                    strokeWidth={slices.length > 1 ? ring.gap : 0}
                />
            ))}
        </svg>
    )

    // 목록 — listHeader 가 있으면 그 아래에 붙는다(묶음이 남는 폭을 쓴다).
    const list = (
        <ul
            className={cn(
                'flex min-w-0 flex-col',
                !listHeader && 'flex-1',
                listClassName ?? 'typo-body-l-regular text-foreground',
            )}
        >
            {data.map((item, index) => {
                const isLast = index === data.length - 1
                return (
                    <li
                        key={item.id}
                        className={cn(
                            'flex items-center gap-2.5',
                            isLast
                                ? (lastRowClassName ?? 'py-1.5')
                                : (rowClassName ?? 'border-subtle-3 border-b py-2.5'),
                        )}
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 12 12"
                            className={cn('shrink-0', swatchClassName ?? 'size-3')}
                        >
                            {/* 테두리는 칸 안쪽 1(viewBox 기준)에 — 칸 크기가 늘지 않는다. */}
                            <rect
                                x={swatchStroke ? SWATCH_STROKE / 2 : 0}
                                y={swatchStroke ? SWATCH_STROKE / 2 : 0}
                                width={swatchStroke ? SWATCH_SIZE - SWATCH_STROKE : SWATCH_SIZE}
                                height={swatchStroke ? SWATCH_SIZE - SWATCH_STROKE : SWATCH_SIZE}
                                fill={item.color}
                                stroke={swatchStroke}
                                strokeWidth={swatchStroke ? SWATCH_STROKE : 0}
                            />
                        </svg>
                        <span
                            className={cn(
                                'min-w-0 flex-1 break-keep',
                                labelClassName,
                                index === 0 && (highlightClassName ?? 'font-bold'),
                            )}
                        >
                            {item.label}
                        </span>
                        <span className={cn('shrink-0 tabular-nums', valueClassName)}>
                            {item.valueText ?? (
                                <>
                                    {item.percentage}%
                                    {item.count === undefined ? null : (
                                        <span className={countClassName}>{countText(item.count)}</span>
                                    )}
                                </>
                            )}
                        </span>
                    </li>
                )
            })}
        </ul>
    )

    return (
        <div {...props} className={cn('flex w-full items-center gap-15', className)}>
            {donutCaption ? (
                <div className={cn('flex shrink-0 flex-col items-center gap-3', donutBoxClassName)}>
                    {donut}
                    <p className={captionClassName ?? 'typo-body-m-regular text-foreground-subtle'}>{donutCaption}</p>
                </div>
            ) : (
                donut
            )}
            {listHeader ? (
                <div className="flex min-w-0 flex-1 flex-col">
                    {listHeader}
                    {list}
                </div>
            ) : (
                list
            )}
        </div>
    )
}

export {DonutListChart}
export type {DonutListChartProps, DonutListItem}
