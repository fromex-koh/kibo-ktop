import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 조각 안 라벨 원형(InsideLabelPieChart) — 몇 안 되는 분류(2 ~ 4개)의 비중을 꽉 찬 원(파이)으로 그리고, 조각마다 안쪽에
// 이름 · 비중을 흰 글자로 바로 적는다. 범례 · 지시선이 없다.
// 예전 K-BIGx 보고서 인쇄본 "신용/담보 비중" 원형 — 현업 요청(원형 그래프 라벨은 원 밖)으로 인쇄본은 CalloutPieChart 로
// 바꿨다. 지금은 쓰는 화면이 없고 컴포넌트 가이드에만 남아 있다.
// (분류가 많아 지시선 라벨이 필요하면 CalloutPieChart, 가운데가 빈 도넛 + 목록은 DonutListChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표)
//   그림 230 × 230. 원 = 반지름 100 · 조각 사이 흰 선 2.5. 12시에서 시작해 시계 방향으로 받은 순서대로 이어진다.
//   라벨 = 조각 가운데 각도의 반지름 55 지점 — 이름(19px 600) 위 · 비중(22px 가장 굵게) 아래, 두 줄 사이 26.
//   크기는 사용처 className(w-*)으로 정한다 — 그림 전체가 같은 비율로 커진다.
// 데이터에 따라
//   · 비중이 0 이하인 항목은 그리지 않는다(숨김 목록에는 남는다). 그릴 항목이 없으면 emptyText 만 보인다.
//   · 비중 합이 100 이 아니어도 합 기준으로 원을 채우고, 글자는 받은 비중을 그대로 적는다.
//   · 조각이 MIN_LABEL_PERCENT(12%) 보다 작으면 글자가 조각 밖으로 넘치므로 조각 안 라벨을 생략한다 — 값은 숨김 목록이 읽는다.
//   · 항목이 하나면 원 전체가 한 조각이고 라벨은 원 가운데에 둔다.
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다(툴팁 없음). 수치 전체는 화면에 보이지 않는 목록으로도 읽어 준다[5.1.1].
//
// [프론트엔드 연동] data 는 그릴 순서대로 넘긴다. 조각 색은 항목 color(CSS 색 값 — 웹 화면은 var(--ds-*), 인쇄본은
//   var(--kbx-color-*)), 조각 사이 선 · 글자 색은 gapColor · labelColor 로 넘긴다. 조각 색은 흰 글자와 4.5:1 이상인 짙은 색을 쓴다.

type InsideLabelPieItem = {
    id: string
    label: string
    /** 비중(%) — 적힌 그대로 보인다. */
    percentage: number
    /** 조각 색(CSS 색 값). */
    color: string
}

type InsideLabelPieChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    data: readonly InsideLabelPieItem[]
    ariaLabel: string
    /** 조각 사이 선 색(바탕색과 같게). 기본 var(--ds-card). */
    gapColor?: string
    /** 조각 안 글자 색. 기본 var(--ds-primary-foreground)(흰색). */
    labelColor?: string
    /** 비중 글자 형식(기본: 소수 첫째 자리까지, 0 은 지움 — 43.8 · 50). */
    formatPercentage?: (value: number) => string
    /** 그릴 항목이 없을 때 문구. */
    emptyText?: string
    /** 빈 상태 모양(여백 · 바탕 · 글자). 기본 text-foreground-subtle py-10 text-center. 인쇄본은 차트 빈 상태(KbxChartEmpty)와 같게. */
    emptyClassName?: string
}

// 치수(SVG 좌표).
const SIZE = 230
const CENTER = SIZE / 2
const RADIUS = 100
const GAP_STROKE = 2.5
const LABEL_RADIUS = 55
// 라벨 두 줄 — 이름 기준선은 라벨 자리 9 위, 비중 기준선은 17 아래(줄 사이 26).
const NAME_OFFSET = -9
const VALUE_OFFSET = 17
const FONT = {name: {size: 19, weight: 600}, value: {size: 22, weight: 800}} as const
const MIN_LABEL_PERCENT = 12
const FULL_TURN = 360
const HALF_TURN = 180
const PERCENT = 100

const percentFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})
const round = (value: number) => Math.round(value * 10) / 10

const pointAt = (radius: number, degree: number) => ({
    x: CENTER + radius * Math.sin((degree * Math.PI) / HALF_TURN),
    y: CENTER - radius * Math.cos((degree * Math.PI) / HALF_TURN),
})

// 조각 — 중심 → 시작 점 → 호 → 중심. 한 바퀴면 원 하나로 그린다(호 하나로는 시작 · 끝이 같아 그려지지 않는다).
const slicePath = (start: number, end: number) => {
    const from = pointAt(RADIUS, start)
    const to = pointAt(RADIUS, end)
    const isLarge = end - start > HALF_TURN ? 1 : 0
    return `M${CENTER},${CENTER} L${round(from.x)},${round(from.y)} A${RADIUS},${RADIUS} 0 ${isLarge} 1 ${round(to.x)},${round(to.y)} Z`
}

const InsideLabelPieChart = ({
    data,
    ariaLabel,
    gapColor = 'var(--ds-card)',
    labelColor = 'var(--ds-primary-foreground)',
    formatPercentage = (value) => percentFormat.format(value),
    emptyText = '표시할 데이터가 없습니다.',
    emptyClassName,
    className,
    ...props
}: InsideLabelPieChartProps) => {
    const visible = data.filter((item) => item.percentage > 0)
    if (!visible.length) {
        return (
            <div {...props} className={cn('w-full', className)}>
                <p className={emptyClassName ?? 'text-foreground-subtle py-10 text-center'}>{emptyText}</p>
            </div>
        )
    }

    const total = visible.reduce((sum, item) => sum + item.percentage, 0) || PERCENT
    const slices = visible.reduce<{item: InsideLabelPieItem; start: number; end: number}[]>((acc, item) => {
        const start = acc.at(-1)?.end ?? 0
        return [...acc, {item, start, end: start + (item.percentage / total) * FULL_TURN}]
    }, [])
    const isWhole = slices.length === 1

    return (
        <div {...props} className={cn('w-full', className)}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-auto w-full">
                {slices.map((slice) =>
                    isWhole ? (
                        <circle key={slice.item.id} cx={CENTER} cy={CENTER} r={RADIUS} fill={slice.item.color} />
                    ) : (
                        <path
                            key={slice.item.id}
                            d={slicePath(slice.start, slice.end)}
                            fill={slice.item.color}
                            stroke={gapColor}
                            strokeWidth={GAP_STROKE}
                            strokeLinejoin="round"
                        />
                    ),
                )}
                {slices.map((slice) => {
                    if (!isWhole && (slice.item.percentage / total) * PERCENT < MIN_LABEL_PERCENT) return null
                    const point = isWhole
                        ? {x: CENTER, y: CENTER}
                        : pointAt(LABEL_RADIUS, (slice.start + slice.end) / 2)
                    return (
                        <g key={`label-${slice.item.id}`} fill={labelColor} textAnchor="middle" aria-hidden="true">
                            <text
                                x={round(point.x)}
                                y={round(point.y + NAME_OFFSET)}
                                fontSize={FONT.name.size}
                                fontWeight={FONT.name.weight}
                            >
                                {slice.item.label}
                            </text>
                            <text
                                x={round(point.x)}
                                y={round(point.y + VALUE_OFFSET)}
                                fontSize={FONT.value.size}
                                fontWeight={FONT.value.weight}
                            >
                                {formatPercentage(slice.item.percentage)}%
                            </text>
                        </g>
                    )
                })}
            </svg>
            <ul className="sr-only">
                {data.map((item) => (
                    <li key={item.id}>
                        {item.label} {formatPercentage(item.percentage)}%
                    </li>
                ))}
            </ul>
        </div>
    )
}

export {InsideLabelPieChart}
export type {InsideLabelPieChartProps, InsideLabelPieItem}
