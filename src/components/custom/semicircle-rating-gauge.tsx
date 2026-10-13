'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {ArcGauge} from '@/components/custom/arc-gauge'
import {gaugeGradient, type ArcGaugeGradient} from '@/components/custom/arc-gauge-shape'
import {cn} from '@/lib/utils'

// 등급 원호 게이지(SemicircleRatingGauge) — 등급을 위가 열린 굵은 원호로 보여 주고, 가운데에 등급 · 설명, 아래에 기준 날짜
// 목록을 둔다. K-BIGx 기업혁신성장 보고서 "기업신용등급" 카드에서 쓴다.
//
// 짜임: 원호는 ArcGauge(size md) — 원 지름 260 · 굵기 37 · 끝 둥글림 · 위 172 만 보임. 트랙 = gray.50,
//   채움 = 우수(excellent) 그라데이션 한 가지 — 등급과 관계없이 같은 색이고 등급은 채움 길이로만 드러난다.
//   오른쪽 위(from)에서 왼쪽 아래(to)로 번진다.
//   가운데 글자: 등급 48 Bold → 설명 16 Bold. 원호 아래 8 간격으로 날짜 목록 — 가운데 정렬 한 줄에
//   이름 16 Regular(gray.500) · 값 16 Medium(gray.700), 줄 간격 8.
// 등급 · 설명은 role="img" 의 이름과 숨김 문단(sr-only)으로 읽어 주고, 날짜는 보이는 목록(dl) 그대로 읽힌다.

// 채움 그라데이션 — 점수 게이지와 같은 gauge-excellent-from/-to 토큰(tokens.json). 등급마다 색을 바꾸지 않는다.
const RATING_GAUGE_COLOR: ArcGaugeGradient = gaugeGradient('excellent')

type RatingGaugeDetail = {
    label: string
    value: string
}

type SemicircleRatingData = {
    /** 등급(예: A · BBB+). */
    label: string
    /** 등급 설명(예: 우량). */
    description: string
    /** 채움 비율(0~100). */
    percentage: number
    /** 원호 아래 날짜 목록(예: 평가일자 · 결산일자). */
    details: RatingGaugeDetail[]
}

type SemicircleRatingGaugeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    data: SemicircleRatingData
    /** 화면 낭독기용 이름(예: 기업신용등급). */
    title: string
}

const SemicircleRatingGauge = ({data, title, ariaLabel, className, ...props}: SemicircleRatingGaugeProps) => {
    return (
        <div {...props} className={cn('mx-auto flex w-full flex-col gap-2', className)}>
            {/* 좌우 여백 40(px-10)은 원호 안쪽 폭(186) 안에 글자를 가두는 자리다 — 긴 설명은 어절 단위로 접힌다. */}
            <ArcGauge
                value={data.percentage}
                color={RATING_GAUGE_COLOR.from}
                gradientTo={RATING_GAUGE_COLOR.to}
                size="md"
                ariaLabel={ariaLabel}
                overlayClassName="px-10"
            >
                {/* 글자 묶음은 제목이 아닌 그림 속 글자라 p 대신 div 를 쓴다 — 크고 굵은 p 는 접근성 검사기(WAVE)가 '제목일 수 있음'으로 잡는다. 값은 role="img" 이름으로 읽힌다. */}
                <div className="typo-display-l-bold text-foreground whitespace-nowrap">{data.label}</div>
                <div className="typo-body-xl-bold text-foreground break-keep">{data.description}</div>
            </ArcGauge>
            {data.details.length ? (
                <dl className="flex flex-col items-center gap-2">
                    {data.details.map((detail) => (
                        <div key={detail.label} className="flex flex-wrap items-center justify-center gap-x-2">
                            <dt className="typo-body-xl-regular text-foreground-subtle">{detail.label}</dt>
                            <dd className="typo-body-xl-medium text-label-foreground m-0 tabular-nums">
                                {detail.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            ) : null}
            <p className="sr-only">
                {title} {data.label}, {data.description}
            </p>
        </div>
    )
}

export {SemicircleRatingGauge}
export type {RatingGaugeDetail, SemicircleRatingData, SemicircleRatingGaugeProps}
