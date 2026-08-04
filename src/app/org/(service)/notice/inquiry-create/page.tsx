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
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {InquiryForm} from '@/components/custom/inquiry-form'

export const metadata: Metadata = {title: '문의하기'}

const LIST_HREF = '/org/notice/announcements'

// SkipNav의 #main 도착 대상. 입력·첨부 상태는 client 인 InquiryForm이 담당한다.
const OrgNoticeInquiryCreatePage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
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
                                <BreadcrumbLink href="#">알림마당</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>문의하기</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex flex-col gap-6">
                {/* 제목과 안내 문구 간격은 시안 4px 이라 SectionHeader 기본 간격(6)을 좁힌다. */}
                <SectionHeader className="gap-y-1">
                    <SectionHeaderTitle>무엇이든 물어보세요</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        답변이 완료되면 마이페이지 또는 이메일로 확인할 수 있어요
                    </SectionHeaderDescription>
                </SectionHeader>
                <InquiryForm cancelHref={LIST_HREF} />
            </div>
        </div>
    </main>
)

export default OrgNoticeInquiryCreatePage
