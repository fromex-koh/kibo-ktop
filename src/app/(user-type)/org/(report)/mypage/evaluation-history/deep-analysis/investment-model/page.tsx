import type {Metadata} from 'next'
import {InvestmentModelDeepReportDocuments} from '@/components/custom/investment-model-deep-report'
import {InvestmentModelReportScreen} from '@/components/custom/investment-model-report'
import {getInvestmentModelDeepScreen} from '@/content/service/investment-model-deep-report'

export const metadata: Metadata = {title: '투자모형 심층분석'}

// 기관 평가결과 조회 > 심층분석 > 투자모형 — A4 세 장이다.
//
// 1쪽 투자용 평가결과(일반분석과 같은 문서) · 2~3쪽 기술평가서.
// 평가결과 조회 목록의 [개별평가 심층 결과] 버튼이 이 주소를 문서 폭(A4 794)에 맞춘 새 창으로 연다
// (composite/new-window-link.tsx). 그래서 이 화면만 헤더·푸터가 없는 (report) 레이아웃에 둔다.
//
// [프론트엔드 연동] 세 장의 값은 content/service/investment-model-deep-report.ts 의
// getInvestmentModelDeepScreen 하나로 받는다 — 이 파일은 받은 값을 넘기기만 한다.
type OrgMypageEvaluationHistoryDeepAnalysisInvestmentModelPageProps = {
    searchParams: Promise<{loading?: string}>
}

const OrgMypageEvaluationHistoryDeepAnalysisInvestmentModelPage = async ({
    searchParams,
}: OrgMypageEvaluationHistoryDeepAnalysisInvestmentModelPageProps) => {
    const {report, deepReport} = await getInvestmentModelDeepScreen('deep')
    // [퍼블리싱 확인용] ?loading=1 이면 세 장의 게이지 · 차트 자리에 스켈레톤을 보인다.
    // 연동 후에는 조회 상태를 넘긴다.
    const {loading} = await searchParams

    return (
        <InvestmentModelReportScreen title="투자모형 심층분석" report={report} isLoading={loading === '1'}>
            <InvestmentModelDeepReportDocuments report={deepReport} isLoading={loading === '1'} />
        </InvestmentModelReportScreen>
    )
}

export default OrgMypageEvaluationHistoryDeepAnalysisInvestmentModelPage
