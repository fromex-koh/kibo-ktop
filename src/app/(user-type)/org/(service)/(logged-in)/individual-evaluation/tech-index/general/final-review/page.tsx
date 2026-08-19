import type {Metadata} from 'next'
import {TechIndexFinalReviewScreen} from '../../final-review-screen'

export const metadata: Metadata = {title: '최종 확인'}

// 기관 개별평가 Tech-Index 일반용 (4) 최종 확인 — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexGeneralFinalReviewPage = () => <TechIndexFinalReviewScreen model="general" />

export default OrgTechIndexGeneralFinalReviewPage
