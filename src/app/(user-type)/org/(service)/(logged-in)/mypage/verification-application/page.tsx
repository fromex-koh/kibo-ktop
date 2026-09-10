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
import {OrgVerificationApplicationList} from '@/components/custom/org-verification-application-list'
import {DEFAULT_EVALUATION_PERIOD} from '@/constants/evaluation-result'
import {ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'
import {VERIFICATION_APPLICATION_PAGE_SIZE} from '@/constants/verification-application'
import {getOrgVerificationApplications} from '@/content/service/org-verification-applications'

export const metadata: Metadata = {title: '평가검증 신청 조회'}

// [프론트엔드 연동] 이 화면은 조회 결과를 받아 목록에 넘기기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/org-verification-applications.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.

// 기관 마이페이지 · 평가검증 신청 조회 — Figma "마이페이지_평가검증 신청 조회".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
const OrgMypageVerificationApplicationPage = async () => {
    const applications = await getOrgVerificationApplications()

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
                                    <BreadcrumbPage>평가검증 신청 조회</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />

                <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                    <MypageSidebar
                        userType="org"
                        current="평가검증 신청 조회"
                        companyName={ORG_MYPAGE_MEMBERS.default.companyName}
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-10">
                        <SectionHeader>
                            <SectionHeaderTitle size="lg">평가검증 신청 조회</SectionHeaderTitle>
                            {/* 시안 문구 그대로 — 두 줄로 나뉘어 있다. */}
                            <SectionHeaderDescription>
                                기업이 전송한 자가진단을 정보 수정을 통하여 평가를 검증할 수 있습니다.
                                <br />
                                [평가검증 하기] 버튼을 눌러 해당 기업의 진단을 검증하세요.
                            </SectionHeaderDescription>
                        </SectionHeader>

                        <OrgVerificationApplicationList
                            items={applications}
                            defaultPeriod={DEFAULT_EVALUATION_PERIOD}
                            pageSize={VERIFICATION_APPLICATION_PAGE_SIZE}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default OrgMypageVerificationApplicationPage
