'use client'

import {Fragment, useEffect, useRef, useState, type ReactNode} from 'react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {ListMarker} from '@/components/custom/list-marker'
import {Separator} from '@/components/ui/separator'
import {useAutoplayPause} from '@/hooks/use-autoplay-pause'
import {cn} from '@/lib/utils'

// RollingAccordion — 회색 상자 안 아코디언과 옆 그림이 한 쌍이다. 하나만 열리고, 일정 시간마다 다음 항목이 열리며 그림도 바뀐다.
// 쓰는 곳: 플랫폼 소개 > 기술평가 · K-BIGx 보고서 · 탄소중립(택소노미). 본문은 RollingAccordionBody(groups)로 채운다.
//
// 알아둘 점
//   · 자동 전환이 멈출 때 — 아코디언 상자에 마우스 · 터치 · 키보드 포커스가 있을 때[6.2.1], 화면 밖일 때, 동작 줄이기일 때[6.3.1].
//     옆 그림은 꾸밈이라 그 위에서는 멈추지 않는다.
//   · 제목을 누르면 그 항목부터 이어서 넘어간다. 모두 닫으면 다음 차례에 첫 항목부터 연다.
//   · DOM 은 그림이 먼저지만(꾸밈 · alt="") PC 는 그리드 칸으로 상자를 왼쪽에 둔다 — 읽는 순서는 바뀌지 않는다[7.3.1].
//   · PC 는 상자 높이가 그림에 맞춰져 본문이 길면 본문 안에서 스크롤한다 — 키보드로도 스크롤되도록 포커스를 받는다[6.1.1].

/** 항목 하나 — 제목 · 본문 · 옆 그림. */
type RollingAccordionItem = {
    value: string
    title: string
    content: ReactNode
    /** 이 항목이 열렸을 때 옆에 보일 그림(next/image · alt=""). 없으면 그림 칸이 빈다. */
    image?: ReactNode
}

type RollingAccordionProps = {
    items: readonly RollingAccordionItem[]
    /** 다음 항목으로 넘어가는 간격(ms). 기본 3초 — 본문이 짧아(점 2~4줄) 메인페이지 목차(5초)보다 빠르게 넘긴다. */
    interval?: number
    className?: string
}

/** 본문 묶음 — 소제목(heading) · 점 목록(items) · 점 없는 문단(text) 중 있는 것만 차례로 놓인다. */
type RollingAccordionGroup = {heading?: string; items?: readonly string[]; text?: string}

// 본문(시안 아코디언 상세) — 소제목(16 Medium · h4 — 아코디언 제목 h3 아래) + 점 목록(16 Regular · label-foreground).
// 소제목과 목록 · 목록 줄 · 묶음 사이 모두 8. 점 칸 높이는 글의 한 줄 높이(h-lh)에 맞춘다.
// 소제목만 있는 묶음(K-BIGx '기업개요')이나 점 없는 문단(text — K-BIGx 기대효과)도 놓을 수 있다.
// 소제목을 p 로 두면 아코디언 본문 셸의 문단 간격(p:not(:last-child) mb-4)이 붙어 시안보다 16 벌어진다 — 제목 요소로 둔다.
const RollingAccordionBody = ({groups}: {groups: readonly RollingAccordionGroup[]}) => (
    <div className="flex flex-col gap-2">
        {groups.map((group) => (
            <div key={group.heading ?? group.text ?? group.items?.[0]} className="flex flex-col gap-2">
                {group.heading ? <h4 className="typo-body-xl-medium text-foreground">{group.heading}</h4> : null}
                {group.items?.length ? (
                    <ul className="flex flex-col gap-2">
                        {group.items.map((item) => (
                            <li key={item} className="flex">
                                <ListMarker className="[&>span]:bg-rolling-accordion-marker h-lh" />
                                <span className="break-keep">{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : null}
                {group.text ? <p className="break-keep">{group.text}</p> : null}
            </div>
        ))}
    </div>
)

const DEFAULT_INTERVAL_MS = 3000
const VISIBLE_THRESHOLD = 0.3

const RollingAccordion = ({items, interval = DEFAULT_INTERVAL_MS, className}: RollingAccordionProps) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [openValue, setOpenValue] = useState(items[0]?.value ?? '')
    // 그림은 마지막으로 열렸던 항목의 것을 유지한다 — 모두 닫아도 그림 칸이 비지 않는다.
    const [imageValue, setImageValue] = useState(items[0]?.value ?? '')
    const {isPaused: isUserPaused, pauseHandlers} = useAutoplayPause()
    const [isVisible, setIsVisible] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(true)

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sync = () => setPrefersReducedMotion(query.matches)

        sync()
        query.addEventListener('change', sync)
        return () => query.removeEventListener('change', sync)
    }, [])

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry?.isIntersecting ?? false), {
            threshold: VISIBLE_THRESHOLD,
        })
        observer.observe(root)
        return () => observer.disconnect()
    }, [])

    const isPaused = isUserPaused || !isVisible || prefersReducedMotion || items.length < 2

    useEffect(() => {
        if (isPaused) return

        const timer = window.setTimeout(() => {
            const currentIndex = items.findIndex((item) => item.value === openValue)
            const nextValue = items[(currentIndex + 1) % items.length]?.value ?? ''
            setOpenValue(nextValue)
            setImageValue(nextValue)
        }, interval)
        return () => window.clearTimeout(timer)
    }, [isPaused, openValue, items, interval])

    const handleValueChange = (value: string) => {
        setOpenValue(value)
        if (value) setImageValue(value)
    }

    return (
        <div ref={rootRef} className={cn('grid gap-6 xl:grid-cols-12', className)}>
            {/* 그림 — 항목 그림을 한 칸에 겹쳐 두고 열린 항목 것만 서서히 보인다. 시안 비율 690 : 428(세 폭 같음). */}
            <div
                aria-hidden="true"
                className="grid aspect-[345/214] w-full overflow-hidden rounded-lg *:col-start-1 *:row-start-1 xl:col-span-7 xl:col-start-6 xl:row-start-1"
            >
                {items.map((item) => (
                    <div
                        key={item.value}
                        className={cn(
                            'bg-panel-subtle size-full transition-opacity duration-500 ease-out motion-reduce:transition-none [&_img]:size-full [&_img]:object-cover',
                            item.value === imageValue ? 'opacity-100' : 'opacity-0',
                        )}
                    >
                        {item.image}
                    </div>
                ))}
            </div>
            {/* 멈춤(마우스 올림 · 터치 · 키보드 포커스)은 아코디언 상자에만 건다 — 그림은 꾸밈이라 그림 위에서는 멈추지 않는다. */}
            <div
                {...pauseHandlers}
                className="bg-rolling-accordion-surface rounded-lg p-8 md:p-12 xl:col-span-5 xl:col-start-1 xl:row-start-1"
            >
                <Accordion
                    type="single"
                    collapsible
                    value={openValue}
                    onValueChange={handleValueChange}
                    // 항목 사이 16 은 아코디언 기본 간격(gap-4)이 구분선 위아래로 똑같이 준다.
                    className="gap-4"
                >
                    {items.map((item, index) => (
                        <Fragment key={item.value}>
                            {index > 0 ? <Separator /> : null}
                            <AccordionItem value={item.value} className="rounded-none bg-transparent p-0">
                                <AccordionTrigger className="**:data-[slot=accordion-trigger-icon]:size-icon-md items-center">
                                    <span className="typo-title-l-bold group-aria-expanded/accordion-trigger:text-primary-strong transition-colors">
                                        {item.title}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="mt-2 border-t-0 pt-0">
                                    <div
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 스크롤 상자의 키보드 접근
                                        tabIndex={0}
                                        role="group"
                                        aria-label={`${item.title} 내용`}
                                        className="outline-ring focus-visible:outline-2 focus-visible:outline-solid xl:max-h-38 xl:overflow-y-auto"
                                    >
                                        {item.content}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Fragment>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export {RollingAccordion, RollingAccordionBody}
export type {RollingAccordionGroup, RollingAccordionItem, RollingAccordionProps}
