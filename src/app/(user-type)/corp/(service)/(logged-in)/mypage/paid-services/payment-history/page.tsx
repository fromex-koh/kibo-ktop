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
import {PaidServiceHistory, type CurrentPaidServicePass} from '@/components/custom/paid-service-history'
import {
    createCurrentPassCase,
    DEFAULT_CURRENT_PASS_CASE,
    isCurrentPassCase,
} from '@/content/service/paid-service-current-pass'
import {getServiceToday} from '@/lib/service-today'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'

// 결제정보 — 이 화면 하나가 "현재 사용중인 이용권"의 모든 케이스를 처리한다.
// 카드 모양과 버튼은 CurrentPaidServicePass 의 값으로만 정해진다. 연동할 때는 현재 이용권 조회 응답을 currentPass 로 넘긴다.
// 미리보기는 ?case=번호(기본 1)로 바꾼다. 케이스 정의: content/service/paid-service-current-pass.ts, 이용중지 정책: lib/suspend-policy.ts.
//
//   case  카드 상태                       버튼                          정하는 값
//   1     이용중 · 중지 이력 없음          [이용중지] → 신청 팝업          -
//   2     이용중지 중                     [이용중지 변경] → 변경 팝업     suspension
//   3     중지 후 재개 · 이력 있음         없음(이용중지는 이용권당 1회)    suspensionRecord · hasSuspendedBefore
//   4     잔여 1일(만료일 = 오늘)          [이용중지] → 불가 안내          remainingDays
//   5     무료 지급                       [이용중지] → 불가 안내          isFree
//   6     구매 7일 이내 · 미사용           [환불하기] [이용중지]           isRefundable
//
// 팝업은 모두 이 화면의 버튼에서 이어진다(신청 · 변경 흐름은 composite/paid-service-suspend-dialog.tsx 주석).
//   · 즉시 해제 알림: case 2 → [이용중지 변경] → 종료일을 오늘로 고르고 확인 → 카드가 [사용중] + 이력 블록으로 바뀐다.
//   · 환불: case 6 → [환불하기] → 환불 팝업(처리중 → 완료). 완료 뒤 카드는 목업이라 그대로다([프론트엔드 연동] onRefund).
// 신청 · 변경 뒤의 카드 변화는 화면 안 목업 상태라 새로고침하면 처음 케이스로 돌아간다.
// 하위 경로(suspend*, suspending, suspension-history, refundable)는 케이스·팝업을 따로 보는 미리보기 화면이다.

export const metadata: Metadata = {title: '유료 서비스 관리'}

type CorpPaidServicePaymentHistoryPageContentProps = {
    /** 현재 이용권. 넘기지 않으면 기본 케이스(1)를 오늘 기준으로 만든다. */
    currentPass?: CurrentPaidServicePass
    defaultOpenUsageHistoryId?: string
    defaultOpenRefundId?: string
}

export const CorpPaidServicePaymentHistoryPageContent = ({
    currentPass = createCurrentPassCase(DEFAULT_CURRENT_PASS_CASE, getServiceToday()),
    defaultOpenUsageHistoryId,
    defaultOpenRefundId,
}: CorpPaidServicePaymentHistoryPageContentProps = {}) => (
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
                                <BreadcrumbPage>유료 서비스 관리</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                <MypageSidebar userType="corp" current="유료 서비스 관리" companyName={MYPAGE_MEMBER.companyName} />
                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">유료 서비스 관리</SectionHeaderTitle>
                        <SectionHeaderDescription>
                            현재 이용중인 상품과 사용 내역을 관리합니다.
                        </SectionHeaderDescription>
                    </SectionHeader>
                    <PaidServiceHistory
                        currentPass={currentPass}
                        defaultOpenUsageHistoryId={defaultOpenUsageHistoryId}
                        defaultOpenRefundId={defaultOpenRefundId}
                    />
                </div>
            </div>
        </div>
    </main>
)

const CASE_QUERY = 'case'

type CorpPaidServicePaymentHistoryPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const CorpPaidServicePaymentHistoryPage = async ({searchParams}: CorpPaidServicePaymentHistoryPageProps) => {
    const caseId = (await searchParams)[CASE_QUERY]
    const currentPass = createCurrentPassCase(
        isCurrentPassCase(caseId) ? caseId : DEFAULT_CURRENT_PASS_CASE,
        getServiceToday(),
    )

    return <CorpPaidServicePaymentHistoryPageContent currentPass={currentPass} />
}

export default CorpPaidServicePaymentHistoryPage
