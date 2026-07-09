import * as React from 'react'

// shadcn 기본값 유지(768px = 이 프로젝트 wide 브레이크포인트와 동일). 미만이면 모바일.
const MOBILE_BREAKPOINT = 768

// effect 내 동기 setState(shadcn 원본) 대신 useSyncExternalStore 로 구독한다 — 프로젝트의
// ActiveBreakpointTag 와 동일 패턴이라 SSR 안전(서버=모바일 아님)이고 cascading render 경고도 없다.
const subscribe = (callback: () => void) => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
}

export const useIsMobile = () =>
    React.useSyncExternalStore(
        subscribe,
        () => window.innerWidth < MOBILE_BREAKPOINT,
        () => false,
    )
