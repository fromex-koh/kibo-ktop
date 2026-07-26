import type {Metadata} from 'next'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer, {MarqueeBand} from '@/components/composite/footer'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import TechEvalSection from '@/components/custom/tech-eval-section'
import MobileTechEvalContent from '@/components/custom/mobile-tech-eval-content'
import MainPageHeaderState from './main-page-header-state'

export const metadata: Metadata = {title: '메인페이지'}

// 비활성 스택 페이지는 inert 라 앵커 이동이 막힌다 — StackPager 가 클릭을 받아 대상 페이지를 먼저 켠다.
const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#hero', label: '본문 바로가기'},
    {href: '#tech-eval', label: '기술평가 서비스 바로가기'},
    {href: '#site-info', label: '사이트 정보 바로가기'},
]

// href 는 이동 대상 확정 전 목업 값이다. 실제 경로가 정해지면 여기서 교체한다.
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

// 헤더는 1섹션에서 투명, 2섹션 진입 시 배경색. 페이저가 켜졌으면 active-page, 꺼졌으면
// MainPageHeaderState 가 기록하는 natural-page 로 같은 전환을 만든다.
const MAIN_PAGE_CLASS = [
    '[&_header]:bg-transparent',
    '[&_header]:transition-colors',
    '[&_header]:duration-600',
    'data-[active-page=1]:[&_header]:bg-background',
    'data-[natural-page=1]:[&_header]:bg-background',
].join(' ')

// 메인페이지 목업 — 두 섹션을 StackPager 로 넘긴다. 너비·높이가 충분하면 고정 레이어 전환,
// 아니면 스크롤 스냅(기준과 변형은 stack-pager.tsx 의 STACK_PAGER_QUERY).
// 테마는 theme-provider 가 이 라우트에서 mainpage 스킨으로 고정한다 — 테마 토글이 먹지 않는 게 정상이다.
const MainPage = () => (
    <StackPager transition="cover" className={`bg-background relative min-h-dvh ${MAIN_PAGE_CLASS}`}>
        <MainPageHeaderState />
        <SkipNav links={SKIP_LINKS} />
        <Header variant="main" navigationByUserType={MAIN_HEADER_NAVIGATION} />
        {/* tabIndex={-1} 은 바로가기 도착점용 — 포커스만 받고 링은 그리지 않는다. */}
        <main id="main" tabIndex={-1}>
            <HeroSection />
            <TechEvalSection
                mobileContent={<MobileTechEvalContent />}
                bottomContent={
                    <>
                        <div className="tech-eval-marquee mt-auto w-full">
                            <MarqueeBand />
                        </div>
                        <div id="site-info" tabIndex={-1} className="bg-background relative w-full">
                            {/* 모바일 2섹션은 서비스 4종을 모두 펼쳐 이미 길어 사이트맵까지 두지 않는다. */}
                            <Footer showMarquee={false} showSitemapOnMobile={false} />
                        </div>
                    </>
                }
            />
        </main>
    </StackPager>
)

export default MainPage
