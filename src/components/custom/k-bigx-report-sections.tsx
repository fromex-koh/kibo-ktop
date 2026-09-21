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

// K-BIGx 보고서 화면들의 머리 — 화면 제목 · 브레드크럼(홈 · K-BIGx 보고서 · 화면 이름) · K-BIGx 소개 띠.
// 기업혁신성장(기업 · 기관)과 대량정보조회(기관)가 함께 쓰고, 제목과 홈 주소, [자세히보기] 유무만 다르다.

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
        {/* 그림은 꾸밈이다[5.1.1]. */}
        <ServiceIntroBanner
            eyebrow={INNOVATION_GROWTH_INTRO.eyebrow}
            title={INNOVATION_GROWTH_INTRO.title}
            descriptions={INNOVATION_GROWTH_INTRO.descriptions}
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
                    src="/images/service-intro/robot-donut-chart.webp"
                    alt=""
                    width={1338}
                    height={726}
                    sizes="440px"
                    draggable={false}
                    priority
                    className="h-auto w-full"
                />
            }
        />
    </>
)

export {KbigxReportIntro}
export type {KbigxReportIntroProps}
