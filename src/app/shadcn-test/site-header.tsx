'use client'

import Link from 'next/link'
import {Blocks, User} from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import {Button} from '@/components/ui/button'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'

// 헤더 드롭다운 항목(데모 데이터). 실제로는 라우트로 연결한다.
const PLATFORM_LINKS = [
    '오픈 플랫폼 소개',
    'KTRS-FM 소개',
    'Tech-Index 소개',
    '투자모형 소개',
    'K-BIGx 소개',
    '탄소중립 소개',
]
const DIAGNOSIS_LINKS = ['자가진단 신청', '평가모형 선택', '진단 결과 조회']

// 세그먼티드 컨트롤의 선택 세그먼트 강조(채움).
const SEGMENT_ON = 'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'

const HeaderMenuContent = ({links}: {links: readonly string[]}) => (
    <NavigationMenuContent>
        <ul className="flex w-56 flex-col gap-0.5">
            {links.map((link) => (
                <li key={link}>
                    <NavigationMenuLink asChild>
                        <Link href="#" className="typo-body-l-regular">
                            {link}
                        </Link>
                    </NavigationMenuLink>
                </li>
            ))}
        </ul>
    </NavigationMenuContent>
)

// 헤더 내부 콘텐츠(로고 · 드롭다운 내비 · 세그먼티드 · 사용자 영역) — 실제 헤더와 데모 카드가 공유한다.
// navLabel: 페이지에 내비가 여럿 있으므로(LNB·브레드크럼 등) 각 NavigationMenu 를 구분할 aria-label.
const HeaderContent = ({navLabel}: {navLabel: string}) => (
    <>
        {/* 로고 */}
        <Link href="#" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <Blocks aria-hidden="true" className="size-icon-sm" />
            </span>
            <span className="typo-body-l-bold">K-TOP</span>
            <span className="typo-caption-regular text-muted-foreground wide:inline hidden">기술평가 통합 플랫폼</span>
        </Link>

        {/* 드롭다운 내비 */}
        <NavigationMenu aria-label={navLabel} viewport={false} className="wide:flex hidden">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>플랫폼 소개</NavigationMenuTrigger>
                    <HeaderMenuContent links={PLATFORM_LINKS} />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>자가진단</NavigationMenuTrigger>
                    <HeaderMenuContent links={DIAGNOSIS_LINKS} />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="typo-body-l-medium">
                        <Link href="#">특허평가</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        {/* 우측 — 세그먼티드 + 사용자 */}
        <div className="ml-auto flex items-center gap-3">
            <ToggleGroup type="single" defaultValue="corp" spacing={0} variant="outline" aria-label="회원 유형">
                <ToggleGroupItem value="corp" size="sm" className={SEGMENT_ON}>
                    기업
                </ToggleGroupItem>
                <ToggleGroupItem value="org" size="sm" className={SEGMENT_ON}>
                    기관
                </ToggleGroupItem>
            </ToggleGroup>
            <span className="typo-body-l-medium wide:flex hidden items-center gap-1.5">
                <User aria-hidden="true" className="size-icon-sm" />
                홍길동 님
            </span>
            <Button variant="ghost" size="sm">
                로그인
            </Button>
            <Button size="sm">회원가입</Button>
            <ThemeToggle />
        </div>
    </>
)

// 실제 페이지 헤더 — 상단 sticky 풀블리드(banner 랜드마크). 안쪽은 max-w-content 로 폭 제한.
// z-10: Dialog/Popover 등 오버레이(z-50) 아래에 오도록 낮게 둔다.
const SiteHeader = () => (
    <header className="border-border bg-background sticky top-0 z-10 border-b">
        <div className="max-w-content mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
            <HeaderContent navLabel="주 메뉴" />
        </div>
    </header>
)

// 데모용 — 컴포넌트 가이드 카드 안에서 시연. 실제 헤더가 이미 banner 라 여긴 랜드마크가 아닌 div.
export const SiteHeaderDemo = () => (
    <div className="border-border bg-background flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border px-4 py-3">
        <HeaderContent navLabel="헤더 데모 메뉴" />
    </div>
)

export default SiteHeader
