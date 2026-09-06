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
//
// [프론트엔드 연동] 각 항목의 href 가 그 공지의 상세 화면 주소다. 상세는 경로가 하나뿐이라 글을 가리키는
// 값은 쿼리(id)로 넘긴다 — 조회 결과의 글 번호를 그 자리에 넣으면 된다. 목록의 모든 줄이 같은 주소를
// 가리키면 인접한 링크가 같은 곳으로 가는 셈이라 스크린리더가 같은 링크를 되풀이해 읽고, WAVE 도
// Redundant link 로 잡는다.
const DETAIL_HREF = '/org/notice/announcements/detail'

const MOCK_NOTICE_ITEMS: readonly NoticeItem[] = [
    {
        id: 'org-notice-001',
        category: 'service',
        title: 'K-TOP 서비스 이용 안내입니다.',
        isImportant: true,
        isNew: true,
        href: `${DETAIL_HREF}?id=org-notice-001`,
    },
    {
        id: 'org-notice-002',
        category: 'service',
        title: '기술평가 플랫폼 서비스 변경 안내입니다.',
        isImportant: true,
        href: `${DETAIL_HREF}?id=org-notice-002`,
    },
    {
        id: 'org-notice-003',
        category: 'system',
        title: '시스템 정기점검 일정을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-003`,
    },
    {
        id: 'org-notice-004',
        category: 'system',
        title: '로그인 및 회원가입 시스템 변경 안내입니다.',
        href: `${DETAIL_HREF}?id=org-notice-004`,
    },
    {
        id: 'org-notice-005',
        category: 'evaluation',
        title: '온라인 기술평가 신청 절차를 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-005`,
    },
    {
        id: 'org-notice-006',
        category: 'evaluation',
        title: '기술평가 관련 설명회 일정을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-006`,
    },
    {
        id: 'org-notice-007',
        category: 'payment',
        title: '평가 수수료 결제 수단 추가를 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-007`,
    },
    {
        id: 'org-notice-008',
        category: 'payment',
        title: '전자세금계산서 발행 일정을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-008`,
    },
    {
        id: 'org-notice-009',
        category: 'service',
        title: '기업 혁신성장 지원 프로그램을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-009`,
    },
    {
        id: 'org-notice-010',
        category: 'etc',
        title: '개인정보 처리방침 개정 내용을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-010`,
    },
    {
        id: 'org-notice-011',
        category: 'etc',
        title: '서비스 이용 중 자주 묻는 사항을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-011`,
    },
    {
        id: 'org-notice-012',
        category: 'etc',
        title: '기술보증기금 주요 사업 변경사항을 안내드립니다.',
        href: `${DETAIL_HREF}?id=org-notice-012`,
    },
]

const MOCK_NOTICE_PAGE_SIZE = 10

// SkipNav의 #main 도착 대상. page의 목업 데이터를 NoticeList에 전달한다.
const OrgNoticeAnnouncementsPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
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
            <NoticeList items={MOCK_NOTICE_ITEMS} pageSize={MOCK_NOTICE_PAGE_SIZE} />
        </div>
    </main>
)

export default OrgNoticeAnnouncementsPage
