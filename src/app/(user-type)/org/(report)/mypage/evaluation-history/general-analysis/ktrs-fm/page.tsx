import type {Metadata} from 'next'
import {EvaluationReportScreen} from '@/components/custom/evaluation-report'
import {getEvaluationReport} from '@/content/service/evaluation-report'

export const metadata: Metadata = {title: 'KTRS-FM 일반분석'}

// 기관 평가결과 조회 > 일반분석 > KTRS-FM — 기업 [자가진단 결과] 화면과 같은 문서다.
//
// 평가결과 조회 목록의 [개별평가 일반 결과] 버튼이 이 주소를 시안 폭(595)에 맞춘 새 창으로 연다.
// 문서는 자가진단 평가결과 한 벌로 끝난다 — 기술평가서와 기술사업평가 세부내역은 같은 화면의
// [개별평가 심층 결과](deep-analysis/ktrs-fm)에만 있다.
//
// 문서 머리의 꼬리표는 모형이 정하므로 시안 문구 그대로 [KTRS-FM · 개별평가 · 심층분석] 이 나온다.
//
// [프론트엔드 연동] 이 화면은 모형을 넘겨 리포트를 받아 그리기만 한다 — 데이터가 목업인지 API 응답인지는
// content/service/evaluation-report.ts 가 정하므로, 연동할 때 이 파일은 고치지 않아도 된다.
const OrgMypageEvaluationHistoryGeneralAnalysisKtrsFmPage = async () => {
    const report = await getEvaluationReport('ktrs-fm', 'general')

    return <EvaluationReportScreen title="KTRS-FM 일반분석" report={report} hasTechnicalReport={false} />
}

export default OrgMypageEvaluationHistoryGeneralAnalysisKtrsFmPage
