'use client'

import {type CSSProperties} from 'react'

type CounterStyle = CSSProperties & {
    '--counter-end': string
}

// 애니메이션 타이밍의 단일 소스 — 인라인 스타일로 animation-duration/delay 에 직접 넘긴다
// (theme 의 --animate-counter-roll 은 이름·가속도만 정하고 시간은 비워 둔다).
const COUNTER_ROLL_DURATION_MS = 3000
const COUNTER_DIGIT_STAGGER_MS = 220

// 마지막 자릿수의 지연까지 포함한 전체 소요 시간. 롤러의 이벤트 유실 대비 타이머가 참조한다.
export const counterTotalDurationMs = (value: number | string) => {
    const digitCount = String(value).replace(/\D/g, '').length
    return COUNTER_ROLL_DURATION_MS + Math.max(0, digitCount - 1) * COUNTER_DIGIT_STAGGER_MS
}

// 각 자릿수가 한 바퀴 이상 회전한 뒤 목표 숫자에 멈추는 카운터.
// 애니메이션은 마운트 즉시 CSS 로만 시작한다 — rAF/state 게이트를 두면 창이 가려져
// rAF 가 스로틀될 때 0에 멈춘 채 시작하지 못하는 문제가 있었다(벽시계 기준 진행 보장).
const AnimatedCounter = ({value, onComplete}: {value: number | string; onComplete?: () => void}) => {
    const characters = String(value).split('')
    const lastDigitIndex = characters.findLastIndex((character) => /\d/.test(character))

    return (
        <span aria-label={String(value)} className="animated-counter">
            <span aria-hidden="true" className="inline-flex">
                {characters.map((character, index) => {
                    if (!/\d/.test(character)) {
                        return <span key={`${character}-${index}`}>{character}</span>
                    }

                    const digit = Number(character)
                    // 모든 자릿수를 0에서 시작해 0–9를 한 바퀴 돈 뒤 목표 숫자에 멈춘다.
                    const reel = [
                        0,
                        ...Array.from({length: 9}, (_, step) => step + 1),
                        ...Array.from({length: digit + 1}, (_, step) => step),
                    ]
                    const style: CounterStyle = {
                        animationDuration: `${COUNTER_ROLL_DURATION_MS}ms`,
                        animationDelay: `${characters.slice(0, index).filter((item) => /\d/.test(item)).length * COUNTER_DIGIT_STAGGER_MS}ms`,
                        '--counter-end': `-${reel.length - 1}em`,
                    }

                    return (
                        // 자릿수 창과 레일은 글자 크기에 맞물려야 해 1em 단위를 쓴다(고정 px 이면 크기가 바뀔 때 어긋난다).
                        <span
                            key={`${digit}-${index}`}
                            className="inline-block h-[1em] overflow-hidden align-[-0.08em] leading-none"
                        >
                            <span
                                className="animate-counter-roll flex flex-col leading-none motion-reduce:translate-y-(--counter-end) motion-reduce:animate-none"
                                style={style}
                                onAnimationEnd={index === lastDigitIndex ? onComplete : undefined}
                            >
                                {reel.map((number, step) => (
                                    <span key={step} className="h-[1em]">
                                        {number}
                                    </span>
                                ))}
                            </span>
                        </span>
                    )
                })}
            </span>
        </span>
    )
}

export default AnimatedCounter
