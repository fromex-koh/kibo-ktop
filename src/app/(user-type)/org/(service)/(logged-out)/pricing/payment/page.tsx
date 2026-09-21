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
import PricingPayment from '@/components/custom/pricing-payment'
import {DEFAULT_PAYMENT_PLAN_ID, findPlan, PAID_PLANS, PLAN_QUERY_KEY} from '@/content/service/pricing'

export const metadata: Metadata = {title: '결제하기'}

type PricingPaymentPageProps = {searchParams: Promise<Record<string, string | string[] | undefined>>}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 가격정책의 [구매하기]가 ?plan=<이용권> 으로 넘긴 이용권을 보여 준다. 값이 없거나 모르는 값이면 시안의 프리미엄이다.
// 결제 영역은 PC 에서 가운데 8열(792)만 쓴다(시안).
const OrgPricingPaymentPage = async ({searchParams}: PricingPaymentPageProps) => {
    const plan = findPlan((await searchParams)[PLAN_QUERY_KEY]) ?? findPlan(DEFAULT_PAYMENT_PLAN_ID) ?? PAID_PLANS[0]

    return (
        <main id="main" tabIndex={-1} className="bg-background flex-1">
            <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
                <PageTitleBar
                    title="결제하기"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/org/pricing">가격정책</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>결제하기</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <div className="xl:col-span-8 xl:col-start-3">
                    <PricingPayment plan={plan} userType="org" />
                </div>
            </div>
        </main>
    )
}

export default OrgPricingPaymentPage
