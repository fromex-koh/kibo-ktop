import type {Metadata} from 'next'
import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import Footer from '@/components/composite/footer'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'

export const metadata: Metadata = {title: '메인 레이아웃'}

const SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

// 실제 서비스 적용 시 사용자 유형별 메뉴의 href와 external 값을 확정한다.
const PLATFORM_NAVIGATION = {
    corp: [
        {label: '플랫폼 소개', href: '#'},
        {label: '기술평가', href: '#'},
        {label: '특허평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
    org: [
        {label: '플랫폼 소개', href: '#'},
        {label: '개별평가', href: '#'},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '특허평가', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
} satisfies HeaderNavigationByUserType

// 공통 서브페이지 구조: SkipNav → Header → main(PageTitleBar + 화면 콘텐츠) → Footer.
// 제목·브레드크럼·콘텐츠는 실제 화면 정보로 교체한다.
const MainLayoutPage = () => (
    <div className="bg-background flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <Header
            overlay={false}
            showThemeToggle
            logoHref="/component-guide/main-page"
            navigationByUserType={PLATFORM_NAVIGATION}
        />

        {/* SkipNav의 #main 대상. 키보드 포커스를 받을 수 있어야 한다. */}
        <main id="main" tabIndex={-1} className="content-layout flex flex-1 flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="페이지 타이틀"
                breadcrumb={
                    // 실제 화면에서는 각 뎁스의 경로로 교체한다.
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="?depth=1">1뎁스</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="?depth=2">2뎁스</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>현재 페이지</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 화면별 콘텐츠를 이 영역에 삽입한다. */}
            <div className="border-subtle-2 text-foreground-subtle flex min-h-100 flex-1 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="typo-title-m-medium">콘텐츠 영역 — 화면별 콘텐츠로 교체됩니다</p>
            </div>
        </main>

        <Footer variant="subpage" />
    </div>
)

export default MainLayoutPage
