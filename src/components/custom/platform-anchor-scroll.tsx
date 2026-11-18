'use client'

import {useEffect} from 'react'

// 화면 안 앵커 부드러운 스크롤 — 플랫폼 소개 본문(<main>) 안의 #id 링크(섹션 이동 탭 · "서비스 살펴보기" 버튼 등)를 누르면
// 대상 섹션까지 부드럽게 스크롤하고, 도착하면 그 섹션 제목(h2)에 포커스를 옮겨 낭독기 · 키보드가 이어서 읽게 한다.
//   · 멈출 위치는 섹션의 scroll-mt(사이트 헤더 + 섹션 이동 탭 높이)가 정한다 — 제목이 헤더 밑에 가리지 않는다.
//   · 주소의 #id 는 그대로 바뀌어(history.pushState) 뒤로 가기 · 링크 공유가 앵커와 같게 동작한다.
//   · 동작 줄이기 설정이면 부드럽게 흐르지 않고 바로 이동한다[6.3.1].
//   · html 전체에 scroll-behavior: smooth 를 걸지 않는 이유 — 다른 화면의 스크롤(맨 위로 · 전체화면 전환 등)까지 바뀐다.
// 화면에 그리는 것은 없다. 쓰는 곳: 플랫폼 소개 5화면 본문(custom/platform-*.tsx 화면마다 한 번만 둔다).

// 스크롤이 거의 끝난 뒤 제목에 포커스를 옮긴다(먼저 옮기면 브라우저가 스크롤을 끊는다).
const FOCUS_DELAY_MS = 400

const PlatformAnchorScroll = () => {
    useEffect(() => {
        const main = document.querySelector('main')
        if (!main) return undefined
        let focusTimer = 0

        const handleClick = (event: MouseEvent) => {
            const isPlainClick =
                event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
            const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
            const id = link?.getAttribute('href')?.slice(1)
            const target = id ? document.getElementById(id) : null
            if (!isPlainClick || !link || !main.contains(link) || !id || !target) return
            event.preventDefault()
            const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            target.scrollIntoView({block: 'start', behavior: isReduced ? 'auto' : 'smooth'})
            window.history.pushState(null, '', `#${id}`)
            const heading = target.querySelector<HTMLElement>('h2') ?? target
            if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
            window.clearTimeout(focusTimer)
            focusTimer = window.setTimeout(() => heading.focus({preventScroll: true}), FOCUS_DELAY_MS)
        }

        main.addEventListener('click', handleClick)
        return () => {
            main.removeEventListener('click', handleClick)
            window.clearTimeout(focusTimer)
        }
    }, [])

    return null
}

export {PlatformAnchorScroll}
