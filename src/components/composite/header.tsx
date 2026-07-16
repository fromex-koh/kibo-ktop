'use client'

import Image from 'next/image'
import Link from 'next/link'
import {ExternalLink, Menu} from 'lucide-react'
import ThemeToggle from '@/components/composite/theme-toggle'
import {Button} from '@/components/kit/button'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/kit/navigation-menu'
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/kit/sheet'
import {ToggleGroup, ToggleGroupItem} from '@/components/kit/toggle-group'
import logoImg from '../../../public/logo.svg'

// 사이트 최상단 헤더 — Figma "헤더" 프레임을 그대로 옮긴 도메인 합성 컴포넌트.
// shadcn 에는 Header primitive 가 없어(헤더는 항상 합성) SectionHeader 처럼
// src/components/composite 에 두고(kit primitive 를 조합한 L2 레이어), NavigationMenu·ToggleGroup·Sheet 로 조립한다.
//
// Figma 구조를 2줄로 재현한다:
//   ┌ 상단 유틸바(우측 정렬): 기업/기관 세그먼티드 · 로그인/회원가입 · 이용안내 · 기술보증기금↗
//   └ 메인 내비: 로고 + 주 메뉴(자가진단·전문가 평가·BIGx 보고서·탄소중립) … 테마토글 · 전체메뉴
// 높이는 고정 px(ST-004) 대신 패딩+콘텐츠로 hug 시킨다. 좁은 폭에선 유틸바·주 메뉴가 Sheet 로 접힌다.

// 주 내비게이션 항목(데모 데이터). 실제로는 라우트로 연결한다.
const NAV_LINKS = ['자가진단', '전문가 평가', 'BIGx 보고서', '탄소중립']

// 상단 유틸바 링크(데모 데이터). external=true 는 새 창 외부 링크(기술보증기금).
const UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그인/회원가입'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

// 회원 유형 세그먼티드(기업/기관) — 유틸바와 모바일 Sheet 에서 공유.
// kit ToggleGroup 의 segmented 변형(Figma 회색 트랙 + 흰 알약)을 그대로 쓴다.
const MemberTypeToggle = () => (
    <ToggleGroup type="single" defaultValue="corp" variant="segmented" size="sm" aria-label="회원 유형">
        <ToggleGroupItem value="corp">기업</ToggleGroupItem>
        <ToggleGroupItem value="org">기관</ToggleGroupItem>
    </ToggleGroup>
)

// 유틸 링크 한 줄 렌더 — 외부 링크는 새 창 + 아이콘. (해시 앵커 데모라 href="#")
const UtilityLink = ({label, external}: {label: string; external?: boolean}) => (
    <Link
        href="#"
        {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        className="hover:text-primary inline-flex items-center gap-1"
    >
        {label}
        {external ? <ExternalLink aria-hidden="true" className="size-icon-xs" /> : null}
    </Link>
)

// 로고 — 사이트명을 h1로 제공하고, 이미지는 기존 정적 import/className을 유지한다.
const Logo = () => (
    <h1>
        <Link href="#" className="flex items-center">
            <Image src={logoImg} alt="기술보증기금" priority className="h-9 w-auto" />
        </Link>
    </h1>
)

// 헤더 본문(유틸바 + 메인 내비) — 실제 헤더(banner)와 가이드 데모 카드가 공유한다.
// navLabel: 한 화면에 내비가 여럿(LNB·브레드크럼 등)이라 각 NavigationMenu 를 구분할 aria-label.
const HeaderContent = ({navLabel}: {navLabel: string}) => (
    <div className="flex flex-col">
        {/* ── 상단 유틸바 (우측 정렬) — 좁은 폭에선 숨기고 Sheet 로 이동 ── */}
        <div className="hidden justify-end md:flex">
            <div className="typo-body-l-medium flex items-center gap-4 px-4 py-2 text-gray-700">
                <MemberTypeToggle />
                {UTILITY_LINKS.map((link) => (
                    <UtilityLink key={link.label} {...link} />
                ))}
            </div>
        </div>

        {/* ── 메인 내비 ── */}
        {/* Figma 그대로 행 높이 60px = 콘텐츠 36px(로고·주 메뉴 h-9·아이콘 버튼 icon-sm) + py-3(12px)*2. */}
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

            {/* 우측 — 테마 토글 + 전체 메뉴(모바일 Sheet) */}
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

                        {/* 회원 유형 */}
                        <div className="px-4 pb-2">
                            <MemberTypeToggle />
                        </div>

                        {/* 주 메뉴 */}
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

                        {/* 유틸 링크 */}
                        <div className="border-border typo-body-l-medium mt-4 flex flex-col gap-1 border-t px-4 pt-4 text-gray-700">
                            {UTILITY_LINKS.map((link) => (
                                <SheetClose asChild key={link.label}>
                                    <Link
                                        href="#"
                                        {...(link.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                        className="hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center gap-1 rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                    >
                                        {link.label}
                                        {link.external ? (
                                            <ExternalLink aria-hidden="true" className="size-icon-xs" />
                                        ) : null}
                                    </Link>
                                </SheetClose>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </div>
)

// 실제 페이지 헤더 — 상단 sticky 풀블리드(banner 랜드마크). 안쪽은 max-w-content 로 폭 제한.
// z-10: Dialog/Popover 등 오버레이(z-50) 아래에 오도록 낮게 둔다.
const Header = () => (
    <header className="bg-card sticky top-0 z-10">
        <div className="max-w-content mx-auto">
            <HeaderContent navLabel="주 메뉴" />
        </div>
    </header>
)

// 데모용 — 컴포넌트 가이드 카드 안에서 시연. 실제 헤더가 이미 banner 라 여긴 랜드마크가 아닌 div.
export const HeaderDemo = () => (
    <div className="border-border bg-card overflow-hidden rounded-lg border">
        <HeaderContent navLabel="헤더 데모 메뉴" />
    </div>
)

export default Header
