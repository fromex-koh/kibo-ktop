'use client'

import {useEffect, useRef, useState} from 'react'
import Image, {type StaticImageData} from 'next/image'
import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import Reveal from './reveal'
import kBigxReportVisual from '../../../public/images/main-hero/k-bigx-report.webp'
import patentEvaluationVisual from '../../../public/images/main-hero/patent-evaluation.webp'
import techEvaluationVisual from '../../../public/images/main-hero/tech-evaluation.webp'

type Service = {
    title: string
    headline: React.ReactNode
    descriptionTitle: string
    description: string
    tags: string[]
    image: StaticImageData
}

// 텍스트·태그는 피그마 시안(type A_01 상태 프레임)을 그대로 반영한다.
const SERVICES: Service[] = [
    {
        title: '기술평가',
        headline: (
            <>
                기업이 보유한 기술의
                <br />
                가치를 증명하는 기술평가
            </>
        ),
        descriptionTitle: '기술평가란?',
        description:
            'K-TOP 기술평가는 기술사업성 평가부터 혁신역량 진단, 투자 적합성 분석까지 3개 평가모형을 통합 제공합니다. 신청 목적에 맞는 모형을 선택하면 하나의 입력 절차로 평가가 진행됩니다.',
        tags: ['기술력 진단', '기술등급', '성장 가능성', '기업평가', '보증·투자 연계'],
        image: techEvaluationVisual,
    },
    {
        title: '특허평가',
        headline: (
            <>
                특허번호 입력만으로
                <br />
                확인할 수 있는
                <br />
                객관적 특허가치
            </>
        ),
        descriptionTitle: '특허평가(K-PAS)란?',
        description:
            '특허번호 입력만으로 특허의 기술성·권리성·시장성을 종합 분석하여 전체 특허 대비 상대적 위치를 AAA~C 9개 등급으로 산출합니다.',
        tags: ['특허가치', '특허등급', '기술가치평가', '온라인 평가', 'K-PAS'],
        image: patentEvaluationVisual,
    },
    {
        title: 'K-BIGx 보고서',
        headline: (
            <>
                기업과 산업 데이터를 연결한
                <br />
                K-BIGx 분석 보고서
            </>
        ),
        descriptionTitle: 'K-BIGx 보고서란?',
        description:
            '기업·기술·특허·산업 데이터를 연계해 기업의 현황과 성장 가능성을 다각도로 확인할 수 있도록 구성한 데이터 기반 분석 보고서입니다.',
        tags: ['기업 분석', '산업 분석', '기술 분석', '특허 분석', '데이터 보고서'],
        image: kBigxReportVisual,
    },
    {
        // 시안 목차의 4번째 항목 — 활성 상태 시안이 아직 없어 콘텐츠는 임시값이다.
        title: '탄소중립',
        headline: (
            <>
                탄소중립 전환을 준비하는
                <br />
                기업을 위한 탄소중립 평가
            </>
        ),
        descriptionTitle: '탄소중립 평가란?',
        description:
            '기업의 온실가스 배출 현황과 감축 역량을 진단해 탄소중립 전환 전략 수립을 지원하는 평가 서비스입니다.',
        tags: ['탄소중립', '온실가스 진단', '감축 전략', 'ESG'],
        // 전용 비주얼 미확보 — 확보 전까지 기술평가 비주얼을 임시 재사용한다.
        image: techEvaluationVisual,
    },
]

// 섹션이 뷰포트에 이만큼 들어왔을 때 롤링을 시작/리셋한다.
const SECTION_IN_VIEW_THRESHOLD = 0.5

// 두 번째 화면. 세로 레일의 진행 바가 완료되면 다음 서비스로 전환하며 마지막 이후 처음부터 반복한다.
// 일시정지 컨트롤은 시안 확정으로 제거됨(KWCAG 6.2.2 자동 전환 정지 수단은 검수 단계에서 재논의).
const TechEvalSection = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isInView, setIsInView] = useState(false)
    // 목차·CTA 버튼에 호버/포커스 중이면 진행 바를 멈추고, 벗어나면 멈춘 지점부터 이어서 재생한다.
    const [isPaused, setIsPaused] = useState(false)
    const activeService = SERVICES[activeIndex]

    // 화면 밖에서는 롤링을 멈추고, 히어로에서 내려와 섹션에 진입할 때마다 항상 첫 서비스부터 시작한다.
    useEffect(() => {
        const element = sectionRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry?.isIntersecting ?? false
                setIsInView(inView)
                if (inView) setActiveIndex(0)
            },
            {threshold: SECTION_IN_VIEW_THRESHOLD},
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    const showNextService = () => {
        setActiveIndex((current) => (current + 1) % SERVICES.length)
    }

    return (
        <section
            ref={sectionRef}
            data-stack-page
            aria-labelledby="tech-eval-title"
            className="bg-background relative flex min-h-dvh snap-start flex-col py-28 md:pt-50"
        >
            <div className="grid-layout w-full items-start gap-y-16">
                {/* 좌: 세로 레일 + 서비스 목차. 각 서비스는 레일 전체 높이를 진행 바로 쓰고,
                    채움이 끝나면 다음 서비스로 전환되며 채움은 처음부터 다시 시작한다(key 리셋). */}
                <ul className="relative col-span-4 flex flex-col gap-6 pl-11 md:col-span-4 xl:col-span-5">
                    <div
                        aria-hidden="true"
                        className="bg-foreground-subtle absolute inset-y-0 left-0 w-1 overflow-hidden"
                    >
                        {/* 화면 안에 있을 때만 진행 바가 돌고, 벗어나면 멈춘다(재진입 시 첫 서비스부터) */}
                        {isInView && (
                            <span
                                key={activeIndex}
                                data-paused={isPaused}
                                onAnimationEnd={showNextService}
                                className="tech-service-progress-fill bg-main-accent absolute inset-0 origin-top"
                            />
                        )}
                    </div>

                    {SERVICES.map((service, index) => {
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
                                    className={cn(
                                        'cursor-pointer text-left transition-colors',
                                        isActive
                                            ? 'typo-title-l-bold text-main-accent'
                                            : 'typo-title-l-medium text-muted-foreground hover:text-foreground-subtle',
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
                                            index < SERVICES.length - 1 && 'mb-24',
                                        )}
                                    >
                                        <h2
                                            id="tech-eval-title"
                                            className="typo-display-xl-bold text-foreground break-keep"
                                        >
                                            {service.headline}
                                        </h2>
                                        <Button
                                            size="xl"
                                            asChild
                                            className="border-muted bg-muted text-foreground text-lg font-bold not-disabled:hover:bg-gray-200 not-disabled:active:bg-gray-50"
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
                                    </Reveal>
                                )}
                            </li>
                        )
                    })}
                </ul>

                <Reveal className="col-span-4 flex flex-col gap-5 motion-safe:delay-150 md:col-span-4 xl:col-span-6 xl:col-start-7">
                    <div key={`visual-${activeIndex}`} className="tech-service-content-enter">
                        <Image
                            src={activeService.image}
                            alt=""
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="h-auto w-full rounded-2xl"
                        />
                    </div>

                    <div key={`description-${activeIndex}`} className="tech-service-content-enter flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="typo-title-m-bold text-foreground">{activeService.descriptionTitle}</h3>
                            <p className="typo-body-xl-regular text-foreground">{activeService.description}</p>
                        </div>

                        <ul className="flex flex-wrap gap-2">
                            {activeService.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="typo-body-l-medium border-foreground-subtle text-foreground rounded-sm border px-3 py-2"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

export default TechEvalSection
