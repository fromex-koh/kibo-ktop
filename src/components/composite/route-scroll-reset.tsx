'use client'

import {useLayoutEffect} from 'react'
import {usePathname} from 'next/navigation'

// 페이지 간 이동 시 이전 화면의 스크롤 위치를 이어받지 않도록 상단으로 이동한다.
// hash가 있는 링크는 브라우저의 앵커 이동을 유지한다.
const RouteScrollReset = () => {
    const pathname = usePathname()

    useLayoutEffect(() => {
        if (window.location.hash) return

        // 라우트 전환 직후에는 Next의 새 화면 반영과 브라우저 스크롤 복원이 순서대로 일어날 수 있다.
        // 한 프레임 뒤 다시 초기화해 이전 화면의 위치가 새 페이지에 남는 경우를 막는다.
        const reset = () => window.scrollTo({top: 0, left: 0, behavior: 'auto'})
        let secondFrame: number | undefined
        const firstFrame = window.requestAnimationFrame(() => {
            reset()
            secondFrame = window.requestAnimationFrame(reset)
        })

        return () => {
            window.cancelAnimationFrame(firstFrame)
            if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame)
        }
    }, [pathname])

    return null
}

export default RouteScrollReset
