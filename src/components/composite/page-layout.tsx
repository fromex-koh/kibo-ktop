import type {ReactNode} from 'react'
import Footer from '@/components/composite/footer'
import Header, {type UserType} from '@/components/composite/header'
import RouteScrollReset from '@/components/composite/route-scroll-reset'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'

type PageLayoutProps = {
    userType?: UserType
    showUserTypeToggle?: boolean
    children: ReactNode
}

const PAGE_LAYOUT_SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

// 일반 서비스 서브페이지가 공유하는 Header·Footer 조합.
// userType이 전달되면 해당 유형을 고정하고 기업/기관 토글을 숨기며, 전달되지 않으면 로그인 전 선택을 허용한다.
const SubPageLayout = ({userType, showUserTypeToggle, children}: PageLayoutProps) => {
    const resolvedShowUserTypeToggle = showUserTypeToggle ?? userType === undefined

    return (
        <div className="flex min-h-dvh flex-col">
            <RouteScrollReset />
            {/* 첫 번째 Tab 대상. Header·반복 영역을 건너뛰어 각 페이지의 #main으로 이동한다. */}
            <SkipNav links={PAGE_LAYOUT_SKIP_LINKS} />
            <Header
                overlay={false}
                showThemeToggle
                userType={userType}
                showUserTypeToggle={resolvedShowUserTypeToggle}
            />
            {children}
            <Footer variant="subpage" />
        </div>
    )
}

export {SubPageLayout}
