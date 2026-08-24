import type {Metadata} from 'next'
import MainPageScreen from '@/components/custom/main-page-screen'

export const metadata: Metadata = {title: '홈'}

// 기관 홈(메인 랜딩페이지) — 화면 구성은 MainPageScreen 이 갖는다. 로고를 누르면 이 화면으로 돌아온다.
const OrgHomePage = () => (
    <MainPageScreen logoHref="/org/home" technologyEvaluationHref="/org/individual-evaluation/tech-index/selection" />
)

export default OrgHomePage
