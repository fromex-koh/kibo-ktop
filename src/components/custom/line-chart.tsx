'use client'

import {useId, type ComponentPropsWithoutRef} from 'react'
import {Area, CartesianGrid, ComposedChart, LabelList, Line, XAxis, YAxis} from 'recharts'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {
    CELLS_DIVIDER_DASH,
    CELLS_GRID_STROKE,
    CELLS_X_AXIS_HEIGHT,
    CELLS_X_TICK,
    CELLS_X_TICK_MARGIN,
    cellsBottomLine,
    cellsDividerLines,
    cellsEdgeLines,
    renderCellsLineValueLabel,
} from '@/components/custom/chart-cells'
import {ChartTooltipRow} from '@/components/composite/chart-tooltip-parts'
import {chartTooltipClassName, chartTooltipTitleClassName} from '@/components/theme/chart-tooltip.variants'

// columns 전체 높이(그릴 자리 + 항목 이름 자리 26) — 클래스는 정적 문자열이어야 생성된다.
const COLUMNS_HEIGHT_CLASS_NAMES = {140: 'h-41.5', 170: 'h-49', 180: 'h-51.5', 200: 'h-56.5'} as const
type LineChartPlotHeight = keyof typeof COLUMNS_HEIGHT_CLASS_NAMES

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
    /**
     * 틀 모양. 'default' 는 y축 · 가로 점선 눈금 · 아래 범례다. 'cells' 는 K-BIGx 보고서 "분기별 종업원수" 카드 모양 —
     * 높이 200 자리에 점마다 세로 점선 · 바닥 실선(gray.100)만 두고, 양 끝 점은 가장자리에서 24 안쪽에 선다.
     * 선 두께 2 · 점 지름 12(흰 면 + 계열 색 테두리) · 면은 위에서 아래로 옅어지는 계열 색 · 값 11 Regular(gray.600)는 점 바로 위,
     * 항목 이름 12 Regular(gray.700)는 바닥 아래 8 이다. 가장 큰 값은 위에서 29%, 가장 작은 값은 위에서 80% 에 선다.
     * 'columns' 는 K-BIGx 보고서 기업현황 "주요재무비율 · 현금흐름" 카드 모양 — 항목마다 칸(양 끝 · 바닥 실선, 사이 점선)을 두고
     * 점은 칸 가운데에 선다. 여러 선을 겹쳐 보이는 용도라 값 글자 · 면 없이 쓰고, 범례는 아래 16 사각 견본(왼쪽 정렬)이다.
     * 값 폭이 높이의 80% 를 쓰고 위 · 아래 10% 씩 비운다.
     */
    appearance?: 'default' | 'cells' | 'columns'
    /**
     * columns 범례 자리 — 'bottom'(기본, 왼쪽 정렬로 그래프 아래) · 'top-end'(그래프 위 오른쪽, 간격 8).
     * 표와 나란히 놓여 높이가 낮은 카드(보고서 활동성정보 에너지 사용량)는 'top-end' 다.
     */
    legendPlacement?: 'bottom' | 'top-end'
    /**
     * columns 그릴 자리 높이(px) — 200(기본) · 180(신용/담보 비중) · 170(표 옆 카드 — 재무비율진단) · 140(표 옆 낮은 카드 —
     * 에너지 사용량). 항목 이름 자리(26)는 같다.
     */
    plotHeight?: LineChartPlotHeight
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
    /** 그리는 움직임. 인쇄용 문서처럼 그린 즉시 찍혀야 하는 곳에서는 끈다. */
    animate?: boolean
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

// appearance 'cells' 치수 — 양 끝 점 안쪽 여백 24 · 선 두께 2 · 점 반지름 5(+ 테두리 2 = 지름 12) ·
// 값 글자는 점 가장자리에서 2(골짜기 점은 아래). 가장 큰 값 위 29% · 가장 작은 값 아래 20% 를 비워 값 글자와 면이 칸 안에 들어오게 한다.
const CELLS_EDGE_PADDING = 24
const CELLS_STROKE_WIDTH = 2
const CELLS_DOT_RADIUS = 5
const CELLS_TOP_SPACE_RATIO = 0.29
const CELLS_BOTTOM_SPACE_RATIO = 0.2
// 면 채움 — 위(선 쪽)는 계열 색 16%, 바닥은 투명.
const CELLS_AREA_TOP_OPACITY = 0.16
// 항목 이름 사이 최소 간격 — 이보다 가까우면 사이 이름을 건너뛴다.
const CELLS_TICK_MIN_GAP = 8

// 세로 범위 — 값의 폭(최솟값~최댓값)이 가운데 51% 를 차지하게 위 · 아래를 비운다. 값이 모두 같으면 그 값을 가운데 둔다.
const cellsLineDomain = (minimumValue: number, maximumValue: number): [number, number] => {
    const span = maximumValue - minimumValue || Math.abs(maximumValue) || 1
    const dataRatio = 1 - CELLS_TOP_SPACE_RATIO - CELLS_BOTTOM_SPACE_RATIO
    const unit = span / dataRatio
    return maximumValue === minimumValue
        ? [minimumValue - unit / 2, maximumValue + unit / 2]
        : [minimumValue - unit * CELLS_BOTTOM_SPACE_RATIO, maximumValue + unit * CELLS_TOP_SPACE_RATIO]
}

// columns 세로 범위 — 값 폭이 높이의 80% 를 쓰게 위 · 아래 10% 씩 비운다. 값이 모두 같으면 가운데 둔다.
const COLUMNS_SPACE_RATIO = 0.1
const COLUMNS_MIN_CELL_WIDTH = 80
const columnsLineDomain = (minimumValue: number, maximumValue: number): [number, number] => {
    const span = maximumValue - minimumValue || Math.abs(maximumValue) || 1
    const padding = (span / (1 - COLUMNS_SPACE_RATIO * 2)) * COLUMNS_SPACE_RATIO
    return maximumValue === minimumValue
        ? [minimumValue - span, maximumValue + span]
        : [minimumValue - padding, maximumValue + padding]
}

const LineChart = ({
    appearance = 'default',
    legendPlacement = 'bottom',
    plotHeight = 200,
    data,
    series,
    showAxes = true,
    showLegend = true,
    showTooltip = true,
    animate = true,
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
    // cells · columns 는 같은 틀(높이 · 점 · 값 글자 · 칸 선 색)을 쓰고, 점 자리 · 칸 선 · 범례만 다르다.
    const isColumns = appearance === 'columns'
    const isCells = appearance === 'cells' || isColumns
    // 면 채움 그라디언트 id — 한 화면에 차트가 여럿이어도 겹치지 않게 차트마다 다르게 만든다.
    const gradientIdPrefix = `line-area-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
    const values = data.flatMap((item) => series.map(({key}) => item.values[key] ?? 0))
    const cellsDomain: [number, number] = !values.length
        ? [0, 1]
        : isColumns
          ? columnsLineDomain(Math.min(...values), Math.max(...values))
          : cellsLineDomain(Math.min(...values), Math.max(...values))
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

    const columnsLegend = (
        <ul
            className={cn(
                'typo-body-l-regular text-label-foreground flex flex-wrap gap-x-6 gap-y-2',
                legendPlacement === 'top-end' && 'justify-end',
            )}
        >
            {series.map((item) => (
                <li key={item.key} className="flex items-center gap-2">
                    <span className="size-4 shrink-0" style={{backgroundColor: item.color}} aria-hidden="true" />
                    {item.label}
                </li>
            ))}
        </ul>
    )

    return (
        <div {...props} className={cn('flex w-full flex-col', isColumns ? 'gap-2' : 'gap-4', className)}>
            {showLegend && isColumns && legendPlacement === 'top-end' ? columnsLegend : null}
            <div className="relative w-full overflow-x-auto">
                {unit && !isCells ? (
                    <span className="typo-body-s-regular text-foreground absolute top-0 left-3 z-10" aria-hidden="true">
                        단위: {unit}
                    </span>
                ) : null}
                <ChartContainer
                    config={config}
                    className={cn(
                        'w-full',
                        showTooltip && '[&_.recharts-dot]:cursor-pointer [&_.recharts-line-curve]:cursor-pointer',
                        // cells: 그릴 자리 200 + 항목 이름 자리 26 = 226. 좁은 화면에서는 점 사이가 좁아 값 글자가 겹치지
                        // 않게 폭 576 을 지키고 그래프만 가로로 넘긴다.
                        // columns: 칸마다 점이 서므로 칸 폭 80 × 항목 수를 최소 폭으로 지킨다(아래 style) — 항목이 많아 칸이 좁아지면
                        // 점 · 항목 이름이 겹치지 않게 그래프만 가로로 넘긴다.
                        isColumns
                            ? COLUMNS_HEIGHT_CLASS_NAMES[plotHeight]
                            : isCells
                              ? 'h-56.5 min-w-144'
                              : 'h-80 min-w-160 sm:min-w-0',
                    )}
                    style={isColumns ? {minWidth: data.length * COLUMNS_MIN_CELL_WIDTH} : undefined}
                    role="img"
                    aria-label={ariaLabel}
                >
                    <ComposedChart
                        accessibilityLayer
                        data={chartData}
                        margin={
                            isCells
                                ? {top: 0, right: 0, bottom: 0, left: 0}
                                : showAxes
                                  ? {top: 40, right: 16, bottom: 8, left: 8}
                                  : {top: 8, right: 0, bottom: 0, left: 0}
                        }
                    >
                        {isCells ? (
                            <defs key="area-gradients">
                                {series.map((item) => (
                                    <linearGradient
                                        key={item.key}
                                        id={`${gradientIdPrefix}-${item.key}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={`var(--color-${item.key})`}
                                            stopOpacity={CELLS_AREA_TOP_OPACITY}
                                        />
                                        <stop offset="100%" stopColor={`var(--color-${item.key})`} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                        ) : null}
                        {isColumns ? (
                            // 항목 칸 — 바닥 · 양 끝은 실선, 항목 사이는 점선(막대 칸형 차트와 같은 선).
                            <CartesianGrid
                                key="columns-solid"
                                stroke={CELLS_GRID_STROKE}
                                horizontalCoordinatesGenerator={cellsBottomLine}
                                verticalCoordinatesGenerator={cellsEdgeLines}
                            />
                        ) : null}
                        {isColumns ? (
                            <CartesianGrid
                                key="columns-dashed"
                                stroke={CELLS_GRID_STROKE}
                                strokeDasharray={CELLS_DIVIDER_DASH}
                                horizontal={false}
                                verticalCoordinatesGenerator={cellsDividerLines(data.length)}
                            />
                        ) : null}
                        {isCells && !isColumns ? (
                            // 점마다 세로 점선(x 눈금 자리). 바닥 실선은 x축 선이 긋는다.
                            <CartesianGrid
                                key="cells-grid"
                                horizontal={false}
                                stroke={CELLS_GRID_STROKE}
                                strokeDasharray={CELLS_DIVIDER_DASH}
                                // 점 자리에만 긋는다 — 기본 생성기는 그릴 자리 양 끝에도 선을 더하는데, 이 모양에서는 필요 없다.
                                verticalCoordinatesGenerator={({offset}) =>
                                    data.map((_, index) => {
                                        const left = (offset.left ?? 0) + CELLS_EDGE_PADDING
                                        const span = (offset.width ?? 0) - CELLS_EDGE_PADDING * 2
                                        return data.length > 1
                                            ? left + (span * index) / (data.length - 1)
                                            : left + span / 2
                                    })
                                }
                            />
                        ) : null}
                        {isColumns ? (
                            // 점을 칸 가운데에 세운다(band) — 막대 칸형 차트와 칸이 같다.
                            <XAxis
                                key="x-axis"
                                dataKey="label"
                                scale="band"
                                tickLine={false}
                                axisLine={false}
                                tick={CELLS_X_TICK}
                                tickMargin={CELLS_X_TICK_MARGIN}
                                height={CELLS_X_AXIS_HEIGHT}
                                interval={0}
                            />
                        ) : null}
                        {isCells && !isColumns ? (
                            <XAxis
                                key="x-axis"
                                dataKey="label"
                                tickLine={false}
                                axisLine={{stroke: CELLS_GRID_STROKE}}
                                tick={CELLS_X_TICK}
                                tickMargin={CELLS_X_TICK_MARGIN}
                                height={CELLS_X_AXIS_HEIGHT}
                                padding={{left: CELLS_EDGE_PADDING, right: CELLS_EDGE_PADDING}}
                                // 점이 많아 이름이 겹치면 처음 · 끝은 남기고 사이 이름을 건너뛴다. 세로 점선은 모든 점에 남는다.
                                interval="preserveStartEnd"
                                minTickGap={CELLS_TICK_MIN_GAP}
                            />
                        ) : null}
                        {isCells ? <YAxis key="y-axis" hide domain={cellsDomain} /> : null}
                        {showAxes && !isCells ? (
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
                        {showAxes && !isCells ? (
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
                        {showAxes && !isCells ? (
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
                                        className={chartTooltipClassName}
                                        labelClassName={chartTooltipTitleClassName}
                                        hideIndicator
                                        labelKey="label"
                                        formatter={(value, name) => (
                                            <ChartTooltipRow
                                                color={config[String(name)]?.color}
                                                name={config[String(name)]?.label}
                                                value={`${valueFormatter.format(Number(value))}${unit ? ` ${unit}` : ''}`}
                                            />
                                        )}
                                    />
                                }
                            />
                        ) : null}
                        {series.map((item) => {
                            const labels = !showValueLabels ? null : isCells ? (
                                <LabelList
                                    dataKey={item.key}
                                    content={(labelProps) =>
                                        renderCellsLineValueLabel(
                                            labelProps,
                                            (number) => valueFormatter.format(number),
                                            {
                                                values: data.map((entry) => entry.values[item.key] ?? 0),
                                                edgePadding: CELLS_EDGE_PADDING,
                                                dotRadius: CELLS_DOT_RADIUS + CELLS_STROKE_WIDTH / 2,
                                                domain: cellsDomain,
                                                placementAt: (index) => {
                                                    // 계열이 둘 이상이면 같은 시점의 다른 계열과 견준다 — 모두보다 아래면 글자를 점 아래,
                                                    // 모두보다 위면 점 위. 가운데 끼인 계열은 기울기 판단(기본)에 맡긴다.
                                                    if (series.length < 2) return undefined
                                                    const own = data[index]?.values[item.key] ?? 0
                                                    const others = series
                                                        .filter((other) => other.key !== item.key)
                                                        .map((other) => data[index]?.values[other.key] ?? 0)
                                                    if (others.every((other) => other > own)) return 'below'
                                                    if (others.every((other) => other < own)) return 'above'
                                                    return undefined
                                                },
                                            },
                                        )
                                    }
                                />
                            ) : (
                                <LabelList
                                    dataKey={item.key}
                                    position="top"
                                    offset={12}
                                    fill="var(--ds-foreground)"
                                    fontSize={11}
                                    fontWeight={600}
                                    formatter={(value) => valueFormatter.format(Number(value ?? 0))}
                                />
                            )
                            const dot = isCells
                                ? {
                                      r: CELLS_DOT_RADIUS,
                                      fill: 'var(--ds-surface)',
                                      fillOpacity: 1,
                                      stroke: `var(--color-${item.key})`,
                                      strokeWidth: CELLS_STROKE_WIDTH,
                                  }
                                : {
                                      r: 6,
                                      fill: 'var(--ds-background)',
                                      fillOpacity: 1,
                                      stroke: `var(--color-${item.key})`,
                                      strokeWidth: 2,
                                  }

                            return variant === 'area' ? (
                                <Area
                                    key={item.key}
                                    type={curveType}
                                    dataKey={item.key}
                                    name={item.key}
                                    isAnimationActive={animate}
                                    stroke={`var(--color-${item.key})`}
                                    strokeWidth={isCells ? CELLS_STROKE_WIDTH : 2.5}
                                    strokeDasharray={strokeDasharray}
                                    fill={
                                        isCells ? `url(#${gradientIdPrefix}-${item.key})` : `var(--color-${item.key})`
                                    }
                                    fillOpacity={isCells ? 1 : 0.1}
                                    dot={dot}
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
                                    isAnimationActive={animate}
                                    stroke={`var(--color-${item.key})`}
                                    strokeWidth={isCells ? CELLS_STROKE_WIDTH : 2.5}
                                    strokeDasharray={strokeDasharray}
                                    dot={dot}
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

            {showLegend && isColumns && legendPlacement === 'bottom' ? columnsLegend : null}
            {showLegend && !isColumns ? (
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

            {/* 감추는 상자를 따로 둔다 — 표에 직접 sr-only 를 걸면 표가 제 폭만큼 자리를 차지해 문서가 가로로 넓어진다. */}
            <div className="sr-only">
                <table>
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
        </div>
    )
}

export {LineChart}
export type {LineChartItem, LineChartProps, LineChartSeries}
