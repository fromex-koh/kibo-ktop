import type {Metadata} from 'next'
import Header from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer, {MarqueeBand} from '@/components/composite/footer'
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

// 낮은 데스크톱 높이에서는 기존 타이포 크기와 이미지 비율을 유지하고 2섹션의 세로 여백만 압축한다.
// 페이지 스코프에 한정해 공용 TechEvalSection 컴포넌트와 일반 PC 레이아웃에는 영향을 주지 않는다.
const TECH_EVAL_PAGE_CLASS = [
    'md:h-dvh',
    'md:overflow-hidden',
    'md:[&_.stack-page]:!min-h-0',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:fixed',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:inset-0',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:!h-dvh',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:w-full',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:overflow-hidden',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:transition-transform',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page]:duration-600',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=active]]:z-2',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=active]]:translate-y-0',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=active]]:pointer-events-auto',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=previous]]:z-1',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=previous]]:-translate-y-full',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=previous]]:pointer-events-none',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=next]]:z-1',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=next]]:translate-y-full',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page[data-stack-state=next]]:pointer-events-none',
    '[@media_(min-width:48rem)_and_(max-height:44.999rem)]:[&_.stack-page:not([data-stack-state=active])_.tech-service-progress-fill]:[animation-play-state:paused]',
    // PC 기준(1920px) 48px을 상한으로 유지하되 좁은 PC에서는 제목만 뷰포트 폭에 맞춰 줄인다.
    'md:[&_#tech-eval_h2]:text-[clamp(1.75rem,2.5vw,3rem)]',
    'md:[&_#tech-eval_h2_span]:whitespace-nowrap',
    // xl 그리드의 비어 있는 중앙 컬럼만큼 제목 영역을 넓혀 긴 문구도 4줄을 넘지 않게 한다.
    'xl:[&_#tech-eval_h2]:!max-w-none',
    'xl:[&_#tech-eval_h2]:w-[calc(100%+5rem)]',
    // Header의 content-layout과 같은 좌우 여백·최대 폭을 사용한다.
    'md:[&_#tech-eval_.grid-layout]:!w-[min(calc(100%-2*var(--ds-grid-margin)),var(--container-content))]',
    // 제목(2.5vw)과 같은 비율로 우측 콘텐츠도 축소하며 1920px 시안의 588px을 상한으로 유지한다.
    'md:[&_#tech-eval_.grid-layout>div]:max-w-[clamp(24rem,30.625vw,36.75rem)]',
    'md:[&_#tech-eval_.grid-layout>div]:justify-self-end',
    'md:[&_#tech-eval]:!pb-0',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval]:!pt-[clamp(9.5rem,21.75dvh,12.5rem)]',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>div]:!w-full',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>div]:!max-w-[clamp(24rem,75dvh,30.5rem)]',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>div]:justify-self-end',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter>img]:max-w-[clamp(24rem,min(30.625vw,57dvh),30.5rem)]',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter>img]:ml-auto',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter>div]:max-w-[clamp(24rem,min(30.625vw,57dvh),30.5rem)]',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter>div]:ml-auto',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter_p]:text-sm',
    '[@media_(min-width:48rem)_and_(max-height:50rem)]:[&_#tech-eval_.tech-service-content-enter>img]:!max-w-[clamp(24rem,min(30.625vw,53dvh),30.5rem)]',
    '[@media_(min-width:48rem)_and_(max-height:50rem)]:[&_#tech-eval_.tech-service-content-enter>div]:!max-w-[clamp(24rem,min(30.625vw,53dvh),30.5rem)]',
    '[@media_(min-width:48rem)_and_(max-height:50rem)]:[&_#tech-eval_.tech-service-content-enter>div]:!gap-2',
    '[@media_(min-width:48rem)_and_(max-height:50rem)]:[&_#tech-eval_.tech-service-content-enter_p]:!text-xs',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout]:!gap-y-8',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>ul]:!gap-4',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>ul>li>div[data-visible]]:!mt-2',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>ul>li>div[data-visible]]:!mb-8',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.grid-layout>ul>li>div[data-visible]]:!gap-3',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter]:!gap-3',
    '[@media_(min-width:48rem)_and_(max-height:60rem)]:[&_#tech-eval_.tech-service-content-enter>div]:!gap-4',
    'md:[&_#tech-eval_.tech-eval-marquee]:!mt-auto',
    'md:[&_#tech-eval_.tech-eval-marquee>div]:!py-0',
    'md:[&_#tech-eval_.tech-eval-marquee_span]:!text-[clamp(2.75rem,min(7.3vw,calc(26.667dvh-9.25rem)),8.75rem)]',
].join(' ')

// 메인페이지 목업 — 풀스크린 스택 전환 구조.
// 너비·높이가 충분한 화면에서는 실제 문서 스크롤 없이 고정된 섹션 레이어의 상태를 transform으로 전환한다.
// 모바일과 높이가 낮은 데스크톱에서는 각 섹션이 최소 높이를 유지하며 자연스러운 문서 흐름으로 이어진다.
// 색상은 메인페이지 전용 스킨(tokens.css의 .mainpage 블록)을 따른다 — light/dark와 같은 방식으로
// theme-provider가 이 라우트에서 html 클래스에 'mainpage'를 강제한다(테마 토글과 무관하게 유지).
const MainPage = () => (
    <StackPager mediaQuery="(min-width: 768px)" className={`bg-background relative min-h-dvh ${TECH_EVAL_PAGE_CLASS}`}>
        <SkipNav links={SKIP_LINKS} />
        <Header variant="main" />
        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다.
                조작 요소가 아니라서 포커스 표시가 오히려 레이아웃을 해친다. 실제 링은 대상 안의 링크·버튼이 가진다. */}
        <main id="main" tabIndex={-1}>
            <HeroSection />
            <TechEvalSection
                bottomContent={
                    <div className="tech-eval-marquee mt-auto w-full">
                        <MarqueeBand />
                    </div>
                }
            />
        </main>
        {/* 마지막 스택 페이지 — 데스크톱에서는 뷰포트 하단에 맞추고, 모바일에서는 자연 흐름에 둔다 */}
        <div
            id="site-info"
            tabIndex={-1}
            data-stack-page
            className="stack-page bg-background relative md:flex md:h-dvh md:flex-col md:justify-end"
        >
            <Footer showMarquee={false} />
        </div>
    </StackPager>
)

export default MainPage
