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
import {InquiryComplete} from '@/components/custom/inquiry-complete'

export const metadata: Metadata = {title: '문의 완료'}

// SkipNav의 #main 도착 대상. 등록 처리 후 이 화면으로 이동한다(전송 연결은 InquiryForm 주석 참고).
const OrgNoticeInquiryCompletePage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex min-h-0 flex-1 flex-col">
        <div className="content-layout flex min-h-0 flex-1 flex-col gap-0 pt-0 pb-[clamp(--spacing(6),3.5dvh,--spacing(15))] [--viewport-fit-decorative-size:clamp(var(--spacing-viewport-fit-decorative-min),14dvh,var(--spacing-action-check))] [&>:not([aria-hidden])]:shrink-0">
            <div aria-hidden="true" className="h-[clamp(--spacing(2),3.7dvh,--spacing(10))]" />
            <PageTitleBar
                title="문의하기"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>알림마당</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>문의하기</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div aria-hidden="true" className="h-[clamp(--spacing(3),5.56dvh,--spacing(15))]" />
            <InquiryComplete myPageHref="/org/mypage/inquiry-history" />
        </div>
    </main>
)

export default OrgNoticeInquiryCompletePage
