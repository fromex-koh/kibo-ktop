'use client'

import type {ReactNode} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {ArrowUpRight, Blocks, ChevronRight, Component, Layers, LayoutGrid, Palette, Sparkles} from 'lucide-react'
import type {LucideIcon} from 'lucide-react'
import type {GuideNavIconKey, GuideNavSection} from '@/constants/guide-nav'
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from '@/components/kit/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import ThemeToggle from '@/components/composite/theme-toggle'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/kit/collapsible'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/kit/sidebar'

// 공용 사이드 레이아웃 셸 — shadcn 공식 Sidebar(문서형: 브랜드 헤더 + submenu 나비 + 상단 브레드크럼).
// 섹션 = 접히는 상위 메뉴(Collapsible), 항목 = 하위메뉴(SidebarMenuSub). md(≥768px)↑ 상시 레일 / 미만
// 오프캔버스 Sheet(Radix Dialog 가 포커스 트랩·Esc·복귀·스크롤 잠금 자동 처리). 콘텐츠는 소비자가 감싼다.
type SidebarLayoutProps = {
    title: string
    navSections: readonly GuideNavSection[]
    navLabel: string // 사이드 내비의 aria-label
    children: ReactNode
}

// 빌드 시점 git 버전(next.config.ts 주입). 브랜드 헤더의 버전 표기에 쓴다.
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'dev'

// 섹션 아이콘 키(직렬화 가능) → lucide 컴포넌트. 데이터(guide-nav)는 키만 두고 실제 컴포넌트는 여기서 해석.
const SECTION_ICONS: Record<GuideNavIconKey, LucideIcon> = {
    primitive: Layers,
    semantic: Palette,
    effect: Sparkles,
    layout: LayoutGrid,
    component: Component,
}

// 반복 영역(내비) 건너뛰고 본문으로 (KWCAG 6.4.1). 모바일 메뉴 진입은 헤더의 SidebarTrigger 로 한다.
const SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

const SidebarLayout = ({title, navSections, navLabel, children}: SidebarLayoutProps) => {
    const pathname = usePathname()

    // 현재 라우트가 속한 (섹션, 항목) — 상단 브레드크럼(카테고리 > 현재)과 섹션 기본 펼침에 쓴다.
    const activeCrumb = navSections
        .flatMap((section) => section.items.map((item) => ({category: section.title, ...item})))
        .find((item) => !item.external && item.href === pathname)

    return (
        <SidebarProvider>
            <SkipNav links={SKIP_LINKS} />
            <Sidebar aria-label={navLabel}>
                {/* 브랜드 헤더 — 로고 + 타이틀 + 버전. 홈으로 가는 링크를 겸한다(문서형 사이드바 관례). */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/" aria-label="홈으로">
                                    <span className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <Blocks aria-hidden="true" className="size-icon-sm" />
                                    </span>
                                    <span className="flex flex-col gap-0.5 leading-none">
                                        <span className="typo-body-l-medium">{title}</span>
                                        <span className="typo-caption-regular text-muted-foreground">
                                            {BUILD_VERSION}
                                        </span>
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navSections.map((section) => {
                                    const SectionIcon = SECTION_ICONS[section.icon]
                                    return (
                                        // 모든 섹션 기본 펼침(defaultOpen) — 사용자가 접을 수 있는 상태로 시작.
                                        <Collapsible
                                            key={section.title}
                                            asChild
                                            defaultOpen
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton>
                                                        <SectionIcon aria-hidden="true" />
                                                        <span className="flex-1 truncate">{section.title}</span>
                                                        <ChevronRight
                                                            aria-hidden="true"
                                                            className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                        />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {section.items.map((item) => {
                                                            // external 은 새 창 링크. 그 외엔 현재 라우트면 활성.
                                                            const isActive = !item.external && pathname === item.href
                                                            return (
                                                                <SidebarMenuSubItem key={item.href}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isActive}
                                                                        aria-current={isActive ? 'page' : undefined}
                                                                    >
                                                                        <Link
                                                                            href={item.href}
                                                                            {...(item.external
                                                                                ? {
                                                                                      target: '_blank',
                                                                                      rel: 'noopener noreferrer',
                                                                                  }
                                                                                : {})}
                                                                        >
                                                                            <span className="flex-1 truncate">
                                                                                {item.label}
                                                                            </span>
                                                                            {item.external && (
                                                                                <>
                                                                                    <ArrowUpRight
                                                                                        aria-hidden="true"
                                                                                        className="size-3.5 shrink-0"
                                                                                    />
                                                                                    <span className="sr-only">
                                                                                        {' '}
                                                                                        (새 창에서 열림)
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            {/* min-w-0: SidebarInset 은 가로 flex(Sidebar+Inset)의 flex-1 이라, min-w 가 없으면 min-width:auto 가
                콘텐츠 min-content(코드블럭의 nowrap <pre> 등)로 커져 본문이 뷰포트보다 넓어지고 페이지 가로
                스크롤이 생긴다. min-w-0 으로 본문을 트랙 폭에 맞춰 줄여, 코드블럭은 내부(overflow-x-auto)에서만 스크롤. */}
            <SidebarInset className="min-w-0">
                {/* 상단 앱바 — 트리거(모바일=Sheet 열기 / 데스크톱=레일 접기) + 브레드크럼(카테고리 > 현재) + 테마.
                    z-10: shadcn Sheet(z-50) 아래에 오도록 낮게 둔다(드로어 열리면 헤더가 오버레이 밑). */}
                <header className="border-border bg-background h-header-h sticky top-0 z-10 flex items-center gap-2 border-b px-4 md:px-6">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground min-h-11 min-w-11" />
                    {activeCrumb ? (
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>{activeCrumb.category}</BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{activeCrumb.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    ) : (
                        <p aria-hidden="true" className="typo-body-l-medium truncate">
                            {title}
                        </p>
                    )}
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </header>

                {/* 본문 — '본문 바로가기' 스킵 링크의 포커스 대상(id·tabIndex=-1). 컨테이너는 children 이 정한다. */}
                <main
                    id="main"
                    tabIndex={-1}
                    className="focus-visible:ring-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                >
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default SidebarLayout
