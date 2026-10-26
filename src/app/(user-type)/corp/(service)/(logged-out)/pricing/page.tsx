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
import {isPricingView, PRICING_TAB_QUERY_KEY} from '@/content/service/pricing'

export const metadata: Metadata = {title: '가격정책'}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 1뎁스 탭(기술평가 · K-BIGx 보고서)과 탭 본문은 PricingPolicy 가 갖는다.
// ?tab=kbigx 로 들어오면 [K-BIGx 보고서] 탭이 열린다(없거나 모르는 값이면 [기술평가]).
// 화면 바탕은 시안처럼 옅은 회색(gray.50)이다.
type PricingPageProps = {searchParams: Promise<Record<string, string | string[] | undefined>>}

const CorpPricingPage = async ({searchParams}: PricingPageProps) => {
    const tab = (await searchParams)[PRICING_TAB_QUERY_KEY]

    return (
        <main id="main" tabIndex={-1} className="bg-background flex-1">
            <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
                <PageTitleBar
                    title="가격정책"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>가격정책</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <PricingPolicy paymentHref="/corp/pricing/payment" defaultView={isPricingView(tab) ? tab : undefined} />
            </div>
        </main>
    )
}

export default CorpPricingPage
