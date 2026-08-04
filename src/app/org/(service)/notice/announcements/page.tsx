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
import {NoticeList, type NoticeItem} from '@/components/custom/notice-list'

export const metadata: Metadata = {title: '공지사항'}

// API 연동 전 화면 확인용 목업 데이터. 실제 작업에서는 이 배열과 전체 페이지 수를 조회 결과로 교체한다.
const MOCK_NOTICE_ITEMS: readonly NoticeItem[] = [
    {id: 'org-notice-001', category: 'important', title: 'K-TOP 서비스 이용 안내입니다.'},
    {id: 'org-notice-002', category: 'important', title: '기술평가 플랫폼 서비스 변경 안내입니다.'},
    {id: 'org-notice-003', category: 'general', title: '시스템 정기점검 일정을 안내드립니다.'},
    {id: 'org-notice-004', category: 'business', title: '기관 대상 신규 지원사업을 안내드립니다.'},
    {id: 'org-notice-005', category: 'general', title: '온라인 기술평가 신청 절차를 안내드립니다.'},
    {id: 'org-notice-006', category: 'business', title: '기술보증기금 주요 사업 변경사항을 안내드립니다.'},
    {id: 'org-notice-007', category: 'important', title: '개인정보 처리방침 개정 내용을 안내드립니다.'},
    {id: 'org-notice-008', category: 'general', title: '공지사항 게시판 이용 방법을 안내드립니다.'},
    {id: 'org-notice-009', category: 'business', title: '기관 혁신성장 지원 프로그램을 안내드립니다.'},
    {id: 'org-notice-010', category: 'general', title: '서비스 이용 중 자주 묻는 사항을 안내드립니다.'},
    {id: 'org-notice-011', category: 'important', title: '로그인 및 회원가입 시스템 변경 안내입니다.'},
    {id: 'org-notice-012', category: 'business', title: '기술평가 관련 설명회 일정을 안내드립니다.'},
]

const MOCK_NOTICE_PAGE_SIZE = 10

// SkipNav의 #main 도착 대상. page의 목업 데이터를 NoticeList에 전달한다.
const OrgNoticeAnnouncementsPage = () => (
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
                                <span>알림마당</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>공지사항</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <NoticeList
                items={MOCK_NOTICE_ITEMS}
                detailHref="/org/notice/announcements/detail"
                pageSize={MOCK_NOTICE_PAGE_SIZE}
            />
        </div>
    </main>
)

export default OrgNoticeAnnouncementsPage
