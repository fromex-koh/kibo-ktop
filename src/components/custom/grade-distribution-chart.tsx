'use client'

import {Fragment, useId, type ComponentPropsWithoutRef} from 'react'
import {Area, AreaChart, YAxis} from 'recharts'
import {ChartContainer, type ChartConfig} from '@/components/ui/chart'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {cn} from '@/lib/utils'

// 등급 분포 곡선(GradeDistributionChart) — 등급별 비율을 종 모양 곡선으로 그리고, 그 아래 같은 칸에 맞춘
// 표(등급 · 백분율 · 누적비율)를 붙인다. 평가대상 등급의 칸은 곡선부터 표까지 한 줄로 강조한다.
// 특허평가 결과 보고서(인쇄용)의 항목별 쪽에서 쓴다.
//
// 곡선과 표를 한 컴포넌트가 함께 그리는 이유는 칸 맞춤 때문이다 — 둘을 따로 두면 곡선의 등급 위치와 표의 열이
// 어긋난다. 같은 CSS 격자(왼쪽 이름 칸 + 등급 수만큼의 같은 폭 칸)에 얹어 언제나 같은 자리에 선다.
//
// 강조 칸은 격자의 한 칸을 곡선 줄부터 마지막 줄까지 덮는 옅은 면(blue.50)이다. 먼저 그려 뒤에 깔리고,
// 그 위에 곡선 · 글자가 온다. 색만으로 알리지 않도록 강조 칸의 글자는 굵기와 색을 함께 바꾼다[5.3.1].
//
// [프론트엔드 연동] data 는 등급 순서(높은 등급 → 낮은 등급) 그대로 넣는다. percent 가 곡선의 높이,
// cumulative 는 표의 마지막 줄 값이다. activeGrade 는 평가대상 등급이며, 목록에 없으면 아무 칸도 강조하지 않는다.

type GradeDistributionPoint = {
    grade: string
    percent: number
    cumulative: number
}

type GradeDistributionChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: GradeDistributionPoint[]
    /** 평가대상 등급 — 그 칸을 곡선부터 표까지 강조한다. */
    activeGrade?: string
    /** 표 왼쪽 이름 칸의 글자. */
    gradeRowLabel?: string
    percentRowLabel?: string
    cumulativeRowLabel?: string
}

const CHART_CONFIG: ChartConfig = {percent: {label: '비율'}}

// 곡선 꼭대기 위에 남기는 자리 — 값의 폭(가장 큰 값 - 가장 작은 값)에 대한 비율이다.
// 꼭대기가 위 선에 닿지 않고, 그만큼 오르내림도 완만해진다 — 곡선의 기울기가 이 값에서 나온다(꼭대기는 위에서 13%).
const CURVE_HEADROOM_RATIO = 0.15

// 표 — 칸마다 테두리가 있는 격자다. 칸 사이 선만 긋고 바깥 좌우에는 선을 두지 않는다.
// 선이 겹치지 않도록 오른쪽 · 아래만 주고, 맨 오른쪽 칸에서는 오른쪽 선을 뺀다.
// 글자 크기 · 굵기는 칸마다 한 번만 준다 — typo-* 를 겹쳐 주면 어느 쪽이 이길지 CSS 순서에 맡기게 된다[PB-08].
const cellClassName = 'text-label-foreground border-subtle-3 border-r border-b px-2 py-3 text-center'
// 줄 이름 칸 — 옅은 파랑 면에 굵은 글자다.
const rowLabelClassName =
    'typo-body-l-bold text-foreground bg-blue-50 border-subtle-3 border-r border-b px-2 py-3 text-center whitespace-nowrap'
// 강조 칸 — 옅은 파랑 면에 파란 굵은 글자다. 색만으로 알리지 않도록 굵기도 함께 바꾼다[5.3.1].
const activeCellClassName = 'text-primary-strong bg-blue-50'

const GradeDistributionChart = ({
    ariaLabel,
    data,
    activeGrade,
    gradeRowLabel = '등급',
    percentRowLabel = '백분율(%)',
    cumulativeRowLabel = '누적비율(%)',
    className,
    ...props
}: GradeDistributionChartProps) => {
    // 아이디에 쓸 수 없는 글자를 걸러 url(#...) 참조가 깨지지 않게 한다(다른 차트와 같은 방식).
    const gradientId = `grade-distribution-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
    // 서버에서 그린 HTML 에는 곡선이 없다 — 브라우저가 크기를 잰 뒤에 그려진다. 그 사이에는 자리만 비워 둔다.
    const isHydrated = useIsHydrated()
    const activeIndex = data.findIndex((point) => point.grade === activeGrade)
    const percents = data.map((point) => point.percent)
    const curveMin = Math.min(...percents)
    const curveMax = Math.max(...percents)
    const curveSpan = curveMax - curveMin || 1
    const rows = [
        {key: 'grade', label: gradeRowLabel, value: (point: GradeDistributionPoint) => point.grade},
        {key: 'percent', label: percentRowLabel, value: (point: GradeDistributionPoint) => `${point.percent}%`},
        {
            key: 'cumulative',
            label: cumulativeRowLabel,
            value: (point: GradeDistributionPoint) => `${point.cumulative}%`,
        },
    ]

    return (
        <div {...props} className={cn('min-w-0', className)}>
            {/* 격자 — 왼쪽 이름 칸 + 등급 수만큼의 같은 폭 칸. 곡선과 표가 같은 칸을 써서 등급 자리가 어긋나지 않는다. */}
            <div
                className="grid"
                style={{gridTemplateColumns: `minmax(0, 6.25rem) repeat(${data.length}, minmax(0, 1fr))`}}
            >
                {/* 곡선 줄의 등급 칸 — 칸 경계를 세로 점선으로 긋고, 평가대상 등급 칸은 옅은 파랑으로 채운다.
                    곡선보다 먼저 그려 뒤에 깔린다. */}
                {data.map((point, index) => (
                    <div
                        key={`column-${point.grade}`}
                        aria-hidden="true"
                        className={cn(
                            'border-subtle-3 row-start-1 border-r border-dashed',
                            index === activeIndex && 'border-l bg-blue-50',
                        )}
                        style={{gridColumnStart: index + 2}}
                    />
                ))}

                {/* 곡선 영역 맨 위의 굵은 선(gray.500) — 이름 칸을 포함한 전체 폭에 긋는다. */}
                <div
                    aria-hidden="true"
                    className="border-t-foreground-subtle col-start-1 -col-end-1 row-start-1 border-t"
                />

                {/* 곡선 — 등급 칸 위에 겹쳐 그린다. 축 · 눈금은 두지 않는다(값은 아래 표가 보여 준다). */}
                <div className="col-start-2 -col-end-1 row-start-1">
                    {isHydrated ? (
                        <ChartContainer
                            config={CHART_CONFIG}
                            // print-exact — 인쇄 설정의 '배경 그래픽'을 켜지 않아도 곡선 아래 면 색이 그대로
                            // 나가게 한다. 문서 뿌리에도 걸려 있지만, 이 차트는 문서 밖(특허평가 결과 보고서의
                            // 용지)에서도 쓰이므로 차트 자신이 갖고 있게 둔다.
                            className="print-exact aspect-auto h-36 w-full"
                            role="img"
                            aria-label={ariaLabel}
                        >
                            <AreaChart data={data} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                                <defs>
                                    {/* 색은 여기 적힌 값이 기본이다. 인쇄에서는 app/globals.css 의
                                        .chart-area-* 규칙이 투명도 없는 색으로 덮는다 — 투명도를 쓴 면은
                                        인쇄 경로에서 제대로 나오지 않는 브라우저가 있다. */}
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="0%"
                                            className="chart-area-from"
                                            stopColor="var(--ds-primary)"
                                            stopOpacity={0.18}
                                        />
                                        <stop
                                            offset="100%"
                                            className="chart-area-to"
                                            stopColor="var(--ds-primary)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                {/* 세로 범위 — 아래는 가장 작은 값(양 끝 꼬리가 바닥선에 닿는다), 위는 꼭대기 위 자리만큼 넓게. */}
                                <YAxis hide domain={[curveMin, curveMax + curveSpan * CURVE_HEADROOM_RATIO]} />
                                <Area
                                    type="monotone"
                                    dataKey="percent"
                                    stroke="var(--ds-primary)"
                                    strokeWidth={1}
                                    fill={`url(#${gradientId})`}
                                    isAnimationActive={false}
                                    dot={false}
                                    activeDot={false}
                                />
                            </AreaChart>
                        </ChartContainer>
                    ) : (
                        <ChartSkeleton type="grade-distribution" label={`${ariaLabel} 그래프를 불러오는 중입니다.`} />
                    )}
                </div>

                {/* 표 — 줄마다 이름 칸 + 등급 칸. 곡선과 같은 열을 쓴다. */}
                {rows.map((row, rowIndex) => (
                    <Fragment key={row.key}>
                        <div
                            className={cn(rowLabelClassName, 'col-start-1', rowIndex === 0 && 'border-t')}
                            style={{gridRowStart: rowIndex + 2}}
                        >
                            {row.label}
                        </div>
                        {data.map((point, index) => (
                            <div
                                key={`${row.key}-${point.grade}`}
                                className={cn(
                                    cellClassName,
                                    index === activeIndex ? 'typo-body-l-bold' : 'typo-body-l-regular',
                                    rowIndex === 0 && 'border-t',
                                    index === data.length - 1 && 'border-r-0',
                                    index === activeIndex && activeCellClassName,
                                )}
                                style={{gridRowStart: rowIndex + 2, gridColumnStart: index + 2}}
                            >
                                {row.value(point)}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export {GradeDistributionChart}
export type {GradeDistributionChartProps, GradeDistributionPoint}
