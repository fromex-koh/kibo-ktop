'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {cn} from '@/lib/utils'

// 피어 비교 막대(PeerColumnChart) — 신청기업 하나와 견줄 집단 여럿을 같은 눈금 위에 세운다.
// 심층분석 리포트의 'Peer Group 비교'와 '4대 혁신역량 비교'에서 쓴다. 문서: /component-guide/peer-column-chart
//
// [프론트엔드 연동] 넘기는 값은 항목 배열뿐이다 — 신청기업 막대에만 isApplicant 를 주면 색이 바뀌고,
// comparisonValue 를 주면 칸마다 막대가 둘 선다. 눈금은 점수 100 · 20 간격이 기본이다.
//
// 기존 ColumnChart 로는 이 모양이 나오지 않아 따로 둔다 — 왼쪽 눈금 · 세로 점선 칸 · 막대 위 값 글자가
// 모두 필요한데 'cells' 는 눈금이 없고 'default' 는 세로 점선이 없다.
// 차트 라이브러리를 쓰지 않아(값은 눈금 대비 높이 %뿐이다) 인쇄물에도 화면과 같은 자리에 찍힌다.

type PeerColumnItem = {
    id: string
    /** 막대 아래 이름. 줄바꿈(\n)을 넣으면 두 줄로 선다(예: '신청기업\n(지역명)'). */
    label: string
    value: number
    /** 신청기업 막대. 진한 색과 파란 이름을 받는다 — 한 항목에만 준다. */
    isApplicant?: boolean
    /**
     * 견줄 값. 주면 칸마다 막대가 둘 선다 — 앞은 진한 색(신청기업), 뒤는 옅은 색(비교 대상)이다.
     * Tech-Index 심층분석의 '4대 혁신역량 비교'처럼 항목마다 두 값을 견줄 때 쓴다.
     */
    comparisonValue?: number
}

type PeerColumnChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: readonly PeerColumnItem[]
    /** 눈금 최댓값. 점수라 100 이 기본이다. */
    scaleMax?: number
    /** 눈금 간격. */
    yAxisStep?: number
    valueFractionDigits?: number
    /** 칸 높이 유틸리티(이름 줄은 그 아래에 따로 선다). 기본은 h-28(112)이다. */
    heightClassName?: string
    /**
     * 칸 오른쪽 끝의 세로 실선. 기본은 그린다 — 여러 차트를 나란히 놓는 자리
     * (기업 유형별 4대 혁신역량 비교)에서는 시안이 끝선 없이 두므로 끈다.
     */
    showEndLine?: boolean
    /** 값을 불러오는 중. 같은 높이의 스켈레톤을 대신 보인다. */
    isLoading?: boolean
    loadingLabel?: string
}

// 눈금 최댓값이 칸 높이의 97% 에 닿는다(시안 — 63.7 점이 칸 160 에서 99 다).
// 남는 3% 와 값 글자는 칸 위로 나가도 잘리지 않는다.
const CHART_BODY_RATIO = 0.97

const PeerColumnChart = ({
    ariaLabel,
    data,
    scaleMax = 100,
    yAxisStep = 20,
    valueFractionDigits = 1,
    heightClassName = 'h-28',
    showEndLine = true,
    isLoading = false,
    loadingLabel = '비교 막대를 불러오는 중입니다.',
    className,
    ...props
}: PeerColumnChartProps) => {
    // 다른 차트와 같은 규칙 — 화면이 붙기 전까지 같은 자리에 스켈레톤을 보인다.
    const isHydrated = useIsHydrated()

    if (isLoading || !isHydrated) {
        return <ChartSkeleton {...props} type="plain-column" label={loadingLabel} className={cn('w-full', className)} />
    }

    // 눈금은 위에서 아래로 적는다(100 → 0) — 글자 줄을 칸 높이에 고르게 나눠 놓기 위해서다.
    const ticks = Array.from(
        {length: Math.floor(scaleMax / yAxisStep) + 1},
        (unused, index) => scaleMax - index * yAxisStep,
    )

    return (
        <figure {...props} className={cn('flex flex-col gap-1', className)}>
            <figcaption className="sr-only">{ariaLabel}</figcaption>
            <div className="flex gap-2">
                {/* 왼쪽 눈금 — 칸 높이를 눈금 수만큼 나눠 글자를 놓는다. */}
                <ul
                    className={cn(
                        'typo-micro-regular text-label-foreground flex flex-col justify-between text-right',
                        heightClassName,
                    )}
                >
                    {ticks.map((tick) => (
                        <li key={tick}>{tick}</li>
                    ))}
                </ul>
                {/* 칸 상자 — 바닥과 좌우 끝은 실선, 항목 사이는 세로 점선이다(시안). */}
                <ul
                    className={cn(
                        'border-subtle-3 flex min-w-0 flex-1 items-end border-b border-l',
                        showEndLine && 'border-r',
                        heightClassName,
                    )}
                >
                    {data.map((item) => (
                        <li
                            key={item.id}
                            // 칸 사이만 점선으로 가른다 — 마지막 칸의 오른쪽(차트 끝)에는 선이 없다(시안).
                            className="border-subtle-3 flex h-full min-w-0 flex-1 justify-center border-r border-dashed last:border-r-0"
                        >
                            {/* 값 글자는 막대 위에 붙어 함께 오르내린다 — 막대 높이(%)의 기준이 되도록
                                이 상자가 칸 높이를 그대로 받는다. 막대 두께는 칸 폭의 절반이고 최대 24 다.
                                견줄 값이 있으면 두 막대를 나란히 세운다. */}
                            {/* 두 막대 사이는 12 다(시안 — 막대 24 · 막대 사이 12). */}
                            <div className="flex h-full w-full items-end justify-center gap-3">
                                {[
                                    {key: 'value', value: item.value, isPrimary: true},
                                    ...(item.comparisonValue === undefined
                                        ? []
                                        : [{key: 'comparison', value: item.comparisonValue, isPrimary: false}]),
                                ].map((bar) => (
                                    <div
                                        key={bar.key}
                                        className={cn(
                                            'flex h-full flex-col items-center gap-1',
                                            // 막대 두께는 시안 24 다 — 칸이 좁아지면 칸 폭에 맞춰 줄어든다.
                                            item.comparisonValue === undefined ? 'w-1/2 max-w-6' : 'w-1/4 max-w-6',
                                        )}
                                    >
                                        <p className="typo-micro-regular text-label-foreground mt-auto whitespace-nowrap">
                                            {/* 아래 이름 줄은 자리를 맞추려고 따로 두어 읽지 않는다 — 이름은 값과
                                                한 덩어리로 여기서 읽어 준다. */}
                                            <span className="sr-only">{`${item.label.replace('\n', ' ')} `}</span>
                                            {bar.value.toFixed(valueFractionDigits)}
                                        </p>
                                        {/* 값이 눈금을 넘으면 칸 높이까지만 찬다. */}
                                        <div
                                            className={cn(
                                                'w-full',
                                                bar.isPrimary && item.isApplicant !== false
                                                    ? 'bg-primary'
                                                    : 'bg-navy-200',
                                                !bar.isPrimary && 'bg-navy-200',
                                                bar.isPrimary && !item.isApplicant && item.comparisonValue === undefined
                                                    ? 'bg-navy-200'
                                                    : '',
                                            )}
                                            style={{
                                                height: `${Math.min(Math.max(bar.value, 0) / scaleMax, 1) * CHART_BODY_RATIO * 100}%`,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* 이름 줄 — 막대 칸과 같은 폭으로 나눠 아래에 둔다. 신청기업만 파란 글자다. */}
            <div className="flex gap-2" aria-hidden="true">
                {/* 왼쪽 눈금과 같은 폭을 비워 막대 칸과 이름 칸의 자리를 맞춘다. */}
                <p className="typo-micro-regular invisible text-right">{scaleMax}</p>
                <div className="flex min-w-0 flex-1">
                    {data.map((item) => (
                        <p
                            key={item.id}
                            className={cn(
                                // 줄바꿈은 이름에 적힌 자리(\n)에서만 한다 — 칸이 좁다고 저절로 접히면
                                // 차트마다 이름 줄 수가 달라져 높이가 들쭉날쭉해진다.
                                'typo-micro-regular min-w-0 flex-1 text-center whitespace-pre',
                                item.isApplicant && item.comparisonValue === undefined
                                    ? 'text-primary'
                                    : 'text-label-foreground',
                            )}
                        >
                            {item.label}
                        </p>
                    ))}
                </div>
            </div>
        </figure>
    )
}

export {PeerColumnChart}
export type {PeerColumnChartProps, PeerColumnItem}
