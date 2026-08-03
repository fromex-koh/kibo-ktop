import type {ReactNode} from 'react'
import Footer, {type FooterVariant} from '@/components/composite/footer'
import Header, {type UserType} from '@/components/composite/header'
import RouteScrollReset from '@/components/composite/route-scroll-reset'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'

type PageLayoutVariant = 'main' | 'sub'

type PageLayoutPreset = {
    overlay: boolean
    showThemeToggle: boolean
    footerVariant: FooterVariant
}

type PageLayoutProps = {
    userType?: UserType
    showUserTypeToggle?: boolean
    children: ReactNode
}

type PageLayoutBaseProps = PageLayoutProps & {
    variant: PageLayoutVariant
}

const PAGE_LAYOUT_SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

const LAYOUT_PRESETS = {
    main: {
        overlay: true,
        showThemeToggle: false,
        footerVariant: 'mainpage',
    },
    sub: {
        overlay: false,
        showThemeToggle: true,
        footerVariant: 'subpage',
    },
} satisfies Record<PageLayoutVariant, PageLayoutPreset>

// 메인·서브페이지가 공유하는 Header·Footer 조합.
// userType이 전달되면 해당 유형을 고정하고 토글을 숨기며, 전달되지 않으면 로그인 전 유형 선택을 허용한다.
const PageLayoutBase = ({variant, userType, showUserTypeToggle, children}: PageLayoutBaseProps) => {
    const preset = LAYOUT_PRESETS[variant]
    const resolvedShowUserTypeToggle = showUserTypeToggle ?? userType === undefined

    return (
        <div className="flex min-h-dvh flex-col">
            <RouteScrollReset />
            {/* 첫 번째 Tab 대상. Header·반복 영역을 건너뛰어 각 페이지의 #main으로 이동한다. */}
            <SkipNav links={PAGE_LAYOUT_SKIP_LINKS} />
            <Header
                overlay={preset.overlay}
                showThemeToggle={preset.showThemeToggle}
                userType={userType}
                showUserTypeToggle={resolvedShowUserTypeToggle}
            />
            {children}
            <Footer variant={preset.footerVariant} />
        </div>
    )
}

// 메인페이지 preset: 오버레이 Header, 테마 버튼 숨김, mainpage Footer.
const MainPageLayout = (props: PageLayoutProps) => <PageLayoutBase variant="main" {...props} />

// 일반 서비스 서브페이지 preset: 고정형 Header, 테마 버튼 노출, subpage Footer.
const SubPageLayout = (props: PageLayoutProps) => <PageLayoutBase variant="sub" {...props} />

export {MainPageLayout, PageLayoutBase, SubPageLayout}
