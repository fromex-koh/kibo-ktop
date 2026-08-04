import type {Metadata} from 'next'
import Link from 'next/link'
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

export const metadata: Metadata = {title: '공지사항 상세'}

// SkipNav의 #main 도착 대상. 상세 데이터 연동 후 게시글 본문으로 교체한다.
const OrgNoticeAnnouncementDetailPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="공지사항 상세"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/notice/announcements">공지사항</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>상세</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <section
                className="bg-background grid min-h-100 place-items-center gap-6 px-6"
                aria-labelledby="notice-announcement-detail-title"
            >
                <div className="flex flex-col items-center gap-6">
                    <h2 id="notice-announcement-detail-title" className="typo-title-l-bold text-center break-keep">
                        공지사항 상세 내용은 데이터 연동 후 구성합니다.
                    </h2>
                    <Button asChild variant="tertiary" size="xl">
                        <Link href="/org/notice/announcements">목록으로</Link>
                    </Button>
                </div>
            </section>
        </div>
    </main>
)

export default OrgNoticeAnnouncementDetailPage
