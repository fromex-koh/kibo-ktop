import Image from 'next/image'
import Link from 'next/link'
import type {ComponentProps} from 'react'
import {ArrowUpRight} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn 에 Footer primitive 가 없어 Select·Separator·Link·Image 를 조합한
// 전 페이지 하단 contentinfo 합성 컴포넌트. 시안(type A_01)의 푸터 구조를 옮긴다.
// 색은 표준 시맨틱 토큰(bg-background·text-foreground·text-muted-foreground·border …)만 써서 페이지 테마를
// 그대로 따른다 — 메인페이지는 mainpage(다크) 스킨, 서브페이지는 light/dark 모드로 자동 반사된다([PB-06]).
// 로고만 어두운/밝은 표면에 맞춰 light 테마엔 컬러 로고, dark·mainpage 엔 화이트 로고로 교체한다.

type FooterLink = {label: string; href: string; external?: boolean}

type SitemapColumn = {title: string; href: string; external?: boolean; links: FooterLink[]}

// 사이트맵 — 헤더 주 메뉴와 같은 뎁스 구조. 이동 대상 확정 전이라 href 는 목업 값.
const SITEMAP: SitemapColumn[] = [
    {
        title: '플랫폼 소개',
        href: '#',
        links: [
            {label: '플랫폼 소개', href: '#'},
            {label: '기술평가', href: '#'},
            {label: '특허평가', href: '#'},
            {label: 'K-BIGx 보고서', href: '#'},
            {label: '탄소중립', href: '#'},
        ],
    },
    {
        title: '기술평가',
        href: '#',
        links: [
            {label: 'KTRS-FM', href: '#'},
            {label: 'Tech-Index', href: '#'},
            {label: '투자모형', href: '#'},
            {label: '평가결과 조회', href: '#'},
        ],
    },
    {
        title: '특허평가',
        href: '#',
        links: [{label: '특허 등급조회', href: '#'}],
    },
    {
        title: 'K-BIGx 보고서',
        href: '#',
        links: [
            {label: '기업혁신성장보고서 조회', href: '#'},
            {label: '보고서 이력 조회', href: '#'},
        ],
    },
    {
        title: '탄소중립',
        href: '#',
        external: true,
        links: [],
    },
]

// 하단 유틸 링크 — 개인정보처리방침은 시안에서 굵게 강조한다.
const UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항/FAQ', href: '#'},
]

const SUBPAGE_UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '플랫폼 소개', href: '#'},
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항', href: '#'},
]

// 관련사이트 목록 — 이동 대상 확정 전 목업 값.
const FAMILY_SITES = [
    {value: 'kibo', label: '기술보증기금'},
    {value: 'mss', label: '중소벤처기업부'},
    {value: 'smes', label: '중소벤처24'},
]

const CONTACT = {
    number: '1544-1120',
    hours: '평일 09시 ~ 18시',
    address: '48400 부산광역시 남구 문현금융로 33 기술보증기금',
    copyright: 'ⓒ The Government of the Republic of Korea. All rights reserved.',
}

// 포커스 링 — 프로젝트 공통 패턴(outline-none + focus-visible:outline-2/offset-2/solid)을 따른다.
// outline-solid 가 없으면 outline-none 이 남긴 --tw-outline-style:none 때문에 선이 그려지지 않는다. [KWCAG 6.1.2]
const linkFocusClassName =
    'outline-ring focus-visible:outline-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

export type FooterVariant = 'default' | 'subpage'

// default 는 사이트맵을 포함한 전체형, subpage 는 모형선택 화면의 간결한 정보형 푸터다.
// showSitemapOnMobile 은 default 에만 적용되며 md 미만에서 사이트맵을 감춘다.
type FooterProps = ComponentProps<'footer'> & {
    variant?: FooterVariant
    showSitemapOnMobile?: boolean
}

const Footer = ({variant = 'default', showSitemapOnMobile = true, className, ...props}: FooterProps) => (
    <footer
        {...props}
        className={cn(
            'text-foreground',
            variant === 'subpage' ? 'border-subtle-3 bg-card border-t' : 'bg-background',
            className,
        )}
        aria-label="사이트 정보"
    >
        {variant === 'subpage' ? (
            <div className="content-layout flex flex-col gap-16 pt-14 pb-10">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <Link href="#" className={cn('flex w-fit items-center', linkFocusClassName)}>
                            <Image
                                src="/images/logo-kibo.svg"
                                alt="기술보증기금"
                                width={240}
                                height={32}
                                className="[display:var(--logo-on-light)] h-auto w-45 md:w-60"
                            />
                            <Image
                                src="/images/logo-kibo-white.svg"
                                alt="기술보증기금"
                                width={240}
                                height={32}
                                className="[display:var(--logo-on-dark)] h-auto w-45 md:w-60"
                            />
                        </Link>
                        <nav aria-label="푸터 유틸 메뉴">
                            <ul className="flex flex-wrap items-center gap-6">
                                {SUBPAGE_UTILITY_LINKS.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                link.emphasized ? 'typo-body-xl-bold' : 'typo-body-xl-regular',
                                                linkFocusClassName,
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="flex flex-wrap items-baseline gap-4">
                                <span className="typo-title-m-bold">대표전화</span>
                                <a href={`tel:${CONTACT.number}`} className={cn('typo-h4-bold', linkFocusClassName)}>
                                    {CONTACT.number}
                                </a>
                            </p>
                            <p className="typo-body-xl-regular">평일 09:00 ~ 18:00 (토요일 및 공휴일 휴무)</p>
                        </div>
                        <p className="typo-body-xl-regular">{CONTACT.address}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className="typo-body-l-regular">{CONTACT.copyright}</p>
                    <Select>
                        <SelectTrigger aria-label="관련 사이트" className="w-47">
                            <SelectValue placeholder="관련사이트" />
                        </SelectTrigger>
                        <SelectContent>
                            {FAMILY_SITES.map((site) => (
                                <SelectItem key={site.value} value={site.value}>
                                    {site.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        ) : (
            <div className="content-layout flex flex-col gap-8 pt-12 pb-10 md:pt-15">
                {/* 시안 간격 — 상단 60px, 로고와 사이트맵 사이 80px, 구분선 위아래 32px, 하단 40px */}
                <div className="flex flex-col gap-10 md:gap-20">
                    {/* KIBO 로고(시안 240×32) — 두 장을 두고 --logo-on-*(globals.css) 로 배경 명도에 맞는 쪽만 표시한다.
                    dark: 변형은 중첩 고정한 테마 미리보기에서 틀린 쪽을 고른다 — Header 와 같은 방식. */}
                    <Link href="#" className={cn('flex w-fit items-center', linkFocusClassName)}>
                        <Image
                            src="/images/logo-kibo.svg"
                            alt="기술보증기금"
                            width={240}
                            height={32}
                            className="[display:var(--logo-on-light)] h-auto w-45 md:w-60"
                        />
                        <Image
                            src="/images/logo-kibo-white.svg"
                            alt="기술보증기금"
                            width={240}
                            height={32}
                            className="[display:var(--logo-on-dark)] h-auto w-45 md:w-60"
                        />
                    </Link>

                    <div className="flex flex-col gap-10 xl:flex-row xl:justify-between">
                        <nav
                            aria-label="사이트맵"
                            className={cn('flex flex-wrap gap-x-15 gap-y-8', !showSitemapOnMobile && 'max-md:hidden')}
                        >
                            {SITEMAP.map((column) => (
                                <div key={column.title} className="flex flex-col gap-6">
                                    <h2 className="typo-body-xl-bold">
                                        <Link
                                            href={column.href}
                                            className={cn('inline-flex items-center gap-1', linkFocusClassName)}
                                        >
                                            {column.title}
                                            {column.external && (
                                                <ArrowUpRight aria-hidden="true" className="size-icon-sm shrink-0" />
                                            )}
                                            {column.external && <span className="sr-only">새 창 열림</span>}
                                        </Link>
                                    </h2>
                                    {!!column.links.length && (
                                        <ul className="flex flex-col gap-4">
                                            {column.links.map((link) => (
                                                <li key={link.label}>
                                                    <Link
                                                        href={link.href}
                                                        className={cn(
                                                            'typo-body-l-medium text-muted-foreground hover:text-foreground',
                                                            linkFocusClassName,
                                                        )}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="flex flex-col gap-5">
                            <h2 className="typo-body-xl-bold">대표전화</h2>
                            <div className="flex flex-col gap-1">
                                <p className="typo-h1-bold">
                                    <a
                                        href={`tel:${CONTACT.number}`}
                                        className={cn('inline-block', linkFocusClassName)}
                                    >
                                        {CONTACT.number}
                                    </a>
                                </p>
                                <p className="typo-body-l-regular text-muted-foreground">{CONTACT.hours}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-5">
                    <nav aria-label="이용 정보">
                        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            {UTILITY_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            link.emphasized ? 'typo-body-xl-bold' : 'typo-body-xl-regular',
                                            linkFocusClassName,
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="typo-body-l-regular flex flex-col">
                            <p>{CONTACT.address}</p>
                            <p>{CONTACT.copyright}</p>
                        </div>

                        {/* 관련 사이트 — 가이드의 Select 를 그대로 쓴다. 색은 Select 기본 시맨틱 토큰이 페이지 테마를
                        따르므로 별도 색 오버라이드 없이 폭(layout)만 지정한다. */}
                        <Select>
                            <SelectTrigger aria-label="관련 사이트" className="w-full md:max-w-70">
                                <SelectValue placeholder="관련사이트" />
                            </SelectTrigger>
                            <SelectContent>
                                {FAMILY_SITES.map((site) => (
                                    <SelectItem key={site.value} value={site.value}>
                                        {site.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        )}
    </footer>
)

// 가이드 프리뷰 — 실제 Footer를 카드 안에서 테마별로 확인한다.
export const FooterDemo = ({variant = 'default'}: {variant?: FooterVariant}) => (
    <div className="border-border overflow-hidden rounded-lg border">
        <Footer variant={variant} />
    </div>
)

export default Footer
