'use client'

// 'use client' — 차트가 화면에 들어왔는지 IntersectionObserver 로 본다.
import {createContext, Fragment, useContext, useEffect, useRef, useState, type ReactNode} from 'react'

// 차트 등장 장치 — 보고서 차트를 "스크롤해서 보일 때" 카드 단위로 하나씩 움직이게 한다.
//
// 쓰는 법
//   1. 문서를 <ChartRevealProvider mode="reveal"> 로 감싼다('off' 면 모든 차트가 움직임 없이 바로 그려진다).
//   2. 카드를 <ChartReveal> 로 감싼다(보고서 카드 Card 가 이미 감싼다 — innovation-growth-report-parts.tsx).
//   3. 차트는 animate 기본값을 useChartAnimation() 으로 읽는다. Provider 가 없는 화면(가이드 등)에서는 true 라 바로 움직인다.
//      커스텀 차트는 움직이는 요소에 data-chart-reveal 을 달고 motion-safe:animate-chart-* 를 animate 일 때만 붙인다.
//
// 동작
//   · 카드가 화면에 들어오면(안의 첫 차트 위 끝이 화면 85% 선 안) 안쪽을 key 로 다시 그려 animate=true 로 처음 그려지듯 움직인다.
//     보이기 전에는 animate=false 로 그려 두되 차트 요소만 숨긴다(data-chart-pending · globals.css) — 표 · 글은 보인다.
//   · 같은 순간에 보인 카드들은 문서 순서로 줄을 서서 앞 카드의 움직임(CHART_ANIMATION_MS)이 끝난 뒤 하나씩 시작한다.
//   · 동작 줄이기 설정(prefers-reduced-motion)이면 움직임 없이 그대로 보인다[6.3.1].
// [프론트엔드 연동] 데이터가 바뀌어 차트를 다시 그려도 손댈 것이 없다 — 보인 뒤에는 늘 animate=true 다.

type ChartRevealMode = 'reveal' | 'off'

// null = Provider 없음(보고서 밖 화면) → 기존처럼 바로 움직인다.
const ChartRevealModeContext = createContext<ChartRevealMode | null>(null)
const ChartRevealedContext = createContext(false)

// 카드가 스크롤되는 동안 자주 돌아보게 하는 문턱(0 · 0.05 · … · 1) — 카드가 아니라 그 안 차트의 위치로 판단하기 때문이다.
const REVEAL_THRESHOLDS = Array.from({length: 21}, (_, index) => index / 20)
// 화면 위쪽으로 이만큼을 '보인 것'으로 친다 — 빠르게 스크롤해 상자를 건너뛰어도(보이기 전 → 지나간 뒤) 숨긴 채 남지 않게.
const REVEAL_ROOT_MARGIN = '10000px 0px 0px 0px'
// 차트의 위 끝이 화면 높이의 이 비율 안으로 들어오면 시작한다 — 카드 위쪽(표 등)만 보일 때 미리 움직여 버리지 않게.
const REVEAL_VIEWPORT_RATIO = 0.85
// 카드 안에서 '차트'로 보는 요소 — recharts 상자(data-slot="chart")와 움직이는 커스텀 차트가 단 data-chart-reveal.
// 첫 번째 것의 위치로 시작 시점을 정하고, 보이기 전에는 이 요소들만 숨긴다(표 · 글은 그대로 보인다 — globals.css 의 규칙).
const CHART_SELECTOR = '[data-slot="chart"], [data-chart-reveal]'

// 차트가 움직이는 시간(ms) — 모든 차트가 같다. recharts 차트는 animationDuration 으로 받고, 커스텀 차트는 globals.css 의
// --animate-chart-* 가 같은 값이다. 바꾸면 globals.css 와 모션 가이드(component-guide/motion)도 같이 고친다.
const CHART_ANIMATION_MS = 600

// 등장 줄 — 같은 프레임에 보인 카드들을 모아 문서 순서로 세운 뒤, 앞 카드의 움직임이 끝나는 시각에 하나씩 보낸다.
// 한참 뒤에 보이는 카드는 기다리지 않고 바로 간다. 대기 중 사라진 카드(탭 전환)는 scheduleReveal 이 돌려준 함수로 줄에서 뺀다.
type RevealRequest = {target: Element; reveal: () => void; timer?: number}
// 다음 카드가 시작할 수 있는 가장 이른 시각(performance.now 기준).
let nextRevealAt = 0
let waiting: RevealRequest[] = []
let flushTimer: number | undefined
const flushReveals = () => {
    flushTimer = undefined
    const queued = waiting.sort((a, b) =>
        a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
    waiting = []
    queued.forEach((request) => {
        const now = performance.now()
        const at = Math.max(now, nextRevealAt)
        nextRevealAt = at + CHART_ANIMATION_MS
        request.timer = window.setTimeout(request.reveal, at - now)
    })
}
const scheduleReveal = (request: RevealRequest) => {
    waiting.push(request)
    flushTimer ??= window.setTimeout(flushReveals)

    return () => {
        waiting = waiting.filter((queued) => queued !== request)
        window.clearTimeout(request.timer)
    }
}

// 차트가 화면에 들어왔는지 — 위 끝이 화면 아래쪽 문턱을 넘었거나(들어옴), 이미 위로 지나갔거나('passed').
// 지나간 차트는 보이지 않으니 차례를 기다리지 않고 바로 풀어 준다 — 빠르게 넘긴 카드들이 줄을 길게 만들지 않게.
const chartViewState = (chart: Element): 'out' | 'in' | 'passed' => {
    const rect = chart.getBoundingClientRect()
    if (rect.bottom < 0) return 'passed'

    return rect.top <= window.innerHeight * REVEAL_VIEWPORT_RATIO ? 'in' : 'out'
}
const isOnScreen = (element: Element) => {
    const rect = element.getBoundingClientRect()

    return rect.bottom > 0 && rect.top < window.innerHeight
}

// 아직 안 보인 카드들의 명부 — 어떤 카드가 줄에 설 때, 문서에서 그보다 앞서면서 화면에 걸쳐 있는 카드를 먼저 줄에 넣는다.
// 나란한 카드(그리드)는 차트 높이가 조금씩 달라 뒤 카드가 먼저 문턱을 넘을 수 있는데, 그래도 등장은 문서 순서를 지키게.
type PendingReveal = {target: Element; begin: () => void}
const pendingReveals = new Set<PendingReveal>()
const beginEarlierOnScreen = (target: Element) => {
    pendingReveals.forEach((pending) => {
        const isEarlier = Boolean(pending.target.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
        if (isEarlier && isOnScreen(pending.target)) pending.begin()
    })
}

const ChartRevealProvider = ({mode, children}: {mode: ChartRevealMode; children: ReactNode}) => (
    <ChartRevealModeContext.Provider value={mode}>{children}</ChartRevealModeContext.Provider>
)

// 감싼 자리는 display: contents 라 레이아웃에 끼지 않는다(카드 안 flex 간격을 깨지 않는다).
// 그래서 보이는지는 자기 자신이 아니라 부모 상자(카드)로 재되, 시작 시점은 카드 안 첫 차트의 위치로 정한다(표가 위에 있는 카드).
// 상태 — pending: 아직 안 보임(정지 상태를 숨겨 둠) · revealed: 보여서 움직이는 중 · static: 움직이지 않고 그대로 보임
//        (reveal 방식이 아니거나 동작 줄이기 설정).
type RevealStatus = 'pending' | 'revealed' | 'static'

const ChartReveal = ({children}: {children: ReactNode}) => {
    const mode = useContext(ChartRevealModeContext)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState<RevealStatus>(mode === 'reveal' ? 'pending' : 'static')

    useEffect(() => {
        const target = anchorRef.current?.parentElement
        if (mode !== 'reveal' || !target) return
        const isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let cancelReveal: (() => void) | undefined
        // 줄에 선다 — 관찰을 멈추고 명부에서 빠진다. 앞선 카드가 뒤 카드 때문에 불릴 때도 이 길로 온다.
        const begin = () => {
            observer.disconnect()
            pendingReveals.delete(pending)
            cancelReveal = scheduleReveal({target, reveal: () => setStatus('revealed')})
        }
        const pending: PendingReveal = {target, begin}
        const observer = new IntersectionObserver(
            (entries) => {
                // 차트는 그때그때 찾는다 — 화면이 붙기 전에는 스켈레톤이 그려져 있어 미리 찾아 두면 차트가 아니다.
                const chart = target.querySelector(CHART_SELECTOR) ?? target
                const viewState = chartViewState(chart)
                if (!entries.some((entry) => entry.isIntersecting) || viewState === 'out') return
                // 동작 줄이기 설정이면 줄을 설 이유가 없다 — 움직임 없이 그대로 보인다.
                if (isMotionReduced) {
                    observer.disconnect()
                    pendingReveals.delete(pending)
                    setStatus('static')
                    return
                }
                // 이미 지나간 차트는 보이지 않으니 줄을 서지 않고 바로 푼다.
                if (viewState === 'passed') {
                    observer.disconnect()
                    pendingReveals.delete(pending)
                    setStatus('revealed')
                    return
                }
                beginEarlierOnScreen(target)
                begin()
            },
            {threshold: REVEAL_THRESHOLDS, rootMargin: REVEAL_ROOT_MARGIN},
        )
        pendingReveals.add(pending)
        observer.observe(target)

        return () => {
            observer.disconnect()
            pendingReveals.delete(pending)
            cancelReveal?.()
        }
    }, [mode])

    return (
        // data-chart-pending — 보이기 전에는 안쪽의 차트 요소만 숨긴다(globals.css). display: contents 라 레이아웃에는 끼지 않는다.
        <div ref={anchorRef} className="contents" data-chart-pending={status === 'pending' ? '' : undefined}>
            <ChartRevealedContext.Provider value={status === 'revealed'}>
                <Fragment key={status}>{children}</Fragment>
            </ChartRevealedContext.Provider>
        </div>
    )
}

// 차트의 animate 기본값 — Provider 없음: true / 'off': false / 'reveal': 감싼 ChartReveal 이 보인 뒤 true.
const useChartAnimation = () => {
    const mode = useContext(ChartRevealModeContext)
    const isRevealed = useContext(ChartRevealedContext)
    if (mode === null) return true
    if (mode === 'off') return false

    return isRevealed
}

export {CHART_ANIMATION_MS, ChartReveal, ChartRevealProvider, useChartAnimation}
export type {ChartRevealMode}
