'use client'

import {useEffect, useRef, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import {cn} from '@/lib/utils'

type WordCloudItem = {
    text: string
    weight: number
}

type WordCloudProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    words: WordCloudItem[]
    ariaLabel: string
}

const readColor = (token: string, probe: HTMLElement) => {
    probe.style.color = `var(${token})`
    return getComputedStyle(probe).color
}

const WordCloud = ({words, ariaLabel, className, ...props}: WordCloudProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {resolvedTheme} = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !resolvedTheme) return

        let cancelled = false
        let resizeFrame = 0
        let previousWidth = 0
        let previousHeight = 0

        const renderCloud = async () => {
            const {default: renderWordCloud} = await import('wordcloud')
            if (cancelled || !canvasRef.current) return

            const probe = document.createElement('span')
            canvas.parentElement?.appendChild(probe)
            const palette = [
                readColor('--ds-chart-1', probe),
                readColor('--ds-chart-2', probe),
                readColor('--ds-chart-3', probe),
                readColor('--ds-chart-4', probe),
                readColor('--ds-chart-5', probe),
            ]
            const fontFamily = getComputedStyle(canvas).fontFamily
            probe.remove()

            const draw = () => {
                const target = canvasRef.current
                if (!target) return
                const width = Math.max(320, Math.round(target.clientWidth))
                const height = Math.max(320, Math.round(target.clientHeight))
                if (width === previousWidth && height === previousHeight) return
                previousWidth = width
                previousHeight = height
                renderWordCloud.stop()
                target.width = width
                target.height = height
                const responsiveScale = Math.min(1, width / 720, height / 384)

                renderWordCloud(target, {
                    list: words.map((word) => [word.text, word.weight]),
                    backgroundColor: 'transparent',
                    clearCanvas: true,
                    color: (_word, weight) => palette[Math.round(Number(weight)) % palette.length],
                    fontFamily,
                    fontWeight: 700,
                    gridSize: 8,
                    minSize: 12,
                    rotateRatio: 0,
                    shuffle: false,
                    shape: 'square',
                    ellipticity: 0.52,
                    shrinkToFit: false,
                    wait: 1,
                    weightFactor: (weight) => Math.max(16, Math.min(112, weight * 1.12) * responsiveScale),
                })
            }

            const observer = new ResizeObserver(() => {
                cancelAnimationFrame(resizeFrame)
                resizeFrame = requestAnimationFrame(draw)
            })
            if (canvas.parentElement) observer.observe(canvas.parentElement)
            draw()

            return () => {
                observer.disconnect()
                renderWordCloud.stop()
            }
        }

        let disconnectObserver: (() => void) | undefined
        void renderCloud().then((disconnect) => {
            disconnectObserver = disconnect
        })

        return () => {
            cancelled = true
            cancelAnimationFrame(resizeFrame)
            disconnectObserver?.()
        }
    }, [resolvedTheme, words])

    return (
        <div {...props} className={cn('relative', className)}>
            <canvas ref={canvasRef} role="img" aria-label={ariaLabel} className="h-96 w-full" />
            <ol className="sr-only">
                {words.map((word) => (
                    <li key={word.text}>
                        {word.text}: 중요도 {word.weight}
                    </li>
                ))}
            </ol>
        </div>
    )
}

export {WordCloud}
export type {WordCloudItem, WordCloudProps}
