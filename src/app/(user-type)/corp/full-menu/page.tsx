import type {Metadata} from 'next'
import FullMenuAutoOpen from '@/components/custom/full-menu-auto-open'
import MainPageScreen from '@/components/custom/main-page-screen'

export const metadata: Metadata = {title: '전체메뉴'}

// 전체메뉴 — 화면정의서의 독립 화면이라 경로를 따로 둔다. 홈과 같은 화면을 그대로 두고 전체 메뉴만
// 열어 둔 모습이며, 메뉴를 닫으면 그 아래 홈이 드러난다. 여는 일은 FullMenuAutoOpen 이 맡아
// 공통 컴포넌트는 손대지 않는다.
const CorpFullMenuPage = () => (
    <>
        <MainPageScreen logoHref="/" technologyEvaluationHref="/corp/technology-evaluation/tech-index/selection" />
        <FullMenuAutoOpen />
    </>
)

export default CorpFullMenuPage
