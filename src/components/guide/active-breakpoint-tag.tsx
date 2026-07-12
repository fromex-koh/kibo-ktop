'use client'

import {useSyncExternalStore} from 'react'
import {Badge} from '@/components/kit/badge'
import tokens from '@tokens'

// 브레이크포인트 오름차순 정렬 — 예: [['md', 768], ['xl', 1280]]
const ENTRIES = Object.entries(tokens.breakpoint).sort((a, b) => a[1] - b[1])

// 현재 뷰포트 폭이 만족하는 가장 큰 min-width 구간의 키를 반환('mobile'|'md'|'xl' 등).
// window 밖에서는 계산 불가하므로 각 min-width 미디어쿼리를 구독해 폭이 바뀔 때마다 재계산한다.
const getSnapshot = (): string => {
    for (let i = ENTRIES.length - 1; i >= 0; i -= 1) {
        const [key, px] = ENTRIES[i]
        if (window.matchMedia(`(min-width: ${px}px)`).matches) return key
    }
    return 'mobile'
}

const getServerSnapshot = (): string => 'mobile' // SSR·초기 하이드레이션은 모바일로 가정(모바일 퍼스트)

const subscribe = (callback: () => void) => {
    const mqls = ENTRIES.map(([, px]) => window.matchMedia(`(min-width: ${px}px)`))
    mqls.forEach((mql) => mql.addEventListener('change', callback))
    return () => mqls.forEach((mql) => mql.removeEventListener('change', callback))
}

/**
 * 표의 브레이크포인트 행 옆에 붙이는 "active" 태그.
 * targetKey 가 현재 뷰포트가 속한 구간과 같을 때만 렌더링되고, 브라우저 폭이 바뀌면 자동 갱신된다.
 */
const ActiveBreakpointTag = ({targetKey}: {targetKey: string}) => {
    const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    if (current !== targetKey) return null

    return <Badge color="success">active</Badge>
}

export default ActiveBreakpointTag
