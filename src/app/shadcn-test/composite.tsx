'use client'

import Link from 'next/link'
import {Blocks, ChevronRight, User} from 'lucide-react'
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
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'

// grid-layout 안의 카드 셀. col-span 은 사용처에서 준다.
const CARD = 'bg-card border-border flex flex-col gap-4 rounded-xl border p-6'

// ── 상태 칩(Badge) ──
// 상태색 — shadcn 표준 슬롯엔 success/warning/info 가 없어(역할 슬롯만) 프로젝트 팔레트 키를 쓴다(PB-05 보조).
const STATUSES = [
    {label: '활성', className: 'bg-success-100 text-success-700'},
    {label: '대기', className: 'bg-warning-100 text-warning-700'},
    {label: '정지', className: 'bg-error-100 text-error-700'},
    {label: '신규', className: 'bg-info-100 text-info-700'},
] as const

const StatusChips = () => (
    <section className={`${CARD} col-span-4`}>
        <h2 className="typo-title-l-bold">상태 칩 (Badge)</h2>
        <p className="typo-caption-regular text-muted-foreground">
            상태·분류를 나타내는 작은 라벨. shadcn <code>Badge</code>.
        </p>
        <div className="flex flex-wrap items-center gap-2">
            {STATUSES.map((status) => (
                <Badge key={status.label} className={status.className}>
                    {status.label}
                </Badge>
            ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Badge>기본</Badge>
            <Badge variant="secondary">보조</Badge>
            <Badge variant="destructive">위험</Badge>
            <Badge variant="outline">아웃라인</Badge>
        </div>
    </section>
)

// ── 세그먼티드 컨트롤 ──
// shadcn 에 전용 컴포넌트는 없고 ToggleGroup(type=single, spacing=0)로 만든다 — 인접 세그먼트가
// 이어붙어 세그먼티드 컨트롤이 된다. 선택 세그먼트만 채움(bg-primary)으로 강조.
const SEGMENT_ON = 'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-6'

const SegmentedControl = () => (
    <section className={`${CARD} col-span-4`}>
        <h2 className="typo-title-l-bold">세그먼티드 컨트롤</h2>
        <p className="typo-caption-regular text-muted-foreground">
            ToggleGroup <code>type=&quot;single&quot;</code> + <code>spacing=0</code> — 하나만 선택되는 모드 전환.
        </p>
        <ToggleGroup type="single" defaultValue="corp" spacing={0} variant="outline" aria-label="회원 유형">
            <ToggleGroupItem value="corp" className={SEGMENT_ON}>
                기업
            </ToggleGroupItem>
            <ToggleGroupItem value="org" className={SEGMENT_ON}>
                기관
            </ToggleGroupItem>
            <ToggleGroupItem value="person" className={SEGMENT_ON}>
                개인
            </ToggleGroupItem>
        </ToggleGroup>
    </section>
)

// ── 전역 헤더(Header) — 로고 + 드롭다운 내비 + 세그먼티드 + 사용자 영역 ──
// 헤더 메뉴 드롭다운은 NavigationMenu(viewport=false → 각 항목 바로 아래로 펼침).
const PLATFORM_LINKS = [
    '오픈 플랫폼 소개',
    'KTRS-FM 소개',
    'Tech-Index 소개',
    '투자모형 소개',
    'K-BIGx 소개',
    '탄소중립 소개',
]
const DIAGNOSIS_LINKS = ['자가진단 신청', '평가모형 선택', '진단 결과 조회']

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

const GlobalHeader = () => (
    <section className={`${CARD} col-span-full`}>
        <h2 className="typo-title-l-bold">전역 헤더 (Header)</h2>
        <p className="typo-caption-regular text-muted-foreground">
            로고 · 드롭다운 내비(NavigationMenu) · 세그먼티드 컨트롤 · 사용자 영역을 조합한 헤더. 실제로는 상단에{' '}
            <code>sticky top-0</code> 로 고정합니다.
        </p>
        <header className="border-border bg-background flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border px-4 py-3">
            {/* 로고 */}
            <Link href="#" className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                    <Blocks aria-hidden="true" className="size-icon-sm" />
                </span>
                <span className="typo-body-l-bold">K-TOP</span>
                <span className="typo-caption-regular text-muted-foreground wide:inline hidden">
                    기술평가 통합 플랫폼
                </span>
            </Link>

            {/* 드롭다운 내비 */}
            <NavigationMenu viewport={false} className="wide:flex hidden">
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
            </div>
        </header>
    </section>
)

// ── Sticky 사이드메뉴(LNB) — 스크롤해도 따라오는 사이드 내비 ──
// "스크롤해도 따라가는 옆 메뉴" = LNB(Local Navigation Bar) / sticky sidebar. CSS position:sticky 로 구현.
const LNB_ITEMS = ['내 정보 확인', '진행현황 결과조회', 'K-BIGx 보고서 이력', '유료 서비스 관리', '1:1 문의 내역']

const StickySidebar = () => (
    <section className={`${CARD} col-span-full`}>
        <h2 className="typo-title-l-bold">Sticky 사이드메뉴 (LNB)</h2>
        <p className="typo-caption-regular text-muted-foreground">
            스크롤해도 따라오는 옆 메뉴 — CSS <code>position: sticky</code>. 흔히 <strong>LNB</strong>(Local Navigation
            Bar) 또는 sticky sidebar 라고 부릅니다. 아래 오른쪽 콘텐츠를 스크롤하면 왼쪽 메뉴가 상단에 고정됩니다.
        </p>
        <div className="wide:flex-row flex flex-col gap-6">
            {/* sticky LNB */}
            <nav
                aria-label="마이페이지"
                className="border-border bg-card wide:sticky wide:top-20 wide:w-64 h-fit w-full shrink-0 rounded-xl border p-4"
            >
                <div className="border-border flex flex-col gap-1 border-b pb-4">
                    <span className="typo-body-l-bold">㈜케이탑테크놀로지</span>
                    <Badge variant="secondary" className="w-fit">
                        기업회원
                    </Badge>
                </div>
                <ul className="flex flex-col gap-0.5 py-3">
                    {LNB_ITEMS.map((item, index) => (
                        <li key={item}>
                            <Link
                                href="#"
                                aria-current={index === 1 ? 'page' : undefined}
                                className={`typo-body-l-regular hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center justify-between rounded-md px-3 focus:outline-none focus-visible:ring-2 ${
                                    index === 1 ? 'bg-primary text-primary-foreground font-semibold' : ''
                                }`}
                            >
                                {item}
                                <ChevronRight aria-hidden="true" className="size-icon-sm shrink-0" />
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="border-border flex flex-col gap-0.5 border-t pt-4">
                    <span className="typo-body-l-bold">1577-0000</span>
                    <span className="typo-caption-regular text-muted-foreground">평일 09:00 – 18:00</span>
                </div>
            </nav>

            {/* 스크롤 확인용 더미 콘텐츠 */}
            <div className="flex flex-1 flex-col gap-4">
                {Array.from({length: 6}).map((_, index) => (
                    <div
                        key={index}
                        className="border-border bg-background flex min-h-40 items-center justify-center rounded-xl border"
                    >
                        <span className="typo-caption-regular text-muted-foreground">본문 콘텐츠 블록 {index + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const Composite = () => (
    <>
        <StatusChips />
        <SegmentedControl />
        <GlobalHeader />
        <StickySidebar />
    </>
)

export default Composite
