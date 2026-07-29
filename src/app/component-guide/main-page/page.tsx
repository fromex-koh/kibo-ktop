import type {Metadata} from 'next'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer from '@/components/composite/footer'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import MainSecondSection from '@/components/custom/main-second-section'
import TechEvalSection from '@/components/custom/tech-eval-section'
import MobileTechEvalContent from '@/components/custom/mobile-tech-eval-content'
import MainPageHeaderState from '@/app/component-guide/main-page/main-page-header-state'

export const metadata: Metadata = {title: '메인페이지'}

// 비활성 스택 페이지는 inert 라 앵커 이동이 막힌다. StackPager 가 클릭을 받아 대상 페이지를 먼저 켠다.
const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#hero', label: '본문 바로가기'},
    {href: '#service-intro', label: '두 번째 섹션 바로가기'},
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
    '[&_header]:transition-[background-color,translate]',
    '[&_header]:duration-300',
    '[&_header]:ease-out',
    'motion-reduce:[&_header]:transition-none',
    'data-[header-hidden=true]:[&_header]:-translate-y-full',
    'data-[active-page=1]:[&_header]:bg-background',
    'data-[active-page=2]:[&_header]:bg-background',
    'data-[natural-page=1]:[&_header]:bg-background',
].join(' ')

// 메인페이지 목업 — 히어로·신규 서비스 소개·기술평가 세 섹션을 StackPager 로 넘긴다.
// · 전환: 화면이 충분하면 고정 레이어(cover = 이전 섹션은 제자리, 다음 섹션이 위를 덮음), 아니면 스크롤 스냅.
//   갈리는 기준은 stack-pager.tsx 의 STACK_PAGER_QUERY.
// · 반응형: 각 섹션이 자기 것을 갖는다(hero-* 클래스는 globals.css). 여기엔 페이지 전용 조정만 둔다.
// · 테마: theme-provider 가 이 라우트를 mainpage 스킨으로 고정한다. Header 는
//   테마 토글을 숨기므로(showThemeToggle 기본값) 이 화면에는 라이트·다크 전환 수단이 없다.
const MainPage = () => (
    <StackPager transition="cover" className={`bg-background relative min-h-dvh ${MAIN_PAGE_CLASS}`}>
        <MainPageHeaderState />
        <SkipNav links={SKIP_LINKS} />
        <Header logoHref="/component-guide/main-page" navigationByUserType={MAIN_HEADER_NAVIGATION} />
        {/* id·tabIndex 는 스킵 링크 도착점용 — 포커스만 받고 링은 그리지 않는다(#site-info 도 같다). */}
        <main id="main" tabIndex={-1}>
            <HeroSection />
            <MainSecondSection />
            <TechEvalSection
                mobileContent={<MobileTechEvalContent />}
                bottomContent={
                    <div id="site-info" tabIndex={-1} className="bg-background relative mt-auto w-full">
                        <Footer />
                    </div>
                }
            />
        </main>
    </StackPager>
)

export default MainPage
