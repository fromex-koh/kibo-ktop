'use client'

// 'use client' — 막대가 움직이는지를 문서 설정(chart-reveal.tsx)에서 읽는다.
import type {ComponentPropsWithoutRef} from 'react'
import {useChartAnimation} from '@/components/custom/chart-reveal'
import {cn} from '@/lib/utils'

// 비율 막대(RatioStackBar) — 전체를 100 으로 보고 항목별 비율을 한 줄 가로 막대에 이어 칠하고, 아래 오른쪽에 범례(이름 + 비율)를 둔다.
// K-BIGx 기업혁신성장 보고서 신용/재무정보 탭 "신용/담보 비중" 카드(신용 · 담보)에서 쓴다.
//
// 짜임: 막대 높이 16 · 양 끝 둥글림(full) · 항목 사이 흰 틈 2 → 8 → 범례(오른쪽 정렬, 16 칩 · 간격 8 · 14 Regular 이름 + 14 Bold 비율,
//   항목 간격 16).
// 비율은 값 합계로 나눠 계산한다 — 합이 100 이 아니어도(예: 반올림 오차 99.9) 막대는 끝까지 찬다. 0 이하 · 숫자가 아닌 값은
//   막대에서 빼고(범례에는 0 이하는 0.0% · 숫자가 아닌 값은 '-'), 0 보다 크면 최소 4 는 칠해 보이게 한다. 합이 0 이면(자료 없음) 빈 회색 막대만 두고
//   범례 비율은 모두 '-' — 0.0% 로 적으면 실제 값이 0 인 것처럼 읽힌다.
// 막대는 장식이라 숨기고, 범례 글자가 비율을 읽어 준다[5.3.1].
// 보고서 안에서는 카드가 화면에 들어올 때 막대가 왼쪽에서 오른쪽으로 차오른다(chart-reveal.tsx · --animate-chart-wipe-right).
//
// [프론트엔드 연동] value 는 비율(%) 또는 금액 어느 쪽이든 된다 — 범례 비율은 합계 대비로 다시 계산해 적는다.

// 값이 없을 때 범례에 적는 글자.
const EMPTY_VALUE = '-'

type RatioStackItem = {
    id: string
    label: string
    value: number
    /** 막대 · 칩 색(토큰 변수). */
    color: string
}

type RatioStackBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly RatioStackItem[]
    /** 범례 비율의 소수 자릿수(기본 1 — 43.8%). */
    fractionDigits?: number
}

const RatioStackBar = ({data, fractionDigits = 1, className, ...props}: RatioStackBarProps) => {
    const animate = useChartAnimation()
    const digits = Math.min(4, Math.max(0, Number.isFinite(fractionDigits) ? fractionDigits : 1))
    const percentFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })
    const safeValues = data.map((item) => (Number.isFinite(item.value) && item.value > 0 ? item.value : 0))
    const total = safeValues.reduce((sum, value) => sum + value, 0)
    const items = data.map((item, index) => ({
        ...item,
        percentage: total ? (safeValues[index] / total) * 100 : 0,
        // 합이 0 이거나 받지 못한 값이면 '-'.
        percentageText:
            total && Number.isFinite(item.value)
                ? `${percentFormatter.format((safeValues[index] / total) * 100)}%`
                : EMPTY_VALUE,
    }))

    return (
        <div {...props} className={cn('flex w-full flex-col gap-2', className)}>
            {/* 항목 사이 틈은 카드 면(bg-card)이 비쳐 흰 선으로 보인다. 합이 0 이면 빈 회색 막대. */}
            {/* data-chart-reveal — 보이기 전에는 막대만 숨긴다(범례는 보인다). */}
            <div
                className={cn(
                    'flex h-4 w-full gap-0.5 overflow-hidden rounded-full',
                    total ? 'bg-card' : 'bg-accent-subtle',
                    animate && 'motion-safe:animate-chart-wipe-right',
                )}
                aria-hidden="true"
                data-chart-reveal=""
            >
                {items
                    .filter((item) => item.percentage > 0)
                    .map((item) => (
                        <span
                            key={item.id}
                            // min-w-1 — 0 보다 큰 항목은 아주 작아도 4 는 칠해 보이게 한다.
                            className="h-full min-w-1"
                            style={{backgroundColor: item.color, flexGrow: item.percentage, flexBasis: 0}}
                        />
                    ))}
            </div>
            <ul className="flex flex-wrap justify-end gap-x-4 gap-y-1">
                {items.map((item) => (
                    <li key={item.id} className="typo-body-l-regular text-label-foreground flex items-center gap-2">
                        <span aria-hidden="true" className="size-4 shrink-0" style={{backgroundColor: item.color}} />
                        <span className="break-keep">
                            {item.label}{' '}
                            <strong className="typo-body-l-bold text-foreground tabular-nums">
                                {item.percentageText}
                            </strong>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {RatioStackBar}
export type {RatioStackBarProps, RatioStackItem}
