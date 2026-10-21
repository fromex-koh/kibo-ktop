'use client'

// 'use client' — 줄 수는 글꼴이 그려진 뒤 브라우저에서 재야 정확하다(글자 폭 어림은 굵은 한글에서 어긋난다).
import {createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ReactNode} from 'react'
import {cn} from '@/lib/utils'
import {KBX_FIT_TEXT_SIZES} from '@/content/service/k-bigx-print-measure'

// 줄 수 상한 글자(KbxFitText) — 원래 크기로 maxLines 줄까지는 그대로, 넘으면 원래 크기 maxLines 줄 높이에 들어갈 때까지
// 글자를 한 단계씩 줄인다(KBX_FIT_TEXT_SIZES 중 원래보다 작은 크기, 최소 12px). 줄인 글자는 같은 높이에 줄이 더 들어갈 수 있다.
// 12px 로도 넘치면 clampWhenFull 이면 maxLines 줄에서 말줄임, 아니면 높이가 는다.
// 쓰는 곳: 기업현황 개요 · 진단브리핑 기업 정보(KbxFitValue, 2줄) · 특허 출원번호 · 출원일(2줄) · 정부 R&D 담당자(1줄).
// 크기 단계(KBX_FIT_TEXT_SIZES)는 기업현황 첫 쪽 높이 어림(k-bigx-print-report.ts)과 같은 값을 쓴다.
const FIT_TEXT_CLASSES: Record<(typeof KBX_FIT_TEXT_SIZES)[number], string> = {
    24: 'kbx-text-24',
    23: 'kbx-text-23',
    22: 'kbx-text-22',
    21: 'kbx-text-21',
    20: 'kbx-text-20',
    19: 'kbx-text-19',
    18: 'kbx-text-18',
    17: 'kbx-text-17',
    16: 'kbx-text-16',
    14: 'kbx-text-14',
    12: 'kbx-text-12',
}
// line-height: normal 이라 줄 높이를 못 읽을 때 쓰는 비율(Pretendard ≈ 글자 × 1.2).
const NORMAL_LINE_HEIGHT_RATIO = 1.2
const DEFAULT_MAX_LINES = 2
// 높이 비교 여유(px) — 소수점 반올림 오차만 흡수한다.
const HEIGHT_TOLERANCE = 1

type FitTextTag = 'span' | 'div' | 'p' | 'dd' | 'li'

const KbxFitText = ({
    as: Tag = 'span',
    children,
    className,
    maxLines = DEFAULT_MAX_LINES,
    clampWhenFull = false,
}: {
    as?: FitTextTag
    children: ReactNode
    className?: string
    maxLines?: number
    /** 줄인 크기로도 maxLines 줄을 넘으면 그 줄 수에서 말줄임(…)한다. 끄면 작은 글자로 줄이 더 들어간다. */
    clampWhenFull?: boolean
}) => {
    const ref = useRef<HTMLElement | null>(null)
    // 태그가 바뀌어도 같은 참조를 쓰도록 콜백으로 받는다.
    const setRef = useCallback((node: HTMLElement | null) => {
        ref.current = node
    }, [])
    // 원래 글자 크기 · 줄 높이(px) — 처음(줄이기 전) 잰 값. 줄일 단계는 이보다 작은 크기들이다.
    const [base, setBase] = useState<{size: number; lineHeight: number} | null>(null)
    const [step, setStep] = useState(0)
    const [isClamped, setIsClamped] = useState(false)

    const steps = base ? KBX_FIT_TEXT_SIZES.filter((size) => size < base.size) : []
    const size = step ? steps[step - 1] : undefined

    // 높이를 재 원래 크기 maxLines 줄 높이를 넘으면 한 단계 줄인다 — 줄인 뒤 다시 그려지면 이 함수가 또 불려 맞을 때까지 이어진다.
    // offsetHeight 는 확인 화면의 용지 축소(transform)와 관계없는 원래 높이다.
    const fit = useCallback(() => {
        const element = ref.current
        if (!element) return
        if (!base) {
            const style = getComputedStyle(element)
            const fontSize = parseFloat(style.fontSize)
            const lineHeight = parseFloat(style.lineHeight) || fontSize * NORMAL_LINE_HEIGHT_RATIO
            // 이미 값이 있으면 두지 않는다 — 늦게 불린 측정이 줄인 크기를 원래 크기로 덮어쓰지 않게.
            setBase((current) => current ?? {size: fontSize, lineHeight})
            return
        }
        const isOver = element.offsetHeight > base.lineHeight * maxLines + HEIGHT_TOLERANCE
        if (isOver && step < steps.length) {
            setStep(step + 1)
            return
        }
        // 줄인 크기로 maxLines 줄을 넘으면(작은 글자는 같은 높이에 줄이 더 들어간다) 그 줄 수에서 말줄임한다.
        if (!clampWhenFull || isClamped) return
        const style = getComputedStyle(element)
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * NORMAL_LINE_HEIGHT_RATIO
        if (element.offsetHeight > lineHeight * maxLines + HEIGHT_TOLERANCE) setIsClamped(true)
    }, [base, maxLines, step, steps.length, clampWhenFull, isClamped])

    // 웹 글꼴이 늦게 들어오면 높이가 바뀔 수 있어 한 번 더 잰다 — 그때의 최신 함수로.
    const latestFit = useRef(fit)
    useLayoutEffect(() => {
        latestFit.current = fit
        fit()
    }, [fit, children])
    useLayoutEffect(() => {
        document.fonts?.ready.then(() => latestFit.current())
    }, [])

    return (
        <Tag
            ref={setRef}
            className={cn(
                className,
                size ? FIT_TEXT_CLASSES[size] : undefined,
                isClamped ? LINE_CLAMP_CLASSES[maxLines] : undefined,
            )}
        >
            {children}
        </Tag>
    )
}

// 이름: 값 목록의 값 칸(dd) — 2줄까지 그대로, 넘치면 2줄에 들어갈 때까지 줄이고 그래도 넘치면 2줄에서 말줄임.
const KbxFitValue = ({children, className}: {children: ReactNode; className?: string}) => (
    <KbxFitText as="dd" className={className} clampWhenFull>
        {children}
    </KbxFitText>
)

// 넘칠 때만 말줄임하는 영역(KbxClampArea) — 안의 글이 영역 높이를 넘으면 줄 수가 가장 많은 글 묶음(KbxClampText id)을
// 한 줄 줄여 말줄임(…)하고, 다시 재서 넘치면 또 반복한다. 넘치지 않으면 그대로다(글자 크기는 바꾸지 않는다).
//   · 조건: 부모가 flex 세로이고 이 영역이 쪽 남은 높이만 차지해야 한다(min-h-0).
//   · 쪽 크기 · 옆 블록(차트 등) 높이 · 웹 글꼴이 바뀌면 처음부터 다시 맞춘다.
//   · 모두 한 줄까지 줄여도 넘치면 영역 아래쪽이 잘린다(overflow-hidden). 영역 밖 블록은 영향받지 않는다.
// 쓰는 곳: 특허기술 분석(특허 개요 · 판단 근거).
type ClampItem = {id: string; element: HTMLElement; lineHeight: number}
type ClampAreaValue = {clamps: Readonly<Record<string, number>>; register: (item: ClampItem) => () => void}
const ClampAreaContext = createContext<ClampAreaValue | null>(null)

// 말줄임 줄 수 클래스(Tailwind 가 찾을 수 있게 전체 이름으로 둔다). 7줄 이상인 글은 처음 줄일 때 바로 6줄로 맞춘다.
const LINE_CLAMP_CLASSES: Readonly<Record<number, string>> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
}
const MAX_CLAMP_LINES = 6

// 묶음의 줄 수 — 묶음 글 높이를 줄 높이로 나눠 반올림한다(문단 사이 간격은 반올림에 묻힌다).
const clampLines = (items: readonly ClampItem[]) =>
    Math.max(...items.map((item) => Math.round(item.element.offsetHeight / item.lineHeight)))

const KbxClampArea = ({children, className}: {children: ReactNode; className?: string}) => {
    const ref = useRef<HTMLDivElement>(null)
    const items = useRef(new Map<HTMLElement, ClampItem>())
    const [clamps, setClamps] = useState<Readonly<Record<string, number>>>({})

    const register = useCallback((item: ClampItem) => {
        items.current.set(item.element, item)
        return () => {
            items.current.delete(item.element)
        }
    }, [])

    // 넘치면 두 줄 이상인 묶음 중 줄 수가 가장 많은 것 하나를 한 줄 줄인다 — 다시 그려지면 또 불려 맞을 때까지 이어진다.
    const fit = useCallback(() => {
        const element = ref.current
        if (!element || element.scrollHeight <= element.clientHeight) return
        const groups = Map.groupBy(items.current.values(), (item) => item.id)
        const longest = [...groups]
            .map(([id, group]) => ({id, lines: clampLines(group)}))
            .filter((candidate) => candidate.lines > 1)
            .reduce<{id: string; lines: number} | null>(
                (best, candidate) => (!best || candidate.lines > best.lines ? candidate : best),
                null,
            )
        if (longest) setClamps({...clamps, [longest.id]: Math.min(longest.lines - 1, MAX_CLAMP_LINES)})
    }, [clamps])

    useLayoutEffect(fit, [fit, children])

    // 쪽 크기 · 옆 블록 높이 · 웹 글꼴이 바뀌면 처음부터 다시 맞춘다. 영역 자신은 보지 않는다(줄이면 안의 높이가 바뀌어 끝없이 돈다).
    useLayoutEffect(() => {
        const element = ref.current
        const parent = element?.parentElement
        if (!element || !parent) return
        const reset = () => setClamps({})
        const observer = new ResizeObserver(reset)
        observer.observe(parent)
        Array.from(parent.children)
            .filter((child) => child !== element)
            .map((child) => observer.observe(child))
        document.fonts?.ready.then(reset)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={ref} className={cn('min-h-0 overflow-hidden', className)}>
            <ClampAreaContext.Provider value={{clamps, register}}>{children}</ClampAreaContext.Provider>
        </div>
    )
}

// KbxClampArea 안의 말줄임할 수 있는 글 — 같은 id 끼리 한 묶음으로 함께 줄어든다. 문단이 여럿이면 이 요소가 문단들을 감싸고
// (사이 간격은 space-y-*), 말줄임 줄 수는 문단을 이어서 센다. 줄면 line-clamp 클래스가 붙어 display 가 바뀌므로 flex 를 쓰지 않는다.
const KbxClampText = ({
    id,
    as: Tag = 'div',
    children,
    className,
}: {
    id: string
    as?: FitTextTag
    children: ReactNode
    className?: string
}) => {
    const area = useContext(ClampAreaContext)
    const register = area?.register
    const ref = useRef<HTMLElement | null>(null)
    const setRef = useCallback((node: HTMLElement | null) => {
        ref.current = node
    }, [])

    useLayoutEffect(() => {
        const element = ref.current
        if (!element || !register) return
        const style = getComputedStyle(element)
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * NORMAL_LINE_HEIGHT_RATIO
        return register({id, element, lineHeight})
    }, [id, register])

    const lines = area?.clamps[id]

    return (
        <Tag ref={setRef} className={cn(className, lines ? LINE_CLAMP_CLASSES[lines] : undefined)}>
            {children}
        </Tag>
    )
}

export {KbxClampArea, KbxClampText, KbxFitText, KbxFitValue}
