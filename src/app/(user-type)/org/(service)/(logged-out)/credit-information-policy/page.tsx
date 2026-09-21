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
import CreditInformationPolicy from '@/components/custom/credit-information-policy'

export const metadata: Metadata = {title: '신용정보 활용체제'}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 공시 본문(안내·항목 1~8·시행일)은 CreditInformationPolicy 가 갖는다.
const OrgCreditInformationPolicyPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
            <PageTitleBar
                title="신용정보 활용체제"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>신용정보 활용체제</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <CreditInformationPolicy userType="org" />
        </div>
    </main>
)

export default OrgCreditInformationPolicyPage
