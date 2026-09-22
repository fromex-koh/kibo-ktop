import type {CSSProperties, ReactNode} from 'react'
import {
    chartTooltipClassName,
    chartTooltipDescriptionClassName,
    chartTooltipDotClassName,
    chartTooltipRowClassName,
    chartTooltipRowNameClassName,
    chartTooltipTitleClassName,
    chartTooltipValueClassName,
} from '@/components/theme/chart-tooltip.variants'
import {cn} from '@/lib/utils'

// 차트 툴팁 부품 — 모든 차트가 같은 모양의 툴팁을 쓰도록 안쪽 줄을 여기서 만든다.
//   Recharts 차트: <ChartTooltipContent className={chartTooltipClassName} labelClassName={chartTooltipTitleClassName}
//                   formatter={… <ChartTooltipRow /> 또는 <ChartTooltipTitle /> + <ChartTooltipDescription />} />
//   직접 그리는 차트(캔버스 · 그래프): <ChartTooltipBox> 로 같은 면을 깔고 위치만 넘긴다.
// 스타일 정의는 theme/chart-tooltip.variants.ts 가 단일 소스다.

const ChartTooltipTitle = ({children}: {children: ReactNode}) => (
    <p className={chartTooltipTitleClassName}>{children}</p>
)

const ChartTooltipDescription = ({children}: {children: ReactNode}) => (
    <p className={chartTooltipDescriptionClassName}>{children}</p>
)

// 계열 한 줄 — 색 점 · 이름(왼쪽) ↔ 값(오른쪽). 이름이 없으면 점과 값만 둔다.
const ChartTooltipRow = ({color, name, value}: {color?: string; name?: ReactNode; value: ReactNode}) => (
    <div className={chartTooltipRowClassName}>
        <span className={chartTooltipRowNameClassName}>
            {color ? (
                <span aria-hidden="true" className={chartTooltipDotClassName} style={{backgroundColor: color}} />
            ) : null}
            {name}
        </span>
        <strong className={chartTooltipValueClassName}>{value}</strong>
    </div>
)

// 직접 그리는 차트용 툴팁 면 — 위치(absolute · left/top · translate)는 사용처가 className · style 로 준다.
const ChartTooltipBox = ({
    className,
    style,
    children,
}: {
    className?: string
    style?: CSSProperties
    children: ReactNode
}) => (
    <div role="tooltip" className={cn(chartTooltipClassName, 'pointer-events-none', className)} style={style}>
        {children}
    </div>
)

export {ChartTooltipBox, ChartTooltipDescription, ChartTooltipRow, ChartTooltipTitle}
