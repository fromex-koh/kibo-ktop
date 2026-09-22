'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {ArcGauge} from '@/components/custom/arc-gauge'
import {cn} from '@/lib/utils'

// 등급 척도 게이지(GradeScaleGauge) — 현재 등급을 원호로 보이고, 그 아래 전체 등급을 낮은 것부터 높은 것까지 색 칸으로
// 늘어놓아 어느 단계인지 함께 보인다. K-BIGx 기업혁신성장 보고서 신용/재무정보 탭 "현금흐름등급" 카드에서 쓴다.
//
// 짜임: 원호는 ArcGauge(size md) — 지름 260 · 굵기 37 · 위 172 만 보임. 채움 길이 = (현재 등급 순번 ÷ 등급 수), 채움 색 =
//   현재 등급 칸의 색. 가운데 글자: 등급 40 Bold → 설명 16 Bold(예: 현재 등급).
//   → 16 → 등급 칸 줄: 높이 32 · 모서리 8 · 간격 8 · 14 Bold, 칸 폭은 똑같이 나눈다.
//   → 8 → 척도 줄(높이 26 · 12 Regular): 첫 칸 아래 낮은 쪽 이름 · 가운데 칸들 아래 회색 띠(gray.50)에 척도 이름 · 끝 칸 아래 높은 쪽 이름.
// 칸 색은 데이터가 넘긴다. 칸 글자는 흰색이 기본이고, 밝은 칸은 isLightColor 로 짙은 글자를 쓴다.
// 현재 등급은 role="img" 이름과 숨김 문단으로 읽는다 — 칸 색만으로 구분하지 않는다[5.3.1].
//
// [프론트엔드 연동] grades 는 낮은 등급부터(왼쪽) 높은 등급(오른쪽) 순서다. current 는 grades 의 label 중 하나를 넘긴다.

type GradeScaleItem = {
    /** 등급 이름(예: CR-4). */
    label: string
    /** 칸 · 원호 색(토큰 변수). */
    color: string
    /** 밝은 칸이면 짙은 글자로 적는다(예: 주황). */
    isLightColor?: boolean
}

type GradeScaleGaugeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /** 낮은 등급부터 높은 등급 순서. */
    grades: readonly GradeScaleItem[]
    /** 현재 등급(grades 의 label). 목록에 없으면 원호를 비우고 글자만 보인다. */
    current: string
    /** 가운데 등급 아래 설명(기본 '현재 등급'). */
    description?: string
    /** 척도 줄 — 낮은 쪽 · 높은 쪽 이름과 가운데 척도 이름. */
    lowLabel?: string
    highLabel?: string
    scaleLabel?: string
}

// 목록에 없는 등급일 때 원호 · 칸 대신 쓰는 색.
const FALLBACK_COLOR = 'var(--raw-gray-300)'

const GradeScaleGauge = ({
    ariaLabel,
    grades,
    current,
    description = '현재 등급',
    lowLabel,
    highLabel,
    scaleLabel,
    className,
    ...props
}: GradeScaleGaugeProps) => {
    const currentIndex = grades.findIndex((grade) => grade.label === current)
    const currentGrade = grades[currentIndex]
    const percentage = currentGrade ? ((currentIndex + 1) / grades.length) * 100 : 0
    // 척도 줄 — 칸이 셋 이상이면 끝 칸 둘 사이가 가운데 띠, 둘 이하면 띠 없이 양 끝 이름만.
    const hasMiddle = grades.length > 2
    const gridStyle = {gridTemplateColumns: `repeat(${Math.max(1, grades.length)}, minmax(0, 1fr))`}

    return (
        <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
            <ArcGauge
                value={percentage}
                color={currentGrade?.color ?? FALLBACK_COLOR}
                size="md"
                ariaLabel={ariaLabel}
                overlayClassName="px-10"
            >
                {/* 그림 속 글자라 p 대신 div — 값은 role="img" 이름으로 읽힌다. */}
                <div className="typo-display-m-bold text-foreground whitespace-nowrap">{current}</div>
                <div className="typo-body-xl-bold text-foreground break-keep">{description}</div>
            </ArcGauge>

            {grades.length ? (
                <div className="flex flex-col gap-2" aria-hidden="true">
                    {/* 칸 줄 · 척도 줄은 같은 격자(칸 수만큼 똑같이 나눔 · 간격 8)를 써서 이름이 칸 아래에 정확히 선다. */}
                    <ul className="grid gap-2" style={gridStyle}>
                        {grades.map((grade) => (
                            <li
                                key={grade.label}
                                className={cn(
                                    'typo-body-l-bold flex h-8 min-w-0 items-center justify-center rounded-sm px-1',
                                    grade.isLightColor ? 'text-foreground' : 'text-white',
                                )}
                                style={{backgroundColor: grade.color}}
                            >
                                <span className="truncate">{grade.label}</span>
                            </li>
                        ))}
                    </ul>
                    {lowLabel || highLabel || scaleLabel ? (
                        <div className="typo-caption-regular text-label-foreground grid h-6.5 gap-2" style={gridStyle}>
                            <span className="flex min-w-0 items-center justify-center">
                                <span className="truncate">{lowLabel}</span>
                            </span>
                            {/* 가운데 띠는 둘째 칸부터 끝에서 둘째 칸까지. 칸이 둘 이하면 띠 없이 양 끝 이름만 둔다. */}
                            {hasMiddle ? (
                                <span
                                    className="bg-accent-subtle flex min-w-0 items-center justify-center"
                                    style={{gridColumn: '2 / -2'}}
                                >
                                    <span className="truncate px-2">{scaleLabel}</span>
                                </span>
                            ) : null}
                            {grades.length > 1 ? (
                                <span className="flex min-w-0 items-center justify-center">
                                    <span className="truncate">{highLabel}</span>
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : null}

            <p className="sr-only">
                {ariaLabel}.{' '}
                {currentGrade
                    ? `전체 ${grades.length}단계(${grades[0]?.label} ~ ${grades[grades.length - 1]?.label}) 중 낮은 쪽부터 ${currentIndex + 1}번째 등급입니다.`
                    : '등급 척도에 없는 등급입니다.'}
            </p>
        </div>
    )
}

export {GradeScaleGauge}
export type {GradeScaleGaugeProps, GradeScaleItem}
