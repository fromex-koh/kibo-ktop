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
import PrivacyPolicyTabs from '@/components/custom/privacy-policy-tabs'

export const metadata: Metadata = {title: '개인정보 처리방침'}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const OrgPrivacyPolicyPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="개인정보 처리방침"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>개인정보 처리방침</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <PrivacyPolicyTabs />
        </div>
    </main>
)

export default OrgPrivacyPolicyPage
