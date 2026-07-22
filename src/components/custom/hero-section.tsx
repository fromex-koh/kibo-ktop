import heroBg1 from '../../../public/images/main-hero/hero-bg-1.webp'
import heroBg2 from '../../../public/images/main-hero/hero-bg-2.webp'
import HeroBackground from './hero-background'
import HeroStatsRoller, {type HeroStat} from './hero-stats-roller'

const HERO_BACKGROUNDS = [
    {src: heroBg1, position: '50% 50%'},
    {src: heroBg2, position: '50% 50%'},
]

const HERO_STATS: HeroStat[] = [
    {id: 'patent-analysis', value: '135', label: '만건의 특허분석', note: '2025년 기준'},
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
        className="focus-visible:after:border-ring stack-page relative min-h-dvh outline-none focus-visible:after:pointer-events-none focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:border-2 md:h-dvh md:min-h-0 md:overflow-hidden"
    >
        {/* 배경 비주얼 — 장식 이미지라 접근성 트리에서 제외한다. [KWCAG 5.1.1] */}
        <HeroBackground slides={HERO_BACKGROUNDS} />
        {/* 시안의 딤 처리: 블랙 스크림 + 하단으로 갈수록 짙어지는 그라디언트.
            시안 원본(60%+90%)은 피그마의 이미지 노출 보정을 전제한 값이라 실사진에는 과해,
            같은 인상이 나오는 45%+75%로 조정했다. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
        <div aria-hidden="true" className="to-background/75 absolute inset-0 bg-linear-to-b from-transparent" />

        {/* 모바일 상하 패딩: 위는 고정 헤더, 아래는 SCROLL 인디케이터 자리 확보 */}
        <div className="relative flex min-h-dvh items-center pt-44 pb-32 motion-safe:[transform:translate3d(0,calc(var(--hero-scroll-progress,0)*-3rem),0)] motion-safe:[opacity:calc(1-var(--hero-scroll-progress,0))] md:h-full md:min-h-0 md:py-0">
            <div className="grid-layout w-full items-start gap-y-16">
                <div className="col-span-4 flex flex-col gap-6 md:col-span-5 xl:col-span-7">
                    <h2 id="hero-title" className="typo-display-xl-bold text-foreground break-keep">
                        기업에 맞는 기술평가로
                        <br />
                        금융과 성장의 기회를 연결합니다
                    </h2>
                    <p className="typo-title-l-bold text-foreground-subtle">
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
            className="text-foreground pointer-events-none absolute inset-x-0 bottom-0 flex h-28 flex-col items-center gap-3"
        >
            <span className="typo-title-m-bold">SCROLL</span>
            <span className="main-scroll-line-fill bg-foreground/30 relative w-px flex-1 overflow-hidden" />
        </div>
    </section>
)

export default HeroSection
