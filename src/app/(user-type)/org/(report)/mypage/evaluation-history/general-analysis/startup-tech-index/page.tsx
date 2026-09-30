import type {Metadata} from 'next'
import {TechIndexReportScreen} from '@/components/custom/tech-index-report'
import {getStartupTechIndexReport} from '@/content/service/startup-tech-index-report'

export const metadata: Metadata = {title: '창업용 Tech-Index 일반분석'}

// 기관 평가결과 조회 > 일반분석 > 창업용 Tech-Index.
//
// 기업 일반분석(corp/.../general-analysis/startup-tech-index)과 같은 문서이고 꼬리표만 다르다 —
// 어느 자리에서 열었는지를 kind 가 정한다: 기업 'tech-general' · 기관 'general'.
//
// 평가결과 조회 목록의 [개별평가 일반 결과] 버튼이 이 주소를 문서 폭(A4 794)에 맞춘 새 창으로 연다
// (composite/new-window-link.tsx). 그래서 이 화면만 헤더·푸터가 없는 (report) 레이아웃에 둔다.
//
// [프론트엔드 연동] 이 화면은 리포트를 받아 그리기만 한다 — 값과 문구는
// content/service/startup-tech-index-report.ts 하나에 있고 기업 화면과 같은 목업을 쓴다.
type OrgMypageEvaluationHistoryGeneralAnalysisStartupTechIndexPageProps = {
    searchParams: Promise<{loading?: string}>
}

const OrgMypageEvaluationHistoryGeneralAnalysisStartupTechIndexPage = async ({
    searchParams,
}: OrgMypageEvaluationHistoryGeneralAnalysisStartupTechIndexPageProps) => {
    const report = await getStartupTechIndexReport('general')
    // [퍼블리싱 확인용] ?loading=1 이면 지수 도넛 자리에 스켈레톤을 보인다. 연동 후에는 조회 상태를 넘긴다.
    const {loading} = await searchParams

    return <TechIndexReportScreen title="창업용 Tech-Index 일반분석" report={report} isLoading={loading === '1'} />
}

export default OrgMypageEvaluationHistoryGeneralAnalysisStartupTechIndexPage
