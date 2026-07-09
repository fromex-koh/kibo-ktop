'use client'

import type {ReactNode} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {ArrowUpRight, Home} from 'lucide-react'
import type {GuideNavSection} from '@/constants/guide-nav'
import SkipNav, {type SkipLinkItem} from '@/components/skip-nav'
import ThemeToggle from '@/components/theme-toggle'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'

// 공용 사이드 레이아웃 셸 — shadcn 공식 Sidebar 기반. wide(768px)↑ 상시 레일 / 미만 오프캔버스 Sheet.
// 모바일 Sheet(Radix Dialog)가 포커스 트랩·Esc 닫기·닫은 뒤 포커스 복귀·배경 스크롤 잠금을 자동 처리하므로
// 커스텀 a11y 코드를 위임한다. 콘텐츠(children)는 소비자가 자기 컨테이너(max-w-content·grid-layout)로 감싼다.
type SidebarLayoutProps = {
    title: string
    navSections: readonly GuideNavSection[]
    navLabel: string // 사이드 내비의 aria-label
    children: ReactNode
}

// 반복 영역(내비) 건너뛰고 본문으로 (KWCAG 6.4.1). 모바일 메뉴 진입은 헤더의 SidebarTrigger 로 한다.
const SKIP_LINKS: readonly SkipLinkItem[] = [{href: '#main', label: '본문 바로가기'}]

const SidebarLayout = ({title, navSections, navLabel, children}: SidebarLayoutProps) => {
    const pathname = usePathname()

    return (
        <SidebarProvider>
            <SkipNav links={SKIP_LINKS} />
            <Sidebar aria-label={navLabel}>
                <SidebarContent>
                    {navSections.map((section) => (
                        <SidebarGroup key={section.title}>
                            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {section.items.map((item) => {
                                        // external 은 새 창 링크(라우트 개념 없음). 그 외엔 현재 라우트면 활성.
                                        const isActive = !item.external && pathname === item.href
                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                    aria-current={isActive ? 'page' : undefined}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        {...(item.external
                                                            ? {target: '_blank', rel: 'noopener noreferrer'}
                                                            : {})}
                                                    >
                                                        <span className="flex-1 truncate">{item.label}</span>
                                                        {item.external && (
                                                            <>
                                                                <ArrowUpRight
                                                                    aria-hidden="true"
                                                                    className="size-3.5 shrink-0"
                                                                />
                                                                <span className="sr-only"> (새 창에서 열림)</span>
                                                            </>
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
            </Sidebar>

            <SidebarInset>
                {/* 상단 앱바 — 트리거(모바일=Sheet 열기 / 데스크톱=레일 접기)·홈·타이틀·테마토글.
                    z-10: shadcn Sheet(z-50) 아래에 오도록 낮게 둔다(드로어 열리면 헤더가 오버레이 밑). */}
                <header className="border-border bg-background h-header-h wide:px-6 sticky top-0 z-10 flex items-center gap-2 border-b px-4">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground min-h-11 min-w-11" />
                    <Link
                        href="/"
                        aria-label="홈으로"
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        <Home aria-hidden="true" className="size-icon-sm" />
                    </Link>
                    {/* 장식용 앱바 타이틀 — 진짜 제목은 본문 h1(PageHeaderTitle)이라 aria-hidden 으로 중복 제거. */}
                    <p aria-hidden="true" className="typo-title-l-bold truncate">
                        {title}
                    </p>
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
