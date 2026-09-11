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
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {SubSectionHeader, SubSectionHeaderTitle} from '@/components/composite/sub-section-header'
import {OrgSubAccountList} from '@/components/custom/org-sub-account-list'
import {SubAccountAgreementInfo} from '@/components/custom/sub-account-summary'
import {ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'
import {SUB_ACCOUNT_PAGE_SIZE, type SubAccountAgreementCase} from '@/constants/sub-account'
import {getOrgSubAccountOverview} from '@/content/service/org-sub-accounts'

// 기관 마이페이지 · 하위계정 현황 — Figma "마이페이지_하위계정 현황".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
//
// 케이스(협약 여부·기술평가부 여부) 넷이 이 셸 하나를 함께 쓴다 — 화면 구성은 넷이 같고 협약 정보의
// [이용서비스] 에 무엇이 오는지만 다르다. 무엇이 다른지는 constants/sub-account.ts 에 적어 두었다.
//
// [프론트엔드 연동] 이 화면은 조회 결과를 받아 각 구획에 넘기기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/org-sub-accounts.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.
// 케이스도 그때는 로그인한 기관의 속성이라 서버가 정한다(caseKey 는 목업을 보기 위한 인자다).

type OrgSubAccountProgressScreenProps = {
    caseKey?: SubAccountAgreementCase
}

const OrgSubAccountProgressScreen = async ({caseKey}: OrgSubAccountProgressScreenProps) => {
    const {agreement, summaries, accounts} = await getOrgSubAccountOverview(caseKey)

    return (
        <main id="main" tabIndex={-1} className="bg-background flex-1">
            <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
                <PageTitleBar
                    title="마이페이지"
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <span>마이페이지</span>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>하위계정 현황</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />

                <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                    <MypageSidebar
                        userType="org"
                        current="하위계정 현황"
                        companyName={ORG_MYPAGE_MEMBERS.default.companyName}
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-10">
                        {/* 시안에는 화면 제목 아래 설명이 없다 — 협약 정보가 바로 이어진다. */}
                        <SectionHeader>
                            <SectionHeaderTitle size="lg">하위계정 현황</SectionHeaderTitle>
                        </SectionHeader>

                        <section aria-labelledby="agreement-title" className="flex flex-col gap-6">
                            <SubSectionHeader>
                                <SubSectionHeaderTitle id="agreement-title">협약 정보</SubSectionHeaderTitle>
                            </SubSectionHeader>
                            <SubAccountAgreementInfo agreement={agreement} summaries={summaries} />
                        </section>

                        <section aria-labelledby="sub-account-list-title" className="flex flex-col">
                            <h2 id="sub-account-list-title" className="sr-only">
                                하위계정 목록
                            </h2>
                            <OrgSubAccountList items={accounts} pageSize={SUB_ACCOUNT_PAGE_SIZE} />
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}

export {OrgSubAccountProgressScreen}
export type {OrgSubAccountProgressScreenProps}
