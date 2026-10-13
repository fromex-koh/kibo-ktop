'use client'

// 'use client' — 차트가 화면에 들어왔는지 IntersectionObserver 로 본다.
import {createContext, Fragment, useContext, useEffect, useRef, useState, type ReactNode} from 'react'

// 차트 등장 장치 — 보고서 차트를 "스크롤해서 보일 때" 카드 단위로 하나씩 움직이게 한다.
//
// 쓰는 법
//   1. 문서를 <ChartRevealProvider mode="reveal"> 로 감싼다('off' 면 모든 차트가 움직임 없이 바로 그려진다).
//   2. 카드를 <ChartReveal> 로 감싼다(보고서 카드 Card 가 이미 감싼다 — innovation-growth-report-parts.tsx).
//      나란한 카드를 동시에 움직이려면 같은 group 을 준다(Card 는 revealGroup prop — 예: Tech-Index 탭의 줄별 카드).
//   3. 차트는 animate 기본값을 useChartAnimation() 으로 읽는다. Provider 가 없는 화면(가이드 등)에서는 true 라 바로 움직인다.
//      커스텀 차트는 움직이는 요소에 data-chart-reveal 을 달고 motion-safe:animate-chart-* 를 animate 일 때만 붙인다.
//
// 동작
//   · 카드 안 첫 차트가 화면에 절반 이상 들어오면 안쪽을 key 로 다시 그려 animate=true 로 처음 그려지듯 움직인다.
//     보이기 전에는 animate=false 로 그려 두되 차트 요소만 숨긴다(data-chart-pending · globals.css) — 표 · 글은 보인다.
//   · 같은 순간에 보인 카드들은 문서 순서로 REVEAL_STAGGER_MS 간격을 두고 이어서 시작한다(앞 카드가 끝날 때까지 기다리지 않는다
//     — 스크롤할 때 뒤 카드가 빈 자리로 오래 남지 않게). group 이 같은 카드는 간격 없이 동시에 시작한다.
//   · 동작 줄이기 설정(prefers-reduced-motion)이면 움직임 없이 그대로 보인다[6.3.1].
//   · 탭처럼 본문을 갈아 끼우는 화면은 mode 를 바꿔 넘긴다 — 처음 보는 탭은 'reveal', 다시 들어간 탭은 'off'
//     (K-BIGx 보고서 문서 innovation-growth-report-document.tsx). mode 는 그 탭에 머무는 동안 바꾸지 않는다.
// [프론트엔드 연동] 데이터가 바뀌어 차트를 다시 그려도 손댈 것이 없다 — 보인 뒤에는 늘 animate=true 다.

type ChartRevealMode = 'reveal' | 'off'

// null = Provider 없음(보고서 밖 화면) → 기존처럼 바로 움직인다.
const ChartRevealModeContext = createContext<ChartRevealMode | null>(null)
const ChartRevealedContext = createContext(false)

// 카드가 스크롤되는 동안 자주 돌아보게 하는 문턱(0 · 0.05 · … · 1) — 카드가 아니라 그 안 차트의 위치로 판단하기 때문이다.
const REVEAL_THRESHOLDS = Array.from({length: 21}, (_, index) => index / 20)
// 화면 위쪽으로 이만큼을 '보인 것'으로 친다 — 빠르게 스크롤해 상자를 건너뛰어도(보이기 전 → 지나간 뒤) 숨긴 채 남지 않게.
const REVEAL_ROOT_MARGIN = '10000px 0px 0px 0px'
// 차트가 이 비율 이상 화면에 보이면 시작한다(차트가 화면보다 크면 화면 높이 기준).
// 가장자리에 조금만 걸친 채 시작하면 사용자가 스크롤해 내려왔을 때 이미 끝나 있다 — 절반은 보여야 움직임을 본다.
// 그 전까지 걸친 부분은 빈 자리로 남지만, 화면 끝이라 스크롤하면 바로 채워진다.
const REVEAL_VISIBLE_RATIO = 0.5
// 카드 안에서 '차트'로 보는 요소 — recharts 상자(data-slot="chart")와 움직이는 커스텀 차트가 단 data-chart-reveal.
// 첫 번째 것의 위치로 시작 시점을 정하고, 보이기 전에는 이 요소들만 숨긴다(표 · 글은 그대로 보인다 — globals.css 의 규칙).
const CHART_SELECTOR = '[data-slot="chart"], [data-chart-reveal]'

// 차트가 움직이는 시간(ms) — 모든 차트가 같다. recharts 차트는 animationDuration 으로 받고, 커스텀 차트는 globals.css 의
// --animate-chart-* 가 같은 값이다. 바꾸면 globals.css 와 모션 가이드(component-guide/motion)도 같이 고친다.
const CHART_ANIMATION_MS = 600
// 같은 순간에 보인 카드끼리 시작 간격(ms) — 순서가 보일 만큼만 띄운다.
const REVEAL_STAGGER_MS = 120

// 등장 줄 — 같은 프레임에 보인 카드들을 모아 문서 순서로 세운 뒤, REVEAL_STAGGER_MS 간격으로 하나씩 보낸다.
// 한참 뒤에 보이는 카드는 기다리지 않고 바로 간다. 대기 중 사라진 카드(탭 전환)는 scheduleReveal 이 돌려준 함수로 줄에서 뺀다.
type RevealRequest = {target: Element; reveal: () => void; group?: string; timer?: number; at?: number}
// 다음 카드가 시작할 수 있는 가장 이른 시각(performance.now 기준).
let nextRevealAt = 0
let waiting: RevealRequest[] = []
// 시각은 정해졌지만 아직 시작하지 않은 카드 — 취소될 때 nextRevealAt 을 다시 계산하는 데 쓴다.
const scheduled = new Set<RevealRequest>()
let flushTimer: number | undefined
const flushReveals = () => {
    flushTimer = undefined
    const queued = waiting.sort((a, b) =>
        a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
    waiting = []
    // 같은 묶음(group)의 카드는 앞선 카드와 같은 시각에 시작한다 — 간격을 한 번만 센다.
    const groupStartAt = new Map<string, number>()
    queued.forEach((request) => {
        const now = performance.now()
        const groupAt = request.group === undefined ? undefined : groupStartAt.get(request.group)
        const at = groupAt ?? Math.max(now, nextRevealAt)
        if (groupAt === undefined) nextRevealAt = at + REVEAL_STAGGER_MS
        if (request.group !== undefined) groupStartAt.set(request.group, at)
        request.at = at
        scheduled.add(request)
        request.timer = window.setTimeout(() => {
            scheduled.delete(request)
            request.reveal()
        }, at - now)
    })
}
const scheduleReveal = (request: RevealRequest) => {
    waiting.push(request)
    flushTimer ??= window.setTimeout(flushReveals)

    return () => {
        waiting = waiting.filter((queued) => queued !== request)
        window.clearTimeout(request.timer)
        // 아직 시작 전이던 카드가 빠지면(탭 전환) 다음 시작 시각을 남은 카드 기준으로 되돌린다 — 그대로 두면 새 탭의
        // 첫 카드가 이전 탭에서 줄 서 있던 시간만큼 늦게 움직인다.
        if (!scheduled.delete(request)) return
        nextRevealAt = Math.max(0, ...[...scheduled].map((queued) => (queued.at ?? 0) + REVEAL_STAGGER_MS))
    }
}

// 차트가 화면에 들어왔는지 — REVEAL_VISIBLE_RATIO 이상 보이거나(들어옴), 이미 위로 지나갔거나('passed').
// 지나간 차트는 보이지 않으니 차례를 기다리지 않고 바로 풀어 준다 — 빠르게 넘긴 카드들이 줄을 길게 만들지 않게.
const chartViewState = (chart: Element): 'out' | 'in' | 'passed' => {
    const rect = chart.getBoundingClientRect()
    if (rect.bottom < 0) return 'passed'
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    const neededHeight = Math.min(rect.height, window.innerHeight) * REVEAL_VISIBLE_RATIO

    return visibleHeight >= neededHeight ? 'in' : 'out'
}
const isOnScreen = (element: Element) => {
    const rect = element.getBoundingClientRect()

    return rect.bottom > 0 && rect.top < window.innerHeight
}

// 아직 안 보인 카드들의 명부 — 어떤 카드가 줄에 설 때, 문서에서 그보다 앞서면서 화면에 걸쳐 있는 카드를 먼저 줄에 넣는다.
// 나란한 카드(그리드)는 차트 높이가 조금씩 달라 뒤 카드가 먼저 문턱을 넘을 수 있는데, 그래도 등장은 문서 순서를 지키게.
type PendingReveal = {target: Element; group?: string; begin: () => void}
const pendingReveals = new Set<PendingReveal>()
const beginEarlierOnScreen = (target: Element) => {
    pendingReveals.forEach((pending) => {
        const isEarlier = Boolean(pending.target.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
        if (isEarlier && isOnScreen(pending.target)) pending.begin()
    })
}

// 같은 묶음의 아직 안 보인 카드를 함께 줄에 세운다 — 나란한 카드의 차트 높이가 달라 한쪽이 먼저 보여도 같이 움직이게.
const beginGroup = (group: string | undefined, self: PendingReveal) => {
    if (group === undefined) return
    pendingReveals.forEach((pending) => {
        if (pending !== self && pending.group === group) pending.begin()
    })
}

const ChartRevealProvider = ({
    mode,
    scope,
    children,
}: {
    mode: ChartRevealMode
    /** 본문이 통째로 바뀌는 단위(예: 탭 id). 바뀌면 등장 순서를 처음부터 센다 — 이전 본문의 카드가 기다리던 · 움직이던
     *  시간만큼 새 본문의 첫 차트가 늦게 움직이지 않게. */
    scope?: string
    children: ReactNode
}) => {
    useEffect(() => {
        nextRevealAt = 0
        waiting = []
        scheduled.forEach((request) => window.clearTimeout(request.timer))
        scheduled.clear()
    }, [scope])

    return <ChartRevealModeContext.Provider value={mode}>{children}</ChartRevealModeContext.Provider>
}

// 감싼 자리는 display: contents 라 레이아웃에 끼지 않는다(카드 안 flex 간격을 깨지 않는다).
// 그래서 보이는지는 자기 자신이 아니라 부모 상자(카드)로 재되, 시작 시점은 카드 안 첫 차트의 위치로 정한다(표가 위에 있는 카드).
// 상태 — pending: 아직 안 보임(정지 상태를 숨겨 둠) · revealed: 보여서 움직이는 중 · static: 움직이지 않고 그대로 보임
//        (reveal 방식이 아니거나 동작 줄이기 설정).
type RevealStatus = 'pending' | 'revealed' | 'static'

const ChartReveal = ({
    group,
    children,
}: {
    /** 묶음 이름 — 같은 이름의 카드는 차례를 기다리지 않고 동시에 움직인다(예: 나란한 두 카드). */
    group?: string
    children: ReactNode
}) => {
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
            cancelReveal = scheduleReveal({target, group, reveal: () => setStatus('revealed')})
        }
        const pending: PendingReveal = {target, group, begin}
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
                beginGroup(group, pending)
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
    }, [group, mode])

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
