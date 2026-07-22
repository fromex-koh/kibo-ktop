'use client'

import {useEffect, useState, type CSSProperties} from 'react'

type CounterStyle = CSSProperties & {
    '--counter-delay': string
    '--counter-end': string
}

// NIFCO Company info 수치처럼 각 자릿수가 한 바퀴 이상 회전한 뒤 목표 숫자에 멈추는 카운터.
const AnimatedCounter = ({value}: {value: number}) => {
    const [isAnimated, setIsAnimated] = useState(false)
    const digits = String(value).split('').map(Number)

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsAnimated(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <span aria-label={String(value)} data-animated={isAnimated} className="animated-counter">
            <span aria-hidden="true" className="inline-flex">
                {digits.map((digit, index) => {
                    // 최종 숫자에서 시작해 0–9를 한 바퀴 돈 뒤 같은 숫자로 돌아가므로
                    // hydration·애니메이션 시작 전에도 000 대신 실제 값이 보인다.
                    const reel = Array.from({length: 11}, (_, step) => (digit + step) % 10)
                    const style: CounterStyle = {
                        '--counter-delay': `${index * 220}ms`,
                        '--counter-end': '-10em',
                    }

                    return (
                        <span key={`${digit}-${index}`} className="animated-counter-digit">
                            <span className="animated-counter-track" style={style}>
                                {reel.map((number, step) => (
                                    <span key={step}>{number}</span>
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
