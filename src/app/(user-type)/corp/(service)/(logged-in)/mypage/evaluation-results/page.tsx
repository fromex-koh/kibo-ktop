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
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {EvaluationResultList} from '@/components/custom/evaluation-result-list'
import {EVALUATION_RESULT_PAGE_SIZE, getEvaluationResults} from '@/content/service/evaluation-results'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'
import {DEFAULT_EVALUATION_PERIOD, EVALUATION_MODEL_TABS} from '@/constants/evaluation-result'

export const metadata: Metadata = {title: '평가결과 조회'}

// [프론트엔드 연동] 이 화면은 조회 결과를 받아 목록에 넘기기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/evaluation-results.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.

// 기업 마이페이지 (3) 평가결과 조회 — Figma "[마이페이지] 평가이력 조회".
// 두 열 배치·간격은 마이페이지의 다른 화면과 같다(사이드바 344 + 64 + 본문 792 = 1200).
const CorpMypageEvaluationResultsPage = async () => {
    const evaluationResults = await getEvaluationResults()

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
                                    <BreadcrumbPage>평가결과 조회</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />

                <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                    <MypageSidebar userType="corp" current="평가결과 조회" companyName={MYPAGE_MEMBER.companyName} />

                    <div className="flex min-w-0 flex-1 flex-col gap-10">
                        {/* 시안에는 화면 제목 아래 설명이 없다 — 조회 필터가 바로 이어진다. */}
                        <SectionHeader>
                            <SectionHeaderTitle size="lg">평가결과 조회</SectionHeaderTitle>
                        </SectionHeader>

                        <EvaluationResultList
                            items={evaluationResults}
                            modelTabs={EVALUATION_MODEL_TABS}
                            defaultPeriod={DEFAULT_EVALUATION_PERIOD}
                            pageSize={EVALUATION_RESULT_PAGE_SIZE}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CorpMypageEvaluationResultsPage
