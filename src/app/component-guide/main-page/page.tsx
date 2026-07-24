import type {Metadata} from 'next'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer, {MarqueeBand} from '@/components/composite/footer'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import TechEvalSection from '@/components/custom/tech-eval-section'
import MainPageHeaderState from './main-page-header-state'
import MobileTechEvalContent from './mobile-tech-eval-content'
import styles from './page.module.css'

export const metadata: Metadata = {title: '메인페이지'}

// 스택 페이지별 바로가기 — 데스크톱에서는 비활성 페이지가 inert 라 앵커 이동만으로는 도달할 수 없어,
// StackPager 가 링크 클릭을 받아 대상이 속한 페이지를 먼저 활성화한다. [KWCAG 6.4.1 · 6.1.1]
const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#hero', label: '본문 바로가기'},
    {href: '#tech-eval', label: '기술평가 서비스 바로가기'},
    {href: '#site-info', label: '사이트 정보 바로가기'},
]

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

// 메인페이지에서 별도로 요청된 컨테이너 정렬과 2섹션 이후 자연 스크롤만 페이지 스코프로 유지한다.
// 2섹션의 타이포·이미지·간격은 TechEvalSection의 원래 PC 디자인 값을 그대로 사용한다.
const MAIN_PAGE_CLASS = [
    // 1섹션에서는 투명하고 2섹션 진입 시 스냅 시간에 맞춰 페이지 배경색으로 자연스럽게 전환한다.
    '[&_header]:bg-transparent',
    '[&_header]:transition-colors',
    '[&_header]:duration-600',
    'data-[active-page=1]:[&_header]:bg-background',
    // Hero는 제자리에 두고 2섹션이 위로 덮도록 해 스무스 전환 중 빈 배경이 드러나지 않게 한다.
    '[@media_(min-width:48rem)_and_(min-height:45rem)]:[&_.stack-page]:!z-1',
    '[@media_(min-width:48rem)_and_(min-height:45rem)]:[&_#hero[data-stack-state=previous]]:!transform-none',
    // 1·2섹션 모두 Header의 content-layout과 같은 좌우 여백·최대 폭을 사용한다.
    'md:[&_#hero_.grid-layout]:!w-[min(calc(100%-2*var(--ds-grid-margin)),var(--container-content))]',
    'md:[&_#tech-eval_.grid-layout]:!w-[min(calc(100%-2*var(--ds-grid-margin)),var(--container-content))]',
    // 마키는 콘텐츠 다음의 일반 블록으로 두고, 원래 PC 크기가 뷰포트를 넘으면 2섹션 안에서 이어서 본다.
    'md:[&_#tech-eval]:!overflow-y-auto',
].join(' ')

// 메인페이지 목업 — 풀스크린 스택 전환 구조.
// 너비·높이가 충분한 화면에서는 실제 문서 스크롤 없이 고정된 섹션 레이어의 상태를 transform으로 전환한다.
// 모바일과 높이가 낮은 데스크톱에서는 각 섹션이 최소 높이를 유지하며 자연스러운 문서 흐름으로 이어진다.
// 색상은 메인페이지 전용 스킨(tokens.css의 .mainpage 블록)을 따른다 — light/dark와 같은 방식으로
// theme-provider가 이 라우트에서 html 클래스에 'mainpage'를 강제한다(테마 토글과 무관하게 유지).
const MainPage = () => (
    <StackPager className={`${styles.root} bg-background relative min-h-dvh ${MAIN_PAGE_CLASS}`}>
        <MainPageHeaderState />
        <SkipNav links={SKIP_LINKS} />
        <Header variant="main" navigationByUserType={MAIN_HEADER_NAVIGATION} />
        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다.
                조작 요소가 아니라서 포커스 표시가 오히려 레이아웃을 해친다. 실제 링은 대상 안의 링크·버튼이 가진다. */}
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
                            <Footer showMarquee={false} />
                        </div>
                    </>
                }
            />
        </main>
    </StackPager>
)

export default MainPage
