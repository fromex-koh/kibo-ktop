import type {Metadata} from 'next'
import {TechIndexCompleteScreen} from '../../complete-screen'

export const metadata: Metadata = {title: '제출 완료'}

// 기관 개별평가 Tech-Index 일반용 (5) 완료 화면 — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexGeneralCompletePage = () => <TechIndexCompleteScreen model="general" />

export default OrgTechIndexGeneralCompletePage
