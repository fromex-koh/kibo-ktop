import type {Metadata} from 'next'
import {InvestmentModelReportScreen} from '@/components/custom/investment-model-report'
import {getInvestmentModelReport} from '@/content/service/investment-model-report'

export const metadata: Metadata = {title: '투자모형 일반분석'}

// 기업 평가결과 조회 > 일반분석 > 투자모형.
//
// 평가결과 조회 목록의 버튼이 이 주소를 문서 폭(A4 794)에 맞춘 새 창으로 연다(composite/new-window-link.tsx).
// 그래서 이 화면만 헤더·푸터가 없는 (report) 레이아웃에 둔다 — 새 창은 문서 한 장만 보여 주는 자리라
// 사이트 내비게이션이 따라 들어가면 안 된다. 주소를 곧바로 열어도 같은 문서가 나온다.
//
// [프론트엔드 연동] 이 화면은 리포트를 받아 그리기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/investment-model-report.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.
type CorpMypageEvaluationResultsGeneralAnalysisInvestmentModelPageProps = {
    searchParams: Promise<{loading?: string}>
}

const CorpMypageEvaluationResultsGeneralAnalysisInvestmentModelPage = async ({
    searchParams,
}: CorpMypageEvaluationResultsGeneralAnalysisInvestmentModelPageProps) => {
    const report = await getInvestmentModelReport('tech-general')
    // [퍼블리싱 확인용] ?loading=1 이면 등급 게이지 자리에 스켈레톤을 보인다. 연동 후에는 조회 상태를 넘긴다.
    const {loading} = await searchParams

    return <InvestmentModelReportScreen title="투자모형 일반분석" report={report} isLoading={loading === '1'} />
}

export default CorpMypageEvaluationResultsGeneralAnalysisInvestmentModelPage
