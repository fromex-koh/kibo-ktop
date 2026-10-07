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
import PricingPolicy from '@/components/custom/pricing-policy'

export const metadata: Metadata = {title: '가격정책'}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 무료·유료 서비스와 이용 안내는 PricingPolicy 가 갖는다. 화면 바탕은 옅은 회색(gray.50)이다.
// 기관회원은 이용권을 직접 구매할 수 없어 isPurchaseUnavailable 로 [구매하기]가 결제 불가 안내 모달을 열게 한다.
const OrgPricingPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
            <PageTitleBar
                title="가격정책"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>가격정책</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <PricingPolicy isPurchaseUnavailable />
        </div>
    </main>
)

export default OrgPricingPage
