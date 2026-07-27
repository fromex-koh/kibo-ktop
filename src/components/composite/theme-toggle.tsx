'use client'

import {Moon, Sun} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useThemeToggle} from '@/hooks/use-theme-toggle'

/**
 * 라이트/다크 수동 토글 — Button(variant="ghost" size="icon") 을 감싼 도메인 컴포넌트.
 * 가이드 앱바처럼 버튼 면이 있어야 하는 자리에서 쓴다(헤더는 시안대로 아이콘만 두므로 이걸 쓰지 않는다).
 * 상태·라벨은 useThemeToggle 이 담당하고 여기서는 생김새만 정한다.
 * - 아이콘은 현재 상태가 아니라 전환될 모드로, 라이트에서는 달·다크에서는 해를 표시한다.
 * - 마운트 전에는 같은 크기(icon=44px)의 자리표시자로 렌더해 하이드레이션 불일치·레이아웃 시프트를 피한다.
 * - 접근성: 아이콘만 보이므로 `aria-label` 로 기능을 알리고 내부 아이콘은 `aria-hidden`. [KWCAG 5.1.1]
 */
const ThemeToggle = () => {
    const {isMounted, isDark, label, toggleTheme} = useThemeToggle()

    if (!isMounted) {
        return <div className="size-11" aria-hidden="true" />
    }

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={label} title={label}>
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
    )
}

export default ThemeToggle
