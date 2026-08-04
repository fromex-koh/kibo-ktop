import type {Metadata} from 'next'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import Footer from '@/components/composite/footer'
import {MainPageLayout} from '@/components/composite/page-layout'
import type {SkipLinkItem} from '@/components/composite/skip-nav'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import MainSecondSection from '@/components/custom/main-second-section'
import TechEvalSection from '@/components/custom/tech-eval-section'
import MobileTechEvalContent from '@/components/custom/mobile-tech-eval-content'
import MainPageHeaderState from '@/app/component-guide/(demo)/main-page/main-page-header-state'

export const metadata: Metadata = {title: '메인페이지'}

// 반복 영역을 건너뛸 수 있도록 각 섹션과 사이트 정보 영역의 이동 대상을 등록한다.
const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#hero', label: '본문 바로가기'},
    {href: '#service-intro', label: '두 번째 섹션 바로가기'},
    {href: '#tech-eval', label: '기술평가 서비스 바로가기'},
    {href: '#site-info', label: '사이트 정보 바로가기'},
]

// 첫 섹션에서는 투명, 이후 섹션에서는 배경색이 있는 Header를 표시한다.
// 자연 스크롤 상태는 MainPageHeaderState가 data-natural-page로 동기화한다.
const MAIN_PAGE_CLASS = ['[&_header]:bg-transparent', 'data-[natural-page=1]:[&_header]:bg-background'].join(' ')

// 메인 랜딩페이지 전용 조합. MainPageLayout이 Header와 Skip Navigation을 구성하고, Footer는 마지막 섹션에 둔다.
// StackPager는 화면 조건에 따라 섹션 전환 방식을 선택하고, 각 섹션 컴포넌트가 본문을 담당한다.
const MainPage = () => (
    <StackPager transition="cover" className={`bg-background relative min-h-dvh ${MAIN_PAGE_CLASS}`}>
        <MainPageLayout
            skipLinks={SKIP_LINKS}
            logoHref="/component-guide/main-page"
            navigationByUserType={DEFAULT_HEADER_NAVIGATION}
        >
            <MainPageHeaderState />
            {/* main은 Skip Navigation의 본문 이동 대상이다. */}
            <main id="main" tabIndex={-1}>
                <HeroSection />
                <MainSecondSection />
                <TechEvalSection
                    mobileContent={<MobileTechEvalContent />}
                    bottomContent={
                        // 마지막 섹션의 사이트 정보 이동 대상과 메인페이지용 Footer를 함께 배치한다.
                        <div
                            id="site-info"
                            tabIndex={-1}
                            className="bg-background relative mt-auto w-full pt-28 md:pt-2"
                        >
                            <Footer variant="mainpage" />
                        </div>
                    }
                />
            </main>
        </MainPageLayout>
    </StackPager>
)

export default MainPage
