import type {Metadata} from 'next'
import {HomeNoticePopup} from '@/components/custom/home-notice-popup'
import MainPageScreen from '@/components/custom/main-page-screen'
import {getHomeNotices} from '@/content/service/home-notices'

export const metadata: Metadata = {title: '메인 공지사항 팝업'}

// 메인 공지사항 팝업 — 화면정의서의 독립 화면이라 경로를 따로 둔다. 홈과 같은 화면을 그대로 두고 그 위에
// 공지 팝업만 띄운 모습이며, 닫으면 그 아래 홈이 드러난다.
// 홈과 같은 화면이라 mainpage 테마 경로 목록(constants/theme-routes.ts)에도 이 주소를 넣는다.
const CorpHomeNoticePopupPage = async () => {
    const notices = await getHomeNotices()

    return (
        <>
            <MainPageScreen logoHref="/" technologyEvaluationHref="/corp/technology-evaluation/tech-index/selection" />
            <HomeNoticePopup items={notices} detailHref="/corp/notice/announcements/detail" />
        </>
    )
}

export default CorpHomeNoticePopupPage
