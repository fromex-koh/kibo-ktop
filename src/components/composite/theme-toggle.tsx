'use client'

import {useSyncExternalStore} from 'react'
import {useTheme} from 'next-themes'
import {Moon, Sun} from 'lucide-react'
import {Button} from '@/components/kit/button'

// 구독할 외부 변화가 없는 스토어 — 서버 스냅샷(false)과 클라 스냅샷(true)이 갈리는 것만 이용해
// "마운트 이후(클라)" 여부를 하이드레이션-세이프하게 읽는다. (setState-in-effect 안티패턴 회피)
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * 라이트/다크 수동 토글 — Button(variant="ghost" size="icon-sm") 을 감싼 도메인 컴포넌트.
 * 테마 전환 로직(상태)이 있어 별도 컴포넌트로 두되, 버튼 스타일·포커스·접근성은 Button 을 재사용한다.
 * - next-themes 가 .dark 클래스 전환 + localStorage 저장 + 탭 간 동기화를 담당한다.
 * - resolvedTheme 은 서버에서 알 수 없으므로(FOUC 방지 스크립트가 클라에서 결정) 마운트 전엔
 *   같은 크기(icon-sm=36px)의 자리표시자로 렌더해 하이드레이션 불일치·레이아웃 시프트를 피한다.
 * - 접근성: 아이콘만 보이므로 `aria-label` 로 기능을 알리고 내부 아이콘은 `aria-hidden`. [KWCAG 5.1.1]
 */
const ThemeToggle = () => {
    const {resolvedTheme, setTheme} = useTheme()
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    if (!isMounted) {
        return <div className="size-control-h-sm" aria-hidden="true" />
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    // aria-label/title 은 '전환 대상'(클릭 시 무엇이 되는지)을 가리킨다.
    // 아이콘은 '현재 상태'를 표시한다 — 라이트=해, 다크=달(한눈에 지금 모드를 읽게).
    const label = resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'

    return (
        <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label={label} title={label}>
            {resolvedTheme === 'dark' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
        </Button>
    )
}

export default ThemeToggle
