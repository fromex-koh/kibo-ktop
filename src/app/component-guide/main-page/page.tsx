import type {Metadata} from 'next'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer from '@/components/composite/footer'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import TechEvalSection from '@/components/custom/tech-eval-section'
import MarqueeBand from '@/components/custom/marquee-band'
import MobileTechEvalContent from '@/components/custom/mobile-tech-eval-content'
import MainPageHeaderState from '@/app/component-guide/main-page/main-page-header-state'
// 이 화면에서만 쓰는 CSS — 전역이 아니라 라우트 단위로 로드해 서브페이지 번들에 섞이지 않게 한다.
import '@/styles/main-page.css'

export const metadata: Metadata = {title: '메인페이지'}

// 비활성 스택 페이지는 inert 라 앵커 이동이 막힌다. StackPager 가 클릭을 받아 대상 페이지를 먼저 켠다.
const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#hero', label: '본문 바로가기'},
    {href: '#tech-eval', label: '기술평가 서비스 바로가기'},
    {href: '#site-info', label: '사이트 정보 바로가기'},
]

// GNB — href 는 이동 대상이 정해지기 전 목업 값이다. 실제 경로가 나오면 여기서 교체한다.
const MAIN_HEADER_NAVIGATION = {
    corp: [
        {label: '플랫폼 소개', href: '#'},
        {label: '기술평가', href: '#'},
        {label: '특허평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
    org: [
        {label: '플랫폼 소개', href: '#'},
        {label: '개별평가', href: '#'},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '특허평가', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
} satisfies HeaderNavigationByUserType

// 헤더 배경 — 1섹션에서 투명, 2섹션 진입 시 불투명. 현재 섹션 판단은 두 갈래다.
// 페이저가 켜진 화면은 StackPager 의 active-page, 꺼진 화면은 MainPageHeaderState 가 쓰는 natural-page.
const MAIN_PAGE_CLASS = [
    '[&_header]:bg-transparent',
    '[&_header]:transition-colors',
    '[&_header]:duration-600',
    'data-[active-page=1]:[&_header]:bg-background',
    'data-[natural-page=1]:[&_header]:bg-background',
].join(' ')

// 메인페이지 목업 — 히어로와 기술평가 두 섹션을 StackPager 로 넘긴다.
// · 전환: 화면이 충분하면 고정 레이어(cover = 히어로는 제자리, 2섹션이 위를 덮음), 아니면 스크롤 스냅.
//   갈리는 기준은 stack-pager.tsx 의 STACK_PAGER_QUERY.
// · 반응형: 각 섹션이 자기 것을 갖는다(hero-* 클래스는 globals.css). 여기엔 페이지 전용 조정만 둔다.
// · 테마: theme-provider 가 이 라우트를 mainpage 스킨으로 고정한다. Header 도 variant="main" 이면
//   테마 토글을 숨기므로(showThemeToggle 기본값) 이 화면에는 라이트·다크 전환 수단이 없다.
const MainPage = () => (
    <StackPager transition="cover" className={`bg-background relative min-h-dvh ${MAIN_PAGE_CLASS}`}>
        <MainPageHeaderState />
        <SkipNav links={SKIP_LINKS} />
        <Header variant="main" navigationByUserType={MAIN_HEADER_NAVIGATION} />
        {/* id·tabIndex 는 스킵 링크 도착점용 — 포커스만 받고 링은 그리지 않는다(#site-info 도 같다). */}
        <main id="main" tabIndex={-1}>
            <HeroSection />
            <TechEvalSection
                mobileContent={<MobileTechEvalContent />}
                bottomContent={
                    <>
                        <div className="mt-auto w-full">
                            <MarqueeBand />
                        </div>
                        <div id="site-info" tabIndex={-1} className="bg-background relative w-full">
                            {/* 모바일 2섹션은 서비스 4종을 다 펼쳐 이미 길어 사이트맵까지 두지 않는다. */}
                            <Footer showSitemapOnMobile={false} />
                        </div>
                    </>
                }
            />
        </main>
    </StackPager>
)

export default MainPage
