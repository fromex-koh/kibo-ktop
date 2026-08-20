import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {MypageSidebar} from '@/components/composite/mypage-sidebar'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {InquiryList, type InquiryItem} from '@/components/custom/inquiry-list'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '1:1 문의'}

// [프론트엔드 연동] 이 화면이 쓰는 값은 모두 여기 세 상수뿐이고, 목록 컴포넌트(InquiryList)는
// 넘겨받은 것만 그린다 — 조회 코드를 화면 안에서 찾아다닐 필요가 없다.
//   · MOCK_INQUIRY_ITEMS   → 문의 목록 조회 응답으로 교체한다. status 는 'waiting'(답변대기) ·
//                            'answered'(답변완료) 두 가지이고, category 는 문의하기 화면의
//                            [유형 선택]과 같은 값이다(constants/inquiry 의 INQUIRY_TYPES).
//   · MOCK_INQUIRY_PAGE_SIZE → 한 페이지에 보여 줄 건수.
//   · 각 항목의 href → 그 문의의 상세 화면 경로다. 문의마다 다른 주소라 목록이 아니라 항목이
//                       들고 있다. 퍼블리싱에서는 상세 화면이 한 벌이라 모두 같은 주소를 가리키지만,
//                       연동할 때 이 값만 문의별 주소로 바꾸면 화면은 손댈 것이 없다.
//   · INQUIRY_CREATE_PATH → [문의 등록] 이 가는 화면 경로.
// 빈 배열을 넘기면 목록 자리에 빈 상태 안내가 나온다(InquiryList 가 처리한다) — 조회 결과가 없을 때의
// 화면을 따로 만들 필요가 없고, 이 배열을 비워 보면 그대로 확인할 수 있다.
const MOCK_INQUIRY_ITEMS: readonly InquiryItem[] = [
    {
        id: 'corp-inquiry-001',
        category: '기술평가',
        title: '평가 신청 오류 문의',
        status: 'waiting',
        date: '2026-05-15',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-002',
        category: '기술평가',
        title: '자가진단 결과 오류 문의',
        status: 'answered',
        date: '2026-05-14',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-003',
        category: 'K-BIGx',
        title: 'K-BIGx 보고서 다운로드 문의',
        status: 'waiting',
        date: '2026-05-12',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-004',
        category: '유료/결제',
        title: '유료 서비스 결제 취소 문의',
        status: 'answered',
        date: '2026-05-11',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-005',
        category: '회원정보',
        title: '기업 담당자 정보 변경 문의',
        status: 'answered',
        date: '2026-05-08',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-006',
        category: '기타',
        title: '서비스 이용 방법 문의',
        status: 'answered',
        date: '2026-05-07',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-007',
        category: '기술평가',
        title: '업종코드 선택 기준 문의',
        status: 'answered',
        date: '2026-05-04',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-008',
        category: 'K-BIGx',
        title: '보고서 재발급 가능 여부 문의',
        status: 'answered',
        date: '2026-04-29',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-009',
        category: '유료/결제',
        title: '세금계산서 발행 문의',
        status: 'answered',
        date: '2026-04-27',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-010',
        category: '회원정보',
        title: '로그인 오류 문의',
        status: 'answered',
        date: '2026-04-22',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-011',
        category: '기술평가',
        title: '대표자 경력사항 입력 방법 문의',
        status: 'answered',
        date: '2026-04-18',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-012',
        category: '기술평가',
        title: '평가 결과 은행 전송 문의',
        status: 'answered',
        date: '2026-04-15',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
    {
        id: 'corp-inquiry-013',
        category: '기타',
        title: '이용 안내 문의',
        status: 'answered',
        date: '2026-04-11',
        href: '/corp/mypage/inquiry-history/inquiry-detail',
    },
]

// 한 페이지 10건 — 목업이 13건이라 2페이지가 만들어진다(페이지 이동 확인용).
const MOCK_INQUIRY_PAGE_SIZE = 10

const INQUIRY_CREATE_PATH = '/corp/notice/inquiry-create'

// 기업 마이페이지 (6) 1:1 문의 — Figma "[마이페이지] 1:1 문의내역_목록".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
const CorpMypageInquiryHistoryPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
            <PageTitleBar
                title="마이페이지"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>마이페이지</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>1:1 문의</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                <MypageSidebar
                    userType="corp"
                    current="1:1 문의"
                    companyName={MYPAGE_MEMBER.companyName}
                    memberType={MYPAGE_MEMBER.memberType}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">1:1 문의</SectionHeaderTitle>
                        <SectionHeaderDescription size="lg">
                            문의사항을 등록하고 답변 상태를 확인할 수 있습니다.
                        </SectionHeaderDescription>
                    </SectionHeader>

                    <InquiryList
                        items={MOCK_INQUIRY_ITEMS}
                        createHref={INQUIRY_CREATE_PATH}
                        pageSize={MOCK_INQUIRY_PAGE_SIZE}
                    />
                </div>
            </div>
        </div>
    </main>
)

export default CorpMypageInquiryHistoryPage
