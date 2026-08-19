import type {Metadata} from 'next'
import {TechIndexEvaluationApplicationScreen} from '../../evaluation-application-screen'

export const metadata: Metadata = {title: '평가 신청하기'}

// 기관 개별평가 Tech-Index 일반용 (4) 평가 신청하기 — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexGeneralEvaluationApplicationPage = () => <TechIndexEvaluationApplicationScreen model="general" />

export default OrgTechIndexGeneralEvaluationApplicationPage
