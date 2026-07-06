import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { THEME_STORAGE_KEY } from '@/constants/theme';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants/site';
import './globals.css';

// 로컬 폰트: Pretendard (가변 폰트, weight 100~900)
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-pretendard',
});

// SEO 필수 메타데이터만 구성 (viewport·charset 은 Next.js 가 기본 제공).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  // 내부용 — 검색엔진 색인 차단 [noindex]
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// FOUC 방지: 첫 페인트 전에 저장된 테마(없으면 OS 설정)를 <html> 클래스로 주입.
// localStorage 선택이 우선하고, 없으면 prefers-color-scheme 를 따른다.
const themeInitScript = `(function(){try{let t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();`;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
