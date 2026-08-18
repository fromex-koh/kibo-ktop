import type {Metadata} from 'next'
import {BatchEvaluationCompleteScreen} from '../../batch-evaluation-complete-screen'

export const metadata: Metadata = {title: '일괄평가 신청 완료'}

// 기관 일괄평가 창업용 (4) 일괄평가 신청 완료 — 화면 구성은 공유 셸이 갖는다.
const OrgBatchStartupEvaluationCompletePage = () => <BatchEvaluationCompleteScreen model="startup" />

export default OrgBatchStartupEvaluationCompletePage
