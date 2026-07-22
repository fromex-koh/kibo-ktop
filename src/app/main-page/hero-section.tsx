import heroBg1 from '../../../public/images/main-hero/hero-bg-1.webp'
import heroBg2 from '../../../public/images/main-hero/hero-bg-2.webp'
import HeroBackground from './hero-background'
import AnimatedCounter from './animated-counter'

const HERO_BACKGROUNDS = [
    {src: heroBg1, position: '50% 50%'},
    {src: heroBg2, position: '50% 50%'},
]

// 히어로 통계 — 첫 항목만 수치를 분리해 포인트 그린으로 강조하는 시안.
const HERO_STATS: {value?: string; label: string; note: string}[] = [
    {value: '135', label: '만건의 특허분석', note: '2025년 기준'},
    {label: '92만건의 기술평가', note: '출처 : 어쩌구저쩌구'},
    {label: '1,060명의 기술평가 전문인력', note: '업계 평균 800여명'},
    {label: '30년의 평가 노하우', note: '2025년 기준'},
    {label: '2.5만건의 평가정보 생성', note: '매년 기준'},
]

// 첫 화면(풀스크린 히어로). md 이상에서 뷰포트에 고정해 두면 다음 섹션이 스크롤을 따라
// 아래에서 위로 이 화면을 덮으며 올라온다(godo.co.kr 스택 전환 참고). 콘텐츠가 화면보다
// 길어지는 모바일에서는 고정하지 않고 자연 흐름으로 둔다.
// sticky가 아닌 fixed인 이유: sticky 요소는 스크롤을 따라 움직여 스냅 지점을 만들지 못해
// (히어로 위치로 되돌아오는 스냅이 사라짐) 고정은 fixed가, 스냅 지점은 페이지의 스페이서가 담당한다.
// 색상은 mainpage 스킨(다크 기반)의 시맨틱 토큰을 쓴다 — 포인트 그린은 main-accent-* 슬롯.
const HeroSection = () => (
    <section
        aria-labelledby="hero-title"
        className="relative min-h-dvh md:fixed md:inset-x-0 md:top-0 md:h-dvh md:min-h-0 md:overflow-hidden"
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

                <ul className="col-span-4 flex flex-col gap-10 md:col-span-3 md:items-end md:text-right xl:col-span-4 xl:col-start-9">
                    {HERO_STATS.map((stat) => (
                        <li key={stat.label} className="flex flex-col gap-1 md:items-end">
                            <p className="typo-title-xl-medium text-foreground flex items-baseline gap-1">
                                {stat.value ? (
                                    <strong className="typo-h1-bold text-main-accent-bright">
                                        <AnimatedCounter value={Number(stat.value)} />
                                    </strong>
                                ) : null}
                                {stat.label}
                            </p>
                            <p className="typo-caption-medium text-foreground-subtle">{stat.note}</p>
                        </li>
                    ))}
                </ul>
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
