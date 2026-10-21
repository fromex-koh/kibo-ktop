import {useId, type ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 분포 곡선 값 차트(DistributionValueChart) — 평균 · 표준편차로 종 모양(정규분포) 곡선을 그리고, 조회 대상 점수 자리에
// 점과 글자(예: 상위 2.2%)를 찍는다. 세로축 없이 아래 눈금 숫자로 읽는다.
// K-BIGx 보고서 인쇄본 Tech-Index "Tech-Index 표준정보 비교" 그래프.
// (화면 폭에 맞춰 늘어나는 웹 화면용 분포 곡선은 DistributionCurveChart.)
//
// 짜임(템플릿 기준, 단위는 SVG 좌표 = 용지 px)
//   그림 폭 1168 × 높이 336. 가로 범위(min~max, 기본 0~100)는 x 20 ~ 1148, 바닥선 y 290.
//   눈금(tickStep 마다) = 바닥선 아래 숫자(y 326 · 20px) + 안쪽 눈금 자리에 세로 점선.
//   곡선 = 꼭대기(평균 자리)가 y 40(바닥선 위 250)에 닿는 종 모양, 선 3 + 위에서 아래로 옅어지는 면.
//   점 = 반지름 11(테두리 3, 바탕색), 점 글자 = 점 아래 44(22px 굵게).
// 데이터에 따라
//   · 점수가 범위를 벗어나면 끝으로 맞춘다. 점수가 없으면 점 · 글자를 그리지 않는다.
//   · 점이 바닥선 가까이(분포 꼬리) 있어 글자가 눈금 숫자와 겹치면 점 위로 올린다.
//   · 점이 좌우 끝 가까이 있으면 글자가 그림 밖으로 나가지 않게 끝 쪽 정렬로 바꾼다.
//   · 표준편차가 0 이하 · 숫자가 아니면 가로 범위의 5% 로 맞춘다(곡선이 선 한 줄로 사라지지 않게).
// 서버에서 바로 그려지고 마우스 반응 · 움직임이 없다. 평균 · 점수 · 점 글자는 화면에 보이지 않는 문단으로도 읽어 준다.
//
// [프론트엔드 연동] mean · standardDeviation 은 전체 분포 값, value 는 조회 대상 점수, markerLabel 은 백엔드가 준 순위
//   문구를 그대로 넘긴다. 곡선은 두 값으로 계산해 그린다(실제 표본 분포가 아니다). 색은 colors(CSS 색 값)로 넘긴다.

type DistributionValueColors = {
    /** 곡선 · 점. */
    curve: string
    /** 눈금 점선. */
    grid: string
    /** 바닥선. */
    baseline: string
    /** 눈금 숫자. */
    tick: string
    /** 점 글자. */
    label: string
    /** 점 테두리(바탕색과 같게). */
    markerStroke: string
    /** 차트가 놓인 면 색 — 면(곡선 아래)을 곡선 색과 이 색을 섞어 칠한다. */
    surface: string
}

type DistributionValueChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    mean: number
    standardDeviation: number
    /** 조회 대상 점수. 없으면 점을 찍지 않는다. */
    value?: number
    /** 점 글자(예: 상위 2.2%). */
    markerLabel?: string
    min?: number
    max?: number
    tickStep?: number
    colors?: Partial<DistributionValueColors>
}

const DEFAULT_COLORS: DistributionValueColors = {
    curve: 'var(--ds-blue-500)',
    grid: 'var(--ds-subtle-3)',
    baseline: 'var(--ds-border)',
    tick: 'var(--ds-label-foreground)',
    label: 'var(--ds-blue-600)',
    markerStroke: 'var(--ds-card)',
    surface: 'var(--ds-card)',
}

// 치수(SVG 좌표).
const WIDTH = 1168
const HEIGHT = 336
const PLOT_LEFT = 20
const PLOT_RIGHT = 1148
const PLOT_TOP = 20
const BASELINE_Y = 290
const PEAK_Y = 40
const TICK_Y = 326
const CURVE_STEPS = 200
const CURVE_STROKE = 3
const GRID_STROKE = 1.5
const GRID_DASH = '5 6'
const BASELINE_STROKE = 2
const MARKER_RADIUS = 11
const MARKER_STROKE = 3
const LABEL_OFFSET = 44
// 점 글자를 위로 올릴 때 — 점 위 18(글자 아래끝 기준).
const LABEL_ABOVE_OFFSET = 18
// 점 아래 글자(아래끝)가 이 줄을 넘으면 눈금 숫자(위끝 ≈ 311)에 닿으므로 점 위로 올린다.
const LABEL_BOTTOM_LIMIT = BASELINE_Y + 12
// 점 글자 반쪽 폭 어림 — 끝 정렬로 바꿀지 볼 때 쓴다(22px 굵게 '상위 2.2%' ≈ 100).
const LABEL_HALF_WIDTH = 55
const FONT = {tick: 20, label: 22, labelWeight: 800} as const
// 면 — 곡선 색을 위 26% → 아래 2% 로 바탕색(colors.surface)에 섞은 색이 위에서 아래로 옅어진다.
// SVG 그라데이션(linearGradient)을 쓰지 않고 얇은 가로 띠(불투명 단색) FILL_BANDS 개를 면 모양으로 잘라 칠한다 —
// 그라데이션은 PDF 로 저장할 때 브라우저마다 다르게 찍힌다(Safari 는 첫 색 한 가지로 진하게, Chrome 은 인쇄 배율
// transform 아래에서 거의 흰색으로). 단색 띠는 화면 · 인쇄 · PDF 모두 같고, 띠가 얇아 눈에는 그라데이션으로 보인다.
// 띠는 가장자리를 부드럽게 처리하지 않는다(crispEdges) — 처리하면 줄인 화면에서 띠 사이로 바탕이 가는 줄처럼 비친다.
const FILL_TOP_MIX = 26
const FILL_BOTTOM_MIX = 2
const FILL_BANDS = 48
// 띠 사이 틈이 보이지 않게 아래로 조금 겹친다.
const FILL_BAND_OVERLAP = 0.5
// 표준편차가 없을 때 가로 범위 대비 대신 쓸 몫.
const FALLBACK_SD_RATIO = 0.05

const round = (value: number) => Math.round(value * 10) / 10
const numberFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

const DistributionValueChart = ({
    ariaLabel,
    mean,
    standardDeviation,
    value,
    markerLabel,
    min = 0,
    max = 100,
    tickStep = 10,
    colors,
    className,
    ...props
}: DistributionValueChartProps) => {
    const color = {...DEFAULT_COLORS, ...colors}
    const span = max > min ? max - min : 1
    const sd =
        Number.isFinite(standardDeviation) && standardDeviation > 0 ? standardDeviation : span * FALLBACK_SD_RATIO
    const toX = (v: number) => PLOT_LEFT + ((v - min) / span) * (PLOT_RIGHT - PLOT_LEFT)
    // 꼭대기를 1 로 둔 종 모양 높이(0~1).
    const heightRatio = (v: number) => Math.exp(-((v - mean) ** 2) / (2 * sd ** 2))
    const toY = (v: number) => BASELINE_Y - heightRatio(v) * (BASELINE_Y - PEAK_Y)
    const curveValues = Array.from({length: CURVE_STEPS + 1}, (_, index) => min + (span * index) / CURVE_STEPS)
    const points = curveValues.map((v) => `${round(toX(v))},${round(toY(v))}`)
    const linePath = `M${points.join(' L')}`
    const areaPath = `${linePath} L${PLOT_RIGHT},${BASELINE_Y} L${PLOT_LEFT},${BASELINE_Y} Z`
    const tickCount = Math.floor(span / tickStep)
    const ticks = Array.from({length: tickCount + 1}, (_, index) => min + index * tickStep)
    // 한 화면에 여러 개를 그려도 면 모양(clipPath) id 가 겹치지 않게.
    const clipId = `distribution-value-fill-${useId().replaceAll(':', '')}`
    // 띠는 면의 가장 높은 점부터 바닥선까지 — 위 띠가 가장 진하다.
    const fillTop = Math.min(...curveValues.map(toY))
    const bandHeight = (BASELINE_Y - fillTop) / FILL_BANDS
    const fillBands = Array.from({length: FILL_BANDS}, (_, index) => ({
        y: round(fillTop + index * bandHeight),
        mix: round(FILL_TOP_MIX - ((FILL_TOP_MIX - FILL_BOTTOM_MIX) * (index + 0.5)) / FILL_BANDS),
    }))

    const hasMarker = value !== undefined && Number.isFinite(value)
    const markerValue = hasMarker ? Math.min(max, Math.max(min, value)) : 0
    const markerX = toX(markerValue)
    const markerY = toY(markerValue)
    const belowY = markerY + LABEL_OFFSET
    const labelY = belowY > LABEL_BOTTOM_LIMIT ? markerY - LABEL_ABOVE_OFFSET : belowY
    const labelAnchor = markerX - LABEL_HALF_WIDTH < 0 ? 'start' : markerX + LABEL_HALF_WIDTH > WIDTH ? 'end' : 'middle'
    const labelX = labelAnchor === 'start' ? 0 : labelAnchor === 'end' ? WIDTH : markerX

    const fillBandColor = (percent: number) => `color-mix(in srgb, ${color.curve} ${percent}%, ${color.surface})`

    return (
        <div className={cn('w-full', className)} {...props}>
            <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full">
                <defs>
                    <clipPath id={clipId}>
                        <path d={areaPath} />
                    </clipPath>
                </defs>
                {/* 면 → 세로 눈금선 → 곡선 순 — 면이 불투명해 눈금선을 면 위에 그려야 보인다. */}
                <g clipPath={`url(#${clipId})`}>
                    {fillBands.map((band) => (
                        <rect
                            key={band.y}
                            x={PLOT_LEFT}
                            y={band.y}
                            width={PLOT_RIGHT - PLOT_LEFT}
                            height={round(bandHeight + FILL_BAND_OVERLAP)}
                            fill={fillBandColor(band.mix)}
                            shapeRendering="crispEdges"
                        />
                    ))}
                </g>
                {ticks.slice(1, -1).map((tick) => (
                    <line
                        key={`grid-${tick}`}
                        x1={round(toX(tick))}
                        y1={PLOT_TOP}
                        x2={round(toX(tick))}
                        y2={BASELINE_Y}
                        stroke={color.grid}
                        strokeWidth={GRID_STROKE}
                        strokeDasharray={GRID_DASH}
                    />
                ))}
                <path d={linePath} fill="none" stroke={color.curve} strokeWidth={CURVE_STROKE} />
                <line
                    x1={PLOT_LEFT}
                    y1={BASELINE_Y}
                    x2={PLOT_RIGHT}
                    y2={BASELINE_Y}
                    stroke={color.baseline}
                    strokeWidth={BASELINE_STROKE}
                />
                {hasMarker ? (
                    <>
                        <circle
                            cx={round(markerX)}
                            cy={round(markerY)}
                            r={MARKER_RADIUS}
                            fill={color.curve}
                            stroke={color.markerStroke}
                            strokeWidth={MARKER_STROKE}
                        />
                        {markerLabel ? (
                            <text
                                x={round(labelX)}
                                y={round(labelY)}
                                textAnchor={labelAnchor}
                                fontSize={FONT.label}
                                fontWeight={FONT.labelWeight}
                                fill={color.label}
                            >
                                {markerLabel}
                            </text>
                        ) : null}
                    </>
                ) : null}
                {ticks.map((tick) => (
                    <text
                        key={`tick-${tick}`}
                        x={round(toX(tick))}
                        y={TICK_Y}
                        textAnchor="middle"
                        fontSize={FONT.tick}
                        fill={color.tick}
                    >
                        {numberFormat.format(tick)}
                    </text>
                ))}
            </svg>
            <p className="sr-only">
                평균 {numberFormat.format(mean)}점{hasMarker ? `, 조회 대상 ${numberFormat.format(markerValue)}점` : ''}
                {markerLabel ? `, ${markerLabel}` : ''}
            </p>
        </div>
    )
}

export {DistributionValueChart}
export type {DistributionValueChartProps, DistributionValueColors}
