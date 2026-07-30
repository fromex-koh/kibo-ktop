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

// 메인페이지 목업과 같은 주 메뉴 구성(시안 GNB). 실제 경로는 화면 목업이라 '#' 로 둔다.
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

// 서브페이지 공통 메인 레이아웃 목업 — Figma "[K-BIGx 보고서]"(40006632:27909)의 뼈대만 옮긴다.
// Header + 콘텐츠(타이틀 영역 = 타이틀 + 브레드크럼) + Footer(subpage) 구성이고, 타이틀 영역 아래는
// 화면마다 갈아 끼우는 자리라 자리표시자로 비워 둔다.
// 타이틀·브레드크럼도 자리표시자 문구다 — 특정 화면 이름을 넣으면 그 화면의 목업으로 오인되므로
// (사람도, 코드를 참고하는 AI 도) 실제 화면을 만들 때 화면명으로 교체한다.
// 시안 간격 — 헤더 아래 40(pt-10), 콘텐츠 폭 1200(content-layout), 콘텐츠 끝↔푸터 100(pb-25).
// 시안 배경은 #f0f5fa 인데 팔레트에 없는 값이라 bg-background(gray.50)를 쓴다 — 확정 시 토큰으로 승격한다.
const MainLayoutPage = () => (
    <div className="bg-background flex min-h-dvh flex-col">
        <SkipNav links={SKIP_LINKS} />
        <Header
            overlay={false}
            showThemeToggle
            logoHref="/component-guide/main-page"
            navigationByUserType={PLATFORM_NAVIGATION}
        />

        {/* 바로가기 대상 — 컨테이너는 포커스만 받고(tabIndex={-1}) 링은 그리지 않는다. */}
        <main id="main" tabIndex={-1} className="content-layout flex flex-1 flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="페이지 타이틀"
                breadcrumb={
                    // 자리표시자 링크의 href — 실제 화면에서는 각 뎁스의 실제 경로로 교체한다.
                    // 쿼리스트링으로 서로 다르게 두는 이유: 같은 "#" 두 개는 WAVE Redundant link 로,
                    // "#depth-1" 처럼 없는 앵커는 Broken same-page link 로 잡힌다.
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

            {/* 교체 영역 — 화면별 콘텐츠가 들어오는 자리. 시안에서 타이틀 아래부터 푸터 위까지가
                콘텐츠 몫이라 flex-1 로 남는 높이를 차지하고, 콘텐츠가 없어도 자리가 보이도록
                최소 높이(400px)를 둔다. 표시는 목업 안내라 점선 테두리 + 문구로 한다. */}
            <div className="border-subtle-2 text-foreground-subtle flex min-h-100 flex-1 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="typo-title-m-medium">콘텐츠 영역 — 화면별 콘텐츠로 교체됩니다</p>
            </div>
        </main>

        <Footer variant="subpage" />
    </div>
)

export default MainLayoutPage
