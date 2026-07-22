import type {Metadata} from 'next'
import SkipNav from '@/components/composite/skip-nav'
import Header from '@/components/composite/header'
import StackPager from './stack-pager'
import HeroSection from './hero-section'
import TechEvalSection from './tech-eval-section'
import MainFooter from './main-footer'

export const metadata: Metadata = {title: '메인페이지'}

// 메인페이지 목업 — godo.co.kr의 풀스크린 스택 전환을 참고한 구조.
// md 이상에서는 실제 문서 스크롤 없이 고정된 섹션 레이어의 상태를 transform/opacity로 전환한다.
// 모바일에서는 각 섹션이 자연스러운 문서 흐름으로 이어진다.
// 색상은 메인페이지 전용 스킨(tokens.css의 .mainpage 블록)을 따른다 — light/dark와 같은 방식으로
// theme-provider가 이 라우트에서 html 클래스에 'mainpage'를 강제한다(테마 토글과 무관하게 유지).
const MainPage = () => (
    <StackPager className="bg-background relative min-h-dvh md:h-dvh md:overflow-hidden">
        <SkipNav links={[{href: '#main', label: '본문 바로가기'}]} />
        <Header variant="main" />
        <main id="main">
            <HeroSection />
            <TechEvalSection />
        </main>
        <MainFooter />
    </StackPager>
)

export default MainPage
