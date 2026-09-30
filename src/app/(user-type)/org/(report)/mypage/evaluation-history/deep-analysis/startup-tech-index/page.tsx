import type {Metadata} from 'next'
import {TechIndexDeepReportDocuments} from '@/components/custom/tech-index-deep-report'
import {TechIndexReportScreen} from '@/components/custom/tech-index-report'
import {getStartupTechIndexDeepScreen} from '@/content/service/startup-tech-index-deep-report'

export const metadata: Metadata = {title: '창업용 Tech-Index 심층분석'}

// 기관 평가결과 조회 > 심층분석 > 창업용 Tech-Index — A4 세 장이다.
//
// 1쪽 혁신성장역량 평가결과(일반분석과 같은 문서) · 2~3쪽 기술평가서.
// 일반 Tech-Index 심층분석과 문서 짜임이 같고, 세부지표 레이더의 축과 산업 구분 이름만 창업용이다.
//
// 평가결과 조회 목록의 [개별평가 심층 결과] 버튼이 이 주소를 문서 폭(A4 794)에 맞춘 새 창으로 연다
// (composite/new-window-link.tsx). 그래서 이 화면만 헤더·푸터가 없는 (report) 레이아웃에 둔다.
//
// [프론트엔드 연동] 세 장의 값은 content/service/startup-tech-index-deep-report.ts 의
// getStartupTechIndexDeepScreen 하나로 받는다 — 이 파일은 받은 값을 넘기기만 한다.
type OrgMypageEvaluationHistoryDeepAnalysisStartupTechIndexPageProps = {
    searchParams: Promise<{loading?: string}>
}

const OrgMypageEvaluationHistoryDeepAnalysisStartupTechIndexPage = async ({
    searchParams,
}: OrgMypageEvaluationHistoryDeepAnalysisStartupTechIndexPageProps) => {
    const {report, deepReport} = await getStartupTechIndexDeepScreen('deep')
    // [퍼블리싱 확인용] ?loading=1 이면 세 장의 도넛 · 차트 자리에 스켈레톤을 보인다.
    // 연동 후에는 조회 상태를 넘긴다.
    const {loading} = await searchParams

    return (
        <TechIndexReportScreen title="창업용 Tech-Index 심층분석" report={report} isLoading={loading === '1'}>
            <TechIndexDeepReportDocuments report={deepReport} isLoading={loading === '1'} />
        </TechIndexReportScreen>
    )
}

export default OrgMypageEvaluationHistoryDeepAnalysisStartupTechIndexPage
