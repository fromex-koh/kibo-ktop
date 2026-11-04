import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 서비스 소개 띠 — 화면 제목 아래에서 그 서비스가 무엇인지 한눈에 알려 주는 자리다.
// 왼쪽에 분류어(eyebrow) · 제목 · 설명이 오고, 오른쪽에 일러스트가 온다(특허 등급조회의 KPAS 소개).
//
// 바탕은 따로 칠하지 않는다 — 화면 배경 위에 글과 그림만 놓이는 시안이다.
// 1024 미만(태블릿 · 모바일)에서는 그림이 글 아래 가운데로 내려가고 글이 한 줄을 다 쓴다 — 태블릿에서 나란히 두면
// 그림(440)이 폭의 절반을 차지해 제목 · 설명이 한 줄에 몇 글자씩 끊긴다.

type ServiceIntroBannerProps = {
    /** 제목 위 한 줄. 서비스의 영문 약칭처럼 짧은 말이다. */
    eyebrow?: string
    title: string
    /** 설명. 줄마다 한 항목으로 주면 시안처럼 줄이 나뉜다. */
    descriptions?: readonly string[]
    /** 오른쪽 그림. 폭 440(시안) 안에서 제 비율대로 줄어든다. next/image 에 width·height 를 주어 넘긴다. */
    illustration?: ReactNode
    /** 설명 아래 동작(예: [자세히보기] 글자 버튼). 설명과 24 떨어진다. */
    action?: ReactNode
    /**
     * 그림 뒤 원형 그라데이션(연한 파랑 → 투명). 그림 폭의 140% 원이 그림 가운데 뒤에 놓인다.
     * 1024 미만에서는 그림을 숨기고 원만 띠 오른쪽 위(제목 뒤)에 남긴다.
     * 색은 service-intro-glow · service-intro-glow-soft 토큰이 라이트 · 다크를 나눈다. K-BIGx 보고서 · 특허 등급조회 소개 띠가 켠다.
     * 맨 뒤 층(-z-10)에 깔리므로 감싼 화면 틀에 isolate 가 있어야 보인다(K-BIGx 는 KbigxReportFrame 이 준다).
     */
    hasIllustrationGlow?: boolean
    /** 제목의 문서 단계. 화면 제목(h1) 아래에 놓이므로 기본은 2 다[6.4.2]. */
    headingLevel?: 2 | 3
    className?: string
}

const ServiceIntroBanner = ({
    eyebrow,
    title,
    descriptions,
    illustration,
    action,
    hasIllustrationGlow = false,
    headingLevel = 2,
    className,
}: ServiceIntroBannerProps) => {
    const Heading = headingLevel === 2 ? 'h2' : 'h3'

    return (
        <section
            className={cn(
                'flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between',
                // 1024 미만에서 원이 띠 오른쪽 위에 걸리는 기준.
                hasIllustrationGlow && 'relative',
                className,
            )}
        >
            <div className="flex min-w-0 flex-col">
                {eyebrow ? <p className="typo-body-xl-bold break-keep text-blue-600">{eyebrow}</p> : null}
                <Heading className="typo-h1-bold text-foreground mt-1 break-keep">{title}</Heading>
                {descriptions?.length ? (
                    <div className="typo-body-xl-regular text-label-foreground mt-6 flex flex-col">
                        {descriptions.map((description) => (
                            <p key={description} className="break-keep">
                                {description}
                            </p>
                        ))}
                    </div>
                ) : null}
                {action ? <div className="mt-6 flex">{action}</div> : null}
            </div>
            {/* 그림 자리 — 그림이 정보를 더하지 않으므로 꾸밈이다[5.1.1]. 좁은 화면에서는 폭에 맞춰 줄어든다. */}
            {illustration ? (
                <div
                    aria-hidden="true"
                    className={cn(
                        'mx-auto w-full max-w-110 shrink-0 lg:mx-0',
                        // 원을 켜면 1024 미만은 그림 자리를 띠 전체에 겹쳐 두고(흐름에서 빠짐) 원만 남긴다.
                        hasIllustrationGlow &&
                            'pointer-events-none absolute inset-0 max-w-none lg:relative lg:inset-auto lg:max-w-110',
                    )}
                >
                    {/* 그림 뒤 원 — 가운데 진한 색 → 28% 옅은 색 → 72% 에서 투명해져 가장자리가 바탕에 녹는다.
                          · 1024 이상: 그림 폭의 정사각형을 140% 로 키워 그림 가운데 뒤에 둔다(그림 440 → 원 616).
                          · 1024 미만: 그림은 숨기고, 원(320 · 640 이상 520)을 띠 오른쪽 위에 걸쳐 제목 뒤에 겹친다.
                        원 가장자리가 화면 제목 줄(브레드크럼)까지 닿으므로 클릭을 막지 않게 한다. */}
                    {hasIllustrationGlow ? (
                        <span className="from-service-intro-glow via-service-intro-glow-soft pointer-events-none absolute -top-14 -right-19 -z-10 size-80 rounded-full bg-radial via-28% to-transparent to-72% sm:-right-40 sm:size-130 lg:top-1/2 lg:right-auto lg:left-1/2 lg:aspect-square lg:h-auto lg:w-full lg:-translate-x-1/2 lg:-translate-y-1/2 lg:scale-140" />
                    ) : null}
                    {hasIllustrationGlow ? <div className="max-lg:hidden">{illustration}</div> : illustration}
                </div>
            ) : null}
        </section>
    )
}

export {ServiceIntroBanner}
export type {ServiceIntroBannerProps}
