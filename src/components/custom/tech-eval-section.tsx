'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import Reveal from './reveal'
import {useStackPagerActivePage} from './stack-pager'
import {TECH_EVAL_CTA_FILL_CLASS, TECH_EVAL_SERVICES, TechEvalServiceVisual} from './tech-eval-services'
import {stackPageClassName} from '@/components/theme/stack-pager.variants'

// 두 번째 화면. 세로 레일의 진행 바가 완료되면 다음 서비스로 전환하며 마지막 이후 처음부터 반복한다.
// 일시정지 컨트롤은 시안 확정으로 제거됨(KWCAG 6.2.2 자동 전환 정지 수단은 검수 단계에서 재논의).
const TechEvalSection = ({bottomContent, mobileContent}: {bottomContent?: ReactNode; mobileContent?: ReactNode}) => {
    const stackPage = useStackPagerActivePage()
    const [activeIndex, setActiveIndex] = useState(0)
    const [entrySequence, setEntrySequence] = useState(0)
    const previousStackPageRef = useRef(stackPage)
    // 목차·CTA 버튼에 호버/포커스 중이면 진행 바를 멈추고, 벗어나면 멈춘 지점부터 이어서 재생한다.
    const [isPaused, setIsPaused] = useState(false)
    const activeService = TECH_EVAL_SERVICES[activeIndex]

    // 두 번째 섹션에 새로 진입할 때만 첫 서비스와 진행 시간을 초기화한다.
    // 실제 스크롤 위치나 StackPager 전환 상태는 변경하지 않아 페이지 이동과 독립적으로 동작한다.
    useEffect(() => {
        const hasEnteredSecondSection = stackPage === 1 && previousStackPageRef.current !== 1

        if (hasEnteredSecondSection) {
            setActiveIndex(0)
            setIsPaused(false)
            setEntrySequence((current) => current + 1)
        }

        previousStackPageRef.current = stackPage
    }, [stackPage])

    const showNextService = () => {
        setActiveIndex((current) => (current + 1) % TECH_EVAL_SERVICES.length)
    }

    return (
        <section
            id="tech-eval"
            tabIndex={-1}
            data-stack-page
            aria-label="기술평가 서비스"
            // pager-off:snap-start — 페이저가 꺼진 화면의 스크롤 스냅 지점(StackPager 가 컨테이너 담당).
            className={cn(
                stackPageClassName,
                // md 이상은 원래 디자인 높이가 뷰포트를 넘을 수 있어 섹션 안에서 이어서 스크롤한다.
                'bg-background pager-off:snap-start relative flex min-h-dvh flex-col py-28 md:h-dvh md:min-h-0 md:overflow-y-auto md:pt-50',
            )}
        >
            {/* 모바일은 자동 전환 없이 펼쳐 읽는 목록, md 이상은 롤링 레일 — 둘 중 하나만 노출한다.
                롤링 쪽은 노출 제어를 바깥 래퍼가 맡는다. grid-layout 은 display 를 지정하는 프로젝트
                유틸리티라 같은 요소에 hidden 을 얹으면 생성 순서상 grid-layout 이 이겨 숨지 않는다. */}
            {mobileContent ? (
                <div data-mobile-tech-content className="md:hidden">
                    {mobileContent}
                </div>
            ) : null}
            <div data-rolling-tech-content className="w-full max-md:hidden">
                <div className="grid-layout content-layout w-full items-start gap-y-16">
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
                                style={{height: `${(activeIndex / TECH_EVAL_SERVICES.length) * 100}%`}}
                            />
                            <span
                                key={`${entrySequence}-${activeIndex}`}
                                data-paused={isPaused}
                                style={{
                                    top: `${(activeIndex / TECH_EVAL_SERVICES.length) * 100}%`,
                                    height: `${100 / TECH_EVAL_SERVICES.length}%`,
                                }}
                                onAnimationEnd={showNextService}
                                // 진행바 정지 — 목차 버튼 호버/포커스 중이거나, 이 섹션이 비활성 스택 페이지일 때.
                                className="animate-tech-progress bg-main-accent pager-on:[[data-stack-page]:not([data-stack-state=active])_&]:[animation-play-state:paused] absolute inset-x-0 origin-top data-[paused=true]:[animation-play-state:paused] motion-reduce:scale-y-100 motion-reduce:animate-none"
                            />
                        </div>

                        <ul className="flex flex-col gap-6 pl-11">
                            {TECH_EVAL_SERVICES.map((service, index) => {
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
                                            // mb-24는 다음 목차 항목과의 간격 — 마지막 항목이 활성일 땐 아래 항목이 없어
                                            // 빼야 레일(진행 바)이 버튼 라인에 맞춰 끝난다.
                                            <Reveal
                                                className={cn(
                                                    'mt-4 flex flex-col items-start gap-6',
                                                    index < TECH_EVAL_SERVICES.length - 1 && 'mb-24',
                                                )}
                                            >
                                                {/* 크기는 lg 미만에서 유동 축소(32~44px), lg 이상 48px. typo-* 는 생성기가 찍는
                                            plain 클래스라 반응형 변형을 못 받는다. 메인페이지 예외(SHADCN.md 타이포 유틸
                                            예외 참고). max-w-full 로 컬럼 내 줄바꿈. */}
                                                <h2
                                                    id="tech-eval-title"
                                                    className="text-foreground max-w-full text-[clamp(--spacing(8),calc(--spacing(6)+2.1vw),--spacing(11))] leading-normal font-bold break-keep lg:text-5xl"
                                                >
                                                    {service.headline}
                                                </h2>
                                                {/* PROJECT-STYLE: 프로젝트 버튼 표준은 interactive:hover(=@media hover:hover)로
                                            터치 기기에서 hover 가 고정되지 않게 한다(not-disabled:hover 는 탭 후 밝은 상태가
                                            남음). 색은 스킨 반영 --ds-gray-*(mainpage 다크에서 hover #40454c·active #272a2e —
                                            은은한 다크)라 라이트/다크 다른 버튼엔 영향 없다. */}
                                                <Button
                                                    size="xl"
                                                    asChild
                                                    className={cn(TECH_EVAL_CTA_FILL_CLASS, 'text-lg')}
                                                >
                                                    <Link
                                                        href={service.ctaHref}
                                                        onMouseEnter={() => setIsPaused(true)}
                                                        onMouseLeave={() => setIsPaused(false)}
                                                        onFocus={() => setIsPaused(true)}
                                                        onBlur={() => setIsPaused(false)}
                                                    >
                                                        자가진단 시작하기
                                                        <ArrowUpRight aria-hidden="true" />
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
            {bottomContent}
        </section>
    )
}

export default TechEvalSection
