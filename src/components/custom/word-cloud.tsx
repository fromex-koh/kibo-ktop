'use client'

import {useChartAnimation} from '@/components/custom/chart-reveal'
import {useEffect, useRef, useState, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {ChartTooltipBox, ChartTooltipDescription, ChartTooltipTitle} from '@/components/composite/chart-tooltip-parts'
import {cn} from '@/lib/utils'

// 워드클라우드(WordCloud) — 키워드를 중요도(weight)에 비례한 크기로 상자 안에 빈틈없이 채워 그린다(wordcloud2.js · canvas).
// 보고서 진단브리핑 "R&D 이슈" 카드와 기술혁신정보 탭 "맞춤형 기술정보-R&D" 카드에서 쓴다.
//
// [프론트엔드 연동]
//   - words 는 중요도 높은 순으로 넘긴다 — 색은 목록 순서대로 팔레트를 돌려 칠하므로, 순서가 곧 색 순서다.
//   - text 는 서로 달라야 한다(숨김 목록의 key · 툴팁이 text 로 단어를 찾는다).
//   - weight 는 양수. 크기는 가장 큰 · 작은 weight 사이에서 비례로 정해지고, 단위는 화면에 '중요도 n' 으로만 보인다.
//   - 키워드 수에 상관없이 모든 단어를 그린다(빼지 않는다). 개수 제한이 필요하면 넘기기 전에 자른다.
//   - 빈 목록은 넘기지 않는다 — 그릴 단어가 없으면 스켈레톤이 계속 남는다. 사용처에서 키워드가 없으면 WordCloud 대신
//     같은 높이의 빈 상태(EmptyState)를 둔다(웹 보고서 · 인쇄본 모두 사용처에서 분기).
//   - 높이는 사용처 className(h-*)이 정한다. 폭은 부모를 따른다. 상자 크기가 바뀌면 다시 맞춘다.
//   - 그린 결과 확인: 개발자 도구에서 canvas 의 data-drawn-words 가 '그린 수/받은 수' 로 같아야 한다.

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

// 캔버스에 실제로 칠해진 영역(글자 묶음)의 폭 · 높이 — 2px 간격으로 훑는다(정밀도는 충분하고 빠르다).
const INK_SAMPLE_STEP = 2
// 그릴 때마다 픽셀을 다시 읽으므로 '자주 읽음'으로 만든다 — 아니면 브라우저가 getImageData 반복 경고를 낸다.
// 컨텍스트 설정은 처음 만들 때 정해지고, 라이브러리가 나중에 부르는 getContext('2d') 도 이 컨텍스트를 그대로 받는다.
const CANVAS_CONTEXT_OPTIONS: CanvasRenderingContext2DSettings = {willReadFrequently: true}
const measureInk = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d', CANVAS_CONTEXT_OPTIONS)
    if (!context || !canvas.width || !canvas.height) return {width: 0, height: 0, left: 0, right: 0}
    const {data} = context.getImageData(0, 0, canvas.width, canvas.height)
    let minX = canvas.width
    let maxX = -1
    let minY = canvas.height
    let maxY = -1
    for (let y = 0; y < canvas.height; y += INK_SAMPLE_STEP) {
        for (let x = 0; x < canvas.width; x += INK_SAMPLE_STEP) {
            if (data[(y * canvas.width + x) * 4 + 3] > 0) {
                minX = Math.min(minX, x)
                maxX = Math.max(maxX, x)
                minY = Math.min(minY, y)
                maxY = Math.max(maxY, y)
            }
        }
    }
    return maxX < 0
        ? {width: 0, height: 0, left: 0, right: 0}
        : {width: maxX - minX, height: maxY - minY, left: minX, right: canvas.width - maxX}
}

// 배치 규칙 — 모든 단어를 빠짐없이 그리면서 영역을 꽉 채운다.
//   1) 단어 글자 면적 합이 영역의 FILL_RATIO 가 되는 배율로 그린다.
//   2) 한 단어라도 들어가지 않으면 전체 배율을 SHRINK_STEP 만큼 줄여 다시 그린다 — 단어를 빼지 않는다.
//      글자가 최소(MIN_FONT_SIZE)까지 줄어도 안 들어가면 큰 단어 · 작은 단어 크기 차이(MAX_MIN_RATIO)를 좁히고,
//      그래도 안 되면 단어 사이 간격(GRID_SIZE)을 촘촘히 한다.
//   3) 다 들어가면 글자 묶음의 가로 · 세로를 재서 영역의 FILL_TARGET 에 못 미칠 때 키우고(단어가 빠지던 배율은 넘지 않음),
//      큰 단어가 높이에 막혀 더 못 키우는데 가로가 남으면, 큰 · 작은 단어 크기 차이를 좁혀(MIN_SIZE_RATIO 까지) 작은 단어를
//      키운다 — 키워드가 2~3개일 때 여백을 메운다. 그래도 남으면 배치 타원을 납작하게 해 옆으로 퍼뜨린다.
//   최대 MAX_FIT_PASSES 번 다시 그리며, 그동안은 스켈레톤이 덮어 다시 그리는 모습은 보이지 않는다.
//
// 긴 단어 — 한 단어가 영역 폭(× WORD_WIDTH_LIMIT)을 넘지 않게 그 단어만 글자를 줄인다.
//   최소 크기로도 넘치면 화면에는 말줄임(…)으로 줄여 그리고, 전체 단어는 툴팁 · 숨김 목록으로 읽는다.
//
// 상수 — 값을 바꾸면 컴포넌트 가이드(/component-guide/word-cloud)의 단어 수별 예시로 결과를 확인한다.
//   FILL_RATIO      첫 배율: 글자 면적 합 ÷ 영역 면적
//   FILL_TARGET     키울 때 목표: 글자 묶음 가로 · 세로가 영역의 이 비율에 닿을 때까지
//   MAX_FIT_PASSES  다시 그리는 최대 횟수
//   MAX_GROWTH      한 번에 키우는 최대 배수
//   SHRINK_STEP     단어가 빠졌을 때 한 번에 줄이는 비율
//   MIN_FLATTEN     옆으로 퍼뜨릴 때 배치 타원을 납작하게 하는 하한
//   MAX_MIN_RATIO   가장 무거운 ÷ 가장 가벼운 단어 크기의 상한 — 실제 차이는 중요도 비율(최대 이 값)로 시작한다.
//   SIZE_RATIO_STEP 크기 차이를 좁힐 때 한 번에 곱하는 비율
//   MAX_FONT_RATIO  가장 큰 글자 크기 상한 = 영역 높이 × 이 값(단어가 한두 개일 때 걸린다).
//   MIN_FONT_SIZE   가장 작은 글자 크기(px)
//   WORD_WIDTH_LIMIT 한 단어가 차지할 수 있는 폭 = 영역 폭 × 이 값
const FILL_RATIO = 0.6
const FILL_TARGET = 0.94
const MAX_FIT_PASSES = 24
const MAX_GROWTH = 1.6
const SHRINK_STEP = 0.85
const MIN_FLATTEN = 0.4
const MAX_MIN_RATIO = 4.5
// 크기 차이를 좁힐 때의 하한 — 중요도 순서가 보이도록 가장 무거운 단어는 늘 이만큼은 더 크다.
const MIN_SIZE_RATIO = 1.15
const SIZE_RATIO_STEP = 0.85
// 한글 획은 글자 크기의 약 89% 라, 1 이어도 실제 칠해지는 높이는 영역의 약 89% 다.
const MAX_FONT_RATIO = 1
const MIN_FONT_SIZE = 12
const WORD_WIDTH_LIMIT = 0.92
const ELLIPSIS = '…'
// 단어 사이 촘촘함(px) — 작을수록 빈틈 없이 채운다. 단어가 다 안 들어갈 때만 TIGHT_GRID_SIZE 로 좁힌다.
const GRID_SIZE = 4
const TIGHT_GRID_SIZE = 2
// 글자 폭을 잴 때 쓰는 기준 글자 크기(px) — 비율만 쓰므로 값 자체는 결과에 영향이 없다.
const MEASURE_FONT_SIZE = 100
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

const DEFAULT_COLORS = [
    'var(--ds-chart-1)',
    'var(--ds-chart-2)',
    'var(--ds-chart-3)',
    'var(--ds-chart-4)',
    'var(--ds-chart-5)',
]

// 최대 폭 안에 들도록 뒤에서부터 글자를 덜어 내고 말줄임을 붙인다(한 글자는 남긴다).
const truncateToWidth = (text: string, maxWidth: number, measure: (value: string) => number) => {
    const characters = [...text]
    const fittingLength = characters.findLastIndex(
        (_, index) => measure(characters.slice(0, index + 1).join('') + ELLIPSIS) <= maxWidth,
    )
    return characters.slice(0, Math.max(1, fittingLength + 1)).join('') + ELLIPSIS
}

// 맞춤 결과 기억 — 같은 단어 · 같은 크기면 다시 맞추지 않고 한 번에 그린다. 보고서는 카드가 보일 때 차트를 새로 그리므로
// (chart-reveal.tsx), 맞춤을 처음부터 반복하면 그동안 스켈레톤이 끼어 '나타났다 사라졌다 움직임'처럼 보인다.
type FitResult = {scale: number; sizeRatio: number; flatten: number; gridSize: number; originShift: number}
const fitCache = new Map<string, FitResult>()
const MAX_FIT_CACHE = 50
const fitCacheKey = (words: readonly WordCloudItem[], width: number, height: number) =>
    `${width}x${height}|${words.map((word) => `${word.text}:${word.weight}`).join('|')}`

const WordCloud = ({words, ariaLabel, colors = DEFAULT_COLORS, className, ...props}: WordCloudProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState<TooltipState | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const animate = useChartAnimation()
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
            // 라이브러리보다 먼저 '자주 읽음' 컨텍스트를 만든다(CANVAS_CONTEXT_OPTIONS).
            const context = canvas.getContext('2d', CANVAS_CONTEXT_OPTIONS)
            if (cancelled || !canvasRef.current || !context) return

            const probe = document.createElement('span')
            canvas.parentElement?.appendChild(probe)
            const palette = colors.map((color) => readColor(color, probe))
            // 단어별 색 — 단어가 색을 가지면 그것을, 없으면 목록 순서(1번째 → 1번째 색 …)대로 팔레트를 돌린다.
            const wordColors = words.map((word, index) =>
                word.color ? readColor(word.color, probe) : palette[index % palette.length],
            )
            probe.remove()
            const weights = words.map((word) => word.weight)
            const maxWeight = Math.max(...weights)
            const minWeight = Math.min(...weights)
            const weightRange = maxWeight - minWeight || 1
            // 크기 차이의 시작값 — 중요도 비율만큼(최대 MAX_MIN_RATIO). 중요도가 비슷한 단어(30 · 28)는 크기도 비슷하게 시작한다.
            const naturalRatio =
                minWeight > 0 ? Math.min(MAX_MIN_RATIO, Math.max(1, maxWeight / minWeight)) : MAX_MIN_RATIO
            const fontFamily = getComputedStyle(canvas).fontFamily
            // 글자 폭 — 기준 크기로 재서 1px 당 폭으로 쓴다.
            const widthPerPx = (text: string) => {
                context.font = `700 ${MEASURE_FONT_SIZE}px ${fontFamily}`
                return context.measureText(text).width / MEASURE_FONT_SIZE
            }
            const unitWidths = words.map((word) => widthPerPx(word.text))
            // 이 캔버스의 그리기만 멈춘다 — 라이브러리의 stop() 은 페이지의 모든 워드클라우드를 멈추므로 쓰지 않는다
            // (한 화면에 여럿 있으면 나중 것이 앞의 것을 세워 끝나지 않는다). 라이브러리는 같은 캔버스에 'wordcloudstart' 가
            // 오면 진행 중이던 그리기를 멈춘다.
            const stopThisCloud = () => canvas.dispatchEvent(new CustomEvent('wordcloudstart'))

            // 맞춤 그리기 상태 — draw() 가 새로 시작할 때마다 되돌린다.
            let fitPass = 0
            let fitScale = 0
            let maxScale = 0
            // 단어가 빠졌던 가장 작은 배율 — 다시 키울 때 이 배율을 넘지 않는다.
            let dropScale = Number.POSITIVE_INFINITY
            let sizeRatio = naturalRatio
            let gridSize = GRID_SIZE
            let flatten = 1
            let drawnCount = 0
            // 폭 상한에 걸린 긴 단어가 있는가 — 있으면 글자 묶음 폭은 더 못 늘어나므로 세로 기준으로만 키운다.
            let hasWidthCappedWord = false
            // 가장 잘 채운(모든 단어가 든) 상태 — 다시 그리다 더 나빠지면 이 상태로 되돌려 마무리한다.
            let best: {scale: number; sizeRatio: number; flatten: number; gridSize: number; fill: number} | null = null
            let isFinalPaint = false
            // 두 단어 묶음의 가로 보정(px) — 그린 뒤 좌우 여백이 다르면 그 절반만큼 옮겨 한 번 더 그린다.
            let originShift = 0
            let isCentered = false
            // 크기 차이를 좁힌 직후의 되돌릴 자리 — 좁혔더니 단어가 빠지면 이 자리로 되돌리고 더 좁히지 않는다.
            let ratioUndo: {sizeRatio: number; scale: number; maxScale: number} | null = null
            let ratioFloor = MIN_SIZE_RATIO
            let paint: (scale: number) => void = () => {}
            // 두 단어는 묶음이 한쪽으로 치우치기 쉽다 — 좌우 여백 차이의 절반만큼 옮겨 한 번 더 그린다(다시 그렸으면 true).
            const centerPair = (target: HTMLCanvasElement) => {
                if (words.length !== 2 || isCentered || drawnCount < words.length) return false
                const ink = measureInk(target)
                const centerOffset = (ink.right - ink.left) / 2
                if (Math.abs(centerOffset) <= target.width * 0.02) return false
                isCentered = true
                isFinalPaint = true
                originShift += centerOffset
                paint(fitScale)
                return true
            }
            let cacheKey = ''
            const finish = (target: HTMLCanvasElement) => {
                if (drawnCount === words.length && cacheKey) {
                    if (fitCache.size >= MAX_FIT_CACHE) fitCache.clear()
                    fitCache.set(cacheKey, {scale: fitScale, sizeRatio, flatten, gridSize, originShift})
                }
                // 확인용 — '그린 수/받은 수'(파일 머리 [프론트엔드 연동] 참고).
                target.dataset.drawnWords = `${drawnCount}/${words.length}`
                setIsLoading(false)
            }

            const handleWordDrawn = (event: Event) => {
                if (!(event instanceof CustomEvent)) return
                const detail: unknown = event.detail
                if (detail && typeof detail === 'object' && 'drawn' in detail && detail.drawn) drawnCount += 1
            }
            const handleRendered = () => {
                const target = canvasRef.current
                if (cancelled || !target) return
                // 되돌려 그린 마지막 판 — 두 단어면 가운데만 맞추고 마무리한다.
                if (isFinalPaint) {
                    if (!centerPair(target)) finish(target)
                    return
                }
                const canRetry = fitPass < MAX_FIT_PASSES
                // 한 단어라도 빠졌다 — 단어를 빼지 않고 전체를 줄인다.
                // 단, 크기 차이를 막 좁혀서 빠진 것이면 좁히기 전으로 되돌리고 거기서 멈춘다(큰 단어까지 줄이지 않는다).
                if (drawnCount < words.length && canRetry && ratioUndo) {
                    fitPass += 1
                    sizeRatio = ratioUndo.sizeRatio
                    ratioFloor = ratioUndo.sizeRatio
                    maxScale = ratioUndo.maxScale
                    const undoScale = ratioUndo.scale
                    ratioUndo = null
                    paint(undoScale)
                    return
                }
                ratioUndo = null
                if (drawnCount < words.length && canRetry) {
                    fitPass += 1
                    dropScale = Math.min(dropScale, fitScale)
                    if (fitScale > MIN_FONT_SIZE) {
                        paint(Math.max(MIN_FONT_SIZE, fitScale * SHRINK_STEP))
                    } else if (sizeRatio > 1) {
                        sizeRatio = Math.max(1, sizeRatio * SHRINK_STEP)
                        paint(fitScale)
                    } else {
                        gridSize = TIGHT_GRID_SIZE
                        paint(fitScale)
                    }
                    return
                }
                // 다 들어갔다 — 영역의 FILL_TARGET 에 못 미치면 키운다(단어가 빠지던 배율 바로 아래까지).
                const ink = measureInk(target)
                const fill = Math.min(1, ink.width / target.width) + Math.min(1, ink.height / target.height)
                if (drawnCount === words.length && (!best || fill > best.fill)) {
                    best = {scale: fitScale, sizeRatio, flatten, gridSize, fill}
                }
                const growth = Math.min(
                    MAX_GROWTH,
                    ink.width && !hasWidthCappedWord ? (target.width * FILL_TARGET) / ink.width : MAX_GROWTH,
                    ink.height ? (target.height * FILL_TARGET) / ink.height : MAX_GROWTH,
                )
                const nextScale = Math.min(maxScale, fitScale * growth, dropScale * SHRINK_STEP)
                if (drawnCount === words.length && canRetry && nextScale > fitScale * 1.03) {
                    fitPass += 1
                    paint(nextScale)
                    return
                }
                const widthFill = ink.width / target.width
                const heightFill = ink.height / target.height
                // 큰 단어가 높이에 막혀 더 못 키우는데 가로가 남았다 — 크기 차이를 좁혀 작은 단어를 키운다.
                // 가장 큰 단어 크기는 그대로 두도록 배율을 (이전 차이 ÷ 새 차이)만큼 올린다.
                if (
                    drawnCount === words.length &&
                    canRetry &&
                    widthFill < FILL_TARGET - 0.04 &&
                    maxWeight > minWeight &&
                    sizeRatio > ratioFloor + 0.01 &&
                    fitScale >= maxScale * 0.97
                ) {
                    fitPass += 1
                    ratioUndo = {sizeRatio, scale: fitScale, maxScale}
                    const nextRatio = Math.max(ratioFloor, sizeRatio * SIZE_RATIO_STEP)
                    const nextScaleForRatio = fitScale * (sizeRatio / nextRatio)
                    sizeRatio = nextRatio
                    maxScale = (target.height * MAX_FONT_RATIO) / sizeRatio
                    dropScale = Number.POSITIVE_INFINITY
                    paint(nextScaleForRatio)
                    return
                }
                // 그래도 가로가 남는다(세로는 참) — 옆으로 퍼뜨린다(같은 배율로 다시 그린 뒤 다시 키워 본다).
                const nextFlatten = Math.max(MIN_FLATTEN, flatten * (widthFill / FILL_TARGET))
                if (
                    drawnCount === words.length &&
                    canRetry &&
                    widthFill < FILL_TARGET - 0.04 &&
                    heightFill >= FILL_TARGET - 0.04 &&
                    nextFlatten < flatten - 0.02
                ) {
                    fitPass += 1
                    flatten = nextFlatten
                    paint(fitScale)
                    return
                }
                // 마지막 판이 가장 잘 채운 판보다 못하면(또는 단어가 빠졌으면) 그 판으로 되돌려 한 번 더 그린다.
                if (best && (drawnCount < words.length || best.fill > fill + 0.03)) {
                    isFinalPaint = true
                    sizeRatio = best.sizeRatio
                    flatten = best.flatten
                    gridSize = best.gridSize
                    paint(best.scale)
                    return
                }
                if (!centerPair(target)) finish(target)
            }
            canvas.addEventListener('wordclouddrawn', handleWordDrawn)
            canvas.addEventListener('wordcloudstop', handleRendered)

            const draw = () => {
                const target = canvasRef.current
                if (!target) return
                const width = Math.max(1, Math.round(target.clientWidth))
                const height = Math.max(1, Math.round(target.clientHeight))
                if (width === previousWidth && height === previousHeight) return
                previousWidth = width
                previousHeight = height
                stopThisCloud()
                setIsLoading(true)
                target.width = width
                target.height = height
                // 캔버스가 거의 0 인 순간(창 크기 변경 중 · 숨겨진 화면)에는 그리지 않는다.
                if (height < MIN_FONT_SIZE * 2 || !words.length) return

                // 긴 단어 — 최소 크기로도 폭을 넘으면 화면 글자만 말줄임으로 줄인다(전체 단어는 툴팁 · 숨김 목록).
                const maxWordWidth = width * WORD_WIDTH_LIMIT
                const displayTexts = words.map((word, index) =>
                    unitWidths[index] * MIN_FONT_SIZE > maxWordWidth
                        ? truncateToWidth(word.text, maxWordWidth, (value) => widthPerPx(value) * MIN_FONT_SIZE)
                        : word.text,
                )
                const displayWidths = displayTexts.map((text) => widthPerPx(text))
                // 중요도 → 상대 크기(1 ~ sizeRatio). 실제 px 은 배율(scale)을 곱하고, 단어마다 폭 · 높이 상한으로 자른다.
                const relativeSize = (weight: number) => 1 + ((weight - minWeight) / weightRange) * (sizeRatio - 1)
                const sizeOf = (index: number, scale: number) =>
                    Math.max(
                        MIN_FONT_SIZE,
                        Math.min(
                            scale * relativeSize(words[index].weight),
                            maxWordWidth / displayWidths[index],
                            height * MAX_FONT_RATIO,
                        ),
                    )
                // 첫 배율 — 글자 면적 합이 영역의 FILL_RATIO 가 되는 값.
                const unitArea = words.reduce(
                    (sum, word, index) => sum + displayWidths[index] * relativeSize(word.weight) ** 2,
                    0,
                )
                // 가장 무거운 단어가 높이의 MAX_FONT_RATIO 에 닿는 배율 — 단어가 하나(또는 모두 같은 중요도)면 상대 크기가 1 이다.
                maxScale = (height * MAX_FONT_RATIO) / relativeSize(maxWeight)
                fitPass = 0
                dropScale = Number.POSITIVE_INFINITY
                sizeRatio = naturalRatio
                gridSize = GRID_SIZE
                flatten = 1
                best = null
                isFinalPaint = false
                ratioUndo = null
                ratioFloor = Math.min(MIN_SIZE_RATIO, naturalRatio)
                originShift = 0
                isCentered = false
                paint = (scale: number) => {
                    fitScale = scale
                    drawnCount = 0
                    hasWidthCappedWord = words.some(
                        (word, index) => scale * relativeSize(word.weight) > maxWordWidth / displayWidths[index],
                    )
                    // 단어가 둘이면 첫 단어를 정가운데가 아니라 '두 단어 묶음'이 가운데 오도록 왼쪽에 둔다 —
                    // 정가운데에 두면 양옆 자리가 반씩 나뉘어 둘째 단어를 키울 자리가 모자란다.
                    const pairWidths =
                        words.length === 2 ? [0, 1].map((index) => displayWidths[index] * sizeOf(index, scale)) : []
                    const origin: [number, number] | undefined =
                        pairWidths.length === 2
                            ? [
                                  Math.round(
                                      Math.max(
                                          pairWidths[0] / 2,
                                          (width - pairWidths[0] - pairWidths[1]) / 2 + pairWidths[0] / 2,
                                      ) + originShift,
                                  ),
                                  Math.round(height / 2),
                              ]
                            : undefined
                    renderWordCloud(target, {
                        // [화면 글자, 글자 크기(px), 단어 순번] — 순번으로 원래 단어 · 색을 찾는다.
                        list: words.map((_, index) => [displayTexts[index], sizeOf(index, scale), index]),
                        backgroundColor: 'transparent',
                        clearCanvas: true,
                        color: (text) => wordColors[Math.max(0, displayTexts.indexOf(text))] ?? palette[0],
                        fontFamily,
                        fontWeight: 700,
                        gridSize,
                        minSize: 0,
                        rotateRatio: 0,
                        shuffle: false,
                        shape: 'square',
                        origin,
                        // 영역 가로세로 비율대로 펼친다 — 세로가 먼저 차면 더 납작하게(flatten).
                        ellipticity: (height / width) * flatten,
                        // 들어가지 않는 단어는 줄여 넣지 않고 빠진 채로 끝낸다 — 빠진 단어가 있으면 위에서 전체를 줄여 다시 그린다.
                        shrinkToFit: false,
                        drawOutOfBound: false,
                        wait: 0,
                        weightFactor: (size) => size,
                        hover: (item, _dimension, event) => {
                            target.style.cursor = item ? 'pointer' : ''
                            const index = item ? item[2] : undefined
                            const word = typeof index === 'number' ? words[index] : undefined
                            if (!word || !event || !containerRef.current) {
                                setTooltip(null)
                                return
                            }
                            const containerRect = containerRef.current.getBoundingClientRect()
                            const x = event.clientX - containerRect.left
                            const y = event.clientY - containerRect.top
                            const edge = containerRect.width * TOOLTIP_EDGE_RATIO
                            // 툴팁은 늘 전체 단어 — 말줄임으로 줄여 그린 단어도 여기서 끝까지 읽힌다.
                            setTooltip({
                                text: word.text,
                                weight: word.weight,
                                x,
                                y,
                                align: x < edge ? 'start' : x > containerRect.width - edge ? 'end' : 'center',
                                side: y < TOOLTIP_TOP_SPACE ? 'bottom' : 'top',
                            })
                        },
                    })
                }
                // 같은 단어 · 같은 크기로 맞춘 적이 있으면 그 결과로 한 번에 그린다(맞춤 반복 없음).
                cacheKey = fitCacheKey(words, width, height)
                const cached = fitCache.get(cacheKey)
                if (cached) {
                    sizeRatio = cached.sizeRatio
                    flatten = cached.flatten
                    gridSize = cached.gridSize
                    originShift = cached.originShift
                    isCentered = true
                    isFinalPaint = true
                    paint(cached.scale)
                    return
                }
                paint(Math.min(Math.sqrt((width * height * FILL_RATIO) / (unitArea || 1)), maxScale))
            }

            const observer = new ResizeObserver(() => {
                cancelAnimationFrame(resizeFrame)
                resizeFrame = requestAnimationFrame(draw)
            })
            if (canvas.parentElement) observer.observe(canvas.parentElement)
            draw()

            return () => {
                observer.disconnect()
                canvas.removeEventListener('wordclouddrawn', handleWordDrawn)
                canvas.removeEventListener('wordcloudstop', handleRendered)
                stopThisCloud()
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
                data-chart-reveal=""
                ref={canvasRef}
                role="img"
                aria-label={ariaLabel}
                aria-hidden={isLoading}
                // 캔버스는 상자 위에 겹쳐 둔다(absolute) — 흐름 안에 두면 캔버스의 그린 높이가 상자를 키우고, 커진 상자에 맞춰 다시
                // 그리며 끝없이 길어진다(높이를 정하지 않고 min-h · flex-1 로 늘리는 사용처). 상자 높이는 사용처 className 이 정한다.
                // 다 그려지면 떠오르며 나타난다(문서 설정에 따라 — chart-reveal.tsx).
                className={cn(
                    'absolute inset-0 size-full',
                    isLoading ? 'invisible' : animate && 'motion-safe:animate-chart-rise',
                )}
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
            {/* 모든 단어를 읽는다 — 말줄임으로 줄여 그린 단어도 전체 이름으로. */}
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
