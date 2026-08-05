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

// 취소 후 이동할 문의 목록 경로.
const LIST_HREF = '/'

const OrgNoticeInquiryPrivacyConsentGuidePage = () => (
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
            <div className="flex flex-col gap-6">
                <SectionHeader className="gap-y-1">
                    <SectionHeaderTitle>무엇이든 물어보세요</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        답변이 완료되면 마이페이지 또는 이메일로 확인할 수 있어요
                    </SectionHeaderDescription>
                </SectionHeader>
                {/* 2뎁스 화면 확인을 위해 개인정보 안내 모달을 열어 둔다. 본문은 문의하기 화면과 동일하다. */}
                <InquiryForm cancelHref={LIST_HREF} consentDialogDefaultOpen />
            </div>
        </div>
    </main>
)

export default OrgNoticeInquiryPrivacyConsentGuidePage
