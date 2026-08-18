import type {Metadata} from 'next'
import {TechIndexCustomerConsentScreen} from '../../customer-consent-screen'

export const metadata: Metadata = {title: '고객정보활용동의'}

// 기관 개별평가 Tech-Index 일반용 (2) 고객정보활용동의 — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexGeneralCustomerConsentPage = () => <TechIndexCustomerConsentScreen model="general" />

export default OrgTechIndexGeneralCustomerConsentPage
