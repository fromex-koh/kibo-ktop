import type {Metadata} from 'next'
import {TechIndexCompanyTechnologyInfoScreen} from '../../company-technology-info-screen'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

// 기관 개별평가 Tech-Index 창업용 (3) 기업·기술정보 입력(7개 탭 — 경영진 역량 및 구성 포함) — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexStartupCompanyTechnologyInfoPage = () => <TechIndexCompanyTechnologyInfoScreen model="startup" />

export default OrgTechIndexStartupCompanyTechnologyInfoPage
