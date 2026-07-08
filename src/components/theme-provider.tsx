'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { THEME_STORAGE_KEY } from '@/constants/theme';

/**
 * next-themes 래퍼 — .dark 클래스 기반 전환(PB-06 semantic 토큰 자동 반사) + FOUC 방지 스크립트를
 * next-themes 가 대신 주입한다(layout.tsx 의 수동 인라인 스크립트를 대체).
 */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemesProvider attribute="class" storageKey={THEME_STORAGE_KEY} disableTransitionOnChange>
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
