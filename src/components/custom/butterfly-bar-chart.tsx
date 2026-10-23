'use client'

// 'use client' — 막대가 자라는 움직임 여부를 문서 설정(chart-reveal.tsx)에서 읽는다.
import {useChartAnimation} from '@/components/custom/chart-reveal'
import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'
import {formatCellsValue} from '@/components/custom/chart-cells'

// 나비 막대(ButterflyBarChart) — 가운데 항목 이름 칸을 두고 왼쪽 값은 왼쪽으로, 오른쪽 값은 오른쪽으로 자라는
// 가로 막대로 두 값(예: 기업수 · 특허수)을 항목마다 마주 놓는다. K-BIGx 보고서 "매출 규모별 기업 및 특허 현황" 카드에서 쓴다.
//
// 짜임: 머리 줄(양쪽 제목 14 Bold, 가운데 칸 쪽에 붙음) → 16 → 항목 줄(높이 24 막대 · 줄 사이 16).
//   가운데 칸 폭 120(글자 자리 80 · 양옆 20), 항목 이름 12 Regular 가운데 맞춤.
//   값 글자 11 Regular 는 막대 바깥 끝에서 4 떨어져 붙는다. 보고서에서는 막대가 다 자란 뒤 값 글자가 나타난다(animate-chart-label).
// 막대 길이는 쪽마다 따로 잰다 — 그 쪽 가장 큰 값이 (쪽 폭 − 값 글자 자리 48)를 다 채운다. 두 쪽은 단위가 달라 서로 견주지 않는다.
// 값을 늘 적어 두므로 풍선 도움말은 없다. 그림은 aria-hidden 으로 감추고 화면 낭독기는 숨김 표를 읽는다.
//
// 특이 값 처리
// - 가장 큰 값: 값 글자 자리(48)를 막대 밖에 늘 남겨 두어 글자가 카드 밖으로 나가지 않는다(7자 이상은 '1.2만'처럼 줄여 자리 안에 든다).
// - 0: 막대 없이 값 글자만 가운데 칸 옆에 적는다. 한 쪽이 모두 0 이어도 같다.
// - 아주 작은 값: 0 보다 크면 막대를 최소 2 로 그려 0 과 구분한다.
// - 음수: 개수 자료라 음수는 오지 않는다고 보고 막대는 0 으로 막는다. 값 글자와 숨김 표는 받은 값을 그대로 적어 잘못된 자료가 드러나게 둔다.
// - 긴 항목 이름: 가운데 칸 안에서 낱말 단위로 줄을 바꾸고, 그 줄은 이름 높이만큼 커지며 막대는 세로 가운데에 선다.
//
// [프론트엔드 연동] data 는 항목(매출 규모 구간)마다 {id, label, left, right} 한 행이다. left · right 는 원래 값(개 · 건)을 넘긴다.

type ButterflyBarSide = {
    title: string
    color: string
}

type ButterflyBarItem = {
    id: string
    label: string
    left: number
    right: number
}

type ButterflyBarChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: ButterflyBarItem[]
    /** 왼쪽(왼쪽으로 자라는) 값의 제목 · 막대 색. */
    left: ButterflyBarSide
    /** 오른쪽(오른쪽으로 자라는) 값의 제목 · 막대 색. */
    right: ButterflyBarSide
    valueFractionDigits?: number
    /** 숨김 표 머리의 가운데 칸 이름. */
    categoryTitle?: string
}

// 0 보다 큰 값 막대의 최소 폭(px) — 이보다 짧으면 0 과 구분되지 않는다.
const MIN_BAR_WIDTH_PX = 2
const MAX_FRACTION_DIGITS = 6
const PERCENT = 100

const rowClassName = 'grid grid-cols-[minmax(0,1fr)_--spacing(30)_minmax(0,1fr)] items-center'
// 쪽마다 값 글자 자리(48)를 바깥에 남긴다 — 막대 폭 %는 이 자리를 뺀 안쪽 폭 기준이다.
const leftSideClassName = 'flex min-w-0 items-center justify-end gap-1 pl-12'
const rightSideClassName = 'flex min-w-0 items-center justify-start gap-1 pr-12'
const valueClassName = 'typo-micro-regular text-foreground-subtle shrink-0 whitespace-nowrap'

const EMPTY_VALUE = '-'
const barRatio = (value: number, maximum: number) => (maximum > 0 ? Math.max(0, value) / maximum : 0)

const ButterflyBarChart = ({
    ariaLabel,
    data,
    left,
    right,
    valueFractionDigits = 0,
    categoryTitle = '항목',
    className,
    ...props
}: ButterflyBarChartProps) => {
    const fractionDigits = Math.min(MAX_FRACTION_DIGITS, Math.max(0, valueFractionDigits))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const format = (value: number) => valueFormatter.format(value)
    // 값이 없으면(숫자 아님) 막대 없이 '-'. 0 은 '0'. 끝 값 계산에서도 뺀다.
    const hasValue = (value: number) => Number.isFinite(value)
    const valueText = (value: number) => (hasValue(value) ? formatCellsValue(value, format) : EMPTY_VALUE)
    const leftMaximum = Math.max(0, ...data.map((item) => item.left).filter(hasValue))
    const rightMaximum = Math.max(0, ...data.map((item) => item.right).filter(hasValue))

    const animate = useChartAnimation()
    // 값 글자는 막대가 다 자란 뒤 나타난다(보이기 전에는 막대와 함께 숨는다 — data-chart-reveal).
    const valueRevealClassName = cn(valueClassName, animate && 'motion-safe:animate-chart-label')
    // 막대는 가운데 축에서 바깥으로 자란다 — 왼쪽 막대는 오른쪽에서 왼쪽으로, 오른쪽 막대는 왼쪽에서 오른쪽으로.
    const renderBar = (value: number, maximum: number, color: string, side: 'left' | 'right') => {
        const ratio = hasValue(value) ? barRatio(value, maximum) : 0
        if (!ratio) return null
        return (
            <span
                data-chart-reveal=""
                className={cn(
                    'h-6 shrink-0',
                    animate &&
                        (side === 'left'
                            ? 'motion-safe:animate-chart-wipe-left'
                            : 'motion-safe:animate-chart-wipe-right'),
                )}
                style={{width: `${ratio * PERCENT}%`, minWidth: MIN_BAR_WIDTH_PX, backgroundColor: color}}
            />
        )
    }

    return (
        <div {...props} className={cn('flex w-full min-w-0 flex-col gap-4', className)}>
            <div className="flex flex-col gap-4" aria-hidden="true">
                <div className={rowClassName}>
                    <p className="typo-body-l-bold text-label-foreground text-right">{left.title}</p>
                    <span />
                    <p className="typo-body-l-bold text-label-foreground">{right.title}</p>
                </div>
                <ul className="flex flex-col gap-4">
                    {data.map((item) => (
                        <li key={item.id} className={rowClassName}>
                            <span className={leftSideClassName}>
                                <span data-chart-reveal="" className={valueRevealClassName}>
                                    {valueText(item.left)}
                                </span>
                                {renderBar(item.left, leftMaximum, left.color, 'left')}
                            </span>
                            <span className="typo-caption-regular text-label-foreground px-5 text-center break-keep">
                                {item.label}
                            </span>
                            <span className={rightSideClassName}>
                                {renderBar(item.right, rightMaximum, right.color, 'right')}
                                <span data-chart-reveal="" className={valueRevealClassName}>
                                    {valueText(item.right)}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 감추는 상자를 따로 둔다 — 표에 직접 sr-only 를 걸면 표가 제 폭만큼 자리를 차지해 문서가 가로로 넓어진다. */}
            <div className="sr-only">
                <table>
                    <caption>{ariaLabel}</caption>
                    <thead>
                        <tr>
                            <th scope="col">{categoryTitle}</th>
                            <th scope="col">{left.title}</th>
                            <th scope="col">{right.title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <th scope="row">{item.label}</th>
                                <td>{hasValue(item.left) ? format(item.left) : EMPTY_VALUE}</td>
                                <td>{hasValue(item.right) ? format(item.right) : EMPTY_VALUE}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {ButterflyBarChart}
export type {ButterflyBarChartProps, ButterflyBarItem, ButterflyBarSide}
