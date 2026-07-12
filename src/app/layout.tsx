import type {Metadata, Viewport} from 'next'
import localFont from 'next/font/local'
import ThemeProvider from '@/components/theme-provider'
import {SITE_DESCRIPTION, SITE_NAME, SITE_URL} from '@/constants/site'
import './globals.css'

// 로컬 폰트: Pretendard (가변 폰트, weight 100~900)
const pretendard = localFont({
    src: './fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '100 900',
    variable: '--font-pretendard',
})

// SEO 필수 메타데이터만 구성 (viewport·charset 은 Next.js 가 기본 제공).
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    alternates: {canonical: '/'},
    // 내부용 — 검색엔진 색인 차단 [noindex]
    robots: {
        index: false,
        follow: false,
        googleBot: {index: false, follow: false},
    },
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
}

// 브라우저 툴바/크롬 색(theme-color) — 최상단 헤더 표면(bg-card)에 맞춘다: 라이트 흰색, 다크 gray.800.
// prefers-color-scheme(OS 설정) 기준이라 앱 내 수동 테마 토글과는 별개로 동작한다.
// 매니페스트처럼 규격상 리터럴 색상값만 허용되므로 hex 를 직접 쓴다(semantic card 토큰과 동일 값, manifest.ts 와 같은 예외).
export const viewport: Viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#ffffff'},
        {media: '(prefers-color-scheme: dark)', color: '#272a2e'},
    ],
}

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <html lang="ko" suppressHydrationWarning className="h-full antialiased">
            <body className={`${pretendard.variable} flex min-h-full flex-col font-sans`}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
