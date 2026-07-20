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
import logoDarkImg from '../../../public/images/logo-dark.svg'
import logoLightImg from '../../../public/images/logo-light.svg'

// PROJECT-COMPOSITE: Header primitive가 없어 NavigationMenu·SegmentedControl·Sheet·Button을 조합한 사이트 상단 합성 컴포넌트.
// PROJECT-STYLE: 로고는 h1 > a > img 구조를 유지하고 테마 클래스에 맞는 에셋을 노출한다.
// 유틸 링크는 Button text variant 위에 Header 전용 자간만 보정한다.
const NAV_LINKS = ['자가진단', '전문가 평가', 'BIGx 보고서', '탄소중립']

const UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그인/회원가입'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

type Audience = 'corp' | 'org'

const AUDIENCES = ['corp', 'org'] satisfies readonly Audience[]

const isAudience = (value: string | null): value is Audience => value === 'corp' || value === 'org'

// 유틸바와 모바일 Sheet에서 공유하는 화면 유형 링크 세그먼티드.
const MemberTypeToggle = () => {
    const searchParams = useSearchParams()
    const audienceParam = searchParams.get('audience')
    const audience = isAudience(audienceParam) ? audienceParam : 'corp'

    const getHref = (nextAudience: Audience) => {
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.set('audience', nextAudience)
        return `?${nextParams.toString()}`
    }

    return (
        <SegmentedControl type="link" aria-label="화면 유형">
            {AUDIENCES.map((value) => (
                <SegmentedControlItem
                    key={value}
                    href={getHref(value)}
                    replace
                    scroll={false}
                    aria-current={audience === value ? 'page' : undefined}
                >
                    {value === 'corp' ? '기업' : '기관'}
                </SegmentedControlItem>
            ))}
        </SegmentedControl>
    )
}

const MemberTypeToggleFallback = () => (
    <SegmentedControl type="link" aria-label="화면 유형">
        <SegmentedControlItem href="?audience=corp" aria-current="page">
            기업
        </SegmentedControlItem>
        <SegmentedControlItem href="?audience=org">기관</SegmentedControlItem>
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
const Logo = () => (
    <h1>
        <Link href="#" className="flex items-center">
            <Image src={logoLightImg} alt="기술보증기금" priority className="h-auto w-30 dark:hidden" />
            <Image src={logoDarkImg} alt="기술보증기금" priority className="hidden h-auto w-30 dark:block" />
        </Link>
    </h1>
)

// 실제 Header와 가이드 데모가 공유하는 본문.
const HeaderContent = ({navLabel}: {navLabel: string}) => (
    <div className="flex flex-col">
        <div className="hidden justify-end md:flex">
            <div className="flex items-center gap-4 px-4 py-2">
                <MemberTypeNavigation />
                {UTILITY_LINKS.map((link) => (
                    <UtilityLink key={link.label} {...link} />
                ))}
            </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-3">
            <Logo />

            <NavigationMenu aria-label={navLabel} viewport={false} className="hidden md:flex">
                <NavigationMenuList>
                    {NAV_LINKS.map((label) => (
                        <NavigationMenuItem key={label}>
                            <NavigationMenuLink asChild className="typo-title-m-semibold text-foreground h-9 px-2 py-0">
                                <Link href="#">{label}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-auto flex items-center gap-1">
                <ThemeToggle />
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
                            {NAV_LINKS.map((label) => (
                                <SheetClose asChild key={label}>
                                    <Link
                                        href="#"
                                        className="typo-title-m-semibold hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                    >
                                        {label}
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

const Header = () => (
    <header className="bg-card z-header sticky top-0">
        <div className="max-w-content mx-auto">
            <HeaderContent navLabel="주 메뉴" />
        </div>
    </header>
)

// 컴포넌트 가이드 카드 안에서 쓰는 데모.
export const HeaderDemo = () => (
    <div className="border-border bg-card overflow-hidden rounded-lg border">
        <HeaderContent navLabel="헤더 데모 메뉴" />
    </div>
)

export default Header
