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
    headingLevel = 2,
    className,
}: ServiceIntroBannerProps) => {
    const Heading = headingLevel === 2 ? 'h2' : 'h3'

    return (
        <section className={cn('flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between', className)}>
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
                <div aria-hidden="true" className="mx-auto w-full max-w-110 shrink-0 lg:mx-0">
                    {illustration}
                </div>
            ) : null}
        </section>
    )
}

export {ServiceIntroBanner}
export type {ServiceIntroBannerProps}
