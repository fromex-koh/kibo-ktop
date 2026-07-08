'use client'

import {useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {ArrowUpRight, Home, Menu, PanelLeft, X} from 'lucide-react'
import type {GuideNavSection} from '@/constants/guide-nav'
import SkipNav, {type SkipLinkItem} from '@/components/skip-nav'
import ThemeToggle from '@/components/theme-toggle'
import tokens from '@tokens'

// works/system-guide 프로젝트의 사이드 내비게이션 구조를 이 프로젝트 브레이크포인트(wide/pc)·색상·
// 그리드·크기 토큰으로 재구성한 공용 레이아웃 셸(헤더 + 사이드 내비).
// UX: pc(1280px) 이상은 상시 고정 레일, pc 미만은 오프캔버스 드로어(햄버거로 여닫고 콘텐츠 위에 오버레이).
// 콘텐츠(children)는 소비자가 자기 컨테이너(max-w-content·grid-layout 등)로 감싸 넣는다 — 셸은 틀만 담당.

// pc 여부(≥1280px)를 미디어쿼리로 구독 — 브레이크포인트 값은 tokens.json 에서 가져와 하드코딩 방지.
const PC_MEDIA = `(min-width: ${tokens.breakpoint.pc}px)`
const subscribePc = (callback: () => void) => {
    const mql = window.matchMedia(PC_MEDIA)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
}
const getPcSnapshot = () => window.matchMedia(PC_MEDIA).matches
const getPcServerSnapshot = () => false // SSR: pc 아님으로 가정(모바일 퍼스트)

type SidebarLayoutProps = {
    title: string
    navSections: readonly GuideNavSection[]
    navLabel: string // 사이드 내비의 aria-label
    children: ReactNode
}

const SidebarLayout = ({title, navSections, navLabel, children}: SidebarLayoutProps) => {
    // pc 미만에서 드로어 열림 상태(기본 닫힘 → 콘텐츠가 바로 보임). pc 는 CSS 로 상시 레일이라 이 값과 무관.
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const pathname = usePathname()
    const isPc = useSyncExternalStore(subscribePc, getPcSnapshot, getPcServerSnapshot)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const navRef = useRef<HTMLElement>(null)

    const isDrawerMode = !isPc // pc 미만 = 드로어로 동작
    const isDrawerActive = isDrawerMode && isDrawerOpen // 드로어가 실제로 열려 오버레이 중
    const isNavOffCanvas = isDrawerMode && !isDrawerOpen // 화면 밖으로 숨은 상태 → inert 로 초점/AT 제외
    const closeDrawer = () => setIsDrawerOpen(false)

    // Esc 로 닫고, 닫힌 뒤 초점을 토글 버튼으로 복귀 (KWCAG 8.2.1)
    useEffect(() => {
        if (!isDrawerActive) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDrawerOpen(false)
                toggleRef.current?.focus()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isDrawerActive])

    // 드로어가 열리면 초점을 내비로 이동(키보드/스크린리더가 메뉴에 진입) + 배경 스크롤 잠금
    useEffect(() => {
        if (!isDrawerActive) return
        navRef.current?.focus()
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prevOverflow
        }
    }, [isDrawerActive])

    // '주메뉴 바로가기' — pc 미만(드로어 모드)에선 내비가 닫혀 inert 라 바로 포커스가 안 간다.
    // 이때는 기본 앵커 이동을 막고 드로어를 열면, isDrawerActive 효과가 내비로 포커스를 옮긴다.
    const skipToMenu = (event: MouseEvent<HTMLAnchorElement>) => {
        if (isDrawerMode) {
            event.preventDefault()
            setIsDrawerOpen(true)
        }
    }
    const skipLinks: readonly SkipLinkItem[] = [
        {href: '#main', label: '본문 바로가기'},
        {href: '#sidebar-layout-nav', label: '주메뉴 바로가기', onSelect: skipToMenu},
    ]

    return (
        <div className="bg-background text-foreground min-h-screen">
            <SkipNav links={skipLinks} />
            <header className="border-border bg-background wide:px-6 h-header-h z-header sticky top-0 flex items-center gap-3 border-b px-4">
                {/* 햄버거 — pc 미만에서만. pc 는 상시 레일이라 토글이 불필요해 숨긴다.
            터치 타깃은 44px(min-h-11/min-w-11) 유지(KWCAG 6.1.3), 아이콘만 한 단계 작게(icon-sm)
            해서 은은한 모노톤 원형으로 보이게 한다. */}
                <button
                    ref={toggleRef}
                    type="button"
                    onClick={() => setIsDrawerOpen((open) => !open)}
                    aria-label={isDrawerOpen ? '사이드 메뉴 닫기' : '사이드 메뉴 열기'}
                    aria-expanded={isDrawerOpen}
                    aria-controls="sidebar-layout-nav"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background pc:hidden inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    {isDrawerOpen ? (
                        <X aria-hidden="true" className="size-icon-sm" />
                    ) : (
                        <Menu aria-hidden="true" className="size-icon-sm" />
                    )}
                </button>
                <Link
                    href="/"
                    aria-label="홈으로"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    <Home aria-hidden="true" className="size-icon-sm" />
                </Link>
                {/* 헤더 중앙 타이틀 — 로고 아이콘 + 큰 글자로 "이 앱/섹션 이름"을 시각적으로 드러내는
            장식용 앱바 타이틀이다(모바일 앱의 상단 타이틀 바와 같은 성격). 실제 콘텐츠의 진짜
            제목은 본문 <h1>(PageHeaderTitle)이 따로 담당하며, 이 텍스트는 그걸 그대로 반복하거나
            (사이드 메뉴 레이아웃 데모) 고정 브랜드명만 보여준다(컴포넌트 가이드). heading 태그로
            바꾸면 페이지마다 다른 실제 h1 과 충돌·중복되므로, 시각적으로만 보여주고 스크린
            리더에서는 제외해 "제목처럼 보이지만 heading이 아니다"라는 WAVE 경고의 근거 자체를
            없앤다(중복 정보라 스크린리더 사용자는 본문의 진짜 h1 을 그대로 듣는다). */}
                <div className="flex flex-1 items-center justify-center gap-2 truncate">
                    <PanelLeft aria-hidden="true" className="text-primary size-icon-md shrink-0" />
                    <p aria-hidden="true" className="typo-title-l-bold truncate">
                        {title}
                    </p>
                </div>
                {/* 우측: 라이트/다크 토글. 좌측 아이콘 그룹과 균형을 맞춰 타이틀이 중앙에 오도록,
            pc 미만에선(좌측이 햄버거+홈 2개) 빈 자리 하나를 더 둔다(pc 에선 좌측이 홈 하나라 숨김). */}
                <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="pc:hidden min-h-11 min-w-11" />
                    <ThemeToggle />
                </div>
            </header>

            {/* pc 는 상시 레일이라 본문을 사이드바 폭만큼 항상 밀어둔다(pc 미만은 드로어가 오버레이라 안 밈). */}
            <div className="pc:pl-sidebar-pl">
                {/* 백드롭(반투명 배경) — pc 미만에서 드로어가 열렸을 때만. 눌러서 닫기(마우스 편의, 키보드는 Esc/X).
            드로어 레이어 z 토큰(z-drawer-backdrop)으로 본문 위에 확실히 올린다 — 본문의 positioned
            요소(색상 스와치 등)가 위로 새는 것을 막는다. z-[숫자] 하드코딩이 아닌 토큰이라 [CD-002] 준수. */}
                <button
                    type="button"
                    onClick={closeDrawer}
                    aria-hidden="true"
                    tabIndex={-1}
                    className={`top-header-top z-drawer-backdrop pc:hidden fixed inset-x-0 bottom-0 bg-[var(--ds-overlay-lg)] transition-opacity duration-200 motion-reduce:transition-none ${
                        isDrawerActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                />

                {/* 사이드 내비 — pc: 상시 고정 레일 / pc 미만: 왼쪽에서 슬라이드되는 오프캔버스 드로어.
            숨었을 때(off-canvas)는 inert 로 초점 이동·스크린리더에서 제외한다. */}
                <nav
                    ref={navRef}
                    id="sidebar-layout-nav"
                    tabIndex={-1}
                    inert={isNavOffCanvas || undefined}
                    aria-label={navLabel}
                    className={`border-border bg-background wide:px-6 top-header-top z-drawer pc:translate-x-0 pc:py-8 w-sidebar-w focus-visible:ring-ring fixed bottom-0 left-0 flex flex-col gap-6 overflow-y-auto border-r p-4 transition-transform duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-inset motion-reduce:transition-none ${
                        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {navSections.map((section) => (
                        <div key={section.title} className="flex flex-col gap-2">
                            <h2 className="typo-caption-regular text-muted-foreground px-1 font-semibold uppercase">
                                {section.title}
                            </h2>
                            <ul className="flex flex-col gap-0.5">
                                {section.items.map((item) => {
                                    // external 은 새 창 링크(현재 라우트 개념 없음). 그 외엔 현재 라우트면 활성 표시. [KWCAG 5.3.1]
                                    const isActive = !item.external && pathname === item.href
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={closeDrawer}
                                                {...(item.external
                                                    ? {target: '_blank', rel: 'noopener noreferrer'}
                                                    : {})}
                                                aria-current={isActive ? 'page' : undefined}
                                                className={`focus-visible:ring-ring focus-visible:ring-offset-background typo-body-l-regular flex items-center justify-between gap-1.5 rounded-lg px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                                    isActive
                                                        ? 'bg-primary/10 text-foreground font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                                                }`}
                                            >
                                                {item.label}
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
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* 본문 — 드로어가 열리면 배경으로서 inert(뒤 콘텐츠와 상호작용 차단 → 모달 성격).
            내부 컨테이너(폭 상한·패딩·그리드)는 children 쪽에서 정한다. */}
                {/* id·tabIndex=-1 로 '본문 바로가기' 스킵 링크의 포커스 대상이 된다(포커스 후 다음 Tab 은
            본문으로 이어짐). 브라우저 기본 아웃라인 대신 내비와 같은 브랜드 링으로 통일한다. */}
                <main
                    id="main"
                    tabIndex={-1}
                    inert={isDrawerActive || undefined}
                    className="focus-visible:ring-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}

export default SidebarLayout
