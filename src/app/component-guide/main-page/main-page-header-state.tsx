'use client'

import {useEffect} from 'react'

const STACK_PAGER_QUERY = '(min-width: 768px) and (min-height: 720px)'

// StackPager가 비활성화되는 모바일·낮은 높이 화면에서는 자연 스크롤 위치를 기준으로
// 2섹션 진입 여부를 페이지 루트에 기록한다. 공용 Header와 StackPager의 반응형 규칙은 변경하지 않는다.
const MainPageHeaderState = () => {
    useEffect(() => {
        const pager = document.querySelector<HTMLElement>('[data-stack-pager]')
        const header = pager?.querySelector<HTMLElement>('header')
        const techEvalSection = pager?.querySelector<HTMLElement>('#tech-eval')
        if (!pager || !header || !techEvalSection) return

        const stackPagerQuery = window.matchMedia(STACK_PAGER_QUERY)
        let frame = 0

        const syncHeaderState = () => {
            window.cancelAnimationFrame(frame)
            frame = window.requestAnimationFrame(() => {
                if (stackPagerQuery.matches) {
                    delete pager.dataset.naturalPage
                    return
                }

                const hasEnteredSecondSection =
                    techEvalSection.getBoundingClientRect().top <= header.getBoundingClientRect().bottom
                pager.dataset.naturalPage = hasEnteredSecondSection ? '1' : '0'
            })
        }

        syncHeaderState()
        window.addEventListener('scroll', syncHeaderState, {passive: true})
        pager.addEventListener('scroll', syncHeaderState, {passive: true})
        window.addEventListener('resize', syncHeaderState)
        stackPagerQuery.addEventListener('change', syncHeaderState)

        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener('scroll', syncHeaderState)
            pager.removeEventListener('scroll', syncHeaderState)
            window.removeEventListener('resize', syncHeaderState)
            stackPagerQuery.removeEventListener('change', syncHeaderState)
            delete pager.dataset.naturalPage
        }
    }, [])

    return null
}

export default MainPageHeaderState
