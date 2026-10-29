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
import {PlatformKBigxReport} from '@/components/custom/platform-k-bigx-report'
import {PLATFORM_K_BIGX_REPORT} from '@/content/service/platform-k-bigx-report'

export const metadata: Metadata = {title: 'K-BIGx 보고서 소개'}

// 플랫폼 소개 > K-BIGx 보고서 — 화면 제목 줄은 히어로 띠(화면 전체 폭) 안에 놓인다(시안). 본문은 PlatformKBigxReport.
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const CorpPlatformKBigxReportPage = () => (
    <main id="main" tabIndex={-1} className="bg-page flex-1">
        <PlatformKBigxReport
            titleBar={
                <PageTitleBar
                    title={PLATFORM_K_BIGX_REPORT.title}
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/corp/platform">플랫폼 소개</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{PLATFORM_K_BIGX_REPORT.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
            }
        />
    </main>
)

export default CorpPlatformKBigxReportPage
