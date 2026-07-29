import heroBg1 from '@public/images/main-hero/hero-bg-1.webp'
import heroBg2 from '@public/images/main-hero/hero-bg-2.webp'
import HeroBackground from './hero-background'
import HeroStatsRoller, {type HeroStat} from './hero-stats-roller'
import {
    heroCopyClassName,
    heroDescClassName,
    heroFrameClassName,
    heroGridClassName,
    heroScrollIndicatorClassName,
    heroTitleClassName,
} from '@/components/theme/hero-section.variants'
import {stackPageClassName} from '@/components/theme/stack-pager.variants'
import {cn} from '@/lib/utils'

const HERO_BACKGROUNDS = [
    {src: heroBg1, position: '50% 50%'},
    {src: heroBg2, position: '50% 50%'},
]

const HERO_STATS: HeroStat[] = [
    {id: 'patent-analysis', value: '1,350,000', label: '건의 특허분석', note: '2025년 기준'},
    {id: 'technology-evaluation', value: '92', label: '만건의 기술평가', note: '출처 : 어쩌구저쩌구'},
    {id: 'evaluation-experts', value: '1,060', label: '명의 기술평가 전문인력', note: '업계 평균 800여명'},
    {id: 'evaluation-experience', value: '30', label: '년의 평가 노하우', note: '2025년 기준'},
    {id: 'evaluation-data', value: '2.5', label: '만건의 평가정보 생성', note: '매년 기준'},
]

// 첫 화면(풀스크린 히어로). md 이상에서는 StackPager가 고정 레이어로 전환하고,
// 콘텐츠가 화면보다 길어지는 모바일에서는 자연 흐름으로 둔다.
// 색상은 mainpage 스킨(다크 기반)의 시맨틱 토큰을 쓴다 — 포인트 그린은 main-accent-* 슬롯.
const HeroSection = () => (
    // 본문 바로가기 대상 — 섹션 안에 조작 요소가 없어 섹션 전체에 포커스 링을 그려 도착 위치를 알린다.
    // outline 은 배경 이미지·딤 오버레이(absolute inset-0)가 나중에 그려지며 가려지므로,
    // 마지막에 그려지는 ::after 테두리로 표시한다. [KWCAG 6.1.2]
    <section
        id="hero"
        tabIndex={-1}
        data-stack-page
        aria-labelledby="hero-title"
        // 높이는 항상 뷰포트에 맞춘다 — 페이저가 꺼진 낮은 데스크톱만 .stack-page 의 최소 설계 높이를 받는다.
        className={cn(
            stackPageClassName,
            'focus-visible:after:border-ring relative h-dvh min-h-0 overflow-hidden outline-none focus-visible:after:pointer-events-none focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:border-2',
        )}
    >
        {/* 배경 비주얼 — 장식 이미지라 접근성 트리에서 제외한다. [KWCAG 5.1.1] */}
        <HeroBackground slides={HERO_BACKGROUNDS} />
        {/* 45% 딤은 배경 이미지 자체의 brightness로 합성하고, 하단 75% 그라디언트만
            HeroBackground 레이어에 유지해 스냅 중 이미지와 딤의 합성 시점이 어긋나지 않게 한다. */}

        {/* 세로 밀도(여백·간격·글자 크기)는 theme/hero-section.variants.ts 가 화면 높이 단계별로 담당한다. */}
        <div
            className={cn(
                heroFrameClassName,
                'relative flex items-center motion-safe:[transform:translate3d(0,calc(var(--hero-scroll-progress,0)*-3rem),0)] motion-safe:[opacity:calc(1-var(--hero-scroll-progress,0))]',
            )}
        >
            <div className={cn(heroGridClassName, 'grid-layout content-layout w-full items-start')}>
                {/* 좌측 카피. xl(1280)부터 6열, 2xl(1536)부터 7열로 넓힌다. min-w-0로 그리드 셀이 콘텐츠에 밀려
                    넘치지 않게 한다. */}
                <div className={cn(heroCopyClassName, 'col-span-4 flex min-w-0 flex-col xl:col-span-6 2xl:col-span-7')}>
                    <h1 id="hero-title" className={cn(heroTitleClassName, 'text-foreground font-bold break-keep')}>
                        <span className="xl:whitespace-nowrap">기업에 맞는 기술평가로</span>
                        <br />
                        <span className="xl:whitespace-nowrap">금융과 성장의 기회를 연결합니다</span>
                    </h1>
                    {/* PC(md+)는 typo-title-l-bold 과 동일(20px·행간 1.5). 단계별 크기는 heroDescClassName. */}
                    <p className={cn(heroDescClassName, 'text-foreground-subtle font-bold')}>
                        기술사업평가, 혁신성장지수, 투자모형, K-BIGx 보고서, 탄소중립 평가 등{' '}
                        <br className="max-md:hidden" />
                        다양한 기술평가 서비스를 통합 제공하는 플랫폼
                    </p>
                </div>

                <HeroStatsRoller stats={HERO_STATS} />
            </div>
        </div>

        <div
            aria-hidden="true"
            className={cn(
                heroScrollIndicatorClassName,
                'text-foreground pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center',
            )}
        >
            <span className="typo-title-m-bold">SCROLL</span>
            <span className="main-scroll-line-fill bg-foreground/30 relative w-px flex-1 overflow-hidden" />
        </div>
    </section>
)

export default HeroSection
