import type {Metadata} from 'next'
import {EvaluationReportScreen} from '@/components/custom/evaluation-report'
import {getEvaluationReport} from '@/content/service/evaluation-report'

export const metadata: Metadata = {title: 'KTRS-FM 심층분석'}

// 기업 평가결과 조회 > 자가진단 결과 > KTRS-FM · 심층분석 — Figma "[KTRS-FM · 개별평가 · 심층분석]".
//
// 평가결과 조회 목록의 [자가진단 결과] 버튼이 이 주소를 시안 폭(595)에 맞춘 새 창으로 연다(composite/new-window-link.tsx).
// 그래서 이 화면만 헤더·푸터가 없는 (report) 레이아웃에 둔다 — 새 창은 문서 한 장만 보여 주는 자리라
// 사이트 내비게이션이 따라 들어가면 안 된다. 주소를 곧바로 열어도 같은 문서가 나온다.
//
// [프론트엔드 연동] 이 화면은 모형을 넘겨 리포트를 받아 그리기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/evaluation-report.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.
const CorpMypageEvaluationResultsGeneralAnalysisKtrsFmPage = async () => {
    const report = await getEvaluationReport('ktrs-fm', 'self-diagnosis')

    // 기업 화면은 자가진단 평가결과 한 벌로 끝난다 — 기술평가서와 기술사업평가 세부내역은 기관 화면에만
    // 있는 문서다(시안).
    return <EvaluationReportScreen title="KTRS-FM 심층분석" report={report} hasTechnicalReport={false} />
}

export default CorpMypageEvaluationResultsGeneralAnalysisKtrsFmPage
