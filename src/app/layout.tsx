import type {Metadata, Viewport} from 'next'
import localFont from 'next/font/local'
import ThemeProvider from '@/components/theme-provider'
import {Toaster} from '@/components/ui/sonner'
import {
    SITE_ALLOW_INDEXING,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_OG_IMAGE,
    SITE_OG_IMAGE_ALT,
    SITE_URL,
} from '@/constants/publishing-guide'
import './globals.css'

// 로컬 폰트: Pretendard (가변 폰트, weight 100~900)
const pretendard = localFont({
    src: './fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '100 900',
    variable: '--font-pretendard',
})

// 전역 사이트 메타데이터와 Open Graph. 값은 constants/site.ts에서 프로젝트·handoff별로 관리한다.
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    alternates: {canonical: '/'},
    // 원본 프로젝트는 noindex를 적용하고, handoff는 SITE_ALLOW_INDEXING=true로 이 설정을 생략한다.
    ...(SITE_ALLOW_INDEXING
        ? {}
        : {
              robots: {
                  index: false,
                  follow: false,
                  googleBot: {index: false, follow: false},
              },
          }),
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        ...(SITE_OG_IMAGE
            ? {
                  images: [
                      {
                          url: SITE_OG_IMAGE,
                          width: 1200,
                          height: 630,
                          alt: SITE_OG_IMAGE_ALT,
                      },
                  ],
              }
            : {}),
    },
}

// themeColor는 페이지 배경이 아닌 브라우저 UI 색상이며 OS의 라이트·다크 설정을 따른다.
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
            <body className={`${pretendard.variable} bg-background text-foreground flex min-h-full flex-col font-sans`}>
                <ThemeProvider>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
