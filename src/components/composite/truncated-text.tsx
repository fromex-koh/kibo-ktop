'use client'

import {useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactElement} from 'react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {cn} from '@/lib/utils'

// 말줄임 글 — lines 줄을 넘으면 '…'로 자르고, 실제로 잘렸을 때만 마우스를 올리면 전체 글을 툴팁으로 보인다.
// 잘리지 않은 글은 툴팁 · 포커스 없이 그냥 글이다.
//
// 여는 방법: PC 는 마우스 올리기 · Tab 초점(Radix 기본), 모바일 · 태블릿은 탭(다시 탭하거나 바깥을 누르면 닫힘).
// Radix Tooltip 은 터치를 일부러 무시한다(누르면 닫기 · 손가락 떼면 닫기). 라이브러리 · ui 셸은 고치지 않고,
// 이 파일에서 터치일 때만 그 기본 동작을 preventDefault 로 건너뛰고 열림 상태(isOpen)를 직접 바꾼다.
//
// 접근성: 잘린 글은 Tab 으로도 초점을 받아 툴팁이 열린다[6.1.1]. 말줄임은 화면에서만 자르므로
// 스크린리더는 원래부터 전체 글을 읽는다.
// 화면 폭이 바뀌면(ResizeObserver) 다시 잰다 — 넓어져 다 보이면 툴팁을 끈다.
// suffix(예: ')') 를 주면 잘려도 그 글을 끝에 남긴다 — '(한국전자통신연구…)'.
//
// 글을 직접 자르는 곳(차트 축 이름처럼 SVG 글자라 줄 수로 자를 수 없는 곳)은 TruncationTooltip 만 감싼다 —
// 잘렸는지는 그쪽이 정하고, 여닫는 방법(마우스 · 터치)은 같다.

// 한 줄은 줄바꿈 없이 칸 폭을 꽉 채운 뒤 '…'(truncate) — line-clamp-1 은 낱말 끝에서 줄을 바꾼 뒤 잘라 뒤에 빈 자리가 남는다.
const LINE_CLAMP_CLASS = {1: 'block truncate', 2: 'line-clamp-2', 3: 'line-clamp-3'} as const

type TruncationTooltipProps = {
    /** 툴팁에 보일 전체 글. */
    content: string
    /** 잘렸을 때만 툴팁이 열린다. */
    isTruncated: boolean
    /** 툴팁을 여는 요소(글 하나) — ref · 이벤트를 받을 수 있어야 한다(span · SVG text 등). */
    children: ReactElement
}

const TruncationTooltip = ({content, isTruncated, children}: TruncationTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false)
    // 터치로 누른 순간의 열림 상태 — 탭(click)에서 반대로 바꾼다.
    const touchStartOpenRef = useRef<boolean | null>(null)

    // 터치일 때만 Radix 기본 동작(누르면 닫기 · 떼면 닫기 · 탭하면 닫기)을 건너뛴다. 마우스 · 키보드는 그대로.
    const handlePointerDown = (event: PointerEvent<Element>) => {
        if (event.pointerType !== 'touch') return
        touchStartOpenRef.current = isOpen
        event.preventDefault()
    }
    const handlePointerLeave = (event: PointerEvent<Element>) => {
        if (event.pointerType === 'touch') event.preventDefault()
    }
    const handleClick = (event: MouseEvent<Element>) => {
        const wasOpen = touchStartOpenRef.current
        if (wasOpen === null) return
        touchStartOpenRef.current = null
        event.preventDefault()
        setIsOpen(!wasOpen)
    }

    // 툴팁 틀은 늘 두고 잘렸을 때만 열리게 한다 — 틀을 붙였다 떼면 글 요소가 새로 만들어져 잰 요소와 달라진다.
    return (
        // 툴팁은 글 바로 위에 떠서 이웃 줄(범례 · 표의 위 칸)을 덮는다 — 마우스가 툴팁 위에 머물러도 열려 있게 하면(hoverable)
        // 덮인 이웃 줄에 마우스가 닿지 않는다. 글에서 벗어나면 바로 닫고(disableHoverableContent), 툴팁은 마우스를 받지 않는다.
        <TooltipProvider disableHoverableContent>
            <Tooltip open={isTruncated && isOpen} onOpenChange={setIsOpen}>
                <TooltipTrigger
                    asChild
                    onPointerDown={handlePointerDown}
                    onPointerLeave={handlePointerLeave}
                    onClick={handleClick}
                >
                    {children}
                </TooltipTrigger>
                {/* 셸 기본 폭 상한(max-w-xs)은 그대로 — 긴 이름은 툴팁 안에서 줄을 바꾼다. 띄어 쓴 글은 낱말 단위,
                    띄어쓰기 없는 긴 이름은 글자 단위로 바꾼다(wrap-anywhere 가 없으면 상자 밖으로 넘친다 —
                    띄어쓰기 없는 글에 break-keep 을 걸면 닫는 괄호만 다음 줄로 떨어질 수 있어 break-normal). */}
                <TooltipContent
                    // 위치 상자도 마우스를 받지 않게 하는 표시(globals.css § 5).
                    data-truncation-tooltip=""
                    className={cn(
                        'z-tooltip pointer-events-none wrap-anywhere',
                        content.includes(' ') ? 'break-keep' : 'break-normal',
                    )}
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

type TruncatedTextProps = {
    children: string
    /** 보이는 최대 줄 수(1~3). 기본 1. */
    lines?: keyof typeof LINE_CLAMP_CLASS
    /**
     * 잘려도 끝에 늘 남길 글(예: 닫는 괄호 ')'). children 이 이 글로 끝나면, 잘렸을 때 '…' 뒤에 붙여
     * '(한국전자통신연구…)' 처럼 보인다. 없으면 줄 끝에 '…' 만 붙는다.
     */
    suffix?: string
    /**
     * 잘렸을 때 Tab 초점을 받을지. 기본 true. 그림(role="img") · aria-hidden 영역 안의 글처럼 초점을 두면 안 되는 곳은
     * false — 마우스 올리기 · 탭으로만 툴팁을 열고, 전체 글은 그림의 이름(aria-label)이 읽어 준다[8.1.1].
     */
    isFocusable?: boolean
    className?: string
}

const ELLIPSIS = '…'
// 한 줄 글 폭 비교의 여유(px) — 소수점 아래 계산 차이로 다 보이는 글을 잘렸다고 보지 않게.
const WIDTH_TOLERANCE = 0.1

// suffix 를 남기며 자를 때 — lines 줄 안에 들어가는 가장 긴 앞부분을 찾아 '앞부분…suffix' 로 만든다.
// 같은 폭 · 글꼴의 보이지 않는 측정용 글 상자(probe)에 넣어 높이로 판단한다(화면의 글은 건드리지 않는다).
const fitWithSuffix = (element: HTMLElement, text: string, suffix: string, lines: number) => {
    const probe = document.createElement('span')
    probe.className = element.className
    probe.style.cssText = `position:absolute;visibility:hidden;display:block;-webkit-line-clamp:unset;overflow:visible;width:${element.clientWidth}px`
    element.parentElement?.append(probe)
    const limit = parseFloat(getComputedStyle(element).lineHeight) * lines + 1
    const fits = (value: string) => {
        probe.textContent = value
        return probe.scrollHeight <= limit
    }
    const base = text.endsWith(suffix) ? text.slice(0, -suffix.length) : text
    const isFit = fits(text)
    // 들어가는 가장 긴 앞부분 길이 — 이분 탐색(줄 수가 늘면 길이만 늘어난다).
    const search = (low: number, high: number): number => {
        if (low >= high) return low
        const middle = Math.ceil((low + high) / 2)
        return fits(`${base.slice(0, middle).trimEnd()}${ELLIPSIS}${suffix}`)
            ? search(middle, high)
            : search(low, middle - 1)
    }
    const shortened = isFit ? text : `${base.slice(0, search(0, base.length)).trimEnd()}${ELLIPSIS}${suffix}`
    probe.remove()
    return {isTruncated: !isFit, text: shortened}
}

const TruncatedText = ({children, lines = 1, suffix, isFocusable = true, className}: TruncatedTextProps) => {
    const textRef = useRef<HTMLSpanElement>(null)
    const [isTruncated, setIsTruncated] = useState(false)
    // suffix 로 줄인 글 — 잘리지 않았거나 suffix 가 없으면 children 그대로.
    const [displayText, setDisplayText] = useState(children)

    useEffect(() => {
        const element = textRef.current
        if (!element) return
        const measure = () => {
            if (suffix) {
                const fitted = fitWithSuffix(element, children, suffix, lines)
                setIsTruncated(fitted.isTruncated)
                setDisplayText(fitted.text)
                return
            }
            // 줄 수로 자르면 넘친 높이(scrollHeight)가 보이는 높이(clientHeight)보다 커진다(1px 은 반올림 오차).
            // 한 줄(truncate)은 글 폭이 상자 폭을 넘는지로 본다 — scrollWidth 는 정수로 반올림돼 1px 미만으로 넘친 글('…' 는
            // 붙는데)을 놓치므로, 글 자체의 폭(Range)을 소수점까지 잰다.
            const textRange = document.createRange()
            textRange.selectNodeContents(element)
            const isWidthOverflow =
                textRange.getBoundingClientRect().width > element.getBoundingClientRect().width + WIDTH_TOLERANCE
            setIsTruncated(element.scrollHeight > element.clientHeight + 1 || isWidthOverflow)
            setDisplayText(children)
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(element)
        // 웹폰트가 늦게 적용되면 글 폭만 바뀌고 상자 크기는 그대로일 수 있다(ResizeObserver 가 모름) — 글꼴을 다 받으면 다시 잰다.
        document.fonts.addEventListener('loadingdone', measure)
        return () => {
            observer.disconnect()
            document.fonts.removeEventListener('loadingdone', measure)
        }
    }, [children, lines, suffix])

    const isShortened = displayText !== children

    return (
        <TruncationTooltip content={children} isTruncated={isTruncated}>
            <span
                ref={textRef}
                // 잘린 글만 초점을 받는다 — 잘리지 않은 글까지 Tab 순서에 넣지 않는다.
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 잘린 글을 키보드로 펼쳐 보기
                tabIndex={isTruncated && isFocusable ? 0 : undefined}
                className={cn(
                    LINE_CLAMP_CLASS[lines],
                    isTruncated && 'outline-ring cursor-default rounded-xs focus-visible:outline-2',
                    // 숨김 글(sr-only · absolute)의 기준을 이 글 상자로 묶는다 — 없으면 표의 가로 스크롤 상자를 벗어나
                    // 페이지 전체 폭을 넓힌다(태블릿에서 페이지 가로 스크롤).
                    isShortened && 'relative',
                    className,
                )}
            >
                {/* suffix 로 줄였으면 보이는 글은 줄인 글, 스크린리더는 전체 글을 읽는다. */}
                {isShortened ? (
                    <>
                        <span aria-hidden="true">{displayText}</span>
                        <span className="sr-only">{children}</span>
                    </>
                ) : (
                    children
                )}
            </span>
        </TruncationTooltip>
    )
}

export {TruncatedText, TruncationTooltip}
export type {TruncatedTextProps, TruncationTooltipProps}
