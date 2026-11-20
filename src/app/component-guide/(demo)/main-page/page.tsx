import type {Metadata} from 'next'
import MainPageScreen from '@/components/custom/main-page-screen'

export const metadata: Metadata = {title: '메인페이지'}

// 메인 랜딩페이지 목업 — 화면 구성은 MainPageScreen 이 갖는다(기업 홈·기관 홈과 같은 화면).
const MainPage = () => (
    <MainPageScreen
        logoHref="/component-guide/main-page"
        technologyEvaluationHref="/component-guide/self-diagnosis/evaluation-model"
    />
)

export default MainPage
