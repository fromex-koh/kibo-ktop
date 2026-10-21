import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 점수 눈금 막대(ScoreScaleBar) — 0~최댓값 눈금 위에 점수만큼 채우고, 점수 자리에 세로 표시선을 세운다.
// K-BIGx 보고서 인쇄본 진단브리핑 "혁신성장역량지수"의 점수 막대. (백분율 글자가 위에 붙는 진행률은 ProgressBar.)
//
// 짜임: 배경 띠 → 채움(점수 ÷ 최댓값 폭) → 세로 표시선(띠 위아래로 조금 나옴) → 눈금 숫자(값 자리, 양 끝은 띠 끝).
//   눈금은 기본 띠 아래이고, tickPosition="top" 이면 띠 위다(K-BIGx 인쇄본 혁신성장역량지수).
//   표시선은 자기 폭만큼 점수 쪽으로 당겨(0 이면 띠 왼쪽 안, 100 이면 띠 오른쪽 안) 띠 밖으로 나가지 않는다.
// 데이터에 따라
//   · 점수가 0 미만이면 0, 최댓값을 넘으면 최댓값으로 맞춘다. 숫자가 아니면(NaN) 0 으로 그린다.
//   · 채움 색은 사용처가 점수 구간(등급)에 맞춰 fillClassName 으로 넘긴다(예: getTechIndexGrade(score).tone).
// 서버에서 바로 그려지고 움직임 · 마우스 반응이 없다. 점수는 role="meter" 의 값으로 읽어 준다.
//
// 색 · 크기는 클래스로 바꾼다 — 기본은 웹 시맨틱 토큰, 인쇄본은 kbx 클래스를 넘긴다(kbigx-print-briefing.tsx).

type ScoreScaleBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 점수. 0 ~ max 로 맞춰 그린다. */
    score: number
    /** 최댓값(기본 100). */
    max?: number
    /** 눈금 숫자(기본 0 · 25 · 50 · 75 · 100). 빈 배열이면 눈금을 그리지 않는다. */
    ticks?: readonly number[]
    /** 눈금 자리 — 'bottom'(기본) 띠 아래 · 'top' 띠 위. */
    tickPosition?: 'top' | 'bottom'
    /** 화면 낭독기가 읽을 이름(예: 혁신성장역량지수). 값은 aria-valuenow 로 함께 읽는다. */
    ariaLabel: string
    /** 낭독기가 읽을 값 문구(예: '73.8점, 양호'). 없으면 점수 숫자를 읽는다. */
    valueText?: string
    /** 배경 띠(높이 · 색). */
    trackClassName?: string
    /** 채움 색. */
    fillClassName?: string
    /** 세로 표시선(폭 · 위아래로 나온 길이 · 색). */
    markerClassName?: string
    /** 눈금 숫자(글자 크기 · 행간 · 색). 주면 기본 글자 스타일을 대신한다. */
    tickClassName?: string
}

// 웹 화면용 등급(tone)별 채움 색 — 점수 원호 게이지(ScoreGauge)의 시작 색(gauge-<등급>-from)과 같다.
// 취약만 label-foreground 다 — 라이트는 gauge-weak-from 과 같은 gray.700 이고, 다크에서는 밝아져 어두운 띠(gray.700)와 구분된다.
// 등급은 getTechIndexGrade(score).tone(k-bigx-innovation-report.ts)으로 구한다.
const SCORE_SCALE_BAR_TONE_CLASS = {
    weak: 'bg-label-foreground',
    poor: 'bg-gauge-poor-from',
    normal: 'bg-gauge-normal-from',
    good: 'bg-gauge-good-from',
    excellent: 'bg-gauge-excellent-from',
} as const

const DEFAULT_MAX = 100
const DEFAULT_TICKS = [0, 25, 50, 75, 100] as const
const PERCENT = 100
// 가운데 눈금 숫자를 자기 폭의 절반만큼 왼쪽으로 당겨 값 자리에 가운데를 맞춘다.
const TICK_CENTER_SHIFT = 50

const ScoreScaleBar = ({
    score,
    max = DEFAULT_MAX,
    ticks = DEFAULT_TICKS,
    tickPosition = 'bottom',
    ariaLabel,
    valueText,
    trackClassName,
    fillClassName,
    markerClassName,
    tickClassName,
    className,
    ...props
}: ScoreScaleBarProps) => {
    const safeMax = max > 0 ? max : DEFAULT_MAX
    const safeScore = Number.isFinite(score) ? Math.min(safeMax, Math.max(0, score)) : 0
    const ratio = `${(safeScore / safeMax) * PERCENT}%`

    // 눈금 숫자는 aria-hidden 이라 읽는 순서와 무관하다 — 자리에 맞춰 띠 앞이나 뒤에 둔다.
    // 숫자는 값 자리에 놓는다(25 → 띠의 25%). 양 끝(0 · 최댓값)은 띠 밖으로 나가지 않게 띠 끝에 맞추고, 나머지는 값 자리에
    // 가운데를 맞춘다. 고르게 벌리면(justify-between) 숫자 폭 차이로 가운데 숫자가 값보다 왼쪽에 놓여, 채움이 그 숫자를
    // 넘은 것처럼 보인다. 첫 숫자는 줄 높이를 잡으려고 흐름에 두고, 나머지는 겹쳐 놓는다.
    const tickRow = ticks.length ? (
        <div
            aria-hidden="true"
            // tickClassName 을 주면 기본 글자 스타일(typo-*)을 쓰지 않는다 — typo 의 행간이 남으면 눈금 줄이 높아진다.
            className={cn('relative flex', tickClassName ?? 'typo-body-m-medium text-foreground-subtle')}
        >
            {ticks.map((tick, index) => {
                const position = (Math.min(safeMax, Math.max(0, tick)) / safeMax) * PERCENT
                const shift = position <= 0 ? 0 : position >= PERCENT ? PERCENT : TICK_CENTER_SHIFT
                return (
                    <span
                        key={tick}
                        className={cn('whitespace-nowrap', index > 0 && 'absolute top-0')}
                        // 자리는 눈금 값에서 정해지는 값이라 인라인 스타일로 둔다.
                        style={index > 0 ? {left: `${position}%`, transform: `translateX(-${shift}%)`} : undefined}
                    >
                        {tick}
                    </span>
                )
            })}
        </div>
    ) : null

    return (
        <div {...props} className={cn('flex flex-col gap-2', className)}>
            {tickPosition === 'top' ? tickRow : null}
            <div
                role="meter"
                aria-label={ariaLabel}
                aria-valuemin={0}
                aria-valuemax={safeMax}
                aria-valuenow={safeScore}
                aria-valuetext={valueText}
                className={cn('bg-muted relative h-4', trackClassName)}
            >
                {/* 폭 · 자리는 점수에서 정해지는 값이라 인라인 스타일로 둔다. */}
                <div className={cn('bg-primary h-full', fillClassName)} style={{width: ratio}} />
                <div
                    aria-hidden="true"
                    className={cn('bg-foreground absolute -top-2 -bottom-2 w-0.5', markerClassName)}
                    style={{left: ratio, transform: `translateX(-${ratio})`}}
                />
            </div>
            {tickPosition === 'bottom' ? tickRow : null}
        </div>
    )
}

export {SCORE_SCALE_BAR_TONE_CLASS, ScoreScaleBar}
export type {ScoreScaleBarProps}
