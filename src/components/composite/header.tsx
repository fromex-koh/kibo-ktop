'use client'

import Image from 'next/image'
import Link from 'next/link'
import {Suspense} from 'react'
import {useSearchParams} from 'next/navigation'
import {ExternalLink, Menu} from 'lucide-react'
import ThemeToggle from '@/components/composite/theme-toggle'
import {Button} from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: Header primitive가 없어 NavigationMenu·SegmentedControl·Sheet·Button을 조합한 사이트 상단 합성 컴포넌트.
// PROJECT-STYLE: 로고는 h1 > a > img 구조를 유지하고 테마 클래스에 맞는 에셋을 노출한다.
// 유틸 링크는 Button text variant 위에 Header 전용 자간만 보정한다.
type HeaderVariant = 'default' | 'main'

type NavLink = {label: string; external?: boolean}

const NAV_LINKS: Record<HeaderVariant, NavLink[]> = {
    default: [{label: '자가진단'}, {label: '전문가 평가'}, {label: 'BIGx 보고서'}, {label: '탄소중립'}],
    main: [
        {label: '플랫폼 소개'},
        {label: '기술평가'},
        {label: '특허평가'},
        {label: 'K-BIGx 보고서'},
        {label: '탄소중립', external: true},
    ],
}

const UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그인/회원가입'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

type UserType = 'corp' | 'org'

const USER_TYPES = ['corp', 'org'] satisfies readonly UserType[]

const isUserType = (value: string | null): value is UserType => value === 'corp' || value === 'org'

// 유틸바와 모바일 Sheet에서 공유하는 화면 유형 링크 세그먼티드.
const MemberTypeToggle = () => {
    const searchParams = useSearchParams()
    const userTypeParam = searchParams.get('userType')
    const userType = isUserType(userTypeParam) ? userTypeParam : 'corp'

    const getHref = (nextUserType: UserType) => {
        const nextParams = new URLSearchParams(searchParams.toString())
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

const MemberTypeToggleFallback = () => (
    <SegmentedControl type="link" aria-label="화면 유형">
        <SegmentedControlItem href="?userType=corp" aria-current="page">
            기업
        </SegmentedControlItem>
        <SegmentedControlItem href="?userType=org">기관</SegmentedControlItem>
    </SegmentedControl>
)

const MemberTypeNavigation = () => (
    <Suspense fallback={<MemberTypeToggleFallback />}>
        <MemberTypeToggle />
    </Suspense>
)

// 링크 의미는 유지하고 Button text variant의 토큰/포커스 스타일을 재사용한다.
const UtilityLink = ({label, external, className}: {label: string; external?: boolean; className?: string}) => (
    <Button
        variant="text"
        size="lg"
        asChild
        className={cn('tracking-control-label font-medium', external ? 'gap-0.5' : undefined, className)}
    >
        <Link href="#" {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
            {label}
            {external ? <ExternalLink aria-hidden="true" className="size-icon-sm" /> : null}
        </Link>
    </Button>
)

// h1 > a > img 구조로 사이트명을 전달한다.
const Logo = ({variant}: {variant: HeaderVariant}) => (
    <h1 className="shrink-0">
        <Link href="#" className="flex shrink-0 items-center">
            {variant === 'main' ? (
                <Image
                    src="/images/logo-dark.svg"
                    alt="기술보증기금"
                    width={140}
                    height={32}
                    priority
                    className="h-auto w-30 shrink-0"
                />
            ) : (
                <>
                    <Image
                        src="/images/logo-light.svg"
                        alt="기술보증기금"
                        width={140}
                        height={32}
                        priority
                        className="h-auto w-30 shrink-0 dark:hidden"
                    />
                    <Image
                        src="/images/logo-dark.svg"
                        alt="기술보증기금"
                        width={140}
                        height={32}
                        priority
                        className="hidden h-auto w-30 shrink-0 dark:block"
                    />
                </>
            )}
        </Link>
    </h1>
)

// 실제 Header와 가이드 데모가 공유하는 본문.
const HeaderContent = ({
    navLabel,
    variant,
    showThemeToggle,
}: {
    navLabel: string
    variant: HeaderVariant
    showThemeToggle: boolean
}) => {
    const isMain = variant === 'main'
    const navLinks = NAV_LINKS[variant]

    return (
        <div className="flex flex-col">
            <div className="hidden justify-end md:flex">
                <div className={cn('flex items-center gap-4 py-2', !isMain && 'px-4')}>
                    <MemberTypeNavigation />
                    {UTILITY_LINKS.map((link) => (
                        <UtilityLink key={link.label} {...link} />
                    ))}
                </div>
            </div>

            <div className={cn('flex items-center py-3', isMain ? 'gap-10' : 'gap-6 px-4')}>
                <Logo variant={variant} />

                <NavigationMenu aria-label={navLabel} viewport={false} className="hidden md:flex">
                    <NavigationMenuList className={cn(isMain && 'gap-10')}>
                        {navLinks.map((link) => (
                            <NavigationMenuItem key={link.label}>
                                <NavigationMenuLink
                                    asChild
                                    className={cn(
                                        'text-foreground whitespace-nowrap',
                                        isMain
                                            ? 'typo-title-xl-bold min-h-11 rounded-none px-0 py-0 hover:bg-transparent focus:bg-transparent'
                                            : 'typo-title-m-semibold h-9 px-2 py-0',
                                    )}
                                >
                                    <Link
                                        href="#"
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

                <div className="ml-auto flex items-center gap-1">
                    {showThemeToggle ? <ThemeToggle /> : null}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="전체 메뉴 열기">
                                <Menu aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="gap-0 data-[side=left]:w-fit data-[side=right]:w-fit">
                            <SheetHeader>
                                <SheetTitle>전체 메뉴</SheetTitle>
                            </SheetHeader>

                            <div className="px-4 pb-2">
                                <MemberTypeNavigation />
                            </div>

                            <nav aria-label="전체 메뉴" className="flex flex-col gap-1 px-4">
                                {navLinks.map((link) => (
                                    <SheetClose asChild key={link.label}>
                                        <Link
                                            href="#"
                                            className="typo-title-m-semibold hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center gap-1 rounded-md px-3 focus:outline-none focus-visible:ring-2"
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

                            <div className="border-border mt-4 flex flex-col gap-1 border-t px-4 pt-4">
                                {UTILITY_LINKS.map((link) => (
                                    <SheetClose asChild key={link.label}>
                                        <UtilityLink
                                            {...link}
                                            className="not-disabled:hover:bg-navy-50 not-disabled:hover:text-navy-600 min-h-11 w-full justify-start rounded-md px-3"
                                        />
                                    </SheetClose>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    )
}

type HeaderProps = {
    variant?: HeaderVariant
    showThemeToggle?: boolean
}

const Header = ({variant = 'default', showThemeToggle}: HeaderProps) => {
    const isMain = variant === 'main'
    const shouldShowThemeToggle = showThemeToggle ?? !isMain

    return (
        <header className={cn('z-header inset-x-0 top-0', isMain ? 'fixed' : 'bg-card sticky')}>
            <div className={cn(isMain ? 'content-layout' : 'max-w-content mx-auto')}>
                <HeaderContent navLabel="주 메뉴" variant={variant} showThemeToggle={shouldShowThemeToggle} />
            </div>
        </header>
    )
}

// 컴포넌트 가이드 카드 안에서 쓰는 데모.
export const HeaderDemo = () => (
    <div className="border-border bg-card overflow-hidden rounded-lg border">
        <HeaderContent navLabel="헤더 데모 메뉴" variant="default" showThemeToggle />
    </div>
)

export default Header
