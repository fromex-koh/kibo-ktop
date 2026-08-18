import type {Metadata} from 'next'
import {TechIndexCompanyTechnologyInfoScreen} from '../../company-technology-info-screen'

export const metadata: Metadata = {title: '기업·기술정보 입력'}

// 기관 개별평가 Tech-Index 일반용 (3) 기업·기술정보 입력(6개 탭) — 화면 구성은 공유 셸이 갖는다.
const OrgTechIndexGeneralCompanyTechnologyInfoPage = () => <TechIndexCompanyTechnologyInfoScreen model="general" />

export default OrgTechIndexGeneralCompanyTechnologyInfoPage
