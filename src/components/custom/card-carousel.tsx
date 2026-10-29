'use client'

import {ArrowLeft, ArrowRight} from 'lucide-react'
import {type ReactNode, type TransitionEvent, useId, useRef, useState} from 'react'
import {ListMarker} from '@/components/custom/list-marker'
import {cn} from '@/lib/utils'

// 카드 캐러셀(CardCarousel) — 제목 줄(제목 + 이전 · 다음 버튼) 아래로 카드가 가로로 이어지고 한 바퀴 돈다.
// 처음 쓴 곳: 플랫폼 소개 · K-TOP 플랫폼 개요.
//
// 고른 카드는 늘 첫 칸(제목과 같은 왼쪽 선)에 있고, 나머지는 번호 순서대로 뒤따른다(마지막 다음은 처음 — 끝이 없어 버튼이 꺼지지
// 않는다). 고른 카드만 옅은 파랑 면 + 파란 테두리 + 설명 목록이고, 나머지는 파랑 면 + 그림(image)이다.
//   · [다음] — 카드 줄 전체가 한 칸 왼쪽으로 밀리고, 둘째 칸 카드가 첫 칸에 닿으며 고른 카드가 된다. 밀려난 첫 카드는 왼쪽 선에서
//     잘려 사라지고 줄 맨 끝으로 간다.
//   · [이전] — 맨 끝 카드를 첫 칸 앞(보이지 않는 자리)에 붙인 뒤 줄 전체를 한 칸 오른쪽으로 민다.
//   · 카드를 누르면 그 카드가 첫 칸에 올 때까지 같은 방식으로 민다.
// 잔상이 생기지 않게 카드는 늘 한 장씩만 그린다(같은 카드를 두 자리에 두고 겹쳐 바꾸지 않는다). 밀려 나가는 카드는 미는 동안
// 흐려지며 사라지고, [이전]으로 들어오는 카드는 투명하게 시작해 선명해진다. 미는 동안 면 · 글자 색과 설명 ↔ 그림이
// 같은 시간에 함께 바뀌고, 다 민 뒤 순서를 바꿔 원위치(이동 0)로 되돌린다 — 화면은 그대로라 튀지 않는다.
// 움직임: 0.5초 · ease-roll(감속). 동작 줄이기 설정이면 밀지 않고 바로 바꾼다[6.3.1]. 미는 동안 들어온 누름은 무시한다.
//
// 왼쪽 여백: --card-carousel-inset(없으면 그리드 가장자리 여백). 카드 줄은 그 선에서 시작해 오른쪽 끝까지 이어지고, 왼쪽 여백 구간은
// 페이드로 흐려진다(밀려나는 카드가 여백 쪽으로 사라지듯 흐려짐) — 화면 전체 폭으로
// 두고 콘텐츠 왼쪽 끝까지의 거리를 주면 시안처럼 화면 오른쪽 끝까지 이어진다(플랫폼 소개). 카드 안처럼 좁은 곳에서는 0 을 준다.
// 카드 크기: 폭 384(그보다 좁은 화면은 보이는 창 폭 — 모바일은 한 장씩) · 최소 높이 400 · 사이 24 · 라운드 16 · 안쪽 여백 40(모바일 32).
// 제목 줄: md 부터 제목 | 버튼이 한 줄, 모바일은 제목 아래(8)에 버튼.
//
// 접근성: 카드 제목이 버튼이고 aria-expanded 로 설명이 열렸는지 알린다(설명과 aria-controls 로 이어짐)[8.2.1]. 버튼 영역은 카드
// 전체로 넓혀 어디를 눌러도 고른다. 화면에 보이는 순서와 DOM 순서가 같다(돌 때 DOM 도 같이 돈다)[7.3.1]. 이전 · 다음 버튼은 아이콘만
// 있어 aria-label 을 준다[5.1.1]. 그림 · 숨은 설명은 읽지 않는다.

type CardCarouselItem = {
    id: string
    /** 카드 제목. 줄바꿈(\n)은 그대로 줄이 나뉜다. */
    title: string
    /** 고른 카드에 보이는 설명 목록. 비면 고른 카드도 그림을 보여 준다. */
    descriptions: readonly string[]
    /** 고르지 않은 카드의 오른쪽 아래 그림(100 × 100 자리). next/image 에 alt="" 로 넘긴다. */
    image?: ReactNode
}

type CardCarouselProps = {
    /** 제목 줄 왼쪽 제목(h2). 카드 제목은 h3 이다. */
    title: string
    items: readonly CardCarouselItem[]
    /** 처음 고른 카드 순번(0부터). */
    defaultIndex?: number
    className?: string
}

const NUMBER_DIGITS = 2
const formatNumber = (index: number) => String(index + 1).padStart(NUMBER_DIGITS, '0')
// 미는 시간 · 곡선 — 카드 면 · 글자 색, 설명 ↔ 그림도 같은 값으로 바뀌어 한 동작처럼 보인다.
const MOTION_CLASS_NAME = 'duration-500 ease-roll motion-reduce:transition-none'

// 시안: [이전]은 흰 면 + 테두리, [다음]은 짙은 면 — 한 바퀴 돌아 둘 다 늘 누를 수 있다.
const NAV_BUTTON_BASE_CLASS_NAME =
    'border-label-foreground outline-ring focus-visible:outline-ring flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'
const PREV_BUTTON_CLASS_NAME = cn(
    NAV_BUTTON_BASE_CLASS_NAME,
    'bg-background text-label-foreground interactive:hover:bg-muted',
)
const NEXT_BUTTON_CLASS_NAME = cn(
    NAV_BUTTON_BASE_CLASS_NAME,
    'bg-label-foreground text-background interactive:hover:bg-foreground',
)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const nextFrame = (callback: () => void) => requestAnimationFrame(() => requestAnimationFrame(callback))

const CardCarousel = ({title, items, defaultIndex = 0, className}: CardCarouselProps) => {
    const baseId = useId()
    const titleId = `${baseId}-title`
    const count = items.length
    // start — 첫 칸 카드의 순번(그리는 순서의 시작). activeIndex — 고른 카드(미는 동안은 다 민 뒤의 첫 칸 카드).
    const [start, setStart] = useState(defaultIndex)
    const [activeIndex, setActiveIndex] = useState(defaultIndex)
    const [offset, setOffset] = useState(0)
    const [isSliding, setIsSliding] = useState(false)
    // 흐려 둘 카드 — 밀려 나가는 카드(앞으로) · 들어오기 전 카드(뒤로). 왼쪽 여백은 페이드 구간이라 그대로 두면 반쯤 보이다 툭 사라진다.
    const [fadedIndices, setFadedIndices] = useState<readonly number[]>([])
    const trackRef = useRef<HTMLUListElement>(null)
    // 다 민 뒤 첫 칸이 될 순번. null 이면 순서는 이미 바꿔 두었고 원위치로 미는 중이다([이전]).
    const pendingStartRef = useRef<number | null>(null)
    const isBusyRef = useRef(false)

    const wrap = (index: number) => (index + count) % count
    // 한 칸 = 카드 폭 + 사이 간격. 화면 폭에 따라 카드 폭이 달라 누를 때마다 잰다.
    const measureStep = () => {
        const [first, second] = trackRef.current?.children ?? []
        return first && second ? second.getBoundingClientRect().left - first.getBoundingClientRect().left : 0
    }

    const goForward = (steps: number) => {
        if (isBusyRef.current || steps <= 0) return
        const nextStart = wrap(start + steps)
        setActiveIndex(nextStart)
        const step = measureStep()
        // 밀 거리가 없으면(카드 한 장 · 동작 줄이기) 바로 바꾼다 — 움직임이 없으면 transitionend 가 오지 않는다.
        if (!step || prefersReducedMotion()) {
            setStart(nextStart)
            return
        }
        isBusyRef.current = true
        pendingStartRef.current = nextStart
        setFadedIndices(Array.from({length: steps}, (_, slot) => wrap(start + slot)))
        setIsSliding(true)
        setOffset(-steps * step)
    }

    const goBackward = () => {
        if (isBusyRef.current) return
        const nextStart = wrap(start - 1)
        setActiveIndex(nextStart)
        const step = measureStep()
        if (!step || prefersReducedMotion()) {
            setStart(nextStart)
            return
        }
        // 맨 끝 카드를 앞에 붙이고 한 칸 왼쪽(보이지 않는 자리)에서 시작해, 다음 프레임에 원위치로 민다.
        // 붙인 카드는 투명하게 시작해 밀려 들어오며 선명해진다.
        isBusyRef.current = true
        pendingStartRef.current = null
        setIsSliding(false)
        setFadedIndices([nextStart])
        setStart(nextStart)
        setOffset(-step)
        nextFrame(() => {
            setIsSliding(true)
            setFadedIndices([])
            setOffset(0)
        })
    }

    const handleTransitionEnd = (event: TransitionEvent<HTMLUListElement>) => {
        if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
        const pendingStart = pendingStartRef.current
        pendingStartRef.current = null
        // 다 민 뒤 순서를 바꾸고 원위치로 — 같은 프레임에 바뀌어 화면은 그대로다.
        setIsSliding(false)
        setFadedIndices([])
        if (pendingStart !== null) {
            setStart(pendingStart)
            setOffset(0)
        }
        isBusyRef.current = false
    }

    const ordered = Array.from({length: count}, (_, slot) => wrap(start + slot))

    return (
        <section
            aria-labelledby={titleId}
            className={cn('flex flex-col gap-10 [--card-carousel-gutter:var(--ds-grid-margin)]', className)}
        >
            <div className="mx-[var(--card-carousel-inset,var(--card-carousel-gutter))] flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                <h2 id={titleId} className="typo-display-s-bold text-foreground break-keep">
                    {title}
                </h2>
                <div className="flex gap-4">
                    <button
                        type="button"
                        aria-label="이전 항목"
                        onClick={goBackward}
                        className={PREV_BUTTON_CLASS_NAME}
                    >
                        <ArrowLeft aria-hidden="true" className="size-icon-xl" />
                    </button>
                    <button
                        type="button"
                        aria-label="다음 항목"
                        onClick={() => goForward(1)}
                        className={NEXT_BUTTON_CLASS_NAME}
                    >
                        <ArrowRight aria-hidden="true" className="size-icon-xl" />
                    </button>
                </div>
            </div>
            {/* 보이는 창 — 바깥 여백까지 포함해 감싼 영역 끝에서 끝까지. 왼쪽 여백 구간(콘텐츠 선 바깥, --card-carousel-inset)만
                마스크로 투명하게 지워(페이드) 밀려 나가는 카드가 뚝 잘려 보이지 않게 한다(탭 TabsScrollArea 의 가장자리 페이드와
                같은 방식 — 덮개 색이 아니라 카드 자체가 흐려진다). 콘텐츠 선 안의 고른 카드는 흐려지지 않고, 오른쪽 끝은 시안대로
                화면 끝에서 그대로 잘린다. 왼쪽 여백이 0 이면 페이드도 없다. */}
            <div className="overflow-hidden mask-l-from-[calc(100%-var(--card-carousel-inset,var(--card-carousel-gutter)))]">
                <ul
                    ref={trackRef}
                    onTransitionEnd={handleTransitionEnd}
                    // 미는 거리는 카드 폭에 따라 누를 때 재므로 인라인 transform 으로 준다.
                    style={{transform: `translateX(${offset}px)`}}
                    className={cn(
                        'flex gap-6 ps-[var(--card-carousel-inset,var(--card-carousel-gutter))]',
                        isSliding && cn('transition-transform', MOTION_CLASS_NAME),
                    )}
                >
                    {ordered.map((itemIndex, slot) => {
                        const item = items[itemIndex]
                        const isActive = itemIndex === activeIndex
                        const isFaded = fadedIndices.includes(itemIndex)
                        const detailsId = `${baseId}-${item.id}`
                        const hasDescriptions = item.descriptions.length > 0
                        const showsDescriptions = isActive && hasDescriptions

                        return (
                            <li
                                key={item.id}
                                className={cn(
                                    'border-primary relative flex min-h-100 w-[calc(100%-var(--card-carousel-gutter))] max-w-96 shrink-0 flex-col justify-between gap-6 rounded-lg border p-8 md:p-10',
                                    // 면 색 · 흐림은 미는 동안에만 시간을 두고 바뀐다 — 다 민 뒤 순서를 바꿀 때는 바로 바뀌어야 튀지 않는다.
                                    isSliding && cn('transition-[background-color,opacity]', MOTION_CLASS_NAME),
                                    isActive ? 'bg-primary-subtle' : 'bg-primary',
                                    isFaded ? 'opacity-0' : 'opacity-100',
                                )}
                            >
                                <h3>
                                    {/* 카드 전체를 누를 수 있게 버튼 영역을 카드 크기로 넓힌다(after:inset-0). */}
                                    <button
                                        type="button"
                                        aria-expanded={isActive}
                                        aria-controls={detailsId}
                                        onClick={() => goForward(slot)}
                                        className="outline-ring focus-visible:outline-ring flex flex-col items-start gap-4 text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid"
                                    >
                                        <span
                                            className={cn(
                                                'typo-h4-bold transition-colors',
                                                MOTION_CLASS_NAME,
                                                isActive ? 'text-primary-strong' : 'text-primary-foreground',
                                            )}
                                        >
                                            {formatNumber(itemIndex)}
                                        </span>
                                        <span
                                            className={cn(
                                                'typo-h1-bold break-keep whitespace-pre-line transition-colors',
                                                MOTION_CLASS_NAME,
                                                isActive ? 'text-foreground' : 'text-primary-foreground',
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </button>
                                </h3>
                                {/* 설명과 그림은 같은 자리에 겹쳐 두고 함께 사라지고 나타난다(감춘 쪽은 invisible 이라 읽지 않는다). */}
                                <div id={detailsId} className="grid items-end *:col-start-1 *:row-start-1">
                                    {hasDescriptions ? (
                                        <ul
                                            className={cn(
                                                'flex flex-col gap-1 transition-[opacity,visibility]',
                                                MOTION_CLASS_NAME,
                                                showsDescriptions ? 'visible opacity-100' : 'invisible opacity-0',
                                            )}
                                        >
                                            {item.descriptions.map((description) => (
                                                <li
                                                    key={description}
                                                    className="typo-body-xl-regular text-label-foreground flex"
                                                >
                                                    <ListMarker />
                                                    <span className="break-keep">{description}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                    {item.image ? (
                                        <div
                                            aria-hidden="true"
                                            className={cn(
                                                'ms-auto flex size-25 items-center justify-center transition-[opacity,visibility]',
                                                MOTION_CLASS_NAME,
                                                showsDescriptions ? 'invisible opacity-0' : 'visible opacity-100',
                                            )}
                                        >
                                            {item.image}
                                        </div>
                                    ) : null}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export {CardCarousel}
export type {CardCarouselItem, CardCarouselProps}
