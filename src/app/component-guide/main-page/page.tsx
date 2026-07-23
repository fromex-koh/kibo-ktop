import type {Metadata} from 'next'
import Header from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer from '@/components/composite/footer'
import StackPager from '@/components/custom/stack-pager'
import HeroSection from '@/components/custom/hero-section'
import TechEvalSection from '@/components/custom/tech-eval-section'

export const metadata: Metadata = {title: '메인페이지'}

// 스택 페이지별 바로가기 — 데스크톱에서는 비활성 페이지가 inert 라 앵커 이동만으로는 도달할 수 없어,
// StackPager 가 링크 클릭을 받아 대상이 속한 페이지를 먼저 활성화한다. [KWCAG 6.4.1 · 6.1.1]
const SKIP_LINKS: readonly SkipLinkItem[] = [
    {href: '#hero', label: '본문 바로가기'},
    {href: '#tech-eval', label: '기술평가 서비스 바로가기'},
    {href: '#site-info', label: '사이트 정보 바로가기'},
]

// 메인페이지 목업 — 풀스크린 스택 전환 구조.
// 너비·높이가 충분한 화면에서는 실제 문서 스크롤 없이 고정된 섹션 레이어의 상태를 transform으로 전환한다.
// 모바일과 높이가 낮은 데스크톱에서는 각 섹션이 최소 높이를 유지하며 자연스러운 문서 흐름으로 이어진다.
// 색상은 메인페이지 전용 스킨(tokens.css의 .mainpage 블록)을 따른다 — light/dark와 같은 방식으로
// theme-provider가 이 라우트에서 html 클래스에 'mainpage'를 강제한다(테마 토글과 무관하게 유지).
const MainPage = () => (
    <StackPager className="bg-background relative min-h-dvh">
        <SkipNav links={SKIP_LINKS} />
        <Header variant="main" />
        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다.
            조작 요소가 아니라서 포커스 표시가 오히려 레이아웃을 해친다. 실제 링은 대상 안의 링크·버튼이 가진다. */}
        <main id="main" tabIndex={-1}>
            <HeroSection />
            <TechEvalSection />
        </main>
        {/* 마지막 스택 페이지 — 데스크톱에서는 뷰포트 하단에 맞추고, 모바일에서는 자연 흐름에 둔다 */}
        <div
            id="site-info"
            tabIndex={-1}
            data-stack-page
            className="stack-page bg-background relative md:flex md:h-dvh md:flex-col md:justify-end"
        >
            <Footer />
        </div>
    </StackPager>
)

export default MainPage
