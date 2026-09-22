'use client'

import {useEffect, useRef, useState, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {ChartTooltipBox, ChartTooltipDescription, ChartTooltipTitle} from '@/components/composite/chart-tooltip-parts'
import {cn} from '@/lib/utils'

type WordCloudItem = {
    text: string
    weight: number
    /** 이 단어만 다른 색으로 칠할 때(CSS 색 · var(--raw-*) 등). 없으면 colors 를 순서대로 돌려 쓴다. */
    color?: string
}

type WordCloudProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    words: WordCloudItem[]
    ariaLabel: string
    /** 순서 팔레트 — 단어를 목록 순서(중요도순)대로 이 색들에 돌아가며 칠한다. 없으면 차트 팔레트(--ds-chart-1~5). */
    colors?: readonly string[]
}

// 캔버스는 CSS 변수를 모르므로 실제 색 값으로 풀어서 넘긴다.
const readColor = (color: string, probe: HTMLElement) => {
    probe.style.color = color
    return getComputedStyle(probe).color
}

// 글자 크기 — 영역 높이에 비례한다. 가장 무거운 단어가 높이의 38%, 가장 가벼운 단어가 10%(최소 12)다
// (216 높이 기준 약 82 · 22). 사이는 중요도에 따라 선형으로 나눈다.
const MAX_FONT_RATIO = 0.38
const MIN_FONT_RATIO = 0.1
const MIN_FONT_SIZE = 12
// 툴팁 자리 — 커서가 영역 가장자리(좌우 30%)에 있으면 툴팁을 안쪽으로 붙이고, 위쪽(64px 안)이면 커서 아래로 내린다.
// 가운데에 두면 가장자리에서 남은 폭이 좁아져 글자가 한 자씩 접히기 때문이다.
const TOOLTIP_EDGE_RATIO = 0.3
const TOOLTIP_TOP_SPACE = 64
const TOOLTIP_OFFSET = 10

type TooltipState = {
    text: string
    weight: number
    x: number
    y: number
    align: 'start' | 'center' | 'end'
    side: 'top' | 'bottom'
}

const TOOLTIP_ALIGN_CLASS: Record<TooltipState['align'], string> = {
    start: 'translate-x-0',
    center: '-translate-x-1/2',
    end: '-translate-x-full',
}

// 단어 사이 촘촘함(px) — 작을수록 빈틈 없이 채운다.
const GRID_SIZE = 4

const DEFAULT_COLORS = [
    'var(--ds-chart-1)',
    'var(--ds-chart-2)',
    'var(--ds-chart-3)',
    'var(--ds-chart-4)',
    'var(--ds-chart-5)',
]

const WordCloud = ({words, ariaLabel, colors = DEFAULT_COLORS, className, ...props}: WordCloudProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState<TooltipState | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const {resolvedTheme} = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !resolvedTheme) return

        setIsLoading(true)
        let cancelled = false
        let resizeFrame = 0
        let previousWidth = 0
        let previousHeight = 0

        const renderCloud = async () => {
            const {default: renderWordCloud} = await import('wordcloud')
            if (cancelled || !canvasRef.current) return

            const probe = document.createElement('span')
            canvas.parentElement?.appendChild(probe)
            const palette = colors.map((color) => readColor(color, probe))
            // 단어별 색 — 단어가 색을 가지면 그것을, 없으면 목록 순서(1번째 → 1번째 색 …)대로 팔레트를 돌린다.
            const wordColors = new Map(
                words.map((word, index) => [
                    word.text,
                    word.color ? readColor(word.color, probe) : palette[index % palette.length],
                ]),
            )
            const weights = words.map((word) => word.weight)
            const maxWeight = Math.max(...weights)
            const minWeight = Math.min(...weights)
            const fontFamily = getComputedStyle(canvas).fontFamily
            probe.remove()
            const handleRendered = () => {
                if (!cancelled) setIsLoading(false)
            }
            canvas.addEventListener('wordcloudstop', handleRendered)

            const draw = () => {
                const target = canvasRef.current
                if (!target) return
                const width = Math.max(1, Math.round(target.clientWidth))
                const height = Math.max(1, Math.round(target.clientHeight))
                if (width === previousWidth && height === previousHeight) return
                previousWidth = width
                previousHeight = height
                renderWordCloud.stop()
                target.width = width
                target.height = height
                // 캔버스가 거의 0 인 순간(창 크기 변경 중 · 숨겨진 화면)에는 그리지 않는다 — 최대 글자가 최소보다 작아지면
                // 크기 계산이 뒤집혀(중요도를 줄일수록 커짐) shrinkToFit 이 끝없이 다시 시도한다.
                if (height < MIN_FONT_SIZE * 2) return
                const minFont = Math.max(MIN_FONT_SIZE, height * MIN_FONT_RATIO)
                const maxFont = Math.max(minFont, height * MAX_FONT_RATIO)
                const weightRange = maxWeight - minWeight || 1

                renderWordCloud(target, {
                    list: words.map((word) => [word.text, word.weight]),
                    backgroundColor: 'transparent',
                    clearCanvas: true,
                    color: (word) => wordColors.get(word) ?? palette[0],
                    fontFamily,
                    fontWeight: 700,
                    gridSize: GRID_SIZE,
                    minSize: MIN_FONT_SIZE,
                    rotateRatio: 0,
                    shuffle: false,
                    shape: 'square',
                    // 영역 가로세로 비율대로 펼친다 — 넓은 카드에서는 가로로 길게 채워진다.
                    ellipticity: height / width,
                    shrinkToFit: true,
                    wait: 1,
                    // shrinkToFit 은 들어가지 않는 단어의 중요도를 3/4 씩 줄여 다시 넣는다 — 글자가 최소(12)보다 작아지면 0 을
                    // 돌려 그 단어를 건너뛰게 한다(0 = 건너뜀). 음수 · 0 근처 크기로 끝없이 다시 시도하는 무한 반복을 막는다.
                    weightFactor: (weight) => {
                        const size = minFont + ((weight - minWeight) / weightRange) * (maxFont - minFont)
                        return size < MIN_FONT_SIZE ? 0 : size
                    },
                    hover: (item, _dimension, event) => {
                        target.style.cursor = item ? 'pointer' : ''
                        if (!item || !event || !containerRef.current) {
                            setTooltip(null)
                            return
                        }

                        const [text, weight] = item
                        const containerRect = containerRef.current.getBoundingClientRect()
                        const x = event.clientX - containerRect.left
                        const y = event.clientY - containerRect.top
                        const edge = containerRect.width * TOOLTIP_EDGE_RATIO
                        setTooltip({
                            text,
                            weight,
                            x,
                            y,
                            align: x < edge ? 'start' : x > containerRect.width - edge ? 'end' : 'center',
                            side: y < TOOLTIP_TOP_SPACE ? 'bottom' : 'top',
                        })
                    },
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
                canvas.removeEventListener('wordcloudstop', handleRendered)
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
            setTooltip(null)
            disconnectObserver?.()
        }
    }, [resolvedTheme, words, colors])

    return (
        // 높이는 사용처가 className(h-*)으로 정한다 — 캔버스가 그 영역을 그대로 채운다(기본 384).
        <div ref={containerRef} {...props} className={cn('relative h-96', className)}>
            {isLoading ? (
                <ChartSkeleton
                    type="word-cloud"
                    label={`${ariaLabel} 데이터를 불러오는 중입니다.`}
                    // 컨테이너 높이 그대로 덮는다 — 스켈레톤의 기본 높이(h-72 · sm:h-96)를 쓰면 작은 카드에서 아래로
                    // 늘어났다가 그림이 그려질 때 줄어들며 자리가 흔들린다.
                    className="absolute inset-0 z-5 h-full sm:h-full"
                />
            ) : null}
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={ariaLabel}
                aria-hidden={isLoading}
                // 캔버스는 상자 위에 겹쳐 둔다(absolute) — 흐름 안에 두면 캔버스의 그린 높이가 상자를 키우고, 커진 상자에 맞춰 다시
                // 그리며 끝없이 길어진다(높이를 정하지 않고 min-h · flex-1 로 늘리는 사용처). 상자 높이는 사용처 className 이 정한다.
                className={cn('absolute inset-0 size-full', isLoading && 'invisible')}
            />
            {tooltip && (
                // 모든 차트와 같은 툴팁 면(ChartTooltipBox). 자리만 가장자리에 따라 비켜 선다.
                <ChartTooltipBox
                    className={cn(
                        'absolute z-10',
                        TOOLTIP_ALIGN_CLASS[tooltip.align],
                        tooltip.side === 'top' && '-translate-y-full',
                    )}
                    style={{
                        left: tooltip.x,
                        top: tooltip.side === 'top' ? tooltip.y - TOOLTIP_OFFSET : tooltip.y + TOOLTIP_OFFSET,
                    }}
                >
                    <ChartTooltipTitle>{tooltip.text}</ChartTooltipTitle>
                    <ChartTooltipDescription>중요도 {tooltip.weight}</ChartTooltipDescription>
                </ChartTooltipBox>
            )}
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
