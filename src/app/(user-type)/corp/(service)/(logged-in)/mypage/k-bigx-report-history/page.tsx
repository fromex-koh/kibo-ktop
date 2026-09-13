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
import {KBigxReportHistoryList} from '@/components/custom/k-bigx-report-history-list'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'
import {K_BIGX_REPORT_HISTORY_PAGE_SIZE} from '@/constants/k-bigx-report-history'
import {getKBigxReportHistory} from '@/content/service/k-bigx-report-history'

export const metadata: Metadata = {title: 'K-BIGx 보고서 이력'}

// [프론트엔드 연동] 이 화면은 조회 결과를 받아 목록에 넘기기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/k-bigx-report-history.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.

// 기업 마이페이지 · K-BIGx 보고서 이력 — Figma "SB-FOTA-CM0-0017_마이페이지_K-BIGx 보고서 이력".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
const CorpMypageKBigxReportHistoryPage = async () => {
    const reports = await getKBigxReportHistory()

    return (
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
                                    <BreadcrumbPage>K-BIGx 보고서 이력</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />

                <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                    <MypageSidebar
                        userType="corp"
                        current="K-BIGx 보고서 이력"
                        companyName={MYPAGE_MEMBER.companyName}
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-10">
                        <SectionHeader>
                            <SectionHeaderTitle size="lg">K-BIGx 보고서 이력</SectionHeaderTitle>
                            <SectionHeaderDescription>
                                자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요.
                            </SectionHeaderDescription>
                        </SectionHeader>

                        <section aria-labelledby="k-bigx-report-list-title" className="flex flex-col">
                            <h2 id="k-bigx-report-list-title" className="sr-only">
                                보고서 목록
                            </h2>
                            <KBigxReportHistoryList items={reports} pageSize={K_BIGX_REPORT_HISTORY_PAGE_SIZE} />
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CorpMypageKBigxReportHistoryPage
