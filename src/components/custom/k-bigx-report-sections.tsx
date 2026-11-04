import type {ReactNode} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {ServiceIntroBanner} from '@/components/composite/service-intro-banner'
import {INNOVATION_GROWTH_INTRO} from '@/content/service/innovation-growth-report'
import {cn} from '@/lib/utils'

// K-BIGx 보고서 화면들의 머리 — 화면 제목 · 브레드크럼(홈 · K-BIGx 보고서 · 화면 이름) · K-BIGx 소개 띠.
// 기업혁신성장(기업 · 기관)과 대량정보조회(기관)가 함께 쓰고, 제목과 홈 주소, [자세히보기] 유무만 다르다.
//
// 화면에서는 KbigxReportFrame 만 쓴다(머리 KbigxReportIntro 는 내보내지 않는다). 소개 띠의 그림 뒤 원(hasIllustrationGlow)과
// 검색 카드 글로우(SelectSearchForm hasGlow)는 맨 뒤 층(-z)에 깔려, 감싼 틀에 isolate 가 있어야 보인다 —
// KbigxReportFrame 이 isolate 를 갖고 있어 화면에서 따로 챙길 필요가 없다.

type KbigxReportIntroProps = {
    /** 화면 제목이자 브레드크럼 마지막 단계. */
    title: string
    /** 브레드크럼 '홈'의 주소 — 기업 /corp/home · 기관 /org/home. */
    homeHref: string
    /** 소개 띠의 [자세히보기] 주소(K-BIGx 보고서 소개 화면). 비우면 버튼을 두지 않는다(대량정보조회 시안). */
    moreHref?: string
}

const KbigxReportIntro = ({title, homeHref, moreHref}: KbigxReportIntroProps) => (
    <>
        <PageTitleBar
            title={title}
            breadcrumb={
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={homeHref}>홈</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>K-BIGx 보고서</BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
        />
        {/* 그림은 꾸밈이다[5.1.1]. 그림 뒤에 원형 그라데이션을 깐다(hasIllustrationGlow). */}
        <ServiceIntroBanner
            eyebrow={INNOVATION_GROWTH_INTRO.eyebrow}
            title={INNOVATION_GROWTH_INTRO.title}
            descriptions={INNOVATION_GROWTH_INTRO.descriptions}
            hasIllustrationGlow
            action={
                moreHref ? (
                    <Button asChild variant="text-underline" size="md">
                        <Link href={moreHref}>
                            {INNOVATION_GROWTH_INTRO.moreLabel}
                            <ChevronRight aria-hidden="true" />
                        </Link>
                    </Button>
                ) : undefined
            }
            illustration={
                <Image
                    src="/images/service-intro/ai-robot-donut-chart.webp"
                    alt=""
                    width={1320}
                    height={720}
                    sizes="440px"
                    draggable={false}
                    preload
                    className="h-auto w-full"
                />
            }
        />
    </>
)

type KbigxReportFrameProps = KbigxReportIntroProps & {
    /** 머리 아래 본문(검색 · 탭 등). 머리와 본문 사이는 40 이다. */
    children: ReactNode
    className?: string
}

// K-BIGx 보고서 화면 틀 — 페이지 그리드(grid-layout) + 머리 + 본문. 세로 간격 40, 위 40 · 아래 60.
// isolate: 틀 안에 쌓임 맥락을 만들어, 원 · 글로우(-z)가 화면 바탕 위 · 제목 줄 · 탭 · 입력 카드 · 안내 글 아래에 놓이게 한다.
const KbigxReportFrame = ({children, className, ...intro}: KbigxReportFrameProps) => (
    <div className={cn('grid-layout isolate gap-y-10 pt-10 pb-15 *:col-span-full', className)}>
        <KbigxReportIntro {...intro} />
        {children}
    </div>
)

export {KbigxReportFrame}
export type {KbigxReportFrameProps}
