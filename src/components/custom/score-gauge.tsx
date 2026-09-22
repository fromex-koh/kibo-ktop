'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {ArcGauge} from '@/components/custom/arc-gauge'
import {ARC_GAUGE_TONE_COLORS, type ArcGaugeTone} from '@/components/custom/arc-gauge-shape'
import {cn} from '@/lib/utils'

// 점수 원호 게이지(ScoreGauge) — 0~100 점수를 위가 열린 굵은 원호로 보여 주고, 가운데에 점수 · 상태 · 보조 문구를 둔다.
// K-BIGx 기업혁신성장 보고서 "혁신성장역량지수" 카드에서 쓴다. 원호는 ArcGauge(size lg)가 그린다.
//
// 짜임: 원 지름 320 · 선 굵기 46 · 끝 둥글림 · 위 208 만 보임. 트랙 = gray.50, 점수 구간 = 상태(tone) 색 —
//   우수 blue.500 · 양호 mint.700 · 보통 orange.500 · 미흡 error.500 · 취약 gray.700.
//   가운데 글자: 점수 40 Bold + 단위 24 Bold → 상태 20 Bold → 보조 14 Regular(gray.500).
// 수치는 role="img" 의 이름으로도 읽어 준다.

type ScoreGaugeTone = ArcGaugeTone
const SCORE_GAUGE_TONE_COLORS = ARC_GAUGE_TONE_COLORS

type ScoreGaugeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 0~100 점수. 범위를 벗어나거나 숫자가 아니면 끝(0 · 100)으로 맞추고, 소수는 첫째 자리까지 보인다. */
    score: number
    /** 점수 뒤 단위(기본 '점'). */
    unit?: string
    /** 점수 아래 상태 이름(예: 양호). */
    statusLabel: string
    /** 맨 아래 보조 문구(예: 기준일자 · 2025-12-04). */
    caption?: string
    /** 상태 — 점수 구간 색을 정한다(우수 · 양호 · 보통 · 미흡 · 취약). */
    tone?: ScoreGaugeTone
    /** 상태 색 대신 쓸 색(토큰 변수). 주면 tone 보다 우선한다. */
    color?: string
    ariaLabel: string
}

const MAX_SCORE = 100
// 표시 점수 — 채움과 같은 값(0~100으로 맞춘 값)을 소수 첫째 자리까지 보인다(73.856 → 73.9, 100 → 100).
const scoreFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

const ScoreGauge = ({
    score,
    unit = '점',
    statusLabel,
    caption,
    tone = 'good',
    color,
    ariaLabel,
    className,
    ...props
}: ScoreGaugeProps) => {
    // 범위를 벗어나거나 숫자가 아니면(NaN) 끝으로 맞춘다 — 채움과 글자가 같은 값을 보이게.
    const safeScore = Number.isFinite(score) ? Math.min(MAX_SCORE, Math.max(0, score)) : 0

    return (
        <div {...props} className={cn('mx-auto w-full', className)}>
            {/* 좌우 여백 48(px-12)은 원호 안쪽 폭(224) 안에 글자를 가두는 자리다 — 긴 상태 · 보조 문구는 어절 단위로 접힌다. */}
            <ArcGauge
                value={safeScore}
                color={color ?? SCORE_GAUGE_TONE_COLORS[tone]}
                size="lg"
                ariaLabel={ariaLabel}
                overlayClassName="px-12"
            >
                {/* 글자 묶음은 제목이 아닌 그림 속 글자라 p 대신 div 를 쓴다 — 크고 굵은 p 는 접근성 검사기(WAVE)가 '제목일 수 있음'으로 잡는다. 값은 role="img" 이름으로 읽힌다. */}
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="typo-display-m-bold text-foreground tabular-nums">
                        {scoreFormatter.format(safeScore)}
                    </span>
                    <span className="typo-h4-bold text-foreground">{unit}</span>
                </div>
                <div className="typo-title-l-bold text-foreground -mt-1 break-keep">{statusLabel}</div>
                {caption ? (
                    <div className="typo-body-l-regular text-foreground-subtle mt-2 break-keep">{caption}</div>
                ) : null}
            </ArcGauge>
        </div>
    )
}

export {SCORE_GAUGE_TONE_COLORS, ScoreGauge}
export type {ScoreGaugeProps, ScoreGaugeTone}
