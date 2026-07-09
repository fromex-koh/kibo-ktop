'use client'

import Link from 'next/link'
import {Blocks, ExternalLink, Menu} from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet'
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'

// 주 내비게이션 항목(데모 데이터). 실제로는 라우트로 연결한다.
const NAV_LINKS = ['자가진단', '전문가 평가', 'BIGx 보고서', '탄소중립']

// 세그먼티드 컨트롤의 선택 세그먼트 강조(채움).
const SEGMENT_ON = 'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'

// 헤더 내부 콘텐츠(로고 · 주 내비 · 세그먼티드 · 유틸 링크) — 실제 헤더와 데모 카드가 공유한다.
// navLabel: 페이지에 내비가 여럿 있으므로(LNB·브레드크럼 등) 각 NavigationMenu 를 구분할 aria-label.
const HeaderContent = ({navLabel}: {navLabel: string}) => (
    <>
        {/* 로고 */}
        <Link href="#" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <Blocks aria-hidden="true" className="size-icon-sm" />
            </span>
            <span className="typo-body-l-bold">K-TOP</span>
        </Link>

        {/* 주 내비 */}
        <NavigationMenu aria-label={navLabel} viewport={false} className="wide:flex hidden">
            <NavigationMenuList>
                {NAV_LINKS.map((label) => (
                    <NavigationMenuItem key={label}>
                        <NavigationMenuLink asChild className="typo-body-l-medium">
                            <Link href="#">{label}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>

        {/* 우측 — 세그먼티드 + 유틸 링크 + 아이콘 */}
        <div className="ml-auto flex items-center gap-6">
            <ToggleGroup type="single" defaultValue="corp" spacing={0} variant="outline" aria-label="회원 유형">
                <ToggleGroupItem value="corp" size="sm" className={SEGMENT_ON}>
                    기업
                </ToggleGroupItem>
                <ToggleGroupItem value="org" size="sm" className={SEGMENT_ON}>
                    기관
                </ToggleGroupItem>
            </ToggleGroup>

            <div className="typo-body-l-regular wide:flex hidden items-center gap-4">
                <Link href="#" className="hover:text-primary">
                    로그인/회원가입
                </Link>
                <Link href="#" className="hover:text-primary">
                    이용안내
                </Link>
                <Link href="#" className="hover:text-primary inline-flex items-center gap-1">
                    기술보증기금
                    <ExternalLink aria-hidden="true" className="size-icon-xs" />
                </Link>
            </div>

            <div className="flex items-center gap-1">
                <ThemeToggle />
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            aria-label="전체 메뉴 열기"
                            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                            <Menu aria-hidden="true" className="size-icon-sm" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="gap-0 data-[side=left]:w-fit data-[side=right]:w-fit">
                        <SheetHeader>
                            <SheetTitle>전체 메뉴</SheetTitle>
                        </SheetHeader>
                        <nav aria-label="전체 메뉴" className="flex flex-col gap-1 px-4">
                            {NAV_LINKS.map((label) => (
                                <SheetClose asChild key={label}>
                                    <Link
                                        href="#"
                                        className="typo-body-l-medium hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                    >
                                        {label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                        <div className="border-border typo-body-l-regular mt-4 flex flex-col gap-1 border-t px-4 pt-4">
                            <SheetClose asChild>
                                <Link
                                    href="#"
                                    className="hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                >
                                    로그인/회원가입
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link
                                    href="#"
                                    className="hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                >
                                    이용안내
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link
                                    href="#"
                                    className="hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center gap-1 rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                >
                                    기술보증기금
                                    <ExternalLink aria-hidden="true" className="size-icon-xs" />
                                </Link>
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </>
)

// 실제 페이지 헤더 — 상단 sticky 풀블리드(banner 랜드마크). 안쪽은 max-w-content 로 폭 제한.
// z-10: Dialog/Popover 등 오버레이(z-50) 아래에 오도록 낮게 둔다. py-8 로 1920×105(hug) 목업의
// 헤더 높이를 재현한다(고정 h-[px] 대신 패딩+콘텐츠 높이로 자연스럽게 hug, ST-004 준수).
const SiteHeader = () => (
    <header className="border-border bg-card sticky top-0 z-10">
        <div className="max-w-content mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-8">
            <HeaderContent navLabel="주 메뉴" />
        </div>
    </header>
)

// 데모용 — 컴포넌트 가이드 카드 안에서 시연. 실제 헤더가 이미 banner 라 여긴 랜드마크가 아닌 div.
export const SiteHeaderDemo = () => (
    <div className="border-border bg-card flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border px-4 py-8">
        <HeaderContent navLabel="헤더 데모 메뉴" />
    </div>
)

export default SiteHeader
