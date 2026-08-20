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
import {InquiryDetail, type InquiryDetailItem} from '@/components/custom/inquiry-detail'
import {ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '문의하기 상세'}

// [프론트엔드 연동] 이 화면이 쓰는 값은 아래 두 상수뿐이고, 상세 컴포넌트(InquiryDetail)는 넘겨받은
// 것만 그린다.
//   · MOCK_INQUIRY   → 문의 한 건 조회 응답으로 교체한다. status 는 'waiting'(답변대기) ·
//                      'answered'(답변완료) 두 가지이고, answer 를 넘기면 답변 자리에 그 내용이
//                      A. 표시와 함께 들어간다(넘기지 않으면 대기 안내가 보인다 — 시안 상태).
//   · INQUIRY_LIST_PATH → [목록으로 돌아가기] 가 가는 화면 경로.
const MOCK_INQUIRY: InquiryDetailItem = {
    category: '기술평가',
    title: '평가검증 신청 오류 문의',
    status: 'waiting',
    date: '2026-05-15',
    question:
        '평가검증 신청 화면에서 "신청하기" 버튼 클릭 시 오류가 발생합니다.\n오류 메시지: "서버 연결 오류가 발생했습니다."\n\n해당 오류가 지속적으로 발생하여 평가검증 신청이 불가한 상태입니다. 조속한 확인 및 조치 부탁드립니다.',
    attachments: [{name: '평가검증오류 캡처.png'}],
}

const INQUIRY_LIST_PATH = '/org/mypage/inquiry-history'

// org 마이페이지 · 1:1 문의 상세 — Figma "[마이페이지] 1:1 문의내역_상세".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
const OrgMypageInquiryDetailPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
            <PageTitleBar
                title="마이페이지"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>마이페이지</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>1:1 문의 내역</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                <MypageSidebar
                    userType="org"
                    current="1:1 문의 내역"
                    companyName={ORG_MYPAGE_MEMBERS.default.companyName}
                    memberType={ORG_MYPAGE_MEMBERS.default.memberType}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">1:1 문의 내역</SectionHeaderTitle>
                        <SectionHeaderDescription size="lg">
                            문의사항을 등록하고 답변 상태를 확인할 수 있습니다.
                        </SectionHeaderDescription>
                    </SectionHeader>

                    <InquiryDetail inquiry={MOCK_INQUIRY} listHref={INQUIRY_LIST_PATH} />
                </div>
            </div>
        </div>
    </main>
)

export default OrgMypageInquiryDetailPage
