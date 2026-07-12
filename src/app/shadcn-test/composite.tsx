'use client'

import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {Badge} from '@/components/kit/badge'
import {ToggleGroup, ToggleGroupItem} from '@/components/kit/toggle-group'
import {SiteHeaderDemo} from '@/components/site-header'

// ── 상태 칩(Badge) ──
// Figma 배지 반영본 — 상태 의미는 color(info/success/warning/error/neutral)로, 강조는 variant 로 정한다.
const STATUSES = [
    {label: '활성', color: 'success'},
    {label: '대기', color: 'warning'},
    {label: '정지', color: 'error'},
    {label: '신규', color: 'info'},
] as const

const StatusChips = () => (
    <div className="col-span-4 flex flex-col gap-4">
        <h2 className="typo-title-l-bold">상태 칩 (Badge)</h2>
        <p className="typo-caption-regular text-muted-foreground">
            상태·분류를 나타내는 작은 라벨. shadcn <code>Badge</code>.
        </p>
        <div className="flex flex-wrap items-center gap-2">
            {STATUSES.map((status) => (
                <Badge key={status.label} color={status.color}>
                    {status.label}
                </Badge>
            ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Badge color="info" variant="solid-pastel">
                solid-pastel
            </Badge>
            <Badge color="info" variant="outline">
                outline
            </Badge>
            <Badge color="info" variant="solid">
                solid
            </Badge>
        </div>
    </div>
)

// ── 세그먼티드 컨트롤 ──
// shadcn 에 전용 컴포넌트는 없고 ToggleGroup 의 segmented 변형(Figma 회색 트랙 + 흰 알약)으로 만든다.
const SegmentedControl = () => (
    <div className="col-span-4 flex flex-col gap-4">
        <h2 className="typo-title-l-bold">세그먼티드 컨트롤</h2>
        <p className="typo-caption-regular text-muted-foreground">
            ToggleGroup <code>variant=&quot;segmented&quot;</code> — 하나만 선택되는 모드 전환.
        </p>
        <ToggleGroup type="single" defaultValue="corp" variant="segmented" aria-label="회원 유형">
            <ToggleGroupItem value="corp" className="px-6">
                기업
            </ToggleGroupItem>
            <ToggleGroupItem value="org" className="px-6">
                기관
            </ToggleGroupItem>
            <ToggleGroupItem value="person" className="px-6">
                개인
            </ToggleGroupItem>
        </ToggleGroup>
    </div>
)

// ── 전역 헤더(Header) — 이 페이지 상단에 실제 sticky 헤더로도 쓰는 컴포넌트를 큐레이션 ──
const GlobalHeader = () => (
    <div className="col-span-full flex flex-col gap-4">
        <h2 className="typo-title-l-bold">전역 헤더 (Header)</h2>
        <p className="typo-caption-regular text-muted-foreground">
            로고 · 드롭다운 내비(NavigationMenu) · 세그먼티드 컨트롤 · 사용자 영역 조합. 이 페이지 상단에 실제{' '}
            <code>sticky</code> 헤더로도 적용돼 있습니다(같은 컴포넌트).
        </p>
        <SiteHeaderDemo />
    </div>
)

// ── Sticky 사이드메뉴(LNB) — 스크롤해도 따라오는 사이드 내비 ──
// "스크롤해도 따라가는 옆 메뉴" = LNB(Local Navigation Bar) / sticky sidebar. CSS position:sticky 로 구현.
const LNB_ITEMS = ['내 정보 확인', '진행현황 결과조회', 'K-BIGx 보고서 이력', '유료 서비스 관리', '1:1 문의 내역']

const StickySidebar = () => (
    <div className="col-span-full flex flex-col gap-4">
        <h2 className="typo-title-l-bold">Sticky 사이드메뉴 (LNB)</h2>
        <p className="typo-caption-regular text-muted-foreground">
            스크롤해도 따라오는 옆 메뉴 — CSS <code>position: sticky</code>. 흔히 <strong>LNB</strong>(Local Navigation
            Bar) 또는 sticky sidebar 라고 부릅니다. 아래 오른쪽 콘텐츠를 스크롤하면 왼쪽 메뉴가 상단에 고정됩니다.
        </p>
        <div className="flex flex-col gap-6 md:flex-row">
            {/* sticky LNB */}
            <nav
                aria-label="마이페이지"
                className="border-border bg-card h-fit w-full shrink-0 rounded-xl border p-4 md:sticky md:top-20 md:w-64"
            >
                <div className="border-border flex flex-col gap-1 border-b pb-4">
                    <span className="typo-body-l-bold">㈜케이탑테크놀로지</span>
                    <Badge color="info" className="w-fit">
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
    </div>
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
