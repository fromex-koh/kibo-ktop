import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import Link from 'next/link'
import {ChevronRight, type LucideIcon} from 'lucide-react'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// 스티키 사이드바(StickySidebar) — 마이페이지 좌측에 고정(sticky)되는 프로필 + 메뉴 카드.
// Figma 마이페이지 "LNB"(40006629:24978) 반영. 스크롤해도 상단에 붙어 따라오는 사이드 내비게이션이다.
//
// 복합(compound) API — 이 프로젝트 표준(ReviewList·InfoBox 등)대로 컨테이너와 섹션 컴포넌트를 나눈다:
//   · StickySidebar         — 흰 카드(border·rounded-lg) + sticky 컨테이너
//   · StickySidebarProfile  — 회원 배지 + 기업명(좌측 정렬, 배지가 위)
//   · StickySidebarNav      — 메뉴 <nav> 랜드마크
//   · StickySidebarNavItem  — 아이콘 + 라벨 링크. 현재 항목은 active(옅은 파랑 면 + chevron)
//   · StickySidebarContact  — 고객센터 전화·상담시간 (최신 LNB 시안에는 없는 선택 섹션)
//
// 색·타이포(Figma): 기업명 = title-l-bold(20)·foreground, 메뉴 = body-xl-medium(16)(활성 foreground /
// 비활성 label-foreground), 활성 면 = primary-subtle(blue.50), 배지 강조색 = purple.600(#5a5fd2).
// 전부 기존 토큰이라 커스텀 색이 없다([PB-04]).
// 규격(Figma): 카드 폭 344(w-86 — 사용처 레이아웃에서 지정), radius 16(rounded-lg), 패딩 px-6 py-10,
// 프로필↔메뉴 gap-8(32), 배지↔기업명 gap-1(4), 메뉴 항목 min-h-14(한 줄 56, 긴 라벨은 줄바꿈)·
// rounded-sm(8)·px-6, 아이콘 20·아이콘↔라벨 gap-2(8).

const StickySidebar = ({className, children, ...props}: ComponentPropsWithoutRef<'aside'>) => (
    <aside
        data-slot="sticky-sidebar"
        className={cn(
            'border-subtle-3 bg-card sticky top-6 flex w-full flex-col gap-8 rounded-lg border px-6 py-10',
            className,
        )}
        {...props}
    >
        {children}
    </aside>
)

type StickySidebarProfileProps = {
    // 기업/사용자 이름.
    name: ReactNode
    // 이름 위 회원 배지(예: <Badge variant="outline" color="secondary-purple" shape="round" size="sm">기업회원</Badge>).
    badge?: ReactNode
} & ComponentPropsWithoutRef<'div'>

// 시안은 배지를 기업명 위에 두고 왼쪽 맞춤이다. DOM 순서도 시각 순서(배지 → 이름)를 따른다([7.3.1]).
const StickySidebarProfile = ({name, badge, className, ...props}: StickySidebarProfileProps) => (
    <div data-slot="sticky-sidebar-profile" className={cn('flex flex-col items-start gap-1', className)} {...props}>
        {badge}
        <p className="typo-title-l-bold text-foreground">{name}</p>
    </div>
)

const StickySidebarNav = ({className, children, ...props}: ComponentPropsWithoutRef<'nav'>) => (
    <nav data-slot="sticky-sidebar-nav" className={cn('flex flex-col', className)} {...props}>
        {children}
    </nav>
)

// 구분선 — 카드 테두리와 같은 옅은 회색(gray.100). shadcn Separator 기본색(border, gray.700)은 카드 안에서
// 너무 진하므로 subtle-3 로 재지정한다.
const StickySidebarDivider = ({className, ...props}: ComponentPropsWithoutRef<typeof Separator>) => (
    <Separator className={cn('bg-subtle-3', className)} {...props} />
)

type StickySidebarNavItemProps = {
    // 항목 아이콘(lucide). 20px(size-icon-md)로 렌더한다.
    icon: LucideIcon
    // 이동 경로.
    href: string
    // 현재 위치 여부. 옅은 파랑 면 + 우측 chevron 으로 강조하고 aria-current="page"를 준다.
    active?: boolean
    children: ReactNode
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>

const StickySidebarNavItem = ({
    icon: ItemIcon,
    href,
    active = false,
    className,
    children,
    ...props
}: StickySidebarNavItemProps) => (
    <Link
        data-slot="sticky-sidebar-nav-item"
        href={href}
        aria-current={active ? 'page' : undefined}
        // min-h-14 + py-4 — 라벨 한 줄(행간 24)일 때 시안 높이 56 이 나오고, 길면 자르지 않고 줄바꿈해
        // 항목이 늘어난다. 줄바꿈은 break-keep 으로 한국어 단어 중간에서 쪼개지지 않게 한다.
        // hover(키보드 포커스 포함)는 active 와 같은 면·chevron 을 보여 준다 — 시각 상태만 빌리고
        // aria-current 는 실제 현재 위치에만 남는다.
        className={cn(
            'group/sidebar-item flex min-h-14 items-center gap-2 rounded-sm px-6 py-4',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            active
                ? 'bg-primary-subtle text-foreground'
                : 'text-label-foreground hover:bg-primary-subtle focus-visible:bg-primary-subtle',
            className,
        )}
        {...props}
    >
        <ItemIcon aria-hidden="true" className="size-icon-md shrink-0" />
        <span className="typo-body-xl-medium flex-1 break-keep">{children}</span>
        {/* chevron 자리는 항상 잡아 둔다(시안도 비활성 항목에 빈 20px 슬롯) — hover 때 라벨이 밀리지 않는다. */}
        <ChevronRight
            aria-hidden="true"
            className={cn(
                'size-icon-md shrink-0',
                !active && 'invisible group-hover/sidebar-item:visible group-focus-visible/sidebar-item:visible',
            )}
        />
    </Link>
)

type StickySidebarContactProps = {
    // 고객센터 라벨(기본 "고객센터").
    label?: ReactNode
    // 전화번호(tel 링크로 렌더).
    phone: string
    // 상담시간 등 보조 안내.
    hours?: ReactNode
} & ComponentPropsWithoutRef<'div'>

// tel: 링크는 전화 앱을 여는 외부 스킴이라 next/link 가 아닌 <a> 를 쓴다([NA-006] 예외).
// 최신 LNB 시안(40006629)에는 고객센터 섹션이 없다 — 고객센터가 있는 화면에서만 Divider 와 함께 조합한다.
const StickySidebarContact = ({label = '고객센터', phone, hours, className, ...props}: StickySidebarContactProps) => (
    <div data-slot="sticky-sidebar-contact" className={cn('flex flex-col', className)} {...props}>
        <div className="flex items-center gap-2">
            <p className="typo-title-m-bold text-label-foreground">{label}</p>
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="typo-title-m-bold text-purple-600">
                {phone}
            </a>
        </div>
        {hours != null ? <p className="typo-body-l-regular text-foreground-subtle">{hours}</p> : null}
    </div>
)

export {
    StickySidebar,
    StickySidebarProfile,
    StickySidebarNav,
    StickySidebarNavItem,
    StickySidebarDivider,
    StickySidebarContact,
}
export type {StickySidebarProfileProps, StickySidebarNavItemProps, StickySidebarContactProps}
