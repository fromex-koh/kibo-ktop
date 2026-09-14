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
import {PaidServiceHistory} from '@/components/custom/paid-service-history'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '유료 서비스 관리'}

type CorpPaidServicePaymentHistoryPageContentProps = {
    defaultOpenUsageHistoryId?: string
    defaultOpenRefundId?: string
}

export const CorpPaidServicePaymentHistoryPageContent = ({
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
                        defaultOpenUsageHistoryId={defaultOpenUsageHistoryId}
                        defaultOpenRefundId={defaultOpenRefundId}
                    />
                </div>
            </div>
        </div>
    </main>
)

const CorpPaidServicePaymentHistoryPage = () => <CorpPaidServicePaymentHistoryPageContent />

export default CorpPaidServicePaymentHistoryPage
