'use client'

import {useEffect, useState, type CSSProperties} from 'react'

type CounterStyle = CSSProperties & {
    '--counter-delay': string
    '--counter-end': string
}

// NIFCO Company info 수치처럼 각 자릿수가 한 바퀴 이상 회전한 뒤 목표 숫자에 멈추는 카운터.
const AnimatedCounter = ({value, onComplete}: {value: number | string; onComplete?: () => void}) => {
    const [isAnimated, setIsAnimated] = useState(false)
    const characters = String(value).split('')
    const lastDigitIndex = characters.findLastIndex((character) => /\d/.test(character))

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsAnimated(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <span aria-label={String(value)} data-animated={isAnimated} className="animated-counter">
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
                        '--counter-delay': `${characters.slice(0, index).filter((item) => /\d/.test(item)).length * 220}ms`,
                        '--counter-end': `-${reel.length - 1}em`,
                    }

                    return (
                        <span key={`${digit}-${index}`} className="animated-counter-digit">
                            <span
                                className="animated-counter-track"
                                style={style}
                                onAnimationEnd={index === lastDigitIndex ? onComplete : undefined}
                            >
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
