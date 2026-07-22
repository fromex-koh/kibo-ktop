'use client'

import {usePathname} from 'next/navigation'
import {ThemeProvider as NextThemesProvider} from 'next-themes'
import {MAIN_PAGE_PATH, MAIN_PAGE_THEME, THEME_STORAGE_KEY} from '@/constants/theme'

/**
 * next-themes 래퍼 — .dark 클래스 기반 전환(PB-06 semantic 토큰 자동 반사) + FOUC 방지 스크립트를
 * next-themes 가 대신 주입한다(layout.tsx 의 수동 인라인 스크립트를 대체).
 * 메인페이지 라우트에서는 3번째 스킨 'mainpage' 를 light/dark 와 같은 방식(html 클래스)으로 강제한다 —
 * 사용자의 라이트/다크 선택은 localStorage 에 그대로 남고, 다른 페이지로 이동하면 원래 테마로 복귀한다.
 */
const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname()
    const forcedTheme = pathname === MAIN_PAGE_PATH ? MAIN_PAGE_THEME : undefined

    return (
        <NextThemesProvider
            attribute="class"
            storageKey={THEME_STORAGE_KEY}
            forcedTheme={forcedTheme}
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    )
}

export default ThemeProvider
