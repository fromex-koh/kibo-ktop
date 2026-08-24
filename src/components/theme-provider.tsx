'use client'

import {useEffect, useRef, useState} from 'react'
import {usePathname} from 'next/navigation'
import {ThemeProvider as NextThemesProvider, useTheme} from 'next-themes'
import {MAIN_PAGE_THEME, THEME_STORAGE_KEY} from '@/constants/theme'
import {THEME_ROUTE_CONFIG} from '@/constants/theme-routes'

// 메인페이지에만 mainpage 테마를 적용한다.

/**
 * 전역 테마를 html class로 적용한다.
 * 메인페이지를 제외한 모든 화면은 기본 dark를 사용한다.
 * 저장된 light·dark 설정은 메인페이지를 제외한 화면에서 기본값보다 우선한다.
 * 메인페이지는 저장된 설정과 관계없이 mainpage 테마를 항상 사용한다.
 */
type ThemeMode = 'light' | 'dark'

const RouteThemeSynchronizer = ({
    defaultTheme,
    forcedTheme,
    scope,
}: {
    defaultTheme: ThemeMode
    forcedTheme?: string
    scope: string
}) => {
    const {setTheme, theme} = useTheme()
    const appliedScopeRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        if (appliedScopeRef.current === scope) return
        appliedScopeRef.current = scope

        if (forcedTheme) return

        let savedTheme: string | null = null
        try {
            savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
        } catch {
            // 저장소에 접근할 수 없어도 현재 경로의 기본 테마는 적용한다.
        }

        if (savedTheme === 'light' || savedTheme === 'dark') return
        if (theme !== defaultTheme) setTheme(defaultTheme)

        // 기본값은 저장하지 않아 다른 경로의 기본 테마를 유지한다.
        try {
            window.localStorage.removeItem(THEME_STORAGE_KEY)
        } catch {
            // 저장소를 사용할 수 없는 환경에서는 테마 적용만 유지한다.
        }
    }, [defaultTheme, forcedTheme, scope, setTheme, theme])

    return null
}

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname()
    const isMainPagePath = THEME_ROUTE_CONFIG.mainPagePaths.some((mainPagePath) => mainPagePath === pathname)
    const defaultTheme: ThemeMode = 'dark'
    const forcedTheme = isMainPagePath ? MAIN_PAGE_THEME : undefined
    const routeThemeScope = isMainPagePath ? 'mainpage' : 'default'
    const [initialDefaultTheme] = useState<ThemeMode>(defaultTheme)

    return (
        <NextThemesProvider
            attribute="class"
            storageKey={THEME_STORAGE_KEY}
            themes={['light', 'dark', MAIN_PAGE_THEME]}
            defaultTheme={initialDefaultTheme}
            enableSystem={false}
            forcedTheme={forcedTheme}
            disableTransitionOnChange
        >
            {/* 경로 전환 시 저장된 사용자 설정이 없으면 현재 경로의 기본 테마를 적용한다. */}
            <RouteThemeSynchronizer defaultTheme={defaultTheme} forcedTheme={forcedTheme} scope={routeThemeScope} />
            {children}
        </NextThemesProvider>
    )
}

export default ThemeProvider
