import Image from 'next/image'
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
import {ListMarker} from '@/components/custom/list-marker'
import {PATENT_GRADE_INTRO, PATENT_GRADE_NOTICE} from '@/content/service/patent-grade'

// 특허 등급조회의 고정 영역 — 기업 · 기관의 조회 화면(patent-grade-list)과 결과 화면(patent-grade-result)이 함께 쓴다.
// 네 화면은 같은 한 화면의 '검색 전' · '검색 후' 상태라 제목 · 소개 · 주의사항이 같고, 브레드크럼의 홈 주소만 다르다.

type PatentGradeIntroProps = {
    /** 브레드크럼 '홈'의 주소 — 기업 /corp/home · 기관 /org/home. */
    homeHref: string
}

// 화면 제목 · 브레드크럼 · KPAS 소개.
const PatentGradeIntro = ({homeHref}: PatentGradeIntroProps) => (
    <>
        <PageTitleBar
            title="특허 등급조회"
            breadcrumb={
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={homeHref}>홈</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>특허평가</BreadcrumbItem>
                        <BreadcrumbDotSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>특허 등급조회</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
        />

        {/* 그림은 시안의 440×240 자리에 놓이고 좁은 화면에서는 폭에 맞춰 줄어든다. 제목·설명이 뜻을 전하므로 꾸밈이다[5.1.1]. */}
        <ServiceIntroBanner
            eyebrow={PATENT_GRADE_INTRO.eyebrow}
            title={PATENT_GRADE_INTRO.title}
            descriptions={PATENT_GRADE_INTRO.descriptions}
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

// 주의사항 — 번호가 뜻을 가지므로 번호 매김 목록으로 둔다.
const PatentGradeNotice = () => (
    <section
        aria-labelledby="patent-grade-notice-title"
        className="border-subtle-3 bg-card flex flex-col gap-4 rounded-lg border p-6 md:p-10"
    >
        <h2 id="patent-grade-notice-title" className="typo-title-l-bold text-foreground">
            {PATENT_GRADE_NOTICE.title}
        </h2>
        <ol className="typo-body-xl-regular text-foreground-subtle flex list-none flex-col gap-2">
            {PATENT_GRADE_NOTICE.items.map((item, index) => (
                <li key={item} className="flex">
                    <ListMarker type="ordered" index={index + 1} />
                    <span className="min-w-0 break-keep">{item}</span>
                </li>
            ))}
        </ol>
    </section>
)

export {PatentGradeIntro, PatentGradeNotice}
export type {PatentGradeIntroProps}
