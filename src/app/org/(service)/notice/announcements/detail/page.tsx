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
import {NoticeDetail} from '@/components/custom/notice-detail'

export const metadata: Metadata = {title: '공지사항 상세'}

const LIST_HREF = '/org/notice/announcements'

// API 연동 전 화면 확인용 목업. 실제 작업에서는 상세 조회 결과로 교체한다.
// 첨부파일이 없는 글은 attachments 를 넘기지 않으면 되고, 첫 글·마지막 글은 prev·next 를 비우면 된다.
const MOCK_NOTICE_DETAIL = {
    category: 'important',
    title: '가장 최신 공지사항 제목이 출력됩니다.',
    publishedAt: '2026-08-03',
    content: '공지사항 상세내용이 출력되는 영역입니다.\n최소높이는 200px 입니다.',
    attachments: [{name: '개인정보 활용 동의서.pdf', href: '#'}],
    prev: {title: '이전 글 공지사항 제목이 출력됩니다.', href: '#'},
    next: {title: '다음 글 공지사항 제목이 출력됩니다.', href: '#'},
} as const

// SkipNav의 #main 도착 대상. 상세 본문은 NoticeDetail이 담당한다.
const OrgNoticeAnnouncementDetailPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="공지사항"
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
                                <BreadcrumbLink href={LIST_HREF}>공지사항</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>상세</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <NoticeDetail {...MOCK_NOTICE_DETAIL} listHref={LIST_HREF} />
        </div>
    </main>
)

export default OrgNoticeAnnouncementDetailPage
