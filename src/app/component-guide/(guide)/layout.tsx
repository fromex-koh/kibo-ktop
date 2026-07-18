import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {GUIDE_NAV_SECTIONS} from '@/constants/guide-nav'
import SidebarLayout from '@/components/composite/sidebar-layout'
import {ScrollToTopButton} from '@/components/composite/scroll-to-top-button'

// 하위 섹션 페이지들이 공유하는 사이드바 셸 — 라우트 이동 사이에 네비/드로어 상태가 유지된다.
// 각 페이지 제목 뒤에 '· 컴포넌트 가이드'를 붙여 탭 제목에서 맥락이 유지되도록 템플릿을 둔다.
export const metadata: Metadata = {
    title: {
        default: '컴포넌트 가이드',
        template: '%s · 컴포넌트 가이드',
    },
}

// ScrollToTopButton 을 셸 레벨에 한 번 마운트 — 각 섹션 페이지가 길어지면(예: Button 가이드) 어디서든
// 공통으로 쓸 수 있게 모든 가이드 페이지에 전역 적용한다.
const ComponentGuideLayout = ({children}: {children: ReactNode}) => (
    <SidebarLayout
        title="컴포넌트 가이드"
        navRootItem={{label: '컴포넌트 가이드 홈', href: '/component-guide'}}
        navSections={GUIDE_NAV_SECTIONS}
        navLabel="컴포넌트 가이드 내비게이션"
    >
        {children}
        <ScrollToTopButton />
    </SidebarLayout>
)

export default ComponentGuideLayout
