'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {HorizontalScrollArea} from '@/components/composite/horizontal-scroll-area'
import {platformSectionNavLinkClassName} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 섹션 이동 탭 — 히어로 아래에서 사이트 헤더 바로 밑에 붙어(sticky) 따라오고, 지금 보고 있는 섹션을 표시한다(aria-current).
//
// 알아둘 점
//   · 사이트 헤더 높이는 화면 폭 · 로그인 상태마다 달라 클래스로 못 박지 않고 잰다. 잰 값은 감싼 <main> 에
//     --platform-header-h(헤더) · --platform-section-nav-h(이 탭 줄)로 둔다 — 섹션의 scroll-mt 가 이 둘을 써서
//     탭으로 이동했을 때 섹션 제목이 헤더 · 탭 밑에 가리지 않는다(platformSectionVariants).
//   · 현재 섹션 — 화면 위 35% ~ 아래 60% 사이 띠에 들어온 섹션을 고른다. 고른 탭이 가려져 있으면 줄 가운데로 민다.
//   · 탭이 화면보다 넓으면(모바일 · 태블릿) HorizontalScrollArea 가 좌우 화살표 · 넘친 쪽 흐림을 붙인다 — 스와이프 · 화살표로
//     옮겨 고를 수 있다. 넘치지 않으면(PC) 화살표 없이 그대로다.
//   · 이동은 앵커(#id)다 — 부드러운 스크롤 · 제목 포커스는 PlatformAnchorScroll 이 맡고, 뒤로 가기도 그대로 동작한다.
// 쓰는 곳: 플랫폼 소개 5화면(custom/platform-intro.tsx · platform-technology-evaluation.tsx · platform-patent-evaluation.tsx · platform-k-bigx-report.tsx · platform-carbon-neutrality.tsx). 탄소중립은 leading 에 서비스 토글을 붙인다.

type PlatformSectionNavItem = {id: string; label: string}

// 스크롤 감지 띠 — 화면 위 35% 선 ~ 아래 60% 선.
const SPY_ROOT_MARGIN = '-35% 0px -60% 0px'
// 헤더를 못 찾았을 때 쓰는 기본 높이(PC 헤더 112).
const FALLBACK_HEADER_PX = 112

const PlatformSectionNav = ({
    items,
    label = '페이지 내 섹션',
    leading,
}: {
    items: readonly PlatformSectionNavItem[]
    label?: string
    /** 탭 줄 앞에 붙는 것(서비스 토글 등). PC(1024↑): 한 줄에서 왼쪽 · 세로 선 · 오른쪽 탭. 그 아래: 위(꽉 찬 폭) · 아래 탭 두 단. */
    leading?: ReactNode
}) => {
    const navRef = useRef<HTMLElement>(null)
    const listRef = useRef<HTMLOListElement>(null)
    const [currentId, setCurrentId] = useState<string | null>(null)

    // 사이트 헤더 · 이 탭 줄 높이를 <main> 에 둔다.
    useEffect(() => {
        const nav = navRef.current
        const main = nav?.closest('main')
        if (!nav || !main) return undefined
        // 본문 밖의 사이트 헤더(<main> 안의 화면 제목 header 는 제외한다).
        const siteHeader = Array.from(document.querySelectorAll('header')).find((element) => !main.contains(element))
        const measure = () => {
            main.style.setProperty(
                '--platform-header-h',
                `${siteHeader?.getBoundingClientRect().height ?? FALLBACK_HEADER_PX}px`,
            )
            main.style.setProperty('--platform-section-nav-h', `${nav.getBoundingClientRect().height}px`)
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(nav)
        if (siteHeader) observer.observe(siteHeader)
        return () => observer.disconnect()
    }, [])

    // 지금 보고 있는 섹션.
    useEffect(() => {
        const sections = items
            .map((item) => document.getElementById(item.id))
            .filter((section): section is HTMLElement => section !== null)
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting)
                if (visible) setCurrentId(visible.target.id)
            },
            {rootMargin: SPY_ROOT_MARGIN},
        )
        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [items])

    // 고른 탭이 가려져 있으면(가로로 넘칠 때) 줄 가운데로 민다. 스크롤 칸 = 목록을 감싼 HorizontalScrollArea 의 칸.
    useEffect(() => {
        const scroller = listRef.current?.parentElement
        const link = currentId ? listRef.current?.querySelector<HTMLElement>(`a[href="#${currentId}"]`) : null
        if (!scroller || !link || scroller.scrollWidth <= scroller.clientWidth) return
        const scrollerBox = scroller.getBoundingClientRect()
        const linkBox = link.getBoundingClientRect()
        const isHidden = linkBox.left < scrollerBox.left || linkBox.right > scrollerBox.right
        if (!isHidden) return
        const linkCenter = linkBox.left - scrollerBox.left + scroller.scrollLeft + linkBox.width / 2
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        scroller.scrollTo({left: linkCenter - scroller.clientWidth / 2, behavior: isReduced ? 'auto' : 'smooth'})
    }, [currentId])

    return (
        <nav
            ref={navRef}
            aria-label={label}
            className="border-platform-panel-border bg-page/90 z-sticky sticky top-(--platform-header-h) mt-10 border-b backdrop-blur-sm"
        >
            <div className="grid-layout *:col-span-full">
                <div
                    className={
                        leading
                            ? 'flex flex-col gap-2 pt-3 lg:min-h-16 lg:flex-row lg:items-center lg:gap-5 lg:pt-0'
                            : ''
                    }
                >
                    {leading ? <div className="lg:shrink-0">{leading}</div> : null}
                    {/* 넘칠 때만 좌우 화살표가 붙는다. 모바일은 화살표가 여백 쪽으로 조금 나가 탭 칸을 넓힌다. */}
                    <HorizontalScrollArea
                        itemSelector="li"
                        scrollLabel="섹션 탭"
                        className={cn(
                            'max-md:-mx-2',
                            leading && 'lg:border-platform-panel-border lg:min-w-0 lg:flex-1 lg:border-l lg:pl-5',
                        )}
                    >
                        <ol ref={listRef} className="flex min-h-14 w-max items-center gap-1">
                            {items.map((item) => (
                                <li key={item.id} className="shrink-0">
                                    <a
                                        href={`#${item.id}`}
                                        aria-current={currentId === item.id ? 'true' : undefined}
                                        className={platformSectionNavLinkClassName}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </HorizontalScrollArea>
                </div>
            </div>
        </nav>
    )
}

export {PlatformSectionNav}
export type {PlatformSectionNavItem}
