'use client'

import {useSyncExternalStore} from 'react'
import {useTheme} from 'next-themes'

// 구독할 외부 변화가 없는 스토어 — 서버 스냅샷(false)과 클라 스냅샷(true)이 갈리는 것만 이용해
// "마운트 이후(클라)" 여부를 하이드레이션-세이프하게 읽는다. (setState-in-effect 안티패턴 회피)
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * 라이트/다크 전환 상태 — 버튼 생김새가 다른 두 사용처(가이드 앱바의 Button, 헤더의 아이콘)가 공유한다.
 * - next-themes 가 .dark 클래스 전환 + localStorage 저장 + 탭 간 동기화를 담당한다.
 * - resolvedTheme 은 서버에서 알 수 없으므로(FOUC 방지 스크립트가 클라에서 결정) isMounted 가 false 인
 *   동안은 사용처가 같은 크기의 자리표시자를 그려 하이드레이션 불일치·레이아웃 시프트를 피한다.
 * - label 은 '전환 대상'(클릭하면 무엇이 되는지)이고, 아이콘은 '현재 상태'를 표시한다.
 */
export const useThemeToggle = () => {
    const {resolvedTheme, setTheme} = useTheme()
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    const isDark = resolvedTheme === 'dark'

    return {
        isMounted,
        isDark,
        label: isDark ? '라이트 모드로 전환' : '다크 모드로 전환',
        toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
    }
}
