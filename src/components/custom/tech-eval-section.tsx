'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import Reveal from './reveal'
import {useStackPagerActivePage} from './stack-pager'
import {TECH_EVAL_CTA_FILL_CLASS, TechEvalServiceVisual, buildTechEvalServices} from './tech-eval-services'
import {stackPageClassName} from '@/components/theme/stack-pager.variants'

// 목차(롤링)와 모바일 목록을 가르는 조건 — 아래 max-md:hidden · md:hidden 과 같은 값이어야 한다.
// 값이 어긋나면 두 벌이 함께 보이거나 둘 다 사라지므로 tokens.json 의 breakpoint.md 와 한 세트로 검증한다.
export const TECH_EVAL_DESKTOP_QUERY = '(min-width: 768px)'

// 화면 폭 판정 — 마운트 전에는 undefined 다. 서버가 그린 첫 화면에서는 두 벌을 그대로 두고(지금까지와 같다)
// 마운트한 뒤에 맞는 한 벌만 남긴다. 감춰져 있던 쪽이 DOM 에서 빠져야 같은 주소·같은 이름의 링크가 두 번
// 생기지 않는다(WAVE "Redundant link"). 첫 그림에서 곧바로 한쪽만 그리면 반대 화면에서 잘못된 배치가
// 한 프레임 보이므로 이 순서를 지킨다.
const useIsDesktopWidth = () => {
    const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const query = window.matchMedia(TECH_EVAL_DESKTOP_QUERY)
        const sync = () => setIsDesktop(query.matches)

        sync()
        query.addEventListener('change', sync)
        // change 만으로는 개발자도구의 화면 크기 재정의처럼 미디어쿼리 이벤트가 오지 않는 환경에서
        // 갈래가 그대로 남는다 — resize 도 함께 듣고 같은 판정을 다시 돌린다.
        window.addEventListener('resize', sync)
        return () => {
            query.removeEventListener('change', sync)
            window.removeEventListener('resize', sync)
        }
    }, [])

    return isDesktop
}

// 두 번째 화면. 세로 레일의 진행 바가 완료되면 다음 서비스로 전환하며 마지막 이후 처음부터 반복한다.
// 일시정지 컨트롤은 시안 확정으로 제거됨(KWCAG 6.2.2 자동 전환 정지 수단은 검수 단계에서 재논의).
const TechEvalSection = ({
    technologyEvaluationHref,
    bottomContent,
    mobileContent,
}: {
    // [기술평가] 시작하기 CTA 가 갈 곳 — 기업 홈·기관 홈이 각자의 Tech-Index 선택 화면을 넘긴다.
    technologyEvaluationHref: string
    bottomContent?: ReactNode
    mobileContent?: ReactNode
}) => {
    const services = buildTechEvalServices(technologyEvaluationHref)
    const stackPage = useStackPagerActivePage()
    const isDesktop = useIsDesktopWidth()
    const [activeIndex, setActiveIndex] = useState(0)
    const [entrySequence, setEntrySequence] = useState(0)
    const previousStackPageRef = useRef(stackPage)
    // 목차·CTA 버튼에 호버/포커스 중이면 진행 바를 멈추고, 벗어나면 멈춘 지점부터 이어서 재생한다.
    const [isPaused, setIsPaused] = useState(false)
    const activeService = services[activeIndex]

    // 두 번째 섹션에 새로 진입할 때만 첫 서비스와 진행 시간을 초기화한다.
    // 실제 스크롤 위치나 StackPager 전환 상태는 변경하지 않아 페이지 이동과 독립적으로 동작한다.
    useEffect(() => {
        const hasEnteredThirdSection = stackPage === 2 && previousStackPageRef.current !== 2

        if (hasEnteredThirdSection) {
            setActiveIndex(0)
            setIsPaused(false)
            setEntrySequence((current) => current + 1)
        }

        previousStackPageRef.current = stackPage
    }, [stackPage])

    const showNextService = () => {
        setActiveIndex((current) => (current + 1) % services.length)
    }

    return (
        <section
            id="tech-eval"
            tabIndex={-1}
            data-stack-page
            aria-label="기술평가 서비스"
            className={cn(
                stackPageClassName,
                // md 이상은 원래 디자인 높이가 뷰포트를 넘을 수 있어 섹션 안에서 이어서 스크롤한다.
                // 세로 여백은 섹션이 아니라 롤링 블록이 잡는다 — 첫 화면을 정확히 한 화면(dvh)으로
                // 두고 그 안에서 시안 간격을 맞춰야 하는데, 섹션에 주면 아래 푸터까지 함께 밀린다.
                'bg-background relative flex min-h-dvh flex-col py-28 md:h-dvh md:min-h-0 md:overflow-y-auto md:pt-0',
                // 푸터가 이 페이지의 마지막 요소라 아래 여백을 섹션이 아니라 푸터 자신이 끝낸다 —
                // 그대로 두면 푸터 밑으로 섹션 padding 만큼 빈 배경 띠가 남는다.
                bottomContent && 'pb-0',
            )}
        >
            {/* 모바일은 자동 전환 없이 펼쳐 읽는 목록, md 이상은 롤링 레일 — 둘 중 하나만 노출한다.
                롤링 쪽은 노출 제어를 바깥 래퍼가 맡는다. grid-layout 은 display 를 지정하는 프로젝트
                유틸리티라 같은 요소에 hidden 을 얹으면 생성 순서상 grid-layout 이 이겨 숨지 않는다. */}
            {mobileContent && isDesktop !== true ? (
                <div data-mobile-tech-content className="md:hidden">
                    {mobileContent}
                </div>
            ) : null}
            {/* 롤링 블록 — 시안(1920×1080) 기준 헤더 아래 80px, 세로 레일 끝 아래 100px 이다.
                위 여백은 고정 헤더(112) 자리에 시안 80px 을 같은 비율(80/1080 = 7.4vh)로 더하고,
                아래 여백도 같은 규칙(100/1080 = 9.26vh)이라 어느 높이에서든 80:100 비례가 유지된다.
                블록 높이는 내용이 정한다 — 화면 높이로 고정하면 남는 높이가 컬럼에 붙어 태그 줄과
                세로 레일이 시안보다 아래에서 끝난다. */}
            {isDesktop !== false ? (
                <div
                    data-rolling-tech-content
                    className="w-full max-md:hidden md:pt-[calc(--spacing(28)+clamp(--spacing(6),7.4vh,--spacing(20)))] md:pb-[clamp(--spacing(8),9.26vh,--spacing(25))]"
                >
                    <div className="grid-layout w-full items-start gap-y-16">
                        {/* 좌: 세로 레일 + 서비스 목차. 각 서비스는 레일 전체 높이를 진행 바로 쓰고,
                    채움이 끝나면 다음 서비스로 전환되며 채움은 처음부터 다시 시작한다(key 리셋).
                    레일은 ul 밖에 둔다 — ul 은 li 만 자식으로 가질 수 있어 안에 넣으면 마크업 오류다. [KWCAG 8.1.1] */}
                        <div className="relative col-span-4 min-w-0 md:col-span-4 xl:col-span-5">
                            <div
                                aria-hidden="true"
                                className="bg-foreground-subtle absolute inset-y-0 left-0 w-1 overflow-hidden"
                            >
                                <span
                                    className="bg-main-accent absolute inset-x-0 top-0"
                                    style={{height: `${(activeIndex / services.length) * 100}%`}}
                                />
                                <span
                                    key={`${entrySequence}-${activeIndex}`}
                                    data-paused={isPaused}
                                    style={{
                                        top: `${(activeIndex / services.length) * 100}%`,
                                        height: `${100 / services.length}%`,
                                    }}
                                    onAnimationEnd={showNextService}
                                    // 진행바 정지 — 목차 버튼 호버/포커스 중이거나, 이 섹션이 비활성 스택 페이지일 때.
                                    className="animate-tech-progress bg-main-accent pager-on:[[data-stack-page]:not([data-stack-state=active])_&]:[animation-play-state:paused] absolute inset-x-0 origin-top data-[paused=true]:[animation-play-state:paused] motion-reduce:scale-y-100 motion-reduce:animate-none"
                                />
                            </div>

                            {/* h-full + 활성 항목 grow — 남는 높이를 활성 항목 아래(=다음 목차와의 사이)로 몰아
                            세로 레일이 컬럼 끝까지 닿게 한다. 나머지 항목 간격은 gap-6 로 고정이다. */}
                            <ul className="flex h-full flex-col gap-6 pl-11">
                                {services.map((service, index) => {
                                    const isActive = index === activeIndex

                                    return (
                                        <li key={service.title} className="relative">
                                            <button
                                                type="button"
                                                aria-current={isActive ? 'true' : undefined}
                                                onClick={() => setActiveIndex(index)}
                                                onMouseEnter={() => setIsPaused(true)}
                                                onMouseLeave={() => setIsPaused(false)}
                                                onFocus={() => setIsPaused(true)}
                                                onBlur={() => setIsPaused(false)}
                                                // 반응형 크기: 모바일 text-lg(18px) → md text-xl(20px). PC(md+)는 원래
                                                // typo-title-l 과 동일(20px·행간 1.5). 메인페이지 예외(SHADCN.md 타이포 유틸 예외).
                                                className={cn(
                                                    'cursor-pointer text-left transition-colors',
                                                    // leading-normal 은 text-lg 뒤에 둔다 — 앞에 두면 twMerge 가 text-*(자체 행간
                                                    // 포함)와 충돌로 제거해 PC 행간이 1.5→1.4 로 바뀐다.
                                                    isActive
                                                        ? 'text-main-accent text-lg leading-normal font-bold md:text-xl'
                                                        : 'text-muted-foreground hover:text-foreground-subtle text-lg leading-normal font-medium md:text-xl',
                                                )}
                                            >
                                                {service.title}
                                            </button>

                                            {isActive && (
                                                // 아래 여백은 다음 목차 항목과의 간격 — 마지막 항목이 활성일 땐 아래 항목이 없어
                                                // 빼야 레일(진행 바)이 버튼 라인에 맞춰 끝난다.
                                                // 시안(1920×1080)에서 CTA 아래부터 다음 목차까지가 181px 이다. 목록의
                                                // 기본 간격(gap-6 = 24)이 더해지므로 여기서 잡는 값은 157 이다.
                                                //
                                                // 우측 사진의 상한과 같은 식을 쓴다 — 목차 컬럼도 한 화면에 들어가야 해서,
                                                // 화면높이 - 헤더(112) - 위여백(7.4vh) - 아래여백(9.26vh) - 나머지 목차(396)
                                                // = 83.34vh - 508 이 이 여백이 쓸 수 있는 최대치다. 뷰포트 798px 이상에서는
                                                // 이 값이 157 을 넘어 상한에 걸리므로 시안 수치가 그대로 나온다.
                                                <Reveal
                                                    className={cn(
                                                        'mt-4 flex flex-col items-start gap-6',
                                                        index < services.length - 1 &&
                                                            'mb-[clamp(--spacing(4),calc(83.34vh---spacing(127)),--spacing(39.25))]',
                                                    )}
                                                >
                                                    {/* 시안(type A_01) 40px·ExtraBold·행간 1.4. 좁은 화면에서는 32px 까지 유동 축소한다.
                                            typo-* 는 생성기가 찍는 plain 클래스라 반응형 변형을 못 받는다. 메인페이지 예외
                                            (SHADCN.md 타이포 유틸 예외 참고). max-w-full 로 컬럼 내 줄바꿈. */}
                                                    <h2
                                                        id="tech-eval-title"
                                                        className="text-foreground max-w-full text-[clamp(--spacing(8),calc(--spacing(6)+2.1vw),--spacing(10))] leading-[var(--raw-line-height-tight)] font-extrabold break-keep"
                                                    >
                                                        {service.headline}
                                                    </h2>
                                                    {/* PROJECT-STYLE: 프로젝트 버튼 표준은 interactive:hover(=@media hover:hover)로
                                            터치 기기에서 hover 가 고정되지 않게 한다(not-disabled:hover 는 탭 후 밝은 상태가
                                            남음). 색은 스킨 반영 --ds-gray-*(mainpage 다크에서 hover #40454c·active #272a2e —
                                            은은한 다크)라 라이트/다크 다른 버튼엔 영향 없다. */}
                                                    <Button
                                                        size="lg"
                                                        asChild
                                                        className={cn(TECH_EVAL_CTA_FILL_CLASS, 'text-lg')}
                                                    >
                                                        {/* aria-label — 보이는 문구가 "시작하기" 뿐이라 링크만 훑을 때
                                                    무엇을 시작하는지 알 수 없다. 서비스명을 붙인다. [KWCAG 6.4.3] */}
                                                        <Link
                                                            href={service.ctaHref}
                                                            aria-label={`${service.title} 시작하기`}
                                                            onMouseEnter={() => setIsPaused(true)}
                                                            onMouseLeave={() => setIsPaused(false)}
                                                            onFocus={() => setIsPaused(true)}
                                                            onBlur={() => setIsPaused(false)}
                                                        >
                                                            시작하기
                                                            <ArrowRight aria-hidden="true" />
                                                        </Link>
                                                    </Button>

                                                    {/* 모바일(md 미만): 이미지+설명을 버튼 바로 아래에 둔다. md 이상은 우측 컬럼이 담당. */}
                                                    <div
                                                        key={`visual-mobile-${entrySequence}-${activeIndex}`}
                                                        className="animate-tech-enter flex w-full flex-col gap-5 motion-reduce:animate-none md:hidden"
                                                    >
                                                        <TechEvalServiceVisual service={service} />
                                                    </div>
                                                </Reveal>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* 우측 비주얼은 md 이상에서만 표시(md 미만은 활성 목차의 버튼 아래 배치가 담당). */}
                        <Reveal className="hidden flex-col gap-5 motion-safe:delay-150 md:col-span-4 md:flex xl:col-span-6 xl:col-start-7">
                            <div
                                key={`visual-${entrySequence}-${activeIndex}`}
                                className="animate-tech-enter flex flex-col gap-5 motion-reduce:animate-none"
                            >
                                <TechEvalServiceVisual service={activeService} />
                            </div>
                        </Reveal>
                    </div>
                </div>
            ) : null}
            {bottomContent}
        </section>
    )
}

export default TechEvalSection
