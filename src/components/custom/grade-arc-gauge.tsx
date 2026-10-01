'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {useIsHydrated} from '@/hooks/use-is-hydrated'
import {cn} from '@/lib/utils'

// 등급 반원 게이지(GradeArcGauge) — 위가 열린 반원을 등급 자리만큼 채우고, 그 안에 등급과 이름을 둔다.
// 투자모형 일반분석 리포트의 최종 · 성장 · 밸류업 등급에서 쓴다.
//
// 점수가 아니라 등급을 보여 준다 — 채움은 몇 번째 등급인지로 정해진다(1등급이 가장 많이 찬다).
// 점수 게이지(ScoreGauge)와 달리 가운데 글자가 등급 한 덩어리라 크기 두 가지만 둔다.
//
// [프론트엔드 연동] 넘기는 값은 등급 이름(grade)과 그 자리(stepIndex · totalSteps)뿐이다 —
// 채움 길이는 자리에서 나오므로 따로 계산하지 않는다. 색은 size 가 정한다(lg primary · md purple.500).
//
// 짜임: 지름 194(lg) · 154(md), 선 굵기는 지름의 14%, 끝은 둥글다. 왼쪽 끝에서 시작해 오른쪽으로 찬다.
//   반원보다 조금 더 길다 — 양 끝이 수평선 아래로 10도씩 더 내려와 200도를 그린다.
//   등급 글자는 그 중심선에 바닥을 맞추고, 이름은 중심선에서 시작해 원호 끝과 나란히 선다.
//   가운데 등급은 32(lg) · 24(md) Bold, 반원 아래 이름은 12 Bold.
//   색은 lg 가 primary, md 가 purple.500 이다 — 가운데 게이지를 눈에 띄게 하기 위한 구분이다.
//
// 고정 좌표 SVG 라 브라우저가 크기를 재지 않는다 — 인쇄물에도 화면과 같은 모양으로 나간다.
// 등급과 이름은 글자로도 있으므로 색만으로 뜻을 전하지 않는다[5.3.1].

type GradeArcGaugeSize = 'md' | 'lg'

// 그리기 좌표 — 지름 200 기준으로 그리고 화면 크기는 CSS 가 정한다.
// 원호는 180 도가 아니라 200 도다(양 끝이 수평선 아래로 10 도씩). 그만큼 상자도 아래로 길어진다.
const VIEW_WIDTH = 200
const ARC_STROKE = 29
const ARC_RADIUS = (VIEW_WIDTH - ARC_STROKE) / 2
const ARC_OVERHANG_DEGREES = 10
const ARC_OVERHANG = (ARC_OVERHANG_DEGREES * Math.PI) / 180
const ARC_CENTER_Y = VIEW_WIDTH / 2
const ARC_END_X = ARC_CENTER_Y - ARC_RADIUS * Math.cos(ARC_OVERHANG)
const ARC_END_Y = ARC_CENTER_Y + ARC_RADIUS * Math.sin(ARC_OVERHANG)
const VIEW_HEIGHT = Math.ceil(ARC_END_Y + ARC_STROKE / 2)
const ARC_LENGTH = ARC_RADIUS * (Math.PI + 2 * ARC_OVERHANG)
// 양 끝이 반원보다 길어 원호는 반 바퀴를 넘는다 — SVG 는 그 경우 large-arc-flag 를 1 로 둔다.
const ARC_PATH = `M ${ARC_END_X} ${ARC_END_Y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 1 1 ${VIEW_WIDTH - ARC_END_X} ${ARC_END_Y}`

// gradeOffset · labelOffset — 등급과 이름을 원호 중심선에 맞추는 값이다. 상자는 중심선보다 아래로
// (지름 × 0.15)만큼 더 길다: 등급은 그만큼 띄워 바닥을 중심선에 맞추고, 이름은 중심선에서 시작하도록
// 아래 여백을 준다. 둘 다 원호 위에 겹쳐 두어 게이지 높이는 원호 높이 그대로다.
const SIZE_CLASSNAMES: Record<
    GradeArcGaugeSize,
    {box: string; grade: string; color: string; gradeOffset: string; labelOffset: string}
> = {
    lg: {
        box: 'w-grade-gauge-lg',
        grade: 'typo-h1-bold',
        color: 'var(--ds-primary)',
        gradeOffset: 'pb-7',
        labelOffset: 'pb-3',
    },
    md: {
        box: 'w-grade-gauge-md',
        grade: 'typo-h4-bold',
        color: 'var(--raw-purple-500)',
        gradeOffset: 'pb-6',
        labelOffset: 'pb-1',
    },
}

type GradeArcGaugeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 가운데에 크게 서는 등급(예: TI3). */
    grade: string
    /** 반원 아래 이름(예: 최종등급). */
    label: string
    /** 등급이 몇 번째인지(0부터). 0 이 가장 좋은 등급이고 그만큼 많이 찬다. */
    stepIndex: number
    /** 등급 단계 수(예: 14). */
    totalSteps: number
    size?: GradeArcGaugeSize
    /** 값을 불러오는 중. 같은 크기의 반원 스켈레톤을 대신 보인다. */
    isLoading?: boolean
    /** 불러오는 중에 화면 낭독기가 읽을 말. */
    loadingLabel?: string
}

const GradeArcGauge = ({
    grade,
    label,
    stepIndex,
    totalSteps,
    size = 'md',
    isLoading = false,
    loadingLabel = '등급을 불러오는 중입니다.',
    className,
    ...props
}: GradeArcGaugeProps) => {
    const style = SIZE_CLASSNAMES[size]
    // 다른 차트와 같은 규칙 — 화면이 붙기 전까지 같은 자리에 스켈레톤을 보인다.
    const isHydrated = useIsHydrated()

    if (isLoading || !isHydrated)
        return <ChartSkeleton type="grade-arc" label={loadingLabel} className={cn(style.box, className)} />

    // 1등급이 가득 차고 마지막 등급이 한 칸만 찬다 — 단계를 벗어난 값은 끝으로 맞춘다.
    const safeTotal = Math.max(totalSteps, 1)
    const safeIndex = Math.min(Math.max(stepIndex, 0), safeTotal - 1)
    const filledLength = (ARC_LENGTH * (safeTotal - safeIndex)) / safeTotal

    return (
        <div {...props} className={cn('grid shrink-0', style.box, className)}>
            {/* 원호 · 등급 · 이름을 같은 칸에 겹친다 — 글자가 게이지 높이를 늘리지 않는다. */}
            <>
                {/* 뜻은 아래 이름·등급 목록이 전한다 — 원호는 그 값을 눈으로 보여 주는 그림이라 읽지 않는다[5.1.1]. */}
                <svg
                    aria-hidden="true"
                    viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                    className="col-start-1 row-start-1 w-full"
                >
                    <path
                        d={ARC_PATH}
                        fill="none"
                        stroke="var(--raw-gray-50)"
                        strokeWidth={ARC_STROKE}
                        strokeLinecap="round"
                    />
                    <path
                        d={ARC_PATH}
                        fill="none"
                        stroke={style.color}
                        strokeWidth={ARC_STROKE}
                        strokeLinecap="round"
                        strokeDasharray={`${filledLength} ${ARC_LENGTH}`}
                    />
                </svg>
                {/* 이름과 등급은 값 한 쌍이다 — 목록(dl)으로 두어 '최종등급 TI3' 로 읽힌다.
                    큰 글자를 그냥 문단으로 두면 검사 도구가 '제목일 수 있음'으로 잡는다. */}
                <dl className="col-start-1 row-start-1 grid">
                    <dt
                        className={cn(
                            'typo-caption-bold text-foreground col-start-1 row-start-1 self-end text-center',
                            style.labelOffset,
                        )}
                    >
                        {label}
                    </dt>
                    <dd
                        className={cn(
                            'text-foreground col-start-1 row-start-1 self-end text-center',
                            style.grade,
                            style.gradeOffset,
                        )}
                    >
                        {grade}
                    </dd>
                </dl>
            </>
        </div>
    )
}

export {GradeArcGauge}
export type {GradeArcGaugeProps, GradeArcGaugeSize}
