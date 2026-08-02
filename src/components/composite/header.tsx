'use client'

import Image from 'next/image'
import Link from 'next/link'
import {Suspense, useRef, useState} from 'react'
import {useSearchParams} from 'next/navigation'
import {ExternalLink, Menu, Moon, Sun, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {headerIconButtonClassName, headerIconGroupClassName} from '@/components/theme/header.variants'
import {useThemeToggle} from '@/hooks/use-theme-toggle'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: Header primitive가 없어 NavigationMenu·SegmentedControl·Sheet·Button을 조합한 사이트 상단 합성 컴포넌트.
// PROJECT-STYLE: 로고는 h1 > a > img 구조를 유지하고 테마 클래스에 맞는 에셋을 노출한다.
// 유틸 링크는 Button text variant 위에 Header 전용 자간만 보정한다.
type UserType = 'corp' | 'org'

export type HeaderNavLink = {
    label: string
    href: string
    external?: boolean
}

export type HeaderNavigationByUserType = Record<UserType, readonly HeaderNavLink[]>

const DEFAULT_NAV_LINKS: readonly HeaderNavLink[] = [
    {label: '플랫폼 소개', href: '#'},
    {label: '기술평가', href: '#'},
    {label: '특허평가', href: '#'},
    {label: 'K-BIGx 보고서', href: '#'},
    {label: '탄소중립', href: '#', external: true},
]

const UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그인/회원가입'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

const USER_TYPES = ['corp', 'org'] satisfies readonly UserType[]

const isUserType = (value: string | null): value is UserType => value === 'corp' || value === 'org'

// 헤더 상단에서 기업/기관 화면 유형을 전환하는 링크 세그먼티드.
const MemberTypeToggle = ({userType, searchParams}: {userType: UserType; searchParams: string}) => {
    const getHref = (nextUserType: UserType) => {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('userType', nextUserType)
        return `?${nextParams.toString()}`
    }

    return (
        <SegmentedControl type="link" aria-label="화면 유형">
            {USER_TYPES.map((value) => (
                <SegmentedControlItem
                    key={value}
                    href={getHref(value)}
                    replace
                    scroll={false}
                    aria-current={userType === value ? 'page' : undefined}
                >
                    {value === 'corp' ? '기업' : '기관'}
                </SegmentedControlItem>
            ))}
        </SegmentedControl>
    )
}

// 링크 의미는 유지하고 Button text variant의 토큰/포커스 스타일을 재사용한다.
// 시안 상단 유틸바는 14px Medium(행간 21)이다 — text 계열에서 그 크기는 sm 이다.
// (button_text 시안 기준 xs 12 · sm 14 · md 16 · lg 18)
const UtilityLink = ({label, external, className}: {label: string; external?: boolean; className?: string}) => (
    <Button
        variant="text"
        size="sm"
        asChild
        className={cn('tracking-control-label font-medium', external ? 'gap-0.5' : undefined, className)}
    >
        <Link href="#" {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
            {label}
            {external ? <ExternalLink aria-hidden="true" className="size-icon-sm" /> : null}
        </Link>
    </Button>
)

// 로고는 모든 화면에 반복되는 사이트 식별자라 제목(h1)이 아니다. h1 은 화면마다 하나뿐인 본문
// 제목(PageTitleBar·히어로 등)의 몫이다. 데모처럼 이동 경로가 정해진 사용처만 logoHref 를 전달한다. [KWCAG 6.4.2]
const Logo = ({overlay, href}: {overlay: boolean; href?: string}) => {
    const image = (
        <>
            {overlay ? (
                // 메인페이지는 항상 어두운 배경이라 화이트 로고 한 장만 둔다.
                <Image
                    src="/images/logo-ktop-white.svg"
                    alt=""
                    draggable={false}
                    width={140}
                    height={32}
                    priority
                    className="h-8 w-35 shrink-0"
                />
            ) : (
                // 두 장을 두고 --logo-on-*(globals.css) 로 배경 명도에 맞는 쪽만 표시한다.
                // dark: 변형은 중첩 고정한 테마 미리보기에서 틀린 쪽을 고른다 — Footer 와 같은 방식.
                <>
                    <Image
                        src="/images/logo-ktop.svg"
                        alt=""
                        draggable={false}
                        width={140}
                        height={32}
                        priority
                        className="[display:var(--logo-on-light)] h-8 w-35 shrink-0"
                    />
                    <Image
                        src="/images/logo-ktop-white.svg"
                        alt=""
                        draggable={false}
                        width={140}
                        height={32}
                        priority
                        className="[display:var(--logo-on-dark)] h-8 w-35 shrink-0"
                    />
                </>
            )}
        </>
    )

    // 이름은 감싸는 요소의 sr-only 텍스트가 갖고 로고 이미지는 모두 alt="" 로 둔다 — 두 장에 같은 대체
    // 텍스트를 주면 보조기기에 같은 이름이 겹쳐 읽히고(WAVE "A nearby image has the same alternative text"),
    // 한쪽에만 alt 를 주면 테마가 바뀌어 그쪽이 display:none 이 될 때 이름이 사라진다. [KWCAG 5.1.1/6.4.3]
    return (
        <p className="shrink-0">
            {href ? (
                <Link href={href} className="flex shrink-0 items-center">
                    <span className="sr-only">기술보증기금 홈</span>
                    {image}
                </Link>
            ) : (
                <span className="flex shrink-0 items-center">
                    <span className="sr-only">기술보증기금</span>
                    {image}
                </span>
            )}
        </p>
    )
}

// 실제 Header와 가이드 데모가 공유하는 본문.
// 헤더의 테마 전환 — 시안대로 아이콘만 둔다(가이드 앱바에서 쓰는 ThemeToggle 은 버튼 면이 있는 별개 컴포넌트).
// 마운트 전에는 아이콘과 같은 크기의 자리표시자를 그려 하이드레이션 불일치·레이아웃 시프트를 피한다.
const HeaderThemeToggle = () => {
    const {isMounted, isDark, label, toggleTheme} = useThemeToggle()

    if (!isMounted) {
        return <div className="size-icon-lg" aria-hidden="true" />
    }

    return (
        <button
            type="button"
            className={headerIconButtonClassName}
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
    )
}

const HeaderMenu = ({
    navLinks,
    open,
    onOpenChange,
}: {
    navLinks: readonly HeaderNavLink[]
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuContentRef = useRef<HTMLDivElement>(null)
    const firstMenuLinkRef = useRef<HTMLAnchorElement>(null)
    const [isClosing, setIsClosing] = useState(false)
    const label = open ? '전체 메뉴 닫기' : '전체 메뉴 열기'
    const menuIconMotionClassName =
        'absolute inset-0 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none'
    const closeIconMotionClassName =
        'absolute inset-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

    return (
        <Sheet
            modal={false}
            open={open}
            onOpenChange={(nextOpen) => {
                setIsClosing(open && !nextOpen)
                onOpenChange(nextOpen)
            }}
        >
            <SheetTrigger asChild>
                <button
                    ref={triggerRef}
                    type="button"
                    className={headerIconButtonClassName}
                    data-header-menu-trigger
                    aria-label={label}
                    aria-expanded={open}
                    title={label}
                    onKeyDown={(event) => {
                        if (!open || event.key !== 'Tab') return

                        event.preventDefault()
                        if (!event.shiftKey) {
                            firstMenuLinkRef.current?.focus()
                            return
                        }

                        const focusableItems = menuContentRef.current?.querySelectorAll<HTMLElement>(
                            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                        )
                        focusableItems?.[focusableItems.length - 1]?.focus()
                    }}
                >
                    <span aria-hidden="true" className="size-icon-lg relative">
                        <Menu
                            className={cn(
                                menuIconMotionClassName,
                                open ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
                                isClosing && 'motion-safe:animate-header-menu-trigger-return',
                            )}
                        />
                        <X
                            className={cn(
                                closeIconMotionClassName,
                                open
                                    ? 'motion-safe:animate-header-menu-close-enter scale-100 rotate-0 opacity-100'
                                    : 'scale-75 -rotate-180 opacity-0',
                            )}
                        />
                    </span>
                </button>
            </SheetTrigger>
            <SheetContent
                ref={menuContentRef}
                side="right"
                showCloseButton={false}
                onOpenAutoFocus={(event) => {
                    event.preventDefault()
                    triggerRef.current?.focus()
                }}
                onFocusOutside={(event) => event.preventDefault()}
                onKeyDown={(event) => {
                    if (event.key !== 'Tab') return

                    const focusableItems = menuContentRef.current?.querySelectorAll<HTMLElement>(
                        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                    )
                    if (!focusableItems?.length) return

                    const firstItem = focusableItems[0]
                    const lastItem = focusableItems[focusableItems.length - 1]
                    const shouldReturnToTrigger =
                        (event.shiftKey && event.target === firstItem) || (!event.shiftKey && event.target === lastItem)

                    if (shouldReturnToTrigger) {
                        event.preventDefault()
                        triggerRef.current?.focus()
                    }
                }}
                className="data-[side=right]:data-closed:slide-out-to-right-0 data-[side=right]:data-open:slide-in-from-right-0 h-dvh max-w-none gap-0 overflow-y-auto overscroll-y-contain border-0 data-[side=right]:w-screen data-[side=right]:border-0 data-[side=right]:sm:max-w-none"
            >
                <SheetHeader className="content-layout gap-0 px-0 py-0">
                    <div aria-hidden="true" className="hidden h-14 lg:block" />
                    <div className="flex h-14 items-center">
                        <SheetTitle className="typo-h4-bold">전체 메뉴</SheetTitle>
                    </div>
                </SheetHeader>

                <div className="content-layout flex flex-1 flex-col pt-6 pb-10 md:pt-8 landscape:pt-4">
                    <nav
                        aria-label="전체 메뉴"
                        className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-x-6 xl:grid-cols-3"
                    >
                        {navLinks.map((link, index) => (
                            <SheetClose asChild key={link.label}>
                                <Link
                                    ref={index === 0 ? firstMenuLinkRef : undefined}
                                    href={link.href}
                                    className="typo-title-m-bold border-border hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center gap-1 rounded-md px-3 focus:outline-none focus-visible:ring-2 md:min-h-20 md:items-start md:rounded-none md:border-t md:px-1 md:py-4 xl:min-h-24 xl:py-5"
                                    {...(link.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                >
                                    {link.label}
                                    {link.external ? (
                                        <ExternalLink aria-hidden="true" className="size-icon-sm" />
                                    ) : null}
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>

                    <div className="border-border mt-6 flex flex-col gap-1 border-t pt-4 md:mt-8 md:flex-row md:flex-wrap md:gap-x-6 landscape:mt-4">
                        {UTILITY_LINKS.map((link) => (
                            <SheetClose asChild key={link.label}>
                                <UtilityLink
                                    {...link}
                                    className="not-disabled:hover:bg-navy-50 not-disabled:hover:text-navy-600 min-h-11 w-full justify-start rounded-md px-3 md:w-auto"
                                />
                            </SheetClose>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

const HeaderContent = ({
    navLabel,
    overlay,
    compact,
    showThemeToggle,
    navigationByUserType,
    logoHref,
    userType,
    searchParams,
}: {
    navLabel: string
    overlay: boolean
    compact: boolean
    showThemeToggle: boolean
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
    userType: UserType
    searchParams: string
}) => {
    const navLinks = navigationByUserType?.[userType] ?? DEFAULT_NAV_LINKS
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="flex flex-col">
            {/* 주 메뉴가 한 줄에 들어가는 lg(1024)부터 PC 헤더로 전환하고, xl(1280)부터 항목 간격을
                넓힌다. lg 미만에서는 유틸바·주 메뉴를 숨겨 로고+햄버거만 남긴다(링크는 전체 메뉴 Sheet에 유지). */}
            <div
                className={cn('hidden justify-end lg:flex', menuOpen && 'invisible')}
                inert={menuOpen || undefined}
                aria-hidden={menuOpen || undefined}
            >
                <div className="flex items-center gap-2 py-2 xl:gap-4">
                    <MemberTypeToggle userType={userType} searchParams={searchParams} />
                    {UTILITY_LINKS.map((link) => (
                        <UtilityLink key={link.label} {...link} />
                    ))}
                </div>
            </div>

            <div className={cn('flex items-center py-3', compact ? 'gap-5' : 'gap-6 xl:gap-10')}>
                <div
                    className={cn('shrink-0', menuOpen && 'invisible')}
                    inert={menuOpen || undefined}
                    aria-hidden={menuOpen || undefined}
                >
                    <Logo overlay={overlay} href={logoHref} />
                </div>

                <div
                    className={cn('hidden lg:flex', menuOpen && 'invisible')}
                    inert={menuOpen || undefined}
                    aria-hidden={menuOpen || undefined}
                >
                    <NavigationMenu aria-label={navLabel} viewport={false} className="hidden lg:flex">
                        <NavigationMenuList className={compact ? 'gap-5' : 'gap-6 xl:gap-10'}>
                            {navLinks.map((link) => (
                                <NavigationMenuItem key={link.label}>
                                    <NavigationMenuLink
                                        asChild
                                        className={cn(
                                            'text-foreground min-h-11 rounded-none px-0 py-0 whitespace-nowrap hover:bg-transparent focus:bg-transparent',
                                            compact ? 'typo-title-l-bold' : 'typo-title-xl-bold',
                                        )}
                                    >
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-1"
                                            {...(link.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                        >
                                            {link.label}
                                            {link.external ? (
                                                <ExternalLink aria-hidden="true" className="size-icon-lg" />
                                            ) : null}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className={headerIconGroupClassName}>
                    <div
                        className={cn(
                            'size-icon-lg flex shrink-0 items-center justify-center',
                            !showThemeToggle && 'hidden',
                            menuOpen && 'invisible',
                        )}
                        inert={menuOpen || undefined}
                        aria-hidden={menuOpen || undefined}
                    >
                        {showThemeToggle ? <HeaderThemeToggle /> : null}
                    </div>
                    <HeaderMenu navLinks={navLinks} open={menuOpen} onOpenChange={setMenuOpen} />
                </div>
            </div>
        </div>
    )
}

type HeaderProps = {
    overlay?: boolean
    showThemeToggle?: boolean
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
}

const ResolvedHeaderContent = ({
    navLabel,
    overlay,
    compact,
    showThemeToggle,
    navigationByUserType,
    logoHref,
}: {
    navLabel: string
    overlay: boolean
    compact: boolean
    showThemeToggle: boolean
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
}) => {
    const searchParams = useSearchParams()
    const userTypeParam = searchParams.get('userType')
    const userType = isUserType(userTypeParam) ? userTypeParam : 'corp'

    return (
        <HeaderContent
            navLabel={navLabel}
            overlay={overlay}
            compact={compact}
            showThemeToggle={showThemeToggle}
            navigationByUserType={navigationByUserType}
            logoHref={logoHref}
            userType={userType}
            searchParams={searchParams.toString()}
        />
    )
}

const Header = ({overlay = true, showThemeToggle = false, navigationByUserType, logoHref}: HeaderProps) => {
    return (
        <header
            className={cn(
                'z-header has-[[data-header-menu-trigger][aria-expanded=true]]:z-popover inset-x-0 top-0 has-[[data-header-menu-trigger][aria-expanded=true]]:bg-transparent! has-[[data-header-menu-trigger][aria-expanded=true]]:transition-none!',
                overlay ? 'fixed' : 'bg-card sticky',
            )}
        >
            {/* 헤더 콘텐츠 열은 화면 본문과 같은 content-layout 을 쓴다 — 좌우 여백을 헤더 안쪽 px 로 주면
                로고·메뉴가 본문 시작선보다 안으로 들어가 어긋난다(좁은 화면의 가장자리 여백은 content-layout 이 담당). */}
            <div className="content-layout">
                <Suspense
                    fallback={
                        <HeaderContent
                            navLabel="주 메뉴"
                            overlay={overlay}
                            compact={false}
                            showThemeToggle={showThemeToggle}
                            navigationByUserType={navigationByUserType}
                            logoHref={logoHref}
                            userType="corp"
                            searchParams=""
                        />
                    }
                >
                    <ResolvedHeaderContent
                        navLabel="주 메뉴"
                        overlay={overlay}
                        compact={false}
                        showThemeToggle={showThemeToggle}
                        navigationByUserType={navigationByUserType}
                        logoHref={logoHref}
                    />
                </Suspense>
            </div>
        </header>
    )
}

// 컴포넌트 가이드 카드 안에서 쓰는 데모. fixed 배치는 카드 안에서 재현할 수 없어 로고·테마 조합만 보여준다.
export const HeaderDemo = ({
    overlay = false,
    showThemeToggle = true,
    navigationByUserType,
}: {
    overlay?: boolean
    showThemeToggle?: boolean
    navigationByUserType?: HeaderNavigationByUserType
}) => (
    <div className="border-border bg-background overflow-hidden rounded-lg border">
        <Suspense
            fallback={
                <HeaderContent
                    navLabel="헤더 데모 메뉴"
                    overlay={overlay}
                    compact
                    showThemeToggle={showThemeToggle}
                    navigationByUserType={navigationByUserType}
                    userType="corp"
                    searchParams=""
                />
            }
        >
            <ResolvedHeaderContent
                navLabel="헤더 데모 메뉴"
                overlay={overlay}
                compact
                showThemeToggle={showThemeToggle}
                navigationByUserType={navigationByUserType}
            />
        </Suspense>
    </div>
)

export default Header
