import type {Metadata} from 'next'
import {TechIndexEvaluationApplicationScreen} from '../../evaluation-application-screen'

export const metadata: Metadata = {title: '평가 신청하기'}

// 기관 개별평가 Tech-Index 창업용 (4) 평가 신청하기 — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexStartupEvaluationApplicationPage = () => <TechIndexEvaluationApplicationScreen model="startup" />

export default OrgTechIndexStartupEvaluationApplicationPage
