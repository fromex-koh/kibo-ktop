'use client'

import {useLayoutEffect} from 'react'
import {usePathname} from 'next/navigation'

// 페이지 간 이동 시 이전 화면의 스크롤 위치를 이어받지 않도록 상단으로 이동한다.
// hash가 있는 링크는 브라우저의 앵커 이동을 유지한다.
const RouteScrollReset = () => {
    const pathname = usePathname()

    useLayoutEffect(() => {
        if (window.location.hash) return
        window.scrollTo({top: 0, left: 0, behavior: 'auto'})
    }, [pathname])

    return null
}

export default RouteScrollReset
