import type {Metadata} from 'next'
import {BatchEvaluationRequestScreen} from '../../batch-evaluation-request-screen'

export const metadata: Metadata = {title: '일괄평가 진행 신청'}

// 기관 일괄평가 일반용 (3) 일괄평가 진행 신청 — 화면 구성은 공유 셸이 갖는다.
const OrgBatchGeneralEvaluationRequestPage = () => <BatchEvaluationRequestScreen model="general" />

export default OrgBatchGeneralEvaluationRequestPage
