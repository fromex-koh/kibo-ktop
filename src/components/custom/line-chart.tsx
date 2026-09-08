'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {Area, CartesianGrid, ComposedChart, LabelList, Line, XAxis, YAxis} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'

type LineChartSeries = {
    color: string
    key: string
    label: string
}

type LineChartItem = {
    id: string
    label: string
    values: Record<string, number>
}

type LineChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    axisValueSuffix?: string
    curveType?: 'linear' | 'monotone'
    data: LineChartItem[]
    series: LineChartSeries[]
    /** 축·눈금선. 항목 이름과 값을 표가 따로 보여 줄 때는 끈다(선만 남는다). */
    showAxes?: boolean
    /**
     * 값 위에 올렸을 때 뜨는 말풍선. 끄면 호버 때 나타나는 강조(점·막대 색)도 함께 사라진다 —
     * 인쇄용 문서처럼 손이 닿지 않는 자리에서는 둘 다 필요 없다.
     */
    showTooltip?: boolean
    showLegend?: boolean
    /** 선을 점선으로 그린다(예: '4 4'). 실제 측정값이 아니라 흐름을 보이는 선일 때 쓴다. */
    strokeDasharray?: string
    showValueLabels?: boolean
    unit?: string
    valueFractionDigits?: number
    variant?: 'area' | 'line'
    yAxisDomain?: [number, number]
    yAxisStep?: number
}

const LineChart = ({
    data,
    series,
    showAxes = true,
    showLegend = true,
    showTooltip = true,
    strokeDasharray,
    showValueLabels = false,
    unit,
    axisValueSuffix = '',
    curveType = 'linear',
    valueFractionDigits = 0,
    variant = 'line',
    yAxisDomain,
    yAxisStep,
    ariaLabel,
    className,
    ...props
}: LineChartProps) => {
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
    const values = data.flatMap((item) => series.map(({key}) => item.values[key] ?? 0))
    const minimumValue = Math.min(0, ...values)
    const maximumValue = Math.max(0, ...values)
    const normalizedStep = yAxisStep && yAxisStep > 0 ? yAxisStep : undefined
    const calculatedMinimum = normalizedStep ? Math.floor(minimumValue / normalizedStep) * normalizedStep : minimumValue
    const calculatedMaximum = normalizedStep
        ? Math.max(normalizedStep, Math.ceil(maximumValue / normalizedStep) * normalizedStep)
        : maximumValue || 1
    const domainMinimum = yAxisDomain?.[0] ?? calculatedMinimum
    const domainMaximum = yAxisDomain?.[1] ?? calculatedMaximum
    const yAxisTicks = normalizedStep
        ? Array.from(
              {length: Math.floor((domainMaximum - domainMinimum) / normalizedStep) + 1},
              (_, index) => domainMinimum + index * normalizedStep,
          )
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
                    className="h-80 w-full min-w-160 sm:min-w-0 [&_.recharts-dot]:cursor-pointer [&_.recharts-line-curve]:cursor-pointer"
                    role="img"
                    aria-label={ariaLabel}
                >
                    <ComposedChart
                        accessibilityLayer
                        data={chartData}
                        margin={
                            showAxes ? {top: 40, right: 16, bottom: 8, left: 8} : {top: 8, right: 0, bottom: 0, left: 0}
                        }
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
                                domain={[domainMinimum, domainMaximum]}
                                ticks={yAxisTicks}
                                tickLine={false}
                                axisLine={{stroke: 'var(--ds-foreground-subtle)', strokeWidth: 1.2}}
                                tick={{fill: 'var(--ds-foreground)', fontSize: 12}}
                                tickMargin={8}
                                tickFormatter={(value: number) => `${valueFormatter.format(value)}${axisValueSuffix}`}
                                width={64}
                            />
                        ) : null}
                        {showTooltip ? (
                            <ChartTooltip
                                key="tooltip"
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideIndicator
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
                        {series.map((item) => {
                            const labels = showValueLabels ? (
                                <LabelList
                                    dataKey={item.key}
                                    position="top"
                                    offset={12}
                                    fill="var(--ds-foreground)"
                                    fontSize={11}
                                    fontWeight={600}
                                    formatter={(value) => valueFormatter.format(Number(value ?? 0))}
                                />
                            ) : null

                            return variant === 'area' ? (
                                <Area
                                    key={item.key}
                                    type={curveType}
                                    dataKey={item.key}
                                    name={item.key}
                                    stroke={`var(--color-${item.key})`}
                                    strokeWidth={2.5}
                                    strokeDasharray={strokeDasharray}
                                    fill={`var(--color-${item.key})`}
                                    fillOpacity={0.1}
                                    dot={{
                                        r: 6,
                                        fill: 'var(--ds-background)',
                                        fillOpacity: 1,
                                        stroke: `var(--color-${item.key})`,
                                        strokeWidth: 2,
                                    }}
                                    activeDot={
                                        showTooltip && {
                                            r: 6,
                                            fill: `var(--color-${item.key})`,
                                            fillOpacity: 1,
                                            strokeWidth: 0,
                                        }
                                    }
                                >
                                    {labels}
                                </Area>
                            ) : (
                                <Line
                                    key={item.key}
                                    type={curveType}
                                    dataKey={item.key}
                                    name={item.key}
                                    stroke={`var(--color-${item.key})`}
                                    strokeWidth={2.5}
                                    strokeDasharray={strokeDasharray}
                                    dot={{
                                        r: 6,
                                        fill: 'var(--ds-background)',
                                        fillOpacity: 1,
                                        stroke: `var(--color-${item.key})`,
                                        strokeWidth: 2,
                                    }}
                                    activeDot={
                                        showTooltip && {
                                            r: 6,
                                            fill: `var(--color-${item.key})`,
                                            fillOpacity: 1,
                                            strokeWidth: 0,
                                        }
                                    }
                                >
                                    {labels}
                                </Line>
                            )
                        })}
                    </ComposedChart>
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
                        <th scope="col">기간</th>
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

export {LineChart}
export type {LineChartItem, LineChartProps, LineChartSeries}
