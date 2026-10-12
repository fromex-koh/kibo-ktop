'use client'

// 'use client' — 칸이 차례로 나타나는 움직임 여부를 문서 설정(chart-reveal.tsx)에서 읽는다.
import {useChartAnimation} from '@/components/custom/chart-reveal'
import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 단계 칸 막대(SegmentMeter) — 전체 단계 수만큼 작은 칸을 한 줄로 늘어놓고, 도달한 단계까지 색으로 채운다.
// 점수를 10단계처럼 칸으로 보일 때 쓰는 공통 컴포넌트다(현재 K-BIGx 보고서 화면에서는 쓰지 않는다).
//
// 짜임: 칸 12×16 · 간격 4 · 모서리 2. 채운 칸 = color, 빈 칸 = 흰 면(surface) + 테두리 gray.100.
// 칸은 장식이라 숨기고(aria-hidden), 단계는 role="img" 의 이름으로 읽어 준다 — 색에만 기대지 않는다[5.3.1].
// 보고서 안에서는 카드가 보일 때 채운 칸이 왼쪽부터 차례로 튀어나온다(chart-reveal.tsx · animate-chart-pop).
//
// [프론트엔드 연동] value 는 도달 단계(정수)다. 점수(0~100)를 넘기지 않는다 — 단계 환산 규칙은 백엔드 값을 따른다.

type SegmentMeterProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
    /** 도달 단계. 소수는 반올림하고, 0 보다 작거나 total 보다 크면 끝으로 맞춘다. */
    value: number
    /** 전체 단계 수(기본 10). 1 보다 작으면 1 로 맞춘다. */
    total?: number
    /** 채운 칸 색(토큰 변수). */
    color: string
    /** 화면 낭독기 이름. 없으면 '10단계 중 7단계' 처럼 만든다. */
    ariaLabel?: string
}

const DEFAULT_TOTAL = 10
// 칸 수 상한 — 잘못된 total(예: 점수 100)이 들어와도 칸이 카드를 넘도록 늘어나지 않게 막는다.
const MAX_TOTAL = 20
// 채운 칸이 차례로 나타나는 간격(ms).
const POP_STAGGER_MS = 40

const clampInteger = (value: number, minimum: number, maximum: number) =>
    Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, Math.round(value))) : minimum

const SegmentMeter = ({value, total = DEFAULT_TOTAL, color, ariaLabel, className, ...props}: SegmentMeterProps) => {
    const safeTotal = clampInteger(total, 1, MAX_TOTAL)
    const safeValue = clampInteger(value, 0, safeTotal)
    const animate = useChartAnimation()

    return (
        // span 으로 그린다 — 제목 줄(h3 · p)처럼 글자만 담는 자리에도 들어가기 때문이다[8.1.1].
        <span
            {...props}
            role="img"
            data-chart-reveal=""
            aria-label={ariaLabel ?? `${safeTotal}단계 중 ${safeValue}단계`}
            className={cn('inline-flex flex-wrap gap-1', className)}
        >
            {Array.from({length: safeTotal}, (_, index) => (
                <span
                    key={index}
                    aria-hidden="true"
                    className={cn(
                        'rounded-3xs h-4 w-3 shrink-0',
                        index < safeValue
                            ? animate && 'motion-safe:animate-chart-pop'
                            : 'border-subtle-3 bg-surface border',
                    )}
                    style={
                        index < safeValue
                            ? {backgroundColor: color, animationDelay: `${index * POP_STAGGER_MS}ms`}
                            : undefined
                    }
                />
            ))}
        </span>
    )
}

export {SegmentMeter}
export type {SegmentMeterProps}
