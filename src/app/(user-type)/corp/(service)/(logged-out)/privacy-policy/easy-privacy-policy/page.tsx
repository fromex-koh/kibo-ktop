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
const CorpEasyPrivacyPolicyPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
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
            {/* 화면 확인용: 두 번째 탭을 활성화한 동일 페이지다. 실제 작업은 defaultView를 제거한 privacy-policy/page.tsx에서 진행. */}
            <PrivacyPolicyTabs defaultView="easy" />
        </div>
    </main>
)

export default CorpEasyPrivacyPolicyPage
