import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 단계 칸 막대(SegmentMeter) — 전체 단계 수만큼 작은 칸을 한 줄로 늘어놓고, 도달한 단계까지 색으로 채운다.
// K-BIGx 기업혁신성장 보고서 Tech-Index 탭 "4대 혁신역량 점수" 카드(10단계)에서 쓴다.
//
// 짜임: 칸 12×16 · 간격 4 · 모서리 2. 채운 칸 = color, 빈 칸 = 흰 면(surface) + 테두리 gray.100.
// 칸은 장식이라 숨기고(aria-hidden), 단계는 role="img" 의 이름으로 읽어 준다 — 색에만 기대지 않는다[5.3.1].
// 서버 · 클라이언트 어디서나 쓸 수 있게 'use client' 없이 둔다(상태 · 이벤트가 없다).
//
// [프론트엔드 연동] value 는 도달 단계(정수)다. 점수(0~100)를 넘기지 않는다 — 단계 환산 규칙은 백엔드 값을 따른다.

type SegmentMeterProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
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

const clampInteger = (value: number, minimum: number, maximum: number) =>
    Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, Math.round(value))) : minimum

const SegmentMeter = ({value, total = DEFAULT_TOTAL, color, ariaLabel, className, ...props}: SegmentMeterProps) => {
    const safeTotal = clampInteger(total, 1, MAX_TOTAL)
    const safeValue = clampInteger(value, 0, safeTotal)

    return (
        <div
            {...props}
            role="img"
            aria-label={ariaLabel ?? `${safeTotal}단계 중 ${safeValue}단계`}
            className={cn('flex flex-wrap gap-1', className)}
        >
            {Array.from({length: safeTotal}, (_, index) => (
                <span
                    key={index}
                    aria-hidden="true"
                    className={cn(
                        'rounded-3xs h-4 w-3 shrink-0',
                        index < safeValue ? undefined : 'border-subtle-3 bg-surface border',
                    )}
                    style={index < safeValue ? {backgroundColor: color} : undefined}
                />
            ))}
        </div>
    )
}

export {SegmentMeter}
export type {SegmentMeterProps}
