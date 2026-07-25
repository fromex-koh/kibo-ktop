'use client'

import {usePathname} from 'next/navigation'
import {ThemeProvider as NextThemesProvider} from 'next-themes'
import {MAIN_PAGE_PATH, MAIN_PAGE_THEME, THEME_STORAGE_KEY} from '@/constants/theme'

/**
 * next-themes 래퍼 — .dark 클래스 기반 전환(PB-06 semantic 토큰 자동 반사) + FOUC 방지 스크립트를
 * next-themes 가 대신 주입한다(layout.tsx 의 수동 인라인 스크립트를 대체).
 * 메인페이지 라우트에서는 3번째 스킨 'mainpage' 를 light/dark 와 같은 방식(html 클래스)으로 강제한다 —
 * 사용자의 라이트/다크 선택은 localStorage 에 그대로 남고, 다른 페이지로 이동하면 원래 테마로 복귀한다.
 * themes 에 'mainpage' 를 함께 등록해야 복귀가 동작한다 — next-themes 는 이 목록의 클래스만 지우고 새 테마를
 * 붙이므로, 목록에 없으면 메인페이지에서 링크로 빠져나갈 때 .mainpage 가 html 에 남아 다음 화면까지 어두워진다.
 * 메인페이지를 제외한 화면의 기본값은 라이트다 — 저장된 테마가 없는 첫 방문에만 적용되고, 한 번이라도
 * 토글해 저장된 테마가 있으면 OS 설정보다 그 값을 따른다(enableSystem=false).
 */
const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname()
    const forcedTheme = pathname === MAIN_PAGE_PATH ? MAIN_PAGE_THEME : undefined

    return (
        <NextThemesProvider
            attribute="class"
            storageKey={THEME_STORAGE_KEY}
            themes={['light', 'dark', MAIN_PAGE_THEME]}
            defaultTheme="light"
            enableSystem={false}
            forcedTheme={forcedTheme}
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    )
}

export default ThemeProvider
