'use client'

import {useState, type ComponentPropsWithoutRef} from 'react'
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart} from 'recharts'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from '@/components/ui/chart'
import {cn} from '@/lib/utils'
import {ChartTooltipRow} from '@/components/composite/chart-tooltip-parts'
import {chartTooltipClassName, chartTooltipTitleClassName} from '@/components/theme/chart-tooltip.variants'

type ComparisonRadarItem = {
    id: string
    label: string
    primaryValue: number
    /** 비교 대상 값. 비교 없이 한 계열만 그릴 때는 비운다. */
    comparisonValue?: number
}

type ComparisonRadarChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /**
     * 다각형이 가운데에서 펼쳐지는 움직임. 인쇄용 문서처럼 그린 즉시 그대로 찍혀야 하는 곳에서는 끈다 —
     * 켜 두면 펼쳐지는 도중에 인쇄돼 다각형이 덜 자란 채로 남을 수 있다.
     */
    animate?: boolean
    ariaLabel: string
    /** 비교 계열의 이름. 주면 점선 계열이 함께 그려지고, 주지 않으면 주 계열만 그린다. */
    comparisonLabel?: string
    data: ComparisonRadarItem[]
    /** 다각형 중심의 세로 위치. 숫자는 px, 문자열은 비율('50%')이다. 기본은 그릴 자리의 한가운데다. */
    centerY?: number | string
    /** 차트가 앉는 자리의 여백. */
    margin?: {top?: number; right?: number; bottom?: number; left?: number}
    /** 다각형의 반지름. 숫자는 px, 문자열은 그릴 자리 대비 비율('72%')이다. */
    outerRadius?: number | string
    primaryLabel: string
    /** 격자 고리 수. */
    ringCount?: number
    /** 축 이름의 글자 크기·굵기. */
    tickFontSize?: number
    tickFontWeight?: number
    /** 꼭짓점의 점. 값이 몇인지 표로 따로 보여 줄 때는 끈다. */
    showDots?: boolean
    /** 차트 위 범례. 계열이 하나뿐이라 범례가 필요 없을 때 끈다. */
    showLegend?: boolean
    /**
     * 값 위에 올렸을 때 뜨는 말풍선. 끄면 호버 때 나타나는 강조점도 함께 사라진다 —
     * 인쇄용 문서처럼 손이 닿지 않는 자리에서는 둘 다 필요 없다.
     */
    showTooltip?: boolean
    /** 주 계열의 색. 차트 토큰(var(--ds-chart-N))을 쓴다. */
    primaryColor?: string
    /** 비교 계열의 색. */
    comparisonColor?: string
    /**
     * 비교 계열을 그리는 방식. 'dashed' 는 점선 테두리만, 'filled' 는 옅은 면으로 채운 실선이다
     * (특허 등급조회처럼 비교 계열이 배경 면으로 깔리는 화면에서 쓴다).
     */
    comparisonAppearance?: 'dashed' | 'filled'
    /**
     * 범례 모양. 'outline' 은 테두리 칸(기본), 'swatch' 는 16 칸을 색으로 채운 견본이다 —
     * 주 계열은 진한 색, 비교 계열은 옅은 면 + 테두리(특허 등급조회에서 쓴다).
     */
    legendAppearance?: 'outline' | 'swatch'
    /** 축 이름의 글자색. */
    tickColor?: string
    /**
     * 차트 칸의 크기. 기본은 정사각(aspect-square)이다 — 축이 셋뿐인 삼각 레이더처럼 위아래가 남는 모양은
     * 높이를 직접 정해 빈 곳을 줄인다(예: 'aspect-auto h-60 md:h-76').
     */
    chartClassName?: string
    /**
     * 축이 놓이는 방향. 첫 축은 늘 맨 위이고, 'clockwise'(기본)는 두 번째 축이 오른쪽,
     * 'counterclockwise' 는 왼쪽에 온다(특허 등급조회: 기술다양성 → 시장확장성(왼쪽 아래) → 가치창출가능성(오른쪽 아래)).
     */
    direction?: 'clockwise' | 'counterclockwise'
    /** 주 계열 꼭짓점 점의 모양. 'filled' 는 채운 점, 'hollow' 는 흰 면에 계열 색 테두리다. */
    dotAppearance?: 'filled' | 'hollow'
    /** 격자(고리 · 축 선)의 색. */
    gridColor?: string
    /** 격자 고리 모양. 'polygon'(기본)은 축을 잇는 다각형, 'circle' 은 동심원이다(K-BIGx 보고서 부문별 비교). */
    gridType?: 'polygon' | 'circle'
    /**
     * 주 계열 · 비교 계열 면의 투명도(0~1). 두 면은 모두 반투명이라 겹친 곳이 한 단계 진해진다 —
     * 비교 계열이 주 계열 아래에 깔려도 비쳐 보인다. 비교 계열 면은 'filled' 일 때만 그린다.
     */
    primaryFillOpacity?: number
    comparisonFillOpacity?: number
    /**
     * 값을 불러오는 중. 스켈레톤을 대신 보인다 — 축이 셋이면 삼각 레이더(triangle-radar), 그 밖에는 기본 레이더 모양이다.
     * 새로고침 직후 차트가 칸의 폭을 재기 전(하이드레이션 전)에도 같은 스켈레톤이 자동으로 보인다.
     */
    isLoading?: boolean
    /** 불러오는 중에 화면 낭독기가 읽을 말. */
    loadingLabel?: string
}

const clampScore = (value: number) => Math.min(100, Math.max(0, value))
const RADAR_DOT_RADIUS = 5
// 속이 빈 점 — 테두리 포함 지름 8 이라 반지름 4 다.
const HOLLOW_DOT_RADIUS = 4
const TRIANGLE_AXIS_COUNT = 3
// 비교 계열을 면으로 채울 때의 진하기 — 범례 견본(같은 색 25%)과 같게 둔다.
const COMPARISON_FILL_OPACITY = 0.25
const PRIMARY_FILL_OPACITY = 0.16

const DEFAULT_RADAR_MARGIN = {top: 20, right: 48, bottom: 20, left: 48}

type ComparisonRadarLegendProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> &
    Pick<
        ComparisonRadarChartProps,
        'primaryLabel' | 'comparisonLabel' | 'primaryColor' | 'comparisonColor' | 'comparisonFillOpacity'
    >

// 색 견본 범례(swatch) — 차트 위에 두거나(showLegend), 카드 머리 줄처럼 다른 자리에 따로 둘 때 쓴다
// (그때는 차트의 showLegend 를 끈다). 주 계열은 채운 16 칸, 비교 계열은 옅은 면 + 점선 테두리다.
const ComparisonRadarLegend = ({
    primaryLabel,
    comparisonLabel,
    primaryColor = 'var(--ds-chart-1)',
    comparisonColor = 'var(--ds-chart-5)',
    comparisonFillOpacity = COMPARISON_FILL_OPACITY,
    className,
    ...props
}: ComparisonRadarLegendProps) => (
    <div
        {...props}
        className={cn('typo-body-l-regular text-label-foreground flex flex-wrap gap-x-6 gap-y-2', className)}
    >
        <span className="flex items-center gap-2">
            <span className="size-4 shrink-0" style={{backgroundColor: primaryColor}} aria-hidden="true" />
            {primaryLabel}
        </span>
        {comparisonLabel ? (
            <span className="flex items-center gap-2">
                <span
                    className="size-4 shrink-0 border border-dashed"
                    style={{
                        borderColor: comparisonColor,
                        // 차트 면과 같은 진하기(같은 색 × 투명도)로 칠한다.
                        backgroundColor: `color-mix(in srgb, ${comparisonColor} ${comparisonFillOpacity * 100}%, transparent)`,
                    }}
                    aria-hidden="true"
                />
                {comparisonLabel}
            </span>
        ) : null}
    </div>
)

const ComparisonRadarChart = ({
    animate = true,
    data,
    primaryLabel,
    comparisonLabel,
    centerY,
    margin = DEFAULT_RADAR_MARGIN,
    outerRadius = '72%',
    ringCount = 5,
    tickFontSize = 12,
    tickFontWeight = 600,
    showDots = true,
    showLegend = true,
    showTooltip = true,
    primaryColor = 'var(--ds-chart-1)',
    comparisonColor = 'var(--ds-chart-5)',
    comparisonAppearance = 'dashed',
    legendAppearance = 'outline',
    tickColor = 'var(--ds-foreground)',
    chartClassName,
    direction = 'clockwise',
    dotAppearance = 'filled',
    gridColor = 'var(--ds-subtle-2)',
    gridType = 'polygon',
    primaryFillOpacity = PRIMARY_FILL_OPACITY,
    comparisonFillOpacity = COMPARISON_FILL_OPACITY,
    isLoading = false,
    loadingLabel = '레이더 차트를 불러오는 중입니다.',
    ariaLabel,
    className,
    ...props
}: ComparisonRadarChartProps) => {
    // 처음 한 번만 펼쳐지는 움직임을 보인다 — recharts 는 폭이 바뀔 때마다 새로 그리며 움직임을 되풀이해
    // 창 폭을 움직일 때마다 다각형이 다시 펼쳐진다. 첫 움직임이 끝나면 끈다.
    const [hasAnimated, setHasAnimated] = useState(false)
    const isAnimationActive = animate && !hasAnimated
    // 새로고침 직후에는 차트가 칸의 폭을 재기 전이라 빈 칸으로 보인다 — 화면이 붙기 전까지도 같은 스켈레톤을 보인다.
    const isHydrated = useIsHydrated()
    // 비교 계열은 이름이 있을 때만 그린다 — 값만 있고 이름이 없으면 범례에 쓸 말이 없다.
    const hasComparison = Boolean(comparisonLabel)
    const isComparisonFilled = comparisonAppearance === 'filled'
    const chartConfig = {
        primaryValue: {label: primaryLabel, color: primaryColor},
        comparisonValue: {label: comparisonLabel ?? '', color: comparisonColor},
    } satisfies ChartConfig
    // recharts 는 자료 한 줄의 속성을 그린 도형에 그대로 옮긴다 — id 를 담아 보내면 배경 막대·계열 막대가
    // 모두 같은 id 를 달아 문서에 같은 id 가 여러 번 생긴다[8.1.1]. id 는 아래 숨김 표의 key 로만 쓰므로
    // 차트로는 넘기지 않는다.
    // recharts 는 첫 축을 맨 위에 두고 시계 방향으로 돈다. 반시계로 놓으려면 첫 축은 그대로 두고 나머지 순서를 뒤집는다.
    const orderedData = direction === 'clockwise' ? data : [...data.slice(0, 1), ...data.slice(1).reverse()]
    const chartData = orderedData.map((item) => ({
        label: item.label,
        primaryValue: clampScore(item.primaryValue),
        comparisonValue: clampScore(item.comparisonValue ?? 0),
    }))

    if (isLoading || !isHydrated) {
        return (
            <ChartSkeleton
                {...props}
                type={
                    gridType === 'circle'
                        ? 'circle-radar'
                        : data.length === TRIANGLE_AXIS_COUNT
                          ? 'triangle-radar'
                          : 'radar'
                }
                label={loadingLabel}
                className={cn('w-full', className)}
            />
        )
    }

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            {showLegend && legendAppearance === 'swatch' ? (
                <ComparisonRadarLegend
                    primaryLabel={primaryLabel}
                    comparisonLabel={comparisonLabel}
                    primaryColor={primaryColor}
                    comparisonColor={comparisonColor}
                    comparisonFillOpacity={comparisonFillOpacity}
                    className="justify-end"
                />
            ) : null}
            {showLegend && legendAppearance === 'outline' ? (
                <div className="typo-body-s-regular text-foreground-subtle flex flex-wrap justify-end gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1.5">
                        <span
                            className="size-3 border-2"
                            style={{
                                borderColor: primaryColor,
                                backgroundColor: `color-mix(in srgb, ${primaryColor} 15%, transparent)`,
                            }}
                            aria-hidden="true"
                        />
                        {primaryLabel}
                    </span>
                    {hasComparison ? (
                        <span className="flex items-center gap-1.5">
                            <span
                                className={cn('size-3 border-2', !isComparisonFilled && 'border-dashed')}
                                style={{
                                    borderColor: comparisonColor,
                                    backgroundColor: isComparisonFilled
                                        ? `color-mix(in srgb, ${comparisonColor} 15%, transparent)`
                                        : undefined,
                                }}
                                aria-hidden="true"
                            />
                            {comparisonLabel}
                        </span>
                    ) : null}
                </div>
            ) : null}

            <ChartContainer
                config={chartConfig}
                className={cn(
                    'mx-auto aspect-square max-h-96 min-h-72 w-full max-w-xl [&_.recharts-polygon]:cursor-pointer',
                    chartClassName,
                )}
                role="img"
                aria-label={ariaLabel}
            >
                <RadarChart accessibilityLayer data={chartData} cy={centerY} outerRadius={outerRadius} margin={margin}>
                    <PolarGrid key="grid" gridType={gridType} stroke={gridColor} />
                    <PolarAngleAxis
                        key="angle-axis"
                        dataKey="label"
                        tick={{fill: tickColor, fontSize: tickFontSize, fontWeight: tickFontWeight}}
                    />
                    <PolarRadiusAxis
                        key="radius-axis"
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                        tickCount={ringCount}
                    />
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
                                    formatter={(value, name) => {
                                        const item =
                                            name === 'primaryValue'
                                                ? chartConfig.primaryValue
                                                : name === 'comparisonValue'
                                                  ? chartConfig.comparisonValue
                                                  : undefined

                                        return (
                                            <ChartTooltipRow
                                                color={item?.color}
                                                name={item?.label}
                                                value={Number(value)}
                                            />
                                        )
                                    }}
                                />
                            }
                        />
                    ) : null}
                    {hasComparison ? (
                        <Radar
                            key="comparison"
                            name="comparisonValue"
                            dataKey="comparisonValue"
                            isAnimationActive={isAnimationActive}
                            activeDot={showTooltip}
                            stroke="var(--color-comparisonValue)"
                            strokeWidth={2}
                            strokeDasharray="5 4"
                            fill={isComparisonFilled ? 'var(--color-comparisonValue)' : 'transparent'}
                            fillOpacity={isComparisonFilled ? comparisonFillOpacity : 0}
                            // 면으로 채운 비교 계열은 배경처럼 깔리므로 꼭짓점 점을 두지 않는다.
                            dot={
                                showDots &&
                                !isComparisonFilled && {
                                    r: RADAR_DOT_RADIUS,
                                    fill: 'var(--color-comparisonValue)',
                                    fillOpacity: 1,
                                    strokeWidth: 0,
                                }
                            }
                        />
                    ) : null}
                    <Radar
                        key="primary"
                        name="primaryValue"
                        dataKey="primaryValue"
                        isAnimationActive={isAnimationActive}
                        onAnimationEnd={() => setHasAnimated(true)}
                        activeDot={showTooltip}
                        stroke="var(--color-primaryValue)"
                        strokeWidth={2.5}
                        fill="var(--color-primaryValue)"
                        fillOpacity={primaryFillOpacity}
                        dot={
                            showDots &&
                            (dotAppearance === 'hollow'
                                ? {
                                      r: HOLLOW_DOT_RADIUS,
                                      fill: 'var(--ds-surface)',
                                      fillOpacity: 1,
                                      stroke: 'var(--color-primaryValue)',
                                      strokeWidth: 2,
                                  }
                                : {
                                      r: RADAR_DOT_RADIUS,
                                      fill: 'var(--color-primaryValue)',
                                      fillOpacity: 1,
                                      strokeWidth: 0,
                                  })
                        }
                    />
                </RadarChart>
            </ChartContainer>

            {/* 감추는 상자를 따로 둔다 — 표에 직접 sr-only 를 걸면 표가 제 크기대로 자리를 차지해 좁은 화면에서 가로로 밀린다. */}
            <div className="sr-only">
                <table>
                    <caption>{ariaLabel}</caption>
                    <thead>
                        <tr>
                            <th scope="col">평가지표</th>
                            <th scope="col">{primaryLabel}</th>
                            {hasComparison ? <th scope="col">{comparisonLabel}</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <th scope="row">{item.label}</th>
                                <td>{clampScore(item.primaryValue)}</td>
                                {hasComparison ? <td>{clampScore(item.comparisonValue ?? 0)}</td> : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export {ComparisonRadarChart, ComparisonRadarLegend}
export type {ComparisonRadarChartProps, ComparisonRadarItem, ComparisonRadarLegendProps}
