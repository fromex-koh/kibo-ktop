import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {GUIDE_NAV_SECTIONS} from '@/constants/publishing-guide'
import SidebarLayout from '@/components/composite/sidebar-layout'
import {ScrollToTopButton} from '@/components/composite/scroll-to-top-button'

// (guide) 하위 페이지에 공유되는 사이드바 셸과 페이지 제목 템플릿.
export const metadata: Metadata = {
    title: {
        default: '컴포넌트 가이드',
        template: '%s · 컴포넌트 가이드',
    },
}

// 모든 가이드 페이지에서 공유하는 맨 위로 이동 버튼은 셸에 한 번만 마운트한다.
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
