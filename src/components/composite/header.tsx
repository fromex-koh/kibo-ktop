'use client'

import Image from 'next/image'
import Link from 'next/link'
import {Suspense, useEffect, useRef, useState, type ComponentProps, type KeyboardEvent} from 'react'
import {useSearchParams} from 'next/navigation'
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
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
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

// 데스크톱 GNB와 모바일 전체 메뉴(Sheet)를 함께 렌더링하는 사이트 Header.
// navigationByUserType를 전달하면 GNB와 전체 메뉴가 같은 userType별 링크 목록을 공유한다.
export type UserType = 'corp' | 'org'

export type HeaderNavLink = {
    label: string
    href: string
    external?: boolean
    // 전체 메뉴에서 이 메뉴 아래에 펼쳐지는 하위 항목. GNB에는 노출하지 않는다.
    items?: readonly HeaderNavLink[]
}

export type HeaderNavigationByUserType = Record<UserType, readonly HeaderNavLink[]>

// K-BIGx 보고서 하위 항목. 기관은 여러 기업을 한 번에 다루므로 "대량정보조회"가 하나 더 있다.
const CORP_REPORT_ITEMS: readonly HeaderNavLink[] = [
    {label: '기업혁신성장보고서 조회', href: '#'},
    {label: '보고서 이력 조회', href: '#'},
]

const ORG_REPORT_ITEMS: readonly HeaderNavLink[] = [
    {label: '기업혁신성장보고서 조회', href: '#'},
    {label: '대량정보조회', href: '#'},
    {label: '보고서 이력 조회', href: '#'},
]

// 평가모형 목록 — 기업의 "기술평가"와 기관의 "개별평가"가 같은 하위 항목을 쓴다.
const EVALUATION_MODEL_ITEMS: readonly HeaderNavLink[] = [
    {label: 'KTRS-FM', href: '#'},
    {label: 'Tech-Index', href: '#'},
    {label: '투자모형', href: '#'},
    {label: '평가결과 조회', href: '#'},
]

// "플랫폼 소개"의 하위 항목은 플랫폼 전체를 안내하는 목록이라 기업·기관이 같다.
const PLATFORM_INTRO_ITEMS: readonly HeaderNavLink[] = [
    {label: '플랫폼 소개', href: '#'},
    {label: '기술평가', href: '#'},
    {label: '특허평가', href: '#'},
    {label: 'K-BIGx 보고서', href: '#'},
    {label: '탄소중립', href: '#'},
]

// 기본 주 메뉴 — navigationByUserType 를 따로 넘기지 않는 화면(공통 화면 등)이 쓴다.
// 유형별로 나눠 두어야 로그인 전 헤더의 기업·기관 토글이 실제로 메뉴를 바꾼다.
const DEFAULT_NAVIGATION: HeaderNavigationByUserType = {
    corp: [
        {label: '플랫폼 소개', href: '#', items: PLATFORM_INTRO_ITEMS},
        {label: '기술평가', href: '#', items: EVALUATION_MODEL_ITEMS},
        // 시안에서 하위 항목 없이 제목만 두는 메뉴다.
        {label: '특허평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#', items: CORP_REPORT_ITEMS},
        {label: '탄소중립', href: '#', external: true},
    ],
    org: [
        {label: '플랫폼 소개', href: '#', items: PLATFORM_INTRO_ITEMS},
        {label: '개별평가', href: '#', items: EVALUATION_MODEL_ITEMS},
        // 일괄평가는 아직 하위 항목 시안이 없어 제목만 둔다.
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#', items: ORG_REPORT_ITEMS},
        {label: '특허평가', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
}

// 전체 메뉴 하단의 서비스 그룹 — 제목 옆에 하위 항목을 한 줄로 늘어놓는다.
type MenuServiceGroup = {label: string; items: readonly string[]}

// 알림마당은 두 유형이 같다.
const NOTICE_SERVICE_GROUP: MenuServiceGroup = {
    label: '알림마당',
    items: ['공지사항', 'FAQ', '1:1문의', '자료실'],
}

// 마이페이지는 유형별로 다르다 — 기관은 하위 계정처럼 기관에만 있는 항목을 쓴다.
// 기업은 전체메뉴 시안의 항목이고, 기관은 아직 전체메뉴 시안이 없어 사이트 구조
// (publishing-index.json 의 기관 > 마이페이지)를 따른다.
const MENU_SERVICE_GROUPS: Record<UserType, readonly MenuServiceGroup[]> = {
    corp: [
        {
            label: '마이페이지',
            items: [
                '내 정보',
                '대표자(경영자) 역량 및 경력',
                '평가결과 조회',
                'K-BIGx 보고서 이력',
                '유료 서비스 관리',
                '1:1문의내역',
            ],
        },
        NOTICE_SERVICE_GROUP,
    ],
    org: [
        {
            label: '마이페이지',
            items: ['내 정보 수정', '평가이력 조회', 'K-BIGx 보고서 이력', '하위 계정 진행 현황', '1:1 문의 내역'],
        },
        NOTICE_SERVICE_GROUP,
    ],
}

// 상단 유틸리티 링크. 첫 항목만 로그인 상태에 따라 갈린다(로그인/회원가입 ↔ 로그아웃).
const UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그인/회원가입'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

const AUTHENTICATED_UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그아웃'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

// 로그인 후 이름 앞에 붙는 회원 유형 배지. 시안은 기업(info.500)·기관(purple.600) 두 색을 쓰고,
// 실제로는 로그인한 유형 하나만 노출한다.
const USER_TYPE_BADGE = {
    corp: {label: '기업', color: 'info'},
    org: {label: '기관', color: 'secondary-purple'},
} as const satisfies Record<UserType, {label: string; color: NonNullable<ComponentProps<typeof Badge>['color']>}>

// 로그인한 회원 정보. 세션 잔여 시간은 화면 표시용 문자열이라 표시 형식을 그대로 받는다.
export type HeaderUser = {
    name: string
    sessionRemaining: string
}

// 시트가 사라지는 데 걸리는 시간(ui/sheet의 duration-200). 헤더를 그 위에 띄워 두는 시간과 같다.
const MENU_EXIT_DURATION_MS = 200

const USER_TYPES = ['corp', 'org'] satisfies readonly UserType[]

const isUserType = (value: string | null): value is UserType => value === 'corp' || value === 'org'

// query string으로 기업·기관 화면 유형을 전환한다.
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

// 로그인한 회원의 유형 배지 + 이름. 배지는 로그인한 유형 하나만 나온다.
// PROJECT-STYLE: Badge sm 은 최소 너비 60px 이지만 시안의 헤더 배지는 글자만큼(49px)이라 min-w를 푼다.
const UserTypeBadge = ({userType}: {userType: UserType}) => {
    const badge = USER_TYPE_BADGE[userType]

    return (
        <Badge variant="solid" color={badge.color} shape="pill" size="sm" className="min-w-0">
            {badge.label}
        </Badge>
    )
}

// 남은 세션 시간과 연장 버튼. 시간은 화면 표시용 목업 값이며 실제 연장 동작은 서비스에서 연결한다.
const SessionTimer = ({remaining}: {remaining: string}) => (
    <div className="flex items-center gap-1">
        <p className="tracking-control-label flex items-center gap-1 text-sm font-medium">
            <TimerReset aria-hidden="true" className="size-icon-sm shrink-0" />
            <span className="sr-only">로그인 유지 시간</span>
            {remaining}
        </p>
        <Button variant="text-underline" size="sm" type="button" className="font-normal">
            연장
        </Button>
    </div>
)

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

// 열려 있는 GNB 드롭다운의 첫 항목으로 포커스를 옮긴다.
const focusOpenDropdownFirstItem = (nav: HTMLElement | null) => {
    nav?.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-content"][data-state="open"] a[href], [data-slot="navigation-menu-content"] a[href]',
    )?.focus()
}

// 로고는 페이지 제목이 아니므로 h1로 사용하지 않는다. 기본적으로 루트(/)로 이동하며 logoHref로 경로를 바꾼다.
const Logo = ({overlay, href}: {overlay: boolean; href?: string}) => {
    const image = (
        <>
            {/* overlay는 어두운 배경용 흰색 로고, 일반 헤더는 테마 CSS 변수로 로고를 교체한다. */}
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

    // 두 테마용 이미지는 장식으로 두고, sr-only 텍스트를 한 번만 제공해 보조기기 중복 읽기를 막는다.
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

// 테마 토글은 마운트 전에도 같은 크기의 placeholder를 렌더링해 hydration 불일치와 레이아웃 이동을 막는다.
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

// 전체 메뉴 안의 링크 — 메뉴 면 위에서 쓰는 기본 글자색과 hover·현재 위치 강조를 함께 둔다.
// hover와 현재 위치는 같은 강조색(menu-overlay-accent)을 쓴다. 현재 위치는 실제 경로가 연결되면
// aria-current로 활성화된다.
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
        {/* 아이콘을 줄 상자 중앙(items-center)에 두면 한글 글자 윗변보다 2px 아래에서 시작해 제목 옆에서
            혼자 내려앉아 보인다 — 한글은 디센더가 없어 글자 몸통이 줄 상자 위쪽에 치우치기 때문이다.
            24px Bold Pretendard 실측(ink = baseline−20…+2)에 맞춰 2px 올려 글자 윗변에 맞춘다. */}
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
    // 시트 면이 화면에 남아 있는 동안 true — 닫히는 애니메이션이 끝날 때까지 유지한다.
    // animationend 대신 시간으로 되돌린다: 애니메이션 이벤트는 탭이 백그라운드일 때 오지 않을 수 있고,
    // 그러면 헤더가 계속 떠 있는 상태로 굳는다.
    const [isSheetVisible, setIsSheetVisible] = useState(false)

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
                    // 메뉴 면이 화면에 남아 있는 동안(닫히는 애니메이션 포함) 켜 두는 표식.
                    // 헤더를 그 위로 띄우는 z-index가 이 값을 본다 — aria-expanded는 누르는 즉시 꺼져서,
                    // 아직 면이 남아 있는데 헤더만 먼저 뒤로 내려가 한 프레임 사라져 보였다.
                    data-menu-visible={open || isSheetVisible || undefined}
                    aria-label={label}
                    aria-expanded={open}
                    title={label}
                    onKeyDown={(event) => {
                        if (!open || event.key !== 'Tab') return

                        // 앞으로 갈 때만 메뉴 안으로 보낸다. 뒤로(Shift+Tab)는 가로채지 않아야
                        // 열린 동안에도 보이는 헤더 상단 유틸리티 줄에 키보드로 닿을 수 있다.
                        if (event.shiftKey) return

                        event.preventDefault()
                        // 메뉴 안의 실제 DOM 순서를 그대로 따른다 — 특정 항목을 ref로 고정하면
                        // 메뉴 구성이 바뀔 때 첫 도착지가 어긋난다.
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
                // left-0 — 기본 right-0 은 스크롤바 자리(scrollbar-gutter)를 뺀 폭에 붙어, 100vw 인 이 시트가
                // 왼쪽으로 밀리면서 오른쪽 끝에 페이지 배경이 띠처럼 남는다. 왼쪽 기준으로 붙여 화면을 꽉 채운다.
                //
                // [SC-01] 예외: tw-animate 의 --tw-enter/exit-translate-x 를 직접 0 으로 둔다. 기본 시트는
                // 화면 폭의 10% 를 옆에서 밀고 들어오는데, 전면을 덮는 이 메뉴에서는 여는 동안 왼쪽 10% 에
                // 페이지가 흰 띠로 비친다. slide-in-from-right-0 유틸로는 못 덮는다 — 생성된 CSS 에서
                // -10 규칙이 -0 보다 뒤에 와서 이긴다. 변수 계약을 직접 쓰는 게 유일한 방법이다.
                className="bg-menu-overlay text-menu-overlay-foreground outline-menu-overlay-foreground h-dvh max-w-none gap-0 overflow-hidden border-0 data-[side=right]:right-auto data-[side=right]:left-0 data-[side=right]:w-screen data-[side=right]:border-0 data-[side=right]:data-closed:[--tw-exit-translate-x:0] data-[side=right]:data-open:[--tw-enter-translate-x:0] data-[side=right]:sm:max-w-none"
            >
                {/* 시안에는 제목이 없지만 대화상자에는 접근 가능한 이름이 필요하다. */}
                <SheetHeader className="sr-only">
                    <SheetTitle>전체 메뉴</SheetTitle>
                </SheetHeader>

                {/* 헤더가 통째로 이 오버레이 위에 떠 있다(z-popover). 상단 유틸리티 줄과 닫기 버튼은
                    헤더의 것을 그대로 쓰므로 여기서는 그 높이만큼 자리를 비운다(시안 120px).
                    이 자리는 스크롤 영역 밖(shrink-0)이다 — 시트 전체를 스크롤시키면 메뉴 항목이
                    배경이 없는 헤더 밑으로 지나가며 유틸리티 줄·닫기 버튼과 겹쳐 보인다. */}
                <div aria-hidden="true" className="h-28 shrink-0 xl:h-30" />

                {/* 본문만 스크롤한다. min-h-0 이 있어야 flex 자식이 내용 높이로 부풀지 않고 남은 높이에 갇힌다. */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="content-layout flex flex-col pb-10">
                        <nav
                            aria-label="전체 메뉴"
                            className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3 md:gap-y-10 xl:grid-cols-5 xl:gap-x-0"
                        >
                            {navLinks.map((link) => (
                                <div key={link.label} className="flex flex-col">
                                    {/* 대화상자 제목(SheetTitle)이 h2라 그 아래 메뉴 묶음은 h3다.
                                    하위 항목이 있는 메뉴의 제목은 그 묶음의 이름일 뿐이라 링크로 만들지 않는다 —
                                    이동은 아래 하위 항목이 담당한다. 하위 항목이 없는 메뉴만 제목 자체가 링크다. */}
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
                            {MENU_SERVICE_GROUPS[userType].map((group) => (
                                <div
                                    key={group.label}
                                    className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0"
                                >
                                    <h3 className="typo-body-xl-bold md:w-30 md:shrink-0">{group.label}</h3>
                                    <ul className="typo-body-xl-regular text-menu-overlay-foreground-subtle flex flex-wrap items-center gap-x-6 gap-y-2">
                                        {group.items.map((item, index) => (
                                            <li key={item} className="flex items-center gap-x-6">
                                                {/* 항목 사이 구분선 — 장식이라 보조기기에서 읽지 않는다. */}
                                                {index > 0 ? (
                                                    <span
                                                        aria-hidden="true"
                                                        className="bg-menu-overlay-border h-3 w-px shrink-0"
                                                    />
                                                ) : null}
                                                <SheetClose asChild>
                                                    <MenuLink label={item} href="#" />
                                                </SheetClose>
                                            </li>
                                        ))}
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
    searchParams,
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
    searchParams: string
}) => {
    const navLinks = (navigationByUserType ?? DEFAULT_NAVIGATION)[userType]
    const [menuOpen, setMenuOpen] = useState(false)

    // GNB 드롭다운의 열림 상태를 직접 들고 있는다 — 키보드로 열면 패널이 붙는 순간 그 안으로 들어가야 한다.
    // 여는 시점을 타이머나 rAF 로 추측하지 않고, 패널이 실제로 마운트될 때 실행되는 ref 콜백에서 옮긴다 —
    // 패널은 상태가 바뀐 렌더가 아니라 그다음 렌더에 붙어서, effect 로는 아직 없는 패널을 찾게 된다[6.1.1].
    const [openNavMenu, setOpenNavMenu] = useState('')
    const shouldEnterDropdownRef = useRef(false)

    const enterDropdownOnMount = (node: HTMLDivElement | null) => {
        if (!node || !shouldEnterDropdownRef.current) return

        shouldEnterDropdownRef.current = false
        node.querySelector<HTMLElement>('a[href]')?.focus()
    }

    // 아래 화살표로 드롭다운을 열고 그 안으로 들어간다. 가로 메뉴에서 Radix 는 이 키를 '옆 트리거로 이동'에
    // 쓰므로 이벤트를 여기서 멈춰야 패널을 지나치지 않는다.
    const handleDropdownEntryKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: string) => {
        if (event.key !== 'ArrowDown') return

        event.preventDefault()
        event.stopPropagation()

        // 이미 열려 있으면 패널이 이미 붙어 있으므로 바로 옮긴다.
        if (openNavMenu === value) {
            focusOpenDropdownFirstItem(event.currentTarget.closest('[data-slot="navigation-menu"]'))
            return
        }

        shouldEnterDropdownRef.current = true
        setOpenNavMenu(value)
    }

    return (
        <div className="flex flex-col">
            {/* lg 이상은 데스크톱 GNB, 미만은 로고와 햄버거 메뉴만 표시한다.
                전체 메뉴가 열리면 헤더가 오버레이 위로 올라오므로(z-popover) 이 줄을 감추지 않고 그대로 쓴다 —
                시안의 전체 메뉴 상단 유틸리티가 곧 이 줄이다. 메뉴 안에 같은 링크를 다시 두지 않는다.
                lg 미만에서는 평소 숨기지만 메뉴가 열린 동안에는 시안처럼 노출한다 — hidden 으로 껐다 켜면
                메뉴가 사라질 때 이 줄만 뚝 끊기므로, 높이와 투명도를 함께 전환해 오버레이와 같은 박자로
                걷힌다. lg 이상에서는 항상 펼친 상태다. [KWCAG 6.3.1] */}
            <div
                className={cn(
                    'flex justify-end overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out motion-reduce:transition-none',
                    menuOpen ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0 lg:max-h-14 lg:opacity-100',
                )}
            >
                {/* 시안의 상단메뉴는 묶음 사이 40px, 묶음 안 16px 이다(로그인 전/후 동일). */}
                <div className="flex flex-wrap items-center justify-end gap-4 py-2 xl:gap-10">
                    {user ? (
                        // 로그인 후: 유형 배지 + 이름, 그리고 남은 시간·연장.
                        <>
                            <div className="flex items-center gap-2">
                                <UserTypeBadge userType={userType} />
                                <p className="tracking-control-label text-sm font-medium">{user.name} 님</p>
                            </div>
                            <SessionTimer remaining={user.sessionRemaining} />
                        </>
                    ) : showUserTypeToggle ? (
                        <MemberTypeToggle userType={userType} searchParams={searchParams} />
                    ) : null}
                    <div className="flex flex-wrap items-center gap-4">
                        {(user ? AUTHENTICATED_UTILITY_LINKS : UTILITY_LINKS).map((link) => (
                            <UtilityLink
                                key={link.label}
                                {...link}
                                // 열린 동안에는 어두운 메뉴 면 위에 놓이므로 그 면의 전경색을 쓴다.
                                // 전환 시간·이징을 시트가 걷히는 값(duration-200 ease-in-out)과 똑같이 맞춘다 —
                                // 글자가 면보다 늦게 돌아오면 면이 이미 사라진 밝은 배경에 흰 글자만 남아
                                // 반짝하고, 더 빠르면 아직 어두운 면 위에서 글자만 먼저 어두워져 사라져 보인다.
                                // 같은 박자로 움직여야 면과 글자가 함께 녹아든다.
                                className={cn(
                                    'transition-colors duration-200 ease-in-out motion-reduce:transition-none',
                                    menuOpen && 'text-menu-overlay-foreground',
                                )}
                            />
                        ))}
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
                                        // 하위 메뉴가 있으면 트리거 + 드롭다운. hover 와 키보드 포커스 모두에서
                                        // 열리고 Esc·바깥 이동으로 닫히는 동작은 Radix NavigationMenu 가 담당한다[SC-03].
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
    // 로그인 전에는 userType 토글을 노출하고, 로그인 후 userType이 확정되면 숨긴다.
    showUserTypeToggle?: boolean
    userType?: UserType
    // 전달하면 상단 유틸리티가 로그인 후 구성(유형 배지·이름·남은 시간·로그아웃)으로 바뀐다.
    user?: HeaderUser
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
    const searchParams = useSearchParams()
    const userTypeParam = searchParams.get('userType')
    const userType = fixedUserType ?? (isUserType(userTypeParam) ? userTypeParam : 'corp')

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
            searchParams={searchParams.toString()}
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
                // 띄움(z-index)은 aria-expanded가 아니라 data-menu-visible을 본다 — 메뉴 면이 사라지는
                // 애니메이션이 끝날 때까지 헤더가 그 위에 남아야 한다. aria-expanded 기준이면 누르는 즉시
                // 헤더가 면 뒤로 내려가 한 프레임 사라졌다 다시 나타난다.
                'z-header has-[[data-header-menu-trigger][data-menu-visible]]:z-popover inset-x-0 top-0',
                // 배경은 반대로 aria-expanded(누른 즉시)를 기준으로 메뉴 면과 같은 박자로 사라지고 돌아온다.
                // 즉시 투명해지면 헤더 아래 body 배경(gray.50)이 그대로 드러나, 메뉴 면이 아직 반쯤 투명한
                // 동안 헤더 줄만 다른 색 띠로 번쩍인다(다크·메인페이지도 같은 이유로 어두운 띠가 생긴다).
                'transition-colors duration-200 ease-in-out has-[[data-header-menu-trigger][aria-expanded=true]]:bg-transparent! motion-reduce:transition-none',
                overlay ? 'fixed' : 'bg-card sticky',
            )}
        >
            {/* 본문과 같은 content-layout을 사용해 헤더와 콘텐츠의 정렬선을 맞춘다. */}
            <div className="content-layout">
                <Suspense
                    fallback={
                        <HeaderContent
                            navLabel="주 메뉴"
                            overlay={overlay}
                            compact={false}
                            showThemeToggle={showThemeToggle}
                            showUserTypeToggle={showUserTypeToggle}
                            navigationByUserType={navigationByUserType}
                            logoHref={logoHref}
                            userType={userType ?? 'corp'}
                            user={user}
                            searchParams=""
                        />
                    }
                >
                    <ResolvedHeaderContent
                        navLabel="주 메뉴"
                        overlay={overlay}
                        compact={false}
                        showThemeToggle={showThemeToggle}
                        showUserTypeToggle={showUserTypeToggle}
                        userType={userType}
                        user={user}
                        navigationByUserType={navigationByUserType}
                        logoHref={logoHref}
                    />
                </Suspense>
            </div>
        </header>
    )
}

// 컴포넌트 가이드에서 Header의 로고·테마·메뉴 상태를 확인하는 데모용 래퍼.
export const HeaderDemo = ({
    overlay = false,
    showThemeToggle = true,
    navigationByUserType,
    userType,
    user,
}: {
    overlay?: boolean
    showThemeToggle?: boolean
    navigationByUserType?: HeaderNavigationByUserType
    userType?: UserType
    user?: HeaderUser
}) => (
    <div className="border-border bg-background overflow-hidden rounded-lg border">
        <Suspense
            fallback={
                <HeaderContent
                    navLabel="헤더 데모 메뉴"
                    overlay={overlay}
                    compact
                    showThemeToggle={showThemeToggle}
                    showUserTypeToggle={!user}
                    navigationByUserType={navigationByUserType}
                    userType={userType ?? 'corp'}
                    user={user}
                    searchParams=""
                />
            }
        >
            <ResolvedHeaderContent
                navLabel="헤더 데모 메뉴"
                overlay={overlay}
                compact
                showThemeToggle={showThemeToggle}
                showUserTypeToggle={!user}
                navigationByUserType={navigationByUserType}
                userType={userType}
                user={user}
            />
        </Suspense>
    </div>
)

export default Header
