'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis, type RectangleProps} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

// 값이 0 인 막대를 그리는 방법.
// recharts 는 높이 0 인 사각형을 아예 만들지 않고 걸러 내는데(Bar 의 width·height 0 필터), 그때
// 그 막대 뒤에 깔리는 눈금 배경까지 함께 사라진다 — 시안은 값이 0 이어도 배경 기둥이 서 있다.
// 직접 그리는 모양(shape)을 넘기면 recharts 가 그 거르기를 건너뛰므로, 배경은 남기고 막대만
// 그리지 않을 수 있다. 배경을 깔 때(showTrack)만 쓴다.
const BarRectangle = (props: RectangleProps) => (props.height ? <Rectangle {...props} /> : null)

type GroupedColumnSeries = {
    color: string
    key: string
    label: string
}

type GroupedColumnItem = {
    id: string
    label: string
    values: Record<string, number>
}

type GroupedColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /**
     * 막대가 자라나는 움직임. 인쇄용 문서처럼 그린 즉시 그대로 찍혀야 하는 곳에서는 끈다 —
     * 켜 두면 움직이는 도중에 인쇄돼 막대가 덜 자란 채로 남을 수 있다.
     */
    animate?: boolean
    data: GroupedColumnItem[]
    /** 한 묶음 안에서 막대 사이 간격(px). */
    barGap?: number
    /** 막대 위쪽 모서리 반경(px). 0 이면 각진 막대다. */
    barRadius?: number
    /** 막대 하나의 최대 두께(px). 열이 좁은 표 안에 넣을 때 줄인다. */
    maxBarSize?: number
    series: GroupedColumnSeries[]
    /** 축·눈금선. 항목 이름과 값을 표가 따로 보여 줄 때는 끈다(막대만 남는다). */
    showAxes?: boolean
    /**
     * 값 위에 올렸을 때 뜨는 말풍선. 끄면 호버 때 나타나는 강조(점·막대 색)도 함께 사라진다 —
     * 인쇄용 문서처럼 손이 닿지 않는 자리에서는 둘 다 필요 없다.
     */
    showTooltip?: boolean
    showLegend?: boolean
    /** 막대 뒤에 최댓값까지의 옅은 기둥을 깔아 눈금 없이도 높이를 견주게 한다. */
    showTrack?: boolean
    showValueLabels?: boolean
    unit?: string
    valueFractionDigits?: number
    yAxisStep?: number
}

const numberFormatter = new Intl.NumberFormat('ko-KR')

const GroupedColumnChart = ({
    animate = true,
    data,
    barGap = 4,
    barRadius = 4,
    maxBarSize = 32,
    series,
    showAxes = true,
    showLegend = true,
    showTooltip = true,
    showTrack = false,
    showValueLabels = false,
    unit,
    valueFractionDigits = 0,
    yAxisStep,
    ariaLabel,
    className,
    ...props
}: GroupedColumnChartProps) => {
    const fractionDigits = Math.min(6, Math.max(0, valueFractionDigits))
    const valueFormatter = new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })
    const config = Object.fromEntries(
        series.map((item) => [item.key, {label: item.label, color: item.color}]),
    ) satisfies ChartConfig
    // recharts 는 자료 한 줄의 속성을 그린 도형에 그대로 옮긴다 — id 를 담아 보내면 배경 막대·계열 막대가
    // 모두 같은 id 를 달아 문서에 같은 id 가 여러 번 생긴다[8.1.1]. id 는 아래 숨김 표의 key 로만 쓰므로
    // 차트로는 넘기지 않는다.
    const chartData = data.map((item) => ({label: item.label, ...item.values}))
    const maximumValue = Math.max(
        0,
        ...data.flatMap((item) => series.map(({key}) => Math.max(0, item.values[key] ?? 0))),
    )
    const normalizedStep = yAxisStep && yAxisStep > 0 ? yAxisStep : undefined
    const yAxisMaximum = normalizedStep
        ? Math.max(normalizedStep, Math.ceil(maximumValue / normalizedStep) * normalizedStep)
        : undefined
    const yAxisTicks = normalizedStep
        ? Array.from({length: yAxisMaximum! / normalizedStep + 1}, (_, index) => index * normalizedStep)
        : undefined

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            <div className="relative w-full overflow-x-auto">
                {unit ? (
                    <span className="typo-body-s-regular text-foreground absolute top-0 left-3 z-10" aria-hidden="true">
                        단위: {unit}
                    </span>
                ) : null}
                <ChartContainer
                    config={config}
                    className="h-80 w-full min-w-160 sm:min-w-0 [&_.recharts-rectangle]:cursor-pointer"
                    role="img"
                    aria-label={ariaLabel}
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={
                            showAxes ? {top: 40, right: 12, bottom: 8, left: 8} : {top: 0, right: 0, bottom: 0, left: 0}
                        }
                        barCategoryGap="24%"
                        barGap={barGap}
                    >
                        {showAxes ? (
                            <CartesianGrid
                                key="grid"
                                vertical={false}
                                stroke="var(--ds-subtle-2)"
                                strokeDasharray="4 4"
                                horizontalCoordinatesGenerator={({yAxis}) =>
                                    yAxisTicks
                                        ?.map((value) => yAxis?.scale?.map(value))
                                        .filter((coordinate): coordinate is number => typeof coordinate === 'number') ??
                                    []
                                }
                            />
                        ) : null}
                        {showAxes ? (
                            <XAxis
                                key="x-axis"
                                dataKey="label"
                                tickLine={false}
                                axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                                tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                                tickMargin={10}
                                interval={0}
                            />
                        ) : null}
                        {showAxes ? (
                            <YAxis
                                key="y-axis"
                                domain={[0, yAxisMaximum ?? (maximumValue === 0 ? 1 : 'auto')]}
                                ticks={yAxisTicks}
                                tickLine={false}
                                axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                                tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                                tickMargin={8}
                                tickFormatter={(value: number) => numberFormatter.format(value)}
                                width={64}
                            />
                        ) : (
                            // 축을 감춰도 세로 눈금 자체는 있어야 한다 — 없으면 recharts 가 제 기준으로
                            // 눈금을 잡아 막대가 제 높이로 서지 못한다. 가장 큰 값이 기둥 끝에 닿게 둔다.
                            <YAxis
                                key="y-axis"
                                hide
                                domain={[0, yAxisMaximum ?? (maximumValue === 0 ? 1 : maximumValue)]}
                            />
                        )}
                        {showTooltip ? (
                            <ChartTooltip
                                key="tooltip"
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="dot"
                                        labelKey="label"
                                        formatter={(value, name) => (
                                            <div className="flex w-full items-center justify-between gap-6">
                                                <span className="flex items-center gap-1.5">
                                                    <span
                                                        className="size-2.5 shrink-0 rounded-full"
                                                        style={{backgroundColor: config[String(name)]?.color}}
                                                        aria-hidden="true"
                                                    />
                                                    {config[String(name)]?.label}
                                                </span>
                                                <strong className="text-foreground tabular-nums">
                                                    {valueFormatter.format(Number(value))}
                                                    {unit ? ` ${unit}` : ''}
                                                </strong>
                                            </div>
                                        )}
                                    />
                                }
                            />
                        ) : null}
                        {series.map((item) => (
                            <Bar
                                key={item.key}
                                dataKey={item.key}
                                name={item.key}
                                fill={`var(--color-${item.key})`}
                                background={showTrack ? {fill: 'var(--ds-accent-subtle)'} : undefined}
                                shape={showTrack ? BarRectangle : undefined}
                                activeBar={
                                    showTooltip && {
                                        fill: `color-mix(in srgb, var(--color-${item.key}) 78%, var(--ds-foreground))`,
                                    }
                                }
                                radius={[barRadius, barRadius, 0, 0]}
                                maxBarSize={maxBarSize}
                                isAnimationActive={animate}
                            >
                                {showValueLabels ? (
                                    <LabelList
                                        dataKey={item.key}
                                        position="top"
                                        fill="var(--ds-foreground)"
                                        fontSize={11}
                                        fontWeight={600}
                                        formatter={(value) => valueFormatter.format(Number(value ?? 0))}
                                    />
                                ) : null}
                            </Bar>
                        ))}
                    </BarChart>
                </ChartContainer>
            </div>

            {showLegend ? (
                <ul className="typo-body-s-regular text-foreground flex flex-wrap justify-center gap-x-5 gap-y-2">
                    {series.map((item) => (
                        <li key={item.key} className="flex items-center gap-1.5">
                            <span
                                className="size-3 rounded-full"
                                style={{backgroundColor: item.color}}
                                aria-hidden="true"
                            />
                            {item.label}
                        </li>
                    ))}
                </ul>
            ) : null}

            <table className="sr-only">
                <caption>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">항목</th>
                        {series.map((item) => (
                            <th key={item.key} scope="col">
                                {item.label}
                                {unit ? ` (${unit})` : ''}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <th scope="row">{item.label}</th>
                            {series.map(({key}) => (
                                <td key={key}>{valueFormatter.format(item.values[key] ?? 0)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {GroupedColumnChart}
export type {GroupedColumnChartProps, GroupedColumnItem, GroupedColumnSeries}
