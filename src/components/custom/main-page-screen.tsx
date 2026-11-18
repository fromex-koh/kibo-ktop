import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import Footer from '@/components/composite/footer'
import type {UserType} from '@/constants/header-navigation'
import {MainPageLayout} from '@/components/composite/page-layout'
import type {SkipLinkItem} from '@/components/composite/skip-nav'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import MainPageHeaderState from '@/components/custom/main-page-header-state'
import MainSecondSection from '@/components/custom/main-second-section'
import MobileTechEvalContent from '@/components/custom/mobile-tech-eval-content'
import TechEvalSection from '@/components/custom/tech-eval-section'

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

// 메인 랜딩페이지 화면 한 벌 — 기업 홈·기관 홈·컴포넌트 가이드 목업이 같은 화면을 쓴다.
// 화면마다 다른 것은 로고 · [기술평가] CTA 가 갈 곳과 사용자 유형(푸터 · 서비스 CTA 경로)뿐이라 그것만 받는다.
//
// MainPageLayout이 Header와 Skip Navigation을 구성하고, Footer는 마지막 섹션에 둔다.
// StackPager는 화면 조건에 따라 섹션 전환 방식을 선택하고, 각 섹션 컴포넌트가 본문을 담당한다.
const MainPageScreen = ({
    logoHref,
    technologyEvaluationHref,
    userType,
}: {
    // 로고를 눌렀을 때 돌아올 곳.
    logoHref: string
    // 3섹션 [기술평가] 의 시작하기 CTA 가 갈 곳 — 기업 홈·기관 홈이 각자의 Tech-Index 선택 화면을 넘긴다.
    technologyEvaluationHref: string
    // 푸터 링크 · 나머지 서비스 CTA 를 이 사용자 유형의 실제 화면으로 잇는다(빈 '#' 링크가 겹치지 않게).
    userType: UserType
}) => (
    <StackPager transition="cover" className={`bg-background relative min-h-dvh ${MAIN_PAGE_CLASS}`}>
        <MainPageLayout skipLinks={SKIP_LINKS} logoHref={logoHref} navigationByUserType={DEFAULT_HEADER_NAVIGATION}>
            <MainPageHeaderState />
            {/* main은 Skip Navigation의 본문 이동 대상이다. */}
            <main id="main" tabIndex={-1}>
                <HeroSection />
                <MainSecondSection />
                <TechEvalSection
                    technologyEvaluationHref={technologyEvaluationHref}
                    userType={userType}
                    mobileContent={
                        <MobileTechEvalContent
                            technologyEvaluationHref={technologyEvaluationHref}
                            userType={userType}
                        />
                    }
                    bottomContent={
                        // 마지막 섹션의 사이트 정보 이동 대상과 메인페이지용 Footer를 함께 배치한다.
                        <div
                            id="site-info"
                            tabIndex={-1}
                            className="bg-background relative mt-auto w-full pt-28 md:pt-2"
                        >
                            <Footer variant="mainpage" userType={userType} />
                        </div>
                    }
                />
            </main>
        </MainPageLayout>
    </StackPager>
)

export default MainPageScreen
