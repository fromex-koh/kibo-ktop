'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type KeyboardEvent} from 'react'
import {ExternalLink, Menu, Moon, Sun, TimerReset, X} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {DEFAULT_HEADER_NAVIGATION, MENU_SERVICE_GROUPS, UTILITY_LINKS} from '@/constants/header-navigation'
import type {HeaderNavLink, HeaderNavigationByUserType, UserType} from '@/constants/header-navigation'
import {
    headerHiddenWhenMenuOpenClassName,
    headerIconButtonClassName,
    headerIconGroupClassName,
    headerNavDropdownClassName,
    headerNavDropdownItemClassName,
    headerNavTriggerClassName,
} from '@/components/theme/header.variants'
import {useThemeToggle} from '@/hooks/use-theme-toggle'
import {cn} from '@/lib/utils'

// 기존 Header export를 유지해 외부 사용처의 import 경로를 보존한다.
export {DEFAULT_HEADER_NAVIGATION}
export type {HeaderNavLink, HeaderNavigationByUserType, UserType}

// 로그인 후 확정된 userType을 표시하는 배지.
const USER_TYPE_BADGE = {
    corp: {label: '기업', color: 'info'},
    org: {label: '기관', color: 'secondary-purple'},
} as const satisfies Record<UserType, {label: string; color: NonNullable<ComponentProps<typeof Badge>['color']>}>

// 로그인 상태 표시와 세션 연장에 필요한 사용자 정보.
export type HeaderUser = {
    name: string
    sessionRemaining: string
}

// 전체 메뉴 닫힘 애니메이션과 헤더 상태를 동기화하는 시간.
const MENU_EXIT_DURATION_MS = 200

const USER_TYPES = ['corp', 'org'] satisfies readonly UserType[]

const isUserType = (value: string | null): value is UserType => value === 'corp' || value === 'org'

// 로그인 전 기업·기관 메뉴를 Header 내부 state로 전환한다. URL에는 선택 상태를 남기지 않는다.
const MemberTypeToggle = ({
    userType,
    onUserTypeChange,
}: {
    userType: UserType
    onUserTypeChange: (userType: UserType) => void
}) => (
    <SegmentedControl
        type="radio"
        value={userType}
        onValueChange={(value) => {
            if (isUserType(value)) onUserTypeChange(value)
        }}
        aria-label="화면 유형"
    >
        {USER_TYPES.map((value) => (
            <SegmentedControlItem key={value} value={value}>
                {value === 'corp' ? '기업' : '기관'}
            </SegmentedControlItem>
        ))}
    </SegmentedControl>
)

// 로그인한 회원의 userType 배지.
const UserTypeBadge = ({userType}: {userType: UserType}) => {
    const badge = USER_TYPE_BADGE[userType]

    return (
        <Badge variant="solid" color={badge.color} shape="pill" size="sm" className="mr-2 min-w-0 shrink-0">
            {badge.label}
        </Badge>
    )
}

// 로그인 후 남은 시간과 연장 안내 모달을 표시한다. 실제 세션 연장 동작은 서비스에서 연결한다.
const SessionTimer = ({remaining}: {remaining: string}) => (
    <div className="flex items-center gap-1">
        <p className="tracking-control-label flex items-center gap-1 text-sm font-medium">
            <TimerReset aria-hidden="true" className="size-icon-sm shrink-0" />
            <span className="sr-only">로그인 유지 시간</span>
            {remaining}
        </p>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="text-underline" size="sm" type="button" className="font-normal">
                    연장
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>로그인 연장</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogBodyClassName, 'gap-4')}>
                    <DialogDescription>
                        로그아웃까지 남은 시간 : <strong className="text-primary font-bold">{remaining}</strong>
                    </DialogDescription>
                    <p className="typo-body-xl-regular text-label-foreground">
                        10분 동안 서비스를 이용하지 않아 잠시 후 자동으로 로그아웃될 예정입니다.
                        <br />
                        로그인 시간을 연장하시겠어요?
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="tertiary" size="xl">
                            로그아웃
                        </Button>
                    </DialogClose>
                    <Button size="xl">로그인 연장</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
)

const UtilityLink = ({
    label,
    href,
    external,
    className,
}: {
    label: string
    href: string
    external?: boolean
    className?: string
}) => (
    <Button
        variant="text"
        size="sm"
        asChild
        className={cn('tracking-control-label font-medium', external ? 'gap-0.5' : undefined, className)}
    >
        <Link href={href} {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
            {label}
            {external ? <ExternalLink aria-hidden="true" className="size-icon-sm" /> : null}
        </Link>
    </Button>
)

// 로그인 후 로그아웃 확인 모달. 실제 로그아웃 처리는 서비스에서 연결한다.
const LogoutDialog = ({className}: {className?: string}) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button
                variant="text"
                size="sm"
                type="button"
                className={cn('tracking-control-label font-medium', className)}
            >
                로그아웃
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>로그아웃 안내</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-4')}>
                <DialogDescription>로그아웃 하시겠어요?</DialogDescription>
                <p className="typo-body-xl-regular text-label-foreground">
                    현재 계정에서 로그아웃됩니다.
                    <br />
                    다시 이용하시려면 로그인해 주세요.
                </p>
            </div>
            <DialogFooter>
                <Button size="xl">로그아웃</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

// 열린 GNB 드롭다운의 첫 링크로 포커스를 이동한다.
const focusOpenDropdownFirstItem = (nav: HTMLElement | null) => {
    nav?.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-content"][data-state="open"] a[href], [data-slot="navigation-menu-content"] a[href]',
    )?.focus()
}

// 로고 링크 기본값은 루트(/)이며 logoHref로 경로를 변경할 수 있다.
const Logo = ({overlay, href}: {overlay: boolean; href?: string}) => {
    const image = (
        <>
            {/* 오버레이 헤더는 흰색 로고, 고정 헤더는 현재 테마에 맞는 로고를 표시한다. */}
            {overlay ? (
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

    // 테마별 로고는 하나만 표시하고 브랜드명은 보조기기에 한 번만 제공한다.
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

// 마운트 전 placeholder를 표시해 테마 확인에 따른 hydration 불일치와 레이아웃 이동을 막는다.
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

// 전체 메뉴 링크. external이면 새 창과 외부 링크 아이콘을 사용한다.
const MenuLink = ({label, href, external, className}: HeaderNavLink & {className?: string}) => (
    <Link
        href={href}
        className={cn(
            'hover:text-menu-overlay-accent aria-[current=page]:text-menu-overlay-accent inline-flex w-fit items-center gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
            className,
        )}
        {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
    >
        {label}
        {external ? <ExternalLink aria-hidden="true" className="size-icon-md -translate-y-0.5" /> : null}
    </Link>
)

const HeaderMenu = ({
    navLinks,
    userType,
    open,
    onOpenChange,
}: {
    navLinks: readonly HeaderNavLink[]
    userType: UserType
    open: boolean
    onOpenChange: (open: boolean) => void
}) => {
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuContentRef = useRef<HTMLDivElement>(null)
    const [isClosing, setIsClosing] = useState(false)
    const [headerHeight, setHeaderHeight] = useState(0)
    // 닫힘 애니메이션이 끝날 때까지 메뉴 오버레이를 유지한다.
    const [isSheetVisible, setIsSheetVisible] = useState(false)

    // 모바일에서 상단 유틸리티가 여러 줄로 늘어날 수 있으므로 실제 헤더 높이를 메뉴 시작 위치에 반영한다.
    useLayoutEffect(() => {
        if (!open) return

        const header = triggerRef.current?.closest('header')
        if (!header) return

        const updateHeaderHeight = () => setHeaderHeight(Math.ceil(header.getBoundingClientRect().height))
        const observer = new ResizeObserver(updateHeaderHeight)

        updateHeaderHeight()
        observer.observe(header)

        return () => observer.disconnect()
    }, [open])

    useEffect(() => {
        if (open) return

        const timeoutId = setTimeout(() => setIsSheetVisible(false), MENU_EXIT_DURATION_MS)
        return () => clearTimeout(timeoutId)
    }, [open])
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
                if (nextOpen) setIsSheetVisible(true)
                onOpenChange(nextOpen)
            }}
        >
            <SheetTrigger asChild>
                <button
                    ref={triggerRef}
                    type="button"
                    className={headerIconButtonClassName}
                    data-header-menu-trigger
                    // 닫힘 애니메이션 중에도 헤더를 오버레이 위에 유지하기 위한 상태 표식.
                    data-menu-visible={open || isSheetVisible || undefined}
                    aria-label={label}
                    aria-expanded={open}
                    title={label}
                    onKeyDown={(event) => {
                        if (!open || event.key !== 'Tab') return

                        // Tab으로 메뉴를 열었을 때 첫 메뉴 항목으로 이동한다.
                        if (event.shiftKey) return

                        event.preventDefault()
                        // DOM 순서상 첫 번째 포커스 가능 요소를 선택한다.
                        menuContentRef.current
                            ?.querySelector<HTMLElement>(
                                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                            )
                            ?.focus()
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
                className="bg-menu-overlay text-menu-overlay-foreground outline-menu-overlay-foreground h-dvh max-w-none gap-0 overflow-hidden border-0 data-[side=right]:right-auto data-[side=right]:left-0 data-[side=right]:w-screen data-[side=right]:border-0 data-[side=right]:data-closed:[--tw-exit-translate-x:0] data-[side=right]:data-open:[--tw-enter-translate-x:0] data-[side=right]:sm:max-w-none"
            >
                {/* SheetTitle은 스크린리더에 전체 메뉴 이름을 제공한다. */}
                <SheetHeader className="sr-only">
                    <SheetTitle>전체 메뉴</SheetTitle>
                </SheetHeader>

                {/* 고정 헤더 영역만큼 여백을 두어 메뉴 콘텐츠가 헤더와 겹치지 않게 한다. */}
                <div
                    aria-hidden="true"
                    className="h-28 shrink-0 xl:h-30"
                    style={headerHeight > 0 ? {height: `${headerHeight}px`} : undefined}
                />

                {/* 메뉴 본문만 스크롤한다. */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="content-layout flex flex-col pb-10">
                        <nav
                            aria-label="전체 메뉴"
                            className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3 md:gap-y-10 xl:grid-cols-5 xl:gap-x-0"
                        >
                            {navLinks.map((link) => (
                                <div key={link.label} className="flex flex-col">
                                    {/* 메뉴 그룹은 h3, 하위 메뉴는 목록으로 구성한다. */}
                                    <h3 className="typo-h4-bold">
                                        {link.items?.length ? (
                                            link.label
                                        ) : (
                                            <SheetClose asChild>
                                                <MenuLink {...link} />
                                            </SheetClose>
                                        )}
                                    </h3>
                                    {link.items?.length ? (
                                        <ul className="typo-body-xl-medium text-menu-overlay-foreground-subtle mt-4 flex flex-col gap-4 md:mt-6 md:gap-6 xl:mt-12">
                                            {link.items.map((item) => (
                                                <li key={item.label}>
                                                    <SheetClose asChild>
                                                        <MenuLink {...item} />
                                                    </SheetClose>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            ))}
                        </nav>

                        <div className="mt-15 flex flex-col gap-6 xl:mt-25">
                            {MENU_SERVICE_GROUPS[userType].groups.map((group) => (
                                <div
                                    key={group.label}
                                    className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0"
                                >
                                    <h3 className="typo-body-xl-bold md:w-30 md:shrink-0">{group.label}</h3>
                                    <ul className="typo-body-xl-regular text-menu-overlay-foreground-subtle flex flex-wrap items-center gap-x-6 gap-y-2">
                                        {group.items.map((item, index) => {
                                            const menuItem = typeof item === 'string' ? {label: item, href: '#'} : item

                                            return (
                                                <li key={menuItem.label} className="flex items-center gap-x-6">
                                                    {/* 장식용 구분선은 보조기기에서 제외한다. */}
                                                    {index > 0 ? (
                                                        <span
                                                            aria-hidden="true"
                                                            className="bg-menu-overlay-border h-3 w-px shrink-0"
                                                        />
                                                    ) : null}
                                                    <SheetClose asChild>
                                                        <MenuLink {...menuItem} />
                                                    </SheetClose>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
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
    showUserTypeToggle,
    navigationByUserType,
    logoHref,
    userType,
    user,
    onUserTypeChange,
}: {
    navLabel: string
    overlay: boolean
    compact: boolean
    showThemeToggle: boolean
    showUserTypeToggle: boolean
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
    userType: UserType
    user?: HeaderUser
    onUserTypeChange: (userType: UserType) => void
}) => {
    // 전달받은 userType의 메뉴를 데스크톱 GNB와 모바일 전체 메뉴에 동일하게 적용한다.
    const navLinks = (navigationByUserType ?? DEFAULT_HEADER_NAVIGATION)[userType]
    const [menuOpen, setMenuOpen] = useState(false)

    // GNB 드롭다운이 열릴 때 포커스를 패널 안으로 이동한다.
    const [openNavMenu, setOpenNavMenu] = useState('')
    const shouldEnterDropdownRef = useRef(false)

    const enterDropdownOnMount = (node: HTMLDivElement | null) => {
        if (!node || !shouldEnterDropdownRef.current) return

        shouldEnterDropdownRef.current = false
        node.querySelector<HTMLElement>('a[href]')?.focus()
    }

    // ArrowDown으로 드롭다운을 열고 첫 항목으로 이동한다.
    const handleDropdownEntryKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: string) => {
        if (event.key !== 'ArrowDown') return

        event.preventDefault()
        event.stopPropagation()

        // 이미 열린 메뉴는 즉시 첫 항목으로 이동한다.
        if (openNavMenu === value) {
            focusOpenDropdownFirstItem(event.currentTarget.closest('[data-slot="navigation-menu"]'))
            return
        }

        shouldEnterDropdownRef.current = true
        setOpenNavMenu(value)
    }

    return (
        <div className="flex flex-col">
            {/* 데스크톱은 GNB, 모바일은 로고와 전체 메뉴를 표시한다. 전체 메뉴가 열리면 상단 유틸리티도 표시한다. */}
            <div
                className={cn(
                    'flex justify-end overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out motion-reduce:transition-none',
                    menuOpen ? 'max-h-dvh opacity-100' : 'max-h-0 opacity-0 lg:max-h-14 lg:opacity-100',
                )}
            >
                <div className="flex flex-wrap items-center justify-end gap-4 py-2 xl:gap-10">
                    {user ? (
                        <>
                            <div className="grid w-fit max-w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center">
                                <UserTypeBadge userType={userType} />
                                <p
                                    className="tracking-control-label min-w-0 truncate text-sm font-medium"
                                    title={user.name}
                                >
                                    {user.name}
                                </p>
                                <span className="tracking-control-label text-sm font-medium whitespace-nowrap">
                                    {' 님'}
                                </span>
                            </div>
                            <SessionTimer remaining={user.sessionRemaining} />
                        </>
                    ) : showUserTypeToggle ? (
                        <MemberTypeToggle userType={userType} onUserTypeChange={onUserTypeChange} />
                    ) : null}
                    <div className="flex flex-wrap items-center gap-4">
                        {(user ? MENU_SERVICE_GROUPS[userType].utilityLinks : UTILITY_LINKS).map((link) => {
                            const className = cn(
                                'transition-colors duration-200 ease-in-out motion-reduce:transition-none',
                                menuOpen && 'text-menu-overlay-foreground',
                            )

                            return link.label === '로그아웃' ? (
                                <LogoutDialog key={link.label} className={className} />
                            ) : (
                                <UtilityLink key={link.label} {...link} className={className} />
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className={cn('flex items-center py-3', compact ? 'gap-5' : 'gap-6 xl:gap-10')}>
                <div
                    className={cn('shrink-0', headerHiddenWhenMenuOpenClassName, menuOpen && 'opacity-0')}
                    inert={menuOpen || undefined}
                    aria-hidden={menuOpen || undefined}
                >
                    <Logo overlay={overlay} href={logoHref} />
                </div>

                <div
                    className={cn('hidden lg:flex', headerHiddenWhenMenuOpenClassName, menuOpen && 'opacity-0')}
                    inert={menuOpen || undefined}
                    aria-hidden={menuOpen || undefined}
                >
                    <NavigationMenu
                        aria-label={navLabel}
                        viewport={false}
                        value={openNavMenu}
                        onValueChange={setOpenNavMenu}
                        className="hidden lg:flex"
                    >
                        <NavigationMenuList className={compact ? 'gap-5' : 'gap-6 xl:gap-10'}>
                            {navLinks.map((link) => (
                                <NavigationMenuItem key={link.label} value={link.label}>
                                    {link.items?.length ? (
                                        // 하위 메뉴는 트리거와 드롭다운으로 구성한다.
                                        <>
                                            <NavigationMenuTrigger
                                                onKeyDown={(event) => handleDropdownEntryKeyDown(event, link.label)}
                                                className={cn(
                                                    headerNavTriggerClassName,
                                                    compact ? 'typo-title-l-bold' : 'typo-title-xl-bold',
                                                )}
                                            >
                                                {link.label}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent
                                                ref={enterDropdownOnMount}
                                                className={headerNavDropdownClassName}
                                            >
                                                {link.items.map((item) => (
                                                    <NavigationMenuLink
                                                        key={item.label}
                                                        asChild
                                                        className={headerNavDropdownItemClassName}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            className="flex items-center gap-1"
                                                            {...(item.external
                                                                ? {target: '_blank', rel: 'noopener noreferrer'}
                                                                : {})}
                                                        >
                                                            {item.label}
                                                            {item.external ? (
                                                                <ExternalLink
                                                                    aria-hidden="true"
                                                                    className="size-icon-sm"
                                                                />
                                                            ) : null}
                                                        </Link>
                                                    </NavigationMenuLink>
                                                ))}
                                            </NavigationMenuContent>
                                        </>
                                    ) : (
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
                                                {...(link.external
                                                    ? {target: '_blank', rel: 'noopener noreferrer'}
                                                    : {})}
                                            >
                                                {link.label}
                                                {link.external ? (
                                                    <ExternalLink aria-hidden="true" className="size-icon-lg" />
                                                ) : null}
                                            </Link>
                                        </NavigationMenuLink>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className={headerIconGroupClassName}>
                    <div
                        className={cn(
                            'size-icon-lg flex shrink-0 items-center justify-center',
                            headerHiddenWhenMenuOpenClassName,
                            !showThemeToggle && 'hidden',
                            menuOpen && 'opacity-0',
                        )}
                        inert={menuOpen || undefined}
                        aria-hidden={menuOpen || undefined}
                    >
                        {showThemeToggle ? <HeaderThemeToggle /> : null}
                    </div>
                    <HeaderMenu navLinks={navLinks} userType={userType} open={menuOpen} onOpenChange={setMenuOpen} />
                </div>
            </div>
        </div>
    )
}

type HeaderProps = {
    overlay?: boolean
    showThemeToggle?: boolean
    // 로그인 전에는 기업·기관 토글을 표시하고, 로그인 후에는 확정된 유형으로 메뉴를 고정한다.
    showUserTypeToggle?: boolean
    userType?: UserType
    // 전달하면 상단 유틸리티가 로그인 상태(유형 배지·이름·남은 시간·로그아웃)로 바뀐다.
    user?: HeaderUser
    // 전달하지 않으면 DEFAULT_HEADER_NAVIGATION을 사용한다.
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
}

const ResolvedHeaderContent = ({
    navLabel,
    overlay,
    compact,
    showThemeToggle,
    showUserTypeToggle,
    userType: fixedUserType,
    user,
    navigationByUserType,
    logoHref,
}: {
    navLabel: string
    overlay: boolean
    compact: boolean
    showThemeToggle: boolean
    showUserTypeToggle: boolean
    userType?: UserType
    user?: HeaderUser
    navigationByUserType?: HeaderNavigationByUserType
    logoHref?: string
}) => {
    // userType prop가 있으면 로그인 후 확정된 유형으로 고정하고, 없으면 로그인 전 내부 state를 사용한다.
    const [selectedUserType, setSelectedUserType] = useState<UserType>(fixedUserType ?? 'corp')
    const userType = fixedUserType ?? selectedUserType

    return (
        <HeaderContent
            navLabel={navLabel}
            overlay={overlay}
            compact={compact}
            showThemeToggle={showThemeToggle}
            showUserTypeToggle={showUserTypeToggle}
            navigationByUserType={navigationByUserType}
            logoHref={logoHref}
            userType={userType}
            user={user}
            onUserTypeChange={setSelectedUserType}
        />
    )
}

const Header = ({
    overlay = true,
    showThemeToggle = false,
    showUserTypeToggle = true,
    userType,
    user,
    navigationByUserType,
    logoHref = '/',
}: HeaderProps) => {
    return (
        <header
            className={cn(
                // 메뉴 닫힘 애니메이션이 끝날 때까지 헤더를 오버레이 위에 유지한다.
                'z-header has-[[data-header-menu-trigger][data-menu-visible]]:z-popover inset-x-0 top-0',
                // 헤더 배경은 메뉴 열림 상태와 함께 전환한다.
                'transition-colors duration-200 ease-in-out has-[[data-header-menu-trigger][aria-expanded=true]]:bg-transparent! motion-reduce:transition-none',
                overlay ? 'fixed' : 'bg-card sticky',
            )}
        >
            {/* 본문과 같은 content-layout으로 정렬선을 맞춘다. */}
            <div className="content-layout">
                <ResolvedHeaderContent
                    navLabel="주 메뉴"
                    overlay={overlay}
                    compact={false}
                    showThemeToggle={showThemeToggle}
                    showUserTypeToggle={showUserTypeToggle}
                    navigationByUserType={navigationByUserType}
                    logoHref={logoHref}
                    userType={userType}
                    user={user}
                />
            </div>
        </header>
    )
}

export default Header
