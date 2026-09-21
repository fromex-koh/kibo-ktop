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
import TermsTabs from '@/components/custom/terms-tabs'
import {isTermsView, TERMS_TAB_QUERY_KEY} from '@/content/service/terms'

export const metadata: Metadata = {title: '이용약관'}

type TermsPageProps = {searchParams: Promise<Record<string, string | string[] | undefined>>}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 탭(기술평가 · K-BIGx)과 약관 전문은 TermsTabs 가 갖는다.
// ?tab=kbigx 로 들어오면 [K-BIGx 이용약관] 탭이 열린 채로 보인다(신용정보 활용체제의 링크).
const CorpTermsPage = async ({searchParams}: TermsPageProps) => {
    const tab = (await searchParams)[TERMS_TAB_QUERY_KEY]

    return (
        <main id="main" tabIndex={-1} className="bg-surface flex-1">
            <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
                <PageTitleBar
                    title="이용약관"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>이용약관</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <TermsTabs defaultView={isTermsView(tab) ? tab : undefined} />
            </div>
        </main>
    )
}

export default CorpTermsPage
