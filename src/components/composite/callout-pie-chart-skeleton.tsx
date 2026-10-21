import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// CalloutPieChart 와 같은 짜임의 스켈레톤 — 원(반지름 112, 가운데) · 지시선 · 왼쪽 라벨 자리를 같은 좌표에 그린다.
// 그림 범위(viewBox)가 실제 차트의 표준 배치(분류 8개)와 같아, 불러온 뒤 자리 · 높이가 흔들리지 않는다.
// 색은 다른 차트 스켈레톤과 같은 muted 면이다. data-slot="chart-skeleton" 이라 인쇄 화면의 자동 인쇄가
// 이 자리가 사라질 때까지 기다린다(report-print-shell.tsx).

type CalloutPieChartSkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 불러오는 중임을 알리는 문구(화면 낭독기용). */
    label?: string
}

// 표준 배치(템플릿)의 그림 범위와 원 · 라벨 자리.
const VIEW_BOX = '0 -237 556 402'
const CENTER_X = 278
const RADIUS = 112
const LABEL_HEIGHT = 16
const LABEL_RADIUS = 4
const LEADER_STROKE = 1.5
// 지시선 시작(조각 가장자리) → 끝(라벨 쪽), 라벨 자리 폭. 표준 배치 7개 라벨 자리와 같다.
const LABELS = [
    {from: [229.5, 103.2], to: [220.1, 123.1], width: 190},
    {from: [172.0, 42], to: [151.6, 50.1], width: 150},
    {from: [166.0, -21.4], to: [144.4, -25.5], width: 160},
    {from: [185.8, -67], to: [168.0, -79.9], width: 130},
    {from: [213.9, -94.3], to: [226.7, -125.9], width: 150},
    {from: [242.8, -108.4], to: [238.0, -171.9], width: 130},
    {from: [267.3, -113.5], to: [238.0, -217.9], width: 90},
] as const
const LABEL_GAP_X = 8

const CalloutPieChartSkeleton = ({
    label = '그래프를 불러오는 중입니다.',
    className,
    ...props
}: CalloutPieChartSkeletonProps) => (
    <div {...props} role="status" data-slot="chart-skeleton" className={cn('w-full min-w-0 animate-pulse', className)}>
        <span className="sr-only">{label}</span>
        <svg viewBox={VIEW_BOX} className="text-muted block h-auto w-full" aria-hidden="true">
            <circle cx={CENTER_X} cy={0} r={RADIUS} fill="currentColor" />
            {LABELS.map(({from, to, width}) => (
                <g key={`${to[0]}-${to[1]}`}>
                    <line
                        x1={from[0]}
                        y1={from[1]}
                        x2={to[0]}
                        y2={to[1]}
                        stroke="currentColor"
                        strokeWidth={LEADER_STROKE}
                    />
                    <rect
                        x={to[0] - LABEL_GAP_X - width}
                        y={to[1] - LABEL_HEIGHT / 2}
                        width={width}
                        height={LABEL_HEIGHT}
                        rx={LABEL_RADIUS}
                        fill="currentColor"
                    />
                </g>
            ))}
        </svg>
    </div>
)

export {CalloutPieChartSkeleton}
export type {CalloutPieChartSkeletonProps}
