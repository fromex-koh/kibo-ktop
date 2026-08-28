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

export const metadata: Metadata = {title: 'K-BIGx 보고서 소개'}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 원고 연동 전까지 표시하는 임시 섹션은 실제 콘텐츠로 교체한다.
const CorpPlatformKBigxReportPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
            <PageTitleBar
                title="K-BIGx 보고서 소개"
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
                                <BreadcrumbPage>K-BIGx 보고서 소개</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <section
                className="bg-background grid min-h-100 place-items-center px-6"
                aria-labelledby="platform-k-bigx-report-placeholder-title"
            >
                <h2 id="platform-k-bigx-report-placeholder-title" className="typo-title-l-bold text-center break-keep">
                    내용 추후 업데이트
                </h2>
            </section>
        </div>
    </main>
)

export default CorpPlatformKBigxReportPage
