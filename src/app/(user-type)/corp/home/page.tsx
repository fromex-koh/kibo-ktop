import type {Metadata} from 'next'
import MainPageScreen from '@/components/custom/main-page-screen'

export const metadata: Metadata = {title: '홈'}

// 기업 홈(메인 랜딩페이지) — 화면 구성은 MainPageScreen 이 갖는다. 로고를 누르면 시작 페이지(/)로 간다.
const CorpHomePage = () => (
    <MainPageScreen logoHref="/" technologyEvaluationHref="/corp/technology-evaluation/tech-index/selection" />
)

export default CorpHomePage
