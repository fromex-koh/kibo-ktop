'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import Reveal from './reveal'
import {useStackPagerActivePage} from './stack-pager'
import {TECH_EVAL_SERVICES, TechEvalServiceVisual} from './tech-eval-services'

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
            className="stack-page bg-background relative flex min-h-dvh flex-col py-28 md:h-dvh md:min-h-0 md:pt-50"
        >
            {mobileContent ? <div data-mobile-tech-content>{mobileContent}</div> : null}
            <div data-rolling-tech-content className="grid-layout w-full items-start gap-y-16">
                {/* 좌: 세로 레일 + 서비스 목차. 각 서비스는 레일 전체 높이를 진행 바로 쓰고,
                    채움이 끝나면 다음 서비스로 전환되며 채움은 처음부터 다시 시작한다(key 리셋). */}
                <ul className="relative col-span-4 flex min-w-0 flex-col gap-6 pl-11 md:col-span-4 xl:col-span-5">
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
                            className="tech-service-progress-fill bg-main-accent absolute inset-x-0 origin-top"
                        />
                    </div>

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
                                        {/* 반응형 크기: 모바일 text-4xl(36px) → md text-5xl(48px). typo-* 는
                                            md: 변형을 못 받아(plain 클래스) Tailwind 기본 text-* 를 반응형으로 쓴다.
                                            leading-normal 은 원래 typo-display-xl-bold 행간(1.5) 유지. 메인페이지
                                            예외(SHADCN.md 타이포 유틸 예외 참고). max-w-full 로 컬럼 내 줄바꿈. */}
                                        <h2
                                            id="tech-eval-title"
                                            className="text-foreground max-w-full text-4xl leading-normal font-bold break-keep md:text-5xl"
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
                                            className="border-muted bg-muted text-foreground interactive:hover:bg-gray-200 interactive:active:bg-gray-50 text-lg font-bold"
                                        >
                                            <Link
                                                href="#"
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
                                            className="tech-service-content-enter flex w-full flex-col gap-5 md:hidden"
                                        >
                                            <TechEvalServiceVisual service={service} />
                                        </div>
                                    </Reveal>
                                )}
                            </li>
                        )
                    })}
                </ul>

                {/* 우측 비주얼은 md 이상에서만 표시(md 미만은 활성 목차의 버튼 아래 배치가 담당). */}
                <Reveal className="hidden flex-col gap-5 motion-safe:delay-150 md:col-span-4 md:flex xl:col-span-6 xl:col-start-7">
                    <div
                        key={`visual-${entrySequence}-${activeIndex}`}
                        className="tech-service-content-enter flex flex-col gap-5"
                    >
                        <TechEvalServiceVisual service={activeService} />
                    </div>
                </Reveal>
            </div>
            {bottomContent}
        </section>
    )
}

export default TechEvalSection
