import type {Metadata} from 'next'
import SkipNav from '@/components/composite/skip-nav'
import Header from '@/components/composite/header'
import StackPager from './stack-pager'
import HeroSection from './hero-section'
import TechEvalSection from './tech-eval-section'
import MainFooter from './main-footer'

export const metadata: Metadata = {title: '메인페이지'}

// 메인페이지 목업 — godo.co.kr의 풀스크린 스택 전환을 참고한 구조.
// 페이지 자체가 스크롤 컨테이너(StackPager, h-dvh)가 되고, 히어로는 fixed로 고정된 채
// 다음 섹션이 위로 덮으며 올라온다. md 이상에서는 휠 한 번 = 한 화면 페이징 + CSS 스냅으로 정착한다.
// 색상은 메인페이지 전용 스킨(tokens.css의 .mainpage 블록)을 따른다 — light/dark와 같은 방식으로
// theme-provider가 이 라우트에서 html 클래스에 'mainpage'를 강제한다(테마 토글과 무관하게 유지).
const MainPage = () => (
    <StackPager className="bg-background h-dvh overflow-y-auto md:snap-y md:snap-mandatory">
        <SkipNav links={[{href: '#main', label: '본문 바로가기'}]} />
        <Header variant="main" />
        <main id="main">
            <HeroSection />
            {/* md 이상에서 히어로(fixed)가 차지할 자리와 스냅 지점을 흐름에 남기는 스페이서 */}
            <div aria-hidden="true" data-stack-page className="hidden h-dvh snap-start md:block" />
            <TechEvalSection />
        </main>
        <MainFooter />
    </StackPager>
)

export default MainPage
