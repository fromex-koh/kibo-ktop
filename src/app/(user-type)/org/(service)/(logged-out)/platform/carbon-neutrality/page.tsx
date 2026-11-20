import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {PlatformCarbonNeutrality} from '@/components/custom/platform-carbon-neutrality'
import {PLATFORM_CARBON_NEUTRALITY} from '@/content/service/platform-carbon-neutrality'

export const metadata: Metadata = {title: '탄소중립 소개'}

// 플랫폼 소개 > 탄소중립 — 화면 제목 줄은 히어로 띠(화면 전체 폭) 안에 놓인다(시안). 본문은 PlatformCarbonNeutrality.
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const OrgPlatformCarbonNeutralityPage = () => (
    <main id="main" tabIndex={-1} className="bg-page flex-1">
        <PlatformCarbonNeutrality
            titleBar={
                <PageTitleBar
                    title={PLATFORM_CARBON_NEUTRALITY.title}
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/org/platform">플랫폼 소개</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{PLATFORM_CARBON_NEUTRALITY.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
            }
        />
    </main>
)

export default OrgPlatformCarbonNeutralityPage
