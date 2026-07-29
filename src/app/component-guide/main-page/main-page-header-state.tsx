'use client'

import {useEffect} from 'react'
import {STACK_PAGER_QUERY} from '@/components/custom/stack-pager'

// StackPager가 비활성화되는 모바일·낮은 높이 화면에서는 자연 스크롤 위치를 기준으로
// 현재 섹션을 판단한다. 2섹션(service-intro)에서만 Header를 숨기고 1·3섹션에서는 표시한다.
// 공용 Header와 StackPager의 반응형 규칙은 변경하지 않는다.
// 활성 조건은 StackPager의 STACK_PAGER_QUERY를 그대로 쓴다 — 값이 갈라지면 페이저가 켜진 화면에서도
// 자연 스크롤 계산이 돌아 헤더 배경 판단이 두 갈래가 된다.
const MainPageHeaderState = () => {
    useEffect(() => {
        const pager = document.querySelector<HTMLElement>('[data-stack-pager]')
        const header = pager?.querySelector<HTMLElement>('header')
        const secondSection = pager?.querySelector<HTMLElement>('#service-intro')
        const thirdSection = pager?.querySelector<HTMLElement>('#tech-eval')
        if (!pager || !header || !secondSection || !thirdSection) return

        const stackPagerQuery = window.matchMedia(STACK_PAGER_QUERY)
        let frame = 0

        const isMenuOpen = () =>
            header.querySelector<HTMLElement>('[data-header-menu-trigger]')?.getAttribute('aria-expanded') === 'true'

        const setHeaderHidden = (hidden: boolean) => {
            pager.dataset.headerHidden = hidden && !isMenuOpen() ? 'true' : 'false'
        }

        const syncHeaderState = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (stackPagerQuery.matches) {
                    delete pager.dataset.naturalPage
                    return
                }

                const hasEnteredSecondSection = secondSection.getBoundingClientRect().top <= header.offsetHeight
                const hasEnteredThirdSection = thirdSection.getBoundingClientRect().top <= header.offsetHeight
                pager.dataset.naturalPage = hasEnteredSecondSection ? '1' : '0'
                setHeaderHidden(hasEnteredSecondSection && !hasEnteredThirdSection)
            })
        }

        const activePageObserver = new MutationObserver(() => {
            if (!stackPagerQuery.matches) return

            const activePage = Number(pager.dataset.activePage ?? 0)
            setHeaderHidden(activePage === 1)
        })

        const syncResponsiveMode = () => {
            if (stackPagerQuery.matches) {
                setHeaderHidden(Number(pager.dataset.activePage ?? 0) === 1)
            } else {
                setHeaderHidden(false)
            }
            syncHeaderState()
        }

        syncHeaderState()
        activePageObserver.observe(pager, {attributes: true, attributeFilter: ['data-active-page']})
        window.addEventListener('scroll', syncHeaderState, {passive: true})
        pager.addEventListener('scroll', syncHeaderState, {passive: true})
        window.addEventListener('resize', syncHeaderState)
        stackPagerQuery.addEventListener('change', syncResponsiveMode)

        return () => {
            window.cancelAnimationFrame(frame)
            activePageObserver.disconnect()
            window.removeEventListener('scroll', syncHeaderState)
            pager.removeEventListener('scroll', syncHeaderState)
            window.removeEventListener('resize', syncHeaderState)
            stackPagerQuery.removeEventListener('change', syncResponsiveMode)
            delete pager.dataset.naturalPage
            delete pager.dataset.headerHidden
        }
    }, [])

    return null
}

export default MainPageHeaderState
