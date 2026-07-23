import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {ChevronRight, type LucideIcon} from 'lucide-react'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// 스티키 사이드바(StickySidebar) — 마이페이지 좌측에 고정(sticky)되는 프로필 + 메뉴 + 고객센터 카드.
// Figma "Frame 2085664009" 반영. 스크롤해도 상단에 붙어 따라오는 사이드 내비게이션이다.
//
// 복합(compound) API — 이 프로젝트 표준(ReviewList·InfoBox 등)대로 컨테이너와 섹션 컴포넌트를 나눈다:
//   · StickySidebar         — 흰 카드(border·rounded-lg) + sticky 컨테이너
//   · StickySidebarProfile  — 아바타 + 기업명 + 회원 배지(가운데 정렬)
//   · StickySidebarNav      — 메뉴 <nav> 랜드마크
//   · StickySidebarNavItem  — 아이콘 + 라벨 링크. 현재 항목은 active(옅은 파랑 면 + chevron)
//   · StickySidebarContact  — 고객센터 전화·상담시간
//
// 색·타이포(Figma): 기업명 = title-l-bold(20)·foreground, 메뉴 = body-xl-medium(16)(활성 foreground /
// 비활성 label-foreground), 활성 면 = primary-subtle(blue.50), 강조색(아바타·배지·전화) = grape.600(#5a5fd2),
// 고객센터 = title-m-bold(18), 상담시간 = body-l-regular(14)·foreground-subtle. 전부 기존 토큰이라 커스텀 색이 없다([PB-04]).
// 규격(Figma): radius 16(rounded-lg), 패딩 px-6 py-10, 섹션 사이 gap-6, 프로필↔메뉴 gap-8, 메뉴 항목 h-14(56).

const StickySidebar = ({className, children, ...props}: ComponentPropsWithoutRef<'aside'>) => (
    <aside
        data-slot="sticky-sidebar"
        className={cn(
            'border-subtle-3 bg-card sticky top-6 flex w-full flex-col gap-6 rounded-lg border px-6 py-10',
            className,
        )}
        {...props}
    >
        {children}
    </aside>
)

// Figma 아바타 규격 48×48. next/image 는 레이아웃 시프트 방지를 위해 width/height 를 요구한다.
const AVATAR_SIZE = 48

type StickySidebarProfileProps = {
    // 기업/사용자 이름.
    name: ReactNode
    // 이름 아래 회원 배지(예: <Badge variant="outline" color="secondary-grape" shape="round" size="sm">기업회원</Badge>).
    badge?: ReactNode
    // 회사 로고 URL. API 가 내려주는(백엔드 경유 동일 출처) 로고 경로를 받는다. 값이 있으면 로고 이미지를,
    // 없으면(로고 미등록) grape 플레이스홀더를 렌더한다. 외부 도메인 직접 참조 시 next.config 의 images.remotePatterns 설정이 필요하다.
    logoSrc?: string
    // 로고 대체 텍스트. 기본은 빈 문자열(decorative) — 기업명이 바로 아래 텍스트로 제공되므로 로고는 장식이다([5.1.1]).
    logoAlt?: string
    // 아바타 전체를 직접 제어할 때의 슬롯. 지정하면 logoSrc 보다 우선한다.
    avatar?: ReactNode
} & ComponentPropsWithoutRef<'div'>

const StickySidebarProfile = ({
    name,
    badge,
    logoSrc,
    logoAlt = '',
    avatar,
    className,
    ...props
}: StickySidebarProfileProps) => (
    <div data-slot="sticky-sidebar-profile" className={cn('flex flex-col items-center gap-4', className)} {...props}>
        {avatar ??
            (logoSrc ? (
                // 로고 이미지의 경계가 흰 카드에 묻히지 않도록 회색 테두리로 영역을 명확히 한다.
                // border-subtle-1(gray.300)은 흰 배경과 약 3:1 이상 대비라 경계 구분 기준([5.3.5])을 만족한다.
                <Image
                    src={logoSrc}
                    alt={logoAlt}
                    width={AVATAR_SIZE}
                    height={AVATAR_SIZE}
                    className="bg-surface border-subtle-1 size-12 shrink-0 rounded-lg border object-cover"
                />
            ) : (
                // 로고 미등록 폴백 — 브랜드 grape 면([5.1.1] 정보 없는 장식이라 aria-hidden).
                <div aria-hidden="true" className="bg-grape-600 size-12 shrink-0 rounded-lg" />
            ))}
        <div className="flex flex-col items-center gap-1">
            <p className="typo-title-l-bold text-foreground text-center">{name}</p>
            {badge}
        </div>
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
        className={cn(
            'flex h-14 items-center gap-2 rounded-sm px-6',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            active ? 'bg-primary-subtle text-foreground' : 'text-label-foreground hover:bg-primary-subtle/50',
            className,
        )}
        {...props}
    >
        <ItemIcon aria-hidden="true" className="size-icon-md shrink-0" />
        <span className="typo-body-xl-medium flex-1 truncate">{children}</span>
        {active ? <ChevronRight aria-hidden="true" className="size-icon-md shrink-0" /> : null}
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
const StickySidebarContact = ({label = '고객센터', phone, hours, className, ...props}: StickySidebarContactProps) => (
    <div data-slot="sticky-sidebar-contact" className={cn('flex flex-col', className)} {...props}>
        <div className="flex items-center gap-2">
            <p className="typo-title-m-bold text-label-foreground">{label}</p>
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="typo-title-m-bold text-grape-600">
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
