'use client'

import type {ReactNode} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {ArrowUpRight, Blocks, ChevronRight} from 'lucide-react'
import type {GuideNavSection} from '@/constants/guide-nav'
import Breadcrumb from '@/components/guide/breadcrumb'
import SkipNav, {type SkipLinkItem} from '@/components/skip-nav'
import ThemeToggle from '@/components/theme-toggle'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'
import {Separator} from '@/components/ui/separator'
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
} from '@/components/ui/sidebar'

// 공용 사이드 레이아웃 셸 — shadcn 공식 Sidebar(문서형: 브랜드 헤더 + submenu 나비 + 상단 브레드크럼).
// 섹션 = 접히는 상위 메뉴(Collapsible), 항목 = 하위메뉴(SidebarMenuSub). wide(768px)↑ 상시 레일 / 미만
// 오프캔버스 Sheet(Radix Dialog 가 포커스 트랩·Esc·복귀·스크롤 잠금 자동 처리). 콘텐츠는 소비자가 감싼다.
type SidebarLayoutProps = {
    title: string
    navSections: readonly GuideNavSection[]
    navLabel: string // 사이드 내비의 aria-label
    children: ReactNode
}

// 빌드 시점 git 버전(next.config.ts 주입). 브랜드 헤더의 버전 표기에 쓴다.
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'dev'

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
                                    // 현재 라우트를 포함한 섹션은 기본 펼침(그 외는 접힘) — shadcn submenu 관례.
                                    const isOpen = section.title === activeCrumb?.category
                                    return (
                                        <Collapsible
                                            key={section.title}
                                            asChild
                                            defaultOpen={isOpen}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton>
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

            <SidebarInset>
                {/* 상단 앱바 — 트리거(모바일=Sheet 열기 / 데스크톱=레일 접기) + 브레드크럼(카테고리 > 현재) + 테마.
                    z-10: shadcn Sheet(z-50) 아래에 오도록 낮게 둔다(드로어 열리면 헤더가 오버레이 밑). */}
                <header className="border-border bg-background h-header-h wide:px-6 sticky top-0 z-10 flex items-center gap-2 border-b px-4">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground min-h-11 min-w-11" />
                    <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
                    {activeCrumb ? (
                        <Breadcrumb category={activeCrumb.category} current={activeCrumb.label} />
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
