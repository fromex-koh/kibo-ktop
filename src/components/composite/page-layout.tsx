import type {ReactNode} from 'react'
import Footer from '@/components/composite/footer'
import Header, {type HeaderNavigationByUserType, type HeaderUser, type UserType} from '@/components/composite/header'
import RouteScrollReset from '@/components/composite/route-scroll-reset'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'

type PageLayoutProps = {
    userType?: UserType
    user?: HeaderUser
    showUserTypeToggle?: boolean
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
    skipLinks?: readonly SkipLinkItem[]
    children: ReactNode
}

const PAGE_LAYOUT_SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]
const MAIN_PAGE_SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

type PageLayoutBaseProps = Omit<PageLayoutProps, 'children' | 'skipLinks'> & {
    overlay: boolean
    showThemeToggle: boolean
    skipLinks: readonly SkipLinkItem[]
    children: ReactNode
}

// Header·Skip Navigation·라우트 스크롤 초기화처럼 모든 서비스 레이아웃이 공유하는 영역.
const PageLayoutBase = ({
    userType,
    user,
    showUserTypeToggle,
    navigationByUserType,
    logoHref,
    overlay,
    showThemeToggle,
    skipLinks,
    children,
}: PageLayoutBaseProps) => {
    const resolvedShowUserTypeToggle = showUserTypeToggle ?? userType === undefined

    return (
        <>
            <RouteScrollReset />
            <SkipNav links={skipLinks} />
            <Header
                overlay={overlay}
                showThemeToggle={showThemeToggle}
                userType={userType}
                user={user}
                showUserTypeToggle={resolvedShowUserTypeToggle}
                navigationByUserType={navigationByUserType}
                logoHref={logoHref}
            />
            {children}
        </>
    )
}

// 일반 서비스 서브페이지가 공유하는 Header·Footer 조합.
// userType·user를 전달하면 Header의 유형별 메뉴와 로그인 상태를 고정한다.
const SubPageLayout = ({skipLinks = PAGE_LAYOUT_SKIP_LINKS, children, ...props}: PageLayoutProps) => (
    <div className="flex min-h-dvh flex-col">
        <PageLayoutBase {...props} overlay={false} showThemeToggle skipLinks={skipLinks}>
            {children}
        </PageLayoutBase>
        <Footer variant="subpage" />
    </div>
)

// 메인 랜딩페이지가 StackPager 내부에서 사용하는 오버레이 Header 레이아웃.
// Footer는 마지막 섹션의 배치가 필요하므로 children에서 직접 구성한다.
const MainPageLayout = ({skipLinks = MAIN_PAGE_SKIP_LINKS, children, ...props}: PageLayoutProps) => (
    <PageLayoutBase {...props} overlay showThemeToggle={false} skipLinks={skipLinks}>
        {children}
    </PageLayoutBase>
)

export {MainPageLayout, SubPageLayout}
