'use client'

import {useState, useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode} from 'react'
import type {LucideIcon} from 'lucide-react'
import {
    BriefcaseBusiness,
    ChevronDown,
    CreditCard,
    FileSearch,
    FolderSearch,
    MessageCircleMore,
    NotepadText,
    User,
    UserSearch,
} from 'lucide-react'
// 폭 임계값은 FormTabs 가 쓰는 것과 같은 값이다(md·xl). 토큰과 어긋나면 yarn tokens 가 빌드를 세우는데
// 그 검사가 form-tabs.tsx 를 보므로, 같은 상수를 가져다 써서 기준을 한 곳에만 둔다.
import {FORM_TABS_MOBILE_QUERY, FORM_TABS_QUERY} from '@/components/composite/form-tabs'
import {UserTypeBadge} from '@/components/composite/header'
import {
    StickySidebar,
    StickySidebarNav,
    StickySidebarNavItem,
    StickySidebarProfile,
} from '@/components/composite/sticky-sidebar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'

// 마이페이지 좌측 LNB(기업 · 기관) — 마이페이지의 모든 화면이 이 사이드바 하나를 쓴다.
// 카드 · 항목 모양은 StickySidebar(sticky-sidebar.tsx)가 갖고, 여기는 메뉴 목록과 화면 폭별 배치만 갖는다.
//
// 쓰는 법: <MypageSidebar userType="corp" current="내 정보" companyName={…} />
//   · current 는 MYPAGE_MENU 의 label 과 글자가 같아야 그 항목이 활성으로 보인다.
//
// 화면 폭에 따라 세 가지로 그린다 — 기업·기술정보 입력(FormTabs)의 탭이 좁은 화면에서 [현재 항목 줄 +
// 목록 열기]로 바뀌는 것과 같은 방식이다. 메뉴 여섯 칸이 세로로 서 있으면 좁은 화면에서 본문보다
// 사이드바가 더 길어진다.
//   xl 이상  — 본문 옆에 붙어 따라오는 사이드바 카드(시안)
//   md~xl   — 콘텐츠 열 안의 카드. 지금 메뉴 한 줄만 두고 누르면 아래로 목록이 열린다(고정하지 않음)
//   md 미만 — 같은 줄을 화면 폭으로 넓혀 헤더 아래에 고정한다

// 메뉴 — 아이콘 · 라벨 · 경로는 IA 그대로다. 기업과 기관이 다르다.
// 아이콘은 컴포넌트(함수)라 서버에서 넘길 수 없어 목록을 이 파일에 두고, 화면은 userType 만 넘긴다.
//
// [프론트엔드 연동]
//   · 메뉴를 더하거나 바꿀 때는 이 목록만 고친다 — 모든 마이페이지 화면에 함께 반영된다.
//   · 경로는 실제 page 가 있어야 한다(경로가 타입으로 검사된다). 아직 없는 화면은 '#' 으로 둔다.
//   · 기관 [내 정보] 경로는 회원 유형마다 다르다 — 로그인한 유형의 화면 경로로 바꿔 넣는다.
type MypageMenuItem = {icon: LucideIcon; label: string; href: string}

const MYPAGE_MENU: Record<'corp' | 'org', readonly MypageMenuItem[]> = {
    corp: [
        {icon: User, label: '내 정보', href: '/corp/mypage/profile'},
        {icon: BriefcaseBusiness, label: '대표자 이력', href: '/corp/mypage/representative-history'},
        {icon: FileSearch, label: '평가결과 조회', href: '/corp/mypage/evaluation-results'},
        {icon: NotepadText, label: 'K-BIGx 보고서 이력', href: '/corp/mypage/k-bigx-report-history'},
        {icon: CreditCard, label: '유료 서비스 관리', href: '/corp/mypage/paid-services/payment-history'},
        {icon: MessageCircleMore, label: '1:1 문의', href: '/corp/mypage/inquiry-history'},
    ],
    org: [
        // 기관 [내 정보] — 지금은 협약기관 화면. 회원 유형별 경로는 위 [프론트엔드 연동] 참고.
        {icon: User, label: '내 정보', href: '/org/mypage/profile-edit/partner-agency'},
        {icon: FileSearch, label: '평가결과 조회', href: '/org/mypage/evaluation-history'},
        {icon: FolderSearch, label: '평가검증 신청 조회', href: '/org/mypage/verification-application'},
        {icon: NotepadText, label: 'K-BIGx 보고서 이력', href: '/org/mypage/k-bigx-report-history'},
        {icon: UserSearch, label: '하위계정 현황', href: '/org/mypage/sub-account-progress'},
        {icon: MessageCircleMore, label: '1:1 문의', href: '/org/mypage/inquiry-history'},
    ],
}

const subscribeToQueries = (onStoreChange: () => void) => {
    const queries = [window.matchMedia(FORM_TABS_QUERY), window.matchMedia(FORM_TABS_MOBILE_QUERY)]
    queries.forEach((query) => query.addEventListener('change', onStoreChange))

    return () => queries.forEach((query) => query.removeEventListener('change', onStoreChange))
}

const getLayout = () => {
    if (window.matchMedia(FORM_TABS_QUERY).matches) return 'sidebar'

    return window.matchMedia(FORM_TABS_MOBILE_QUERY).matches ? 'mobile' : 'tablet'
}

// 서버 렌더는 모바일 퍼스트다[PB-14]. 하이드레이션 직후 실제 화면 폭으로 한 번 더 렌더된다.
const useMypageSidebarLayout = () => useSyncExternalStore(subscribeToQueries, getLayout, () => 'mobile' as const)

// 회원 배지 + 기업명 — 세 형태가 모두 같은 묶음을 쓴다.
// 배지는 헤더가 쓰는 유형 배지 그대로다 — 글자(기업·기관)와 색이 한 곳에서만 정해진다.
const MypageProfile = ({userType, companyName}: {userType: 'corp' | 'org'; companyName: ReactNode}) => (
    <StickySidebarProfile name={companyName} badge={<UserTypeBadge userType={userType} />} />
)

type MypageSidebarProps = {
    // 어느 쪽 마이페이지인지 — 메뉴 목록이 갈린다.
    userType: 'corp' | 'org'
    // 지금 보고 있는 화면의 메뉴 라벨 — 그 항목이 활성으로 표시된다.
    current: string
    // 기업명. [프론트엔드 연동] 회원정보 응답의 기업명을 넣는다.
    companyName: ReactNode
} & Omit<ComponentPropsWithoutRef<typeof StickySidebar>, 'children'>

const MypageSidebar = ({userType, current, companyName, className, ...props}: MypageSidebarProps) => {
    const menu = MYPAGE_MENU[userType]
    const layout = useMypageSidebarLayout()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const currentItem = menu.find((item) => item.label === current) ?? menu[0]

    if (layout !== 'sidebar') {
        // 모바일과 태블릿은 같은 트리를 쓰고 감싸는 상자만 다르다 — md(768)를 넘나들어도(회전) 다시
        // 그려지며 열려 있던 목록이 닫히는 정도로 끝난다.
        const isMobile = layout === 'mobile'
        const CurrentIcon = currentItem.icon

        return (
            // 목록은 화면을 덮는 모달이 아니라 눌린 줄에 붙는 드롭다운이다 — 지금 어디를 눌러 열었는지가
            // 화면에 남는다. 열고 닫기·Esc·바깥 클릭·포커스 복귀는 Popover(Radix)가 맡는다[8.2.1].
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <div
                    className={cn(
                        'flex flex-col',
                        isMobile
                            ? // 화면 폭을 가득 채우므로 페이지 좌우 여백만큼 밖으로 넓혔다가 안쪽에서 되돌린다.
                              // top-14 는 모바일 사이트 헤더 높이(56)다 — 헤더가 sticky top-0 이라 그 아래에 붙는다.
                              // z-sticky 는 헤더(z-header)보다 낮아 헤더 위로 올라오지 않는다[CD-002].
                              'bg-background z-sticky sticky top-14 -mx-(--ds-grid-margin) gap-2 px-(--ds-grid-margin) pt-2 pb-4'
                            : 'bg-card gap-4 rounded-lg px-6 py-6',
                        className,
                    )}
                >
                    <MypageProfile userType={userType} companyName={companyName} />
                    <PopoverTrigger
                        className={cn(
                            'border-control bg-surface text-foreground flex min-h-14 items-center gap-2 rounded-sm border px-6 py-4',
                            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                        )}
                    >
                        <CurrentIcon aria-hidden="true" className="size-icon-md shrink-0" />
                        <span className="typo-body-xl-medium flex-1 text-left break-keep">{currentItem.label}</span>
                        <ChevronDown aria-hidden="true" className="size-icon-md shrink-0" />
                    </PopoverTrigger>
                </div>
                <PopoverContent
                    align="start"
                    sideOffset={4}
                    aria-label="마이페이지 메뉴"
                    // 폭은 눌린 줄과 같게 맞춘다 — Radix 가 알려주는 트리거 폭을 그대로 쓴다.
                    // 순정 PopoverContent 의 고정 폭·라운드·여백·그림자를 사이드바 목록과 같은 값으로 덮는다.
                    className="z-sticky border-control bg-card w-(--radix-popover-trigger-width) gap-0 rounded-sm border p-2 shadow-none ring-0"
                >
                    <StickySidebarNav aria-label="마이페이지 메뉴">
                        {menu.map(({icon, label, href}) => (
                            <StickySidebarNavItem
                                key={label}
                                icon={icon}
                                href={href}
                                active={label === current}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {label}
                            </StickySidebarNavItem>
                        ))}
                    </StickySidebarNav>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        // 시안 카드 폭 344 = w-86.
        // self-start — 본문 옆에 나란히 둘 때 flex 가 카드를 본문 높이만큼 늘려 버리면 메뉴 아래가 빈 채로
        // 길어지고, 늘어난 요소는 자리가 고정돼 sticky 도 따라오지 않는다. 카드는 제 내용 높이만 갖는다.
        // top-34 — 헤더(xl 에서 112)가 sticky top-0 이라 그 아래 24 를 띄운다. 컴포넌트 기본값(top-6)으로
        // 두면 카드 윗부분이 헤더에 가린다.
        <StickySidebar className={cn('top-34 w-86 self-start', className)} {...props}>
            <MypageProfile userType={userType} companyName={companyName} />
            <StickySidebarNav aria-label="마이페이지 메뉴">
                {menu.map(({icon, label, href}) => (
                    <StickySidebarNavItem key={label} icon={icon} href={href} active={label === current}>
                        {label}
                    </StickySidebarNavItem>
                ))}
            </StickySidebarNav>
        </StickySidebar>
    )
}

export {MypageSidebar}
